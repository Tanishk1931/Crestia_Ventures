const CONFIG = {
  // Use "brand" for the full-width transparent look, or "video" for the light stage.
  theme: "brand",
  autoplay: true,
  interval: 3000,
  resumeDelay: 2500,
  threeModuleUrl: "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js",
  imageUrl: new URL("./assets/rcm-team.jpg", import.meta.url).href,
  stage: {
    desktopMinHeight: 440,
    desktopHeightVw: 43,
    desktopMaxHeight: 620,
    desktopAspect: 2.3,
    videoAspect: 1340 / 800,
    mobileAspect: 1 / 1.15,
    mobileBreakpoint: 700,
    desktopCardWidth: 0.26,
    desktopCardHeight: 0.74,
    mobileCardWidth: 0.46,
    cardAspect: 4 / 5,
    neighborScale: 0.88,
    mobileNeighborScale: 0.78,
    spacing: 0.26,
    mobileSpacing: 0.36,
    sideAngle: 0.18,
    maxVisibleOffset: 1.8,
    maxFlareScale: 1.28,
    cameraFov: 30,
    cameraDistance: 10,
  },
  motion: {
    snapSpeedMs: 260,
    reducedSnapSpeedMs: 120,
    friction: 4.2,
    minimumFlingSpeed: 0.65,
    maximumFlingSeconds: 1,
    maximumFlingCards: 3,
    stopFlingSpeed: 0.18,
    speedCap: 9,
  },
  shader: {
    baselineSplitPixels: 2.5,
    speedSplitPixels: 7,
    baselineStreakPixels: 2,
    speedStreakPixels: 8,
    maximumSpeed: 9,
    rimGlow: 0.2,
  },
  card: {
    width: 720,
    height: 900,
    font: '"Manrope", "Segoe UI", sans-serif',
    fontWaitMs: 1600,
    imageOpacity: 0.6,
    imageHeight: 0.68,
    titleSize: 46,
    descriptionSize: 32,
    iconSize: 128,
    tickCount: 42,
    palettes: [
      { top: "#FFFFFF", center: "#FCFBF8", bottom: "#F7F4ED", edge: "#D6AD60" },
      { top: "#FFFFFF", center: "#F9F7F1", bottom: "#EEEAE0", edge: "#B98F4A" },
      { top: "#FFFFFF", center: "#F7F8F3", bottom: "#EEF0E8", edge: "#82946F" },
      { top: "#FFFFFF", center: "#FCF9F2", bottom: "#F0EBE0", edge: "#C69B4F" },
    ],
  },
  themeColors: {
    video: { stage: "#FAF9F6", accent: "#D6AD60", text: "#202020", rimA: "#D6AD60", rimB: "#B98F4A" },
    brand: { stage: "#FAF9F6", accent: "#D6AD60", text: "#202020", rimA: "#D6AD60", rimB: "#B98F4A" },
  },
};

const SERVICES = [
  ["Eligibility verification", "Coverage, benefits and demographic validation.", "Checks a patient's insurance coverage, benefits and demographic details before the visit, so claims start with accurate information.", "shield-check"],
  ["Prior authorization", "Payer requirements, tracking and follow-up.", "Identifies which services need payer approval, submits the requests and follows each one through to a decision.", "clipboard-check"],
  ["Medical coding support", "ICD-10, CPT, HCPCS review and clean-up.", "Reviews diagnosis and procedure codes against the documentation and cleans up errors before claims are billed.", "file-code"],
  ["Charge entry & validation", "Charge capture and billing preparation.", "Captures charges from each visit and checks them for completeness and accuracy so billing is ready to go out.", "receipt"],
  ["Claim submission", "Scrubbing, submission and rejection resolution.", "Scrubs claims for errors, submits them to payers and works through any rejections so claims keep moving.", "send"],
  ["Patient billing support", "Statements, billing inquiries and balances.", "Prepares patient statements, answers billing questions and helps manage outstanding patient balances.", "wallet"],
  ["Denial management", "Root-cause review, appeals and prevention.", "Finds out why claims were denied, files appeals, and flags repeat patterns so the same denials can be prevented.", "file-x"],
  ["Accounts receivable follow-up", "Aging, payer escalation and resolution.", "Reviews aging claims, follows up with payers and escalates unpaid balances until they are resolved.", "hourglass"],
  ["Payment posting", "ERA/EOB posting and reconciliation.", "Posts payments and adjustments from ERAs and EOBs, then reconciles them against what was expected.", "credit-card"],
  ["Provider credentialing", "Enrollment, CAQH and revalidation support.", "Supports payer enrollment, CAQH profile upkeep and revalidation so providers stay set up to bill.", "badge-check"],
  ["Medical billing audits", "Identify claim, workflow and AR gaps.", "Reviews claims, billing workflows and receivables to find gaps and areas to tighten.", "scale"],
  ["Performance reporting", "KPI trends, payer visibility and scorecards.", "Reports on clean claims, denials, days in AR, collections and payer trends so you can see how revenue is performing.", "bar-chart-3"],
].map(([title, brochure, detail, icon], index) => ({
  number: String(index + 1).padStart(2, "0"),
  title,
  brochure,
  detail,
  icon,
}));

