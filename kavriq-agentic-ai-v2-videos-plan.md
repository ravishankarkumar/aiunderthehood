## 🎬 Part 1: The 14 Long-Form Video Plan (16:9 Landscape)

**Target Duration:** 12–22 Minutes

**Primary Engine:** Deep code architecture (Python), live execution, system diagrams, and hands-on debugging.

### **Module 1: Mechanics & Execution Control**

* **Ep 1: The Agentic Spectrum — LLMs vs. Workflows vs. Agents** (12–15 min)
* *Chapters:* 1, 2, 3
* *Core Focus:* Perception, observation space vs. state space (POMDP intuition), and building a zero-LLM deterministic agent loop in plain Python. *Includes: When NOT to use an agent.*


* **Ep 2: Probabilistic Decision Components** (12–15 min)
* *Chapters:* 4, 5, 6
* *Core Focus:* Logits, temperature, structured outputs, Pydantic validation, and token cost accounting as a first-class constraint.


* **Ep 3: Observe-Reason-Act & Tool Contracts** (14–16 min)
* *Chapters:* 7, 8
* *Core Focus:* Function calling schemas, idempotency, side-effect boundaries, approval gates, and handling execution retries/timeouts.


* **Ep 4: Execution Control — Routing, DAGs & State Machines** (16–18 min)
* *Chapters:* 9, 10, 11, 12
* *Core Focus:* Why static chains break, state drift, handling partial execution failures, dynamic branching, and mapping execution loops to state machines.



### **Module 2: Memory, RAG & Search Space**

* **Ep 5: State & Memory — Conversation, Execution & Persistence** (15–18 min)
* *Chapters:* 13 + Durable State from 11/12
* *Core Focus:* Working memory vs. episodic/semantic memory, persisting execution state vs. vector storage, context expiration, and SQL/log-based state retention.


* **Ep 6: Agentic RAG & Dynamic Knowledge Retrieval** (16–20 min)
* *Chapters:* 14, 15, 16 (+ 17 as a 3-min Coda)
* *Core Focus:* Chunking, hybrid search, reranking, and agent-directed query planning. *GraphRAG framed strictly as a 3-minute decision matrix.*


* **Ep 7: Inference-Time Search — ReAct to Dynamic Planning** (15–18 min)
* *Chapters:* 18, 19, 20
* *Core Focus:* Observable reasoning traces, ReAct from scratch, Plan-and-Execute patterns, dynamic replanning, and compute vs. latency trade-offs.


* **Ep 8: Verification, Self-Correction & Compute Scaling** (16–18 min)
* *Chapters:* 21, 22, 23
* *Core Focus:* Evaluator-optimizer loops, verifiers vs. unfaithful LLM rationales, Best-of-N sampling, tree-style search, and DSPy prompt/demonstration optimization.


* **Ep 9: Multi-Agent Topologies & Coordination** (16–20 min)
* *Chapters:* 24, 25, 26, 27
* *Core Focus:* Single-agent baseline rule, supervisor-worker topologies, blackboard patterns, voting/debate, and preventing infinite delegation loops.



### **Module 3: Protocols, Frameworks & Production Ops**

* **Ep 10: Tools as Protocols — Custom Registries & MCP** (15–18 min)
* *Chapters:* 28, 29
* *Core Focus:* Core integration problem, building a custom tool registry without frameworks, and standardizing tools/resources/prompts using Model Context Protocol (MCP).


* **Ep 11: Framework Engineering — Custom vs. LangGraph vs. CrewAI** (18–20 min)
* *Chapters:* 30, 31, 32
* *Core Focus:* Evaluating abstractions, graph-based execution vs. role-based delegation, rebuilding the core agent in LangGraph, and when to drop frameworks entirely.


* **Ep 12: Building an Evaluation Suite & Action Gating** (16–18 min)
* *Chapters:* 33, 34, 35, 36
* *Core Focus:* Trajectory vs. outcome evaluation, building a mini offline eval harness (deterministic checks + LLM judge), scoped permissions, and non-ceremonial human-in-the-loop triggers.


* **Ep 13: Reliability, Security & Production Observability** (18–20 min)
* *Chapters:* 37, 38, 39, 40
* *Core Focus:* Indirect prompt injection, tool poisoning, tracing spans, circuit breakers, prompt/policy versioning, exponential backoff, and graceful fallback models.


* **Ep 14: Capstone — Building, Evaluating & Stress-Testing an Autonomous Agent** (20–22 min)
* *Chapters:* 41, 42, 43, 44
* *Core Focus:* End-to-end implementation of a Research Agent, executing the Ep 12 eval harness against it, intentional chaos testing (malformed inputs, API loss, poison data), and production deployment criteria.



---

## 📱 Part 2: The 28 Standalone Shorts Plan (9:16 Vertical Animated)

**Target Duration:** 30–45 Seconds

**Primary Engine:** Native 1080x1920 **Murali** rendering engine animations + concise voiceover/text overlays.

**Format Rule:** 2 Shorts per Long Video topic. **Short A** focuses on a *Mental Model / Failure Mode Animation*, while **Short B** focuses on a *30-Second Engineering Rule / Code Snippet*.

