// // // // /**
// // // //  * Interactive Web/Grid Net Background (Canvas)
// // // //  * - Full page, behind content, pointer-events none
// // // //  * - Wind-like flow + elastic distortion on mouse/touch
// // // //  * - Lightweight + responsive + mobile friendly
// // // //  *
// // // //  * Usage:
// // // //  *   import or include this file after DOM loads:
// // // //  *   window.NetBackground?.mount();
// // // //  */
// // // // (function () {
// // // //   const NetBackground = {};
// // // //   let canvas, ctx, dpr;
// // // //   let w = 0, h = 0;

// // // //   // Net config (tune for aesthetics)
// // // //   const cfg = {
// // // //     spacing: 48,               // base grid spacing
// // // //     jitter: 10,                // small organic offset
// // // //     lineWidth: 1.05,
// // // //     // dark-mode default look (works great on near-black)
// // // //     color: "rgba(120, 200, 255, 0.18)",
// // // //     color2: "rgba(34, 211, 238, 0.12)", // accent tint
// // // //     nodeFill: "rgba(160, 210, 255, 0.18)",
// // // //     // animation
// // // //     windStrength: 0.55,
// // // //     windScale: 0.0018,
// // // //     relax: 0.09,               // how fast it goes back to rest
// // // //     damping: 0.86,             // velocity damping
// // // //     // interaction
// // // //     influenceRadius: 160,
// // // //     pokeStrength: 2.2,
// // // //     breakStrength: 2.0,        // “break/distort” pulse
// // // //     maxDisplacement: 52,
// // // //   };

// // // //   // Grid storage
// // // //   let cols = 0, rows = 0;
// // // //   let pts = []; // points array: {x,y, ox,oy, vx,vy, seed}
// // // //   let t0 = performance.now();

// // // //   // pointer
// // // //   const pointer = {
// // // //     x: 0, y: 0,
// // // //     px: 0, py: 0,
// // // //     dx: 0, dy: 0,
// // // //     down: false,
// // // //     active: false,
// // // //     lastHit: 0,
// // // //   };

// // // //   function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// // // //   function mount(options = {}) {
// // // //     if (options.theme === "light") {
// // // //       cfg.color = "rgba(15, 23, 42, 0.12)";
// // // //       cfg.color2 = "rgba(2, 132, 199, 0.10)";
// // // //       cfg.nodeFill = "rgba(15, 23, 42, 0.10)";
// // // //     } else if (options.theme === "dark") {
// // // //       // defaults already tuned for dark
// // // //     }

// // // //     // create canvas (no content changes, just inject background elements)
// // // //     canvas = document.getElementById("bg-net-canvas");
// // // //     if (!canvas) {
// // // //       canvas = document.createElement("canvas");
// // // //       canvas.id = "bg-net-canvas";
// // // //       document.body.appendChild(canvas);
// // // //     }
// // // //     ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

// // // //     // optional vignette layer
// // // //     let vig = document.getElementById("bg-net-vignette");
// // // //     if (!vig) {
// // // //       vig = document.createElement("div");
// // // //       vig.id = "bg-net-vignette";
// // // //       document.body.appendChild(vig);
// // // //     }

// // // //     // Ensure it stays behind in case page has weird stacking contexts
// // // //     canvas.style.zIndex = "-1";
// // // //     canvas.style.pointerEvents = "none";
// // // //     vig.style.zIndex = "-1";
// // // //     vig.style.pointerEvents = "none";

// // // //     // apply css if not linked
// // // //     // (recommended to include bg-net.css, but this helps if you forget)
// // // //     canvas.style.position = "fixed";
// // // //     canvas.style.inset = "0";
// // // //     canvas.style.width = "100%";
// // // //     canvas.style.height = "100%";

// // // //     onResize();
// // // //     attachEvents();
// // // //     requestAnimationFrame(loop);
// // // //   }

// // // //   function detach() {
// // // //     window.removeEventListener("resize", onResize);
// // // //     window.removeEventListener("mousemove", onMouseMove, { passive: true });
// // // //     window.removeEventListener("touchstart", onTouchStart, { passive: true });
// // // //     window.removeEventListener("touchmove", onTouchMove, { passive: true });
// // // //     window.removeEventListener("touchend", onTouchEnd, { passive: true });
// // // //     window.removeEventListener("mousedown", onMouseDown, { passive: true });
// // // //     window.removeEventListener("mouseup", onMouseUp, { passive: true });
// // // //   }

// // // //   function attachEvents() {
// // // //     window.addEventListener("resize", onResize);

// // // //     window.addEventListener("mousemove", onMouseMove, { passive: true });
// // // //     window.addEventListener("mousedown", onMouseDown, { passive: true });
// // // //     window.addEventListener("mouseup", onMouseUp, { passive: true });

// // // //     window.addEventListener("touchstart", onTouchStart, { passive: true });
// // // //     window.addEventListener("touchmove", onTouchMove, { passive: true });
// // // //     window.addEventListener("touchend", onTouchEnd, { passive: true });
// // // //   }

// // // //   function onResize() {
// // // //     dpr = Math.min(window.devicePixelRatio || 1, 2);
// // // //     w = Math.floor(window.innerWidth);
// // // //     h = Math.floor(window.innerHeight);

// // // //     canvas.width = Math.floor(w * dpr);
// // // //     canvas.height = Math.floor(h * dpr);
// // // //     canvas.style.width = w + "px";
// // // //     canvas.style.height = h + "px";
// // // //     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

// // // //     buildGrid();
// // // //   }

// // // //   function buildGrid() {
// // // //     const spacing = cfg.spacing;
// // // //     cols = Math.ceil(w / spacing) + 3;
// // // //     rows = Math.ceil(h / spacing) + 3;

// // // //     pts = [];
// // // //     const x0 = -spacing;
// // // //     const y0 = -spacing;

// // // //     for (let y = 0; y < rows; y++) {
// // // //       for (let x = 0; x < cols; x++) {
// // // //         const ox = x0 + x * spacing;
// // // //         const oy = y0 + y * spacing;
// // // //         // small organic jitter so it doesn't feel too perfect
// // // //         const jx = (Math.random() - 0.5) * cfg.jitter;
// // // //         const jy = (Math.random() - 0.5) * cfg.jitter;

// // // //         pts.push({
// // // //           ox: ox + jx,
// // // //           oy: oy + jy,
// // // //           x: ox + jx,
// // // //           y: oy + jy,
// // // //           vx: 0,
// // // //           vy: 0,
// // // //           seed: Math.random() * 1000,
// // // //         });
// // // //       }
// // // //     }
// // // //   }

// // // //   // indexing helper
// // // //   function idx(x, y) { return y * cols + x; }

// // // //   function onMouseMove(e) {
// // // //     pointer.active = true;
// // // //     pointer.px = pointer.x;
// // // //     pointer.py = pointer.y;
// // // //     pointer.x = e.clientX;
// // // //     pointer.y = e.clientY;
// // // //     pointer.dx = pointer.x - pointer.px;
// // // //     pointer.dy = pointer.y - pointer.py;
// // // //     pointer.lastHit = performance.now();
// // // //   }
// // // //   function onMouseDown() { pointer.down = true; pointer.lastHit = performance.now(); }
// // // //   function onMouseUp() { pointer.down = false; }

// // // //   function onTouchStart(e) {
// // // //     if (!e.touches || !e.touches[0]) return;
// // // //     pointer.active = true;
// // // //     pointer.down = true;
// // // //     pointer.px = pointer.x;
// // // //     pointer.py = pointer.y;
// // // //     pointer.x = e.touches[0].clientX;
// // // //     pointer.y = e.touches[0].clientY;
// // // //     pointer.dx = pointer.x - pointer.px;
// // // //     pointer.dy = pointer.y - pointer.py;
// // // //     pointer.lastHit = performance.now();
// // // //   }
// // // //   function onTouchMove(e) {
// // // //     if (!e.touches || !e.touches[0]) return;
// // // //     pointer.active = true;
// // // //     pointer.px = pointer.x;
// // // //     pointer.py = pointer.y;
// // // //     pointer.x = e.touches[0].clientX;
// // // //     pointer.y = e.touches[0].clientY;
// // // //     pointer.dx = pointer.x - pointer.px;
// // // //     pointer.dy = pointer.y - pointer.py;
// // // //     pointer.lastHit = performance.now();
// // // //   }
// // // //   function onTouchEnd() { pointer.down = false; }

// // // //   // "wind" function (cheap smooth noise)
// // // //   function wind(px, py, time, seed) {
// // // //     const s = cfg.windScale;
// // // //     const a = Math.sin((px * s) + (time * 0.0006) + seed);
// // // //     const b = Math.cos((py * s) + (time * 0.0005) + seed * 0.7);
// // // //     return (a + b) * 0.5;
// // // //   }

