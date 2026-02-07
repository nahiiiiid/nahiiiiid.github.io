import React from "react";
import { motion } from "framer-motion";
import type { EduNode, Theme } from "../types";
import { Card } from "./shared";

export default function EducationTree({ nodes, theme }: { nodes: EduNode[]; theme: Theme }) {
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
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            </div>

            <Card className="p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-base font-semibold" style={{ color: "var(--text)" }}>
                  {n.degree}
                </div>
                <div className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
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
                <span className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
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
