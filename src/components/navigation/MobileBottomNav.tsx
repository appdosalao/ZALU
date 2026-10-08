import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { LayoutDashboard, Calendar, DollarSign, MoreHorizontal, Users, Scissors, Clock, Megaphone, Package, Shield, Settings, ExternalLink, Crown, Sparkles, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useConfigAgendamentoOnline } from "@/hooks/useConfigAgendamentoOnline";
import { buildPublicBookingLink } from "@/lib/utils";

const fullNav = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Minha Agenda", href: "/minha-agenda", icon: Calendar },
  { title: "Clientes", href: "/clientes", icon: Users },
  { title: "Serviços", href: "/servicos", icon: Scissors },
  { title: "Cronogramas", href: "/cronogramas", icon: Clock },
  { title: "Financeiro", href: "/financeiro", icon: DollarSign },
  { title: "Marketing", href: "/marketing", icon: Megaphone },
  { title: "Produtos", href: "/produtos", icon: Package },
  { title: "Auditoria", href: "/auditoria", icon: Shield },
  { title: "Assinatura", href: "/assinatura", icon: Crown },
  { title: "Configurações", href: "/configuracoes", icon: Settings },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const { config } = useConfigAgendamentoOnline();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname === path || location.pathname.startsWith(`${path}/`);
  const grad = (href: string) => {
    return "from-primary to-lilac-primary";
  };

  const iconWrapClass = (active: boolean, gradient: string) => {
    const base =
      "relative h-10 w-10 rounded-[22px] flex items-center justify-center transition-all duration-200 ease-in-out ring-1 ring-black/5 dark:ring-white/10 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.70),0_18px_34px_-24px_hsl(var(--primary)/0.25)] before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/70 before:via-white/25 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:inset-[1px] after:rounded-[inherit] after:bg-gradient-to-b after:from-white/55 after:to-transparent after:opacity-90 after:pointer-events-none";

    if (active) {
      return `${base} bg-gradient-to-br ${gradient} text-white ring-white/35 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.35),0_1px_0_0_hsl(0_0%_100%/0.18),0_26px_46px_-30px_hsl(var(--primary)/0.75)]`;
    }

    return `${base} bg-gradient-to-br from-white/85 to-white/55 text-sidebar-primary group-hover:-translate-y-px group-hover:scale-[1.03] dark:from-white/12 dark:to-white/6 dark:text-sidebar-foreground`;
  };

  const navItemClass = "group relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 outline-none transition-colors duration-200 ease-in-out hover:bg-white/35 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const labelClass = (active: boolean) => `text-[11px] ${active ? "text-primary font-medium" : "text-muted-foreground"}`;
  const currentRoot = useMemo(() => {
    const p = location.pathname;
    if (p === "/") return "/";
    if (p.startsWith("/minha-agenda") || p === "/agendamentos" || p === "/agenda") return "/minha-agenda";
    if (p.startsWith("/financeiro")) return "/financeiro";
    return null;
  }, [location.pathname]);
  const moreIsActive = fullNav.some(item =>
    item.href !== "/" && item.href !== "/minha-agenda" && item.href !== "/financeiro" && isActive(item.href)
  );
  const onlineBookingLink = buildPublicBookingLink({
    origin: window.location.origin,
    public_id: config.public_id,
    user_id: config.user_id,
  });

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 pb-[max(env(safe-area-inset-bottom),0.25rem)]">
      <div className="relative border-t border-primary/15 bg-gradient-to-b from-background/95 via-sidebar/95 to-background/95 backdrop-blur-2xl shadow-[0_-16px_42px_-28px_hsl(var(--primary)/0.45)] before:content-[''] before:absolute before:left-3 before:right-3 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent dark:border-white/10 dark:from-sidebar dark:via-sidebar dark:to-sidebar dark:before:via-primary/50">
      <div className="mx-auto grid w-full max-w-md grid-cols-4 gap-1.5 px-2.5 pt-1 pb-1">
        <Link
          to="/"
          className={navItemClass}
          aria-label="Início"
          aria-current={currentRoot === "/" ? "page" : undefined}
        >
          <div className={iconWrapClass(isActive("/"), grad("/"))}>
            <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </div>
          <span className={labelClass(currentRoot === "/")}>Início</span>
          {currentRoot === "/" ? <span className="absolute -top-0.5 h-1 w-7 rounded-full bg-gradient-to-r from-primary/70 to-lilac-primary/70" /> : null}
        </Link>
        <Link
          to="/minha-agenda"
          className={navItemClass}
          aria-label="Agenda"
          aria-current={currentRoot === "/minha-agenda" ? "page" : undefined}
        >
          <div className={iconWrapClass(isActive("/minha-agenda"), grad("/minha-agenda"))}>
            <Calendar className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </div>
          <span className={labelClass(currentRoot === "/minha-agenda")}>Agenda</span>
          {currentRoot === "/minha-agenda" ? <span className="absolute -top-0.5 h-1 w-7 rounded-full bg-gradient-to-r from-primary/70 to-lilac-primary/70" /> : null}
        </Link>
        <Link
          to="/financeiro"
          className={navItemClass}
          aria-label="Financeiro"
          aria-current={currentRoot === "/financeiro" ? "page" : undefined}
        >
          <div className={iconWrapClass(isActive("/financeiro"), grad("/financeiro"))}>
            <DollarSign className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </div>
          <span className={labelClass(currentRoot === "/financeiro")}>Financeiro</span>
          {currentRoot === "/financeiro" ? <span className="absolute -top-0.5 h-1 w-7 rounded-full bg-gradient-to-r from-primary/70 to-lilac-primary/70" /> : null}
        </Link>
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={`${navItemClass} ${moreIsActive ? "text-primary" : ""}`}
              aria-label="Mais"
              aria-expanded={moreOpen}
              aria-current={moreIsActive ? "page" : undefined}
            >
              <div className={iconWrapClass(moreOpen || moreIsActive, "from-primary to-lilac-primary")}>
                <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
              <span className={labelClass(moreOpen || moreIsActive)}>Mais</span>
              {moreOpen || moreIsActive ? <span className="absolute -top-0.5 h-1 w-7 rounded-full bg-gradient-to-r from-primary/70 to-pink-accent/70" /> : null}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[88dvh] overflow-y-auto rounded-t-[2rem] border-t border-primary/15 bg-gradient-to-b from-lilac-lighter/70 via-background to-background pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-24px_70px_-45px_hsl(var(--primary)/0.40)] dark:from-sidebar dark:via-sidebar dark:to-background">
            <SheetHeader className="mb-3 text-left">
              <div className="mb-1 flex items-center gap-2 text-primary">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10"><Sparkles className="h-4 w-4" /></span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Seu espaço de gestão</span>
              </div>
              <SheetTitle className="text-xl">Menu principal</SheetTitle>
              <SheetDescription>Acesse as áreas do seu salão com rapidez.</SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {fullNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`group flex min-h-[58px] items-center gap-3 rounded-2xl border p-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${active ? "border-primary/30 bg-primary/10 text-primary shadow-sm" : "border-border/70 bg-card/75 text-foreground hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5"}`}
                    aria-label={item.title}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMoreOpen(false)}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${active ? "bg-gradient-to-br from-primary to-pink-accent text-white shadow-md shadow-primary/20" : "bg-primary/8 text-primary group-hover:bg-primary/12"}`}>
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${active ? "text-primary" : "text-muted-foreground/60"}`} />
                  </Link>
                );
              })}
            </div>
            <div className="mt-4">
              <a
                href={onlineBookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full"
                aria-label="Agendamento Online"
              >
                <Button variant="outline" className="h-12 w-full rounded-2xl border-primary/20 bg-card/70 font-medium text-primary hover:bg-primary/5">
                  <ExternalLink className="h-4 w-4" />
                  Agendamento Online
                </Button>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      </div>
    </div>
  );
}
