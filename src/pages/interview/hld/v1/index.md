---
title: "HLD Series Hub"
description: A structured guide to High-Level Design (HLD) for interviews and real-world systems — covering foundations, databases, caching, scalability, distributed systems, reliability, and more.
layout: ../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

## High-Level Design (HLD) Series: From Basics to Millions of Users

High-Level Design (HLD) is at the heart of **system design interviews** and **real-world architecture**.  
This series is structured to take you from **fundamentals → advanced distributed systems → practical case studies**, so you can use it as a course or jump into topics as needed.  

---

## Articles in This Series

### **1. Foundations**
1. [System Design Mindset](/interview/hld/v1/foundations/system-design-mindset)  
   Clarifying requirements → constraints → bottlenecks → scaling.  
   Always start simple (monolith) and scale step by step.  
2. [Workload Estimation](/interview/hld/v1/foundations/workload-estimation)  
   Requests/sec, QPS, throughput.  
   Storage needs (GB → TB → PB).  
   Network bandwidth & latency awareness.  

---

### **2. Diagramming**
1. [C4 Model](/interview/hld/v1/diagramming/c4_model)

### **2. Databases & Storage**
<!-- //todo PACELC in parallel tp cap etc -->
1. [Database for HLD](/interview/hld/v1/database-for-hld)  
<!-- 2. [Sharding, Replication & Scaling Patterns](/interview/hld/v1/databases/sharding-replication-scaling)  
3. [Caching & Query Optimization](/interview/hld/v1/databases/caching-query-optimization)  
4. [Consistency Models & CAP/PACELC](/interview/hld/v1/databases/consistency-models)  
5. [Specialized Databases (KV, Document, Graph, Search, Time-series)](/interview/hld/v1/databases/specialized-databases)   -->

---

### **3. Caching**
1. [Cache-aside, Write-through, Write-back](/interview/hld/v1/caching/strategies)  
2. [TTLs & Eviction Policies](/interview/hld/v1/caching/eviction-policies)  
3. [CDN Caching](/interview/hld/v1/caching/cdn-caching)  
4. [Pitfalls: Invalidation & Hot Keys](/interview/hld/v1/caching/pitfalls)  

---

### **4. Networking & Communication**
1. [Protocols: HTTP/HTTPS, gRPC, WebSockets](/interview/hld/v1/networking/protocols)  
2. [APIs: REST vs GraphQL](/interview/hld/v1/networking/apis)  
3. [Load Balancing (L4 vs L7, Algorithms)](/interview/hld/v1/networking/load-balancing)  
4. [CDNs & Edge Computing](/interview/hld/v1/networking/cdns-edge)  

---

### **5. Scalability Patterns**
1. [Horizontal vs Vertical Scaling](/interview/hld/v1/scalability/scaling)  
2. [Microservices vs Monoliths](/interview/hld/v1/scalability/microservices-vs-monoliths)  
3. [Event-driven Architectures: Queues, Pub/Sub, Retries, Backpressure](/interview/hld/v1/scalability/event-driven)  

---

### **6. Distributed Systems Concepts**
1. [CAP Theorem & PACELC](/interview/hld/v1/distributed/cap-pacelc)  
2. [Consensus Algorithms: Raft, Paxos](/interview/hld/v1/distributed/consensus)  
3. [Quorum Reads/Writes](/interview/hld/v1/distributed/quorum)  
4. [Leader Election, Heartbeats, Failover](/interview/hld/v1/distributed/leader-election)  
5. [Eventual vs Strong Consistency](/interview/hld/v1/distributed/consistency-tradeoffs)  

---

### **7. Reliability & Fault Tolerance**
1. [Replication (Sync vs Async)](/interview/hld/v1/reliability/replication)  
2. [Failover Strategies (Active-Passive, Active-Active)](/interview/hld/v1/reliability/failover)  
3. [Geo-replication & Multi-region Systems](/interview/hld/v1/reliability/geo-replication)  
4. [Graceful Degradation](/interview/hld/v1/reliability/graceful-degradation)  
5. [Circuit Breakers, Retries, Timeouts](/interview/hld/v1/reliability/circuit-breakers)  

