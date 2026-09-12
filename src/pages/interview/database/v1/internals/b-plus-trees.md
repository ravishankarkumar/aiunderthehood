---
title: "2. B+ Trees: The OLTP Workhorse"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 2**, written in long, detailed CTO-level depth—perfect for Kavriq and for interview prep.
This follows the series’ tone: educational, technically authoritative, and packed with practical insights.

---



### *Why Every Relational Database Still Depends on This 50-Year-Old Data Structure*

If you strip a relational database down to its core, beyond SQL parsing, MVCC, buffer pools, and WAL… you reach the beating heart of OLTP performance:

> **The B+ Tree index.**

Every `WHERE id = 42` query…
Every `ORDER BY created_at`…
Every primary-key lookup…
Every range scan…
Every clustered table in InnoDB…

All depend on the B+ Tree.

This article deep-dives into **why** B+ Trees dominate, **how** they work internally, and the real-world details interviewers expect senior engineers to understand: node layouts, page splits, fill factors, hot pages, secondary indexes, clustered vs non-clustered designs, and performance trade-offs.

---

## 🌳 **1. Why Not a Normal Tree? Or a Hash Table? Or an LSM Tree?**

Before understanding *how* B+ Trees work, you must understand *why* they exist at all.

### **Why not a binary tree?**

Because a binary tree stores **one key per node**, causing:

* height ≈ O(log₂N)
* many disk accesses

Disk reads are extremely expensive. CPUs are fast. Storage is slow.
We need a tree with **minimal height**.

### **Why not a hash table?**

Hash tables:

* Are fast for point lookups
* But terrible for **range scans**
* Cannot preserve order
* Cannot answer “give me next 100 rows sorted by timestamp”

SQL relies heavily on order.

### **But why not LSM trees?**

LSM trees optimize **writes**, not point reads.
B+ Trees optimize **reads**, not writes.

For OLTP (e.g., banking systems, ecommerce), **low-latency point lookups** dominate.

Thus:

> **OLTP workload → B+ Tree**
> **Write-heavy analytics / streaming → LSM Tree**

---

## 📐 **2. B+ Tree Design Goals**

B+ Trees were created specifically to optimize disk access.

They maximize 3 things:

### **1. High fan-out (branching factor)**

Each node contains **hundreds of keys**, not one.
So the tree height is tiny—often just 2–4 levels for millions of rows.

### **2. Disk-page alignment**

Nodes are sized to match hardware pages (usually 4KB or 16KB).
Thus each tree node = one disk I/O.

### **3. Sequential leaf nodes**

All values are stored in leaf nodes, which are linked together to allow fast range scans.

This structure enables relational databases to execute:

* point lookups
* prefix queries
* range queries
* ordered scans

…with minimal disk I/O.

---

## 📦 **3. Node Layout: What’s Inside a B+ Tree Page**

A B+ Tree node typically contains:

### **Internal node**

```
[ key1 | pointer1 ] [ key2 | pointer2 ] ... [ keyN | pointerN ]
```

It doesn’t contain actual data—only keys and child pointers.

### **Leaf node**

```
[ key1 | value1 ]
[ key2 | value2 ]
...
[ next_leaf_pointer ]
```

Key properties:

* All data is stored **only** in leaves
* Leaves are linked for fast sequential traversal
* Internal nodes guide search like a routing table

---

## 📏 **4. Fan-Out and Tree Height**

Assume:

* Page size = 16 KB
* Each key = 16 bytes
* Each pointer = 8 bytes
* Node overhead ≈ small

Roughly:

```
16 KB / 24 bytes ≈ 700 keys per node
```

Meaning a branching factor of ~700.

### **Tree height estimates**

* With fan-out 700:

  * Level 1: root → 700 children
  * Level 2: 700² ≈ 490,000 rows
  * Level 3: 700³ ≈ 343 million rows

Thus:

> Even a 300M-row table often has height = 3.

And point lookup = 3 page reads.

---

## 🔀 **5. Search Path: Step-by-Step**

To find a key:

1. Read root page
2. Binary search inside root
3. Follow pointer to correct child
4. Repeat until leaf
5. Binary search leaf and return result

Because nodes fit in memory (buffer pool), most reads become memory hits rather than disk reads.

---

## ⚡ **6. Inserts: The Real Complexity**

Inserting a new record requires:

1. Navigate to correct leaf
2. Insert key into sorted array
3. If page has space → done
4. If page is full → **split**

### **Page Split Example**

Leaf has keys:

```
10 | 20 | 30 | 40 | 50
```

Insert `35`.

If overflow, split:

Left page:

```
10 | 20 | 30
```

Right page:

```
35 | 40 | 50
```

Propagate new separator key (`35`) up to parent.

If parent overflows → parent splits → can cascade to root → may increase tree height.

This is rare but essential to understand.

### **Interview Tip**

**Page splits cause write amplification.
They are the primary reason OLTP databases slow down under heavy insert loads.**

---

## 🪣 **7. Fill Factor: The Secret to Better Insert Performance**

