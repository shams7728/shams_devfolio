/**
 * WebGL Feature Detection Utility
 * Detects WebGL support and capabilities for 3D rendering features
 */

export interface WebGLCapabilities {
  supported: boolean;
  version: 1 | 2 | null;
  maxTextureSize: number | null;
  maxVertexUniforms: number | null;
  renderer: string | null;
  vendor: string | null;
}

/**
 * Detect if WebGL is supported in the current browser
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Detect if WebGL 2.0 is supported
 */
export function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Get detailed WebGL capabilities
 */
export function getWebGLCapabilities(): WebGLCapabilities {
  const capabilities: WebGLCapabilities = {
    supported: false,
    version: null,
    maxTextureSize: null,
    maxVertexUniforms: null,
    renderer: null,
    vendor: null,
  };

  try {
    const canvas = document.createElement('canvas');
    
    // Try WebGL 2.0 first
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
    if (gl) {
      capabilities.supported = true;
      capabilities.version = 2;
    } else {
      // Fall back to WebGL 1.0
      gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (gl) {
        capabilities.supported = true;
        capabilities.version = 1;
      }
    }

    if (gl) {
      // Get capabilities
      capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      capabilities.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
      
      // Get renderer info if available
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        capabilities.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        capabilities.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      }
    }
  } catch (e) {
    console.error('Error detecting WebGL capabilities:', e);
  }

  return capabilities;
}

/**
 * Check if the device can handle 3D rendering with acceptable performance
 */
export function canHandle3DRendering(): boolean {
  const capabilities = getWebGLCapabilities();
  
  if (!capabilities.supported) {
    return false;
  }
  
  // Check minimum requirements
  const hasMinimumTextureSize = !!(capabilities.maxTextureSize && capabilities.maxTextureSize >= 2048);
  const hasMinimumUniforms = !!(capabilities.maxVertexUniforms && capabilities.maxVertexUniforms >= 128);
  
  return hasMinimumTextureSize && hasMinimumUniforms;
}

/**
 * Get a user-friendly message about WebGL support
 */
export function getWebGLSupportMessage(): string {
  const capabilities = getWebGLCapabilities();
  
  if (!capabilities.supported) {
    return 'Your browser does not support WebGL. 3D features will be disabled.';
  }
  
  if (capabilities.version === 1) {
    return 'Your browser supports WebGL 1.0. Some advanced 3D features may be limited.';
  }
  
  if (!canHandle3DRendering()) {
    return 'Your device may not have sufficient capabilities for optimal 3D rendering.';
  }
  
  return 'WebGL is fully supported. All 3D features are available.';
}

/**
 * Log WebGL capabilities to console (useful for debugging)
 */
export function logWebGLCapabilities(): void {
  const capabilities = getWebGLCapabilities();
  console.log('WebGL Capabilities:', {
    supported: capabilities.supported,
    version: capabilities.version ? `WebGL ${capabilities.version}.0` : 'Not supported',
    maxTextureSize: capabilities.maxTextureSize,
    maxVertexUniforms: capabilities.maxVertexUniforms,
    renderer: capabilities.renderer || 'Unknown',
    vendor: capabilities.vendor || 'Unknown',
    canHandle3D: canHandle3DRendering(),
  });
}
