import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  useMatcapTexture,
  Center,
  Text3D,
  useTexture,
} from '@react-three/drei';

/**
 * Displays the Calendar component, a Blender model with baked textures
 * @returns {JSX.Element}
 */
function Calendar() {
  const calendarRef = useRef(null);
  const matcapTexture = useMatcapTexture('045C5C_0DBDBD_049393_04A4A4', 256);

  // Rotate the calendar. Delta is the time passed between renders. Using it standarizes the animation on all different monitors or screens
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

          <Text3D
            scale={0.7}
            position-z={0.1}
            position-x={-0.5}
            position-y={-0.3}
            font={'./fonts/Roboto_Regular.json'}
          >
            23
            <meshMatcapMaterial matcap={matcapTexture} />
          </Text3D>
        </group>
      </Center>
    </>
  );
}

export default Calendar;
