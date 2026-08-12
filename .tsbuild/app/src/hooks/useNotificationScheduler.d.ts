import { TipoNotificacao } from '@/types/notificacao';
interface ScheduledNotification {
    id: string;
    tipo: TipoNotificacao;
    titulo: string;
    mensagem: string;
    programadaPara: Date;
    dados?: Record<string, any>;
}
export declare const useNotificationScheduler: () => {
    scheduleNotification: (notification: ScheduledNotification) => Promise<void>;
    scheduleAppointmentReminder: (agendamento: any, minutosAntes?: number) => Promise<void>;
    scheduleExpenseReminder: (contaFixa: any, diasAntes?: number) => Promise<void>;
    notifyNewAppointment: (agendamento: any) => Promise<void>;
    notifyServiceCompleted: (agendamento: any) => Promise<void>;
    checkPendingNotifications: () => Promise<void>;
    getScheduledNotifications: () => any;
    removeScheduledNotification: (notificationId: string) => void;
};
export {};
//# sourceMappingURL=useNotificationScheduler.d.ts.map