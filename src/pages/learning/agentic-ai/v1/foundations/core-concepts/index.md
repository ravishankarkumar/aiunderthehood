---
title: Agentic Foundations
description: The structural and computational theories behind autonomous AI systems.
layout: ../../../../../../layouts/DocsLayout.astro
---

# Agentic Foundations

Building a reliable agent requires more than just a prompt; it requires a deep understanding of cognitive architecture and the primitives that allow an LLM to function as a "reasoning engine."

For the systems-level view of why these primitives become reliability problems in production, see [Engineering Agent Systems](/learning/agentic-ai/v1/engineering-agent-systems), especially [The Engineering of Uncertainty](/learning/agentic-ai/v1/engineering-agent-systems/the-engineering-of-uncertainty).

---

## 🏛️ Theoretical Frameworks

- [What is an Agent?](/learning/agentic-ai/v1/foundations/core-concepts/what-is-an-agent)
  *Exploring the spectrum of agency—from simple scripts to fully autonomous entities.*

- [Cognitive Architecture](/learning/agentic-ai/v1/foundations/core-concepts/cognitive-architecture)
  *How to structure the 'brain' of an agent using memory, planning, and sensory modules.*



---

## ⚙️ Modern Primitives

- [Inference-Time Compute](/learning/agentic-ai/v1/foundations/core-concepts/inference-time-compute)
  *Understanding why "thinking longer" (Search, Verifiers, and Rollouts) leads to better agentic performance.*

- [Modern LLM Primitives](/learning/agentic-ai/v1/foundations/core-concepts/modern-llm-primitives)
  *A look at function calling, structured output (JSON mode), and token-level control.*



---

### Core Learning Objectives
By the end of this module, you should be able to:
1. Distinguish between a **Chain** and an **Agent**.
2. Understand the trade-offs between **Pre-training** power and **Inference-time** reasoning.
3. Design a basic state-machine-based architecture for a task-oriented assistant.

---

### Next Steps
After mastering these foundations, you can explore how these components are assembled in [Agent Architecture](/learning/agentic-ai/v1/foundations/agent-architecture).
