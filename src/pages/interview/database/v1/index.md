---
title: "Database Series Hub"
description: A structured guide to databases for system design interviews and real-world applications. Covers fundamentals, indexing, scaling, distributed systems, and real-world case studies.
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

## Database Series: From Fundamentals to Scale

Databases are the backbone of every scalable system.  
Whether you’re preparing for **high-level design (HLD) interviews** or building **real-world distributed systems**, understanding how databases work — and how they scale — is essential.

This series is structured to take you from **basics → advanced → real-world case studies**, so you can follow it like a course or jump directly to the topic you need.

---

## Articles in This Series

### **1. Fundamentals**
1. [Database Fundamentals](/interview/database/v1/fundamentals)  
   Basics of relational vs non-relational databases, ACID vs BASE, and core terminology.  
2. [SQL vs NoSQL](/interview/database/v1/sql-vs-nosql)  
   Deep dive into relational vs non-relational models, use cases, and trade-offs.  
3. [CAP Theorem & Consistency Models](/interview/database/v1/cap-theorem)  
   Understanding consistency, availability, and partition tolerance in distributed systems.  
4. [Database Indexing](/interview/database/v1/indexing)  
   How indexes speed up queries, different indexing techniques, and common pitfalls.  
5. [Sharding vs Replication vs Partitioning](/interview/database/v1/sharding-vs-replication-vs-partitioning)  
   Core scaling strategies, when to use them, and their trade-offs.

---

### **2. Scaling & Advanced Techniques**
6. [Database Scaling Patterns](/interview/database/v1/scaling-patterns)  
   Vertical vs horizontal scaling, replication strategies, and sharding techniques.  
7. [Specialized Databases](/interview/database/v1/specialized-databases)  
   Key-Value, Document, Wide-Column, Graph, Search, and Time-Series databases explained.  
8. [Caching & Query Optimization](/interview/database/v1/caching-and-query-optimization)  
   How caching works, caching strategies, and query optimization best practices.  
9. [Distributed Transactions & Patterns](/interview/database/v1/distributed-transactions)  
   2PC, 3PC, Saga pattern, CQRS, and Event Sourcing.

---

### **3. Real-World & Interviews**
10. [Polyglot Persistence & System Design Patterns](/interview/database/v1/polyglot-persistence)  
    Using multiple databases in a single system — real-world strategies.  
11. [Case Studies](/interview/database/v1/case-studies)  
    How Instagram, WhatsApp, Netflix, and Uber solved database scaling challenges.  
12. [Interview Guide: Databases in HLD](/interview/database/v1/interview-guide)  
    How to approach database design in system design interviews, pitfalls, and checklists.

---

### **4. Deep Dive: Internals**
13. [Database Internals](/interview/database/v1/internals)  
    Write-ahead logs, MVCC, B-Trees, LSM trees, consensus (Raft, Paxos), consistent hashing, and bloom filters.

---

## How to Use This Series
- **Beginner?** Start from Fundamentals (Articles 1–5).  
- **Interview Prep?** Focus on CAP, Scaling, Indexing, and Interview Guide.  
- **Real-world Engineer?** Jump into Scaling Patterns, Transactions, Case Studies, and Internals.  

---

## Further Reading
- *Designing Data-Intensive Applications* — Martin Kleppmann  
- *System Design Interview* — Alex Xu  
- High Scalability Blog  
- Engineering blogs of Netflix, Uber, Airbnb, and Meta  

---
