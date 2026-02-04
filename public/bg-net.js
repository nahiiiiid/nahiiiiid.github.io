// // /**
// //  * Interactive Web/Grid Net Background (Canvas)
// //  * - Full page, behind content, pointer-events none
// //  * - Wind-like flow + elastic distortion on mouse/touch
// //  * - Lightweight + responsive + mobile friendly
// //  *
// //  * Usage:
// //  *   import or include this file after DOM loads:
// //  *   window.NetBackground?.mount();
// //  */
// // (function () {
// //   const NetBackground = {};
// //   let canvas, ctx, dpr;
// //   let w = 0, h = 0;

// //   // Net config (tune for aesthetics)
// //   const cfg = {
// //     spacing: 48,               // base grid spacing
// //     jitter: 10,                // small organic offset
// //     lineWidth: 1.05,
// //     // dark-mode default look (works great on near-black)
// //     color: "rgba(120, 200, 255, 0.18)",
// //     color2: "rgba(34, 211, 238, 0.12)", // accent tint
// //     nodeFill: "rgba(160, 210, 255, 0.18)",
// //     // animation
// //     windStrength: 0.55,
// //     windScale: 0.0018,
// //     relax: 0.09,               // how fast it goes back to rest
// //     damping: 0.86,             // velocity damping
// //     // interaction
// //     influenceRadius: 160,
// //     pokeStrength: 2.2,
// //     breakStrength: 2.0,        // “break/distort” pulse
// //     maxDisplacement: 52,
// //   };

// //   // Grid storage
// //   let cols = 0, rows = 0;
// //   let pts = []; // points array: {x,y, ox,oy, vx,vy, seed}
// //   let t0 = performance.now();

// //   // pointer
// //   const pointer = {
// //     x: 0, y: 0,
// //     px: 0, py: 0,
// //     dx: 0, dy: 0,
// //     down: false,
// //     active: false,
// //     lastHit: 0,
// //   };

// //   function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// //   function mount(options = {}) {
// //     if (options.theme === "light") {
// //       cfg.color = "rgba(15, 23, 42, 0.12)";
// //       cfg.color2 = "rgba(2, 132, 199, 0.10)";
// //       cfg.nodeFill = "rgba(15, 23, 42, 0.10)";
// //     } else if (options.theme === "dark") {
// //       // defaults already tuned for dark
// //     }

// //     // create canvas (no content changes, just inject background elements)
// //     canvas = document.getElementById("bg-net-canvas");
// //     if (!canvas) {
// //       canvas = document.createElement("canvas");
// //       canvas.id = "bg-net-canvas";
// //       document.body.appendChild(canvas);
// //     }
// //     ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

// //     // optional vignette layer
// //     let vig = document.getElementById("bg-net-vignette");
// //     if (!vig) {
// //       vig = document.createElement("div");
// //       vig.id = "bg-net-vignette";
// //       document.body.appendChild(vig);
// //     }

// //     // Ensure it stays behind in case page has weird stacking contexts
// //     canvas.style.zIndex = "-1";
// //     canvas.style.pointerEvents = "none";
// //     vig.style.zIndex = "-1";
// //     vig.style.pointerEvents = "none";

// //     // apply css if not linked
// //     // (recommended to include bg-net.css, but this helps if you forget)
// //     canvas.style.position = "fixed";
// //     canvas.style.inset = "0";
// //     canvas.style.width = "100%";
// //     canvas.style.height = "100%";

// //     onResize();
// //     attachEvents();
// //     requestAnimationFrame(loop);
// //   }

// //   function detach() {
// //     window.removeEventListener("resize", onResize);
// //     window.removeEventListener("mousemove", onMouseMove, { passive: true });
// //     window.removeEventListener("touchstart", onTouchStart, { passive: true });
// //     window.removeEventListener("touchmove", onTouchMove, { passive: true });
// //     window.removeEventListener("touchend", onTouchEnd, { passive: true });
// //     window.removeEventListener("mousedown", onMouseDown, { passive: true });
// //     window.removeEventListener("mouseup", onMouseUp, { passive: true });
// //   }

// //   function attachEvents() {
// //     window.addEventListener("resize", onResize);

// //     window.addEventListener("mousemove", onMouseMove, { passive: true });
// //     window.addEventListener("mousedown", onMouseDown, { passive: true });
// //     window.addEventListener("mouseup", onMouseUp, { passive: true });

// //     window.addEventListener("touchstart", onTouchStart, { passive: true });
// //     window.addEventListener("touchmove", onTouchMove, { passive: true });
// //     window.addEventListener("touchend", onTouchEnd, { passive: true });
// //   }

// //   function onResize() {
// //     dpr = Math.min(window.devicePixelRatio || 1, 2);
// //     w = Math.floor(window.innerWidth);
// //     h = Math.floor(window.innerHeight);

// //     canvas.width = Math.floor(w * dpr);
// //     canvas.height = Math.floor(h * dpr);
// //     canvas.style.width = w + "px";
// //     canvas.style.height = h + "px";
// //     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

// //     buildGrid();
// //   }

// //   function buildGrid() {
// //     const spacing = cfg.spacing;
// //     cols = Math.ceil(w / spacing) + 3;
// //     rows = Math.ceil(h / spacing) + 3;

