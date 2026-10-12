"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { fx, reducedMotion } from "@/lib/fx";

/*
 * Global fixed WebGL particle field — a faithful port of the original "Cinematic v3" engine:
 * 12k (5k mobile) additive points morphing between 8 procedural shapes (core orb, node chain,
 * neural net, helix, lattice cube, "AI" glyph, clusters, server stack), fbm fog backdrop with tint
 * crossfade, mouse repulsion + camera parallax, scroll-velocity jitter, and a travelling "pulse".
 */
const R = Math.random, TAU = 6.2832;
const sph = (r: number) => { const u = R() * 2 - 1, t = R() * TAU, s = Math.sqrt(1 - u * u); return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)]; };
const j = (v: number, k = 0.03) => v + (R() - 0.5) * k;

function shapes(N: number) {
  const gen = (f: (i: number, r: number) => number[]) => { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const p = f(i, R()); a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = p[2]; } return a; };
  const out: Float32Array[] = [];
  const ax = Array.from({ length: 14 }, () => [R() * TAU, R() * 3.14]);
  out[0] = gen((_, r) => { if (r < 0.26) return sph(0.45 * Math.cbrt(R())); if (r < 0.9) { const a = ax[(R() * 14) | 0], t = R() * TAU, Rr = 1.4 + (R() - 0.5) * 0.04; const y = Rr * Math.sin(t), x = Rr * Math.cos(t), y1 = y * Math.cos(a[0]), z1 = y * Math.sin(a[0]); return [x * Math.cos(a[1]) + z1 * Math.sin(a[1]), y1, -x * Math.sin(a[1]) + z1 * Math.cos(a[1])]; } return sph(2 + R() * 1.2); });
  const nx = [-3.2, -1.9, -0.6, 0.6, 1.9, 3.2], ny = [0, 0.8, -0.7, 0.7, -0.5, 0.3];
  out[1] = gen((_, r) => { if (r < 0.4) { const n = (R() * 6) | 0, p = sph(0.26 * Math.cbrt(R())); return [nx[n] + p[0], ny[n] + p[1], p[2]]; } if (r < 0.96) { const n = (R() * 5) | 0, t = R(); return [j(nx[n] + (nx[n + 1] - nx[n]) * t, 0.04), j(ny[n] + (ny[n + 1] - ny[n]) * t, 0.04), j(0, 0.1)]; } return [(R() - 0.5) * 8, (R() - 0.5) * 3, (R() - 0.5) * 2]; });
  const L = [4, 6, 6, 5, 3], ND: number[][] = []; L.forEach((n, l) => { for (let k = 0; k < n; k++) ND.push([l, (l - 2) * 1.5, (k - (n - 1) / 2) * 0.75, Math.sin(k * 1.7 + l) * 0.6]); });
  out[2] = gen((_, r) => { if (r < 0.3) { const n = ND[(R() * ND.length) | 0], p = sph(0.15 * Math.cbrt(R())); return [n[1] + p[0], n[2] + p[1], n[3] + p[2]]; } const l = (R() * 4) | 0, A = ND.filter((q) => q[0] == l), B = ND.filter((q) => q[0] == l + 1), a = A[(R() * A.length) | 0], b = B[(R() * B.length) | 0], t = R(); return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t]; });
  out[3] = gen((_, r) => { const t = (R() - 0.5) * 7, a = t * 2.2; if (r < 0.72) { const s = R() < 0.5 ? 0 : 3.14159; return [t, j(Math.sin(a + s), 0.05), j(Math.cos(a + s), 0.05)]; } const u = R() * 2 - 1; return [t, Math.sin(a) * u, Math.cos(a) * u]; });
  out[4] = gen((_, r) => { if (r < 0.5) { const s = R() < 0.5 ? 1.3 : 0.75, k = (R() * 3) | 0, a = [(R() < 0.5 ? -1 : 1) * s, (R() < 0.5 ? -1 : 1) * s, (R() < 0.5 ? -1 : 1) * s]; a[k] = (R() * 2 - 1) * s; return a; } if (r < 0.88) { const g = [-1.2, -0.4, 0.4, 1.2], p = sph(0.06 * R()); return [g[(R() * 4) | 0] + p[0], g[(R() * 4) | 0] + p[1], g[(R() * 4) | 0] + p[2]]; } return sph(0.3 + R() * 1.6); });
  // 5: glyph "AI"
  const c = document.createElement("canvas"); c.width = 900; c.height = 420; const x = c.getContext("2d")!;
  x.fillStyle = "#fff"; x.font = "800 330px Archivo, 'Arial Black', sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("AI", 450, 215);
  const d = x.getImageData(0, 0, 900, 420).data, P: number[][] = [];
  for (let y = 0; y < 420; y += 2) for (let X = 0; X < 900; X += 2) if (d[(y * 900 + X) * 4] > 128) P.push([(X - 450) / 130, -(y - 215) / 130]);
  out[5] = gen(() => { const p = P[(R() * P.length) | 0] || [0, 0]; return [j(p[0], 0.02), j(p[1], 0.02), (R() - 0.5) * 0.4]; });
  const C = [[-1.9, 1.1, 0], [1.9, 1.1, 0.6], [1.9, -1.1, -0.6], [-1.9, -1.1, 0.3]];
  out[6] = gen((_, r) => { if (r < 0.55) { const cc = C[(R() * 4) | 0], p = sph(0.6 * Math.cbrt(R())); return [cc[0] + p[0], cc[1] + p[1], cc[2] + p[2]]; } const a = C[(R() * 4) | 0], b = C[(R() * 4) | 0], t = R(), h = Math.sin(t * 3.14) * 0.7; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + h, a[2] + (b[2] - a[2]) * t]; });
  out[7] = gen(() => { const y = -1.5 + ((R() * 4) | 0), b = R(); if (b < 0.35) { const e = (R() * 4) | 0, t = R() * 2 - 1; return e < 2 ? [t * 2.2, y, (e ? 1 : -1) * 1.4] : [(e == 2 ? 1 : -1) * 2.2, y, t * 1.4]; } if (b < 0.7) return R() < 0.5 ? [Math.round((R() * 2 - 1) * 5.5) / 2.5, y, (R() * 2 - 1) * 1.4] : [(R() * 2 - 1) * 2.2, y, Math.round((R() * 2 - 1) * 3.5) / 2.5]; return [(R() * 2 - 1) * 2.2, y + j(0, 0.04), (R() * 2 - 1) * 1.4]; });
  return out;
}

