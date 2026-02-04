import type { TerminalCommandDef } from "../types";
import { profile } from "./profile";

export const terminalCommands: TerminalCommandDef[] = [
  { name: "help", description: "List all commands", kind: "help" },
  { name: "about", description: "Navigate to About section", kind: "navigate", section: "about" },
  { name: "skills", description: "Navigate to Skills section", kind: "navigate", section: "skills" },
  { name: "projects", description: "Navigate to Projects section", kind: "navigate", section: "projects" },
  { name: "experience", description: "Navigate to Experience section", kind: "navigate", section: "experience" },
  { name: "education", description: "Navigate to Education section", kind: "navigate", section: "education" },
  { name: "research", description: "Navigate to Research section", kind: "navigate", section: "research" },
  { name: "blog", description: "Navigate to Blog section", kind: "navigate", section: "blog" },
  { name: "search", description: "Search projects, research, and blog. Usage: search <keyword>", kind: "search" },
  {
    name: "open",
    description: "Open external target. Usage: open github",
    kind: "open",
    targets: [{ key: "github", label: "GitHub", url: profile.social.github }],
  },
  { name: "clear", description: "Clear terminal output", kind: "clear" },
  { name: "close", description: "Close terminal", kind: "close" },
];
