// import React from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Moon, Sun, Terminal, X, Menu } from "lucide-react";

// import type { SectionId, Theme } from "../types";
// import { profile } from "../data/profile";
// import { scrollToSection, cx } from "./shared";

// export default function Header({
//   theme,
//   toggle,
//   active,
//   menuOpen,
//   setMenuOpen,
//   setTerminalOpen,
//   SECTIONS,
// }: {
//   theme: Theme;
//   toggle: () => void;
//   active: SectionId;
//   menuOpen: boolean;
//   setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   setTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   SECTIONS: Array<{ id: SectionId; label: string }>;
// }) {
//   return (
//     <header
//       className="fixed top-0 z-50 w-full border-b backdrop-blur"
//       style={{
//         borderColor: "var(--border)",
//         background: "color-mix(in oklab, var(--bg) 70%, transparent)" as any,
//       }}
//     >
//       <nav
//         className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
//         aria-label="Primary"
//       >
//         {/* Left: brand */}
//         <button
//           onClick={() => scrollToSection("home")}
//           className="group inline-flex items-center gap-2 font-mono text-sm tracking-[0.12em]"
//           style={{ color: "var(--text)" }}
//           aria-label="Go to home"
//         >
//           <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
//           <span className="relative">
//             {profile.handle}
//             <span
//               className="absolute -bottom-1 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
//               style={{ background: "var(--accent)" }}
//             />
//           </span>
//         </button>

//         {/* Right: desktop actions + hamburger */}
//         <div className="hidden items-center gap-2 sm:flex">
//           <button
//             onClick={() => setTerminalOpen(true)}
//             className="rounded-xl border p-2 transition hover:opacity-90"
//             style={{
//               borderColor: "var(--border)",
//               background: "var(--panel2)",
//               color: "var(--text)",
//             }}
//             aria-label="Open terminal (Ctrl+K)"
//             title="Terminal (Ctrl+K)"
//           >
//             <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
//           </button>

//           <button
//             onClick={toggle}
//             className="rounded-xl border p-2 transition hover:opacity-90"
//             style={{
//               borderColor: "var(--border)",
//               background: "var(--panel2)",
//               color: "var(--text)",
//             }}
//             aria-label="Toggle theme"
//             title={theme === "dark" ? "Switch to Aura" : "Switch to Dark"}
//           >
//             {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//           </button>

//           {/* Hamburger */}
//           <button
//             onClick={() => setMenuOpen((v) => !v)}
//             className={cx(
//               "rounded-xl border p-2 transition hover:opacity-90",
//               menuOpen && "opacity-95",
//             )}
//             style={{
//               borderColor: "var(--border)",
//               background: "var(--panel2)",
//               color: "var(--text)",
//             }}
//             aria-label="Toggle navigation menu"
//             aria-expanded={menuOpen}
//           >
//             {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//           </button>
//         </div>

//         {/* Mobile: keep your existing buttons (or switch to hamburger too) */}
//         <div className="flex items-center gap-2 sm:hidden">
//           <button
//             onClick={() => setTerminalOpen(true)}
//             className="rounded-xl border p-2"
//             style={{ borderColor: "var(--border)", background: "var(--panel2)" }}
//             aria-label="Open terminal"
//           >
//             <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
//           </button>

//           <button
//             onClick={toggle}
//             className="rounded-xl border p-2"
//             style={{ borderColor: "var(--border)", background: "var(--panel2)" }}
//             aria-label="Toggle theme"
//           >
//             {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//           </button>

//           <button
//             onClick={() => setMenuOpen((v) => !v)}
//             className="rounded-xl border p-2"
//             style={{ borderColor: "var(--border)", background: "var(--panel2)" }}
//             aria-label="Toggle navigation menu"
//             aria-expanded={menuOpen}
//           >
//             {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//           </button>
//         </div>
//       </nav>

//       {/* Dropdown panel (works for both desktop + mobile) */}
//       <AnimatePresence>
//         {menuOpen ? (
//           <motion.div
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.22 }}
//             className="border-t backdrop-blur"
//             style={{
//               borderColor: "var(--border)",
//               background: "var(--panel)",
//             }}
//           >
//             <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
//               <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
//                 {SECTIONS.map((s) => {
//                   const isActive = active === s.id;
//                   return (
//                     <button
//                       key={s.id}
//                       onClick={() => {
//                         scrollToSection(s.id);
//                         setMenuOpen(false);
//                       }}
//                       className="rounded-xl border px-3 py-3 text-left text-sm transition hover:opacity-90"
//                       style={{
//                         borderColor: isActive
//                           ? ("color-mix(in oklab, var(--accent) 30%, transparent)" as any)
//                           : "var(--border)",
//                         background: isActive
//                           ? ("color-mix(in oklab, var(--accent) 14%, transparent)" as any)
//                           : "var(--panel2)",
//                         color: isActive ? "var(--accent)" : "var(--text)",
//                       }}
//                       aria-current={isActive ? "page" : undefined}
//                     >
//                       {s.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </motion.div>
//         ) : null}
//       </AnimatePresence>
//     </header>
//   );
// }

























// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Moon,
//   Sun,
//   Terminal,
//   X,
//   Menu,
//   ChevronRight,
//   Home,
//   User,
//   Layers,
//   FolderGit2,
//   Briefcase,
//   GraduationCap,
//   FlaskConical,
//   FileText,
// } from "lucide-react";

// import type { SectionId, Theme } from "../types";
// import { profile } from "../data/profile";
// import { scrollToSection, cx } from "./shared";

// function usePrefersReducedMotion() {
//   const [reduced, setReduced] = useState(false);
//   useEffect(() => {
//     const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
//     if (!mq) return;
//     const onChange = () => setReduced(!!mq.matches);
//     onChange();
//     mq.addEventListener?.("change", onChange);
//     return () => mq.removeEventListener?.("change", onChange);
//   }, []);
//   return reduced;
// }

// const SECTION_ICONS: Partial<Record<SectionId, React.ReactNode>> = {
//   home: <Home className="h-4 w-4" />,
//   about: <User className="h-4 w-4" />,
//   skills: <Layers className="h-4 w-4" />,
//   projects: <FolderGit2 className="h-4 w-4" />,
//   experience: <Briefcase className="h-4 w-4" />,
//   education: <GraduationCap className="h-4 w-4" />,
//   research: <FlaskConical className="h-4 w-4" />,
//   blog: <FileText className="h-4 w-4" />,
// };

// export default function HeaderSection({
//   theme,
//   toggle,
//   active,
//   menuOpen,
//   setMenuOpen,
//   setTerminalOpen,
//   SECTIONS,
// }: {
//   theme: Theme;
//   toggle: () => void;
//   active: SectionId;
//   menuOpen: boolean;
//   setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   setTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   SECTIONS: Array<{ id: SectionId; label: string }>;
// }) {
//   const reducedMotion = usePrefersReducedMotion();
//   const panelRef = useRef<HTMLDivElement | null>(null);

//   const activeIndex = useMemo(
//     () => Math.max(0, SECTIONS.findIndex((s) => s.id === active)),
//     [SECTIONS, active],
//   );

//   // Scroll progress (top-to-bottom)
//   const [progress, setProgress] = useState(0); // 0..1
//   useEffect(() => {
//     const onScroll = () => {
//       const el = document.documentElement;
//       const scrollTop = el.scrollTop || document.body.scrollTop;
//       const scrollHeight = el.scrollHeight || document.body.scrollHeight;
//       const clientHeight = el.clientHeight || window.innerHeight;
//       const denom = Math.max(1, scrollHeight - clientHeight);
//       setProgress(Math.min(1, Math.max(0, scrollTop / denom)));
//     };
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll as any);
//       window.removeEventListener("resize", onScroll as any);
//     };
//   }, []);

//   // Close on ESC
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (!menuOpen) return;
//       if (e.key === "Escape") {
//         e.preventDefault();
//         setMenuOpen(false);
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [menuOpen, setMenuOpen]);

//   // Click outside panel to close (when open)
//   useEffect(() => {
//     if (!menuOpen) return;
//     const onDown = (e: MouseEvent) => {
//       const el = panelRef.current;
//       if (!el) return;
//       if (!el.contains(e.target as Node)) setMenuOpen(false);
//     };
//     window.addEventListener("mousedown", onDown);
//     return () => window.removeEventListener("mousedown", onDown);
//   }, [menuOpen, setMenuOpen]);

//   return (
//     <header className="fixed top-0 z-50 w-full">
//       {/* Narrow dash bar */}
//       <div
//         className="border-b backdrop-blur"
//         style={{
//           borderColor: "var(--border)",
//           background: "color-mix(in oklab, var(--bg) 74%, transparent)" as any,
//         }}
//       >
//         <nav
//           className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-6"
//           aria-label="Primary"
//           style={{ minHeight: 42 }}
//         >
//           {/* LEFT: only handle text (no icon, no dot) */}
//           <button
//             onClick={() => scrollToSection("home")}
//             className="font-mono text-sm tracking-[0.12em] transition hover:opacity-90"
//             style={{ color: "var(--text)" }}
//             aria-label="Go to home"
//           >
//             {profile.handle}
//           </button>

