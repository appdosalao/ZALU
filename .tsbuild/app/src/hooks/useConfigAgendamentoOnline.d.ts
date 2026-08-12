export interface ConfigAgendamentoOnline {
    id?: string;
    user_id?: string;
    public_id?: string;
    ativo: boolean;
    nome_salao: string;
    descricao: string;
    telefone: string;
    email: string;
    endereco: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    logo_url?: string;
    banner_url?: string;
    taxa_sinal_percentual: number;
    tempo_minimo_antecedencia: number;
    tempo_maximo_antecedencia: number;
    mensagem_boas_vindas: string;
    termos_condicoes: string;
    mensagem_confirmacao: string;
    cor_primaria?: string;
    cor_texto_botao?: string;
    mostrar_precos?: boolean;
    mostrar_duracao?: boolean;
}
export declare function useConfigAgendamentoOnline(): {
    config: ConfigAgendamentoOnline;
    loading: boolean;
    saving: boolean;
    setConfig: import("react").Dispatch<import("react").SetStateAction<ConfigAgendamentoOnline>>;
    salvarConfig: (newConfig: ConfigAgendamentoOnline) => Promise<boolean>;
    carregarConfig: () => Promise<void>;
    carregarConfigPublica: () => Promise<ConfigAgendamentoOnline>;
};
//# sourceMappingURL=useConfigAgendamentoOnline.d.ts.map