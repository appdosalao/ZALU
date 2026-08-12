import type { ReactNode } from 'react';
interface PWAContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    isOffline: boolean;
    hasUpdate: boolean;
    installApp: () => Promise<boolean>;
    updateApp: () => void;
    dismissInstall: () => void;
}
export declare const usePWAContext: () => PWAContextType;
interface PWAProviderProps {
    children: ReactNode;
    showInstallPrompt?: boolean;
    showUpdatePrompt?: boolean;
    showOfflineIndicator?: boolean;
}
export declare const PWAProvider: ({ children, showInstallPrompt, showUpdatePrompt, showOfflineIndicator }: PWAProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PWAProvider.d.ts.map