import axios from 'axios';
import type { HistorialMedico, CreateHistorialRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class HistorialMedicoService {
    private getAuthHeader() {
        const token = localStorage.getItem('accessToken');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    async getAll(): Promise<HistorialMedico[]> {
        const response = await axios.get(`${API_URL}/api/historial-medico`, this.getAuthHeader());
        return response.data;
    }

    async getById(id: number): Promise<HistorialMedico> {
        const response = await axios.get(`${API_URL}/api/historial-medico/${id}`, this.getAuthHeader());
        return response.data;
    }

    async getByCita(citaId: number): Promise<HistorialMedico> {
        const response = await axios.get(`${API_URL}/api/historial-medico/cita/${citaId}`, this.getAuthHeader());
        return response.data;
    }

    async getByPaciente(pacienteId: number): Promise<HistorialMedico[]> {
        const response = await axios.get(`${API_URL}/api/historial-medico/paciente/${pacienteId}`, this.getAuthHeader());
        return response.data;
    }

    async create(citaId: number, data: CreateHistorialRequest): Promise<HistorialMedico> {
        const response = await axios.post(
            `${API_URL}/api/historial-medico/cita/${citaId}`,
            data,
            this.getAuthHeader()
        );
        return response.data;
    }

    async update(id: number, data: CreateHistorialRequest): Promise<HistorialMedico> {
        const response = await axios.put(
            `${API_URL}/api/historial-medico/${id}`,
            data,
            this.getAuthHeader()
        );
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${API_URL}/api/historial-medico/${id}`, this.getAuthHeader());
    }
}

export const historialMedicoService = new HistorialMedicoService();
