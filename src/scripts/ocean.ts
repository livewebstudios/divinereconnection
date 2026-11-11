// Soft-rendered purple ocean (WebGL). Stella asked for "purple ocean, purple
// waves", photographic rather than drawn, gentle movement, no moon, no stars.
// This renders calm swells under a pale lavender sky with a diffuse light,
// at reduced resolution so it reads soft. It pauses off screen, on hidden tabs,
// with the visible pause button, and stays still for reduced motion.
// A real ocean video can replace it later: drop a <video> into .ocean.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uHorizon;
uniform float uDrift;

const vec3 SKY_TOP = vec3(0.953, 0.941, 0.969);
const vec3 SKY_LOW = vec3(0.902, 0.871, 0.941);
const vec3 HAZE    = vec3(0.820, 0.773, 0.886);
const vec3 DEEP    = vec3(0.165, 0.094, 0.298);
const vec3 MID     = vec3(0.420, 0.310, 0.627);
const vec3 GLOW    = vec3(1.0, 0.975, 1.0);

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}

vec3 lightDir(){ return normalize(vec3(0.42, 0.16, -1.0)); }

vec3 sky(vec3 d){
  float h = clamp(d.y * 2.4, 0.0, 1.0);
  vec3 col = mix(HAZE, SKY_LOW, smoothstep(0.0, 0.25, h));
  col = mix(col, SKY_TOP, smoothstep(0.2, 1.0, h));
  float g = max(dot(d, lightDir()), 0.0);
  col += GLOW * (pow(g, 10.0) * 0.18 + pow(g, 40.0) * 0.12);
  vec2 cp = d.xz / max(d.y + 0.06, 0.06) * 0.55 + vec2(uTime * 0.012, 0.0);
  float c = smoothstep(0.48, 0.9, fbm(cp));
  col = mix(col, vec3(1.0), c * 0.42 * smoothstep(0.0, 0.18, d.y));
  return col;
}

vec2 swell(vec2 p, float t){
  vec2 g = vec2(0.0);
  vec2 d; float ph;
  d = normalize(vec2( 0.15, 1.0)); ph = dot(d, p) * 0.42 + t * 0.50; g += d * (0.20 * 0.42 * cos(ph));
  d = normalize(vec2(-0.45, 1.0)); ph = dot(d, p) * 0.63 + t * 0.62; g += d * (0.12 * 0.63 * cos(ph));
  d = normalize(vec2( 0.70, 1.0)); ph = dot(d, p) * 1.05 + t * 0.85; g += d * (0.07 * 1.05 * cos(ph));
  d = normalize(vec2(-0.90, 0.6)); ph = dot(d, p) * 1.70 + t * 1.15; g += d * (0.04 * 1.70 * cos(ph));
  d = normalize(vec2( 0.30, 0.8)); ph = dot(d, p) * 2.60 + t * 1.50; g += d * (0.025 * 2.60 * cos(ph));
  return g;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - vec2(0.5 * uRes.x, uHorizon * uRes.y)) / uRes.y;
  vec3 ro = vec3(0.0, 2.0, -uDrift);
  vec3 rd = normalize(vec3(uv.x, uv.y, -1.7));
  vec3 col;

  if (rd.y >= 0.0) {
    col = sky(rd);
  } else {
    float t = -ro.y / rd.y;
    vec2 p = ro.xz + rd.xz * t;
    float fade = exp(-t * 0.035);
    float time = uTime * 0.55;

    vec2 g = swell(p, time);
    vec2 q = p * 1.6 + vec2(time * 0.18, -time * 0.32);
    float e = 0.08;
    float n0 = fbm(q);
    vec2 ng = vec2(fbm(q + vec2(e, 0.0)) - n0, fbm(q + vec2(0.0, e)) - n0) / e;
    g += ng * 0.10 * exp(-t * 0.08);
    g *= fade * 1.15 + 0.15;

    vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
    float fres = 0.03 + 0.97 * pow(1.0 - max(dot(n, -rd), 0.0), 5.0);
    vec3 r = reflect(rd, n);
    r.y = abs(r.y);
    vec3 refl = sky(r);

    float slope = clamp(0.5 + dot(g, vec2(0.25, 0.9)) * 0.9, 0.0, 1.0);
    vec3 body = mix(DEEP, MID, slope * 0.85 + 0.1);
    col = mix(body, refl, clamp(fres * 0.72, 0.0, 1.0));

    float s = pow(max(dot(r, lightDir()), 0.0), 90.0);
    col += GLOW * s * 0.55 * (0.4 + fade);

    float haze = 1.0 - exp(-t * 0.018);
    col = mix(col, HAZE, clamp(haze, 0.0, 1.0));
  }

  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}
