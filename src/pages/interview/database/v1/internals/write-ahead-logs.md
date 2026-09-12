---
title: "1. Write-Ahead Logs & Durable Write Paths"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 1**, written as a **long-form, CTO-level technical deep dive**.
It is structured for readability and SEO: clear sections, diagrams (described verbally), examples, and interview-ready explanations.

You can publish this directly on **Kavriq**.

---



### *The Foundation of Every Reliable Storage Engine*

When people imagine databases, they picture tables, indexes, B+ trees, and queries.
But the true foundation of every durable storage system—PostgreSQL, MySQL, Cassandra, Bigtable, Kafka, MongoDB, RocksDB—is a deceptively simple mechanism:

> **Write-Ahead Logging (WAL)**
> Before updating data, *first write the intent to a durable, append-only log*.

Without WAL, databases would lose data on crash, corrupt indexes, or leave updates half-applied.
With WAL, systems recover to a consistent state—even after power loss—by replaying recorded operations.

This article dives deep into **how WAL works**, **why it exists**, and **how real databases implement durable write paths**.

---

## 🔥 **1. Why Do We Need WAL?**

Imagine a simple database storing data in pages on disk.

If you update a record:

1. Load the page into memory
2. Modify bytes
3. Write the page back to disk

But what if the system crashes **mid-write**?

* The page may be half-written (torn page)
* The index might point to invalid data
* The database could be left irrecoverably corrupt

### The solution: **never modify primary data files first**.

Instead:

1. **Append** the change to a sequential log (cheap on disk).
2. **Fsync** the log entry (make it durable).
3. Then apply the change to in-memory data structures.
4. Later, flush updated pages asynchronously.

This is WAL.

It turns **expensive, random writes** into **cheap, sequential appends**.

---

## ⚙️ **2. The WAL Write Path: How a Single Write Actually Happens**

Let’s break down a single write in a database like PostgreSQL.

### **User issues:**

```sql
UPDATE users SET balance = balance - 100 WHERE id = 42;
```

### **Database workflow:**

#### **Step 1 — Generate a WAL Record**

The database creates a logical or physical description of the change:

* "In page X, offset Y, reduce balance by 100"
  OR
* "UPDATE users SET balance = balance - 100 WHERE id = 42"

This is small and sequential.

#### **Step 2 — Append to the WAL buffer**

The WAL record goes into memory first.

#### **Step 3 — Fsync (Critical!)**

The WAL buffer is flushed to disk:

```
fdatasync(logfile)
```

This call *guarantees durability*.
Crashes after this point do not lose the write.

#### **Step 4 — Apply change to in-memory data pages**

The actual page (containing the row) is updated in memory.

#### **Step 5 — Return success to client**

Even though the data page may still be in memory and not persisted, the WAL ensures durability.

#### **Step 6 — Later: background flush of data pages**

A separate process writes dirty pages to disk.

---

## 💡 **Key Insight**

> **Data and indexes can be flushed lazily.
> WAL must be flushed eagerly.**

This is the core idea enabling performance + durability.

---

## 📦 **3. WAL = Redo Log**

WAL is also called:

* **Redo Log** (MySQL InnoDB)
* **Commit Log** (Cassandra, HBase)
* **Log Segment** (Kafka)
* **Write-Ahead Log** (PostgreSQL, RocksDB)

These all follow the same principle:

* Write changes to an append-only log
* Fsync
* Apply changes to primary storage later
* Replay log after crash

---

## 🧠 **4. Crash Recovery: How WAL Brings a Database Back to Life**

When the database restarts, it performs:

### **Phase 1 — Log Scan**

Identify all WAL records after the last checkpoint.

### **Phase 2 — Redo**

Reapply operations to reconstruct missing or partially-written pages.

### **Phase 3 — Undo (if supporting transactions)**

Rollback uncommitted changes using undo logs / transaction tables.

### PostgreSQL Example

PostgreSQL uses:

* **WAL** for redo
* **CLOG** for tracking transaction commit state
* **Undo not needed** (MVCC + tuple visibility rules handle it)

### MySQL InnoDB Example

InnoDB uses:

* **Redo log (WAL)**
* **Undo log pages**
* **Doublewrite buffer** to prevent page corruption

