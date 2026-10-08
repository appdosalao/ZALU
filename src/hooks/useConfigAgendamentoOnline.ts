/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { BookingThemeId } from '@/lib/agendamento-online-themes';

export interface ConfigAgendamentoOnline {
  id?: string;
  user_id?: string;
  public_id?: string;
  ativo: boolean;
  nome_salao: string;
  descricao: string;
  telefone: string;
  email: string;
  endereco: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  logo_url?: string;
  banner_url?: string;
  sobre_texto?: string;
  galeria_urls?: string[];
  estilo_fundo?: 'gradient' | 'solid' | 'glow' | 'aurora';
  cor_fundo?: string;
  cor_fundo_secundaria?: string;
  efeito_visual?: 'none' | 'glow' | 'float';
  taxa_sinal_percentual: number;
  tempo_minimo_antecedencia: number;
  tempo_maximo_antecedencia: number;
  mensagem_boas_vindas: string;
  termos_condicoes: string;
  mensagem_confirmacao: string;
  cor_primaria?: string;
  tema_preset?: BookingThemeId;
  cor_secundaria?: string;
  cor_texto_botao?: string;
  fonte_personalizada?: string;
  card_background?: string;
  raio_botoes?: number;
  animacao_botao?: 'lift' | 'pulse' | 'shine' | 'none' | 'scale' | 'glow';
  tema_formulario?: 'claro' | 'escuro' | 'neutro' | 'alto-contraste';
  estilo_card?: 'premium' | 'glass' | 'soft' | 'minimal' | 'bordered';
  estilo_botao?: 'gradiente' | 'sólido' | 'outline' | 'glass' | 'minimal';
  sombra_botao?: 'none' | 'suave' | 'media' | 'forte' | 'colorida';
  mostrar_precos?: boolean;
  mostrar_duracao?: boolean;
}

const defaultConfig: ConfigAgendamentoOnline = {
  ativo: true,
  nome_salao: 'Meu Salão',
  descricao: 'Bem-vindo ao nosso salão! Agende seu horário de forma rápida e fácil.',
  telefone: '',
  email: '',
  endereco: '',
  instagram: '',
  facebook: '',
  whatsapp: '',
  logo_url: '',
  banner_url: '',
  sobre_texto: '',
  galeria_urls: [],
  estilo_fundo: 'aurora',
  cor_fundo: '#F5F3FF',
  cor_fundo_secundaria: '#FDF2F8',
  efeito_visual: 'glow',
  taxa_sinal_percentual: 0,
  tempo_minimo_antecedencia: 60,
  tempo_maximo_antecedencia: 4320,
  mensagem_boas_vindas: 'Olá! Estamos felizes em atendê-lo(a). Preencha os dados abaixo para agendar seu horário.',
  termos_condicoes: 'Ao agendar, você concorda em chegar no horário marcado. Em caso de atraso superior a 15 minutos, o agendamento poderá ser cancelado.',
  mensagem_confirmacao: 'Agendamento confirmado! Em breve você receberá uma confirmação no WhatsApp.',
  cor_primaria: '#8B5CF6',
  tema_preset: 'salao-feminino',
  cor_secundaria: '#F5D0FE',
  cor_texto_botao: '#FFFFFF',
  fonte_personalizada: 'Inter, Segoe UI, sans-serif',
  card_background: '#FFFFFF',
  raio_botoes: 22,
  animacao_botao: 'lift',
  tema_formulario: 'claro',
  estilo_card: 'premium',
  estilo_botao: 'gradiente',
  sombra_botao: 'media',
  mostrar_precos: true,
  mostrar_duracao: true
};

export function useConfigAgendamentoOnline() {
  const [config, setConfig] = useState<ConfigAgendamentoOnline>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const gerarPublicId = (): string => {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toLowerCase();
  };

  useEffect(() => {
    carregarConfig();
  }, []);

  const carregarConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('configuracoes_agendamento_online' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar config:', error);
      }

      if (data) {
        setConfig(data as unknown as ConfigAgendamentoOnline);
      } else {
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarConfig = async (newConfig: ConfigAgendamentoOnline) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const publicIdFinal = (newConfig.public_id && newConfig.public_id.trim() !== '')
        ? newConfig.public_id.toLowerCase().replace(/[^a-z0-9-]/g, '')
        : gerarPublicId();

      const configData: any = {
        ativo: newConfig.ativo,
        nome_salao: newConfig.nome_salao,
        descricao: newConfig.descricao,
        telefone: newConfig.telefone,
        email: newConfig.email,
        endereco: newConfig.endereco,
        instagram: newConfig.instagram,
        facebook: newConfig.facebook,
        whatsapp: newConfig.whatsapp,
        logo_url: newConfig.logo_url,
        banner_url: newConfig.banner_url,
        sobre_texto: newConfig.sobre_texto,
        galeria_urls: newConfig.galeria_urls || [],
        estilo_fundo: newConfig.estilo_fundo,
        cor_fundo: newConfig.cor_fundo,
        cor_fundo_secundaria: newConfig.cor_fundo_secundaria,
        efeito_visual: newConfig.efeito_visual,
        taxa_sinal_percentual: newConfig.taxa_sinal_percentual,
        tempo_minimo_antecedencia: newConfig.tempo_minimo_antecedencia,
        tempo_maximo_antecedencia: newConfig.tempo_maximo_antecedencia,
        mensagem_boas_vindas: newConfig.mensagem_boas_vindas,
        termos_condicoes: newConfig.termos_condicoes,
        mensagem_confirmacao: newConfig.mensagem_confirmacao,
        cor_primaria: newConfig.cor_primaria,
        tema_preset: newConfig.tema_preset,
        cor_secundaria: newConfig.cor_secundaria,
        cor_texto_botao: newConfig.cor_texto_botao,
        fonte_personalizada: newConfig.fonte_personalizada,
        card_background: newConfig.card_background,
        raio_botoes: newConfig.raio_botoes,
        animacao_botao: newConfig.animacao_botao,
        tema_formulario: newConfig.tema_formulario,
        estilo_card: newConfig.estilo_card,
        estilo_botao: newConfig.estilo_botao,
        sombra_botao: newConfig.sombra_botao,
        mostrar_precos: newConfig.mostrar_precos,
        mostrar_duracao: newConfig.mostrar_duracao,
        public_id: publicIdFinal,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('configuracoes_agendamento_online' as any)
        .upsert(configData, { onConflict: 'user_id' });

      if (error) throw error;

      setConfig({ ...newConfig, public_id: publicIdFinal });
      toast.success('Configurações aplicadas com sucesso! 🚀');
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar as configurações. Tente novamente mais tarde.');
      return false; // Retornamos false para expor a falha de consistência
    } finally {
      setSaving(false);
    }
  };

  const carregarConfigPublica = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_agendamento_online' as any)
        .select('*')
        .eq('ativo', true)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar config pública:', error);
        return defaultConfig;
      }

      return (data as unknown as ConfigAgendamentoOnline) || defaultConfig;
    } catch (error) {
      console.error('Erro ao carregar configuração pública:', error);
      return defaultConfig;
    }
  };

  return {
    config,
    loading,
    saving,
    setConfig,
    salvarConfig,
    carregarConfig,
    carregarConfigPublica
  };
}
