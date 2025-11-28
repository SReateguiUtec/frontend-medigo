import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, Calendar, User, Clock } from 'lucide-react';
import { paymentService } from '../api/payment.service';

interface PendingAppointment {
    citaId: number;
    doctorName: string;
    fechaHora: string;
}

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [appointmentInfo, setAppointmentInfo] = useState<PendingAppointment | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const sessionId = searchParams.get('session_id');

                if (!sessionId) {
                    setError('No se encontró información de la sesión de pago');
                    setLoading(false);
                    return;
                }

                // Verificar el estado del pago
                await paymentService.getPaymentStatus(sessionId);

                // Obtener info de la cita desde sessionStorage
                const pendingAppointment = sessionStorage.getItem('pendingAppointment');
                if (pendingAppointment) {
                    setAppointmentInfo(JSON.parse(pendingAppointment));
                    sessionStorage.removeItem('pendingAppointment');
                }

                setLoading(false);
            } catch (err: any) {
                console.error('Error verifying payment:', err);
                setError('Error al verificar el pago. Por favor contacta a soporte.');
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                    <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando pago...</h2>
                    <p className="text-gray-600">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                    <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-bold"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
                {/* Success Icon */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center animate-in zoom-in duration-500">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Tu cita ha sido confirmada y el pago procesado correctamente
                </p>

                {/* Appointment Details */}
                {appointmentInfo && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            Detalles de la Cita
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-700">
                                <User className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium">Doctor:</span>
                                <span>{appointmentInfo.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Clock className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium">Fecha y Hora:</span>
                                <span>{appointmentInfo.fechaHora}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Message */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                    <p className="text-blue-900 text-sm">
                        <strong>Nota:</strong> Recibirás un correo de confirmación con los detalles de tu cita.
                        Puedes ver todas tus citas en la sección "Mis Citas".
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl font-bold"
                    >
                        Ver Mis Citas
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-bold"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};