// //     pts = [];
// //     const x0 = -spacing;
// //     const y0 = -spacing;

// //     for (let y = 0; y < rows; y++) {
// //       for (let x = 0; x < cols; x++) {
// //         const ox = x0 + x * spacing;
// //         const oy = y0 + y * spacing;
// //         // small organic jitter so it doesn't feel too perfect
// //         const jx = (Math.random() - 0.5) * cfg.jitter;
// //         const jy = (Math.random() - 0.5) * cfg.jitter;

// //         pts.push({
// //           ox: ox + jx,
// //           oy: oy + jy,
// //           x: ox + jx,
// //           y: oy + jy,
// //           vx: 0,
// //           vy: 0,
// //           seed: Math.random() * 1000,
// //         });
// //       }
// //     }
// //   }

// //   // indexing helper
// //   function idx(x, y) { return y * cols + x; }

// //   function onMouseMove(e) {
// //     pointer.active = true;
// //     pointer.px = pointer.x;
// //     pointer.py = pointer.y;
// //     pointer.x = e.clientX;
// //     pointer.y = e.clientY;
// //     pointer.dx = pointer.x - pointer.px;
// //     pointer.dy = pointer.y - pointer.py;
// //     pointer.lastHit = performance.now();
// //   }
// //   function onMouseDown() { pointer.down = true; pointer.lastHit = performance.now(); }
// //   function onMouseUp() { pointer.down = false; }

// //   function onTouchStart(e) {
// //     if (!e.touches || !e.touches[0]) return;
// //     pointer.active = true;
// //     pointer.down = true;
// //     pointer.px = pointer.x;
// //     pointer.py = pointer.y;
// //     pointer.x = e.touches[0].clientX;
// //     pointer.y = e.touches[0].clientY;
// //     pointer.dx = pointer.x - pointer.px;
// //     pointer.dy = pointer.y - pointer.py;
// //     pointer.lastHit = performance.now();
// //   }
// //   function onTouchMove(e) {
// //     if (!e.touches || !e.touches[0]) return;
// //     pointer.active = true;
// //     pointer.px = pointer.x;
// //     pointer.py = pointer.y;
// //     pointer.x = e.touches[0].clientX;
// //     pointer.y = e.touches[0].clientY;
// //     pointer.dx = pointer.x - pointer.px;
// //     pointer.dy = pointer.y - pointer.py;
// //     pointer.lastHit = performance.now();
// //   }
// //   function onTouchEnd() { pointer.down = false; }

// //   // "wind" function (cheap smooth noise)
// //   function wind(px, py, time, seed) {
// //     const s = cfg.windScale;
// //     const a = Math.sin((px * s) + (time * 0.0006) + seed);
// //     const b = Math.cos((py * s) + (time * 0.0005) + seed * 0.7);
// //     return (a + b) * 0.5;
// //   }

// //   function applyForces(now) {
// //     const time = now - t0;

// //     // pointer fades out smoothly after inactivity
// //     const idle = now - pointer.lastHit;
// //     const pointerStrength = pointer.active ? clamp(1 - idle / 1200, 0, 1) : 0;

// //     const pr = cfg.influenceRadius;
// //     const pr2 = pr * pr;

// //     for (let i = 0; i < pts.length; i++) {
// //       const p = pts[i];

// //       // wind motion around origin position
// //       const wx = wind(p.ox, p.oy, time, p.seed) * cfg.windStrength;
// //       const wy = wind(p.oy, p.ox, time, p.seed * 1.31) * cfg.windStrength;

// //       // spring back to origin (elastic net)
// //       const ax0 = (p.ox - p.x) * cfg.relax + wx * 0.22;
// //       const ay0 = (p.oy - p.y) * cfg.relax + wy * 0.22;

// //       p.vx = (p.vx + ax0) * cfg.damping;
// //       p.vy = (p.vy + ay0) * cfg.damping;

// //       // interactive distortion
// //       if (pointerStrength > 0) {
// //         const dx = p.x - pointer.x;
// //         const dy = p.y - pointer.y;
// //         const d2 = dx * dx + dy * dy;

// //         if (d2 < pr2) {
// //           const d = Math.sqrt(d2) || 0.0001;
// //           const falloff = (1 - d / pr);
// //           // push away from pointer direction + slight drag along swipe
// //           const push = falloff * cfg.pokeStrength * pointerStrength;
// //           const nx = dx / d;
// //           const ny = dy / d;

// //           // "break/distort pulse" stronger when pressing/touching
// //           const press = pointer.down ? 1 : 0.35;
// //           const burst = falloff * cfg.breakStrength * press * pointerStrength;

// //           // add force
// //           p.vx += nx * push * 0.9 + (pointer.dx * 0.02) * burst;
// //           p.vy += ny * push * 0.9 + (pointer.dy * 0.02) * burst;

