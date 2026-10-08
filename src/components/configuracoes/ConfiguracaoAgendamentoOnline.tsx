/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState as useStateReact } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Store, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, DollarSign, Clock, FileText, Image, Upload, X, Palette, Eye, Layout, Loader2, QrCode, Copy, ExternalLink, Share2, Sparkles } from 'lucide-react';
import { useConfigAgendamentoOnline, ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';
import { buildPublicBookingLink } from '@/lib/utils';
import { bookingThemePresets, getBookingPageBackground } from '@/lib/agendamento-online-themes';
import type { BookingThemeId } from '@/lib/agendamento-online-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MAX_GALLERY_UPLOAD_SIZE = 2 * 1024 * 1024;
const MAX_GALLERY_SOURCE_SIZE = 20 * 1024 * 1024;

async function prepareGalleryImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecione apenas arquivos de imagem.');
  }
  if (file.size > MAX_GALLERY_SOURCE_SIZE) {
    throw new Error('Cada imagem original deve ter no máximo 20 MB.');
  }
  if (file.size <= MAX_GALLERY_UPLOAD_SIZE) return file;

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível preparar a imagem neste navegador.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const quality = Math.max(0.48, 0.84 - attempt * 0.08);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', quality));
      if (!blob) throw new Error('Não foi possível comprimir a imagem.');
      if (blob.size <= MAX_GALLERY_UPLOAD_SIZE) {
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'foto';
        return new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() });
      }
      canvas.width = Math.max(1, Math.round(canvas.width * 0.8));
      canvas.height = Math.max(1, Math.round(canvas.height * 0.8));
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    }
  } finally {
    bitmap.close();
  }

  throw new Error(`A imagem "${file.name}" não pôde ser reduzida para menos de 2 MB.`);
}

