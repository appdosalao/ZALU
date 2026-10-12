export interface Cliente {
  id: string;
  nome: string; // Campo principal do Supabase
  nomeCompleto?: string; // Compatibilidade com código antigo
  email?: string;
  telefone: string;
  endereco?: string;
  dataNascimento?: string;
  servicoFrequente?: string;
  ultimaVisita?: Date | string;
  observacoes?: string;
  historicoServicos: HistoricoServico[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HistoricoServico {
  id: string;
  data: Date;
  servico: string;
  valor: number;
}

export interface ClienteFormData {
  nome?: string;
  nomeCompleto?: string;
  email?: string;
  telefone: string;
  endereco?: string;
  dataNascimento?: Date | string;
  servicoFrequente?: string;
  ultimaVisita?: Date | string;
  observacoes?: string;
}