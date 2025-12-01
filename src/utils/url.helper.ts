// Helper para construir URLs del backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Obtiene la URL base del backend (sin /api)
 * Ejemplo: https://api.medigo.space
 */
export const getBackendBaseUrl = (): string => {
    // Si VITE_API_BASE_URL termina con /api, quitarlo
    return API_BASE_URL.replace(/\/api$/, '');
};

/**
 * Construye la URL completa para una imagen del backend
 * @param imagePath - Ruta de la imagen (puede empezar con / o no)
 * @returns URL completa de la imagen
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';

    // Si ya es una URL completa, retornarla tal cual
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Si no empieza con /, agregarlo
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${getBackendBaseUrl()}${path}`;
};
