import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Calendar from './Calendar';

function CanvasComponent() {
  const cameraSettings = {
    fov: 75,
    near: 0.1,
    far: 100,
    position: [1, 1, 3],
  };

  return (
    <Canvas
      flat
      shadows
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={cameraSettings}
    >
      <color attach='background' args={['#ebebeb']} />
      <Calendar />
    </Canvas>
  );
}

export default CanvasComponent;
