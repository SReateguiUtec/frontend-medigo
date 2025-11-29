import axios from './axios.config';

export interface AIConsultaRequest {
    pregunta: string;
}

export interface AIConsultaResponse {
    respuesta: string;
    disclaimer: string;
    consultasRestantes: number;
    tiempoHastaReset: number; // en segundos
}

export const aiService = {
    consultarHistorial: async (pregunta: string): Promise<AIConsultaResponse> => {
        const response = await axios.post<AIConsultaResponse>('/ai/consultar-historial', {
            pregunta
        });
        return response.data;
    },

    getConsultasRestantes: async (): Promise<{ consultasRestantes: number; tiempoHastaReset: number }> => {
        const response = await axios.get('/ai/consultas-restantes');
        return response.data;
    }
};
