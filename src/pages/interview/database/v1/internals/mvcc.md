---
title: "6. MVCC: High-Concurrency Reads & Writes Without Locks"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 6**, a deep, comprehensive, interview-ready, CTO-level explanation of **MVCC** — the concurrency model powering PostgreSQL, MySQL InnoDB, Oracle, CockroachDB, TiDB, and countless transactional systems.

This article is written in the same polished tone as the previous ones — perfect for **Kavriq**.

---



### *How Databases Allow Readers and Writers to Run in Parallel Without Blocking Each Other*

Modern OLTP databases must support **massive read concurrency** and **high write throughput** at the same time.

A naive locking model quickly collapses:

* Writers block readers
* Readers block writers
* Long-running queries cause deadlocks
* Transaction throughput dies under contention

To solve this, almost every advanced relational engine today uses **MVCC (Multi-Version Concurrency Control)** — a brilliant design that gives the *illusion* of serial execution while allowing extreme parallelism.

MVCC enables:

* **Non-blocking reads**
* **Snapshot isolation**
* **Readers to see a consistent past version**
* **Writers to modify future versions**
* **Minimal locking**
* **High throughput under concurrency**

PostgreSQL, MySQL InnoDB, Oracle, CockroachDB, TiDB, YugabyteDB, and SQL Server all rely on MVCC (with variations).

This article explains:

* What MVCC is
* Why snapshot isolation matters
* How version chains work
* Undo/redo logs
* Garbage collection (VACUUM)
* How PostgreSQL and InnoDB implement MVCC
* Interview questions and mental models

---

## 🌍 **1. The Fundamental Concurrency Problem**

Suppose we store:

```
user(id = 42, balance = 100)
```

Two queries run in parallel:

```
T1: SELECT balance FROM user WHERE id = 42;
T2: UPDATE user SET balance = 50 WHERE id = 42;
```

### Without MVCC:

* If T2 updates first → T1 sees updated value (inconsistent snapshot)
* If T1 reads first → T2 must wait for T1 to finish (blocking)

Neither option is desirable.

### With MVCC:

* **Readers never block writers**
* **Writers never block readers**
* Each gets its own **snapshot of the database at a particular point in time**

This solves the concurrency problem elegantly.

---

## 📸 **2. Snapshot Isolation: The Core Idea**

Every transaction in MVCC sees a **consistent snapshot** of the database:

* All rows visible at the time the transaction started
* No uncommitted data from other transactions
* No changes made after the snapshot

This gives the illusion that each transaction runs at its own “moment in time.”

### Mental Model

> Imagine every transaction living inside its own “photograph” of the database.

This photograph may include older row versions, even if newer versions exist.

---

## 🔗 **3. Version Chains: How MVCC Stores Multiple Versions**

Instead of modifying rows in-place, MVCC engines create **new versions**.

### Example

Transaction T1 updates:

```
UPDATE user SET balance = 50 WHERE id = 42;
```

MVCC stores:

```
Row Version 1 (old): balance = 100
Row Version 2 (new): balance = 50
```

These versions link together:

```
[Version 2] → [Version 1] → null
```

Readers choose which version to see based on timestamps.

Writers append new versions — *never modify the old one*.

This is the magic that enables non-blocking concurrency.

---

## 🧮 **4. MVCC and Timestamps**

Every version has:

* **created_by_txn_id**
* **deleted_by_txn_id** (optional)
* **commit timestamp**
* **visibility rules based on transaction snapshot**

Visibility rules ensure that:

* Readers never see uncommitted data
* Writers do not overwrite data visible to older snapshots
* Conflicts are detected at commit time

---

## 🔄 **5. Undo/Redo Logging (MVCC Internals)**

To maintain multiple versions, MVCC engines use:

### **Undo Logs**

Store *old versions* when new versions are written.
Readers can reconstruct older snapshots by following undo chains.

### **Redo Logs (WAL)**

Store redo operations for crash recovery.

Different databases split these responsibilities differently.

Example:

| Database             | What Stores Old Versions?                   |
| -------------------- | ------------------------------------------- |
| **PostgreSQL**       | old versions stored *in the heap itself*    |
| **MySQL InnoDB**     | old versions stored in *undo logs*          |
| **Oracle**           | rollback segments (undo)                    |
| **CockroachDB/TiDB** | MVCC versions stored as KVs with timestamps |

---

## 🧱 **6. MVCC in PostgreSQL (Tuple-Based, No Undo Logs)**

PostgreSQL stores row versions **in the table heap itself**.

Each tuple contains metadata:

* **xmin** → transaction that created it
* **xmax** → transaction that invalidated it
* MVCC visibility rules determine whether tuple is visible

If a row is updated:

```
Old tuple remains  
New tuple inserted  
Old → New linked via HOT chain (if possible)
```

PostgreSQL relies heavily on **VACUUM** to clean dead tuples.

### Benefits:

* Simple implementation
* No separate undo space
* Great for OLTP read workloads

### Downsides:

