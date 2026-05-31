import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminConfiguracoes() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais da Plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento: ajustes de layout, funcionalidades por plano, regras de acesso e ferramentas de manutenção
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Alterações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em desenvolvimento: registro de todas as alterações nas configurações para rastreabilidade
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
