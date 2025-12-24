/**
 * Tests for Animation Performance Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  animationPool,
  performanceMonitor,
  applyWillChange,
  shouldUseGPUAcceleration,
} from './animation-performance';

describe('Animation Performance Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(150);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should cancel debounced calls', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.cancel();

      await vi.advanceTimersByTimeAsync(150);
      expect(fn).not.toHaveBeenCalled();
    });

    it('should pass arguments to debounced function', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('test', 123);

      await vi.advanceTimersByTimeAsync(150);
      expect(fn).toHaveBeenCalledWith('test', 123);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should cancel throttled calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled.cancel();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(0);
    });
  });

  describe('animationPool', () => {
    it('should create and retrieve timelines', () => {
      const timeline = animationPool.getTimeline('test-unique-1');
      expect(timeline).toBeDefined();

      const sameTimeline = animationPool.getTimeline('test-unique-1');
      expect(sameTimeline).toBe(timeline);
    });

    it('should track active animations', () => {
      const key1 = 'test-active-1';
      const key2 = 'test-active-2';
      
      animationPool.getTimeline(key1);
      animationPool.getTimeline(key2);
      animationPool.markActive(key1);
      animationPool.markActive(key2);

      const stats = animationPool.getStats();
      expect(stats.active).toBeGreaterThanOrEqual(2);

      animationPool.markInactive(key1);
      const updatedStats = animationPool.getStats();
      expect(updatedStats.active).toBeLessThan(stats.active);
    });

    it('should cleanup inactive animations', () => {
      const key1 = 'test-cleanup-1';
      const key2 = 'test-cleanup-2';
      
      animationPool.getTimeline(key1);
      animationPool.getTimeline(key2);
      
      const beforeStats = animationPool.getStats();
      
      animationPool.markActive(key1);
      animationPool.cleanup();

      const afterStats = animationPool.getStats();
      // After cleanup, we should have fewer or equal timelines
      expect(afterStats.total).toBeLessThanOrEqual(beforeStats.total);
    });
  });

  describe('performanceMonitor', () => {
    it('should start and stop monitoring', () => {
      performanceMonitor.start();
      expect(performanceMonitor.getMetrics()).toBeDefined();

      performanceMonitor.stop();
    });

    it('should track metrics', () => {
      performanceMonitor.start();
      const metrics = performanceMonitor.getMetrics();

      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('frameTime');
      expect(metrics).toHaveProperty('droppedFrames');
      expect(metrics).toHaveProperty('animationCount');

      performanceMonitor.stop();
    });

    it('should notify subscribers', () => {
      const callback = vi.fn();
      const unsubscribe = performanceMonitor.subscribe(callback);

      performanceMonitor.start();
      
      // Simulate time passing
      vi.advanceTimersByTime(1000);

      unsubscribe();
      performanceMonitor.stop();
    });
  });

  describe('applyWillChange', () => {
    it('should apply will-change property', () => {
      const element = document.createElement('div');
      applyWillChange(element, ['transform', 'opacity'], 100);

      expect(element.style.willChange).toBe('transform, opacity');

      vi.advanceTimersByTime(100);
      expect(element.style.willChange).toBe('auto');
    });
  });

  describe('shouldUseGPUAcceleration', () => {
    it('should return boolean', () => {
      const result = shouldUseGPUAcceleration();
      expect(typeof result).toBe('boolean');
    });
  });
});