// // // //   function applyForces(now) {
// // // //     const time = now - t0;

// // // //     // pointer fades out smoothly after inactivity
// // // //     const idle = now - pointer.lastHit;
// // // //     const pointerStrength = pointer.active ? clamp(1 - idle / 1200, 0, 1) : 0;

// // // //     const pr = cfg.influenceRadius;
// // // //     const pr2 = pr * pr;

// // // //     for (let i = 0; i < pts.length; i++) {
// // // //       const p = pts[i];

// // // //       // wind motion around origin position
// // // //       const wx = wind(p.ox, p.oy, time, p.seed) * cfg.windStrength;
// // // //       const wy = wind(p.oy, p.ox, time, p.seed * 1.31) * cfg.windStrength;

// // // //       // spring back to origin (elastic net)
// // // //       const ax0 = (p.ox - p.x) * cfg.relax + wx * 0.22;
// // // //       const ay0 = (p.oy - p.y) * cfg.relax + wy * 0.22;

// // // //       p.vx = (p.vx + ax0) * cfg.damping;
// // // //       p.vy = (p.vy + ay0) * cfg.damping;

// // // //       // interactive distortion
// // // //       if (pointerStrength > 0) {
// // // //         const dx = p.x - pointer.x;
// // // //         const dy = p.y - pointer.y;
// // // //         const d2 = dx * dx + dy * dy;

// // // //         if (d2 < pr2) {
// // // //           const d = Math.sqrt(d2) || 0.0001;
// // // //           const falloff = (1 - d / pr);
// // // //           // push away from pointer direction + slight drag along swipe
// // // //           const push = falloff * cfg.pokeStrength * pointerStrength;
// // // //           const nx = dx / d;
// // // //           const ny = dy / d;

// // // //           // "break/distort pulse" stronger when pressing/touching
// // // //           const press = pointer.down ? 1 : 0.35;
// // // //           const burst = falloff * cfg.breakStrength * press * pointerStrength;

// // // //           // add force
// // // //           p.vx += nx * push * 0.9 + (pointer.dx * 0.02) * burst;
// // // //           p.vy += ny * push * 0.9 + (pointer.dy * 0.02) * burst;

// // // //           // clamp displacement to keep it coherent (avoid ugly snapping)
// // // //           const ddx = p.x - p.ox;
// // // //           const ddy = p.y - p.oy;
// // // //           const disp = Math.sqrt(ddx * ddx + ddy * ddy);
// // // //           if (disp > cfg.maxDisplacement) {
// // // //             const k = cfg.maxDisplacement / disp;
// // // //             p.x = p.ox + ddx * k;
// // // //             p.y = p.oy + ddy * k;
// // // //             p.vx *= 0.55;
// // // //             p.vy *= 0.55;
// // // //           }
// // // //         }
// // // //       }

// // // //       p.x += p.vx;
// // // //       p.y += p.vy;
// // // //     }
// // // //   }

// // // //   function draw(now) {
// // // //     ctx.clearRect(0, 0, w, h);

// // // //     // subtle global fade for smoothness
// // // //     // (keeps it crisp without heavy trails)
// // // //     // ctx.fillStyle = "rgba(0,0,0,0.02)";
// // // //     // ctx.fillRect(0, 0, w, h);

// // // //     ctx.lineWidth = cfg.lineWidth;

// // // //     // draw connections (grid + diagonals -> “web/net” feel)
// // // //     for (let y = 0; y < rows; y++) {
// // // //       for (let x = 0; x < cols; x++) {
// // // //         const p = pts[idx(x, y)];
// // // //         if (!p) continue;

// // // //         // primary lines: right + down
// // // //         if (x + 1 < cols) stroke(p, pts[idx(x + 1, y)], cfg.color);
// // // //         if (y + 1 < rows) stroke(p, pts[idx(x, y + 1)], cfg.color);

// // // //         // diagonals (web effect)
// // // //         if (x + 1 < cols && y + 1 < rows) stroke(p, pts[idx(x + 1, y + 1)], cfg.color2);
// // // //         if (x + 1 < cols && y - 1 >= 0) stroke(p, pts[idx(x + 1, y - 1)], cfg.color2);
// // // //       }
// // // //     }

// // // //     // nodes (very subtle)
// // // //     ctx.fillStyle = cfg.nodeFill;
// // // //     for (let i = 0; i < pts.length; i += 3) {
// // // //       const p = pts[i];
// // // //       ctx.beginPath();
// // // //       ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
// // // //       ctx.fill();
// // // //     }
// // // //   }

// // // //   function stroke(a, b, color) {
// // // //     // skip offscreen quickly (tiny perf boost)
// // // //     const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
// // // //     const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
// // // //     if (maxX < -20 || minX > w + 20 || maxY < -20 || minY > h + 20) return;

// // // //     ctx.strokeStyle = color;
// // // //     ctx.beginPath();
// // // //     ctx.moveTo(a.x, a.y);
// // // //     ctx.lineTo(b.x, b.y);
// // // //     ctx.stroke();
// // // //   }

// // // //   function loop(now) {
// // // //     applyForces(now);
// // // //     draw(now);
// // // //     requestAnimationFrame(loop);
// // // //   }

// // // //   NetBackground.mount = mount;
// // // //   NetBackground.detach = detach;

// // // //   window.NetBackground = NetBackground;
// // // // })();








// // // /**
// // //  * Interactive Web/Grid Net Background (Canvas) — with tearing + healing
// // //  * - Full page, behind content, pointer-events none
// // //  * - Wind-like flow + elastic distortion on mouse/touch
// // //  * - Net tears (links break) under strain; heals smoothly after delay
// // //  * - Lightweight + responsive + mobile friendly
// // //  *
// // //  * Usage:
// // //  *   window.NetBackground?.mount({ theme: "dark" | "light" });
// // //  */
// // // (function () {
// // //   const NetBackground = {};

// // //   let canvas, ctx;
// // //   let w = 0, h = 0, dpr = 1;
// // //   let cols = 0, rows = 0;
// // //   let pts = [];            // {ox,oy,x,y,vx,vy,seed}
// // //   let t0 = performance.now();

// // //   // Broken edges store: key -> { tBreak }
// // //   const broken = new Map();

// // //   const cfg = {
// // //     // grid
// // //     spacing: 48,
// // //     jitter: 10,
// // //     lineWidth: 1.05,

// // //     // colors (dark defaults)
// // //     color: "rgba(120, 200, 255, 0.18)",
// // //     color2: "rgba(34, 211, 238, 0.12)",
// // //     nodeFill: "rgba(160, 210, 255, 0.18)",

// // //     // motion
// // //     windStrength: 0.55,
// // //     windScale: 0.0018,
// // //     relax: 0.09,
// // //     damping: 0.86,

// // //     // interaction
// // //     influenceRadius: 160,
// // //     pokeStrength: 2.2,
// // //     breakStrength: 2.6,
// // //     maxDisplacement: 52,

// // //     // tearing
// // //     tearEnabled: true,
// // //     tearThreshold: 1.50,     // lower = easier tearing
// // //     tearCooldownMs: 900,     // stays broken
// // //     tearHealMs: 1800,        // fade back in
// // //     tearMaxPerFrame: 24,     // safety
// // //   };

// // //   // pointer
// // //   const pointer = {
// // //     x: 0, y: 0,
// // //     px: 0, py: 0,
// // //     dx: 0, dy: 0,
// // //     down: false,
// // //     active: false,
// // //     lastHit: 0,
// // //   };

// // //   function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
// // //   function idx(x, y) { return y * cols + x; }

// // //   function edgeKey(a, b) {
// // //     return a < b ? `${a}-${b}` : `${b}-${a}`;
// // //   }

// // //   function edgeBroken(key, now) {
// // //     const info = broken.get(key);
// // //     if (!info) return false;
// // //     const dt = now - info.tBreak;

// // //     // still broken
// // //     if (dt < cfg.tearCooldownMs) return true;

// // //     // healing phase
// // //     if (dt < cfg.tearCooldownMs + cfg.tearHealMs) return false;

// // //     // healed completely
// // //     broken.delete(key);
// // //     return false;
// // //   }

// // //   function edgeHealAlpha(key, now) {
// // //     const info = broken.get(key);
// // //     if (!info) return 1;

// // //     const dt = now - info.tBreak;
// // //     if (dt < cfg.tearCooldownMs) return 0;

// // //     const t = (dt - cfg.tearCooldownMs) / cfg.tearHealMs; // 0..1
// // //     return clamp(t, 0, 1);
// // //   }

