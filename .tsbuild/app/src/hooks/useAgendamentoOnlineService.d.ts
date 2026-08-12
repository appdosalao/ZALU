import { AgendamentoOnlineData, ServicoDisponivel, HorarioDisponivel } from '@/types/agendamento-online';
export declare const useAgendamentoOnlineService: () => {
    loading: boolean;
    servicos: ServicoDisponivel[];
    servicosError: string;
    produtos: {
        id: string;
        nome: string;
        valor?: number;
        categoria?: string;
        imagem_url?: string | null;
    }[];
    horariosError: string;
    ownerUserId: string;
    publicId: string;
    carregarServicos: () => Promise<void>;
    carregarProdutosPublicos: () => Promise<void>;
    calcularHorariosDisponiveis: (servicoId: string, data: string) => Promise<HorarioDisponivel[]>;
    criarAgendamento: (dados: AgendamentoOnlineData) => Promise<boolean>;
};
//# sourceMappingURL=useAgendamentoOnlineService.d.ts.map