---
title: "9. Parquet, ORC & Columnar Storage Internals"
layout: ../../../../../layouts/DocsLayout.astro
contentStatus: "Migrated legacy content; review pending"
---

Below is **Article 9**, a deep, CTO-level, highly educational piece on **columnar storage internals**—Parquet, ORC, vectorized execution, encodings, and the optimizations that power modern analytical databases.
Perfect for **Kavriq** and extremely relevant for high-level system design interviews.

---



### *Why Analytical Databases Are 10–100× Faster Than Row Stores*

Modern analytics systems—Snowflake, BigQuery, ClickHouse, DuckDB, Spark, Presto/Trino, Druid—depend on **columnar formats** like Parquet and ORC.

Columnar storage is perhaps the single biggest reason analytical workloads are orders of magnitude faster than traditional row-oriented databases like MySQL and PostgreSQL.

This article explains:

* Row vs columnar storage
* Parquet / ORC file layout
* Column chunks, row groups, page structures
* Predicate pushdown
* Dictionary encoding, run-length encoding (RLE), delta encoding
* Bit packing, null bitmaps
* Compression workflow
* Vectorized execution synergy

If you understand this article, you understand *why* systems like Snowflake and ClickHouse exist, and why they’re so fast.

---

## 🧱 **1. Why Columnar Storage Exists**

Row stores are optimized for OLTP:

```
[ id | name | email | age | balance ]
```

If you query:

```sql
SELECT age FROM users WHERE balance > 10000;
```

A row-store must read **every column**, even though you only need:

* `balance`
* `age`

This leads to:

* Huge unnecessary I/O
* Poor compression
* Slow scans

Columnar storage flips this model:

```
Column 1: id values
Column 2: name values
Column 3: email values
Column 4: age values
Column 5: balance values
```

Benefits:

* Only required columns are read → massive I/O reduction
* Columns compress extremely well
* Vectorized execution accelerates filtering/aggregation
* Data skipping (min/max, bloom filters, zone maps) avoids reading irrelevant pages

This makes columnar formats ideal for **analytical workloads**.

---

## 🏗️ **2. Parquet & ORC File Layout Basics**

Both formats follow similar structural principles:

```
File
 ├── Row Groups
 │    ├── Column Chunk (col1)
 │    ├── Column Chunk (col2)
 │    └── Column Chunk (col3)
 ├── Metadata
 └── Footer
```

---

## **Row Group**

A horizontal partition of rows.
Typical size: **64MB–512MB**.

Each row group contains:

* multiple column chunks
* statistics (min/max, null count)
* bloom filters or dictionary info

---

## **Column Chunk**

A vertical slice of a column within a row group.

Stored as:

* pages (data pages, dictionary pages)
* page-level compression
* optional encodings

---

## **Footer**

Footer stores:

* schema
* metadata
* offsets
* compression details
* statistics

Footer is always at the end so readers can quickly jump to it.

---

## 🔍 **3. Data Pages: Where Encoding Happens**

Column chunks are divided into **pages** (typically 8KB–1MB).

Pages contain:

* encoded values
* null bitmaps
* optional dictionaries
* statistics (min/max)

Encodings drastically shrink the data footprint.

---

## 🧠 **4. Encodings: The Secret to Columnar Efficiency**

Columnar formats allow efficient compression because:

* values are homogeneous
* values often repeat or have patterns
* data ranges are predictable
* adjacent values are related

Let’s explore common encodings.

---

## 🔤 **A. Dictionary Encoding**

If a column has repeated strings or values:

```
"CA"
"CA"
"NY"
"NY"
"NY"
```

Dictionary:

```
CA → 0
NY → 1
```

Encoded values:

```
0,0,1,1,1
```

Massively reduces storage for categorical columns.

---

## 📏 **B. Run-Length Encoding (RLE)**

If values repeat consecutively:

```
1,1,1,1,1,4,4,4,9
```

RLE stores:

```
(1, count=5), (4, count=3), (9, count=1)
```

Great for sorted or semi-sorted columns.

---

## ➖ **C. Delta Encoding**

For numeric columns with monotonic patterns:

```
100, 105, 110, 115
```

Store:

```
base = 100
deltas = 5,5,5
```

Excellent for timestamps.

---

## 🔢 **D. Bit Packing**

If a column only needs few bits (e.g., small integers):

* instead of 32-bit integers
* pack into 5-bit or 12-bit slots

Dramatically reduces size and improves SIMD processing.

---

## ⚪ **E. Null Bitmaps**

