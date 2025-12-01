import apiClient from '../api/axios.config';

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

export const horarioService = {
    // Obtener horarios de un médico
    getHorarios: async (medicoId: number): Promise<HorarioMedico[]> => {
        const response = await apiClient.get(`/medicos/${medicoId}/horarios`);
        return response.data;
    },

    // Crear nuevo horario
    createHorario: async (medicoId: number, horario: CreateHorarioRequest): Promise<HorarioMedico> => {
        const response = await apiClient.post(
            `/medicos/${medicoId}/horarios`,
            horario
        );
        return response.data;
    },

    // Eliminar horario
    deleteHorario: async (medicoId: number, horarioId: number): Promise<void> => {
        await apiClient.delete(`/medicos/${medicoId}/horarios/${horarioId}`);
    },

    // Obtener slots disponibles para una fecha
    getSlotsDisponibles: async (medicoId: number, fecha: string): Promise<SlotDisponible[]> => {
        const response = await apiClient.get(`/medicos/${medicoId}/slots-disponibles`, {
            params: { fecha }
        });
        return response.data;
    }
};