//           {/* MIDDLE: boxy active indicator + scroll progress (square corners) */}
//           <div className="hidden flex-1 items-center justify-center px-3 sm:flex">
//             <div
//               className="relative w-full max-w-[520px] border px-3 py-2"
//               style={{
//                 borderColor: "var(--border)",
//                 background: "color-mix(in oklab, var(--panel) 55%, transparent)" as any,
//               }}
//               aria-label="Active section and scroll progress"
//             >
//               {/* track */}
//               <div
//                 className="absolute left-0 right-0 top-0 h-[2px]"
//                 style={{ background: "color-mix(in oklab, var(--border) 70%, transparent)" as any }}
//                 aria-hidden
//               />
//               {/* progress fill (runs fully from 0% to 100%) */}
//               <motion.div
//                 aria-hidden
//                 className="absolute left-0 top-0 h-[2px]"
//                 initial={false}
//                 animate={reducedMotion ? { width: `${progress * 100}%` } : { width: `${progress * 100}%` }}
//                 transition={{ duration: 0.12, ease: "linear" }}
//                 style={{
//                   background: "var(--accent)",
//                   boxShadow: "0 0 12px rgba(34,211,238,0.45)",
//                 }}
//               />

//               <div className="flex items-center justify-between gap-3">
//                 <span
//                   className="font-mono text-[11px]"
//                   style={{ color: "var(--muted2)" }}
//                 >
//                   ACTIVE
//                 </span>

//                 <div
//                   className="border px-2 py-1 font-mono text-[11px]"
//                   style={{
//                     borderColor: "var(--border)",
//                     background: "var(--panel2)",
//                     color: "var(--text)",
//                   }}
//                   aria-label="Current section"
//                 >
//                   {SECTIONS.find((s) => s.id === active)?.label ?? "Home"}
//                 </div>

//                 <span
//                   className="font-mono text-[11px]"
//                   style={{ color: "var(--muted2)" }}
//                 >
//                   {Math.round(progress * 100)}%
//                 </span>
//               </div>

//               {/* section position marker (moves across based on active section index) */}
//               <motion.div
//                 aria-hidden
//                 className="absolute bottom-0 left-0 h-[2px]"
//                 initial={false}
//                 animate={{
//                   width: `${Math.max(8, 100 / Math.max(1, SECTIONS.length))}%`,
//                   x:
//                     SECTIONS.length > 1
//                       ? `${(activeIndex * 100) / SECTIONS.length}%`
//                       : "0%",
//                 }}
//                 transition={{ type: "spring", stiffness: 340, damping: 28 }}
//                 style={{
//                   background: "color-mix(in oklab, var(--accent2) 55%, transparent)" as any,
//                 }}
//               />
//             </div>
//           </div>

//           {/* RIGHT: controls */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setTerminalOpen(true)}
//               className="grid h-9 w-9 place-items-center border transition hover:opacity-90"
//               style={{
//                 borderColor: "var(--border)",
//                 background: "var(--panel2)",
//                 color: "var(--text)",
//               }}
//               aria-label="Open terminal (Ctrl+K)"
//               title="Terminal (Ctrl+K)"
//             >
//               <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
//             </button>

//             <button
//               onClick={toggle}
//               className="grid h-9 w-9 place-items-center border transition hover:opacity-90"
//               style={{
//                 borderColor: "var(--border)",
//                 background: "var(--panel2)",
//                 color: "var(--text)",
//               }}
//               aria-label="Toggle theme"
//               title={theme === "dark" ? "Switch to Aura" : "Switch to Dark"}
//             >
//               {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//             </button>

//             <button
//               onClick={() => setMenuOpen((v) => !v)}
//               className={cx(
//                 "grid h-9 w-9 place-items-center border transition hover:opacity-90",
//                 menuOpen && "opacity-95",
//               )}
//               style={{
//                 borderColor: menuOpen ? ("var(--accent)" as any) : "var(--border)",
//                 background: "var(--panel2)",
//                 color: "var(--text)",
//               }}
//               aria-label="Toggle navigation menu"
//               aria-expanded={menuOpen}
//             >
//               {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//             </button>
//           </div>
//         </nav>
//       </div>

//       {/* Expandable menu panel (no gradients) + icons per section */}
//       <AnimatePresence>
//         {menuOpen ? (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.99 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.99 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//             className="relative"
//             role="dialog"
//             aria-modal="true"
//             aria-label="Navigation menu"
//           >
//             {/* Backdrop */}
//             <motion.div
//               aria-hidden
//               className="fixed inset-0 z-[49]"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               style={{
//                 background: "rgba(0,0,0,0.35)",
//                 backdropFilter: "blur(4px)",
//               }}
//               onClick={() => setMenuOpen(false)}
//             />

//             <div className="relative z-[50]">
//               <div ref={panelRef} className="mx-auto max-w-6xl px-3 sm:px-6">
//                 <div
//                   className="mt-2 overflow-hidden border"
//                   style={{
//                     borderColor: "var(--border)",
//                     background: "var(--panel)",
//                     boxShadow: "var(--shadow)",
//                   }}
//                 >
//                   <div
//                     className="flex items-center justify-between border-b px-4 py-3"
//                     style={{ borderColor: "var(--border)" }}
//                   >
//                     <div className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
//                       NAV
//                     </div>
//                     <div className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
//                       Tab / Enter • Esc
//                     </div>
//                   </div>

