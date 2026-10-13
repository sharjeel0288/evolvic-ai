"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { fx, reducedMotion } from "@/lib/fx";
import { ICONS } from "@/lib/iconShapes";

/*
 * Global fixed WebGL particle field (port + upgrade of the original "Cinematic v3" engine).
 * Shapes are content-specific: neural brain (hero), pipeline nodes (workflow), chaos → order (scroll-video),
 * per-service icons sampled from lucide strokes (gear, phone, chat, database, bot, globe, chart, document),
 * handshake / mail (contact), and the Evolviq wordmark (CTA).
 * Sprites: glowing orbs with hot cores, star sparkles with a cross flare, a few large bokeh discs; per-particle
 * size/brightness, twinkle, per-shape colour, and eased morphs with a swirl. Only two position buffers live on the
 * GPU (from/to); the CPU swaps targets on morph, so any number of shapes costs nothing extra per frame.
 */
const R = Math.random, TAU = 6.2832;
const sph = (r: number) => { const u = R() * 2 - 1, t = R() * TAU, s = Math.sqrt(1 - u * u); return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)]; };
const j = (v: number, k = 0.03) => v + (R() - 0.5) * k;

/** Rasterise a drawing and return its lit pixels as points in world units (centred, y up). */
function raster(W: number, H: number, unit: number, draw: (x: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d")!; x.fillStyle = x.strokeStyle = "#fff"; x.lineCap = x.lineJoin = "round";
  draw(x);
  const d = x.getImageData(0, 0, W, H).data, P: number[][] = [];
  for (let y = 0; y < H; y += 2) for (let X = 0; X < W; X += 2) if (d[(y * W + X) * 4 + 3] > 140) P.push([(X - W / 2) / unit, -(y - H / 2) / unit]);
  return P.length ? P : [[0, 0]];
}
/** Lucide icon node → stroked points (24-unit viewBox mapped to ±2.3 world units). */
function iconPts(name: string) {
  const node = ICONS[name] ?? [];
  return raster(480, 480, 104, (x) => {
    x.scale(20, 20); x.lineWidth = 1.55;
    for (const [t, a] of node) {
      const n = (k: string) => +a[k];
      x.beginPath();
      if (t === "path") { x.stroke(new Path2D(a.d)); continue; }
      if (t === "circle") x.arc(n("cx"), n("cy"), n("r"), 0, TAU);
      else if (t === "ellipse") x.ellipse(n("cx"), n("cy"), n("rx"), n("ry"), 0, 0, TAU);
      else if (t === "rect") x.roundRect(n("x"), n("y"), n("width"), n("height"), a.rx ? n("rx") : 0);
      else if (t === "line") { x.moveTo(n("x1"), n("y1")); x.lineTo(n("x2"), n("y2")); }
      else if (t === "polyline" || t === "polygon") { const q = a.points.trim().split(/[\s,]+/).map(Number); x.moveTo(q[0], q[1]); for (let i = 2; i < q.length; i += 2) x.lineTo(q[i], q[i + 1]); if (t === "polygon") x.closePath(); }
      x.stroke();
    }
  });
}
/** Flat glyph → volumetric particle shape: crisp stroke core, faint inner glow, sparse ambient dust. */
const glyph = (P: number[][], depth = 0.22) => (_: number, r: number) => {
  const p = P[(R() * P.length) | 0];
  if (r < 0.9) return [j(p[0], 0.018), j(p[1], 0.018), (R() - 0.5) * depth];
  if (r < 0.96) { const o = sph(0.22 * R()); return [p[0] + o[0], p[1] + o[1], o[2]]; }
  return sph(2.6 + R() * 1.6);
};

export const SHAPE_NAMES = ["Brain", "Pipeline", "Neural", "Chaos", "Order", "Wordmark", "Clusters", "Stack", "Gear", "Voice", "Chat", "Database", "Agent", "Globe", "Chart", "Document", "Handshake", "Mail"] as const;
/** Shapes that are read face-on (no continuous spin). */
const FLAT = new Set([0, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);

function shapes(N: number) {
  const gen = (f: (i: number, r: number) => number[]) => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const p = f(i, R()); a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = p[2]; } return a; };
  const out: Float32Array[] = [];
  // 0 brain: lucide brain outline, scaled up, with synapse sparks inside
  const brain = iconPts("brain").map(([x, y]) => [x * 1.25, y * 1.25]);
  out[0] = gen((_, r) => { const p = brain[(R() * brain.length) | 0]; if (r < 0.86) return [j(p[0], 0.02), j(p[1], 0.02), (R() - 0.5) * 0.35]; if (r < 0.95) { const q = sph(1.5 * Math.cbrt(R())); return [q[0] * 1.2, q[1], q[2] * 0.4]; } return sph(2.8 + R() * 1.4); });
  // 1 pipeline: six nodes chained left→right with flowing links
  const nx = [-3.2, -1.9, -0.6, 0.6, 1.9, 3.2], ny = [0, 0.8, -0.7, 0.7, -0.5, 0.3];
  out[1] = gen((_, r) => { if (r < 0.42) { const n = (R() * 6) | 0, p = sph(0.24 + 0.04 * R()); return [nx[n] + p[0], ny[n] + p[1], p[2]]; } if (r < 0.97) { const n = (R() * 5) | 0, t = R(); return [j(nx[n] + (nx[n + 1] - nx[n]) * t, 0.03), j(ny[n] + (ny[n + 1] - ny[n]) * t, 0.03), j(0, 0.06)]; } return [(R() - 0.5) * 8, (R() - 0.5) * 3, (R() - 0.5) * 2]; });
  // 2 neural layers
  const L = [4, 6, 6, 5, 3], ND: number[][] = []; L.forEach((n, l) => { for (let k = 0; k < n; k++) ND.push([l, (l - 2) * 1.5, (k - (n - 1) / 2) * 0.75, Math.sin(k * 1.7 + l) * 0.6]); });
  out[2] = gen((_, r) => { if (r < 0.3) { const n = ND[(R() * ND.length) | 0], p = sph(0.15 * Math.cbrt(R())); return [n[1] + p[0], n[2] + p[1], n[3] + p[2]]; } const l = (R() * 4) | 0, A = ND.filter((q) => q[0] == l), B = ND.filter((q) => q[0] == l + 1), a = A[(R() * A.length) | 0], b = B[(R() * B.length) | 0], t = R(); return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t]; });
  // 3 chaos: turbulent cloud
  out[3] = gen(() => { const p = sph(3.4 * Math.pow(R(), 0.6)); return [p[0] * 1.3, p[1] * 0.8, p[2]]; });
  // 4 order: precise lattice
  out[4] = gen(() => { const g = (k: number) => (((R() * k) | 0) - (k - 1) / 2); return R() < 0.82 ? [g(9) * 0.62 + j(0, 0.02), g(5) * 0.62, g(3) * 0.62] : [g(9) * 0.62 + (R() - 0.5) * 0.62, g(5) * 0.62, g(3) * 0.62]; });
  // 5 Evolviq wordmark
  const font = getComputedStyle(document.documentElement).getPropertyValue("--font-head").trim() || "sans-serif";
  out[5] = gen(glyph(raster(1100, 300, 150, (x) => { x.font = `500 210px ${font}, sans-serif`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("Evolviq", 550, 160); }), 0.3));
  // 6 clusters (teams / agents)
  const C = [[-1.9, 1.1, 0], [1.9, 1.1, 0.6], [1.9, -1.1, -0.6], [-1.9, -1.1, 0.3]];
  out[6] = gen((_, r) => { if (r < 0.55) { const cc = C[(R() * 4) | 0], p = sph(0.6 * Math.cbrt(R())); return [cc[0] + p[0], cc[1] + p[1], cc[2] + p[2]]; } const a = C[(R() * 4) | 0], b = C[(R() * 4) | 0], t = R(), h = Math.sin(t * 3.14) * 0.7; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + h, a[2] + (b[2] - a[2]) * t]; });
  // 7 server stack
  out[7] = gen(() => { const y = -1.5 + ((R() * 4) | 0), b = R(); if (b < 0.35) { const e = (R() * 4) | 0, t = R() * 2 - 1; return e < 2 ? [t * 2.2, y, (e ? 1 : -1) * 1.4] : [(e == 2 ? 1 : -1) * 2.2, y, t * 1.4]; } if (b < 0.7) return R() < 0.5 ? [Math.round((R() * 2 - 1) * 5.5) / 2.5, y, (R() * 2 - 1) * 1.4] : [(R() * 2 - 1) * 2.2, y, Math.round((R() * 2 - 1) * 3.5) / 2.5]; return [(R() * 2 - 1) * 2.2, y + j(0, 0.04), (R() * 2 - 1) * 1.4]; });
  // 8–17 icons
  ["settings", "phone-call", "message-square", "database", "bot", "globe", "chart-column", "file-text", "handshake", "mail"].forEach((n, k) => { out[8 + k] = gen(glyph(iconPts(n))); });
  return out;
}

