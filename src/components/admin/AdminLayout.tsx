import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, LogOut, Menu, Share2, ShieldCheck, Users, X } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { usuario, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOverview = location.pathname === '/admin';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sessão administrativa encerrada.');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('[Admin] Falha ao encerrar sessão:', error);
      toast.error('Não foi possível encerrar a sessão. Tente novamente.');
    }
  };

  const navigation = (
    <nav className="flex-1 space-y-2 px-4 py-6" aria-label="Navegação administrativa">
      <Link
        to="/admin"
        onClick={() => setMobileMenuOpen(false)}
        aria-current={isOverview ? 'page' : undefined}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
          isOverview
            ? 'bg-violet-500/15 text-violet-100'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <LayoutDashboard className="h-4 w-4" />
        Visão geral
      </Link>
      <Link
        to="/admin#contas-clientes"
        onClick={() => setMobileMenuOpen(false)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
      >
        <Users className="h-4 w-4" />
        Contas e assinaturas
      </Link>
      <Link
        to="/admin/divulgadores"
        onClick={() => setMobileMenuOpen(false)}
        aria-current={!isOverview ? 'page' : undefined}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
          !isOverview
            ? 'bg-violet-500/15 text-violet-100'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Share2 className="h-4 w-4" />
        Divulgadores
      </Link>
    </nav>
  );

  const accountCard = (
    <>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-sm font-bold text-violet-100">
          {usuario?.nome_completo?.slice(0, 1).toUpperCase() || 'A'}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-100">
            {usuario?.nome_completo || 'Administrador'}
          </p>
          <p className="truncate text-xs text-slate-300" title={usuario?.email}>
            {usuario?.email}
          </p>
        </div>
      </div>
      <Button
        asChild
        variant="ghost"
        className="w-full justify-start gap-3 text-slate-200 hover:bg-white/5 hover:text-white focus-visible:ring-violet-300"
      >
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <ArrowLeft className="h-4 w-4" />
          Sistema do salão
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-slate-200 hover:bg-white/5 hover:text-white focus-visible:ring-violet-300"
        onClick={() => void handleLogout()}
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </>
  );

  return (
    <div className="min-h-screen scroll-smooth bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950 lg:flex">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold tracking-wide">ZALU</p>
              <p className="text-xs text-slate-400">Painel administrativo</p>
            </div>
          </div>
          {navigation}
          <div className="space-y-3 border-t border-white/10 p-4">{accountCard}</div>
        </aside>

        <div className="min-w-0 flex-1 bg-slate-900">
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-100 hover:bg-white/10 focus-visible:ring-violet-300 lg:hidden"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? 'Fechar menu administrativo' : 'Abrir menu administrativo'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <ShieldCheck className="hidden h-5 w-5 shrink-0 text-violet-300 lg:block" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Administração da plataforma
                </p>
                <p className="max-w-56 truncate text-xs text-slate-300 sm:max-w-none">
                  {usuario?.nome_completo || 'Administrador'} · {usuario?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="hidden gap-2 text-slate-200 hover:bg-white/10 hover:text-white focus-visible:ring-violet-300 sm:inline-flex"
              onClick={() => void handleLogout()}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </header>

          {mobileMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Fechar menu"
                className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <aside className="fixed inset-y-0 left-0 z-40 flex w-[min(19rem,88vw)] flex-col border-r border-white/10 bg-slate-950 shadow-2xl lg:hidden">
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold tracking-wide">ZALU</p>
                      <p className="text-xs text-slate-300">Painel administrativo</p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {navigation}
                <div className="space-y-3 border-t border-white/10 p-4">{accountCard}</div>
              </aside>
            </>
          )}

          <main className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
