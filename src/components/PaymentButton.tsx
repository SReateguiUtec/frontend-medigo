import { useState } from 'react';
import { paymentService } from '../api/payment.service';
import { IconCreditCard, IconLoader2 } from '@tabler/icons-react';

interface PaymentButtonProps {
    citaId: number;
    disabled?: boolean;
    className?: string;
}

export const PaymentButton = ({ citaId, disabled = false, className = '' }: PaymentButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePagar = async () => {
        try {
            setLoading(true);
            setError('');

            // Crear sesión de checkout
            const { url } = await paymentService.createCheckoutSession(citaId);

            // Redirigir a Stripe Checkout
            window.location.href = url;
        } catch (err: any) {
            console.error('Error al crear sesión de pago:', err);
            setError(err.response?.data?.message || 'Error al procesar el pago');
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handlePagar}
                disabled={disabled || loading}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium ${className}`}
            >
                {loading ? (
                    <>
                        <IconLoader2 size={20} className="animate-spin" />
                        Procesando...
                    </>
                ) : (
                    <>
                        <IconCreditCard size={20} />
                        Pagar Consulta
                    </>
                )}
            </button>

            {error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    {error}
                </div>
            )}
        </div>
    );
};