// // //   function mount(options = {}) {
// // //     // theme switch
// // //     if (options.theme === "light") {
// // //       cfg.color = "rgba(15, 23, 42, 0.12)";
// // //       cfg.color2 = "rgba(2, 132, 199, 0.10)";
// // //       cfg.nodeFill = "rgba(15, 23, 42, 0.10)";
// // //     }

// // //     // canvas inject
// // //     canvas = document.getElementById("bg-net-canvas");
// // //     if (!canvas) {
// // //       canvas = document.createElement("canvas");
// // //       canvas.id = "bg-net-canvas";
// // //       document.body.appendChild(canvas);
// // //     }

// // //     ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

// // //     // optional vignette
// // //     let vig = document.getElementById("bg-net-vignette");
// // //     if (!vig) {
// // //       vig = document.createElement("div");
// // //       vig.id = "bg-net-vignette";
// // //       document.body.appendChild(vig);
// // //     }

// // //     canvas.style.position = "fixed";
// // //     canvas.style.inset = "0";
// // //     canvas.style.width = "100%";
// // //     canvas.style.height = "100%";
// // //     canvas.style.zIndex = "-1";
// // //     canvas.style.pointerEvents = "none";

// // //     vig.style.position = "fixed";
// // //     vig.style.inset = "0";
// // //     vig.style.zIndex = "-1";
// // //     vig.style.pointerEvents = "none";

// // //     onResize();
// // //     attachEvents();
// // //     requestAnimationFrame(loop);
// // //   }

// // //   function detach() {
// // //     window.removeEventListener("resize", onResize);
// // //     window.removeEventListener("mousemove", onMouseMove, { passive: true });
// // //     window.removeEventListener("mousedown", onMouseDown, { passive: true });
// // //     window.removeEventListener("mouseup", onMouseUp, { passive: true });
// // //     window.removeEventListener("touchstart", onTouchStart, { passive: true });
// // //     window.removeEventListener("touchmove", onTouchMove, { passive: true });
// // //     window.removeEventListener("touchend", onTouchEnd, { passive: true });
// // //   }

// // //   function attachEvents() {
// // //     window.addEventListener("resize", onResize);

// // //     window.addEventListener("mousemove", onMouseMove, { passive: true });
// // //     window.addEventListener("mousedown", onMouseDown, { passive: true });
// // //     window.addEventListener("mouseup", onMouseUp, { passive: true });

// // //     window.addEventListener("touchstart", onTouchStart, { passive: true });
// // //     window.addEventListener("touchmove", onTouchMove, { passive: true });
// // //     window.addEventListener("touchend", onTouchEnd, { passive: true });
// // //   }

// // //   function onResize() {
// // //     dpr = Math.min(window.devicePixelRatio || 1, 2);
// // //     w = Math.floor(window.innerWidth);
// // //     h = Math.floor(window.innerHeight);

// // //     canvas.width = Math.floor(w * dpr);
// // //     canvas.height = Math.floor(h * dpr);
// // //     canvas.style.width = w + "px";
// // //     canvas.style.height = h + "px";
// // //     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

// // //     buildGrid();
// // //   }

// // //   function buildGrid() {
// // //     const s = cfg.spacing;
// // //     cols = Math.ceil(w / s) + 3;
// // //     rows = Math.ceil(h / s) + 3;

// // //     pts = [];
// // //     broken.clear();

// // //     const x0 = -s;
// // //     const y0 = -s;

// // //     for (let y = 0; y < rows; y++) {
// // //       for (let x = 0; x < cols; x++) {
// // //         const ox = x0 + x * s + (Math.random() - 0.5) * cfg.jitter;
// // //         const oy = y0 + y * s + (Math.random() - 0.5) * cfg.jitter;

// // //         pts.push({
// // //           ox, oy,
// // //           x: ox, y: oy,
// // //           vx: 0, vy: 0,
// // //           seed: Math.random() * 1000,
// // //         });
// // //       }
// // //     }
// // //   }

// // //   function onMouseMove(e) {
// // //     pointer.active = true;
// // //     pointer.px = pointer.x;
// // //     pointer.py = pointer.y;
// // //     pointer.x = e.clientX;
// // //     pointer.y = e.clientY;
// // //     pointer.dx = pointer.x - pointer.px;
// // //     pointer.dy = pointer.y - pointer.py;
// // //     pointer.lastHit = performance.now();
// // //   }
// // //   function onMouseDown() { pointer.down = true; pointer.lastHit = performance.now(); }
// // //   function onMouseUp() { pointer.down = false; }

// // //   function onTouchStart(e) {
// // //     if (!e.touches || !e.touches[0]) return;
// // //     pointer.active = true;
// // //     pointer.down = true;
// // //     pointer.px = pointer.x;
// // //     pointer.py = pointer.y;
// // //     pointer.x = e.touches[0].clientX;
// // //     pointer.y = e.touches[0].clientY;
// // //     pointer.dx = pointer.x - pointer.px;
// // //     pointer.dy = pointer.y - pointer.py;
// // //     pointer.lastHit = performance.now();
// // //   }
// // //   function onTouchMove(e) {
// // //     if (!e.touches || !e.touches[0]) return;
// // //     pointer.active = true;
// // //     pointer.px = pointer.x;
// // //     pointer.py = pointer.y;
// // //     pointer.x = e.touches[0].clientX;
// // //     pointer.y = e.touches[0].clientY;
// // //     pointer.dx = pointer.x - pointer.px;
// // //     pointer.dy = pointer.y - pointer.py;
// // //     pointer.lastHit = performance.now();
// // //   }
// // //   function onTouchEnd() { pointer.down = false; }

// // //   // cheap pseudo-noise wind
// // //   function wind(px, py, time, seed) {
// // //     const s = cfg.windScale;
// // //     const a = Math.sin(px * s + time * 0.0006 + seed);
// // //     const b = Math.cos(py * s + time * 0.0005 + seed * 0.7);
// // //     return (a + b) * 0.5;
// // //   }

// // //   function applyForces(now) {
// // //     const time = now - t0;

// // //     // pointer fades after inactivity
// // //     const idle = now - pointer.lastHit;
// // //     const pointerStrength = pointer.active ? clamp(1 - idle / 1200, 0, 1) : 0;

// // //     const pr = cfg.influenceRadius;
// // //     const pr2 = pr * pr;

// // //     for (let i = 0; i < pts.length; i++) {
// // //       const p = pts[i];

// // //       // wind
// // //       const wx = wind(p.ox, p.oy, time, p.seed) * cfg.windStrength;
// // //       const wy = wind(p.oy, p.ox, time, p.seed * 1.31) * cfg.windStrength;

// // //       // spring
// // //       const ax0 = (p.ox - p.x) * cfg.relax + wx * 0.22;
// // //       const ay0 = (p.oy - p.y) * cfg.relax + wy * 0.22;

// // //       p.vx = (p.vx + ax0) * cfg.damping;
// // //       p.vy = (p.vy + ay0) * cfg.damping;

// // //       // interaction
// // //       if (pointerStrength > 0) {
// // //         const dx = p.x - pointer.x;
// // //         const dy = p.y - pointer.y;
// // //         const d2 = dx * dx + dy * dy;

// // //         if (d2 < pr2) {
// // //           const d = Math.sqrt(d2) || 0.0001;
// // //           const falloff = 1 - d / pr;

// // //           const push = falloff * cfg.pokeStrength * pointerStrength;
// // //           const nx = dx / d;
// // //           const ny = dy / d;

// // //           // stronger on press for tearing
// // //           const press = pointer.down ? 1.6 : 0.35;
// // //           const burst = falloff * cfg.breakStrength * press * pointerStrength;

// // //           p.vx += nx * push * 0.9 + (pointer.dx * 0.02) * burst;
// // //           p.vy += ny * push * 0.9 + (pointer.dy * 0.02) * burst;

// // //           // clamp displacement
// // //           const ddx = p.x - p.ox;
// // //           const ddy = p.y - p.oy;
// // //           const disp = Math.sqrt(ddx * ddx + ddy * ddy);
// // //           if (disp > cfg.maxDisplacement) {
// // //             const k = cfg.maxDisplacement / disp;
// // //             p.x = p.ox + ddx * k;
// // //             p.y = p.oy + ddy * k;
// // //             p.vx *= 0.55;
// // //             p.vy *= 0.55;
// // //           }
// // //         }
// // //       }

// // //       p.x += p.vx;
// // //       p.y += p.vy;
// // //     }
// // //   }

// // //   function draw(now) {
// // //     ctx.clearRect(0, 0, w, h);
// // //     ctx.lineWidth = cfg.lineWidth;

