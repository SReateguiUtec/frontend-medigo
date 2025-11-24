import axiosInstance from './axios.config';
import type { AuthResponse, LoginRequest, RegisterPacienteRequest, RegisterMedicoRequest, BackendAuthResponse, Usuario } from '../types';
import { decodeJWT, extractRole } from '../lib/jwt';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<BackendAuthResponse>('/auth/signin', credentials);
    const token = response.data.message;

    // Decode JWT to get user info
    const payload = decodeJWT(token);
    if (!payload) {
      throw new Error('Invalid token received from server');
    }

    // Construct user object from JWT payload
    const usuario: Usuario = {
      id: 0, // Backend doesn't provide ID in JWT
      nombres: '', // Backend doesn't provide names in JWT
      apellidos: '',
      email: payload.sub,
      edad: 0,
      telefono: '',
      rol: extractRole(payload.roles),
      estadoCuenta: 'ACTIVADA',
      createdAt: new Date().toISOString(),
    };

    return {
      accessToken: token,
      refreshToken: token, // Backend doesn't provide separate refresh token
      usuario,
    };
  },

  registerPaciente: async (data: RegisterPacienteRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<BackendAuthResponse>('/auth/signup/paciente', data);
    const token = response.data.message;

    // Decode JWT to get user info
    const payload = decodeJWT(token);
    if (!payload) {
      throw new Error('Invalid token received from server');
    }

    // Construct user object from JWT payload and registration data
    const usuario: Usuario = {
      id: 0,
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: payload.sub,
      edad: 0,
      telefono: '',
      rol: extractRole(payload.roles),
      estadoCuenta: 'ACTIVADA',
      createdAt: new Date().toISOString(),
    };

    return {
      accessToken: token,
      refreshToken: token,
      usuario,
    };
  },

  registerMedico: async (data: RegisterMedicoRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<BackendAuthResponse>('/auth/signup/medico', data);
    const token = response.data.message;

    // Decode JWT to get user info
    const payload = decodeJWT(token);
    if (!payload) {
      throw new Error('Invalid token received from server');
    }

    // Construct user object from JWT payload and registration data
    const usuario: Usuario = {
      id: 0,
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: payload.sub,
      edad: 0,
      telefono: '',
      rol: extractRole(payload.roles),
      estadoCuenta: 'ACTIVADA',
      createdAt: new Date().toISOString(),
    };

    return {
      accessToken: token,
      refreshToken: token,
      usuario,
    };
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};

