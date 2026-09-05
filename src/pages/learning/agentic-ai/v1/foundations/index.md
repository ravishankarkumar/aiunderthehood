---
title: Agentic AI Foundations
description: A 12-part core curriculum for learning the building blocks of modern agentic AI systems.
layout: ../../../../../layouts/DocsLayout.astro
---

Agentic AI Foundations is Kavriq's 12-part core curriculum for learning the building blocks of modern agent systems.

This series starts from first principles and moves toward advanced concepts: agent loops, cognitive architecture, planning, tools, memory, multi-agent systems, guardrails, evaluation, runtime internals, and capstone projects.

If you want the systems-first production perspective after learning the components, continue into [Engineering Agent Systems](/learning/agentic-ai/v1/engineering-agent-systems).

> **This is a living roadmap.** Articles are written and published one by one. Items listed without a link are planned and coming. Linked items are published and ready to read.

---

## Prerequisite

- [Setting up Environment](/learning/agentic-ai/v1/foundations/prerequisite/setting-up)

## Module 1 — Core Concepts

The cognitive and computational foundations of modern agent systems.

- [What is an Agent?](/learning/agentic-ai/v1/foundations/core-concepts/what-is-an-agent)
- [Cognitive Architecture of Agents](/learning/agentic-ai/v1/foundations/core-concepts/cognitive-architecture)
- [The Inference-Time Compute Revolution](/learning/agentic-ai/v1/foundations/core-concepts/inference-time-compute)
- [Modern LLM Primitives](/learning/agentic-ai/v1/foundations/core-concepts/modern-llm-primitives)

---

## Module 2 — Internal Agent Architecture

The internal components that make an AI system behave like an autonomous agent.

- [The Anatomy of an Agent](/learning/agentic-ai/v1/foundations/agent-architecture/the-anatomy-of-an-agent)
- [The Perception Layer](/learning/agentic-ai/v1/foundations/agent-architecture/the-perception-layer)
- [Working Memory and the Scratchpad](/learning/agentic-ai/v1/foundations/agent-architecture/working-memory-and-the-scratchpad)
- [The Planner / Reasoner](/learning/agentic-ai/v1/foundations/agent-architecture/the-planner-reasoner)
- [The Tool Manager](/learning/agentic-ai/v1/foundations/agent-architecture/tool-manager)
- [The Execution Engine](/learning/agentic-ai/v1/foundations/agent-architecture/execution-engine)
- [The Observation Processor](/learning/agentic-ai/v1/foundations/agent-architecture/observation-processor)
- [Reflection and Termination](/learning/agentic-ai/v1/foundations/agent-architecture/reflection-and-termination)

---

## Module 3 — Planning Systems

Techniques that allow agents to solve complex tasks through multi-step reasoning.

- [Why Planning Matters](/learning/agentic-ai/v1/foundations/planning-systems/why-planning-matters)
- [ReAct: Reason + Act](/learning/agentic-ai/v1/foundations/planning-systems/react)
- [Chain-of-Thought Planning](/learning/agentic-ai/v1/foundations/planning-systems/chain-of-thought)
- [Tree-of-Thought Reasoning](/learning/agentic-ai/v1/foundations/planning-systems/tree-of-thought)
- [Execution Graphs](/learning/agentic-ai/v1/foundations/planning-systems/execution-graphs)
- [Building Agents with LangGraph - Python](/learning/agentic-ai/v1/foundations/planning-systems/langgraph)

---

## Module 4 — Tool Use & Protocols

How agents interact with APIs, databases, and external systems.

- [Why Tools Make Agents Powerful](/learning/agentic-ai/v1/foundations/tool-use-protocols/why-tools)
- [Designing Reliable Tools](/learning/agentic-ai/v1/foundations/tool-use-protocols/designing-reliable-tools)
- [The Model Context Protocol (MCP)](/learning/agentic-ai/v1/foundations/tool-use-protocols/mcp)

---

## Module 5 — Memory Systems & RAG

How agents store knowledge and retrieve information across interactions.

- [The Memory Hierarchy of Agents](/learning/agentic-ai/v1/foundations/memory-systems-rag/memory-hierarchy)
- [Episodic Memory](/learning/agentic-ai/v1/foundations/memory-systems-rag/episodic-memory)
- [Semantic Memory](/learning/agentic-ai/v1/foundations/memory-systems-rag/semantic-memory)
- [Procedural Memory](/learning/agentic-ai/v1/foundations/memory-systems-rag/procedural-memory)
- [Agentic RAG](/learning/agentic-ai/v1/foundations/memory-systems-rag/agentic-rag)
- [Multi-Hop Retrieval](/learning/agentic-ai/v1/foundations/memory-systems-rag/multi-hop)

