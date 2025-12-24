/**
 * Tests for 3D Performance Optimization Utilities
 * 
 * Requirements: 1.5, 4.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  getFPSMonitor,
  createSphereLOD,
  createPlaneLOD,
  optimizeTexture,
  isInFrustum,
  applyFrustumCulling,
  ParticlePool,
  getQualitySettings,
  AdaptiveQualityManager,
  disposeObject,
} from './3d-performance';

describe('3D Performance Utilities', () => {
  describe('FPS Monitor', () => {
    it('should track FPS metrics', () => {
      const monitor = getFPSMonitor();
      monitor.reset();
      
      // Simulate some frames
      for (let i = 0; i < 10; i++) {
        monitor.update();
      }
      
      const metrics = monitor.getMetrics();
      expect(metrics.samples).toBeGreaterThan(0);
      expect(metrics.current).toBeGreaterThan(0);
      expect(metrics.average).toBeGreaterThan(0);
    });

    it('should calculate min and max FPS', () => {
      const monitor = getFPSMonitor();
      monitor.reset();
      
      for (let i = 0; i < 5; i++) {
        monitor.update();
      }
      
      const metrics = monitor.getMetrics();
      expect(metrics.min).toBeLessThanOrEqual(metrics.max);
      expect(metrics.min).toBeLessThanOrEqual(metrics.average);
      expect(metrics.max).toBeGreaterThanOrEqual(metrics.average);
    });
  });

  describe('LOD System', () => {
    it('should create sphere LOD with multiple levels', () => {
      const material = new THREE.MeshStandardMaterial();
      const lod = createSphereLOD(1.0, material);
      
      expect(lod).toBeInstanceOf(THREE.LOD);
      expect(lod.levels.length).toBeGreaterThan(1);
      
      // Cleanup
      lod.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });
      material.dispose();
    });

    it('should create plane LOD with multiple levels', () => {
      const material = new THREE.MeshStandardMaterial();
      const lod = createPlaneLOD(2.0, 2.0, material);
      
      expect(lod).toBeInstanceOf(THREE.LOD);
      expect(lod.levels.length).toBeGreaterThan(1);
      
      // Cleanup
      lod.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });
      material.dispose();
    });

    it('should have different detail levels at different distances', () => {
      const material = new THREE.MeshStandardMaterial();
      const lod = createSphereLOD(1.0, material);
      
      // Check that levels have different distances
      const distances = lod.levels.map(level => level.distance);
      const uniqueDistances = new Set(distances);
      
      expect(uniqueDistances.size).toBe(distances.length);
      
      // Cleanup
      lod.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });
      material.dispose();
    });
  });

  describe('Texture Optimization', () => {
    it('should optimize texture settings', () => {
      const texture = new THREE.Texture();
      
      optimizeTexture(texture, {
        generateMipmaps: true,
        anisotropy: 4,
      });
      
      expect(texture.generateMipmaps).toBe(true);
      expect(texture.anisotropy).toBe(4);
      expect(texture.wrapS).toBe(THREE.ClampToEdgeWrapping);
      expect(texture.wrapT).toBe(THREE.ClampToEdgeWrapping);
      
      texture.dispose();
    });

    it('should apply default optimization options', () => {
      const texture = new THREE.Texture();
      
      optimizeTexture(texture);
      
      expect(texture.minFilter).toBeDefined();
      expect(texture.magFilter).toBeDefined();
      
      texture.dispose();
    });
  });

  describe('Frustum Culling', () => {
    it('should detect objects in frustum', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial()
      );
      mesh.position.set(0, 0, 0);
      mesh.geometry.computeBoundingSphere();
      
      const inFrustum = isInFrustum(mesh, camera);
      expect(inFrustum).toBe(true);
      
      // Cleanup
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });

    it('should detect objects outside frustum', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial()
      );
      mesh.position.set(100, 100, 100); // Far outside frustum
      mesh.geometry.computeBoundingSphere();
      
      const inFrustum = isInFrustum(mesh, camera);
      expect(inFrustum).toBe(false);
      
      // Cleanup
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });

    it('should apply frustum culling to multiple objects', () => {
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      
      const objects: THREE.Mesh[] = [];
      
      // Create objects inside and outside frustum
      for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial()
        );
        mesh.position.set(i * 50, 0, 0); // Spread out
        mesh.geometry.computeBoundingSphere();
        objects.push(mesh);
      }
      
      applyFrustumCulling(objects, camera);
      
      // At least one should be culled
      const visibleCount = objects.filter(obj => obj.visible).length;
      expect(visibleCount).toBeLessThan(objects.length);
      
      // Cleanup
      objects.forEach(obj => {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      });
    });
  });

  describe('Particle Pool', () => {
    it('should create particle pool with initial size', () => {
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial();
      const pool = new ParticlePool(geometry, material, 10, 100);
      
      const stats = pool.getStats();
      expect(stats.available).toBe(10);
      expect(stats.active).toBe(0);
      
      pool.dispose();
      geometry.dispose();
      material.dispose();
    });

    it('should acquire particles from pool', () => {
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial();
      const pool = new ParticlePool(geometry, material, 5, 100);
      
      const particle = pool.acquire();
      expect(particle).not.toBeNull();
      expect(particle?.visible).toBe(true);
      
      const stats = pool.getStats();
      expect(stats.active).toBe(1);
      expect(stats.available).toBe(4);
      
      pool.dispose();
      geometry.dispose();
      material.dispose();
    });

    it('should release particles back to pool', () => {
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial();
      const pool = new ParticlePool(geometry, material, 5, 100);
      
      const particle = pool.acquire();
      expect(particle).not.toBeNull();
      
      if (particle) {
        pool.release(particle);
        expect(particle.visible).toBe(false);
      }
      
      const stats = pool.getStats();
      expect(stats.active).toBe(0);
      expect(stats.available).toBe(5);
      
      pool.dispose();
      geometry.dispose();
      material.dispose();
    });

    it('should reset particle state on release', () => {
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial();
      const pool = new ParticlePool(geometry, material, 5, 100);
      
      const particle = pool.acquire();
      if (particle) {
        particle.position.set(10, 20, 30);
        particle.rotation.set(1, 2, 3);
        particle.scale.set(2, 2, 2);
        
        pool.release(particle);
        
        expect(particle.position.x).toBe(0);
        expect(particle.position.y).toBe(0);
        expect(particle.position.z).toBe(0);
        expect(particle.scale.x).toBe(1);
      }
      
      pool.dispose();
      geometry.dispose();
      material.dispose();
    });

    it('should respect max pool size', () => {
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial();
      const pool = new ParticlePool(geometry, material, 2, 5);
      
      const particles: THREE.Mesh[] = [];
      
      // Try to acquire more than max
      for (let i = 0; i < 10; i++) {
        const particle = pool.acquire();
        if (particle) {
          particles.push(particle);
        }
      }
      
      expect(particles.length).toBeLessThanOrEqual(5);
      
      pool.dispose();
      geometry.dispose();
      material.dispose();
    });
  });

  describe('Quality Settings', () => {
    it('should return high quality for good FPS', () => {
      const settings = getQualitySettings(60);
      expect(settings.level).toBe('high');
      expect(settings.antialias).toBe(true);
      expect(settings.shadows).toBe(true);
    });

    it('should return medium quality for moderate FPS', () => {
      const settings = getQualitySettings(45);
      expect(settings.level).toBe('medium');
      expect(settings.antialias).toBe(true);
      expect(settings.shadows).toBe(false);
    });

    it('should return low quality for poor FPS', () => {
      const settings = getQualitySettings(25);
      expect(settings.level).toBe('low');
      expect(settings.antialias).toBe(false);
      expect(settings.shadows).toBe(false);
    });
  });

  describe('Adaptive Quality Manager', () => {
    it('should initialize with specified quality', () => {
      const manager = new AdaptiveQualityManager('medium');
      const quality = manager.getCurrentQuality();
      expect(quality.level).toBe('medium');
    });

    it('should allow manual quality setting', () => {
      const manager = new AdaptiveQualityManager('high');
      manager.setQuality('low');
      
      const quality = manager.getCurrentQuality();
      expect(quality.level).toBe('low');
    });

    it('should provide quality settings', () => {
      const manager = new AdaptiveQualityManager('high');
      const quality = manager.getCurrentQuality();
      
      expect(quality).toHaveProperty('level');
      expect(quality).toHaveProperty('antialias');
      expect(quality).toHaveProperty('shadows');
      expect(quality).toHaveProperty('maxParticles');
      expect(quality).toHaveProperty('textureSize');
    });
  });

  describe('Memory Management', () => {
    it('should dispose of mesh geometry and material', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      
      const geometryDisposeSpy = vi.spyOn(geometry, 'dispose');
      const materialDisposeSpy = vi.spyOn(material, 'dispose');
      
      disposeObject(mesh);
      
      expect(geometryDisposeSpy).toHaveBeenCalled();
      expect(materialDisposeSpy).toHaveBeenCalled();
    });

    it('should dispose of nested objects', () => {
      const group = new THREE.Group();
      
      const mesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial()
      );
      const mesh2 = new THREE.Mesh(
        new THREE.SphereGeometry(1),
        new THREE.MeshBasicMaterial()
      );
      
      group.add(mesh1);
      group.add(mesh2);
      
      const geo1Spy = vi.spyOn(mesh1.geometry, 'dispose');
      const geo2Spy = vi.spyOn(mesh2.geometry, 'dispose');
      
      disposeObject(group);
      
      expect(geo1Spy).toHaveBeenCalled();
      expect(geo2Spy).toHaveBeenCalled();
    });
  });
});
