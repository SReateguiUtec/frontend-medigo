import { useEffect, useCallback, useState } from 'react';
import { webSocketService } from '../services/websocket.service';
import type { Message } from '../types/message';

export const useWebSocket = (onMessageReceived?: (message: Message) => void) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No authentication token found');
            return;
        }

        const connect = async () => {
            try {
                await webSocketService.connect(token, (message: Message) => {
                    console.log('Message received via WebSocket:', message);
                    if (onMessageReceived) {
                        onMessageReceived(message);
                    }
                });
                setConnected(true);
                setError(null);
            } catch (err) {
                console.error('Failed to connect WebSocket:', err);
                setError('Failed to connect to messaging service');
                setConnected(false);
            }
        };

        connect();

        return () => {
            webSocketService.disconnect();
            setConnected(false);
        };
    }, [onMessageReceived]);

    const sendMessage = useCallback((receiverId: number, content: string) => {
        if (connected) {
            webSocketService.sendMessage(receiverId, content);
        } else {
            console.error('Cannot send message: WebSocket not connected');
        }
    }, [connected]);

    return {
        connected,
        error,
        sendMessage
    };
};