---

## Module 6 — Multi-Agent Systems

Architectures where multiple agents collaborate to solve problems.

- [Why Multi-Agent Systems Exist](/learning/agentic-ai/v1/foundations/multi-agent/why-multi-agent)
- [Manager-Worker Coordination](/learning/agentic-ai/v1/foundations/multi-agent/manager-worker-pattern)
- [Handoff Pattern (Swarm)](/learning/agentic-ai/v1/foundations/multi-agent/handoff-swarm)
- [Debate Pattern](/learning/agentic-ai/v1/foundations/multi-agent/debate-pattern)
- [Agent-to-Agent Communication (A2A)](/learning/agentic-ai/v1/foundations/multi-agent/a2a-agent-to-agent)

---

## Module 7 — Computer Use & Vision

Agents that interact with software interfaces and visual environments.

- [Computer Use Agents](/learning/agentic-ai/v1/foundations/computer-use-vision/computer-use-agents)
- [GUI Navigation](/learning/agentic-ai/v1/foundations/computer-use-vision/gui-navigation)
- [Visual Grounding](/learning/agentic-ai/v1/foundations/computer-use-vision/visual-grounding)

---

## Module 8 — Guardrails & Safety

Designing safe and reliable agent systems.

- [Prompt Injection Attacks](/learning/agentic-ai/v1/foundations/guardrails-safety/prompt-injection)
- [Tool Permission Systems](/learning/agentic-ai/v1/foundations/guardrails-safety/tool-permissions)
- [Agent Identity, Delegation, and Provenance](/learning/agentic-ai/v1/foundations/guardrails-safety/agent-identity-delegation-provenance)
- [Human-in-the-Loop](/learning/agentic-ai/v1/foundations/guardrails-safety/human-in-the-loop)
- [Sandboxing Agent Execution](/learning/agentic-ai/v1/foundations/guardrails-safety/sandboxing)

---

## Module 9 — Evaluation & Metrics

How to measure agent performance and reliability.

- [Why Agent Evaluation Is Hard](/learning/agentic-ai/v1/foundations/evaluation-metrics/why-evaluation-is-hard)
- [LLM-as-a-Judge](/learning/agentic-ai/v1/foundations/evaluation-metrics/llm-judge)
- [Trajectory Evaluation](/learning/agentic-ai/v1/foundations/evaluation-metrics/trajectory-eval)
- [Building Evaluation Pipelines](/learning/agentic-ai/v1/foundations/evaluation-metrics/building-eval-pipelines)

---

## Module 10 — High-Performance Engineering

Engineering techniques for scalable, high-performance agent systems.

- [The Small Model Strategy](/learning/agentic-ai/v1/foundations/high-perf-engineering/small-model)
- [Observability for Agents](/learning/agentic-ai/v1/foundations/high-perf-engineering/observability)

---

## Module 11 — Agent Internals

Understanding how agents actually work by building a minimal runtime from scratch.

- [Why Build Your Own Agent Runtime](/learning/agentic-ai/v1/foundations/agent-internals/why-build-agent-runtime)
- [Designing a Simple Agent State Machine](/learning/agentic-ai/v1/foundations/agent-internals/state-machine)
- [Implementing Tool Calling & MCP Integration](/learning/agentic-ai/v1/foundations/agent-internals/tool-calling)
- [Adding Time-Travel Debugging](/learning/agentic-ai/v1/foundations/agent-internals/time-travel)
- [A 300-Line LangGraph Alternative](/learning/agentic-ai/v1/foundations/agent-internals/langgraph-alternative)

---

## Module 12 — Capstone Projects

Real-world applications built using agentic architectures.

- [The Computer-Use Researcher](/learning/agentic-ai/v1/foundations/capstone-projects/computer-use-researcher)
- [The Multi-Agent Coding Pipeline](/learning/agentic-ai/v1/foundations/capstone-projects/multi-agent-coding)
- [The Privacy-First Local Butler](/learning/agentic-ai/v1/foundations/capstone-projects/privacy-first-butler)

---

## What You Will Learn

By the end of this guide you will understand how to build:

- Autonomous AI agents
- Tool-using reasoning systems
- Multi-agent collaboration architectures
- Production-grade agent infrastructure
- Privacy-first local AI assistants

This series provides a complete technical foundation for modern agentic AI systems.
