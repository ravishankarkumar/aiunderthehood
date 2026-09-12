# Kavriq Agentic AI v2: Video and Shorts Plan

## Relationship to the Article Series

The original 44-article curriculum in [`kavriq-agentic-ai-v2-plan.md`](./kavriq-agentic-ai-v2-plan.md) remains unchanged. The articles are the deep, implementation-oriented knowledge base; the videos are a separate visual narrative that selects and combines material from those articles.

The canonical production plan lives in the animation repository at:

`/Users/ravishankar/personal-work/animation/video-scripts/agentic-ai/plans/final-series-plan.md`

If the two plans diverge, the animation repository is the source of truth for episode subjects, order, conceptual boundaries, production format, and the companion-short roster. This Kavriq document owns the article-to-video mapping and the detailed Murali visual notes for those shorts.

## Series Identity and Format

- **Series title:** `Agentic AI: Visualized & Demystified`
- **Central spine:** `Turning Intent into Outcomes`
- **Series byline:** `A Kavriq series.`
- **Long-form slate:** 15 landscape episodes
- **Companion slate:** 30 standalone vertical shorts, two per long-form episode
- **Production format:** Murali animation, Kavriq research, and narration
- **Format boundary:** No on-screen coding, editor walkthroughs, or live software builds
- **Status:** Episode subjects, order, and conceptual boundaries are locked. Exact titles, thumbnails, runtimes, short scripts, and release dates remain production decisions.

## The 15 Long-Form Episodes

| # | Working title | Production folder | Kavriq article starting points |
| --- | --- | --- | --- |
| 01 | **What Is Agentic AI? AI Agents vs Workflows Explained** | `video-01-agentic-spectrum` | Chapters 1-3, 7, 9, 12 |
| 02 | **How LLMs Power AI Agents: Models vs Agent Runtimes** | `video-02-llms-and-agent-runtimes` | Chapters 4-6 |
| 03 | **AI Tool Calling Explained: How Agents Take Action** | `video-03-tool-calling` | Chapters 6 and 8 |
| 04 | **MCP Explained: How AI Agents Connect to Tools and Data** | `video-04-mcp` | Chapter 28 plus the current MCP specification |
| 05 | **AI Agent Memory vs Context Engineering: What Should It Remember?** | `video-05-memory-and-context` | Chapters 11, 13, and 15 |
| 06 | **RAG vs Agentic RAG: How AI Agents Find Knowledge** | `video-06-rag-vs-agentic-rag` | Chapters 14-16 |
| 07 | **AI Agent Planning Explained: ReAct and Plan-and-Execute** | `video-07-planning-and-react` | Chapters 18-20 |
| 08 | **Reasoning Models and Test-Time Compute Explained** | `video-08-reasoning-and-test-time-compute` | Chapters 5, 18, and 22 plus current research |
| 09 | **AI Agent Evaluation: Evals, Reflection and Self-Correction** | `video-09-evaluation-and-self-correction` | Chapters 21, 23, 33, and 34 |
| 10 | **Multi-Agent Systems Explained: When Is a Team Better?** | `video-10-multi-agent-systems` | Chapters 24-27 |
| 11 | **Multimodal AI Agents Explained: Seeing, Listening and Acting** | `video-11-multimodal-agents` | Chapters 2, 4, and 8 plus supplemental sources |
| 12 | **Coding Agents Explained: From Request to Tested Change** | `video-12-coding-agents` | Chapters 7, 8, 10, 34, and 35 plus supplemental sources |
| 13 | **AI Agent Security: Prompt Injection and Guardrails Explained** | `video-13-security-and-guardrails` | Chapters 35-38 plus current security research |
| 14 | **AI Agent Reliability: Observability, Retries and Recovery** | `video-14-reliability-and-observability` | Chapters 10, 11, and 39-41 |
| 15 | **AI Research Agents Explained: Can You Trust the Final Report?** | `video-15-research-agent-capstone` | Chapters 42-44 |

