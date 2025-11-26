import React, { useState } from 'react';
import { X, FileText, Pill, StickyNote, AlertCircle, CheckCircle } from 'lucide-react';
import { historialMedicoService } from '../api/historial-medico.service';
import type { CreateHistorialRequest } from '../types';

interface CreateMedicalRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    citaId?: number;
    historialId?: number;
    pacienteNombre: string;
    initialData?: {
        diagnostico: string;
        receta?: string;
        notas?: string;
    };
    onSuccess?: () => void;
}

export const CreateMedicalRecordModal: React.FC<CreateMedicalRecordModalProps> = ({
    isOpen,
    onClose,
    citaId,
    historialId,
    pacienteNombre,
    initialData,
    onSuccess
}) => {
    const [diagnostico, setDiagnostico] = useState(initialData?.diagnostico || '');
    const [receta, setReceta] = useState(initialData?.receta || '');
    const [notas, setNotas] = useState(initialData?.notas || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const isEditMode = !!historialId;

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!diagnostico.trim()) {
                setError('El diagnóstico es obligatorio');
                setLoading(false);
                return;
            }

            const data: CreateHistorialRequest = {
                diagnostico: diagnostico.trim(),
                receta: receta.trim() || undefined,
                notas: notas.trim() || undefined,
            };

            if (isEditMode && historialId) {
                await historialMedicoService.update(historialId, data);
            } else if (citaId) {
                await historialMedicoService.create(citaId, data);
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1500);

        } catch (err: any) {
            console.error('Error saving medical record:', err);
            setError(err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el historial médico. Por favor intente nuevamente.`);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setDiagnostico('');
            setReceta('');
            setNotas('');
            setError('');
            setSuccess(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-emerald-900/20 to-teal-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl relative">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isEditMode ? 'Editar Historial Médico' : 'Crear Historial Médico'}
                    </h2>
                    <p className="text-white/90">Paciente: {pacienteNombre}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-green-900">¡Historial creado exitosamente!</h3>
                                <p className="text-sm text-green-700 mt-1">
                                    El registro médico ha sido guardado correctamente.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900">Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Diagnóstico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-600" />
                                Diagnóstico <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={diagnostico}
                                onChange={(e) => setDiagnostico(e.target.value)}
                                required
                                disabled={loading || success}
                                rows={4}
                                maxLength={1000}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                placeholder="Describa el diagnóstico del paciente..."
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {diagnostico.length}/1000 caracteres
                            </p>
                        </div>

                        {/* Receta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Pill className="w-4 h-4 text-emerald-600" />
                                Receta (Opcional)
                            </label>
                            <textarea
                                value={receta}
                                onChange={(e) => setReceta(e.target.value)}
                                disabled={loading || success}
                                rows={4}
                                maxLength={1000}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                placeholder="Medicamentos recetados, dosis, frecuencia..."
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {receta.length}/1000 caracteres
                            </p>
                        </div>

                        {/* Notas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-emerald-600" />
                                Notas Adicionales (Opcional)
                            </label>
                            <textarea
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                disabled={loading || success}
                                rows={4}
                                maxLength={2000}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                placeholder="Observaciones, recomendaciones, seguimiento..."
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {notas.length}/2000 caracteres
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || success || !diagnostico.trim()}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Guardando...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        ¡Guardado!
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5" />
                                        {isEditMode ? 'Actualizar Historial' : 'Guardar Historial'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};