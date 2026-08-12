import { Usuario } from '@/types/usuario';
export interface CustomManifest {
    name: string;
    short_name: string;
    description: string;
    start_url: string;
    display: string;
    orientation: string;
    theme_color: string;
    background_color: string;
    scope: string;
    lang: string;
    categories: string[];
    icons: Array<{
        src: string;
        sizes: string;
        type: string;
        purpose: string;
    }>;
    shortcuts: Array<{
        name: string;
        short_name: string;
        description: string;
        url: string;
        icons: Array<{
            src: string;
            sizes: string;
        }>;
    }>;
    prefer_related_applications: boolean;
}
export declare const updateManifest: (usuario: Usuario | null) => void;
//# sourceMappingURL=manifestUtils.d.ts.map