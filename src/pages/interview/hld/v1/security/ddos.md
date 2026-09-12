---
title: "DDoS Protection in Distributed Systems"
description: Understanding Distributed Denial of Service (DDoS) attacks and protection mechanisms for resilient system design.
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

## DDoS Protection

**Distributed Denial of Service (DDoS) attacks** flood a service with malicious traffic to overwhelm resources and make it unavailable.  
Designing for DDoS protection is critical for internet-facing systems.

---

## 1. Types of DDoS Attacks

1. **Volumetric Attacks**  
   - Flood network with high bandwidth traffic.  
   - Example: UDP floods, amplification attacks (DNS, NTP).  

2. **Protocol Attacks**  
   - Exploit weaknesses in protocols (TCP SYN floods).  
   - Exhausts server resources like connection tables.  

3. **Application Layer Attacks**  
   - Target specific APIs or services (HTTP floods).  
   - Harder to detect, looks like normal traffic.  

---

## 2. DDoS Protection Strategies

### 2.1 Network-Level Defenses
- **CDNs & Anycast** → absorb traffic globally.  
- **Rate limiting** → restrict per-client requests.  
- **Firewalls & WAFs** → block malicious patterns.  

### 2.2 Application-Level Defenses
- **CAPTCHA / Bot detection** → separate humans from bots.  
- **Progressive backoff** → make abusive requests slower.  
- **Request validation** → drop malformed or suspicious requests.  

### 2.3 Architectural Defenses
- **Autoscaling** → absorb sudden traffic spikes.  
- **Isolation** → prevent one service from impacting others.  
- **Graceful degradation** → shed load but keep core features working.  

---

## 3. Real-World Examples

- **Cloudflare / Akamai** → global DDoS mitigation at edge.  
- **AWS Shield** → managed DDoS protection service.  
- **Google Cloud Armor** → rate limiting + geo-blocking.  

---

## 4. Interview Tips

- Always mention DDoS when discussing **security for internet-facing apps**.  
- Say: *“I’d use CDN + WAF + rate limiting, and auto-scaling to mitigate large attacks.”*  
- Differentiate between **network-level floods** vs **application-level floods**.  
- Tie into **graceful degradation** (better partial service than outage).  

---

## 5. Diagram

```
[ Attacker Botnets ] → [ CDN / WAF / Firewall ] → [ Application Servers ]
```

---

## 6. Next Steps

- Move to [Monitoring](/interview/hld/v1/observability/monitoring).  
- Revisit [Circuit breakers](/interview/hld/v1/reliability/circuit-breakers) for resilience strategies.  

---
