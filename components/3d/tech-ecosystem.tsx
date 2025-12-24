'use client';

import { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLSupported } from '@/lib/utils/webgl-detection';
import {
  getFPSMonitor,
  logFPSMetrics,
  createSphereLOD,
  applyFrustumCulling,
  ParticlePool,
  useLazyScene,
  AdaptiveQualityManager,
  disposeObject,
} from '@/lib/utils/3d-performance';

export interface Technology {
  id: string;
  name: string;
  category: string;
  relatedTech: string[]; // IDs of related technologies
}

interface TechEcosystemProps {
  technologies: Technology[];
  onTechHover?: (tech: Technology | null) => void;
  className?: string;
}

interface TechNodeProps {
  technology: Technology;
  position: [number, number, number];
  isHovered: boolean;
  isRelated: boolean;
  onHover: (tech: Technology | null) => void;
  categoryColor: string;
}

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
}

/**
 * Calculate positions for technologies in a circular layout
 * Groups by category and arranges in concentric circles
 */
function calculateNodePositions(technologies: Technology[]): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>();
  
  // Group technologies by category
  const categories = new Map<string, Technology[]>();
  technologies.forEach(tech => {
    if (!categories.has(tech.category)) {
      categories.set(tech.category, []);
    }
    categories.get(tech.category)!.push(tech);
  });
  
  const categoryArray = Array.from(categories.entries());
  const numCategories = categoryArray.length;
  
  // Arrange categories in concentric circles
  categoryArray.forEach(([category, techs], categoryIndex) => {
    const radius = 3 + (categoryIndex % 3) * 2; // Vary radius for visual interest
    const angleOffset = (categoryIndex * Math.PI * 2) / numCategories;
    const numTechs = techs.length;
    
    techs.forEach((tech, techIndex) => {
      const angle = angleOffset + (techIndex * Math.PI * 2) / numTechs;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.5; // Slight vertical variation
      
      positions.set(tech.id, [x, y, z]);
    });
  });
  
  return positions;
}

/**
 * Get color for a category
 */
function getCategoryColor(category: string, index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ];
  return colors[index % colors.length];
}

/**
 * Connection line between related technologies
 */
function ConnectionLine({ start, end, isHighlighted }: ConnectionLineProps) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ], [start, end]);
  
  return (
    <Line
      points={points}
      color={isHighlighted ? '#ffffff' : '#444444'}
      lineWidth={isHighlighted ? 2 : 1}
      opacity={isHighlighted ? 0.8 : 0.2}
      transparent
    />
  );
}

/**
 * Individual technology node with LOD optimization
 */
function TechNode({ technology, position, isHovered, isRelated, onHover, categoryColor }: TechNodeProps) {
  const lodRef = useRef<THREE.LOD>(null);
  const [hovered, setHovered] = useState(false);
  
  // Create material once
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: categoryColor,
      metalness: 0.5,
      roughness: 0.2,
    });
  }, [categoryColor]);
  
  useFrame((state) => {
    if (!lodRef.current) return;
    
    // Gentle floating animation
    const time = state.clock.getElapsedTime();
    lodRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1;
    
    // Scale animation on hover
    const targetScale = isHovered || hovered ? 1.5 : isRelated ? 1.2 : 1.0;
    lodRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
    
    // Rotation
    if (isHovered || hovered) {
      lodRef.current.rotation.y += 0.02;
    }
    
    // Update material color
    const color = isHovered || hovered ? '#ffffff' : categoryColor;
    const emissive = isHovered || hovered ? categoryColor : '#000000';
    const emissiveIntensity = isHovered || hovered ? 0.5 : 0;
    
    lodRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.color.set(color);
        child.material.emissive.set(emissive);
        child.material.emissiveIntensity = emissiveIntensity;
      }
    });
  });
  
  const handlePointerOver = () => {
    setHovered(true);
    onHover(technology);
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (lodRef.current) {
        disposeObject(lodRef.current);
      }
      material.dispose();
    };
  }, [material]);
  
  return (
    <group position={position}>
      <primitive
        ref={lodRef}
        object={createSphereLOD(0.3, material)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      
      {/* Label - only show when hovered or related */}
      {(isHovered || hovered || isRelated) && (
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.2}
          color={isHovered || hovered || isRelated ? '#ffffff' : '#888888'}
          anchorX="center"
          anchorY="middle"
        >
          {technology.name}
        </Text>
      )}
    </group>
  );
}

/**
 * The 3D scene containing all technology nodes and connections with performance optimizations
 */
