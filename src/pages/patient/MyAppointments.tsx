import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citaService } from '../../api/cita.service';
import { useVideoCall } from '../../hooks/useVideoCall'; // Importamos el hook
import type { Cita } from '../../types';
import { Calendar, Clock, User, Stethoscope, DollarSign, XCircle, CheckCircle, AlertCircle, ArrowLeft, Video } from 'lucide-react';
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
    const [joiningCallId, setJoiningCallId] = useState<number | null>(null); // Estado para tracking de loading por cita

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

    const handleCancelAppointment = async (citaId: number) => {
        try {
            await citaService.cancelCita(citaId);
            // Recargar las citas después de cancelar
            loadAppointments();
        } catch (err: any) {
            console.error('Error cancelling appointment:', err);
            alert(err.response?.data?.message || 'Error al cancelar la cita');
        }
    };

    // Función para unirse a la videollamada
    const handleJoinVideoCall = async (citaId: number) => {
        setJoiningCallId(citaId); // Marcar esta cita como "cargando"
        const result = await joinVideoCall(citaId);
        setJoiningCallId(null); // Quitar el loading

        if (!result.success) {
            // Show more descriptive error message
            alert(result.message);
        }
    };

    const getStatusColor = (estado: string) => {
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
        });

    const canCancel = (appointment: Cita) => {
        const aptDate = new Date(appointment.fechaHora);
        const now = new Date();
        return aptDate > now && (appointment.estado === 'PENDIENTE' || appointment.estado === 'CONFIRMADA');
    };

    // Verificar si es hora de la cita (dentro de 1 hora antes o después, o si ya pasó pero está confirmada)
    const isTimeForAppointment = (appointment: Cita) => {
        const aptDate = new Date(appointment.fechaHora);
        const now = new Date();
        const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

        // Verificar si la cita está confirmada O si es pendiente pero dentro del horario
        return (
            (appointment.estado === 'CONFIRMADA' || appointment.estado === 'PENDIENTE') &&
            (aptDate.getTime() - now.getTime() <= oneHour && aptDate.getTime() + oneHour > now.getTime() ||
                aptDate.getTime() < now.getTime())
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
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-emerald-100 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row gap-6 items-center">
                                    {/* Left Section - Date Box */}
                                    <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-emerald-50 rounded-2xl border border-emerald-100 shrink-0">
                                        <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">
                                            {new Date(appointment.fechaHora).toLocaleDateString('es-ES', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {new Date(appointment.fechaHora).getDate()}
                                        </span>
                                        <span className="text-emerald-600/70 text-xs">
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
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.estado)} w-fit`}>
                                            {getStatusIcon(appointment.estado)}
                                            {appointment.estado}
                                        </span>

                                        {isTimeForAppointment(appointment) && (
                                            <button
                                                onClick={() => handleJoinVideoCall(appointment.id)}
                                                disabled={joiningCallId === appointment.id}
                                                className="flex-1 lg:flex-none w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Video className="w-4 h-4" />
                                                {joiningCallId === appointment.id ? 'Conectando...' : 'Unirse ahora'}
                                            </button>
                                        )}

                                        {canCancel(appointment) && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="flex-1 lg:flex-none w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-medium"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};