import type { Theme, ThemeTokens } from "../types";

// export const darkTheme: ThemeTokens = {
//   "--bg": "#070A0F",
//   "--panel": "rgba(2, 6, 23, 0.45)",
//   "--panel2": "rgba(2, 6, 23, 0.30)",
//   "--text": "rgba(248, 250, 252, 0.92)",
//   "--muted": "rgba(148, 163, 184, 0.78)",
//   "--muted2": "rgba(148, 163, 184, 0.62)",
//   "--border": "rgba(148, 163, 184, 0.18)",
//   "--accent": "rgba(34, 211, 238, 0.85)",
//   "--accent2": "rgba(56, 189, 248, 0.55)",
//   "--grid": "rgba(148, 163, 184, 0.10)",
//   "--shadow": "0 0 0 1px rgba(148,163,184,0.10)",
//   "--glow": "0 0 0 1px rgba(34,211,238,0.20), 0 18px 60px -40px rgba(34,211,238,0.55)",
// };

export const darkTheme: ThemeTokens = {
  "--bg": "#070A0F",

  // darker, more “glass-dark”
  "--panel": "070A0F",
  "--panel2": "070A0F",

  "--text": "rgba(248, 250, 252, 0.92)",
  "--muted": "rgba(148, 163, 184, 0.78)",
  "--muted2": "rgba(148, 163, 184, 0.62)",

  "--border": "rgba(148, 163, 184, 0.18)",

  "--accent": "rgba(34, 211, 238, 0.85)",
  "--accent2": "rgba(56, 189, 248, 0.55)",

  "--grid": "rgba(148, 163, 184, 0.10)",

  // floating card shadow (no outline)
  "--shadow":
    "0 18px 50px -28px rgba(0,0,0,0.75), 0 10px 22px -18px rgba(0,0,0,0.55)",

  // optional aura lift
  "--glow":
    "0 0 0 0 rgba(0,0,0,0), 0 22px 80px -55px rgba(34,211,238,0.55)",
};


export const auraTheme: ThemeTokens = {
  "--bg": "#f6f7f9",
  "--panel": "rgba(255, 255, 255, 0.75)",
  "--panel2": "rgba(255, 255, 255, 0.55)",
  "--text": "rgba(10, 18, 32, 0.92)",
  "--muted": "rgba(30, 41, 59, 0.72)",
  "--muted2": "rgba(30, 41, 59, 0.58)",
  "--border": "rgba(15, 23, 42, 0.10)",
  "--accent": "rgba(2, 132, 199, 0.85)",
  "--accent2": "rgba(56, 189, 248, 0.40)",
  "--grid": "rgba(15, 23, 42, 0.08)",
  "--shadow": "0 0 0 1px rgba(15,23,42,0.08)",
  "--glow": "0 0 0 1px rgba(2,132,199,0.18), 0 18px 60px -40px rgba(2,132,199,0.25)",
};

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.toggle("aura", theme === "aura");
  root.classList.toggle("dark", theme === "dark");

  const tokens = theme === "aura" ? auraTheme : darkTheme;
  for (const [k, v] of Object.entries(tokens)) root.style.setProperty(k, v);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "aura" ? "#f6f7f9" : "#070A0F");

  root.style.colorScheme = theme === "aura" ? "light" : "dark";
}
