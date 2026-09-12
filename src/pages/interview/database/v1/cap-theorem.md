---
title: "CAP Theorem & Consistency Models"
description: Understand the CAP theorem in distributed systems, its implications on database design, and the different consistency models that real-world systems use.
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

When scaling databases across multiple servers or regions, trade-offs become unavoidable.  
The **CAP theorem** helps us reason about these trade-offs, and **consistency models** define what guarantees a system actually provides.

---

## 1. CAP Theorem

Proposed by Eric Brewer (later proven by Gilbert and Lynch), the CAP theorem states:

> In the presence of a **network partition**, a distributed system can guarantee at most **two out of three**:  
> **Consistency, Availability, Partition Tolerance.**

---

### 1.1 Definitions

- **Consistency (C)**  
  Every read receives the most recent write (single, up-to-date view of data).  
  Example: After transferring money, both balance queries show the same result.

- **Availability (A)**  
  Every request receives a (non-error) response, even if some nodes are down.  
  Example: Shopping website always returns product pages, even under server failure.

- **Partition Tolerance (P)**  
  The system continues to operate despite network failures splitting nodes.  
  Example: If half the servers cannot talk to the other half, the system still works (with some trade-offs).

---

### 1.2 The Triangle

CAP is often visualized as a triangle:

```
      Consistency
       /       \
      /         \
Availability --- Partition Tolerance
```

👉 In practice, **partition tolerance is non-negotiable** in distributed systems (networks can and do fail).  
So the real choice is usually **Consistency vs Availability**.

---

## 2. CAP Trade-Offs in Databases

### CP (Consistency + Partition Tolerance)
- Always consistent, but may sacrifice availability.  
- Example: **MongoDB (with majority write concern)**, **HBase**.  
- Use case: Banking — better to reject a request than show stale balances.

### AP (Availability + Partition Tolerance)
- Always available, but may return stale data.  
- Example: **Cassandra, DynamoDB**.  
- Use case: Social media feeds — it’s okay if a like shows up a bit later.

### CA (Consistency + Availability)
- Possible only in systems without partitions (i.e., single-node systems).  
- Example: **Traditional RDBMS (Postgres, MySQL) on one server**.  
- Not achievable at scale across unreliable networks.

---

## 3. Beyond CAP: PACELC Theorem

CAP is too coarse for modern systems. **PACELC** refines it:

> **If Partition (P) happens, choose between Availability (A) or Consistency (C).**  
> **Else (E), choose between Latency (L) or Consistency (C).**

- Many modern databases advertise where they sit in PACELC.  
  - DynamoDB → AP/EL (prioritizes availability and low latency).  
  - Spanner → CP/EC (prioritizes consistency even at the cost of latency).

---

## 4. Consistency Models

Not all "consistency" is the same. Different databases offer different guarantees:

### 4.1 Strong Consistency
- Reads always return the latest write.  
- Example: **Spanner**, **Zookeeper**.  
- Use case: Banking transactions.

### 4.2 Eventual Consistency
- Reads may be stale, but replicas converge eventually.  
- Example: **Cassandra, DynamoDB (default mode)**.  
- Use case: Social feeds, DNS.

### 4.3 Causal Consistency
- Causally related operations are seen in order, but concurrent ops may differ.  
- Example: **COPS system** (academic), partially in Cosmos DB.  
- Use case: Messaging apps (you always see your own messages in order).

### 4.4 Read-Your-Writes Consistency
- A client always sees its own writes immediately.  
- Example: DynamoDB with session consistency.  
- Use case: Social apps — if you post, you should see it right away.

### 4.5 Monotonic Reads
- Once you’ve read a value, you won’t see an older value later.  
- Ensures "time doesn’t go backwards."

---

## 5. Interview Tips

1. **Explain CAP in 1 sentence**:  
   *“In the presence of partitions, you can’t have both consistency and availability.”*  

2. **Avoid saying "pick two" without nuance**:  
   - Real systems often sit on a spectrum.  
   - Mention PACELC if you want to stand out.  

3. **Link to use cases**:  
   - Banking → CP.  
   - Social media → AP.  
   - Single-server RDBMS → CA.  

4. **Show awareness of consistency models**:  
   - Many interviewers test if you know more than just "eventual consistency."

---

## 6. Recap

- CAP theorem explains trade-offs in distributed systems.  
- In practice: always **P**, so it’s about **C vs A**.  
- PACELC adds nuance (latency trade-offs).  
- Databases offer multiple **consistency models** (strong, eventual, causal, etc.).  
- Interview tip: Always tie CAP to **real-world examples**.

---

## Next Steps
👉 Continue with [Database Indexing](/interview/database/v1/indexing) to learn how to speed up queries and reduce disk lookups.

---
