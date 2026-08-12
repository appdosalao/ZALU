/**
 * Funções utilitárias para formatação de dados do Supabase
 * Centraliza a lógica de conversão entre formato banco <-> app
 */
import { Cliente } from '@/types/cliente';
import { Servico } from '@/types/servico';
import { Agendamento } from '@/types/agendamento';
/**
 * Formata dados de cliente do Supabase para o formato da aplicação
 */
export declare function formatClienteFromSupabase(item: any): Cliente;
/**
 * Formata dados de serviço do Supabase para o formato da aplicação
 */
export declare function formatServicoFromSupabase(item: any): Servico;
/**
 * Formata dados de agendamento do Supabase para o formato da aplicação
 */
export declare function formatAgendamentoFromSupabase(item: any): Agendamento;
/**
 * Prepara dados de cliente para inserção no Supabase
 */
export declare function prepareClienteForSupabase(clienteData: any, userId: string): {
    user_id: string;
    nome: any;
    telefone: any;
    email: any;
    endereco: any;
    data_nascimento: any;
    observacoes: any;
    historico_servicos: never[];
};
/**
 * Prepara dados de serviço para inserção no Supabase
 */
export declare function prepareServicoForSupabase(servicoData: any, userId: string): {
    user_id: string;
    nome: any;
    valor: any;
    duracao: any;
    descricao: any;
    observacoes: any;
};
/**
 * Prepara atualizações de dados para o Supabase (converte campos do app para banco)
 */
export declare function prepareClienteUpdatesForSupabase(updates: any): any;
/**
 * Prepara atualizações de serviço para o Supabase
 */
export declare function prepareServicoUpdatesForSupabase(updates: any): any;
//# sourceMappingURL=supabaseFormatters.d.ts.map