export type BookingThemeId =
  | 'manicure'
  | 'salao-masculino'
  | 'salao-feminino'
  | 'designer-sobrancelhas'
  | 'trancistas';

export interface BookingThemePreset {
  id: BookingThemeId;
  name: string;
  description: string;
  colors: [string, string];
  settings: {
    cor_primaria: string;
    cor_secundaria: string;
    cor_texto_botao: string;
    fonte_personalizada: string;
    card_background: string;
    raio_botoes: number;
    animacao_botao: 'lift' | 'pulse' | 'shine' | 'none';
    tema_formulario: 'claro' | 'escuro';
    estilo_card: 'premium' | 'glass' | 'soft';
    estilo_botao: 'gradiente' | 'sólido' | 'outline';
    sombra_botao: 'suave' | 'media' | 'forte';
    estilo_fundo: 'gradient' | 'solid' | 'glow' | 'aurora';
    cor_fundo: string;
    cor_fundo_secundaria: string;
    efeito_visual: 'none' | 'glow' | 'float';
  };
}

export function getBookingPageBackground(
  style: BookingThemePreset['settings']['estilo_fundo'] | undefined,
  backgroundColor: string,
  secondaryBackgroundColor: string,
  primaryColor: string,
  visualMode: 'claro' | 'escuro',
): string {
  switch (style) {
    case 'solid':
      return backgroundColor;
    case 'gradient':
      return `linear-gradient(135deg, ${backgroundColor}, ${secondaryBackgroundColor})`;
    case 'glow':
      return `radial-gradient(ellipse at 12% 8%, ${primaryColor}30, transparent 42%), radial-gradient(ellipse at 88% 18%, ${secondaryBackgroundColor} 0%, transparent 40%), ${backgroundColor}`;
    case 'aurora':
      return `radial-gradient(ellipse at 15% 0%, ${backgroundColor} 0%, transparent 48%), radial-gradient(ellipse at 85% 12%, ${secondaryBackgroundColor} 0%, transparent 42%), ${visualMode === 'escuro' ? '#020817' : '#FFFFFF'}`;
    default:
      return visualMode === 'escuro'
        ? 'radial-gradient(circle at top, #1f2937 0%, #0f172a 35%, #020817 100%)'
        : 'radial-gradient(circle at top, #f5f3ff 0%, #fdf2f8 55%, #f8fafc 100%)';
  }
}

export const bookingThemePresets: BookingThemePreset[] = [
  {
    id: 'manicure',
    name: 'Manicure',
    description: 'Rosa delicado, detalhes perolados e visual acolhedor para cuidados com as unhas.',
    colors: ['#C24170', '#FBCFE8'],
    settings: {
      cor_primaria: '#C24170',
      cor_secundaria: '#FBCFE8',
      cor_texto_botao: '#FFFFFF',
      fonte_personalizada: "'Poppins', 'Segoe UI', sans-serif",
      card_background: '#FFF8FB',
      raio_botoes: 24,
      animacao_botao: 'shine',
      tema_formulario: 'claro',
      estilo_card: 'soft',
      estilo_botao: 'gradiente',
      sombra_botao: 'media',
      estilo_fundo: 'aurora',
      cor_fundo: '#FFF1F6',
      cor_fundo_secundaria: '#FCE7F3',
      efeito_visual: 'glow',
    },
  },
  {
    id: 'salao-masculino',
    name: 'Salão masculino',
    description: 'Grafite, cobre e linhas sóbrias para barbearias e salões masculinos.',
    colors: ['#B7793E', '#334155'],
    settings: {
      cor_primaria: '#B7793E',
      cor_secundaria: '#334155',
      cor_texto_botao: '#FFFFFF',
      fonte_personalizada: "'Manrope', 'Segoe UI', sans-serif",
      card_background: '#1F2937',
      raio_botoes: 12,
      animacao_botao: 'lift',
      tema_formulario: 'escuro',
      estilo_card: 'premium',
      estilo_botao: 'sólido',
      sombra_botao: 'forte',
      estilo_fundo: 'solid',
      cor_fundo: '#111827',
      cor_fundo_secundaria: '#1F2937',
      efeito_visual: 'float',
    },
  },
  {
    id: 'salao-feminino',
    name: 'Salão feminino',
    description: 'Lavanda e rosé com tipografia elegante para uma experiência sofisticada.',
    colors: ['#8B5CF6', '#FBCFE8'],
    settings: {
      cor_primaria: '#8B5CF6',
      cor_secundaria: '#FBCFE8',
      cor_texto_botao: '#FFFFFF',
      fonte_personalizada: "'Playfair Display', Georgia, serif",
      card_background: '#FFFFFF',
      raio_botoes: 26,
      animacao_botao: 'shine',
      tema_formulario: 'claro',
      estilo_card: 'glass',
      estilo_botao: 'gradiente',
      sombra_botao: 'forte',
      estilo_fundo: 'aurora',
      cor_fundo: '#F5F3FF',
      cor_fundo_secundaria: '#FCE7F3',
      efeito_visual: 'glow',
    },
  },
  {
    id: 'designer-sobrancelhas',
    name: 'Designer de sobrancelhas',
    description: 'Nude e marrom com acabamento minimalista para destacar precisão e cuidado.',
    colors: ['#8A5A44', '#EAD8C8'],
    settings: {
      cor_primaria: '#8A5A44',
      cor_secundaria: '#EAD8C8',
      cor_texto_botao: '#FFFFFF',
      fonte_personalizada: "'Montserrat', 'Segoe UI', sans-serif",
      card_background: '#FFFCF8',
      raio_botoes: 16,
      animacao_botao: 'lift',
      tema_formulario: 'claro',
      estilo_card: 'premium',
      estilo_botao: 'sólido',
      sombra_botao: 'suave',
      estilo_fundo: 'gradient',
      cor_fundo: '#FBF7F2',
      cor_fundo_secundaria: '#EAD8C8',
      efeito_visual: 'float',
    },
  },
  {
    id: 'trancistas',
    name: 'Trancistas',
    description: 'Tons terrosos e dourados com presença e personalidade para tranças e cabelos.',
    colors: ['#A65A2E', '#E9B872'],
    settings: {
      cor_primaria: '#A65A2E',
      cor_secundaria: '#E9B872',
      cor_texto_botao: '#FFFFFF',
      fonte_personalizada: "'Poppins', 'Segoe UI', sans-serif",
      card_background: '#FFF9F1',
      raio_botoes: 20,
      animacao_botao: 'pulse',
      tema_formulario: 'claro',
      estilo_card: 'soft',
      estilo_botao: 'gradiente',
      sombra_botao: 'media',
      estilo_fundo: 'aurora',
      cor_fundo: '#FFF7ED',
      cor_fundo_secundaria: '#FDE7C3',
      efeito_visual: 'glow',
    },
  },
];
