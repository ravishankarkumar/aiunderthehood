---
title: "10. Distributed Storage: Replication, Consistency & Quorums"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 10**, a deep, authoritative exploration of **Distributed Storage, Replication, Consistency & Quorums**—one of the most critical topics for modern HLD interviews and real-world distributed system design.
This article fits perfectly into the series on **Kavriq**.

---



### *How Modern Databases Stay Available, Durable & Correct Across Clusters*

Distributed databases are everywhere today: Cassandra, DynamoDB, CockroachDB, TiDB, MongoDB, Etcd, Consul, Elasticsearch, and more.
They provide **fault tolerance, horizontal scalability, low-latency global access**—but they also face fundamental constraints around consistency, partition tolerance, and replication guarantees.

To design or evaluate distributed systems, you must deeply understand:

* leader/follower replication
* write-ahead replication
* consistency levels
* quorums
* hinted handoff
* read repair
* anti-entropy
* CAP theorem trade-offs

This article builds these concepts from the ground up, using real database examples and interview-level clarity.

---

## 🌍 **1. Why Distributed Storage Exists**

Single-machine databases fail for three reasons:

### **1. Capacity limits**

Compute, RAM, and disk are finite.

### **2. Availability requirements**

If a machine goes down, data should still be accessible.

### **3. Latency constraints**

Users distributed across regions need local reads.

Distributed storage solves this by spreading data across multiple nodes and keeping copies (replicas) in sync.

---

## 🔄 **2. Replication Models Overview**

Distributed systems replicate data in two major ways:

```
Leader-Based Replication     vs     Leaderless Replication
```

Let’s explore both.

---

## 🏛️ **3. Leader-Based Replication**

A single node (leader) handles all writes.

Followers replicate logs or state from the leader.

Examples:

* PostgreSQL streaming replication
* MySQL Group Replication
* Raft-based systems (Etcd, CockroachDB, TiKV)
* MongoDB replica sets

### **Write Path**

1. Client writes to leader
2. Leader appends to WAL
3. Leader sends WAL entries to followers
4. Followers replay WAL
5. Followers acknowledge
6. Leader commits

This is **write-ahead replication**.

---

## **Leader-Based: Pros**

* Strong consistency (when configured correctly)
* Simple conflict resolution
* Serializability possible
* Predictable read-your-writes semantics

---

## **Leader-Based: Cons**

* Leader is a bottleneck for writes
* Failover can be complex
* Writes cannot proceed if leader isolated (under strong consistency mode)

---

## 🧑‍🤝‍🧑 **4. Leaderless Replication (Dynamo-Style)**

No leader; any node can accept writes.

Systems:

* Amazon DynamoDB
* Cassandra
* Riak
* ScyllaDB

This design supports AP-style behavior in CAP.

---

## **Write Path (Simplified)**

1. Client sends write to *N* replicas
2. System waits for *W* acknowledgments
3. Write propagates asynchronously to slower nodes

---

## **Read Path**

1. Client queries *N* replicas
2. System waits for *R* responses
3. Uses latest timestamp (vector clocks / last write wins)

---

## **Leaderless: Pros**

* High availability (writes succeed even during node failures)
* Horizontal write scalability
* Geographic distribution friendly
* Partition-tolerant

---

## **Leaderless: Cons**

* Conflicts require resolution (vector clocks or timestamps)
* Eventual consistency unless R+W > N
* More operational complexity

---

## 🧮 **5. Quorums: The Consistency Control Mechanism**

Quorums ensure that reads and writes intersect.

With:

* **N** total replicas
* **W** writes required
* **R** reads required

To guarantee strong consistency:

```
R + W > N
```

### Example:

```
N=3
W=2
R=2
```

Then:

* Writes must reach 2 replicas
* Reads must read from 2 replicas
* Intersection ensures latest write is always seen

This is foundational to Cassandra, DynamoDB, and Riak.

---

## 🧪 **6. Consistency Levels**

Different read/write semantics for different durability/latency trade-offs.

---

## **Strong Consistency**

Reads always return the latest committed value.

Achieved via:

* leader-based replication
* strict quorums (R+W > N)
* Raft/Paxos consensus

Systems:

* Etcd
* CockroachDB
* TiDB
* Spanner (TrueTime)

