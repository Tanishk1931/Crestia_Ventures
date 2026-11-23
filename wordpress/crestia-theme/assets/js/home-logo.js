import * as THREE from '../vendor/three.module.js';
import { MTLLoader } from '../vendor/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../vendor/jsm/loaders/OBJLoader.js';

const PART_NAMES = ['Gold', 'Navy_Big', 'Navy_Small', 'Green'];
const SCATTER = {
  Gold: { position: [-9, 8, 2], rotation: [0.85, 1.35, -0.75] },
  Navy_Big: { position: [9, 7, -2], rotation: [-0.95, -1.25, 1.1] },
  Navy_Small: { position: [-9, -8, 3], rotation: [1.35, 0.95, -1.2] },
  Green: { position: [9, -8, -3], rotation: [-1.1, 1.45, 0.85] },
};
const STAGING = {
  Gold: { position: [-1.9, 1.2, 0.7], rotation: [0.35, 0.4, -0.25] },
  Navy_Big: { position: [2, 0.9, -0.8], rotation: [-0.45, -0.5, 0.4] },
  Navy_Small: { position: [-1.4, -1.5, 0.9], rotation: [0.6, 0.3, -0.55] },
  Green: { position: [1.45, -1.1, -0.9], rotation: [-0.38, 0.55, 0.3] },
};

function createParts(source) {
  source.updateMatrixWorld(true);
  const sourceParts = source.children.filter((child) => PART_NAMES.includes(child.name));
  if (sourceParts.length !== PART_NAMES.length) {
    throw new Error(`The OBJ must contain ${PART_NAMES.join(', ')} as separate named objects.`);
  }
  const bounds = new THREE.Box3().setFromObject(source);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const fit = 3 / size.y;
  const parts = sourceParts.map((object) => {
    const partBounds = new THREE.Box3().setFromObject(object);
    const partCenter = partBounds.getCenter(new THREE.Vector3());
    object.traverse((node) => {
      if (node.isMesh) node.frustumCulled = false;
    });
    return {
      name: object.name,
      object: object.clone(true),
      center: partCenter,
      scatter: SCATTER[object.name],
    };
  });
  return { parts, center, fit };
}

function stateFingerprint(state) {
  return [
    state.emergence || 0,
    state.assembly || 0,
    state.turn || 0,
    state.travel || 0,
    state.navX || 0,
    state.navY || 0,
    state.navScale || 0,
  ].map((n) => n.toFixed(4)).join('|');
}

