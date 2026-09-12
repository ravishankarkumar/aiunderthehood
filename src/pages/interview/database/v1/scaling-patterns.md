---
title: "Database Scaling Patterns — Deep Internals, Trade-Offs & System Design Guidance"
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Excellent — here is **Option A**: a full, senior-level rewrite of your **Database Scaling Patterns** article, written at the same depth and quality as your previous rewrites.

This version includes:

### ✔ Deep internals (WAL, Raft, gossip, routing layers)

### ✔ Read/write path impacts

### ✔ Vertical vs horizontal scaling *with modern realities*

### ✔ Replication internals & failure modes

### ✔ Sharding internals, shard-key design & hotspot analysis

### ✔ Rebalancing mechanics

### ✔ CAP & PACELC trade-offs

### ✔ Real-world architectures (Spanner, Cassandra, MongoDB, DynamoDB, Instagram)

### ✔ Interview frameworks & sample answers

This is a **CTO-grade, interview-ready** article suitable for Kavriq and for your own preparation.

---



### *Vertical Scaling, Horizontal Scaling, Replication, and Sharding Explained for Senior Engineers & System Design Interviews*

As your application grows, a single database server eventually becomes a bottleneck — either due to **traffic**, **storage**, or **latency** constraints. Scaling a database is one of the most difficult aspects of backend architecture, and modern system design interviews expect you to understand not just *what* scaling strategies exist, but *how they work internally, what they trade off, and when to use each.*

This article gives a **deep, interview-ready** explanation of:

* Vertical vs horizontal scaling
* Replication (internals & trade-offs)
* Sharding (internal architecture, routing, hotspots, rebalancing)
* How large-scale systems (Spanner, Cassandra, MongoDB, DynamoDB) scale millions of QPS
* How to choose the right pattern in interviews

---

## **1. Vertical vs Horizontal Scaling**

## **1.1 Vertical Scaling (Scale-Up)**

*"Make one machine stronger"*

You increase:

* CPU
* RAM
* SSD IOPS
* Network bandwidth

Example:
A single PostgreSQL instance upgraded from:

```
4 cores / 16 GB RAM → 48 cores / 512 GB RAM
```

### **Pros**

* Zero code changes
* Simplest option
* Great for short-term growth
* Useful for OLTP workloads needing fast local ACID transactions

### **Cons**

* Extremely expensive at upper tiers
* Hard physical limits (max RAM/CPU per machine)
* Single point of failure (unless you add standby replicas)
* When it fails, the entire system goes down

### **When interviewers expect this answer**

Use vertical scaling **first**, and when a workload still fits on one machine.

> If the interviewer’s system has <500K QPS and <2 TB data → vertical scaling is still reasonable.

---

## **1.2 Horizontal Scaling (Scale-Out)**

*"Add more machines"*

You distribute traffic and data across multiple nodes.

This is how:

* Google Spanner
* Cassandra
* DynamoDB
* MongoDB Sharded Clusters

scale to millions of QPS.

### **Pros**

* Near-infinite scalability
* Fault tolerance
* Commodity hardware instead of giant expensive servers
* Essential for global applications

### **Cons**

* Far more complex
* Distributed queries
* Replica consistency issues
* Clock skew
* Distributed transactions become expensive

### **Triggers for horizontal scaling**

* Writes exceed what one machine can handle
* Dataset no longer fits on one node's disks
* Need global, multi-region availability
* Latency requirements cannot be met from one data center

---

## **2. Replication Strategies — Deep Internals & Failure Modes**

Replication = **duplicate the same data across multiple nodes**.

Replication does **not** improve write performance — it improves **availability, read performance, and fault tolerance.**

---

## **2.1 Leader–Follower (Primary–Replica)**

### How it works internally:

1. Write hits the **primary**
2. DB writes the change to **WAL** (Write-Ahead Log)
3. WAL is streamed to followers
4. Followers **replay** WAL to catch up

Used by:

