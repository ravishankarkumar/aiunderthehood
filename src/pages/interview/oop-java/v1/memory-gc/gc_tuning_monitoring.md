---
title: "Tuning & Monitoring Garbage Collection in JVM"
description: Guide to JVM GC tuning and monitoring, including GC flags, log analysis, tools like JVisualVM and GCViewer, best practices, and interview tips for troubleshooting OutOfMemoryError.
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Garbage Collection (GC) is essential for automatic memory management in Java applications. But default settings may not always be optimal for your workload. Tuning GC and monitoring its behavior helps ensure **stability, performance, and predictability** in production systems. In this post, we’ll explore JVM GC tuning, log analysis, monitoring tools, and best practices.

---

## 1. JVM Flags for GC Configuration

The JVM provides numerous options to configure heap size and choose collectors.

### Heap Size Options
- **`-Xms<size>`** → Initial heap size.
- **`-Xmx<size>`** → Maximum heap size.
- **Example:** `-Xms1g -Xmx4g`

👉 Set `-Xms` = `-Xmx` in production to avoid runtime resizing overhead.

### GC Collector Selection
- **Serial GC:** `-XX:+UseSerialGC`
- **Parallel GC:** `-XX:+UseParallelGC`
- **G1 GC (default in modern JVMs):** `-XX:+UseG1GC`
- **ZGC:** `-XX:+UseZGC`
- **Shenandoah:** `-XX:+UseShenandoahGC`

### Tuning G1 GC (Example)
- `-XX:MaxGCPauseMillis=<ms>` → Target pause time.
- `-XX:InitiatingHeapOccupancyPercent=<n>` → When to start concurrent GC cycles.

---

## 2. Analyzing GC Logs

Enabling GC logging is critical for understanding memory behavior.

### Enable GC Logs
```
-Xlog:gc*:file=gc.log:time,uptime,level,tags
```

### Sample Log Entry
```
[2.345s][info][gc,start] GC(0) Pause Young (Normal) (G1 Evacuation Pause)
[2.345s][info][gc,heap] GC(0) Eden regions: 5->0(10)
[2.345s][info][gc,heap] GC(0) Survivor regions: 0->2(2)
[2.345s][info][gc,heap] GC(0) Old regions: 1->1
[2.350s][info][gc] GC(0) Pause Young (Normal) 50ms
```

### Key Metrics to Watch
- **Pause time:** How long the application was stopped.
- **Frequency:** How often GC cycles occur.
- **Promotion rate:** Objects moving from young → old gen.
- **Heap usage trend:** Detect memory leaks or growth.

---

## 3. Tools for Monitoring GC

Several tools make GC analysis easier:

### JVisualVM
- Bundled with JDK.
- Monitors heap, threads, GC activity.
- Supports heap dumps.

### JConsole
- Lightweight monitoring.
- Provides real-time GC and memory usage charts.

### GCViewer
- Open-source tool for parsing GC logs.
- Visualizes pause times, heap trends, and throughput.

### Other Modern Tools
- **Java Flight Recorder (JFR).**
- **Mission Control (JMC).**

---

## 4. Best Practices for GC Tuning

1. **Set heap sizes explicitly.** Avoid defaults in production.
2. **Choose the right collector.** G1 for general purpose, ZGC/Shenandoah for ultra-low latency.
3. **Tune pause targets.** Use `-XX:MaxGCPauseMillis` for G1.
4. **Monitor before tuning.** Avoid premature tuning.
5. **Heap dumps for leaks.** Use `jmap` or JVisualVM.

👉 **Golden Rule:** *Don’t over-tune without evidence. Always measure first.*

---

## 5. Interview Focus: Troubleshooting OutOfMemoryError

**Common Causes:**
- Heap too small (`-Xmx` too low).
- Memory leak (unreleased references).
- Excessive object creation.
- Native memory issues (direct buffers, threads).

**How to Troubleshoot:**
1. Check GC logs for **frequent full GCs** with little memory reclaimed.
2. Take a **heap dump** and analyze with Eclipse MAT or JVisualVM.
3. Look for **leak suspects** (e.g., unbounded caches, static collections).
4. If legitimate load requires more memory, increase `-Xmx`.

👉 **Interview Tip:** When asked *“How do you troubleshoot OutOfMemoryError?”*, always mention **heap dump analysis** and **GC log review** before just increasing memory.

---

## Summary

- JVM flags like `-Xms`, `-Xmx`, and collector-specific options are key to GC tuning.
- GC logs reveal pause times, frequency, and promotion rates.
- Tools like JVisualVM, JConsole, and GCViewer make monitoring easier.
- Best practices emphasize **measuring first, tuning second**.
- For **OutOfMemoryError troubleshooting**, rely on **GC logs + heap dumps**.

👉 For interviews, highlight a structured approach: check logs → analyze dumps → fix leaks → tune flags → scale if needed.
