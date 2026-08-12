type CheckoutParams = {
    baseUrl: string;
    sck: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    redirectUrl?: string | null;
};
export declare const buildCaktoCheckoutUrl: ({ baseUrl, sck, name, email, phone, redirectUrl }: CheckoutParams) => string;
export {};
//# sourceMappingURL=caktoCheckout.d.ts.map