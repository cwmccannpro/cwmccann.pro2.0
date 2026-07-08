"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * HeroShader — the "Ember Nebula".
 *
 * A raw-WebGL fragment shader (no libraries): domain-warped fractal noise
 * churning very slowly in deep crimson and ember over near-black, with a
 * soft light core that drifts toward the cursor. Rendered at a capped
 * device-pixel-ratio and paused whenever the tab is hidden.
 *
 * Reduced motion: a single static frame is rendered (t = 0) — the texture
 * stays, the churning stops.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse; // aspect-corrected, roughly -0.9..0.9

// -- value noise + fbm ------------------------------------------------
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  // rotate each octave to hide the grid
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.028; // glacial drift

  // Cursor in uv space (u_mouse is 2x uv units — see the JS mapping).
  vec2 c = u_mouse * 0.5;

  // Domain warping: q warps r, r warps the final field — liquid smoke.
  // The field parallax-shifts with the cursor, and a local pull-and-curl
  // around the cursor visibly draws the smoke toward it.
  vec2 p = uv * 1.9 + u_mouse * 0.24;
  vec2 dm = uv - c;
  float md = exp(-dot(dm, dm) * 5.0);
  p += (-dm * 0.9 + vec2(-dm.y, dm.x) * 0.65) * md;
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t),
    fbm(p + vec2(5.2, 1.3) - t * 0.7)
  );
  vec2 r = vec2(
    fbm(p + q * 1.8 + vec2(1.7, 9.2) + t * 0.35),
    fbm(p + q * 1.8 + vec2(8.3, 2.8) - t * 0.26)
  );
  float f = fbm(p + r * 2.4);

  // -- ember palette ---------------------------------------------------
  // Remap for contrast: black voids dominate, embers are earned.
  float d = smoothstep(0.30, 0.92, f);
  vec3 col = vec3(0.012, 0.009, 0.008);                            // noir base
  col = mix(col, vec3(0.085, 0.022, 0.016), smoothstep(0.12, 0.62, d)); // maroon body
  col = mix(col, vec3(0.38, 0.095, 0.048), smoothstep(0.50, 0.92, d));  // crimson folds
  col += vec3(0.85, 0.24, 0.10) * pow(clamp(d - 0.68, 0.0, 1.0) * 3.4, 2.2) * 0.55; // ember tips

  // Wisps: brighten a thin band around the field's mid-contour, so
  // sheet-like filaments of smoke read against the voids.
  float wisp = smoothstep(0.16, 0.0, abs(f - 0.52)) * length(r) * 0.5;
  col += vec3(0.30, 0.075, 0.038) * wisp;

  // Light core that tracks the cursor (resting just above center).
  vec2 focus = vec2(0.0, 0.02) + u_mouse * 0.42;
  float glow = exp(-dot(uv - focus, uv - focus) * 4.6);
  col += vec3(0.26, 0.065, 0.036) * glow;

  // Edge falloff so the smoke seats into the page's black.
  float vig = smoothstep(1.18, 0.32, length(uv));
  col *= vig;

  // Gentle filmic curve; never let it clip to pure red.
  col = col / (1.0 + col);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function HeroShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) ?? undefined;
    if (!gl) return; // no WebGL → the CSS gradient behind us still shows

    // -- compile -------------------------------------------------------
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    // -- sizing (DPR capped — fbm doesn't need retina) -------------------
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    // -- mouse (lerped in the render loop) -------------------------------
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = ((e.clientX - window.innerWidth / 2) / window.innerHeight) * 2;
      target.y = -((e.clientY - window.innerHeight / 2) / window.innerHeight) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = (t: number) => {
      // Quicker chase so the smoke answers the cursor without snapping.
      eased.x += (target.x - eased.x) * 0.085;
      eased.y += (target.y - eased.y) * 0.085;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, eased.x, eased.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Reduced motion: paint one still frame and stop.
    if (reduced) {
      draw(0);
      window.removeEventListener("mousemove", onMove);
      return () => ro.disconnect();
    }

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Pause the loop while the tab is hidden.
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
