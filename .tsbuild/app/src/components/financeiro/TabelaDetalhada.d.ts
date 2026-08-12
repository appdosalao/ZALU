import { DadosRelatorio } from "@/types/relatorio";
import { Lancamento } from "@/types/lancamento";
import { ContaFixa } from "@/types/contaFixa";
import { Agendamento } from "@/types/agendamento";
interface TabelaDetalhadaProps {
    dados: DadosRelatorio;
    dadosDetalhados: {
        lancamentos: Lancamento[];
        contasFixas: ContaFixa[];
        agendamentos: Agendamento[];
    };
}
export default function TabelaDetalhada({ dados, dadosDetalhados }: TabelaDetalhadaProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TabelaDetalhada.d.ts.map