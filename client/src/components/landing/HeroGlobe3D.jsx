import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

function RotatingOrb() {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25;
      ref.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <Sphere ref={ref} args={[1.8, 64, 64]} scale={1.2}>
      <MeshDistortMaterial
        color="#6366f1"
        attach="material"
        distort={0.35}
        speed={1.5}
        roughness={0.2}
        metalness={0.6}
        transparent
        opacity={0.55}
      />
    </Sphere>
  );
}

export default function HeroGlobe3D() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40 sm:opacity-50">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} />
        <pointLight position={[-4, -2, 2]} intensity={0.8} color="#a855f7" />
        <RotatingOrb />
      </Canvas>
    </div>
  );
}
