interface MovimentacaoEstoqueDialogProps {
    produto: any;
    tipo: 'entrada' | 'saida';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}
export declare function MovimentacaoEstoqueDialog({ produto, tipo, open, onOpenChange, onSuccess }: MovimentacaoEstoqueDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MovimentacaoEstoqueDialog.d.ts.map