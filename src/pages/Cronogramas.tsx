import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import CronogramasList from "@/components/cronogramas/CronogramasList";
import RetornosList from "@/components/cronogramas/RetornosList";

export default function Cronogramas() {
  return (
    <div className="space-y-4 md:space-y-8">
      <div>
        <h1 className="page-title text-foreground">Cronogramas</h1>
        <p className="page-description">
          Gerencie cronogramas de retorno e integre automaticamente com agendamentos
        </p>
      </div>

      <Alert className="bg-primary/10 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground">
          <strong className="text-primary">Nova funcionalidade:</strong> Agora você pode ativar cronogramas para gerar agendamentos automáticos! 
          Clique em "Ativar" em qualquer cronograma para criar uma série de agendamentos automaticamente.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="cronogramas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-full md:max-w-md">
          <TabsTrigger value="cronogramas" className="text-sm">Cronogramas</TabsTrigger>
          <TabsTrigger value="retornos" className="text-sm">Retornos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cronogramas" className="space-y-6">
          <CronogramasList />
        </TabsContent>
        
        <TabsContent value="retornos" className="space-y-6">
          <RetornosList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
