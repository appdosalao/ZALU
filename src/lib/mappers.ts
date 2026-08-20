import type { Cliente } from '@/types/cliente';
import type { Servico } from '@/types/servico';
import type { Lancamento } from '@/types/lancamento';
import type { Cronograma, Retorno } from '@/types/cronograma';
import type { Produto } from '@/types/produto';

export function snakeToCamelKey(s: string): string {
  return s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function camelToSnakeKey(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

export function snakeToCamel<T = any>(obj: Record<string, any> | null | undefined): T {
  if (obj === null || obj === undefined) return obj as T;
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item)) as unknown as T;
  }
  if (typeof obj !== 'object') return obj as T;

  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const camelKey = snakeToCamelKey(key);
    result[camelKey] = snakeToCamel(obj[key]);
  }
  return result as T;
}

export function camelToSnake(obj: Record<string, any> | null | undefined): Record<string, any> {
  if (obj === null || obj === undefined) return obj as Record<string, any>;
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item));
  }
  if (typeof obj !== 'object') return obj as Record<string, any>;

  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const snakeKey = camelToSnakeKey(key);
    result[snakeKey] = camelToSnake(obj[key]);
  }
  return result;
}

export function clienteFromSupabase(item: any): Cliente {
  const base = snakeToCamel<Partial<Cliente>>(item || {});
  return {
    id: base.id ?? item?.id,
    nome: base.nome ?? item?.nome,
    nomeCompleto: base.nome ?? item?.nome,
    telefone: base.telefone ?? item?.telefone,
    email: base.email ?? item?.email ?? undefined,
    endereco: base.endereco ?? item?.endereco ?? undefined,
    dataNascimento: base.dataNascimento ?? item?.data_nascimento ?? undefined,
    observacoes: base.observacoes ?? item?.observacoes ?? undefined,
    historicoServicos: base.historicoServicos ?? item?.historico_servicos ?? [],
    servicoFrequente: base.servicoFrequente ?? undefined,
    ultimaVisita: base.ultimaVisita ?? undefined,
    createdAt: base.createdAt ?? item?.created_at,
    updatedAt: base.updatedAt ?? item?.updated_at,
  };
}

export function clienteToSupabase(cliente: Partial<Cliente> | any): Record<string, any> {
  const result: Record<string, any> = {};
  if (cliente.nome !== undefined) result.nome = cliente.nome;
  if (cliente.nomeCompleto !== undefined && result.nome === undefined) result.nome = cliente.nomeCompleto;
  if (cliente.telefone !== undefined) result.telefone = cliente.telefone;
  if (cliente.email !== undefined) result.email = cliente.email ?? null;
  if (cliente.endereco !== undefined) result.endereco = cliente.endereco ?? null;
  if (cliente.dataNascimento !== undefined) result.data_nascimento = cliente.dataNascimento ?? null;
  if (cliente.observacoes !== undefined) result.observacoes = cliente.observacoes ?? null;
  if (cliente.historicoServicos !== undefined) result.historico_servicos = cliente.historicoServicos ?? [];
  return result;
}

export function servicoFromSupabase(item: any): Servico {
  const base = snakeToCamel<Partial<Servico>>(item || {});
  return {
    id: base.id ?? item?.id,
    nome: base.nome ?? item?.nome,
    valor: base.valor !== undefined ? Number(base.valor) : (item?.valor !== undefined ? Number(item.valor) : 0),
    duracao: base.duracao ?? item?.duracao,
    descricao: base.descricao ?? item?.descricao ?? undefined,
    observacoes: base.observacoes ?? item?.observacoes ?? undefined,
    createdAt: base.createdAt ?? item?.created_at,
    updatedAt: base.updatedAt ?? item?.updated_at,
  };
}

export function servicoToSupabase(servico: Partial<Servico> | any): Record<string, any> {
  const result: Record<string, any> = {};
  if (servico.nome !== undefined) result.nome = servico.nome;
  if (servico.valor !== undefined) result.valor = servico.valor;
  if (servico.duracao !== undefined) result.duracao = servico.duracao;
  if (servico.descricao !== undefined) result.descricao = servico.descricao ?? null;
  if (servico.observacoes !== undefined) result.observacoes = servico.observacoes ?? null;
  return result;
}

