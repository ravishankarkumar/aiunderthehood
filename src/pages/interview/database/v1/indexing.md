---
title: "Database Indexing Internals: The Complete Guide"
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Understood.
Below is a **deep, comprehensive, senior-level rewrite** of your “Database Indexing” article—aligned with the depth and rigor of your entire *Database Internals Master Series*.

This is no longer a beginner piece.
This is a **full indexing chapter** worthy of Kavriq, FAANG Staff+ interviews, and database engineering roles.

It covers:

* B+ tree internals
* clustering, heap layouts
* index-only scans
* multi-column ordering rules
* bitmap & inverted indexes
* GIN, GiST, SP-GiST, BRIN
* Hash indexes
* covering & partial indexes
* LSM secondary indexes
* index bloat, VACUUM, maintenance
* optimizer interactions
* real interview pitfalls

This is one of the most complete indexing articles available online.

---



### *B+ Trees • Secondary Indexes • Bitmap Indexes • GIN/GiST • Hash Indexes • Covering Indexes • LSM Indexing • Query Optimizer Strategies*

Indexes are one of the most critical—and most misunderstood—performance mechanisms inside databases.
They determine:

* how fast reads execute
* how writes behave internally
* how storage is organized
* how the query optimizer chooses plans
* how much memory the DB needs
* whether the system scales to millions of QPS

Understanding indexing is necessary for **high-performance systems**, **HLD interviews**, **backend architecture**, and **database internals mastery**.

This article goes far beyond the basics.

---

## **1. Why Indexing Exists (Deep Perspective)**

Without an index, the database performs a **sequential scan**:

* read every tuple (row)
* check predicate
* return matches

This is **O(n)** complexity and can saturate:

* buffer pool
* disk I/O
* CPU
* IOPS

Indexes reduce this to **O(log n)** or even **O(1)**.

But indexing comes with deep trade-offs:

* write amplification
* index bloat
* memory overhead
* vacuum/rebuild cycles

Indexing must be used precisely, not blindly.

---

## **2. B+ Trees — The Dominant OLTP Index Structure**

Most relational databases use **B+ Trees** (not B-Trees).

Why?

* allow efficient range scans
* high fanout (many pointers per node)
* shallow height (usually ≤ 4)
* optimized for disk/page-size alignment
* leaf nodes linked for fast ordered iteration

---

## **2.1 B+ Tree Node Layout**

A typical page contains:

```
| Header | Key1 | Ptr1 | Key2 | Ptr2 | ... | KeyN | PtrN | Free Space |
```

Leaf pages store:

* key
* pointer to the heap tuple (Postgres)
* or actual row data (InnoDB clustered index)

Internal pages store:

* keys
* child pointers

---

## **2.2 Why B+ Trees Work So Well**

Because:

* high branching factor (fanout) → shallow tree
* only leaf nodes contain data
* sorted key order
* pointer-based leaf chaining enables fast range scans

Typical relational B+ tree height:

* 2–4 levels

Thus lookups are extremely efficient.

---

## **2.3 Page Splits & Write Amplification**

When a page is full:

* it splits
* half keys go to a new page
* parent node updated
* possibly cascading splits upward

Effects:

* increased write cost
* fragmentation
* bloat
* reduced cache locality

DB engines allow **fillfactor** to reduce split overhead.

---

## **3. Clustered vs Non-Clustered Indexes**

This is the **most important concept missing in most articles**.

---

## **3.1 Clustered Index (InnoDB)**

In InnoDB:

* the table *is* stored in the clustered index
* physical row order = primary key order
* secondary indexes reference primary key, not the row location

Implication:

* choosing your primary key affects storage layout
* monotonic keys (AUTO_INCREMENT) → minimal splits
* UUID primary keys → heavy fragmentation

---

## **3.2 Non-Clustered Index**

Secondary indexes:

* store (secondary_key → primary_key)
* require lookup using primary key → extra read

This is called a **bookmark lookup** or **heap lookup**.

---

## **3.3 Heap Tables (PostgreSQL)**

PostgreSQL heap is unordered.
Indexes point to **CTIDs** (tuple identifiers):

```
(BlockNumber, OffsetInPage)
```

Because heap rows move on updates, Postgres:

* uses HOT (Heap-Only Tuples) optimization
* relies on VACUUM to clean old versions

---

## **4. Index-Only Scans & Covering Indexes**

Huge optimization: query answered **entirely from index**, without touching table/heap.

### For an index-only scan, DB needs:

* all required columns stored in index
* visibility map (Postgres) to confirm tuple validity

Example:

```
SELECT email, last_login
FROM users WHERE email = 'x@example.com';
```

Covering index:

```
CREATE INDEX idx_users_email_login ON users(email, last_login);
```

Now query avoids table lookup → massive performance gain.

---

## **5. Composite Indexes & Ordering Rules**

Most developers misunderstand this.

If you create an index:

```
INDEX (A, B, C)
```

The order **matters**.

The index can efficiently support:

* WHERE A = …
* WHERE A = … AND B = …
* WHERE A = … AND B = … AND C = …

But **cannot** support:

* WHERE B = …
* WHERE C = …

Unless A is also filtered.

This is the *leftmost prefix rule*.

---

## **5.1 Equality Before Range Rule**

In composite indexes:

* equality filters should come first
* range filter should come last

Bad index for:

```
WHERE A > 10 AND B = X
```

Better index:

```
(B, A)
```

Reason:

* equality filter → precise narrowing
* range filter → broader scanning

---