## Five Movements

| Episodes | Movement | Driving question |
| --- | --- | --- |
| 01-04 | From intent to action | What is making the decision, and how does that decision affect the world? |
| 05-06 | Information and knowledge | What should the system retain, retrieve, and place before the model? |
| 07-09 | Strategy and verification | How does it choose a path, spend computation, and determine whether it succeeded? |
| 10-12 | Expanded agents | What changes when we add collaborators, modalities, or a specialized environment? |
| 13-15 | Trust under pressure | What happens when information is hostile, execution fails, or the whole system must earn our trust? |

## The 30 Standalone Shorts

Each long-form episode produces two independently useful 30-60 second vertical shorts:

- **Short A — Mental model or failure mode:** one memorable visual explanation, comparison, or incident.
- **Short B — Engineering rule:** one practical decision rule, boundary, or checklist.

The short must make sense without the long-form episode. It may point to the full episode, but it should not behave like a trailer or clipped excerpt.

| # | Parent | Type | Working title / angle | Murali visual concept |
| --- | --- | --- | --- | --- |
| S01 | Ep 01 | Mental model | **Why a Chatbot Is Not Automatically an Agent** | A single prompt-response line transforms into an observe-decide-act loop, then into a fixed workflow to expose the differences. |
| S02 | Ep 01 | Engineering rule | **When Not to Build an AI Agent** | A decision gate routes predictable tasks to code or workflows and uncertain tasks to bounded agents. |
| S03 | Ep 02 | Failure mode | **Why Temperature 0 Does Not Guarantee Reliability** | Identical inputs enter a probabilistic model while runtime and system boundaries reveal where variation and failure remain. |
| S04 | Ep 02 | Engineering rule | **Never Trust Raw Model Output as an Action** | A model proposal is stopped by schema validation, policy checks, and runtime authorization before execution. |
| S05 | Ep 03 | Mental model | **How Text Becomes a Real-World Action** | One tool request travels through description, arguments, validation, permission, execution, and observation. |
| S06 | Ep 03 | Engineering rule | **Validate Every Tool Call at the Boundary** | Malformed arguments and a forbidden side effect collide with typed validation and an action gate. |
| S07 | Ep 04 | Mental model | **What Problem Does MCP Actually Solve?** | An N-by-M integration tangle reorganizes into hosts, clients, and reusable MCP servers. |
| S08 | Ep 04 | Engineering rule | **MCP Tools, Resources, and Prompts Are Not the Same** | Three capability lanes separate executable actions, readable context, and reusable interaction templates. |
| S09 | Ep 05 | Mental model | **Context Window Is Not Agent Memory** | A temporary context tray, durable execution log, and saved memory store exchange distinct information objects. |
| S10 | Ep 05 | Engineering rule | **Every Memory Needs a Write, Read, and Expiry Policy** | A memory passes three gates before entering context; stale and irrelevant memories are rejected. |
| S11 | Ep 06 | Mental model | **Naive RAG vs Agentic RAG** | A fixed one-shot query misses evidence while an agent rewrites, retrieves, checks gaps, and searches again. |
| S12 | Ep 06 | Engineering rule | **Stop Retrieval When the Evidence Is Sufficient** | An evidence meter balances coverage, conflict, cost, and latency before allowing another search. |
| S13 | Ep 07 | Mental model | **Inside a ReAct Loop** | Action and observation cards alternate around a changing environment until the goal or stop condition is reached. |
| S14 | Ep 07 | Engineering rule | **Plan Ahead or React Step by Step?** | A dependency-heavy mission chooses plan-and-execute while an uncertain mission chooses a short reactive horizon. |
| S15 | Ep 08 | Failure mode | **More Test-Time Compute Is Not Always Better** | Candidate branches multiply as cost and latency rise, while correlated errors survive the search. |
| S16 | Ep 08 | Engineering rule | **Best-of-N Only Helps When Selection Is Trustworthy** | Several polished candidates face a verifier that can check the result instead of judging style. |
| S17 | Ep 09 | Mental model | **A Correct Answer Can Hide a Broken Agent Run** | Two identical outcomes reveal radically different trajectories, costs, and unsafe actions. |
| S18 | Ep 09 | Engineering rule | **Self-Correction Needs External Feedback** | An agent repeats its own error until a deterministic check or independent verifier supplies a useful signal. |
| S19 | Ep 10 | Failure mode | **Why More Agents Can Make the Result Worse** | A small team generates duplicate work, message traffic, and a shared mistake beside a simpler single-agent run. |
| S20 | Ep 10 | Engineering rule | **Always Establish the Single-Agent Baseline First** | A scoreboard compares quality, latency, cost, and coordination overhead before approving a team. |
| S21 | Ep 11 | Failure mode | **What If Image, Audio, and Text Disagree?** | Three modality streams describe one event differently and force the agent to expose uncertainty. |
| S22 | Ep 11 | Engineering rule | **Perception Confidence Is Not Permission to Act** | A confident visual interpretation reaches a separate authorization boundary before a consequential action. |
| S23 | Ep 12 | Mental model | **From Software Request to Tested Change** | A request moves through repository context, edit, failing test, revision, diff, and human review. |
| S24 | Ep 12 | Engineering rule | **Prefer the Smallest Verifiable Change** | A narrow patch passes focused checks while a sprawling patch expands the unseen risk surface. |
| S25 | Ep 13 | Failure mode | **How Indirect Prompt Injection Hijacks an Agent** | A poisoned document attempts to cross from untrusted data into the instruction and action lanes. |
| S26 | Ep 13 | Engineering rule | **Use Least Privilege and Real Action Gates** | Scoped permissions and meaningful approval stop an unsafe action outside the model. |
| S27 | Ep 14 | Failure mode | **How a Naive Retry Causes Duplicate Actions** | A timed-out request is replayed even though the first action succeeded, producing a duplicate side effect. |
| S28 | Ep 14 | Engineering rule | **Retries Need Idempotency, State, and Budgets** | An idempotency key, checkpoint, backoff timer, and retry budget coordinate a safe recovery. |
| S29 | Ep 15 | Failure mode | **A Citation-Looking Report Can Still Be Untrustworthy** | Polished claims detach from weak, conflicting, or missing evidence until provenance lines reconnect them. |
| S30 | Ep 15 | Engineering rule | **The Five Tests for a Trustworthy Agent Outcome** | A final report passes evidence, permissions, trace, evaluation, and uncertainty gates before receiving a conditional trust verdict. |

