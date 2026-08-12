export declare const usePaidAccess: () => {
    isPaid: boolean;
    isLoading: boolean;
    refetch: any;
} | {
    isPaid: boolean;
    isLoading: false;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<boolean, Error>>;
};
//# sourceMappingURL=usePaidAccess.d.ts.map