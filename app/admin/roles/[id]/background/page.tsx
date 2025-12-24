'use client';

/**
 * Admin Role Background Configuration Page
 * 
 * Page for configuring custom background animations for each role
 * Requirements: 2.7
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Role, RoleBackground } from '@/lib/types/database';
import { useToast } from '@/lib/contexts/toast-context';
import { RoleBackground as RoleBackgroundPreview } from '@/components/animations/role-background';

type AnimationType = 'data-grid' | 'code-lines' | 'ui-components' | 'database-shapes' | 'custom';

interface AnimationConfig {
  // Data Grid config
  gridSize?: number;
  dotCount?: number;
  // Code Lines config
  lineCount?: number;
  // UI Components config
  componentCount?: number;
  // Database Shapes config
  shapeCount?: number;
}

export default function RoleBackgroundPage() {
  const params = useParams();
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();
  
  const roleId = params.id as string;
  
  const [role, setRole] = useState<Role | null>(null);
  const [background, setBackground] = useState<RoleBackground | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [animationType, setAnimationType] = useState<AnimationType>('data-grid');
  const [config, setConfig] = useState<AnimationConfig>({
    gridSize: 40,
    dotCount: 20,
    lineCount: 15,
    componentCount: 12,
    shapeCount: 10,
  });

  // Fetch role and background
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch role
        const roleResponse = await fetch(`/api/roles/${roleId}`);
        if (!roleResponse.ok) throw new Error('Failed to fetch role');
        const roleData = await roleResponse.json();
        setRole(roleData);

        // Fetch background (may not exist)
        const bgResponse = await fetch(`/api/role-backgrounds/${roleId}`);
        if (bgResponse.ok) {
          const bgData = await bgResponse.json();
          setBackground(bgData);
          setAnimationType(bgData.animation_type);
          setConfig({ ...config, ...bgData.config });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to load role background');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/role-backgrounds/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animation_type: animationType,
          config: getConfigForType(animationType),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save background');
      }

      const savedBackground = await response.json();
      setBackground(savedBackground);
      showSuccess('Background configuration saved successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save background');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset
  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset to default background? This will delete the custom configuration.')) {
      return;
    }

    try {
      const response = await fetch(`/api/role-backgrounds/${roleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reset background');
      }

      setBackground(null);
      setAnimationType('data-grid');
      setConfig({
        gridSize: 40,
        dotCount: 20,
        lineCount: 15,
        componentCount: 12,
        shapeCount: 10,
      });
      showSuccess('Background reset to default');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to reset background');
    }
  };

  // Get config for specific animation type
  const getConfigForType = (type: AnimationType): AnimationConfig => {
    switch (type) {
      case 'data-grid':
        return {
          gridSize: config.gridSize,
          dotCount: config.dotCount,
        };
      case 'code-lines':
        return {
          lineCount: config.lineCount,
        };
      case 'ui-components':
        return {
          componentCount: config.componentCount,
        };
      case 'database-shapes':
        return {
          shapeCount: config.shapeCount,
        };
      default:
        return {};
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">Role not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-8 w-full max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/roles')}
          className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            Background Configuration
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Configure custom background animation for <strong>{role.title}</strong>
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-1">Role-specific backgrounds</p>
            <p className="text-blue-700 dark:text-blue-300">
              This background animation will appear when this role is displayed in the role rotator on the homepage.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Animation Settings
          </h2>

          {/* Animation Type Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-3">
              Animation Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'data-grid', label: 'Data Grid', icon: '📊' },
                { value: 'code-lines', label: 'Code Lines', icon: '💻' },
                { value: 'ui-components', label: 'UI Components', icon: '🎨' },
                { value: 'database-shapes', label: 'Database', icon: '🗄️' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAnimationType(option.value as AnimationType)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    animationType === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
              Configuration
            </h3>

            {animationType === 'data-grid' && (
              <>
                <div>
                  <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    Grid Size: {config.gridSize}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={config.gridSize}
                    onChange={(e) => setConfig({ ...config, gridSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                    Dot Count: {config.dotCount}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={config.dotCount}
                    onChange={(e) => setConfig({ ...config, dotCount: parseInt(e.target.value) })}
                    className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </>
            )}

            {animationType === 'code-lines' && (
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Line Count: {config.lineCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={config.lineCount}
                  onChange={(e) => setConfig({ ...config, lineCount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}

            {animationType === 'ui-components' && (
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Component Count: {config.componentCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={config.componentCount}
                  onChange={(e) => setConfig({ ...config, componentCount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}

            {animationType === 'database-shapes' && (
              <div>
                <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Shape Count: {config.shapeCount}
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={config.shapeCount}
                  onChange={(e) => setConfig({ ...config, shapeCount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSaving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Configuration</span>
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all"
            >
              Reset to Default
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Live Preview
          </h2>
          <div className="relative w-full h-[400px] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden">
            <RoleBackgroundPreview
              animationType={animationType}
              config={getConfigForType(animationType)}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Background animation preview
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            This is how the background will appear on your homepage when this role is displayed in the role rotator.
          </p>
        </div>
      </div>
    </div>
  );
}
