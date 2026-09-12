---
title: "Caching & Query Optimization (Advanced Database Internals Edition)"
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Perfect — I will now **refine the advanced article into a polished, publication-grade chapter** AND **add cross-links to your existing Database Internals series** exactly as you requested.

Below is the **final Kavriq-ready version**, with deep rewriting, clean structure, professional tone, plus internal cross-references to relevant articles in your Database Internals series.

This is ready for immediate publishing.

---



### *Execution Engines • Buffer Pool Internals • Cost-Based Optimization • Predicate Pushdown • Vectorization • Cache Consistency • Stampede Control*

Caching and query optimization are the **first two levers** any high-scale database or application must pull.
Modern systems—from Postgres to Snowflake to CockroachDB—layer multiple caching tiers and sophisticated query optimizers to deliver sub-millisecond responses on top of terabytes or petabytes of data.

This chapter covers:

* Internal caching behavior (buffer pools, page caches, materialized results)
* End-to-end caching patterns (Redis, Memcached, CDN, browser caches)
* Query planner internals (join ordering, histograms, cost models)
* Execution engine features (vectorization, pruning, pipelining)
* Failure modes (hot keys, stampedes, stale caches)

This article also links back to earlier chapters:

* **Buffer Pools** → see *Article 7: Buffer Pools, Caches & Page Replacement*
* **Execution Engines** → see *Article 8: Query Execution: What Really Happens During SELECT*
* **Columnar Optimization** → see *Article 9: Parquet, ORC & Columnar Storage*
* **Distributed Scaling** → ties to *Article 10 & 11: Distributed Storage & Bigtable/Cassandra Architecture*

---

## ============================================

## **1. Why Caching Matters in Databases**

## ============================================

Before a single SQL row is returned, a database typically performs:

1. SQL parsing
2. Query planning
3. Buffer pool lookup
4. Fetching pages from disk (if not cached)
5. MVCC visibility checks
6. CPU filtering, join processing, sorting

This is expensive.

Caches short-circuit work.

### **Databases have multiple internal caches:**

* **Buffer pool** (pages)
* **Plan cache** (compiled execution plans)
* **Index page cache**
* **Tuple cache**
* **Materialized view cache**
* **Shared memory caches (Postgres shared_buffers, MySQL buffer pool)**

At application level, engineers add:

* Redis / Memcached
* CDN caches
* Browser caches
* Local in-memory caches

Caching is a **multi-layer architecture**, and each layer can save milliseconds.

---

## ============================================

## **2. Cache Hierarchy & Latency**

## ============================================

### Approximate lookup latencies:

| Layer                | Typical Latency |
| -------------------- | --------------- |
| CPU L1 Cache         | ~1 ns           |
| CPU L2/L3 Cache      | 4–10 ns         |
| RAM                  | 100 ns          |
| Redis (remote)       | 0.2–1 ms        |
| Database buffer pool | 1–2 ms          |
| Local SSD            | 100–500 µs      |
| HDD                  | 5–10 ms         |
| Networked DB         | 1–30 ms         |

Each cache hit avoids scanning tables, parsing queries, touching disk, and doing MVCC checks.

---

## ============================================

## **3. Types of Caching (Internal + External)**

## ============================================

## **3.1 Internal Database Caches**

These caches are deeply tied to storage internals.
Related: *Article 7 — Buffer Pools, Caches & Page Replacement.*

### **1. Buffer Pool / Page Cache**

* Stores 4KB/8KB/16KB pages (depends on DB)
* B-Trees, heap tables, indexes live here
* Uses algorithms like CLOCK, LRU-K, ARC

### **2. Plan Cache**

* Reuses execution plans
* Crucial in OLTP workloads
* Avoids repeating join enumeration

### **3. Materialized Results Cache**

* Precomputed aggregates
* Automatically rewritten queries (Oracle, Snowflake)

### **4. Index Page Cache**

* Leaf pages of B-Trees are frequently cached
* Reduces random I/O on range scans

---

## **3.2 Application-Level Caching (Redis/Memcached)**

### Strategies:

* **Cache-aside** (lazy loading)
* **Write-through**
* **Write-back**
* **TTL-based eviction**

Avoids DB round trips.

---

## **3.3 CDN + Edge Caching**

Used for:

* static files
* API caching for anonymous users
* pre-rendered HTML

---

## **3.4 Hot Path Optimization: Local LRU Caches**

Each server maintains a small memory cache for frequent keys, reducing pressure on Redis itself.

---

## ============================================

## **4. Caching Failure Modes (Advanced Perspective)**

## ============================================

## **4.1 Cache Stampede / Thundering Herd**

When a hot key expires, thousands of clients stampede the DB.

**Solutions:**

* **Dogpile prevention**: tokens controlling rebuild
* **Probabilistic early refresh**
* **Single-flight / request coalescing**
* **Tiered caching (local LRU before Redis)**

---

## **4.2 Hot Keys**

A single key receives massively disproportionate load.

**Solutions:**

* Key sharding (e.g., `profile:virat:1`, `profile:virat:2`)
* Broadcast caches
* Local node caches
* Request collapsing

---

## **4.3 Stale Cache Consistency Models**

When DB updates don't propagate instantly:

* **Read-after-write inconsistency**
* **Write skew**
* **Lost updates**

Mitigation:

* Versioning
* Write-through caches
* Event-driven invalidation (via Kafka binlog consumers)

---

## **4.4 Over-Caching**

Excessive caching increases:

* eviction churn
* memory fragmentation
* invalidation overhead

---

## ============================================

