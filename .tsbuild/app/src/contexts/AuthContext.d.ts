import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { Usuario, UsuarioCadastro } from '@/types/usuario';
export interface AuthContextType {
    user: User | null;
    session: Session | null;
    usuario: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    sessionError: boolean;
    login: (email: string, senha: string) => Promise<boolean>;
    cadastrar: (dados: UsuarioCadastro) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextType;
//# sourceMappingURL=AuthContext.d.ts.map