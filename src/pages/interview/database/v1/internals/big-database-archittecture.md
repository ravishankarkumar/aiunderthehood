---
title: "11. Architecture of Bigtable, Cassandra & DynamoDB"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 11**, a polished, CTO-grade deep dive into the internal architectures of **Bigtable, Cassandra, and DynamoDB**.
This is one of the most important articles in the entire series because it ties together:

* LSM Trees
* SSTables
* Compaction
* Replication
* Quorums
* Consistent hashing
* Gossip protocols
* Adaptive capacity
* Leader vs leaderless design
* Partitioning
* Failover and high availability

Perfect for **Kavriq**, and a goldmine for high-level system design interviews.

---



### *How Modern Distributed Databases Actually Work Internally — A Practical Case Study Series*

Bigtable, Cassandra, and DynamoDB share a common lineage beginning with the famous **Bigtable + Dynamo papers** published by Google and Amazon in the mid-2000s.
These systems reinvented database design for internet-scale workloads:

* trillions of rows
* petabytes of data
* globally distributed clusters
* extremely high write throughput
* tunable consistency
* fault tolerance under node/region failures

This article connects all the concepts from earlier articles—LSM trees, SSTables, compaction, consensus, quorums, replication—into real-world architectures.

Let’s explore how these three foundational systems work.

---

## 🧭 **1. Bigtable Architecture (Google)**

*The system that started it all.*

Bigtable was introduced by Google in 2006. It powers:

* Gmail
* Google Analytics
* Google Maps
* YouTube metadata
* Google Search indexing layers

Bigtable is not a relational DB—it is a distributed, sparse, multidimensional sorted map:

```
(row_key, column_key, timestamp) → value
```

Its architecture combines:

* **LSM Trees for storage**
* **Tablet-based partitioning**
* **Chubby-based master coordination**
* **GFS (Google File System) for persistence**

---

## **1.1: Data Model**

Each row key is sorted lexicographically.

Columns are grouped into *column families*.

Each cell can have multiple timestamped versions.

---

## **1.2: Storage Engine — Memtables + SSTables**

Bigtable invented the memtable/SSTable pattern later adopted by:

* Cassandra
* HBase
* LevelDB
* RocksDB

Write path:

1. Write to WAL (on GFS)
2. Insert into memtable (in-memory sorted structure)
3. When memtable full → flush to SSTable
4. Minor compactions merge small SSTables
5. Major compactions rewrite large SSTables

Reads consult:

* Memtable
* Immutable memtables
* SSTables across compaction levels

---

## **1.3: Tablets = Partitions**

Bigtable splits tables into **tablets**, each representing a contiguous range of row keys.

Tablet server responsibilities:

* serve reads/writes
* maintain memtables
* flush SSTables
* perform compactions

Tablet Master responsibilities:

* track tablet-to-server mapping
* handle tablet splits/merges
* coordinate load balancing

Tablets stored in GFS allow:

* replication
* rebalancing
* fault recovery

Here lies the foundation of Cassandra's and HBase’s design.

---

## **1.4: Distributed File System Integration**

Bigtable stores its SSTables in **GFS**, which provides:

* chunk replication
* automatic failover
* atomic append semantics

This clean separation (compute vs storage) became the blueprint for modern cloud Bigtable implementations.

---

## **1.5: Summary of Bigtable’s Influence**

Bigtable introduced:

* SSTables
* LSM-based write paths
* Tablet servers
* Range-based partitioning
* Multiversion storage
* Separation of compute & distributed file system

Everything Cassandra and DynamoDB later implemented builds upon these innovations.

---

## 🧭 **2. Cassandra Architecture (Apache)**

*Peer-to-peer, AP-first, tunable consistency — the Dynamo + Bigtable fusion.*

Cassandra was built at Facebook to power the inbox search system.

It combines:

* Bigtable’s storage engine (memtable + SSTable + compaction)
* Dynamo’s distributed design (consistent hashing, quorums, gossip, hinted handoff)

This hybrid architecture gives Cassandra:

* high availability
* horizontal scalability
* fault tolerance
* tunable consistency
* true multi-region capability

Let’s break down its core components.

---

## **2.1: Peer-to-Peer Ring (No Master)**

Cassandra uses **consistent hashing** to distribute data:

* Each node is assigned tokens on a ring
* A row key is hashed (Murmur3)
* Hash value determines partition location

No dedicated master.

No single point of failure.

Every node can handle client requests.

---

## **2.2: Replication**

Replication factor (RF) defines number of replicas:

```
RF=3 → 3 copies of each partition
```

Replicas are stored on:

* consecutive nodes on the ring (classic)
* topology-aware placement (rack-aware, DC-aware)

---

## **2.3: Write Path**

Cassandra’s write path is **astonishingly fast** due to LSM properties.

1. Write to commit log (WAL)
2. Apply to memtable
3. Acknowledge client (based on consistency level)
4. Flush memtable to SSTable
5. Compaction merges SSTables in background

No random I/O.
No in-place updates.
No waiting for compaction.

---

## **2.4: Read Path**

Reads must merge data from:

* memtable
* SSTables (multiple levels)
* bloom filters help skip SSTables
* index summary reduces block reads

---

## **2.5: Gossip Protocol**

Cassandra uses gossip for:

* membership management
* failure detection
* cluster topology exchange

Every node periodically exchanges status with random peers.

Ensures decentralized reliability.

---

## **2.6: Tunable Consistency Levels**

Clients choose consistency:

### **Writes**

* `ANY`
* `ONE`
* `QUORUM`
* `ALL`

### **Reads**

* `ONE`
* `QUORUM`
* `ALL`

**Strong consistency** achieved when:

```
R + W > RF
```

This is the Dynamo rule.

