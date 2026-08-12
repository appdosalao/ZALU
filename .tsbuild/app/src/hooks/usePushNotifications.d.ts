interface PushSubscriptionData {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}
export declare const usePushNotifications: () => {
    isSupported: boolean;
    isSubscribed: boolean;
    subscription: PushSubscriptionData;
    isLoading: boolean;
    subscribe: () => Promise<boolean>;
    unsubscribe: () => Promise<void>;
    sendTestNotification: () => Promise<void>;
    checkSubscription: () => Promise<void>;
};
export {};
//# sourceMappingURL=usePushNotifications.d.ts.map