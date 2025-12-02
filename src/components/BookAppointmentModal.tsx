import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, User, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import { citaService } from '../api/cita.service';
import { paymentService } from '../api/payment.service';
import { horarioService } from '../services/horario.service';
import type { SlotDisponible } from '../services/horario.service';
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
    doctor
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<SlotDisponible[]>([]);

    // Fetch available slots when date is selected
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDate || !doctor.id) return;

            try {
                setSlotsLoading(true);
                setError('');

                // Validate date format (should be YYYY-MM-DD)
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(selectedDate)) {
                    throw new Error('Formato de fecha inválido');
                }

                const slots = await horarioService.getSlotsDisponibles(doctor.id, selectedDate);
                // Show only available slots that are in the future
                setAvailableSlots(slots.filter(slot => slot.disponible && isFutureSlot(slot.fechaHora)));
            } catch (err: any) {
                console.error('Error fetching available slots:', err);
                setError('Error al obtener los horarios disponibles. Por favor intente nuevamente.');
                setAvailableSlots([]);
            } finally {
                setSlotsLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [selectedDate, doctor.id]);

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
            const appointmentDate = new Date(dateTimeString + '-05:00');
            const nowInPeru = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));

            // Validar que la fecha/hora seleccionada sea futura
            if (appointmentDate < nowInPeru) {
                setError('La fecha y hora deben ser en el futuro');
                setLoading(false);
                return;
            }

            // Send to backend in ISO format with Peru timezone offset
            const fechaHora = appointmentDate.toISOString().replace('Z', '-05:00');

            // Crear cita pendiente (sin pagar)
            const cita = await citaService.createCita({
                medicoId: doctor.id,
                fechaHora
            });

            // Redirigir a Stripe Checkout con el ID de la cita
            const { url } = await paymentService.createCheckoutSession(cita.id);

            // Guardar info en sessionStorage para la página de éxito
            sessionStorage.setItem('pendingAppointment', JSON.stringify({
                citaId: cita.id,
                doctorName: `${doctor.nombres} ${doctor.apellidos}`,
                fechaHora: selectedDate + ' ' + selectedTime
            }));

            // Redirigir a Stripe
            window.location.href = url;

        } catch (err: any) {
            console.error('Error creating appointment:', err);
            setError(err.response?.data?.message || 'Error al procesar la solicitud. Por favor intente nuevamente.');
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setSelectedDate('');
            setSelectedTime('');
            setError('');
            setSuccess(false);
            setAvailableSlots([]);
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

    const formatTime = (dateTimeString: string) => {
        const cleanDateString = dateTimeString.replace(/Z|[+-]\d{2}:\d{2}$/g, '');
        const date = new Date(cleanDateString);
        return date.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const isFutureSlot = (dateTimeString: string) => {
        const cleanDateString = dateTimeString.replace(/Z|[+-]\d{2}:\d{2}$/g, '');
        const slotDate = new Date(cleanDateString);
        const now = new Date();
        return slotDate > now;
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

                <div className="p-8">
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
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedTime('');
                                }}
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

                            {slotsLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mr-2"></div>
                                    <span className="text-gray-500">Cargando horarios disponibles...</span>
                                </div>
                            ) : selectedDate ? (
                                availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {availableSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setSelectedTime(formatTime(slot.fechaHora))}
                                                className={`px-3 py-2 rounded-lg border-2 text-center font-medium transition-all ${selectedTime === formatTime(slot.fechaHora)
                                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                                    }`}
                                            >
                                                {formatTime(slot.fechaHora)}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No hay horarios disponibles para esta fecha
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    Seleccione una fecha para ver los horarios disponibles
                                </div>
                            )}

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
                                disabled={loading || success || !selectedDate || !selectedTime}
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
                                        <DollarSign className="w-5 h-5" />
                                        Proceder al Pago
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