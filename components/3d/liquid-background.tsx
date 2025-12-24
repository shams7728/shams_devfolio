'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Vector2, Vector3 } from 'three';

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Simplex noise (simplified)
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // Mouse influence
    float dist = distance(uv, uMouse);
    float mouseEffect = smoothstep(0.5, 0.0, dist) * 0.1;
    
    // Noise layers
    float n1 = snoise(uv * 3.0 + uTime * 0.1 + mouseEffect);
    float n2 = snoise(uv * 6.0 - uTime * 0.2);
    
    // Fluid mixture
    float mixFactor = (n1 + n2) * 0.5 + 0.5;
    
    // Color blending
    vec3 color = mix(uColor1, uColor2, mixFactor);
    color = mix(color, uColor3, n2 * 0.5 + 0.5);
    
    // Vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.5;
    
    gl_FragColor = vec4(color * vignette, 1.0);
  }
`;

const LiquidPlane = ({
  c1 = '#020617',
  c2 = '#3b82f6',
  c3 = '#06b6d4'
}: { c1?: string; c2?: string; c3?: string }) => {
  const meshRef = useRef<any>(null);
  const { mouse } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new Color(c1) },
    uColor2: { value: new Color(c2) },
    uColor3: { value: new Color(c3) },
    uMouse: { value: new Vector2(0.5, 0.5) },
  }), [c1, c2, c3]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();

      // Smooth mouse movement
      const targetX = (mouse.x + 1) * 0.5;
      const targetY = (mouse.y + 1) * 0.5;

      meshRef.current.material.uniforms.uMouse.value.lerp(
        new Vector3(targetX, targetY, 0),
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

interface LiquidBackgroundProps {
  c1?: string;
  c2?: string;
  c3?: string;
}

export default function LiquidBackground({ c1, c2, c3 }: LiquidBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]} // Optimize for pixel ratio
        resize={{ scroll: false }} // Prevent resize thrashing
      >
        <LiquidPlane c1={c1} c2={c2} c3={c3} />
      </Canvas>
    </div>
  );
}
