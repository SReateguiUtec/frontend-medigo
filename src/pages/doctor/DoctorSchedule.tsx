import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { horarioService } from '../../services/horario.service';
import type { HorarioMedico, CreateHorarioRequest } from '../../services/horario.service';
import { ConfirmationModal } from '../../components/ConfirmationModal';

const DIAS_SEMANA = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIERCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' },
    { value: 'SABADO', label: 'Sábado' },
    { value: 'DOMINGO', label: 'Domingo' }
];

export default function DoctorSchedule() {
    const { user, loading: authLoading } = useAuth();
    const [horarios, setHorarios] = useState<HorarioMedico[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [horarioToDelete, setHorarioToDelete] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [newHorario, setNewHorario] = useState<CreateHorarioRequest>({
        diaSemana: 'LUNES',
        horaInicio: '09:00',
        horaFin: '17:00',
        duracionCita: 30
    });

    // Show loading state while auth is loading
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando datos de usuario...</p>
                </div>
            </div>
        );
    }

    // Redirect if user is not a doctor
    if (user && user.rol !== 'MEDICO') {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-medium">Acceso denegado. Solo los médicos pueden acceder a esta página.</p>
                </div>
            </div>
        );
    }

    // Show message if user is not authenticated
    if (!user && !authLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-medium">Debes iniciar sesión como médico para acceder a esta página.</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (user?.id) {
            loadHorarios();
        } else if (user === null && !authLoading) {
            // If user is null and not loading, it means they're not authenticated
            setLoading(false);
        }
    }, [user?.id, authLoading]);

    const loadHorarios = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            // Check if user exists before making the call
            if (!user?.id) {
                throw new Error('Usuario no autenticado');
            }
            const data = await horarioService.getHorarios(user.id);
            setHorarios(data);
        } catch (error: any) {
            console.error('Error loading schedules:', error);
            let errorMessage = 'Error al cargar horarios';

            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = 'Acceso denegado. No tienes permiso para ver estos horarios.';
                } else if (error.response.status === 401) {
                    errorMessage = 'No estás autenticado. Por favor inicia sesión nuevamente.';
                } else {
                    errorMessage = `Error del servidor: ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.';
            } else {
                errorMessage = error.message || 'Error desconocido';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHorario = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            // Check if user exists before making the call
            if (!user?.id) {
                throw new Error('Usuario no autenticado');
            }
            await horarioService.createHorario(user.id, newHorario);
            await loadHorarios();

            // Reset form
            setNewHorario({
                diaSemana: 'LUNES',
                horaInicio: '09:00',
                horaFin: '17:00',
                duracionCita: 30
            });

            setSuccess('Horario agregado exitosamente');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error: any) {
            console.error('Error adding schedule:', error);
            let errorMessage = 'Error al agregar horario';

            if (error.response) {
                if (error.response.status === 400 && error.response.data?.message) {
                    // Mostrar mensaje de validación del backend (ej: horario duplicado)
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 403) {
                    errorMessage = 'Acceso denegado. No tienes permiso para crear este horario.';
                } else if (error.response.status === 401) {
                    errorMessage = 'No estás autenticado. Por favor inicia sesión nuevamente.';
                } else if (error.response.data?.message) {
                    // Cualquier otro error con mensaje del servidor
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = `Error del servidor: ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.';
            } else {
                errorMessage = error.message || 'Error desconocido';
            }

            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteHorario = async () => {
        if (horarioToDelete === null) return;

        try {
            setError(null);
            setSuccess(null);
            // Check if user exists before making the call
            if (!user?.id) {
                throw new Error('Usuario no autenticado');
            }
            await horarioService.deleteHorario(user.id, horarioToDelete);
            await loadHorarios();
            setSuccess('Horario eliminado exitosamente');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error: any) {
            console.error('Error deleting schedule:', error);
            let errorMessage = 'Error al eliminar horario';

            if (error.response) {
                if (error.response.status === 403) {
                    errorMessage = 'Acceso denegado. No tienes permiso para eliminar este horario.';
                } else if (error.response.status === 401) {
                    errorMessage = 'No estás autenticado. Por favor inicia sesión nuevamente.';
                } else {
                    errorMessage = `Error del servidor: ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.';
            } else {
                errorMessage = error.message || 'Error desconocido';
            }

            setError(errorMessage);
        } finally {
            setHorarioToDelete(null);
        }
    };

    // Show loading state while fetching schedules
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando horarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Configurar Horarios de Atención
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Define tus horarios de trabajo para que los pacientes puedan agendar citas
                    </p>

                    {/* Notifications */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm animate-fade-in">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-sm animate-fade-in">
                            <p className="font-medium">¡Éxito!</p>
                            <p className="text-sm">{success}</p>
                        </div>
                    )}

                    {/* Formulario para agregar horario */}
                    <form onSubmit={handleAddHorario} className="mb-8 p-6 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">➕ Agregar Nuevo Horario</h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Día de la semana
                                </label>
                                <select
                                    value={newHorario.diaSemana}
                                    onChange={(e) => setNewHorario({ ...newHorario, diaSemana: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    {DIAS_SEMANA.map(dia => (
                                        <option key={dia.value} value={dia.value}>{dia.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hora inicio
                                </label>
                                <input
                                    type="time"
                                    value={newHorario.horaInicio}
                                    onChange={(e) => setNewHorario({ ...newHorario, horaInicio: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hora fin
                                </label>
                                <input
                                    type="time"
                                    value={newHorario.horaFin}
                                    onChange={(e) => setNewHorario({ ...newHorario, horaFin: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duración cita (min)
                                </label>
                                <select
                                    value={newHorario.duracionCita}
                                    onChange={(e) => setNewHorario({ ...newHorario, duracionCita: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value={15}>15 minutos</option>
                                    <option value={30}>30 minutos</option>
                                    <option value={45}>45 minutos</option>
                                    <option value={60}>60 minutos</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="mt-4 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Guardando...' : 'Agregar Horario'}
                        </button>
                    </form>

                    {/* Lista de horarios configurados */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Horarios Configurados</h2>

                        {horarios.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-gray-500">No has configurado horarios aún</p>
                                <p className="text-sm text-gray-400 mt-1">Agrega tu primer horario arriba</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Día
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hora Inicio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hora Fin
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Duración Cita
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {horarios.map((horario) => (
                                            <tr key={horario.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {DIAS_SEMANA.find(d => d.value === horario.diaSemana)?.label}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {horario.horaInicio}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {horario.horaFin}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {horario.duracionCita} min
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${horario.activo
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {horario.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => setHorarioToDelete(horario.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={horarioToDelete !== null}
                onClose={() => setHorarioToDelete(null)}
                onConfirm={handleDeleteHorario}
                title="Eliminar Horario"
                message="¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </div>
    );
}

// Make sure we have a default export
export { DoctorSchedule };
