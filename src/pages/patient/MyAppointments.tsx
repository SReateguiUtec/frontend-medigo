import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citaService } from '../../api/cita.service';
import type { Cita } from '../../types';
import { Calendar, Clock, User, Stethoscope, DollarSign, XCircle, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MyAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

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
            console.log('Appointments loaded:', data);
            const sorted = data.sort((a, b) =>
                new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
            );
            setAppointments(sorted);
        } catch (err: any) {
            console.error('Error loading appointments:', err);
            console.error('Error response:', err.response);

            if (err.response?.status === 403) {
                setError('No tienes permiso para acceder a esta sección. Asegúrate de que tu cuenta tenga el rol de paciente.');
            } else {
                const errorMessage = err.response?.data?.message || err.message || 'Error al cargar las citas';
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (citaId: number) => {
        if (!window.confirm('¿Está seguro que desea cancelar esta cita?')) {
            return;
        }

        try {
            await citaService.cancelCita(citaId);
            await loadAppointments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al cancelar la cita');
        }
    };

    const getStatusBadge = (estado: string) => {
        const badges = {
            PENDIENTE: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                icon: <AlertCircle className="w-4 h-4" />,
                label: 'Pendiente'
            },
            CONFIRMADA: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-200',
                icon: <CheckCircle className="w-4 h-4" />,
                label: 'Confirmada'
            },
            COMPLETADA: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: <CheckCircle className="w-4 h-4" />,
                label: 'Completada'
            },
            CANCELADA: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: <XCircle className="w-4 h-4" />,
                label: 'Cancelada'
            }
        };

        const badge = badges[estado as keyof typeof badges] || badges.PENDIENTE;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.icon}
                {badge.label}
            </span>
        );
    };

    const filteredAppointments = appointments.filter(apt => {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando citas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Citas</h1>
                    <p className="text-gray-600">Gestiona y visualiza todas tus citas médicas</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todas ({appointments.length})
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'upcoming'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Próximas
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'past'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pasadas
                        </button>
                    </div>
                </div>

                {/* Appointments List */}
                {filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay citas {filter === 'upcoming' ? 'próximas' : filter === 'past' ? 'pasadas' : ''}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'upcoming'
                                ? 'Agenda una cita con un médico para comenzar'
                                : 'No tienes citas en esta categoría'}
                        </p>
                        {filter === 'upcoming' && (
                            <button
                                onClick={() => navigate('/patient/search')}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl font-medium"
                            >
                                Buscar Médicos
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Left Section - Doctor Info */}
                                    <div className="flex-1">
                                        <div className="mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <User className="w-5 h-5 text-emerald-600" />
                                                Dr. {appointment.medico.nombres} {appointment.medico.apellidos}
                                            </h3>
                                            {appointment.medico.especialidades && appointment.medico.especialidades.length > 0 && (
                                                <p className="text-gray-600 flex items-center gap-2 mt-1">
                                                    <Stethoscope className="w-4 h-4" />
                                                    {appointment.medico.especialidades[0].nombre_especialidad}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Calendar className="w-4 h-4 text-emerald-600" />
                                                <span>
                                                    {new Date(appointment.fechaHora).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Clock className="w-4 h-4 text-emerald-600" />
                                                <span>
                                                    {new Date(appointment.fechaHora).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                                <span className="font-semibold">
                                                    S/ {appointment.precioConsulta.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="lg:self-center">
                                        {getStatusBadge(appointment.estado)}
                                    </div>

                                    {/* Right Section - Actions */}
                                    {canCancel(appointment) && (
                                        <div className="lg:self-center">
                                            <button
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Cancelar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
