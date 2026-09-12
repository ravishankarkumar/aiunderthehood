---
title: "SQL vs NoSQL — Internal Architecture, Access Patterns & When to Use Each"
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Perfect — **Option B** it is.

Below is a **deep, interview-grade, CTO-level article** that goes *far beyond* the usual SQL vs NoSQL explanations.
This version covers **internal architectures, read/write paths, consistency models, sharding, replication, and real interview reasoning**.

This is the article you should publish on **Kavriq**
(and also the version you should *study* repeatedly before your interviews).

---



### *A Deep Technical and Interview-Ready Guide for Senior Engineers & System Design Candidates*

Most engineers know the surface-level differences:

> SQL uses structured schema and ACID;
> NoSQL is flexible and scalable.

But modern interviewers expect a far deeper understanding:

* How do **B+ Trees** differ from **LSM Trees** internally?
* Why do relational databases struggle with horizontal scaling?
* How does **MongoDB** achieve multi-document ACID now?
* Why do **Cassandra and DynamoDB** prefer eventual consistency?
* How do read/write paths differ internally across SQL/NoSQL systems?
* When will NoSQL *fail catastrophically* as a choice?
* How does sharding differ across PostgreSQL, MongoDB, Cassandra, DynamoDB?

This article provides those answers.

---

## **1. The Real Difference: Internal Storage Engines**

This is the single biggest conceptual gap most candidates miss.

SQL databases (PostgreSQL, MySQL) use **B+Tree storage engines**, while most high-scale NoSQL systems (MongoDB WiredTiger, Cassandra, DynamoDB, HBase) use **LSM Trees**.

## **SQL Internal Architecture (B+ Trees)**

### Indexes & Storage

* All data stored in **pages** (4 KB or 8 KB).
* B+ Trees map logical keys → physical pages.
* Updates modify pages *in-place*.
* Write path requires **random writes**.

### Read Path

```
B+ Tree lookup → page fetch → row decode
```

### Write Path

```
Update page
↓
Write redo record to WAL
↓
Flush dirty pages later
```

### Pros

* Fast point queries.
* Efficient range scans.
* Strong transactional semantics.

### Cons

* **Random writes → bottlenecks at scale.**
* Sharding is difficult because joins span shards.
* Consistent replication across shards is complex.

---

## **NoSQL Internal Architecture (LSM Trees)**

### How LSM Works

* Writes go to **memtable** (in-memory red-black tree / skiplist).
* WAL (Write-Ahead Log) ensures durability.
* Memtable flushed to immutable **SSTables**.
* SSTables periodically merged via **compaction**.

### Read Path

```
Memtable
↓
Immutable memtables
↓
SSTables (newest → oldest)
↓
Bloom filters skip irrelevant files
↓
Return latest version
```

### Write Path (FAST)

```
Append WAL
↓
Insert into memtable
↓
Return to client
↓
Flush to SSTable asynchronously
```

### Pros

* **Extremely fast writes (append-only).**
* Scales horizontally very well.
* Perfect for high-throughput workloads.

### Cons

* Read amplification (must check multiple SSTables).
* Complex compaction logic.
* Eventual consistency common.

---

## **2. Distributed Architecture Differences**

SQL databases originally evolved for **single-node** deployment.
NoSQL systems were built for **distributed** architectures from day one.

## **SQL Scaling**

Modern SQL databases *can* scale horizontally, but require complex solutions:

* **Read replicas**
* **Sharding middleware like Vitess or Citus**
* **Federated queries**
* **Distributed SQL systems like CockroachDB, Yugabyte, Spanner**

Key challenge:

> Relational integrity and joins break naturally across shards.

---

## **NoSQL Scaling**

NoSQL systems embrace horizontal scaling:

* Automatic sharding
* Consistent hashing (Cassandra, DynamoDB)
* Range-based sharding (MongoDB, HBase)
* Global replication
* Fault-tolerant write paths

Because they are schema-flexible and often denormalized:

> Each document/row carries all required data — no joins across shards.

---

## **3. Consistency Models: ACID vs BASE Is Not Enough**

Every interviewer hates hearing only:

> “SQL is ACID; NoSQL is BASE.”

You must show deeper clarity.

## **ACID (SQL)**

* **Atomicity**: all or nothing
* **Consistency**: database rules always satisfied
* **Isolation**: transactions don’t interfere
* **Durability**: persisted even if crash happens

SQL databases default to **strong consistency.**

---

## **BASE (Classic NoSQL)**

* Basically Available
* Soft-state
* Eventual consistency

But modern NoSQL databases have tunable consistency:

### **Cassandra**

```
R + W > RF  → strong consistency
```

### **DynamoDB**

* Strong read optional (`ConsistentRead=true`)
* Default: eventual consistency

### **MongoDB**

* Majority writes + majority reads → strong consistency
* WiredTiger uses MVCC internally

### **HBase**

* Consistent within regionserver
* Eventual across regions

---

## **4. Internal Replication Models**

Interviewers *love* this topic.

## **SQL Replication**

### **Leader-Follower (most common)**

* Only leader accepts writes.
* Followers replicate WAL.
* Strong consistency only if reading from leader.

Issues:

* Failover requires election.
* No horizontal write scaling.

---