const VS = `attribute vec3 aA,aB;attribute vec4 rnd;uniform float uT,uMix,uChaos,uVel,uPx,uPulse,uFade;uniform vec2 uM;uniform vec3 uCol;varying vec3 vC;varying float vA,vT;
void main(){float k=smoothstep(0.,1.,clamp(uMix*1.5-rnd.x*.5,0.,1.));vec3 p=mix(aA,aB,k);float tr=sin(k*3.14159);
float ang=tr*(1.1+rnd.z*1.4);float cs=cos(ang),sn=sin(ang);p.xz=mat2(cs,-sn,sn,cs)*p.xz;
p+=vec3(sin(rnd.z*6.+uT*.8),cos(rnd.z*5.+uT*.7),sin(rnd.z*4.+uT*.6))*.55*tr;
vec3 n=vec3(sin(uT*.6+rnd.z*20.),cos(uT*.5+rnd.x*30.),sin(uT*.7+rnd.y*25.));p+=n*(.018+uChaos*1.7+uVel*.16);
vec3 d=p-vec3(uM,0.);float md=length(d.xy);p+=normalize(d+.0001)*smoothstep(1.2,0.,md)*.35;
vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
float ty=rnd.w>.975?2.:(rnd.w>.91?1.:0.);float tw=.72+.28*sin(uT*(1.3+rnd.y*3.2)+rnd.z*40.);
float sz=ty>1.5?(4.2+rnd.y*3.):(ty>.5?(1.9+rnd.y*1.2):(.55+rnd.y*.85));
gl_PointSize=min(72.,uPx*sz*(7.2/-mv.z)*(1.+uVel*.5));
float pulse=exp(-pow((p.x-uPulse)*1.1,2.));
vec3 col=mix(vec3(.93,.92,1.),uCol,.3+rnd.x*.6);if(ty>.5&&ty<1.5)col=vec3(1.,.98,1.);if(ty>1.5)col=mix(uCol,vec3(.84,.83,1.),.3);
col=mix(col,vec3(1.),clamp(pulse,0.,1.)*.6);
float al=ty>1.5?.1:(ty>.5?.95*tw*tw:(.55+rnd.y*.45)*tw);
vC=col;vT=ty;vA=(al+pulse*.4)*uFade;}`;
const FS = `precision highp float;uniform vec2 uB[6];uniform float uDpr;varying vec3 vC;varying float vA,vT;
float paper(){float y=gl_FragCoord.y,l=0.;for(int i=0;i<6;i++){l=max(l,step(uB[i].x,y)*step(y,uB[i].y));}return l;}
void main(){vec2 q=gl_PointCoord-.5;float d=length(q);if(d>.5)discard;vec3 c=vC;float a;
if(vT>1.5){a=smoothstep(.5,.4,d)*(.5+.5*smoothstep(.15,.45,d));}
else if(vT>.5){float fx=max(0.,1.-abs(q.x)*16.)*max(0.,1.-abs(q.y)*2.1),fy=max(0.,1.-abs(q.y)*16.)*max(0.,1.-abs(q.x)*2.1);a=clamp(fx+fy+exp(-d*d*90.),0.,1.);}
else{float core=exp(-d*d*70.),halo=exp(-d*d*12.)*.5;a=core+halo;c=mix(vC,vec3(1.),core*.55);}
float L=paper();a*=vA;
vec3 ink=mix(vec3(.157,.11,.486),vec3(.357,.298,.961),clamp(vC.r*1.6-.6,0.,1.));ink=mix(ink,vec3(.70,.66,.98),step(.5,vT)*step(vT,1.5)*.5);
float aL=clamp(a*(vT>1.5?.35:.62),0.,1.);
gl_FragColor=vec4(c*a*(1.-L)+ink*aL*L,aL*L);}`;
const FOG = `precision highp float;uniform float uT,uS;uniform vec3 uTint;uniform vec2 uR,uM;uniform vec2 uB[6];float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/uR;vec2 p=(uv-.5)*vec2(uR.x/uR.y,1.);float f=fbm(p*2.2+vec2(uT*.03,uS*.5)+uM*.2);float g=fbm(p*3.+f*1.5-uT*.02);vec3 c=mix(vec3(.0,.0,.02),uTint*.2,f)*.62;c+=uTint*.3*pow(g,3.)*.5;c*=smoothstep(1.2,.15,length(p));c+=h(gl_FragCoord.xy+uT)*.014;c*=.96+.04*(.5+.5*sin(gl_FragCoord.y*1.5+uT*2.));float y=gl_FragCoord.y,L=0.;for(int i=0;i<6;i++){L=max(L,step(uB[i].x,y)*step(y,uB[i].y));}vec3 pc=vec3(.961)+uTint*.018*f-vec3(.012)*smoothstep(.3,1.3,length(p));gl_FragColor=vec4(mix(c,pc,L),1.);}`;
/** per-shape colour (particles + fog tint), all within the indigo → lilac palette */
const TN = [[0.56, 0.5, 1], [0.42, 0.36, 0.98], [0.5, 0.45, 1], [0.36, 0.3, 0.96], [0.66, 0.62, 1], [0.84, 0.82, 1], [0.45, 0.4, 0.95], [0.38, 0.33, 0.9],
  [0.55, 0.48, 1], [0.62, 0.56, 1], [0.7, 0.66, 1], [0.48, 0.42, 1], [0.6, 0.52, 1], [0.52, 0.5, 1], [0.66, 0.6, 1], [0.74, 0.7, 1], [0.6, 0.55, 1], [0.7, 0.64, 1]];

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const reduce = reducedMotion();
    const MOB = window.matchMedia("(max-width: 760px)").matches;
    const N = window.innerWidth < 500 ? 3000 : MOB ? 4000 : 8000;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: "high-performance", alpha: false }); }
    catch { cv.style.display = "none"; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    const sh = shapes(N);
    // horizontal extent per shape (99.5th percentile of |x|) → used to fit wide shapes on narrow/portrait screens
    const EXTY = sh.map((a) => { const ys: number[] = []; for (let q = 1; q < a.length; q += 9) ys.push(Math.abs(a[q])); ys.sort((m, n) => m - n); return ys[Math.floor(ys.length * 0.995)] || 1; });
    const EXT = sh.map((a) => { const xs: number[] = []; for (let q = 0; q < a.length; q += 9) xs.push(Math.abs(a[q])); xs.sort((m, n) => m - n); return xs[Math.floor(xs.length * 0.995)] || 1; });
    // 5: sample the real brand wordmark (async; falls back to typed wordmark until loaded)
    const li = new window.Image(); li.decoding = "async";
    li.onload = () => { const P = raster(1100, 238, 150, (x) => x.drawImage(li, 0, 0, 1100, 238)); if (P.length < 50) return; const f = glyph(P, 0.3), a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const q = f(i, R()); a[i * 3] = q[0]; a[i * 3 + 1] = q[1]; a[i * 3 + 2] = q[2]; } sh[5] = a; EXT[5] = 3.6; EXTY[5] = 0.8; };
    li.src = "/brand/logo-white.svg";
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    const A = new THREE.BufferAttribute(sh[0].slice(), 3), B = new THREE.BufferAttribute(sh[0].slice(), 3);
    A.setUsage(THREE.DynamicDrawUsage); B.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("aA", A); g.setAttribute("aB", B);
    const rn = new Float32Array(N * 4); for (let i = 0; i < rn.length; i++) rn[i] = R();
    g.setAttribute("rnd", new THREE.BufferAttribute(rn, 4));
    const U = { uT: { value: 0 }, uMix: { value: 1 }, uChaos: { value: 0 }, uVel: { value: 0 }, uPx: { value: 3 }, uPulse: { value: -9 }, uFade: { value: 0.8 }, uM: { value: new THREE.Vector2() }, uCol: { value: new THREE.Vector3(...TN[0]) } };
    const BANDS = Array.from({ length: 6 }, () => new THREE.Vector2(-1, -2));
    Object.assign(U, { uB: { value: BANDS }, uDpr: { value: 1 } });
    const pts = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: U, transparent: true, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendEquation: THREE.AddEquation }));
    pts.frustumCulled = false; pts.renderOrder = 1;
    const FU = { uTint: { value: new THREE.Vector3(0.36, 0.3, 0.96) }, uT: { value: 0 }, uS: { value: 0 }, uR: { value: new THREE.Vector2(1, 1) }, uM: { value: new THREE.Vector2() }, uB: { value: BANDS } };
    const fog = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: "void main(){gl_Position=vec4(position.xy,0.,1.);}", fragmentShader: FOG, uniforms: FU, depthTest: false, depthWrite: false }));
    fog.frustumCulled = false; fog.renderOrder = -1;
    scene.add(fog, pts);

    const rsz = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      fx.base = w / h < 1 ? 11.5 : 7.2; fx.state.z = fx.base;
      if (!camera.position.z) camera.position.z = fx.base;
      FU.uR.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      U.uPx.value = 3 * renderer.getPixelRatio() * (h / 900) * (w / h < 1 ? 1.45 : 1); // phones: bigger sprites so shapes read at lower counts
    };
    rsz(); window.addEventListener("resize", rsz);
    if (!fx.introDone && !reduce) { fx.state.z = 16; camera.position.z = 16; }

    let cur = 0;
    const off = fx.onShape((i) => {
      if (i === cur || !sh[i]) return;
      // freeze the in-flight positions as the new "from" (matches the shader's per-particle easing), then retarget
      const a = A.array as Float32Array, b = B.array as Float32Array, m = U.uMix.value;
      for (let q = 0; q < N; q++) { const t = Math.min(1, Math.max(0, m * 1.5 - rn[q * 4] * 0.5)), k = t * t * (3 - 2 * t);
        for (let c = 0; c < 3; c++) a[q * 3 + c] += (b[q * 3 + c] - a[q * 3 + c]) * k; }
      b.set(sh[i]); A.needsUpdate = B.needsUpdate = true;
      U.uMix.value = 0; cur = i;
      const tn = TN[i];
      gsap.to(U.uCol.value, { x: tn[0], y: tn[1], z: tn[2], duration: 1.8, ease: "power2.inOut", overwrite: true });
      gsap.to(FU.uTint.value, { x: tn[0], y: tn[1], z: tn[2], duration: 2.4, ease: "power2.inOut", overwrite: true });
      gsap.to(U.uMix, { value: 1, duration: reduce ? 0 : 2.4, ease: "power3.inOut", overwrite: true });
      if (reduce) requestAnimationFrame(render);
    });
    let moved = false;
    const onMove = (e: PointerEvent) => { moved = e.pointerType === "mouse"; fx.mouse.x = e.clientX / window.innerWidth - 0.5; fx.mouse.y = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });

    const t0 = performance.now();
    let last = window.scrollY, vel = 0, lv = 0, running = !document.hidden;
    const render = () => {
      const t = (performance.now() - t0) / 1000; U.uT.value = t; FU.uT.value = t;
      const v = window.scrollY - last; last = window.scrollY;
      vel += (Math.min(1.2, Math.abs(v) * 0.02) - vel) * 0.08; U.uVel.value = vel;
      if (Math.abs(vel - lv) > 0.04) { lv = vel; document.documentElement.style.setProperty("--vel", vel.toFixed(2)); }
      U.uChaos.value = fx.chaos.value; U.uPulse.value = fx.pulse.value;
      const { x: mx, y: my } = fx.mouse;
      camera.position.z += (fx.state.z - camera.position.z) * 0.07;
      camera.position.x += (mx * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.45 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect;
      pts.position.x += ((anc ? anc.cx * halfW : fx.state.gx) - pts.position.x) * 0.05;
      // fit the active shape inside the viewport width (phones/tablets in portrait)
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      pts.position.y += ((place ? -place.cy * halfH : 0) - pts.position.y) * 0.06;
      let fit = Math.max(0.2, Math.min(1, (halfW * (anc ? anc.w * 0.85 : 0.86)) / Math.max(EXT[cur], EXT[fx._shape] ?? 0)));
      if (place) fit = Math.min(fit, Math.max(0.12, (halfH * place.h * 0.8) / Math.max(EXTY[cur], EXTY[fx._shape] ?? 0)));
      U.uFade.value += (0.8 * dim * fx.boost - U.uFade.value) * 0.05;
      pts.scale.setScalar(pts.scale.x + (fit * (dim < 1 && !place ? 0.72 : 1) - pts.scale.x) * 0.06);
      if (FLAT.has(cur) && U.uMix.value > 0.35) { let r = pts.rotation.y; r = (((r + Math.PI) % TAU) + TAU) % TAU - Math.PI; pts.rotation.y = r + (mx * 0.35 - r) * 0.05; }
      else pts.rotation.y += 0.0016 + vel * 0.01 + mx * 0.0008;
      pts.rotation.x += (-my * 0.2 - pts.rotation.x) * 0.04;
      if (moved) U.uM.value.set(mx * 5, -my * 3); else U.uM.value.set(99, 99); // no repulsion hole until a mouse is used FU.uM.value.set(mx, -my);
      FU.uS.value = window.scrollY / Math.max(1, document.body.scrollHeight);
      renderer.render(scene, camera);
    };
    // Hide + pause the field while paper (light) bands dominate the viewport; resume on dark bands.
    const LIGHT = '[data-theme="light"]:not(nav), .section:not([data-theme="dark"])';
    let frame = 0, onLight = false, bandEls: HTMLElement[] = [];
    // Paper bands are transparent (html.fx-paper) — the canvas paints them: fog → #f5f5f5 and particles switch to ink/normal blending per pixel.
    const scanBands = () => { bandEls = Array.from(document.querySelectorAll<HTMLElement>(`main ${LIGHT.split(", ").join(", main ")}`)).filter((e) => e.getClientRects().length > 0 && !e.parentElement?.closest(LIGHT)); };
    const bands = () => {
      const dpr = renderer.getPixelRatio(), H = window.innerHeight; let k = 0;
      for (const e of bandEls) { if (k >= 6) break; const r = e.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) continue; BANDS[k++].set((H - r.bottom) * dpr, (H - r.top) * dpr); }
      for (; k < 6; k++) BANDS[k].set(-1, -2);
    };
    // Layout-driven anchor: in dark scenes with media beside text, park the shape over the measured text column.
    let anc: { cx: number; w: number } | null = null, stacked: HTMLElement | null = null, dim = 1, place: { cy: number; h: number } | null = null;
    const anchor = () => {
      const vw = window.innerWidth, vh = window.innerHeight, s = (document.elementFromPoint(vw / 2, vh / 2)?.closest("[data-scene]") as HTMLElement | null) || fx.scene;
      const dv = s && (window.innerWidth < window.innerHeight ? s.dataset.fxDimM ?? s.dataset.fxDim : s.dataset.fxDim); dim = dv ? +dv : 1;
      // Centred copy: never put the shape behind it — park it in the larger free gap (above or below the measured copy box)
      const portrait = window.innerWidth < window.innerHeight, pm = s && (portrait ? s.dataset.fxPlaceM ?? s.dataset.fxPlace : s.dataset.fxPlace), cp = pm && s ? s.querySelector<HTMLElement>("[data-fx-copy]") : null;
      if (cp) {
        const c = cp.getBoundingClientRect(), top = 84, above = c.top - top, below = vh - c.bottom, gap = Math.max(above, below);
        place = { cy: ((above > below ? (top + c.top) / 2 : (c.bottom + vh) / 2) / vh) * 2 - 1, h: gap / vh };
        if (gap < vh * 0.16) dim = Math.min(dim, 0.15);
        anc = null; return;
      }
      place = null;
      let best: DOMRect | null = null, bs = 0;
      if (s) s.querySelectorAll<HTMLElement>("[data-fx-text]").forEach((t) => {
        const r = t.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > vh) return;
        const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0), op = +getComputedStyle(t.closest("article,[data-fx-text]") || t).opacity;
        const sc = vis * (op || 0.01) * (1 - Math.abs((r.top + r.bottom) / 2 / vh - 0.5)); if (sc > bs) { bs = sc; best = r; }
      });
      const r = best as DOMRect | null, side = !!r && r.width < vw * 0.7;
      anc = side && r ? { cx: ((r.left + r.width / 2) / vw) * 2 - 1, w: r.width / vw } : null;
      const st = s && r && !side ? s : null;
      if (st !== stacked) { stacked?.removeAttribute("data-fx-stack"); st?.setAttribute("data-fx-stack", ""); stacked = st; }
    };
    const probe = () => {
      anchor();
      const x = window.innerWidth / 2, H = window.innerHeight;
      let n = 0;
      for (const f of [0.3, 0.5, 0.75]) { const el = document.elementFromPoint(x, H * f); if (el && el.closest(LIGHT) && !el.closest("header")) n++; }
      const l = n >= 2;
      if (l !== onLight) { onLight = l; fx.light = l; document.documentElement.classList.toggle("on-paper", l); }
    };
    const tick = () => {
      if (!running) return;
      if (++frame % 6 === 0) probe();
      if (frame % 60 === 1) scanBands();
      bands(); render();
    };
    if (reduce) { camera.position.z = fx.base; render(); }
    else { scanBands(); gsap.ticker.add(tick); document.documentElement.classList.add("fx-paper"); }
    const vis = () => { running = !document.hidden; };
    document.addEventListener("visibilitychange", vis);
    fx.ready = true;
    (window as unknown as { __fx?: typeof fx }).__fx = fx; // debugging / screenshot hook
    cv.style.opacity = "1";
    return () => {
      gsap.ticker.remove(tick); off(); document.documentElement.classList.remove("fx-paper");
      window.removeEventListener("resize", rsz); window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", vis);
      g.dispose(); renderer.dispose(); fx.ready = false;
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-500" />;
}