---

## **2.7: Hinted Handoff**

If a target replica is down:

* Write sent to other replicas
* A “hint” stored locally
* Delivered later when node returns

Maintains availability during brief outages.

---

## **2.8: Anti-Entropy Repair**

Uses Merkle trees to compare SSTables between nodes.

Ensures long-term consistency.

---

## **2.9: Compaction Strategies**

Cassandra supports 3 major compaction strategies:

### **STCS** (Size-tiered)

Good for heavy writes.

### **LCS** (Leveled)

Good for read-heavy workloads.

### **TWCS** (Time-window)

Ideal for TTL-heavy time-series workloads.

Understanding compaction is essential for Cassandra performance.

---

## 🧭 **3. DynamoDB Architecture (AWS)**

*The commercial, globally scalable implementation of Dynamo + Bigtable principles.*

DynamoDB is Amazon’s managed NoSQL database, powering:

* Amazon Retail
* Alexa
* Prime Video
* Ads systems
* Internal microservices

It is built for:

* massive horizontal scale
* global replication
* predictable performance
* zero-ops, fully managed experience

Architecturally, DynamoDB combines:

* Dynamo’s leaderless replication
* Bigtable-inspired storage engine
* Adaptive capacity
* Automatic partition management
* Global tables

---

## **3.1: Partitioning via Partition Key Hashing**

DynamoDB computes:

```
partition = HASH(partition_key)
```

Partitions are distributed across nodes (storage servers).

Partition sizes dynamically split when:

* item count grows
* throughput requirement grows
* storage exceeds threshold

---

## **3.2: Storage Engine (Behind the Scenes)**

AWS does not publicly specify every detail, but it is known that:

* DynamoDB uses an LSM-like storage engine
* Data stored as sorted key-value blocks
* Systems inspired by Bigtable and Dynamo

This means:

* memtables
* SSTables
* compaction
* WAL
* bloom filters

All operate behind the scenes.

---

## **3.3: Adaptive Capacity (Auto Hotspot Mitigation)**

DynamoDB automatically detects hot partitions:

* reallocates throughput
* balances load across nodes
* splits partitions if necessary

This prevents the common LSM problem: **hot partition writes**.

---

## **3.4: Leaderless Replication with Quorums**

DynamoDB uses Dynamo-style replication:

* N replicas
* Quorum-based
* Eventually consistent by default
* Strongly consistent reads optional

Conflict resolution uses:

* timestamps
* last write wins
* background repair

---

## **3.5: Global Tables = Multi-Region Replication**

DynamoDB Global Tables provide active-active replication across regions.

Behind the scenes:

* streams capture updates
* replicated asynchronously
* conflict resolution is deterministic

This is one of DynamoDB’s strongest differentiators.

---

## **3.6: Auto-Scaling & Provisioning**

DynamoDB supports:

* provisioned mode
* on-demand mode
* automatic scaling based on traffic

This elasticity makes DynamoDB ideal for unpredictable workloads.

---

## 🧠 **4. Comparing Bigtable vs Cassandra vs DynamoDB**

| Feature            | Bigtable                                    | Cassandra                 | DynamoDB                     |
| ------------------ | ------------------------------------------- | ------------------------- | ---------------------------- |
| Partitioning       | Range (tablets)                             | Consistent hashing        | Hash partitioning            |
| Replication        | GFS replicated                              | Tunable (N, R, W)         | Dynamo-style                 |
| Consistency        | Strong-ish                                  | Tunable                   | Tunable                      |
| LSM Engine         | Yes                                         | Yes                       | Yes                          |
| Compaction         | Yes                                         | Yes                       | Yes                          |
| Architecture       | Master + tablet servers                     | Fully peer-to-peer        | Fully managed                |
| Hotspot Management | Application responsibility                  | Some tools (TWCS, tokens) | Adaptive capacity            |
| Scaling            | Tablet splits                               | Virtual nodes             | Automatic partition splits   |
| Use case           | HBase, analytics, internal Google workloads | On-prem, large clusters   | Cloud-native NoSQL workloads |

---

## 🔥 **5. Why These Architectures Matter for HLD Interviews**

High-level system design interviews *love* these systems because they illustrate:

* how theoretical concepts become real systems
* CAP theorem trade-offs
* replication & consistency in practice
* failure detection & repair
* partitioning
* LSM storage & compaction
* global distribution
* tunable consistency
* latency & throughput scaling

Knowing Cassandra or DynamoDB internals often sets senior candidates apart.

---

## 🎯 **6. Interview Mental Models**

### **Q: Why did Cassandra combine Bigtable + Dynamo?**

To achieve both high write throughput (Bigtable) and high availability/scalability (Dynamo).

### **Q: Why does DynamoDB avoid strong consistency by default?**

To enable fast global replication and high availability under partitions.

### **Q: Why do all three use LSM storage?**

LSMs excel at write-heavy workloads and distribute well across nodes.

### **Q: What is hinted handoff? Why is it needed?**

To maintain write availability during temporary node failures.

### **Q: Why is consistent hashing used instead of range partitioning?**

To distribute load evenly and avoid hotspots in write-heavy use cases (Cassandra, DynamoDB).

### **Q: What makes Bigtable ideal for range scans?**

Lexicographically sorted row keys + range-based tablet partitioning.

---

## 🧭 **7. One-Sentence Summary**

> Bigtable, Cassandra, and DynamoDB all combine LSM storage with distributed replication, partitioning, and background repair mechanisms—but differ in how they balance consistency, availability, elasticity, and operational complexity.

---

## ✅ **Next: Article 12 — Build Your Own Storage Engine (Capstone)**

Shall I proceed with **Article 12**, the capstone where we design a minimal RocksDB-like engine step by step?
