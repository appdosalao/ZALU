import { useEffect } from 'react';
import type { LandingTheme } from '@/types/landing';

function hexToHsl(hex: string) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function LandingThemeProvider({ theme, children }: { theme: LandingTheme; children: React.ReactNode }) {
  const primaryHsl = hexToHsl(theme.primary || '#8B5CF6');
  const secondary = theme.secondary || '#F5F3FF';

  useEffect(() => {
    if (theme.fontHeading || theme.fontBody) {
      const fonts = [theme.fontHeading, theme.fontBody].filter(Boolean).join('|').replace(/\s+/g, '+');
      if (fonts) {
        const id = 'landing-google-fonts';
        let link = document.getElementById(id) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css2?family=${fonts.split('|').map((f) => `${f}:wght@400;700;900`).join('&family=')}&display=swap`;
      }
    }
  }, [theme.fontHeading, theme.fontBody]);

  const radiusMap: Record<string, string> = { sm: '0.5rem', md: '1rem', xl: '1.5rem', full: '9999px' };

  return (
    <div
      className="landing-root min-h-screen bg-background"
      style={
        {
          '--primary': primaryHsl,
          '--ring': primaryHsl,
          '--radius': radiusMap[theme.radius] || '1rem',
          fontFamily: theme.fontBody ? `${theme.fontBody}, sans-serif` : undefined,
          background: theme.background || undefined,
        } as React.CSSProperties
      }
    >
      <style>{`
        .landing-root h1,.landing-root h2,.landing-root h3{ font-family: ${theme.fontHeading || 'inherit'}; }
        .landing-card-soft{ box-shadow: var(--shadow-soft); }
        .landing-card-3d{ box-shadow: var(--card-shadow); }
        .landing-btn-glow{ box-shadow: 0 8px 24px hsl(var(--primary) / 0.35); }
        .landing-anim-fade{ animation: landingFade 0.5s ease; }
        .landing-anim-slide{ animation: landingSlide 0.5s ease; }
        .landing-anim-zoom{ animation: landingZoom 0.5s ease; }
        @keyframes landingFade{ from{opacity:0} to{opacity:1} }
        @keyframes landingSlide{ from{opacity:0; transform: translateY(16px)} to{opacity:1; transform:none} }
        @keyframes landingZoom{ from{opacity:0; transform: scale(0.96)} to{opacity:1; transform:none} }
        @media (prefers-reduced-motion: reduce){
          .landing-anim-fade,.landing-anim-slide,.landing-anim-zoom{ animation:none }
        }
      `}</style>
      {children}
    </div>
  );
}
