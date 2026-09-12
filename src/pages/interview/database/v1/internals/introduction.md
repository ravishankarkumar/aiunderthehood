---
title: "0. Introduction"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 0 — Introduction**, intentionally **short, sharp, and high-signal**.
This sets the tone for the series without going into depth (that begins with Article 1).

You can publish this directly on Kavriq.

---



## **Why Modern HLD Interviews Now Require Database Internals**

For years, system design interviews focused on high-level components: load balancers, caches, message queues, databases, and vague terms like “horizontal scaling.” You could clear rounds by drawing boxes, discussing trade-offs, and quoting familiar patterns.

Those days are gone.

Modern distributed systems — especially in India’s top product companies — have become intensely data-heavy, latency-sensitive, and cost-aware. As a direct result, HLD interviews now probe **how the data layer actually works**, not just how you use it. Candidates are increasingly expected to understand:

* **WAL (Write-Ahead Logging)** for durability
* **SSTables & LSM Trees** for write-optimized storage
* **B+ Trees** for OLTP indexing
* **MVCC** for concurrent reads/writes
* **Compaction, caching, and buffer pools** for performance under load

These aren’t academic concepts. They drive real-world decisions in systems at scale:

* WhatsApp’s message durability pipeline
* Cassandra and Bigtable powering global data
* Kafka’s log-segment architecture
* PostgreSQL and MySQL consistency guarantees
* RocksDB embedded inside every modern high-throughput service

Companies like **Google, Meta, Netflix, Uber, Stripe, CRED, Rippling, Zepto, Gojek, and Oracle** have discovered one thing:

### You cannot evaluate a senior engineer without evaluating their understanding of storage engine internals.

This shift happened for three reasons:

---

## **1. Modern workloads stress the storage layer first**

Applications today handle billions of writes, stream events, logs and analytical workloads. Scaling your compute is easy; scaling storage is not.
Teams need engineers who know *why* a system slows down, *what* bottleneck to look for, and *how* data structures influence latency.

---

## **2. Cloud-native systems hide complexity — until they don’t**

Using DynamoDB, Bigtable or CockroachDB is easy.
Operating them at scale is not.
Interviewers expect engineers to understand these internals so they can make informed design decisions, not rely on “magic managed services.”

---

## **3. Real failures usually come from misunderstandings of internals**

Data corruption, compaction stalls, replication lag, write amplification, snapshot failures — all originate in the storage path.
Modern system design interviews reflect this reality.

---

## **The Purpose of This Series**

This series exists to teach database internals **the way practicing engineers actually use them** — focusing on mental models, performance implications, and interview-ready reasoning.

From here on, each article will go deep: WAL, B+ Trees, LSM Trees, SSTables, MVCC, compaction, caching, distributed storage, and real database architectures.

If you’ve ever felt that storage engines are a “black box,” this series will open it.

---

## **Next Up:

Article 1 — Write-Ahead Logs & Durable Write Paths**

(From this point forward, the articles will be long, detailed, and diagram-heavy.)

---

If you'd like, I can now begin **Article 1** immediately.
