// Card.jsx
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import PropTypes from 'prop-types';

const Card = ({ color }) => {
  const meshRef = useRef();

  const width = 10;
  const height = 15.8;
  const radius = 0.5;
  const x = width / 2 - radius;
  const y = height / 2 - radius;

  const shape = new THREE.Shape();
  shape.absarc(x, y, radius, Math.PI / 2, 0, true)
    .lineTo(x + radius, -y)
    .absarc(x, -y, radius, 0, -Math.PI / 2, true)
    .lineTo(-x, -(y + radius))
    .absarc(-x, -y, radius, -Math.PI / 2, Math.PI, true)
    .lineTo(-(x + radius), y)
    .absarc(-x, y, radius, Math.PI, Math.PI / 2, true);

  const extrudeSettings = {
    depth: 0.01,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 3
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[0, 0, Math.PI * 0.1]}
    >
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        roughness={0.5}
        metalness={0.5}
      />
    </mesh>
  );
};

Card.propTypes = {
  color: PropTypes.string.isRequired,
};

export default Card;