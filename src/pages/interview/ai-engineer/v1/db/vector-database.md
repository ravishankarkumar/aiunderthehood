---
title: Vector Databases — Interview Guide
description: What interviewers actually ask about vector databases, how to frame your answers, and the mental models that matter.
pubDatetime: 2022-09-25T15:20:35Z
modDatetime: 2026-03-30T00:00:00.000Z
layout: ../../../../../layouts/DocsLayout.astro
---

Vector database questions became a core part of system design interviews at top tech companies from 2024 onward. This guide covers what interviewers actually ask, how to structure your answers, and the mental models that separate strong candidates from weak ones.

For deep technical content, the full series lives in the AI Engineering guide:
- [How Vector Search Works](/engineering/vector-databases/how-vector-search-works) — embeddings, ANN, index families
- [HNSW and IVF-PQ](/engineering/vector-databases/hnsw-and-ivf-pq) — the two dominant algorithms
- [Storage and Ingestion](/engineering/vector-databases/vector-db-storage-and-ingestion) — segments, WAL, compaction
- [Scaling and Filtering](/engineering/vector-databases/scaling-vector-search) — distributed architecture, metadata filtering

---

## What Interviewers Are Testing

Vector DB questions test three things:

1. **Do you understand why ANN exists?** — Can you explain the curse of dimensionality and why exact search doesn't scale?
2. **Do you know the tradeoffs?** — HNSW vs IVF-PQ, pre-filter vs post-filter, consistency vs availability
3. **Can you reason about system design?** — Given a scale requirement, what architecture would you choose and why?

They are not testing whether you've memorized HNSW pseudocode. They want to see that you can reason from first principles.

---

## The Questions and How to Answer Them

### "Explain how HNSW works."

**Weak answer**: "It's a graph-based index with multiple layers."

**Strong answer**: Start with the problem — greedy search on a flat proximity graph gets stuck in local optima. HNSW solves this with a hierarchy: upper layers have sparse long-range connections (for fast navigation), lower layers have dense local connections (for precise search). Insertion assigns each vector a random layer via exponential distribution, then connects it to its M nearest neighbors at each layer. Search starts at the top, greedily descends, and does beam search at the bottom layer. Complexity is O(log N). The key parameters are M (graph density), efConstruction (build quality), and efSearch (query recall-latency tradeoff).

Then mention the weaknesses: memory-heavy, slow inserts due to graph rewiring, lazy deletion.

### "When would you choose IVF-PQ over HNSW?"

The answer is about scale and ingestion rate:
- HNSW is better for < 100M vectors with moderate write rates
- IVF-PQ is better for > 100M vectors, memory-constrained environments, or high-throughput ingestion (HNSW inserts are too slow)
- PQ compresses vectors 10–400x using learned subspace codebooks, enabling billion-scale search on a single machine

### "How do you combine vector search with metadata filters?"

This is the hardest question and the one most candidates fumble. There are three approaches:

**Post-filtering**: ANN first, filter after. Simple but loses recall when filters are selective (< 10% match rate).

**Pre-filtering**: Filter first, brute-force ANN on the subset. Works when the filtered set is small (< 50K vectors), degrades otherwise.

**Hybrid index**: Maintain an inverted index for metadata alongside the vector index. During HNSW traversal, skip nodes that don't pass the filter. This is what Weaviate does. Best general solution but complex to implement.

The right answer depends on filter selectivity — mention that production systems choose the strategy dynamically based on estimated selectivity.

### "How does a vector database scale horizontally?"

Coordinator + shard architecture. Coordinator receives the query, fans out to all shards in parallel, each shard returns its local top-K, coordinator merges into global top-K. Key insight: you must oversample per shard (ask for K × factor) because the global top-K may not be the local top-K on any single shard.

Mention the tail latency problem: query latency is bounded by the slowest shard, so more shards = worse P99 latency. Minimize shard count.

### "Why are inserts slow in HNSW?"

Each insertion requires finding the M nearest neighbors in the existing graph — which is itself an ANN search. Then bidirectional edges must be added, potentially rewiring existing connections. At high insert rates, this becomes a bottleneck. Production systems solve this with segment buffering: new writes go to an in-memory buffer (no indexing), which is periodically sealed and indexed in the background.

### "How do vector databases persist data?"

Segment-based architecture + WAL. Writes go to WAL first (durability), then to in-memory write buffer. Buffer is periodically sealed into a segment, which gets an ANN index built in the background. Segments are immutable. Deletions use tombstones. Compaction merges small segments and rebuilds indexes. This mirrors LSM-tree design from RocksDB.

### "What index would you pick for 100M vectors?"

Walk through the decision:
- Memory available? HNSW if yes, IVF-PQ if no
- Ingestion rate? If > 10K/sec, HNSW inserts are too slow — use IVF-PQ or segment buffering
- Recall requirement? HNSW gives better recall at same latency
- GPU available? FAISS GPU with IVF-PQ can search billions of vectors

A good answer picks IVF-PQ with HNSW refinement (re-rank top candidates with exact distances) as a balanced choice.

### "How does PQ compression work?"

Split each d-dimensional vector into m subvectors. Train a codebook of 256 centroids for each subspace. Encode each subvector as the index of its nearest centroid (1 byte). A 768-dim vector becomes 8 bytes — 384x compression. Distance computation uses precomputed lookup tables: for each subspace, precompute distances from the query subvector to all 256 centroids, then approximate the full distance as the sum of table lookups. Extremely fast.

---

## System Design: "Design a semantic search system for 1 billion product listings"

This is the capstone question. Here's how to structure the answer:

**Clarify requirements first**:
- Query latency target? (e.g. < 100ms P99)
- Ingestion rate? (e.g. 10K updates/sec)
- Recall requirement? (e.g. 95% recall@10)
- Filter requirements? (brand, category, price range)
- Consistency requirements?

**Architecture**:
- Embedding service: encode product text/images to vectors (768-dim)
- Vector DB: IVF-PQ for scale (1B vectors won't fit in HNSW memory), sharded across 10 nodes
- Metadata index: inverted index for brand/category filters, range index for price
- Query path: coordinator fans out to all shards, each shard does IVF-PQ search with filtered traversal, coordinator merges
- Write path: Kafka queue → embedding service → vector DB write buffer → background indexing

**Tradeoffs to discuss**:
- HNSW vs IVF-PQ: chose IVF-PQ for memory, could use HNSW on hot segments
- Shard count: 10 shards × 100M vectors each, minimize for tail latency
- Filter strategy: hybrid index for category/brand (moderate selectivity), post-filter for price (high selectivity)
- Freshness: eventual consistency acceptable, new products searchable within seconds via write buffer

---

## Mental Models to Internalize

**ANN is a tradeoff, not a failure**: Returning 95% of the true top-10 is not a bug. For search, users can't tell the difference. The 5% recall loss buys 100x speedup.

**Recall-latency curves, not points**: Never report a single (recall, latency) number. The curve — how recall changes as you increase efSearch or nprobe — tells you how much headroom you have.

**Segments solve the ingestion problem**: The reason production vector DBs can handle high write rates is that they decouple writes (fast, no indexing) from indexing (slow, background). This pattern appears everywhere in database engineering.

**Filtering selectivity determines strategy**: There is no universally best filtering approach. The right choice depends on what fraction of vectors pass the filter. Know all three strategies and when each applies.

**More shards = worse tail latency**: Distributed queries are bounded by the slowest shard. Horizontal scaling improves throughput but hurts P99 latency. This is the fundamental tension in distributed search.
