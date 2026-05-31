import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Calendar, Clock, User } from 'lucide-react';

export default function AdminPlanejador() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Planejador</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Em desenvolvimento: criação de tarefas, prazos, atribuição de responsáveis e acompanhamento de progresso
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
