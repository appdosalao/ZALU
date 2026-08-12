type LoggedFetchOptions = {
    label: string;
    timeoutMs: number;
};
export declare function createLoggedFetch({ label, timeoutMs }: LoggedFetchOptions): (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export {};
//# sourceMappingURL=loggedFetch.d.ts.map