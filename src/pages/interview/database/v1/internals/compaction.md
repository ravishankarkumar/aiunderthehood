---
title: "5. Compaction: The Hidden Cost Behind LSM Engines"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 5**, a deep, technical, but readable exploration of **compaction**—the single most important, misunderstood, and interview-relevant part of LSM-based systems.
This article is long, detailed, and perfect for **Kavriq**.

---



### *Why Write-Optimized Databases Slow Down — and How to Tune Them Like a CTO*

If the **LSM Tree** is the architecture and **SSTables** are the storage blocks, then **compaction** is the engine room—the process that keeps everything running, but also the source of most performance challenges.

Compaction is essential.
Compaction is expensive.
Compaction is a background process that, if mismanaged, can stall an entire database.

To understand modern systems—Cassandra, RocksDB, LevelDB, Bigtable, ScyllaDB, TiKV—you *must* understand compaction.

In this article we cover:

* Why compaction exists
* How it works
* Write amplification
* Space amplification
* Compaction debt
* Tombstone handling
* Backpressure and write stalls
* Leveled vs tiered compaction
* Practical tuning strategies for real production systems

---

## 🌋 **1. Why Compaction Exists (The Root Problem)**

Recall LSM storage model:

* Writes go to **memtable** (in-memory sorted map)
* Flushed as **immutable SSTables**
* SSTables accumulate over time

Without compaction:

* There would be hundreds or thousands of SSTables
* Reads must check each SSTable
* Tombstones never get removed
* Duplicate versions waste space
* Data ordering breaks across files

So compaction solves:

### ✔ Reducing number of files (read amplification)

### ✔ Removing overwritten keys

### ✔ Purging tombstones

### ✔ Sorting keys to avoid overlaps

### ✔ Maintaining predictable performance

Compaction is fundamental: **LSM storage is unusable without it.**

---

## 🔧 **2. What Actually Happens During Compaction?**

Compaction merges sorted SSTables:

```
[SSTable A] 
[SSTable B]
[SSTable C]
   ↓ merge
[New SSTable]
```

During the merge:

1. Keys are read in sorted order
2. Latest version of each key is kept
3. Older versions are discarded
4. Tombstones remove entries
5. Output is a new sorted SSTable

The old SSTables are then safely deleted.

This is similar to merges in merge sort.

---

## 🚦 **3. Compaction = Write Amplification**

Every compaction cycle rewrites data. Example:

* Data flushed to Level 0
* Compacted into Level 1
* Compacted again to Level 2
* Eventually Level 3, Level 4…

Meaning 1 user write → N internal writes.

**Write Amplification (WA)** is defined as:

```
WA = bytes_written_by_storage_engine / bytes_written_by_user
```

Typical values:

* RocksDB (leveled): 10–30×
* Cassandra (size-tiered): 4–6×
* Heavy-delete workloads: 30–60×

Compaction is the dominant cost of LSM storage.

---

## 🪦 **4. Tombstones and Why They Make Everything Worse**

Deletes in LSM engines create **tombstones**, not in-place removal.

A tombstone remains until compaction encounters:

* SSTables containing older versions
* SSTables containing the same key

Meaning:

* Reads must check tombstones
* Tombstones suppress stale data
* Compaction load increases massively

Cassandra is infamous for tombstone issues:

* High delete workloads
* TTL-based expiry
* TimeWindowCompactionStrategy exists partly to solve this

---

## ⚖️ **5. Two Major Compaction Strategies: Tiered vs Leveled**

## **A. Tiered Compaction (Size-Tiered)**

Used by Cassandra originally, LevelDB’s older modes, and many embedded KV stores.

### **How it works**

1. Several SSTables of similar size accumulate
2. When count K is reached (e.g., K=4), merge them
3. Create one bigger SSTable

### **Pros**

* Low write amplification
* Great for heavy write bursts
* Large sequential writes = SSD-friendly

### **Cons**

* High read amplification
* Many overlapping SSTables
* Bloom filters mitigate but do not fix this

**Best for:**

* Append-only workloads
* Time-series ingestion
* Event logging

---

## **B. Leveled Compaction (LCS)**

Used by RocksDB, LevelDB (default), Cassandra’s LCS mode, TiKV, CockroachDB.

### **How it works**

SSTables organized in levels:

* **L0:** Unordered flushed files
* **L1:** Compact from L0 → non-overlapping ranges
* **L2:** Each 10× the size of previous
* **L3…LN:** Continue scaling

Levels enforce **non-overlapping key ranges**:

```
L1:
 [A-D] [E-F] [G-K] ...
```

### **Pros**

* Predictable read performance
* Little read amplification
* Range scans efficient

### **Cons**

* Very high write amplification
* Compaction load grows exponentially with levels

**Best for:**

* Read-heavy services
* Mixed OLTP workloads
* Query engines needing predictable latency

---

## 🔥 **6. Compaction Debt (The Silent Killer)**

**Compaction debt** = backlog of compaction work the system must perform to stay healthy.

Debt grows when:

* Ingest rate > compaction throughput
* Many overlapping SSTables accumulate
* Deletes generate excessive tombstones
* Small SSTables flood L0
* Levels become unbalanced
* Compaction threads starve

Symptoms of compaction debt:

* Latency spikes
* Write stalls (RocksDB)
* Read amplification grows
* Disk usage surges
* CPU saturation
* I/O queue overload

