import React, { useEffect, useState } from "react";

import type { SectionId, Theme } from "./types";
import { profile } from "./data/profile";
import { terminalCommands } from "./data/terminalCommands";
import { applyTheme } from "./config/theme";

import { projects as PROJECTS } from "./data/projects";
import { research as RESEARCH } from "./data/research";
import { blogPosts as BLOG } from "./data/blog";

import Header from "./sections/Header";
import TerminalModal from "./sections/TerminalModal";

import HomeSection from "./sections/HomeSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import ResearchSection from "./sections/ResearchSection";
import BlogSection from "./sections/BlogSection";
import FooterSection from "./sections/FooterSection";

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

function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("nahid_theme_v3") : null;
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
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) setActive(visible[0].target.id as SectionId);
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

      <Header
        theme={theme}
        toggle={toggle}
        active={active}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setTerminalOpen={setTerminalOpen}
        SECTIONS={SECTIONS}
      />

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
        <HomeSection setTerminalOpen={setTerminalOpen} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection theme={theme} />
        <ResearchSection />
        <BlogSection />
        <FooterSection />
      </main>
    </div>
  );
}
