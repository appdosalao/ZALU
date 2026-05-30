import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const schema = z.object({
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmar_senha: z.string().min(6, 'A confirmação deve ter pelo menos 6 caracteres'),
}).refine((data) => data.senha === data.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

type FormValues = z.infer<typeof schema>;

export function ConfiguracaoConta() {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.senha });
      if (error) throw error;
      toast.success('Senha atualizada com sucesso.');
      reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível atualizar a senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta</CardTitle>
        <CardDescription>
          {user?.email ? `E-mail: ${user.email}` : 'Gerencie dados de conta e segurança.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Alterar senha'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

