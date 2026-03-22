# Open Source Notices & Attributions

This project was inspired by and builds upon concepts from the following open-source projects. Their designs, patterns, and ideas have influenced various features of Koschei. All original works remain the property of their respective copyright holders.

---

## Trigger.dev
**Repository:** https://github.com/triggerdotdev/trigger.dev  
**License:** Apache 2.0  
**Copyright:** © Trigger.dev Ltd.  
**Influence:** Koschei's Background Jobs (`/jobs`) and Pipeline execution engine are architecturally inspired by Trigger.dev's approach to durable, event-driven background task management. The job status tracking, retry logic scaffolding, and async task queue concepts draw from Trigger.dev's open-source patterns.

---

## Dify
**Repository:** https://github.com/langgenius/dify  
**License:** Apache 2.0  
**Copyright:** © LangGenius, Inc.  
**Influence:** Koschei's Pipeline Browser (`/pipeline`) is directly inspired by Dify's workflow template gallery, where users can browse, configure, and run multi-step AI workflow templates. The node-based pipeline execution model and template browsing UI follow patterns established by Dify.

---

## mem0
**Repository:** https://github.com/mem0ai/mem0  
**License:** Apache 2.0  
**Copyright:** © mem0 AI  
**Influence:** Koschei's conversational AI memory layer and the persistent context system within the Chat module are inspired by mem0's approach to giving AI applications long-term memory across sessions. The memory-store pattern used in Koschei's chat history and execution context is influenced by mem0's architecture.

---

## Deer-Flow (ByteDance)
**Repository:** https://github.com/bytedance/deer-flow  
**License:** Apache 2.0  
**Copyright:** © ByteDance Ltd.  
**Influence:** Koschei's deep-research pipeline template and multi-step research orchestration pattern are inspired by Deer-Flow's approach to structured, multi-agent research workflows. The concept of breaking complex research tasks into planner → researcher → summariser nodes is adapted from Deer-Flow.

---

## open-swe (LangChain AI)
**Repository:** https://github.com/langchain-ai/open-swe  
**License:** MIT  
**Copyright:** © LangChain, Inc.  
**Influence:** Koschei's Execution Core (`/execution`) and the software engineering agent pipeline template are inspired by open-swe's approach to autonomous software engineering tasks. The concept of task decomposition, architecture planning, and iterative execution steps draws from open-swe's agent loop design.

---

## RuView (ruvnet)
**Repository:** https://github.com/ruvnet/RuView  
**License:** MIT  
**Copyright:** © ruvnet  
**Influence:** Koschei's Builder module code review and analysis capabilities are inspired by RuView's AI-powered code review patterns. The structured diff analysis, issue categorization, and suggestion generation flow are influenced by RuView's approach.

---

## build-your-own-x (codecrafters-io)
**Repository:** https://github.com/codecrafters-io/build-your-own-x  
**License:** MIT  
**Copyright:** © CodeCrafters  
**Influence:** Koschei's Courses module (`/courses`) and educational content structure are inspired by the "build-your-own-x" philosophy — learning by building. The project-based learning tracks and hands-on coding challenges in Koschei's educational layer draw inspiration from this resource.

---

## WorldMonitor (koala73)
**Repository:** https://github.com/koala73/worldmonitor  
**License:** See source repository  
**Copyright:** © koala73  
**Influence:** Koschei's Ops Health and monitoring dashboard concepts reference WorldMonitor's approach to real-time system and workflow health tracking.

---

## superpowers (obra)
**Repository:** https://github.com/obra/superpowers  
**License:** See source repository  
**Copyright:** © obra  
**Influence:** Koschei's developer tooling concepts and power-user workflow patterns are informed by the superpowers project's approach to extensible developer capabilities.

---

## starter-nextjs-convex-ai (appydave-templates)
**Repository:** https://github.com/appydave-templates/starter-nextjs-convex-ai  
**License:** MIT  
**Copyright:** © AppyDave  
**Influence:** Koschei's Next.js + AI architecture, project scaffolding conventions, and real-time data patterns are informed by this starter template. The pattern of combining Next.js App Router with AI-first state management draws inspiration from this template.

---

## License Summary

| Project | License | Copyright Holder |
|---|---|---|
| trigger.dev | Apache 2.0 | Trigger.dev Ltd. |
| Dify | Apache 2.0 | LangGenius, Inc. |
| mem0 | Apache 2.0 | mem0 AI |
| Deer-Flow | Apache 2.0 | ByteDance Ltd. |
| open-swe | MIT | LangChain, Inc. |
| RuView | MIT | ruvnet |
| build-your-own-x | MIT | CodeCrafters |
| WorldMonitor | See repo | koala73 |
| superpowers | See repo | obra |
| starter-nextjs-convex-ai | MIT | AppyDave |

---

*This file lists projects that **inspired** Koschei's design and architecture. No source code from these projects has been copied into this repository. All implementations are original work. For questions about licensing, contact the respective copyright holders.*
