---
title: "Sharding vs Replication vs Partitioning — Deep Internals, Trade-Offs & System Design Interview Guide"
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Excellent — here is **Option A: A complete, senior-level rewrite** of your article on **Sharding vs Replication vs Partitioning**, rebuilt from scratch with:

### ✔ Deep internals

### ✔ Distributed systems theory

### ✔ Failure modes

### ✔ Shard-key selection & hotspots

### ✔ Replication internals (WAL, Raft, gossip)

### ✔ Partitioning in SQL + NoSQL

### ✔ Real architectures (MongoDB, Cassandra, Spanner, DynamoDB, Instagram)

### ✔ HLD interview frameworks & sample answers

### ✔ PACELC & CAP discussions

### ✔ Routing, coordinators, metadata layers

### ✔ Rebalancing logic & operational complexity

This is a **long, dense, senior-interview-quality** article suitable for **Kavriq** and for your own interview preparation.

---



### *A CTO-Level Understanding of How Modern Databases Scale*

As soon as your dataset or traffic outgrows a single machine, three distributed systems techniques appear:

* **Replication** → Copy the same data to multiple nodes
* **Partitioning** → Split data into independent chunks
* **Sharding** → A specific form of *horizontal* partitioning distributed across machines

At the junior level, these terms seem simple.
At the **senior system design interview level**, you are expected to know:

* how they work internally
* how databases implement them
* how failures propagate
* when each is appropriate
* how they interact in real systems
* how routing, metadata layers, and consistency are affected

This article gives the depth required for FAANG, high-scale Indian product companies, and senior backend/system design interviews.

---

## **Table of Contents**

1. Replication – Internal Architecture & Failure Modes
2. Partitioning – Logical, Physical & Functional
3. Sharding – Distributed Partitioning in the Real World
4. Shard-Key Design & Hotspot Analysis
5. Routing, Coordinators & Metadata Management
6. Rebalancing Strategies & Operational Complexity
7. Combined Approaches in Real Systems (MongoDB, Cassandra, Spanner, DynamoDB, Instagram)
8. CAP, PACELC & Consistency Implications
9. How to Choose Between Replication, Partitioning & Sharding (Interview Framework)
10. Sample Interview Answers
11. Summary

---

## **1. Replication — Internal Architecture & Failure Modes**

*"Replicate for availability, scale reads, and survive node failures."*

Replication means multiple copies of the same data stored on different nodes.

But internally, databases implement replication very differently.

---

## **1.1 Types of Replication**

### **A. Leader–Follower (Single Primary) Replication**

Used by:
PostgreSQL, MySQL, MongoDB Replicas, Redis (asynchronous)

Mechanics:

1. Client writes to primary
2. Primary records write in **WAL**
3. WAL is shipped to replicas
4. Replicas replay WAL
5. Replicas serve read requests

**Consistency:**
Reads from replicas are eventually consistent unless synchronous replication is enabled.

---

### **B. Multi-Leader (Multi-Primary) Replication**

Used by:

* PostgreSQL BDR
* CouchDB
* Dynamo-style systems (conceptually multi-leader per partition)

All nodes accept writes → conflicts possible.

Conflict resolution strategies:

* **LWW (Last Write Wins)**
* **Version vectors**
* **Application-defined merge rules**

---

### **C. Leaderless Replication (Dynamo, Cassandra)**

No primary.
Any node can accept writes.

Replication factor = RF
Reads require `R` replicas
Writes require `W` replicas

Rule for strong consistency:

```
R + W > RF
```

This is the core Dynamo/Cassandra design.

---

## **1.2 Why Replication Exists**

✔ High availability
✔ Read scaling
✔ Disaster recovery
✔ Geo-distribution

Replication **does NOT** improve write throughput
(it actually increases write cost, since N copies must be written).

---

## **1.3 Failure Modes**

#### **Replica Lag**

* Replicas fall behind
* Stale reads
* Lost updates if client assumes read-after-write

#### **Primary Failover**

* Automatic election (MongoDB, PostgreSQL Patroni)
* Risk of split-brain

#### **Conflicts in Multi-Leader**

