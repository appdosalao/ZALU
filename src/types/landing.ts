export type LandingButtonVariant = 'solid' | 'outline' | 'ghost' | '3d';
export type LandingCardVariant = 'soft' | '3d' | 'border';
export type LandingRadius = 'sm' | 'md' | 'xl' | 'full';
export type LandingAnimation = 'none' | 'fade' | 'slide' | 'zoom';

export interface LandingTheme {
  primary: string;
  secondary?: string;
  background?: string;
  textOnPrimary?: string;
  fontHeading?: string;
  fontBody?: string;
  radius: LandingRadius;
  buttonVariant: LandingButtonVariant;
  buttonEffect: 'none' | 'shadow' | 'glow';
  cardVariant: LandingCardVariant;
  animation: LandingAnimation;
}

export type LandingBlockType =
  | 'hero'
  | 'services'
  | 'calendar'
  | 'products'
  | 'testimonials'
  | 'gallery'
  | 'faq'
  | 'map'
  | 'social'
  | 'cta_whatsapp'
  | 'custom_html';

export interface LandingBlock {
  id: string;
  type: LandingBlockType;
  visible: boolean;
  order: number;
  props?: Record<string, unknown>;
  style?: Partial<LandingTheme>;
}

export interface LandingSeo {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface LandingConfig {
  theme: LandingTheme;
  blocks: LandingBlock[];
  seo: LandingSeo;
  version: number;
}

export const defaultLandingTheme: LandingTheme = {
  primary: '#8B5CF6',
  secondary: '#F5F3FF',
  background: '#FFFFFF',
  textOnPrimary: '#FFFFFF',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  radius: 'xl',
  buttonVariant: 'solid',
  buttonEffect: 'shadow',
  cardVariant: 'soft',
  animation: 'fade',
};

export const defaultLandingBlocks: LandingBlock[] = [
  { id: 'hero-1', type: 'hero', visible: true, order: 0, props: {} },
  { id: 'services-1', type: 'services', visible: true, order: 1, props: {} },
  { id: 'calendar-1', type: 'calendar', visible: true, order: 2, props: {} },
  { id: 'products-1', type: 'products', visible: false, order: 3, props: {} },
  { id: 'cta-1', type: 'cta_whatsapp', visible: true, order: 4, props: {} },
];

export const defaultLandingConfig: LandingConfig = {
  theme: defaultLandingTheme,
  blocks: defaultLandingBlocks,
  seo: {
    title: 'Agende seu horário',
    description: 'Agendamento online rápido e prático',
  },
  version: 1,
};

export function normalizeLandingConfig(input: unknown): LandingConfig {
  if (!input || typeof input !== 'object') return defaultLandingConfig;
  const obj = input as Record<string, unknown>;
  const theme = (obj.theme as LandingTheme) ?? defaultLandingTheme;
  const blocks = Array.isArray(obj.blocks) ? (obj.blocks as LandingBlock[]) : defaultLandingBlocks;
  const seo = (obj.seo as LandingSeo) ?? defaultLandingConfig.seo;
  return {
    theme: { ...defaultLandingTheme, ...theme },
    blocks: blocks.map((block, index) => ({
      ...block,
      visible: block.visible ?? true,
      order: block.order ?? index,
      props: block.props ?? {},
    })),
    seo: { ...defaultLandingConfig.seo, ...seo },
    version: typeof obj.version === 'number' ? obj.version : 1,
  };
}