export function lancamentoFromSupabase(item: any): Lancamento {
  const base = snakeToCamel<Record<string, any>>(item || {});
  return {
    id: base.id ?? item?.id,
    tipo: (base.tipo ?? item?.tipo) as 'entrada' | 'saida',
    valor: base.valor !== undefined ? Number(base.valor) : (item?.valor !== undefined ? Number(item.valor) : 0),
    data: base.data ? new Date(base.data as any) : (item?.data ? new Date(item.data) : new Date()),
    descricao: base.descricao ?? item?.descricao,
    categoria: base.categoria ?? item?.categoria,
    origemId: base.origemId ?? item?.origem_id,
    origemTipo: (base.origemTipo ?? item?.origem_tipo) as Lancamento['origemTipo'],
    clienteId: base.clienteId ?? item?.cliente_id,
    created_at: base.createdAt ? new Date(base.createdAt as any) : (item?.created_at ? new Date(item.created_at) : new Date()),
    updated_at: base.updatedAt ? new Date(base.updatedAt as any) : (item?.updated_at ? new Date(item.updated_at) : new Date()),
  };
}

export function lancamentoToSupabase(lancamento: Partial<Lancamento> | any): Record<string, any> {
  const result: Record<string, any> = {};
  if (lancamento.tipo !== undefined) result.tipo = lancamento.tipo;
  if (lancamento.valor !== undefined) result.valor = lancamento.valor;
  if (lancamento.data !== undefined) {
    const d = lancamento.data instanceof Date ? lancamento.data : new Date(lancamento.data);
    result.data = d.toISOString().split('T')[0];
  }
  if (lancamento.descricao !== undefined) result.descricao = lancamento.descricao;
  if (lancamento.categoria !== undefined) result.categoria = lancamento.categoria;
  if (lancamento.origemId !== undefined) result.origem_id = lancamento.origemId;
  if (lancamento.origemTipo !== undefined) result.origem_tipo = lancamento.origemTipo;
  if (lancamento.clienteId !== undefined) result.cliente_id = lancamento.clienteId;
  return result;
}

export function cronogramaFromSupabase(item: any): Cronograma {
  return {
    id_cronograma: item?.id_cronograma,
    cliente_id: item?.cliente_id,
    cliente_nome: item?.cliente_nome,
    servico_id: item?.servico_id,
    tipo_servico: item?.tipo_servico,
    data_inicio: item?.data_inicio,
    hora_inicio: item?.hora_inicio,
    duracao_minutos: item?.duracao_minutos,
    recorrencia: item?.recorrencia as Cronograma['recorrencia'],
    intervalo_dias: item?.intervalo_dias,
    observacoes: item?.observacoes,
    status: item?.status as Cronograma['status'],
    created_at: item?.created_at,
    updated_at: item?.updated_at,
  };
}

export function cronogramaToSupabase(cronograma: Partial<Cronograma> | any): Record<string, any> {
  const result: Record<string, any> = {};
  if (cronograma.cliente_id !== undefined) result.cliente_id = cronograma.cliente_id;
  if (cronograma.cliente_nome !== undefined) result.cliente_nome = cronograma.cliente_nome;
  if (cronograma.servico_id !== undefined) result.servico_id = cronograma.servico_id;
  if (cronograma.tipo_servico !== undefined) result.tipo_servico = cronograma.tipo_servico;
  if (cronograma.data_inicio !== undefined) result.data_inicio = cronograma.data_inicio;
  if (cronograma.hora_inicio !== undefined) result.hora_inicio = cronograma.hora_inicio;
  if (cronograma.duracao_minutos !== undefined) result.duracao_minutos = cronograma.duracao_minutos;
  if (cronograma.recorrencia !== undefined) result.recorrencia = cronograma.recorrencia;
  if (cronograma.intervalo_dias !== undefined) result.intervalo_dias = cronograma.intervalo_dias;
  if (cronograma.observacoes !== undefined) result.observacoes = cronograma.observacoes;
  if (cronograma.status !== undefined) result.status = cronograma.status;
  return result;
}

export function retornoFromSupabase(item: any): Retorno {
  return {
    id_retorno: item?.id_retorno,
    id_cliente: item?.id_cliente,
    id_cronograma: item?.id_cronograma,
    data_retorno: item?.data_retorno,
    status: item?.status as Retorno['status'],
    id_agendamento_retorno: item?.id_agendamento_retorno,
    created_at: item?.created_at,
    updated_at: item?.updated_at,
  };
}

