import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Check } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';
import {
  PASSWORD_RULES,
  isStrongPassword,
  passwordStrength,
  strongPasswordSchema,
} from '@/lib/passwordPolicy';

const schema = z.object({
  senha: strongPasswordSchema(),
  confirmar_senha: z.string().min(1, 'A confirmação é obrigatória'),
}).refine((data) => data.senha === data.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

type FormValues = z.infer<typeof schema>;

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const senhaValor = watch('senha') || '';
  const strength = passwordStrength(senhaValor);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setChecking(false);
    };
    void run();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.senha });
      if (error) throw error;

      toast.success('Senha atualizada com sucesso. Faça login novamente.');
      const { error: signOutLocalError } = await supabase.auth.signOut({ scope: 'local' });
      if (signOutLocalError) {
        await supabase.auth.signOut();
      }
      navigate('/login?password_updated=1', { replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível atualizar a senha.');
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <img src="/images/zalu-wordmark.png" alt="ZALU" className="h-12 w-auto object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold">Link inválido ou expirado</CardTitle>
            <CardDescription>
              Solicite novamente o e-mail de recuperação para redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/esqueci-senha">Solicitar novo link</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Voltar para o login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <PageMeta
        title="Redefinir Senha — ZALU"
        description="Defina uma nova senha para sua conta no ZALU."
        path="/redefinir-senha"
        noindex
      />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <img src="/images/zalu-wordmark.png" alt="ZALU" className="h-12 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>Escolha uma nova senha para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha">Nova senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  {...register('senha')}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {senhaValor ? (
                <>
                  <Progress value={strength.score} className="h-1.5 mt-2" />
                  <p className={`text-xs font-semibold mt-1 ${isStrongPassword(senhaValor) ? 'text-green-600' : 'text-amber-600'}`}>
                    Força: {strength.label}
                  </p>
                </>
              ) : null}
              <ul className="space-y-1 mt-1">
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(senhaValor);
                  return (
                    <li
                      key={rule.key}
                      className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : senhaValor ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                      {ok ? <Check className="h-3.5 w-3.5" /> : (
                        <span className="inline-block w-3.5 h-3.5 rounded-full border border-current" />
                      )}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
              {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar_senha">Confirmar nova senha</Label>
              <Input id="confirmar_senha" type="password" {...register('confirmar_senha')} disabled={isLoading} />
              {errors.confirmar_senha && <p className="text-sm text-destructive">{errors.confirmar_senha.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar nova senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

