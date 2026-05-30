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
import { AppLogo } from '@/components/branding/AppLogo';

const schema = z.object({
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmar_senha: z.string().min(6, 'A confirmação deve ter pelo menos 6 caracteres'),
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

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

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
              <AppLogo size={48} rounded="xl" />
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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <AppLogo size={48} rounded="xl" />
          </div>
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>Escolha uma nova senha para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha">Nova senha</Label>
              <Input id="senha" type="password" {...register('senha')} disabled={isLoading} />
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