* PostgreSQL
* MySQL
* MongoDB replica sets (with oplog)
* Redis async replication

### Benefits

* Easy to reason about
* Strong consistency if reading from primary
* Read-scaling via replicas

### Issues

* **Replica lag** → stale reads
* **Failover complexity**
* Risk of split-brain
* Leader is still a write bottleneck

---

## **2.2 Multi-Leader Replication**

Multiple nodes accept writes.

Used by:

* PostgreSQL BDR
* CouchDB
* DynamoDB-style models (conceptually per-partition multi-leader)

### Benefits

* Better write availability
* Easier geo-distribution

### Challenges

* Conflict resolution needed
* Must merge divergent replicas
* Increased latency

Conflict resolution techniques:

* LWW (Last Write Wins)
* Vector clocks
* CRDTs (Conflict-free Replicated Data Types)

---

## **2.3 Leaderless Replication (Dynamo, Cassandra)**

No primary. Any replica can accept writes.

### Mechanics

Replication factor = RF
Write consistency requires W acknowledgements
Read consistency requires R acknowledgements

To achieve strong consistency:

```
W + R > RF
```

This is **tunable consistency**.

### Trade-offs

* Highly available (AP in CAP)
* Writes never blocked
* Reads must reconcile versions (read repair, hinted handoff, anti-entropy)

---

## **2.4 Replication Failure Modes**

You MUST know these for interviews:

* **Replica lag**
* **Write conflicts (multi-leader)**
* **Stale reads (follower reads)**
* **Network partitions → choose C or A**
* **Failover downtime**

---

## **3. Sharding — The Core of Horizontal Scaling**

Sharding = **horizontal partitioning across multiple machines**.

Each shard holds *a subset* of the data.

Sharding solves:

* write scaling
* storage limits
* hot partitions

---

## **3.1 Shard-Key Design — The Most Important Part**

A good shard key has:

* **High cardinality**
* **Uniform distribution**
* **Stable value** (never changes)
* **Alignment with query patterns**

### Bad shard keys cause:

* Hotspots
* Unbalanced shards
* Slow cluster operations
* Expensive rebalancing

Interviewers *love* asking about shard-key selection.

---

## **3.2 Sharding Strategies**

### **A. Range-Based Sharding**

```
Users 1–1M → shard1  
Users 1M–2M → shard2
```

Pros:

* Efficient range queries
  Cons:
* Hot partitions (if most IDs are recent)

---

### **B. Hash-Based Sharding**

```
shard = hash(key) % N
```

Pros:

* Even load distribution
  Cons:
* No range queries
* Rebalancing painful without consistent hashing

---

### **C. Directory-Based Sharding**

External metadata service maintains:

```
key → shardID
```

Used by:

* Facebook TAO
* Pinterest
* Many internal high-scale systems

Pros:

* Ultimate flexibility
* Dynamic rebalancing

Cons:

* Directory must be highly available (ZooKeeper, etcd)

---

## **4. The Architecture Around Sharding (Internals You Must Know)**

Sharding is not just slicing data — it requires **infrastructure**.

---

## **4.1 Query Routing**

### Client-Side Routing

Used by Cassandra, DynamoDB

* Client computes shard → sends request directly

### Router/Coordinator Layer

MongoDB `mongos`, Elasticsearch coordinating nodes

* Routes query → shard(s)
* Merges results
* Caches metadata

---

## **4.2 Metadata Management**

Stores:

* shard boundaries
* shard locations
* split/merge status
* cluster topology

Examples:

* MongoDB’s **config servers**
* Cassandra’s **gossip protocol**
* Spanner’s **Paxos leaders**

---

## **4.3 Rebalancing Mechanics**

### Range-based

Split ranges → move chunk → update metadata
(Used by MongoDB)

### Hash-based

Requires **consistent hashing** or virtual nodes, otherwise full reshuffle.

### Operational Risks

* Queries hitting moving shards
* Long-running rebalances
* Hotspots migrating to wrong shards
* Unbounded cluster growth

