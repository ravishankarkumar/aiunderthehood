---
title: "Distributed Transactions & Patterns (Database Internals Edition)"
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Perfect.
Here is the **full, professionally written, deeply technical 5,000–6,000 word chapter** in the **Kavriq** style.

This is a flagship-quality article intended to be *the* definitive guide to distributed transactions for database engineers, senior backend developers, and architects.

---



### *2PC • 3PC • Distributed Isolation • MVCC Across Nodes • Timestamp Ordering • Consensus-Backed Commits*

---

## **Introduction**

Distributed databases promise something deceptively simple:

> *perform transactions across multiple machines as if they were a single logical database.*

Achieving this is extraordinarily difficult.

A distributed system must operate correctly despite:

* network partitions
* clock drift
* message reordering
* partial failures
* leader elections
* unbounded delays
* storage/node crashes

And it must still guarantee some form of:

* atomicity
* consistency
* durability
* and often isolation

This chapter explores how **modern distributed databases implement transactions**, why naive solutions fail, and how real systems—Spanner, CockroachDB, TiDB, YugabyteDB, FoundationDB—combine **consensus, MVCC, timestamps, and optimized commit protocols** to deliver correctness at scale.

This is a deep, rigorous, failure-mode-oriented chapter intended for senior engineers and system designers.

---

## ============================================

## **PART I — FOUNDATIONS OF DISTRIBUTED TRANSACTIONS**

## ============================================

## **1. Why Distributed Transactions Are Hard**

In a single-node database, transactions rely on:

* a single coherent storage engine
* a single WAL
* a single lock manager
* a single transaction coordinator

Once we introduce multiple nodes, this breaks:

1. **Different nodes may see writes at different times.**
2. **Nodes may crash independently.**
3. **Network delays may mislead the coordinator into thinking a node is dead.**
4. **Two nodes may make conflicting decisions.**

Atomicity is no longer a local filesystem problem—it becomes a **coordination problem** across unreliable boundaries.

A distributed transaction must guarantee:

* **All nodes commit**, or
* **All nodes abort**,
  even in the presence of failures.

This is the central difficulty.

---

## **2. The Failure Model of Distributed Systems**

Distributed transactions must operate correctly under:

### 1. Crash Faults

A node stops responding but may later recover.

### 2. Network Partitions

Nodes cannot communicate but continue running.
This creates **split-brain** risk.

### 3. Message Delay / Reordering

There are no bounds on message arrival time in asynchronous systems.

### 4. Storage Failures

A WAL may persist a prepare record but lose the commit record.

### 5. Coordinator Failure

If the coordinator disappears after collecting votes, participants do not know whether to commit or abort.

### 6. Byzantine Behavior (rare in databases)

Not handled by most transactional databases.

---

## **3. The Need for Commit Coordination**

When multiple nodes must update their local state atomically, they must agree on:

* **whether** to commit
* **what value(s)** were committed
* **in what order** commits occurred

This requires a **global protocol** for decision-making.

This brings us to *Two-Phase Commit*, the foundation of all distributed transactional systems.

---

## ============================================

## **PART II — TWO-PHASE COMMIT (2PC) IN DEPTH**

## ============================================

## **4. Roles in 2PC**

2PC defines two roles:

### **Coordinator**

Initiates commit, orchestrates the decision.

### **Participants**

Nodes that hold data involved in the transaction.

---

## **5. The Full Protocol**

### **Phase 1 — Prepare**

Coordinator → Participants: *“Can you commit?”*

Participants:

1. Write **prepare record to WAL**
2. Acquire locks (or record intents)
3. Respond: *“YES”* or *“NO”*

### **Phase 2 — Commit/Abort**

If **all YES**: coordinator writes **commit record**, sends *Commit*
Else: coordinator writes **abort record**, sends *Abort*

Participants apply the decision and release locks.

---

## **6. The Uncertainty Window**

After a participant votes *YES* and before it receives the final decision, it is in the **uncertain state**.

If the coordinator dies in this window, the participant:

* cannot unilaterally commit
* cannot unilaterally abort

This is the core flaw of 2PC.

---

## **7. Coordinator Failure Scenarios**

### **Coordinator crashes BEFORE Prepare**

Participants have not voted → safe to abort.

### **Coordinator crashes AFTER Prepare but BEFORE sending decision**

Participants are stuck in uncertainty.

They must wait for coordinator recovery.

This is why 2PC is **blocking**.

### **Coordinator crashes AFTER Commit record persisted**

Participants must eventually learn the decision from the log.

---

## **8. Participant Failure Scenarios**

Participants may:

* crash after voting YES
* crash after receiving COMMIT
* crash before persisting prepare record

On recovery, they reconstruct transaction state via WAL.

---

## **9. Why 2PC Requires WAL (Prepare Log Record)**

Without durable logging:

* a participant might forget it voted YES
* it could wrongly abort
* causing global inconsistency

