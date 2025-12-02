import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citaService } from '../../api/cita.service';
import { useVideoCall } from '../../hooks/useVideoCall';
import { ErrorModal } from '../../components/ErrorModal';
import type { Cita } from '../../types';
import { Calendar, Video, DollarSign, AlertCircle, CheckCircle, XCircle, ArrowLeft, Stethoscope, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentButton } from '../../components/PaymentButton';

export const MyAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { joinVideoCall } = useVideoCall(); // Usamos el hook
    const [appointments, setAppointments] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [joiningCallId, setJoiningCallId] = useState<number | null>(null);
    const [earlyJoinMessage, setEarlyJoinMessage] = useState<string>(''); // Estado para tracking de loading por cita

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError('');

            // Verificar que el usuario esté autenticado y tenga el rol correcto
            if (!user) {
                setError('Debes iniciar sesión para ver tus citas');
                setLoading(false);
                return;
            }

            if (user.rol !== 'PACIENTE') {
                setError('Solo los pacientes pueden ver sus citas');
                setLoading(false);
                return;
            }

            const data = await citaService.getMyCitas();
            setAppointments(data);
        } catch (err: any) {
            console.error('Error loading appointments:', err);
            setError(err.response?.data?.message || 'Error al cargar las citas');
        } finally {
            setLoading(false);
        }
    };


    // Función para unirse a la videollamada
    const handleJoinVideoCall = async (citaId: number) => {
        const appointment = appointments.find(apt => apt.id === citaId);

        if (appointment) {
            const aptDate = new Date(appointment.fechaHora);
            const now = new Date();
            const fifteenMinutes = 15 * 60 * 1000;

            // Check if trying to join too early
            if (now.getTime() < (aptDate.getTime() - fifteenMinutes)) {
                const timeUntil = Math.ceil((aptDate.getTime() - now.getTime()) / (60 * 1000));
                setEarlyJoinMessage(`La sala estará disponible 15 minutos antes de la hora agendada.\n\nTiempo restante: ${timeUntil} minutos`);
                return;
            }
        }

        setJoiningCallId(citaId);
        const result = await joinVideoCall(citaId);
        setJoiningCallId(null);

        if (!result.success) {
            // Si el error es por tiempo, mostrar mensaje amigable
            if (result.message.includes('sala de video') || result.message.includes('cita ID')) {
                setEarlyJoinMessage('La sala estará disponible a la hora agendada. Por favor intenta nuevamente en unos minutos.');
            } else {
                setError(result.message);
            }
        }
    };

    // Verificar si la cita ya pasó
    const isPastAppointment = (appointment: Cita) => {
        const aptDate = new Date(appointment.fechaHora);
        const now = new Date();
        const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

        // La cita es pasada si ya pasó más de 1 hora desde su hora programada
        return now.getTime() > (aptDate.getTime() + oneHour);
    };

    const getStatusColor = (estado: string, isPast: boolean) => {
        // Si la cita ya pasó, mostrar en gris independientemente del estado
        if (isPast) {
            return 'bg-gray-100 text-gray-600 border-gray-300';
        }

        switch (estado) {
            case 'PENDIENTE':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'CONFIRMADA':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'CANCELADA':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'COMPLETADA':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE':
                return <AlertCircle className="w-3.5 h-3.5" />;
            case 'CONFIRMADA':
                return <CheckCircle className="w-3.5 h-3.5" />;
            case 'CANCELADA':
                return <XCircle className="w-3.5 h-3.5" />;
            case 'COMPLETADA':
                return <CheckCircle className="w-3.5 h-3.5" />;
            default:
                return <AlertCircle className="w-3.5 h-3.5" />;
        }
    };

    const filteredAppointments = appointments
        // Primero filtrar solo citas pagadas
        .filter(apt => apt.esPagada === true)
        // Luego aplicar filtros de fecha
        .filter(apt => {
            const aptDate = new Date(apt.fechaHora);
            const now = new Date();

            if (filter === 'upcoming') {
                return aptDate >= now && apt.estado !== 'CANCELADA' && apt.estado !== 'COMPLETADA';
            } else if (filter === 'past') {
                return aptDate < now || apt.estado === 'COMPLETADA' || apt.estado === 'CANCELADA';
            }
            return true;
        })
        // Ordenar: activas primero (por fecha ascendente), luego pasadas (por fecha descendente)
        .sort((a, b) => {
            const isPastA = isPastAppointment(a);
            const isPastB = isPastAppointment(b);

            // Si una es pasada y la otra no, la activa va primero
            if (isPastA && !isPastB) return 1;
            if (!isPastA && isPastB) return -1;

            // Si ambas son activas, ordenar por fecha ascendente (más cercana primero)
            if (!isPastA && !isPastB) {
                return new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();
            }

            // Si ambas son pasadas, ordenar por fecha descendente (más reciente primero)
            return new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime();
        });


    // Verificar si es hora de la cita (15 minutos antes hasta 1 hora después)
    const isTimeForAppointment = (appointment: Cita) => {
        const aptDate = new Date(appointment.fechaHora);
        const now = new Date();
        const fifteenMinutes = 15 * 60 * 1000; // 15 minutos en milisegundos
        const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

        // Solo permitir unirse si la cita está confirmada y es dentro de 15 min antes hasta 1 hora después
        return (
            appointment.estado === 'CONFIRMADA' &&
            now.getTime() >= (aptDate.getTime() - fifteenMinutes) &&
            now.getTime() <= (aptDate.getTime() + oneHour)
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando citas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Algo salió mal</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mis Citas</h1>
                            <p className="text-gray-500 text-sm">Gestiona tus consultas médicas</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                        {[
                            { id: 'all', label: 'Todas' },
                            { id: 'upcoming', label: 'Próximas' },
                            { id: 'past', label: 'Pasadas' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab.id
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appointments List */}
                {filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No hay citas {filter === 'upcoming' ? 'próximas' : filter === 'past' ? 'pasadas' : ''}
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            {filter === 'upcoming'
                                ? 'Agenda tu próxima consulta con nuestros especialistas.'
                                : 'No tienes historial de citas en esta categoría.'}
                        </p>
                        {filter === 'upcoming' && (
                            <button
                                onClick={() => navigate('/patient/search')}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 font-medium"
                            >
                                Buscar Médicos
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredAppointments.map((appointment) => {
                            const isPast = isPastAppointment(appointment);
                            return (
                                <div
                                    key={appointment.id}
                                    className={`group bg-white rounded-2xl border p-5 transition-all duration-300 ${isPast
                                        ? 'border-gray-200 opacity-75 hover:shadow-md'
                                        : 'border-gray-100 hover:shadow-lg hover:border-emerald-100'
                                        }`}
                                >
                                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                                        {/* Left Section - Date Box */}
                                        <div className={`hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl border shrink-0 ${isPast
                                            ? 'bg-gray-100 border-gray-200'
                                            : 'bg-emerald-50 border-emerald-100'
                                            }`}>
                                            <span className={`text-xs font-semibold uppercase tracking-wider ${isPast ? 'text-gray-500' : 'text-emerald-600'
                                                }`}>
                                                {new Date(appointment.fechaHora).toLocaleDateString('es-ES', { month: 'short' })}
                                            </span>
                                            <span className="text-2xl font-bold text-gray-900">
                                                {new Date(appointment.fechaHora).getDate()}
                                            </span>
                                            <span className={`text-xs ${isPast ? 'text-gray-400' : 'text-emerald-600/70'
                                                }`}>
                                                {new Date(appointment.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {/* Middle Section - Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4 mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                        Dr. {appointment.medico.nombres} {appointment.medico.apellidos}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm flex items-center gap-1.5">
                                                        <Stethoscope className="w-3.5 h-3.5" />
                                                        {appointment.medico.especialidades?.[0]?.nombre_especialidad || 'Especialista'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Mobile Date (visible only on small screens) */}
                                            <div className="sm:hidden flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(appointment.fechaHora).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long'
                                                })} • {new Date(appointment.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            <div className="flex items-center gap-4 mt-4">
                                                {appointment.esPagada ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                                        <DollarSign className="w-3.5 h-3.5" />
                                                        Pago confirmado
                                                    </span>
                                                ) : (
                                                    (appointment.estado === 'PENDIENTE' || appointment.estado === 'CONFIRMADA') && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                                                                <DollarSign className="w-3.5 h-3.5" />
                                                                Pago pendiente
                                                            </span>
                                                            <PaymentButton citaId={appointment.id} className="text-xs" />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Section - Actions */}
                                        <div className="flex flex-row lg:flex-col gap-3 justify-end lg:justify-center lg:border-l lg:border-gray-100 lg:pl-6 items-center min-w-[180px]">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.estado, isPast)} w-fit`}>
                                                {getStatusIcon(appointment.estado)}
                                                {isPast ? 'PASADA' : appointment.estado}
                                            </span>

                                            {/* Solo mostrar botón de videollamada si NO es una cita pasada */}
                                            {!isPast && isTimeForAppointment(appointment) && (
                                                <button
                                                    onClick={() => handleJoinVideoCall(appointment.id)}
                                                    disabled={joiningCallId === appointment.id}
                                                    className="flex-1 lg:flex-none w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Video className="w-4 h-4" />
                                                    {joiningCallId === appointment.id ? 'Conectando...' : 'Unirse ahora'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Error Modal with Blur */}
            <ErrorModal
                isOpen={!!error}
                onClose={() => setError('')}
                message={error}
            />

            {/* Early Join Info Modal */}
            {earlyJoinMessage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-blue-100 animate-in fade-in zoom-in duration-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Un momento...</h2>
                        <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed">
                            {earlyJoinMessage}
                        </p>
                        <button
                            onClick={() => setEarlyJoinMessage('')}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-semibold"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};