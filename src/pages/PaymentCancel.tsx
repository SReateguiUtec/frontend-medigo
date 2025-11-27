import { useNavigate } from 'react-router-dom';
import { XCircle, Home } from 'lucide-react';

export const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
                {/* Cancel Icon */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center animate-in zoom-in duration-500">
                    <XCircle className="w-12 h-12 text-white" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
                    Pago Cancelado
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Has cancelado el proceso de pago. No se ha realizado ningún cargo.
                </p>

                {/* Info Message */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
                    <p className="text-amber-900 text-sm">
                        <strong>¿Qué sucedió?</strong> El proceso de pago fue cancelado antes de completarse.
                        La cita no ha sido confirmada y no se realizó ningún cargo a tu tarjeta.
                    </p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                    <p className="text-blue-900 text-sm">
                        <strong>¿Quieres intentar de nuevo?</strong> Puedes volver a la lista de doctores
                        y agendar una nueva cita cuando estés listo.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl font-bold flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};
