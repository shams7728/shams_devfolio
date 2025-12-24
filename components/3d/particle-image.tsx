'use client';

import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Vertex Shader: Handles particle position, size based on luminance, and interaction
const vertexShader = `
  uniform float uTime;
  uniform float uhover;
  uniform vec2 uMouse;
  uniform sampler2D uTexture;
  
  attribute float size;
  attribute float speed;
  
  varying vec2 vUv;
  varying vec3 vColor;

  void main() {
    vUv = uv;
    
    // Sample texture for luminance-based sizing
    vec4 texColor = texture2D(uTexture, uv);
    float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Calculate distance from mouse
    vec3 pos = position;
    vec2 mouseSpace = uMouse * 2.0 - 1.0;
    float distinct = distance(pos.xy, mouseSpace);
    float hoverArea = smoothstep(0.4, 0.0, distinct);

    // Particle displacement on hover
    float directionX = pos.x - mouseSpace.x;
    float directionY = pos.y - mouseSpace.y;
    
    // Move particles away from mouse
    pos.x += directionX * hoverArea * 0.5 * uhover;
    pos.y += directionY * hoverArea * 0.5 * uhover;
    pos.z += hoverArea * 0.8 * uhover; // Pop out more
    
    // Use luminance for depth effect too
    pos.z += luminance * 0.2; 

    // Mild ambient movement
    pos.x += sin(uTime * speed + pos.y) * 0.002;
    pos.y += cos(uTime * speed + pos.x) * 0.002;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size based on luminance: Darker = Smaller. 
    // Threshold: if luminance < 0.1, size drops to near zero
    float sizeFactor = smoothstep(0.1, 0.8, luminance);
    
    gl_PointSize = size * sizeFactor * (400.0 / -mvPosition.z) * (1.0 + hoverArea * 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader: Handles particle color
const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Circular particles soft edge
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float circle = dot(cxy, cxy);
    if (circle > 1.0) discard;
    
    // Slight opacity falloff for softer look
    gl_FragColor = vec4(texColor.rgb, 1.0 - circle * 0.5);
  }
`;

interface ParticlePlaneProps {
    image: string;
}

function ParticlePlane({ image }: ParticlePlaneProps) {
    const meshRef = useRef<THREE.Points>(null);
    const texture = useTexture(image);

    // Create particle geometry
    const geometry = useMemo(() => {
        // Reduced density for performance (was 100x120)
        const width = 60;
        const height = 75;

        const count = width * height;
        const positions = new Float32Array(count * 3);
        const uvs = new Float32Array(count * 2);
        const sizes = new Float32Array(count);
        const speeds = new Float32Array(count);

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const index = i * height + j;

                // Normalized coordinates (-1 to 1)
                // Maintain aspect ratio roughly 0.8 (Portrait)
                positions[index * 3] = (i / width) * 1.6 - 0.8; // Width
                positions[index * 3 + 1] = (j / height) * 2.0 - 1.0; // Height
                positions[index * 3 + 2] = 0;

                // UV coordinates (0 to 1)
                uvs[index * 2] = i / width;
                uvs[index * 2 + 1] = j / height;

                sizes[index] = Math.random() < 0.1 ? 4.0 : 2.5; // Base sizes
                speeds[index] = Math.random() * 0.5 + 0.5;
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

        return geo;
    }, []);

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uhover: { value: 0 }
    }), [texture]);

    useFrame((state) => {
        if (!meshRef.current) return;

        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = state.clock.getElapsedTime();

        // Lerp mouse interaction
        const targetHover = new THREE.Vector2(
            (state.mouse.x + 1) / 2,
            (state.mouse.y + 1) / 2
        );

        // Check if mouse is near center (simulating hover on the card)
        const dist = targetHover.distanceTo(new THREE.Vector2(0.5, 0.5));
        const isHovering = dist < 0.6 ? 1 : 0;

        material.uniforms.uhover.value = THREE.MathUtils.lerp(
            material.uniforms.uhover.value,
            isHovering,
            0.1
        );

        material.uniforms.uMouse.value.lerp(targetHover, 0.1);
    });

    return (
        <points ref={meshRef} geometry={geometry}>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
            />
        </points>
    );
}

export default function ParticleImage({ imageUrl = '/portrait.jpg', className = '' }: { imageUrl?: string, className?: string }) {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas camera={{ position: [0, 0, 1.5], fov: 50 }}>
                <Suspense fallback={null}>
                    <ParticlePlane image={imageUrl} />
                </Suspense>
            </Canvas>
        </div>
    );
}
