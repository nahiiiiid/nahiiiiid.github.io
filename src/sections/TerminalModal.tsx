// import React, { useEffect, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Terminal, X } from "lucide-react";

// import type {
//   Project,
//   ResearchEntry,
//   Post,
//   Theme,
//   TerminalCommandDef,
// } from "../types";

// import { scrollToSection } from "./shared";

// export default function TerminalModal({
//   open,
//   onClose,
//   theme,
//   commands,
//   projects,
//   posts,
//   research,
// }: {
//   open: boolean;
//   onClose: () => void;
//   theme: Theme;
//   commands: TerminalCommandDef[];
//   projects: Project[];
//   posts: Post[];
//   research: ResearchEntry[];
// }) {
//   const [lines, setLines] = useState<Array<{ kind: "out" | "cmd"; text: string }>>([
//     { kind: "out", text: "Nahid CLI — type `help` to list commands." },
//   ]);
//   const [input, setInput] = useState("");
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   const pushLine = (kind: "out" | "cmd", text: string) =>
//     setLines((prev) => [...prev, { kind, text }]);

//   const doSearch = (q: string) => {
//     const needle = q.toLowerCase();
//     const hits: string[] = [];

//     projects.forEach((p) => {
//       if (
//         p.name.toLowerCase().includes(needle) ||
//         p.description.toLowerCase().includes(needle) ||
//         p.stack.join(" ").toLowerCase().includes(needle)
//       )
//         hits.push(`project: ${p.name}`);
//     });

//     research.forEach((r) => {
//       if (
//         r.title.toLowerCase().includes(needle) ||
//         r.domain.toLowerCase().includes(needle) ||
//         r.abstract.toLowerCase().includes(needle)
//       )
//         hits.push(`research: ${r.title}`);
//     });

//     posts.forEach((b) => {
//       if (
//         b.title.toLowerCase().includes(needle) ||
//         b.excerpt.toLowerCase().includes(needle)
//       )
//         hits.push(`blog: ${b.title}`);
//     });

//     if (hits.length === 0) pushLine("out", "No matches.");
//     else {
//       pushLine("out", `Matches (${hits.length}):`);
//       hits.slice(0, 12).forEach((h) => pushLine("out", `- ${h}`));
//       if (hits.length > 12) pushLine("out", `…and ${hits.length - 12} more`);
//     }
//   };

//   const run = (raw: string) => {
//     const cmd = raw.trim();
//     if (!cmd) return;
//     pushLine("cmd", cmd);

//     const [headRaw, ...rest] = cmd.split(" ");
//     const head = headRaw.toLowerCase();
//     const arg = rest.join(" ").trim();
//     const def = commands.find((c) => c.name.toLowerCase() === head);

//     if (!def) {
//       pushLine("out", `Unknown command: ${head}. Type \`help\`.`);
//       return;
//     }

//     if (def.kind === "help") {
//       pushLine("out", "Commands:");
//       commands.forEach((c) => pushLine("out", `- ${c.name} → ${c.description}`));
//       return;
//     }
//     if (def.kind === "clear") {
//       setLines([{ kind: "out", text: "Cleared." }]);
//       return;
//     }
//     if (def.kind === "close") {
//       onClose();
//       return;
//     }
//     if (def.kind === "navigate") {
//       pushLine("out", `→ navigating to ${def.section}`);
//       onClose();
//       setTimeout(() => scrollToSection(def.section), 80);
//       return;
//     }
//     if (def.kind === "search") {
//       if (!arg) pushLine("out", "Usage: search <keyword>");
//       else doSearch(arg);
//       return;
//     }
//     if (def.kind === "open") {
//       if (!arg) {
//         pushLine("out", "Usage: open <target>");
//         def.targets.forEach((t) => pushLine("out", `- ${t.key} (${t.label})`));
//         return;
//       }
//       const t = def.targets.find((x) => x.key.toLowerCase() === arg.toLowerCase());
//       if (!t) {
//         pushLine("out", `Unknown target: ${arg}`);
//         def.targets.forEach((x) => pushLine("out", `- ${x.key} (${x.label})`));
//         return;
//       }
//       pushLine("out", `Opening ${t.label}…`);
//       window.open(t.url, "_blank", "noreferrer");
//       return;
//     }
//   };

//   useEffect(() => {
//     if (!open) return;
//     setTimeout(() => inputRef.current?.focus(), 50);
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [lines, open]);

//   return (
//     <AnimatePresence>
//       {open ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[60] grid place-items-center px-4"
//           aria-modal="true"
//           role="dialog"
//         >
//           <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
//           <motion.div
//             initial={{ opacity: 0, y: 14, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 12, scale: 0.98 }}
//             transition={{ duration: 0.22, ease: "easeOut" }}
//             className="relative w-full max-w-3xl overflow-hidden rounded-2xl border"
//             style={{
//               borderColor: "var(--border)",
//               background: "var(--panel)",
//               boxShadow: "var(--glow)",
//             }}
//           >
//             <div
//               className="flex items-center justify-between border-b px-4 py-3"
//               style={{ borderColor: "var(--border)" }}
//             >
//               <div className="flex items-center gap-2">
//                 <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
//                 <div className="font-mono text-sm" style={{ color: "var(--text)" }}>
//                   command mode
//                 </div>
//                 <span
//                   className="ml-2 rounded-full border px-2 py-0.5 text-[10px] font-mono"
//                   style={{ borderColor: "var(--border)", color: "var(--muted)" }}
//                 >
//                   Ctrl+K
//                 </span>
//               </div>

