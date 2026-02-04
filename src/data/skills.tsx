// import React from "react";
// import { Code2, Cpu, Database, Github, Layers, Shield, Terminal, Wrench } from "lucide-react";
// import type { SkillCategory } from "../types";

// export const skillCategories: SkillCategory[] = [
//   {
//     title: "Programming Languages",
//     icon: <Code2 className="h-5 w-5" />,
//     items: [
//       { name: "C++", icon: <Terminal className="h-4 w-4" />, level: "Advanced" },
//       { name: "Python", icon: <Terminal className="h-4 w-4" />, level: "Intermediate" },
//       { name: "JavaScript", icon: <Code2 className="h-4 w-4" />, level: "Advanced" },
//       { name: "SQL", icon: <Terminal className="h-4 w-4" />, level: "Intermediate" },

//     ],
//   },
//   {
//     title: "Web Programming",
//     icon: <Layers className="h-5 w-5" />,
//     items: [
//       { name: "React.js", icon: <Code2 className="h-4 w-4" /> },
//       { name: "Django", icon: <Layers className="h-4 w-4" /> },
//       { name: "REST APIs", icon: <Cpu className="h-4 w-4" /> },
//       { name: "WebSockets", icon: <Cpu className="h-4 w-4" /> },
//       { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
//     ],
//   },
//   {
//     title: "Frameworks & Tools",
//     icon: <Wrench className="h-5 w-5" />,
//     items: [
//       { name: "React", icon: <Layers className="h-4 w-4" /> },
//       { name: "Vite", icon: <Cpu className="h-4 w-4" /> },
//       { name: "Node.js", icon: <Cpu className="h-4 w-4" /> },
//       { name: "Git", icon: <Github className="h-4 w-4" /> },
//     ],
//   },
//   {
//     title: "Databases",
//     icon: <Database className="h-5 w-5" />,
//     items: [
//       { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
//       { name: "MySQL", icon: <Database className="h-4 w-4" /> },
//       { name: "MongoDB", icon: <Database className="h-4 w-4" /> },
//       { name: "Redis", icon: <Database className="h-4 w-4" /> },
//     ],
//   },
//   {
//     title: "Databases",
//     icon: <Database className="h-5 w-5" />,
//     items: [
//       { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
//       { name: "MySQL", icon: <Database className="h-4 w-4" /> },
//       { name: "MongoDB", icon: <Database className="h-4 w-4" /> },
//       { name: "Redis", icon: <Database className="h-4 w-4" /> },
//     ],
//   },
// ];

import React from "react";
import {
  Code2,
  Cpu,
  Database,
  Github,
  Layers,
  Shield,
  Terminal,
  Wrench,
  Brain,
  Search,
  Network,
  Boxes,
} from "lucide-react";
import type { SkillCategory } from "../types";

export type ConceptItem = {
  name: string;
  icon?: React.ReactNode;
  description: string;
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    icon: <Code2 className="h-5 w-5" />,
    items: [
      {
        name: "C++",
        icon: <Terminal className="h-4 w-4" />,
        level: "Advanced",
      },
      {
        name: "Python",
        icon: <Terminal className="h-4 w-4" />,
        level: "Intermediate",
      },
      {
        name: "JavaScript",
        icon: <Code2 className="h-4 w-4" />,
        level: "Advanced",
      },
      {
        name: "SQL",
        icon: <Terminal className="h-4 w-4" />,
        level: "Intermediate",
      },
    ],
  },
  {
    title: "Web Programming",
    icon: <Layers className="h-5 w-5" />,
    items: [
      { name: "React.js", icon: <Code2 className="h-4 w-4" /> },
      { name: "Django", icon: <Layers className="h-4 w-4" /> },
      { name: "REST APIs", icon: <Cpu className="h-4 w-4" /> },
      { name: "WebSockets", icon: <Cpu className="h-4 w-4" /> },
      { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
    ],
  },
  // add more categories as you already do...
];

export const concepts: ConceptItem[] = [
  {
    name: "LLM",
    icon: <Brain className="h-4 w-4" />,
    description:
      "Build and integrate LLM-based features for automation and text understanding.",
  },
  {
    name: "RAG",
    icon: <Search className="h-4 w-4" />,
    description:
      "Augment generation with retrieval to answer from private knowledge sources.",
  },
  {
    name: "Transformers",
    icon: <Network className="h-4 w-4" />,
    description:
      "Use attention-based models for classification and sequence modeling tasks.",
  },
  {
    name: "Embeddings",
    icon: <Boxes className="h-4 w-4" />,
    description:
      "Create vector representations for semantic search, clustering, and similarity.",
  },
];
