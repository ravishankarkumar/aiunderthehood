---
title: "7. Buffer Pools, Caches & Page Replacement"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 7**, written at CTO-level depth and clarity for **Kavriq**.
This is one of the most misunderstood areas of database internals — and one of the most interview-relevant.

---



### *How Databases Actually Read, Cache, Flush & Manage Pages — and Why Performance Depends on It*

Databases don’t read rows.
They don’t read documents.
They don’t read individual keys.

They read **pages**.

Pages (usually 4KB–16KB) are the fundamental I/O unit inside relational engines.
Because disk I/O dominates performance, databases use sophisticated **buffer pools** and **caching layers** to minimize I/O, reduce latency, and manage dirty pages safely.

Understanding buffer pools is essential for designing scalable OLTP systems and answering senior-level HLD questions.

This article covers:

* Why databases need their own buffer pool
* OS page cache vs DB buffer pool
* Dirty pages & write-back semantics
* WAL interaction
* Page eviction strategies (LRU, CLOCK, 2Q)
* Read-ahead, sequential scans & prefetching
* Real-world behaviors in PostgreSQL & InnoDB
* Interview-ready mental models

---

## 🧠 **1. Why Databases Don’t Just Rely on the OS Page Cache**

Linux already provides a global page cache — so why do databases reinvent caching?

Because OS page cache:

* has **no knowledge of transactions**
* doesn’t understand **WAL ordering**
* can’t control **dirty page flushing semantics**
* isn’t aware of **MVCC visibility rules**
* evicts pages blindly
* cannot optimize for index-page locality
* cannot coordinate with buffer management policies

Databases need *deterministic, transactional I/O* — not best-effort caching.

Thus, nearly every major database implements its own buffer pool:

* PostgreSQL: **Shared Buffers**
* MySQL InnoDB: **Buffer Pool**
* Oracle: **Buffer Cache**
* SQL Server: **Buffer Manager**

LSM engines (RocksDB) use a **block cache**, which is similar in design but optimized for SSTables.

---

## 📦 **2. What Is a Buffer Pool?**

A buffer pool is an in-memory region where the database stores:

* recently read pages
* updated (dirty) pages
* index pages
* heap pages
* catalog metadata

Every page in the database has:

* **a buffer pool entry**
* **a dirty flag**
* **a pin count**
* **a latch (page-level lock)**
* **a recency/usage metric**

The buffer pool is the *hot working set* of the database.

---

## 🧱 **3. Page Reads: The Real Read Path**

When a query requests a row:

### Step 1 — Determine page number

Databases know where rows live by calculating:

```
table + block number + tuple offset
```

### Step 2 — Check buffer pool

If page exists in buffer pool → return immediately.

### Step 3 — Otherwise, fetch from disk

Database issues:

```
pread(fd, page_buffer, 16KB, offset)
```

Page is then inserted into the buffer pool via the page replacement algorithm.

### Step 4 — Apply MVCC visibility

PostgreSQL filters out invisible tuples.
InnoDB follows undo log chains if needed.

---

## 🔥 **4. Dirty Pages & Write-Back Semantics**

When a transaction updates a row:

1. The page is loaded into buffer pool
2. Update is applied to the in-memory copy
3. Page is marked **dirty**
4. WAL record is immediately logged and fsync’d
5. Page is *not* written to disk immediately
6. Later, a **checkpoint** or **background writer** flushes the page

This process is called **write-back caching**.

Crashes do NOT lose data because:

> WAL is flushed synchronously
> Dirty pages are flushed asynchronously
> WAL replay rebuilds missing pages

This is the core reason WAL + buffer pool work together.

---

## 🧼 **5. Checkpointing: Making WAL Replays Shorter**

Without checkpoints, recovery would require replaying **all** WAL records.

Checkpoints:

* flush dirty pages
* write checkpoint LSN
* allow WAL segments before LSN to be recycled

Too frequent checkpoints → I/O storms
Too infrequent → long crash recovery, bloated WAL directory

Tuning checkpoint frequency is critical for PostgreSQL and InnoDB.

---

## 🔁 **6. Page Replacement: LRU, CLOCK, 2Q, LRU-K**

When buffer pool is full, the database must evict a page.

It chooses a page based on a replacement algorithm.

## **A. Classic LRU (Least Recently Used)**

Evict oldest page in terms of last access.

Problems:

