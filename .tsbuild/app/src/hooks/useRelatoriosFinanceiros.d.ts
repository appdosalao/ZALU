import { FiltrosRelatorio, DadosRelatorio } from '@/types/relatorio';
import { Lancamento } from '@/types/lancamento';
import { ContaFixa } from '@/types/contaFixa';
import { Agendamento } from '@/types/agendamento';
export declare function useRelatoriosFinanceiros(lancamentos: Lancamento[], contasFixas: ContaFixa[], agendamentos: Agendamento[]): {
    filtros: FiltrosRelatorio;
    setFiltros: import("react").Dispatch<import("react").SetStateAction<FiltrosRelatorio>>;
    dadosRelatorio: DadosRelatorio;
    intervaloData: {
        inicio: Date;
        fim: Date;
    };
    dadosFiltrados: {
        lancamentos: Lancamento[];
        contasFixas: ContaFixa[];
        agendamentos: Agendamento[];
    };
};
//# sourceMappingURL=useRelatoriosFinanceiros.d.ts.map