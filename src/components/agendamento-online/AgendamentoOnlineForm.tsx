/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, User, UserRound, Phone, Mail, ShieldCheck, AlertCircle, Share2, Copy, ArrowRight, ArrowLeft, ShoppingBag, Check, Scissors, Timer, Tag, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useAgendamentoOnlineService } from '@/hooks/useAgendamentoOnlineService';
import { useHorariosTrabalhoPublic } from '@/hooks/useHorariosTrabalhoPublic';
import { useShare } from '@/hooks/useShare';
import { useConfigAgendamentoOnlinePublic } from '@/hooks/useConfigAgendamentoOnlinePublic';
import { getBookingPageBackground } from '@/lib/agendamento-online-themes';
import { AgendamentoOnlineData, HorarioDisponivel, FormErrors } from '@/types/agendamento-online';
import { supabasePublic } from '@/integrations/supabase/publicClient';
import { ProgressSteps } from './ProgressSteps';
import { SalonHeader } from './SalonHeader';
import { SalonFooter } from './SalonFooter';
import { SalonLandingContent } from './SalonLandingContent';
import { Separator } from '@/components/ui/separator';
import { agendamentoOnlineSchema } from '@/lib/validation';
import { toast } from 'sonner';

export function AgendamentoOnlineForm({ embedded = false }: { embedded?: boolean } = {}) {
  const {
    loading,
    servicos,
    servicosError,
    produtos,
    horariosError,
    ownerUserId,
    carregarServicos,
    carregarProdutosPublicos,
    calcularHorariosDisponiveis,
    criarAgendamento
  } = useAgendamentoOnlineService();

  const {
    isDiaAtivo,
    loading: loadingHorarios,
    configuracoes
  } = useHorariosTrabalhoPublic(ownerUserId || undefined);

  const { shareContent, copyToClipboard, isSharing } = useShare();
  const { config: configOnline } = useConfigAgendamentoOnlinePublic(ownerUserId);

  // Cores dinâmicas do formulário
  const primaryColor = configOnline.cor_primaria || '#8B5CF6';
  const secondaryColor = configOnline.cor_secundaria || '#F5D0FE';
  const primaryHsl = hexToHsl(primaryColor);
  const secondaryHsl = hexToHsl(secondaryColor);
  const buttonAnimation = configOnline.animacao_botao || 'lift';
  const buttonRadius = `${configOnline.raio_botoes ?? 22}px`;
  const keyVisualMode = configOnline.tema_formulario || 'claro';
  const isDarkVisualMode = keyVisualMode === 'escuro';
  const isNeutralVisualMode = keyVisualMode === 'neutro';
  const isHighContrastMode = keyVisualMode === 'alto-contraste';
  const cardVisualStyle = configOnline.estilo_card || 'premium';
  const buttonVisualStyle = configOnline.estilo_botao || 'gradiente';
  const shadowVisualStyle = configOnline.sombra_botao || 'media';
  const pageBackground = getBookingPageBackground(
    configOnline.estilo_fundo,
    configOnline.cor_fundo || (isDarkVisualMode ? '#0F172A' : isNeutralVisualMode ? '#F5F0E8' : '#F5F3FF'),
    configOnline.cor_fundo_secundaria || (isDarkVisualMode ? '#1E293B' : isNeutralVisualMode ? '#E8DDCE' : '#FDF2F8'),
    primaryColor,
    isDarkVisualMode ? 'escuro' : 'claro',
  );
  const cardBaseColor = configOnline.card_background
    || (isDarkVisualMode ? '#111827' : isNeutralVisualMode ? '#FFFCF7' : '#FFFFFF');
  const visualCardBackground = cardVisualStyle === 'glass'
    ? hexToRgba(cardBaseColor, 0.78)
    : cardVisualStyle === 'soft'
      ? configOnline.card_background || (isDarkVisualMode ? '#0f172a' : isNeutralVisualMode ? '#FFFCF7' : '#f8f5ff')
      : cardVisualStyle === 'minimal'
        ? 'transparent'
        : cardBaseColor;
  const buttonShadowStyle = {
    none: 'none',
    suave: '0 6px 16px rgba(15,23,42,0.12)',
    media: `0 12px 28px ${primaryColor}33`,
    forte: `0 20px 40px ${primaryColor}44`,
    colorida: `0 12px 32px ${primaryColor}66`,
  }[shadowVisualStyle];
  const cardShadowStyle = cardVisualStyle === 'minimal'
    ? 'none'
    : cardVisualStyle === 'bordered'
      ? `0 8px 24px ${primaryColor}14`
      : `0 20px 50px ${primaryColor}1A`;
  const foregroundColor = isDarkVisualMode ? '#F8FAFC' : isNeutralVisualMode ? '#3D352D' : '#0F172A';
  const pageSurfaceColor = isDarkVisualMode ? '#0F172A' : isNeutralVisualMode ? '#F5F0E8' : '#FFFFFF';
  const themeStyle = {
    ['--primary' as any]: primaryHsl,
    ['--secondary' as any]: secondaryHsl,
    ['--card' as any]: hexToHsl(cardBaseColor),
    ['--foreground' as any]: hexToHsl(isHighContrastMode ? '#000000' : foregroundColor),
    ['--card-foreground' as any]: hexToHsl(isDarkVisualMode ? '#F8FAFC' : isNeutralVisualMode ? '#3D352D' : '#0F172A'),
    ['--background' as any]: hexToHsl(isHighContrastMode ? '#FFFFFF' : pageSurfaceColor),
    ['--ring' as any]: primaryHsl,
    ['--radius' as any]: buttonRadius,
    fontFamily: configOnline.fonte_personalizada || 'Inter, Segoe UI, sans-serif',
    background: pageBackground,
    color: isDarkVisualMode ? '#f8fafc' : isNeutralVisualMode ? '#3D352D' : '#0f172a'
  } as React.CSSProperties;

  const buttonAnimationClass = {
    lift: 'hover:-translate-y-1 active:translate-y-0',
    pulse: 'animate-pulse motion-reduce:animate-none',
    shine: 'shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_25px_rgba(255,255,255,0.15)]',
    none: '',
    scale: 'hover:scale-[1.03] active:scale-100',
    glow: 'hover:brightness-110'
  }[buttonAnimation];

  const resolvedButtonStyle = (() => {
    switch (buttonVisualStyle) {
      case 'sólido':
        return {
          background: primaryColor,
          color: configOnline.cor_texto_botao || '#FFFFFF',
          border: 'none'
        };
      case 'outline':
        return {
          background: 'transparent',
          border: `1.5px solid ${primaryColor}`,
          color: primaryColor
        };
      case 'glass':
        return {
          background: `${primaryColor}22`,
          border: `1px solid ${primaryColor}55`,
          color: isDarkVisualMode ? '#F8FAFC' : primaryColor,
          backdropFilter: 'blur(10px)',
        };
      case 'minimal':
        return {
          background: 'transparent',
          border: '1px solid transparent',
          color: primaryColor,
        };
      default:
        return {
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          color: configOnline.cor_texto_botao || '#FFFFFF',
          border: 'none'
        };
    }
  })();

  // Função auxiliar para converter Hex para HSL (formato esperado pelo Tailwind no projeto)
  function hexToHsl(hex: string) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
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

  function hexToRgba(hex: string, alpha: number) {
    const normalized = hex.replace('#', '');
    const expanded = normalized.length === 3
      ? normalized.split('').map(char => char + char).join('')
      : normalized;
    if (!/^[0-9a-f]{6}$/i.test(expanded)) return hex;
    const red = Number.parseInt(expanded.slice(0, 2), 16);
    const green = Number.parseInt(expanded.slice(2, 4), 16);
    const blue = Number.parseInt(expanded.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  const [formData, setFormData] = useState<AgendamentoOnlineData>({
    nome_completo: '',
    email: '',
    telefone: '',
    servico_id: '',
    data: '',
    horario: '',
    observacoes: ''
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [taxaAccepted, setTaxaAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const [produtoId, setProdutoId] = useState<string>('');
  const [produtoQtd, setProdutoQtd] = useState<number>(1);
  const [produtoForma, setProdutoForma] = useState<string>('pix');
  const [produtoEnabled, setProdutoEnabled] = useState<boolean>(false);
  const [produtoCategoria, setProdutoCategoria] = useState<string>('todas');
  const [produtoOrdenacao, setProdutoOrdenacao] = useState<'nome' | 'preco'>('nome');

  const agora = useMemo(() => new Date(), []);
  const minAntecedenciaMin = useMemo(() => 
    typeof configOnline.tempo_minimo_antecedencia === 'number' && configOnline.tempo_minimo_antecedencia > 0
      ? configOnline.tempo_minimo_antecedencia
      : 0, 
  [configOnline.tempo_minimo_antecedencia]);

  const minDateTime = useMemo(() => 
    new Date(agora.getTime() + minAntecedenciaMin * 60 * 1000),
  [agora, minAntecedenciaMin]);

  const dataMinima = useMemo(() => 
    minDateTime.toISOString().split('T')[0],
  [minDateTime]);
  
  const maxMinutos = useMemo(() => 
    typeof configOnline.tempo_maximo_antecedencia === 'number' && configOnline.tempo_maximo_antecedencia > 0
      ? configOnline.tempo_maximo_antecedencia
      : 90 * 24 * 60,
  [configOnline.tempo_maximo_antecedencia]);

  const dataMaxima = useMemo(() => 
    new Date(agora.getTime() + maxMinutos * 60 * 1000).toISOString().split('T')[0],
  [agora, maxMinutos]);

  const steps = ['Dados', 'Agendamento', 'Finalização'];

  useEffect(() => {
    carregarServicos();
    carregarProdutosPublicos();
  }, [carregarServicos, carregarProdutosPublicos]);

  useEffect(() => {
    console.log('Configurações carregadas:', { 
      total: configuracoes.length,
      loading: loadingHorarios,
      items: configuracoes
    });
  }, [configuracoes, loadingHorarios]);

  const gerarHorariosFallback = useCallback(() => {
    if (!formData.servico_id || !formData.data) return [];

    const dataSelecionada = new Date(formData.data + 'T00:00:00');
    const diaSemana = dataSelecionada.getDay();
    const configuracao = configuracoes.find(c => c.dia_semana === diaSemana && c.ativo);
    if (!configuracao) return [];

    const servicoSelecionado = servicos.find(s => s.id === formData.servico_id);
    const duracaoMinutos = Number(servicoSelecionado?.duracao ?? 60);
    const duracao = Number.isFinite(duracaoMinutos) && duracaoMinutos > 0 ? duracaoMinutos : 60;

    const toMinutes = (time: string) => {
      const [h, m] = String(time || '00:00').split(':').map(Number);
      return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
    };

    const formatMinutes = (minutes: number) => {
      const h = Math.floor(minutes / 60) % 24;
      const m = minutes % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const inicio = toMinutes(configuracao.horario_abertura);
    const fim = toMinutes(configuracao.horario_fechamento);
    const intervaloInicio = configuracao.intervalo_inicio ? toMinutes(configuracao.intervalo_inicio) : null;
    const intervaloFim = configuracao.intervalo_fim ? toMinutes(configuracao.intervalo_fim) : null;

    const slots: HorarioDisponivel[] = [];
    for (let slotInicio = inicio; slotInicio + duracao <= fim; slotInicio += 30) {
      const slotFim = slotInicio + duracao;
      const estaNoIntervalo = intervaloInicio !== null && intervaloFim !== null
        ? ((slotInicio >= intervaloInicio && slotInicio < intervaloFim) ||
           (slotFim > intervaloInicio && slotFim <= intervaloFim) ||
           (slotInicio < intervaloInicio && slotFim > intervaloFim))
        : false;

      if (!estaNoIntervalo) {
        slots.push({ horario: formatMinutes(slotInicio), disponivel: true });
      }
    }

    return slots;
  }, [configuracoes, formData.data, formData.servico_id, servicos]);

  const carregarHorariosDisponiveis = useCallback(async () => {
    if (!formData.servico_id || !formData.data) return;

    const servicoSelecionado = servicos.find(s => s.id === formData.servico_id);
    if (!servicoSelecionado) {
      console.warn('[booking] Serviço não encontrado:', formData.servico_id);
      return;
    }

    const dataSelecionada = new Date(formData.data + 'T00:00:00');
    const diaSemana = dataSelecionada.getDay();

    // Se as configurações ainda estão carregando, não bloqueamos.
    // Se já carregou e existem configurações, validamos o dia.
    if (!loadingHorarios && configuracoes.length > 0 && !isDiaAtivo(diaSemana)) {
      console.log('[booking] Dia não ativo:', diaSemana);
      setHorariosDisponiveis([]);
      return;
    }

    try {
      console.log('[booking] Buscando horários:', formData.data, formData.servico_id);
      const result = await calcularHorariosDisponiveis(formData.servico_id, formData.data);
      
      if (!Array.isArray(result)) {
        console.warn('[booking] Resultado inválido:', result);
        setHorariosDisponiveis([]);
        return;
      }

      console.log('[booking] Horários encontrados:', result.length);
      const horariosFormatados: HorarioDisponivel[] = result.map((h: any) => {
        if (typeof h === 'string') {
          return { horario: h, disponivel: true };
        }
        if (h && typeof h === 'object' && 'horario' in h) {
          return h as HorarioDisponivel;
        }
        return { horario: String(h), disponivel: false };
      });

      const isHoje = formData.data === agora.toISOString().split('T')[0];

      const horariosFiltrados = isHoje
        ? horariosFormatados.filter(h => {
            const [hh, mm] = String(h.horario).slice(0, 5).split(':').map(Number);
            if (!Number.isFinite(hh) || !Number.isFinite(mm)) return false;
            const slot = new Date(agora);
            slot.setHours(hh, mm, 0, 0);
            return slot >= minDateTime;
          })
        : horariosFormatados;

      if (horariosFiltrados.length === 0 && configuracoes.length > 0) {
        const fallback = gerarHorariosFallback();
        const fallbackFiltrado = isHoje
          ? fallback.filter(h => {
              const [hh, mm] = String(h.horario).slice(0, 5).split(':').map(Number);
              if (!Number.isFinite(hh) || !Number.isFinite(mm)) return false;
              const slot = new Date(agora);
              slot.setHours(hh, mm, 0, 0);
              return slot >= minDateTime;
            })
          : fallback;
        setHorariosDisponiveis(fallbackFiltrado);
        return;
      }

      setHorariosDisponiveis(horariosFiltrados);
    } catch (error) {
      console.error('[booking] Erro ao carregar horários:', error);
      setHorariosDisponiveis([]);
    }
  }, [formData.servico_id, formData.data, servicos, loadingHorarios, configuracoes, isDiaAtivo, calcularHorariosDisponiveis, minDateTime, agora, gerarHorariosFallback]);

  useEffect(() => {
    if (formData.servico_id && formData.data) {
      carregarHorariosDisponiveis();

      const channel = supabasePublic
        .channel('configuracoes_horarios_online')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'configuracoes_horarios'
        }, () => {
          carregarHorariosDisponiveis();
        })
        .subscribe();

      return () => {
        supabasePublic.removeChannel(channel);
      };
    }
  }, [formData.servico_id, formData.data, carregarHorariosDisponiveis]);

  const formatarTelefone = (valor: string): string => {
    const digits = valor.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleInputChange = (field: keyof AgendamentoOnlineData, value: string) => {
    if (field === 'telefone') {
      value = formatarTelefone(value);
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const newErrors: FormErrors = {};
      if (!formData.nome_completo.trim()) newErrors.nome_completo = 'Nome completo é obrigatório';
      if (!formData.email.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.telefone.trim()) {
        newErrors.telefone = 'Telefone é obrigatório';
      } else if (formData.telefone.replace(/\D/g, '').length < 8) {
        newErrors.telefone = 'Telefone inválido (mínimo 8 dígitos)';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (currentStep === 2) {
      const newErrors: FormErrors = {};
      if (!formData.servico_id) newErrors.servico_id = 'Selecione um serviço';
      if (!formData.data) newErrors.data = 'Selecione uma data';
      if (!formData.horario) newErrors.horario = 'Selecione um horário';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error('Você deve aceitar os termos e condições para continuar.');
      return;
    }
    if (configOnline.taxa_sinal_percentual > 0 && !taxaAccepted) {
      toast.error('Você deve aceitar as condições da taxa antecipada para continuar.');
      return;
    }

    // Validate and sanitize input with zod
    try {
      const validatedData = agendamentoOnlineSchema.parse(formData);
      
      // Se não houver taxa de sinal, forçamos a aceitação interna para não travar o envio
      const canSubmit = termsAccepted && (configOnline.taxa_sinal_percentual <= 0 || taxaAccepted);
      
      if (!canSubmit) {
        toast.error('Você deve aceitar os termos e a taxa de sinal (se houver) para continuar.');
        return;
      }

      if (produtoEnabled && produtoId) {
        const pSel = produtos.find(p => p.id === produtoId);
        const compra = {
          produto_id: produtoId,
          produto_nome: pSel?.nome || '',
          quantidade: produtoQtd,
          forma_pagamento_produto: produtoForma,
          valor_unitario: pSel?.valor || 0,
          valor_total: (pSel?.valor || 0) * produtoQtd
        };
        const prefix = validatedData.observacoes ? validatedData.observacoes + '\n' : '';
        const nextObs = `${prefix}Compra de produto: ${JSON.stringify(compra)}`;
        if (nextObs.length > 500) {
          toast.error('As observações ficaram muito longas. Remova texto ou a compra do produto.');
          setIsSubmitting(false);
          return;
        }
        validatedData.observacoes = nextObs;
        
        // Somar o valor do produto ao valor do agendamento
        const valorServico = servicos.find(s => s.id === formData.servico_id)?.valor || 0;
        const valorTotal = valorServico + (compra.valor_total);
        (validatedData as any).valor = valorTotal;
      }
      setIsSubmitting(true);
      const sucesso = await criarAgendamento(validatedData as AgendamentoOnlineData);
      
      if (sucesso) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setIsSubmitting(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        const firstErrorMessage = error.issues[0]?.message || 'Erro de validação';
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        toast.error(`Erro no formulário: ${firstErrorMessage}`);
      } else {
        toast.error('Erro ao validar dados do formulário: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      }
      setIsSubmitting(false);
    }
  };

  const servicoSelecionado = servicos.find(s => s.id === formData.servico_id);
  const produtoSelecionado = produtos.find(p => p.id === produtoId);
  const valorServico = typeof servicoSelecionado?.valor === 'number' && Number.isFinite(servicoSelecionado.valor) ? servicoSelecionado.valor : 0;
  const valorProdutoUnit = typeof produtoSelecionado?.valor === 'number' && Number.isFinite(produtoSelecionado.valor) ? produtoSelecionado.valor : 0;
  const valorProdutoTotal = produtoEnabled && produtoId ? valorProdutoUnit * Math.max(1, produtoQtd || 1) : 0;
  const valorTotal = valorServico + valorProdutoTotal;

  const compartilharComprovante = async () => {
    const dataFormatada = new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const comprovanteTexto = `🎉 *AGENDAMENTO CONFIRMADO*

📋 *Detalhes do Agendamento:*
👤 Cliente: ${formData.nome_completo}
💇 Serviço: ${servicoSelecionado?.nome}
${produtoEnabled && produtoId ? `📦 Produto: ${produtoSelecionado?.nome} (${produtoQtd}x)\n` : ''}
📅 Data: ${dataFormatada}
⏰ Horário: ${formData.horario}
💰 Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}

✅ Seu agendamento foi confirmado com sucesso!
Você receberá uma confirmação em breve.

📱 Guarde este comprovante para apresentar no dia do atendimento.`;

    await shareContent({
      title: "Comprovante de Agendamento",
      text: comprovanteTexto
    });
  };

  const copiarComprovante = async () => {
    const dataFormatada = new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const comprovanteTexto = `🎉 AGENDAMENTO CONFIRMADO

📋 Detalhes do Agendamento:
👤 Cliente: ${formData.nome_completo}
💇 Serviço: ${servicoSelecionado?.nome}
${produtoEnabled && produtoId ? `📦 Produto: ${produtoSelecionado?.nome} (${produtoQtd}x)\n` : ''}
📅 Data: ${dataFormatada}
⏰ Horário: ${formData.horario}
💰 Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}

✅ Seu agendamento foi confirmado com sucesso!
Você receberá uma confirmação em breve.

📱 Guarde este comprovante para apresentar no dia do atendimento.`;

    await copyToClipboard(comprovanteTexto);
  };

  const isDataDisponivel = (data: string) => {
    if (!data) return false;
    const dataSelecionada = new Date(data + 'T00:00:00');
    const diaSemana = dataSelecionada.getDay();

    if (configuracoes.length === 0) return true;
    return isDiaAtivo(diaSemana);
  };

  if (success) {
    if (embedded) {
      return (
        <div className="flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
          <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border border-primary/10 bg-card/90 shadow-xl backdrop-blur-xl animate-in zoom-in duration-500">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
            <CardHeader className="pb-3 pt-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary/10 text-primary shadow-inner">
                <CheckCircle2 className="h-11 w-11" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">Agendamento confirmado!</CardTitle>
              <CardDescription className="px-4 text-sm leading-relaxed">
                Seu horário foi reservado com sucesso. Obrigado por escolher {configOnline.nome_salao}.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-7 pt-2 text-center">
              <div className="rounded-2xl bg-primary/[0.06] p-4 text-left">
                <p className="font-bold text-foreground">{servicoSelecionado?.nome}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR')} às {formData.horario}
                </p>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Guarde os dados do seu horário. Você receberá uma confirmação em breve.</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div className="flex flex-col min-h-screen" style={themeStyle}>
        <SalonHeader config={configOnline} />
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <Card className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-card/90 shadow-[0_35px_100px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl animate-in zoom-in duration-500 sm:rounded-[2.5rem]">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
            <CardHeader className="px-6 pb-5 pt-9 text-center sm:px-10 sm:pt-12">
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary shadow-inner ring-8 ring-primary/[0.04]">
                <CheckCircle2 className="h-14 w-14" />
                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-card bg-emerald-500" />
              </div>
              <span className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Tudo certo</span>
              <CardTitle className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Agendamento confirmado!</CardTitle>
              <CardDescription className="mx-auto mt-2 max-w-md text-base leading-relaxed">
                {formData.nome_completo ? `${formData.nome_completo}, seu` : 'Seu'} horário está reservado em {configOnline.nome_salao}.
                Guarde os detalhes abaixo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-5 pb-7 sm:px-10 sm:pb-10">
              <div className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-background/80 shadow-sm">
                <div className="flex items-center gap-4 border-b border-border/70 bg-primary/[0.04] p-5 sm:p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Scissors className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Serviço</p>
                    <p className="truncate text-lg font-extrabold text-foreground">{servicoSelecionado?.nome}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-border/70">
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Data</p>
                    <p className="mt-1 font-bold text-foreground">{new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Horário</p>
                    <p className="mt-1 font-bold text-foreground">{formData.horario}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-dashed border-border/80 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <span>Serviço</span>
                    <span className="font-semibold text-foreground">R$ {valorServico.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {produtoEnabled && produtoId && (
                    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                      <span className="truncate">Produto ({produtoQtd}× {produtoSelecionado?.nome})</span>
                      <span className="shrink-0 font-semibold text-foreground">R$ {valorProdutoTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex items-end justify-between gap-4 border-t border-border/70 pt-4">
                    <span className="text-sm font-bold text-foreground">Total</span>
                    <span className="text-2xl font-black tracking-tight text-primary">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-4 py-3 text-center text-sm font-medium text-emerald-900">
                Guarde este comprovante para apresentar no dia do atendimento.
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={compartilharComprovante}
                  disabled={isSharing}
                  className={`h-14 w-full rounded-2xl font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 ${buttonAnimationClass}`}
                  style={{ ...resolvedButtonStyle, borderRadius: buttonRadius, boxShadow: buttonShadowStyle }}
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  {isSharing ? 'Preparando comprovante...' : 'Compartilhar comprovante'}
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={copiarComprovante}
                    variant="outline"
                    className="h-12 rounded-2xl font-semibold"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar dados
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="ghost"
                    className="h-12 rounded-2xl font-semibold text-muted-foreground hover:text-primary"
                  >
                    Novo Agendamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <SalonFooter config={configOnline} />
      </div>
    );
  }

  if (!configOnline.ativo && !loading) {
    if (embedded) {
      return (
        <div className="rounded-[1.5rem] border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-6 text-center">
          <h3 className="font-black">Agendamento pausado</h3><p className="text-sm text-muted-foreground mt-1">Este salão pausou agendamentos online por enquanto.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col min-h-screen" style={themeStyle}>
        <SalonHeader config={configOnline} />
        <div className="flex-1 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-none shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-white/90 backdrop-blur-xl rounded-[3rem] overflow-hidden p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground tracking-tighter">Agendamento Indisponível</h2>
              <p className="text-muted-foreground font-medium">
                No momento, o agendamento online para este salão está temporariamente desativado.
              </p>
            </div>
            {configOnline.telefone && (
              <Button 
                asChild
                className="w-full h-12 rounded-2xl bg-primary text-white font-bold"
              >
                <a href={`tel:${configOnline.telefone.replace(/\D/g, '')}`}>
                  Ligar para o Salão
                </a>
              </Button>
            )}
          </Card>
        </div>
        <SalonFooter config={configOnline} />
      </div>
    );
  }

  if (embedded) {
    return (
      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5 p-6 sm:p-8">
          <ProgressSteps currentStep={currentStep} steps={steps} />
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col gap-2 border-b border-primary/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Seus Dados</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{configOnline.mensagem_boas_vindas || 'Preencha os dados abaixo para agendar seu horário.'}</p>
                </div>
                <div className="grid gap-6">
                  <div className="space-y-2 group">
                    <Label htmlFor="nome_completo_embed" className="text-sm font-semibold group-focus-within:text-primary transition-colors">Nome Completo *</Label>
                    <Input id="nome_completo_embed" value={formData.nome_completo} onChange={(e) => handleInputChange('nome_completo', e.target.value)} placeholder="Seu nome completo" className={`h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white shadow-sm transition-all duration-300 ${errors.nome_completo ? 'border-destructive ring-destructive/20' : 'focus:shadow-md focus:ring-primary/20'}`} />
                    {errors.nome_completo && (<span className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.nome_completo}</span>)}
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="email_embed" className="text-sm font-semibold group-focus-within:text-primary transition-colors">Email *</Label>
                    <Input id="email_embed" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="seu@email.com" className={`h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white shadow-sm transition-all duration-300 ${errors.email ? 'border-destructive ring-destructive/20' : 'focus:shadow-md focus:ring-primary/20'}`} />
                    {errors.email && (<span className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.email}</span>)}
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="telefone_embed" className="text-sm font-semibold group-focus-within:text-primary transition-colors">Telefone *</Label>
                    <Input id="telefone_embed" value={formData.telefone} onChange={(e) => handleInputChange('telefone', e.target.value)} placeholder="(11) 99999-9999" className={`h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white shadow-sm transition-all duration-300 ${errors.telefone ? 'border-destructive ring-destructive/20' : 'focus:shadow-md focus:ring-primary/20'}`} />
                    {errors.telefone && (<span className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">{errors.telefone}</span>)}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className={`flex-1 h-14 text-white font-bold shadow-lg ${buttonAnimationClass}`}
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      borderRadius: buttonRadius,
                      boxShadow: `0 12px 30px ${primaryColor}33`
                    }}
                  >
                    Continuar <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
            {currentStep !== 1 && (<div className="text-center py-8 text-sm text-muted-foreground">Continue no formulário completo — este é o modo embarcado simplificado. <Button variant="link" onClick={()=>window.location.href='/agendamento-online?s='+encodeURIComponent(configOnline.public_id||'')}>Abrir página completa</Button></div>)}
          </form>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="flex flex-col min-h-screen" style={themeStyle}>
      <SalonHeader config={configOnline} />
      <SalonLandingContent config={configOnline} />
      <div className="flex-1 bg-gradient-to-b from-transparent to-primary/5 p-4 sm:p-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <Card
            id="agendamento-form"
            className="overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-md animate-in fade-in zoom-in duration-500"
            style={{
              background: configOnline.card_background || visualCardBackground,
              borderColor: cardVisualStyle === 'bordered' ? `${primaryColor}55` : `${primaryColor}18`,
              borderWidth: cardVisualStyle === 'bordered' ? 2 : 1,
              boxShadow: cardShadowStyle,
            }}
          >
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5 p-6 sm:p-8">
              <ProgressSteps currentStep={currentStep} steps={steps} />
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Dados Pessoais */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-card/80 to-secondary/[0.12] p-5 shadow-sm sm:p-7">
                      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                      <div className="relative flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                          <UserRound className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Etapa 1 de 3</p>
                          <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Vamos nos conhecer</h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Seus dados ajudam o espaço a confirmar seu horário e entrar em contato.
                          </p>
                        </div>
                      </div>
                    </div>

                    {configOnline.mensagem_boas_vindas && (
                      <p className="rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                        {configOnline.mensagem_boas_vindas}
                      </p>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="nome_completo" className="text-sm font-bold">Nome completo <span className="text-primary">*</span></Label>
                        <div className={`group relative rounded-2xl border bg-background/80 transition-all duration-200 focus-within:border-primary focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10 ${errors.nome_completo ? 'border-destructive' : 'border-input'}`}>
                          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          id="nome_completo"
                          name="name"
                          autoComplete="name"
                          value={formData.nome_completo}
                          onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                          placeholder="Como podemos chamar você?"
                          aria-invalid={Boolean(errors.nome_completo)}
                          className="h-14 rounded-2xl border-0 bg-transparent pl-12 pr-4 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        </div>
                        {errors.nome_completo && (
                          <span role="alert" className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{errors.nome_completo}</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefone" className="text-sm font-bold">Celular / WhatsApp <span className="text-primary">*</span></Label>
                        <div className={`group relative rounded-2xl border bg-background/80 transition-all duration-200 focus-within:border-primary focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10 ${errors.telefone ? 'border-destructive' : 'border-input'}`}>
                          <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          id="telefone"
                          name="tel"
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          placeholder="(11) 99999-9999"
                          aria-invalid={Boolean(errors.telefone)}
                          className="h-14 rounded-2xl border-0 bg-transparent pl-12 pr-4 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        </div>
                        {errors.telefone && (
                          <span role="alert" className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{errors.telefone}</span>
                        )}
                        <p className="pl-1 text-xs text-muted-foreground">Usaremos para confirmar seu agendamento.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold">E-mail <span className="text-primary">*</span></Label>
                        <div className={`group relative rounded-2xl border bg-background/80 transition-all duration-200 focus-within:border-primary focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10 ${errors.email ? 'border-destructive' : 'border-input'}`}>
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          aria-invalid={Boolean(errors.email)}
                          className="h-14 rounded-2xl border-0 bg-transparent pl-12 pr-4 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        </div>
                        {errors.email && (
                          <span role="alert" className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{errors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/[0.04] p-4">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Seus dados são usados apenas para organizar e confirmar seu atendimento com {configOnline.nome_salao}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Serviço e Agendamento */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-card/80 to-secondary/[0.12] p-5 shadow-sm sm:p-7">
                      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                      <div className="relative flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                          <Scissors className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Etapa 2 de 3</p>
                          <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                            Escolha seu serviço
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Selecione o atendimento desejado para ver os horários disponíveis.
                          </p>
                        </div>
                      </div>
                    </div>

                    {loading && servicos.length === 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-[176px] rounded-[1.75rem] border border-primary/10 bg-card/60 animate-pulse"
                          />
                        ))}
                      </div>
                    )}

                    {!loading && servicos.length === 0 && (
                      <Alert className="rounded-3xl border-primary/20 bg-primary/5 p-6 shadow-sm animate-in fade-in duration-500">
                        <AlertCircle className="h-6 w-6 text-primary" />
                        <AlertDescription className="text-foreground text-sm font-medium ml-2">
                          {servicosError?.includes('link') || servicosError?.includes('oficial') 
                            ? (
                              <div className="space-y-3">
                                <h3 className="text-lg font-black tracking-tight text-primary">Salão não identificado</h3>
                                <p className="text-muted-foreground">
                                  Para acessar a página de agendamento, você precisa utilizar o link oficial fornecido pelo estabelecimento.
                                </p>
                                <div className="p-4 bg-white/50 rounded-2xl border border-primary/10 text-xs text-muted-foreground">
                                  <p className="font-bold mb-1 uppercase tracking-widest text-[10px]">Dica para o proprietário:</p>
                                  Certifique-se de compartilhar o link completo com seu <code className="bg-primary/10 px-1 rounded text-primary">slug</code> ou <code className="bg-primary/10 px-1 rounded text-primary">ID</code> único.
                                </div>
                              </div>
                            )
                            : (
                              <div className="space-y-2">
                                <h3 className="text-lg font-black tracking-tight text-amber-600">Serviços Indisponíveis</h3>
                                <p className="text-muted-foreground">
                                  No momento não há serviços disponíveis para agendamento online neste salão.
                                </p>
                                {servicosError && <p className="text-xs opacity-60">Detalhes: {servicosError}</p>}
                              </div>
                            )
                          }
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {servicos.map((servico) => (
                        <button
                          key={servico.id}
                          type="button"
                          aria-pressed={formData.servico_id === servico.id}
                          onClick={() => handleInputChange('servico_id', servico.id)}
                          className={cn(
                            "group relative flex min-h-[190px] flex-col overflow-hidden rounded-[1.75rem] border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 motion-reduce:transform-none",
                            formData.servico_id === servico.id
                              ? "border-primary bg-primary/[0.06] shadow-[0_18px_45px_-20px_rgba(var(--primary),0.5)] ring-2 ring-primary/15"
                              : "border-border/70 bg-card/75 shadow-sm hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-xl"
                          )}
                        >
                          <div className="mb-5 flex w-full items-start justify-between">
                            <div className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                              formData.servico_id === servico.id 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                            )}>
                              <Scissors className="h-5 w-5" />
                            </div>
                            {formData.servico_id === servico.id && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm animate-in zoom-in">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                                Selecionado
                              </span>
                            )}
                            {formData.servico_id !== servico.id && (
                              <span className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:text-primary">
                                Selecionar
                              </span>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col">
                            <h4 className="text-lg font-extrabold leading-tight text-foreground transition-colors group-hover:text-primary">
                              {servico.nome}
                            </h4>
                            <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
                              {configOnline.mostrar_precos && (
                                <div className="min-w-0">
                                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Investimento</span>
                                  <span className="text-xl font-black tracking-tight text-primary">
                                    R$ {servico.valor.toFixed(2)}
                                  </span>
                                </div>
                              )}
                              {configOnline.mostrar_duracao && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 px-3 py-2 text-xs font-semibold text-muted-foreground">
                                  <Timer className="h-4 w-4 text-primary" />
                                  {servico.duracao} min
                                </span>
                              )}
                            </div>
                          </div>
                          {formData.servico_id === servico.id && (
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-secondary" />
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.servico_id && (
                      <span className="text-xs text-destructive font-medium -mt-4 block">{errors.servico_id}</span>
                    )}

                    <div className="space-y-6 pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          Data e Horário
                        </h3>
                      </div>

                      <div className="space-y-8">
                        {/* Novo Seletor de Data Visual */}
                        <div className="space-y-4">
                          <Label className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-primary/70">
                            <Calendar className="w-4 h-4" />
                            Selecione o Dia
                          </Label>
                          
                          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide -mx-4 sm:mx-0 sm:px-0">
                            {Array.from({ length: 14 }).map((_, i) => {
                              const d = new Date();
                              d.setDate(d.getDate() + i);
                              const iso = d.toISOString().split('T')[0];
                              const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                              const diaMes = d.getDate();
                              const isAtivo = configuracoes.length === 0 ? true : isDiaAtivo(d.getDay());
                              const isSelected = formData.data === iso;

                              return (
                                <button
                                  key={iso}
                                  type="button"
                                  disabled={!isAtivo}
                                  onClick={() => handleInputChange('data', iso)}
                                  className={cn(
                                    "flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-3xl transition-all duration-300 border-2",
                                    !isAtivo 
                                      ? "opacity-30 grayscale cursor-not-allowed border-transparent"
                                      : isSelected
                                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 -translate-y-2 scale-110 border-b-8 active:translate-y-0 active:border-b-2"
                                      : "bg-white border-primary/10 text-foreground hover:border-primary/30 hover:-translate-y-1 border-b-4 active:translate-y-0 active:border-b-2"
                                  )}
                                >
                                  <span className={cn(
                                    "text-[10px] font-black uppercase tracking-tighter mb-1",
                                    isSelected ? "text-white/80" : "text-muted-foreground"
                                  )}>
                                    {diaSemana}
                                  </span>
                                  <span className="text-xl font-black">
                                    {diaMes}
                                  </span>
                                </button>
                              );
                            })}
                            
                            {/* Botão para abrir calendário manual */}
                            <div className="relative min-w-[70px] h-[90px]">
                              <Input
                                type="date"
                                min={dataMinima}
                                max={dataMaxima}
                                value={formData.data}
                                onChange={(e) => handleInputChange('data', e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              />
                              <div className="flex flex-col items-center justify-center h-full rounded-3xl border-2 border-dashed border-primary/30 text-primary/50 bg-primary/5">
                                <LayoutGrid className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-black uppercase">Mais</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Grade de Horários Modernizada */}
                        <div className="space-y-4">
                          <Label className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-primary/70">
                            <Clock className="w-4 h-4" />
                            Horários Disponíveis
                          </Label>
                          
                          {!formData.servico_id || !formData.data ? (
                            <div className="h-24 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                              <Scissors className="w-6 h-6 mb-2 opacity-20" />
                              <span className="text-xs font-bold uppercase tracking-tight">Escolha o serviço e a data primeiro</span>
                            </div>
                          ) : !isDataDisponivel(formData.data) ? (
                            <div className="h-24 rounded-[2rem] bg-destructive/5 border-2 border-destructive/10 flex flex-col items-center justify-center text-destructive p-4 text-center font-black uppercase tracking-tighter">
                              <AlertCircle className="w-6 h-6 mb-2" />
                              Salão fechado nesta data
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto p-2 pr-3 custom-scrollbar">
                              {horariosDisponiveis.map((h) => (
                                <button
                                  key={h.horario}
                                  type="button"
                                  disabled={!h.disponivel}
                                  onClick={() => handleInputChange('horario', h.horario)}
                                  className={cn(
                                    "h-12 rounded-2xl text-sm font-black transition-all duration-300 border-2 flex items-center justify-center",
                                    !h.disponivel 
                                      ? "bg-muted/30 border-transparent text-muted-foreground/30 cursor-not-allowed grayscale"
                                      : formData.horario === h.horario
                                      ? "bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-105 -translate-y-1 border-b-4 active:translate-y-0 active:border-b-0"
                                      : "bg-white border-primary/10 text-foreground hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 border-b-2 active:translate-y-0 active:border-b-0"
                                  )}
                                >
                                  {h.horario}
                                </button>
                              ))}
                              {horariosDisponiveis.length === 0 && (
                                <div className="col-span-full py-8 text-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                                  <Timer className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                  <span className="text-xs font-black uppercase">Sem horários para este dia</span>
                                  {horariosError && (
                                    <div className="mt-2 text-[10px] font-bold opacity-70">
                                      {horariosError}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {errors.horario && (
                            <span className="text-xs text-destructive font-black uppercase tracking-tighter block mt-2 ml-1">{errors.horario}</span>
                          )}
                        </div>
                      </div>

                      {formData.data && !isDataDisponivel(formData.data) && (
                        <Alert className="rounded-2xl border-amber-200 bg-amber-50 animate-in zoom-in-95 duration-200">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800 text-xs font-bold uppercase tracking-tight">
                            Este dia não atendemos. Por favor, escolha outra data.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-3">
                        <Label htmlFor="observacoes" className="text-sm font-bold flex items-center gap-2">
                          <Tag className="w-4 h-4 text-primary" />
                          Observações (opcional)
                        </Label>
                        <Textarea
                          id="observacoes"
                          value={formData.observacoes}
                          onChange={(e) => handleInputChange('observacoes', e.target.value)}
                          placeholder="Ex: Tenho alergia a algum produto, ou gostaria de um profissional específico."
                          rows={3}
                          className="rounded-2xl border-primary/10 bg-white/50 shadow-sm focus:shadow-lg transition-all duration-300 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Condições e Finalização */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-card/80 to-secondary/[0.12] p-5 shadow-sm sm:p-7">
                      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                      <div className="relative flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Etapa 3 de 3</p>
                          <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Revise e finalize</h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Confira os detalhes e confirme seu agendamento.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 shadow-lg shadow-foreground/5">
                      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Tudo certo?</p>
                          <h3 className="mt-1 text-lg font-extrabold">Resumo do agendamento</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Calendar className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
                        <div className="rounded-2xl bg-muted/50 p-4">
                          <p className="mb-1 text-xs font-semibold text-muted-foreground">Cliente</p>
                          <p className="truncate font-bold text-foreground">{formData.nome_completo || '—'}</p>
                          <p className="mt-1 truncate text-sm text-muted-foreground">{formData.telefone}</p>
                          <p className="truncate text-sm text-muted-foreground">{formData.email}</p>
                        </div>
                        <div className="rounded-2xl bg-muted/50 p-4">
                          <p className="mb-1 text-xs font-semibold text-muted-foreground">Serviço</p>
                          <p className="font-bold text-foreground">{servicoSelecionado?.nome || '—'}</p>
                          {configOnline.mostrar_duracao && servicoSelecionado && (
                            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Timer className="h-4 w-4 text-primary" /> {servicoSelecionado.duracao} minutos
                            </p>
                          )}
                        </div>
                        <div className="rounded-2xl bg-muted/50 p-4">
                          <p className="mb-1 text-xs font-semibold text-muted-foreground">Data e horário</p>
                          <p className="font-bold text-foreground">
                            {formData.data ? new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary" /> {formData.horario || '—'}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-primary/[0.06] p-4">
                          <p className="mb-1 text-xs font-semibold text-muted-foreground">Valor total</p>
                          <p className="text-2xl font-black tracking-tight text-primary">
                            R$ {valorTotal.toFixed(2).replace('.', ',')}
                          </p>
                          {produtoEnabled && produtoId && produtoSelecionado && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Serviço e {produtoQtd}× {produtoSelecionado.nome}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Produtos opcionais */}
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/75 p-5 shadow-sm sm:p-6">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBag className="w-12 h-12 text-primary" />
                      </div>

                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            Complemente seu atendimento
                          </h3>
                          <p className="text-sm text-muted-foreground">Deseja adicionar algum produto? Esta etapa é opcional.</p>
                        </div>
                        <Checkbox 
                          id="produtoEnabled"
                          checked={produtoEnabled}
                          onCheckedChange={(checked) => setProdutoEnabled(!!checked)}
                          className="h-6 w-6 rounded-lg border-primary/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                        />
                      </div>
                      
                      {produtoEnabled && (
                        <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1 pr-3 custom-scrollbar">
                            {produtos.map((p) => {
                              const isSelected = produtoId === p.id;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setProdutoId(isSelected ? '' : p.id)}
                                  className={cn(
                                    "flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden",
                                    isSelected
                                      ? "border-primary bg-primary/5 shadow-lg -translate-y-1 border-b-4 active:translate-y-0 active:border-b-0"
                                      : "border-primary/10 bg-white hover:border-primary/30 hover:-translate-y-1 border-b-2 active:translate-y-0 active:border-b-0"
                                  )}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className={cn(
                                      "p-2 rounded-xl",
                                      isSelected ? "bg-primary text-white" : "bg-primary/5 text-primary"
                                    )}>
                                      <Tag className="w-4 h-4" />
                                    </div>
                                    {isSelected && (
                                      <div className="bg-primary text-white p-1 rounded-full animate-in zoom-in">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="w-full aspect-video rounded-xl overflow-hidden mb-3 border border-primary/5 bg-primary/5 flex items-center justify-center">
                                    {p.imagem_url ? (
                                      <img 
                                        src={p.imagem_url} 
                                        alt={p.nome} 
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <ShoppingBag className="w-8 h-8 text-primary/20" />
                                    )}
                                  </div>

                                  <span className="font-bold text-sm text-foreground line-clamp-1">{p.nome}</span>
                                  <span className="text-primary font-black text-lg mt-1">R$ {Number(p.valor).toFixed(2)}</span>
                                  
                                  {isSelected && (
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-[2rem] -mr-4 -mt-4 rotate-45" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {produtoId && (
                            <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-300 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black text-primary uppercase ml-1">Quantidade</Label>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  value={produtoQtd} 
                                  onChange={(e) => setProdutoQtd(Math.max(1, Number(e.target.value)))}
                                  className="h-12 rounded-xl border-primary/10 bg-white font-black text-center shadow-inner"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black text-primary uppercase ml-1">Pagamento</Label>
                                <Select value={produtoForma} onValueChange={setProdutoForma}>
                                  <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-white font-black shadow-inner">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl shadow-2xl font-bold">
                                    <SelectItem value="pix">PIX</SelectItem>
                                    <SelectItem value="cartao">CARTÃO</SelectItem>
                                    <SelectItem value="dinheiro">DINHEIRO</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Condições e Termos */}
                    <div className="space-y-4">
                      {configOnline.taxa_sinal_percentual > 0 && (
                        <div className={`rounded-[1.5rem] border p-5 transition-colors ${taxaAccepted ? 'border-amber-300 bg-amber-50/80 ring-2 ring-amber-200/60' : 'border-amber-200 bg-amber-50/50'}`}>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-amber-950">Taxa para garantir o horário</h4>
                              <p className="text-xs font-medium text-amber-800">Leia as condições antes de confirmar</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-white/70 p-4">
                            <Checkbox
                              id="taxa"
                              checked={taxaAccepted}
                              onCheckedChange={(checked) => setTaxaAccepted(checked as boolean)}
                              className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-amber-300 data-[state=checked]:bg-amber-600"
                            />
                            <Label htmlFor="taxa" className="cursor-pointer text-sm font-normal leading-relaxed text-amber-950">
                              Oi, tudo bem? 💙 Para garantir seu horário pedimos uma taxa antecipada de {configOnline.taxa_sinal_percentual}%. 
                              Esse valor é abatido no dia do atendimento. 
                              Não devolvemos em caso de cancelamento sem justificativa. *
                            </Label>
                          </div>
                        </div>
                      )}

                      <div
                        className={`flex cursor-pointer items-start gap-3 rounded-[1.5rem] border p-5 transition-colors ${
                          termsAccepted ? 'border-primary/40 bg-primary/[0.06] ring-2 ring-primary/10' : 'border-border bg-card/70 hover:border-primary/25'
                        }`}
                      >
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                          className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-primary/30"
                        />
                        <Label htmlFor="terms" className="cursor-pointer text-sm font-medium leading-relaxed text-foreground">
                          {configOnline.termos_condicoes || 'Aceito os termos e concordo em receber confirmações por WhatsApp *'}
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1 h-14 rounded-2xl border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all shadow-sm active:scale-95"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Voltar
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button 
                      type="button"
                      onClick={handleNextStep}
                      className={`flex-1 h-14 font-bold transition-all active:translate-y-[1px] active:shadow-none ${buttonAnimationClass}`}
                      style={{ ...resolvedButtonStyle, borderRadius: buttonRadius, boxShadow: buttonShadowStyle }}
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className={`flex-1 h-14 font-bold shadow-lg transition-all active:translate-y-[1px] active:shadow-none ${buttonAnimationClass} ${
                        isSubmitting || !termsAccepted || (configOnline.taxa_sinal_percentual > 0 && !taxaAccepted)
                        ? 'bg-muted cursor-not-allowed' 
                        : 'text-white hover:shadow-xl hover:translate-y-[-2px]'
                      }`}
                      style={{
                        ...( !isSubmitting && termsAccepted && (configOnline.taxa_sinal_percentual <= 0 || taxaAccepted)
                          ? resolvedButtonStyle
                          : {}),
                        borderRadius: buttonRadius,
                        boxShadow: !isSubmitting && termsAccepted && (configOnline.taxa_sinal_percentual <= 0 || taxaAccepted)
                          ? buttonShadowStyle
                          : undefined,
                      }}
                      disabled={isSubmitting || !termsAccepted || (configOnline.taxa_sinal_percentual > 0 && !taxaAccepted)}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processando...
                        </div>
                      ) : (
                        'Confirmar Agendamento'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <SalonFooter config={configOnline} />
    </div>
  );
}
