import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, Environment, useHelper } from '@react-three/drei';
import PropTypes from 'prop-types';
import Card from './Card';
import * as S from './styles';
import { COLORS, TEXTS, TEXT_COLORS, ButtonTexts } from './constants';
import { gsap } from 'gsap';

const Lights = () => {
  const mainLight = useRef();
  const fillLight = useRef();
  const rimLight = useRef();

  // 디버깅을 위한 helper (개발 시에만 사용)
  // useHelper(mainLight, THREE.DirectionalLightHelper, 1);
  // useHelper(fillLight, THREE.DirectionalLightHelper, 1);
  // useHelper(rimLight, THREE.DirectionalLightHelper, 1);

  return (
    <>
      <ambientLight intensity={0.1} /> {/* 기본 환경광 감소 */}
      <directionalLight
        ref={mainLight}
        position={[10, 10, 10]}
        intensity={0.8}
        castShadow
      />
      <directionalLight
        ref={fillLight}
        position={[-10, 0, -10]}
        intensity={0.4}
      />
      <directionalLight
        ref={rimLight}
        position={[0, -10, 0]}
        intensity={0.4}
      />
      <pointLight position={[0, 0, 5]} intensity={0.4} />
    </>
  );
};

const CardThreeJS = ({ onSelectAgent }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const cardRef = useRef();

  const handleButtonClick = (index) => {
    setColorIndex(index);
    if (cardRef.current) {
      gsap.to(cardRef.current.rotation, {
        y: cardRef.current.rotation.y - Math.PI,
        duration: 1,
        ease: 'back.out(2.5)',
      });
    }
    onSelectAgent(index);
  };

  return (
    <S.Container>
      <div style={{ width: '100%', height: '500px' }} className='mb-20'>
        {/* <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} /> */}
          <Canvas 
          camera={{ position: [0, 0, 25], fov: 75 }}
          gl={{ 
            antialias: true,
            alpha: true,
            // 추가적인 렌더링 품질 설정
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
        >
          <Lights />
          {/* Environment 추가 */}
          <Environment preset="studio" />
          <group ref={cardRef}>
            <Card color={COLORS[colorIndex]} />
            <group position={[-2, 2, 0.3]} rotation={[0, 0, Math.PI * 0.1]}>
              <Center>
                <Text3D
                  size={1}
                  height={0.1}
                  curveSegments={12}
                  bevelEnabled
                  bevelThickness={0.01}
                  bevelSize={0.01}
                  bevelOffset={0}
                  bevelSegments={5}
                  font="/fonts/helvetiker_regular.json"
                >
                  {TEXTS[colorIndex]}
                  <meshStandardMaterial 
                    color={TEXT_COLORS[colorIndex]} 
                    metalness={0.5}
                    roughness={0.2}
                  />
                </Text3D>
              </Center>
            </group>
          </group>
          <OrbitControls
            autoRotate
            autoRotateSpeed={2.5}
            enableDamping
            enableZoom={false}
            minPolarAngle={Math.PI / 2 - Math.PI / 3}
            maxPolarAngle={Math.PI / 2 + Math.PI / 3}
          />
        </Canvas>
      </div>
      <S.ButtonContainer>
        {COLORS.map((color, index) => (
          <S.ColorButton
            key={index}
            style={{ backgroundColor: color }}
            onClick={() => handleButtonClick(index)}
          >
            {ButtonTexts[index]}
          </S.ColorButton>
        ))}
      </S.ButtonContainer>
    </S.Container>
  );
};

CardThreeJS.propTypes = {
  onSelectAgent: PropTypes.func.isRequired,
};

export default CardThreeJS;