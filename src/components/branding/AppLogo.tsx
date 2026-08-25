import { useState } from 'react';
import { useConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';

interface AppLogoProps {
  size?: number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const roundedMap: Record<NonNullable<AppLogoProps['rounded']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export function AppLogo({ size = 32, rounded = 'xl', className = '' }: AppLogoProps) {
  const { config } = useConfigAgendamentoOnline();
  const [imageError, setImageError] = useState(false);
  const containerStyle = { width: size, height: size };
  const borderClass = roundedMap[rounded];

  const logoUrl =
    config.logo_url && config.logo_url.trim().length > 0
      ? config.logo_url
      : '/icons/icon-72x72.png';

  return (
    <div
      className={`overflow-hidden ${borderClass} border-2 border-primary/40 bg-muted ${className}`}
      style={containerStyle}
      aria-label="Logo do aplicativo"
    >
      {!imageError ? (
        <img
          src={logoUrl}
          alt={config.nome_salao || 'ZALU'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <img
          src="/icons/icon-72x72.png"
          alt={config.nome_salao || 'ZALU'}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
