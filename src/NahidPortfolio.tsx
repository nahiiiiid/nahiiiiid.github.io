import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Github,
  Mail,
  Sun,
  Moon,
  Terminal,
  ExternalLink,
  Smartphone,
  Facebook,
  Youtube,
  Cpu,
  Database,
  Layers,
  FileText,
  ArrowRight,
  GraduationCap,
  FlaskConical,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type {
  Project,
  ResearchEntry,
  Post,
  EduNode,
  Theme,
  SectionId,
  TerminalCommandDef,
} from "./types";

import { profile } from "./data/profile";
// import { skillCategories } from "./data/skills";
import { skillCategories, concepts } from "./data/skills";

import { projects as PROJECTS } from "./data/projects";
import { experience as EXPERIENCE } from "./data/experience";
import { education as EDUCATION } from "./data/education";
import { research as RESEARCH } from "./data/research";
import { blogPosts as BLOG } from "./data/blog";
import { terminalCommands } from "./data/terminalCommands";
import { applyTheme } from "./config/theme";
import profileImg from "./assets/profile.jpeg";

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "research", label: "Research" },
  { id: "blog", label: "Blog" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("nahid_theme_v3")
        : null;
    const initial = (stored as Theme | null) ?? "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem("nahid_theme_v3", theme);
    } catch {}
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "aura" : "dark")),
  };
}

function useActiveSection(sectionIds: readonly SectionId[]) {
  const [active, setActive] = useState<SectionId>("home");
  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          );
        if (visible[0]?.target?.id)
          setActive(visible[0].target.id as SectionId);
      },
      {
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
        rootMargin: "-15% 0px -55% 0px",
      },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds]);
  return active;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{
        borderColor: "var(--border)",
        background: "var(--panel2)",
        color: "var(--text)",
      }}
    >
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: ResearchEntry["status"] }) {
  const map: Record<ResearchEntry["status"], React.CSSProperties> = {
    Ongoing: {
      borderColor: "var(--border)",
      background: "var(--panel2)",
      color: "var(--text)",
    },
    Submitted: {
      borderColor: "var(--accent2)",
      background: "var(--panel2)",
      color: "var(--text)",
    },
    Published: {
      borderColor: "var(--accent)",
      background: "var(--panel2)",
      color: "var(--text)",
    },
  };
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
      style={map[status]}
    >
      {status}
    </span>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-5 backdrop-blur transition-all duration-300 hover:opacity-95",
        className,
      )}
      style={{
        borderColor: "var(--border)",
        background: "var(--panel)",
        boxShadow: "var(--shadow)",
      }}
    >
      {children}
    </div>
  );
}

