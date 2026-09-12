---
title: "3. LSM Trees: The Write-Optimized Revolution"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 3**, a long, deep, authoritative CTO-level guide to LSM Trees—perfect for Kavriq and crucial for modern HLD interviews.

---



### *How Log-Structured Storage Powers Cassandra, Bigtable, RocksDB, LevelDB, TiKV, HBase, and Modern Analytics Systems*

Relational databases have historically relied on **B+ Trees**—optimized for point reads and range scans.
But as workloads shifted to:

* write-heavy event streams,
* IoT telemetry,
* real-time analytics,
* log ingestion,
* distributed key-value stores,

B+ Trees began to show their limitations: random writes, page splits, write amplification, and hot-spot contention.

Enter the **LSM Tree (Log-Structured Merge Tree)**—a storage structure engineered for **write throughput and sequential disk access**.

Today, LSM-based engines dominate modern storage:

* **LevelDB + RocksDB** (embedded engines)
* **Bigtable, Cassandra, ScyllaDB, HBase** (distributed databases)
* **Kafka Streams** (RocksDB-backed state)
* **TiKV (TiDB)**
* **ClickHouse merges**
* **RUM Concurrency Models in PostgreSQL extensions**

Understanding LSM Trees is mandatory for system design interviews at any modern company.

This article explains the entire LSM architecture: memtables, WAL, SSTables, bloom filters, compaction, write/read amplification, and practical trade-offs.

---

## 🌋 **1. The Core Problem LSM Trees Solve**

B+ Trees write data **in place**.
This leads to:

* random disk I/O
* page splits
* fragmentation
* locks & latches
* expensive write amplification
* high latency under heavy write workloads

But logs behave differently:

> Sequential writes are **orders of magnitude faster** than random writes.

LSM trees take advantage of this fact by using a **log-structured** approach:

* All writes are sequential
* Old data is never overwritten
* New data is appended
* Background compaction merges files efficiently

This transforms the write performance profile entirely.

---

## ♻️ **2. The LSM Tree Write Path (Step-by-Step)**

Every LSM-based system follows a similar pattern:

### **Step 1 — Write to WAL (Write-Ahead Log)**

Durability comes first.
Append the mutation to an on-disk log.

### **Step 2 — Apply to Memtable (in-memory sorted map)**

Memtable is usually:

* a skiplist (RocksDB, LevelDB)
* a red-black tree (older implementations)

Memtable maintains keys in sorted order.

### **Step 3 — Return success to client**

Because WAL is durable, memtable is volatile-but-safe.

### **Step 4 — When memtable is full → freeze it**

It becomes an **immutable memtable**.

### **Step 5 — Flush immutable memtable to disk as an SSTable**

Sorted String Table = immutable sorted file containing:

* key-value pairs
* index
* optional bloom filter
* compression
* checksums

### **Step 6 — Repeat for each memtable cycle**

At this point, the database accumulates many SSTables across multiple levels.

---

## 🧱 **3. SSTables: Immutable Disk Files**

SSTables are the heart of the LSM design.

An SSTable typically contains:

* Data blocks
* Index block (mapping key → block offset)
* Bloom filter (optional)
* Footer + checksums
* Metadata

Key advantage:

> **SSTables are immutable, which eliminates random writes.**

This immutability enables zero-cost concurrency: no locks, no in-place updates.

---

## 🔎 **4. Read Path: How LSM Engines Find Data Efficiently**

Reads are more complex because data may exist in:

1. Memtable
2. Immutable Memtable
3. Level 0 SSTables
4. Level 1 SSTables
5. Level 2…

To avoid scanning every file, LSM engines use:

### A. **Bloom Filters**

A probabilistic data structure:

* tells you whether a key is *definitely not* in the SSTable
* false positives possible
* false negatives never

This avoids unnecessary disk reads.

### B. **Index Blocks**

Each SSTable contains an in-memory index mapping keys → block offsets.

### C. **Block Cache**

Frequently used blocks are cached in memory (similar to buffer pool).

### D. **Compaction Layout**

Levels reduce the number of SSTables to search.

---

## 🔥 **5. Compaction: The Secret Sauce**

Without compaction, LSM performance collapses.

Compaction merges SSTables to:

* remove overwritten + deleted keys
* rewrite into fewer, larger sorted files
* maintain ordering across levels
* reduce read amplification
* enforce size-tiering rules

### **Two Major Compaction Strategies:**

---

## **A. Tiered Compaction (Size-Tiered)**

Used by Cassandra (originally).

Mechanism:

* Multiple SSTables of similar size are merged
* Produces a larger SSTable
* Fewer levels
* Lower write amplification
* Higher read amplification

Good for **write-heavy workloads**.

---

## **B. Leveled Compaction**

Used by LevelDB, RocksDB, and many Bigtable implementations.

Mechanism:

* SSTables are organized in levels: L0, L1, L2,…
* L0 contains flushed memtables
* Each level is 10× larger than the previous
* Compaction merges L0 → L1, L1 → L2, etc.
* Each level contains non-overlapping key ranges

Benefits:

* Predictable read performance
* Lower read amplification
* Higher write amplification

Perfect for **mixed read/write workloads**.

---

## ⚖️ **6. Write Amplification, Read Amplification & Space Amplification**

