import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { historialMedicoService } from '../../api/historial-medico.service';
import type { HistorialMedico } from '../../types';
import { ArrowLeft, FileText, Pill, StickyNote, Calendar, Clock, User, AlertCircle, Edit } from 'lucide-react';
import { CreateMedicalRecordModal } from '../../components/CreateMedicalRecordModal';

export const PatientMedicalHistory = () => {
    const { pacienteId } = useParams<{ pacienteId: string }>();
    const navigate = useNavigate();
    const [historiales, setHistoriales] = useState<HistorialMedico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedHistorial, setSelectedHistorial] = useState<HistorialMedico | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (pacienteId) {
            loadHistorial();
        }
    }, [pacienteId]);

    const loadHistorial = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await historialMedicoService.getByPaciente(Number(pacienteId));
            setHistoriales(data);
        } catch (err: any) {
            console.error('Error loading medical history:', err);
            setError(err.response?.data?.message || 'Error al cargar el historial médico');
        } finally {
            setLoading(false);
        }
    };

    const getPacienteNombre = () => {
        if (historiales.length > 0) {
            const paciente = historiales[0].cita.paciente;
            return `${paciente.nombres} ${paciente.apellidos}`;
        }
        return 'Paciente';
    };

    const handleEditRecord = (historial: HistorialMedico) => {
        setSelectedHistorial(historial);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando historial médico...</p>
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Historial Médico</h1>
                    <p className="text-gray-600">Paciente: {getPacienteNombre()}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Medical History List */}
                {historiales.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No hay registros médicos
                        </h3>
                        <p className="text-gray-600">
                            Este paciente aún no tiene historial médico registrado.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {historiales.map((historial) => (
                            <div
                                key={historial.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                            >
                                {/* Header with Date and Doctor */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200">
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                                            <Calendar className="w-5 h-5 text-emerald-600" />
                                            <span className="font-semibold">
                                                {new Date(historial.cita.fechaHora).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Clock className="w-4 h-4 text-emerald-600" />
                                            <span>
                                                {new Date(historial.cita.fechaHora).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 md:mt-0">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User className="w-5 h-5 text-emerald-600" />
                                            <span className="font-medium">
                                                Dr. {historial.cita.medico.nombres} {historial.cita.medico.apellidos}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="space-y-4">
                                    {/* Diagnóstico */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-5 h-5 text-emerald-600" />
                                            <h3 className="font-semibold text-gray-900">Diagnóstico</h3>
                                        </div>
                                        <p className="text-gray-700 pl-7 whitespace-pre-wrap">{historial.diagnostico}</p>
                                    </div>

                                    {/* Receta */}
                                    {historial.receta && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Pill className="w-5 h-5 text-blue-600" />
                                                <h3 className="font-semibold text-gray-900">Receta</h3>
                                            </div>
                                            <p className="text-gray-700 pl-7 whitespace-pre-wrap">{historial.receta}</p>
                                        </div>
                                    )}

                                    {/* Notas */}
                                    {historial.notas && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <StickyNote className="w-5 h-5 text-purple-600" />
                                                <h3 className="font-semibold text-gray-900">Notas Adicionales</h3>
                                            </div>
                                            <p className="text-gray-700 pl-7 whitespace-pre-wrap">{historial.notas}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer with creation date and action buttons */}
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Registro creado el {new Date(historial.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/doctor/historial-medico/${historial.id}`)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Ver Imágenes Médicas
                                        </button>
                                        <button
                                            onClick={() => handleEditRecord(historial)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Medical Record Modal */}
            {selectedHistorial && (
                <CreateMedicalRecordModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedHistorial(null);
                    }}
                    historialId={selectedHistorial.id}
                    pacienteNombre={getPacienteNombre()}
                    initialData={{
                        diagnostico: selectedHistorial.diagnostico,
                        receta: selectedHistorial.receta,
                        notas: selectedHistorial.notas
                    }}
                    onSuccess={() => {
                        loadHistorial();
                    }}
                />
            )}
        </div>
    );
};