`;

type OceanState = {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  uni: Record<string, WebGLUniformLocation | null>;
  visible: boolean;
  paused: boolean;
  t0: number;
  elapsed: number;
};

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

function setup(el: HTMLElement): OceanState | null {
  const canvas = el.querySelector('canvas');
  if (!canvas) return null;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return null;
  try {
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uni = {
      uRes: gl.getUniformLocation(prog, 'uRes'),
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uHorizon: gl.getUniformLocation(prog, 'uHorizon'),
      uDrift: gl.getUniformLocation(prog, 'uDrift'),
    };
    el.classList.add('is-live');
    return { el, canvas, gl, uni, visible: true, paused: reduce, t0: performance.now(), elapsed: 8 };
  } catch (err) {
    console.warn('Ocean shader unavailable, using the still fallback.', err);
    return null;
  }
}

function resize(s: OceanState) {
  const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.62;
  const w = Math.max(1, Math.round(s.el.clientWidth * scale));
  const h = Math.max(1, Math.round(s.el.clientHeight * scale));
  if (s.canvas.width !== w || s.canvas.height !== h) {
    s.canvas.width = w;
    s.canvas.height = h;
    s.gl.viewport(0, 0, w, h);
  }
}

function horizonFor(s: OceanState) {
  const wide = window.matchMedia('(min-width: 900px)').matches;
  const v = parseFloat((wide ? s.el.dataset.horizon : s.el.dataset.horizonMobile) || s.el.dataset.horizon || '0.42');
  return v;
}

function draw(s: OceanState) {
  resize(s);
  const { gl, uni } = s;
  const rect = s.el.getBoundingClientRect();
  gl.uniform2f(uni.uRes, s.canvas.width, s.canvas.height);
  gl.uniform1f(uni.uTime, s.elapsed);
  gl.uniform1f(uni.uHorizon, horizonFor(s));
  gl.uniform1f(uni.uDrift, reduce ? 0 : Math.max(0, -rect.top) * 0.012);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

const oceans: OceanState[] = [];
document.querySelectorAll<HTMLElement>('[data-ocean]').forEach((el) => {
  const s = setup(el);
  if (!s) return;
  oceans.push(s);
  draw(s);

  new IntersectionObserver(([entry]) => {
    s.visible = entry.isIntersecting;
  }).observe(el);

  const btn = el.parentElement?.querySelector<HTMLButtonElement>('[data-ocean-toggle]');
  if (btn) {
    if (reduce) btn.hidden = true;
    btn.addEventListener('click', () => {
      s.paused = !s.paused;
      btn.setAttribute('aria-pressed', String(s.paused));
      btn.querySelector('[data-label]')!.textContent = s.paused ? 'Play the water' : 'Pause the water';
      s.t0 = performance.now() - s.elapsed * 1000;
    });
  }
});

if (oceans.length) {
  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!document.hidden) {
      for (const s of oceans) {
        if (!s.visible) continue;
        if (!s.paused) s.elapsed += dt;
        draw(s);
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.addEventListener('resize', () => oceans.forEach(draw));
}
