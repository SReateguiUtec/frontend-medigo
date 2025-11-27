import axiosInstance from './axios.config';
import type { Message, Conversation, SendMessageRequest } from '../types/message';

export const messageService = {
    // Enviar mensaje
    sendMessage: async (request: SendMessageRequest): Promise<Message> => {
        const response = await axiosInstance.post('/messages', request);
        return response.data;
    },

    // Obtener conversación con un usuario
    getConversation: async (userId: number): Promise<Message[]> => {
        const response = await axiosInstance.get(`/messages/conversation/${userId}`);
        return response.data;
    },

    // Obtener lista de conversaciones
    getConversations: async (): Promise<Conversation[]> => {
        const response = await axiosInstance.get('/messages/conversations');
        return response.data;
    },

    // Marcar mensaje como leído
    markAsRead: async (messageId: number): Promise<void> => {
        await axiosInstance.patch(`/messages/${messageId}/read`);
    },

    // Eliminar conversación con un usuario
    deleteConversation: async (userId: number): Promise<void> => {
        await axiosInstance.delete(`/messages/conversation/${userId}`);
    }
};
