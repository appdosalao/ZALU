import { z } from 'zod';
import { Agendamento } from '@/types/agendamento';
import { Cliente } from '@/types/cliente';
import { Servico } from '@/types/servico';
declare const agendamentoSchema: z.ZodObject<{
    clienteId: z.ZodString;
    servicoId: z.ZodString;
    data: z.ZodString;
    hora: z.ZodString;
    duracao: z.ZodNumber;
    valor: z.ZodNumber;
    valorPago: z.ZodNumber;
    valorDevido: z.ZodNumber;
    formaPagamento: z.ZodEnum<{
        dinheiro: "dinheiro";
        cartao: "cartao";
        pix: "pix";
        fiado: "fiado";
    }>;
    statusPagamento: z.ZodEnum<{
        pago: "pago";
        parcial: "parcial";
        em_aberto: "em_aberto";
    }>;
    status: z.ZodEnum<{
        agendado: "agendado";
        concluido: "concluido";
        cancelado: "cancelado";
    }>;
    observacoes: z.ZodOptional<z.ZodString>;
    dataPrevistaPagamento: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type AgendamentoFormData = z.infer<typeof agendamentoSchema>;
interface AgendamentoFormProps {
    agendamento?: Agendamento;
    clientes: Cliente[];
    servicos: Servico[];
    onSubmit: (data: AgendamentoFormData & {
        clienteNome: string;
        servicoNome: string;
    }) => void;
    onCancel: () => void;
    verificarConflito: (agendamento: Partial<Agendamento>, excluirId?: string) => boolean;
    initial?: Partial<AgendamentoFormData>;
}
export default function AgendamentoForm({ agendamento, clientes, servicos, onSubmit, onCancel, verificarConflito, initial, }: AgendamentoFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AgendamentoForm.d.ts.map