To avoid frequent splits, databases leave some empty space in index pages.

Example: fill factor = 80%
Leaves 20% free pages reserved for future inserts.

Benefits:

* Fewer splits
* Improved write performance
* Balanced tree height

Downside:

* More disk space
* More memory for buffer pool

In high-write workloads, tuning fill factor = cheap way to avoid index fragmentation.

---

## 🔥 **8. Hot Pages: The Hidden Bottleneck**

Some keys get accessed or inserted frequently:

* auto-increment primary keys
* timestamps
* ordered UUIDs
* monotonically increasing sequences

This causes:

* hot leaf nodes
* hot root nodes
* latch contention
* reduced concurrency

### Example: `PRIMARY KEY (id)` auto-increment

All inserts → rightmost leaf page → single hot page → severe contention.

This is why big systems use:

* randomized UUIDs
* sharded keyspaces
* timestamp + random suffix (Snowflake IDs)

To reduce hot-spot pressure.

---

## 🧩 **9. Clustered vs. Secondary Indexes**

### **Clustered Index (InnoDB)**

The table *is stored as a B+ Tree*.
Leaf nodes store the actual row data.

This means:

```
SELECT * WHERE id = X
```

requires only **one** tree lookup.

Great for:

* OLTP
* primary key queries
* range scans

### **Secondary Index**

Leaf nodes store:

```
secondary_key → primary_key
```

To fetch row:

1. Search secondary index
2. Get primary key
3. Search clustered index → fetch row

This is called a **double lookup**.

It’s why adding many secondary indexes slows down writes.

---

## 🔗 **10. Linked Leaf Chains: Range Scan Superpower**

All leaf nodes include a pointer to the next leaf.

Example:

```
Leaf 1 → Leaf 2 → Leaf 3 → ...
```

This enables efficient execution of:

```sql
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
```

Database:

1. Finds leaf containing 20
2. Reads sequential leaf pages until > 30

Leaf chaining is the entire reason B+ Trees outperform other data structures for SQL workloads.

---

## 📑 **11. B+ Tree vs. LSM Tree (The Real Trade-Off)**

| Feature     | B+ Tree                 | LSM Tree                  |
| ----------- | ----------------------- | ------------------------- |
| Writes      | random, expensive       | sequential, fast          |
| Reads       | very fast point lookups | slower, multiple levels   |
| Space       | efficient               | compaction overhead       |
| Range scans | excellent               | good but requires merging |
| Use case    | OLTP                    | analytics, logs, caches   |

This is why:

* PostgreSQL, MySQL → B+ Tree
* Cassandra, RocksDB, Bigtable → LSM Tree

Choose depending on workload.

---

## 🗄️ **12. Real-World Implementations**

### **MySQL InnoDB**

* Table = clustered B+ Tree
* PK determines row order
* Secondary indexes reference PK
* Page size = 16 KB
* Insert buffer for secondary index optimization

### **PostgreSQL**

* Indexes = B+ Trees
* Table = heap-organized, not clustered
* HOT updates (Heap-Only Tuples) reduce index updates
* Supports BRIN/GiST/GIN but B+ Tree is default

### **SQLite**

* Single file
* B+ Trees everywhere
* Variable page sizes

### **SQL Server**

* Clustered + non-clustered indexes
* Fragments pages aggressively when fill factor poorly chosen

---

## 🧪 **13. Micro-Observation: Why B+ Trees Are Stable Under OLTP**

* 99% of nodes fit in buffer pool
* Only leaf nodes churn under writes
* Splits are rare but manageable
* Range scans use sequential I/O
* Hot pages naturally cache well
* Optimizers understand B+ trees deeply

This stable behavior is why B+ Trees have dominated relational systems for 40+ years.

---

## 🎯 **14. Interview Mental Models**

### **Q: Why aren’t B+ Trees height-balanced issues like binary trees?**

Because fan-out is huge → height is tiny and stable.

### **Q: Why do inserts slow down over time?**

Page splits, fragmentation, fill factor exhaustion, and hot-page contention.

### **Q: Why is range scan performance excellent?**

Linked leaves enable sequential traversal.

### **Q: Why is primary key choice critical in InnoDB?**

It determines physical row order → impacts clustering, fragmentation, secondary index costs.

### **Q: Why is B+ Tree better than a hash index for SQL?**

Supports ordering, ranges, pagination, and prefix queries.

---

## 🧭 **15. Summary: Why B+ Trees Dominate OLTP**

B+ Trees:

* Are optimized for disk I/O
* Provide predictable performance
* Enable efficient point lookup + range scan
* Support ordered queries
* Minimize tree height
* Work extremely well with buffer pools and WAL
* Integrate perfectly with relational query engines

This is why PostgreSQL, MySQL, SQL Server, Oracle, and SQLite all rely on B+ Trees as their default index.

Even with the rise of LSM trees, B+ Trees remain the gold standard for **OLTP workloads**.

---

## ✅ **Next: Article 3 — LSM Trees: The Write-Optimized Revolution**

Would you like Article 3 now?
