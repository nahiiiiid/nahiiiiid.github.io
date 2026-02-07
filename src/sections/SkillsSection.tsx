import React from "react";
import { Layers } from "lucide-react";
import { SectionShell, Card } from "./shared";
import { skillCategories, concepts } from "../data/skills";


export default function SkillsSection() {
  return (
    <SectionShell id="skills" title="Skills" icon={<Layers className="h-4 w-4" />}>
      <div className="grid gap-6">
        <Card className="p-6">
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
                  />
                  <th
                    className="text-left text-xs font-semibold"
                    style={{
                      color: "var(--muted2)",
                      borderBottom: "1px solid var(--border)",
                      padding: "12px 12px",
                    }}
                  />
                </tr>
              </thead>

              <tbody>
                {skillCategories.map((cat) => (
                  <tr key={cat.title} className="align-top">
                    <td style={{ borderBottom: "1px solid var(--border)", padding: "14px 12px" }}>
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
                        <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                          {cat.title}
                        </div>
                      </div>
                    </td>

                    <td style={{ borderBottom: "1px solid var(--border)", padding: "14px 12px" }}>
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
                            title={s.level ? `${s.name} • ${s.level}` : s.name}
                          >
                            <span className="opacity-80 group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                              {s.icon}
                            </span>
                            <span className="truncate">{s.name}</span>
                            {s.level ? (
                              <span className="ml-1 hidden text-xs sm:inline" style={{ color: "var(--muted2)" }}>
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

        <Card className="p-6">
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
                  />
                  <th
                    className="text-left text-xs font-semibold"
                    style={{
                      color: "var(--muted2)",
                      borderBottom: "1px solid var(--border)",
                      padding: "12px 12px",
                    }}
                  />
                </tr>
              </thead>

              <tbody>
                {concepts.map((c) => (
                  <tr key={c.name} className="align-top">
                    <td style={{ borderBottom: "1px solid var(--border)", padding: "14px 12px" }}>
                      <div
                        className="group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-95"
                        style={{
                          borderColor: "var(--border)",
                          background: "var(--panel2)",
                          color: "var(--text)",
                        }}
                      >
                        {c.icon ? (
                          <span className="opacity-80 group-hover:opacity-100" style={{ color: "var(--accent)" }}>
                            {c.icon}
                          </span>
                        ) : null}
                        <span className="truncate">{c.name}</span>
                      </div>
                    </td>

                    <td style={{ borderBottom: "1px solid var(--border)", padding: "14px 12px" }}>
                      <div
                        className="rounded-xl border px-3 py-2 text-sm transition hover:opacity-95"
                        style={{
                          borderColor: "var(--border)",
                          background: "var(--panel2)",
                          color: "var(--text)",
                        }}
                      >
                        <span style={{ color: "var(--muted)" }}>{c.description}</span>
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
  );
}