Compaction debt is the main cause of performance collapse in LSM engines.

---

## 🧱 **7. Backpressure: When the Database Stops Accepting Writes**

When compaction debt gets too large, engines must stop you from overwhelming them.

Examples:

### **RocksDB Write Stalls**

Triggered when:

* Too many L0 files
* Level size limit exceeded
* Pending compaction exceeds thresholds
* Memtables exceed quotas

Stalls can be:

* **Soft stall**: Slow down writes
* **Hard stall**: Stop writes entirely

### **Cassandra Backpressure**

Triggered when:

* Memtables fill quickly
* Flushers are overloaded
* Compaction falls behind
* Hinted handoff increases disk load

Backpressure ensures eventual recovery rather than catastrophic collapse.

---

## ⚙️ **8. Real Tuning Techniques for Production LSM Systems**

This section is **pure interview gold** and crucial for real-world engineering.

---

## **1. Increase Memtable Size**

Larger memtables = fewer flushes = fewer SSTables at L0.

Result:

* Lower compaction frequency
* Lower write amplification

Downside: more memory usage.

---

## **2. Tune Number of Compaction Threads**

Increasing compaction threads increases throughput.

Caveat:

* Too many threads → I/O starvation
* Too few threads → compaction debt

RocksDB exposes dozens of knobs to tune thread pools.

---

## **3. Use LCS for Read-Heavy Workloads**

* Great for predictable reads
* Avoids huge read amplification

---

## **4. Use Tiered or TimeWindow for Write-Heavy Workloads**

* Lower write amplification
* Better for TTL-heavy workloads
* Great for logs / time-series

---

## **5. Tune Bloom Filter Bits-per-key**

Trade-offs:

* More bits → fewer false positives → faster reads
* More memory → higher RAM usage

Default (10 bits/key) is often suboptimal at scale.

---

## **6. Throttle Client Writes**

Use admission control mechanisms to reduce pressure on compaction workers.

---

## **7. Avoid High Tombstone Density**

In Cassandra:

* Use TimeWindowCompaction
* Avoid large TTL ranges
* Regularly repair partitions

---

## **8. Use Prefix Bloom Filters**

For workloads where keys share prefixes (e.g., tenant_id:user_id).

Drastically reduces SSTables to search.

---

## 🔍 **9. Space Amplification**

Space amplification = how much extra storage is consumed temporarily.

LSM engines experience space amplification due to:

* Multiple copies of data before compaction
* Tombstones
* Overlapping SSTables in L0
* Time-window retention policies

Leveled compaction reduces space amplification compared to tiered but increases write amplification.

---

## 🧠 **10. Compaction vs Checkpointing vs Vacuuming vs Defragmentation**

### **Compaction**

Merge SSTables; remove duplicates/tombstones.

### **Checkpointing (WAL flush)**

Force data pages to disk for crash recovery boundaries.

### **MVCC Vacuum (PostgreSQL)**

Remove dead row versions in heap pages.

### **Defragmentation (B+ Trees)**

Reorganize fragmented leaf pages.

Key insight:
**Compaction is not garbage collection—it is data restructuring.**

---

## 🏛️ **11. Compaction in Real Systems**

---

## **RocksDB**

* Highly tunable
* Multi-threaded compaction
* FIFO, Tiered, Leveled, Universal strategies
* Backpressure baked into write API
* Used in Kafka Streams, Flink, CockroachDB, TiKV

---

## **Cassandra**

* STCS (Size-tiered)
* LCS (Leveled)
* TWCS (TimeWindow)
* Tombstone-heavy workloads need TWCS
* LCS expensive for write-heavy systems

---

## **Bigtable**

* Automatic compactions
* Strict non-overlapping ranges
* Balanced compaction pipeline

---

## **ScyllaDB**

* Each shard runs its own mini-LSM
* Highly parallel compaction
* Optimized for modern NVMe SSDs

---

### **Compaction is where 70–90% of CPU time may go in an LSM database.**

This is the single most important operational fact.

---

## 🎯 **12. Interview Mental Models**

Memorize these.

### **Q: Why is compaction needed?**

To remove old versions, purge tombstones, and maintain sorted order across SSTables.

### **Q: Why do LSM engines stall?**

Compaction debt → write stalls → backpressure.

### **Q: Why is leveled compaction more expensive?**

It rewrites data many more times to maintain non-overlapping levels.

### **Q: What is write amplification?**

User write triggers multiple internal rewrites.

### **Q: What is read amplification?**

Reads may need to check multiple SSTables.

### **Q: How do you tune compaction?**

Bigger memtables, more compaction threads, correct strategy (LCS vs STCS), optimized bloom filters.

---

## 🧭 **13. Summary: The True Cost of LSM Trees**

> LSM trees achieve incredible write throughput, but compaction introduces unavoidable background work—write amplification, CPU overhead, and storage churn.

The art of operating LSM systems is managing compaction:

* minimize stalls
* avoid compaction debt
* pick the right strategy
* tune memory & I/O usage
* optimize bloom filters

LSM engines shine when compaction is healthy.
They collapse when it falls behind.

Understanding compaction is essential to designing scalable, predictable storage systems.

---

## ✅ **Next: Article 6 — MVCC: High-Concurrency Reads & Writes Without Locks**

Shall I continue with **Article 6**?
