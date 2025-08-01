import { createContext } from 'react';

interface NotificationContextType {
  showNotification: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);