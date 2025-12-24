import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isWebGLSupported,
  isWebGL2Supported,
  getWebGLCapabilities,
  canHandle3DRendering,
  getWebGLSupportMessage,
} from './webgl-detection';

describe('WebGL Detection Utility', () => {
  beforeEach(() => {
    // Reset any mocks
    vi.clearAllMocks();
  });

  describe('isWebGLSupported', () => {
    it('should return a boolean value', () => {
      const result = isWebGLSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isWebGL2Supported', () => {
    it('should return a boolean value', () => {
      const result = isWebGL2Supported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getWebGLCapabilities', () => {
    it('should return capabilities object with correct structure', () => {
      const capabilities = getWebGLCapabilities();
      
      expect(capabilities).toHaveProperty('supported');
      expect(capabilities).toHaveProperty('version');
      expect(capabilities).toHaveProperty('maxTextureSize');
      expect(capabilities).toHaveProperty('maxVertexUniforms');
      expect(capabilities).toHaveProperty('renderer');
      expect(capabilities).toHaveProperty('vendor');
      
      expect(typeof capabilities.supported).toBe('boolean');
      if (capabilities.version !== null) {
        expect([1, 2]).toContain(capabilities.version);
      }
    });
  });

  describe('canHandle3DRendering', () => {
    it('should return a boolean value', () => {
      const result = canHandle3DRendering();
      expect(typeof result).toBe('boolean');
    });

    it('should return false if WebGL is not supported', () => {
      const capabilities = getWebGLCapabilities();
      if (!capabilities.supported) {
        expect(canHandle3DRendering()).toBe(false);
      }
    });
  });

  describe('getWebGLSupportMessage', () => {
    it('should return a string message', () => {
      const message = getWebGLSupportMessage();
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should return appropriate message based on support level', () => {
      const message = getWebGLSupportMessage();
      const capabilities = getWebGLCapabilities();
      
      if (!capabilities.supported) {
        expect(message).toContain('does not support WebGL');
      } else if (capabilities.version === 1) {
        expect(message).toContain('WebGL 1.0');
      } else if (!canHandle3DRendering()) {
        expect(message).toContain('not have sufficient capabilities');
      } else {
        expect(message).toContain('fully supported');
      }
    });
  });
});
