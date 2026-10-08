import { ArrowRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import type { ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';

function socialUrl(value: string, platform: 'instagram' | 'facebook') {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, '');
  return `https://${platform}.com/${encodeURIComponent(handle)}`;
}

export function SalonFooter({ config }: { config: ConfigAgendamentoOnline }) {
  const whatsappNumber = (config.whatsapp || '').replace(/\D/g, '');
  const phoneHref = config.telefone ? `tel:${config.telefone.replace(/[^\d+]/g, '')}` : undefined;
  const mapHref = config.endereco
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.endereco)}`
    : undefined;
  const primaryColor = config.cor_primaria || '#8B5CF6';

  return (
    <footer className="relative isolate mt-12 overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: config.cor_secundaria || '#F5D0FE' }}
      />

      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: config.cor_secundaria || '#F5D0FE' }}>
              <Sparkles className="h-4 w-4" />
              Seu momento começa aqui
            </span>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Pronto para se cuidar?</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Escolha seu serviço e encontre o melhor horário para você.
            </p>
          </div>
          <a
            href="#agendamento-form"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
            style={{ backgroundColor: primaryColor, borderRadius: `${config.raio_botoes ?? 22}px` }}
          >
            Agendar agora
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-14">
          <div>
            <a href="#topo" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {config.logo_url ? (
                <img src={config.logo_url} alt="" className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/20" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white" style={{ backgroundColor: primaryColor }}>
                  {(config.nome_salao || 'S').trim().charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-lg font-extrabold tracking-tight">{config.nome_salao || 'Nosso espaço'}</span>
            </a>
            {config.descricao && (
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">{config.descricao}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {config.instagram && (
                <a
                  href={socialUrl(config.instagram, 'instagram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram de ${config.nome_salao}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {config.facebook && (
                <a
                  href={socialUrl(config.facebook, 'facebook')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Facebook de ${config.nome_salao}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {whatsappNumber.length >= 10 && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Conversar com ${config.nome_salao} pelo WhatsApp`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/45">Fale com a gente</h3>
            <div className="space-y-4">
              {config.telefone && phoneHref && (
                <a href={phoneHref} className="group flex items-start gap-3 text-sm text-white/75 transition hover:text-white">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/45 transition group-hover:text-white" />
                  <span>{config.telefone}</span>
                </a>
              )}
              {whatsappNumber.length >= 10 && (
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-sm text-white/75 transition hover:text-white">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-white/45 transition group-hover:text-white" />
                  <span>Chamar no WhatsApp</span>
                </a>
              )}
              {config.email && (
                <a href={`mailto:${config.email}`} className="group flex items-start gap-3 break-all text-sm text-white/75 transition hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/45 transition group-hover:text-white" />
                  <span>{config.email}</span>
                </a>
              )}
              {config.endereco && mapHref && (
                <a href={mapHref} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-sm leading-relaxed text-white/75 transition hover:text-white">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/45 transition group-hover:text-white" />
                  <span>{config.endereco}<span className="mt-1 block text-xs text-white/40">Ver no mapa</span></span>
                </a>
              )}
              {!config.telefone && !config.email && !config.endereco && whatsappNumber.length < 10 && (
                <p className="text-sm text-white/50">Entre em contato pelas nossas redes sociais.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/45">Agendamento</h3>
            <p className="max-w-xs text-sm leading-7 text-white/60">
              Reserve seu horário online de forma simples e escolha o atendimento ideal para você.
            </p>
            <a
              href="#agendamento-form"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/85 transition hover:text-white"
            >
              Ver serviços e horários
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {config.nome_salao}. Todos os direitos reservados.
          </p>
          <a
            href="https://zalusalao.online"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/45 transition hover:text-white/75"
          >
            <img src="/images/zalu-wordmark.png" alt="ZALU" className="h-5 w-auto opacity-70" />
            Agendamento online com ZALU
          </a>
        </div>
      </div>
    </footer>
  );
}
