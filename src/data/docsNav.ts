export type DocsNavItem = {
  title: string;
  href: string;
  children?: DocsNavItem[];
};

export type DocsNavSection = {
  title: string;
  href: string;
  items: DocsNavItem[];
  parent?: {
    title: string;
    href: string;
  };
};

export const docsNavSections: DocsNavSection[] = [
  {
    title: "Blogs",
    href: "/blogs",
    items: [
      { title: "Overview", href: "/blogs" },
      {
        title: "2026",
        href: "/blogs/2026",
        children: [
          {
            title: "August",
            href: "/blogs/2026/08",
            children: [
              {
                title: "Murali 0.2.0",
                href: "/blogs/2026/08-09-murali-now-support-vertical-video",
              },
            ],
          },
          {
            title: "July",
            href: "/blogs/2026/07",
            children: [
              {
                title: "Introducing AI Tadka",
                href: "/blogs/2026/07-26-introducing-the-word-ai-tadka",
              },
              {
                title: "Hundred-Page ML Book Review",
                href: "/blogs/2026/07-19-the-hundred-page-machine-learning-book-review",
              },
            ],
          },
          {
            title: "June",
            href: "/blogs/2026/06",
            children: [
              {
                title: "AI Reality Check",
                href: "/blogs/2026/06-27-ai-hype-vs-reality-mid-2026-check-in",
              },
            ],
          },
          {
            title: "May",
            href: "/blogs/2026/05",
            children: [
              {
                title: "Hidden Data Problem",
                href: "/blogs/2026/05-03-hidden-data-problem-agentic-ai",
              },
            ],
          },
          {
            title: "April",
            href: "/blogs/2026/04",
            children: [
              {
                title: "Open Weights vs Open Source AI",
                href: "/blogs/2026/04-26-open-weights-vs-open-source-ai",
              },
            ],
          },
        ],
      },
      {
        title: "2025",
        href: "/blogs/2025",
        children: [
          {
            title: "December",
            href: "/blogs/2025/12",
            children: [
              {
                title: "Why RAG Exists",
                href: "/blogs/2025/12-14-why-rag-exists",
              },
              {
                title: "GPU vs TPU",
                href: "/blogs/2025/12-09-gpu-vs-tpu",
              },
              {
                title: "Top-k vs Nucleus Sampling",
                href: "/blogs/2025/12-08-top-k-vs-nucleus-sampling",
              },
              {
                title: "Transformers in AI",
                href: "/blogs/2025/12-07-transformers-in-ai",
              },
              {
                title: "KV Cache Explained",
                href: "/blogs/2025/12-06-kv-cache-explained",
              },
              {
                title: "LLM Inference Deep Dive",
                href: "/blogs/2025/12-05-llm-inference-deep-dive",
              },
              {
                title: "Why Embeddings Matter",
                href: "/blogs/2025/12-04-why-embeddings-matter",
              },
              {
                title: "Understanding Tokenizers",
                href: "/blogs/2025/12-03-tokenizers",
              },
            ],
          },
          {
            title: "October",
            href: "/blogs/2025/10",
            children: [
              {
                title: "The Future of AI",
                href: "/blogs/2025/10-06-future-of-ai",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Learning",
    href: "/learning",
    items: [
      { title: "Overview", href: "/learning" },
      {
        title: "Agentic AI v2",
        href: "/learning/agentic-ai/v2",
        children: [
          {
            title: "Foundations",
            href: "/learning/agentic-ai/v2/foundations",
            children: [
              {
                title: "What Is an Agentic System?",
                href: "/learning/agentic-ai/v2/foundations/what-is-an-agentic-system",
              },
              {
                title: "Anatomy of an Agent",
                href: "/learning/agentic-ai/v2/foundations/anatomy-of-an-agent",
              },
              {
                title: "Engineering of Uncertainty",
                href: "/learning/agentic-ai/v2/foundations/the-engineering-of-uncertainty",
              },
            ],
          },
          {
            title: "The Model Inside the Agent",
            href: "/learning/agentic-ai/v2/model-inside-agent",
            children: [
              {
                title: "What an LLM Contributes",
                href: "/learning/agentic-ai/v2/model-inside-agent/what-an-llm-contributes",
              },
              {
                title: "Sampling and Behavior",
                href: "/learning/agentic-ai/v2/model-inside-agent/sampling-and-behavior",
              },
              {
                title: "Instructions and Structured Decisions",
                href: "/learning/agentic-ai/v2/model-inside-agent/instructions-and-structured-decisions",
              },
            ],
          },
          {
            title: "From Model Calls to Agent Loops",
            href: "/learning/agentic-ai/v2/agent-loops",
          },
          {
            title: "Planning, Reasoning, and Learning",
            href: "/learning/agentic-ai/v2/planning-reasoning-learning",
          },
          {
            title: "Knowledge and Memory",
            href: "/learning/agentic-ai/v2/knowledge-memory",
          },
          {
            title: "Protocols and Frameworks",
            href: "/learning/agentic-ai/v2/protocols-frameworks",
          },
          {
            title: "Multi-Agent Systems",
            href: "/learning/agentic-ai/v2/multi-agent-systems",
          },
          {
            title: "Evaluation, Safety, and Production",
            href: "/learning/agentic-ai/v2/evaluation-safety-production",
          },
          {
            title: "Capstone and Synthesis",
            href: "/learning/agentic-ai/v2/capstone-synthesis",
          },
        ],
      },
      {
        title: "Agentic AI v1",
        href: "/learning/agentic-ai/v1",
        children: [
          {
            title: "Foundations",
            href: "/learning/agentic-ai/v1/foundations",
            children: [
              {
                title: "Prerequisites",
                href: "/learning/agentic-ai/v1/foundations/prerequisite",
                children: [
                  {
                    title: "Setting Up",
                    href: "/learning/agentic-ai/v1/foundations/prerequisite/setting-up",
                  },
                ],
              },
              {
                title: "Core Concepts",
                href: "/learning/agentic-ai/v1/foundations/core-concepts",
                children: [
                  {
                    title: "What is an AI Agent?",
                    href: "/learning/agentic-ai/v1/foundations/core-concepts/what-is-an-agent",
                  },
                  {
                    title: "Modern LLM Primitives",
                    href: "/learning/agentic-ai/v1/foundations/core-concepts/modern-llm-primitives",
                  },
                  {
                    title: "Inference-Time Compute",
                    href: "/learning/agentic-ai/v1/foundations/core-concepts/inference-time-compute",
                  },
                  {
                    title: "Cognitive Architecture",
                    href: "/learning/agentic-ai/v1/foundations/core-concepts/cognitive-architecture",
                  },
                ],
              },
              {
                title: "Agent Architecture",
                href: "/learning/agentic-ai/v1/foundations/agent-architecture",
                children: [
                  {
                    title: "Anatomy of an Agent",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/the-anatomy-of-an-agent",
                  },
                  {
                    title: "Perception Layer",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/the-perception-layer",
                  },
                  {
                    title: "Planner / Reasoner",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/the-planner-reasoner",
                  },
                  {
                    title: "Working Memory",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/working-memory-and-the-scratchpad",
                  },
                  {
                    title: "Tool Manager",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/tool-manager",
                  },
                  {
                    title: "Execution Engine",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/execution-engine",
                  },
                  {
                    title: "Reflection and Termination",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/reflection-and-termination",
                  },
                  {
                    title: "Observation Processor",
                    href: "/learning/agentic-ai/v1/foundations/agent-architecture/observation-processor",
                  },
                ],
              },
              {
                title: "Planning Systems",
                href: "/learning/agentic-ai/v1/foundations/planning-systems",
                children: [
                  {
                    title: "Why Planning Matters",
                    href: "/learning/agentic-ai/v1/foundations/planning-systems/why-planning-matters",
                  },
                  {
                    title: "Chain-of-Thought Planning",
                    href: "/learning/agentic-ai/v1/foundations/planning-systems/chain-of-thought",
                  },
                  {
                    title: "Tree-of-Thought",
                    href: "/learning/agentic-ai/v1/foundations/planning-systems/tree-of-thought",
                  },
                  {
                    title: "ReAct",
                    href: "/learning/agentic-ai/v1/foundations/planning-systems/react",
                  },
                  {
                    title: "Execution Graphs",
                    href: "/learning/agentic-ai/v1/foundations/planning-systems/execution-graphs",
                  },
                  {
                    title: "LangGraph",
                    href: "/learning/agentic-ai/v1/foundations/planning-systems/langgraph",
                  },
                ],
              },
              {
                title: "Tool Use & Protocols",
                href: "/learning/agentic-ai/v1/foundations/tool-use-protocols",
                children: [
                  {
                    title: "Why Tools Make Agents Powerful",
                    href: "/learning/agentic-ai/v1/foundations/tool-use-protocols/why-tools",
                  },
                  {
                    title: "Designing Reliable Tools",
                    href: "/learning/agentic-ai/v1/foundations/tool-use-protocols/designing-reliable-tools",
                  },
                  {
                    title: "Model Context Protocol",
                    href: "/learning/agentic-ai/v1/foundations/tool-use-protocols/mcp",
                  },
                ],
              },
              {
                title: "Memory Systems & RAG",
                href: "/learning/agentic-ai/v1/foundations/memory-systems-rag",
                children: [
                  {
                    title: "Memory Hierarchy",
                    href: "/learning/agentic-ai/v1/foundations/memory-systems-rag/memory-hierarchy",
                  },
                  {
                    title: "Semantic Memory",
                    href: "/learning/agentic-ai/v1/foundations/memory-systems-rag/semantic-memory",
                  },
                  {
                    title: "Episodic Memory",
                    href: "/learning/agentic-ai/v1/foundations/memory-systems-rag/episodic-memory",
                  },
                  {
                    title: "Procedural Memory",
                    href: "/learning/agentic-ai/v1/foundations/memory-systems-rag/procedural-memory",
                  },
                  {
                    title: "Agentic RAG",
                    href: "/learning/agentic-ai/v1/foundations/memory-systems-rag/agentic-rag",
                  },
                  {
                    title: "Multi-Hop Retrieval",
                    href: "/learning/agentic-ai/v1/foundations/memory-systems-rag/multi-hop",
                  },
                ],
              },
              {
                title: "Multi-Agent Orchestration",
                href: "/learning/agentic-ai/v1/foundations/multi-agent",
                children: [
                  {
                    title: "Why Multi-Agent Systems Exist",
                    href: "/learning/agentic-ai/v1/foundations/multi-agent/why-multi-agent",
                  },
                  {
                    title: "Agent-to-Agent Communication",
                    href: "/learning/agentic-ai/v1/foundations/multi-agent/a2a-agent-to-agent",
                  },
                  {
                    title: "Manager-Worker Pattern",
                    href: "/learning/agentic-ai/v1/foundations/multi-agent/manager-worker-pattern",
                  },
                  {
                    title: "Debate Pattern",
                    href: "/learning/agentic-ai/v1/foundations/multi-agent/debate-pattern",
                  },
                  {
                    title: "Handoff Pattern",
                    href: "/learning/agentic-ai/v1/foundations/multi-agent/handoff-swarm",
                  },
                ],
              },
              {
                title: "Guardrails & Safety",
                href: "/learning/agentic-ai/v1/foundations/guardrails-safety",
                children: [
                  {
                    title: "Prompt Injection",
                    href: "/learning/agentic-ai/v1/foundations/guardrails-safety/prompt-injection",
                  },
                  {
                    title: "Sandboxing",
                    href: "/learning/agentic-ai/v1/foundations/guardrails-safety/sandboxing",
                  },
                  {
                    title: "Tool Permissions",
                    href: "/learning/agentic-ai/v1/foundations/guardrails-safety/tool-permissions",
                  },
                  {
                    title: "Human-in-the-Loop",
                    href: "/learning/agentic-ai/v1/foundations/guardrails-safety/human-in-the-loop",
                  },
                  {
                    title: "Identity and Provenance",
                    href: "/learning/agentic-ai/v1/foundations/guardrails-safety/agent-identity-delegation-provenance",
                  },
                ],
              },
              {
                title: "Evaluation & Metrics",
                href: "/learning/agentic-ai/v1/foundations/evaluation-metrics",
                children: [
                  {
                    title: "Why Evaluation Is Hard",
                    href: "/learning/agentic-ai/v1/foundations/evaluation-metrics/why-evaluation-is-hard",
                  },
                  {
                    title: "LLM-as-a-Judge",
                    href: "/learning/agentic-ai/v1/foundations/evaluation-metrics/llm-judge",
                  },
                  {
                    title: "Trajectory Evaluation",
                    href: "/learning/agentic-ai/v1/foundations/evaluation-metrics/trajectory-eval",
                  },
                  {
                    title: "Building Eval Pipelines",
                    href: "/learning/agentic-ai/v1/foundations/evaluation-metrics/building-eval-pipelines",
                  },
                ],
              },
              {
                title: "High-Performance Engineering",
                href: "/learning/agentic-ai/v1/foundations/high-perf-engineering",
                children: [
                  {
                    title: "Small Model Strategy",
                    href: "/learning/agentic-ai/v1/foundations/high-perf-engineering/small-model",
                  },
                  {
                    title: "Observability",
                    href: "/learning/agentic-ai/v1/foundations/high-perf-engineering/observability",
                  },
                ],
              },
              {
                title: "Agent Internals",
                href: "/learning/agentic-ai/v1/foundations/agent-internals",
                children: [
                  {
                    title: "Why Build Your Own Runtime",
                    href: "/learning/agentic-ai/v1/foundations/agent-internals/why-build-agent-runtime",
                  },
                  {
                    title: "State Machine",
                    href: "/learning/agentic-ai/v1/foundations/agent-internals/state-machine",
                  },
                  {
                    title: "Tool Calling",
                    href: "/learning/agentic-ai/v1/foundations/agent-internals/tool-calling",
                  },
                  {
                    title: "LangGraph Alternative",
                    href: "/learning/agentic-ai/v1/foundations/agent-internals/langgraph-alternative",
                  },
                  {
                    title: "Time-Travel Debugging",
                    href: "/learning/agentic-ai/v1/foundations/agent-internals/time-travel",
                  },
                ],
              },
              {
                title: "Computer Use & Vision",
                href: "/learning/agentic-ai/v1/foundations/computer-use-vision",
                children: [
                  {
                    title: "Visual Grounding",
                    href: "/learning/agentic-ai/v1/foundations/computer-use-vision/visual-grounding",
                  },
                  {
                    title: "GUI Navigation",
                    href: "/learning/agentic-ai/v1/foundations/computer-use-vision/gui-navigation",
                  },
                  {
                    title: "Computer Use Agents",
                    href: "/learning/agentic-ai/v1/foundations/computer-use-vision/computer-use-agents",
                  },
                ],
              },
              {
                title: "Capstone Projects",
                href: "/learning/agentic-ai/v1/foundations/capstone-projects",
                children: [
                  {
                    title: "Computer-Use Researcher",
                    href: "/learning/agentic-ai/v1/foundations/capstone-projects/computer-use-researcher",
                  },
                  {
                    title: "Multi-Agent Coding Pipeline",
                    href: "/learning/agentic-ai/v1/foundations/capstone-projects/multi-agent-coding",
                  },
                  {
                    title: "Privacy-First Local Butler",
                    href: "/learning/agentic-ai/v1/foundations/capstone-projects/privacy-first-butler",
                  },
                ],
              },
            ],
          },
          {
            title: "Engineering Agent Systems",
            href: "/learning/agentic-ai/v1/engineering-agent-systems",
            children: [
              {
                title: "Why Agents Fail",
                href: "/learning/agentic-ai/v1/engineering-agent-systems/why-agents-fail-execution-gap",
              },
              {
                title: "Engineering of Uncertainty",
                href: "/learning/agentic-ai/v1/engineering-agent-systems/the-engineering-of-uncertainty",
              },
              {
                title: "From DAGs to State Machines",
                href: "/learning/agentic-ai/v1/engineering-agent-systems/from-dags-to-state-machines",
              },
              {
                title: "Controlled Agency",
                href: "/learning/agentic-ai/v1/engineering-agent-systems/controlled-agency-tools-safety",
              },
              {
                title: "Reliable Agentic Systems",
                href: "/learning/agentic-ai/v1/engineering-agent-systems/kavriq-recommendations-reliable-agentic-systems",
              },
            ],
          },
        ],
      },
      {
        title: "ML Foundations",
        href: "/learning/ml-foundations/v1",
      },
    ],
  },
  {
    title: "Engineering",
    href: "/engineering",
    items: [
      { title: "Overview", href: "/engineering" },
      {
        title: "AI Slop",
        href: "/engineering/ai-slop",
        children: [
          { title: "AI Tadka", href: "/engineering/ai-slop/ai-tadka" },
          { title: "Code Slop", href: "/engineering/ai-slop/code-slop" },
          {
            title: "Documentation Slop",
            href: "/engineering/ai-slop/documentation-slop",
          },
          { title: "Process Slop", href: "/engineering/ai-slop/process-slop" },
          { title: "Test Slop", href: "/engineering/ai-slop/test-slop" },
        ],
      },
      {
        title: "Vector Databases",
        href: "/engineering/vector-databases",
        children: [
          {
            title: "How Vector Search Works",
            href: "/engineering/vector-databases/how-vector-search-works",
          },
          {
            title: "HNSW and IVF-PQ",
            href: "/engineering/vector-databases/hnsw-and-ivf-pq",
          },
          {
            title: "Scaling Vector Search",
            href: "/engineering/vector-databases/scaling-vector-search",
          },
          {
            title: "Storage and Ingestion",
            href: "/engineering/vector-databases/vector-db-storage-and-ingestion",
          },
        ],
      },
      {
        title: "Charioteer Framework",
        href: "/engineering/charioteer-framework",
        children: [
          {
            title: "Sarathi Principle",
            href: "/engineering/charioteer-framework/principles/sarathi-principle",
          },
        ],
      },
      {
        title: "Modern Software Engineering",
        href: "/engineering/modern-software-engineering",
      },
    ],
  },
  {
    title: "Explainers",
    href: "/explainers",
    items: [
      { title: "Overview", href: "/explainers" },
      {
        title: "2026",
        href: "/explainers/2026",
        children: [
          {
            title: "August",
            href: "/explainers/2026/08",
            children: [
              {
                title: "After You Send a Prompt",
                href: "/explainers/2026/08/15-what-happens-after-you-send-a-prompt-to-chatgpt",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Interview",
    href: "/interview",
    items: [
      { title: "Overview", href: "/interview" },
      {
        title: "AI Literacy",
        href: "/interview/ai-literacy",
        children: [
          {
            title: "What Is AI?",
            href: "/interview/ai-literacy/what-is-ai",
          },
        ],
      },
      {
        title: "AI Engineer Prep",
        href: "/interview/ai-engineer/v1",
        children: [
          {
            title: "Vector Databases",
            href: "/interview/ai-engineer/v1/db/vector-database",
          },
        ],
      },
      {
        title: "Frontier AI Engineering",
        href: "/interview/frontier-ai-engineering/v1",
      },
    ],
  },
  {
    title: "ML Essentials",
    href: "/ml-essentials",
    items: [{ title: "Overview", href: "/ml-essentials" }],
  },
  {
    title: "About",
    href: "/about",
    items: [{ title: "About KAVRIQ", href: "/about" }],
  },
  {
    title: "Privacy",
    href: "/privacy",
    items: [{ title: "Privacy Policy", href: "/privacy" }],
  },
  {
    title: "Disclaimer",
    href: "/disclaimer",
    items: [{ title: "Disclaimer", href: "/disclaimer" }],
  },
];

const normalizePath = (path: string) =>
  path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

export const getDocsNavSection = (pathname: string) => {
  const currentPath = normalizePath(pathname);

  const section = docsNavSections.find(section => {
    const sectionPath = normalizePath(section.href);
    return (
      currentPath === sectionPath || currentPath.startsWith(`${sectionPath}/`)
    );
  });

  if (
    !section ||
    section.href !== "/interview" ||
    currentPath === "/interview"
  ) {
    return section;
  }

  const topic = section.items
    .filter(item => item.children?.length)
    .filter(item => {
      const itemPath = normalizePath(item.href);
      return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
    })
    .sort((a, b) => b.href.length - a.href.length)[0];

  if (!topic?.children) return section;

  return {
    title: topic.title,
    href: topic.href,
    parent: {
      title: "All interview topics",
      href: section.href,
    },
    items: [{ title: "Overview", href: topic.href }, ...topic.children],
  };
};