export function retornoToSupabase(retorno: Partial<Retorno> | any): Record<string, any> {
  const result: Record<string, any> = {};
  if (retorno.id_cliente !== undefined) result.id_cliente = retorno.id_cliente;
  if (retorno.id_cronograma !== undefined) result.id_cronograma = retorno.id_cronograma;
  if (retorno.data_retorno !== undefined) result.data_retorno = retorno.data_retorno;
  if (retorno.status !== undefined) result.status = retorno.status;
  if (retorno.id_agendamento_retorno !== undefined) result.id_agendamento_retorno = retorno.id_agendamento_retorno;
  return result;
}

export function produtoFromSupabase(item: any): Produto {
  const base = snakeToCamel<Record<string, any>>(item || {});
  return {
    id: base.id ?? item?.id,
    user_id: base.userId ?? item?.user_id,
    fornecedor_id: base.fornecedorId ?? item?.fornecedor_id,
    nome: base.nome ?? item?.nome,
    descricao: base.descricao ?? item?.descricao ?? null,
    codigo_barras: base.codigoBarras ?? item?.codigo_barras ?? null,
    categoria: base.categoria ?? item?.categoria,
    estoque_atual: base.estoqueAtual ?? item?.estoque_atual ?? 0,
    estoque_minimo: base.estoqueMinimo ?? item?.estoque_minimo ?? 0,
    unidade_medida: base.unidadeMedida ?? item?.unidade_medida,
    preco_custo: base.precoCusto ?? item?.preco_custo ?? 0,
    preco_venda: base.precoVenda ?? item?.preco_venda ?? 0,
    imagem_url: base.imagemUrl ?? item?.imagem_url ?? null,
    ativo: base.ativo !== undefined ? base.ativo : (item?.ativo !== undefined ? item.ativo : true),
    created_at: base.createdAt ?? item?.created_at,
    updated_at: base.updatedAt ?? item?.updated_at,
    categoria_id: (base as any).categoriaId ?? item?.categoria_id,
  } as Produto;
}

export function produtoToSupabase(produto: Partial<Produto> | any): Record<string, any> {
  const result: Record<string, any> = {};
  if (produto.fornecedor_id !== undefined) {
    result.fornecedor_id = (produto.fornecedor_id === '' || produto.fornecedor_id === 'none') ? null : produto.fornecedor_id;
  }
  if (produto.fornecedorId !== undefined && result.fornecedor_id === undefined) {
    result.fornecedor_id = (produto.fornecedorId === '' || produto.fornecedorId === 'none') ? null : produto.fornecedorId;
  }
  if (produto.nome !== undefined) result.nome = produto.nome;
  if (produto.descricao !== undefined) result.descricao = produto.descricao ?? null;
  if (produto.codigo_barras !== undefined) result.codigo_barras = produto.codigo_barras ?? null;
  if (produto.codigoBarras !== undefined && result.codigo_barras === undefined) result.codigo_barras = produto.codigoBarras ?? null;
  if (produto.categoria !== undefined) result.categoria = produto.categoria;
  if (produto.categoria_id !== undefined) {
    result.categoria_id = (produto.categoria_id === '' || produto.categoria_id === 'none') ? null : produto.categoria_id;
  }
  if (produto.categoriaId !== undefined && result.categoria_id === undefined) {
    result.categoria_id = (produto.categoriaId === '' || produto.categoriaId === 'none') ? null : produto.categoriaId;
  }
  if (produto.estoque_minimo !== undefined) result.estoque_minimo = produto.estoque_minimo ?? 0;
  if (produto.estoqueMinimo !== undefined && result.estoque_minimo === undefined) result.estoque_minimo = produto.estoqueMinimo ?? 0;
  if (produto.unidade_medida !== undefined) result.unidade_medida = produto.unidade_medida;
  if (produto.unidadeMedida !== undefined && result.unidade_medida === undefined) result.unidade_medida = produto.unidadeMedida;
  if (produto.preco_custo !== undefined) result.preco_custo = produto.preco_custo;
  if (produto.precoCusto !== undefined && result.preco_custo === undefined) result.preco_custo = produto.precoCusto;
  if (produto.preco_venda !== undefined) result.preco_venda = produto.preco_venda;
  if (produto.precoVenda !== undefined && result.preco_venda === undefined) result.preco_venda = produto.precoVenda;
  if (produto.imagem_url !== undefined) result.imagem_url = produto.imagem_url ?? null;
  if (produto.imagemUrl !== undefined && result.imagem_url === undefined) result.imagem_url = produto.imagemUrl ?? null;
  if (produto.ativo !== undefined) result.ativo = produto.ativo;
  if (produto.estoque_atual !== undefined) result.estoque_atual = produto.estoque_atual;
  return result;
}
