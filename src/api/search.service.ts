import apiClient from './axios.config';

export interface Especialidad {
    id: number;
    nombre: string;
}

export interface MedicoSearchResponse {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    edad?: number;
    telefono?: string;
    rutaFoto?: string;
    bio?: string;
    precioConsulta?: number;
    especialidades?: Especialidad[];
    numeroColegiado?: string;
    estadoCuenta?: string;
    createdAt?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const searchService = {
    // Obtener todos los médicos con paginación
    getAllMedicos: async (page: number = 0, size: number = 10): Promise<PageResponse<MedicoSearchResponse>> => {
        const response = await apiClient.get(`/search/medicos?page=${page}&size=${size}`);
        return response.data;
    },

    // Buscar médicos por nombre o apellido
    searchMedicosByNombre: async (query: string, page: number = 0, size: number = 10): Promise<PageResponse<MedicoSearchResponse>> => {
        const response = await apiClient.get(`/search/medicos/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
        return response.data;
    },

    // Obtener detalle de un médico por ID
    getMedicoById: async (medicoId: number): Promise<MedicoSearchResponse> => {
        const response = await apiClient.get(`/search/medicos/${medicoId}`);
        return response.data;
    },

    // Filtrar médicos por especialidad
    getMedicosByEspecialidad: async (especialidadId: number, page: number = 0, size: number = 10): Promise<PageResponse<MedicoSearchResponse>> => {
        const response = await apiClient.get(`/search/medicos/especialidad/${especialidadId}?page=${page}&size=${size}`);
        return response.data;
    },

    // Filtrar médicos por rango de precios
    getMedicosByPrecioRange: async (min: number, max: number, page: number = 0, size: number = 10): Promise<PageResponse<MedicoSearchResponse>> => {
        const response = await apiClient.get(`/search/medicos/precio?min=${min}&max=${max}&page=${page}&size=${size}`);
        return response.data;
    },
};
