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

      if (response.success && response.roomUrl) {
        // Redirigir a la sala de video
        // For Whereby, we don't need to append a token
        const videoUrl = response.token
          ? `${response.roomUrl}?t=${response.token}`
          : response.roomUrl;
        window.open(videoUrl, '_blank');
        return { success: true, message: 'Conectando a la videollamada...' };
      } else {
        const errorMessage = response.message || 'No se pudo obtener el acceso a la videollamada';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err: any) {
      console.error('Error joining video call:', err);
      let errorMessage = 'Error al unirse a la videollamada';

      // Handle specific error cases
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      }

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