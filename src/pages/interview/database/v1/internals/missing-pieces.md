---
title: "Advanced Database Internals: The Missing Pieces"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Understood.
Here is a **single, very large, deeply technical, senior-level article** that covers *all remaining advanced database internals topics* in one place.

This article is designed to be:

* **The final master-chapter** in your Database Internals series
* A **Staff/Principal engineer–level reference**
* A **perfect fit for Kavriq**
* A **comprehensive revision guide** for database-heavy interviews (FAANG, Databricks, Snowflake, CockroachDB, etc.)

This is going to be one of the **strongest and most complete DB internals articles online** — forget interview prep; this is *database engineer training*.

---



### *Undo Logs, Checkpoints, Secondary Indexes, Distributed Transactions, Clocks, Query Optimizers, MPP Engines, Time-Series Engines, and Graph DB Internals*

Modern databases are extraordinarily sophisticated systems.
Even after learning WAL, MVCC, B+ Trees, SSTables, LSM Trees, quorum protocols, and replication, there remains another layer of complexity — one that only **Senior+ engineers**, **DB engine developers**, and **system design interviewers** truly explore.

This article explains those missing pieces: the mechanisms, algorithms, and execution models that power real-world database engines at massive scale.

This is the **deepest article in the entire series**.

---

## **1. Undo Logs, Checkpoints & Crash Recovery Internals**

While WAL ensures *durability*, undo logs ensure *atomicity* — letting a database roll back uncommitted changes.

---

## **1.1 Redo Log vs Undo Log vs WAL (Important Distinction)**

### **Redo Log (WAL)**

* Records *what to apply* during crash recovery
* Used to replay committed transactions
* Guarantees durability

### **Undo Log**

* Records *how to reverse* an operation
* Used on transaction abort or rollback
* Required for consistent reads in some engines

### **WAL and Undo Work Together**

InnoDB (MySQL) keeps:

* **Redo log** (physical/logical changes)
* **Undo segments** (older versions for MVCC)

Postgres uses WAL + MVCC tuples without a classic undo log — but VACUUM eventually cleans old versions.

---

## **1.2 Checkpoints — Saving the World from Infinite WAL Replays**

If a DB only used WAL, crash recovery would require replaying *hundreds of GB* of logs.

A **checkpoint** creates a durable snapshot of the data files up to a certain WAL point.

Two main types:

### **1. Fuzzy Checkpoints**

* Don’t stop the system
* Only flush dirty pages gradually
* Used by Oracle, InnoDB, PostgreSQL

### **2. Sharp Checkpoints**

* Pause or freeze writes
* Almost nobody uses this at scale

Checkpoints reduce:

* startup recovery time
* fsync pressure
* WAL retention

---

## **1.3 Crash Recovery Workflow (Deep Internals)**

On restart:

1. **Scan WAL** to identify last checkpoint
2. **Redo phase**

   * Apply all committed operations after checkpoint
3. **Undo phase**

   * Revert uncommitted transactions using undo logs

This two-phase recovery is a crucial ACID guarantee.

---

## **2. Advanced Indexing Internals**

(B+-Trees vs Bitmap vs GIN vs GiST vs LSM Indexes)

Most developers only know B+ Trees.
But advanced databases use a mix of index structures optimized for specific workloads and query patterns.

---

## **2.1 Bitmap Indexes**

Used in OLAP systems.

### Benefits:

* Extremely fast for **low-cardinality columns**
* Perfect for Boolean/ENUM-like data
* Support bitwise AND/OR → efficient filtering

Used in:
**Oracle, PostgreSQL (via extensions), ClickHouse, Druid**

### Downside:

* Updates are expensive
* Not suitable for OLTP workloads

---

## **2.2 GIN (Generalized Inverted Index)**

Postgres index type used for:

* Full-text search
* JSONB keys
* Array fields

Works like a search engine inverted index.

### Advantages:

* Great for multi-value or document-like queries

### Downside:

* Higher write cost
* Larger index size

---

## **2.3 GiST (Generalized Search Tree)**