//                   <div className="p-3 sm:p-4">
//                     <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
//                       {SECTIONS.map((s) => {
//                         const isActive = active === s.id;
//                         return (
//                           <button
//                             key={s.id}
//                             onClick={() => {
//                               scrollToSection(s.id);
//                               setMenuOpen(false);
//                             }}
//                             className={cx(
//                               "group flex items-center justify-between gap-3 border px-3 py-3 text-left transition hover:opacity-90",
//                               "focus:outline-none focus:ring-2",
//                             )}
//                             style={{
//                               borderColor: isActive ? ("var(--accent)" as any) : "var(--border)",
//                               background: isActive ? ("var(--panel2)" as any) : "var(--panel2)",
//                               color: "var(--text)",
//                               ringColor: "var(--accent)",
//                             }}
//                             aria-current={isActive ? "page" : undefined}
//                           >
//                             <div className="flex items-center gap-2 min-w-0">
//                               <span
//                                 className="opacity-90"
//                                 style={{ color: isActive ? "var(--accent)" : "var(--muted2)" }}
//                                 aria-hidden
//                               >
//                                 {SECTION_ICONS[s.id] ?? <ChevronRight className="h-4 w-4" />}
//                               </span>
//                               <div className="min-w-0">
//                                 <div
//                                   className="font-mono text-[11px]"
//                                   style={{ color: "var(--muted2)" }}
//                                 >
//                                   {isActive ? "ACTIVE" : "SECTION"}
//                                 </div>
//                                 <div className="truncate text-sm font-semibold">{s.label}</div>
//                               </div>
//                             </div>

//                             <ChevronRight
//                               className="h-4 w-4 opacity-70"
//                               style={{ color: isActive ? "var(--accent)" : "var(--muted2)" }}
//                               aria-hidden
//                             />
//                           </button>
//                         );
//                       })}
//                     </div>

//                     <div
//                       className="mt-3 border px-3 py-2 text-xs font-mono"
//                       style={{
//                         borderColor: "var(--border)",
//                         background: "var(--panel2)",
//                         color: "var(--muted2)",
//                       }}
//                     >
//                       Tip: Ctrl+K opens Terminal • Esc closes menu
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         ) : null}
//       </AnimatePresence>
//     </header>
//   );
// }
















// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Moon,
//   Sun,
//   Terminal,
//   X,
//   Menu,
//   ChevronRight,
//   Home,
//   User,
//   Layers,
//   FolderGit2,
//   Briefcase,
//   GraduationCap,
//   FlaskConical,
//   FileText,
//   Mail,
//   MessageCircle,
//   Github,
// } from "lucide-react";

// import type { SectionId, Theme } from "../types";
// import { profile } from "../data/profile";
// import { scrollToSection, cx } from "./shared";

// import { CONTAINER } from "./shared"; // ✅ added CONTAINER + cx

// function usePrefersReducedMotion() {
//   const [reduced, setReduced] = useState(false);
//   useEffect(() => {
//     const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
//     if (!mq) return;
//     const onChange = () => setReduced(!!mq.matches);
//     onChange();
//     mq.addEventListener?.("change", onChange);
//     return () => mq.removeEventListener?.("change", onChange);
//   }, []);
//   return reduced;
// }

// const SECTION_ICONS: Partial<Record<SectionId, React.ReactNode>> = {
//   home: <Home className="h-4 w-4" />,
//   about: <User className="h-4 w-4" />,
//   skills: <Layers className="h-4 w-4" />,
//   projects: <FolderGit2 className="h-4 w-4" />,
//   experience: <Briefcase className="h-4 w-4" />,
//   education: <GraduationCap className="h-4 w-4" />,
//   research: <FlaskConical className="h-4 w-4" />,
//   blog: <FileText className="h-4 w-4" />,
// };

// export default function HeaderSection({
//   theme,
//   toggle,
//   active,
//   menuOpen,
//   setMenuOpen,
//   setTerminalOpen,
//   SECTIONS,
// }: {
//   theme: Theme;
//   toggle: () => void;
//   active: SectionId;
//   menuOpen: boolean;
//   setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   setTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   SECTIONS: Array<{ id: SectionId; label: string }>;
// }) {
//   const reducedMotion = usePrefersReducedMotion();

//   const activeIndex = useMemo(
//     () => Math.max(0, SECTIONS.findIndex((s) => s.id === active)),
//     [SECTIONS, active],
//   );

