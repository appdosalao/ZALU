import { Scissors, Check, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ServicesBlock({ servicos, value, onChange, config }: { servicos: any[]; value: string; onChange: (id: string) => void; config: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {servicos.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className={cn(
            'group relative flex flex-col p-5 rounded-[2rem] border-2 text-left transition-all',
            value === s.id
              ? 'border-primary bg-primary/5 shadow-lg scale-[1.02] -translate-y-1 border-b-8'
              : 'border-primary/10 bg-white/50 hover:border-primary/30 hover:bg-white hover:-translate-y-1 border-b-4'
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div className={cn('p-3 rounded-2xl', value === s.id ? 'bg-primary text-white rotate-12' : 'bg-primary/10 text-primary group-hover:rotate-12')}>
              <Scissors className="w-5 h-5" />
            </div>
            {value === s.id && <div className="bg-primary text-white p-1.5 rounded-full"><Check className="w-4 h-4" /></div>}
          </div>
          <h4 className="font-black text-lg leading-tight">{s.nome}</h4>
          <div className="flex items-center gap-3 mt-4">
            {config?.mostrar_precos !== false && <span className="text-primary font-black text-xl">R$ {Number(s.valor).toFixed(2)}</span>}
            <div className="w-px h-8 bg-primary/10 mx-1" />
            {config?.mostrar_duracao !== false && <span className="text-muted-foreground font-bold text-sm flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-primary/50" />{s.duracao} min</span>}
          </div>
        </button>
      ))}
    </div>
  );
}
