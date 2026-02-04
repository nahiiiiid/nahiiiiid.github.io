export type Theme = "dark" | "aura";

export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "research"
  | "blog";

export type Skill = { name: string; icon: React.ReactNode; level?: "Beginner" | "Intermediate" | "Advanced"; type?: string };
export type SkillCategory = { title: string; icon: React.ReactNode; items: Skill[] };

export type Project = {
  name: string;
  description: string;
  stack: string[];
  type: "Web" | "AI/ML" | "Systems" | "Academic";
  repo: string;
  demo?: string;
};

export type Post = { title: string; excerpt: string; date: string; slug: string };

export type EduNode = {
  degree: string;
  institution: string;
  duration: string;
  focus: string;
  order: number;
};

export type ResearchEntry = {
  title: string;
  domain: string;
  abstract: string;
  status: "Ongoing" | "Submitted" | "Published";
  links?: { paper?: string; code?: string; dataset?: string };
};

export type ExperienceEntry = {
  role: string;
  company: string;
  companyUrl?: string;
  duration: string;
  location?: string;
  bullets: string[];
  tech?: string[];
  achievements?: string[];
};


export type ThemeTokens = Record<
  | "--bg"
  | "--panel"
  | "--panel2"
  | "--text"
  | "--muted"
  | "--muted2"
  | "--border"
  | "--accent"
  | "--accent2"
  | "--grid"
  | "--shadow"
  | "--glow",
  string
>;

export type TerminalCommandDef =
  | { name: "help"; description: string; kind: "help" }
  | { name: "clear"; description: string; kind: "clear" }
  | { name: "close"; description: string; kind: "close" }
  | { name: "search"; description: string; kind: "search" }
  | { name: "open"; description: string; kind: "open"; targets: Array<{ key: string; label: string; url: string }> }
  | { name: string; description: string; kind: "navigate"; section: SectionId };
