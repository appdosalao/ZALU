import React, { useState } from 'react';
import { Shield, Users, TrendingUp, Settings, CheckSquare, Bell, LayoutDashboard } from 'lucide-react';
import AdminUsuarios from '@/components/admin/AdminUsuarios';
import AdminFinanceiro from '@/components/admin/AdminFinanceiro';
import AdminConfiguracoes from '@/components/admin/AdminConfiguracoes';
import AdminPlanejador from '@/components/admin/AdminPlanejador';
import AdminNotificacoes from '@/components/admin/AdminNotificacoes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { AppLogo } from '@/components/branding/AppLogo';

// Tipos para as seções do admin
type AdminSection = 'dashboard' | 'usuarios' | 'financeiro' | 'configuracoes' | 'planejador' | 'notificacoes';

export default function Admin() {
  const { usuario } = useSupabaseAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('usuarios');

  // Itens de navegação do admin
  const navItems = [
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: TrendingUp },
    { id: 'planejador', label: 'Planejador', icon: CheckSquare },
    { id: 'notificacoes', label: 'Notificações e Suporte', icon: Bell },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  // Renderiza a seção ativa
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'usuarios':
        return <AdminUsuarios />;
      case 'financeiro':
        return <AdminFinanceiro />;
      case 'configuracoes':
        return <AdminConfiguracoes />;
      case 'planejador':
        return <AdminPlanejador />;
      case 'notificacoes':
        return <AdminNotificacoes />;
      default:
        return <AdminUsuarios />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Sidebar Admin */}
      <div className="w-64 bg-white border-r border-rose-100 shadow-sm flex flex-col">
        <div className="p-6 border-b border-rose-100">
          <div className="flex items-center gap-3 mb-2">
            <AppLogo size={36} rounded="xl" />
            <div>
              <h2 className="text-lg font-bold text-rose-600">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Salão de Bolso</p>
            </div>
          </div>
          {usuario && (
            <div className="mt-4 p-3 bg-rose-50 rounded-lg">
              <p className="text-xs text-rose-800 font-medium">Bem-vindo(a)</p>
              <p className="text-sm text-rose-900 truncate">{usuario.nome_completo}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  activeSection === item.id ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md' : 'text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                }`}
                onClick={() => setActiveSection(item.id as AdminSection)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-8 overflow-auto">
        {renderActiveSection()}
      </div>
    </div>
  );
}
