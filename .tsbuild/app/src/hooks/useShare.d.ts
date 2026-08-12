export interface ShareData {
    title?: string;
    text?: string;
    url?: string;
}
export declare const useShare: () => {
    canShare: boolean;
    isSharing: boolean;
    shareContent: (data: ShareData) => Promise<boolean>;
    copyToClipboard: (text: string) => Promise<boolean>;
};
//# sourceMappingURL=useShare.d.ts.map