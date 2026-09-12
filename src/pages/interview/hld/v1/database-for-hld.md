---
title: "Database for HLD"
description: A quick guide to databases for High-Level Design interviews — SQL vs NoSQL, scaling strategies, caching, consistency models, and specialized databases.
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

In system design interviews, databases are one of the **most critical components** you’ll be asked about.  
This page is a **one-pager summary** of key database concepts for HLD interviews, with links to full deep-dive articles.

---

## 1. SQL vs NoSQL
- **SQL (Relational)**: structured schema, ACID transactions, strong consistency.  
  Best for: financial systems, structured data, strict constraints.  
- **NoSQL (Non-relational)**: flexible schema, BASE consistency, scale horizontally.  
  Types: Document (MongoDB), Key-Value (Redis), Wide-column (Cassandra), Graph (Neo4j).  
  Best for: high scale, flexible schemas, analytics.  

🔗 Deep dive: [SQL vs NoSQL](/interview/database/v1/sql-vs-nosql)

---

## 2. Scaling Strategies
- **Vertical scaling**: bigger machine (CPU/RAM). Easy but limited.  
- **Horizontal scaling**: add more machines. Needs sharding, replication, load balancing.  
- **Replication**:  
  - Primary-Replica (one write, many reads).  
  - Multi-primary (many writes, conflict resolution needed).  
- **Sharding**: split data across nodes (range, hash, directory).  

🔗 Deep dive: [Sharding vs Replication vs Partitioning](/interview/database/v1/sharding-vs-replication-vs-partitioning)  
🔗 Deep dive: [Scaling Patterns](/interview/database/v1/scaling-patterns)

---

## 3. Indexing & Query Optimization
- Index = auxiliary structure to speed up lookups.  
- Types: B-Tree, Hash, Composite, Full-text, Geospatial.  
- Trade-offs: faster reads, but slower writes & extra storage.  

🔗 Deep dive: [Database Indexing](/interview/database/v1/indexing)  
🔗 Deep dive: [Caching & Query Optimization](/interview/database/v1/caching-and-query-optimization)

---

## 4. Consistency Models
- **CAP Theorem**: can only have 2 of {Consistency, Availability, Partition tolerance}.  
- **PACELC**: If Partition → choose between Availability or Consistency. Else Latency vs Consistency.  
- Trade-offs:  
  - Banking → Strong Consistency.  
  - Social feeds → Eventual Consistency is acceptable.  

🔗 Deep dive: [CAP & Consistency Models](/interview/database/v1/cap-theorem)

---

## 5. Specialized Databases
- **Key-Value**: fast lookups (Redis, DynamoDB).  
- **Document**: JSON-like (MongoDB).  
- **Wide-Column**: huge scale, denormalized (Cassandra, Bigtable).  
- **Graph**: relationships, recommendations (Neo4j).  
- **Search**: inverted indexes (Elasticsearch).  
- **Time-Series**: metrics, logs (InfluxDB, Timescale).  

🔗 Deep dive: [Specialized Databases](/interview/database/v1/specialized-databases)

---

## 6. Distributed Transactions & Patterns
- **2PC**: strong consistency, but slow, blocking.  
- **3PC**: adds recovery, rarely used.  
- **Saga pattern**: split long transactions into compensating steps.  
- **CQRS**: separate read/write models.  
- **Event sourcing**: store state as events.  

🔗 Deep dive: [Distributed Transactions](/interview/database/v1/distributed-transactions)

---

## Interview Tips
- Always clarify: *“Do we need strong consistency or is eventual consistency acceptable?”*  
- State assumptions: DAU, QPS, read/write ratio, object size.  
- Call out trade-offs (consistency vs availability, cost vs performance).  
- Mention caching + indexing first for query optimization.  
- Don’t forget replication factor in storage estimates.  

---

## ✅ Summary
- Pick **SQL vs NoSQL** based on requirements.  
- Use **replication** for availability, **sharding** for scale.  
- **Indexes** & **caches** speed up reads, but add cost/trade-offs.  
- Choose the right **consistency model** for the problem.  
- Specialized databases exist for special needs (time-series, graph, search).  

For deeper study, explore the full **[Database Series Hub](/interview/database/v1)**.

---
