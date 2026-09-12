---
title: "Database Fundamentals (Moderately Expanded Edition)"
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Here is the **moderately expanded**, still beginner-friendly but **much more complete and interview-ready** version of **Database Fundamentals**.

This version:

* does **not** overwhelm with deep internals
* but **fills all foundational gaps**
* prepares readers for advanced chapters
* aligns with your Kavriq tone
* builds the conceptual base needed for HLD interviews

---



### *Relational vs NoSQL • ACID vs BASE • Storage Models • Consistency Models • CAP/PACELC • Query Basics*

Databases are the foundation of every modern system — from a simple notes app to globally distributed platforms like WhatsApp, Instagram, and Netflix.
Before diving into indexing, replication, sharding, or internals, we must first understand the **core fundamentals**.

This chapter establishes the conceptual base required for **interviews** and for the **rest of your deep-dive database series**.

---

## **1. What is a Database?**

A **database** is an organized system for storing, retrieving, and managing data reliably.

Core goals:

* **Durability** — data survives crashes
* **Structure** — you can access data predictably
* **Performance** — fast reads and writes at scale
* **Concurrency** — multiple users operate safely

### Analogy

A database is a *digital filing cabinet* with fast indexing, safety guarantees, and rules to keep data consistent.

---

## **2. Relational vs Non-Relational Databases**

Databases evolved into two large families based on data model, query model, and scalability goals.

---

## **2.1 Relational Databases (SQL)**

* Structured into **tables** (rows & columns)
* Fixed **schema** with well-defined types
* Supports SQL, the world’s most powerful query language
* Strong ACID guarantees

Examples:

* PostgreSQL
* MySQL
* Oracle
* SQL Server

### Strengths

* Best for **transactions** (payments, orders, inventory)
* Powerful joins and constraints
* Reliable consistency

### Weaknesses

* Harder to scale horizontally
* Rigid schema evolution

---

## **2.2 Non-Relational Databases (NoSQL)**

NoSQL databases relax schema and consistency constraints to achieve **massive scale**.

Types:

### **1. Key-Value Stores**

Redis, DynamoDB
→ Simple lookups, caching, session storage.

### **2. Document Stores**

MongoDB, Couchbase
→ JSON documents, flexible data, evolving schemas.

### **3. Wide-Column Stores**

Cassandra, HBase
→ Optimized for write-heavy, large-scale workloads.

### **4. Graph Databases**

Neo4j, JanusGraph
→ Relationship-heavy workloads (recommendations, fraud detection).

### Strengths

* Horizontal scalability
* Flexible schema
* Tuned for specific access patterns

### Weaknesses

* Less consistency
* Many lack strong transactions
* Weaker analytics compared to SQL

---

## **2.3 When to Use What (Interview View)**

| Use Case                       | Best Choice             | Why                            |
| ------------------------------ | ----------------------- | ------------------------------ |
| Banking system                 | SQL (Postgres/MySQL)    | ACID required                  |
| E-commerce product catalog     | Document DB             | Flexible schema                |
| Messaging app                  | Wide-column (Cassandra) | Write-heavy, high availability |
| Social network recommendations | Graph DB                | Relationship queries           |
| Real-time metrics              | Time-series DB          | Compression + fast range reads |

Interview Tip:
When asked “SQL or NoSQL?”, always choose based on **workload + consistency needs + scaling patterns**.

---

## **3. ACID vs BASE (Consistency Guarantees)**

Different workloads require different guarantees.

---

## **3.1 ACID — Strong Guarantees (Relational)**

* **Atomicity** — all-or-nothing
* **Consistency** — constraints always preserved
* **Isolation** — concurrent transactions don’t corrupt data
* **Durability** — committed data survives crashes

Suitable for:

* payments
* orders
* banking
* inventory updates

---

## **3.2 BASE — Scalable & Eventually Consistent (NoSQL)**

* **Basically Available**
* **Soft state** (intermediate states allowed)
* **Eventually Consistent** (convergence over time)

Suitable for:

* social feeds
* messaging
* analytics
* distributed caches

**Key trade-off:**
BASE systems sacrifice strict consistency for availability and scalability.

---

## **4. Consistency Models (Light Introduction)**

Before deeper distributed systems chapters, users should know these basic consistency types:

