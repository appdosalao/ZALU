import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { usuario, logout } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen scroll-smooth bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950 lg:flex">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold tracking-wide">ZALU</p>
              <p className="text-xs text-slate-400">Painel administrativo</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6" aria-label="Navegação administrativa">
            <a
              href="#visao-geral"
              className="flex items-center gap-3 rounded-xl bg-violet-500/15 px-4 py-3 text-sm font-medium text-violet-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              Visão geral
            </a>
            <a
              href="#contas-clientes"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Users className="h-4 w-4" />
              Contas e assinaturas
            </a>
          </nav>

          <div className="space-y-3 border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-sm font-bold text-violet-200">
                {usuario?.nome_completo?.slice(0, 1).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">
                  {usuario?.nome_completo || 'Administrador'}
                </p>
                <p className="truncate text-xs text-slate-500" title={usuario?.email}>
                  {usuario?.email}
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Sistema do salão
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-400 hover:bg-white/5 hover:text-white"
              onClick={() => void handleLogout()}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 bg-slate-900">
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <ShieldCheck className="h-5 w-5 text-violet-300" />
              <div>
                <p className="text-sm font-semibold">ZALU Admin</p>
                <p className="max-w-44 truncate text-xs text-slate-400">{usuario?.email}</p>
              </div>
            </div>
            <p className="hidden text-sm text-slate-400 lg:block">
              Administração da plataforma
            </p>
            <div className="flex items-center gap-2 lg:hidden">
              <Button asChild size="sm" variant="ghost" className="text-slate-300">
                <Link to="/" aria-label="Voltar ao sistema do salão">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sistema</span>
                </Link>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-300"
                onClick={() => void handleLogout()}
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <nav
            className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-2 lg:hidden"
            aria-label="Navegação administrativa"
          >
            <a
              href="#visao-geral"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-500/15 px-3 py-2 text-xs font-medium text-violet-200"
            >
              <LayoutDashboard className="h-4 w-4" />
              Visão geral
            </a>
            <a
              href="#contas-clientes"
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Users className="h-4 w-4" />
              Contas e assinaturas
            </a>
          </nav>

          <main className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
