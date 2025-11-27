import axios from 'axios';

export interface HorarioMedico {
    id: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    duracionCita: number;
    activo: boolean;
}

export interface CreateHorarioRequest {
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    duracionCita: number;
}

export interface SlotDisponible {
    fechaHora: string;
    disponible: boolean;
}

const API_URL = '/api/medicos';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const horarioService = {
    // Obtener horarios de un médico
    getHorarios: async (medicoId: number): Promise<HorarioMedico[]> => {
        const response = await axios.get(`${API_URL}/${medicoId}/horarios`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Crear nuevo horario
    createHorario: async (medicoId: number, horario: CreateHorarioRequest): Promise<HorarioMedico> => {
        const response = await axios.post(
            `${API_URL}/${medicoId}/horarios`,
            horario,
            {
                headers: getAuthHeaders()
            }
        );
        return response.data;
    },

    // Eliminar horario
    deleteHorario: async (medicoId: number, horarioId: number): Promise<void> => {
        await axios.delete(`${API_URL}/${medicoId}/horarios/${horarioId}`, {
            headers: getAuthHeaders()
        });
    },

    // Obtener slots disponibles para una fecha
    getSlotsDisponibles: async (medicoId: number, fecha: string): Promise<SlotDisponible[]> => {
        const response = await axios.get(`${API_URL}/${medicoId}/slots-disponibles`, {
            params: { fecha },
            headers: getAuthHeaders()
        });
        return response.data;
    }
};