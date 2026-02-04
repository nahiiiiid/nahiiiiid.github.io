// src/data/experience.ts
import type { ExperienceEntry } from "../types";

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer (Web)",
    company: "Your Company Name",
    companyUrl: "https://company.com", // optional
    duration: "Jan 2022 — Present",
    location: "Dhaka, BD", // optional
    bullets: [
      "Built and maintained production-grade React + TypeScript interfaces with reusable components.",
      "Improved performance by optimizing renders, reducing bundle size, and enforcing clean state boundaries.",
      "Collaborated with cross-functional teams to ship features with predictable delivery and clean QA cycles.",
    ],
    tech: ["React", "TypeScript", "Tailwind", "REST"], // optional
    achievements: ["Reduced page load time by ~30%", "Shipped X features in Y weeks"], // optional
  },
  {
    role: "Research Assistant (CPS/IoT Security)",
    company: "Green University of Bangladesh",
    duration: "Jun 2024 — Dec 2024",
    location: "Remote",
    bullets: [
      "Designed leakage-aware evaluation pipelines for CPS/IoT security datasets.",
      "Implemented experiments for temporal + relational trust modeling and reported security-relevant metrics.",
    ],
    tech: ["PyTorch", "Transformers", "GNN", "Experiment Tracking"],
  },
];