---

### **8. Security**
1. [Authentication vs Authorization (OAuth2, JWT, RBAC)](/interview/hld/v1/security/authentication-authorization)  
2. [TLS & Encryption (At Rest vs In Transit)](/interview/hld/v1/security/encryption)  
3. [Rate Limiting & Throttling](/interview/hld/v1/security/rate-limiting)  
4. [DDoS Protection](/interview/hld/v1/security/ddos)  

---

### **9. Observability**
1. [Monitoring (Prometheus, Datadog)](/interview/hld/v1/observability/monitoring)  
2. [Centralized Logging (ELK, Splunk)](/interview/hld/v1/observability/logging)  
3. [Distributed Tracing (Jaeger, OpenTelemetry)](/interview/hld/v1/observability/tracing)  
4. [Alerting Systems (PagerDuty, OpsGenie)](/interview/hld/v1/observability/alerting)  

---

### **10. Common System Design Problems**
1. [URL Shortener (TinyURL)](/interview/hld/v1/problems/url-shortener)  
2. [News Feed (Facebook/Twitter)](/interview/hld/v1/problems/news-feed)  
3. [Chat System (WhatsApp, Slack)](/interview/hld/v1/problems/chat-system)  
4. [Search (Google/Elasticsearch)](/interview/hld/v1/problems/search)  
5. [Video Streaming (YouTube/Netflix)](/interview/hld/v1/problems/video-streaming)  
6. [E-commerce Checkout (Amazon)](/interview/hld/v1/problems/ecommerce)  
7. [Ride Hailing (Uber)](/interview/hld/v1/problems/ride-hailing)  
8. [Payment System](/interview/hld/v1/problems/payment-system)  

---

### **11. Soft Skills for HLD Interviews**
1. [Interview Strategy & Trade-offs](/interview/hld/v1/soft-skills-hld)  

---

### **12. Scaling to Millions**
1. [Scaling One-Pager](/interview/hld/v1/scaling-one-pager)  

---

### **13. Frequently Asked Problems**
1. [Index page](/interview/hld/v1/faq-problems/frequently-asked-problems)
<!-- 1. [Design a Key-Value Store (DynamoDB)](/interview/hld/v1/faq-problems/kv-store)  
2. [Design a Rate Limiter](/interview/hld/v1/faq-problems/rate-limiter)  
3. [Design a Notification Service](/interview/hld/v1/faq-problems/notification-service)  
4. [Collaborative Editing (Google Docs)](/interview/hld/v1/faq-problems/collaborative-editing)  
5. [Leaderboards & Ranking System](/interview/hld/v1/faq-problems/leaderboard)  
6. [Multi-tenant SaaS Platform](/interview/hld/v1/faq-problems/multi-tenant-saas)  
7. [Distributed Cache (Redis)](/interview/hld/v1/faq-problems/distributed-cache)  
8. [Video Conferencing (Zoom/Meet)](/interview/hld/v1/faq-problems/video-conferencing)   -->

---

## How to Use This Series
- **Beginner?** Start with Foundations + Databases.  
- **Interview Prep?** Focus on Scalability, CAP, Reliability, and Common Problems.  
- **Real-world Engineer?** Deep dive into Distributed Systems, Observability, and Security.  
- **Quick Review?** Read the Scaling One-Pager before your interview.  

---

## Further Reading
- *Designing Data-Intensive Applications* — Martin Kleppmann  
- *System Design Interview* — Alex Xu  
- *Site Reliability Engineering (SRE)* — Google  
- High Scalability Blog  
- Engineering blogs of Netflix, Uber, Airbnb, and Meta  

---