function SectionShell({
  id,
  title,
  subtitle,
  icon,
  children,
}: {
  id: SectionId;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-9 w-9 place-items-center rounded-2xl border"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel2)",
                color: "var(--accent)",
              }}
            >
              {icon ?? <Cpu className="h-4 w-4" />}
            </div>
            <h2
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ color: "var(--text)" }}
            >
              {title}
            </h2>
          </div>
          {subtitle ? (
            <p
              className="mt-2 max-w-3xl text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              {subtitle}
            </p>
          ) : null}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function EducationTree({ nodes, theme }: { nodes: EduNode[]; theme: Theme }) {
  const ordered = [...nodes].sort((a, b) => a.order - b.order);
  const glow =
    theme === "dark"
      ? "0 0 0 1px rgba(34,211,238,0.25),0 18px 60px -40px rgba(34,211,238,0.65)"
      : "0 0 0 1px rgba(2,132,199,0.18),0 18px 60px -40px rgba(2,132,199,0.25)";

  return (
    <div className="relative">
      <div
        className="absolute left-[18px] top-2 bottom-2 w-px"
        style={{ background: "var(--border)" }}
      />
      <div className="space-y-6">
        {ordered.map((n) => (
          <motion.div
            key={n.order}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.35 }}
            className="relative pl-14"
          >
            <motion.div
              aria-hidden
              className="absolute left-[18px] top-8 h-[1px] w-8"
              style={{ background: "var(--border)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
            <div
              className="absolute left-[10px] top-6 grid h-4 w-4 place-items-center rounded-full border"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel2)",
                boxShadow: glow,
              }}
            >
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            </div>
            <Card className="p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div
                  className="text-base font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {n.degree}
                </div>
                <div
                  className="font-mono text-xs"
                  style={{ color: "var(--muted2)" }}
                >
                  {n.duration}
                </div>
              </div>
              <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {n.institution}
              </div>
              <div
                className="mt-3 rounded-xl border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--panel2)",
                  color: "var(--text)",
                }}
              >
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--muted2)" }}
                >
                  focus:
                </span>{" "}
                {n.focus}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TerminalModal({
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
  const [lines, setLines] = useState<
    Array<{ kind: "out" | "cmd"; text: string }>
  >([{ kind: "out", text: "Nahid CLI — type `help` to list commands." }]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const pushLine = (kind: "out" | "cmd", text: string) =>
    setLines((prev) => [...prev, { kind, text }]);

  const doSearch = (q: string) => {
    const needle = q.toLowerCase();
    const hits: string[] = [];
    projects.forEach((p) => {
      if (
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.stack.join(" ").toLowerCase().includes(needle)
      )
        hits.push(`project: ${p.name}`);
    });
    research.forEach((r) => {
      if (
        r.title.toLowerCase().includes(needle) ||
        r.domain.toLowerCase().includes(needle) ||
        r.abstract.toLowerCase().includes(needle)
      )
        hits.push(`research: ${r.title}`);
    });
    posts.forEach((b) => {
      if (
        b.title.toLowerCase().includes(needle) ||
        b.excerpt.toLowerCase().includes(needle)
      )
        hits.push(`blog: ${b.title}`);
    });

    if (hits.length === 0) pushLine("out", "No matches.");
    else {
      pushLine("out", `Matches (${hits.length}):`);
      hits.slice(0, 12).forEach((h) => pushLine("out", `- ${h}`));
      if (hits.length > 12) pushLine("out", `…and ${hits.length - 12} more`);
    }
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    pushLine("cmd", cmd);

    const [headRaw, ...rest] = cmd.split(" ");
    const head = headRaw.toLowerCase();
    const arg = rest.join(" ").trim();
    const def = commands.find((c) => c.name.toLowerCase() === head);

    if (!def) {
      pushLine("out", `Unknown command: ${head}. Type \`help\`.`);
      return;
    }

    if (def.kind === "help") {
      pushLine("out", "Commands:");
      commands.forEach((c) =>
        pushLine("out", `- ${c.name} → ${c.description}`),
      );
      return;
    }
    if (def.kind === "clear") {
      setLines([{ kind: "out", text: "Cleared." }]);
      return;
    }
    if (def.kind === "close") {
      onClose();
      return;
    }
    if (def.kind === "navigate") {
      pushLine("out", `→ navigating to ${def.section}`);
      onClose();
      setTimeout(() => scrollToSection(def.section), 80);
      return;
    }
    if (def.kind === "search") {
      if (!arg) pushLine("out", "Usage: search <keyword>");
      else doSearch(arg);
      return;
    }
    if (def.kind === "open") {
      if (!arg) {
        pushLine("out", "Usage: open <target>");
        def.targets.forEach((t) => pushLine("out", `- ${t.key} (${t.label})`));
        return;
      }
      const t = def.targets.find(
        (x) => x.key.toLowerCase() === arg.toLowerCase(),
      );
      if (!t) {
        pushLine("out", `Unknown target: ${arg}`);
        def.targets.forEach((x) => pushLine("out", `- ${x.key} (${x.label})`));
        return;
      }
      pushLine("out", `Opening ${t.label}…`);
      window.open(t.url, "_blank", "noreferrer");
      return;
    }
  };

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center px-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border"
            style={{
              borderColor: "var(--border)",
              background: "var(--panel)",
              boxShadow: "var(--glow)",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <Terminal
                  className="h-4 w-4"
                  style={{ color: "var(--accent)" }}
                />
                <div
                  className="font-mono text-sm"
                  style={{ color: "var(--text)" }}
                >
                  command mode
                </div>
                <span
                  className="ml-2 rounded-full border px-2 py-0.5 text-[10px] font-mono"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  Ctrl+K
                </span>
              </div>
              <button
                className="rounded-xl border p-2 transition hover:opacity-90"
                onClick={onClose}
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  background: "var(--panel2)",
                }}
                aria-label="Close terminal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div
                ref={scrollRef}
                className="h-72 overflow-auto rounded-xl border p-3 font-mono text-sm leading-relaxed"
                style={{
                  borderColor: "var(--border)",
                  background:
                    theme === "dark"
                      ? "rgba(0,0,0,0.25)"
                      : "rgba(255,255,255,0.55)",
                  color: "var(--text)",
                }}
              >
                {lines.map((l, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {l.kind === "cmd" ? (
                      <span>
                        <span style={{ color: "var(--accent)" }}>$</span>{" "}
                        {l.text}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text)" }}>{l.text}</span>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="mt-3 flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--panel2)",
                }}
              >
                <span
                  className="font-mono text-sm"
                  style={{ color: "var(--accent)" }}
                >
                  $
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = input;
                      setInput("");
                      run(v);
                    } else if (e.key === "Escape") onClose();
                  }}
                  className="w-full bg-transparent font-mono text-sm outline-none"
                  style={{ color: "var(--text)" }}
                  placeholder="help • search trust • open github"
                  aria-label="Terminal input"
                />
              </div>

              <div className="mt-3 text-xs" style={{ color: "var(--muted2)" }}>
                Tip: Ctrl+K toggles terminal • ESC closes
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function NahidPortfolio() {
  const { theme, toggle } = useTheme();
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ctrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (ctrlK) {
        e.preventDefault();
        setTerminalOpen((v) => !v);
      }
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [filter, setFilter] = useState<"All" | Project["type"]>("All");
  const filtered = useMemo(
    () =>
      filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === filter),
    [filter],
  );

  return (
    <div className="min-h-screen antialiased" style={{ color: "var(--text)" }}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(60% 55% at 50% 18%, rgba(0,0,0,1), rgba(0,0,0,0.25), transparent)",
        }}
      />

      <header
        className="fixed top-0 z-50 w-full border-b backdrop-blur"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in oklab, var(--bg) 70%, transparent)" as any,
        }}
      >
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
          aria-label="Primary"
        >
          <button
            onClick={() => scrollToSection("home")}
            className="group inline-flex items-center gap-2 font-mono text-sm tracking-[0.12em]"
            style={{ color: "var(--text)" }}
            aria-label="Go to home"
          >
            <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
            <span className="relative">
              {profile.handle}
              <span
                className="absolute -bottom-1 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: "var(--accent)" }}
              />
            </span>
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="rounded-xl px-3 py-2 text-sm transition-colors"
                  style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {s.label}
                </button>
              );
            })}

            <button
              onClick={() => setTerminalOpen(true)}
              className="ml-1 rounded-xl border p-2 transition hover:opacity-90"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel2)",
                color: "var(--text)",
              }}
              aria-label="Open terminal (Ctrl+K)"
              title="Terminal (Ctrl+K)"
            >
              <Terminal
                className="h-4 w-4"
                style={{ color: "var(--accent)" }}
              />
            </button>

            <button
              onClick={toggle}
              className="ml-2 rounded-xl border p-2 transition hover:opacity-90"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel2)",
                color: "var(--text)",
              }}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Aura" : "Switch to Dark"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setTerminalOpen(true)}
              className="rounded-xl border p-2"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel2)",
              }}
              aria-label="Open terminal"
            >
              <Terminal
                className="h-4 w-4"
                style={{ color: "var(--accent)" }}
              />
            </button>
            <button
              onClick={toggle}
              className="rounded-xl border p-2"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel2)",
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel2)",
                color: "var(--text)",
              }}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              Menu
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="border-t backdrop-blur sm:hidden"
              style={{
                borderColor: "var(--border)",
                background: "var(--panel)",
              }}
            >
              <div className="mx-auto max-w-6xl px-4 py-3">
                <div className="grid grid-cols-2 gap-2">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        scrollToSection(s.id);
                        setMenuOpen(false);
                      }}
                      className="rounded-xl border px-3 py-3 text-left text-sm"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel2)",
                        color:
                          active === s.id ? "var(--accent)" : "var(--text)",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <TerminalModal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        theme={theme}
        commands={terminalCommands}
        projects={PROJECTS}
        posts={BLOG}
        research={RESEARCH}
      />

      <main className="pt-16">
        <section id="home" className="scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="lg:col-span-7"
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--panel2)",
                    color: "var(--text)",
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                </div>

                <h1
                  className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl"
                  style={{ color: "var(--text)" }}
                >
                  {profile.headline}
                </h1>

                <p
                  className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg"
                  style={{ color: "var(--muted)" }}
                >
                  {profile.subtext}
                </p>

                {/* <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="group inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition"
                    style={{
                      borderColor:
                        "color-mix(in oklab, var(--accent) 22%, transparent)" as any,
                      background:
                        "color-mix(in oklab, var(--accent) 14%, transparent)" as any,
                      color: "var(--text)",
                    }}
                  >
                    View Projects{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-90"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                      color: "var(--text)",
                    }}
                  >
                    <Github className="h-4 w-4" /> GitHub Profile{" "}
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>

                  <button
                    onClick={() => setTerminalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-90"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                      color: "var(--text)",
                    }}
                  >
                    <Terminal
                      className="h-4 w-4"
                      style={{ color: "var(--accent)" }}
                    />{" "}
                    Command Mode
                    <span
                      className="ml-1 font-mono text-xs"
                      style={{ color: "var(--muted2)" }}
                    >
                      (Ctrl+K)
                    </span>
                  </button>
                </div> */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {/* PRIMARY: Command Mode */}
                  <button
                    onClick={() => setTerminalOpen(true)}
                    className="group inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in oklab, var(--accent) 34%, transparent), color-mix(in oklab, var(--accent2) 18%, transparent))" as any,
                      border:
                        "1px solid color-mix(in oklab, var(--accent) 40%, transparent)" as any,
                      boxShadow: "var(--glow)",
                      color: "var(--text)",
                    }}
                  >
                    <Terminal
                      className="h-4 w-4"
                      style={{ color: "var(--accent)" }}
                    />
                    Command Mode
                    <span
                      className="ml-1 rounded-lg px-2 py-0.5 font-mono text-[11px]"
                      style={{
                        background:
                          "color-mix(in oklab, var(--accent) 16%, transparent)" as any,
                        border:
                          "1px solid color-mix(in oklab, var(--accent) 22%, transparent)" as any,
                        color: "var(--muted2)",
                      }}
                    >
                      Ctrl+K
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  {/* SECONDARY: View Projects */}
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="group inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                      color: "var(--text)",
                      boxShadow: "var(--shadow)",
                    }}
                  >
                    View Projects
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  {/* SECONDARY: GitHub Profile */}
                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                      color: "var(--text)",
                      boxShadow: "var(--shadow)",
                    }}
                  >
                    <Github className="h-4 w-4" /> GitHub Profile
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                </div>
              </motion.div>

              {/* <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
                className="lg:col-span-5"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--muted2)" }}
                      >
                        system status
                      </div>
                      <div
                        className="mt-1 text-sm font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        portfolio interface online
                      </div>
                    </div>
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: "rgba(52,211,153,0.85)",
                        boxShadow: "0 0 0 3px rgba(52,211,153,0.15)",
                      }}
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    <div
                      className="flex items-start justify-between gap-3 border-t pt-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div style={{ color: "var(--muted2)" }}>mode</div>
                      <div
                        className="text-right font-mono"
                        style={{ color: "var(--text)" }}
                      >
                        {theme}
                      </div>
                    </div>
                    <div
                      className="flex items-start justify-between gap-3 border-t pt-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div style={{ color: "var(--muted2)" }}>location</div>
                      <div
                        className="text-right font-mono"
                        style={{ color: "var(--text)" }}
                      >
                        {profile.location}
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-6 rounded-xl border p-4"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      <Cpu
                        className="h-4 w-4"
                        style={{ color: "var(--accent)" }}
                      />
                      current stack
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.stack.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div> */}
            </div>
          </div>
        </section>
        <SectionShell
          id="about"
          title="About"
          icon={<FileText className="h-4 w-4" />}
          // subtitle="Simple"
        >
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Card className="p-0 overflow-hidden">
                {/* <div className="relative aspect-[4/5] bg-gradient-to-b from-black/10 to-black/0">
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className="rounded-2xl border px-4 py-3 text-center"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel2)",
                      }}
                    >
                      <div
                        className="text-xs"
                        style={{ color: "var(--muted2)" }}
                      >
                        Profile image
                      </div>
                      <div
                        className="mt-1 font-mono text-sm"
                        style={{ color: "var(--text)" }}
                      >
                        Replace with your photo
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={profileImg}
                    alt={`${profile.name} profile`}
                    className="h-full w-full object-cover"
                  />

                  {/* subtle overlay for lab/engineering look */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.45))",
                    }}
                  />
                </div>
              </Card>
            </div>

            <div className="lg:col-span-8">
              <Card className="p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted2)" }}>
                      {/* Name */}
                    </div>
                    <div
                      className="mt-1 text-2xl font-semibold tracking-tight"
                      style={{ color: "var(--text)" }}
                    >
                      {profile.name}
                    </div>
                    <div
                      className="mt-2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {profile.designation}
                    </div>
                  </div>
                  {/* <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
                    {profile.badges.map((b) => (
                      <Badge key={b}>{b}</Badge>
                    ))}
                  </div> */}
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-5">
                  {[
                    {
                      label: "Gmail",
                      href: profile.contact.email,
                      icon: <Mail className="h-4 w-4" />,
                      ext: false,
                    },
                    {
                      label: "WhatsApp",
                      href: profile.contact.whatsapp,
                      icon: <Smartphone className="h-4 w-4" />,
                      ext: true,
                    },
                    {
                      label: "Facebook",
                      href: profile.social.facebook,
                      icon: <Facebook className="h-4 w-4" />,
                      ext: true,
                    },
                    {
                      label: "YouTube",
                      href: profile.social.youtube,
                      icon: <Youtube className="h-4 w-4" />,
                      ext: true,
                    },
                    {
                      label: "GitHub",
                      href: profile.social.github,
                      icon: <Github className="h-4 w-4" />,
                      ext: true,
                    },
                  ].map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.ext ? "_blank" : undefined}
                      rel={c.ext ? "noreferrer" : undefined}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel2)",
                        color: "var(--text)",
                      }}
                    >
                      <span style={{ color: "var(--accent)" }}>{c.icon}</span>{" "}
                      {c.label}
                    </a>
                  ))}
                </div>

                <div
                  className="mt-6 space-y-4 text-sm leading-relaxed sm:text-base"
                  style={{ color: "var(--muted)" }}
                >
                  {profile.aboutNarrative.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </SectionShell>
        {/* <SectionShell
          id="skills"
          title="Skills"
          icon={<Layers className="h-4 w-4" />}
          // subtitle="Focused stack. Clean categories. Production-oriented."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {skillCategories.map((cat) => (
              <Card key={cat.title} className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-2xl border"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                      color: "var(--accent)",
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {cat.title}
                    </div>
                    <div
                      className="mt-1 text-xs"
                      style={{ color: "var(--muted2)" }}
                    >
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {cat.items.map((s) => (
                    <div
                      key={s.name}
                      className="group flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-95"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel2)",
                        color: "var(--text)",
                      }}
                    >
                      <span
                        className="opacity-80 group-hover:opacity-100"
                        style={{ color: "var(--accent)" }}
                      >
                        {s.icon}
                      </span>
                      <span className="truncate">{s.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </SectionShell> */}

        <SectionShell
          id="skills"
          title="Skills"
          icon={<Layers className="h-4 w-4" />}
        >
          <div className="grid gap-6">
            {/* Table 1: Skill Categories */}
            <Card className="p-6">
              <div className="mb-4">
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Skill Categories
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--muted2)" }}
                >
                  Categorized stack — same items, cleaner layout.
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th
                        className="text-left text-xs font-semibold"
                        style={{
                          color: "var(--muted2)",
                          borderBottom: "1px solid var(--border)",
                          padding: "12px 12px",
                          width: "260px",
                        }}
                      >
                        Category
                      </th>
                      <th
                        className="text-left text-xs font-semibold"
                        style={{
                          color: "var(--muted2)",
                          borderBottom: "1px solid var(--border)",
                          padding: "12px 12px",
                        }}
                      >
                        Skills
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {skillCategories.map((cat) => (
                      <tr key={cat.title} className="align-top">
                        {/* Column 1: Category */}
                        <td
                          style={{
                            borderBottom: "1px solid var(--border)",
                            padding: "14px 12px",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="grid h-10 w-10 place-items-center rounded-2xl border"
                              style={{
                                borderColor: "var(--border)",
                                background: "var(--panel2)",
                                color: "var(--accent)",
                              }}
                            >
                              {cat.icon}
                            </div>
                            <div>
                              <div
                                className="text-sm font-semibold"
                                style={{ color: "var(--text)" }}
                              >
                                {cat.title}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Skills (same pill style as before) */}
                        <td
                          style={{
                            borderBottom: "1px solid var(--border)",
                            padding: "14px 12px",
                          }}
                        >
                          <div className="flex flex-wrap gap-2">
                            {cat.items.map((s) => (
                              <div
                                key={`${cat.title}-${s.name}`}
                                className="group flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-95"
                                style={{
                                  borderColor: "var(--border)",
                                  background: "var(--panel2)",
                                  color: "var(--text)",
                                }}
                                title={
                                  s.level ? `${s.name} • ${s.level}` : s.name
                                }
                              >
                                <span
                                  className="opacity-80 group-hover:opacity-100"
                                  style={{ color: "var(--accent)" }}
                                >
                                  {s.icon}
                                </span>
                                <span className="truncate">{s.name}</span>
                                {s.level ? (
                                  <span
                                    className="ml-1 hidden text-xs sm:inline"
                                    style={{ color: "var(--muted2)" }}
                                  >
                                    {s.level}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Table 2: Concepts / Knowledge */}
            <Card className="p-6">
              <div className="mb-4">
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Concepts / Knowledge
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--muted2)" }}
                >
                  What I work with and how I apply it.
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th
                        className="text-left text-xs font-semibold"
                        style={{
                          color: "var(--muted2)",
                          borderBottom: "1px solid var(--border)",
                          padding: "12px 12px",
                          width: "260px",
                        }}
                      >
                        Concept
                      </th>
                      <th
                        className="text-left text-xs font-semibold"
                        style={{
                          color: "var(--muted2)",
                          borderBottom: "1px solid var(--border)",
                          padding: "12px 12px",
                        }}
                      >
                        Usage
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {concepts.map((c) => (
                      <tr key={c.name} className="align-top">
                        <td
                          style={{
                            borderBottom: "1px solid var(--border)",
                            padding: "14px 12px",
                          }}
                        >
                          <div
                            className="group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-95"
                            style={{
                              borderColor: "var(--border)",
                              background: "var(--panel2)",
                              color: "var(--text)",
                            }}
                          >
                            {c.icon ? (
                              <span
                                className="opacity-80 group-hover:opacity-100"
                                style={{ color: "var(--accent)" }}
                              >
                                {c.icon}
                              </span>
                            ) : null}
                            <span className="truncate">{c.name}</span>
                          </div>
                        </td>

                        <td
                          style={{
                            borderBottom: "1px solid var(--border)",
                            padding: "14px 12px",
                          }}
                        >
                          <div
                            className="rounded-xl border px-3 py-2 text-sm transition hover:opacity-95"
                            style={{
                              borderColor: "var(--border)",
                              background: "var(--panel2)",
                              color: "var(--text)",
                            }}
                          >
                            <span style={{ color: "var(--text)" }}>
                              {c.description}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </SectionShell>
        {/* <SectionShell
          id="projects"
          title="Projects"
          icon={<Github className="h-4 w-4" />}
          subtitle="Repository-style cards: crisp description, clear stack, engineer-readable."
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <Github className="h-4 w-4" /> <span>GitHub-inspired layout</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Web", "AI/ML", "Systems", "Academic"] as const).map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t as any)}
                    className="rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                    style={{
                      borderColor:
                        filter === t
                          ? ("color-mix(in oklab, var(--accent) 30%, transparent)" as any)
                          : "var(--border)",
                      background:
                        filter === t
                          ? ("color-mix(in oklab, var(--accent) 14%, transparent)" as any)
                          : "var(--panel2)",
                      color: filter === t ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <Card key={p.name} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="text-lg font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {p.name}
                      </div>
                      <Badge>{p.type}</Badge>
                    </div>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {p.description}
                    </p>
                  </div>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                      color: "var(--text)",
                    }}
                    aria-label={`Open ${p.name} repository`}
                  >
                    <Github className="h-4 w-4" />{" "}
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </SectionShell> */}
        <SectionShell
          id="projects"
          title="Projects"
          icon={<Github className="h-4 w-4" />}
          // subtitle="Repository-style cards: crisp description, clear stack, engineer-readable."
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              {/* <Github className="h-4 w-4" /> <span>GitHub-inspired layout</span> */}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Web", "AI/ML", "Systems", "Academic"] as const).map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t as any)}
                    className="rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                    style={{
                      borderColor:
                        filter === t
                          ? ("color-mix(in oklab, var(--accent) 30%, transparent)" as any)
                          : "var(--border)",
                      background:
                        filter === t
                          ? ("color-mix(in oklab, var(--accent) 14%, transparent)" as any)
                          : "var(--panel2)",
                      color: filter === t ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <Card key={p.name} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="text-lg font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {p.name}
                      </div>
                      <Badge>{p.type}</Badge>
                    </div>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {p.description}
                    </p>
                  </div>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                      color: "var(--text)",
                    }}
                    aria-label={`Open ${p.name} repository`}
                  >
                    <Github className="h-4 w-4" />{" "}
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <div
                  className="mt-5 rounded-xl border p-4 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--panel2)",
                    color: "var(--muted)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    <FileText
                      className="h-4 w-4"
                      style={{ color: "var(--accent)" }}
                    />{" "}
                    Engineer notes
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      Clarity-first architecture and predictable data flow.
                    </li>
                    <li>
                      Performance-aware UI: minimal overhead, clean boundaries.
                    </li>
                    <li>
                      Structured for extension: components + utilities +
                      patterns.
                    </li>
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </SectionShell>
        <SectionShell
          id="experience"
          title="Experience"
          icon={<FileText className="h-4 w-4" />}
          // subtitle="LinkedIn-style timeline: role-first, company context inline, bullets below."
        >
          <div className="grid gap-4">
            {EXPERIENCE.map((e) => (
              <Card
                key={`${e.role}-${e.company}-${e.duration}`}
                className="p-6"
              >
                {/* Header row */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {e.role}
                    </div>

                    <div
                      className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {/* Company (link optional) */}
                      {e.companyUrl ? (
                        <a
                          href={e.companyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md px-1 py-0.5 transition hover:opacity-95"
                          style={{
                            color: "var(--text)",
                            background:
                              "color-mix(in oklab, var(--accent) 10%, transparent)" as any,
                            border:
                              "1px solid color-mix(in oklab, var(--accent) 22%, transparent)" as any,
                          }}
                        >
                          {e.company}
                        </a>
                      ) : (
                        <span style={{ color: "var(--text)" }}>
                          {e.company}
                        </span>
                      )}

                      <span style={{ color: "var(--muted2)" }}>•</span>
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--muted2)" }}
                      >
                        {e.duration}
                      </span>

                      {e.location ? (
                        <>
                          <span style={{ color: "var(--muted2)" }}>•</span>
                          <span
                            className="font-mono text-xs"
                            style={{ color: "var(--muted2)" }}
                          >
                            {e.location}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Optional: small tag area on the right */}
                  {e.tech?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
                      {e.tech.slice(0, 6).map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Bullets */}
                <ul
                  className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed sm:text-base"
                  style={{ color: "var(--muted)" }}
                >
                  {e.bullets.slice(0, 3).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                {/* Optional achievements */}
                {e.achievements?.length ? (
                  <div
                    className="mt-5 rounded-xl border p-4"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel2)",
                    }}
                  >
                    <div
                      className="text-xs font-mono"
                      style={{ color: "var(--muted2)" }}
                    >
                      achievements
                    </div>
                    <ul
                      className="mt-2 list-disc space-y-1 pl-5 text-sm"
                      style={{ color: "var(--text)" }}
                    >
                      {e.achievements.slice(0, 3).map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </SectionShell>
        <SectionShell
          id="education"
          title="Education"
          icon={<GraduationCap className="h-4 w-4" />}
          // subtitle="Execution-path timeline: linked progression like a dependency graph."
        >
          <EducationTree nodes={EDUCATION} theme={theme} />
        </SectionShell>
        <SectionShell
          id="research"
          title="Research"
          icon={<FlaskConical className="h-4 w-4" />}
          // subtitle="Academic system view: journal-style spacing, clear status, serious signal."
        >
          <div className="grid gap-4">
            {RESEARCH.map((r) => (
              <Card key={r.title} className="p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {r.title}
                    </div>
                    <div
                      className="mt-1 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {r.domain}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={r.status} />
                    <span
                      className="font-mono text-xs"
                      style={{ color: "var(--muted2)" }}
                    >
                      {r.status === "Published"
                        ? "peer-ready"
                        : r.status === "Submitted"
                          ? "under review"
                          : "in progress"}
                    </span>
                  </div>
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed sm:text-base"
                  style={{ color: "var(--muted)" }}
                >
                  {r.abstract}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.links?.paper ? (
                    <a
                      href={r.links.paper}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel2)",
                        color: "var(--text)",
                      }}
                    >
                      <FileText
                        className="h-4 w-4"
                        style={{ color: "var(--accent)" }}
                      />{" "}
                      Paper <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>
                  ) : null}
                  {r.links?.code ? (
                    <a
                      href={r.links.code}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel2)",
                        color: "var(--text)",
                      }}
                    >
                      <Github
                        className="h-4 w-4"
                        style={{ color: "var(--accent)" }}
                      />{" "}
                      Code <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>
                  ) : null}
                  {r.links?.dataset ? (
                    <a
                      href={r.links.dataset}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel2)",
                        color: "var(--text)",
                      }}
                    >
                      <Database
                        className="h-4 w-4"
                        style={{ color: "var(--accent)" }}
                      />{" "}
                      Dataset <ExternalLink className="h-4 w-4 opacity-70" />
                    </a>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </SectionShell>
        <SectionShell
          id="blog"
          title="Blog"
          icon={<FileText className="h-4 w-4" />}
          // subtitle="Minimal developer-blog style: short, technical, readable."
        >
          <div className="grid gap-4">
            {BLOG.map((post) => (
              <Card key={post.slug} className="p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    className="text-lg font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {post.title}
                  </div>
                  <div
                    className="font-mono text-xs"
                    style={{ color: "var(--muted2)" }}
                  >
                    {post.date}
                  </div>
                </div>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {post.excerpt}
                </p>
                <div className="mt-4">
                  <button
                    className="inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-90"
                    style={{ color: "var(--accent)" }}
                    onClick={() =>
                      alert(
                        "Hook this to a blog route (e.g., /blog/" +
                          post.slug +
                          ")",
                      )
                    }
                  >
                    Read <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </SectionShell>
        <footer
          className="border-t py-10"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Built by {profile.name}. Designed with engineering discipline.
              </div>
              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm transition hover:opacity-90"
                style={{ color: "var(--text)" }}
              >
                <Github
                  className="h-4 w-4"
                  style={{ color: "var(--accent)" }}
                />{" "}
                GitHub <ExternalLink className="h-4 w-4 opacity-70" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