Nulls are stored as:

```
1110101110
```

Where 1 = value present, 0 = null.

---

### **Encoding Synergy**

Encodings are combined:

* Dictionary + RLE
* Delta + Bit packing
* Null bitmap + dictionary

This makes Parquet extremely compression-friendly.

---

## 📉 **5. Predicate Pushdown**

This is one of the biggest performance advantages.

### Example Query

```sql
SELECT amount FROM transactions WHERE amount > 1000000;
```

Parquet stores min/max per:

* row group
* column chunk
* data page

If a page has:

```
min(amount) = 0
max(amount) = 500000
```

The engine **skips the entire page**.

This avoids:

* reading
* decompressing
* decoding
* evaluating predicates

Thus predicate pushdown provides **orders of magnitude performance boosts**.

---

## 🔦 **6. Statistics and Data Skipping**

Parquet & ORC embed statistics per:

* row group
* page
* column

Examples:

* min
* max
* count
* null count

Advanced systems add:

* bloom filters
* zone maps
* quantile sketches

ClickHouse pioneered extensive data skipping techniques.

---

## 🚀 **7. Vectorized Execution: Why Columnar + SIMD = Magic**

Columnar layout plus columnar encoding enables **SIMD processing**.

Instead of:

```
for each row:
    evaluate predicate
```

Vectorized engines evaluate:

```
process 1024 values at once using SIMD instructions
```

Benefits:

* fewer CPU branches
* fewer function calls
* contiguous memory → cache-friendly
* 10×–50× faster filtering
* massive aggregation speedups

DuckDB, ClickHouse, Snowflake, BigQuery all depend heavily on vectorized execution.

---

## 🗄️ **8. Parquet vs ORC Differences**

| Feature             | Parquet                             | ORC                                      |
| ------------------- | ----------------------------------- | ---------------------------------------- |
| Origin              | Twitter + Cloudera                  | Hortonworks                              |
| Encoding            | Dictionary, RLE, Delta, Bit packing | Similar + lightweight indexes            |
| Compression         | Snappy, GZIP, LZ4, ZSTD             | Highly optimized ZLIB + ZSTD             |
| Statistics          | row group + page                    | row group + stripe + column stats        |
| Bloom filters       | optional                            | built-in                                 |
| Striping            | not explicit                        | ORC uses stripes (nested row groups)     |
| String optimization | dictionary                          | dictionary + lightweight direct encoding |

### Key difference:

ORC has richer metadata → better skipping.
Parquet has broader adoption (Spark, DuckDB, BigQuery, Snowflake).

---

## 🧪 **9. Why Columnar Storage Dominates Analytics**

### ✔ Massive compression

5–50× smaller than row stores.

### ✔ Only read needed columns

Query touches 2 columns? Read only those 2.

### ✔ Excellent predicate pushdown

Min/max + bloom filters = skip entire data ranges.

### ✔ Perfect for vectorized execution

Contiguous memory → fast CPU operations.

### ✔ Great for cloud object storage

Parquet is ideal for S3 / GCS / Azure Blob:

* immutable
* splittable
* self-describing

### ✔ Scales linearly

Add more nodes → scan more row groups in parallel.

---

## 🧠 **10. Interview Mental Models**

Key points interviewers expect:

---

### **1. Row stores are for OLTP; column stores are for OLAP.**

This is the most important distinction.

---

### **2. Columnar formats read far less data.**

I/O dominates analytics. Reduce I/O → huge speedups.

---

### **3. Encodings make compression extremely effective.**

Especially dictionary + RLE + delta + bit packing.

---

### **4. Predicate pushdown eliminates most of the work.**

Using min/max, bloom filters, null counts.

---

### **5. Vectorized execution = CPU-bound performance.**

Thousands of values processed per batch.

---

### **6. Parquet/ORC are immutable.**

Perfect for distributed storage in data lakes.

---

### **7. Row groups are key to parallelism.**

Each row group can be scanned independently.

---

### **8. Columnar != LSM; they serve different use cases.**

LSM → write optimization
Columnar → read optimization

---

## 🧭 **11. Summary in One Sentence**

> Parquet and ORC achieve massive analytical speedups by storing data column-by-column with powerful encodings, statistics, predicate pushdown, and vectorized execution—turning CPU, memory, and I/O into highly optimized, parallel pipelines.

---

## ✅ **Next: Article 10 — Distributed Storage: Replication, Consistency & Quorums**

Shall I proceed with **Article 10**?