// // //     // per-frame tear limiter
// // //     draw._tearCount = 0;

// // //     const s = cfg.spacing;
// // //     const diag = s * Math.SQRT2;

// // //     // draw edges
// // //     for (let y = 0; y < rows; y++) {
// // //       for (let x = 0; x < cols; x++) {
// // //         const i0 = idx(x, y);
// // //         const p = pts[i0];
// // //         if (!p) continue;

// // //         // right
// // //         if (x + 1 < cols) {
// // //           const i1 = idx(x + 1, y);
// // //           stroke(i0, i1, cfg.color, s, now);
// // //         }
// // //         // down
// // //         if (y + 1 < rows) {
// // //           const i1 = idx(x, y + 1);
// // //           stroke(i0, i1, cfg.color, s, now);
// // //         }
// // //         // diagonals
// // //         if (x + 1 < cols && y + 1 < rows) {
// // //           const i1 = idx(x + 1, y + 1);
// // //           stroke(i0, i1, cfg.color2, diag, now);
// // //         }
// // //         if (x + 1 < cols && y - 1 >= 0) {
// // //           const i1 = idx(x + 1, y - 1);
// // //           stroke(i0, i1, cfg.color2, diag, now);
// // //         }
// // //       }
// // //     }

// // //     // nodes
// // //     ctx.fillStyle = cfg.nodeFill;
// // //     for (let i = 0; i < pts.length; i += 3) {
// // //       const p = pts[i];
// // //       ctx.beginPath();
// // //       ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
// // //       ctx.fill();
// // //     }
// // //   }
// // //   draw._tearCount = 0;

// // //   function stroke(iA, iB, color, restLen, now) {
// // //     const a = pts[iA];
// // //     const b = pts[iB];
// // //     if (!a || !b) return;

// // //     // offscreen skip
// // //     const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
// // //     const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
// // //     if (maxX < -20 || minX > w + 20 || maxY < -20 || minY > h + 20) return;

// // //     const key = edgeKey(iA, iB);

// // //     // measure strain
// // //     const dx = a.x - b.x;
// // //     const dy = a.y - b.y;
// // //     const len = Math.sqrt(dx * dx + dy * dy);

// // //     // tear if overstretched
// // //     if (cfg.tearEnabled && len > restLen * cfg.tearThreshold) {
// // //       if (draw._tearCount < cfg.tearMaxPerFrame) {
// // //         broken.set(key, { tBreak: now });
// // //         draw._tearCount++;
// // //       }
// // //       return;
// // //     }

// // //     // if currently broken, don’t draw
// // //     if (cfg.tearEnabled && edgeBroken(key, now)) return;

// // //     // healing alpha (0→1)
// // //     const heal = cfg.tearEnabled ? edgeHealAlpha(key, now) : 1;
// // //     if (heal <= 0.01) return;

// // //     ctx.save();
// // //     ctx.globalAlpha *= heal;
// // //     ctx.strokeStyle = color;
// // //     ctx.beginPath();
// // //     ctx.moveTo(a.x, a.y);
// // //     ctx.lineTo(b.x, b.y);
// // //     ctx.stroke();
// // //     ctx.restore();
// // //   }

// // //   function loop(now) {
// // //     applyForces(now);
// // //     draw(now);
// // //     requestAnimationFrame(loop);
// // //   }

// // //   NetBackground.mount = mount;
// // //   NetBackground.detach = detach;
// // //   window.NetBackground = NetBackground;
// // // })();













// /**
//  * Interactive Web/Grid Net Background (Canvas) — REAL snapping (path cut) + healing
//  * - Full page, behind content, pointer-events none
//  * - Wind flow + elastic distortion
//  * - Snap behavior: moving pointer A→B cuts links along the path (feels "real")
//  * - Also tears under strain; heals after delay
//  */
// (function () {
//   const NetBackground = {};

//   let canvas, ctx;
//   let w = 0, h = 0, dpr = 1;
//   let cols = 0, rows = 0;
//   let pts = [];
//   let t0 = performance.now();

//   // Broken edges: key -> { tBreak }
//   const broken = new Map();

//   const cfg = {
//     // grid
//     spacing: 50,
//     jitter: 10,
//     lineWidth: 1.05,

//     // colors (dark default)
//     color: "rgba(120, 200, 255, 0.18)",
//     color2: "rgba(34, 211, 238, 0.12)",
//     nodeFill: "rgba(160, 210, 255, 0.18)",

//     // wind + relax
//     windStrength: 0.55,
//     windScale: 0.0018,
//     relax: 0.09,
//     damping: 0.86,

//     // interaction distortion
//     influenceRadius: 160,
//     pokeStrength: 2.2,
//     breakStrength: 2.6,
//     maxDisplacement: 52,

//     // tear under strain
//     tearEnabled: true,
//     tearThreshold: 1.50,     // lower = easier tear
//     tearMaxPerFrame: 64,

//     // REAL snap / cut along pointer path
//     cutEnabled: true,
//     cutRadius: 30,           // how close edge must be to pointer path to snap
//     cutStrength: 1.0,        // multiplier for snapping amount
//     cutMaxPerFrame: 120,     // safety cap

//     // healing
//     tearCooldownMs: 1800,     // stays broken
//     tearHealMs: 14400,        // fade in
//   };

//   const pointer = {
//     x: 0, y: 0,
//     px: 0, py: 0,
//     dx: 0, dy: 0,
//     down: false,
//     active: false,
//     lastHit: 0,
//   };

//   // scroll-to-swipe emulation
//   const scrollImpulse = { dx: 0, dy: 0, t: 0 };

//   function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
//   function idx(x, y) { return y * cols + x; }
//   function edgeKey(a, b) { return a < b ? `${a}-${b}` : `${b}-${a}`; }

//   function mount(options = {}) {
//     if (options.theme === "light") {
//       cfg.color = "rgba(15, 23, 42, 0.12)";
//       cfg.color2 = "rgba(2, 132, 199, 0.10)";
//       cfg.nodeFill = "rgba(15, 23, 42, 0.10)";
//     }

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

//     window.removeEventListener("wheel", onWheel, { passive: true });
//   }

//   function attachEvents() {
//     window.addEventListener("resize", onResize);

//     window.addEventListener("mousemove", onMouseMove, { passive: true });
//     window.addEventListener("mousedown", onMouseDown, { passive: true });
//     window.addEventListener("mouseup", onMouseUp, { passive: true });

//     window.addEventListener("touchstart", onTouchStart, { passive: true });
//     window.addEventListener("touchmove", onTouchMove, { passive: true });
//     window.addEventListener("touchend", onTouchEnd, { passive: true });

//     // scroll snap feel (treat scroll as swipe)
//     window.addEventListener("wheel", onWheel, { passive: true });
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

//     const x0 = -s, y0 = -s;

//     for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//         const ox = x0 + x * s + (Math.random() - 0.5) * cfg.jitter;
//         const oy = y0 + y * s + (Math.random() - 0.5) * cfg.jitter;

//         pts.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0, seed: Math.random() * 1000 });
//       }
//     }
//   }

//   function onMouseMove(e) {
//     pointer.active = true;
//     pointer.px = pointer.x; pointer.py = pointer.y;
//     pointer.x = e.clientX; pointer.y = e.clientY;
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
//     pointer.px = pointer.x; pointer.py = pointer.y;
//     pointer.x = e.touches[0].clientX; pointer.y = e.touches[0].clientY;
//     pointer.dx = pointer.x - pointer.px;
//     pointer.dy = pointer.y - pointer.py;
//     pointer.lastHit = performance.now();
//   }
//   function onTouchMove(e) {
//     if (!e.touches || !e.touches[0]) return;
//     pointer.active = true;
//     pointer.px = pointer.x; pointer.py = pointer.y;
//     pointer.x = e.touches[0].clientX; pointer.y = e.touches[0].clientY;
//     pointer.dx = pointer.x - pointer.px;
//     pointer.dy = pointer.y - pointer.py;
//     pointer.lastHit = performance.now();
//   }
//   function onTouchEnd() { pointer.down = false; }

//   function onWheel(e) {
//     // store an impulse that fades quickly; we will use it to “cut” vertically
//     scrollImpulse.dx += e.deltaX;
//     scrollImpulse.dy += e.deltaY;
//     scrollImpulse.t = performance.now();
//   }

//   function wind(px, py, time, seed) {
//     const s = cfg.windScale;
//     const a = Math.sin(px * s + time * 0.0006 + seed);
//     const b = Math.cos(py * s + time * 0.0005 + seed * 0.7);
//     return (a + b) * 0.5;
//   }

