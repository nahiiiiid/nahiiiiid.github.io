import React from "react";
import { FileText } from "lucide-react";
import { experience as EXPERIENCE } from "../data/experience";
import { Badge, Card, SectionShell } from "./shared";

export default function ExperienceSection() {
  return (
    <SectionShell id="experience" title="Experience" icon={<FileText className="h-4 w-4" />}>
      <div className="grid gap-4">
        {EXPERIENCE.map((e) => (
          <Card key={`${e.role}-${e.company}-${e.duration}`} className="p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                  {e.role}
                </div>

                <div
                  className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
                  style={{ color: "var(--muted)" }}
                >
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
                    <span style={{ color: "var(--text)" }}>{e.company}</span>
                  )}

                  <span style={{ color: "var(--muted2)" }}>•</span>
                  <span className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
                    {e.duration}
                  </span>

                  {e.location ? (
                    <>
                      <span style={{ color: "var(--muted2)" }}>•</span>
                      <span className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
                        {e.location}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              {e.tech?.length ? (
                <div className="mt-3 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
                  {e.tech.slice(0, 6).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <ul
              className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              {e.bullets.slice(0, 3).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            {e.achievements?.length ? (
              <div
                className="mt-5 rounded-xl border p-4"
                style={{ borderColor: "var(--border)", background: "var(--panel2)" }}
              >
                <div className="text-xs font-mono" style={{ color: "var(--muted2)" }}>
                  achievements
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text)" }}>
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
  );
}