function TechEcosystemScene({ technologies, onTechHover }: { technologies: Technology[]; onTechHover?: (tech: Technology | null) => void }) {
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null);
  const { camera } = useThree();
  const targetCameraPosition = useRef(new THREE.Vector3(0, 0, 12));
  const fpsMonitor = getFPSMonitor();
  const qualityManager = useRef(new AdaptiveQualityManager('high'));
  const nodeRefs = useRef<THREE.Object3D[]>([]);
  const frameCount = useRef(0);
  
  // Calculate node positions
  const nodePositions = useMemo(() => calculateNodePositions(technologies), [technologies]);
  
  // Group by category for colors
  const categories = useMemo(() => {
    const cats = new Map<string, Technology[]>();
    technologies.forEach(tech => {
      if (!cats.has(tech.category)) {
        cats.set(tech.category, []);
      }
      cats.get(tech.category)!.push(tech);
    });
    return Array.from(cats.keys());
  }, [technologies]);
  
  // Get category colors
  const categoryColors = useMemo(() => {
    const colors = new Map<string, string>();
    categories.forEach((cat, index) => {
      colors.set(cat, getCategoryColor(cat, index));
    });
    return colors;
  }, [categories]);
  
  // Log FPS metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      logFPSMetrics('TechEcosystem');
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle hover
  const handleHover = (tech: Technology | null) => {
    setHoveredTech(tech);
    if (onTechHover) {
      onTechHover(tech);
    }
    
    // Adjust camera on hover
    if (tech) {
      const pos = nodePositions.get(tech.id);
      if (pos) {
        targetCameraPosition.current.set(pos[0] * 0.5, pos[1] * 0.5, 10);
      }
    } else {
      targetCameraPosition.current.set(0, 0, 12);
    }
  };
  
  // Smooth camera transitions with performance monitoring
  useFrame(() => {
    // Update FPS monitor
    const metrics = fpsMonitor.update();
    frameCount.current++;
    
    // Update quality settings
    const quality = qualityManager.current.update();
    
    // Apply frustum culling to all nodes
    if (nodeRefs.current.length > 0 && frameCount.current % 10 === 0) {
      applyFrustumCulling(nodeRefs.current, camera);
    }
    
    // Smooth camera movement
    camera.position.lerp(targetCameraPosition.current, 0.05);
    camera.lookAt(0, 0, 0);
    
    // Log performance warnings
    if (frameCount.current % 300 === 0 && metrics.average < 50) {
      console.warn(`[TechEcosystem] Performance degraded: ${metrics.average} fps`);
    }
  });
  
  // Get related tech IDs
  const relatedTechIds = useMemo(() => {
    if (!hoveredTech) return new Set<string>();
    return new Set(hoveredTech.relatedTech);
  }, [hoveredTech]);
  
  // Build connections (only show highlighted ones in low quality)
  const connections = useMemo(() => {
    const conns: Array<{ start: [number, number, number]; end: [number, number, number]; isHighlighted: boolean }> = [];
    const quality = qualityManager.current.getCurrentQuality();
    
    technologies.forEach(tech => {
      const startPos = nodePositions.get(tech.id);
      if (!startPos) return;
      
      tech.relatedTech.forEach(relatedId => {
        const endPos = nodePositions.get(relatedId);
        if (!endPos) return;
        
        const isHighlighted = hoveredTech?.id === tech.id || hoveredTech?.id === relatedId;
        
        // In low quality, only show highlighted connections
        if (quality.level === 'low' && !isHighlighted) return;
        
        conns.push({
          start: startPos,
          end: endPos,
          isHighlighted,
        });
      });
    });
    
    return conns;
  }, [technologies, nodePositions, hoveredTech]);
  
  const quality = qualityManager.current.getCurrentQuality();
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      {quality.level !== 'low' && (
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
      )}
      
      {/* Connection lines */}
      {connections.map((conn, index) => (
        <ConnectionLine
          key={index}
          start={conn.start}
          end={conn.end}
          isHighlighted={conn.isHighlighted}
        />
      ))}
      
      {/* Technology nodes */}
      {technologies.map((tech, index) => {
        const position = nodePositions.get(tech.id);
        if (!position) return null;
        
        const isHovered = hoveredTech?.id === tech.id;
        const isRelated = relatedTechIds.has(tech.id);
        const categoryColor = categoryColors.get(tech.category) || '#3b82f6';
        
        return (
          <TechNode
            key={tech.id}
            technology={tech}
            position={position}
            isHovered={isHovered}
            isRelated={isRelated}
            onHover={handleHover}
            categoryColor={categoryColor}
          />
        );
      })}
    </>
  );
}

/**
 * Loading fallback
 */
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
      <div className="text-white text-sm">Loading tech ecosystem...</div>
    </div>
  );
}

/**
 * 2D fallback for browsers without WebGL
 */
function FallbackEcosystem({ technologies, className }: { technologies: Technology[]; className?: string }) {
  // Group by category
  const categories = useMemo(() => {
    const cats = new Map<string, Technology[]>();
    technologies.forEach(tech => {
      if (!cats.has(tech.category)) {
        cats.set(tech.category, []);
      }
      cats.get(tech.category)!.push(tech);
    });
    return cats;
  }, [technologies]);
  
  return (
    <div className={`w-full h-full overflow-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg ${className || ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from(categories.entries()).map(([category, techs]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-lg font-semibold text-white">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {techs.map(tech => (
                <span
                  key={tech.id}
                  className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Tech Ecosystem Map Component
 * 
 * Features:
 * - 3D circular visualization using Three.js
 * - Technology node positioning algorithm
 * - Category-based grouping with visual connections
 * - Hover effects showing related technologies
 * - Smooth camera transitions when hovering
 * - Optimized for 50+ technology nodes
 * - Performance optimizations: LOD, frustum culling, adaptive quality, FPS monitoring
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.5
 */
export default function TechEcosystem({
  technologies,
  onTechHover,
  className = '',
}: TechEcosystemProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lazy loading: only initialize 3D scene when visible
  const isVisible = useLazyScene(containerRef, { rootMargin: '200px', threshold: 0.1 });
  
  // Check WebGL support on mount
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
  }, []);
  
  // Show loading state while checking WebGL support
  if (webGLSupported === null) {
    return (
      <div ref={containerRef} className={`w-full h-full ${className}`}>
        <LoadingFallback />
      </div>
    );
  }
  
  // Fallback to 2D grid if WebGL is not supported
  if (!webGLSupported) {
    console.warn('WebGL not supported, falling back to 2D grid');
    return <FallbackEcosystem technologies={technologies} className={className} />;
  }
  
  // Don't render 3D scene until visible (lazy loading)
  if (!isVisible) {
    return (
      <div ref={containerRef} className={`w-full h-full ${className}`}>
        <LoadingFallback />
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <Suspense fallback={null}>
          <TechEcosystemScene
            technologies={technologies}
            onTechHover={onTechHover}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
