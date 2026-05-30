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
  Video,
  Megaphone,
  Package,
  Download,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
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
import { toast } from "sonner";

const parseCsv = (value?: string) => {
  return (value || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
};

const navigationItems = [
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
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state, setOpenMobile, toggleSidebar } = useSidebar();
  const isMobileDevice = useIsMobile();
  const location = useLocation();
  const { usuario, user, logout } = useSupabaseAuth();
  const { config } = useConfigAgendamentoOnline();
  const { isInstallable, isInstalled, installApp } = usePWAContext();
  const currentPath = location.pathname;
  const adminEmails = parseCsv(import.meta.env.VITE_ADMIN_EMAILS);
  const authEmail = (user?.email || usuario?.email || "").trim().toLowerCase();
  const isAdmin = !!authEmail && adminEmails.includes(authEmail);

  const isActive = (path: string) => currentPath === path;

  const handleNavClick = () => {
    if (isMobileDevice) {
      setOpenMobile(false);
    }
  };

  // Gerar o link público do agendamento online com o slug (s) ou o ID do usuário (uid)
  const onlineBookingLink = `/agendamento-online?${config.public_id ? `s=${config.public_id}` : config.user_id ? `uid=${config.user_id}` : ''}`;

  const badgeFor = (href: string) => {
    if (href === "/") return "from-primary to-lilac-primary";
    if (href.startsWith("/minha-agenda") || href === "/agendamentos" || href === "/agenda") return "from-lilac-primary to-pink-accent";
    if (href === "/clientes") return "from-indigo-500 to-sky-400";
    if (href === "/servicos") return "from-rose-500 to-pink-400";
    if (href === "/cronogramas") return "from-amber-500 to-yellow-400";
    if (href === "/financeiro") return "from-emerald-500 to-green-400";
    if (href === "/marketing") return "from-fuchsia-500 to-violet-400";
    if (href === "/produtos") return "from-purple-500 to-violet-500";
    if (href === "/auditoria") return "from-slate-500 to-slate-400";
    if (href === "/assinatura") return "from-yellow-500 to-amber-400";
    if (href === "/configuracoes") return "from-stone-500 to-stone-400";
    return "from-primary to-lilac-primary";
  };

  const iconWrapClass = (active: boolean, gradient: string) => {
    const isCollapsed = state === "collapsed";
    const base =
      `relative ${isCollapsed ? "h-10 w-10 rounded-[22px]" : "h-9 w-9 rounded-2xl"} flex items-center justify-center transition-all duration-200 ease-in-out ring-1 ring-black/5 dark:ring-white/10 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.70),0_18px_34px_-24px_hsl(var(--primary)/0.25)] before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/70 before:via-white/25 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:inset-[1px] after:rounded-[inherit] after:bg-gradient-to-b after:from-white/55 after:to-transparent after:opacity-90 after:pointer-events-none`;

    if (active) {
      return `${base} bg-gradient-to-br ${gradient} text-white ring-white/35 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.35),0_1px_0_0_hsl(0_0%_100%/0.18),0_26px_46px_-30px_hsl(var(--primary)/0.75)] dark:ring-white/15 dark:shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.10),0_1px_0_0_hsl(0_0%_100%/0.06),0_30px_52px_-32px_hsl(0_0%_0%/0.75)]`;
    }

    return `${base} bg-gradient-to-br from-white/80 to-white/50 text-sidebar-primary group-hover:-translate-y-px group-hover:scale-[1.03] dark:from-white/12 dark:to-white/6 dark:text-sidebar-foreground`;
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
      className="border-r border-sidebar-border/60 bg-transparent [&_[data-sidebar=sidebar]]:bg-gradient-to-b [&_[data-sidebar=sidebar]]:from-lilac-lighter/90 [&_[data-sidebar=sidebar]]:to-sidebar [&_[data-sidebar=sidebar]]:shadow-[0_1px_0_0_hsl(0_0%_100%/0.65),0_22px_60px_-40px_hsl(var(--primary)/0.22)] dark:[&_[data-sidebar=sidebar]]:from-sidebar dark:[&_[data-sidebar=sidebar]]:to-sidebar dark:[&_[data-sidebar=sidebar]]:shadow-[0_1px_0_0_hsl(0_0%_100%/0.06),0_30px_70px_-45px_hsl(0_0%_0%/0.60)] transition-all duration-300 ease-in-out"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="border-b border-sidebar-border/60 bg-white/35 backdrop-blur-xl dark:bg-white/5">
        <div className="flex items-center gap-2 p-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent blur" />
            <div className="relative rounded-2xl bg-white/55 p-1 shadow-[0_1px_0_0_hsl(0_0%_100%/0.70),0_14px_30px_-18px_hsl(var(--primary)/0.25)] dark:bg-white/10 dark:shadow-[0_1px_0_0_hsl(0_0%_100%/0.06),0_18px_36px_-20px_hsl(0_0%_0%/0.55)]">
              <AppLogo size={28} rounded="xl" />
            </div>
          </div>
          {state === "expanded" && (
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold bg-gradient-to-r from-primary to-lilac-primary bg-clip-text text-transparent truncate">
                {usuario?.nome_personalizado_app || 'Sistema'}
              </h2>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {usuario?.nome_completo}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[...navigationItems, ...(isAdmin ? [{ title: "Admin", href: "/admin", icon: Shield }] : [])].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const iconSizeClass = state === "collapsed" ? "h-[18px] w-[18px]" : "h-4 w-4";
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      size="lg"
                      tooltip={item.title}
                      className="group relative h-12 rounded-xl px-3 py-2 overflow-hidden transition-all duration-200 ease-in-out hover:bg-white/40 hover:-translate-y-px active:translate-y-0 data-[active=true]:bg-gradient-to-b data-[active=true]:from-white/75 data-[active=true]:to-white/45 data-[active=true]:text-sidebar-foreground data-[active=true]:ring-1 data-[active=true]:ring-primary/15 data-[active=true]:shadow-[0_1px_0_0_hsl(0_0%_100%/0.80),0_22px_44px_-30px_hsl(var(--primary)/0.40)] data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:inset-0 data-[active=true]:before:bg-gradient-to-b data-[active=true]:before:from-white/55 data-[active=true]:before:to-transparent data-[active=true]:before:pointer-events-none data-[active=true]:after:content-[''] data-[active=true]:after:absolute data-[active=true]:after:left-0 data-[active=true]:after:top-2 data-[active=true]:after:bottom-2 data-[active=true]:after:w-1 data-[active=true]:after:rounded-full data-[active=true]:after:bg-gradient-to-b data-[active=true]:after:from-primary data-[active=true]:after:to-lilac-primary data-[active=true]:after:shadow-[0_0_0_1px_hsl(0_0%_100%/0.35)] dark:hover:bg-white/10 dark:data-[active=true]:bg-white/10 dark:data-[active=true]:ring-white/10 dark:data-[active=true]:shadow-[0_1px_0_0_hsl(0_0%_100%/0.06),0_22px_44px_-30px_hsl(0_0%_0%/0.65)]"
                    >
                      <Link
                        to={item.href}
                        className="flex w-full items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                        onClick={handleNavClick}
                        aria-current={active ? "page" : undefined}
                      >
                        <div className={iconWrapClass(active, badgeFor(item.href))}>
                          <Icon className={`${iconSizeClass} flex-shrink-0`} strokeWidth={2.2} />
                        </div>
                        <span className="truncate group-data-[collapsible=icon]:sr-only">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Links Externos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleInstallClick}
                  size="lg"
                  tooltip="Instalar App"
                  className="group h-12 rounded-xl px-3 py-2 transition-all duration-200 ease-in-out hover:bg-white/40 hover:-translate-y-px active:translate-y-0 dark:hover:bg-white/10"
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
                  className="group h-12 rounded-xl px-3 py-2 transition-all duration-200 ease-in-out hover:bg-white/40 hover:-translate-y-px active:translate-y-0 dark:hover:bg-white/10"
                >
                  <a 
                    href={onlineBookingLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary"
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
                  className="group h-12 rounded-xl px-3 py-2 transition-all duration-200 ease-in-out hover:bg-white/40 hover:-translate-y-px active:translate-y-0 dark:hover:bg-white/10"
                >
                  <a
                    href="https://www.instagram.com/salao.de.bolso/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary"
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
                  className="group h-12 rounded-xl px-3 py-2 transition-all duration-200 ease-in-out hover:bg-white/40 hover:-translate-y-px active:translate-y-0 dark:hover:bg-white/10"
                >
                  <a
                    href="https://www.facebook.com/profile.php?id=61588465179526&locale=pt_BR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary"
                    onClick={handleNavClick}
                  >
                    <div className={iconWrapClass(false, "from-indigo-500 to-sky-400")}>
                      <Facebook className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="truncate group-data-[collapsible=icon]:sr-only">Facebook</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  tooltip="TikTok"
                  className="group h-12 rounded-xl px-3 py-2 transition-all duration-200 ease-in-out hover:bg-white/40 hover:-translate-y-px active:translate-y-0 dark:hover:bg-white/10"
                >
                  <a
                    href="https://www.tiktok.com/@salao_de_bolso"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary"
                    onClick={handleNavClick}
                  >
                    <div className={iconWrapClass(false, "from-slate-600 to-slate-400")}>
                      <Video className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="truncate group-data-[collapsible=icon]:sr-only">TikTok</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        <SidebarMenu>
          {!isMobileDevice ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => toggleSidebar?.()}
                size="lg"
                tooltip={state === "expanded" ? "Recolher menu" : "Expandir menu"}
                className="group h-12 rounded-xl px-3 py-2 transition-all duration-200 ease-in-out hover:bg-white/40 hover:-translate-y-px active:translate-y-0 dark:hover:bg-white/10"
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
              className="group h-12 rounded-xl px-3 py-2 transition-all duration-200 ease-in-out hover:bg-destructive/10 hover:-translate-y-px active:translate-y-0"
            >
              <div className="relative h-8 w-8 rounded-xl flex items-center justify-center bg-white/60 text-destructive shadow-[0_1px_0_0_hsl(0_0%_100%/0.80),0_12px_24px_-16px_hsl(0_84%_55%/0.18)] before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/65 before:to-transparent before:pointer-events-none group-hover:bg-white/75 group-hover:-translate-y-px dark:bg-white/10 dark:shadow-[0_1px_0_0_hsl(0_0%_100%/0.06),0_18px_32px_-18px_hsl(0_0%_0%/0.55)]">
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
