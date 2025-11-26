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
  nombre_especialidad: string;
  descripcion?: string;
}

export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';

export interface Cita {
  id: number;
  paciente: Paciente;
  medico: Medico;
  fechaHora: string;
  estado: EstadoCita;
  precioConsulta: number;
  esPagada: boolean;
  stripeSessionId?: string;
  createdAt: string;
}

export interface CreateCitaRequest {
  medicoId: number;
  fechaHora: string;
}

// Backend response
export interface BackendAuthResponse {
  message: string;
}

// Frontend AuthResponse
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
  dni: string;
}

export interface HistorialMedico {
  id: number;
  cita: Cita;
  diagnostico: string;
  receta?: string;
  notas?: string;
  createdAt: string;
}

export interface CreateHistorialRequest {
  diagnostico: string;
  receta?: string;
  notas?: string;
}
