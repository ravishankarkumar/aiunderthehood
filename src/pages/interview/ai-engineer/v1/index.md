---
title: AI Engineer Interview Prep
layout: ../../../../layouts/DocsLayout.astro
---

A complete interview preparation guide for AI Engineer roles. It covers the ML fundamentals, deep learning intuition, LLM systems, agents, RAG, AI system design, infrastructure, coding patterns, and behavioral judgment expected in modern AI engineering interviews.

The guide is structured around how interviews actually work at top AI companies. Q&A sections are concise by design — they tell you what to say in 2–3 minutes, with links to the deep-dive articles in ml-essentials and ai-engineering for the full derivations.

System design articles are full walkthroughs — because those questions are 45 minutes and require a complete thought process, not just a checklist.

> **This is a living roadmap.** Articles and Q&A pages are written and published one by one. Items listed without a link are planned and coming. Linked items are published and ready to read.

---

## Who This Is For

- Engineers targeting **AI Engineer** roles (LLM systems, agents, RAG, inference infrastructure)
- Engineers who need enough ML depth to discuss model behavior, evaluation, and deployment trade-offs clearly
- Senior engineers preparing for staff-level system design rounds
- Anyone who builds AI systems and wants to be able to articulate the tradeoffs clearly

---

## Section 1 — ML Fundamentals Q&A

The baseline questions that appear in almost every ML interview regardless of role. If you can't answer these fluently, nothing else matters.

- Loss Functions — MSE, Cross-Entropy, Hinge, Focal — When to Use Each
- Backpropagation — What It Is, How to Explain It in 2 Minutes
- Regularization — L1 vs L2, Dropout, Early Stopping — The Intuition
- Bias-Variance Tradeoff — How to Diagnose and Fix Each
- Overfitting — How to Detect It, How to Fix It
- Gradient Vanishing and Exploding — Causes and Solutions
- Batch Size Effects — What Changes When You Scale Batch Size
- Learning Rate — How to Set It, What Goes Wrong
- Normalization — Batch Norm vs Layer Norm vs RMS Norm — When to Use Each
- Evaluation Metrics — Accuracy, Precision, Recall, F1, AUC-ROC — Which to Use When
- Class Imbalance — How to Handle It in Training and Evaluation
- Cross-Validation — K-Fold, Stratified, Time-Series Split
- Probability Basics — Bayes' Theorem, MLE, MAP — The Interview Questions
- The Questions Interviewers Actually Ask About Classical ML

---

## Section 2 — Deep Learning & Transformers Q&A

The architecture questions. Interviewers expect you to explain how things work, not just that they work.

- Attention Mechanism — How to Explain Self-Attention from Scratch
- Why Scaled Dot-Product? — The Softmax Saturation Problem
- Multi-Head Attention — What Each Head Learns
- Positional Encoding — Sinusoidal vs RoPE vs ALiBi — The Tradeoffs
- Layer Norm vs Batch Norm in Transformers — Why Transformers Use Layer Norm
- Residual Connections — Why They Work, What Happens Without Them
- The FFN in a Transformer Block — What It Does and Why It's There
- KV Cache — How It Works, Memory Cost, When It Helps
- Flash Attention — The Problem It Solves, How It Solves It
- BERT vs GPT vs T5 — When to Use Each Architecture
- Fine-Tuning vs Prompting — How to Choose
- LoRA — The Intuition, When It Works, When It Doesn't
- Quantization — INT8, INT4, GPTQ — What You Lose and Gain
- Scaling Laws — What They Predict, What They Don't
- Common Transformer Interview Gotchas

---

## Section 3 — LLMs, Agents & Generative AI Q&A

The most underserved area in interview prep. These questions are less standardized because the field is new — which means strong answers here are genuinely differentiating.

### LLM Internals
- How Does an LLM Generate Text? — The Full Loop
- Tokenization — BPE, WordPiece, SentencePiece — What Interviewers Ask
- Temperature, Top-k, Top-p, Min-p — How to Explain Sampling
- Context Window — What Limits It, How to Work Around It
- Hallucination — Why It Happens, How to Reduce It
- System Prompts — What They Do at the Inference Level
- Structured Output — How JSON Mode and Constrained Decoding Work

### Training and Alignment
- RLHF — The Full Pipeline, What Can Go Wrong
- DPO — How It Differs from RLHF, When to Use It
- Instruction Tuning — What It Does to the Model
- Catastrophic Forgetting — What It Is, How to Mitigate It
- The Alignment Tax — Capability vs Safety Tradeoffs

### Agents and Agentic Systems
- What Makes a System "Agentic"? — The Interview Definition
- ReAct vs Chain-of-Thought vs Tool Use — The Differences
- Tool Calling — How It Works Under the Hood
- Agent Reliability — Why Agents Fail and How to Make Them More Robust
- State Management in Long-Running Agents
- Multi-Agent Systems — When They Help, When They Add Complexity
- Memory in Agents — Episodic, Semantic, Procedural — Interview Framing
- Prompt Injection in Agents — What It Is, How to Defend Against It
- Evaluating Agents — Why It's Hard, What Actually Works
- The Context Window Problem in Agents — Strategies and Tradeoffs

