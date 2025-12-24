'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLSupported } from '@/lib/utils/webgl-detection';
import {
  getFPSMonitor,
  logFPSMetrics,
  createPlaneLOD,
  optimizeTexture,
  isInFrustum,
  useLazyScene,
  AdaptiveQualityManager,
  disposeObject,
} from '@/lib/utils/3d-performance';

interface FloatingPortraitProps {
  imageUrl: string;
  enableParallax?: boolean;
  lightingIntensity?: number;
  className?: string;
}

interface PortraitMeshProps {
  imageUrl: string;
  mousePosition: { x: number; y: number };
  enableParallax: boolean;
  lightingIntensity: number;
}

/**
 * The actual 3D portrait mesh component with performance optimizations
 */
function PortraitMesh({ imageUrl, mousePosition, enableParallax, lightingIntensity }: PortraitMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lodRef = useRef<THREE.LOD>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const { camera, gl } = useThree();
  const fpsMonitor = getFPSMonitor();
  const qualityManager = useRef(new AdaptiveQualityManager('high'));
  const frameCount = useRef(0);
  
  // Load and optimize the portrait texture
  const texture = useTexture(imageUrl);
  
  useEffect(() => {
    if (texture) {
      optimizeTexture(texture, {
        maxSize: 2048,
        generateMipmaps: true,
        anisotropy: gl.capabilities.getMaxAnisotropy(),
      });
    }
  }, [texture, gl]);
  
  // Log FPS metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      logFPSMetrics('FloatingPortrait');
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Subtle rotation animation with performance monitoring
  useFrame((state) => {
    const mesh = meshRef.current || lodRef.current;
    if (!mesh) return;
    
    // Update FPS monitor
    const metrics = fpsMonitor.update();
    frameCount.current++;
    
    // Update quality settings based on performance
    const quality = qualityManager.current.update();
    
    const time = state.clock.getElapsedTime();
    
    // Frustum culling check
    const inFrustum = isInFrustum(mesh, camera);
    mesh.visible = inFrustum;
    
    if (!inFrustum) return; // Skip updates if not visible
    
    // Subtle rotation animation (only if in frustum)
    mesh.rotation.x = Math.sin(time * 0.3) * 0.05;
    mesh.rotation.y = Math.cos(time * 0.2) * 0.05;
    
    // Parallax motion following mouse
    if (enableParallax) {
      const targetX = mousePosition.x * 0.5;
      const targetY = mousePosition.y * 0.5;
      
      // Smooth camera movement
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
    }
    
    // Reactive lighting based on cursor proximity (only in high quality)
    if (pointLightRef.current && quality.level !== 'low') {
      const distance = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2);
      const intensity = lightingIntensity * (1 + (1 - Math.min(distance, 1)) * 0.5);
      pointLightRef.current.intensity = intensity;
      
      // Move light towards cursor
      pointLightRef.current.position.x = mousePosition.x * 2;
      pointLightRef.current.position.y = mousePosition.y * 2;
    }
    
    // Log performance warnings
    if (frameCount.current % 300 === 0 && metrics.average < 50) {
      console.warn(`[FloatingPortrait] Performance degraded: ${metrics.average} fps`);
    }
  });
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        disposeObject(meshRef.current);
      }
      if (lodRef.current) {
        disposeObject(lodRef.current);
      }
    };
  }, []);
  
  const quality = qualityManager.current.getCurrentQuality();
  
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Point light that reacts to cursor (disabled in low quality) */}
      {quality.level !== 'low' && (
        <pointLight
          ref={pointLightRef}
          position={[0, 0, 5]}
          intensity={lightingIntensity}
          color="#ffffff"
          distance={10}
        />
      )}
      
      {/* Directional light for depth */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.3}
        color="#ffffff"
      />
      
      {/* The portrait plane with LOD */}
      <primitive
        ref={lodRef}
        object={createPlaneLOD(
          4,
          4,
          new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
          })
        )}
        position={[0, 0, 0]}
      />
    </>
  );
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
      <div className="text-white text-sm">Loading 3D portrait...</div>
    </div>
  );
}

/**
 * 2D fallback component for browsers without WebGL support
 */
function FallbackPortrait({ imageUrl, className }: { imageUrl: string; className?: string }) {
  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <img
        src={imageUrl}
        alt="Portrait"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
}

/**
 * Main 3D Floating Portrait Component
 * 
 * Features:
 * - Three.js scene with camera and lighting
 * - Portrait image as texture on 3D plane
 * - Subtle rotation animation
 * - Reactive lighting based on cursor proximity
 * - Parallax motion following mouse movement
 * - Fallback to 2D image for unsupported browsers
 * - Performance optimizations: LOD, texture optimization, frustum culling, FPS monitoring
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5
 */
export default function FloatingPortrait({
  imageUrl,
  enableParallax = true,
  lightingIntensity = 1.0,
  className = '',
}: FloatingPortraitProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Lazy loading: only initialize 3D scene when visible
  const isVisible = useLazyScene(containerRef, { rootMargin: '200px', threshold: 0.1 });
  
  // Check WebGL support on mount
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
  }, []);
  
  // Track mouse position for parallax and reactive lighting (debounced)
  useEffect(() => {
    if (!enableParallax && !containerRef.current) return;
    
    let rafId: number;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Use RAF to throttle updates
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        setMousePosition({ x, y });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enableParallax]);
  
  // Show loading state while checking WebGL support
  if (webGLSupported === null) {
    return (
      <div ref={containerRef} className={`w-full h-full ${className}`}>
        <LoadingFallback />
      </div>
    );
  }
  
  // Fallback to 2D image if WebGL is not supported
  if (!webGLSupported) {
    console.warn('WebGL not supported, falling back to 2D image');
    return <FallbackPortrait imageUrl={imageUrl} className={className} />;
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
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <Suspense fallback={null}>
          <PortraitMesh
            imageUrl={imageUrl}
            mousePosition={mousePosition}
            enableParallax={enableParallax}
            lightingIntensity={lightingIntensity}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
