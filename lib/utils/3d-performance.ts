/**
 * 3D Performance Optimization Utilities
 * 
 * Provides utilities for optimizing Three.js rendering performance including:
 * - Level of Detail (LOD) system
 * - Texture compression and optimization
 * - Frustum culling
 * - Object pooling for particles
 * - Lazy loading for 3D scenes
 * - FPS monitoring and logging
 * 
 * Requirements: 1.5, 4.5
 */

import * as THREE from 'three';

// ============================================================================
// FPS Monitoring
// ============================================================================

export interface FPSMetrics {
  current: number;
  average: number;
  min: number;
  max: number;
  samples: number;
}

class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private readonly maxSamples: number = 60;

  update(): FPSMetrics {
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta > 0) {
      const fps = 1000 / delta;
      this.frames.push(fps);

      // Keep only recent samples
      if (this.frames.length > this.maxSamples) {
        this.frames.shift();
      }

      this.frameCount++;
    }

    this.lastTime = currentTime;

    return this.getMetrics();
  }

  getMetrics(): FPSMetrics {
    if (this.frames.length === 0) {
      return { current: 0, average: 0, min: 0, max: 0, samples: 0 };
    }

    const current = this.frames[this.frames.length - 1];
    const average = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    const min = Math.min(...this.frames);
    const max = Math.max(...this.frames);

    return {
      current: Math.round(current),
      average: Math.round(average),
      min: Math.round(min),
      max: Math.round(max),
      samples: this.frames.length,
    };
  }

  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
    this.frameCount = 0;
  }
}

// Global FPS monitor instance
let globalFPSMonitor: FPSMonitor | null = null;

export function getFPSMonitor(): FPSMonitor {
  if (!globalFPSMonitor) {
    globalFPSMonitor = new FPSMonitor();
  }
  return globalFPSMonitor;
}

export function logFPSMetrics(componentName: string): void {
  const monitor = getFPSMonitor();
  const metrics = monitor.getMetrics();

  if (process.env.NODE_ENV === 'development') {
    console.log(`[3D Performance - ${componentName}]`, {
      current: `${metrics.current} fps`,
      average: `${metrics.average} fps`,
      min: `${metrics.min} fps`,
      max: `${metrics.max} fps`,
      samples: metrics.samples,
    });
  }

  // Warn if performance is poor
  if (metrics.average < 30) {
    console.warn(`[3D Performance Warning] ${componentName} averaging ${metrics.average} fps (target: 60 fps)`);
  }
}

// ============================================================================
// Level of Detail (LOD) System
// ============================================================================

export interface LODLevel {
  distance: number;
  geometry: THREE.BufferGeometry;
}

export function createLODMesh(
  levels: LODLevel[],
  material: THREE.Material | THREE.Material[]
): THREE.LOD {
  const lod = new THREE.LOD();

  levels.forEach((level) => {
    const mesh = new THREE.Mesh(level.geometry, material);
    lod.addLevel(mesh, level.distance);
  });

  return lod;
}

/**
 * Create LOD levels for a sphere geometry
 */
export function createSphereLOD(
  radius: number,
  material: THREE.Material | THREE.Material[]
): THREE.LOD {
  const levels: LODLevel[] = [
    { distance: 0, geometry: new THREE.SphereGeometry(radius, 32, 32) },    // High detail
    { distance: 5, geometry: new THREE.SphereGeometry(radius, 16, 16) },    // Medium detail
    { distance: 10, geometry: new THREE.SphereGeometry(radius, 8, 8) },     // Low detail
  ];

  return createLODMesh(levels, material);
}

/**
 * Create LOD levels for a plane geometry
 */
export function createPlaneLOD(
  width: number,
  height: number,
  material: THREE.Material | THREE.Material[]
): THREE.LOD {
  const levels: LODLevel[] = [
    { distance: 0, geometry: new THREE.PlaneGeometry(width, height, 32, 32) },  // High detail
    { distance: 5, geometry: new THREE.PlaneGeometry(width, height, 16, 16) },  // Medium detail
    { distance: 10, geometry: new THREE.PlaneGeometry(width, height, 4, 4) },   // Low detail
  ];

  return createLODMesh(levels, material);
}

// ============================================================================
// Texture Optimization
// ============================================================================

export interface TextureOptimizationOptions {
  maxSize?: number;
  generateMipmaps?: boolean;
  anisotropy?: number;
  minFilter?: THREE.TextureFilter;
  magFilter?: THREE.TextureFilter;
}

/**
 * Optimize a texture for better performance
 */
export function optimizeTexture(
  texture: THREE.Texture,
  options: TextureOptimizationOptions = {}
): THREE.Texture {
  const {
    maxSize = 2048,
    generateMipmaps = true,
    anisotropy = 4,
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
  } = options;

  // Set texture filters
  texture.minFilter = minFilter;
  texture.magFilter = magFilter;

  // Enable/disable mipmaps
  texture.generateMipmaps = generateMipmaps;

  // Set anisotropy for better quality at angles
  texture.anisotropy = anisotropy;

  // Ensure texture is power of 2 for better performance
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
}