## **NoSQL Replication**

### **Cassandra / DynamoDB (Leaderless)**

* Any replica can accept writes.
* Tunable consistency via quorum.
* Anti-entropy & hinted handoff used for convergence.

### **MongoDB (Replica Set)**

* Primary + secondaries.
* Consensus-driven elections.
* Multi-document ACID supported since v4.

---

## **5. Sharding Internals (VERY IMPORTANT for senior interviews)**

## **PostgreSQL / MySQL Sharding**

Not built in originally.

Solutions:

* **Citus** (distributed Postgres)
* **Vitess** (used at YouTube)

Challenges:

* Cross-shard joins expensive
* Cross-shard transactions complex
* Rebalancing painful

---

## **MongoDB Sharding**

* Config servers maintain metadata
* Shard keys define distribution
* Shards can be:

  * range-based
  * hash-based
  * zone-tagged (for geo partitioning)

Balancer moves chunks for load distribution.

---

## **Cassandra / DynamoDB Sharding**

* Use **consistent hashing**.
* Each node responsible for token ranges.
* Very easy to scale — add/remove nodes dynamically.

This is ideal for:

* write-heavy systems
* globally distributed systems
* low-latency reads/writes

---

## **6. Query Model Differences — The Real Reason SQL ≠ NoSQL**

## **SQL Query Engine**

* Cost-based optimizer
* Joins
* Aggregations
* Window functions
* Transactions

SQL shines when:

```
complex queries + relationships matter + correctness matters
```

---

## **NoSQL Query Model**

Depends on database type:

### **Document Stores (MongoDB)**

* Query by fields
* No joins (except $lookup, which is discouraged at scale)
* Aggregation pipeline

### **Wide Column Stores (Cassandra)**

Query only on **primary key and clustering keys**.

### **Key-Value Stores (Redis, DynamoDB)**

Lookup by key only.

### **Graph Databases (Neo4j)**

Cypher queries for graph traversal.

---

## **7. When SQL Is the Right Choice**

Use SQL when:

### **A. Transactions require correctness**

* Banking
* Payments
* Inventory
* Billing
* Forex or ledger systems

### **B. Strong schema discipline is needed**

* ERP
* HRMS
* Accounting systems

### **C. Querying is complex**

* multi-table joins
* aggregations
* analytics on OLTP system

### **D. Predictable access patterns**

---

## **8. When NoSQL Is the Right Choice**

Use NoSQL when:

### **A. Scale-out writes matter**

* Logs
* Metrics
* High-ingest workloads
* Messaging
* IoT time-series

### **B. Availability > consistency**

* Social feeds
* Notifications
* Real-time updates

### **C. Documents are flexible**

* User profiles
* CMS
* Product catalogs

### **D. Multi-region workloads**

* Global applications
* Low-latency reads

### **E. Dataset grows to petabytes**

---

## **9. When NoSQL FAILS (Critical Interview Insights)**

Candidates often oversell NoSQL.

Interviewers expect you to know when NoSQL is a terrible idea:

### ❌ Multi-document transactions

### ❌ Cross-partition joins

### ❌ Strict sequences (order IDs, invoice numbers)

### ❌ Complex filtering

### ❌ Real-time financial correctness

### ❌ Queries requiring >1 partition

Example:
A ride-sharing app using MongoDB for payments?
→ *Guaranteed disaster.*

---

## **10. Polyglot Persistence (How Real Companies Do It)**

Most real architectures mix SQL + NoSQL:

### **Netflix**

* Cassandra → watch history, comments
* MySQL → billing

### **Uber**

* MySQL → trips & transactions
* DynamoDB → driver locations
* Cassandra → events

### **Instagram**

* PostgreSQL → primary DB
* Redis → caching
* Elasticsearch → search

### Why?

> Because no single database solves all problems.

---

## **11. Interview Framework (Use This EVERY Time)**

Whenever asked:

> "SQL or NoSQL — which one?"

Follow this structure:

### **Step 1: Clarify workload**

* read-heavy? write-heavy?
* transactional? analytical?
* global distribution?

### **Step 2: Identify constraints**

* consistency?
* latency?
* scale?
* access patterns?

### **Step 3: Describe trade-offs**

* B+Tree vs LSM Tree
* ACID vs eventual consistency
* Sharding complexity
* Query flexibility

### **Step 4: Conclude with hybrid design**

> “For transactional correctness, I’d choose PostgreSQL.
> For large-scale user activity logs, Cassandra is a better fit.
> The combined system uses polyglot persistence.”

This is what senior interviewers want.

---

## **12. Summary**

**SQL**

* B+Trees, ACID, strong consistency
* Harder to shard
* Great for correctness & queries

**NoSQL**

* LSM Trees, BASE, eventual consistency
* Easy horizontal scaling
* Great for massive writes & flexible data

**Real systems** → combine both.

---

## **If you want, I can also create:**

✅ A condensed interview cheat sheet
✅ A SQL vs NoSQL comparison diagram
✅ Mock interview questions with answers
✅ A follow-up article: “Sharding Internals Deep Dive”
✅ A follow-up article: “Read & Write Path Comparison: Postgres vs MongoDB vs Cassandra vs DynamoDB”

Just tell me what you'd like next.
