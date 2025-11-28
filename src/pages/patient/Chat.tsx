import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messageService } from '../../api/message.service';
import { useWebSocket } from '../../hooks/useWebSocket';
import type { Message } from '../../types/message';
import { ArrowLeft, Send, User, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { ErrorModal } from '../../components/ErrorModal';

export const Chat = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [otherUserName, setOtherUserName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userId) return;

        try {
            await messageService.deleteConversation(Number(userId));
            // Navigate back to messages list
            navigate('/messages');
        } catch (err) {
            console.error('Error deleting conversation:', err);
            setError('Error al eliminar la conversación');
        }
    };

    // WebSocket hook
    const handleMessageReceived = useCallback((message: Message) => {
        console.log('🎯 handleMessageReceived called with:', message);
        const currentUserId = user?.id;
        const targetUserId = Number(userId);

        console.log('👤 Current user ID:', currentUserId);
        console.log('👤 Target user ID:', targetUserId);
        console.log('📧 Message senderId:', message.senderId, 'receiverId:', message.receiverId);

        const isFromTargetToCurrent = (Number(message.senderId) === targetUserId && Number(message.receiverId) === currentUserId);
        const isFromCurrentToTarget = (Number(message.receiverId) === targetUserId && Number(message.senderId) === currentUserId);

        console.log('🔍 isFromTargetToCurrent:', isFromTargetToCurrent);
        console.log('🔍 isFromCurrentToTarget:', isFromCurrentToTarget);

        if (isFromTargetToCurrent || isFromCurrentToTarget) {
            console.log('✅ Message matches conversation, checking for duplicates');

            // Evitar duplicados: verificar si el mensaje ya existe
            setMessages(prev => {
                console.log('📦 Current messages count:', prev.length);
                console.log('🆕 New message ID:', message.id, 'Type:', typeof message.id);
                console.log('🆕 New message content:', message.content);

                const messageExists = prev.some(m => {
                    const sameId = Number(m.id) === Number(message.id);
                    const sameContent = m.content === message.content &&
                        Number(m.senderId) === Number(message.senderId) &&
                        Number(m.receiverId) === Number(message.receiverId);
                    const timeDiff = Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime());

                    if (sameId) {
                        console.log(`🔍 Found duplicate by ID: ${m.id} === ${message.id}`);
                    }
                    if (sameContent && timeDiff < 1000) {
                        console.log(`🔍 Found duplicate by content and time: ${m.content} (${timeDiff}ms diff)`);
                    }

                    return sameId || (sameContent && timeDiff < 1000);
                });

                if (messageExists) {
                    console.log('⚠️ Message already exists, skipping');
                    return prev;
                }

                console.log('➕ Adding new message');
                return [...prev, message];
            });
            scrollToBottom();
        } else {
            console.log('❌ Message does not match this conversation, ignoring');
        }
    }, [user?.id, userId]);

    const { connected, sendMessage: sendViaWebSocket } = useWebSocket(handleMessageReceived);

    useEffect(() => {
        if (userId) {
            loadMessages();
        }
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await messageService.getConversation(Number(userId));
            setMessages(data);

            // Obtener nombre del otro usuario del primer mensaje
            if (data.length > 0) {
                const firstMessage = data[0];
                const isMyMessage = Number(firstMessage.senderId) === Number(user?.id);
                const otherName = isMyMessage
                    ? firstMessage.receiverName
                    : firstMessage.senderName;
                setOtherUserName(otherName);
            }
        } catch (err) {
            console.error('Error loading messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !userId) return;

        try {
            setSending(true);

            // Enviar vía WebSocket
            sendViaWebSocket(Number(userId), newMessage.trim());

            // Esto evita duplicados
            setNewMessage('');
            // scrollToBottom(); // Se llamará cuando llegue por WebSocket

        } catch (err) {
            console.error('Error sending message:', err);
            setError('Error al enviar mensaje');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/messages')}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                        <h2 className="font-semibold text-gray-900">{otherUserName}</h2>
                        <p className="text-xs text-gray-500">
                            {connected ? '● En línea' : '○ Desconectado'}
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar conversación"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>



            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No hay mensajes aún. ¡Envía el primero!</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwn = Number(message.senderId) === Number(user?.id);


                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white border border-gray-200 text-gray-900'
                                            }`}
                                    >
                                        <p className="text-sm break-words">{message.content}</p>
                                        <p
                                            className={`text-xs mt-1 ${isOwn ? 'text-emerald-100' : 'text-gray-500'
                                                }`}
                                        >
                                            {formatTime(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                        >
                            <Send className="w-4 h-4" />
                            Enviar
                        </button>
                    </form>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Eliminar conversación"
                message={`¿Estás seguro de que quieres eliminar esta conversación con ${otherUserName}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />

            {/* Error Modal with Blur */}
            <ErrorModal
                isOpen={!!error}
                onClose={() => setError('')}
                message={error}
            />
        </div>
    );
};