* sequential scans destroy LRU by evicting hot pages
* doesn’t handle locality well

Very few modern databases use pure LRU.

---

## **B. CLOCK Algorithm**

Used by Linux kernel and many DB engines.

A circular buffer of pages:

* Pages have “reference bits”
* CLOCK sweeps until it finds a page with ref=0
* Efficient, constant-time eviction

Good balance of simplicity and performance.

---

## **C. LRU-K / 2Q / ARC**

More sophisticated algorithms track multiple access histories:

### **2Q (used in PostgreSQL)**

Keeps two queues:

* A1: recently accessed once
* Am: frequently accessed

Prevents sequential reads from polluting cache.

### **LRU-K**

Tracks past K accesses to predict true “hotness.”

### **ARC (Adaptive Replacement Cache)**

Automatically balances recency and frequency.

Oracle and ZFS popularized ARC.

---

## 📖 **7. Read-Ahead & Sequential Scan Optimization**

Databases often predict future reads based on access patterns.

### Sequential Scan Example

If reading pages:

```
10, 11, 12, 13…
```

Database issues prefetches:

```
read-ahead(14-20)
```

Benefits:

* fewer I/O stalls
* maximizes SSD throughput
* compensates for slow random I/O

### Index Scan Read-Ahead

Index scans also benefit if keys are accessed in sorted order.

RocksDB performs block prefetching during iteration.

---

## ⚙️ **8. Buffer Pool Tuning in PostgreSQL**

PostgreSQL has two major caches:

### **1. Shared Buffers**

Internal page cache.

### **2. OS Page Cache**

Stores file system pages.

Postgres encourages a **balanced split**:

* Shared Buffers: often 25–40% of RAM
* OS Page Cache: remainder

Pitfall: making shared_buffers too large reduces OS caching benefit.

### Important parameters:

* `shared_buffers`
* `effective_cache_size`
* `checkpoint_timeout`
* `checkpoint_completion_target`
* `wal_buffers`

---

## 📚 **9. Buffer Pool Tuning in InnoDB**

InnoDB uses a **single large buffer pool**:

* contains both index pages & table pages
* uses “young” and “old” LRU sublists
* automatically separates sequential scan pages (inserted into old list)

Key parameter:

* `innodb_buffer_pool_size`
* should typically be **70–80% of RAM** on dedicated servers

InnoDB does **asynchronous flushing** controlled by:

* `innodb_max_dirty_pages_pct`
* `innodb_flush_neighbors`
* `innodb_io_capacity`

The buffer pool is arguably the most important InnoDB tuning knob.

---

## 🧱 **10. Buffer Cache in RocksDB (LSM World)**

Unlike B+ tree engines:

* RocksDB caches **blocks**, not pages
* These blocks come from SSTables
* Block cache handles compression-aware caching
* Prefix bloom filters enhance cache locality

RocksDB tuning involves:

* block cache size
* block size
* bloom filter bits
* charge metadata to cache or not

This drastically affects read amplification.

---

## ❌ **11. Why You MUST Know This for HLD Interviews**

Many senior-level system design interviews include:

* “Why do databases use their own buffer pool instead of relying on OS page cache?”
* “What happens during checkpointing?”
* “How do dirty pages interact with WAL?”
* “Why does sequential scanning evict hot pages?”
* “How does PostgreSQL avoid LRU trashing?”
* “How would you tune a buffer pool for mixed OLTP workloads?”

Understanding buffer pools is a **core competency** for designing data-heavy systems.

---

## 🎯 **12. Interview Mental Models**

Memorize these:

### **Readers don’t hit disk if pages are cached.**

This is the *real* reason buffer pools matter.

### **Dirty pages aren’t durable until WAL is flushed.**

Critical correctness rule.

### **LRU alone is insufficient. Real systems use variants** (CLOCK, 2Q, ARC).

### **Sequential scans can destroy cache unless mitigated.**

### **Buffer pool tuning = defining the working set.**

### **Checkpoints prevent unbounded WAL growth.**

---

## 🧭 **13. Summary in One Sentence**

> A database buffer pool is a specialized, transactional-aware page cache that manages reads, dirty writes, eviction, and durability far more intelligently than the OS page cache—making it essential for high-performance OLTP systems.

---

## ✅ **Next: Article 8 — Query Execution & Optimization: What Really Happens During SELECT**

Shall I proceed with **Article 8**?
