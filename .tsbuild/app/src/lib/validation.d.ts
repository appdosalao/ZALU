import { z } from 'zod';
export declare const agendamentoOnlineSchema: z.ZodObject<{
    nome_completo: z.ZodString;
    email: z.ZodString;
    telefone: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    servico_id: z.ZodString;
    data: z.ZodString;
    horario: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    observacoes: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string, string>>;
}, z.core.$strip>;
export type AgendamentoOnlineValidated = z.infer<typeof agendamentoOnlineSchema>;
//# sourceMappingURL=validation.d.ts.map