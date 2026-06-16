import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../api/message.service';
import type { Conversation } from '../../types/message';
import { MessageCircle, User, Clock, Trash2, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { getImageUrl } from '../../utils/url.helper';
import { DashboardHeader, DashboardPanel } from '@/components/dashboard';

export const Messages = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<{ userId: number; userName: string } | null>(null);

    const handleDeleteClick = (userId: number, userName: string) => {
        setConversationToDelete({ userId, userName });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!conversationToDelete) return;
        try {
            await messageService.deleteConversation(conversationToDelete.userId);
            loadConversations();
        } catch {
            setError('Error al eliminar la conversación');
        } finally {
            setConversationToDelete(null);
        }
    };

    useEffect(() => { loadConversations(); }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await messageService.getConversations();
            setConversations(data);
        } catch {
            setError('Error al cargar conversaciones');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)}h`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div>
                <DashboardHeader title="Mensajes" subtitle="Tus conversaciones" />
                <div className="flex min-h-[320px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                        <p className="text-sm text-slate-500">Cargando mensajes...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <DashboardHeader
                title="Mensajes"
                subtitle="Tus conversaciones con médicos y pacientes"
            />

            {error && (
                <div role="alert" className="mb-6 rounded-2xl border border-rose-200/80 bg-rose-50/80 px-4 py-3.5 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {conversations.length === 0 ? (
                <DashboardPanel className="flex flex-col items-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <MessageCircle className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">
                        Sin conversaciones
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-slate-500">
                        {user?.rol === 'PACIENTE'
                            ? 'Busca un médico y envíale un mensaje para comenzar.'
                            : 'Los pacientes pueden contactarte desde tu perfil.'}
                    </p>
                    {user?.rol === 'PACIENTE' && (
                        <button
                            type="button"
                            onClick={() => navigate('/patient/search')}
                            className="mt-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        >
                            <Search className="h-4 w-4" strokeWidth={2} />
                            Buscar médicos
                        </button>
                    )}
                </DashboardPanel>
            ) : (
                <DashboardPanel padding="none">
                    <ul className="divide-y divide-slate-100">
                        {conversations.map((conv) => (
                            <li key={conv.userId} className="group flex items-center gap-0">
                                {/* Clickable area */}
                                <button
                                    type="button"
                                    onClick={() => navigate(`/messages/chat/${conv.userId}`)}
                                    className="flex min-h-[72px] flex-1 cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                                            {conv.profilePicture ? (
                                                <img
                                                    src={getImageUrl(conv.profilePicture)}
                                                    alt={conv.userName}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-blue-50">
                                                    <User className="h-5 w-5 text-blue-400" strokeWidth={1.75} />
                                                </div>
                                            )}
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                                                {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <p className={`truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-700 ${conv.unreadCount > 0 ? 'font-bold' : ''}`}>
                                                {conv.userName}
                                            </p>
                                            {conv.lastMessageTime && (
                                                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(conv.lastMessageTime)}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`mt-0.5 truncate text-sm ${conv.unreadCount > 0 ? 'font-medium text-slate-700' : 'text-slate-500'}`}>
                                            {conv.lastMessage || 'Sin mensajes aún'}
                                        </p>
                                    </div>
                                </button>

                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteClick(conv.userId, conv.userName)}
                                    className="mr-4 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                                    aria-label={`Eliminar conversación con ${conv.userName}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </DashboardPanel>
            )}

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Eliminar conversación"
                message={`¿Eliminar la conversación con ${conversationToDelete?.userName ?? ''}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </>
    );
};