// //           // clamp displacement to keep it coherent (avoid ugly snapping)
// //           const ddx = p.x - p.ox;
// //           const ddy = p.y - p.oy;
// //           const disp = Math.sqrt(ddx * ddx + ddy * ddy);
// //           if (disp > cfg.maxDisplacement) {
// //             const k = cfg.maxDisplacement / disp;
// //             p.x = p.ox + ddx * k;
// //             p.y = p.oy + ddy * k;
// //             p.vx *= 0.55;
// //             p.vy *= 0.55;
// //           }
// //         }
// //       }

// //       p.x += p.vx;
// //       p.y += p.vy;
// //     }
// //   }

// //   function draw(now) {
// //     ctx.clearRect(0, 0, w, h);

// //     // subtle global fade for smoothness
// //     // (keeps it crisp without heavy trails)
// //     // ctx.fillStyle = "rgba(0,0,0,0.02)";
// //     // ctx.fillRect(0, 0, w, h);

// //     ctx.lineWidth = cfg.lineWidth;

// //     // draw connections (grid + diagonals -> “web/net” feel)
// //     for (let y = 0; y < rows; y++) {
// //       for (let x = 0; x < cols; x++) {
// //         const p = pts[idx(x, y)];
// //         if (!p) continue;

// //         // primary lines: right + down
// //         if (x + 1 < cols) stroke(p, pts[idx(x + 1, y)], cfg.color);
// //         if (y + 1 < rows) stroke(p, pts[idx(x, y + 1)], cfg.color);

// //         // diagonals (web effect)
// //         if (x + 1 < cols && y + 1 < rows) stroke(p, pts[idx(x + 1, y + 1)], cfg.color2);
// //         if (x + 1 < cols && y - 1 >= 0) stroke(p, pts[idx(x + 1, y - 1)], cfg.color2);
// //       }
// //     }

// //     // nodes (very subtle)
// //     ctx.fillStyle = cfg.nodeFill;
// //     for (let i = 0; i < pts.length; i += 3) {
// //       const p = pts[i];
// //       ctx.beginPath();
// //       ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
// //       ctx.fill();
// //     }
// //   }

// //   function stroke(a, b, color) {
// //     // skip offscreen quickly (tiny perf boost)
// //     const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
// //     const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
// //     if (maxX < -20 || minX > w + 20 || maxY < -20 || minY > h + 20) return;

// //     ctx.strokeStyle = color;
// //     ctx.beginPath();
// //     ctx.moveTo(a.x, a.y);
// //     ctx.lineTo(b.x, b.y);
// //     ctx.stroke();
// //   }

// //   function loop(now) {
// //     applyForces(now);
// //     draw(now);
// //     requestAnimationFrame(loop);
// //   }

// //   NetBackground.mount = mount;
// //   NetBackground.detach = detach;

// //   window.NetBackground = NetBackground;
// // })();








// /**
//  * Interactive Web/Grid Net Background (Canvas) — with tearing + healing
//  * - Full page, behind content, pointer-events none
//  * - Wind-like flow + elastic distortion on mouse/touch
//  * - Net tears (links break) under strain; heals smoothly after delay
//  * - Lightweight + responsive + mobile friendly
//  *
//  * Usage:
//  *   window.NetBackground?.mount({ theme: "dark" | "light" });
//  */
// (function () {
//   const NetBackground = {};

//   let canvas, ctx;
//   let w = 0, h = 0, dpr = 1;
//   let cols = 0, rows = 0;
//   let pts = [];            // {ox,oy,x,y,vx,vy,seed}
//   let t0 = performance.now();

//   // Broken edges store: key -> { tBreak }
//   const broken = new Map();

//   const cfg = {
//     // grid
//     spacing: 48,
//     jitter: 10,
//     lineWidth: 1.05,

//     // colors (dark defaults)
//     color: "rgba(120, 200, 255, 0.18)",
//     color2: "rgba(34, 211, 238, 0.12)",
//     nodeFill: "rgba(160, 210, 255, 0.18)",

//     // motion
//     windStrength: 0.55,
//     windScale: 0.0018,
//     relax: 0.09,
//     damping: 0.86,

//     // interaction
//     influenceRadius: 160,
//     pokeStrength: 2.2,
//     breakStrength: 2.6,
//     maxDisplacement: 52,

//     // tearing
//     tearEnabled: true,
//     tearThreshold: 1.50,     // lower = easier tearing
//     tearCooldownMs: 900,     // stays broken
//     tearHealMs: 1800,        // fade back in
//     tearMaxPerFrame: 24,     // safety
//   };

//   // pointer
//   const pointer = {
//     x: 0, y: 0,
//     px: 0, py: 0,
//     dx: 0, dy: 0,
//     down: false,
//     active: false,
//     lastHit: 0,
//   };

//   function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
//   function idx(x, y) { return y * cols + x; }

//   function edgeKey(a, b) {
//     return a < b ? `${a}-${b}` : `${b}-${a}`;
//   }

//   function edgeBroken(key, now) {
//     const info = broken.get(key);
//     if (!info) return false;
//     const dt = now - info.tBreak;

//     // still broken
//     if (dt < cfg.tearCooldownMs) return true;

//     // healing phase
//     if (dt < cfg.tearCooldownMs + cfg.tearHealMs) return false;

//     // healed completely
//     broken.delete(key);
//     return false;
//   }

//   function edgeHealAlpha(key, now) {
//     const info = broken.get(key);
//     if (!info) return 1;