//   // Scroll progress (top-to-bottom)
//   const [progress, setProgress] = useState(0); // 0..1
//   useEffect(() => {
//     const onScroll = () => {
//       const el = document.documentElement;
//       const scrollTop = el.scrollTop || document.body.scrollTop;
//       const scrollHeight = el.scrollHeight || document.body.scrollHeight;
//       const clientHeight = el.clientHeight || window.innerHeight;
//       const denom = Math.max(1, scrollHeight - clientHeight);
//       setProgress(Math.min(1, Math.max(0, scrollTop / denom)));
//     };
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onScroll);
//     return () => {
//       window.removeEventListener("scroll", onScroll as any);
//       window.removeEventListener("resize", onScroll as any);
//     };
//   }, []);

//   // Refs for anchored dropdown under hamburger
//   const hamWrapRef = useRef<HTMLDivElement | null>(null);
//   const panelRef = useRef<HTMLDivElement | null>(null);

//   // Close on ESC
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (!menuOpen) return;
//       if (e.key === "Escape") {
//         e.preventDefault();
//         setMenuOpen(false);
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [menuOpen, setMenuOpen]);

//   // Click outside (close) — keeps it minimal & expected
//   useEffect(() => {
//     if (!menuOpen) return;
//     const onDown = (e: MouseEvent) => {
//       const panel = panelRef.current;
//       const ham = hamWrapRef.current;
//       const t = e.target as Node;
//       if (panel && panel.contains(t)) return;
//       if (ham && ham.contains(t)) return;
//       setMenuOpen(false);
//     };
//     window.addEventListener("mousedown", onDown);
//     return () => window.removeEventListener("mousedown", onDown);
//   }, [menuOpen, setMenuOpen]);

//   // Minimal radius for all navbar buttons
//   const btnClass = "grid h-9 w-9 place-items-center border transition hover:opacity-90";
//   const btnStyle: React.CSSProperties = {
//     borderColor: "var(--border)",
//     background: "var(--panel2)",
//     color: "var(--text)",
//     borderRadius: 6, // minimal corner radius
//   };

//   const highlightedHamStyle: React.CSSProperties = {
//     ...btnStyle,
//     borderColor: "color-mix(in oklab, var(--accent) 55%, var(--border))" as any,
//     background: "color-mix(in oklab, var(--accent) 16%, var(--panel2))" as any,
//     boxShadow: "0 0 0 2px color-mix(in oklab, var(--accent) 20%, transparent)",
//   };

//   return (
//     <header className="fixed top-0 z-50 w-full">
//       {/* Narrow dash bar */}
//       <div
//         className="border-b backdrop-blur"
//         style={{
//           borderColor: "var(--border)",
//           background: "color-mix(in oklab, var(--bg) 74%, transparent)" as any,
//         }}
//       >
//         <nav
//           className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-6"
//           aria-label="Primary"
//           style={{ minHeight: 42 }}
//         >
//           {/* LEFT: only handle text */}
//           <button
//             onClick={() => scrollToSection("home")}
//             className="font-mono text-sm tracking-[0.12em] transition hover:opacity-90"
//             style={{ color: "var(--text)" }}
//             aria-label="Go to home"
//           >
//             {profile.handle}
//           </button>

//           {/* MIDDLE: active indicator + scroll progress (square corners) */}
//           <div className="hidden flex-1 items-center justify-center px-3 sm:flex">
//             <div
//               className="relative w-full max-w-[520px] border px-3 py-2"
//               style={{
//                 borderColor: "var(--border)",
//                 background: "color-mix(in oklab, var(--panel) 55%, transparent)" as any,
//                 borderRadius: 6, // minimal radius
//               }}
//               aria-label="Active section and scroll progress"
//             >
//               {/* track */}
//               <div
//                 className="absolute left-0 right-0 top-0 h-[2px]"
//                 style={{
//                   background: "color-mix(in oklab, var(--border) 70%, transparent)" as any,
//                 }}
//                 aria-hidden
//               />
//               {/* progress fill */}
//               <motion.div
//                 aria-hidden
//                 className="absolute left-0 top-0 h-[2px]"
//                 initial={false}
//                 animate={{ width: `${progress * 100}%` }}
//                 transition={{ duration: 0.12, ease: "linear" }}
//                 style={{
//                   background: "var(--accent)",
//                   boxShadow: "0 0 12px rgba(34,211,238,0.45)",
//                 }}
//               />

//               <div className="flex items-center justify-between gap-3">
//                 <span className="font-mono text-[11px]" style={{ color: "var(--muted2)" }}>
//                   ACTIVE
//                 </span>

//                 <div
//                   className="border px-2 py-1 font-mono text-[11px]"
//                   style={{
//                     borderColor: "var(--border)",
//                     background: "var(--panel2)",
//                     color: "var(--text)",
//                     borderRadius: 4, // very minimal
//                   }}
//                   aria-label="Current section"
//                 >
//                   {SECTIONS.find((s) => s.id === active)?.label ?? "Home"}
//                 </div>

//                 <span className="font-mono text-[11px]" style={{ color: "var(--muted2)" }}>
//                   {Math.round(progress * 100)}%
//                 </span>
//               </div>

