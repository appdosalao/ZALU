import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash2, Clock, Edit } from 'lucide-react';
import { useIntervalosTrabalho } from '@/hooks/useIntervalosTrabalho';

const DIAS_SEMANA = [
  { id: 0, nome: 'Domingo', abrev: 'DOM' },
  { id: 1, nome: 'Segunda-feira', abrev: 'SEG' },
  { id: 2, nome: 'Terça-feira', abrev: 'TER' },
  { id: 3, nome: 'Quarta-feira', abrev: 'QUA' },
  { id: 4, nome: 'Quinta-feira', abrev: 'QUI' },
  { id: 5, nome: 'Sexta-feira', abrev: 'SEX' },
  { id: 6, nome: 'Sábado', abrev: 'SAB' },
];

interface FormData {
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  descricao: string;
}

export function ConfiguracaoIntervalos() {
  const { intervalos, loading, criarIntervalo, deletarIntervalo } = useIntervalosTrabalho();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    dia_semana: 1,
    hora_inicio: '',
    hora_fim: '',
    descricao: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hora_inicio || !formData.hora_fim) {
      return;
    }

    try {
      await criarIntervalo({
        dia_semana: formData.dia_semana,
        hora_inicio: formData.hora_inicio,
        hora_fim: formData.hora_fim,
        descricao: formData.descricao,
        ativo: true
      });

      setFormData({
        dia_semana: 1,
        hora_inicio: '',
        hora_fim: '',
        descricao: ''
      });
      setShowForm(false);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletarIntervalo(id);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const getIntervalosPorDia = (dia: number) => {
    return intervalos.filter(i => i.dia_semana === dia && i.ativo);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando intervalos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Intervalos Personalizados
              </CardTitle>
              <CardDescription>
                Configure intervalos específicos como pausas, reuniões ou outros compromissos
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Intervalo
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Formulário de criação */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Novo Intervalo Personalizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dia_semana">Dia da Semana</Label>
                  <Select
                    value={formData.dia_semana.toString()}
                    onValueChange={(value) => setFormData(prev => ({...prev, dia_semana: parseInt(value)}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIAS_SEMANA.map(dia => (
                        <SelectItem key={dia.id} value={dia.id.toString()}>
                          {dia.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div></div>
                <div>
                  <Label htmlFor="hora_inicio">Horário de Início</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData(prev => ({...prev, hora_inicio: e.target.value}))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hora_fim">Horário de Fim</Label>
                  <Input
                    id="hora_fim"
                    type="time"
                    value={formData.hora_fim}
                    onChange={(e) => setFormData(prev => ({...prev, hora_fim: e.target.value}))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição (Opcional)</Label>
                <Textarea
                  id="descricao"
                  placeholder="Ex: Reunião de equipe, Pausa para lanche, etc."
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({...prev, descricao: e.target.value}))}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  Criar Intervalo
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de intervalos por dia */}
      {DIAS_SEMANA.map(dia => {
        const intervalosDia = getIntervalosPorDia(dia.id);
        
        if (intervalosDia.length === 0) return null;

        return (
          <Card key={dia.id}>
            <CardHeader>
              <CardTitle className="text-lg">{dia.nome}</CardTitle>
              <CardDescription>
                {intervalosDia.length} intervalo{intervalosDia.length !== 1 ? 's' : ''} configurado{intervalosDia.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {intervalosDia.map(intervalo => (
                <div key={intervalo.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {intervalo.hora_inicio} - {intervalo.hora_fim}
                      </Badge>
                      {intervalo.descricao && (
                        <span className="text-sm text-muted-foreground">
                          {intervalo.descricao}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" aria-label="Remover intervalo" title="Remover intervalo">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Intervalo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover este intervalo? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(intervalo.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Resumo quando não há intervalos */}
      {intervalos.filter(i => i.ativo).length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum intervalo personalizado</h3>
            <p className="text-muted-foreground mb-4">
              Configure intervalos específicos para pausas, reuniões ou outros compromissos
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Primeiro Intervalo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Informações de ajuda */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Sobre os Intervalos Personalizados
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Os intervalos personalizados bloqueiam horários específicos para agendamentos</li>
            <li>• Diferentes do intervalo de almoço, você pode ter múltiplos intervalos por dia</li>
            <li>• Útil para reuniões fixas, pausas extras ou outros compromissos regulares</li>
            <li>• Intervalos não podem se sobrepor no mesmo dia</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}