import type { LandingConfig } from '@/types/landing';
import type { ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';
import { HeroBlock } from './blocks/HeroBlock';
import { SalonFooter } from '@/components/agendamento-online/SalonFooter';
import { AgendamentoOnlineForm } from '@/components/agendamento-online/AgendamentoOnlineForm';

export function LandingRenderer({ config, landing }: { config: ConfigAgendamentoOnline; landing: LandingConfig }) {
  const blocks = [...landing.blocks].filter(b=>b.visible).sort((a,b)=>a.order-b.order);
  const anim = landing.theme.animation !== 'none' ? `landing-anim-${landing.theme.animation}` : '';
  const formTypes = new Set(['services','calendar','products']);
  const firstFormBlockId = blocks.find(b => formTypes.has(b.type))?.id || null;
  return (
    <div className={`pb-10 ${anim}`}>
      {blocks.map(b=>{
        switch(b.type){
          case 'hero': return <HeroBlock key={b.id} config={config} props={b.props} />;
          case 'services':
          case 'calendar':
          case 'products':
            if (b.id !== firstFormBlockId) return null;
            return <div key={b.id} className="max-w-2xl mx-auto px-4 mt-6"><AgendamentoOnlineForm embedded /></div>;
          case 'cta_whatsapp': {
            const phone = (b.props?.phone as string) || config.whatsapp || config.telefone;
            if(!phone) return null;
            return <a key={b.id} href={`https://wa.me/${phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-elegant landing-btn-glow">WA</a>;
          }
          case 'custom_html': return <div key={b.id} className="max-w-2xl mx-auto px-4 mt-6 prose" dangerouslySetInnerHTML={{__html: String(b.props?.html||'')}} />;
          default: return <div key={b.id} className="max-w-2xl mx-auto px-4 mt-6 text-sm text-muted-foreground">Bloco {b.type}</div>;
        }
      })}
      <SalonFooter config={config} />
    </div>
  );
}
