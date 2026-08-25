declare namespace Deno {
  const env: {
    get: (key: string) => string | undefined;
  };

  function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string, options?: unknown): unknown;
}

declare module "https://esm.sh/@supabase/supabase-js@2.39.3" {
  export function createClient(url: string, key: string, options?: any): any;
}

declare module "https://esm.sh/web-push@3.6.7" {
  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
  export function sendNotification(subscription: any, payload: any, options?: any): Promise<any>;
}