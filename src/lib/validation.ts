import { z } from 'zod';
import DOMPurify from 'dompurify';

const EMAIL_MAX = 255;
const NOME_MAX = 200;
const TEXTO_MAX = 500;
const TELEFONE_DIGITOS_MIN = 8;
const TELEFONE_DIGITOS_MAX = 15;

const sanitizePlain = (value: string | undefined | null): string => {
  if (value == null) return '';
  const raw = String(value);
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
};

const sanitizeRich = (value: string | undefined | null, max = TEXTO_MAX): string => {
  if (value == null) return '';
  const raw = String(value);
  const clean = DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'b', 'i', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  }).trim();
  return clean.slice(0, max);
};

type SafeStringOpts = {
  max: number;
  min?: number;
  minMessage?: string;
  maxMessage?: string;
  nonEmpty?: boolean;
};

const safeString = ({ max, min, minMessage, maxMessage, nonEmpty }: SafeStringOpts) =>
  z.preprocess(
    (val) => sanitizePlain(val as any),
    (() => {
      let schema = z.string().max(max, maxMessage ?? `Deve ter no máximo ${max} caracteres`);
      if (typeof min === 'number') {
        schema = schema.min(min, minMessage ?? `Deve ter pelo menos ${min} caracteres`);
      } else if (nonEmpty) {
        schema = schema.min(1, minMessage ?? 'Campo obrigatório');
      }
      return schema;
    })()
  );

const optionalSafeString = (max: number) =>
  z.preprocess(
    (val) => (val == null || val === '' ? '' : sanitizePlain(val as any)),
    z.string().max(max, `Deve ter no máximo ${max} caracteres`).optional().or(z.literal(''))
  );

const safeEmail = z.preprocess(
  (val) => sanitizePlain(val as any).toLowerCase(),
  z.string().email('E-mail inválido').max(EMAIL_MAX, 'E-mail muito longo')
);

const safePhone = z.preprocess(
  (val) => {
    if (val == null) return '';
    return String(val).replace(/\D/g, '').trim();
  },
  z
    .string()
    .refine(
      (v) => v.length >= TELEFONE_DIGITOS_MIN && v.length <= TELEFONE_DIGITOS_MAX,
      `Telefone deve ter entre ${TELEFONE_DIGITOS_MIN} e ${TELEFONE_DIGITOS_MAX} dígitos`
    )
);

export const agendamentoOnlineSchema = z.object({
  nome_completo: safeString({ max: NOME_MAX, min: 2, minMessage: 'Nome deve ter no mínimo 2 caracteres' }),
  email: safeEmail,
  telefone: safePhone,
  servico_id: safeString({ max: 80, min: 1, minMessage: 'Selecione um serviço' }),
  data: z.string().refine((date) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return date >= todayStr;
  }, 'Data deve ser hoje ou no futuro'),
  horario: z
    .string()
    .regex(/^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Horário inválido')
    .transform((h) => (h.length >= 5 ? h.slice(0, 5) : h)),
  observacoes: z.preprocess((val) => sanitizeRich(val as any, TEXTO_MAX), z.string().max(TEXTO_MAX).optional().or(z.literal(''))),
});

export type AgendamentoOnlineValidated = z.infer<typeof agendamentoOnlineSchema>;

export const clienteSchema = z.object({
  nome: safeString({ max: NOME_MAX, min: 2, minMessage: 'Nome é obrigatório' }),
  telefone: safePhone,
  email: optionalSafeString(EMAIL_MAX).refine(
    (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'E-mail inválido'
  ),
  cpf: optionalSafeString(20),
  data_nascimento: z.string().optional().or(z.literal('')).nullable(),
  endereco: optionalSafeString(300),
  observacoes: z.preprocess((val) => sanitizeRich(val as any, 1000), z.string().max(1000).optional().or(z.literal(''))),
});

export const servicoSchema = z.object({
  nome: safeString({ max: NOME_MAX, min: 2, minMessage: 'Nome do serviço é obrigatório' }),
  descricao: z.preprocess((val) => sanitizeRich(val as any, 1000), z.string().max(1000).optional().or(z.literal(''))),
  duracao: z.coerce.number().int().positive('Duração deve ser maior que zero'),
  preco: z.coerce.number().min(0, 'Preço não pode ser negativo'),
  ativo: z.boolean().default(true),
  cor: optionalSafeString(20),
  imagem_url: z.preprocess(
    (val) => {
      if (!val) return '';
      const s = String(val).trim();
      if (/^https?:\/\//i.test(s) || /^\/[^\\]*/.test(s) || s.startsWith('data:image/')) return s;
      return '';
    },
    z.string().max(500).optional().or(z.literal(''))
  ),
});

export const produtoSchema = z.object({
  nome: safeString({ max: NOME_MAX, min: 2, minMessage: 'Nome do produto é obrigatório' }),
  descricao: z.preprocess((val) => sanitizeRich(val as any, 1000), z.string().max(1000).optional().or(z.literal(''))),
  preco: z.coerce.number().min(0, 'Preço não pode ser negativo'),
  preco_custo: z.coerce.number().min(0).optional().nullable(),
  estoque_atual: z.coerce.number().int().default(0),
  estoque_minimo: z.coerce.number().int().default(0),
  categoria_id: optionalSafeString(80),
  fornecedor_id: optionalSafeString(80),
  imagem_url: z.preprocess(
    (val) => {
      if (!val) return '';
      const s = String(val).trim();
      if (/^https?:\/\//i.test(s) || /^\/[^\\]*/.test(s) || s.startsWith('data:image/')) return s;
      return '';
    },
    z.string().max(500).optional().or(z.literal(''))
  ),
});

export const lancamentoSchema = z.object({
  tipo: z.enum(['receita', 'despesa']),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  data: z.string().min(1, 'Data é obrigatória'),
  descricao: safeString({ max: 300, min: 2, minMessage: 'Descrição é obrigatória' }),
  categoria: safeString({ max: 100 }).optional().or(z.literal('')),
  forma_pagamento: optionalSafeString(50),
  cliente_id: optionalSafeString(80),
  origemTipo: optionalSafeString(50),
  origemId: optionalSafeString(80),
});

export const senhaForteSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .refine((v) => /[A-Z]/.test(v), 'Pelo menos 1 letra maiúscula')
  .refine((v) => /[a-z]/.test(v), 'Pelo menos 1 letra minúscula')
  .refine((v) => /[0-9]/.test(v), 'Pelo menos 1 número')
  .refine((v) => /[^A-Za-z0-9\s]/.test(v), 'Pelo menos 1 símbolo');

export const cadastroSchema = z
  .object({
    nome_completo: safeString({ max: NOME_MAX, min: 3, minMessage: 'Nome completo deve ter pelo menos 3 caracteres' }),
    nome_personalizado_app: safeString({ max: 100, min: 2, minMessage: 'Nome do salão é obrigatório' }),
    email: safeEmail,
    telefone: safePhone,
    tema_preferencia: z.enum(['feminino', 'masculino']).default('feminino'),
    senha: senhaForteSchema,
    confirmar_senha: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((d) => d.senha === d.confirmar_senha, {
    message: 'As senhas não coincidem',
    path: ['confirmar_senha'],
  });

export const sanitize = {
  plain: sanitizePlain,
  rich: sanitizeRich,
};

export const validators = {
  safeString,
  optionalSafeString,
  safeEmail,
  safePhone,
  senhaForteSchema,
};
