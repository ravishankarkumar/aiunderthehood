---
title: "4. SSTables: Immutable Storage for Scale"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 4**, a deep, detailed, CTO-grade piece on SSTables — the immutable file format that powers Bigtable, Cassandra, LevelDB/RocksDB, HBase, and every LSM-based engine.
This article is designed for **Kavriq** and for **HLD interview mastery**.

---



### *The File Format Behind Bigtable, Cassandra, LevelDB, RocksDB, ScyllaDB & TiKV*

If the **LSM Tree** is the architecture, then the **SSTable (Sorted String Table)** is the building material.

Every major modern write-optimized datastore—Cassandra, Bigtable, HBase, LevelDB, RocksDB—relies on SSTables to persist data efficiently:

* Immutable
* Sorted
* Compressed
* Checksummed
* Indexed
* Easy to merge
* Perfect for sequential disk access

SSTables eliminate random writes, simplify concurrency, and enable the powerful compaction model that defines LSM trees.

This article breaks down **exactly how SSTables work**, what’s inside them, how databases use them, and why they have become the backbone of scalable storage systems.

---

## 🌄 **1. What Is an SSTable?**

An **SSTable** is an immutable, sorted file containing key-value pairs.

Properties:

* Keys are stored in strict sorted order
* Values are stored alongside keys
* Once written, file is never changed
* Organized into blocks/chunks
* Includes metadata, indexes, bloom filters

Being immutable removes the need for locking and eliminates in-place updates, allowing for very high write throughput and simple concurrency semantics.

---

## 📦 **2. Anatomy of an SSTable**

Although different systems have variations, the canonical SSTable contains:

```
|-------------------------|
|     Data Blocks         |
|-------------------------|
|     Index Block         |
|-------------------------|
|    Bloom Filter Block   |
|-------------------------|
|     Metadata Block      |
|-------------------------|
|         Footer          |
|-------------------------|
```

Let’s explore each in detail.

---

## 🧱 **3. Data Blocks (The Core Storage Unit)**

SSTables are divided into **blocks** (typically 4KB, 16KB, or 64KB).
Each block contains multiple key-value pairs in sorted order.

Example block:

```
key1 | value1
key2 | value2
key3 | value3
...
```

Blocks may be:

* compressed
* checksummed
* stored contiguously

Reads usually load entire blocks into memory.

### **Block Compression**

Common algorithms:

* Snappy
* LZ4
* ZSTD

Compression reduces storage footprint and I/O costs.

---

## 🗂️ **4. Index Block**

Because blocks are sorted, we only need one key per block to index them.

Index example:

```
"apple" → offset 0 KB
"banana" → offset 64 KB
"carrot" → offset 128 KB
...
```

During a read:

1. Binary search index block
2. Seek to block
3. Binary search inside block

Index block is **always stored in memory** (very small).

---

## 🌸 **5. Bloom Filter Block**

Bloom filters answer one question:

> “Is this key *not* present in this SSTable?”

If Bloom filter says **no**, engine avoids:

* disk seeks
* decompression
* block reads

This drastically reduces read amplification.

### Example:

If an LSM engine has:

* 1 memtable
* 3 Level-0 SSTables
* 10 Level-1 SSTables
* 20 Level-2 SSTables

Without bloom filters, read path = O(N SSTables).
With bloom filters, database checks only SSTables likely to contain the key.

Bloom filters are essential for high read throughput.

---

## 🧾 **6. Metadata Block**

Contains per-file metadata such as:

* number of entries
* number of blocks
* min/max key
* checksum info
* compression flags
* index + bloom filter offsets

This allows the engine to interpret the file without scanning.

---

## 🦶 **7. Footer**

Footer contains:

* pointer to index block
* pointer to metadata block
* magic number (file-type identifier)

The footer is always at a fixed offset from the end of the file (typically ~48 bytes).

This allows SSTables to be read **from the bottom**—very useful for random access.

---

## 🛠️ **8. How Writes Become SSTables**

Recall the LSM write path:

1. WAL append
2. Memtable update
3. Memtable becomes immutable
4. SSTable flush:

   * Sort entries (already sorted)
   * Write data blocks
   * Write bloom filter
   * Write index
   * Write metadata
   * Write footer

After flush:

* Memtable is discarded
* WAL segment is truncated or rotated
* New SSTable becomes part of Level-0

This is **steaming fast** because the entire file is written **sequentially**.

---

## 🔍 **9. Lookup Workflow: How Reads Happen**

When querying a key:

### **Step 1: Check Memtable**

If not found → continue.

### **Step 2: Check Immutable Memtable**

### **Step 3: Consult Bloom Filters for SSTables**

