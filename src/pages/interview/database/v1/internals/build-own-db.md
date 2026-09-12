---
title: "12. Build Your Own Storage Engine (Capstone)"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Perfect — here is the **Capstone Article 12**, the ultimate hands-on piece of this series.
This is where we combine *everything* you learned so far — WAL, memtables, SSTables, compaction, MVCC, caching, quorums — and design a minimal but real **RocksDB-like storage engine**.

This article is long, detailed, and extremely interview-relevant.
Perfect for **Kavriq**.

---



### *A Step-by-Step Blueprint for Designing an LSM-Based Key-Value Store*

This is the final article in the series — the one that shows how every concept fits together into a real system design.

We will build a conceptual RocksDB-like storage engine:

* Write-Ahead Log
* Memtable
* Immutable Memtables
* SSTable builder
* Block-based storage
* Bloom filters
* Compaction engine
* Read path with merging
* Optional MVCC
* Optional caching

This article is both:

* A practical blueprint for implementing an LSM engine
* An interview-grade explanation of how modern KV stores work internally

Let’s begin.

---

## 🧱 **1. Architecture Overview**

Your storage engine will have the following components:

```
┌──────────────────────────────────────────┐
│                  Client                  │
└──────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────┐
│                 API Layer                │
│     put(key,value), get(key), delete     │
└──────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────┐
│               Write Path                 │
│ WAL → Memtable → Immutable → SSTable     │
└──────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────┐
│            Storage Engine Core           │
│ SSTables + Bloom Filters + Index Blocks  │
└──────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────┐
│               Compaction                 │
└──────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────┐
│                Read Path                 │
│ Bloom Filters → Block Cache → Merge Read │
└──────────────────────────────────────────┘
```

This is the classic LSM Tree architecture.

---

## 🧨 **2. Write Path (WAL + Memtable)**

A real LSM engine **never loses a write** because it uses:

## **A. Write-Ahead Log (WAL)**

Every write is appended:

```
[op type][key][value][timestamp/checksum]
```

WAL is fsync’d periodically (or after every write if durability=strong).

WAL makes writes durable even before memtable flush.

---

## **B. Memtable**

Next, mutation is applied to an in-memory structure:

* Skiplist (RocksDB, LevelDB)
* Red-Black tree
* B-tree variant

Memtable properties:

* Sorted
* Fast inserts
* Supports read path
* Holds newest versions

Once memtable exceeds size threshold:

1. Mark as **immutable memtable**
2. Create a new memtable
3. Flush immutable memtable to SSTable asynchronously

This is how LSM trees achieve high write throughput.

---

## 🧱 **3. SSTable Format (Your On-Disk Data Structure)**

Your SSTable will contain:

```
Data Blocks
Index Block
Bloom Filter Block
Footer (metadata offsets)
```

---

## **A. Data Blocks**

Sorted key-value pairs, compressed optionally.

Block format:

```
restart_points_count
restart_point_1_offset
restart_point_2_offset
...
encoded_key_value_data
checksum
```

RocksDB uses prefix compression within blocks.

---

## **B. Index Block**

Contains:

```
[first_key_in_block] → block_offset
```

Stored in memory for fast lookups.

---

## **C. Bloom Filter**

Probabilistically determines if a key **cannot** be inside the SSTable.

Huge read amplification reduction.

---

## **D. Footer**

Pointers to index block, filter block, metadata.

---

## 🔍 **4. Read Path (Merge Across Memtable + SSTables)**

Reads work like this:

1. Check memtable
2. Check immutable memtables
3. For each SSTable level (starting from newest):

   * Consult bloom filter
   * If positive → load block via index
   * Binary search block
4. Return newest visible version

LSM reads are log-structured, so we merge across versions.

Optional: implement **Seek()** using iterators like real KV stores.

---

## 🧱 **5. Compaction Engine (The Hardest Part)**

Compaction merges SSTables to:

* collapse overwritten keys
* drop tombstones
* maintain sorted ranges per level
* reduce read amplification
* enforce size limits

You can implement either:

---

## **A. Tiered Compaction (Simplest)**

