import React from "react";
import { Code2, Cpu, Database, Github, Layers, Shield, Terminal, Wrench } from "lucide-react";
import type { SkillCategory } from "../types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    icon: <Code2 className="h-5 w-5" />,
    items: [
      { name: "C/C++", icon: <Terminal className="h-4 w-4" />, level: "Advanced" },
      { name: "JavaScript", icon: <Code2 className="h-4 w-4" />, level: "Advanced" },
      { name: "TypeScript", icon: <Code2 className="h-4 w-4" />, level: "Advanced" },
      { name: "Python", icon: <Terminal className="h-4 w-4" />, level: "Intermediate" },
    ],
  },
  {
    title: "Web Technologies",
    icon: <Layers className="h-5 w-5" />,
    items: [
      { name: "HTML5", icon: <Code2 className="h-4 w-4" /> },
      { name: "Tailwind CSS", icon: <Layers className="h-4 w-4" /> },
      { name: "REST APIs", icon: <Cpu className="h-4 w-4" /> },
      { name: "Accessibility", icon: <Shield className="h-4 w-4" /> },
    ],
  },
  {
    title: "Frameworks & Tools",
    icon: <Wrench className="h-5 w-5" />,
    items: [
      { name: "React", icon: <Layers className="h-4 w-4" /> },
      { name: "Vite", icon: <Cpu className="h-4 w-4" /> },
      { name: "Node.js", icon: <Cpu className="h-4 w-4" /> },
      { name: "Git", icon: <Github className="h-4 w-4" /> },
    ],
  },
  {
    title: "Databases",
    icon: <Database className="h-5 w-5" />,
    items: [
      { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
      { name: "MySQL", icon: <Database className="h-4 w-4" /> },
      { name: "MongoDB", icon: <Database className="h-4 w-4" /> },
      { name: "Redis", icon: <Database className="h-4 w-4" /> },
    ],
  },
  {
    title: "Databases",
    icon: <Database className="h-5 w-5" />,
    items: [
      { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
      { name: "MySQL", icon: <Database className="h-4 w-4" /> },
      { name: "MongoDB", icon: <Database className="h-4 w-4" /> },
      { name: "Redis", icon: <Database className="h-4 w-4" /> },
    ],
  },
];
