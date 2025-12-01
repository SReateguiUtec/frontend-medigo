import axios from 'axios';

const API_URL = 'http://localhost:8080/api/imagenes-medicas';

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

        const token = localStorage.getItem('accessToken');
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    getImageUrl: async (id: number): Promise<string> => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    },

    getImageMetadata: async (id: number): Promise<ImagenMedica> => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/metadata/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    getImagesByHistorial: async (historialId: number): Promise<ImagenMedica[]> => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/historial/${historialId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    updateAnnotations: async (id: number, annotations: string): Promise<ImagenMedica> => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(`${API_URL}/${id}/annotations`,
            { annotations },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    },

    deleteImage: async (id: number): Promise<void> => {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