When K SSTables of similar size exist:

```
merge them into one file
```

Pros: low write amplification
Cons: high read amplification

---

## **B. Leveled Compaction (RocksDB)**

SSTables organized into levels:

* L0: flushed files
* L1: non-overlapping key ranges
* L2: 10× size of L1
* L3: etc.

Compaction triggers when a level exceeds quota.

Pros: predictable read performance
Cons: higher write amplification

---

## **C. Compaction Iterator**

Reads keys from multiple SSTables:

* merges versions
* applies tombstones
* outputs sorted key-value stream
* writes new SSTable

This is where the engine spends most CPU.

---

## 🪦 **6. Tombstones & Deletes**

Deletes create:

```
(key, tombstone_flag, timestamp)
```

Compaction removes old versions and tombstones once safe.

Reads must:

* prefer newest version
* ignore older versions
* treat tombstone as "key deleted"

---

## 🧠 **7. Optional Feature: MVCC Layer**

If you want multi-version concurrency (like CockroachDB or TiKV), store:

```
(key, timestamp) → value
```

On disk, KV pairs become:

```
user123#1692324281000 → 'balance=50'
user123#1692324189000 → 'balance=40'
```

Reads filter by timestamp and choose the correct snapshot.

Optional advanced features:

* snapshot reads
* transactional write-write conflict detection

---

## 🧮 **8. Optional Feature: Block Cache (Like RocksDB)**

Hot data is cached:

* index blocks always in memory
* filter blocks always cached
* data blocks selectively cached

Algorithms:

* LRU
* CLOCK
* ARC
* HyperClockCache (RocksDB)

Block cache dramatically improves read performance.

---

## 🏎️ **9. Optional: Write Buffer Manager**

Controls how much memory memtables can use before forcing flushes.

Important for many-column families.

---

## 🏗️ **10. Putting It All Together: Full System Flow**

Here is the full write → flush → compaction → read lifecycle:

---

## **Write Flow**

```
append to WAL
↓
insert into memtable
↓
if memtable full:
    freeze as immutable memtable
    flush immutable → new SSTable
↓
background compaction runs continuously
```

---

## **Read Flow**

```
lookup in memtable
↓
lookup in immutable memtables
↓
for L0 → Ln:
    bloom filter check
    index lookup → block read
↓
merge results and return newest version
```

---

## **Compaction Flow**

```
select SSTables
↓
open iterators in sorted order
↓
merge keys, resolve versions, drop tombstones
↓
write new SSTable
↓
delete old SSTables
```

---

## 🎯 **11. Interview-Level Questions**

### **1. How would you design a high-throughput storage engine?**

Answer with LSM + WAL + memtable + leveled compaction.

### **2. Why not use B+ trees?**

Explain random writes, page splits, write amplification.

### **3. How do you handle deletes?**

Tombstones + compaction purge.

### **4. How do you make compaction efficient?**

Iterators, bloom filters, merging sorted streams.

### **5. How do you guarantee durability?**

WAL fsync semantics.

### **6. How do you handle crash recovery?**

Replay WAL → rebuild memtable → resume compaction.

### **7. How do you reduce read amplification?**

Leveled compaction + bloom filters + block cache.

### **8. How do you detect key visibility in MVCC?**

Timestamp comparison + version chain logic.

### **9. How would you shard this engine across multiple nodes?**

Consistent hashing + replication + hinted handoff + anti-entropy.

---

## 🧭 **12. Summary in One Sentence**

> A modern storage engine uses WAL + memtables + immutable SSTables + compaction + bloom filters + caching to provide high write throughput, efficient reads, durability, and predictable long-term performance.

---

## 🎉 **Capstone Complete**

This article closes the **Database Internals for System Design Interviews** series.

If you'd like:

✅ A **PDF eBook** combining all articles
✅ Visual diagrams for each article
✅ A GitHub repo with a reference LSM-tree implementation
✅ A landing page auto-generated for Kavriq
✅ Or to continue with **Bonus Articles** (e.g., Raft, Spanner TrueTime, Query Optimizer Deep Dive, etc.)

I can generate all of that next.

What would you like to do?