| # | Topic / Video Link | Short Type | Title / Angle | Visual Animation Concept (Murali) |
| --- | --- | --- | --- | --- |
| **S1** | Ep 1 (Spectrum) | Animation | **"Why Chatbots are NOT Agents"** | Flowchart morphing a linear LLM call into a looped perception-action graph. |
| **S2** | Ep 1 (Spectrum) | Rule | **"When NOT to build an AI Agent"** | Decision tree highlighting when a deterministic `if/else` script is superior. |
| **S3** | Ep 2 (Probabilistic) | Animation | **"Why Temperature=0 Still Fails"** | Graph showing non-deterministic GPU floating-point variations across tokens. |
| **S4** | Ep 2 (Probabilistic) | Rule | **"Stop trusting raw JSON from LLMs"** | Pydantic schema validation boundary blocking malformed model outputs. |
| **S5** | Ep 3 (Tool Contracts) | Animation | **"The Danger of Side-Effect Tools"** | Infinite retry loop calling an un-idempotent Payment API multiple times. |
| **S6** | Ep 3 (Tool Contracts) | Rule | **"Idempotency in Agent Tools"** | Diagram of idempotent request keys preventing duplicate state execution. |
| **S7** | Ep 4 (Control Plane) | Animation | **"Why Chains (DAGs) Break in Production"** | Static DAG breaking when an unhandled edge case forces a backward retry loop. |
| **S8** | Ep 4 (Control Plane) | Rule | **"Agents are State Machines, Not Prompts"** | State transition matrix showing `State -> Event -> Transition` execution. |
| **S9** | Ep 5 (State/Memory) | Animation | **"Context Window ≠ Agent Memory"** | Visual comparison of short-term RAM context vs. persistent SQL/Log state. |
| **S10** | Ep 5 (State/Memory) | Rule | **"The 3 Types of Agent Memory"** | Animated split layout: Working State, Episodic Memory, and Semantic Memory. |
| **S11** | Ep 6 (Agentic RAG) | Animation | **"Naive RAG vs. Agentic RAG"** | Fixed vector query vs. dynamic, multi-step agent query rewriting loop. |
| **S12** | Ep 6 (Agentic RAG) | Rule | **"When do you actually need GraphRAG?"** | Highlighting vector similarity failure on multi-hop entity relationships. |
| **S13** | Ep 7 (Reasoning) | Animation | **"Inside a ReAct Loop (Step-by-Step)"** | Interleaved `Thought -> Action -> Observation` animated step cycle. |
| **S14** | Ep 7 (Reasoning) | Rule | **"The Latency Penalty of Tree Search"** | Time graph contrasting single-pass generation with Monte Carlo Tree Search. |
| **S15** | Ep 8 (Self-Correction) | Animation | **"LLM Self-Correction is a Myth"** | Showing an LLM repeating its own mistake without an external verifier check. |
| **S16** | Ep 8 (Self-Correction) | Rule | **"The Evaluator-Optimizer Pattern"** | Generator model output passing through an explicit external code-runner verifier. |
| **S17** | Ep 9 (Multi-Agent) | Animation | **"The Single-Agent Baseline Rule"** | Animated cost & token surge of multi-agent chat vs. single multi-tool agent. |
| **S18** | Ep 9 (Multi-Agent) | Rule | **"Supervisor vs. Blackboard Topology"** | Centralized router agent vs. shared state space topology visual comparison. |
| **S19** | Ep 10 (MCP) | Animation | **"What Problem Does MCP Solve?"** | $N \times M$ custom API nightmare morphing into a clean $N + M$ MCP client-server architecture. |
| **S20** | Ep 10 (MCP) | Rule | **"MCP Tools vs. MCP Resources"** | Dynamic discovery animation separating executable tools from read-only resources. |
| **S21** | Ep 11 (Frameworks) | Animation | **"When to Ditch LangChain/CrewAI"** | Abstraction layer pyramid showing framework hidden overhead vs. direct Python code. |
| **S22** | Ep 11 (Frameworks) | Rule | **"Graph States vs. Role-Based Swarms"** | LangGraph explicit state graph visual vs. CrewAI role delegation visual. |
| **S23** | Ep 12 (Evaluation) | Animation | **"Outcome Eval vs. Trajectory Eval"** | Correct final answer with a broken, costly trajectory path highlighted red. |
| **S24** | Ep 12 (Evaluation) | Rule | **"Non-Ceremonial Human-in-the-Loop"** | Interrupted execution queue waiting for explicit high-risk action approval. |
| **S25** | Ep 13 (Production) | Animation | **"Indirect Prompt Injection Exploit"** | Agent reading a poisoned webpage and executing unauthorized tool commands. |
| **S26** | Ep 13 (Production) | Rule | **"Agent Circuit Breakers"** | Cost budget counter triggering a hard circuit-breaker stop at 50,000 tokens. |
| **S27** | Ep 14 (Capstone) | Animation | **"Chaos Testing an Agent"** | Simulated network delay, malformed JSON, and API 500s hit an agent loop live. |
| **S28** | Ep 14 (Capstone) | Rule | **"The Production Readiness Checklist"** | 5-point animated checklist: Evals, Guardrails, Idempotency, Tracing, and Timeouts. |

---

## 🛠️ Execution Pipeline Workflow

```
[Write Module Articles] ──► [Film 16:9 Long Video (Python/Code focus)]
                                   │
                                   ▼
[Render 9:16 Shorts in Murali] ────► [Post Short Visual Animations]

```

1. **Articles First:** Draft chapters on `aiunderthehood.com` for complete code precision.
2. **Long Videos (16:9):** Focus on talking head, code editor walkthroughs, terminal outputs, and system architecture.
3. **Murali Shorts (9:16):** Build independent visual scenes directly in Murali for crisp 9:16 vertical motion graphics.