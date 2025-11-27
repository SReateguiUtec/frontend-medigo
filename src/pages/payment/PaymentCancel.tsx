import { useNavigate } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';

export const PaymentCancelPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconX size={48} className="text-orange-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pago Cancelado</h1>
                <p className="text-gray-600 mb-8">
                    Has cancelado el proceso de pago. Tu cita sigue pendiente de confirmación.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Recuerda:</strong> Para confirmar tu cita, debes completar el pago.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                    >
                        Volver a Mis Citas
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
