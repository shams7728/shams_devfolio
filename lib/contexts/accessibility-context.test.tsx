/**
 * Accessibility Context Tests
 * 
 * Tests for accessibility settings management
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AccessibilityProvider, useAccessibility } from './accessibility-context';

// Test component that uses the accessibility context
function TestComponent() {
  const {
    contrastMode,
    textScale,
    readabilityMode,
    reducedMotion,
    setContrastMode,
    setTextScale,
    setReadabilityMode,
    resetSettings,
  } = useAccessibility();

  return (
    <div>
      <div data-testid="contrast-mode">{contrastMode.toString()}</div>
      <div data-testid="text-scale">{textScale}</div>
      <div data-testid="readability-mode">{readabilityMode.toString()}</div>
      <div data-testid="reduced-motion">{reducedMotion.toString()}</div>
      <button onClick={() => setContrastMode(!contrastMode)}>Toggle Contrast</button>
      <button onClick={() => setTextScale(1.5)}>Set Scale 1.5</button>
      <button onClick={() => setReadabilityMode(!readabilityMode)}>Toggle Readability</button>
      <button onClick={resetSettings}>Reset</button>
    </div>
  );
}

describe('AccessibilityContext', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    // Mock matchMedia for reduced motion
    global.matchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default settings', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('contrast-mode').textContent).toBe('false');
    expect(screen.getByTestId('text-scale').textContent).toBe('1');
    expect(screen.getByTestId('readability-mode').textContent).toBe('false');
  });

  it('should toggle contrast mode', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const toggleButton = screen.getByText('Toggle Contrast');
    
    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId('contrast-mode').textContent).toBe('true');
  });

  it('should update text scale within valid range', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const scaleButton = screen.getByText('Set Scale 1.5');
    
    act(() => {
      scaleButton.click();
    });

    expect(screen.getByTestId('text-scale').textContent).toBe('1.5');
  });

  it('should clamp text scale to valid range (1.0 - 2.0)', () => {
    function TestScaleComponent() {
      const { textScale, setTextScale } = useAccessibility();
      return (
        <div>
          <div data-testid="text-scale">{textScale}</div>
          <button onClick={() => setTextScale(3.0)}>Set Scale 3.0</button>
          <button onClick={() => setTextScale(0.5)}>Set Scale 0.5</button>
        </div>
      );
    }

    render(
      <AccessibilityProvider>
        <TestScaleComponent />
      </AccessibilityProvider>
    );

    // Test upper bound
    act(() => {
      screen.getByText('Set Scale 3.0').click();
    });
    expect(screen.getByTestId('text-scale').textContent).toBe('2');

    // Test lower bound
    act(() => {
      screen.getByText('Set Scale 0.5').click();
    });
    expect(screen.getByTestId('text-scale').textContent).toBe('1');
  });

  it('should toggle readability mode', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const toggleButton = screen.getByText('Toggle Readability');
    
    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId('readability-mode').textContent).toBe('true');
  });

  it('should reset all settings to defaults', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    // Change some settings
    act(() => {
      screen.getByText('Toggle Contrast').click();
      screen.getByText('Set Scale 1.5').click();
      screen.getByText('Toggle Readability').click();
    });

    // Verify settings changed
    expect(screen.getByTestId('contrast-mode').textContent).toBe('true');
    expect(screen.getByTestId('text-scale').textContent).toBe('1.5');
    expect(screen.getByTestId('readability-mode').textContent).toBe('true');

    // Reset
    act(() => {
      screen.getByText('Reset').click();
    });

    // Verify reset to defaults
    expect(screen.getByTestId('contrast-mode').textContent).toBe('false');
    expect(screen.getByTestId('text-scale').textContent).toBe('1');
    expect(screen.getByTestId('readability-mode').textContent).toBe('false');
  });

  it('should persist settings to localStorage', () => {
    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    act(() => {
      screen.getByText('Toggle Contrast').click();
      screen.getByText('Set Scale 1.5').click();
    });

    expect(localStorage.setItem).toHaveBeenCalled();
    const savedSettings = JSON.parse(localStorageMock['accessibility-settings']);
    expect(savedSettings.contrastMode).toBe(true);
    expect(savedSettings.textScale).toBe(1.5);
  });

  it('should load settings from localStorage on mount', () => {
    // Pre-populate localStorage
    localStorageMock['accessibility-settings'] = JSON.stringify({
      contrastMode: true,
      textScale: 1.8,
      readabilityMode: true,
    });

    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('contrast-mode').textContent).toBe('true');
    expect(screen.getByTestId('text-scale').textContent).toBe('1.8');
    expect(screen.getByTestId('readability-mode').textContent).toBe('true');
  });

  it('should respect prefers-reduced-motion system preference', () => {
    // Mock reduced motion preference
    global.matchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('reduced-motion').textContent).toBe('true');
  });

  it('should throw error when useAccessibility is used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAccessibility must be used within an AccessibilityProvider');

    console.error = consoleError;
  });
});
