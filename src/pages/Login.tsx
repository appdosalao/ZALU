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
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AuthFooter } from '@/components/branding/AuthFooter';
import { Badge } from '@/components/ui/badge';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UsuarioLogin>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const infoMessage = useMemo(() => {
    if (searchParams.get('password_updated') === '1') return 'Senha atualizada. Faça login novamente.';
    if (searchParams.get('confirmed') === '1') return 'E-mail confirmado. Você já pode entrar.';
    if (searchParams.get('check_email') === '1') return 'Conta criada. Verifique seu e-mail para confirmar e depois faça login.';
    return '';
  }, [searchParams]);

  const onSubmit = async (data: UsuarioLogin) => {
    setIsLoading(true);
    setError('');

    try {
      const ok = await login(data.email, data.senha);
      if (ok) {
        navigate(redirect);
      } else {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
      }
    } catch {
      setError('Ocorreu um erro ao tentar entrar. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-[clamp(0.75rem,3vw,2rem)] md:p-[clamp(1rem,4vw,3rem)]">
      <div className="w-full max-w-md lg:max-w-6xl grid lg:grid-cols-2 items-center gap-[clamp(1rem,4vw,4rem)]">

        {/* Lado Esquerdo - Boas-vindas & Branding (exibido a partir de lg/tablet paisagem+) */}
        <div className="hidden lg:flex flex-col space-y-[clamp(1.25rem,4vw,2.5rem)] animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-[clamp(0.75rem,3vw,1.75rem)]">
            <div className="inline-flex items-center gap-2 px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.35rem,1.2vw,0.55rem)] rounded-full bg-primary/10 text-primary">
              <Sparkles style={{ width: 'clamp(0.9rem, 2vw, 1.2rem)', height: 'clamp(0.9rem, 2vw, 1.2rem)' }} />
              <span className="font-semibold text-responsive-sm">Bem-vinda(o) de volta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.08]">
              Acesse sua conta no <br className="hidden xl:block" />
              <span className="text-primary">ZALU</span>
            </h1>
            <p className="text-muted-foreground max-w-[30ch] lg:max-w-md" style={{ fontSize: 'clamp(0.95rem, 2.6vw, 1.25rem)', lineHeight: '1.55' }}>
              Continue transformando a gestão do seu negócio com as ferramentas mais modernas do mercado.
            </p>
          </div>

          <div className="grid gap-[clamp(0.75rem,3vw,1.25rem)]">
            <div className="flex gap-3 md:gap-4 items-start md:items-center p-[clamp(0.75rem,3vw,1.25rem)] rounded-[clamp(1rem,3vw,1.5rem)] bg-card border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30">
              <div
                className="rounded-[clamp(0.7rem,2vw,1rem)] bg-primary/10 flex items-center justify-center flex-shrink-0"
                style={{ width: 'clamp(2.5rem, 6vw, 3.5rem)', height: 'clamp(2.5rem, 6vw, 3.5rem)' }}
              >
                <Zap className="text-primary" style={{ width: 'clamp(1.1rem, 3vw, 1.6rem)', height: 'clamp(1.1rem, 3vw, 1.6rem)' }} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold" style={{ fontSize: 'clamp(0.9rem, 2.4vw, 1.1rem)' }}>Acesso Rápido</h3>
                <p className="text-muted-foreground text-responsive-sm md:text-responsive-base">
                  Sincronização em tempo real em todos os seus dispositivos.
                </p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 items-start md:items-center p-[clamp(0.75rem,3vw,1.25rem)] rounded-[clamp(1rem,3vw,1.5rem)] bg-card border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30">
              <div
                className="rounded-[clamp(0.7rem,2vw,1rem)] bg-primary/10 flex items-center justify-center flex-shrink-0"
                style={{ width: 'clamp(2.5rem, 6vw, 3.5rem)', height: 'clamp(2.5rem, 6vw, 3.5rem)' }}
              >
                <ShieldCheck className="text-primary" style={{ width: 'clamp(1.1rem, 3vw, 1.6rem)', height: 'clamp(1.1rem, 3vw, 1.6rem)' }} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold" style={{ fontSize: 'clamp(0.9rem, 2.4vw, 1.1rem)' }}>Ambiente Seguro</h3>
                <p className="text-muted-foreground text-responsive-sm md:text-responsive-base">
                  Seus dados estão protegidos com segurança de nível bancário.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-[clamp(1rem,4vw,2rem)] border-t border-border/50">
            <p className="text-muted-foreground text-responsive-sm md:text-responsive-base">
              Não é profissional?{' '}
              <Link to="/agendamento-online" className="text-primary font-bold hover:underline underline-offset-2">
                Agende um serviço aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Lado Direito - Card de Login (sempre visível) */}
        <div className="flex flex-col w-full mx-auto max-w-[min(100%,28rem)] lg:max-w-md animate-in fade-in zoom-in duration-500">
          <Card className="shadow-xl md:shadow-2xl border border-primary/10 overflow-hidden backdrop-blur-xl bg-card/95 rounded-[clamp(1rem,3vw,1.5rem)]">
            <CardHeader
              className="space-y-[clamp(0.6rem,2.5vw,1.1rem)] text-center pt-[clamp(1.5rem,6vw,3rem)] px-[clamp(1rem,4vw,2.5rem)]"
            >
              {/* Logo com dimensões significativamente aumentadas */}
              <div
                className="flex justify-center mb-[clamp(0.75rem,3vw,1.75rem)]"
              >
                <div
                  className="rounded-[clamp(1rem,3vw,1.75rem)] bg-primary/10 ring-[4px] md:ring-[6px] ring-primary/10"
                  style={{ padding: 'clamp(0.65rem, 2.5vw, 1.25rem)', boxShadow: 'none' }}
                >
                  <div
                    className="overflow-hidden rounded-[clamp(0.7rem,2vw,1.25rem)] border-2 border-primary/40 bg-muted"
                    style={{
                      width: 'clamp(5rem, 22vw, 10rem)',
                      height: 'clamp(5rem, 22vw, 10rem)',
                      backgroundColor: 'hsl(var(--primary))',
                    }}
                  >
                    <img
                      src="/icons/icon-72x72.png"
                      alt="ZALU"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <CardTitle className="text-3xl font-bold tracking-tight">
                Fazer Login
              </CardTitle>
              <CardDescription className="text-muted-foreground" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.05rem)' }}>
                Insira suas credenciais para acessar seu painel
              </CardDescription>
            </CardHeader>

            <CardContent className="px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(1.5rem,6vw,3rem)]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-[clamp(0.85rem,3.5vw,1.75rem)]"
              >
                {infoMessage && (
                  <Alert className="animate-in slide-in-from-top-2 duration-300 p-[clamp(0.6rem,2.4vw,1rem)] rounded-xl border-primary/20 bg-primary/5">
                    <AlertDescription className="font-medium text-responsive-sm md:text-responsive-base">
                      {infoMessage}
                    </AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300 p-[clamp(0.6rem,2.4vw,1rem)] rounded-xl">
                    <AlertDescription className="font-medium text-responsive-sm md:text-responsive-base">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-[clamp(0.7rem,3vw,1.25rem)]">
                  {/* Campo E-mail */}
                  <div className="space-y-[clamp(0.3rem,1.2vw,0.5rem)]">
                    <Label
                      htmlFor="email"
                      className="font-semibold"
                      style={{ fontSize: 'clamp(0.8rem, 2.3vw, 0.95rem)' }}
                    >
                      E-mail
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        {...register('email')}
                        disabled={isLoading}
                        className="rounded-xl bg-muted/30 border-border/60 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-200 placeholder:text-muted-foreground/70 text-responsive-base md:text-responsive-lg"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive font-medium mt-1 text-responsive-xs md:text-responsive-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Campo Senha */}
                  <div className="space-y-[clamp(0.3rem,1.2vw,0.5rem)]">
                    <div className="flex items-center justify-between gap-2">
                      <Label
                        htmlFor="senha"
                        className="font-semibold"
                        style={{ fontSize: 'clamp(0.8rem, 2.3vw, 0.95rem)' }}
                      >
                        Senha
                      </Label>
                      <Link
                        to="/esqueci-senha"
                        className="text-primary hover:underline underline-offset-2 font-semibold text-responsive-xs md:text-responsive-sm shrink-0"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Input
                        id="senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...register('senha')}
                        disabled={isLoading}
                        className="rounded-xl bg-muted/30 border-border/60 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all duration-200 placeholder:text-muted-foreground/70 pr-[clamp(2.5rem,7vw,3.5rem)] text-responsive-base md:text-responsive-lg"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute touch-target rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 active:bg-muted transition-colors flex items-center justify-center"
                        style={{
                          right: 'clamp(0.35rem, 1.4vw, 0.75rem)',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword
                          ? <EyeOff style={{ width: 'clamp(0.9rem, 2.6vw, 1.15rem)', height: 'clamp(0.9rem, 2.6vw, 1.15rem)' }} />
                          : <Eye style={{ width: 'clamp(0.9rem, 2.6vw, 1.15rem)', height: 'clamp(0.9rem, 2.6vw, 1.15rem)' }} />}
                      </button>
                    </div>
                    {errors.senha && (
                      <p className="text-destructive font-medium mt-1 text-responsive-xs md:text-responsive-sm">
                        {errors.senha.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Lembrar-me */}
                <div className="flex items-center gap-2 md:gap-3">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(c) => setRememberMe(!!c)}
                    className="rounded border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      width: 'clamp(1rem, 3vw, 1.25rem)',
                      height: 'clamp(1rem, 3vw, 1.25rem)',
                    }}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-muted-foreground cursor-pointer select-none text-responsive-xs md:text-responsive-sm"
                  >
                    Lembrar-me neste dispositivo
                  </Label>
                </div>

                {/* Botão Principal Entrar */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-touch h-12 text-base w-full rounded-xl md:rounded-2xl text-white font-bold shadow-lg shadow-primary/20 hover:shadow-[0_12px_30px_-8px_hsl(var(--primary)/0.45)] hover:scale-[1.015] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">Acessando...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-white">
                      Entrar no Sistema
                      <ArrowRight style={{ width: 'clamp(1rem, 3vw, 1.4rem)', height: 'clamp(1rem, 3vw, 1.4rem)' }} />
                    </span>
                  )}
                </Button>

                {/* Divisor */}
                <div className="relative py-[clamp(0.6rem,2.5vw,1.25rem)]">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center uppercase tracking-wider" style={{ fontSize: 'clamp(0.6rem, 2vw, 0.75rem)' }}>
                    <span className="bg-card px-[clamp(0.5rem,2vw,0.85rem)] text-muted-foreground font-semibold">
                      Ainda não tem acesso?
                    </span>
                  </div>
                </div>

                {/* Botão Secundário Criar Conta */}
                <Button
                  asChild
                  variant="outline"
                  className="h-12 text-base w-full rounded-xl md:rounded-2xl border-2 border-primary/25 hover:bg-primary/5 hover:border-primary/50 text-white font-bold hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group"
                >
                  <Link to="/cadastro" className="flex items-center justify-center gap-2">
                    Criar Conta Grátis
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-white text-primary border-none group-hover:bg-primary group-hover:text-white transition-colors"
                      style={{
                        height: 'clamp(1.15rem, 3.5vw, 1.5rem)',
                        paddingLeft: 'clamp(0.4rem, 1.5vw, 0.65rem)',
                        paddingRight: 'clamp(0.4rem, 1.5vw, 0.65rem)',
                        fontSize: 'clamp(0.6rem, 1.8vw, 0.7rem)',
                      }}
                    >
                      7 DIAS
                    </Badge>
                  </Link>
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-[clamp(1.25rem,5vw,2.5rem)] flex justify-center w-full">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
