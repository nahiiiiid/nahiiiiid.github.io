import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github, Terminal } from "lucide-react";
import { profile } from "../data/profile";
import { scrollToSection } from "./shared";

import {CONTAINER, cx } from "./shared"; // ✅ added CONTAINER + cx

export default function HomeSection({
  setTerminalOpen,
}: {
  setTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section id="home" className="scroll-mt-24">
      {/* <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"> */}
       <div className={cx(CONTAINER, "py-16 sm:py-20")}>
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
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
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

            <div className="mt-8 flex flex-wrap gap-3">
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
                <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
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
        </div>
      </div>
    </section>
  );
}
