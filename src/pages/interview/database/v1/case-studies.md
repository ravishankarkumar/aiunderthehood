---
title: "Database Case Studies"
description: Learn how Instagram, WhatsApp, Netflix, and Uber solved database scaling challenges in the real world.
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Real-world systems operate at massive scale — billions of queries per day, petabytes of data, millions of concurrent users.  
Studying how companies like **Instagram, WhatsApp, Netflix, and Uber** solved their database challenges helps us connect theory to practice.

---

## 1. Instagram

### Scaling Journey
- Early days: **PostgreSQL + Django** (monolith).  
- Growth: 1 million users in 2 months → needed caching and replication.  
- Today: PostgreSQL + **sharding**, **read replicas**, and **Memcached**.

### Techniques
- **Replication**: PostgreSQL read replicas for scaling reads.  
- **Sharding**: Users distributed across shards by user ID.  
- **Caching**: Memcached for reducing DB lookups.  
- **Search**: Elasticsearch for hashtags and users.  

### Lessons
- Start with a relational DB (don’t jump to NoSQL too early).  
- Add caching + replication first.  
- Sharding only when absolutely necessary.  

---

## 2. WhatsApp

### Scaling Journey
- Initially: 2 engineers scaling to millions of users.  
- Built on **Erlang** for concurrency + **Mnesia DB** (Erlang’s distributed DB).  
- Today: Uses **NoSQL (Cassandra)** for messages + in-memory caching.

### Techniques
- **Mnesia DB**: Distributed, in-memory database with built-in replication.  
- **Cassandra**: For durable, scalable message storage.  
- **Eventual Consistency**: Accepted for chat delivery (messages sync later).  
- **Optimized for Concurrency**: Erlang VM manages millions of sockets per server.  

### Lessons
- Concurrency is as important as the database.  
- Accept eventual consistency when latency matters more than strict ACID.  
- Use in-memory DBs for speed, NoSQL for scale.  

---

## 3. Netflix

### Scaling Journey
- Originally: Oracle RDBMS.  
- Migration: Needed global availability → moved to **AWS + Cassandra**.  
- Today: Polyglot persistence across multiple DBs.

### Techniques
- **Cassandra**: User viewing history (write-heavy, scalable).  
- **MySQL**: Billing and financial data (strong consistency needed).  
- **Elasticsearch**: Search + recommendation indexing.  
- **EVCache (custom Redis-like cache)**: To serve hot data.  

### Lessons
- One DB doesn’t fit all.  
- Combine SQL, NoSQL, and caches for workload-specific optimization.  
- Resiliency (multi-region replication) is as important as scale.  

---

## 4. Uber

### Scaling Journey
- Early: **Postgres + MySQL**.  
- Rapid growth: Needed to handle millions of trips and geospatial queries.  
- Today: Uses **MySQL, Cassandra, Redis, Elasticsearch** in combination.

### Techniques
- **MySQL**: Core trip and payment data (ACID).  
- **Cassandra**: Write-heavy geospatial and real-time data.  
- **Redis**: Fast lookups and caching.  
- **Elasticsearch**: Logging and trip search.  
- **Schemaless Layer**: Abstraction on top of MySQL for flexible schema evolution.  

### Lessons
- Polyglot persistence is key to modern scale.  
- Use Cassandra for write-heavy workloads.  
- Geospatial queries require special optimizations.  

---

## 5. Key Takeaways Across Case Studies

1. **Start simple** (Postgres/MySQL) and scale step by step.  
2. **Add caching and replication** before jumping to complex architectures.  
3. **Sharding** is inevitable at massive scale.  
4. **Polyglot persistence** is the norm in billion-user systems.  
5. **Eventual consistency** is often acceptable (social apps, messaging).  
6. **System design interviews** love these case studies — bring them up!  

---

## 6. Interview Tips

- If asked *“How would you scale to millions of users?”*:  
  - Reference Instagram (Postgres → Memcached → sharding).  
  - Reference WhatsApp (concurrency + eventual consistency).  
  - Reference Netflix (polyglot persistence).  
  - Reference Uber (geospatial + polyglot).  

👉 Example Answer:  
*“I’d start with Postgres like Instagram. For scaling, I’d add caching and replication. If needed, I’d shard by user ID. For search, I’d integrate Elasticsearch. For high write loads like Uber, I’d consider Cassandra. This is the polyglot persistence approach most large companies use.”*

---

## 7. Recap

- **Instagram** → Postgres, Memcached, Elasticsearch, sharding.  
- **WhatsApp** → Erlang + Mnesia, Cassandra, in-memory focus.  
- **Netflix** → Cassandra, MySQL, Elasticsearch, EVCache.  
- **Uber** → MySQL, Cassandra, Redis, Elasticsearch, schemaless layer.  

👉 Common thread: **No single DB is enough. Polyglot persistence + caching are essential.**

---

## Next Steps
👉 Continue with [Interview Guide: Databases in HLD](/interview/database/v1/interview-guide) to learn how to apply these lessons in system design interviews.

---