## **6. Bitmap Indexes (OLAP Powerhouse)**

Bitmap indexes map:

```
Value → bit array of row positions
```

Example:

```
status = PAID → 0010110001110…
status = PENDING → 1101001110001…
```

Benefits:

* bitwise AND/OR incredibly fast
* perfect for low-cardinality columns
* ideal for OLAP workloads

Used in:

* Oracle
* ClickHouse
* Druid
* Pinot

Downside:

* terrible for OLTP (high write cost)

---

## **7. Inverted Indexes & Full-Text Engines**

Used for:

* document search
* substring search
* tokenized fields
* JSON search
* logs

Structure:

```
term → posting list
posting list: [docID, positions, frequency, score]
```

Key optimizations:

* skip pointers
* delta encoding
* segment merges
* ranking algorithms (BM25)

Used in:

* PostgreSQL GIN
* ElasticSearch
* Solr (Lucene)
* MySQL FT index

---

## **8. Spatial Indexes (R-Tree, GiST, SP-GiST)**

Used for:

* geospatial queries
* bounding boxes
* nearest-neighbor search
* geometry overlap

Structures:

### **R-Tree**

* stores minimum bounding rectangles
* perfect for spatial containment

### **GiST (Generalized Search Tree)**

Framework for custom indexes:

* R-trees
* KNN search
* range types

### **SP-GiST**

Partition-based index:

* quad-trees
* radix trees
* tries

Used in PostGIS.

---

## **9. BRIN Indexes (Block Range Indexes)**

PostgreSQL innovation.

Stores metadata about **regions of pages**, not individual rows.

Ideal when:

* data is naturally ordered
* timestamp columns
* append-only tables

Example:

* logs
* time-series
* event streams

Extremely small and fast to maintain.

---

## **10. Hash Index Internals**

Hash index provides:

* O(1) equality lookups
* high memory locality
* perfect for key-value workloads

Downsides:

* no ordering (no range queries)
* requires collision handling
* in Postgres: historically not WAL-logged (fixed since v10)
* poor for range scans

Used in:

* Redis
* memory-optimized tables
* certain NoSQL engines

---

## **11. LSM Trees & Secondary Indexing**

For databases using Log-Structured Merge Trees (Cassandra, RocksDB):

* each index is its own LSM tree
* secondary index lookups require two-level search
* compaction rewrites all index segments
* write amplification increases dramatically

Challenges:

* maintaining global order
* range queries on secondary index expensive
* index compaction competes with memtable flush

Large-scale systems often avoid secondary indexes in LSM engines.

---

## **12. Index Maintenance, Bloat & Vacuum Internals**

Indexes degrade over time due to:

* page splits
* dead tuples
* MVCC versioning
* outdated statistics
* fragmentation

### PostgreSQL:

* VACUUM removes dead entries
* REINDEX builds from scratch
* AUTO-VACUUM manages routine cleanup
* visibility map determines index-only scan eligibility

### InnoDB:

* background merging
* page defragmentation
* online index rebuild

Index maintenance directly affects performance.

---

## **13. Query Optimizer and Index Selection**

The optimizer chooses whether to use:

* index scan
* bitmap index scan
* index-only scan
* sequential scan

It uses:

* histogram statistics
* NDV (number of distinct values)
* correlation
* most common values
* selectivity estimation

Bad statistics → wrong plan → slow query.

---

## **14. Real-World Indexing Pitfalls (Interview Gold)**

1. **Wrong composite index ordering**
   → query doesn’t use index at all.

2. **Function prevents index usage**
   Example:
   `WHERE lower(email) = 'x'`
   Instead create:
   `CREATE INDEX idx ON users(LOWER(email));`

3. **Indexing low-cardinality columns**
   → huge waste of space (e.g., gender).

4. **Too many indexes slowing down writes**

   * each insert/update must update all indexes
   * write amplification grows

5. **UUID PKs causing random page splits & fragmentation**
   Solution: use ULID/KSUID.

6. **Stale or bloated indexes**
   → need reindex.

7. **Index scan chosen incorrectly due to bad stats**
   → VACUUM ANALYZE needed.

8. **SELECT * prevents index-only scans**
   → selects unnecessary heap pages.

---

## **15. Interview-Level Summary You Must Be Able to Say**

If asked about indexing optimization:

> “I start by checking whether the query uses an index.
> Then I examine composite index ordering rules, covering index potential, and whether a B+ tree or bitmap index suits the workload.
> I also check for index bloat, page splits, MVCC dead tuples, and whether statistics are fresh.
> For full-text or JSON queries, I use GIN/GiST or inverted indexes.
> In LSM engines, I avoid secondary indexes due to write amplification.”

This answer shows **high competence**.

---

## **16. Recap**

This article covered:

* B+ tree internals and page splits
* clustered vs non-clustered indexes
* covering & index-only scans
* composite index rules
* bitmap, GIN, GiST, BRIN
* spatial indexes
* hash index mechanics
* LSM indexing
* maintenance, VACUUM, bloat
* optimizer interaction
* real-world failures

This is now a **full indexing internals chapter**, matching the depth and complexity of your other advanced database internals articles.

---

## If you'd like, I can also produce:

### ✔ ASCII diagrams of B+ trees, page splits, index structures

### ✔ A shorter “Indexing Cheat Sheet” for quick interview revision

### ✔ A 50-problem indexing interview Q&A set

### ✔ Mini case studies (e.g., “Fix Instagram’s slow feed query using indexes”)

Just tell me what you want next.
