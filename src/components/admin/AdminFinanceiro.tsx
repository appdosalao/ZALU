import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

export default function AdminFinanceiro() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
            </div>
            <p className="text-3xl font-bold text-emerald-800">R$ 0,00</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <p className="text-sm text-muted-foreground">Receita Acumulada</p>
            </div>
            <p className="text-3xl font-bold text-blue-800">R$ 0,00</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              <p className="text-sm text-muted-foreground">Taxa de Inadimplência</p>
            </div>
            <p className="text-3xl font-bold text-amber-800">0%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gráficos e Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Em desenvolvimento: gráficos de evolução de receita, histórico de pagamentos e projeções
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