* Table bloat
* Vacuum tuning required
* HOT optimization reduces index churn but not always applicable

---

## 🗄️ **7. MVCC in InnoDB (Undo Logs + Primary Key Clustered Storage)**

InnoDB stores old versions in **undo logs**.

Row layout:

```
Clustered Index → Latest Version
Undo Log → Older Versions
Undo Log → Older Version
```

Reads must:

* Inspect clustered index
* Follow undo log chain if snapshot requires older version

InnoDB automatically garbage collects undo segments once no snapshot references them.

### Benefits:

* Avoids table bloat
* Efficient clustered index updates
* Good for high-volume writes

### Downsides:

* Undo log growth under long transactions
* Purge threads must be tuned
* Long SELECTs stall garbage collection

---

## 🧼 **8. Garbage Collection: VACUUM, Purge, and TTL**

MVCC creates dead versions over time.
GC is required to reclaim storage.

### **PostgreSQL — VACUUM**

Two types:

* **Regular VACUUM**: Remove dead tuples, update visibility map
* **VACUUM FULL**: Rebuild entire table (heavy)

Vacuuming too infrequently → bloat
Vacuuming too aggressively → I/O spikes

### **InnoDB — Purge Threads**

Undo log entries are removed when:

* All referencing snapshots have ended
* Purge threads free undo pages

### **LSM MVCC (CockroachDB/TiDB)**

Old KV versions removed by:

* periodic GC
* compaction-based cleanup

GC behavior is driven by TTLs or timestamp cleanup policies.

---

## 🚧 **9. How MVCC Avoids Reader/Writer Blocking**

### **Readers do NOT block writers**

Readers simply choose an older version from version chain.

### **Writers do NOT block readers**

Writers append a new version; old version remains for active snapshots.

### **Only writer-writer conflicts require locking or aborting**

Two writers modifying the same row → conflict detection.

This model allows databases to handle **massive concurrency with minimal locking.**

---

## ⛓️ **10. MVCC and Isolation Levels**

Snapshot isolation provides a strong baseline.
Different databases map it differently:

| SQL Isolation Level | MVCC Behavior                                                |
| ------------------- | ------------------------------------------------------------ |
| Read Uncommitted    | still usually sees committed versions                        |
| Read Committed      | sees only committed rows, new versions visible per statement |
| Repeatable Read     | sees same snapshot for entire transaction                    |
| Serializable        | detects anomalies and aborts conflicting transactions        |

PostgreSQL’s **Repeatable Read** = Snapshot isolation
InnoDB’s **Repeatable Read** = stronger due to gap locks

---

## 🔥 **11. MVCC vs Locks: Why MVCC Wins for OLTP**

| Feature            | Locks         | MVCC                  |
| ------------------ | ------------- | --------------------- |
| Reads block writes | Yes           | No                    |
| Writes block reads | Yes           | No                    |
| Deadlocks          | Common        | Reduced significantly |
| Historical reads   | Impossible    | Easy                  |
| Throughput         | Poor at scale | Excellent             |

MVCC dramatically increases concurrency without compromising correctness.

---

## 🧠 **12. Common MVCC Problems in Production**

### **1. Long-running queries → bloat**

Long SELECTs in PostgreSQL keep old row versions alive indefinitely.

### **2. Undo log explosion**

InnoDB undo logs can grow until purge threads catch up.

### **3. Vacuum misconfiguration**

Autovacuum too slow → table bloat
Autovacuum too fast → I/O bottleneck

### **4. Writer starvation or aborted transactions**

Serializable isolation detects anomalies → aborts transactions

### **5. Timestamp skew in distributed MVCC**

CockroachDB uses hybrid logical clocks (HLC)
TiKV uses PD servers for timestamp allocation

---

## 🎯 **13. Interview Mental Models for MVCC**

### **Q: How does MVCC avoid read-write conflicts?**

By returning older versions for readers and creating new versions for writers.

### **Q: Why doesn’t PostgreSQL need undo logs?**

Old versions are stored inline in heap; visibility rules determine which is valid.

### **Q: How does InnoDB perform MVCC?**

Clustered index holds latest version; undo logs store older versions referenced by snapshot.

### **Q: What is vacuum? Why is it needed?**

Vacuum removes dead tuples; otherwise storage grows indefinitely.

### **Q: What anomaly does snapshot isolation fail to prevent?**

Write skew.

### **Q: Why does MVCC simplify concurrency?**

Because readers never block writers, eliminating many lock-based bottlenecks.

---

## 🧭 **14. Summary: MVCC in One Line**

> MVCC allows high concurrency by storing multiple versions of data and letting each transaction view a consistent snapshot without blocking others.

Understanding MVCC is crucial for designing and tuning real OLTP databases.

---

## ✅ **Next: Article 7 — Buffer Pools, Caches & Page Replacement**

This next article will dive into how databases actually **read and manage data pages**, why they rely on buffer pools, how caching interacts with WAL and MVCC, and why page replacement algorithms matter in real-world performance.

Should I proceed with **Article 7**?
