import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../../api/payment.service';
import type { PaymentStatusResponse } from '../../api/payment.service';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';

export const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState<PaymentStatusResponse | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            setError('No se encontró información del pago');
            setLoading(false);
            return;
        }

        // Verificar el estado del pago
        paymentService
            .getPaymentStatus(sessionId)
            .then((data: PaymentStatusResponse) => {
                setPaymentInfo(data);
                setLoading(false);
            })
            .catch((err: any) => {
                console.error('Error al verificar pago:', err);
                setError('Error al verificar el estado del pago');
                setLoading(false);
            });
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                    <IconLoader2 size={64} className="mx-auto text-blue-600 animate-spin mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando pago...</h2>
                    <p className="text-gray-600">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                        Volver a Mis Citas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconCheck size={48} className="text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-600 mb-8">Tu consulta médica ha sido confirmada</p>

                {paymentInfo && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monto Total:</span>
                                <span className="font-semibold text-gray-900">
                                    {paymentInfo.currency.toUpperCase()} {paymentInfo.amountTotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Estado:</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Pagado
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => {
                            navigate('/patient/appointments');
                            window.location.reload(); // Force reload to update payment status
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                    >
                        Ver Mis Citas
                    </button>
                    <button
                        onClick={() => navigate('/patient/dashboard')}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    >
                        Ir al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