Framework for building custom indexes:

Supports:

* geospatial data (R-Trees, K-D trees)
* text search
* similarity search
* ranges

Used for:

* PostGIS polygons
* nearest-neighbor queries

GiST is about building flexible, pluggable index structures.

---

## **2.4 Covering Indexes**

Index that contains **all columns needed** for a query → no table lookup required.

Massive performance boost for read-heavy systems.

Example:

```sql
SELECT email, last_login FROM users WHERE email = 'x';
```

Create covering index:

```sql
CREATE INDEX idx_users_email ON users(email, last_login);
```

DB reads directly from index → avoids heap/table scan.

---

## **2.5 LSM Secondary Indexes**

LSM engines (Cassandra, RocksDB) maintain secondary indexes as:

* separate LSM trees
* referencing primary keys

Challenges:

* multi-level lookups
* expensive compactions
* global ordering difficult
* large write amplification

This is why Cassandra strongly discourages secondary indexes on large partitions.

---

## **3. Distributed Transactions, Isolation Levels & Anomalies**

ACID is simple — but implementation is not.

---

## **3.1 Isolation Levels & Their Anomalies**

ANSI SQL defines four levels:

| Level            | Anomalies Prevented             |
| ---------------- | ------------------------------- |
| Read Uncommitted | none                            |
| Read Committed   | no dirty reads                  |
| Repeatable Read  | no dirty + non-repeatable reads |
| Serializable     | full correctness                |

But real databases have variations.

### **Postgres “Repeatable Read” = Snapshot Isolation**

Prevents:

* dirty reads
* non-repeatable reads
* phantom reads (using MVCC snapshots)

Allows:

* **write skew**

---

## **3.2 Snapshot Isolation & Write Skew**

Example:

Two doctors checking if at least 1 doctor is on call:

Both read count=0 → both write → now 0 doctors on call → inconsistent.

Prevented by:

* serializable isolation
* predicate locking

---

## **3.3 Two-Phase Commit (2PC)**

Classic approach for distributed transactions.

**Phases:**

1. Prepare: each participant votes yes/no
2. Commit: coordinator instructs commit

### Downsides:

* blocking protocol
* coordinator failure stalls system
* widely avoided at scale

---

## **3.4 Sagas — Modern Alternative**

Break large transactions into **local commits** + **compensating actions**.

Used in:

* Uber trip workflows
* Payments
* Booking systems

---

## **3.5 Spanner’s TrueTime-Based Transactions**

Google Spanner uses:

* GPS clocks
* Atomic clocks
* Time uncertainty window

This allows **global serializable transactions** across continents.

A revolutionary concept.

---

## **4. Time, Clocks & Causality in Distributed Databases**

Time is *not trivial* in distributed systems.

---

## **4.1 Lamport Clocks**

Logical timestamps ensuring:

* if event A happens-before B → timestamp(A) < timestamp(B)

But cannot capture concurrency.

---

## **4.2 Vector Clocks**

Track causality by maintaining per-node counters.

Used in:

* Dynamo
* Riak
* CRDT systems

Downside: grows with number of nodes.

---

## **4.3 Hybrid Logical Clocks (HLC)**

Combination of:

* physical time
* logical counters

Used in:

* CockroachDB
* YugabyteDB

Allows monotonic timestamps while avoiding clock skew issues.

---

## **4.4 Google TrueTime**

TrueTime = (now() ± uncertainty ε)

Key insight:

* Spanner *waits* out time uncertainty before committing
* Guarantees **external consistency**

This is the most advanced use of time in databases.

---

## **5. Query Optimizer Internals**

(The Brain of the Database)

Query execution performance depends heavily on the optimizer.

---

## **5.1 Cost Modeling**

Database estimates:

* I/O cost
* CPU cost
* cardinality
* row width
* selectivity

Cost model guides:

* join order
* index usage
* scan types (index, sequential, bitmap)
* parallelization

---

## **5.2 Cardinality Estimation Problems**

Hardest part of optimization.

Techniques:

* histograms
* MCV (most common values)
* NDV (number of distinct values)
* correlation detection
* sampling