export function ConfiguracaoAgendamentoOnline() {
  const { config, loading, saving, setConfig, salvarConfig } = useConfigAgendamentoOnline();
  const [uploadingLogo, setUploadingLogo] = useStateReact(false);
  const [uploadingBanner, setUploadingBanner] = useStateReact(false);
  const [uploadingGallery, setUploadingGallery] = useStateReact(false);
  const [previewLogoUrl, setPreviewLogoUrl] = useStateReact<string | null>(null);
  const [previewBannerUrl, setPreviewBannerUrl] = useStateReact<string | null>(null);

  const handleChange = (field: keyof ConfigAgendamentoOnline, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await salvarConfig(config);
  };

  const backgroundStyle = config.estilo_fundo || 'aurora';
  const backgroundColor = config.cor_fundo || '#F5F3FF';
  const secondaryBackgroundColor = config.cor_fundo_secundaria || '#FDF2F8';
  const primaryColor = config.cor_primaria || '#8B5CF6';
  const secondaryColor = config.cor_secundaria || '#F5D0FE';
  const visualMode = config.tema_formulario || 'claro';
  const cardStyle = config.estilo_card || 'premium';
  const buttonStyle = config.estilo_botao || 'gradiente';
  const buttonAnimation = config.animacao_botao || 'lift';
  const buttonShadow = config.sombra_botao || 'media';
  const formFont = config.fonte_personalizada || 'Inter, Segoe UI, sans-serif';
  const buttonRadius = Math.min(40, Math.max(12, config.raio_botoes ?? 22));
  const previewBackground = getBookingPageBackground(
    backgroundStyle,
    backgroundColor,
    secondaryBackgroundColor,
    primaryColor,
    visualMode,
  );
  const darkVisualMode = visualMode === 'escuro';
  const cardColor = config.card_background || (darkVisualMode ? '#111827' : visualMode === 'neutro' ? '#FFFCF7' : '#FFFFFF');
  const previewCardBackground = cardStyle === 'glass'
      ? `color-mix(in srgb, ${cardColor} 78%, transparent)`
      : cardStyle === 'soft'
        ? cardColor
        : cardStyle === 'minimal'
          ? 'transparent'
          : cardColor;
  const previewCardShadow = cardStyle === 'minimal'
    ? 'none'
    : cardStyle === 'bordered'
      ? `0 0 0 1px ${primaryColor}44`
      : `0 12px 28px ${primaryColor}1A`;
  const previewShadow = {
    none: 'none',
    suave: '0 6px 16px rgba(15,23,42,0.08)',
    media: `0 14px 28px ${primaryColor}22`,
    forte: `0 22px 44px ${primaryColor}38`,
    colorida: `0 12px 32px ${primaryColor}55`,
  }[buttonShadow];
  const previewButtonBackground = buttonStyle === 'outline' || buttonStyle === 'minimal'
    ? 'transparent'
    : buttonStyle === 'sólido'
      ? primaryColor
      : buttonStyle === 'glass'
        ? `${primaryColor}22`
        : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
  const previewButtonForeground = buttonStyle === 'outline' || buttonStyle === 'minimal'
    ? primaryColor
    : buttonStyle === 'glass'
      ? (visualMode === 'escuro' ? '#F8FAFC' : primaryColor)
      : config.cor_texto_botao || '#FFFFFF';
  const previewButtonAnimation = {
    lift: 'transition-transform duration-200 hover:-translate-y-1',
    pulse: 'animate-pulse motion-reduce:animate-none',
    shine: 'transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(255,255,255,0.55)]',
    none: '',
    scale: 'transition-transform duration-200 hover:scale-[1.03]',
    glow: 'transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.45)]',
  }[buttonAnimation];

  const applyBookingTheme = (themeId: BookingThemeId) => {
    const preset = bookingThemePresets.find(theme => theme.id === themeId);
    if (!preset) return;
    setConfig(prev => ({ ...prev, ...preset.settings, tema_preset: preset.id }));
    toast.success(`Tema "${preset.name}" aplicado. Salve para publicar as alterações.`);
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    const remaining = 8 - (config.galeria_urls?.length || 0);
    if (files.length > remaining) {
      toast.error(`A galeria permite até 8 fotos. Você ainda pode adicionar ${remaining}.`);
      return;
    }
    if (files.some(file => !file.type.startsWith('image/'))) {
      toast.error('Selecione apenas arquivos de imagem.');
      return;
    }
    if (files.some(file => file.size > MAX_GALLERY_SOURCE_SIZE)) {
      toast.error('Cada imagem original deve ter no máximo 20 MB.');
      return;
    }

    setUploadingGallery(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const preparedFile = await prepareGalleryImage(file);
        const extension = preparedFile.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'webp';
        const fileName = `${user.id}/gallery/${Date.now()}-${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage.from('salon-logos').upload(fileName, preparedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: preparedFile.type,
        });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('salon-logos').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }

      handleChange('galeria_urls', [...(config.galeria_urls || []), ...uploadedUrls]);
      toast.success('Fotos adicionadas à galeria. Salve para publicar.');
    } catch (error) {
      console.error('Erro ao enviar fotos da galeria:', error);
      toast.error(error instanceof Error ? error.message : 'Não foi possível enviar as fotos da galeria.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB');
        return;
      }

      if (type === 'logo') setUploadingLogo(true);
      else setUploadingBanner(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const currentUrl = type === 'logo' ? config.logo_url : config.banner_url;
      if (currentUrl && currentUrl.includes('salon-logos')) {
        const oldPath = currentUrl.split('/salon-logos/')[1];
        if (oldPath) {
          await supabase.storage.from('salon-logos').remove([oldPath]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('salon-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('salon-logos')
        .getPublicUrl(fileName);

      if (type === 'logo') {
        handleChange('logo_url', publicUrl);
        setPreviewLogoUrl(publicUrl);
        toast.success('Logo atualizada!');
      } else {
        handleChange('banner_url', publicUrl);
        setPreviewBannerUrl(publicUrl);
        toast.success('Banner atualizado!');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  const handleRemoveImage = async (type: 'logo' | 'banner') => {
    try {
      const currentUrl = type === 'logo' ? config.logo_url : config.banner_url;
      if (currentUrl && currentUrl.includes('salon-logos')) {
        const oldPath = currentUrl.split('/salon-logos/')[1];
        if (oldPath) {
          await supabase.storage.from('salon-logos').remove([oldPath]);
        }
      }
      if (type === 'logo') {
        handleChange('logo_url', '');
        setPreviewLogoUrl(null);
      } else {
        handleChange('banner_url', '');
        setPreviewBannerUrl(null);
      }
      toast.success('Imagem removida');
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast.error('Erro ao remover imagem');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28 sm:space-y-6 sm:pb-0">
      <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-card to-secondary/[0.12] p-4 sm:rounded-[1.75rem] sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.18em]">Sua página pública</p>
            <h2 className="mt-1 text-xl font-black leading-tight tracking-tight sm:text-2xl">Personalize seu agendamento online</h2>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Edite cada seção e salve para publicar as alterações.
            </p>
          </div>
          <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
            config.ativo
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
              : 'border-muted bg-muted text-muted-foreground'
          }`}>
            <span className={`h-2 w-2 rounded-full ${config.ativo ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
            {config.ativo ? 'Página ativa' : 'Página pausada'}
          </span>
        </div>
      </div>

      {/* Ativação */}
      <Card className="border-primary/10">
        <CardHeader className="p-4 pb-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Store className="h-5 w-5 shrink-0 text-primary" />
            Agendamento online
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Controle se seus clientes podem agendar pelo link público.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3 sm:p-4">
            <div className="space-y-0.5">
              <Label htmlFor="ativo" className="text-sm font-bold sm:text-base">Página de agendamento</Label>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {config.ativo ? 'Seus clientes podem agendar pelo link.' : 'Ative para receber agendamentos online.'}
              </p>
            </div>
            <Switch
              id="ativo"
              checked={config.ativo}
              onCheckedChange={(checked) => handleChange('ativo', checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="aparencia" className="space-y-4 sm:space-y-5">
        <div className="sticky top-1 z-30 -mx-1 rounded-2xl border border-border/70 bg-background/90 p-1.5 shadow-sm backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <TabsList className="grid h-auto grid-cols-3 gap-1 rounded-xl border-0 bg-muted/70 p-1 sm:rounded-2xl sm:border sm:border-border/70 sm:p-1.5">
          <TabsTrigger value="aparencia" className="min-h-[52px] flex-col gap-1 rounded-lg px-1 py-1.5 text-[10px] font-bold leading-tight sm:min-h-12 sm:flex-row sm:gap-0 sm:rounded-xl sm:px-2 sm:text-sm">
            <Palette className="h-4 w-4 shrink-0 sm:mr-1.5" />
            <span>Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="pagina" className="min-h-[52px] flex-col gap-1 rounded-lg px-1 py-1.5 text-[10px] font-bold leading-tight sm:min-h-12 sm:flex-row sm:gap-0 sm:rounded-xl sm:px-2 sm:text-sm">
            <Store className="h-4 w-4 shrink-0 sm:mr-1.5" />
            <span>Página e contato</span>
          </TabsTrigger>
          <TabsTrigger value="regras" className="min-h-[52px] flex-col gap-1 rounded-lg px-1 py-1.5 text-[10px] font-bold leading-tight sm:min-h-12 sm:flex-row sm:gap-0 sm:rounded-xl sm:px-2 sm:text-sm">
            <Clock className="h-4 w-4 shrink-0 sm:mr-1.5" />
            <span>Regras</span>
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="aparencia" className="mt-0 space-y-3 scroll-mt-24 sm:space-y-4">
      {/* Visual e Personalização */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Visual e Personalização
          </CardTitle>
          <CardDescription>
            Escolha um tema da sua área e personalize os detalhes do formulário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 sm:space-y-8">
          <div className="space-y-5 rounded-2xl border border-primary/10 bg-muted/20 p-3 sm:space-y-6 sm:p-5">
            <div className="space-y-3 md:col-span-2">
              <div>
                <Label className="font-bold">Galeria de fotos</Label>
                <p className="mt-1 text-sm text-muted-foreground">Adicione até 8 imagens (máximo 20 MB cada). Imagens maiores que 2 MB são comprimidas automaticamente.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(config.galeria_urls || []).map((url, index) => (
                  <div key={`${url}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                    <img src={url} alt={`Foto da galeria ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label={`Remover foto ${index + 1}`}
                      onClick={() => handleChange('galeria_urls', (config.galeria_urls || []).filter((_, photoIndex) => photoIndex !== index))}
                      className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(config.galeria_urls?.length || 0) < 8 && (
                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
                    {uploadingGallery ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                    {uploadingGallery ? 'Enviando...' : 'Adicionar fotos'}
                    <input type="file" accept="image/*" multiple disabled={uploadingGallery} onChange={handleGalleryUpload} className="sr-only" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="font-bold">Estilo do fundo</Label>
                <p className="mt-1 text-sm text-muted-foreground">Escolha uma base elegante. As cores abaixo atualizam a prévia na hora.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Estilo do fundo">
                {([
                  { id: 'aurora', name: 'Aurora', detail: 'Camadas suaves e luminosas' },
                  { id: 'gradient', name: 'Gradiente', detail: 'Transição entre as duas cores' },
                  { id: 'solid', name: 'Cor sólida', detail: 'Visual limpo e minimalista' },
                  { id: 'glow', name: 'Luz ambiente', detail: 'Pontos de luz com a cor da marca' },
                ] as const).map(option => {
                  const selected = backgroundStyle === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleChange('estilo_fundo', option.id)}
                      className={`overflow-hidden rounded-2xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        selected ? 'border-primary bg-primary/[0.04] shadow-md shadow-primary/10' : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <span className="block h-16 border-b border-border/60" style={{ background: getBookingPageBackground(option.id, backgroundColor, secondaryBackgroundColor, primaryColor, config.tema_formulario || 'claro') }} />
                      <span className="block p-3">
                        <span className="flex items-center justify-between gap-2 text-sm font-bold">
                          {option.name}
                          {selected && <span className="text-xs font-semibold text-primary">Selecionado</span>}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="font-bold">Efeitos visuais</Label>
                <p className="mt-1 text-sm text-muted-foreground">Detalhes discretos para dar profundidade sem competir com seu conteúdo.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Efeitos visuais">
                {([
                  { id: 'none', name: 'Essencial', detail: 'Sem movimento ou brilho' },
                  { id: 'glow', name: 'Brilho ambiente', detail: 'Luz suave nos destaques' },
                  { id: 'float', name: 'Elevação sutil', detail: 'Cards respondem ao passar do mouse' },
                ] as const).map(option => {
                  const selected = (config.efeito_visual || 'glow') === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleChange('efeito_visual', option.id)}
                      className={`flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        selected ? 'border-primary bg-primary/[0.04] shadow-sm' : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <span className={`mt-1 flex h-3 w-3 shrink-0 rounded-full border ${selected ? 'border-primary bg-primary ring-4 ring-primary/10' : 'border-muted-foreground/40'}`} />
                      <span>
                        <span className="block text-sm font-bold">{option.name}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                  <div>
                    <Label htmlFor="cor_fundo" className="font-bold">Cor principal do fundo</Label>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Base da página e áreas de respiro.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input id="cor_fundo" aria-label="Selecionar cor principal do fundo" type="color" value={backgroundColor} onChange={(e) => handleChange('cor_fundo', e.target.value)} className="h-12 w-14 shrink-0 cursor-pointer rounded-xl p-1" />
                    <Input aria-label="Código hexadecimal da cor principal" value={backgroundColor} onChange={(e) => handleChange('cor_fundo', e.target.value)} className="font-mono uppercase" />
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                  <div>
                    <Label htmlFor="cor_fundo_secundaria" className="font-bold">Cor complementar do fundo</Label>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Acentos usados em transições e luzes.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input id="cor_fundo_secundaria" aria-label="Selecionar cor complementar do fundo" type="color" value={secondaryBackgroundColor} onChange={(e) => handleChange('cor_fundo_secundaria', e.target.value)} className="h-12 w-14 shrink-0 cursor-pointer rounded-xl p-1" />
                    <Input aria-label="Código hexadecimal da cor complementar" value={secondaryBackgroundColor} onChange={(e) => handleChange('cor_fundo_secundaria', e.target.value)} className="font-mono uppercase" />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold">Prévia da composição</p>
                    <p className="text-xs text-muted-foreground">Atualizada enquanto personaliza</p>
                  </div>
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div className="min-h-36 p-4 transition-[background] duration-500" style={{ background: previewBackground }}>
                  <div className={`mx-auto max-w-xs rounded-2xl border p-4 transition-all duration-300 ${
                    config.efeito_visual === 'glow' ? 'border-white/70 shadow-[0_10px_35px_rgba(139,92,246,0.2)]' : 'border-white/70 shadow-lg'
                  } ${config.efeito_visual === 'float' ? 'hover:-translate-y-1' : ''}`}
                    style={{ backgroundColor: config.card_background || (config.tema_formulario === 'escuro' ? '#111827' : '#FFFFFF') }}
                  >
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Agendamento online</span>
                    <span className="block text-sm font-bold">Um cuidado especial, no seu tempo.</span>
                    <span className="mt-3 inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                      Escolher horário
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo e Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 font-bold">
                <Image className="h-4 w-4" />
                Logo/Foto Circular
              </Label>
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/10 rounded-2xl bg-muted/30">
                {(config.logo_url || previewLogoUrl) ? (
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={previewLogoUrl || config.logo_url}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('logo')}
                      className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border-4 border-white shadow-inner">
                    <Store className="h-10 w-10 text-primary/20" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="rounded-full px-6"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingLogo ? 'Enviando...' : 'Trocar Logo'}
                </Button>
                <input id="logo-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" />
              </div>
            </div>

            {/* Banner */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 font-bold">
                <Layout className="h-4 w-4" />
                Imagem de Capa (Banner)
              </Label>
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/10 rounded-2xl bg-muted/30">
                {(config.banner_url || previewBannerUrl) ? (
                  <div className="relative group w-full">
                    <div className="w-full h-24 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={previewBannerUrl || config.banner_url}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('banner')}
                      className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-24 rounded-xl bg-primary/5 flex items-center justify-center border-4 border-white shadow-inner">
                    <Image className="h-10 w-10 text-primary/20" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingBanner}
                  onClick={() => document.getElementById('banner-upload')?.click()}
                  className="rounded-full px-6"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingBanner ? 'Enviando...' : 'Trocar Capa'}
                </Button>
                <input id="banner-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-primary/10 bg-muted/20 p-4">
            <div>
              <Label htmlFor="tema_preset" className="font-bold">Temas por área</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Cada tema aplica cores, fonte, cards, botões e animação. Seus dados, logo e serviços não serão alterados.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bookingThemePresets.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => applyBookingTheme(theme.id)}
                  aria-pressed={config.tema_preset === theme.id}
                  className={`rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    config.tema_preset === theme.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  <span className="mb-2 flex gap-2" aria-hidden="true">
                    {theme.colors.map(color => (
                      <span key={color} className="h-5 w-5 rounded-full border" style={{ backgroundColor: color }} />
                    ))}
                  </span>
                  <span className="block font-semibold">{theme.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{theme.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-7 border-t border-border/70 pt-7">
            <div>
              <h3 className="text-lg font-black tracking-tight">Identidade visual do formulário</h3>
              <p className="mt-1 text-sm text-muted-foreground">Ajuste cores, superfícies e tipografia com uma prévia que acompanha suas escolhas.</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold">Paletas de cores sugeridas</h4>
                <p className="mt-1 text-xs text-muted-foreground">Use uma combinação pronta como ponto de partida ou personalize cada cor abaixo.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  { name: 'Lavanda', primary: '#8B5CF6', secondary: '#F5D0FE' },
                  { name: 'Rosé', primary: '#C24170', secondary: '#FBCFE8' },
                  { name: 'Nude', primary: '#8A5A44', secondary: '#EAD8C8' },
                  { name: 'Oliva', primary: '#556B2F', secondary: '#DDE6C8' },
                  { name: 'Oceano', primary: '#256A86', secondary: '#B8E0EA' },
                  { name: 'Grafite e cobre', primary: '#B7793E', secondary: '#334155' },
                ] as const).map(palette => {
                  const selected = primaryColor.toLowerCase() === palette.primary.toLowerCase()
                    && secondaryColor.toLowerCase() === palette.secondary.toLowerCase();
                  return (
                    <button
                      key={palette.name}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setConfig(prev => ({ ...prev, cor_primaria: palette.primary, cor_secundaria: palette.secondary }))}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                        selected ? 'border-primary bg-primary/[0.05]' : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <span className="flex -space-x-1.5" aria-hidden="true">
                        <span className="h-4 w-4 rounded-full border border-white" style={{ backgroundColor: palette.primary }} />
                        <span className="h-4 w-4 rounded-full border border-white" style={{ backgroundColor: palette.secondary }} />
                      </span>
                      {palette.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {([
                { key: 'cor_primaria', label: 'Cor de destaque', hint: 'Realça ações, títulos e detalhes da marca.', value: primaryColor },
                { key: 'cor_secundaria', label: 'Cor secundária', hint: 'Complementa gradientes e áreas de apoio.', value: secondaryColor },
              ] as const).map(color => (
                <div key={color.key} className="space-y-3 rounded-2xl border border-border bg-background p-4">
                  <div>
                    <Label htmlFor={color.key} className="font-bold">{color.label}</Label>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{color.hint}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      id={color.key}
                      aria-label={`Selecionar ${color.label.toLowerCase()}`}
                      type="color"
                      value={color.value}
                      onChange={(e) => handleChange(color.key, e.target.value)}
                      className="h-12 w-14 shrink-0 cursor-pointer rounded-xl p-1"
                    />
                    <Input
                      aria-label={`Código hexadecimal ${color.label.toLowerCase()}`}
                      value={color.value}
                      onChange={(e) => handleChange(color.key, e.target.value)}
                      className="font-mono uppercase"
                    />
                    <span className="h-9 w-9 shrink-0 rounded-xl border border-black/10 shadow-inner" style={{ backgroundColor: color.value }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <Label className="font-bold">Tema visual</Label>
                <p className="mt-1 text-sm text-muted-foreground">Escolha a atmosfera geral do formulário.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Tema visual">
                {([
                  { id: 'claro', name: 'Claro', detail: 'Leve, arejado e com leitura confortável.', surface: '#F8FAFC', card: '#FFFFFF', text: '#1E293B' },
                  { id: 'escuro', name: 'Escuro', detail: 'Sofisticado, profundo e aconchegante.', surface: '#0F172A', card: '#1E293B', text: '#F8FAFC' },
                  { id: 'neutro', name: 'Neutro', detail: 'Tons naturais e discretos.', surface: '#F5F0E8', card: '#FFFCF7', text: '#3D352D' },
                  { id: 'alto-contraste', name: 'Alto contraste', detail: 'Texto e superfícies com contraste reforçado.', surface: '#FFFFFF', card: '#FFFFFF', text: '#000000' },
                ] as const).map(option => {
                  const selected = visualMode === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setConfig(prev => ({
                        ...prev,
                        tema_formulario: option.id,
                        cor_fundo: option.id === 'escuro' ? '#0F172A' : option.id === 'neutro' ? '#F5F0E8' : option.id === 'alto-contraste' ? '#FFFFFF' : '#F5F3FF',
                        cor_fundo_secundaria: option.id === 'escuro' ? '#1E293B' : option.id === 'neutro' ? '#E8DDCE' : option.id === 'alto-contraste' ? '#F1F5F9' : '#FDF2F8',
                        card_background: option.card,
                      }))}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        selected ? 'border-primary bg-primary/[0.04] shadow-sm' : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border p-2 shadow-sm" style={{ backgroundColor: option.surface, borderColor: `${primaryColor}30` }}>
                        <span className="flex h-full w-full items-center justify-center rounded-lg text-[9px] font-bold" style={{ backgroundColor: option.card, color: option.text }}>Aa</span>
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{option.name}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
              <div>
                <Label htmlFor="card_background" className="font-bold">Cor da superfície dos cards</Label>
                <p className="mt-1 text-xs text-muted-foreground">Personalize o fundo dos cartões, mantendo o acabamento escolhido.</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="card_background"
                  type="color"
                  value={cardColor}
                  onChange={(e) => handleChange('card_background', e.target.value)}
                  className="h-12 w-14 shrink-0 cursor-pointer rounded-xl p-1"
                />
                <Input
                  aria-label="Código hexadecimal da cor da superfície dos cards"
                  value={cardColor}
                  onChange={(e) => handleChange('card_background', e.target.value)}
                  className="min-w-0 flex-1 font-mono uppercase"
                />
                <span className="h-9 w-9 rounded-xl border border-black/10 shadow-inner" style={{ backgroundColor: cardColor }} />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="font-bold">Estilo do card</Label>
                <p className="mt-1 text-sm text-muted-foreground">Defina o acabamento dos blocos de serviço e agendamento.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Estilo do card">
                {([
                  { id: 'premium', name: 'Premium', detail: 'Superfície sólida e elegante', classes: 'border border-primary/15 shadow-lg' },
                  { id: 'glass', name: 'Vidro', detail: 'Transparência com desfoque', classes: 'border border-white/60 shadow-md backdrop-blur-sm' },
                  { id: 'soft', name: 'Suave', detail: 'Fundo delicado e acolhedor', classes: 'border border-transparent shadow-sm' },
                  { id: 'minimal', name: 'Minimalista', detail: 'Limpo e sem sombra', classes: 'border border-transparent' },
                  { id: 'bordered', name: 'Contornado', detail: 'Borda definida e nítida', classes: 'border-2 border-primary/30' },
                ] as const).map(option => {
                  const selected = cardStyle === option.id;
                  const sampleBackground = option.id === 'glass'
                    ? (darkVisualMode ? 'rgba(15,23,42,0.78)' : 'rgba(255,255,255,0.78)')
                    : option.id === 'soft'
                      ? (darkVisualMode ? '#0f172a' : '#f8f5ff')
                      : option.id === 'minimal'
                        ? (darkVisualMode ? '#111827' : 'transparent')
                        : (darkVisualMode ? '#111827' : '#ffffff');
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleChange('estilo_card', option.id)}
                      className={`rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        selected ? 'border-primary bg-primary/[0.04] shadow-sm' : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <span className="mb-3 flex h-16 items-center rounded-xl p-2" style={{ background: previewBackground }}>
                        <span className={`w-full rounded-lg p-2 ${option.classes}`} style={{                         background: sampleBackground, color: darkVisualMode ? '#F8FAFC' : '#1E293B' }}>
                          <span className="block h-1.5 w-1/2 rounded-full" style={{ backgroundColor: primaryColor }} />
                          <span className="mt-2 block h-1 w-3/4 rounded-full bg-current opacity-20" />
                        </span>
                      </span>
                      <span className="block text-sm font-bold">{option.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{option.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="font-bold">Fonte do formulário</Label>
                <p className="mt-1 text-sm text-muted-foreground">Veja o desenho da tipografia antes de aplicar.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Fonte do formulário">
                {([
                  { value: 'Inter, Segoe UI, sans-serif', name: 'Inter', detail: 'Neutra e muito legível' },
                  { value: "'Poppins', 'Segoe UI', sans-serif", name: 'Poppins', detail: 'Geométrica e amigável' },
                  { value: "'Montserrat', 'Segoe UI', sans-serif", name: 'Montserrat', detail: 'Moderna e expressiva' },
                  { value: "'Playfair Display', Georgia, serif", name: 'Playfair Display', detail: 'Elegante e editorial' },
                  { value: "'Manrope', 'Segoe UI', sans-serif", name: 'Manrope', detail: 'Contemporânea e refinada' },
                  { value: "'DM Sans', 'Segoe UI', sans-serif", name: 'DM Sans', detail: 'Versátil e atual' },
                  { value: "'Lato', 'Segoe UI', sans-serif", name: 'Lato', detail: 'Leve e acolhedora' },
                  { value: "'Nunito Sans', 'Segoe UI', sans-serif", name: 'Nunito Sans', detail: 'Amigável e arredondada' },
                ] as const).map(option => {
                  const selected = formFont === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleChange('fonte_personalizada', option.value)}
                      className={`rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        selected ? 'border-primary bg-primary/[0.04] shadow-sm' : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <span className="block text-lg font-bold" style={{ fontFamily: option.value }}>Aa</span>
                      <span className="mt-1 block text-sm font-bold">{option.name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{option.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label htmlFor="raio_botoes" className="font-bold">Raio dos botões</Label>
                    <p className="mt-1 text-xs text-muted-foreground">De cantos definidos a arredondados.</p>
                  </div>
                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">{buttonRadius}px</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: 12, label: 'Definido' },
                    { value: 18, label: 'Suave' },
                    { value: 26, label: 'Arredondado' },
                    { value: 36, label: 'Pílula' },
                  ] as const).map(option => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={buttonRadius === option.value}
                      onClick={() => handleChange('raio_botoes', option.value)}
                      className={`min-h-11 rounded-full border px-3 py-2 text-xs font-semibold ${
                        buttonRadius === option.value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <input
                  id="raio_botoes"
                  type="range"
                  min={12}
                  max={40}
                  step={1}
                  value={buttonRadius}
                  onChange={(e) => handleChange('raio_botoes', Number(e.target.value))}
                  aria-label="Raio dos botões"
                  className="h-2 w-full cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground"><span>Discreto</span><span>Arredondado</span></div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                <div>
                  <Label className="font-bold">Animação dos botões</Label>
                  <p className="mt-1 text-xs text-muted-foreground">Interações suaves para ações importantes.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Animação dos botões">
                  {([
                    { id: 'lift', name: 'Elevação', detail: 'Move ao passar' },
                    { id: 'pulse', name: 'Pulso', detail: 'Ênfase contínua' },
                    { id: 'shine', name: 'Brilho', detail: 'Reflexo ao passar' },
                    { id: 'scale', name: 'Escala', detail: 'Amplia ao passar' },
                    { id: 'glow', name: 'Halo', detail: 'Aro de luz ao passar' },
                    { id: 'none', name: 'Sem animação', detail: 'Movimento reduzido' },
                  ] as const).map(option => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={buttonAnimation === option.id}
                      onClick={() => handleChange('animacao_botao', option.id)}
                      className={`min-h-12 rounded-xl border px-3 py-2 text-left transition-colors ${
                        buttonAnimation === option.id ? 'border-primary bg-primary/[0.05]' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="block text-xs font-bold">{option.name}</span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">{option.detail}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                <div>
                  <Label className="font-bold">Sombra dos botões</Label>
                  <p className="mt-1 text-xs text-muted-foreground">Ajuste a profundidade sem pesar no layout.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" role="group" aria-label="Sombra dos botões">
                  {([
                    { id: 'none', name: 'Sem sombra' },
                    { id: 'suave', name: 'Suave' },
                    { id: 'media', name: 'Média' },
                    { id: 'forte', name: 'Marcante' },
                    { id: 'colorida', name: 'Colorida' },
                  ] as const).map(option => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={buttonShadow === option.id}
                      onClick={() => handleChange('sombra_botao', option.id)}
                      className={`rounded-xl border p-3 text-center transition-colors ${
                        buttonShadow === option.id ? 'border-primary bg-primary/[0.05]' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="mx-auto mb-3 block h-7 w-12 rounded-lg bg-background" style={{ boxShadow: {
                        none: 'none',
                        suave: '0 3px 8px rgba(15,23,42,0.12)',
                        media: '0 7px 14px rgba(15,23,42,0.2)',
                        forte: '0 12px 20px rgba(15,23,42,0.28)',
                        colorida: `0 8px 20px ${primaryColor}66`,
                      }[option.id] }} />
                      <span className="text-xs font-bold">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                <div>
                  <Label className="font-bold">Visual do botão</Label>
                  <p className="mt-1 text-xs text-muted-foreground">Escolha como as ações principais aparecem.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" role="group" aria-label="Visual do botão">
                  {([
                    { id: 'gradiente', name: 'Gradiente' },
                    { id: 'sólido', name: 'Sólido' },
                    { id: 'outline', name: 'Contorno' },
                    { id: 'glass', name: 'Vidro' },
                    { id: 'minimal', name: 'Minimalista' },
                  ] as const).map(option => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={buttonStyle === option.id}
                      onClick={() => handleChange('estilo_botao', option.id)}
                      className={`rounded-xl border p-3 text-center transition-colors ${
                        buttonStyle === option.id ? 'border-primary bg-primary/[0.05]' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="mx-auto mb-3 flex h-8 w-full items-center justify-center rounded-lg text-[9px] font-bold" style={{
                        background: option.id === 'outline' || option.id === 'minimal' ? 'transparent' : option.id === 'sólido' ? primaryColor : option.id === 'glass' ? `${primaryColor}22` : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        border: option.id === 'outline' ? `1.5px solid ${primaryColor}` : option.id === 'glass' ? `1px solid ${primaryColor}55` : 'none',
                        color: option.id === 'outline' || option.id === 'minimal' || option.id === 'glass' ? primaryColor : (config.cor_texto_botao || '#FFFFFF'),
                        borderRadius: `${buttonRadius}px`,
                      }}>Agendar</span>
                      <span className="text-xs font-bold">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
              <div>
                <Label htmlFor="cor_texto_botao" className="font-bold">Cor do texto dos botões</Label>
                <p className="mt-1 text-xs text-muted-foreground">Ajuste o contraste dos rótulos em botões sólidos e gradientes.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="cor_texto_botao"
                  type="color"
                  value={config.cor_texto_botao || '#FFFFFF'}
                  onChange={(e) => handleChange('cor_texto_botao', e.target.value)}
                  className="h-12 w-14 shrink-0 cursor-pointer rounded-xl p-1"
                />
                <Input
                  aria-label="Código hexadecimal da cor do texto dos botões"
                  value={config.cor_texto_botao || '#FFFFFF'}
                  onChange={(e) => handleChange('cor_texto_botao', e.target.value)}
                  className="min-w-0 flex-1 font-mono uppercase"
                />
                {(['#FFFFFF', '#111827', '#FFF7ED', '#FDF2F8'] as const).map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Usar cor de texto ${color}`}
                    onClick={() => handleChange('cor_texto_botao', color)}
                    className="h-8 w-8 shrink-0 rounded-full border border-black/15 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-background px-4 py-3">
                <div>
                  <p className="text-sm font-bold">Prévia do formulário</p>
                  <p className="text-xs text-muted-foreground">A composição acompanha as opções selecionadas.</p>
                </div>
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <div className="p-5 sm:p-7" style={{ background: previewBackground, fontFamily: formFont, color: darkVisualMode ? '#F8FAFC' : visualMode === 'neutro' ? '#3D352D' : visualMode === 'alto-contraste' ? '#000000' : '#0F172A' }}>
                <div className="mx-auto max-w-md rounded-3xl border p-5 sm:p-6" style={{
                  background: previewCardBackground,
                  borderColor: cardStyle === 'bordered' ? `${primaryColor}70` : `${primaryColor}30`,
                  borderRadius: `${Math.max(16, buttonRadius)}px`,
                  boxShadow: previewCardShadow,
                  backdropFilter: cardStyle === 'glass' ? 'blur(14px)' : undefined,
                }}>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: primaryColor }}>Agendamento online</p>
                      <p className="mt-1 text-lg font-black">Um cuidado especial, no seu tempo.</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>A</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-xl border px-3 py-2.5 text-xs" style={{ borderColor: `${primaryColor}22`, backgroundColor: darkVisualMode ? '#0F172A' : '#FFFFFF' }}>Escolha o serviço ideal para você</div>
                    <div className="rounded-xl border px-3 py-2.5 text-xs" style={{ borderColor: `${secondaryColor}88`, backgroundColor: `${secondaryColor}22` }}>Horários disponíveis durante a semana</div>
                  </div>
                  <button
                    type="button"
                    className={`mt-4 w-full px-4 py-3 text-sm font-bold transition-all ${previewButtonAnimation}`}
                    style={{
                      background: previewButtonBackground,
                      border: buttonStyle === 'outline' ? `1.5px solid ${primaryColor}` : buttonStyle === 'glass' ? `1px solid ${primaryColor}55` : 'none',
                      color: previewButtonForeground,
                      borderRadius: `${buttonRadius}px`,
                      boxShadow: previewShadow,
                    }}
                  >
                    Agendar agora
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label className="font-bold">Opções de Exibição</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-medium">Mostrar Preços</span>
                  <Switch checked={config.mostrar_precos} onCheckedChange={(v) => handleChange('mostrar_precos', v)} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-medium">Mostrar Duração</span>
                  <Switch checked={config.mostrar_duracao} onCheckedChange={(v) => handleChange('mostrar_duracao', v)} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="pagina" className="mt-0 space-y-3 scroll-mt-24 sm:space-y-4">
      {/* Informações do Salão */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Informações do Salão
          </CardTitle>
          <CardDescription>
            Dados que aparecerão no formulário de agendamento online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome_salao" className="font-bold">Nome do Salão *</Label>
            <Input
              id="nome_salao"
              value={config.nome_salao}
              onChange={(e) => handleChange('nome_salao', e.target.value)}
              placeholder="Ex: Salão Beleza Pura"
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="public_id" className="font-bold">Link Personalizado (Slug)</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted rounded-l-xl border border-r-0 border-primary/10 text-xs font-mono text-muted-foreground whitespace-nowrap">
                .../agendamento-online?s=
              </div>
              <Input
                id="public_id"
                value={config.public_id || ''}
                onChange={(e) => handleChange('public_id', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="nome-do-seu-salao"
                className="h-12 rounded-l-none rounded-r-xl font-mono"
              />
            </div>
            <p className="text-[10px] text-muted-foreground px-1">
              Use apenas letras minúsculas, números e hífens. Este será o identificador do seu link.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="font-bold">Descrição Curta</Label>
            <Textarea
              id="descricao"
              value={config.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Breve descrição sobre seu salão"
              rows={2}
              className="rounded-xl resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contato e Redes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4 text-primary" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-xs font-bold uppercase text-muted-foreground">WhatsApp</Label>
              <Input id="whatsapp" value={config.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} placeholder="5511999999999" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-xs font-bold uppercase text-muted-foreground">Endereço</Label>
              <Input id="endereco" value={config.endereco} onChange={(e) => handleChange('endereco', e.target.value)} placeholder="Rua..." className="h-11 rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Instagram className="h-4 w-4 text-primary" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-xs font-bold uppercase text-muted-foreground">Instagram</Label>
              <Input id="instagram" value={config.instagram} onChange={(e) => handleChange('instagram', e.target.value)} placeholder="@seuuser" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-xs font-bold uppercase text-muted-foreground">Facebook</Label>
              <Input id="facebook" value={config.facebook} onChange={(e) => handleChange('facebook', e.target.value)} placeholder="fb.com/user" className="h-11 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="regras" className="mt-0 space-y-3 scroll-mt-24 sm:space-y-4">
      {/* Regras e Mensagens */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Regras e Mensagens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Sinal (%)</Label>
              <Input type="number" value={config.taxa_sinal_percentual} onChange={(e) => handleChange('taxa_sinal_percentual', Number(e.target.value))} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Ant. Mín (min)</Label>
              <Input type="number" value={config.tempo_minimo_antecedencia} onChange={(e) => handleChange('tempo_minimo_antecedencia', Number(e.target.value))} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase">Ant. Máx (dias)</Label>
              <Input type="number" value={Math.floor(config.tempo_maximo_antecedencia / 1440)} onChange={(e) => handleChange('tempo_maximo_antecedencia', Number(e.target.value) * 1440)} className="h-11 rounded-xl" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Boas-vindas</Label>
              <Textarea value={config.mensagem_boas_vindas} onChange={(e) => handleChange('mensagem_boas_vindas', e.target.value)} className="rounded-xl resize-none" rows={2} />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Termos de Uso</Label>
              <Textarea value={config.termos_condicoes} onChange={(e) => handleChange('termos_condicoes', e.target.value)} className="rounded-xl resize-none" rows={2} />
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>

      {/* Botão Salvar Fixo/Flutuante no Mobile */}
      <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-3xl items-center gap-3 border-t border-primary/10 bg-background/95 p-3 shadow-[0_-12px_32px_-22px_hsl(var(--primary)/0.4)] backdrop-blur-xl sm:sticky sm:bottom-3 sm:mt-4 sm:justify-between sm:rounded-2xl sm:border sm:border-border/70 sm:p-3 sm:shadow-xl">
        <p className="hidden flex-1 px-1 text-xs text-muted-foreground sm:block">
          Lembre-se de salvar para publicar suas alterações.
        </p>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="h-12 w-full rounded-xl bg-primary font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98] sm:w-auto"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </div>
          ) : (
            <>
              <span className="sm:hidden">Salvar alterações</span>
              <span className="hidden sm:inline">Salvar Todas as Configurações</span>
            </>
          )}
        </Button>
      </div>

      {/* Link ZALU — Branded */}
      {(() => {
        const publicLink = buildPublicBookingLink({
          origin: typeof window !== 'undefined' ? window.location.origin : '',
          public_id: config.public_id,
          user_id: (config as any).user_id,
        });
        const hasSlug = Boolean(config.public_id?.trim());
        const qrSrc = hasSlug ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(publicLink)}` : '';
        const handleCopy = async () => {
          await navigator.clipboard.writeText(publicLink);
          toast.success('Link ZALU copiado! ✨');
        };
        const handleShare = async () => {
          if (typeof navigator.share !== 'function') {
            await handleCopy();
            return;
          }
          try {
            await navigator.share({
              title: config.nome_salao || 'ZALU',
              text: `Agende em ${config.nome_salao || 'meu salão'}`,
              url: publicLink,
            });
          } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return;
            console.error('Erro ao compartilhar link do agendamento:', error);
            await handleCopy();
          }
        };
        return (
          <Card className="overflow-hidden border-2 border-primary/10 bg-card shadow-elegant rounded-[1.75rem]">
            <div className="bg-gradient-to-br from-primary via-primary to-lilac-primary p-[1.5px]">
              <div className="rounded-[1.65rem] bg-card overflow-hidden">
                <div className="relative bg-gradient-to-br from-primary/[0.08] via-lilac-primary/[0.06] to-transparent px-5 py-4 border-b border-primary/10">
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-lilac-primary flex items-center justify-center shadow-lg rotate-3 shrink-0">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black tracking-tight">Seu Link ZALU</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${config.ativo ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${config.ativo ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                          {config.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground truncate">
                        {hasSlug ? `zalusalao.online/s/${config.public_id}` : 'Defina seu slug para liberar o link curto'} • {config.nome_salao || 'Seu salão'}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-5">
                  {!hasSlug ? (
                    <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4 text-center">
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Crie seu slug primeiro</p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-200/70 mt-1">Ex: <span className="font-mono font-bold">studio-bella</span> → vira <span className="font-mono">/s/studio-bella</span></p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-[1fr_140px] items-start">
                      <div className="space-y-3 min-w-0">
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <Input readOnly value={publicLink} className="h-11 rounded-xl bg-muted/50 font-mono text-xs pr-10 border-primary/10" />
                            <div className="absolute right-1 top-1 bottom-1 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Eye className="h-3.5 w-3.5 text-primary" />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleCopy} className="flex-1 h-11 rounded-xl bg-gradient-to-br from-primary to-lilac-primary font-black gap-2 shadow-md">
                            <Copy className="h-4 w-4" /> Copiar
                          </Button>
                          <Button onClick={handleShare} variant="outline" className="h-11 rounded-xl border-primary/15 font-bold gap-2">
                            <Share2 className="h-4 w-4" /> Compartilhar
                          </Button>
                          <Button onClick={() => window.open(publicLink, '_blank')} variant="ghost" size="icon" className="h-11 w-11 rounded-xl border border-primary/10">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Agende seu horário em ${config.nome_salao || 'meu salão'}: ${publicLink}`)}`, '_blank')} variant="secondary" className="flex-1 h-9 rounded-xl text-xs font-bold gap-1.5">
                            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                          </Button>
                          <Button onClick={handleCopy} variant="secondary" className="flex-1 h-9 rounded-xl text-xs font-bold">Copiar p/ Bio</Button>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground bg-muted/40 rounded-xl px-3 py-2 border border-primary/5">
                          Dica ZALU: cole na bio do Instagram e no Google Perfil. Link curto <span className="font-mono font-bold text-primary">/s/{config.public_id}</span> é memorável e rastreável.
                        </p>
                      </div>

                      <div className="mx-auto sm:mx-0 w-[140px] shrink-0">
                        <div className="rounded-2xl border-2 border-primary/10 bg-white p-2 shadow-sm">
                          <img src={qrSrc} alt="QR ZALU" className="w-full h-auto rounded-xl" loading="lazy" />
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                          <QrCode className="h-3 w-3" /> QR ZALU
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-1 h-7 text-[11px] font-bold rounded-full" onClick={() => window.open(qrSrc, '_blank')}>
                          Ampliar QR
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        );
      })()}
    </div>
  );
}
