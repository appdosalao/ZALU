export declare const usePushSubscription: () => {
    isSupported: boolean;
    isSubscribed: boolean;
    permission: NotificationPermission;
    isLoading: boolean;
    subscribe: () => Promise<boolean>;
    unsubscribe: () => Promise<boolean>;
    sendTestNotification: () => Promise<void>;
    checkSubscription: () => Promise<void>;
};
//# sourceMappingURL=usePushSubscription.d.ts.map