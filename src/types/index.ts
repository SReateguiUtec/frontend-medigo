export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  edad: number;
  telefono: string;
  rutaFoto?: string;
  rol: 'PACIENTE' | 'MEDICO' | 'ADMIN';
  estadoCuenta: 'ACTIVADA' | 'DESACTIVADA';
  createdAt: string;
}

export interface Paciente extends Usuario {
  direccion?: string;
  dni?: string;
  fechaNacimiento?: string;
}

export interface Medico extends Usuario {
  especialidades?: Especialidad[];
  dni?: string;
  numeroColegiado?: string;
  bio?: string;
  precioConsulta?: number;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Cita {
  id: number;
  paciente: Paciente;
  medico: Medico;
  fechaHora: string;
  motivo: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  esPagada: boolean;
  createdAt: string;
}

// Backend response format
export interface BackendAuthResponse {
  message: string; // JWT token
}

// Frontend AuthResponse (constructed from JWT)
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterPacienteRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface RegisterMedicoRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}
