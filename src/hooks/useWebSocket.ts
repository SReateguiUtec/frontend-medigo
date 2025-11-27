import { useEffect, useCallback, useState, useRef } from 'react';
import { webSocketService } from '../services/websocket.service';
import type { Message } from '../types/message';

import { useAuth } from '../context/AuthContext';

export const useWebSocket = (onMessageReceived?: (message: Message) => void) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    console.log('🔧 useWebSocket hook initialized, user:', user);

    // Store the callback in a ref to avoid reconnecting when it changes
    const callbackRef = useRef(onMessageReceived);

    // Update the ref when the callback changes
    useEffect(() => {
        callbackRef.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        console.log('🔄 useWebSocket useEffect triggered, user?.id:', user?.id);
        const token = localStorage.getItem('accessToken'); // Changed from 'token' to 'accessToken'
        console.log('🔑 Token exists:', !!token);

        if (!token) {
            console.warn('⚠️ No token found, cannot connect WebSocket');
            return;
        }

        if (!user?.id) {
            console.warn('⚠️ No user ID found, waiting for user to load...');
            return;
        }

        console.log('✅ Prerequisites met, attempting to connect...');

        const connect = async () => {
            try {
                console.log('🔌 Attempting to connect WebSocket for user:', user.id);
                await webSocketService.connect(token, user.id, (message: Message) => {
                    console.log('📩 Message received via WebSocket in hook:', message);
                    // Use the ref to always get the latest callback
                    if (callbackRef.current) {
                        console.log('✅ Calling message handler callback');
                        callbackRef.current(message);
                    } else {
                        console.warn('⚠️ No callback registered for message');
                    }
                });
                console.log('✅ WebSocket connected successfully');
                setConnected(true);
                setError(null);
            } catch (err) {
                console.error('❌ Failed to connect WebSocket:', err);
                setError('Failed to connect to messaging service');
                setConnected(false);
            }
        };

        connect();

        return () => {
            console.log('🔌 Disconnecting WebSocket...');
            webSocketService.disconnect();
            setConnected(false);
        };
    }, [user?.id]); // Only reconnect when user ID changes

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