* Writes occur to multiple primaries
* Must be resolved on sync

#### **Network Partition (P in CAP)**

* Either block writes or allow divergence

---

## **2. Partitioning — Logical, Physical & Functional**

*"Partitioning is a broad concept. Sharding is only one type of partitioning."*

Partitioning = splitting a dataset logically or physically.

No machines need to be added.
Partitioning can occur inside a single server too.

---

## **2.1 Vertical Partitioning**

Splitting by columns.

Example:

```
Users table → BasicInfo, Settings, Stats
```

Used to reduce table width and I/O.

---

## **2.2 Horizontal Partitioning**

Splitting by rows.

Example (by year):

```
Orders_2021
Orders_2022
Orders_2023
```

Traditional SQL partitioning (PostgreSQL table partitioning).

---

## **2.3 Functional Partitioning**

Splitting by domain:

* Users DB
* Orders DB
* Inventory DB

This is essentially microservices-level domain-driven partitioning.

---

## **2.4 Why Partitioning Exists**

✔ Improve manageability
✔ Faster queries on smaller partitions
✔ Archival
✔ Data tiering

Partitioning does **not** improve horizontal write throughput by itself.

---

## **3. Sharding — Distributed Horizontal Partitioning Across Nodes**

*"Sharding is how databases scale writes and storage beyond a single machine."*

Sharding = horizontal partitioning **across multiple machines**.

Each shard stores a subset of the data:

```
Shard 1 → keys 0–1000  
Shard 2 → keys 1001–2000  
Shard 3 → keys 2001–3000
```

---

## **3.1 Sharding Strategies**

### **A. Range-Based Sharding**

Example: userId 0–1M on shard1, etc.

Pros:

* Range scans fast
  Cons:
* Hot partitions if keys are sequential

---

### **B. Hash-Based Sharding**

`hash(key) % N`

Pros:

* Uniform distribution
  Cons:
* Range queries impossible
* Rebalancing expensive if N changes

---

### **C. Directory-Based Sharding**

External service stores mapping of:

```
key → shard
```

Used by:

* Facebook TAO
* Pinterest
* Custom systems

Pros:

* Ultimate flexibility
  Cons:
* Centralized metadata must be highly available

---

## **3.2 Why Sharding Exists**

✔ Scale writes
✔ Scale storage
✔ Achieve near-infinite horizontal growth
✔ Reduce per-node load

---

## **3.3 Sharding Downsides**

* Distributed joins are expensive
* Cross-shard transactions slow
* Hotspots when shard key is bad
* Rebalancing is non-trivial
* Increased operational burden
* Query routing becomes complex

---

## **4. Shard-Key Selection & Hotspot Analysis (Mandatory Interview Topic)**

Bad shard keys destroy scalability.

---

## **4.1 What Makes a Good Shard Key?**

✔ High cardinality
✔ Uniform distribution
✔ Stable (doesn’t change during object lifetime)
✔ Supports query patterns

---

## **4.2 Bad Shard Keys Cause:**

### **Hotspots**

* Writes concentrated on one shard
* Example: using `userId % N` for a system where 90% users belong to one region

### **Cross-Shard Queries**

* Joins become scatter-gather queries
* Expensive & slow

### **Rebalancing Pain**

Changing shard key later requires migrating data → extremely costly.

---

## **4.3 Interview Examples**

Interviewers often test with scenarios like:

> “Design URL shortener — what is the shard key?”

Correct answer:
Use hash(url) — high cardinality + uniform.

---

## **5. Query Routing, Coordinators & Metadata Layers**

Sharding introduces complexity:
**Clients need to know which shard to query.**

---

## **5.1 Strategies**

### **Client-Side Routing**

Client library performs shard key → shard mapping.

Used by: Cassandra, DynamoDB

---

### **Router/Coordinator Layer**

Example: MongoDB `mongos`

Responsibilities:

* Routing
* Balancing
* Metadata caching
* Query fan-out for scatter-gather queries

---

### **Metadata Servers**

Store shard mapping information.