LSM Trees involve unavoidable trade-offs.

---

## **Write Amplification**

Each key is:

* written to WAL
* added to memtable
* flushed to L0
* compacted to L1
* compacted to L2
* …

Thus:
**1 user write → multiple disk writes**

Worse in leveled compaction, better in tiered compaction.

---

## **Read Amplification**

On read, system may need to check:

* memtable
* immutable memtable
* L0 SSTables
* multiple levels

Bloom filters and indexing help, but cannot remove this overhead entirely.

---

## **Space Amplification**

Multiple versions of a key may exist across SSTables until compaction merges them.

---

## 🏛️ **7. Delete Markers: Tombstones**

LSM Trees cannot delete in-place.
Instead:

1. Write a **tombstone marker**
2. Future compaction purges the key
3. Reads must check whether older versions are shadowed by tombstone

Cassandra heavily relies on tombstones.

---

## 🧪 **8. Real-World Implementations**

---

## **LevelDB (Google)**

Created for Chrome, Android, Bigtable clients.

* Single-threaded
* Tiered compaction
* Simple API
* Foundation for RocksDB

---

## **RocksDB (Meta)**

High-performance rewrite of LevelDB.

Features:

* multi-threaded compaction
* bloom filters
* prefix bloom
* block cache
* column families
* tailing iterators
* optimized for SSDs
* used inside Kafka Streams, TiKV, CockroachDB, Flink

RocksDB is the **LSM tree gold standard**.

---

## **Bigtable (Google)**

The origin of the LSM revolution.

* Memtables → SSTables → GFS
* Tablet servers manage partitions
* Reliance on immutable data files enables distributed compaction

Cassandra inherited this design.

---

## **Cassandra (Apache)**

Uses commit log + memtable + SSTables.

Compaction strategies:

* SizeTieredCompactionStrategy (STCS)
* LeveledCompactionStrategy (LCS)
* TimeWindowCompactionStrategy (TWCS)

Data distribution: consistent hashing across nodes.

---

## **ScyllaDB**

A C++ rewrite of Cassandra, leveraging:

* shard-per-core architecture
* asynchronous IO
* LSM subtree per shard

---

## **TiKV (TiDB)**

Distributed KV over Raft, using RocksDB per node.

This combination of:

* consensus
* LSM storage
* distributed transactions

powers the TiDB distributed SQL database.

---

## 🧠 **9. LSM Trees vs B+ Trees: The Real Trade-Off Table**

| Property            | LSM Tree                               | B+ Tree                      |
| ------------------- | -------------------------------------- | ---------------------------- |
| Write performance   | 🔥 Very high (sequential)              | ❌ Lower (random writes)      |
| Read performance    | ❌ Lower (multiple levels)              | 🔥 Excellent (single lookup) |
| Range scans         | Good                                   | Excellent                    |
| Compaction          | Required                               | Not needed                   |
| Write amplification | High                                   | Moderate                     |
| Space amplification | Moderate                               | Low                          |
| Memory usage        | Moderate–high                          | Moderate                     |
| Best for            | Write-heavy workloads, logs, analytics | OLTP, PK lookups             |

### **Rule of Thumb**

* **OLTP → B+ Tree**
* **Event streams / telemetry → LSM**
* **Mixed workloads → RocksDB-based systems**

---

## 🎯 **10. Interview Mental Models for LSM Trees**

These are the core ideas interviewers expect:

---

### **Q: Why are LSM writes so fast?**

Sequential append-only writes → no page splits, no random writes.

---

### **Q: Why are reads slower than B+ Trees?**

Data may exist in many SSTables → need to check each → require bloom filters + caches.

---

### **Q: What is compaction? Why is it necessary?**

Compaction merges SSTables to maintain sorted order, eliminate duplicates/tombstones, and reduce read amplification.

---

### **Q: How does Cassandra achieve durability?**

Commit log (WAL) + memtable → SSTables + compaction.

---

### **Q: Why do we use bloom filters with LSM trees?**

To avoid unnecessary disk reads by quickly ruling out SSTables.

---

### **Q: Why can LSM engines stall under heavy load?**

Compaction backlogs → compaction debt → write stalls.

---

## 🧭 **11. Why LSM Trees Changed the Industry**

LSM Trees brought:

* Massive write throughput
* Near-perfect SSD utilization
* Lock-free concurrency (immutable files!)
* Predictable scaling
* Cloud-native distributed file storage compatibility

They fundamentally enabled:

* Bigtable → Cassandra → HBase → ScyllaDB
* RocksDB in Kafka Streams, Flink, CockroachDB, TiKV
* Modern log-heavy applications
* High-write ingestion services

For modern distributed systems, LSM Trees are as important as B+ Trees are for OLTP.

---

## ⭐ **12. Summary: The LSM Architecture in One Sentence**

> LSM Trees turn random writes into sequential appends using memtables and immutable SSTables, and maintain read efficiency through compaction and bloom filters.

Master this sentence, and you’ll perform exceptionally in any HLD or database internals interview.

---

## ✅ **Next: Article 4 — SSTables: Immutable Storage for Scale**

This next article goes deeper into the physical file format that makes LSM engines so powerful.

Would you like Article 4 now?