### RAG and Retrieval
- Why RAG Exists — The Two Problems It Solves
- RAG vs Fine-Tuning — How to Choose
- Chunking Strategies — What Interviewers Ask
- Re-ranking — Why It Matters, How Cross-Encoders Work
- RAG Failure Modes — The 5 Ways RAG Goes Wrong
- Evaluating RAG — RAGAS, Faithfulness, Relevance

### Generative Models
- How Diffusion Models Work — The 2-Minute Explanation
- VAE vs GAN vs Diffusion — The Tradeoffs
- Classifier-Free Guidance — What It Does
- Multimodal Models — How Vision-Language Models Work

---

## Section 4 — AI System Design

Full walkthroughs of the system design questions that appear in senior AI engineer interviews. Each article covers: requirements clarification, high-level architecture, component deep-dives, tradeoffs, failure modes, and scaling considerations.

Code samples in Python where relevant.

### Published
- [Vector Databases — Interview Guide](/interview/ai-engineer/v1/db/vector-database)

### Planned
- Design a RAG System for Enterprise Search
- Design a Production LLM Serving System
- Design an AI Agent for Task Automation
- Design a Real-Time Recommendation System with Embeddings
- Design an LLM Evaluation Pipeline
- Design a Multi-Agent Orchestration System
- Design a Low-Latency Inference System

---

## Section 5 — Data & Infrastructure Q&A

The infrastructure questions that separate engineers who've shipped AI systems from those who've only trained models.

### Vector Databases
- [Vector Databases — Interview Guide](/interview/ai-engineer/v1/db/vector-database)

### Feature Stores and Pipelines
- What Is a Feature Store and Why Does It Exist?
- Training-Serving Skew — What It Is, How to Prevent It
- Point-in-Time Correct Features — Why It Matters, How to Implement It
- Streaming vs Batch Features — When to Use Each
- Data Versioning — Why It Matters for ML

### Model Serving and MLOps
- Online vs Batch Inference — How to Choose
- Dynamic Batching — How It Works, What It Buys You
- Model Versioning and Canary Deployments for ML
- Monitoring ML Models in Production — What to Track
- Data Drift vs Concept Drift — The Difference and How to Detect Each
- The ML Platform — Build vs Buy — How to Answer This Question

### Distributed Systems for AI
- Why Distributed Training Is Hard — The Communication Bottleneck
- Data Parallelism vs Model Parallelism — When to Use Each
- ZeRO Optimizer — What It Does and Why It Matters
- GPU Memory — How to Reason About It in Interviews

---

## Section 6 — Coding Patterns

The "implement this in 30 minutes" questions. Language-agnostic explanations with Python implementations.

### Core Algorithms
- Implement Softmax — Numerically Stable Version
- Implement Attention — Scaled Dot-Product from Scratch
- Implement Beam Search
- Implement Top-p (Nucleus) Sampling
- Implement BPE Tokenization
- Implement k-Means Clustering
- Implement Cosine Similarity Search (Brute Force)

### ML Patterns
- Implement a Training Loop with Gradient Accumulation
- Implement Early Stopping
- Implement a Simple Evaluation Harness
- Implement Exponential Moving Average for Model Weights

### Agent and LLM Patterns
- Implement a Simple Tool-Calling Loop
- Implement a Retry-with-Backoff LLM Client
- Implement a Simple RAG Pipeline
- Implement a Token Budget Manager
- Implement Structured Output Parsing with Validation

### Systems Patterns
- Implement a Simple In-Memory Vector Store
- Implement an LRU Cache for Embeddings
- Implement a Rate Limiter for LLM API Calls
- Implement a Simple Async Request Batcher

---

## Section 7 — Behavioral & Career

The questions that decide senior-level offers. Technical ability gets you to the final round — behavioral answers close it.

### Talking About Your Work
- How to Describe an AI System You Built — The STAR Framework for ML
- How to Talk About a Model That Failed in Production
- How to Discuss Tradeoffs You Made Under Constraints
- How to Talk About Working with Ambiguous Requirements

### Senior-Level Questions
- How to Answer "What's Your Approach to Evaluating LLM Systems?"
- How to Answer "How Do You Keep Up with the Field?"
- How to Answer "What Would You Do Differently?"
- How to Discuss Technical Debt in AI Systems

### Career and Role-Specific
- AI Engineer vs ML Engineer vs Research Engineer — How to Position Yourself
- How to Talk About Moving from Enterprise AI to a Product/Research Role
- Questions to Ask Your Interviewer — AI Engineer Edition
- How to Evaluate an AI Team Before Joining

---

## How to Use This Guide

If you have **2 weeks**: Work through Sections 1–3 (Q&A), then focus on the 2–3 system design topics most relevant to the role. Do the coding patterns for the algorithms you're weakest on.

If you have **1 week**: Section 3 (LLMs and Agents) + 2 system design articles + the coding patterns for attention and sampling. These cover 80% of what AI engineer interviews actually test.

If you have **2 days**: The agent Q&A in Section 3, one system design article, and the behavioral section. Know your own work cold.

The deep technical content lives in [ml-essentials](/learning/ml-foundations/v1) and [vector databases](/engineering/vector-databases). This guide tells you what to say — those guides tell you why it's true.
