import axiosInstance from './axios.config';

export interface CreateCheckoutSessionRequest {
    citaId: number;
    originUrl: string;
    metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
    url: string;
    sessionId: string;
    message: string;
}

export interface PaymentStatusResponse {
    status: string;
    paymentStatus: string;
    amountTotal: number;
    currency: string;
    metadata: Record<string, string>;
    citaId: number;
}

export const paymentService = {
    /**
     * Crea una sesión de checkout de Stripe para pagar una cita
     */
    async createCheckoutSession(citaId: number): Promise<CheckoutSessionResponse> {
        const request: CreateCheckoutSessionRequest = {
            citaId,
            originUrl: window.location.origin,
        };

        const response = await axiosInstance.post('/payments/checkout/session', request);
        return response.data;
    },

    /**
     * Obtiene el estado de un pago por su session ID
     */
    async getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse> {
        const response = await axiosInstance.get(`/payments/checkout/status/${sessionId}`);
        return response.data;
    },
};
