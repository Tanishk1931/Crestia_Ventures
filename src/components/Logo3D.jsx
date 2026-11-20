import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
import { brand } from '../data/brand.js';

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
    throw new Error(
      `The OBJ must contain ${PART_NAMES.join(', ')} as separate named objects.`,
    );
  }

  const bounds = new THREE.Box3().setFromObject(source);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const fit = 3 / size.y;

  const parts = sourceParts.map((object) => {
    const partBounds = new THREE.Box3().setFromObject(object);
    const partCenter = partBounds.getCenter(new THREE.Vector3());
    const scatter = SCATTER[object.name];

    object.traverse((node) => {
      if (node.isMesh) node.frustumCulled = false;
    });

    return {
      name: object.name,
      object: object.clone(true),
      center: partCenter,
      scatter,
    };
  });

  return { parts, center, fit };
}

export default function Logo3D({ animationState }) {
  const materials = useLoader(MTLLoader, brand.material);
  materials.preload();
  const source = useLoader(OBJLoader, brand.model, (loader) => {
    loader.setMaterials(materials);
  });
  const model = useMemo(() => createParts(source), [source]);
  const rootRef = useRef(null);
  const partRefs = useRef([]);
  const compiledRef = useRef(false);
  const { size, gl, scene, camera } = useThree();

  useEffect(() => {
    if (compiledRef.current) return;

    gl.compile(scene, camera);
    compiledRef.current = true;
  }, [gl, scene, camera]);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;

    const state = animationState.current;
    const travel = state.travel;
    const aspect = size.width / size.height;
    const visibleHeight = 2 * 9 * Math.tan((36 * Math.PI) / 360);
    const responsiveScale = Math.min(1, aspect / 0.85);
    const mobile = aspect < 1.1;
    const viewWidth = visibleHeight * aspect;
    const heroX = mobile ? 0 : viewWidth * state.heroX;
    const heroY = mobile ? -visibleHeight * 0.3 : visibleHeight * state.heroY;

    root.position.set(
      heroX * (1 - travel) + state.navX * travel,
      heroY * (1 - travel) + state.navY * travel,
      0,
    );
    const sceneScale =
      responsiveScale * (mobile ? 0.78 : state.heroScale) * (1 - travel)
      + state.navScale * travel;
    root.scale.setScalar(model.fit * sceneScale);
    root.rotation.set(0, state.turn, 0);

    const offscreenProgress = 1 - state.emergence;
    const stagingProgress = state.emergence * (1 - state.assembly);
    const mobileSpread = mobile ? 0.48 : 1;

    model.parts.forEach((part, index) => {
      const node = partRefs.current[index];
      if (!node) return;

      const staging = STAGING[part.name];
      const spreadX =
        part.scatter.position[0] * offscreenProgress
        + staging.position[0] * stagingProgress * mobileSpread;
      const spreadY =
        part.scatter.position[1] * offscreenProgress
        + staging.position[1] * stagingProgress * mobileSpread;
      const spreadZ =
        part.scatter.position[2] * offscreenProgress
        + staging.position[2] * stagingProgress * mobileSpread;

      node.position.set(
        part.center.x + spreadX / model.fit,
        part.center.y + spreadY / model.fit,
        part.center.z + spreadZ / model.fit,
      );
      node.rotation.set(
        (part.scatter.rotation[0] * offscreenProgress + staging.rotation[0] * state.emergence)
          * (1 - state.assembly),
        (part.scatter.rotation[1] * offscreenProgress + staging.rotation[1] * state.emergence)
          * (1 - state.assembly),
        (part.scatter.rotation[2] * offscreenProgress + staging.rotation[2] * state.emergence)
          * (1 - state.assembly),
      );
    });

  });

  return (
    <group ref={rootRef}>
      <group position={model.center.clone().multiplyScalar(-1)}>
        {model.parts.map((part, index) => (
          <group
            key={part.name}
            ref={(node) => {
              partRefs.current[index] = node;
            }}
            position={[
              part.center.x + part.scatter.position[0] / model.fit,
              part.center.y + part.scatter.position[1] / model.fit,
              part.center.z + part.scatter.position[2] / model.fit,
            ]}
            rotation={part.scatter.rotation}
          >
            <group position={part.center.clone().multiplyScalar(-1)}>
              <primitive object={part.object} />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