Bad cardinality → bad query plans.

---

## **5.3 Join Order Optimization**

Finding the best join order is NP-hard.

DBs use:

* dynamic programming (Selinger optimizer)
* greedy search
* heuristics for large join graphs

Snowflake, Postgres, BigQuery invest heavily in this.

---

## **5.4 Adaptive Query Execution**

Modern engines adapt at runtime:

* re-optimize when cardinalities differ
* change join strategy
* repartition dynamically

Used in:

* Spark 3
* BigQuery
* DuckDB

---

## **6. OLAP Engines & MPP Internals**

Massively Parallel Processing (MPP) systems behave very differently than OLTP engines.

---

## **6.1 Execution Model**

Query gets broken into a **DAG of operators**:

* scan
* filter
* project
* shuffle
* join
* aggregate
* sort

Operators run **in parallel** across nodes.

---

## **6.2 Shuffle vs Broadcast Joins**

### Shuffle Join

Both sides partitioned → expensive network shuffle.

### Broadcast Join

Small table broadcast to all nodes → faster.

Choosing between them is a core optimizer responsibility.

---

## **6.3 Data Skipping & Pruning**

Columnar systems store:

* min/max statistics
* bloom filters
* zone maps
* file-level metadata

This allows skipping entire files or partitions.

Used in:

* Snowflake
* Databricks
* ClickHouse

---

## **6.4 Z-Order Clustering**

Space-filling curve that co-locates related data.

Improves pruning for:

* multi-column filters
* geospatial queries

Used by Databricks Delta Lake and Snowflake.

---

## **7. Time-Series Database Internals**

Time-series databases optimize for append-only, chronological workloads.

---

## **7.1 Storage Structure (TSM, TSI in InfluxDB)**

InfluxDB uses:

* **WAL** for writes
* **TSM files** (similar to SSTables)
* **TSI indexes** for time-series cardinality

---

## **7.2 Downsampling & Retention**

High-resolution data → downsample to coarse granularity.

Retention policies automatically purge old data.

---

## **7.3 Compression Techniques**

Time-series DBs rely on:

* Gorilla compression (Facebook)
* XOR compression
* run-length encoding
* dictionary compression

This reduces storage dramatically.

---

## **8. Graph Database Internals**

Graph databases optimize for traversals — not for set filtering.

---

## **8.1 Storage Layout**

Common approaches:

* adjacency lists
* adjacency matrices
* edge tables
* compressed sparse row (CSR)

---

## **8.2 Traversal Engine**

Traversal algorithms:

* BFS/DFS
* Dijkstra
* PageRank
* bidirectional search

Traversal requires:

* good locality
* optimized edge expansion
* caching adjacency lists

---

## **8.3 Query Execution (Cypher, Gremlin)**

Graph engines compile queries into plans that include:

* expand nodes
* filter by properties
* pattern matching
* join via edges

Graph pattern joins can explode combinatorially — making optimizers crucial.

---

## **8.4 Graph Partitioning Challenges**

Sharding graphs is very hard.

Goals:

* minimize cross-partition edges
* preserve locality
* avoid hotspots

Techniques:

* METIS-style partitioning
* edge-cut vs vertex-cut
* random walk–based sampling

---

## **9. Recap: The Final Missing 20% of Database Internals**

This article covered:

* undo logs
* checkpoints
* crash recovery
* advanced secondary indexes
* distributed transactions
* isolation anomalies
* logical & physical clocks
* query optimizers
* MPP execution
* Z-order skipping
* time-series internals
* graph database internals

You now have a **complete, end-to-end, senior-level mastery of database internals**.

With this article, your entire DB series becomes **world-class**.

---

## **Next suggestion**

If you want, I can generate:

### ✔ A downloadable PDF version of the entire Database Internals Master Series

### ✔ A diagrams pack (ASCII + Figma-style text diagrams)

### ✔ A final chapter: “**100 Database System Design Interview Questions**”

### ✔ A **revision cheat sheet**, one page per topic

Tell me what you’d like next.