MongoDB uses **config servers**.
Cassandra uses **gossip protocol** to maintain cluster state.
Spanner uses **Paxos leaders** per shard.

---

## **6. Rebalancing — The Hardest Problem in Sharded Systems**

Rebalancing = moving data from overloaded shard → underloaded shard.

---

## **6.1 Range-Based Rebalancing**

Split ranges, move half to new shard.

MongoDB calls these **chunk migrations**.

---

## **6.2 Hash-Based Rebalancing**

Expensive:

Changing number of shards = changing hash space.
Often: introduce virtual nodes (consistent hashing) → smooth transitions.

---

## **6.3 Operational Challenges**

* Impact on latency during movement
* Ensuring consistency
* Avoiding double-writes or lost writes
* Ensuring atomic “cutover”

Very common interview topic.

---

## **7. How Real Systems Combine Partitioning, Sharding & Replication**

### **MongoDB Sharded Cluster**

* Sharding = horizontal scaling
* Replication = replica sets
* Partitioning = internal chunking
* Coordinators = mongos
* Metadata = config servers

---

### **Cassandra**

* Partitioning via consistent hashing
* Sharding built-in (no extra layer)
* Replication via tunable quorums
* No coordinator required (any node can accept reads/writes)

---

### **Google Spanner**

* Sharding via ranges
* Replication via Paxos
* Guaranteed strongly consistent reads via **TrueTime**
* Global consistent transactions

---

### **DynamoDB**

* Adaptive capacity handles hotspots
* Sharding is dynamic under the hood
* Replication handled automatically
* Partition splits occur when hot

---

### **Instagram**

* Sharded MySQL by userId
* Replicas for read-scaling
* Application-level routing

---

## **8. CAP & PACELC Implications**

### **Replication**

Impacts C vs A during partitions.

### **Sharding**

Impacts Latency vs Consistency when scaling out.

### **PACELC**

In sharded systems:

```
If Partition (P), choose A or C.
Else (E), choose Latency (L) or Consistency (C).
```

Interviewers LOVE this.

---

## **9. How to Choose in System Design Interviews (Gold Framework)**

Use this 3-step logic **every time**:

---

## **Step 1 — Clarify the workload**

* Read-heavy?
* Write-heavy?
* Global?
* Does data fit on one node?

---

## **Step 2 — Choose technique based on requirement**

| Requirement           | Technique                       |
| --------------------- | ------------------------------- |
| High availability     | Replication                     |
| Read scaling          | Replication                     |
| Write scaling         | Sharding                        |
| Storage scaling       | Sharding                        |
| Archival/organization | Partitioning                    |
| Multi-region          | Replication + sharding          |
| OLTP correctness      | Replicated SQL                  |
| High ingest logs      | Wide-column (built-in sharding) |

---

## **Step 3 — Combine techniques**

Most real systems use **all 3**:

* Partition schema
* Shard data across machines
* Replicate each shard for availability

---

## **10. Sample Interview Answers**

### **Q. “How would you scale a read-heavy social media app?”**

> “Replicate the database for read scaling, add sharding if the dataset exceeds storage limits, and partition large tables like posts by creation date for faster queries.”

### **Q. “When would you choose sharding over replication?”**

> “Replication doesn’t improve write throughput. If a single primary can’t handle the write QPS or dataset size, sharding is required.”

### **Q. “How do you pick a shard key?”**

> “High cardinality, uniform distribution, stable, and aligned with query paths. Avoid monotonically increasing keys to prevent hotspots.”

---

## **11. Summary**

* **Replication** → availability + read scaling
* **Partitioning** → organization + performance improvements
* **Sharding** → write + storage scalability across machines
* Real systems use **replication + sharding + partitioning** together
* Interviewers look for **trade-offs, failures, shard-key selection, and routing design**

This level of depth is what senior distributed system design interviews require.

---

If you want, I can now generate:

### ✔ A visual diagram version of this article

### ✔ A shorter cheat-sheet version

### ✔ Practice questions & answers

### ✔ A companion article: *“Shard-Key Selection Deep Dive”*

### ✔ A realistic mock interview session on scaling databases

Just tell me!
