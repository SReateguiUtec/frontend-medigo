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

            // Verificar que la fecha no sea en el pasado
            const now = new Date();

            // Validar que la fecha/hora seleccionada sea futura
            if (appointmentDate < now) {
                setError('La fecha y hora deben ser en el futuro');
                setLoading(false);
                return;
            }

            // Formatear la fecha con el offset de zona horaria para enviar al backend
            // Esto asegura que el backend reciba la hora exacta seleccionada por el usuario
            const pad = (n: number) => n < 10 ? '0' + n : n;
            const timezoneOffset = appointmentDate.getTimezoneOffset();
            const sign = timezoneOffset > 0 ? '-' : '+';
            const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
            const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

            const fechaHora = appointmentDate.getFullYear() + '-' +
                pad(appointmentDate.getMonth() + 1) + '-' +
                pad(appointmentDate.getDate()) + 'T' +
                pad(appointmentDate.getHours()) + ':' +
                pad(appointmentDate.getMinutes()) + ':' +
                pad(appointmentDate.getSeconds()) +
                sign + offsetHours + ':' + offsetMinutes;

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
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getSpecialtyName = () => {
        if (doctor.especialidades && doctor.especialidades.length > 0) {
            return doctor.especialidades[0].nombre_especialidad;
        }
        return 'No especificada';
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-emerald-900/20 to-teal-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-t-3xl relative">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">Agendar Cita</h2>
                            <p className="text-white/90 text-sm mt-1">Selecciona fecha y hora para tu consulta</p>
                        </div>
                    </div>
                    <p className="text-white/90">Con {doctor.nombres} {doctor.apellidos}</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-green-500 rounded-full p-2">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-green-900 text-lg">¡Cita agendada exitosamente!</h3>
                                <p className="text-green-700 mt-1">
                                    Tu cita ha sido registrada. Recibirás una confirmación pronto.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-4">
                            <div className="bg-red-500 rounded-full p-2">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-red-900 text-lg">Error</h3>
                                <p className="text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Doctor Info Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-3">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    Dr. {doctor.nombres} {doctor.apellidos}
                                </h3>
                                <div className="flex items-center gap-2 text-emerald-700 mb-3">
                                    <Stethoscope className="w-4 h-4" />
                                    <span className="font-medium">{getSpecialtyName()}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-emerald-200">
                                    <DollarSign className="w-5 h-5 text-emerald-600" />
                                    <span className="font-bold text-gray-900">
                                        S/. {doctor.precioConsulta?.toFixed(2) || '0.00'}
                                    </span>
                                    <span className="text-gray-600 text-sm">por consulta</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="bg-emerald-100 rounded-lg p-1.5">
                                    <Calendar className="w-4 h-4 text-emerald-600" />
                                </div>
                                Fecha de la Cita
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={getMinDate()}
                                required
                                disabled={loading || success}
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all text-lg font-medium"
                            />
                        </div>

                        {/* Time Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="bg-teal-100 rounded-lg p-1.5">
                                    <Clock className="w-4 h-4 text-teal-600" />
                                </div>
                                Hora de la Cita
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required
                                disabled={loading || success}
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all text-lg font-medium"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Agendando...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        ¡Agendado!
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