//               <button
//                 className="rounded-xl border p-2 transition hover:opacity-90"
//                 onClick={onClose}
//                 style={{
//                   borderColor: "var(--border)",
//                   color: "var(--text)",
//                   background: "var(--panel2)",
//                 }}
//                 aria-label="Close terminal"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="px-4 py-4">
//               <div
//                 ref={scrollRef}
//                 className="h-72 overflow-auto rounded-xl border p-3 font-mono text-sm leading-relaxed"
//                 style={{
//                   borderColor: "var(--border)",
//                   background:
//                     theme === "dark" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.55)",
//                   color: "var(--text)",
//                 }}
//               >
//                 {lines.map((l, i) => (
//                   <div key={i} className="whitespace-pre-wrap">
//                     {l.kind === "cmd" ? (
//                       <span>
//                         <span style={{ color: "var(--accent)" }}>$</span> {l.text}
//                       </span>
//                     ) : (
//                       <span style={{ color: "var(--text)" }}>{l.text}</span>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div
//                 className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-2"
//                 style={{ borderColor: "var(--border)", background: "var(--panel2)" }}
//               >
//                 <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>
//                   $
//                 </span>
//                 <input
//                   ref={inputRef}
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       const v = input;
//                       setInput("");
//                       run(v);
//                     } else if (e.key === "Escape") onClose();
//                   }}
//                   className="w-full bg-transparent font-mono text-sm outline-none"
//                   style={{ color: "var(--text)" }}
//                   placeholder="help • search trust • open github"
//                   aria-label="Terminal input"
//                 />
//               </div>

//               <div className="mt-3 text-xs" style={{ color: "var(--muted2)" }}>
//                 Tip: Ctrl+K toggles terminal • ESC closes
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }




import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Terminal,
  X,
  Copy,
  Check,
  Search,
  FolderKanban,
  FlaskConical,
  FileText,
  Info,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
} from "lucide-react";

import type {
  Project,
  ResearchEntry,
  Post,
  Theme,
  TerminalCommandDef,
  SectionId,
} from "../types";

import { scrollToSection } from "./shared";

/**
 * Futuristic TerminalModal
 * - big fullscreen-ish terminal
 * - command history (↑/↓)
 * - tab autocomplete
 * - fuzzy search across datasets (projects/research/blog)
 * - filters: type:, tag:, date:
 * - highlight matches
 * - collapsible outputs
 * - copy transcript + per-block copy
 * - session persistence (localStorage)
 * - resizable window + maximize
 *
 * NOTE: This file is self-contained (no backend).
 * You can add new custom commands in `customCommands` below.
 */

type LineKind = "cmd" | "info" | "error" | "success" | "project" | "research" | "blog";

type RichBlock = {
  id: string;
  title?: string;
  icon?: React.ReactNode;
  kind: LineKind;
  text: string; // plain text (can include new lines)
  ts: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  meta?: {
    type?: "project" | "research" | "blog" | "system";
    tags?: string[];
    date?: string;
    url?: string;
  };
  highlight?: string[]; // tokens to highlight
};

type Suggestion = {
  label: string;
  value: string;
  hint?: string;
};

const LS_KEY = "nahid_cli_v2_session";

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/** Very small fuzzy scorer (token-based) */
function scoreMatch(hay: string, tokens: string[]): number {
  const s = hay.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (!t) continue;
    const tt = t.toLowerCase();
    const idx = s.indexOf(tt);
    if (idx === -1) return -1;
    score += 50 - Math.min(idx, 40); // earlier matches score more
    score += Math.min(tt.length * 3, 30);
  }
  return score;
}

function splitQueryTokens(q: string) {
  // supports quoted tokens: "deep learning"
  const tokens: string[] = [];
  const re = /"([^"]+)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(q))) tokens.push((m[1] ?? m[2])?.trim() ?? "");
  return tokens.filter(Boolean);
}

function highlightText(text: string, needles: string[]) {
  if (!needles?.length) return [text] as Array<string | { h: string }>;
  const uniq = Array.from(new Set(needles.filter(Boolean).map((x) => x.toLowerCase())));
  if (!uniq.length) return [text];

  // highlight by splitting with a regex union (safe-ish for simple tokens)
  const escaped = uniq
    .slice(0, 12)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "ig");

  const parts: Array<string | { h: string }> = [];
  let last = 0;
  text.replace(re, (match, _g1, offset) => {
    const i = offset as number;
    if (i > last) parts.push(text.slice(last, i));
    parts.push({ h: match });
    last = i + match.length;
    return match;
  });
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function formatJSON(obj: unknown) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

function tokenizeFilters(raw: string) {
  // supports: type:project tag:react date:2025
  const tokens = splitQueryTokens(raw);
  const filters: { type?: "project" | "research" | "blog"; tag?: string; date?: string } = {};
  const free: string[] = [];
  tokens.forEach((t) => {
    const [k, ...rest] = t.split(":");
    const v = rest.join(":");
    if (!v) {
      free.push(t);
      return;
    }
    const key = k.toLowerCase();
    if (key === "type" && ["project", "research", "blog"].includes(v.toLowerCase())) {
      filters.type = v.toLowerCase() as any;
      return;
    }
    if (key === "tag") {
      filters.tag = v;
      return;
    }
    if (key === "date") {
      filters.date = v;
      return;
    }
    free.push(t);
  });
  return { filters, freeTokens: free };
}

function lineColor(kind: LineKind) {
  switch (kind) {
    case "cmd":
      return "var(--text)";
    case "info":
      return "var(--muted)";
    case "success":
      return "rgba(52,211,153,0.95)";
    case "error":
      return "rgba(248,113,113,0.95)";
    case "project":
      return "rgba(59,130,246,0.95)";
    case "research":
      return "rgba(34,211,238,0.95)";
    case "blog":
      return "rgba(167,139,250,0.95)";
    default:
      return "var(--text)";
  }
}