const LUCIDE_ICON_PATHS = {
  "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  "clipboard-check": '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  "file-code": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h4"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h3v-4z"/>',
  "file-x": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m14.5 12.5 5 5"/><path d="m19.5 12.5-5 5"/>',
  hourglass: '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22"/><path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/>',
  "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
  "badge-check": '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 4-2 7-2s5 2 7 2h2"/>',
  "bar-chart-3": '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const mod = (value, size) => ((value % size) + size) % size;

function waitForFonts() {
  if (!document.fonts) return Promise.resolve();
  const fontLoad = document.fonts.load(`300 ${CONFIG.card.titleSize}px ${CONFIG.card.font}`);
  return Promise.race([
    Promise.all([fontLoad, document.fonts.ready]),
    new Promise((resolve) => window.setTimeout(resolve, CONFIG.card.fontWaitMs)),
  ]);
}

function loadCardImage(url, imageName) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      console.warn(`[RCM ring] ${imageName} could not be loaded: ${url}`);
      resolve(null);
    };
    image.src = url;
  });
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function loadLucideIcon(name) {
  return new Promise((resolve) => {
    const paths = LUCIDE_ICON_PATHS[name];
    if (!paths) {
      console.warn(`[RCM ring] Unknown Lucide icon: ${name}`);
      resolve(null);
      return;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A93C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    const icon = new Image();
    icon.onload = () => resolve(icon);
    icon.onerror = () => {
      console.warn(`[RCM ring] Lucide icon could not be loaded: ${name}`);
      resolve(null);
    };
    icon.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

function drawServiceIcon(context, icon, x, y, size) {
  context.save();
  roundedRect(context, x, y, size, size, 12);
  context.fillStyle = "rgba(212,169,60,.08)";
  context.fill();
  context.strokeStyle = "rgba(212,169,60,.55)";
  context.lineWidth = 2;
  context.stroke();
  if (icon) context.drawImage(icon, x + 32, y + 32, size - 64, size - 64);
  context.restore();
}

function wrapText(context, text, maxWidth, maximumLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, maximumLines);
}

function drawCard(index, image, icon, textColor) {
  const { width, height, font, palettes, imageHeight, imageOpacity, iconSize } = CONFIG.card;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const service = SERVICES[index];
  const palette = palettes[index % palettes.length];
  const radius = width * 0.05;

  context.save();
  roundedRect(context, 0, 0, width, height, radius);
  context.clip();

  const base = context.createLinearGradient(0, 0, width * 0.18, height);
  base.addColorStop(0, palette.top);
  base.addColorStop(0.48, palette.center);
  base.addColorStop(1, palette.bottom);
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);

  const edgeGlow = context.createRadialGradient(width * 0.05, height * 0.27, 0, width * 0.05, height * 0.27, width * 0.9);
  edgeGlow.addColorStop(0, `${palette.edge}55`);
  edgeGlow.addColorStop(1, `${palette.edge}00`);
  context.fillStyle = edgeGlow;
  context.fillRect(0, 0, width, height * imageHeight);
  const oppositeGlow = context.createRadialGradient(width * 0.94, height * 0.1, 0, width * 0.94, height * 0.1, width * 0.58);
  oppositeGlow.addColorStop(0, `${palette.top}77`);
  oppositeGlow.addColorStop(1, `${palette.top}00`);
  context.fillStyle = oppositeGlow;
  context.fillRect(0, 0, width, height * imageHeight);

  if (image) {
    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = width;
    imageCanvas.height = height;
    const imageContext = imageCanvas.getContext("2d");
    const destinationHeight = height * imageHeight;
    const zoom = 1.13 + (index % 4) * 0.07;
    const scale = Math.max(width / image.width, destinationHeight / image.height) * zoom;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const shiftX = (index % 3 - 1) * width * 0.06;
    const shiftY = (index % 4 - 1.5) * destinationHeight * 0.035;

    imageContext.drawImage(
      image,
      (width - drawWidth) / 2 + shiftX,
      (destinationHeight - drawHeight) / 2 + shiftY,
      drawWidth,
      drawHeight
    );
    const fade = imageContext.createLinearGradient(0, destinationHeight * 0.4, 0, destinationHeight);
    fade.addColorStop(0, "rgba(255,255,255,1)");
    fade.addColorStop(0.55, "rgba(255,255,255,.82)");
    fade.addColorStop(1, "rgba(255,255,255,0)");
    imageContext.globalCompositeOperation = "destination-in";
    imageContext.fillStyle = fade;
    imageContext.fillRect(0, 0, width, destinationHeight);

    context.globalCompositeOperation = "overlay";
    context.globalAlpha = imageOpacity;
    context.drawImage(imageCanvas, 0, 0);
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
  }

  drawServiceIcon(context, icon, width - iconSize - 56, 44, iconSize);

  const bottomShade = context.createLinearGradient(0, height * 0.48, 0, height);
  bottomShade.addColorStop(0, "rgba(0,0,0,0)");
  bottomShade.addColorStop(1, "rgba(32,32,32,.04)");
  context.fillStyle = bottomShade;
  context.fillRect(0, height * 0.48, width, height * 0.52);

  context.fillStyle = textColor;
  context.font = `300 ${CONFIG.card.titleSize}px ${font}`;
  context.textBaseline = "top";
  wrapText(context, service.title, width - iconSize - 120, 2).forEach((line, lineIndex) => {
    context.fillText(line, 64, 70 + lineIndex * 52);
  });

  context.fillStyle = "#777777";
  context.font = `300 ${CONFIG.card.descriptionSize}px ${font}`;
  context.textBaseline = "top";
  wrapText(context, service.brochure, width - 128, 3).forEach((line, lineIndex) => {
    context.fillText(line, 64, 190 + lineIndex * 42);
  });

  const tickStart = 64;
  const tickEnd = width - 64;
  const tickStep = (tickEnd - tickStart) / (CONFIG.card.tickCount - 1);
  const selectedTick = Math.round((index / (SERVICES.length - 1)) * (CONFIG.card.tickCount - 1));
  for (let tick = 0; tick < CONFIG.card.tickCount; tick += 1) {
    const tickHeight = tick % 5 === 0 ? 32 : 20;
    context.beginPath();
    context.lineWidth = tick === selectedTick ? 3 : 1.5;
    context.strokeStyle = tick === selectedTick ? "#D6AD60" : "rgba(32,32,32,.25)";
    context.moveTo(tickStart + tick * tickStep, height * 0.65 - tickHeight / 2);
    context.lineTo(tickStart + tick * tickStep, height * 0.65 + tickHeight / 2);
    context.stroke();
  }

  context.fillStyle = "rgba(32,32,32,.56)";
  context.font = `300 17px ${font}`;
  context.fillText("Crestia Ventures · Healthcare RCM", 64, height - 60);
  context.restore();

  return canvas;
}

function shaderMaterial(THREE, texture, width, height, uniformValues) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uMap: { value: texture },
      uFlare: { value: 0 },
      uOuterSign: { value: 1 },
      uSplit: { value: 0 },
      uStreak: { value: 0 },
      uRim: { value: uniformValues.rimGlow },
      uRimA: { value: new THREE.Color(uniformValues.rimA) },
      uRimB: { value: new THREE.Color(uniformValues.rimB) },
      uTexel: { value: 1 / width },
      uMaxFlare: { value: uniformValues.maxFlareScale },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vOuter;
      varying float vFlared;
      uniform float uFlare;
      uniform float uOuterSign;
      uniform float uMaxFlare;

      void main() {
        vUv = uv;
        float outerT = clamp(position.x * 2.0 * uOuterSign, 0.0, 1.0);
        float flareCurve = smoothstep(0.0, 1.0, outerT);
        float flareScale = 1.0 + uFlare * (uMaxFlare - 1.0) * flareCurve;
        vec3 p = position;
        p.y *= flareScale;
        vOuter = outerT;
        vFlared = uFlare * flareCurve;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vOuter;
      varying float vFlared;
      uniform sampler2D uMap;
      uniform float uSplit;
      uniform float uStreak;
      uniform float uRim;
      uniform vec3 uRimA;
      uniform vec3 uRimB;
      uniform float uTexel;

      void main() {
        vec2 uv = vUv;
        if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
        float effect = smoothstep(0.18, 0.92, vOuter) * vFlared;
        float split = uSplit * effect;
        vec4 center = texture2D(uMap, uv);
        vec4 red = texture2D(uMap, uv + vec2(split * uTexel, 0.0));
        vec4 blue = texture2D(uMap, uv - vec2(split * uTexel, 0.0));
        vec4 color = vec4(red.r, center.g, blue.b, center.a);

        float streak = uStreak * effect * uTexel;
        vec4 blur = texture2D(uMap, uv - vec2(streak * 1.0, 0.0)) * 0.08;
        blur += texture2D(uMap, uv - vec2(streak * 0.66, 0.0)) * 0.12;
        blur += texture2D(uMap, uv - vec2(streak * 0.33, 0.0)) * 0.16;
        blur += center * 0.28;
        blur += texture2D(uMap, uv + vec2(streak * 0.33, 0.0)) * 0.16;
        blur += texture2D(uMap, uv + vec2(streak * 0.66, 0.0)) * 0.12;
        blur += texture2D(uMap, uv + vec2(streak * 1.0, 0.0)) * 0.08;
        color = mix(color, blur, clamp(uStreak * 0.035 * effect, 0.0, 0.34));

        float edge = smoothstep(0.78, 1.0, vOuter) * vFlared;
        vec3 rim = mix(uRimA, uRimB, uv.y);
        color.rgb += rim * edge * uRim;
        gl_FragColor = color;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

function showFallback(root) {
  root.classList.add("rcm-ring--fallback");
  const list = root.querySelector(".rcm-ring__fallback");
  if (list) {
    list.replaceChildren(
      ...SERVICES.map((service) => {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        const brochure = document.createElement("span");
        const detail = document.createElement("span");
        title.textContent = `${service.number} ${service.title}`;
        brochure.textContent = service.brochure;
        detail.textContent = service.detail;
        item.append(title, brochure, detail);
        return item;
      })
    );
  }
}

export async function mountRcmRing(root, options = {}) {
  if (!root) return () => {};
  const config = {
    ...CONFIG,
    ...options,
    stage: { ...CONFIG.stage, ...options.stage },
    motion: { ...CONFIG.motion, ...options.motion },
    shader: { ...CONFIG.shader, ...options.shader },
    card: { ...CONFIG.card, ...options.card },
    themeColors: { ...CONFIG.themeColors, ...options.themeColors },
  };
  config.theme = options.theme || root.dataset.theme || CONFIG.theme;
  if (!config.themeColors[config.theme]) config.theme = CONFIG.theme;
  root.dataset.theme = config.theme;
  root.style.setProperty("--ring-stage-bg", config.themeColors[config.theme].stage);
  root.style.setProperty("--ring-accent", config.themeColors[config.theme].accent);
  root.style.setProperty("--ring-stage-min-height", `${config.stage.desktopMinHeight}px`);
  root.style.setProperty("--ring-stage-height-vw", `${config.stage.desktopHeightVw}vw`);
  root.style.setProperty("--ring-stage-max-height", `${config.stage.desktopMaxHeight}px`);
  root.style.setProperty("--ring-stage-aspect", String(config.stage.desktopAspect));
  root.style.setProperty("--ring-video-aspect", String(config.stage.videoAspect));
  root.style.setProperty("--ring-mobile-aspect", String(config.stage.mobileAspect));

  const stage = root.querySelector(".rcm-ring__stage");
  const canvasHost = root.querySelector(".rcm-ring__canvas");
  const captionTitle = root.querySelector(".rcm-ring__active-title");
  const captionDescription = root.querySelector(".rcm-ring__active-description");
  const counter = root.querySelector(".rcm-ring__counter");
  const liveRegion = root.querySelector(".rcm-ring__live");
  const previous = root.querySelector("[data-ring-previous]");
  const next = root.querySelector("[data-ring-next]");
  if (!stage || !canvasHost || !captionTitle || !captionDescription || !counter || !liveRegion) {
    throw new Error("[RCM ring] Required stage, controls, caption, or announcement element is missing.");
  }

  const abortController = new AbortController();
  const signal = abortController.signal;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let renderer;
  let scene;
  let camera;
  let meshes = [];
  let geometry;
  let resizeObserver;
  let intersectionObserver;
  let frameId = 0;
  let wakeTimer = 0;
  let destroyed = false;
  let visible = false;
  let hovered = false;
  let focusWithin = false;
  let dragging = false;
  let inertia = false;
  let inertiaSeconds = 0;
  let inertiaStartPosition = 0;
  let position = 0;
  let target = null;
  let velocity = 0;
  let pointerX = 0;
  let pointerTime = 0;
  let lastFrameTime = 0;
  let nextAutoAt = performance.now() + config.interval;
  let announcedIndex = -1;
  let cardsWidth = 0;
  let cardsHeight = 0;
  let cardsSpacing = 0;

  const dispose = () => {
    if (destroyed) return;
    destroyed = true;
    abortController.abort();
    if (frameId) cancelAnimationFrame(frameId);
    if (wakeTimer) window.clearTimeout(wakeTimer);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    meshes.forEach((mesh) => {
      mesh.material.uniforms.uMap.value.dispose();
      mesh.material.dispose();
    });
    geometry?.dispose();
    renderer?.dispose();
    renderer?.domElement.remove();
  };

  root.addEventListener("mouseenter", () => {
    hovered = true;
    stopAutoplayWake();
  }, { signal });
  root.addEventListener("mouseleave", () => {
    hovered = false;
    resumeAfterInteraction();
  }, { signal });
  root.addEventListener("focusin", () => {
    focusWithin = true;
    stopAutoplayWake();
  }, { signal });
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) {
      focusWithin = false;
      resumeAfterInteraction();
    }
  }, { signal });

  function isPaused() {
    return hovered || focusWithin || dragging || document.hidden || !visible;
  }

  function stopAutoplayWake() {
    if (wakeTimer) window.clearTimeout(wakeTimer);
    wakeTimer = 0;
  }

  function resumeAfterInteraction() {
    nextAutoAt = performance.now() + config.resumeDelay;
    scheduleWake();
    requestFrame();
  }

  function scheduleWake() {
    stopAutoplayWake();
    if (destroyed || !visible || document.hidden || hovered || focusWithin || dragging || !config.autoplay || reducedMotion.matches) return;
    const wait = Math.max(0, nextAutoAt - performance.now());
    wakeTimer = window.setTimeout(() => {
      wakeTimer = 0;
      requestFrame();
    }, wait);
  }

  function requestFrame() {
    if (!destroyed && visible && !document.hidden && !frameId) {
      frameId = requestAnimationFrame(renderFrame);
    }
  }

  function updateActiveText(index, announce) {
    const service = SERVICES[index];
    captionTitle.textContent = service.title;
    captionDescription.textContent = service.detail;
    counter.textContent = `${service.number} / ${String(SERVICES.length).padStart(2, "0")}`;
    if (announce) liveRegion.textContent = `${service.number}: ${service.title}. ${service.brochure} ${service.detail}`;
    const orangePalette = index % config.card.palettes.length === 0;
    root.classList.toggle("rcm-ring--lavender-glow", orangePalette);
  }

  function applyLayout() {
    if (!renderer || !stage.clientWidth || !stage.clientHeight) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    const visibleHeight = 2 * config.stage.cameraDistance * Math.tan((config.stage.cameraFov * Math.PI) / 360);
    const visibleWidth = visibleHeight * aspect;
    const mobile = width < config.stage.mobileBreakpoint;
    cardsWidth = mobile
      ? visibleWidth * config.stage.mobileCardWidth
      : visibleWidth * config.stage.desktopCardWidth;
    cardsHeight = cardsWidth / config.stage.cardAspect;
    if (!mobile) cardsHeight = visibleHeight * config.stage.desktopCardHeight;
    cardsSpacing = visibleWidth * (mobile ? config.stage.mobileSpacing : config.stage.spacing);
  }

  function drawScene(speed) {
    const activeIndex = mod(Math.round(position), SERVICES.length);
    if (activeIndex !== announcedIndex) {
      announcedIndex = activeIndex;
      updateActiveText(activeIndex, true);
    }

    meshes.forEach((mesh, index) => {
      const offset = mod(index - position + SERVICES.length / 2, SERVICES.length) - SERVICES.length / 2;
      const distance = Math.abs(offset);
      const visibleCard = distance <= config.stage.maxVisibleOffset;
      mesh.visible = visibleCard;
      if (!visibleCard) return;

      const angle = config.stage.sideAngle * clamp(offset, -1, 1);
      mesh.position.set(offset * cardsSpacing, 0, 0);
      mesh.rotation.set(0, angle, 0);
      const scale = 1 - (1 - (stage.clientWidth < config.stage.mobileBreakpoint
        ? config.stage.mobileNeighborScale
        : config.stage.neighborScale)) * Math.min(distance, 1);
      mesh.scale.set(cardsWidth * scale, cardsHeight * scale, 1);
      mesh.renderOrder = distance < 0.001 ? 1000 : 100 - distance * 10;

      const uniforms = mesh.material.uniforms;
      const flare = clamp(distance, 0, 1);
      const frontSign = Math.cos(angle);
      uniforms.uFlare.value = flare;
      uniforms.uOuterSign.value = Math.abs(frontSign) < 0.001
        ? Math.sign(offset) || 1
        : (offset * frontSign >= 0 ? 1 : -1);
      uniforms.uSplit.value = config.shader.baselineSplitPixels
        + (speed / config.shader.maximumSpeed) * config.shader.speedSplitPixels;
      uniforms.uStreak.value = config.shader.baselineStreakPixels
        + (speed / config.shader.maximumSpeed) * config.shader.speedStreakPixels;
    });

    renderer.render(scene, camera);
  }

  function renderFrame(time) {
    frameId = 0;
    if (destroyed || !visible || document.hidden) return;

    const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
    lastFrameTime = time;
    let speed = 0;
    let moving = false;

    if (inertia) {
      const step = Math.min(delta, Math.max(0, config.motion.maximumFlingSeconds - inertiaSeconds));
      position += velocity * step;
      inertiaSeconds += step;
      speed = Math.abs(velocity);
      moving = true;
      if (Math.abs(position - inertiaStartPosition) >= config.motion.maximumFlingCards) {
        position = inertiaStartPosition + Math.sign(velocity) * config.motion.maximumFlingCards;
        inertia = false;
        velocity = 0;
        target = Math.round(position);
      } else {
        velocity *= Math.exp(-config.motion.friction * step);
      }
      if (inertia && (inertiaSeconds >= config.motion.maximumFlingSeconds || Math.abs(velocity) < config.motion.stopFlingSpeed)) {
        inertia = false;
        velocity = 0;
        target = Math.round(position);
      }
    }

    if (target !== null && !dragging && !inertia) {
      const previousPosition = position;
      const easing = 1 - Math.exp(-delta * 1000 / (reducedMotion.matches ? config.motion.reducedSnapSpeedMs : config.motion.snapSpeedMs));
      position += (target - position) * easing;
      speed = Math.abs(position - previousPosition) / Math.max(delta, 0.001);
      moving = true;
      if (Math.abs(target - position) < 0.001) {
        position = target;
        target = null;
        velocity = 0;
        speed = 0;
        if (!isPaused()) nextAutoAt = time + config.resumeDelay;
      }
    }

    if (!dragging && !inertia && target === null && config.autoplay && !reducedMotion.matches && !isPaused() && time >= nextAutoAt) {
      target = Math.round(position) + 1;
      nextAutoAt = time + config.interval;
      moving = true;
    }

    if (dragging) {
      speed = Math.min(Math.abs(velocity), config.motion.speedCap);
      moving = true;
    }

    drawScene(Math.min(speed, config.motion.speedCap));

    if (moving || target !== null || dragging || inertia) {
      requestFrame();
    } else {
      lastFrameTime = 0;
      scheduleWake();
    }
  }

  function moveTo(index) {
    inertia = false;
    velocity = 0;
    target = position + index;
    requestFrame();
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    dragging = true;
    inertia = false;
    target = null;
    pointerX = event.clientX;
    pointerTime = performance.now();
    velocity = 0;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
    requestFrame();
  }

  function onPointerMove(event) {
    if (!dragging) return;
    const now = performance.now();
    const deltaX = event.clientX - pointerX;
    const elapsed = Math.max((now - pointerTime) / 1000, 0.001);
    const movement = -deltaX / Math.max(stage.clientWidth * config.stage.spacing, 1);
    position += movement;
    velocity = clamp((movement / elapsed) * 0.55 + velocity * 0.45, -config.motion.speedCap, config.motion.speedCap);
    pointerX = event.clientX;
    pointerTime = now;
    requestFrame();
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (Math.abs(velocity) >= config.motion.minimumFlingSpeed && !reducedMotion.matches) {
      inertia = true;
      inertiaSeconds = 0;
      inertiaStartPosition = position;
    } else {
      velocity = 0;
      target = Math.round(position);
    }
    resumeAfterInteraction();
    requestFrame();
  }

  function onKeyDown(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveTo((event.key === "ArrowRight" ? 1 : -1));
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopAutoplayWake();
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrameTime = 0;
    } else {
      nextAutoAt = performance.now() + config.interval;
      requestFrame();
      scheduleWake();
    }
  }

  try {
    await waitForFonts();
  } catch (error) {
    console.warn("[RCM ring] Display font unavailable; using the browser's fallback font.", error);
  }
  const [image, icons] = await Promise.all([
    loadCardImage(config.imageUrl, "Card image"),
    Promise.all(SERVICES.map((service) => loadLucideIcon(service.icon))),
  ]);
  if (destroyed) return dispose;

  let THREE;
  try {
    THREE = await import(config.threeModuleUrl);
  } catch (error) {
    console.error("[RCM ring] Three.js could not be loaded; showing the accessible service list.", error);
    showFallback(root);
    return dispose;
  }
  if (destroyed) return dispose;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(config.stage.cameraFov, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.z = config.stage.cameraDistance;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvasHost.appendChild(renderer.domElement);
    geometry = new THREE.PlaneGeometry(1, 1, 48, 36);

    meshes = SERVICES.map((service, index) => {
      const texture = new THREE.CanvasTexture(drawCard(index, image, icons[index], config.themeColors[config.theme].text));
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      const material = shaderMaterial(THREE, texture, config.card.width, config.card.height, {
        rimGlow: config.shader.rimGlow,
        maxFlareScale: config.stage.maxFlareScale,
        rimA: config.themeColors[config.theme].rimA,
        rimB: config.themeColors[config.theme].rimB,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 0;
      scene.add(mesh);
      return mesh;
    });

    applyLayout();
    announcedIndex = 0;
    updateActiveText(0, false);

    stage.addEventListener("pointerdown", onPointerDown, { signal });
    stage.addEventListener("pointermove", onPointerMove, { signal });
    stage.addEventListener("pointerup", onPointerUp, { signal });
    stage.addEventListener("pointercancel", onPointerUp, { signal });
    stage.addEventListener("keydown", onKeyDown, { signal });
    previous?.addEventListener("click", () => moveTo(-1), { signal });
    next?.addEventListener("click", () => moveTo(1), { signal });
    document.addEventListener("visibilitychange", onVisibilityChange, { signal });
    reducedMotion.addEventListener?.("change", () => {
      if (reducedMotion.matches) {
        inertia = false;
        velocity = 0;
        if (target === null) target = Math.round(position);
      }
      scheduleWake();
      requestFrame();
    }, { signal });

    resizeObserver = new ResizeObserver(() => {
      applyLayout();
      requestFrame();
    });
    resizeObserver.observe(stage);
    intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        stopAutoplayWake();
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
        lastFrameTime = 0;
      } else {
        nextAutoAt = performance.now() + config.interval;
        requestFrame();
      }
    });
    intersectionObserver.observe(root);
    root.classList.add("rcm-ring--ready");
    scheduleWake();
    return dispose;
  } catch (error) {
    console.error("[RCM ring] WebGL initialization failed; showing the accessible service list.", error);
    dispose();
    showFallback(root);
    return () => {};
  }
}

const defaultRoot = document.getElementById("rcm-ring");
if (defaultRoot) mountRcmRing(defaultRoot);

