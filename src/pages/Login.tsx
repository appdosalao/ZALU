import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { UsuarioLogin } from '@/types/usuario';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Zap, LockKeyhole } from 'lucide-react';
import { AuthFooter } from '@/components/branding/AuthFooter';
import { Badge } from '@/components/ui/badge';
import { PageMeta } from '@/components/seo/PageMeta';
import { storage, LOCAL_STORAGE_KEYS } from '@/lib/localStorage';
import { ADMIN_EMAIL, isAdminEmail } from '@/config/adminAccess';
import {
  getLoginLockRemainingMs,
  getRemainingLoginAttempts,
  recordLoginFailure,
  recordLoginSuccess,
  formatLockCountdown,
} from '@/lib/passwordPolicy';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

const Login = ({ adminMode = false }: { adminMode?: boolean }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = adminMode ? '/admin' : searchParams.get('redirect') || '/';
  const { login, isAuthenticated, isLoading: authLoading, usuario, user } = useSupabaseAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockRemainingMs, setLockRemainingMs] = useState(0);

  const isBlocked = lockRemainingMs > 0;

  // Ticker do countdown do bloqueio
  useEffect(() => {
    if (!isBlocked) return;
    const interval = window.setInterval(() => {
      setLockRemainingMs((prev) => {
        if (prev <= 1000) {
          setError('');
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isBlocked]);

  const { register, handleSubmit, formState: { errors } } = useForm<UsuarioLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: adminMode ? { email: ADMIN_EMAIL, senha: '' } : undefined,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Apply theme if exists in localStorage
  useEffect(() => {
    const savedTheme = storage.getString(LOCAL_STORAGE_KEYS.APP_THEME);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (!adminMode || isAdminEmail(user?.email ?? usuario?.email)) {
        navigate(redirect, { replace: true });
      }
    }
  }, [adminMode, authLoading, isAuthenticated, navigate, redirect, user?.email, usuario?.email]);

  const infoMessage = useMemo(() => {
    if (searchParams.get('password_updated') === '1') return 'Senha atualizada. Faça login novamente.';
    if (searchParams.get('confirmed') === '1') return 'E-mail confirmado. Você já pode entrar.';
    if (searchParams.get('check_email') === '1') return 'Conta criada. Verifique seu e-mail para confirmar e depois faça login.';
    return '';
  }, [searchParams]);

  const onSubmit = async (data: UsuarioLogin) => {
    const email = data.email.trim();

    if (adminMode && !isAdminEmail(email)) {
      setError('Este acesso é exclusivo da conta administrativa autorizada.');
      return;
    }

    // Bloqueio ativo: não faz nem a chamada de autenticação
    const lockMs = getLoginLockRemainingMs(email);
    if (lockMs > 0) {
      setLockRemainingMs(lockMs);
      setError(`Muitas tentativas de login. Tente novamente em ${formatLockCountdown(lockMs)}.`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const ok = await login(email, data.senha);
      if (ok) {
        recordLoginSuccess(email);
        navigate(redirect);
      } else {
        const nextLockMs = recordLoginFailure(email);
        if (nextLockMs > 0) {
          setLockRemainingMs(nextLockMs);
          setError(`Muitas tentativas de login. Tente novamente em ${formatLockCountdown(nextLockMs)}.`);
        } else {
          const remaining = getRemainingLoginAttempts(email);
          setError(
            remaining > 0
              ? `E-mail ou senha incorretos. Mais ${remaining} tentativa(s) antes do bloqueio temporário.`
              : 'E-mail ou senha incorretos. Verifique suas credenciais.'
          );
        }
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar entrar. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={adminMode
      ? 'min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-slate-950 to-slate-950 p-4 sm:p-8'
      : 'min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4 lg:p-8'}>
      <PageMeta
        title={adminMode ? 'Acesso administrativo — ZALU' : 'Entrar — ZALU'}
        description={adminMode ? 'Acesso seguro ao painel administrativo do ZALU.' : 'Acesse sua conta no ZALU, o sistema de gestão para salões de beleza.'}
        path={adminMode ? '/admin/login' : '/login'}
        noindex
      />
      <div className={adminMode ? 'w-full max-w-md' : 'w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center'}>
        {adminMode ? (
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-200 shadow-lg shadow-violet-950/30">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Área restrita</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Acesso administrativo</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Entre com o e-mail e a senha da conta administradora para acessar os indicadores da plataforma.
            </p>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Bem-vinda(o) de volta
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Acesse sua conta no <br />
                <span className="text-primary">ZALU</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Continue transformando a gestão do seu negócio com as ferramentas mais modernas do mercado.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex gap-4 items-center p-4 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Acesso Rápido</h3>
                  <p className="text-sm text-muted-foreground">Sincronização em tempo real em todos os seus dispositivos.</p>
                </div>
              </div>

              <div className="flex gap-4 items-center p-4 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Ambiente Seguro</h3>
                  <p className="text-sm text-muted-foreground">Seus dados estão protegidos com segurança de nível bancário.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Não é profissional?{' '}
                <span className="font-medium text-foreground/80">
                  Utilize o link de agendamento fornecido pelo seu salão.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Lado Direito - Card de Login */}
        <div className="flex flex-col animate-in fade-in zoom-in duration-500">
          <Card className={adminMode
            ? 'overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl shadow-black/30 backdrop-blur'
            : 'shadow-2xl border-primary/10 overflow-hidden backdrop-blur-sm bg-card/95'}>
            <CardHeader className={adminMode ? 'space-y-2 text-center pt-8' : 'space-y-2 text-center pt-10'}>
              <div className="flex justify-center mb-4">
                {adminMode ? (
                  <span className="text-xl font-black tracking-[0.24em] text-white">ZALU</span>
                ) : (
                  <img
                    src="/images/zalu-wordmark.png"
                    alt="ZALU"
                    className="h-12 w-auto object-contain"
                  />
                )}
              </div>
              <CardTitle className={adminMode ? 'text-2xl font-bold tracking-tight text-white' : 'text-3xl font-bold tracking-tight'}>
                {adminMode ? 'Entrar no painel' : 'Fazer Login'}
              </CardTitle>
              <CardDescription className={adminMode ? 'text-sm text-slate-400' : 'text-base'}>
                {adminMode ? 'Use suas credenciais administrativas.' : 'Insira suas credenciais para acessar seu painel'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className={adminMode ? 'px-6 pb-8 sm:px-8' : 'px-8 pb-10'}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {infoMessage && (
                  <Alert className="animate-in slide-in-from-top-2 duration-300">
                    <AlertDescription className="text-sm font-medium">{infoMessage}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert
                    variant="destructive"
                    className={`animate-in slide-in-from-top-2 duration-300 ${adminMode ? 'border-red-300/20 bg-red-950/50 text-red-100 [&>svg]:text-red-300' : ''}`}
                  >
                    <AlertDescription className={`text-sm font-medium ${adminMode ? 'text-red-100/80' : ''}`}>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={`text-sm font-semibold ${adminMode ? 'text-slate-200' : ''}`}>E-mail</Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder={adminMode ? ADMIN_EMAIL : 'seu@email.com'}
                        {...register('email')}
                        disabled={isLoading || isBlocked}
                        className={adminMode
                          ? 'h-12 border-white/10 bg-slate-950/60 text-white placeholder:text-slate-600 focus-visible:ring-violet-400'
                          : 'h-12 bg-muted/30 border-border/50 focus:bg-background transition-all'}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="senha" className={`text-sm font-semibold ${adminMode ? 'text-slate-200' : ''}`}>Senha</Label>
                      <Link
                        to="/esqueci-senha"
                        className={`text-xs font-semibold hover:underline ${adminMode ? 'text-violet-300' : 'text-primary'}`}
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Input
                        id="senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('senha')}
                        disabled={isLoading || isBlocked}
                        className={adminMode
                          ? 'h-12 border-white/10 bg-slate-950/60 pr-10 text-white placeholder:text-slate-600 focus-visible:ring-violet-400'
                          : 'h-12 bg-muted/30 border-border/50 focus:bg-background transition-all'}
                      />
                      <button
                        type="button"
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${adminMode ? 'text-slate-500 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.senha && (
                      <p className="text-xs text-destructive font-medium mt-1">{errors.senha.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe} 
                    onCheckedChange={(c) => setRememberMe(!!c)} 
                    className={adminMode
                      ? 'border-slate-600 data-[state=checked]:border-violet-400 data-[state=checked]:bg-violet-500'
                      : 'border-primary data-[state=checked]:bg-primary'}
                  />
                  <Label htmlFor="remember" className={`cursor-pointer select-none text-sm ${adminMode ? 'text-slate-400' : 'text-muted-foreground'}`}>
                    Lembrar-me neste dispositivo
                  </Label>
                </div>

                <Button
                  type="submit" 
                  className={adminMode
                    ? 'h-12 w-full rounded-xl bg-violet-500 text-base font-semibold text-white shadow-lg shadow-violet-950/30 transition-all hover:bg-violet-400 active:scale-[0.99]'
                    : 'w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 btn-3d'}
                  disabled={isLoading || isBlocked}
                >
                  {isBlocked ? (
                    <span className="flex items-center gap-2 text-white">Aguardar {formatLockCountdown(lockRemainingMs)}</span>
                  ) : isLoading ? (
                    <span className="flex items-center gap-2">Acessando...</span>
                  ) : (
                    <span className="flex items-center gap-2 text-white">
                      {adminMode ? 'Entrar como administrador' : 'Entrar no Sistema'}
                      <ArrowRight className="ml-1 h-5 w-5" />
                    </span>
                  )}
                </Button>

                {adminMode ? (
                  <Button asChild variant="ghost" className="w-full text-slate-400 hover:bg-white/5 hover:text-white">
                    <Link to="/login">Voltar ao login do sistema</Link>
                  </Button>
                ) : (
                  <>
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground font-medium">Ainda não tem acesso?</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-14 text-lg font-bold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/50 hover:scale-[1.01] active:scale-[0.99] transition-all text-primary group"
                    >
                      <Link to="/cadastro" className="flex items-center justify-center gap-2">
                        Criar Conta Grátis
                        <Badge variant="secondary" className="ml-1 text-[11px] h-5 px-2 bg-primary/10 text-primary border-none group-hover:bg-primary group-hover:text-white transition-colors">7 DIAS</Badge>
                      </Link>
                    </Button>
                    <div className="pt-1 text-center">
                      <Link
                        to="/admin/login"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <LockKeyhole className="h-3 w-3" />
                        Acesso administrativo
                      </Link>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <div className={adminMode ? '[&_div]:text-slate-500 [&_a:hover]:text-slate-300' : undefined}>
              <AuthFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

export function AdminLogin() {
  return <Login adminMode />;
}