function kindIcon(kind: LineKind) {
  switch (kind) {
    case "project":
      return <FolderKanban className="h-4 w-4" />;
    case "research":
      return <FlaskConical className="h-4 w-4" />;
    case "blog":
      return <FileText className="h-4 w-4" />;
    case "info":
      return <Info className="h-4 w-4" />;
    case "error":
      return <AlertTriangle className="h-4 w-4" />;
    case "success":
      return <Check className="h-4 w-4" />;
    default:
      return <Terminal className="h-4 w-4" />;
  }
}

function useBlink(periodMs = 800) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), periodMs);
    return () => clearInterval(t);
  }, [periodMs]);
  return on;
}

export default function TerminalModal({
  open,
  onClose,
  theme,
  commands,
  projects,
  posts,
  research,
}: {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  commands: TerminalCommandDef[];
  projects: Project[];
  posts: Post[];
  research: ResearchEntry[];
}) {
  // ---------- session + blocks ----------
  const [blocks, setBlocks] = useState<RichBlock[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        return [
          {
            id: uid(),
            kind: "info",
            text: "Nahid CLI — type `help` to list commands.\nTip: Tab autocomplete • ↑/↓ history • ESC close • Ctrl+K toggle",
            ts: Date.now(),
          },
        ];
      }
      const parsed = JSON.parse(raw) as RichBlock[];
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("bad session");
      return parsed.slice(-500); // hard cap
    } catch {
      return [
        {
          id: uid(),
          kind: "info",
          text: "Nahid CLI — type `help` to list commands.\nTip: Tab autocomplete • ↑/↓ history • ESC close • Ctrl+K toggle",
          ts: Date.now(),
        },
      ];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(blocks.slice(-500)));
    } catch {}
  }, [blocks]);

  const push = (b: Omit<RichBlock, "id" | "ts">) =>
    setBlocks((prev) => [...prev, { ...b, id: uid(), ts: Date.now() }].slice(-800));

  // ---------- input + history ----------
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState(""); // for restoring input after history browsing
  const [hist, setHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ---------- ui state ----------
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [maximized, setMaximized] = useState(true);

  // resizable
  const [size, setSize] = useState({ w: 92, h: 86 }); // in vw/vh when not maximized
  const resizingRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  const cursorOn = useBlink(720);

  // ---------- derived: command list & suggestions ----------
  const baseCommandNames = useMemo(() => commands.map((c) => c.name), [commands]);

  const customCommands = useMemo(
    () =>
      [
        {
          name: "about",
          description: "Show quick system info about this portfolio CLI",
          run: () => {
            push({
              kind: "info",
              title: "system",
              text:
                "Nahid Portfolio Terminal\n" +
                "- Frontend-only, no backend\n" +
                "- Search across projects/research/blog\n" +
                "- Supports filtering & JSON views\n\n" +
                "Try:\n  search type:project \"react\" \n  show project 1\n  list research\n  theme aura|dark\n  session clear",
              collapsible: true,
              defaultCollapsed: false,
            });
            push({ kind: "success", text: "command executed successfully" });
          },
        },
        {
          name: "list",
          description: "List items by type: list project|research|blog",
          run: (arg: string) => {
            const t = arg.trim().toLowerCase();
            if (!["project", "projects", "research", "blog", "posts"].includes(t)) {
              push({ kind: "error", text: "Usage: list project|research|blog" });
              return;
            }
            if (t.startsWith("proj")) {
              const out = projects
                .map((p, i) => `${String(i + 1).padStart(2, "0")}. ${p.name} — ${p.type}`)
                .join("\n");
              push({
                kind: "project",
                title: `Projects (${projects.length})`,
                text: out || "No projects found.",
                collapsible: true,
                defaultCollapsed: false,
              });
              push({ kind: "success", text: "ok" });
              return;
            }
            if (t.startsWith("rese")) {
              const out = research
                .map((r, i) => `${String(i + 1).padStart(2, "0")}. ${r.title} — ${r.status}`)
                .join("\n");
              push({
                kind: "research",
                title: `Research (${research.length})`,
                text: out || "No research entries found.",
                collapsible: true,
                defaultCollapsed: false,
              });
              push({ kind: "success", text: "ok" });
              return;
            }
            const out = posts
              .map((b, i) => `${String(i + 1).padStart(2, "0")}. ${b.title} — ${b.date}`)
              .join("\n");
            push({
              kind: "blog",
              title: `Blog (${posts.length})`,
              text: out || "No blog posts found.",
              collapsible: true,
              defaultCollapsed: false,
            });
            push({ kind: "success", text: "ok" });
          },
        },
        {
          name: "show",
          description: "Show details: show project|research|blog <index>",
          run: (arg: string) => {
            const parts = splitQueryTokens(arg);
            const kind = (parts[0] ?? "").toLowerCase();
            const idx = Number(parts[1] ?? "");
            if (!["project", "research", "blog"].includes(kind) || !Number.isFinite(idx) || idx < 1) {
              push({ kind: "error", text: "Usage: show project|research|blog <index>" });
              return;
            }
            if (kind === "project") {
              const p = projects[idx - 1];
              if (!p) return push({ kind: "error", text: "Project not found." });
              push({
                kind: "project",
                title: `project #${idx} — ${p.name}`,
                text: formatJSON(p),
                collapsible: true,
                defaultCollapsed: false,
                meta: { type: "project", url: (p as any).repo },
              });
              push({ kind: "success", text: "ok" });
              return;
            }
            if (kind === "research") {
              const r = research[idx - 1];
              if (!r) return push({ kind: "error", text: "Research entry not found." });
              push({
                kind: "research",
                title: `research #${idx} — ${r.title}`,
                text: formatJSON(r),
                collapsible: true,
                defaultCollapsed: false,
                meta: { type: "research", url: r.links?.paper },
              });
              push({ kind: "success", text: "ok" });
              return;
            }
            const b = posts[idx - 1];
            if (!b) return push({ kind: "error", text: "Blog post not found." });
            push({
              kind: "blog",
              title: `blog #${idx} — ${b.title}`,
              text: formatJSON(b),
              collapsible: true,
              defaultCollapsed: false,
              meta: { type: "blog" },
            });
            push({ kind: "success", text: "ok" });
          },
        },
        {
          name: "session",
          description: "Session tools: session clear|reset",
          run: (arg: string) => {
            const a = arg.trim().toLowerCase();
            if (a === "clear" || a === "reset") {
              setBlocks([
                {
                  id: uid(),
                  kind: "info",
                  text: "Session reset.\nType `help` to list commands.",
                  ts: Date.now(),
                },
              ]);
              setCollapsed({});
              push({ kind: "success", text: "session cleared" });
              return;
            }
            push({ kind: "error", text: "Usage: session clear" });
          },
        },
      ] as const,
    [projects, research, posts],
  );

  const allCommandDefs = useMemo(() => {
    const map: Record<string, { name: string; description: string }> = {};
    commands.forEach((c) => (map[c.name.toLowerCase()] = { name: c.name, description: c.description }));
    customCommands.forEach((c) => (map[c.name.toLowerCase()] = { name: c.name, description: c.description }));
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [commands, customCommands]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const raw = input;
    const trimmed = raw.replace(/\s+$/g, "");
    const parts = trimmed.split(/\s+/);
    const head = (parts[0] ?? "").toLowerCase();

    // command suggestions
    if (parts.length <= 1 && !raw.includes(" ")) {
      const q = head;
      const list = allCommandDefs
        .filter((c) => c.name.toLowerCase().includes(q))
        .slice(0, 8)
        .map((c) => ({ label: c.name, value: c.name, hint: c.description }));
      return list;
    }

    // argument suggestions for known commands
    if (head === "open") {
      const def = commands.find((c) => c.kind === "open");
      const q = (parts[1] ?? "").toLowerCase();
      return (def?.targets ?? [])
        .filter((t) => t.key.toLowerCase().includes(q) || t.label.toLowerCase().includes(q))
        .slice(0, 8)
        .map((t) => ({ label: `${t.key}`, value: `open ${t.key}`, hint: t.label }));
    }

    if (head === "navigate") {
      const def = commands.find((c) => c.kind === "navigate") as any;
      // your navigate def likely has a fixed section; so just hint
      return [
        { label: "navigate <sectionId>", value: "navigate projects", hint: "Scroll to a section" },
        { label: "Example", value: "navigate skills", hint: "Go to Skills" },
      ];
    }

    if (head === "list") {
      const q = (parts[1] ?? "").toLowerCase();
      return ["project", "research", "blog"]
        .filter((x) => x.includes(q))
        .map((x) => ({ label: x, value: `list ${x}` }));
    }

    if (head === "show") {
      return [
        { label: "show project 1", value: "show project 1", hint: "Detailed JSON view" },
        { label: "show research 1", value: "show research 1", hint: "Detailed JSON view" },
        { label: "show blog 1", value: "show blog 1", hint: "Detailed JSON view" },
      ];
    }

    if (head === "search") {
      return [
        { label: "type:project", value: "search type:project ", hint: "Filter by type" },
        { label: "type:research", value: "search type:research ", hint: "Filter by type" },
        { label: "type:blog", value: "search type:blog ", hint: "Filter by type" },
        { label: "tag:react", value: "search tag:react ", hint: "Filter by tag" },
        { label: "\"deep learning\"", value: 'search "deep learning" ', hint: "Quoted multi-word token" },
      ].slice(0, 6);
    }

    return [];
  }, [input, allCommandDefs, commands]);

  // ---------- smooth autoscroll ----------
  useEffect(() => {
    if (!open) return;
    // requestAnimationFrame avoids jank during animated output
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [blocks, open]);

  // ---------- focus on open ----------
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // ---------- ESC close (safety) ----------
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ---------- resize handlers ----------
  const startResize = (e: React.PointerEvent) => {
    if (maximized) return;
    resizingRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startW: size.w,
      startH: size.h,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: React.PointerEvent) => {
    const st = resizingRef.current;
    if (!st?.active) return;
    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    const vw = (dx / window.innerWidth) * 100;
    const vh = (dy / window.innerHeight) * 100;
    setSize({
      w: clamp(st.startW + vw, 60, 98),
      h: clamp(st.startH + vh, 55, 94),
    });
  };

  const endResize = () => {
    if (resizingRef.current) resizingRef.current.active = false;
  };

  // ---------- transcript copy ----------
  const copyText = async (txt: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      if (id) setCopiedId(id);
      else setCopiedId("all");
      setTimeout(() => setCopiedId(null), 900);
    } catch {
      // ignore
    }
  };

  const transcript = useMemo(() => {
    return blocks
      .map((b) => {
        if (b.kind === "cmd") return `$ ${b.text}`;
        if (b.title) return `${b.title}\n${b.text}`;
        return b.text;
      })
      .join("\n\n");
  }, [blocks]);

  // ---------- search engine ----------
  const doAdvancedSearch = (rawQ: string) => {
    const { filters, freeTokens } = tokenizeFilters(rawQ);
    const tokens = freeTokens;
    const needles = tokens.length ? tokens : [];
    const maxShow = 18;

    const results: Array<{
      kind: "project" | "research" | "blog";
      title: string;
      subtitle?: string;
      score: number;
      raw: any;
      url?: string;
    }> = [];

    if (!filters.type || filters.type === "project") {
      projects.forEach((p) => {
        const hay =
          `${p.name}\n${p.description}\n${p.stack.join(" ")}\n${(p as any).type ?? ""}`.toLowerCase();
        const sc = scoreMatch(hay, tokens.map((t) => t.toLowerCase()));
        if (sc >= 0) {
          results.push({
            kind: "project",
            title: p.name,
            subtitle: p.description,
            score: sc,
            raw: p,
            url: (p as any).repo,
          });
        }
      });
    }

    if (!filters.type || filters.type === "research") {
      research.forEach((r) => {
        const hay = `${r.title}\n${r.domain}\n${r.abstract}\n${r.status}`.toLowerCase();
        const sc = scoreMatch(hay, tokens.map((t) => t.toLowerCase()));
        if (sc >= 0) {
          results.push({
            kind: "research",
            title: r.title,
            subtitle: `${r.domain} • ${r.status}`,
            score: sc,
            raw: r,
            url: r.links?.paper ?? r.links?.code ?? undefined,
          });
        }
      });
    }

    if (!filters.type || filters.type === "blog") {
      posts.forEach((b) => {
        const hay = `${b.title}\n${b.excerpt}\n${b.date}`.toLowerCase();
        const sc = scoreMatch(hay, tokens.map((t) => t.toLowerCase()));
        if (sc >= 0) {
          results.push({
            kind: "blog",
            title: b.title,
            subtitle: `${b.date} • ${b.excerpt}`,
            score: sc,
            raw: b,
          });
        }
      });
    }

    // optional filters (tag/date) — only apply if data exists
    let filtered = results;
    if (filters.tag) {
      const tag = filters.tag.toLowerCase();
      filtered = filtered.filter((r) => {
        const raw = r.raw as any;
        const tags: string[] = raw?.tags ?? raw?.stack ?? [];
        return Array.isArray(tags) && tags.some((t: string) => String(t).toLowerCase().includes(tag));
      });
    }
    if (filters.date) {
      const d = filters.date.toLowerCase();
      filtered = filtered.filter((r) => {
        const raw = r.raw as any;
        const date = String(raw?.date ?? raw?.year ?? raw?.duration ?? "").toLowerCase();
        return date.includes(d);
      });
    }

    filtered.sort((a, b) => b.score - a.score);

    if (filtered.length === 0) {
      push({ kind: "info", text: "No matches." });
      return;
    }

    const header = `Matches (${filtered.length})`;
    const outLines = filtered.slice(0, maxShow).map((r, idx) => {
      const prefix = r.kind === "project" ? "project" : r.kind === "research" ? "research" : "blog";
      return `${String(idx + 1).padStart(2, "0")}. ${prefix}: ${r.title}${r.subtitle ? ` — ${r.subtitle}` : ""}`;
    });

    if (filtered.length > maxShow) outLines.push(`…and ${filtered.length - maxShow} more`);

    push({
      kind: "info",
      title: header,
      icon: <Search className="h-4 w-4" />,
      text: outLines.join("\n"),
      collapsible: true,
      defaultCollapsed: false,
      highlight: needles,
    });

    push({ kind: "success", text: "search completed" });
  };

  // ---------- command runner ----------
  const run = (raw: string) => {
    const cmd = raw.replace(/\s+$/g, ""); // keep leading spaces? no
    if (!cmd.trim()) return;

    // multi-line: run each non-empty line
    const script = cmd.split("\n").map((l) => l.trim()).filter(Boolean);
    if (script.length > 1) {
      push({ kind: "cmd", text: cmd });
      push({ kind: "info", text: `Running ${script.length} lines…` });
      script.forEach((line) => run(line));
      return;
    }

    push({ kind: "cmd", text: cmd });

    // store history
    setHist((prev) => {
      const next = [...prev, cmd].slice(-200);
      return next;
    });
    setHistIdx(-1);
    setDraft("");

    const [headRaw, ...rest] = cmd.trim().split(" ");
    const head = headRaw.toLowerCase();
    const arg = rest.join(" ").trim();

    // custom commands
    const cc = customCommands.find((c) => c.name.toLowerCase() === head);
    if (cc) {
      cc.run(arg);
      return;
    }

    // existing defs (from your data/terminalCommands)
    const def = commands.find((c) => c.name.toLowerCase() === head);

    if (!def) {
      push({ kind: "error", text: `Unknown command: ${head}. Type \`help\`.` });
      return;
    }

    if (def.kind === "help") {
      const out =
        "Commands:\n" +
        allCommandDefs.map((c) => `- ${c.name} → ${c.description}`).join("\n") +
        "\n\nSearch tips:\n" +
        "- search type:project react\n" +
        '- search "deep learning" trust\n' +
        "- search tag:react type:project\n\n" +
        "Details:\n- show project 1";
      push({
        kind: "info",
        title: "help",
        text: out,
        collapsible: true,
        defaultCollapsed: false,
      });
      push({ kind: "success", text: "ok" });
      return;
    }

    if (def.kind === "clear") {
      setBlocks([{ id: uid(), kind: "info", text: "Cleared.", ts: Date.now() }]);
      push({ kind: "success", text: "ok" });
      return;
    }

    if (def.kind === "close") {
      push({ kind: "success", text: "closing…" });
      onClose();
      return;
    }

    if (def.kind === "navigate") {
      const section = (def as any).section as SectionId;
      push({ kind: "info", text: `→ navigating to ${section}` });
      push({ kind: "success", text: "ok" });
      onClose();
      setTimeout(() => scrollToSection(section), 80);
      return;
    }

    if (def.kind === "search") {
      if (!arg) {
        push({ kind: "error", text: "Usage: search <keyword> (supports type:, tag:, date:)" });
      } else {
        doAdvancedSearch(arg);
      }
      return;
    }

    if (def.kind === "open") {
      if (!arg) {
        const targets = def.targets.map((t) => `- ${t.key} (${t.label})`).join("\n");
        push({ kind: "info", text: `Usage: open <target>\n${targets}`, collapsible: true });
        return;
      }
      const t = def.targets.find((x) => x.key.toLowerCase() === arg.toLowerCase());
      if (!t) {
        push({ kind: "error", text: `Unknown target: ${arg}` });
        return;
      }
      push({ kind: "info", text: `Opening ${t.label}…` });
      push({ kind: "success", text: "ok" });
      window.open(t.url, "_blank", "noreferrer");
      return;
    }
  };

  // ---------- key handling (history, autocomplete, submit) ----------
  const applyAutocomplete = () => {
    if (!suggestions.length) return;
    const pick = suggestions[0].value;
    setInput(pick.endsWith(" ") ? pick : pick + " ");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // submit
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const v = input;
      setInput("");
      run(v);
      return;
    }

    // close
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    // autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      applyAutocomplete();
      return;
    }

    // history
    if (e.key === "ArrowUp") {
      // if cursor not at first line, allow textarea normal movement
      const el = e.currentTarget;
      const before = el.value.slice(0, el.selectionStart);
      const isFirstLine = !before.includes("\n");
      if (!isFirstLine) return;

      e.preventDefault();
      setHistIdx((prev) => {
        const nextIdx = prev === -1 ? hist.length - 1 : prev - 1;
        const clamped = clamp(nextIdx, 0, Math.max(hist.length - 1, 0));
        if (prev === -1) setDraft(input);
        setInput(hist[clamped] ?? "");
        return clamped;
      });
      return;
    }

    if (e.key === "ArrowDown") {
      const el = e.currentTarget;
      const before = el.value.slice(0, el.selectionStart);
      const after = el.value.slice(el.selectionEnd);
      // if cursor not at last line, allow textarea normal movement
      const isLastLine = !after.includes("\n");
      if (!isLastLine) return;

      e.preventDefault();
      setHistIdx((prev) => {
        if (prev === -1) return -1;
        const nextIdx = prev + 1;
        if (nextIdx >= hist.length) {
          setInput(draft);
          return -1;
        }
        setInput(hist[nextIdx] ?? "");
        return nextIdx;
      });
      return;
    }

    // ctrl+l clear (terminal convention)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setBlocks([{ id: uid(), kind: "info", text: "Cleared.", ts: Date.now() }]);
      return;
    }
  };

  // ---------- visual theme for terminal (independent toggle) ----------
  const [termTheme, setTermTheme] = useState<"matrix" | "cyan" | "violet">("cyan");

  const termAccent = useMemo(() => {
    if (termTheme === "matrix") return "rgba(34,197,94,1)";
    if (termTheme === "violet") return "rgba(167,139,250,1)";
    return "rgba(34,211,238,1)";
  }, [termTheme]);

  // ---------- rendering helpers ----------
  const toggleBlock = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !(prev[id] ?? false) }));

  const isCollapsed = (b: RichBlock) => {
    const user = collapsed[b.id];
    if (typeof user === "boolean") return user;
    return b.defaultCollapsed ?? false;
  };

  const windowStyle = useMemo<React.CSSProperties>(() => {
    if (maximized) {
      return { width: "min(1120px, 96vw)", height: "min(760px, 88vh)" };
    }
    return { width: `${size.w}vw`, height: `${size.h}vh` };
  }, [maximized, size]);

  // background “futuristic” overlay (CSS-only noise/flicker)
  const bgOverlay = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, rgba(34,211,238,0.12), transparent 10%)," +
            "radial-gradient(900px 500px at 85% 15%, rgba(167,139,250,0.10), transparent 10%)," +
            "radial-gradient(900px 600px at 50% 90%, rgba(59,130,246,0.08), transparent 10%)",
          opacity: 0.0,
          mixBlendMode: "screen",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        animate={{ opacity: [0.08, 0.12, 0.09, 0.11] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(transparent 1000%, rgba(255,255,255,0.06) 50%, transparent 10%)",
          backgroundSize: "100% 12px",
          filter: "blur(0.2px)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        animate={{ opacity: [0.05, 0.08, 0.06, 0.09] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </>
  );

  // ---------- performance: simple “virtualization” window ----------
  const view = useMemo(() => {
    const MAX_RENDER = 260; // plenty; still safe
    return blocks.length > MAX_RENDER ? blocks.slice(-MAX_RENDER) : blocks;
  }, [blocks]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center px-3 sm:px-4"
          aria-modal="true"
          role="dialog"
          aria-label="Terminal modal"
          onPointerMove={onResizeMove}
          onPointerUp={endResize}
          onPointerCancel={endResize}
        >
          {/* backdrop */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                theme === "dark"
                  ? "rgba(0,0,0,0.62)"
                  : "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
            }}
            onClick={onClose}
          />

          {/* terminal window */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.985 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border"
            style={{
              ...windowStyle,
              borderColor: "color-mix(in oklab, var(--border) 50%, transparent)" as any,
              background:
                theme === "dark"
                  ? "rgba(10,12,16,0.78)"
                  : "rgba(255,255,255,0.78)",
              boxShadow:
                "0 0 0 1px rgba(34,211,238,0.20), 0 30px 80px -35px rgba(34,211,238,0.35), 0 20px 60px -45px rgba(167,139,250,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            {bgOverlay}

            {/* header */}
            <div
              className="relative flex items-center justify-between border-b px-3 py-2 sm:px-4"
              style={{
                borderColor: "color-mix(in oklab, var(--border) 55%, transparent)" as any,
              }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl border"
                  style={{
                    borderColor: "color-mix(in oklab, var(--border) 65%, transparent)" as any,
                    background: "rgba(0,0,0,0.18)",
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 0 24px -12px ${termAccent}`,
                    color: termAccent,
                  }}
                >
                  <Terminal className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="truncate font-mono text-sm"
                      style={{ color: "var(--text)" }}
                    >
                      Nahid Terminal
                    </div>
                    <span
                      className="hidden rounded-full border px-2 py-0.5 font-mono text-[10px] sm:inline"
                      style={{
                        borderColor: "color-mix(in oklab, var(--border) 65%, transparent)" as any,
                        color: "var(--muted2)",
                        background: "rgba(0,0,0,0.10)",
                      }}
                    >
                      Ctrl+K
                    </span>
                  </div>
                  <div
                    className="truncate font-mono text-[11px]"
                    style={{ color: "var(--muted2)" }}
                  >
                    futuristic • keyboard-first • no-backend
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* theme toggle */}
                <div className="hidden items-center gap-1 sm:flex">
                  {(["cyan", "violet", "matrix"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTermTheme(t)}
                      className="rounded-lg border px-2 py-1 text-[11px] font-mono transition hover:opacity-90"
                      style={{
                        borderColor:
                          termTheme === t
                            ? ("color-mix(in oklab, " + termAccent + " 45%, transparent)" as any)
                            : ("color-mix(in oklab, var(--border) 65%, transparent)" as any),
                        background:
                          termTheme === t
                            ? ("color-mix(in oklab, " + termAccent + " 16%, transparent)" as any)
                            : "rgba(0,0,0,0.10)",
                        color: "var(--text)",
                      }}
                      aria-label={`Terminal accent ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* copy transcript */}
                <button
                  onClick={() => copyText(transcript)}
                  className="rounded-xl border p-2 transition hover:opacity-90"
                  style={{
                    borderColor: "color-mix(in oklab, var(--border) 65%, transparent)" as any,
                    background: "rgba(0,0,0,0.10)",
                    color: "var(--text)",
                  }}
                  aria-label="Copy terminal output"
                  title="Copy output"
                >
                  {copiedId === "all" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>

                {/* maximize */}
                <button
                  onClick={() => setMaximized((v) => !v)}
                  className="rounded-xl border p-2 transition hover:opacity-90"
                  style={{
                    borderColor: "color-mix(in oklab, var(--border) 65%, transparent)" as any,
                    background: "rgba(0,0,0,0.10)",
                    color: "var(--text)",
                  }}
                  aria-label={maximized ? "Restore terminal size" : "Maximize terminal"}
                  title={maximized ? "Restore" : "Maximize"}
                >
                  {maximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>

                {/* close */}
                <button
                  className="rounded-xl border p-2 transition hover:opacity-90"
                  onClick={onClose}
                  style={{
                    borderColor: "color-mix(in oklab, var(--border) 65%, transparent)" as any,
                    background: "rgba(0,0,0,0.10)",
                    color: "var(--text)",
                  }}
                  aria-label="Close terminal"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="relative flex h-[calc(100%-52px)] flex-col">
              {/* output */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-auto px-3 py-3 sm:px-4"
                style={{
                  scrollbarGutter: "stable",
                }}
              >
                <div className="space-y-2 font-mono text-[13px] leading-relaxed sm:text-sm">
                  {blocks.length > view.length ? (
                    <div
                      className="rounded-xl border px-3 py-2 text-xs"
                      style={{
                        borderColor: "color-mix(in oklab, var(--border) 55%, transparent)" as any,
                        background: "rgba(0,0,0,0.10)",
                        color: "var(--muted2)",
                      }}
                    >
                      Showing last {view.length} lines (performance mode). Use “copy output” for full transcript.
                    </div>
                  ) : null}

                  {view.map((b) => {
                    const collapsedNow = b.collapsible ? isCollapsed(b) : false;

                    const icon = b.icon ?? (
                      <span style={{ color: lineColor(b.kind) }}>{kindIcon(b.kind)}</span>
                    );

                    const headerRow =
                      b.title || b.collapsible ? (
                        <button
                          onClick={() => b.collapsible && toggleBlock(b.id)}
                          className="group flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition hover:opacity-95"
                          style={{
                            borderColor:
                              "color-mix(in oklab, var(--border) 55%, transparent)" as any,
                            background: "rgba(0,0,0,0.10)",
                          }}
                          aria-label={b.collapsible ? "Toggle output block" : undefined}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span style={{ color: lineColor(b.kind) }}>{icon}</span>
                            <div className="min-w-0">
                              <div
                                className="truncate text-xs font-semibold"
                                style={{ color: "var(--text)" }}
                              >
                                {b.title ?? (b.kind === "cmd" ? "command" : "output")}
                              </div>
                              {b.meta?.url ? (
                                <div
                                  className="truncate text-[11px]"
                                  style={{ color: "var(--muted2)" }}
                                >
                                  {b.meta.url}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-lg border p-1.5 opacity-0 transition group-hover:opacity-100"
                              style={{
                                borderColor:
                                  "color-mix(in oklab, var(--border) 60%, transparent)" as any,
                                background: "rgba(0,0,0,0.12)",
                                color: "var(--text)",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                copyText((b.title ? b.title + "\n" : "") + b.text, b.id);
                              }}
                              aria-label="Copy this block"
                              title="Copy block"
                            >
                              {copiedId === b.id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>

                            {b.collapsible ? (
                              <span style={{ color: "var(--muted2)" }}>
                                {collapsedNow ? (
                                  <ChevronRight className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </span>
                            ) : null}
                          </div>
                        </button>
                      ) : null;

                    const content = (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="rounded-xl border px-3 py-2"
                        style={{
                          borderColor:
                            b.kind === "cmd"
                              ? ("color-mix(in oklab, " + termAccent + " 40%, transparent)" as any)
                              : ("color-mix(in oklab, var(--border) 55%, transparent)" as any),
                          background:
                            b.kind === "cmd"
                              ? ("color-mix(in oklab, " + termAccent + " 10%, transparent)" as any)
                              : "rgba(0,0,0,0.06)",
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-[2px]" style={{ color: lineColor(b.kind) }}>
                            {b.kind === "cmd" ? (
                              <span style={{ color: termAccent }}>$</span>
                            ) : (
                              kindIcon(b.kind)
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className="whitespace-pre-wrap"
                              style={{
                                color: b.kind === "cmd" ? "var(--text)" : lineColor(b.kind),
                              }}
                            >
                              {highlightText(b.text, b.highlight ?? []).map((p, i) =>
                                typeof p === "string" ? (
                                  <span key={i}>{p}</span>
                                ) : (
                                  <span
                                    key={i}
                                    className="rounded px-1"
                                    style={{
                                      background:
                                        "color-mix(in oklab, " + termAccent + " 24%, transparent)" as any,
                                      color: "var(--text)",
                                    }}
                                  >
                                    {p.h}
                                  </span>
                                ),
                              )}
                            </div>

                            {/* clickable url */}
                            {b.meta?.url ? (
                              <div className="mt-2">
                                <button
                                  className="rounded-lg border px-2 py-1 text-[11px] transition hover:opacity-90"
                                  style={{
                                    borderColor:
                                      "color-mix(in oklab, var(--border) 60%, transparent)" as any,
                                    background: "rgba(0,0,0,0.10)",
                                    color: "var(--text)",
                                  }}
                                  onClick={() => window.open(b.meta!.url!, "_blank", "noreferrer")}
                                  aria-label="Open link"
                                >
                                  Open link
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    );

                    return (
                      <div key={b.id} className="space-y-2">
                        {headerRow}
                        {b.title || b.collapsible ? (
                          collapsedNow ? null : (
                            <div className="pl-1">{content}</div>
                          )
                        ) : (
                          content
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* suggestions */}
              {suggestions.length ? (
                <div
                  className="relative border-t px-3 py-2 sm:px-4"
                  style={{
                    borderColor: "color-mix(in oklab, var(--border) 55%, transparent)" as any,
                    background: "rgba(0,0,0,0.10)",
                  }}
                  aria-label="Autocomplete suggestions"
                >
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 6).map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInput(s.value.endsWith(" ") ? s.value : s.value + " ");
                          inputRef.current?.focus();
                        }}
                        className="rounded-xl border px-2.5 py-1 text-[11px] font-mono transition hover:opacity-90"
                        style={{
                          borderColor:
                            "color-mix(in oklab, var(--border) 60%, transparent)" as any,
                          background:
                            "color-mix(in oklab, " + termAccent + " 10%, transparent)" as any,
                          color: "var(--text)",
                        }}
                        title={s.hint}
                        aria-label={`Suggestion ${s.label}`}
                      >
                        {s.label}
                        {s.hint ? (
                          <span className="ml-2 opacity-70">{s.hint}</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                  <div
                    className="mt-1 text-[11px] font-mono"
                    style={{ color: "var(--muted2)" }}
                  >
                    Press <span style={{ color: termAccent }}>Tab</span> to accept first suggestion
                  </div>
                </div>
              ) : null}

              {/* input */}
              <div
                className="relative border-t px-3 py-3 sm:px-4"
                style={{
                  borderColor: "color-mix(in oklab, var(--border) 55%, transparent)" as any,
                  background: "rgba(0,0,0,0.12)",
                }}
              >
                <div
                  className="flex items-start gap-2 rounded-2xl border px-3 py-2"
                  style={{
                    borderColor:
                      "color-mix(in oklab, " + termAccent + " 35%, transparent)" as any,
                    background: "rgba(0,0,0,0.16)",
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 10px 40px -30px ${termAccent}`,
                  }}
                >
                  <span
                    className="mt-1 font-mono text-sm"
                    style={{ color: termAccent }}
                    aria-hidden
                  >
                    $
                  </span>

                  <div className="min-w-0 flex-1">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      className="w-full resize-none bg-transparent font-mono text-[13px] outline-none sm:text-sm"
                      style={{ color: "var(--text)" }}
                      placeholder="help • search type:project react • show project 1  (Shift+Enter = newline)"
                      aria-label="Terminal input"
                      rows={1}
                    />
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <div className="text-[11px]" style={{ color: "var(--muted2)" }}>
                        Enter to run • Shift+Enter newline • Tab autocomplete • Ctrl+L clear
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: "var(--muted2)" }}>
                        <span style={{ color: termAccent }}>●</span> ready
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <div
                      className="h-4 w-[10px] rounded-sm"
                      aria-hidden
                      style={{
                        background: cursorOn ? termAccent : "transparent",
                        opacity: 0.8,
                        transition: "opacity 120ms",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* resize handle */}
              {!maximized ? (
                <div
                  className="absolute bottom-2 right-2 h-6 w-6 cursor-nwse-resize rounded-lg border"
                  style={{
                    borderColor: "color-mix(in oklab, var(--border) 60%, transparent)" as any,
                    background: "rgba(0,0,0,0.12)",
                  }}
                  onPointerDown={startResize}
                  aria-label="Resize terminal"
                  title="Resize"
                />
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
README SNIPPET (copy into your README.md)

### Terminal: Adding new commands
Open `TerminalModal.tsx` and find `customCommands`.

Each command is:
{
  name: "list",
  description: "List items by type",
  run: (arg: string) => { ... }
}

- `name` is the command keyword
- `arg` is the raw argument string after the command
- call `push({ kind, title?, text, collapsible?, highlight? })` to print output

### Terminal: Search usage
Use `search` with multi-token fuzzy matching:
- `search react typescript`
- `search "deep learning" trust`
Filters:
- `type:project | type:research | type:blog`
- `tag:react`
- `date:2025`

### Terminal: Showing details
- `list project`
- `show project 1`
Outputs are JSON formatted and collapsible.

### Persistence
Terminal output is stored in `localStorage` under:
- `nahid_cli_v2_session`

Clear with:
- `session clear`
*/


