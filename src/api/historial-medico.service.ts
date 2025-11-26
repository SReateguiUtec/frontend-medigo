import axiosInstance from './axios.config';
import type { HistorialMedico, CreateHistorialRequest } from '../types';

class HistorialMedicoService {
    async getAll(): Promise<HistorialMedico[]> {
        const response = await axiosInstance.get('/historial-medico');
        return response.data;
    }

    async getById(id: number): Promise<HistorialMedico> {
        const response = await axiosInstance.get(`/historial-medico/${id}`);
        return response.data;
    }

    async getByCita(citaId: number): Promise<HistorialMedico> {
        const response = await axiosInstance.get(`/historial-medico/cita/${citaId}`);
        return response.data;
    }

    async getByPaciente(pacienteId: number): Promise<HistorialMedico[]> {
        const response = await axiosInstance.get(`/historial-medico/paciente/${pacienteId}`);
        return response.data;
    }

    async create(citaId: number, data: CreateHistorialRequest): Promise<HistorialMedico> {
        const response = await axiosInstance.post(
            `/historial-medico/cita/${citaId}`,
            data
        );
        return response.data;
    }

    async update(id: number, data: CreateHistorialRequest): Promise<HistorialMedico> {
        const response = await axiosInstance.put(
            `/historial-medico/${id}`,
            data
        );
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`/historial-medico/${id}`);
    }
}

export const historialMedicoService = new HistorialMedicoService();
