import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, Center } from '@react-three/drei';

function Calendar() {
  const calendarRef = useRef(null);
  useFrame((state, delta) => {
    calendarRef.current.rotation.y += delta;
  });

  const { nodes } = useGLTF('./model/calendar.glb');
  const calendarBody = nodes.Cube.geometry;
  const calendarTop = nodes.Cube001.geometry;

  const bakedTexture = useTexture('./model/calendarBaked.jpg');
  bakedTexture.flipY = false;

  return (
    <>
      <OrbitControls makeDefault />

      <Center>
        <group ref={calendarRef}>
          <mesh geometry={calendarBody}>
            <meshBasicMaterial map={bakedTexture} />
          </mesh>

          <mesh position-y={1} geometry={calendarTop}>
            <meshBasicMaterial map={bakedTexture} />
          </mesh>
        </group>
      </Center>
    </>
  );
}

export default Calendar;