//               {/* section marker (moves across by active index) */}
//               <motion.div
//                 aria-hidden
//                 className="absolute bottom-0 left-0 h-[2px]"
//                 initial={false}
//                 animate={{
//                   width: `${Math.max(8, 100 / Math.max(1, SECTIONS.length))}%`,
//                   x:
//                     SECTIONS.length > 1
//                       ? `${(activeIndex * 100) / SECTIONS.length}%`
//                       : "0%",
//                 }}
//                 transition={{
//                   type: reducedMotion ? "tween" : "spring",
//                   stiffness: 340,
//                   damping: 28,
//                   duration: reducedMotion ? 0.12 : undefined,
//                 }}
//                 style={{
//                   background: "color-mix(in oklab, var(--accent2) 55%, transparent)" as any,
//                 }}
//               />
//             </div>
//           </div>

//           {/* RIGHT: controls + social icons */}
//           <div className="flex items-center gap-2">
//             {/* Social icons (easy to add more later) */}
//             <a
//               href={profile.contact.email}
//               className={btnClass}
//               style={btnStyle}
//               aria-label="Email"
//               title="Email"
//             >
//               <Mail className="h-4 w-4" style={{ color: "var(--accent)" }} />
//             </a>

//             <a
//               href={profile.contact.whatsapp}
//               target="_blank"
//               rel="noreferrer"
//               className={btnClass}
//               style={btnStyle}
//               aria-label="WhatsApp"
//               title="WhatsApp"
//             >
//               <MessageCircle className="h-4 w-4" style={{ color: "var(--accent)" }} />
//             </a>

//             <a
//               href={profile.social.github}
//               target="_blank"
//               rel="noreferrer"
//               className={btnClass}
//               style={btnStyle}
//               aria-label="GitHub"
//               title="GitHub"
//             >
//               <Github className="h-4 w-4" style={{ color: "var(--accent)" }} />
//             </a>

//             <button
//               onClick={() => setTerminalOpen(true)}
//               className={btnClass}
//               style={btnStyle}
//               aria-label="Open terminal (Ctrl+K)"
//               title="Terminal (Ctrl+K)"
//             >
//               <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
//             </button>

//             <button
//               onClick={toggle}
//               className={btnClass}
//               style={btnStyle}
//               aria-label="Toggle theme"
//               title={theme === "dark" ? "Switch to Aura" : "Switch to Dark"}
//             >
//               {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//             </button>

//             {/* Hamburger (highlighted) + anchored dropdown */}
//             <div ref={hamWrapRef} className="relative">
//               <button
//                 onClick={() => setMenuOpen((v) => !v)}
//                 className={btnClass}
//                 style={menuOpen ? highlightedHamStyle : highlightedHamStyle}
//                 aria-label="Toggle navigation menu"
//                 aria-expanded={menuOpen}
//               >
//                 {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//               </button>

//               <AnimatePresence>
//                 {menuOpen ? (
//                   <motion.div
//                     ref={panelRef}
//                     initial={{ opacity: 0, y: -6, scale: 0.98 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -6, scale: 0.98 }}
//                     transition={{ duration: 0.18, ease: "easeOut" }}
//                     className="absolute right-0 mt-2 w-64 border"
//                     style={{
//                       borderColor: "var(--border)",
//                       background: "var(--panel)",
//                       boxShadow: "var(--shadow)",
//                       borderRadius: 8, // minimal
//                     }}
//                     role="menu"
//                     aria-label="Section navigation"
//                   >
//                     {/* tree-ish vibe header */}
//                     <div
//                       className="border-b px-3 py-2 font-mono text-[11px]"
//                       style={{ borderColor: "var(--border)", color: "var(--muted2)" }}
//                     >
//                     </div>

//                     <div className="p-2">
//                       <div className="space-y-1">
//                         {SECTIONS.map((s) => {
//                           const isActive = active === s.id;
//                           return (
//                             <button
//                               key={s.id}
//                               onClick={() => {
//                                 scrollToSection(s.id);
//                                 setMenuOpen(false);
//                               }}
//                               className={cx(
//                                 "group flex w-full items-center justify-between gap-3 border px-3 py-2 text-left transition",
//                                 "focus:outline-none focus:ring-2",
//                               )}
//                               style={{
//                                 borderColor: isActive
//                                   ? ("color-mix(in oklab, var(--accent) 45%, var(--border))" as any)
//                                   : "var(--border)",
//                                 background: "var(--panel2)",
//                                 color: "var(--text)",
//                                 borderRadius: 6, // minimal
//                                 boxShadow: isActive
//                                   ? ("0 0 0 2px color-mix(in oklab, var(--accent) 16%, transparent)" as any)
//                                   : undefined,
//                               }}
//                               role="menuitem"
//                               aria-current={isActive ? "page" : undefined}
//                             >
//                               <div className="flex min-w-0 items-center gap-2">
//                                 <span
//                                   className="opacity-90"
//                                   style={{ color: isActive ? "var(--accent)" : "var(--muted2)" }}
//                                   aria-hidden
//                                 >
//                                   {SECTION_ICONS[s.id] ?? <ChevronRight className="h-4 w-4" />}
//                                 </span>
//                                 <div className="min-w-0">
//                                   <div
//                                     className="font-mono text-[10px]"
//                                     style={{ color: "var(--muted2)" }}
//                                   >
//                                     {/* {isActive ? "active" : "node"} */}
//                                   </div>
//                                   <div className="truncate text-sm font-semibold">{s.label}</div>
//                                 </div>
//                               </div>

