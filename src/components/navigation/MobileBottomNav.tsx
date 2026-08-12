import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { LayoutDashboard, Calendar, DollarSign, MoreHorizontal, Users, Scissors, Clock, Megaphone, Package, Shield, Settings, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  { title: "Configurações", href: "/configuracoes", icon: Settings },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const grad = (href: string) => {
    if (href === "/") return "from-primary to-lilac-primary";
    if (href.startsWith("/minha-agenda")) return "from-lilac-primary to-pink-accent";
    if (href === "/financeiro") return "from-emerald-500 to-green-400";
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
    if (p.startsWith("/minha-agenda")) return "/minha-agenda";
    if (p.startsWith("/financeiro")) return "/financeiro";
    return null;
  }, [location.pathname]);

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="relative border-t border-primary/15 bg-gradient-to-b from-sidebar/90 to-background/85 backdrop-blur-xl shadow-[0_-18px_40px_-28px_hsl(var(--primary)/0.35)] before:content-[''] before:absolute before:left-3 before:right-3 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent dark:border-white/10 dark:from-sidebar dark:to-sidebar dark:before:via-white/10">
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
              className={navItemClass}
              aria-label="Mais"
            >
              <div className={iconWrapClass(moreOpen, "from-primary to-lilac-primary")}>
                <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
              <span className={labelClass(moreOpen)}>Mais</span>
              {moreOpen ? <span className="absolute -top-0.5 h-1 w-7 rounded-full bg-gradient-to-r from-primary/70 to-lilac-primary/70" /> : null}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl border-t border-primary/15 bg-gradient-to-b from-sidebar/95 to-background/95 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-24px_70px_-45px_hsl(var(--primary)/0.40)]">
            <SheetHeader>
              <SheetTitle>Todos os menus</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {fullNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group flex flex-col items-center gap-2 p-3 rounded-2xl border border-primary/10 bg-white/55 shadow-[0_1px_0_0_hsl(0_0%_100%/0.70),0_20px_40px_-30px_hsl(var(--primary)/0.18)] hover:bg-white/70 hover:-translate-y-px transition dark:bg-white/5 dark:border-white/10 dark:shadow-[0_1px_0_0_hsl(0_0%_100%/0.06),0_22px_44px_-30px_hsl(0_0%_0%/0.65)]"
                    aria-label={item.title}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setMoreOpen(false)}
                  >
                    <div className={iconWrapClass(isActive(item.href), grad(item.href))}>
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    </div>
                    <span className="text-xs text-foreground truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4">
              <a
                href="/agendamento-online"
                target="_blank"
                className="flex items-center justify-center gap-2 w-full"
                aria-label="Agendamento Online"
              >
                <Button variant="outline" className="w-full">
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
