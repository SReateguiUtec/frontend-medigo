import apiClient from './axios.config';

export interface JoinVideoRoomResponse {
  success: boolean;
  roomUrl: string;
  token: string;
  roomName: string;
  isDoctor: boolean;
  message: string;
}

export interface VideoRoomResponse {
  id: number;
  roomName: string;
  roomUrl: string;
  citaId: number;
  expiresAt: string;
  status: string;
  recordingEnabled: boolean;
}

export const videoService = {
  // Crear una sala de video para una cita
  createVideoRoomForCita: async (citaId: number): Promise<VideoRoomResponse> => {
    const response = await apiClient.post(`/video/rooms/cita/${citaId}`);
    return response.data;
  },

  // Unirse a una sala de video para una cita
  joinVideoRoom: async (citaId: number): Promise<JoinVideoRoomResponse> => {
    const response = await apiClient.post(`/video/join/cita/${citaId}`);
    return response.data;
  },

  // Obtener detalles de la sala de video para una cita
  getVideoRoomDetails: async (citaId: number): Promise<VideoRoomResponse> => {
    const response = await apiClient.get(`/video/rooms/cita/${citaId}`);
    return response.data;
  }
};