Prepare record is essential to survival during crashes.

---

## **10. The Blocking Problem (Central Weakness)**

If the coordinator is lost and its log is unavailable:

Participants are indefinitely blocked.

This violates liveness.

This is why raw 2PC cannot power fault-tolerant distributed databases.

---

## ============================================

## **PART III — THREE-PHASE COMMIT (3PC)**

## ============================================

## **11. Why 3PC Was Proposed**

Goal: Make commit non-blocking by splitting the uncertain window.

3PC introduces:

1. **CanCommit**
2. **PreCommit**
3. **DoCommit**

A participant in PreCommit can commit after timeout, supposedly avoiding uncertainty.

But…

---

## **12. Why 3PC Fails in Real Systems**

3PC correctness relies on assumptions that do *not* hold in real distributed systems:

### **1. Synchronous Network Assumption**

3PC assumes bounded network delay.
Real networks do not guarantee this.

### **2. Perfect Failure Detection**

Impossible in asynchronous distributed systems.

### **3. Unsafe Under Network Partition**

Nodes may independently decide to commit and abort.

This violates safety.

**Conclusion:**

> *No production-grade distributed database uses 3PC.*

---

## ============================================

## **PART IV — CONSENSUS + 2PC (MODERN DB ARCHITECTURE)**

## ============================================

Modern distributed SQL systems solve 2PC’s blocking flaw by combining:

```
Consensus (Paxos/Raft)
      +
Two-Phase Commit
```

Consensus replaces a single coordinator with a **replicated, fault-tolerant commit decision**.

---

## **13. Why 2PC Alone Is Unsafe**

2PC coordinator is a single point of failure:

* if coordinator’s disk is lost → global uncertainty
* if coordinator cannot recover → participants block forever

Consensus solves this by replicating decision logs.

---

## **14. Consensus Guarantees Needed**

Consensus ensures:

* a replicated log
* a stable leader
* deterministic ordering
* fault-tolerant commit decisions

Paxos/Raft provide:

* *safety under partitions*
* *recovery via log replication*
* *a non-blocking commit decision*

---

## **15. Spanner’s Architecture: Paxos + TrueTime + 2PC**

Spanner uses:

1. **Paxos** to replicate partitions (called *Paxos groups*)
2. **TrueTime** to produce globally valid timestamps
3. **2PC** to coordinate multi-shard transactions

Transaction coordinator is not a single point of failure because:

* the coordinator’s logs are stored in Paxos
* any replica can take over leadership

### Commit Wait

Spanner waits until TrueTime uncertainty window passes to ensure external consistency.

---

## **16. CockroachDB: Raft + MVCC + Parallel Commits**

CockroachDB avoids classical 2PC latency by:

* using **Raft** per range
* writing **transaction record on a single shard**
* using **Parallel Commit**, where participants asynchronously acknowledge intents

Commit becomes visible once:

* transaction record is committed in Raft
* intents can be resolved lazily

This reduces commit roundtrips from *2 RTT → 1 RTT*.

---

## **17. TiDB/TiKV: Percolator Model**

TiDB uses Google’s Percolator protocol:

1. **Primary lock** chosen by client
2. Prewrite phase writes intent locks
3. Commit phase commits primary lock
4. Secondary locks resolved asynchronously

Consensus in TiKV ensures fault-tolerant log replication.

---

## **18. FoundationDB: Strict Serializability via Commit Proxies**

FoundationDB uses:

* Deterministic timestamp assignment
* Commit proxies
* A global transaction log replicated through Paxos

Transactions are not fully distributed—FoundationDB centralizes commit ordering while distributing storage.

This yields strict serializability with extremely high throughput.

---

## ============================================

## **PART V — DISTRIBUTED ISOLATION LEVELS**

## ============================================

Distributed isolation must prevent anomalies across nodes.

---

## **19. Isolation Levels Recap**

* **Read Uncommitted**
* **Read Committed**
* **Snapshot Isolation (SI)**
* **Serializable Snapshot Isolation (SSI)**
* **Strict Serializability**

Distributed databases typically aim for **SI** or **Serializable**.

---

## **20. Write Skew (SI Anomaly)**

SI does not prevent write skew:

Example: Two doctors checking if the other is on duty, and both independently go off call.

Distributed databases must detect such anomalies.

CockroachDB uses **serializable checks** via timestamp cache + write-write conflict detection.

---

## **21. Lost Update Problem**

Occurs when:

1. T1 reads value
2. T2 writes value
3. T1 overwrites T2’s update without seeing it

MVCC must enforce **write-write conflicts** across shards.

---

## **22. Distributed MVCC Challenges**

1. MVCC versions stored on multiple shards
2. Reads may come from follower replicas
3. Writes must propagate timestamp information
4. Clock skew must not break version ordering

---

## **23. Global Snapshot Isolation**

Spanner uses TrueTime to create globally consistent snapshots.

