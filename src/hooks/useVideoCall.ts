import { useState } from 'react';
import { videoService } from '../api/video.service';

export const useVideoCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinVideoCall = async (citaId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await videoService.joinVideoRoom(citaId);
      
      if (response.success && response.roomUrl && response.token) {
        // Redirigir a la sala de video con el token
        const videoUrl = `${response.roomUrl}?t=${response.token}`;
        window.open(videoUrl, '_blank');
        return { success: true, message: 'Conectando a la videollamada...' };
      } else {
        const errorMessage = response.message || 'No se pudo obtener el acceso a la videollamada';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err: any) {
      console.error('Error joining video call:', err);
      const errorMessage = 'Error al unirse a la videollamada: ' + (err.response?.data?.message || err.message);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    joinVideoCall
  };
};