//                               <ChevronRight
//                                 className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5"
//                                 style={{ color: isActive ? "var(--accent)" : "var(--muted2)" }}
//                                 aria-hidden
//                               />
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <div
//                         className="mt-2 border px-3 py-2 font-mono text-[10px]"
//                         style={{
//                           borderColor: "var(--border)",
//                           background: "var(--panel2)",
//                           color: "var(--muted2)",
//                           borderRadius: 6,
//                         }}
//                       >
//                         Tip: Ctrl+K terminal • Esc close
//                       </div>
//                     </div>
//                   </motion.div>
//                 ) : null}
//               </AnimatePresence>
//             </div>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// }



















import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Moon,
  Sun,
  Terminal,
  X,
  Menu,
  ChevronRight,
  Home,
  User,
  Layers,
  FolderGit2,
  Briefcase,
  GraduationCap,
  FlaskConical,
  FileText,
  Mail,
  MessageCircle,
  Github,
} from "lucide-react";

import type { SectionId, Theme } from "../types";
import { profile } from "../data/profile";
import { scrollToSection, cx } from "./shared";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

const SECTION_ICONS: Partial<Record<SectionId, React.ReactNode>> = {
  home: <Home className="h-4 w-4" />,
  about: <User className="h-4 w-4" />,
  skills: <Layers className="h-4 w-4" />,
  projects: <FolderGit2 className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  research: <FlaskConical className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />,
};

