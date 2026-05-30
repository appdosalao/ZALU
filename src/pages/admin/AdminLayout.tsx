import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppLogo } from '@/components/branding/AppLogo';
import { BarChart3, LayoutDashboard, LogOut, Menu, ShieldAlert, Users, FileText } from 'lucide-react';

const parseCsv = (value: string | undefined) => {
  return (value || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
};

const AdminNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const items = [
    { title: 'Visão geral', to: '/admin', icon: LayoutDashboard },
    { title: 'Usuários', to: '/admin/usuarios', icon: Users },
    { title: 'Métricas', to: '/admin/metricas', icon: BarChart3 },
    { title: 'Auditoria', to: '/admin/auditoria', icon: FileText },
  ];

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
            end={item.to === '/admin'}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default function AdminLayout() {
  const { user, usuario, logout } = useSupabaseAuth();
  const [open, setOpen] = useState(false);

  const allowedEmails = useMemo(() => parseCsv(import.meta.env.VITE_ADMIN_EMAILS), []);
  const email = (user?.email || usuario?.email || '').trim().toLowerCase();
  const isAdmin = !!email && allowedEmails.includes(email);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container-responsive p-4 sm:p-8">
          <div className="max-w-xl mx-auto rounded-xl border border-destructive/30 bg-card p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-destructive/10 p-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold">Acesso restrito</div>
                <div className="text-sm text-muted-foreground">
                  Esta área é exclusiva do administrador. Configure VITE_ADMIN_EMAILS e ADMIN_EMAILS para habilitar.
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline">
                <Link to="/">Voltar</Link>
              </Button>
              <Button onClick={() => void logout()} variant="destructive">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/70 backdrop-blur-xl">
          <div className="flex items-center gap-2 p-4 border-b border-border/50">
            <AppLogo size={28} rounded="xl" />
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">Admin</div>
              <div className="text-xs text-muted-foreground truncate">{email}</div>
            </div>
          </div>
          <div className="flex-1 p-3">
            <AdminNav />
          </div>
          <div className="p-3 border-t border-border/50">
            <Button onClick={() => void logout()} variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-border/50 bg-card/70 backdrop-blur-xl px-3 sm:px-6">
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="btn-touch">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="flex items-center gap-2 p-4 border-b border-border/50">
                    <AppLogo size={28} rounded="xl" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">Admin</div>
                      <div className="text-xs text-muted-foreground truncate">{email}</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <AdminNav onNavigate={() => setOpen(false)} />
                  </div>
                  <div className="p-3 border-t border-border/50">
                    <Button onClick={() => void logout()} variant="outline" className="w-full justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">Área Administrativa</div>
              <div className="text-xs text-muted-foreground truncate">Acesso exclusivo</div>
            </div>

            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/">Ir para o App</Link>
            </Button>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container-responsive p-3 sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

