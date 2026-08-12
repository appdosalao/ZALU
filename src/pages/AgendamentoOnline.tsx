import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';

// Lazy load do formulário para evitar problemas de carregamento
const AgendamentoOnlineForm = React.lazy(() => 
  import('@/components/agendamento-online/AgendamentoOnlineForm').then(module => ({
    default: module.AgendamentoOnlineForm
  }))
);

export default function AgendamentoOnline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <PageMeta
        title="Agendamento Online — ZALU"
        description="Agende seu horário no salão de forma rápida e prática: escolha o serviço, o profissional e o horário disponível em poucos cliques."
        path="/agendamento-online"
        keywords="agendamento online salão de beleza, marcar horário cabeleireiro, agendar manicure, reservar horário salão, agenda online"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Agendamento Online para Salões de Beleza',
          provider: { '@type': 'Organization', name: 'ZALU' },
          url: 'https://www.zalu.app.shop/agendamento-online',
          areaServed: 'BR',
          description: 'Agendamento online de serviços de beleza: corte, coloração, manicure, pedicure, escova e muito mais.',
        }}
      />
      <div className="max-w-2xl mx-auto">
        <Suspense 
          fallback={
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">Carregando...</CardTitle>
                <CardDescription>
                  Preparando o formulário de agendamento
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </CardContent>
            </Card>
          }
        >
          <AgendamentoOnlineForm />
        </Suspense>
      </div>
    </div>
  );
}
