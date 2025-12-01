import apiClient from './axios.config';
import { getBackendBaseUrl } from '../utils/url.helper';

export interface ImagenMedica {
    id: number;
    historialMedicoId: number;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    uploadedById: number;
    description?: string;
    annotations?: string;
    uploadedAt: string;
}

export const imagenMedicaService = {
    uploadImage: async (historialMedicoId: number, file: File, description?: string): Promise<ImagenMedica> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('historialMedicoId', historialMedicoId.toString());
        if (description) {
            formData.append('description', description);
        }

        const response = await apiClient.post('/imagenes-medicas/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getImageUrl: async (id: number): Promise<string> => {
        const response = await apiClient.get(`/imagenes-medicas/${id}`, {
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    },

    getImageMetadata: async (id: number): Promise<ImagenMedica> => {
        const response = await apiClient.get(`/imagenes-medicas/metadata/${id}`);
        return response.data;
    },

    getImagesByHistorial: async (historialId: number): Promise<ImagenMedica[]> => {
        const response = await apiClient.get(`/imagenes-medicas/historial/${historialId}`);
        return response.data;
    },

    updateAnnotations: async (id: number, annotations: string): Promise<ImagenMedica> => {
        const response = await apiClient.put(`/imagenes-medicas/${id}/annotations`,
            { annotations }
        );
        return response.data;
    },

    deleteImage: async (id: number): Promise<void> => {
        await apiClient.delete(`/imagenes-medicas/${id}`);
    },

    /**
     * Construye la URL completa de una imagen médica
     */
    buildImageUrl: (filePath: string): string => {
        if (!filePath) return '';
        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath;
        }
        const path = filePath.startsWith('/') ? filePath : `/${filePath}`;
        return `${getBackendBaseUrl()}${path}`;
    }
};