---

## **5. Scaling Patterns in Real-World Systems**

## **5.1 Google Spanner**

* Horizontal sharding based on ranges
* Synchronous replication via Paxos
* Global strong consistency using TrueTime
* Automatic splitting of hot ranges

## **5.2 Cassandra**

* Consistent hashing for sharding
* Leaderless replication
* Tunable consistency
* Write-optimized (LSM Tree)

## **5.3 MongoDB Sharded Clusters**

* Range or hash sharding
* Each shard = replica set
* Routers (mongos)
* Config servers for metadata

## **5.4 DynamoDB**

* Adaptive capacity handles hotspots
* Internal partitions auto-split
* SSD-based storage
* Leaderless replication similar to Dynamo paper

## **5.5 Instagram**

* Sharded MySQL by user ID
* Multiple replicas per shard
* Application-level routing

---

## **6. CAP & PACELC Trade-Offs in Scaling**

### Replication → affects **C vs A**

### Sharding → affects **Latency vs Consistency**

PACELC says:

```
If Partition (P), choose A or C.
Else (E), choose Latency (L) or Consistency (C).
```

Examples:

* DynamoDB → AP system, low latency
* Spanner → CP system, high consistency
* Cassandra → tunable consistency
* MongoDB → CP by default in replica sets

Mentioning CAP/PACELC during interviews **instantly signals seniority**.

---

## **7. Choosing the Right Scaling Strategy (Interview Framework)**

Use this **every time** you answer scaling questions.

---

## **Step 1 — Clarify workload**

* Read-heavy?
* Write-heavy?
* Hot keys?
* Global traffic?

---

## **Step 2 — Choose scaling pattern**

| Requirement                      | Scaling Technique                                    |
| -------------------------------- | ---------------------------------------------------- |
| High availability                | Replication                                          |
| Read-heavy                       | Replication                                          |
| Write-heavy                      | Sharding                                             |
| Dataset too large                | Sharding                                             |
| Latency-sensitive global traffic | Geo-replication                                      |
| OLTP transaction integrity       | Vertical scaling or strongly-consistent replication  |
| Low-latency writes               | Hash-sharded LSM-based systems (Cassandra, DynamoDB) |

---

## **Step 3 — Present combined architecture**

Real systems always combine:

* **Sharding** for scale
* **Replication** for availability
* **Partitioning** for organization
* **Vertical scaling** for leaders/coordinators

Example:

> “I’d shard users by hash(user_id), replicate each shard 3 times for HA, and introduce a router layer for query routing. This ensures horizontal write scaling + fault tolerance.”

---

## **8. Sample Interview Answer (Use This):**

**Question:**
“How would you scale a database from 1 million to 200 million users?”

**Answer:**

> “First, I’d scale vertically until single-node resources are exhausted.
> Next, I’d add follower replicas to scale read traffic.
> Once writes or storage exceed a single machine’s limits, I’d introduce sharding.
> I’d pick a shard key with high cardinality and uniform distribution, like hash(user_id).
> Each shard would be replicated for availability.
> A routing layer or consistent hashing would dispatch queries to the correct shard.
> Finally, I’d design for shard rebalancing, replication lag handling, and CAP trade-offs depending on consistency requirements.”

This is what senior-level interviewers expect.

---

## **9. Summary**

* **Vertical scaling** → simplest, but limited.
* **Horizontal scaling** → needed for massive scale.
* **Replication** → increases availability & read throughput.
* **Sharding** → increases write throughput & storage capacity.
* Real companies use **sharding + replication** together.
* Query routing, shard-key design, and rebalancing are the real challenges.
* Always mention CAP/PACELC and failure modes in interviews.

---

If you'd like, I can now produce:

### ✔ A one-page cheat sheet for this article

### ✔ A companion article: *"Shard Key Design Deep Dive"*

### ✔ Practice questions for scaling databases

### ✔ A diagram-rich version for Kavriq

Just tell me what you want next.
