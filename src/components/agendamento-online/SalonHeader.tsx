import { ArrowDown, CalendarCheck, Sparkles } from 'lucide-react';
import { AppLogo } from '@/components/branding/AppLogo';
import type { ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';

export function SalonHeader({ config }: { config: ConfigAgendamentoOnline }) {
  const bannerUrl = config.banner_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000&auto=format&fit=crop';
  const primaryColor = config.cor_primaria || '#8B5CF6';

  return (
    <header id="topo" className="relative isolate min-h-[490px] w-full overflow-hidden bg-slate-950 text-white sm:min-h-[580px]">
      <img
        src={bannerUrl}
        alt={`Espaço ${config.nome_salao}`}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/25" />
      <div className="pointer-events-none absolute -right-40 top-10 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="mx-auto flex min-h-[490px] max-w-7xl flex-col px-5 pb-12 pt-6 sm:min-h-[580px] sm:px-10 sm:pb-16 sm:pt-8 lg:px-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-md">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white">
              {config.logo_url ? (
                <img src={config.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <AppLogo size={25} rounded="full" />
              )}
            </div>
            <span className="max-w-[50vw] truncate text-sm font-semibold tracking-wide sm:max-w-none">
              {config.nome_salao || 'Seu espaço de beleza'}
            </span>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-md sm:inline-flex">
            <Sparkles className="h-4 w-4" style={{ color: primaryColor }} />
            Atendimento com hora marcada
          </span>
        </div>

        <div className="my-auto max-w-3xl py-14">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            Beleza, cuidado e bem-estar
          </span>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight drop-shadow-lg sm:text-6xl lg:text-7xl">
            Seu próximo momento especial começa aqui.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 drop-shadow sm:text-lg sm:leading-8">
            {config.descricao || 'Conheça nosso espaço e agende seu atendimento de forma simples e rápida.'}
          </p>
          <a
            href="#agendamento-form"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-sm font-bold text-white shadow-[0_14px_40px_-12px_rgba(0,0,0,0.65)] transition duration-300 hover:-translate-y-1 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none"
            style={{ backgroundColor: primaryColor, borderRadius: `${config.raio_botoes ?? 22}px` }}
          >
            <CalendarCheck className="h-5 w-5" />
            Agendar meu horário
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-white/70">
          <span className="h-px w-8 bg-white/40" />
          Role para conhecer o espaço
        </div>
      </div>
    </header>
  );
}
