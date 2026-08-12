import type { ReactNode } from 'react';
interface NotificationContextType {
    checkForNewAgendamentos: (agendamentos: any[]) => void;
    scheduleAppointmentReminder: (agendamento: any, minutosAntes?: number) => Promise<void>;
    notifyNewAppointment: (agendamento: any) => Promise<void>;
    notifyServiceCompleted: (agendamento: any) => Promise<void>;
    handleNewAppointment: (agendamento: any) => Promise<void>;
    handleServiceCompleted: (agendamento: any) => Promise<void>;
    handleExpenseReminder: (despesa: any) => Promise<void>;
}
export declare const useNotificationContext: () => NotificationContextType;
interface NotificationProviderProps {
    children: ReactNode;
}
export declare const NotificationProviderAvancado: ({ children }: NotificationProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NotificationProviderAvancado.d.ts.map