async function boot() {
  const host = document.getElementById('brand-canvas-host');
  const story = document.getElementById('brand-story');
  const config = window.crestiaHome;
  if (!host || !config?.models) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const maxDpr = isMobile ? 1.25 : 1.5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.domElement.className = 'brand-canvas';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  scene.add(new THREE.AmbientLight(0xffffff, 1.35));
  const hemi = new THREE.HemisphereLight(0xfff2d6, 0x07111a, 1.15);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcad9f6, 2.2);
  fill.position.set(5, 1, -4);
  scene.add(fill);
  const point = new THREE.PointLight(0xe1ae61, 1.5);
  point.position.set(0, -3, 5);
  scene.add(point);

  const materials = await new MTLLoader().loadAsync(config.models.mtl);
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  const source = await objLoader.loadAsync(config.models.obj);
  const model = createParts(source);

  const root = new THREE.Group();
  const centering = new THREE.Group();
  centering.position.copy(model.center.clone().multiplyScalar(-1));
  root.add(centering);

  const partNodes = model.parts.map((part) => {
    const outer = new THREE.Group();
    const inner = new THREE.Group();
    inner.position.copy(part.center.clone().multiplyScalar(-1));
    inner.add(part.object);
    outer.add(inner);
    centering.add(outer);
    return { part, outer };
  });
  scene.add(root);

  let raf = 0;
  let running = false;
  let visible = document.visibilityState === 'visible';
  let lastPrint = '';
  let lastW = 0;
  let lastH = 0;

  function resize(force) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (!force && width === lastW && height === lastH) return;
    lastW = width;
    lastH = height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    lastPrint = '';
  }

  function storyActive() {
    if (!story) return true;
    const rect = story.getBoundingClientRect();
    return rect.bottom > -80 && rect.top < window.innerHeight + 80;
  }

  function isAnimating(state) {
    const travel = state.travel || 0;
    const assembly = state.assembly || 0;
    const emergence = state.emergence || 0;
    return emergence < 0.999 || assembly < 0.999 || travel < 0.999;
  }

  function paint() {
    const state = window.crestiaAnimationState || {};
    const print = stateFingerprint(state);
    if (print === lastPrint) return false;
    lastPrint = print;

    const travel = state.travel || 0;
    const aspect = camera.aspect;
    const visibleHeight = 2 * 9 * Math.tan((36 * Math.PI) / 360);
    const responsiveScale = Math.min(1, aspect / 0.85);
    const mobile = aspect < 1.1;
    const viewWidth = visibleHeight * aspect;
    const heroX = mobile ? 0 : viewWidth * (state.heroX ?? 0.31);
    const heroY = mobile ? -visibleHeight * 0.3 : visibleHeight * (state.heroY || 0);

    root.position.set(
      heroX * (1 - travel) + (state.navX || 0) * travel,
      heroY * (1 - travel) + (state.navY || 0) * travel,
      0,
    );
    const sceneScale =
      responsiveScale * (mobile ? 0.78 : state.heroScale || 1.04) * (1 - travel) +
      (state.navScale || 0.06) * travel;
    root.scale.setScalar(model.fit * sceneScale);
    root.rotation.set(0, state.turn || 0, 0);

    const offscreenProgress = 1 - (state.emergence || 0);
    const stagingProgress = (state.emergence || 0) * (1 - (state.assembly || 0));
    const mobileSpread = mobile ? 0.48 : 1;

    partNodes.forEach(({ part, outer }) => {
      const staging = STAGING[part.name];
      const spreadX =
        part.scatter.position[0] * offscreenProgress +
        staging.position[0] * stagingProgress * mobileSpread;
      const spreadY =
        part.scatter.position[1] * offscreenProgress +
        staging.position[1] * stagingProgress * mobileSpread;
      const spreadZ =
        part.scatter.position[2] * offscreenProgress +
        staging.position[2] * stagingProgress * mobileSpread;
      outer.position.set(
        part.center.x + spreadX / model.fit,
        part.center.y + spreadY / model.fit,
        part.center.z + spreadZ / model.fit,
      );
      outer.rotation.set(
        (part.scatter.rotation[0] * offscreenProgress + staging.rotation[0] * (state.emergence || 0)) *
          (1 - (state.assembly || 0)),
        (part.scatter.rotation[1] * offscreenProgress + staging.rotation[1] * (state.emergence || 0)) *
          (1 - (state.assembly || 0)),
        (part.scatter.rotation[2] * offscreenProgress + staging.rotation[2] * (state.emergence || 0)) *
          (1 - (state.assembly || 0)),
      );
    });

    renderer.render(scene, camera);
    return true;
  }

  function tick() {
    if (!running) return;
    if (!visible) {
      running = false;
      raf = 0;
      return;
    }

    resize(false);
    const state = window.crestiaAnimationState || {};
    paint();

    // Keep rendering while the logo is still moving; once settled in the nav,
    // paint one final frame then idle (canvas retains the logo over the cards).
    if (!isAnimating(state) && !storyActive()) {
      lastPrint = '';
      paint();
      running = false;
      raf = 0;
      return;
    }

    raf = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (running || !visible || reducedMotion) return;
    running = true;
    lastPrint = '';
    raf = requestAnimationFrame(tick);
  }

  function onScroll() {
    const state = window.crestiaAnimationState || {};
    if (isAnimating(state) || storyActive()) {
      startLoop();
      return;
    }
    // Settled logo: ensure one fresh paint so it stays visible over cards.
    if (!running) {
      resize(false);
      lastPrint = '';
      paint();
    }
  }

  resize(true);
  if (!reducedMotion) {
    paint();
    startLoop();
  } else {
    // Reduced motion: assemble immediately and paint once.
    const state = window.crestiaAnimationState || {};
    state.emergence = 1;
    state.assembly = 1;
    state.travel = 1;
    paint();
  }

  window.addEventListener('resize', function () {
    resize(true);
    paint();
    startLoop();
  }, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', function () {
    visible = document.visibilityState === 'visible';
    if (visible) startLoop();
    else {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  });
}

boot().catch((error) => {
  console.error('The 3D brand scene could not be rendered.', error);
});
