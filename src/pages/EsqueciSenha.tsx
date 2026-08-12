import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PageMeta } from '@/components/seo/PageMeta';

const esqueceuSenhaSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type FormValues = z.infer<typeof esqueceuSenhaSchema>;

const EsqueciSenha = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(esqueceuSenhaSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/redefinir-senha')}`;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      if (/rate limit/i.test(raw)) {
        setErrorMessage('Limite de envio de e-mails atingido. Aguarde alguns minutos e tente novamente.');
      } else if (/smtp|email (provider|sending)/i.test(raw) || /unable to validate email/i.test(raw)) {
        setErrorMessage(`O serviço de e-mail não respondeu (configuração de SMTP no Supabase): ${raw}`);
      } else {
        setErrorMessage(raw);
      }
      toast.error('Não foi possível enviar o e-mail de recuperação. Verifique a mensagem abaixo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <img src="/images/zalu-wordmark.png" alt="ZALU" className="h-12 w-auto object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold">E-mail Enviado</CardTitle>
            <CardDescription>
              Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha
            </CardDescription>
            <p className="text-xs text-muted-foreground pt-2">
              Não recebeu? Verifique a caixa de spam/lixeira. Se enviou várias vezes seguidas, pode ser limite de segurança — aguarde alguns minutos.
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Link to="/login" className="text-primary hover:underline font-medium">
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <PageMeta
        title="Esqueci Minha Senha — ZALU"
        description="Receba instruções para recuperar sua senha no ZALU."
        path="/esqueci-senha"
        noindex
      />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <img src="/images/zalu-wordmark.png" alt="ZALU" className="h-12 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Esqueci Minha Senha</CardTitle>
          <CardDescription>
            Digite seu e-mail para receber as instruções de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive font-medium">
                {errorMessage}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Instruções'}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary underline">
                Voltar para o login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EsqueciSenha;