//     const dt = now - info.tBreak;
//     if (dt < cfg.tearCooldownMs) return 0;

//     const t = (dt - cfg.tearCooldownMs) / cfg.tearHealMs; // 0..1
//     return clamp(t, 0, 1);
//   }

//   function mount(options = {}) {
//     // theme switch
//     if (options.theme === "light") {
//       cfg.color = "rgba(15, 23, 42, 0.12)";
//       cfg.color2 = "rgba(2, 132, 199, 0.10)";
//       cfg.nodeFill = "rgba(15, 23, 42, 0.10)";
//     }

//     // canvas inject
//     canvas = document.getElementById("bg-net-canvas");
//     if (!canvas) {
//       canvas = document.createElement("canvas");
//       canvas.id = "bg-net-canvas";
//       document.body.appendChild(canvas);
//     }

//     ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

//     // optional vignette
//     let vig = document.getElementById("bg-net-vignette");
//     if (!vig) {
//       vig = document.createElement("div");
//       vig.id = "bg-net-vignette";
//       document.body.appendChild(vig);
//     }

//     canvas.style.position = "fixed";
//     canvas.style.inset = "0";
//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.style.zIndex = "-1";
//     canvas.style.pointerEvents = "none";

//     vig.style.position = "fixed";
//     vig.style.inset = "0";
//     vig.style.zIndex = "-1";
//     vig.style.pointerEvents = "none";

//     onResize();
//     attachEvents();
//     requestAnimationFrame(loop);
//   }

//   function detach() {
//     window.removeEventListener("resize", onResize);
//     window.removeEventListener("mousemove", onMouseMove, { passive: true });
//     window.removeEventListener("mousedown", onMouseDown, { passive: true });
//     window.removeEventListener("mouseup", onMouseUp, { passive: true });
//     window.removeEventListener("touchstart", onTouchStart, { passive: true });
//     window.removeEventListener("touchmove", onTouchMove, { passive: true });
//     window.removeEventListener("touchend", onTouchEnd, { passive: true });
//   }

//   function attachEvents() {
//     window.addEventListener("resize", onResize);

//     window.addEventListener("mousemove", onMouseMove, { passive: true });
//     window.addEventListener("mousedown", onMouseDown, { passive: true });
//     window.addEventListener("mouseup", onMouseUp, { passive: true });

//     window.addEventListener("touchstart", onTouchStart, { passive: true });
//     window.addEventListener("touchmove", onTouchMove, { passive: true });
//     window.addEventListener("touchend", onTouchEnd, { passive: true });
//   }

//   function onResize() {
//     dpr = Math.min(window.devicePixelRatio || 1, 2);
//     w = Math.floor(window.innerWidth);
//     h = Math.floor(window.innerHeight);

//     canvas.width = Math.floor(w * dpr);
//     canvas.height = Math.floor(h * dpr);
//     canvas.style.width = w + "px";
//     canvas.style.height = h + "px";
//     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

//     buildGrid();
//   }

//   function buildGrid() {
//     const s = cfg.spacing;
//     cols = Math.ceil(w / s) + 3;
//     rows = Math.ceil(h / s) + 3;

//     pts = [];
//     broken.clear();

//     const x0 = -s;
//     const y0 = -s;

//     for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//         const ox = x0 + x * s + (Math.random() - 0.5) * cfg.jitter;
//         const oy = y0 + y * s + (Math.random() - 0.5) * cfg.jitter;

//         pts.push({
//           ox, oy,
//           x: ox, y: oy,
//           vx: 0, vy: 0,
//           seed: Math.random() * 1000,
//         });
//       }
//     }
//   }

//   function onMouseMove(e) {
//     pointer.active = true;
//     pointer.px = pointer.x;
//     pointer.py = pointer.y;
//     pointer.x = e.clientX;
//     pointer.y = e.clientY;
//     pointer.dx = pointer.x - pointer.px;
//     pointer.dy = pointer.y - pointer.py;
//     pointer.lastHit = performance.now();
//   }
//   function onMouseDown() { pointer.down = true; pointer.lastHit = performance.now(); }
//   function onMouseUp() { pointer.down = false; }

//   function onTouchStart(e) {
//     if (!e.touches || !e.touches[0]) return;
//     pointer.active = true;
//     pointer.down = true;
//     pointer.px = pointer.x;
//     pointer.py = pointer.y;
//     pointer.x = e.touches[0].clientX;
//     pointer.y = e.touches[0].clientY;
//     pointer.dx = pointer.x - pointer.px;
//     pointer.dy = pointer.y - pointer.py;
//     pointer.lastHit = performance.now();
//   }
//   function onTouchMove(e) {
//     if (!e.touches || !e.touches[0]) return;
//     pointer.active = true;
//     pointer.px = pointer.x;
//     pointer.py = pointer.y;
//     pointer.x = e.touches[0].clientX;
//     pointer.y = e.touches[0].clientY;
//     pointer.dx = pointer.x - pointer.px;
//     pointer.dy = pointer.y - pointer.py;
//     pointer.lastHit = performance.now();
//   }
//   function onTouchEnd() { pointer.down = false; }

