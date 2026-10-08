import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';
import { useLandingConfig } from '@/hooks/useLandingConfig';
import { LandingThemeProvider } from '@/landing/theme/LandingThemeProvider';
import { LandingRenderer } from '@/landing/LandingRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SalonLanding() {
  const { slug } = useParams<{ slug: string }>();
  const { config, landing, loading } = useLandingConfig(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Carregando pagina</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground text-center">Preparando a pagina do salao...</CardContent>
        </Card>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="max-w-md w-full">
          <CardHeader><CardTitle>Salao nao encontrado</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Verifique o link. Se voce e o dono, configure seu <b>public_id</b> em Configuracoes - Agendamento Online.</CardContent>
        </Card>
      </div>
    );
  }

  const title = landing.seo?.title || `${config.nome_salao} - Agende seu horario`;
  const desc = landing.seo?.description || config.descricao || 'Agendamento online rapido e pratico';

  return (
    <LandingThemeProvider theme={landing.theme}>
      <PageMeta
        title={title}
        description={desc}
        path={`/s/${slug}`}
        keywords={`${config.nome_salao}, agendamento online, salao de beleza`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: config.nome_salao,
          description: desc,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
          address: config.endereco,
          telephone: config.telefone,
        }}
      />
      <LandingRenderer config={config as any} landing={landing} />
    </LandingThemeProvider>
  );
}
