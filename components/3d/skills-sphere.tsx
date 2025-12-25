'use client';

/**
 * Skills Sphere 3D Component
 * 
 * Renders a rotating cloud of skills distributed on a sphere.
 * Uses React Three Fiber and Drei's HTML component for crisp text/icons.
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js',
    'Node.js', 'Flutter', 'Dart', 'Tailwind', 'Three.js', 'SQL',
    'PostgreSQL', 'Python', 'Data Analysis', 'Git', 'Figma', 'UI/UX',
    'Redux', 'GraphQL'
];

function Word({ children, position, vec = new THREE.Vector3() }: { children: string, position: [number, number, number], vec?: THREE.Vector3 }) {
    const ref = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!ref.current) return;

        // Billboard effect: always face camera
        ref.current.quaternion.copy(state.camera.quaternion);

        // Scale on hover
        ref.current.scale.lerp(
            vec.set(hovered ? 1.5 : 1, hovered ? 1.5 : 1, 1),
            0.1
        );
    });

    return (
        <group ref={ref} position={position}>
            <Html
                transform
                distanceFactor={10} // Adjust scale
                style={{ pointerEvents: 'none' }} // HTML overlay doesn't block canvas events if needed, but we want interaction
            >
                <div
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    className={`
            cursor-pointer px-3 py-1.5 rounded-full border border-cyan-500/30
            backdrop-blur-md transition-colors duration-300
            ${hovered
                            ? 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                            : 'bg-black/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        }
          `}
                >
                    <span className="text-xs sm:text-sm font-mono whitespace-nowrap">{children}</span>
                </div>
            </Html>
        </group>
    );
}

function Cloud({ count = 8, radius = 20 }) {
    // Create a spherical distribution of points (Golden Spiral)
    const words = useMemo(() => {
        const temp = [];
        const spherical = new THREE.Spherical();
        const phiSpan = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < SKILLS.length; i++) {
            // Calculate point on a sphere surface
            const y = 1 - (i / (SKILLS.length - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phiSpan * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            temp.push({
                pos: new THREE.Vector3(x, y, z).multiplyScalar(radius),
                word: SKILLS[i]
            });
        }
        return temp;
    }, [radius]);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Slow rotation
            groupRef.current.rotation.y += delta * 0.1;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {words.map(({ pos, word }, index) => (
                <Word key={index} position={[pos.x, pos.y, pos.z]}>{word}</Word>
            ))}
        </group>
    );
}

export default function SkillsSphere() {
    return (
        <group>
            <Cloud count={SKILLS.length} radius={3} />
            {/* Ambient glow inside sphere */}
            <pointLight position={[0, 0, 0]} color="#06b6d4" intensity={2} distance={10} decay={2} />
        </group>
    );
}
