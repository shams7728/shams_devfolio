import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { ToastProvider } from "@/lib/contexts/toast-context";
import { AccessibilityProvider } from "@/lib/contexts/accessibility-context";
import { SmoothScroll } from "@/components/smooth-scroll";
import { AnimatePresenceWrapper } from "@/components/animate-presence-wrapper";
import { ToastContainer } from "@/components/toast-container";
import { ErrorBoundary } from "@/components/error-boundary";
import { WebVitals } from "./web-vitals";
import { ThemeSettingsLoader } from "@/components/theme-settings-loader";
import { RoleModeProvider } from "@/lib/contexts/role-mode-context";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types/database";
import { AnimationPerformanceInit } from "@/components/animation-performance-init";

// Optimize font loading with display swap and preload
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
});

export const metadata: Metadata = {
  title: "Multi-Role Portfolio",
  description: "Showcasing diverse skills and projects across multiple professional roles",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Force rebuild for HMR sync

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch roles for RoleModeProvider
  const supabase = await createClient();
  const { data: roles } = await supabase
    .from('roles')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content by setting theme and accessibility before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply theme
                  const stored = localStorage.getItem('theme');
                  if (stored) {
                    document.documentElement.classList.add(stored);
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
                  }
                  
                  // Apply accessibility settings
                  const a11ySettings = localStorage.getItem('accessibility-settings');
                  if (a11ySettings) {
                    const settings = JSON.parse(a11ySettings);
                    const root = document.documentElement;
                    
                    if (settings.contrastMode) {
                      root.classList.add('high-contrast');
                    }
                    
                    if (settings.textScale) {
                      const scale = Math.max(1.0, Math.min(2.0, settings.textScale));
                      root.style.setProperty('--text-scale', scale.toString());
                      root.style.fontSize = scale * 100 + '%';
                    }
                    
                    if (settings.readabilityMode) {
                      root.classList.add('readability-mode');
                    }
                  }
                  
                  // Check system preference for reduced motion
                  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if (prefersReducedMotion) {
                    document.documentElement.classList.add('reduce-motion');
                  }
                  
                  // Enable keyboard navigation
                  document.documentElement.classList.add('keyboard-nav-enabled');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-black transition-colors duration-300`}
      >
        <WebVitals />
        <ThemeSettingsLoader />
        <AnimationPerformanceInit />
        <ErrorBoundary>
          <ThemeProvider>
            <AccessibilityProvider>
              <ToastProvider>
                <RoleModeProvider availableRoles={roles || []}>
                  <SmoothScroll>
                    <AnimatePresenceWrapper>
                      {children}
                    </AnimatePresenceWrapper>
                  </SmoothScroll>
                  <ToastContainer />
                </RoleModeProvider>
              </ToastProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