//   function edgeIsBroken(key, now) {
//     const info = broken.get(key);
//     if (!info) return false;
//     const dt = now - info.tBreak;
//     if (dt < cfg.tearCooldownMs) return true;
//     if (dt < cfg.tearCooldownMs + cfg.tearHealMs) return false;
//     broken.delete(key);
//     return false;
//   }

//   function edgeHealAlpha(key, now) {
//     const info = broken.get(key);
//     if (!info) return 1;
//     const dt = now - info.tBreak;
//     if (dt < cfg.tearCooldownMs) return 0;
//     return clamp((dt - cfg.tearCooldownMs) / cfg.tearHealMs, 0, 1);
//   }

//   // Distance between segment AB and segment CD (fast enough for our sizes)
//   function segSegDist2(ax, ay, bx, by, cx, cy, dx, dy) {
//     // Approx approach: take min distance from each endpoint to other segment.
//     // (Good enough visually + fast)
//     return Math.min(
//       pointSegDist2(ax, ay, cx, cy, dx, dy),
//       pointSegDist2(bx, by, cx, cy, dx, dy),
//       pointSegDist2(cx, cy, ax, ay, bx, by),
//       pointSegDist2(dx, dy, ax, ay, bx, by)
//     );
//   }

//   function pointSegDist2(px, py, ax, ay, bx, by) {
//     const abx = bx - ax, aby = by - ay;
//     const apx = px - ax, apy = py - ay;
//     const ab2 = abx * abx + aby * aby || 0.0001;
//     let t = (apx * abx + apy * aby) / ab2;
//     t = clamp(t, 0, 1);
//     const x = ax + abx * t, y = ay + aby * t;
//     const dx = px - x, dy = py - y;
//     return dx * dx + dy * dy;
//   }

//   function cutEdgesAlongPath(x1, y1, x2, y2, now, cutBudget) {
//     if (!cfg.cutEnabled) return 0;

//     const vx = x2 - x1, vy = y2 - y1;
//     const speed = Math.hypot(vx, vy);

//     // don't cut if barely moved
//     if (speed < 2) return 0;

//     // more speed = more snapping
//     const radius = cfg.cutRadius * (0.9 + clamp(speed / 24, 0, 1) * 1.6) * cfg.cutStrength;
//     const r2 = radius * radius;

//     let cutCount = 0;
//     const s = cfg.spacing;
//     const diag = s * Math.SQRT2;

//     // Estimate which grid cells near the path to scan (fast culling)
//     const minX = Math.min(x1, x2) - radius - s;
//     const maxX = Math.max(x1, x2) + radius + s;
//     const minY = Math.min(y1, y2) - radius - s;
//     const maxY = Math.max(y1, y2) + radius + s;

//     // convert bounds to grid index range
//     const gx0 = clamp(Math.floor((minX + s) / s), 0, cols - 1);
//     const gx1 = clamp(Math.ceil((maxX + s) / s), 0, cols - 1);
//     const gy0 = clamp(Math.floor((minY + s) / s), 0, rows - 1);
//     const gy1 = clamp(Math.ceil((maxY + s) / s), 0, rows - 1);

//     for (let gy = gy0; gy <= gy1; gy++) {
//       for (let gx = gx0; gx <= gx1; gx++) {
//         const i0 = idx(gx, gy);
//         const p = pts[i0];
//         if (!p) continue;

//         // right, down, diag links from this node
//         const neighbors = [];

//         if (gx + 1 < cols) neighbors.push([i0, idx(gx + 1, gy), s]);
//         if (gy + 1 < rows) neighbors.push([i0, idx(gx, gy + 1), s]);
//         if (gx + 1 < cols && gy + 1 < rows) neighbors.push([i0, idx(gx + 1, gy + 1), diag]);
//         if (gx + 1 < cols && gy - 1 >= 0) neighbors.push([i0, idx(gx + 1, gy - 1), diag]);

//         for (const [ia, ib] of neighbors) {
//           if (cutCount >= cutBudget) return cutCount;

//           const a = pts[ia], b = pts[ib];
//           const k = edgeKey(ia, ib);
//           if (!a || !b) continue;

//           // already broken recently? skip
//           const heal = edgeHealAlpha(k, now);
//           if (heal === 0) continue;

//           // if edge is close to pointer path, snap it
//           const d2 = segSegDist2(x1, y1, x2, y2, a.x, a.y, b.x, b.y);
//           if (d2 <= r2) {
//             broken.set(k, { tBreak: now });
//             cutCount++;
//           }
//         }
//       }
//     }

//     return cutCount;
//   }

//   function applyForces(now) {
//     const time = now - t0;

//     const idle = now - pointer.lastHit;
//     const pointerStrength = pointer.active ? clamp(1 - idle / 1200, 0, 1) : 0;

//     const pr = cfg.influenceRadius;
//     const pr2 = pr * pr;

//     for (let i = 0; i < pts.length; i++) {
//       const p = pts[i];

//       const wx = wind(p.ox, p.oy, time, p.seed) * cfg.windStrength;
//       const wy = wind(p.oy, p.ox, time, p.seed * 1.31) * cfg.windStrength;

//       const ax0 = (p.ox - p.x) * cfg.relax + wx * 0.22;
//       const ay0 = (p.oy - p.y) * cfg.relax + wy * 0.22;

//       p.vx = (p.vx + ax0) * cfg.damping;
//       p.vy = (p.vy + ay0) * cfg.damping;

//       if (pointerStrength > 0) {
//         const dx = p.x - pointer.x;
//         const dy = p.y - pointer.y;
//         const d2 = dx * dx + dy * dy;

//         if (d2 < pr2) {
//           const d = Math.sqrt(d2) || 0.0001;
//           const falloff = 1 - d / pr;

//           const push = falloff * cfg.pokeStrength * pointerStrength;
//           const nx = dx / d, ny = dy / d;

//           // stronger when pressed
//           const press = pointer.down ? 1.8 : 0.35;
//           const burst = falloff * cfg.breakStrength * press * pointerStrength;

//           p.vx += nx * push * 0.9 + (pointer.dx * 0.02) * burst;
//           p.vy += ny * push * 0.9 + (pointer.dy * 0.02) * burst;

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

//     draw._tearCount = 0;

//     // REAL SNAP: cut edges along pointer path each frame
//     if (cfg.cutEnabled) {
//       const budget = cfg.cutMaxPerFrame;

//       // pointer path cut
//       if (pointer.active) {
//         cutEdgesAlongPath(pointer.px, pointer.py, pointer.x, pointer.y, now, budget);
//       }

//       // scroll cut: treat scroll as vertical swipe near center
//       const dt = now - scrollImpulse.t;
//       if (dt < 120) {
//         const fade = 1 - dt / 120;
//         const sx = w * 0.5;
//         const sy = h * 0.5;
//         const dy = scrollImpulse.dy * 0.35 * fade;

//         cutEdgesAlongPath(sx, sy - dy, sx, sy + dy, now, budget);
//         scrollImpulse.dy *= 0.75;
//         scrollImpulse.dx *= 0.75;
//       }
//     }

//     const s = cfg.spacing;
//     const diag = s * Math.SQRT2;

//     for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//         const i0 = idx(x, y);
//         const p = pts[i0];
//         if (!p) continue;

//         if (x + 1 < cols) stroke(i0, idx(x + 1, y), cfg.color, s, now);
//         if (y + 1 < rows) stroke(i0, idx(x, y + 1), cfg.color, s, now);

//         if (x + 1 < cols && y + 1 < rows) stroke(i0, idx(x + 1, y + 1), cfg.color2, diag, now);
//         if (x + 1 < cols && y - 1 >= 0) stroke(i0, idx(x + 1, y - 1), cfg.color2, diag, now);
//       }
//     }

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
//     const a = pts[iA], b = pts[iB];
//     if (!a || !b) return;

//     const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
//     const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
//     if (maxX < -20 || minX > w + 20 || maxY < -20 || minY > h + 20) return;

//     const key = edgeKey(iA, iB);

//     // strain tear (secondary)
//     if (cfg.tearEnabled) {
//       const dx = a.x - b.x, dy = a.y - b.y;
//       const len = Math.sqrt(dx * dx + dy * dy);
//       if (len > restLen * cfg.tearThreshold) {
//         if (draw._tearCount < cfg.tearMaxPerFrame) {
//           broken.set(key, { tBreak: now });
//           draw._tearCount++;
//         }
//         return;
//       }
//     }

//     if (cfg.tearEnabled && edgeIsBroken(key, now)) return;

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












// // (function () {
// //   const NetBackground = {};

// //   // --------------------------
// //   // Canvas + State
// //   // --------------------------
// //   let canvas, ctx;
// //   let w = 0, h = 0, dpr = 1;

