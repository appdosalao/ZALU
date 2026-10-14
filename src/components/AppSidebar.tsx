/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import { usePWAContext } from "@/components/pwa/PWAProvider";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  DollarSign,
  Clock,
  Shield,
  Settings,
  LogOut,
  ExternalLink,
  Instagram,
  Facebook,
  Megaphone,
  Package,
  Download,
  ChevronsLeft,
  ChevronsRight,
  Crown,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { AppLogo } from "@/components/branding/AppLogo";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConfigAgendamentoOnline } from "@/hooks/useConfigAgendamentoOnline";
import { buildPublicBookingLink } from "@/lib/utils";
import { toast } from "sonner";

const navigationItems: { title: string; href: string; icon: LucideIcon }[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Minha Agenda",
    href: "/minha-agenda",
    icon: Calendar,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    title: "Serviços",
    href: "/servicos",
    icon: Scissors,
  },
  {
    title: "Cronogramas",
    href: "/cronogramas",
    icon: Clock,
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: Megaphone,
  },
  {
    title: "Divulgação",
    href: "/divulgacao",
    icon: Share2,
  },
  {
    title: "Produtos",
    href: "/produtos",
    icon: Package,
  },
  {
    title: "Auditoria",
    href: "/auditoria",
    icon: Shield,
  },
  {
    title: "Assinatura",
    href: "/assinatura",
    icon: Crown,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state, setOpenMobile, toggleSidebar } = useSidebar();
  const isMobileDevice = useIsMobile();
  const location = useLocation();
  const { usuario, logout } = useSupabaseAuth();
  const { config } = useConfigAgendamentoOnline();
  const { isInstallable, isInstalled, installApp } = usePWAContext();
  const currentPath = location.pathname;
  const visibleNavigationItems = navigationItems.filter(
    (item) => item.href !== "/divulgacao" || usuario?.is_divulgador === true
  );
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath === path || currentPath.startsWith(`${path}/`);

  const handleNavClick = () => {
    if (isMobileDevice) {
      setOpenMobile(false);
    }
  };

  // Gerar o link público do agendamento online com o slug (s) ou o ID do usuário (uid)
  const onlineBookingLink = buildPublicBookingLink({
    origin: window.location.origin,
    public_id: config.public_id,
    user_id: (config as any).user_id,
  });

  const badgeFor = (href: string) => {
    void href;
    return "from-primary to-lilac-primary";
  };

  const iconWrapClass = (active: boolean, gradient: string) => {
    const base =
      "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-black/5 transition-[background,color,box-shadow,transform] duration-200 ease-out group-hover:scale-[1.04] group-active:scale-95 motion-reduce:transition-none dark:ring-white/10";

    if (active) {
      return `${base} bg-gradient-to-br ${gradient} text-white shadow-md shadow-primary/20 ring-white/40 group-hover:shadow-lg group-hover:shadow-primary/25`;
    }

    return `${base} bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary md:bg-white/10 md:text-white/65 md:group-hover:bg-white/15 md:group-hover:text-white`;
  };

  const handleInstallClick = async () => {
    if (isInstalled) {
      toast.success("O aplicativo já está instalado");
      return;
    }

    if (isInstallable) {
      await installApp();
      return;
    }

    const ua = (typeof navigator !== "undefined" ? navigator.userAgent : "").toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);

    if (isIOS) {
      toast.message("Para instalar no iPhone/iPad: Compartilhar → Adicionar à Tela de Início");
      return;
    }

    toast.message("Para instalar: use o menu do navegador (⋮) e escolha “Instalar aplicativo”");
  };

  return (
    <Sidebar 
      className="text-white [&_[data-sidebar=sidebar]]:rounded-2xl [&_[data-sidebar=sidebar]]:border [&_[data-sidebar=sidebar]]:border-white/10 [&_[data-sidebar=sidebar]]:bg-gradient-to-b [&_[data-sidebar=sidebar]]:from-slate-900 [&_[data-sidebar=sidebar]]:to-slate-950 [&_[data-sidebar=sidebar]]:shadow-xl [&_[data-sidebar=sidebar]]:shadow-slate-950/20"
      collapsible="icon"
      variant="floating"
    >
      <SidebarHeader className="border-b border-white/10 bg-white/[0.03] p-3 group-data-[collapsible=icon]:p-2">
        <div className="flex min-h-12 items-center gap-3 rounded-xl px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="shrink-0 rounded-xl bg-white/10 p-1 shadow-sm ring-1 ring-white/10">
            <AppLogo size={30} rounded="lg" />
          </div>
          {state === "expanded" && (
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground md:text-white/50">Seu espaço</p>
              <h2 className="truncate text-sm font-semibold leading-5 text-foreground md:text-white">
                {usuario?.nome_personalizado_app || 'Sistema'}
              </h2>
              <p className="truncate text-xs leading-4 text-muted-foreground md:text-white/60">
                {usuario?.nome_completo}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2 group-data-[collapsible=icon]:py-1">
        <SidebarGroup className="group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-0">
          <SidebarGroupLabel className="h-7 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:text-white/45">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:gap-0">
              {visibleNavigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const iconSizeClass = "h-[18px] w-[18px]";
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      size="lg"
                      tooltip={item.title}
                      className="group relative h-11 rounded-xl px-2.5 py-1 text-sidebar-foreground transition-[background,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-primary/5 active:translate-y-0 active:scale-[0.99] active:bg-primary/10 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:ring-1 data-[active=true]:ring-primary/15 md:text-white/70 md:hover:bg-white/[0.07] md:hover:text-white md:active:bg-white/10 md:data-[active=true]:bg-primary/20 md:data-[active=true]:text-white md:data-[active=true]:ring-primary/40 md:data-[active=true]:after:absolute md:data-[active=true]:after:inset-y-3 md:data-[active=true]:after:left-0 md:data-[active=true]:after:w-0.5 md:data-[active=true]:after:rounded-full md:data-[active=true]:after:bg-primary md:data-[active=true]:after:shadow-[0_0_10px_hsl(var(--primary)/0.7)] motion-reduce:transition-none"
                    >
                      <Link
                        to={item.href}
                        className="flex w-full min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                        onClick={handleNavClick}
                        aria-current={active ? "page" : undefined}
                      >
                        <div className={iconWrapClass(active, badgeFor(item.href))}>
                          <Icon className={`${iconSizeClass} flex-shrink-0`} strokeWidth={2.2} />
                        </div>
                        <span
                          aria-hidden={state === "collapsed"}
                          className="min-w-0 max-w-48 truncate font-medium transition-[max-width,opacity,transform] duration-200 ease-out group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:-translate-x-1 group-data-[collapsible=icon]:opacity-0 motion-reduce:transition-none"
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-1 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-0">
          <SidebarGroupLabel className="h-7 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:text-white/45">
            Links externos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleInstallClick}
                  size="lg"
                  tooltip="Instalar App"
                  className="group h-11 rounded-xl px-2.5 py-1 text-sidebar-foreground transition-[background,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-primary/5 hover:text-foreground active:translate-y-0 active:scale-[0.99] active:bg-primary/10 md:text-white/70 md:hover:bg-white/[0.07] md:hover:text-white md:active:bg-white/10 motion-reduce:transition-none"
                >
                  <div className={iconWrapClass(false, "from-primary to-lilac-primary")}>
                    <Download className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <span className="truncate group-data-[collapsible=icon]:sr-only">Instalar App</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  tooltip="Agendamento Online"
                  className="group h-11 rounded-xl px-2.5 py-1 text-sidebar-foreground transition-[background,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-primary/5 hover:text-foreground active:translate-y-0 active:scale-[0.99] active:bg-primary/10 md:text-white/70 md:hover:bg-white/[0.07] md:hover:text-white md:active:bg-white/10 motion-reduce:transition-none"
                >
                  <a 
                    href={onlineBookingLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sidebar-foreground md:text-white/70"
                    onClick={handleNavClick}
                  >
                    <div className={iconWrapClass(false, "from-primary to-lilac-primary")}>
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="truncate group-data-[collapsible=icon]:sr-only">Agendamento Online</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  tooltip="Instagram"
                  className="group h-11 rounded-xl px-2.5 py-1 text-sidebar-foreground transition-[background,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-primary/5 hover:text-foreground active:translate-y-0 active:scale-[0.99] active:bg-primary/10 md:text-white/70 md:hover:bg-white/[0.07] md:hover:text-white md:active:bg-white/10 motion-reduce:transition-none"
                >
                  <a
                    href="https://www.instagram.com/zalu_saloes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sidebar-foreground md:text-white/70"
                    onClick={handleNavClick}
                  >
                    <div className={iconWrapClass(false, "from-rose-500 to-pink-400")}>
                      <Instagram className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="truncate group-data-[collapsible=icon]:sr-only">Instagram</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  tooltip="Facebook"
                  className="group h-11 rounded-xl px-2.5 py-1 text-sidebar-foreground transition-[background,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-primary/5 hover:text-foreground active:translate-y-0 active:scale-[0.99] active:bg-primary/10 md:text-white/70 md:hover:bg-white/[0.07] md:hover:text-white md:active:bg-white/10 motion-reduce:transition-none"
                >
                  <a
                    href="https://www.facebook.com/BELLAGEST/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sidebar-foreground md:text-white/70"
                    onClick={handleNavClick}
                  >
                    <div className={iconWrapClass(false, "from-indigo-500 to-sky-400")}>
                      <Facebook className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="truncate group-data-[collapsible=icon]:sr-only">Facebook</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 bg-background/40 p-2 group-data-[collapsible=icon]:p-1 md:border-white/10 md:bg-black/10">
        <SidebarMenu>
          {!isMobileDevice ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => toggleSidebar?.()}
                size="lg"
                tooltip={state === "expanded" ? "Recolher menu" : "Expandir menu"}
                className="group h-11 rounded-xl px-2.5 py-1 text-sidebar-foreground transition-[background,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-primary/5 hover:text-foreground active:translate-y-0 active:scale-[0.99] md:text-white/70 md:hover:bg-white/[0.07] md:hover:text-white motion-reduce:transition-none"
              >
                <div className={iconWrapClass(false, "from-primary to-lilac-primary")}>
                  {state === "expanded" ? (
                    <ChevronsLeft className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronsRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </div>
                <span className="truncate group-data-[collapsible=icon]:sr-only">{state === "expanded" ? "Recolher menu" : "Expandir menu"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : null}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => void logout()}
              size="lg"
              tooltip="Sair"
              className="group h-11 rounded-xl px-2.5 py-1 text-sidebar-foreground transition-[background,color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-destructive/10 hover:text-destructive active:translate-y-0 active:scale-[0.99] md:text-white/70 md:hover:bg-rose-500/10 md:hover:text-rose-300 motion-reduce:transition-none"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-colors group-hover:bg-destructive/15">
                <LogOut className="h-4 w-4 flex-shrink-0" />
              </div>
              <span className="truncate group-data-[collapsible=icon]:sr-only">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