//   // cheap pseudo-noise wind
//   function wind(px, py, time, seed) {
//     const s = cfg.windScale;
//     const a = Math.sin(px * s + time * 0.0006 + seed);
//     const b = Math.cos(py * s + time * 0.0005 + seed * 0.7);
//     return (a + b) * 0.5;
//   }

//   function applyForces(now) {
//     const time = now - t0;

//     // pointer fades after inactivity
//     const idle = now - pointer.lastHit;
//     const pointerStrength = pointer.active ? clamp(1 - idle / 1200, 0, 1) : 0;

//     const pr = cfg.influenceRadius;
//     const pr2 = pr * pr;

//     for (let i = 0; i < pts.length; i++) {
//       const p = pts[i];

//       // wind
//       const wx = wind(p.ox, p.oy, time, p.seed) * cfg.windStrength;
//       const wy = wind(p.oy, p.ox, time, p.seed * 1.31) * cfg.windStrength;

//       // spring
//       const ax0 = (p.ox - p.x) * cfg.relax + wx * 0.22;
//       const ay0 = (p.oy - p.y) * cfg.relax + wy * 0.22;

//       p.vx = (p.vx + ax0) * cfg.damping;
//       p.vy = (p.vy + ay0) * cfg.damping;

//       // interaction
//       if (pointerStrength > 0) {
//         const dx = p.x - pointer.x;
//         const dy = p.y - pointer.y;
//         const d2 = dx * dx + dy * dy;

//         if (d2 < pr2) {
//           const d = Math.sqrt(d2) || 0.0001;
//           const falloff = 1 - d / pr;

//           const push = falloff * cfg.pokeStrength * pointerStrength;
//           const nx = dx / d;
//           const ny = dy / d;

//           // stronger on press for tearing
//           const press = pointer.down ? 1.6 : 0.35;
//           const burst = falloff * cfg.breakStrength * press * pointerStrength;

//           p.vx += nx * push * 0.9 + (pointer.dx * 0.02) * burst;
//           p.vy += ny * push * 0.9 + (pointer.dy * 0.02) * burst;

//           // clamp displacement
//           const ddx = p.x - p.ox;
//           const ddy = p.y - p.oy;
//           const disp = Math.sqrt(ddx * ddx + ddy * ddy);
//           if (disp > cfg.maxDisplacement) {
//             const k = cfg.maxDisplacement / disp;
//             p.x = p.ox + ddx * k;
//             p.y = p.oy + ddy * k;
//             p.vx *= 0.55;
//             p.vy *= 0.55;
//           }
//         }
//       }

//       p.x += p.vx;
//       p.y += p.vy;
//     }
//   }

//   function draw(now) {
//     ctx.clearRect(0, 0, w, h);
//     ctx.lineWidth = cfg.lineWidth;

//     // per-frame tear limiter
//     draw._tearCount = 0;

//     const s = cfg.spacing;
//     const diag = s * Math.SQRT2;

//     // draw edges
//     for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//         const i0 = idx(x, y);
//         const p = pts[i0];
//         if (!p) continue;

//         // right
//         if (x + 1 < cols) {
//           const i1 = idx(x + 1, y);
//           stroke(i0, i1, cfg.color, s, now);
//         }
//         // down
//         if (y + 1 < rows) {
//           const i1 = idx(x, y + 1);
//           stroke(i0, i1, cfg.color, s, now);
//         }
//         // diagonals
//         if (x + 1 < cols && y + 1 < rows) {
//           const i1 = idx(x + 1, y + 1);
//           stroke(i0, i1, cfg.color2, diag, now);
//         }
//         if (x + 1 < cols && y - 1 >= 0) {
//           const i1 = idx(x + 1, y - 1);
//           stroke(i0, i1, cfg.color2, diag, now);
//         }
//       }
//     }

//     // nodes
//     ctx.fillStyle = cfg.nodeFill;
//     for (let i = 0; i < pts.length; i += 3) {
//       const p = pts[i];
//       ctx.beginPath();
//       ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
//       ctx.fill();
//     }
//   }
//   draw._tearCount = 0;

//   function stroke(iA, iB, color, restLen, now) {
//     const a = pts[iA];
//     const b = pts[iB];
//     if (!a || !b) return;

//     // offscreen skip
//     const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
//     const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
//     if (maxX < -20 || minX > w + 20 || maxY < -20 || minY > h + 20) return;

//     const key = edgeKey(iA, iB);

//     // measure strain
//     const dx = a.x - b.x;
//     const dy = a.y - b.y;
//     const len = Math.sqrt(dx * dx + dy * dy);

//     // tear if overstretched
//     if (cfg.tearEnabled && len > restLen * cfg.tearThreshold) {
//       if (draw._tearCount < cfg.tearMaxPerFrame) {
//         broken.set(key, { tBreak: now });
//         draw._tearCount++;
//       }
//       return;
//     }

//     // if currently broken, don’t draw
//     if (cfg.tearEnabled && edgeBroken(key, now)) return;

//     // healing alpha (0→1)
//     const heal = cfg.tearEnabled ? edgeHealAlpha(key, now) : 1;
//     if (heal <= 0.01) return;

