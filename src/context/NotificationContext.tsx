import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from './AuthContext';
import { toast, Toaster } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Message } from '../types/message';

interface NotificationContextType {
    unreadCount: number;
    clearUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    const handleMessageReceived = useCallback((message: Message) => {
        // Si el mensaje es del propio usuario, ignorar
        if (Number(message.senderId) === Number(user?.id)) return;

        // Verificar si estamos en el chat con esa persona
        const isInChatWithSender = location.pathname === `/messages/chat/${message.senderId}`;

        if (!isInChatWithSender) {
            // Incrementar contador
            setUnreadCount(prev => prev + 1);

            // Mostrar notificación
            toast.message(message.senderName || 'Nuevo mensaje', {
                description: message.content,
                action: {
                    label: 'Ver',
                    onClick: () => navigate(`/messages/chat/${message.senderId}`)
                },
            });
        }
    }, [user?.id, location.pathname, navigate]);

    // Conectar WebSocket globalmente
    useWebSocket(handleMessageReceived);

    const clearUnreadCount = () => {
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ unreadCount, clearUnreadCount }}>
            {children}
            <Toaster position="top-right" richColors />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
