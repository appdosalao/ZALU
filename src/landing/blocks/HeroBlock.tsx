import type { ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';
import { AppLogo } from '@/components/branding/AppLogo';

export function HeroBlock({ config, props }: { config: ConfigAgendamentoOnline; props?: Record<string, unknown> }) {
  const banner = (props?.banner_url as string) || config.banner_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop';
  const title = (props?.title as string) || config.nome_salao || 'Seu salão';
  const desc = (props?.description as string) || config.descricao || 'Beleza & Estilo Profissional';
  return (
    <div className="relative w-full overflow-hidden">
      <div className="h-56 sm:h-80 w-full relative">
        <img src={banner} alt="Capa" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent mix-blend-overlay" />
        <div className="absolute bottom-6 left-6 right-6 sm:left-10 text-white">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic landing-anim-slide">{title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/80 line-clamp-1">{desc}</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 z-10">
        <div className="p-1.5 bg-white rounded-[2.5rem] shadow-xl border border-primary/5">
          <div className="bg-primary/5 rounded-[2.2rem] p-1 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center overflow-hidden">
            {config.logo_url ? <img src={config.logo_url} alt={config.nome_salao} className="w-full h-full object-cover rounded-[2rem]" /> : <AppLogo size={70} rounded="full" />}
          </div>
        </div>
      </div>
    </div>
  );
}
