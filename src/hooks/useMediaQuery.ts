import { useState, useEffect } from 'react';

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 640, // 0-640px
  tablet: 1024, // 641-1024px
  desktop: 1280, // 1025-1280px
  wide: 1920, // 1281px+
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * Hook to detect media queries and screen sizes
 * @param query - Media query string or breakpoint name
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook to get the current device type based on screen width
 * @returns Current device type: 'mobile' | 'tablet' | 'desktop' | 'wide'
 */
export function useDeviceType(): DeviceType {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`
  );
  const isDesktop = useMediaQuery(
    `(min-width: ${BREAKPOINTS.tablet + 1}px) and (max-width: ${BREAKPOINTS.desktop}px)`
  );

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isDesktop) return 'desktop';
  return 'wide';
}

/**
 * Hook to check if the device is mobile (touch-first)
 * Combines screen size and touch capability detection
 */
export function useIsMobile(): boolean {
  const isMobileSize = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);
  const [hasTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Check for touch capability
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).msMaxTouchPoints > 0
    );
  });

  return isMobileSize || (hasTouch && isMobileSize);
}

/**
 * Hook to check if the device is tablet size
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`
  );
}

/**
 * Hook to check if the device is desktop or larger
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.tablet + 1}px)`);
}

/**
 * Hook to get viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

/**
 * Hook to check if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook to detect orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
}
