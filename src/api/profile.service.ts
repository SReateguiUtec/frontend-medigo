import axiosInstance from './axios.config';
import type { Usuario, Paciente, Medico } from '../types';

export const profileService = {
  getProfile: async (): Promise<Usuario | Paciente | Medico> => {
    const response = await axiosInstance.get('/profile/me');
    return response.data;
  },

  updateProfile: async (updates: Record<string, any>): Promise<Usuario | Paciente | Medico> => {
    const response = await axiosInstance.patch('/profile/me', updates);
    return response.data;
  },

  updateAccountStatus: async (status: 'ACTIVADA' | 'DESACTIVADA'): Promise<Usuario | Paciente | Medico> => {
    const response = await axiosInstance.patch('/profile/me/status', {
      estadoCuenta: status
    });
    return response.data;
  },
};
