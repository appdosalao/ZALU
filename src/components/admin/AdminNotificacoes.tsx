import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, MessageSquare } from 'lucide-react';

export default function AdminNotificacoes() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Notificações e Suporte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Enviar Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Em desenvolvimento: enviar notificações push, e-mail e in-app personalizadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Sistema de Suporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Em desenvolvimento: centralizar solicitações, responder diretamente e histórico de atendimentos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
