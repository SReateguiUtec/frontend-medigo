import apiClient from './axios.config';
import type { Cita, CreateCitaRequest } from '../types';

export const citaService = {
    // Crear una nueva cita
    createCita: async (request: CreateCitaRequest): Promise<Cita> => {
        const response = await apiClient.post('/citas', request);
        return response.data;
    },

    // Obtener detalles de una cita
    getCitaDetails: async (citaId: number): Promise<Cita> => {
        const response = await apiClient.get(`/citas/${citaId}`);
        return response.data;
    },

    // Cancelar una cita
    cancelCita: async (citaId: number): Promise<Cita> => {
        const response = await apiClient.patch(`/citas/${citaId}/cancel`);
        return response.data;
    },

    // Obtener citas del paciente autenticado
    getMyCitas: async (): Promise<Cita[]> => {
        const response = await apiClient.get('/citas/my-appointments');
        return response.data;
    }
};
