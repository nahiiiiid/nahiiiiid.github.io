import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { profile } from "../data/profile";
import { scrollToSection, CONTAINER, cx } from "./shared"; // ✅ added CONTAINER + cx

export default function FooterSection() {
  return (
    <footer className="border-t py-10" style={{ borderColor: "var(--border)" }}>
      {/* <div className="mx-auto max-w-6xl px-4 sm:px-6"> */}
       <div className={cx(CONTAINER, "py-16 sm:py-20")}>
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
            <Github className="h-4 w-4" style={{ color: "var(--accent)" }} /> GitHub{" "}
            <ExternalLink className="h-4 w-4 opacity-70" />
          </a>
        </div>
      </div>
    </footer>
  );
}
