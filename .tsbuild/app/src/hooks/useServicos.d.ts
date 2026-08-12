import { ServicoFiltros, NovoServico, Servico } from '@/types/servico';
export declare function useServicos(): {
    loading: boolean;
    servicos: Servico[];
    todosServicos: Servico[];
    filtros: ServicoFiltros;
    setFiltros: import("react").Dispatch<import("react").SetStateAction<ServicoFiltros>>;
    criarServico: (novoServico: NovoServico) => Promise<boolean>;
    atualizarServico: (id: string, dadosAtualizados: Partial<NovoServico>) => Promise<boolean>;
    excluirServico: (id: string) => Promise<boolean>;
    obterServicoPorId: (id: string) => Servico;
    recarregar: () => Promise<void>;
};
//# sourceMappingURL=useServicos.d.ts.map