// //   // Web points
// //   let cols = 0, rows = 0;
// //   let pts = [];          // {ox,oy,x,y,vx,vy,phase}
// //   let t0 = performance.now();

// //   // Moving nodes (colored)
// //   let nodes = [];        // {x,y,vx,vy,r,color,seed,lastSnap}
// //   let particles = [];    // {x,y,vx,vy,life,maxLife,size,color}

// //   // Audio
// //   let audio = {
// //     enabled: true,
// //     ctx: null,
// //     unlocked: false,
// //     gain: null,
// //   };

// //   // Pointer / touch / swipe
// //   const pointer = {
// //     x: 0, y: 0,
// //     px: 0, py: 0,
// //     vx: 0, vy: 0,
// //     down: false,
// //     active: false,
// //     lastMove: 0,
// //   };

// //   // scroll -> swipe impulse
// //   const scrollImpulse = { dx: 0, dy: 0, t: 0 };

// //   // Snap cooldown (global + per-node)
// //   const snapMemory = new Map(); // key -> timestamp

// //   // --------------------------
// //   // Config (tuned for “portfolio subtle”)
// //   // --------------------------
// //   const cfg = {
// //     // Net geometry
// //     spacing: 110,        // larger = lighter net (good for portfolio)
// //     jitter: 22,
// //     maxLinks: 5,

// //     // Styling
// //     lineWidth: 1.05,
// //     webAlpha: 0.20,
// //     diagAlpha: 0.14,
// //     glowBlur: 10,

// //     // Colors (soft palette)
// //     webColor: (h) => `hsla(${h}, 70%, 75%, 0.35)`,
// //     webColor2: (h) => `hsla(${h}, 70%, 75%, 0.25)`,
// //     palette: [
// //       "rgba(167, 139, 250, 1)", // violet
// //       "rgba(56, 189, 248, 1)",  // sky
// //       "rgba(34, 211, 238, 1)",  // cyan
// //       "rgba(244, 114, 182, 1)", // pink
// //       "rgba(251, 191, 36, 1)",  // amber
// //     ],

// //     // Web motion
// //     relax: 0.045,        // spring to origin
// //     damping: 0.90,
// //     windStrength: 0.62,
// //     windScale: 0.0016,
// //     windSpeed: 0.35,

// //     // Pointer interaction
// //     influenceRadius: 190,
// //     pointerForce: 1.15,

// //     // Nodes
// //     nodeCount: 16,
// //     nodeSpeed: 0.55,
// //     nodeRadiusMin: 1.6,
// //     nodeRadiusMax: 3.4,
// //     nodeGlow: 12,
// //     nodeAlpha: 0.90,

// //     // Snap interaction (node touches net line)
// //     snapDistance: 14,        // px distance to segment
// //     snapCooldownMs: 140,     // per edge key cooldown
// //     snapImpulse: 1.15,       // distortion strength on snap

// //     // Particles / fireworks (subtle)
// //     burstCount: 18,
// //     particleLifeMin: 380,
// //     particleLifeMax: 760,
// //     particleSpeedMin: 0.35,
// //     particleSpeedMax: 1.25,
// //     particleSizeMin: 0.9,
// //     particleSizeMax: 2.2,
// //     maxParticles: 650,

// //     // Audio (subtle)
// //     soundEnabled: true,
// //     soundVolume: 0.06,
// //     soundHzMin: 420,
// //     soundHzMax: 760,
// //     soundDecay: 0.06,

// //     // Accessibility
// //     respectReducedMotion: true,
// //   };

// //   let reducedMotion = false;

// //   // --------------------------
// //   // Helpers
// //   // --------------------------
// //   function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
// //   function lerp(a, b, t) { return a + (b - a) * t; }
// //   function rand(a, b) { return a + Math.random() * (b - a); }

// //   function idx(x, y) { return y * cols + x; }
// //   function edgeKey(a, b) { return a < b ? `${a}-${b}` : `${b}-${a}`; }

// //   function ensureAudioUnlocked() {
// //     if (!cfg.soundEnabled) return;
// //     if (audio.unlocked) return;

// //     try {
// //       const AC = window.AudioContext || window.webkitAudioContext;
// //       audio.ctx = new AC();
// //       audio.gain = audio.ctx.createGain();
// //       audio.gain.gain.value = cfg.soundVolume;
// //       audio.gain.connect(audio.ctx.destination);
// //       audio.unlocked = true;
// //     } catch {
// //       audio.unlocked = false;
// //     }
// //   }

// //   function playSnapSound(intensity = 1) {
// //     if (!cfg.soundEnabled) return;
// //     if (!audio.unlocked || !audio.ctx || !audio.gain) return;

// //     const ctxA = audio.ctx;
// //     const now = ctxA.currentTime;

// //     const osc = ctxA.createOscillator();
// //     const gain = ctxA.createGain();
// //     const filter = ctxA.createBiquadFilter();

// //     filter.type = "lowpass";
// //     filter.frequency.setValueAtTime(1400, now);

// //     const f0 = rand(cfg.soundHzMin, cfg.soundHzMax);
// //     osc.type = "sine";
// //     osc.frequency.setValueAtTime(f0, now);
// //     osc.frequency.exponentialRampToValueAtTime(f0 * 0.82, now + cfg.soundDecay);

// //     const vol = cfg.soundVolume * (0.6 + 0.8 * intensity);
// //     gain.gain.setValueAtTime(0.0001, now);
// //     gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol), now + 0.006);
// //     gain.gain.exponentialRampToValueAtTime(0.0001, now + cfg.soundDecay);

// //     osc.connect(filter);
// //     filter.connect(gain);
// //     gain.connect(audio.gain);

// //     osc.start(now);
// //     osc.stop(now + cfg.soundDecay + 0.02);
// //   }

// //   function pointSegDist(px, py, ax, ay, bx, by) {
// //     const abx = bx - ax, aby = by - ay;
// //     const apx = px - ax, apy = py - ay;
// //     const ab2 = abx * abx + aby * aby || 0.0001;
// //     let t = (apx * abx + apy * aby) / ab2;
// //     t = clamp(t, 0, 1);
// //     const cx = ax + abx * t;
// //     const cy = ay + aby * t;
// //     const dx = px - cx, dy = py - cy;
// //     return { d: Math.sqrt(dx * dx + dy * dy), cx, cy, t };
// //   }

// //   // Convert screen position -> approximate grid cell
// //   function gridCoord(x, y) {
// //     const s = cfg.spacing;
// //     // We build grid with an offset of -s
// //     const gx = Math.floor((x + s) / s);
// //     const gy = Math.floor((y + s) / s);
// //     return {
// //       gx: clamp(gx, 0, cols - 1),
// //       gy: clamp(gy, 0, rows - 1),
// //     };
// //   }

// //   // --------------------------
// //   // Mount / Detach
// //   // --------------------------
// //   function mount(options = {}) {
// //     // Allow theme override
// //     if (options.theme === "light") {
// //       // For light backgrounds: darker lines, less vignette feel
// //       cfg.webAlpha = 0.14;
// //       cfg.diagAlpha = 0.10;
// //     }

// //     // Optional runtime overrides
// //     Object.assign(cfg, options || {});

// //     reducedMotion = cfg.respectReducedMotion
// //       && window.matchMedia
// //       && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// //     canvas = document.getElementById("bg-net-canvas");
// //     if (!canvas) {
// //       canvas = document.createElement("canvas");
// //       canvas.id = "bg-net-canvas";
// //       document.body.appendChild(canvas);
// //     }

// //     ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

// //     // Vignette layer
// //     let vig = document.getElementById("bg-net-vignette");
// //     if (!vig) {
// //       vig = document.createElement("div");
// //       vig.id = "bg-net-vignette";
// //       document.body.appendChild(vig);
// //     }

// //     // Keep behind content
// //     canvas.style.position = "fixed";
// //     canvas.style.inset = "0";
// //     canvas.style.width = "100%";
// //     canvas.style.height = "100%";
// //     canvas.style.zIndex = "-1";
// //     canvas.style.pointerEvents = "none";
// //     canvas.style.display = "block";

// //     vig.style.position = "fixed";
// //     vig.style.inset = "0";
// //     vig.style.zIndex = "-1";
// //     vig.style.pointerEvents = "none";

// //     onResize();
// //     buildNodes();

// //     attachEvents();
// //     requestAnimationFrame(loop);
// //   }

// //   function detach() {
// //     window.removeEventListener("resize", onResize);
// //     window.removeEventListener("pointermove", onPointerMove, { passive: true });
// //     window.removeEventListener("pointerdown", onPointerDown, { passive: true });
// //     window.removeEventListener("pointerup", onPointerUp, { passive: true });

