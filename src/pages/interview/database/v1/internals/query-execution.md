---
title: "8. Query Execution: What Really Happens During SELECT"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 8**, a full-length, CTO-grade deep dive into **Query Execution & Optimization**—what actually happens inside a database when you run a simple `SELECT` query.
This is one of the most important topics for interviews, database tuning, and understanding real system performance.

Perfect for **Kavriq**.

---



### *Inside the Planner, Optimizer, Executor & Vectorized Engine of Modern Databases*

When you write:

```sql
SELECT name, balance FROM users WHERE id = 42;
```

It looks simple.
But under the hood, a database performs dozens of steps involving:

* parsing
* binding
* rewriting
* logical planning
* cost-based optimization
* join strategy selection
* physical plan generation
* execution
* buffer pool interaction
* index access
* MVCC visibility filtering

Understanding query execution is essential for:

* system design interviews
* DB performance tuning
* writing scalable SQL
* understanding why certain queries are slow
* appreciating columnar/analytic engines (like DuckDB, Snowflake, ClickHouse)

This article breaks down the entire journey of a query, from SQL text to actual execution.

---

## 🧠 **1. Query Lifecycle Overview**

Every query goes through the same pipeline:

```
SQL Text
   ↓ Parse
   ↓ Resolve / Bind Names
   ↓ Rewrite
   ↓ Logical Plan
   ↓ Optimizer (CBO)
   ↓ Physical Plan
   ↓ Executor
   ↓ Results
```

Let’s explore each stage.

---

## ✍️ **2. Parsing**

The parser:

* tokenizes SQL
* checks syntax
* builds an abstract syntax tree (AST)

Example:

```
SELECT name FROM users WHERE id=42
```

Becomes:

```
SelectStmt
  - target: name
  - from: users
  - where: id = 42
```

This part is straightforward—almost every SQL engine has similar parse trees.

---

## 🏷️ **3. Binding / Name Resolution**

The binder resolves:

* which table is `users`?
* which column is `name`?
* does `id` exist?
* what is the type of each column?

It also checks:

* permissions
* schema validity
* function signatures

After binding, the AST becomes semantically valid.

---

## 🔁 **4. Rewrite Phase**

Many SQL engines apply rewrite rules:

### Examples:

* Flatten subqueries
* Convert `IN` to `EXISTS`
* Push down predicates
* Simplify expressions
* Unnest correlated subqueries

PostgreSQL has a powerful rewrite system; some queries are transformed dramatically before optimization.

---

## 🧱 **5. Logical Plan**

The logical plan is a representation of *what* to do (not yet *how*).

For example:

```
SELECT * FROM A JOIN B ON A.id = B.id WHERE A.age > 30;
```

Logical plan:

```
Filter(age > 30)
   ↓
Join (A.id = B.id)
   ↙       ↘
 Scan(A)   Scan(B)
```

The logical plan uses algebraic operators:

* Scan
* Filter
* Projection
* Join
* Group By
* Sort
* Limit
* Set operations (UNION, INTERSECT)

---

## 📊 **6. Cost-Based Optimization (CBO)**

This is the heart of query performance.

The optimizer evaluates many physical plan alternatives and selects the cheapest.

Optimization is NP-hard (exponential), so databases use pruning heuristics.

### Inputs to the optimizer:

* table statistics
* index statistics
* row counts
* distinct value counts
* histograms
* correlation estimates
* cost formulas (CPU, I/O, memory)

### The optimizer considers:

* which indexes to use
* join order
* join method (hash join, merge join, nested loop)
* push-down of filters
* parallelizability
* projection pruning
* partition pruning

The output of the optimizer is a **physical plan**.

---

## ⚙️ **7. Physical Operators (The Execution Blueprint)**

Now the engine chooses *how* to execute.

### Common operators:

* **Seq Scan** (heap scan)
* **Index Scan**
* **Index Only Scan**
* **Bitmap Heap Scan**
* **Hash Join**
* **Merge Join**
* **Nested Loop Join**
* **GroupAggregate**
* **Sort**
* **Limit**
* **Materialize**
* **Unique**

Understanding these is critical for performance tuning.

---

## 🤝 **8. Join Strategies Explained**

Joins are the most expensive operations in SQL. Choosing the right one is critical.

---

## **A. Nested Loop Join**

Algorithm:

```
for each row in Outer:
    lookup matching rows in Inner
```

Best when:

* small outer table
* indexed inner table

Performance:

* **Excellent** for selective joins
* **Terrible** for large scans

Used heavily in OLTP engines like PostgreSQL & InnoDB.

---

## **B. Hash Join**

Algorithm:

1. Build hash table on smaller side
2. Probe using larger side

Best when:

* no sorted inputs
* large scans
* equality join conditions

Hash joins dominate analytical workloads.

---

## **C. Merge Join**

Algorithm:

1. Both inputs sorted
2. Walk through both lists like a merge sort

Best when:

* both sides already sorted
* indexes available
* large sequential data

Merge joins avoid hashing and enable streaming.

---

## 📦 **9. Index Usage in Execution**

Indexes can be used in several ways.

---

## **A. Index Scan**

* Traverses index B+ Tree
* Fetches heap rows
* Great for point lookups & small ranges

---

## **B. Index-Only Scan**

* If index contains all referenced columns
* No heap lookup needed
* Very fast
* Depends on visibility map (PostgreSQL) or covering index (MySQL)

---

## **C. Bitmap Index Scan**

Used for:

* OR conditions
* Low-selectivity conditions

Workflow:

1. Build bitmap of matching row pointers
2. Fetch only necessary heap pages

---

## 📈 **10. Vectorized Execution (Modern Engines)**

Traditional executors process one row at a time (tuple-at-a-time).
This is slow due to:

* CPU branch mispredictions
* function call overhead
* poor cache utilization

Modern engines (DuckDB, ClickHouse, Snowflake, Spark):

### Use **vectorized execution**, which:

* processes 1024–4096 values at a time
* uses SIMD instructions
* minimizes branching
* maximizes CPU throughput

This leads to **10–50× performance improvements** for analytical queries.

---

## 🧱 **11. Columnar Optimizations**

Columnar engines (ORC, Parquet, ClickHouse):

* store data column-by-column
* compress columns independently
* query only required columns
* apply filter pushdown
* use dictionary encoding
* use min/max pruning
* support vectorized expression evaluation

For example:

A query filtering on `age` doesn’t even read other columns.

This reduces I/O dramatically.

---

## 🚀 **12. Predicate Pushdown**

Pushing filters as early as possible reduces data processed:

### Example

```sql
SELECT name FROM users WHERE age > 30;
```

Pushdown:

* apply `age > 30` filter before join
* avoid scanning entire table
* prune unnecessary partitions
* prune row groups in Parquet
* prune SSTable blocks (in LSM engines)

PostgreSQL, Spark, ClickHouse all aggressively push down predicates.

---

## 📜 **13. Query Plan Explain & EXPLAIN ANALYZE**

For debugging performance, engineers use:

* `EXPLAIN` → logical + physical plan
* `EXPLAIN ANALYZE` → actual runtime, buffers, timings

These expose:

* chosen indexes
* join types
* sort operations
* rows returned vs rows estimated
* misestimation penalties
* parallel workers
* I/O operations

Understanding EXPLAIN is mandatory for backend performance tuning.

---

## 🔍 **14. Real Examples**

### **PostgreSQL choose index scan vs seq scan**

Seq scan if:

* table small
* no useful index
* filter not selective
* scanning full table cheaper

### **Nested Loop when PK/FK join**

FK → PK lookups = efficient nested loops.

### **Merge Join when both inputs sorted**

Example: joining two large tables on their primary keys.

---

## 🧠 **15. Interview Mental Models**

These are the key points interviewers expect senior engineers to know:

---

### **1. Optimizer choice is driven by cost, not correctness.**

All plans return correct results. Optimizer picks cheapest.

---

### **2. Index scans shine for selective queries; seq scans win for large ones.**

---

### **3. Hash joins dominate when tables are large and unsorted.**

---

### **4. Merge joins are best when both inputs are already sorted.**

---

### **5. Vectorized execution is the reason modern analytic engines outperform traditional RDBMS.**

---

### **6. Columnar storage eliminates unnecessary column I/O by design.**

---

### **7. Statistics quality determines plan quality.**

Bad stats → bad plans → slow queries.

---

### **8. Rewriting matters.**

Many queries perform better after algebraic simplification.

---

## 🧭 **16. One-Sentence Summary**

> Query execution transforms SQL into a carefully optimized physical plan involving scans, filters, joins, and vectorized operations, all coordinated by a cost-based optimizer to minimize I/O, CPU usage, and memory footprint.

---

## ✅ **Next: Article 9 — Parquet, ORC & Columnar Storage Internals**

Shall I proceed with **Article 9**?