## **5. Query Optimization Internals**

## ============================================

This section integrates with *Article 8: Query Execution: What Really Happens During SELECT*, but adds deeper optimizer details.

---

## **5.1 Query Planning Pipeline**

Every DB follows roughly this pipeline:

1. **Parse SQL → AST**
2. **Rewrite** (flatten subqueries, push predicates)
3. **Cost-based optimization**
4. **Choose join orders, indexes, operators**
5. **Generate physical plan**
6. **Execute**

---

## **5.2 Cost-Based Optimization (CBO)**

The optimizer simulates multiple plans and selects the cheapest one using:

* table cardinality
* histogram statistics
* index selectivity
* CPU I/O cost models
* memory limits
* join method feasibility (hash join vs nested loop vs merge join)

### Failure modes:

* stale statistics → terrible plans
* skewed distributions
* correlated predicates the DB cannot infer

---

## ============================================

## **6. Join Order Optimization (NP-Hard)**

## ============================================

For N tables, join order search space grows super-exponentially.

Optimizers use:

* dynamic programming
* bushy/left-deep tree heuristics
* pruning based on cardinality estimates

This is a major source of latency reduction.

Example:
A query that scanned 100M rows becomes a query scanning 200K rows simply by changing join order.

---

## ============================================

## **7. Predicate Pushdown & Filter Reordering**

## ============================================

Push filters closer to storage.

Columnar formats like Parquet/ORC support:

* min/max pruning
* dictionary pruning
* bloom filter pruning

Cross link: *Article 9: Parquet, ORC & Columnar Storage Internals.*

---

## ============================================

## **8. Vectorized Execution**

## ============================================

Modern engines (Snowflake, DuckDB, Presto, ClickHouse, recent Postgres builds) use:

* SIMD instructions
* batch-at-a-time processing
* vector masks instead of row loops

Speedups: **5x–20x** over tuple-at-a-time execution.

This ties into *Article 8: Query Execution*.

---

## ============================================

## **9. Buffer Pool Behavior & Page Replacement**

## ============================================

Further detail linking to *Article 7*.

### Page replacement policies:

* LRU-K
* CLOCK
* ARC
* Multi-Queue

Index leaf pages are highly cached because:

* most workloads are read-heavy
* range scans benefit tremendously

---

## ============================================

## **10. Partition Pruning**

## ============================================

Partitioning (covered earlier in *Sharding vs Partitioning*) helps only when pruning works.

Optimization example:

Query:

```sql
SELECT * FROM logs 
WHERE created_at >= NOW() - INTERVAL '1 day'
```

Month-based partitioning = wasted scans
Day-based partitioning = perfect pruning

---

## ============================================

## **11. Materialized Views & Auto-Rewrites**

## ============================================

Databases automatically rewrite queries to use:

* MVs
* indexed views
* summary tables

Snowflake, BigQuery, Oracle, and PostgreSQL’s upcoming features do this automatically.

---

## ============================================

## **12. Query Anti-Patterns (Internal Perspective)**

## ============================================

## ❌ `SELECT *`

Prevents:

* index-only scans
* covering indexes
* columnar pruning
* vectorized efficiency

## ❌ Functions on Indexed Columns

```sql
WHERE DATE(created_at) = '2024-01-01'
```

Disables index usage.

## ❌ OR Conditions Without Indexes

Force sequential scans.

## ❌ Non-sargable predicates

Expressions that prevent index navigation.

---

## ============================================

## **13. Real-World Patterns**

## ============================================

## **13.1 Instagram (Postgres + Memcached)**

* Cache-aside strategy
* Memcached for timelines
* Postgres for consistent writes
* Heavy reliance on buffer pool effectiveness

---

## **13.2 Uber (MySQL + Schemaless + Redis + Cassandra)**

* Redis for geospatial hot keys
* Cassandra for high-write ingestion
* MySQL for transactional correctness
* Memcache for minimizing DB pressure

Cross link: *Article 11 — Case Studies: Bigtable, Cassandra & DynamoDB*

---

## **13.3 Snowflake / BigQuery**

Leverage:

* vectorized execution
* predicate pruning
* late materialization
* columnar compression
* shuffle/broadcast strategies

Cross link: *Article 9 — Columnar Storage Internals*.

---

## ============================================

## **14. Interview Takeaways**

## ============================================

When asked about performance optimization:

### Mention these **first-line strategies**:

* Indexing strategy
* Avoiding `SELECT *`
* Using EXPLAIN plans
* Partition pruning
* Materialized views
* Caching layers

### Then mention **systems-level concepts**:

* Buffer pool hit rate
* Join order selection
* Histogram statistics
* Vectorized execution
* Predicate pushdown

Interviewers immediately recognize these as *deeper internal knowledge*.

---

## ============================================

## **15. Recap**

## ============================================

Caching reduces load.
Query optimization reduces work.

Together, they deliver **10×–500× performance gains**.

This article connected caching, query planning, execution internals, columnar optimizations, and real-world architectures, while linking back to:

* Article 7 — Buffer Pools & Caches
* Article 8 — Query Execution
* Article 9 — Parquet/ORC Columnar Internals
* Article 10 & 11 — Distributed Storage & Case Studies

---

## ✔️ Your Article Is Now Fully Updated

### This edition is consistent with your database internals series and ready for publication.

Would you like:
A) A **PDF-ready formatted version**
B) A **short 1-page interview cheatsheet version**
C) A **diagram pack** (join trees, buffer pool, vectorized execution)
D) A **companion video script** for YouTube (VidyaMarg)

Just tell me the option(s).