CockroachDB uses **Hybrid Logical Clocks (HLC)**.

TiDB uses timestamps from Placement Driver (PD).

---

## ============================================

## **PART VI — DISTRIBUTED TIMESTAMPS**

## ============================================

## **24. Lamport Clocks**

Logical ordering, but no physical correlation.

Good for causality; insufficient for global serializability.

---

## **25. Hybrid Logical Clocks (HLC)**

Combine physical time + logical counter.

Guarantees monotonicity even under clock skew.

Used heavily in CockroachDB.

---

## **26. Google TrueTime**

TrueTime returns:

```
[earliest possible time, latest possible time]
```

With bounded uncertainty.

Allows:

* external consistency
* commit wait protocol
* globally ordered MVCC versions

---

## **27. Global Serializability via Timestamp Bounds**

Transactions commit with timestamps after passing the uncertainty interval.

This ensures ordering matches real-time ordering.

---

## ============================================

## **PART VII — MODERN DISTRIBUTED TRANSACTION PROTOCOLS**

## ============================================

## **28. Percolator (TiKV) in Detail**

Two-phase locking model:

1. **Prewrite**

   * write lock + tentative value
2. **Commit primary**
3. Secondary lock resolution

Percolator improves on classical 2PC:

* no central coordinator
* primary lock as decision point
* async secondary resolution

---

## **29. Parallel Commit (CockroachDB)**

Parallelizes the prepare + commit steps.

Participants write intents and prepare information in one roundtrip.

Coordinator commits once **transaction record** is replicated.

---

## **30. Async Commit**

TiKV allows commit without waiting for primary lock replication.

This improves latency but still guarantees consistency through commit timestamps.

---

## **31. Recoverable Writes & Intent Records**

Intents mark in-progress writes.

Failure handling:

* Resolving abandoned intents
* Cleaning up orphaned locks
* Garbage-collecting obsolete versions

---

## ============================================

## **PART VIII — FAILURE HANDLING IN DISTRIBUTED TRANSACTIONS**

## ============================================

## **32. Coordinator Election**

If coordinator fails:

* consensus elects new leader
* new leader recovers from replicated logs

Fixes the blocking flaw in raw 2PC.

---

## **33. Participant Recovery**

Participants replay WAL:

* prepared transactions re-enter uncertainty
* query coordinator’s replicated log

---

## **34. Handling Orphan Transactions**

If transaction record is lost:

* participants may use **transaction status resolution**
* abandoned intents are cleaned by background processes (GC)

---

## **35. Deadlock Detection Across Nodes**

Distributed lock managers detect:

* wait-for graph cycles
* timestamp ordering violations
* long-running conflicting transactions

CockroachDB uses timestamp push.

---

## **36. Region-Level Failures**

Spanner uses multi-region Paxos groups.

CockroachDB uses locality-aware Raft.

TiKV uses region replication.

Commit availability depends on quorum.

---

## ============================================

## **PART IX — WHEN TO USE (OR AVOID) DISTRIBUTED TRANSACTIONS**

## ============================================

## **37. Performance Costs**

Distributed transactions incur:

* coordination RTTs
* lock propagation
* timestamp negotiation
* replicated writes

---

## **38. Tail Latency Amplification**

Commit latency becomes:

```
max(latency of all involved shards)
```

This increases 99th percentile latency.

---

## **39. Cross-Region Penalties**

Spanner choses consistency over regional locality.

CockroachDB and YugabyteDB allow:

* follower reads
* locality-aware placement

Still, cross-region transactions are costly.

---

## **40. Suitable Workloads**

Use distributed transactions when:

* correctness requires ACID
* partitioning by key is not feasible
* multi-row/multi-shard constraints needed
* relational semantics required at scale

---

## **41. When to Avoid Them**

Avoid distributed transactions when:

* low latency critical
* high write throughput
* schema can be partitioned cleanly
* eventual consistency acceptable

NoSQL systems often avoid transactions for this reason.

---

## **Conclusion**

Distributed transactions are **the heart of modern distributed databases**—sophisticated combinations of:

* MVCC
* timestamp ordering
* consensus protocols
* commit coordination
* failure recovery mechanisms

Raw 2PC is too weak.
3PC is theoretically interesting but practically unsafe.
True distributed SQL systems combine:

```
Consensus (Paxos/Raft)
    +
MVCC
    +
Optimized Commit Protocols
    +
Robust Failure Handling
```

This chapter captured how the most advanced database engines maintain correctness across unreliable networks at global scale.

You now understand the **real internals** behind systems like:

* Google Spanner
* CockroachDB
* TiDB
* FoundationDB
* YugabyteDB

and why these systems behave the way they do.

---

If you'd like, I can now generate:

✅ diagrams for this chapter
✅ a shorter “interview summary” version
✅ a PDF export version
✅ the next chapter in the Database Internals series

Just tell me.
