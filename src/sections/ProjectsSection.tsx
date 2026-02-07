import React, { useMemo, useState } from "react";
import { ExternalLink, FileText, Github } from "lucide-react";
import type { Project } from "../types";
import { projects as PROJECTS } from "../data/projects";
import { Badge, Card, SectionShell } from "./shared";

export default function ProjectsSection() {
  const [filter, setFilter] = useState<"All" | Project["type"]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === filter)),
    [filter],
  );

  return (
    <SectionShell id="projects" title="Projects" icon={<Github className="h-4 w-4" />}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["All", "Web", "AI/ML", "Systems", "Academic"] as const).map((t) => (
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
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <Card key={p.name} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                    {p.name}
                  </div>
                  <Badge>{p.type}</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
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
                <Github className="h-4 w-4" /> <ExternalLink className="h-4 w-4 opacity-70" />
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
              <div className="flex items-center gap-2 font-medium" style={{ color: "var(--text)" }}>
                <FileText className="h-4 w-4" style={{ color: "var(--accent)" }} /> Insights
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Clarity-first architecture and predictable data flow.</li>
                <li>Performance-aware UI: minimal overhead, clean boundaries.</li>
                <li>Structured for extension: components + utilities + patterns.</li>
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
