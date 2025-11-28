import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Obtener URL del WebSocket desde variable de entorno
// Desarrollo: usa localhost
// Producción: usa la URL de tu backend en AWS
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
    private client: Client | null = null;
    private connected: boolean = false;

    connect(token: string, userId: number, onMessageReceived: (message: any) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client = new Client({
                webSocketFactory: () => new SockJS(WS_URL),
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                debug: (str) => {
                    console.log('STOMP: ' + str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            this.client.onConnect = () => {
                console.log('✅ WebSocket Connected');
                this.connected = true;

                // Suscribirse al tópico específico del usuario
                const topic = `/topic/chat.${userId}`;
                console.log(`📡 Subscribing to topic: ${topic}`);

                this.client?.subscribe(topic, (message) => {
                    console.log(`📨 Message received on ${topic}:`, message.body);
                    const messageData = JSON.parse(message.body);
                    console.log('📨 Parsed message data:', messageData);
                    onMessageReceived(messageData);
                });

                console.log(`✅ Successfully subscribed to ${topic}`);
                resolve();
            };

            this.client.onStompError = (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                reject(new Error('WebSocket connection error'));
            };

            this.client.onWebSocketError = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            this.client.activate();
        });
    }

    sendMessage(receiverId: number, content: string): void {
        if (this.client && this.connected) {
            this.client.publish({
                destination: '/app/chat.send',
                body: JSON.stringify({
                    receiverId,
                    content
                })
            });
        } else {
            console.error('WebSocket not connected');
        }
    }

    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.connected = false;
            console.log('WebSocket Disconnected');
        }
    }

    isConnected(): boolean {
        return this.connected;
    }
}

export const webSocketService = new WebSocketService();
