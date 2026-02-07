// import React from "react";
// import { motion } from "framer-motion";
// import type { EduNode, ResearchEntry, SectionId, Theme } from "../types";
// import { Cpu } from "lucide-react";


// export function cx(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// export function scrollToSection(id: string) {
//   const el = document.getElementById(id);
//   if (!el) return;
//   el.scrollIntoView({ behavior: "smooth", block: "start" });
// }

// export function Badge({ children }: { children: React.ReactNode }) {
//   return (
//     <span
//       className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
//       style={{
//         borderColor: "var(--border)",
//         background: "var(--panel2)",
//         color: "var(--text)",
//       }}
//     >
//       {children}
//     </span>
//   );
// }

// export function StatusPill({ status }: { status: ResearchEntry["status"] }) {
//   const map: Record<ResearchEntry["status"], React.CSSProperties> = {
//     Ongoing: {
//       borderColor: "var(--border)",
//       background: "var(--panel2)",
//       color: "var(--text)",
//     },
//     Submitted: {
//       borderColor: "var(--accent2)",
//       background: "var(--panel2)",
//       color: "var(--text)",
//     },
//     Published: {
//       borderColor: "var(--accent)",
//       background: "var(--panel2)",
//       color: "var(--text)",
//     },
//   };
//   return (
//     <span
//       className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
//       style={map[status]}
//     >
//       {status}
//     </span>
//   );
// }

// export function Card({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div
//       className={cx(
//         "rounded-2xl border p-5 backdrop-blur transition-all duration-300 hover:opacity-95",
//         className,
//       )}
//       style={{
//         borderColor: "var(--border)",
//         background: "var(--panel)",
//         boxShadow: "var(--shadow)",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// export function SectionShell({
//   id,
//   title,
//   subtitle,
//   icon,
//   children,
// }: {
//   id: SectionId;
//   title: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <section id={id} className="scroll-mt-24 py-16 sm:py-20">
//       <div className="mx-auto max-w-6xl px-4 sm:px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.35 }}
//           transition={{ duration: 0.45, ease: "easeOut" }}
//           className="mb-8"
//         >
//           <div className="flex items-center gap-3">
//             <div
//               className="grid h-9 w-9 place-items-center rounded-2xl border"
//               style={{
//                 borderColor: "var(--border)",
//                 background: "var(--panel2)",
//                 color: "var(--accent)",
//               }}
//             >
//               {icon ?? <Cpu className="h-4 w-4" />}
//             </div>
//             <h2
//               className="text-2xl font-semibold tracking-tight sm:text-3xl"
//               style={{ color: "var(--text)" }}
//             >
//               {title}
//             </h2>
//           </div>

//           {subtitle ? (
//             <p
//               className="mt-2 max-w-3xl text-sm leading-relaxed sm:text-base"
//               style={{ color: "var(--muted)" }}
//             >
//               {subtitle}
//             </p>
//           ) : null}
//         </motion.div>

//         {children}
//       </div>
//     </section>
//   );
// }





import React from "react";
import { motion } from "framer-motion";
import type { EduNode, ResearchEntry, SectionId, Theme } from "../types";
import { Cpu } from "lucide-react";

/**
 * ✅ OPTION C: Single source of truth for website width (all sections)
 * Change only this value to increase/decrease width everywhere.
 *
 * Examples:
 * - "max-w-6xl" (current)
 * - "max-w-7xl"
 * - "max-w-screen-2xl"
 * - "max-w-[1400px]" (custom)
 */
export const CONTAINER =
  "mx-auto w-full max-w-[1500px] px-4 sm:px-6"; // ✅ increase width here anytime

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Badge({ children }: { children: React.ReactNode }) {
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

export function StatusPill({ status }: { status: ResearchEntry["status"] }) {
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

export function Card({
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

export function SectionShell({
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
      {/* ❌ OLD (kept for reference): this limits width to max-w-6xl */}
      {/* <div className="mx-auto max-w-6xl px-4 sm:px-6"> */}

      {/* ✅ NEW (Option C): use shared container width from CONTAINER */}
      <div className={CONTAINER}>
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
