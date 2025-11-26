import { useState } from 'react';
import { Video } from 'lucide-react';
import { videoService } from '../api/video.service';

interface VideoCallButtonProps {
  citaId: number;
  isDoctor?: boolean;
}

export const VideoCallButton = ({ citaId, isDoctor = false }: VideoCallButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleJoinVideoCall = async () => {
    try {
      setLoading(true);
      const response = await videoService.joinVideoRoom(citaId);
      
      if (response.success && response.roomUrl && response.token) {
        // Redirigir a la sala de video con el token
        const videoUrl = `${response.roomUrl}?t=${response.token}`;
        window.open(videoUrl, '_blank');
      } else {
        alert(response.message || 'No se pudo obtener el acceso a la videollamada');
      }
    } catch (err: any) {
      console.error('Error joining video call:', err);
      alert('Error al unirse a la videollamada: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Verificar si es hora de la cita (dentro de 15 minutos antes o después)
  const isTimeForAppointment = () => {
    // En una implementación real, aquí verificaríamos la fecha y hora de la cita
    // Por ahora, siempre devolvemos true para fines de prueba
    return true;
  };

  if (!isTimeForAppointment()) {
    return null;
  }

  return (
    <button
      onClick={handleJoinVideoCall}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-md disabled:opacity-50"
    >
      <Video className="w-4 h-4" />
      {loading ? 'Conectando...' : isDoctor ? 'Entrar como Médico' : 'Entrar a Videollamada'}
    </button>
  );
};