### **Strong Consistency**

Reads always reflect the latest write.

### **Eventual Consistency**

Values may be stale temporarily, but replicas eventually converge.

### **Read-Your-Writes**

A user sees their own writes immediately.

### **Monotonic Reads**

Once a user sees a new value, they don’t see older ones.

### **Why this matters for interviews**

When interviews ask:

> "What level of consistency would you choose for user timelines?”

You must map workload → consistency requirement.

---

## **5. CAP Theorem (Light Edition)**

CAP states that in a distributed database, you can guarantee **only two** during a network partition:

* **Consistency**
* **Availability**
* **Partition Tolerance**

Since partitions eventually happen, practical systems choose between:

* **CP (Consistency-first)** → Spanner, Etcd
* **AP (Availability-first)** → Cassandra, DynamoDB

This is a *simplified view*, but essential at the fundamentals level.

---

## **6. PACELC (Better Than CAP)**

PACELC refines CAP:

> *If there is a Partition (P), you must choose between Availability (A) and Consistency (C).
> Else (E), in normal operation, you trade between Latency (L) and Consistency (C).*

Examples:

* Spanner → CP/EC (consistent but higher latency)
* DynamoDB → AP/EL (available and low-latency, eventually consistent)

---

## **7. Storage Models (Brief Introduction)**

Understanding storage engines is essential before studying WAL, MVCC, SSTables, or LSM trees.

### **7.1 B+ Tree Storage (RDBMS)**

* Good for random reads
* Balanced structure
* Used in MySQL (InnoDB), PostgreSQL indexes

### **7.2 Heap Storage (PostgreSQL)**

* Unordered table storage
* MVCC creates version chains

### **7.3 LSM Tree Storage (NoSQL)**

* Write-optimized
* Used in Cassandra, LevelDB, RocksDB

### **7.4 Columnar Storage (OLAP)**

* Stores values column-by-column
* Great compression
* Used in Snowflake, ClickHouse, Redshift

This basic awareness prepares the reader for upcoming deep-dive articles.

---

## **8. How Queries Work (High-Level Execution Path)**

When you run:

```sql
SELECT * FROM users WHERE id=123;
```

The DB performs:

1. **Parse** (syntax check)
2. **Plan/Optimize** (choose best index/scan)
3. **Execute** (run the plan)
4. **Return Results**

Why you need this:
Understanding query planning is essential before learning **indexing**, **optimizer internals**, and **execution strategies**.

---

## **9. Scaling Basics (Before Deep Topics)**

A fundamentals chapter should lightly introduce scaling:

### **Vertical Scaling**

Add more CPU, RAM, SSD.

### **Horizontal Scaling**

Add more machines.

### Three important techniques:

1. **Replication** — scale reads, improve availability.
2. **Sharding** — scale writes, distribute data.
3. **Caching** — reduce DB load, improve latency.

These are later deep-dive topics, but a conceptual preview helps readers.

---

## **10. Interview Tips**

If asked about database choice or fundamentals:

### ✔ Identify workload

(read-heavy, write-heavy, transactional, analytical)

### ✔ Trade-offs

(Consistency vs Availability vs Latency)

### ✔ Match DB model to real constraints

(e.g., Cassandra for availability, Postgres for ACID)

### ✔ Mention scalability

(vertical → replication → sharding)

### ✔ Talk about consistency requirements

(eventual vs strong)

Example answer:

> “For payments, I’d pick Postgres due to ACID guarantees. For a messaging timeline that’s write-heavy, I’d use Cassandra because it offers low-latency writes and tunable consistency. Caching and read replicas would help reduce read pressure.”

---

## **11. Recap**

This expanded fundamentals chapter now covers:

* SQL vs NoSQL systems
* ACID vs BASE consistency models
* Strong vs eventual consistency
* CAP/PACELC principles
* Storage engine basics
* Query execution overview
* Scaling foundations

This sets the perfect foundation for the deep database internals articles that follow.

---

## **Next Step**

👉 Continue with **SQL vs NoSQL** to learn how to choose the right model for your system design scenario.

---

If you'd like, I can also produce:

### ✔ A shorter 1-page Fundamentals Cheat Sheet

### ✔ A visual diagram pack for this chapter

### ✔ Practice interview questions for Fundamentals

Just say the word.
