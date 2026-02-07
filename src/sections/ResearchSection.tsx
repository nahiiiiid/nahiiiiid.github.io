import React from "react";
import { Database, ExternalLink, FileText, FlaskConical, Github } from "lucide-react";
import { research as RESEARCH } from "../data/research";
import { Card, SectionShell, StatusPill } from "./shared";

export default function ResearchSection() {
  return (
    <SectionShell id="research" title="Research" icon={<FlaskConical className="h-4 w-4" />}>
      <div className="grid gap-4">
        {RESEARCH.map((r) => (
          <Card key={r.title} className="p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                  {r.title}
                </div>
                <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {r.domain}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusPill status={r.status} />
                <span className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
                  {r.status === "Published"
                    ? "peer-ready"
                    : r.status === "Submitted"
                      ? "under review"
                      : "in progress"}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: "var(--muted)" }}>
              {r.abstract}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {r.links?.paper ? (
                <a
                  href={r.links.paper}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                  style={{ borderColor: "var(--border)", background: "var(--panel2)", color: "var(--text)" }}
                >
                  <FileText className="h-4 w-4" style={{ color: "var(--accent)" }} /> Paper{" "}
                  <ExternalLink className="h-4 w-4 opacity-70" />
                </a>
              ) : null}

              {r.links?.code ? (
                <a
                  href={r.links.code}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                  style={{ borderColor: "var(--border)", background: "var(--panel2)", color: "var(--text)" }}
                >
                  <Github className="h-4 w-4" style={{ color: "var(--accent)" }} /> Code{" "}
                  <ExternalLink className="h-4 w-4 opacity-70" />
                </a>
              ) : null}

              {r.links?.dataset ? (
                <a
                  href={r.links.dataset}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                  style={{ borderColor: "var(--border)", background: "var(--panel2)", color: "var(--text)" }}
                >
                  <Database className="h-4 w-4" style={{ color: "var(--accent)" }} /> Dataset{" "}
                  <ExternalLink className="h-4 w-4 opacity-70" />
                </a>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
