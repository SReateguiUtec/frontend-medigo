import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../api/message.service';
import type { Conversation } from '../../types/message';
import { MessageCircle, ArrowLeft, User, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { getImageUrl } from '../../utils/url.helper';

export const Messages = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<{ userId: number; userName: string } | null>(null);

    // Debug logging for conversations
    useEffect(() => {
        console.log('Conversations updated:', conversations);
    }, [conversations]);

    const handleDeleteClick = (userId: number, userName: string) => {
        setConversationToDelete({ userId, userName });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!conversationToDelete) return;

        try {
            await messageService.deleteConversation(conversationToDelete.userId);
            // Refresh the conversations list
            loadConversations();
        } catch (err: any) {
            console.error('Error deleting conversation:', err);
            setError('Error al eliminar la conversación');
        } finally {
            setConversationToDelete(null);
        }
    };

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await messageService.getConversations();
            setConversations(data);
        } catch (err: any) {
            console.error('Error loading conversations:', err);
            setError('Error al cargar conversaciones');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)}h`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando mensajes...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50/50 py-6 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
                            <p className="text-gray-500 text-sm">Tus conversaciones</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    {/* Conversations List */}
                    {conversations.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <MessageCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No tienes conversaciones
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {user?.rol === 'PACIENTE'
                                    ? 'Busca un médico y envíale un mensaje para comenzar'
                                    : 'Los pacientes pueden contactarte desde tu perfil'}
                            </p>
                            {user?.rol === 'PACIENTE' && (
                                <button
                                    onClick={() => navigate('/patient/search')}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 font-medium"
                                >
                                    Buscar Médicos
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation.userId}
                                    className="w-full bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-emerald-100 transition-all group flex items-center gap-4"
                                >
                                    <button
                                        onClick={() => navigate(`/messages/chat/${conversation.userId}`)}
                                        className="flex-1 text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100">
                                                {conversation.profilePicture ? (
                                                    <img
                                                        src={getImageUrl(conversation.profilePicture)}
                                                        alt={conversation.userName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            // Fallback to icon on error
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                )}
                                                {/* Fallback icon container (hidden by default if image exists) */}
                                                {conversation.profilePicture && (
                                                    <div className="hidden w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                        {conversation.userName}
                                                    </h3>
                                                    {conversation.lastMessageTime && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatTime(conversation.lastMessageTime)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {conversation.lastMessage || 'No hay mensajes aún'}
                                                    </p>
                                                    {conversation.unreadCount > 0 && (
                                                        <span className="ml-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                            {conversation.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(conversation.userId, conversation.userName);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                                        title="Eliminar conversación"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Eliminar conversación"
                message={`¿Estás seguro de que quieres eliminar la conversación con ${conversationToDelete?.userName || ''}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </>
    );
};