// //     window.removeEventListener("touchstart", onTouchStart, { passive: true });
// //     window.removeEventListener("touchmove", onTouchMove, { passive: true });
// //     window.removeEventListener("touchend", onTouchEnd, { passive: true });

// //     window.removeEventListener("wheel", onWheel, { passive: true });
// //   }

// //   // --------------------------
// //   // Events
// //   // --------------------------
// //   function attachEvents() {
// //     window.addEventListener("resize", onResize);

// //     // pointer events (best for mouse + touch)
// //     window.addEventListener("pointermove", onPointerMove, { passive: true });
// //     window.addEventListener("pointerdown", onPointerDown, { passive: true });
// //     window.addEventListener("pointerup", onPointerUp, { passive: true });

// //     // touch fallback
// //     window.addEventListener("touchstart", onTouchStart, { passive: true });
// //     window.addEventListener("touchmove", onTouchMove, { passive: true });
// //     window.addEventListener("touchend", onTouchEnd, { passive: true });

// //     // scroll -> swipe feel
// //     window.addEventListener("wheel", onWheel, { passive: true });
// //   }

// //   function onPointerMove(e) {
// //     pointer.active = true;
// //     pointer.px = pointer.x; pointer.py = pointer.y;
// //     pointer.x = e.clientX; pointer.y = e.clientY;
// //     pointer.vx = pointer.x - pointer.px;
// //     pointer.vy = pointer.y - pointer.py;
// //     pointer.lastMove = performance.now();
// //   }

// //   function onPointerDown(e) {
// //     pointer.down = true;
// //     pointer.active = true;
// //     pointer.px = pointer.x; pointer.py = pointer.y;
// //     pointer.x = e.clientX; pointer.y = e.clientY;
// //     pointer.lastMove = performance.now();

// //     // unlock audio on first user gesture
// //     ensureAudioUnlocked();
// //   }

// //   function onPointerUp() {
// //     pointer.down = false;
// //   }

// //   function onTouchStart(e) {
// //     if (!e.touches || !e.touches[0]) return;
// //     pointer.active = true;
// //     pointer.down = true;
// //     pointer.px = pointer.x; pointer.py = pointer.y;
// //     pointer.x = e.touches[0].clientX;
// //     pointer.y = e.touches[0].clientY;
// //     pointer.lastMove = performance.now();

// //     ensureAudioUnlocked();
// //   }

// //   function onTouchMove(e) {
// //     if (!e.touches || !e.touches[0]) return;
// //     pointer.active = true;
// //     pointer.px = pointer.x; pointer.py = pointer.y;
// //     pointer.x = e.touches[0].clientX;
// //     pointer.y = e.touches[0].clientY;
// //     pointer.vx = pointer.x - pointer.px;
// //     pointer.vy = pointer.y - pointer.py;
// //     pointer.lastMove = performance.now();
// //   }

// //   function onTouchEnd() {
// //     pointer.down = false;
// //   }

// //   function onWheel(e) {
// //     scrollImpulse.dx += e.deltaX;
// //     scrollImpulse.dy += e.deltaY;
// //     scrollImpulse.t = performance.now();
// //   }

// //   // --------------------------
// //   // Resize + Build
// //   // --------------------------
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
// //     const s = cfg.spacing;
// //     cols = Math.ceil(w / s) + 3;
// //     rows = Math.ceil(h / s) + 3;

// //     pts = [];
// //     snapMemory.clear();

// //     const x0 = -s;
// //     const y0 = -s;

// //     for (let gy = 0; gy < rows; gy++) {
// //       for (let gx = 0; gx < cols; gx++) {
// //         const ox = x0 + gx * s + (Math.random() - 0.5) * cfg.jitter;
// //         const oy = y0 + gy * s + (Math.random() - 0.5) * cfg.jitter;

// //         pts.push({
// //           ox, oy,
// //           x: ox, y: oy,
// //           vx: 0, vy: 0,
// //           phase: Math.random() * Math.PI * 2,
// //           seed: Math.random() * 999,
// //         });
// //       }
// //     }
// //   }

// //   function buildNodes() {
// //     nodes = new Array(cfg.nodeCount).fill(0).map(() => {
// //       const color = cfg.palette[(Math.random() * cfg.palette.length) | 0];
// //       return {
// //         x: Math.random() * w,
// //         y: Math.random() * h,
// //         vx: (Math.random() - 0.5) * cfg.nodeSpeed,
// //         vy: (Math.random() - 0.5) * cfg.nodeSpeed,
// //         r: rand(cfg.nodeRadiusMin, cfg.nodeRadiusMax),
// //         color,
// //         seed: Math.random() * 1000,
// //         lastSnap: 0,
// //       };
// //     });
// //   }

// //   // --------------------------
// //   // Motion fields
// //   // --------------------------
// //   function wind(x, y, time, phase) {
// //     const s = cfg.windScale;
// //     const a = Math.sin(x * s + time * 0.0006 + phase);
// //     const b = Math.cos(y * s + time * 0.0005 + phase * 0.7);
// //     return (a + b) * 0.5;
// //   }

// //   // --------------------------
// //   // Update
// //   // --------------------------
// //   function applyForces(now) {
// //     const time = now - t0;
// //     const motionScale = reducedMotion ? 0.25 : 1;

// //     // decay pointer activity if idle
// //     const idle = now - pointer.lastMove;
// //     const pointerStrength = pointer.active ? clamp(1 - idle / 900, 0, 1) : 0;

// //     // Web points: spring back + wind + pointer warping
// //     const pr = cfg.influenceRadius;
// //     const pr2 = pr * pr;

// //     for (let i = 0; i < pts.length; i++) {
// //       const p = pts[i];

// //       const wx = wind(p.ox, p.oy, time * cfg.windSpeed, p.seed) * cfg.windStrength * motionScale;
// //       const wy = wind(p.oy, p.ox, time * cfg.windSpeed, p.seed * 1.31) * cfg.windStrength * motionScale;

// //       // spring to origin + wind
// //       const ax = (p.ox - p.x) * cfg.relax + wx * 0.35;
// //       const ay = (p.oy - p.y) * cfg.relax + wy * 0.35;

// //       p.vx = (p.vx + ax) * cfg.damping;
// //       p.vy = (p.vy + ay) * cfg.damping;

// //       // pointer influence (silk warp)
// //       if (pointerStrength > 0) {
// //         const dx = p.x - pointer.x;
// //         const dy = p.y - pointer.y;
// //         const d2 = dx * dx + dy * dy;

// //         if (d2 < pr2) {
// //           const d = Math.sqrt(d2) || 0.0001;
// //           const falloff = (1 - d / pr) * pointerStrength;

// //           // push away gently + slight tangential curl (web feel)
// //           const nx = dx / d, ny = dy / d;
// //           const tx = -ny, ty = nx;

// //           const press = pointer.down ? 1.4 : 0.5;
// //           const f = falloff * cfg.pointerForce * press * motionScale;

// //           p.vx += nx * f * 0.35 + tx * f * 0.22;
// //           p.vy += ny * f * 0.35 + ty * f * 0.22;
// //         }
// //       }

// //       p.x += p.vx;
// //       p.y += p.vy;
// //     }

// //     // Nodes: smooth wandering + pointer nudge
// //     for (const n of nodes) {
// //       const ax = Math.sin((time * 0.001) * 0.6 + n.seed) * 0.12 * motionScale;
// //       const ay = Math.cos((time * 0.001) * 0.55 + n.seed * 1.3) * 0.12 * motionScale;

// //       n.vx += ax;
// //       n.vy += ay;

// //       if (pointerStrength > 0) {
// //         const dx = n.x - pointer.x;
// //         const dy = n.y - pointer.y;
// //         const d2 = dx * dx + dy * dy;
// //         if (d2 < pr2) {
// //           const d = Math.sqrt(d2) || 0.0001;
// //           const falloff = (1 - d / pr) * pointerStrength;
// //           const f = falloff * 0.22 * cfg.pointerForce * motionScale;
// //           n.vx += (dx / d) * f;
// //           n.vy += (dy / d) * f;
// //         }
// //       }

// //       n.vx *= 0.985;
// //       n.vy *= 0.985;

// //       n.x += n.vx * 1.6;
// //       n.y += n.vy * 1.6;

// //       // wrap (no harsh bounces)
// //       if (n.x < -40) n.x = w + 40;
// //       if (n.x > w + 40) n.x = -40;
// //       if (n.y < -40) n.y = h + 40;
// //       if (n.y > h + 40) n.y = -40;

