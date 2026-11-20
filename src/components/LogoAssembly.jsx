import { Component, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import Logo3D from './Logo3D.jsx';
import { brand } from '../data/brand.js';

useLoader.preload(MTLLoader, brand.material);

function WebGLFallback({ children }) {
  return (
    <div className="webgl-fallback" role="status">
      <span className="eyebrow">3D preview unavailable</span>
      <p>{children}</p>
    </div>
  );
}

class SceneErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('The 3D brand scene could not be rendered.', error);
  }

  render() {
    if (this.state.error) {
      return (
        <WebGLFallback>
          Check that the OBJ and MTL files are present in public/assets.
        </WebGLFallback>
      );
    }

    return this.props.children;
  }
}

export default function LogoAssembly({ animationState }) {
  return (
    <SceneErrorBoundary>
      <Canvas
        className="brand-canvas"
        camera={{ position: [0, 0, 9], fov: 36, near: 0.1, far: 100 }}
        dpr={[1, 1.65]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        fallback={
          <WebGLFallback>
            This browser does not support WebGL. The brand story remains available below.
          </WebGLFallback>
        }
      >
        <ambientLight intensity={1.35} />
        <hemisphereLight args={['#fff2d6', '#07111a', 1.15]} />
        <directionalLight position={[-4, 6, 8]} intensity={3.2} />
        <directionalLight position={[5, 1, -4]} intensity={2.2} color="#cad9f6" />
        <pointLight position={[0, -3, 5]} intensity={1.5} color="#e1ae61" />
        <Environment preset="studio" environmentIntensity={0.55} />
        <Suspense fallback={null}>
          <Logo3D animationState={animationState} />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  );
}