Skip SSTables where bloom filter says “absent”.

### **Step 4: For remaining SSTables:**

1. Load index block
2. Binary search index
3. Seek to block
4. Binary search block
5. Return value or tombstone

Because blocks are compressed and sizes predictable, this process is highly efficient.

---

## ♻️ **10. Merging SSTables (Compaction)**

Compaction merges sorted SSTables into newer SSTables:

```
SSTable1 + SSTable2 + SSTable3 → New SSTable
```

During compaction:

* Duplicate keys are overwritten
* Tombstones remove keys
* Keys become globally sorted per level
* Read amplification decreases
* Write amplification increases

Different compaction strategies:

### **Tiered (Size-tiered)**

Merge files of similar size.

### **Leveled**

Merge small files downward into larger levels, ensuring non-overlapping key ranges.

### **Time-windowed**

Optimize TTL-heavy workloads (e.g., time-series, logs).

---

## 🪦 **11. Tombstones: How Deletes Work in SSTables**

Deletes cannot modify files (they are immutable).
So deletes produce **tombstone records**.

Example:

```
PUT user123 → SSTable1
DELETE user123 → SSTable2 (tombstone)
```

During compaction:

* tombstone shadows old value
* removed permanently in new SSTable

Reads must check *newest version first*.

---

## ⚡ **12. Why SSTables Are So Fast**

Multiple reasons:

### 1. **Sequential disk writes**

No random I/O, ever.

### 2. **Immutable files**

No locks, no in-place updates, no corruption.

### 3. **Sorted data**

Easy to merge, search, and compress.

### 4. **Compression-friendly**

Adjacent keys share prefixes → excellent compression ratios.

### 5. **Checksums**

Guarantee corruption detection.

### 6. **Memory-resident index**

Fast binary search for blocks.

Together, these make SSTables perfect for modern workloads.

---

## 🛸 **13. How Major Databases Implement SSTables**

### **Bigtable (Google)**

* Origin of SSTable design
* Multi-level SSTables stored on GFS
* Heavy emphasis on tablet-level compaction

### **Cassandra**

* SSTables form the backbone of storage
* Bloom filters + partition index + partition summary
* Multiple compaction strategies
* Data center replication built on immutable files

### **LevelDB**

* Simpler, single-threaded SSTable implementation
* Two-level indexing
* Syncing and compression options

### **RocksDB**

* Highly optimized SSTable format
* Prefix compression
* Block cache
* Column families
* Tailored compaction for SSDs
* Widely used in distributed databases (CockroachDB, TiKV, Flink)

### **HBase**

* Modeled directly after Bigtable
* Stores SSTables in HDFS
* Uses HFile as SSTable equivalent

---

## 🆚 **14. SSTables vs B+Tree Pages**

| Feature             | SSTables                   | B+ Trees                   |
| ------------------- | -------------------------- | -------------------------- |
| Writes              | Sequential                 | Random                     |
| Updates             | Append new version         | In-place                   |
| Deletes             | Tombstones                 | In-place                   |
| Reads               | Multi-level                | Single tree                |
| Concurrency         | Easy (immutable)           | Complex (locking/latching) |
| Space overhead      | Higher (before compaction) | Lower                      |
| Range scans         | Excellent                  | Excellent                  |
| Write amplification | High (compaction)          | Moderate                   |
| Use cases           | Logs, analytics, KV stores | OLTP                       |

---

## 🧠 **15. Interview-Level Insights**

Memorize these insights—interviewers love them.

### **Q: Why are SSTables immutable?**

To avoid random writes and locking.
Immutability enables compaction and concurrency.

### **Q: Why do SSTables require bloom filters?**

To eliminate unnecessary disk reads across multiple SSTables.

### **Q: What is the biggest downside of SSTables?**

Compaction overhead → write amplification → potential stall.

### **Q: Why do LSM engines do prefix compression?**

Keys are sorted; adjacent keys share prefixes → huge compression gains.

### **Q: Why do range scans shine on SSTables?**

SSTables are sorted and often stored sequentially → fast contiguous reads.

---

## 🧭 **16. Summary: SSTables in One Perfect Sentence**

> SSTables store sorted, immutable, indexed, compressed key-value data in a format optimized for sequential writes and efficient merging—forming the backbone of all LSM-based databases.

If you understand SSTables, you understand the essence of log-structured storage.

---

## ✅ **Next Up: Article 5 — Compaction: The Hidden Cost Behind LSM Engines**

This next article will explain the *hardest and most misunderstood* component of LSM trees — compaction — and why it dominates performance in systems like RocksDB and Cassandra.

Shall I proceed with **Article 5**?