// //       // Snap interaction: node near nearby net segments (LOCAL scan)
// //       maybeSnapNode(n, now, motionScale);
// //     }

// //     // Scroll impulse -> mild “swipe” effect
// //     const dtScroll = now - scrollImpulse.t;
// //     if (dtScroll < 140) {
// //       const fade = 1 - dtScroll / 140;
// //       // treat as a vertical swirl around center
// //       const sx = w * 0.5, sy = h * 0.5;
// //       const impulse = (scrollImpulse.dy * 0.0009) * fade * motionScale;

// //       const { gx, gy } = gridCoord(sx, sy);
// //       disturbCell(gx, gy, impulse * 60);

// //       scrollImpulse.dy *= 0.80;
// //       scrollImpulse.dx *= 0.80;
// //     }

// //     // Particles
// //     particles = particles.filter(p => p.life > 0);
// //     for (const p of particles) {
// //       p.life -= 16.7 * motionScale; // ~ms per frame
// //       p.x += p.vx;
// //       p.y += p.vy;
// //       p.vx *= 0.985;
// //       p.vy *= 0.985;
// //     }
// //     if (particles.length > cfg.maxParticles) particles.length = cfg.maxParticles;
// //   }

// //   // local cell disturbance (for snap distortion)
// //   function disturbCell(gx, gy, strength) {
// //     const s = cfg.spacing;
// //     const diag = s * Math.SQRT2;

// //     // affect nearby points around this grid coordinate
// //     for (let oy = -1; oy <= 1; oy++) {
// //       for (let ox = -1; ox <= 1; ox++) {
// //         const x = gx + ox, y = gy + oy;
// //         if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
// //         const p = pts[idx(x, y)];
// //         if (!p) continue;
// //         p.vx += (Math.random() - 0.5) * strength * 0.08;
// //         p.vy += (Math.random() - 0.5) * strength * 0.08;
// //       }
// //     }
// //   }

// //   function maybeSnapNode(n, now, motionScale) {
// //     // per-node cooldown
// //     if (now - n.lastSnap < cfg.snapCooldownMs) return;

// //     const { gx, gy } = gridCoord(n.x, n.y);
// //     const candidates = [];

// //     // Gather neighbor edges from a small neighborhood (fast)
// //     for (let oy = -1; oy <= 1; oy++) {
// //       for (let ox = -1; ox <= 1; ox++) {
// //         const x = gx + ox, y = gy + oy;
// //         if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
// //         const i0 = idx(x, y);

// //         // right, down, diag, anti-diag
// //         if (x + 1 < cols) candidates.push([i0, idx(x + 1, y)]);
// //         if (y + 1 < rows) candidates.push([i0, idx(x, y + 1)]);
// //         if (x + 1 < cols && y + 1 < rows) candidates.push([i0, idx(x + 1, y + 1)]);
// //         if (x + 1 < cols && y - 1 >= 0) candidates.push([i0, idx(x + 1, y - 1)]);
// //       }
// //     }

// //     let best = null;
// //     let bestD = cfg.snapDistance;

// //     for (let k = 0; k < candidates.length; k++) {
// //       const [ia, ib] = candidates[k];
// //       const a = pts[ia], b = pts[ib];
// //       if (!a || !b) continue;

// //       const hit = pointSegDist(n.x, n.y, a.x, a.y, b.x, b.y);
// //       if (hit.d < bestD) {
// //         bestD = hit.d;
// //         best = { ia, ib, x: hit.cx, y: hit.cy, d: hit.d };
// //       }
// //     }

// //     if (!best) return;

// //     // Global edge cooldown to avoid rapid retriggers on same segment
// //     const key = edgeKey(best.ia, best.ib);
// //     const last = snapMemory.get(key) || 0;
// //     if (now - last < cfg.snapCooldownMs) return;
// //     snapMemory.set(key, now);

// //     n.lastSnap = now;

// //     // Intensity based on closeness
// //     const intensity = clamp(1 - best.d / cfg.snapDistance, 0.2, 1);

// //     // Distort web around snap point (impulse)
// //     const { gx: cgx, gy: cgy } = gridCoord(best.x, best.y);
// //     disturbCell(cgx, cgy, cfg.snapImpulse * (10 + intensity * 14) * motionScale);

// //     // Particle burst
// //     spawnBurst(best.x, best.y, n.color, intensity);

// //     // Subtle sound
// //     playSnapSound(intensity);
// //   }

// //   function spawnBurst(x, y, color, intensity) {
// //     const count = Math.floor(cfg.burstCount * (0.75 + 0.5 * intensity));
// //     for (let i = 0; i < count; i++) {
// //       const ang = Math.random() * Math.PI * 2;
// //       const sp = lerp(cfg.particleSpeedMin, cfg.particleSpeedMax, Math.random()) * (0.7 + 0.6 * intensity);
// //       const life = lerp(cfg.particleLifeMin, cfg.particleLifeMax, Math.random());
// //       const size = lerp(cfg.particleSizeMin, cfg.particleSizeMax, Math.random());

// //       particles.push({
// //         x, y,
// //         vx: Math.cos(ang) * sp,
// //         vy: Math.sin(ang) * sp,
// //         life,
// //         maxLife: life,
// //         size,
// //         color,
// //       });
// //     }
// //   }

// //   // --------------------------
// //   // Render
// //   // --------------------------
// //   function draw(now) {
// //     ctx.clearRect(0, 0, w, h);

// //     const time = (now - t0) * 0.001;
// //     const hue = 210 + Math.sin(time * 0.22) * 6;

// //     // Web lines
// //     ctx.save();
// //     ctx.lineWidth = cfg.lineWidth;
// //     ctx.shadowBlur = cfg.glowBlur;
// //     ctx.shadowColor = `hsla(${hue}, 70%, 75%, 0.25)`;

// //     const s = cfg.spacing;
// //     const diag = s * Math.SQRT2;

// //     for (let y = 0; y < rows; y++) {
// //       for (let x = 0; x < cols; x++) {
// //         const i0 = idx(x, y);
// //         const p = pts[i0];
// //         if (!p) continue;

// //         // cull off-screen points lightly
// //         if (p.x < -200 || p.x > w + 200 || p.y < -200 || p.y > h + 200) continue;

// //         // Primary strands
// //         ctx.globalAlpha = cfg.webAlpha;
// //         ctx.strokeStyle = cfg.webColor(hue);

// //         if (x + 1 < cols) stroke(i0, idx(x + 1, y));
// //         if (y + 1 < rows) stroke(i0, idx(x, y + 1));

// //         // Diagonals (lighter)
// //         ctx.globalAlpha = cfg.diagAlpha;
// //         ctx.strokeStyle = cfg.webColor2(hue);

// //         if (x + 1 < cols && y + 1 < rows) stroke(i0, idx(x + 1, y + 1));
// //         if (x + 1 < cols && y - 1 >= 0) stroke(i0, idx(x + 1, y - 1));
// //       }
// //     }

// //     ctx.restore();

// //     // Nodes
// //     ctx.save();
// //     for (const n of nodes) {
// //       ctx.globalAlpha = cfg.nodeAlpha;
// //       ctx.fillStyle = n.color;
// //       ctx.shadowColor = n.color;
// //       ctx.shadowBlur = cfg.nodeGlow;

// //       ctx.beginPath();
// //       ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
// //       ctx.fill();
// //     }
// //     ctx.restore();

// //     // Particles
// //     ctx.save();
// //     for (const p of particles) {
// //       const a = clamp(p.life / p.maxLife, 0, 1);
// //       ctx.globalAlpha = a * 0.65;
// //       ctx.fillStyle = p.color;
// //       ctx.shadowColor = p.color;
// //       ctx.shadowBlur = 12;

// //       ctx.beginPath();
// //       ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
// //       ctx.fill();
// //     }
// //     ctx.restore();
// //   }

// //   function stroke(iA, iB) {
// //     const a = pts[iA], b = pts[iB];
// //     if (!a || !b) return;

// //     // quick bounds cull
// //     const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
// //     const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
// //     if (maxX < -30 || minX > w + 30 || maxY < -30 || minY > h + 30) return;

// //     ctx.beginPath();
// //     ctx.moveTo(a.x, a.y);
// //     ctx.lineTo(b.x, b.y);
// //     ctx.stroke();
// //   }

// //   // --------------------------
// //   // Animation loop
// //   // --------------------------
// //   function loop(now) {
// //     applyForces(now);
// //     draw(now);
// //     requestAnimationFrame(loop);
// //   }

// //   // --------------------------
// //   // API
// //   // --------------------------
// //   NetBackground.mount = mount;
// //   NetBackground.detach = detach;
// //   window.NetBackground = NetBackground;
// // })();