/**
 * Load and optimize a texture
 */
export async function loadOptimizedTexture(
  url: string,
  options: TextureOptimizationOptions = {}
): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (texture) => {
        optimizeTexture(texture, options);
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error('Failed to load texture:', url, error);
        reject(error);
      }
    );
  });
}

/**
 * Compress texture by reducing resolution
 */
export function compressTexture(
  texture: THREE.Texture,
  targetSize: number = 1024
): THREE.Texture {
  if (!texture.image) return texture;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return texture;

  const { width, height } = texture.image;
  const scale = Math.min(targetSize / width, targetSize / height, 1);

  canvas.width = width * scale;
  canvas.height = height * scale;

  ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);

  const compressedTexture = new THREE.CanvasTexture(canvas);
  compressedTexture.minFilter = texture.minFilter;
  compressedTexture.magFilter = texture.magFilter;
  compressedTexture.wrapS = texture.wrapS;
  compressedTexture.wrapT = texture.wrapT;

  return compressedTexture;
}

// ============================================================================
// Frustum Culling
// ============================================================================

/**
 * Check if an object is within the camera frustum
 */
export function isInFrustum(
  object: THREE.Object3D,
  camera: THREE.Camera
): boolean {
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4();

  matrix.multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );

  frustum.setFromProjectionMatrix(matrix);

  // Update world matrix if needed
  object.updateMatrixWorld(true);

  // Check if object's bounding sphere intersects frustum
  if (object instanceof THREE.Mesh && object.geometry.boundingSphere) {
    const sphere = object.geometry.boundingSphere.clone();
    sphere.applyMatrix4(object.matrixWorld);
    return frustum.intersectsSphere(sphere);
  }

  return true; // Default to visible if we can't determine
}

/**
 * Apply frustum culling to a group of objects
 */
export function applyFrustumCulling(
  objects: THREE.Object3D[],
  camera: THREE.Camera
): void {
  objects.forEach((object) => {
    object.visible = isInFrustum(object, camera);
  });
}

// ============================================================================
// Object Pooling for Particles
// ============================================================================

export class ParticlePool {
  private pool: THREE.Mesh[] = [];
  private active: Set<THREE.Mesh> = new Set();
  private geometry: THREE.BufferGeometry;
  private material: THREE.Material;
  private maxSize: number;

  constructor(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    initialSize: number = 100,
    maxSize: number = 1000
  ) {
    this.geometry = geometry;
    this.material = material;
    this.maxSize = maxSize;

    // Pre-create initial pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createParticle());
    }
  }

  private createParticle(): THREE.Mesh {
    return new THREE.Mesh(this.geometry, this.material);
  }

  /**
   * Get a particle from the pool
   */
  acquire(): THREE.Mesh | null {
    let particle: THREE.Mesh;

    if (this.pool.length > 0) {
      particle = this.pool.pop()!;
    } else if (this.active.size < this.maxSize) {
      particle = this.createParticle();
    } else {
      // Pool exhausted
      console.warn('Particle pool exhausted');
      return null;
    }

    this.active.add(particle);
    particle.visible = true;
    return particle;
  }

  /**
   * Return a particle to the pool
   */
  release(particle: THREE.Mesh): void {
    if (!this.active.has(particle)) return;

    this.active.delete(particle);
    particle.visible = false;

    // Reset particle state
    particle.position.set(0, 0, 0);
    particle.rotation.set(0, 0, 0);
    particle.scale.set(1, 1, 1);

    this.pool.push(particle);
  }

  /**
   * Release all active particles
   */
  releaseAll(): void {
    this.active.forEach((particle) => {
      particle.visible = false;
      particle.position.set(0, 0, 0);
      particle.rotation.set(0, 0, 0);
      particle.scale.set(1, 1, 1);
      this.pool.push(particle);
    });
    this.active.clear();
  }

  /**
   * Get pool statistics
   */
  getStats(): { active: number; available: number; total: number } {
    return {
      active: this.active.size,
      available: this.pool.length,
      total: this.active.size + this.pool.length,
    };
  }

  /**
   * Dispose of all particles and free memory
   */
  dispose(): void {
    this.releaseAll();
    this.pool.forEach((particle) => {
      particle.geometry.dispose();
      if (Array.isArray(particle.material)) {
        particle.material.forEach((mat) => mat.dispose());
      } else {
        particle.material.dispose();
      }
    });
    this.pool = [];
    this.active.clear();
  }
}

// ============================================================================
// Lazy Loading for 3D Scenes
// ============================================================================

export interface LazySceneOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Create an Intersection Observer for lazy loading 3D scenes
 */
export function createLazySceneObserver(
  onVisible: () => void,
  options: LazySceneOptions = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: load immediately if IntersectionObserver not supported
    onVisible();
    return null;
  }

  const { rootMargin = '100px', threshold = 0.1 } = options;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      });
    },
    { rootMargin, threshold }
  );
}