---

## **Eventual Consistency**

Given enough time and no new writes, all replicas converge.

Systems:

* DynamoDB
* Cassandra (default reads/writes)
* Riak

---

## **Consistent Prefix**

Ensure that reads never see out-of-order updates.

Used in some multi-region setups.

---

## **Bounded Staleness**

Reads may be old, but not older than k seconds or versions.

---

## **Read-Your-Writes Consistency**

Clients see their own writes (session consistency).

---

## **Monotonic Reads**

Clients never regress to older versions across queries.

---

## 🔥 **7. Hinted Handoff**

Used in Cassandra and Dynamo-style systems.

If a replica is down:

1. Write is sent to available replicas
2. A “hint” is stored to re-deliver to the offline replica later
3. When the replica rejoins, hints restore its state

This improves availability during temporary outages.

---

## 🛠️ **8. Anti-Entropy & Read Repair**

### **Anti-Entropy**

Long-term background process that reconciles divergent replicas.

Uses:

* Merkle trees (efficient hash trees)
* Checks each range of data
* Repairs differences

Used in Cassandra, DynamoDB, Riak.

---

### **Read Repair**

When a read detects inconsistent replicas:

1. Client merges results
2. Sends updated values to out-of-date replicas

This ensures **convergence**.

---

## 🧨 **9. Write-Ahead Replication vs State Machine Replication**

## **Write-Ahead Replication (Log Shipping)**

Leader executes write → followers replay log.

Used by:

* PostgreSQL
* MySQL
* MongoDB (before V4)

---

## **State Machine Replication (Consensus)**

Replicas agree on log *first*, then execute.

Consensus protocols:

* **Raft**
* **Paxos**
* **Multi-Paxos**
* **ZAB (ZooKeeper)**

Systems:

* Etcd
* TiKV
* CockroachDB
* MongoDB (modern)

Consensus-based replication guarantees:

* linearizability
* strict serializability
* no split-brain events

---

## ⚖️ **10. CAP Theorem — The Practical Interpretation**

CAP says:

> In a partitioned system, you must choose **Availability (A)** or **Consistency (C)**.

But modern interpretation is more nuanced:

### **CA systems** (consistent & available)

Possible only *without* partitions (single node).

### **CP systems** (consistent & partition-tolerant)

* Etcd, CockroachDB, TiDB
* Prefer consistency; block writes during partitions

### **AP systems** (available & partition-tolerant)

* Cassandra, DynamoDB, Riak
* Prefer availability; allow writes even during partitions
* Resolve conflicts later

### Important nuance:

> CAP is about behavior *during partitions*, not normal operation.

---

## 🧩 **11. Conflicts & Resolution Strategies**

Leaderless systems require conflict resolution:

### **1. Last Write Wins (LWW)**

Timestamp-based; simple but can lose updates.

### **2. Vector Clocks**

Track causality; detect concurrent updates.

Used in Dynamo & Riak.

### **3. CRDTs (Conflict-Free Replicated Data Types)**

Ensure mathematically safe merges.

Used in:

* Redis CRDT
* Riak CRDTs
* Collaborative apps (Google Docs)

---

## 🧠 **12. Interview Mental Models**

Interviewers expect crisp answers to these:

---

### **Q: When do we use quorums?**

Leaderless replication with tunable consistency.

---

### **Q: When is R+W>N required?**

To guarantee strong consistency.

---

### **Q: What is hinted handoff?**

Temporary buffering of updates for unreachable replicas.

---

### **Q: What is anti-entropy?**

Merkle-tree-based background repair to ensure eventual consistency.

---

### **Q: Why choose leaderless replication?**

High availability, low latency, no single bottleneck.

---

### **Q: When to use consensus-based replication?**

When correctness and linearizability matter (banking, metadata stores).

---

### **Q: Does CAP mean we can’t have consistency + availability?**

Only during partitions; in normal operations both can be achieved.

---

## 🧭 **13. Summary in One Sentence**

> Distributed storage relies on replication, quorums, consistency levels, and background repair mechanisms to deliver availability, correctness, and durability despite failures and network partitions.

---

## ✅ **Next: Article 11 — Architecture of Bigtable, Cassandra & DynamoDB**

Shall I proceed with **Article 11**?