export default function HeaderSection({
  theme,
  toggle,
  active,
  menuOpen,
  setMenuOpen,
  setTerminalOpen,
  SECTIONS,
}: {
  theme: Theme;
  toggle: () => void;
  active: SectionId; // kept for menu highlighting + aria-current
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  SECTIONS: Array<{ id: SectionId; label: string }>;
}) {
  const reducedMotion = usePrefersReducedMotion(); // kept (good for progress anim)
  // const activeIndex = ... // ❌ not needed anymore because you removed the middle "ACTIVE/percent/dash" UI

  // Scroll progress (top-to-bottom) — used only for bottom-edge progress bar
  const [progress, setProgress] = useState(0); // 0..1
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight || document.body.scrollHeight;
      const clientHeight = el.clientHeight || window.innerHeight;
      const denom = Math.max(1, scrollHeight - clientHeight);
      setProgress(Math.min(1, Math.max(0, scrollTop / denom)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onScroll as any);
    };
  }, []);

  // Refs for anchored dropdown under hamburger
  const hamWrapRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!menuOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  // Click outside (close)
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      const panel = panelRef.current;
      const ham = hamWrapRef.current;
      const t = e.target as Node;
      if (panel && panel.contains(t)) return;
      if (ham && ham.contains(t)) return;
      setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menuOpen, setMenuOpen]);

  // Minimal radius for all navbar buttons
  const btnClass =
    "grid h-9 w-9 place-items-center border transition hover:opacity-90";
  const btnStyle: React.CSSProperties = {
    borderColor: "var(--border)",
    background: "var(--panel2)",
    color: "var(--text)",
    borderRadius: 6,
  };

  const highlightedHamStyle: React.CSSProperties = {
    ...btnStyle,
    // ✅ 2) hamburger highlight border heavy bright white
    borderColor: "rgba(255,255,255,0.95)",
    background: "color-mix(in oklab, var(--accent) 14%, var(--panel2))" as any,
    boxShadow:
      "0 0 0 2px rgba(255,255,255,0.30), 0 0 18px rgba(255,255,255,0.18)",
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Narrow dash bar */}
      <div
        className="border-b backdrop-blur"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in oklab, var(--bg) 74%, transparent)" as any,
        }}
      >
        <nav
          className="mx-auto flex max-w-[1500px] items-center justify-between px-3 py-2 sm:px-6"
          aria-label="Primary"
          style={{ minHeight: 42 }}
        >
          {/* LEFT: only handle text */}
          <button
            onClick={() => scrollToSection("home")}
            className="font-mono text-sm tracking-[0.12em] transition hover:opacity-90"
            style={{ color: "var(--text)" }}
            aria-label="Go to home"
          >
            {profile.handle}
          </button>

          {/* MIDDLE: intentionally empty now.
              You asked to remove ACTIVE/percent/dash etc.
              Keeping this flex spacer maintains left/right alignment. */}
          <div className="hidden flex-1 sm:block" aria-hidden />

          {/* RIGHT: controls + social icons */}
          <div className="flex items-center gap-2">
            <a
              href={profile.contact.email}
              className={btnClass}
              style={btnStyle}
              aria-label="Email"
              title="Email"
            >
              <Mail className="h-4 w-4" style={{ color: "var(--accent)" }} />
            </a>

            <a
              href={profile.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className={btnClass}
              style={btnStyle}
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <MessageCircle
                className="h-4 w-4"
                style={{ color: "var(--accent)" }}
              />
            </a>

            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer"
              className={btnClass}
              style={btnStyle}
              aria-label="GitHub"
              title="GitHub"
            >
              <Github className="h-4 w-4" style={{ color: "var(--accent)" }} />
            </a>

            <button
              onClick={() => setTerminalOpen(true)}
              className={btnClass}
              style={btnStyle}
              aria-label="Open terminal (Ctrl+K)"
              title="Terminal (Ctrl+K)"
            >
              <Terminal className="h-4 w-4" style={{ color: "var(--accent)" }} />
            </button>

            <button
              onClick={toggle}
              className={btnClass}
              style={btnStyle}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Aura" : "Switch to Dark"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Hamburger + anchored dropdown */}
            <div ref={hamWrapRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className={btnClass}
                style={highlightedHamStyle}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-64 border"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--panel)",
                      boxShadow: "var(--shadow)",
                      borderRadius: 8,
                    }}
                    role="menu"
                    aria-label="Section navigation"
                  >
                    {/* header spacer (keep or remove) */}
                    <div
                      className="border-b px-3 py-2 font-mono text-[11px]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--muted2)",
                      }}
                    >
                      {/* menu */}
                    </div>

                    <div className="p-2">
                      <div className="space-y-1">
                        {SECTIONS.map((s) => {
                          const isActive = active === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                scrollToSection(s.id);
                                setMenuOpen(false);
                              }}
                              className={cx(
                                "group flex w-full items-center justify-between gap-3 border px-3 py-2 text-left transition",
                                "focus:outline-none focus:ring-2",
                              )}
                              style={{
                                borderColor: isActive
                                  ? ("color-mix(in oklab, var(--accent) 45%, var(--border))" as any)
                                  : "var(--border)",
                                background: "var(--panel2)",
                                color: "var(--text)",
                                borderRadius: 6,
                                boxShadow: isActive
                                  ? ("0 0 0 2px color-mix(in oklab, var(--accent) 16%, transparent)" as any)
                                  : undefined,
                              }}
                              role="menuitem"
                              aria-current={isActive ? "page" : undefined}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span
                                  className="opacity-90"
                                  style={{
                                    color: isActive
                                      ? "var(--accent)"
                                      : "var(--muted2)",
                                  }}
                                  aria-hidden
                                >
                                  {SECTION_ICONS[s.id] ?? (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </span>

                                <div className="min-w-0">
                                  <div className="truncate text-sm font-semibold">
                                    {s.label}
                                  </div>
                                </div>
                              </div>

                              <ChevronRight
                                className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5"
                                style={{
                                  color: isActive
                                    ? "var(--accent)"
                                    : "var(--muted2)",
                                }}
                                aria-hidden
                              />
                            </button>
                          );
                        })}
                      </div>

                      <div
                        className="mt-2 border px-3 py-2 font-mono text-[10px]"
                        style={{
                          borderColor: "var(--border)",
                          background: "var(--panel2)",
                          color: "var(--muted2)",
                          borderRadius: 6,
                        }}
                      >
                        Tip: Ctrl+K terminal • Esc close
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* ✅ Bottom-edge progress bar (no box)
            ✅ "edge color" change: mark here.
        */}
        <div className="mx-auto max-w-[1500px]">
          {/* ✅ Optional track line. If you don't want track, comment this block. */}
          <div
            aria-hidden
            className="h-[2px]"
            style={{
              // ✅ CHANGE EDGE/TRACK COLOR HERE:
              background:
                "color-mix(in oklab, var(--border) 75%, transparent)" as any,
            }}
          />

          <motion.div
            aria-hidden
            className="-mt-[2px] h-[2px]" // ✅ keep same thickness as track
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.12,
              ease: "linear",
            }}
            style={{
              // ✅ CHANGE PROGRESS COLOR HERE (main fill):
              // background: "var(--accent)",
              background: "blue", // <-- CHANGE THIS VALUE

              // ✅ CHANGE EDGE/GLOW COLOR HERE (what you called "edge color"):
              boxShadow: "0 0 12px rgba(34,211,238,0.35)", // <-- CHANGE THIS VALUE
            }}
          />
        </div>
      </div>
    </header>
  );
}