const VS = `attribute vec3 s0,s1,s2,s3,s4,s5,s6,s7;attribute vec4 rnd;uniform float uT,uMix,uChaos,uVel,uPx,uPulse,uFade,uA,uB;uniform vec2 uM;varying vec3 vC;varying float vA;
vec3 pk(float i){if(i<.5)return s0;if(i<1.5)return s1;if(i<2.5)return s2;if(i<3.5)return s3;if(i<4.5)return s4;if(i<5.5)return s5;if(i<6.5)return s6;return s7;}
void main(){vec3 a=pk(uA),b=pk(uB);float k=smoothstep(0.,1.,clamp(uMix*1.5-rnd.x*.5,0.,1.));vec3 p=mix(a,b,k);float tr=sin(k*3.14159);
p+=vec3(sin(rnd.z*6.+uT*.8),cos(rnd.z*5.+uT*.7),sin(rnd.z*4.+uT*.6))*.9*tr;
vec3 n=vec3(sin(uT*.6+rnd.z*20.),cos(uT*.5+rnd.x*30.),sin(uT*.7+rnd.y*25.));p+=n*(.025+uChaos*1.7+uVel*.18);
vec3 d=p-vec3(uM,0.);float md=length(d.xy);p+=normalize(d+.0001)*smoothstep(1.3,0.,md)*.4;
vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
float node=step(.955,rnd.w);gl_PointSize=min(40.,uPx*(rnd.y*1.3+.5+node*2.4)*(7.2/-mv.z)*(1.+uVel*.6));
float pulse=exp(-pow((p.x-uPulse)*1.1,2.));vec3 col=mix(vec3(.55,.8,1.),vec3(.2,.45,1.),rnd.x);if(rnd.x>.86)col=vec3(.56,.36,1.);if(node>.5)col=vec3(.2,.95,1.);
col=mix(col,vec3(.24,1.,.63),clamp(pulse,0.,1.));vC=col;vA=(.3+node*.7+pulse*.6)*uFade;}`;
const FS = `precision highp float;varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=pow(1.-d*2.,1.5);gl_FragColor=vec4(vC*(.55+a),a*vA);}`;
const FOG = `precision highp float;uniform float uT,uS;uniform vec3 uTint;uniform vec2 uR,uM;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/uR;vec2 p=(uv-.5)*vec2(uR.x/uR.y,1.);float f=fbm(p*2.2+vec2(uT*.03,uS*.5)+uM*.2);float g=fbm(p*3.+f*1.5-uT*.02);vec3 c=mix(vec3(.02,.025,.05),uTint*.2,f)*.62;c+=uTint.zyx*.3*pow(g,3.)*.5;c*=smoothstep(1.2,.15,length(p));c+=h(gl_FragCoord.xy+uT)*.016;c*=.96+.04*(.5+.5*sin(gl_FragCoord.y*1.5+uT*2.));gl_FragColor=vec4(c,1.);}`;
const TN = [[0.3, 0.5, 1], [0.2, 0.8, 1], [0.6, 0.35, 1], [0.2, 0.9, 0.8], [0.4, 0.5, 1], [0.3, 0.8, 1], [0.85, 0.35, 0.9], [1, 0.75, 0.4]];

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const reduce = reducedMotion();
    const MOB = window.matchMedia("(max-width: 760px)").matches;
    const N = window.innerWidth < 500 ? 2200 : MOB ? 3500 : 8000;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: "high-performance", alpha: false }); }
    catch { cv.style.display = "none"; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    const sh = shapes(N);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    sh.forEach((a, i) => g.setAttribute("s" + i, new THREE.BufferAttribute(a, 3)));
    const rn = new Float32Array(N * 4); for (let i = 0; i < rn.length; i++) rn[i] = R();
    g.setAttribute("rnd", new THREE.BufferAttribute(rn, 4));
    const U = { uT: { value: 0 }, uMix: { value: 1 }, uChaos: { value: 0 }, uVel: { value: 0 }, uPx: { value: 3 }, uPulse: { value: -9 }, uFade: { value: 0.7 }, uA: { value: 0 }, uB: { value: 0 }, uM: { value: new THREE.Vector2() } };
    const pts = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    pts.frustumCulled = false; pts.renderOrder = 1;
    const FU = { uTint: { value: new THREE.Vector3(0.3, 0.5, 1) }, uT: { value: 0 }, uS: { value: 0 }, uR: { value: new THREE.Vector2(1, 1) }, uM: { value: new THREE.Vector2() } };
    const fog = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: "void main(){gl_Position=vec4(position.xy,0.,1.);}", fragmentShader: FOG, uniforms: FU, depthTest: false, depthWrite: false }));
    fog.frustumCulled = false; fog.renderOrder = -1;
    scene.add(fog, pts);

    const rsz = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      fx.base = w / h < 1 ? 11.5 : 7.2; fx.state.z = fx.base;
      if (!camera.position.z) camera.position.z = fx.base;
      FU.uR.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      U.uPx.value = 3 * renderer.getPixelRatio() * (h / 900);
    };
    rsz(); window.addEventListener("resize", rsz);
    if (!fx.introDone && !reduce) { fx.state.z = 16; camera.position.z = 16; }

    let cur = 0;
    const off = fx.onShape((i) => {
      if (i === cur) return;
      if (U.uMix.value > 0.5) U.uA.value = U.uB.value;
      U.uB.value = i; U.uMix.value = 0; cur = i;
      const tn = TN[i];
      gsap.to(FU.uTint.value, { x: tn[0], y: tn[1], z: tn[2], duration: 2.4, ease: "power2.inOut", overwrite: true });
      gsap.to(U.uMix, { value: 1, duration: reduce ? 0 : 2.2, ease: "expo.inOut", overwrite: true });
      if (reduce) requestAnimationFrame(render);
    });
    const onMove = (e: PointerEvent) => { fx.mouse.x = e.clientX / window.innerWidth - 0.5; fx.mouse.y = e.clientY / window.innerHeight - 0.5; };
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
      pts.position.x += (fx.state.gx - pts.position.x) * 0.05;
      if (U.uB.value === 5 && U.uMix.value > 0.5) { let r = pts.rotation.y; r = (((r + Math.PI) % TAU) + TAU) % TAU - Math.PI; pts.rotation.y = r + (mx * 0.35 - r) * 0.05; }
      else pts.rotation.y += 0.0016 + vel * 0.01 + mx * 0.0008;
      pts.rotation.x += (-my * 0.2 - pts.rotation.x) * 0.04;
      U.uM.value.set(mx * 5, -my * 3); FU.uM.value.set(mx, -my);
      FU.uS.value = window.scrollY / Math.max(1, document.body.scrollHeight);
      renderer.render(scene, camera);
    };
    const tick = () => { if (running) render(); };
    if (reduce) { camera.position.z = fx.base; render(); }
    else gsap.ticker.add(tick);
    const vis = () => { running = !document.hidden; };
    document.addEventListener("visibilitychange", vis);
    fx.ready = true;
    cv.style.opacity = "1";
    return () => {
      gsap.ticker.remove(tick); off();
      window.removeEventListener("resize", rsz); window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", vis);
      g.dispose(); renderer.dispose(); fx.ready = false;
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-1000" />;
}