//     ctx.save();
//     ctx.globalAlpha *= heal;
//     ctx.strokeStyle = color;
//     ctx.beginPath();
//     ctx.moveTo(a.x, a.y);
//     ctx.lineTo(b.x, b.y);
//     ctx.stroke();
//     ctx.restore();
//   }

//   function loop(now) {
//     applyForces(now);
//     draw(now);
//     requestAnimationFrame(loop);
//   }

//   NetBackground.mount = mount;
//   NetBackground.detach = detach;
//   window.NetBackground = NetBackground;
// })();













/**
 * Interactive Web/Grid Net Background (Canvas) — REAL snapping (path cut) + healing
 * - Full page, behind content, pointer-events none
 * - Wind flow + elastic distortion
 * - Snap behavior: moving pointer A→B cuts links along the path (feels "real")
 * - Also tears under strain; heals after delay
 */
(function () {
  const NetBackground = {};

  let canvas, ctx;
  let w = 0, h = 0, dpr = 1;
  let cols = 0, rows = 0;
  let pts = [];
  let t0 = performance.now();

  // Broken edges: key -> { tBreak }
  const broken = new Map();

  const cfg = {
    // grid
    spacing: 48,
    jitter: 10,
    lineWidth: 1.05,

    // colors (dark default)
    color: "rgba(120, 200, 255, 0.18)",
    color2: "rgba(34, 211, 238, 0.12)",
    nodeFill: "rgba(160, 210, 255, 0.18)",

    // wind + relax
    windStrength: 0.55,
    windScale: 0.0018,
    relax: 0.09,
    damping: 0.86,

    // interaction distortion
    influenceRadius: 160,
    pokeStrength: 2.2,
    breakStrength: 2.6,
    maxDisplacement: 52,

    // tear under strain
    tearEnabled: true,
    tearThreshold: 1.50,     // lower = easier tear
    tearMaxPerFrame: 64,

    // REAL snap / cut along pointer path
    cutEnabled: true,
    cutRadius: 14,           // how close edge must be to pointer path to snap
    cutStrength: 1.0,        // multiplier for snapping amount
    cutMaxPerFrame: 120,     // safety cap

    // healing
    tearCooldownMs: 900,     // stays broken
    tearHealMs: 1800,        // fade in
  };

  const pointer = {
    x: 0, y: 0,
    px: 0, py: 0,
    dx: 0, dy: 0,
    down: false,
    active: false,
    lastHit: 0,
  };

  // scroll-to-swipe emulation
  const scrollImpulse = { dx: 0, dy: 0, t: 0 };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function idx(x, y) { return y * cols + x; }
  function edgeKey(a, b) { return a < b ? `${a}-${b}` : `${b}-${a}`; }

  function mount(options = {}) {
    if (options.theme === "light") {
      cfg.color = "rgba(15, 23, 42, 0.12)";
      cfg.color2 = "rgba(2, 132, 199, 0.10)";
      cfg.nodeFill = "rgba(15, 23, 42, 0.10)";
    }

    canvas = document.getElementById("bg-net-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "bg-net-canvas";
      document.body.appendChild(canvas);
    }
    ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

    // optional vignette
    let vig = document.getElementById("bg-net-vignette");
    if (!vig) {
      vig = document.createElement("div");
      vig.id = "bg-net-vignette";
      document.body.appendChild(vig);
    }

    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";

    vig.style.position = "fixed";
    vig.style.inset = "0";
    vig.style.zIndex = "-1";
    vig.style.pointerEvents = "none";

    onResize();
    attachEvents();
    requestAnimationFrame(loop);
  }

  function detach() {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMouseMove, { passive: true });
    window.removeEventListener("mousedown", onMouseDown, { passive: true });
    window.removeEventListener("mouseup", onMouseUp, { passive: true });

    window.removeEventListener("touchstart", onTouchStart, { passive: true });
    window.removeEventListener("touchmove", onTouchMove, { passive: true });
    window.removeEventListener("touchend", onTouchEnd, { passive: true });

    window.removeEventListener("wheel", onWheel, { passive: true });
  }

  function attachEvents() {
    window.addEventListener("resize", onResize);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // scroll snap feel (treat scroll as swipe)
    window.addEventListener("wheel", onWheel, { passive: true });
  }

  function onResize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildGrid();
  }

  function buildGrid() {
    const s = cfg.spacing;
    cols = Math.ceil(w / s) + 3;
    rows = Math.ceil(h / s) + 3;

    pts = [];
    broken.clear();

    const x0 = -s, y0 = -s;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const ox = x0 + x * s + (Math.random() - 0.5) * cfg.jitter;
        const oy = y0 + y * s + (Math.random() - 0.5) * cfg.jitter;

        pts.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0, seed: Math.random() * 1000 });
      }
    }
  }

  function onMouseMove(e) {
    pointer.active = true;
    pointer.px = pointer.x; pointer.py = pointer.y;
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.dx = pointer.x - pointer.px;
    pointer.dy = pointer.y - pointer.py;
    pointer.lastHit = performance.now();
  }
  function onMouseDown() { pointer.down = true; pointer.lastHit = performance.now(); }
  function onMouseUp() { pointer.down = false; }

  function onTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    pointer.active = true;
    pointer.down = true;
    pointer.px = pointer.x; pointer.py = pointer.y;
    pointer.x = e.touches[0].clientX; pointer.y = e.touches[0].clientY;
    pointer.dx = pointer.x - pointer.px;
    pointer.dy = pointer.y - pointer.py;
    pointer.lastHit = performance.now();
  }
  function onTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    pointer.active = true;
    pointer.px = pointer.x; pointer.py = pointer.y;
    pointer.x = e.touches[0].clientX; pointer.y = e.touches[0].clientY;
    pointer.dx = pointer.x - pointer.px;
    pointer.dy = pointer.y - pointer.py;
    pointer.lastHit = performance.now();
  }
  function onTouchEnd() { pointer.down = false; }

  function onWheel(e) {
    // store an impulse that fades quickly; we will use it to “cut” vertically
    scrollImpulse.dx += e.deltaX;
    scrollImpulse.dy += e.deltaY;
    scrollImpulse.t = performance.now();
  }

  function wind(px, py, time, seed) {
    const s = cfg.windScale;
    const a = Math.sin(px * s + time * 0.0006 + seed);
    const b = Math.cos(py * s + time * 0.0005 + seed * 0.7);
    return (a + b) * 0.5;
  }

  function edgeIsBroken(key, now) {
    const info = broken.get(key);
    if (!info) return false;
    const dt = now - info.tBreak;
    if (dt < cfg.tearCooldownMs) return true;
    if (dt < cfg.tearCooldownMs + cfg.tearHealMs) return false;
    broken.delete(key);
    return false;
  }

  function edgeHealAlpha(key, now) {
    const info = broken.get(key);
    if (!info) return 1;
    const dt = now - info.tBreak;
    if (dt < cfg.tearCooldownMs) return 0;
    return clamp((dt - cfg.tearCooldownMs) / cfg.tearHealMs, 0, 1);
  }

  // Distance between segment AB and segment CD (fast enough for our sizes)
  function segSegDist2(ax, ay, bx, by, cx, cy, dx, dy) {
    // Approx approach: take min distance from each endpoint to other segment.
    // (Good enough visually + fast)
    return Math.min(
      pointSegDist2(ax, ay, cx, cy, dx, dy),
      pointSegDist2(bx, by, cx, cy, dx, dy),
      pointSegDist2(cx, cy, ax, ay, bx, by),
      pointSegDist2(dx, dy, ax, ay, bx, by)
    );
  }

  function pointSegDist2(px, py, ax, ay, bx, by) {
    const abx = bx - ax, aby = by - ay;
    const apx = px - ax, apy = py - ay;
    const ab2 = abx * abx + aby * aby || 0.0001;
    let t = (apx * abx + apy * aby) / ab2;
    t = clamp(t, 0, 1);
    const x = ax + abx * t, y = ay + aby * t;
    const dx = px - x, dy = py - y;
    return dx * dx + dy * dy;
  }

  function cutEdgesAlongPath(x1, y1, x2, y2, now, cutBudget) {
    if (!cfg.cutEnabled) return 0;

    const vx = x2 - x1, vy = y2 - y1;
    const speed = Math.hypot(vx, vy);

    // don't cut if barely moved
    if (speed < 2) return 0;

    // more speed = more snapping
    const radius = cfg.cutRadius * (0.9 + clamp(speed / 24, 0, 1) * 1.6) * cfg.cutStrength;
    const r2 = radius * radius;

    let cutCount = 0;
    const s = cfg.spacing;
    const diag = s * Math.SQRT2;

    // Estimate which grid cells near the path to scan (fast culling)
    const minX = Math.min(x1, x2) - radius - s;
    const maxX = Math.max(x1, x2) + radius + s;
    const minY = Math.min(y1, y2) - radius - s;
    const maxY = Math.max(y1, y2) + radius + s;

    // convert bounds to grid index range
    const gx0 = clamp(Math.floor((minX + s) / s), 0, cols - 1);
    const gx1 = clamp(Math.ceil((maxX + s) / s), 0, cols - 1);
    const gy0 = clamp(Math.floor((minY + s) / s), 0, rows - 1);
    const gy1 = clamp(Math.ceil((maxY + s) / s), 0, rows - 1);

    for (let gy = gy0; gy <= gy1; gy++) {
      for (let gx = gx0; gx <= gx1; gx++) {
        const i0 = idx(gx, gy);
        const p = pts[i0];
        if (!p) continue;

        // right, down, diag links from this node
        const neighbors = [];

        if (gx + 1 < cols) neighbors.push([i0, idx(gx + 1, gy), s]);
        if (gy + 1 < rows) neighbors.push([i0, idx(gx, gy + 1), s]);
        if (gx + 1 < cols && gy + 1 < rows) neighbors.push([i0, idx(gx + 1, gy + 1), diag]);
        if (gx + 1 < cols && gy - 1 >= 0) neighbors.push([i0, idx(gx + 1, gy - 1), diag]);

        for (const [ia, ib] of neighbors) {
          if (cutCount >= cutBudget) return cutCount;

          const a = pts[ia], b = pts[ib];
          const k = edgeKey(ia, ib);
          if (!a || !b) continue;

          // already broken recently? skip
          const heal = edgeHealAlpha(k, now);
          if (heal === 0) continue;

          // if edge is close to pointer path, snap it
          const d2 = segSegDist2(x1, y1, x2, y2, a.x, a.y, b.x, b.y);
          if (d2 <= r2) {
            broken.set(k, { tBreak: now });
            cutCount++;
          }
        }
      }
    }

    return cutCount;
  }

  function applyForces(now) {
    const time = now - t0;

    const idle = now - pointer.lastHit;
    const pointerStrength = pointer.active ? clamp(1 - idle / 1200, 0, 1) : 0;

    const pr = cfg.influenceRadius;
    const pr2 = pr * pr;

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];

      const wx = wind(p.ox, p.oy, time, p.seed) * cfg.windStrength;
      const wy = wind(p.oy, p.ox, time, p.seed * 1.31) * cfg.windStrength;

      const ax0 = (p.ox - p.x) * cfg.relax + wx * 0.22;
      const ay0 = (p.oy - p.y) * cfg.relax + wy * 0.22;

      p.vx = (p.vx + ax0) * cfg.damping;
      p.vy = (p.vy + ay0) * cfg.damping;

      if (pointerStrength > 0) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < pr2) {
          const d = Math.sqrt(d2) || 0.0001;
          const falloff = 1 - d / pr;

          const push = falloff * cfg.pokeStrength * pointerStrength;
          const nx = dx / d, ny = dy / d;

          // stronger when pressed
          const press = pointer.down ? 1.8 : 0.35;
          const burst = falloff * cfg.breakStrength * press * pointerStrength;

          p.vx += nx * push * 0.9 + (pointer.dx * 0.02) * burst;
          p.vy += ny * push * 0.9 + (pointer.dy * 0.02) * burst;

          const ddx = p.x - p.ox;
          const ddy = p.y - p.oy;
          const disp = Math.sqrt(ddx * ddx + ddy * ddy);
          if (disp > cfg.maxDisplacement) {
            const k = cfg.maxDisplacement / disp;
            p.x = p.ox + ddx * k;
            p.y = p.oy + ddy * k;
            p.vx *= 0.55;
            p.vy *= 0.55;
          }
        }
      }

      p.x += p.vx;
      p.y += p.vy;
    }
  }

  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = cfg.lineWidth;

    draw._tearCount = 0;

    // REAL SNAP: cut edges along pointer path each frame
    if (cfg.cutEnabled) {
      const budget = cfg.cutMaxPerFrame;

      // pointer path cut
      if (pointer.active) {
        cutEdgesAlongPath(pointer.px, pointer.py, pointer.x, pointer.y, now, budget);
      }

      // scroll cut: treat scroll as vertical swipe near center
      const dt = now - scrollImpulse.t;
      if (dt < 120) {
        const fade = 1 - dt / 120;
        const sx = w * 0.5;
        const sy = h * 0.5;
        const dy = scrollImpulse.dy * 0.35 * fade;

        cutEdgesAlongPath(sx, sy - dy, sx, sy + dy, now, budget);
        scrollImpulse.dy *= 0.75;
        scrollImpulse.dx *= 0.75;
      }
    }

    const s = cfg.spacing;
    const diag = s * Math.SQRT2;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i0 = idx(x, y);
        const p = pts[i0];
        if (!p) continue;

        if (x + 1 < cols) stroke(i0, idx(x + 1, y), cfg.color, s, now);
        if (y + 1 < rows) stroke(i0, idx(x, y + 1), cfg.color, s, now);

        if (x + 1 < cols && y + 1 < rows) stroke(i0, idx(x + 1, y + 1), cfg.color2, diag, now);
        if (x + 1 < cols && y - 1 >= 0) stroke(i0, idx(x + 1, y - 1), cfg.color2, diag, now);
      }
    }

    ctx.fillStyle = cfg.nodeFill;
    for (let i = 0; i < pts.length; i += 3) {
      const p = pts[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  draw._tearCount = 0;

  function stroke(iA, iB, color, restLen, now) {
    const a = pts[iA], b = pts[iB];
    if (!a || !b) return;

    const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
    if (maxX < -20 || minX > w + 20 || maxY < -20 || minY > h + 20) return;

    const key = edgeKey(iA, iB);

    // strain tear (secondary)
    if (cfg.tearEnabled) {
      const dx = a.x - b.x, dy = a.y - b.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > restLen * cfg.tearThreshold) {
        if (draw._tearCount < cfg.tearMaxPerFrame) {
          broken.set(key, { tBreak: now });
          draw._tearCount++;
        }
        return;
      }
    }

    if (cfg.tearEnabled && edgeIsBroken(key, now)) return;

    const heal = cfg.tearEnabled ? edgeHealAlpha(key, now) : 1;
    if (heal <= 0.01) return;

    ctx.save();
    ctx.globalAlpha *= heal;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function loop(now) {
    applyForces(now);
    draw(now);
    requestAnimationFrame(loop);
  }

  NetBackground.mount = mount;
  NetBackground.detach = detach;
  window.NetBackground = NetBackground;
})();
