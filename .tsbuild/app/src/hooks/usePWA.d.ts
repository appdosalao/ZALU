interface PWAState {
    isInstallable: boolean;
    isInstalled: boolean;
    isOffline: boolean;
    hasUpdate: boolean;
}
interface PWAActions {
    installApp: () => Promise<boolean>;
    updateApp: () => void;
    dismissInstall: () => void;
}
export declare const usePWA: () => PWAState & PWAActions;
export {};
//# sourceMappingURL=usePWA.d.ts.map