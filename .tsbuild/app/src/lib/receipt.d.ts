import type { Agendamento } from '@/types/agendamento';
export declare function printAgendamentoRecibo(params: {
    agendamento: Agendamento;
    cliente: {
        nome: string;
        telefone: string;
        email?: string;
    };
    servico: {
        nome: string;
        descricao?: string;
    };
    salonName?: string;
    logoUrl?: string;
}): void;
//# sourceMappingURL=receipt.d.ts.map