## Article-to-Video Production Workflow

```text
[44 Kavriq articles / chapter research]
                 |
                 v
[15 visual episode treatments] ---> [15 Murali long-form videos]
                 |
                 +---------------> [30 standalone Murali shorts]
```

1. **Research from the article curriculum.** Use the mapped Kavriq chapters as the starting point, then add primary and current sources where required.
2. **Write the visual investigation.** Each long-form episode gets its own mission, failure, comparison, and conclusion; it is not a spoken summary of several articles.
3. **Prototype in Murali.** Validate the hardest visual sequence before narration is locked.
4. **Derive two standalone shorts.** Build one mental-model/failure story and one engineering rule from the episode's owned concept.
5. **Publish with cross-links.** The episode and shorts may direct viewers to the deeper Kavriq articles, while the articles embed or link back to the relevant videos.

## Sync Rules

1. Do not renumber or reshape the 44-article curriculum to match the 15-video slate.
2. Do not add a long-form episode here unless the canonical animation plan changes first.
3. Keep each definition owned by one long-form episode; later episodes and shorts should use brief callbacks.
4. Treat working titles, durations, thumbnails, and release dates as provisional until their production gates are complete.
5. If a short cannot stand alone or merely repeats the long-form opening, replace it with a sharper failure mode or engineering decision.
