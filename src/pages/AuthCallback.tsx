import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageMeta } from '@/components/seo/PageMeta';

type CallbackStatus = 'loading' | 'error';
type OtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change';

const isOtpType = (value: string | null): value is OtpType => {
  return value === 'signup' || value === 'invite' || value === 'magiclink' || value === 'recovery' || value === 'email_change';
};

// Apenas permite redirecionar para rotas internas (evita open redirect via query string).
const sanitizeNextPath = (next: string | null): string | undefined => {
  if (!next) return undefined;
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\') || /^[a-z]+:/i.test(next)) {
    return undefined;
  }
  return next;
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const params = useMemo(() => {
    return {
      code: searchParams.get('code'),
      token_hash: searchParams.get('token_hash'),
      type: searchParams.get('type'),
      next: searchParams.get('next'),
    };
  }, [searchParams]);

  useEffect(() => {
    const run = async () => {
      // Remove token/code sensíveis da URL o mais cedo possível para reduzir a exposição
      // (o valor já foi lido via useMemo acima e webbrowser history não é recarregado).
      window.history.replaceState(null, '', window.location.pathname);

      const next = sanitizeNextPath(params.next);

      try {
        if (params.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(params.code);
          if (error) throw error;
        } else if (params.token_hash && isOtpType(params.type)) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: params.token_hash,
            type: params.type,
          });
          if (error) throw error;
        }

        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;

        if (params.type === 'recovery') {
          toast.success('Link verificado. Defina sua nova senha.');
          navigate(next || '/redefinir-senha', { replace: true });
          return;
        }

        if (params.type === 'signup') {
          toast.success('E-mail confirmado com sucesso.');
          navigate(hasSession ? next || '/' : '/login?confirmed=1', { replace: true });
          return;
        }

        if (params.type === 'email_change') {
          toast.success('E-mail alterado com sucesso.');
          navigate(next || '/configuracoes?tab=conta', { replace: true });
          return;
        }

        toast.success('Autenticação concluída.');
        navigate(next || '/', { replace: true });
      } catch (err: unknown) {
        setStatus('error');
        const message = err instanceof Error ? err.message : 'Não foi possível concluir a autenticação.';
        setErrorMessage(message);
        toast.error(message);
      }
    };

    void run();
  }, [navigate, params]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <img src="/images/zalu-wordmark.png" alt="ZALU" className="h-12 w-auto object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold">Não foi possível continuar</CardTitle>
            <CardDescription>{errorMessage || 'Tente novamente.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/login">Ir para o login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/esqueci-senha">Recuperar senha</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <PageMeta
        title="Confirmando acesso — ZALU"
        description="Validando seu acesso ao ZALU."
        path="/auth/callback"
        noindex
      />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <img src="/images/zalu-wordmark.png" alt="ZALU" className="h-12 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Processando…</CardTitle>
          <CardDescription>Estamos validando seu acesso.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    </div>
  );
}