### Cassandra Example

Cassandra uses:

* **Commit Log (WAL)**
* **Memtables**
* **SSTables**
* Crash recovery = replay commit log into memtables

### Kafka Example

Kafka’s entire storage is **just a WAL**, segmented for retention.
This shows how powerful the append-only log abstraction is.

---

## 🚀 **5. Why WAL Is So Fast**

Sequential writes on SSDs:

* Have extremely low latency
* Achieve high throughput
* Avoid random I/O
* Minimize write amplification

Modern SSDs internally translate writes to erase blocks, but sequential patterns still maximize their efficiency.

### Without WAL:

Random page writes → expensive, slow, fragmented.

### With WAL:

Sequential fsyncs → fast, predictable, durable.

---

## 🧱 **6. WAL + Memtable + SSTables (NoSQL Write Path)**

Cassandra, RocksDB, and LevelDB do NOT update data files directly.
Instead, they use:

1. **WAL** → durable
2. **Memtable** (in-memory sorted structure) → fast reads/writes
3. **SSTable** (immutable disk files) → flushed from memtable
4. **Compaction** → merges/optimizes SSTables

This LSM-tree design depends completely on the WAL.

Without WAL, memtable data would be lost on crash.

---

## 🔎 **7. WAL in PostgreSQL (Detailed Internals)**

PostgreSQL WAL files:

* Named `0000000100000000000000A1` style
* Fixed-size (16MB segments)
* Stored in `pg_wal/` (formerly `pg_xlog/`)
* fsync’d at transaction commit

Checkpointing rewrites data pages and updates the log sequence number (LSN).

Recovery uses:

* **LSN** markers
* **Full-page writes** to protect against torn pages
* WAL replay

---

## 🪵 **8. WAL in Cassandra / Bigtable Family**

Cassandra’s commit log is simpler:

* Append-only
* No undo/redo
* Replay populates memtables
* SSTables are immutable so no rollback needed
* Crash-safe & extremely fast

This makes Cassandra ideal for high-write workloads.

---

## 📑 **9. WAL vs Doublewrite Buffer vs Binlog**

Different databases combine WAL with additional logs:

| System       | WAL                   | Undo       | Binlog                       | Doublewrite |
| ------------ | --------------------- | ---------- | ---------------------------- | ----------- |
| PostgreSQL   | Yes                   | MVCC-based | Logical replication optional | No          |
| MySQL InnoDB | Yes (redo log)        | Yes        | Yes (server binlog)          | Yes         |
| Cassandra    | Yes (commit log)      | No         | No                           | No          |
| Kafka        | Entire storage is WAL | No         | No                           | No          |

WAL is universal; each system adds layers for its own durability and consistency model.

---

## ❓ **10. Interview-Level Mental Models**

### **Q: Why does every database use WAL?**

**A:** To convert expensive random writes into fast sequential appends while ensuring crash recovery and durability.

### **Q: Why fsync the WAL but not the data files?**

**A:** WAL is small + sequential → cheap to fsync. Data files are large + scattered → expensive.

### **Q: What makes WAL ideal for LSM trees?**

Because LSM trees rely on:

* In-memory memtables
* Background flushes
* Immutable SSTables

WAL is the *only* durable record of recent writes.

### **Q: How does Kafka leverage WAL?**

Kafka’s log segments *are* the storage: append-only, replicated, fsync’d strategically.

---

## 🧭 **11. Summary: WAL Is the Foundation of Modern Storage**

WAL appears everywhere:

* **PostgreSQL** durability
* **MySQL** crash recovery
* **Cassandra** commit log
* **RocksDB/LevelDB** write path
* **Kafka** log segments
* **SQLite** journal mode
* **Filesystem journaling (ext4, XFS)**

If you remove WAL, the entire database world collapses.

Understanding WAL gives you mastery over:

* Write paths
* Durability guarantees
* Crash recovery
* Storage engine performance
* System design interview questions

This is why Article 1 starts here—everything else in storage architecture builds on this.

---

## ✅ **Next: Article 2 — B+ Trees: The OLTP Workhorse**

I can produce Article 2 immediately, structured like this one but even deeper.

Would you like it now?
