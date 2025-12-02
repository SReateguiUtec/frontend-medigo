import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { aiService } from '../api/ai.service';
import type { AIConsultaResponse } from '../api/ai.service';
import { AITermsModal } from './AITermsModal';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface MedicalAIChatProps {
    isFullScreen?: boolean;
}

export const MedicalAIChat = ({ isFullScreen = false }: MedicalAIChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [consultasRestantes, setConsultasRestantes] = useState<number>(10);
    const [tiempoHastaReset, setTiempoHastaReset] = useState<number>(0);
    const [showTerms, setShowTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Verificar si ya aceptó los términos
        const accepted = localStorage.getItem('ai-terms-accepted');
        if (accepted === 'true') {
            setTermsAccepted(true);
            loadConsultasRestantes();
        } else {
            setShowTerms(true);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const loadConsultasRestantes = async () => {
        try {
            const data = await aiService.getConsultasRestantes();
            setConsultasRestantes(data.consultasRestantes);
            setTiempoHastaReset(data.tiempoHastaReset);
        } catch (err) {
            console.error('Error al cargar consultas restantes', err);
        }
    };

    const handleAcceptTerms = () => {
        localStorage.setItem('ai-terms-accepted', 'true');
        setTermsAccepted(true);
        setShowTerms(false);
        loadConsultasRestantes();
    };

    const handleDeclineTerms = () => {
        setShowTerms(false);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);
        setError('');

        try {
            const response: AIConsultaResponse = await aiService.consultarHistorial(inputText);

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: response.respuesta,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            setConsultasRestantes(response.consultasRestantes);
            setTiempoHastaReset(response.tiempoHastaReset);

        } catch (err: any) {
            if (err.response?.status === 429) {
                setError('Has alcanzado el límite de consultas por hora. Por favor, espera antes de hacer más preguntas.');
            } else {
                setError('Error al procesar tu consulta. Por favor, intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    if (!termsAccepted) {
        return (
            <div className={`bg-white p-8 text-center ${isFullScreen ? 'h-full flex flex-col justify-center' : 'rounded-xl shadow-lg'}`}>
                <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Asistente de IA Médica</h3>
                <p className="text-gray-600 mb-6">
                    Haz preguntas sobre tu historial médico y obtén explicaciones claras
                </p>
                <button
                    onClick={() => setShowTerms(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg mx-auto"
                >
                    Comenzar
                </button>
                <AITermsModal
                    isOpen={showTerms}
                    onAccept={handleAcceptTerms}
                    onDecline={handleDeclineTerms}
                />
            </div>
        );
    }

    return (
        <div className={`bg-white overflow-hidden flex flex-col ${isFullScreen ? 'h-full shadow-none rounded-none' : 'h-[600px] rounded-xl shadow-lg'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Alma</h3>
                            <p className="text-sm text-white/80">Pregunta sobre tu historial</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{consultasRestantes} consultas restantes</span>
                        </div>
                        {tiempoHastaReset > 0 && consultasRestantes === 0 && (
                            <p className="text-xs text-white/70 mt-1">
                                Reset en: {formatTime(tiempoHastaReset)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border-b border-yellow-200 p-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-xs text-yellow-800">
                        <strong>Importante:</strong> Esta información es solo educativa. No reemplaza la consulta médica profesional.
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">¡Hola! Soy Alma, tu asistente médico</p>
                        <p className="text-sm mt-2">Pregúntame sobre tu historial médico</p>
                        <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
                            <p className="text-sm text-gray-600">Ejemplos de preguntas:</p>
                            <div className="space-y-1 text-xs text-gray-500">
                                <p>• "¿Qué significa el diagnóstico que me dieron?"</p>
                                <p>• "¿Para qué es el medicamento que me recetaron?"</p>
                                <p>• "¿Qué debo saber sobre mi última consulta?"</p>
                            </div>
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        {!message.isUser && (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.isUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        {message.isUser && (
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-2">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu pregunta sobre tu historial médico..."
                        className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        disabled={loading || consultasRestantes === 0}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={loading || !inputText.trim() || consultasRestantes === 0}
                        className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                {consultasRestantes === 0 && (
                    <p className="text-xs text-red-600 mt-2">
                        Has alcanzado el límite de consultas. Espera {formatTime(tiempoHastaReset)} para continuar.
                    </p>
                )}
            </div>
        </div>
    );
};