/**
 * Hook for lazy loading 3D scenes
 */
export function useLazyScene(
  elementRef: React.RefObject<HTMLElement | null>,
  options: LazySceneOptions = {}
): boolean {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = createLazySceneObserver(
      () => setIsVisible(true),
      options
    );

    if (observer) {
      observer.observe(element);
      return () => observer.disconnect();
    } else {
      // Fallback: load immediately
      setIsVisible(true);
    }
  }, [elementRef, options]);

  return isVisible;
}

// ============================================================================
// Performance Quality Settings
// ============================================================================

export type QualityLevel = 'low' | 'medium' | 'high';

export interface QualitySettings {
  level: QualityLevel;
  antialias: boolean;
  shadows: boolean;
  maxParticles: number;
  textureSize: number;
  lodDistanceMultiplier: number;
}

/**
 * Get quality settings based on device capabilities
 */
export function getQualitySettings(fps: number): QualitySettings {
  if (fps >= 55) {
    return {
      level: 'high',
      antialias: true,
      shadows: true,
      maxParticles: 1000,
      textureSize: 2048,
      lodDistanceMultiplier: 1.0,
    };
  } else if (fps >= 40) {
    return {
      level: 'medium',
      antialias: true,
      shadows: false,
      maxParticles: 500,
      textureSize: 1024,
      lodDistanceMultiplier: 0.7,
    };
  } else {
    return {
      level: 'low',
      antialias: false,
      shadows: false,
      maxParticles: 200,
      textureSize: 512,
      lodDistanceMultiplier: 0.5,
    };
  }
}

/**
 * Adaptive quality manager that adjusts settings based on performance
 */
export class AdaptiveQualityManager {
  private fpsMonitor: FPSMonitor;
  private currentQuality: QualitySettings;
  private checkInterval: number = 2000; // Check every 2 seconds
  private lastCheck: number = 0;

  constructor(initialQuality: QualityLevel = 'high') {
    this.fpsMonitor = getFPSMonitor();
    this.currentQuality = this.getSettingsForLevel(initialQuality);
  }

  private getSettingsForLevel(level: QualityLevel): QualitySettings {
    const settings: Record<QualityLevel, QualitySettings> = {
      high: {
        level: 'high',
        antialias: true,
        shadows: true,
        maxParticles: 1000,
        textureSize: 2048,
        lodDistanceMultiplier: 1.0,
      },
      medium: {
        level: 'medium',
        antialias: true,
        shadows: false,
        maxParticles: 500,
        textureSize: 1024,
        lodDistanceMultiplier: 0.7,
      },
      low: {
        level: 'low',
        antialias: false,
        shadows: false,
        maxParticles: 200,
        textureSize: 512,
        lodDistanceMultiplier: 0.5,
      },
    };

    return settings[level];
  }

  update(): QualitySettings {
    const now = performance.now();

    if (now - this.lastCheck < this.checkInterval) {
      return this.currentQuality;
    }

    this.lastCheck = now;
    const metrics = this.fpsMonitor.getMetrics();

    // Adjust quality based on average FPS
    if (metrics.average < 30 && this.currentQuality.level !== 'low') {
      // Downgrade quality
      const newLevel = this.currentQuality.level === 'high' ? 'medium' : 'low';
      this.currentQuality = this.getSettingsForLevel(newLevel);
      console.log(`[Adaptive Quality] Downgrading to ${newLevel} (FPS: ${metrics.average})`);
    } else if (metrics.average >= 55 && this.currentQuality.level !== 'high') {
      // Upgrade quality
      const newLevel = this.currentQuality.level === 'low' ? 'medium' : 'high';
      this.currentQuality = this.getSettingsForLevel(newLevel);
      console.log(`[Adaptive Quality] Upgrading to ${newLevel} (FPS: ${metrics.average})`);
    }

    return this.currentQuality;
  }

  getCurrentQuality(): QualitySettings {
    return this.currentQuality;
  }

  setQuality(level: QualityLevel): void {
    this.currentQuality = this.getSettingsForLevel(level);
  }
}

// ============================================================================
// Memory Management
// ============================================================================

/**
 * Dispose of Three.js objects to free memory
 */
export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

/**
 * Dispose of a material and its textures
 */
function disposeMaterial(material: THREE.Material): void {
  material.dispose();

  // Dispose textures
  Object.keys(material).forEach((key) => {
    const value = (material as any)[key];
    if (value && value instanceof THREE.Texture) {
      value.dispose();
    }
  });
}

/**
 * Get memory usage statistics for Three.js
 */
export function getThreeMemoryStats(renderer: THREE.WebGLRenderer): {
  geometries: number;
  textures: number;
  programs: number;
} {
  const info = renderer.info;
  return {
    geometries: info.memory.geometries,
    textures: info.memory.textures,
    programs: info.programs?.length || 0,
  };
}

// React import for useLazyScene hook
import React from 'react';
