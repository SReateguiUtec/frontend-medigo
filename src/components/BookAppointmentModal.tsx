import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, User, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import { citaService } from '../api/cita.service';
import type { Medico } from '../types';

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: Medico;
    onSuccess?: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
    isOpen,
    onClose,
    doctor,
    onSuccess
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!selectedDate || !selectedTime) {
                setError('Por favor seleccione fecha y hora');
                setLoading(false);
                return;
            }

            const dateTimeString = `${selectedDate}T${selectedTime}:00`;
            const appointmentDate = new Date(dateTimeString);

            if (appointmentDate <= new Date()) {
                setError('La fecha debe ser en el futuro');
                setLoading(false);
                return;
            }

            // Convert to ISO string (backend expects ZonedDateTime)
            const fechaHora = appointmentDate.toISOString();

            // Create appointment
            await citaService.createCita({
                medicoId: doctor.id,
                fechaHora
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                onClose();
                setSuccess(false);
                setSelectedDate('');
                setSelectedTime('');
            }, 2000);

        } catch (err: any) {
            console.error('Error creating appointment:', err);
            setError(err.response?.data?.message || 'Error al agendar la cita. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setSelectedDate('');
            setSelectedTime('');
            setError('');
            setSuccess(false);
            onClose();
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getSpecialtyName = () => {
        if (doctor.especialidades && doctor.especialidades.length > 0) {
            return doctor.especialidades[0].nombre_especialidad;
        }
        return 'No especificada';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    <h2 className="text-2xl font-bold text-white mb-2">Agendar Cita</h2>
                    <p className="text-white/90">Complete los detalles para agendar su cita médica</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-green-900">¡Cita agendada exitosamente!</h3>
                                <p className="text-sm text-green-700 mt-1">
                                    Recibirá un correo de confirmación con los detalles de su cita.
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

                    {/* Doctor Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-600" />
                            Información del Médico
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Nombre:</span>
                                <span className="font-medium text-gray-900">
                                    {doctor.nombres} {doctor.apellidos}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" />
                                    Especialidad:
                                </span>
                                <span className="font-medium text-gray-900">{getSpecialtyName()}</span>
                            </div>
                            {doctor.precioConsulta && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Precio de consulta:
                                    </span>
                                    <span className="font-bold text-emerald-600 text-lg">
                                        S/ {doctor.precioConsulta.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Appointment Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                Fecha de la cita
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={getMinDate()}
                                required
                                disabled={loading || success}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Seleccione una fecha futura para su cita
                            </p>
                        </div>

                        {/* Time Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                Hora de la cita
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required
                                disabled={loading || success}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Seleccione el horario preferido
                            </p>
                        </div>

                        {/* Summary */}
                        {selectedDate && selectedTime && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <h4 className="font-semibold text-emerald-900 mb-2">Resumen de la cita</h4>
                                <div className="space-y-1 text-sm text-emerald-800">
                                    <p>
                                        <strong>Fecha:</strong>{' '}
                                        {new Date(selectedDate).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>
                                        <strong>Hora:</strong> {selectedTime}
                                    </p>
                                    <p>
                                        <strong>Médico:</strong> {doctor.nombres} {doctor.apellidos}
                                    </p>
                                    {doctor.precioConsulta && (
                                        <p>
                                            <strong>Costo:</strong> S/ {doctor.precioConsulta.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

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
                                disabled={loading || success || !selectedDate || !selectedTime}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Agendando...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        ¡Agendada!
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5" />
                                        Confirmar Cita
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
