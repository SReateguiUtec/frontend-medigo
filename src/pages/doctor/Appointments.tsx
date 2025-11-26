import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios.config';
import { useVideoCall } from '../../hooks/useVideoCall';
import { CreateMedicalRecordModal } from '../../components/CreateMedicalRecordModal';
import type { Cita, Medico } from '../../types';
import { Calendar, Clock, User, Stethoscope, History, FileText, Video, DollarSign, AlertCircle, CheckCircle, XCircle, Mail } from 'lucide-react';

export const Appointments = () => {
  const navigate = useNavigate();
  const { loading: videoLoading, joinVideoCall } = useVideoCall(); // Usamos el hook
  const [appointments, setAppointments] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await axiosInstance.get('/citas/medico');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMADA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELADA':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'COMPLETADA':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'CONFIRMADA':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'CANCELADA':
        return <XCircle className="w-3.5 h-3.5" />;
      case 'COMPLETADA':
        return <CheckCircle className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const handleViewHistory = (pacienteId: number) => {
    navigate(`/doctor/patient/${pacienteId}/history`);
  };

  const handleCreateRecord = (cita: Cita) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  // Función para unirse a la videollamada
  const handleJoinVideoCall = async (citaId: number) => {
    const result = await joinVideoCall(citaId);
    if (!result.success) {
      // Show more descriptive error message
      alert(result.message);
    }
  };

  // Verificar si es hora de la cita (dentro de 1 hora antes o después, o si ya pasó pero está confirmada)
  const isTimeForAppointment = (appointment: Cita) => {
    const aptDate = new Date(appointment.fechaHora);
    const now = new Date();
    const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos
    
    // Verificar si la cita está confirmada y:
    // 1. Es en la última hora o próxima hora, O
    // 2. Ya pasó pero está confirmada
    return (
      (appointment.estado === 'CONFIRMADA' || appointment.estado === 'PENDIENTE') && 
      (aptDate.getTime() - now.getTime() <= oneHour && aptDate.getTime() + oneHour > now.getTime() ||
       aptDate.getTime() < now.getTime())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mis Citas</h1>
            <p className="text-gray-500 text-sm">Gestiona tus consultas programadas</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
            Total: {appointments.length}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((cita) => (
              <div key={cita.id} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  {/* Left Section - Date Box */}
                  <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-emerald-50 rounded-2xl border border-emerald-100 shrink-0">
                    <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">
                      {new Date(cita.fechaHora).toLocaleDateString('es-ES', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {new Date(cita.fechaHora).getDate()}
                    </span>
                    <span className="text-emerald-600/70 text-xs">
                      {new Date(cita.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                          {cita.paciente.nombres} {cita.paciente.apellidos}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {cita.paciente.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Date */}
                    <div className="sm:hidden flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      {new Date(cita.fechaHora).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })} • {new Date(cita.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="flex items-center gap-4">
                      {cita.esPagada ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          <DollarSign className="w-3.5 h-3.5" />
                          Pago confirmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                          <DollarSign className="w-3.5 h-3.5" />
                          Pendiente de pago
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 justify-end lg:justify-center lg:border-l lg:border-gray-100 lg:pl-6 min-w-[200px] items-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cita.estado)} w-fit`}>
                      {getStatusIcon(cita.estado)}
                      {cita.estado}
                    </span>

                    <button
                      onClick={() => handleViewHistory(cita.paciente.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm text-sm font-medium w-full"
                    >
                      <History className="w-4 h-4" />
                      Ver Historial
                    </button>
                    <button
                      onClick={() => handleCreateRecord(cita)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-sm text-sm font-medium w-full"
                    >
                      <FileText className="w-4 h-4" />
                      Crear Registro
                    </button>

                    {/* Botón de videollamada que aparece cuando es hora de la cita */}
                    {isTimeForAppointment(cita) && (
                      <button
                        onClick={() => handleJoinVideoCall(cita.id)}
                        disabled={videoLoading}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 font-medium disabled:opacity-50 text-sm w-full"
                      >
                        <Video className="w-4 h-4" />
                        {videoLoading ? 'Conectando...' : 'Videollamada'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes citas programadas
            </h3>
            <p className="text-gray-500">
              Las citas agendadas aparecerán aquí.
            </p>
          </div>
        )}
      </div>

      {/* Medical Record Modal */}
      {selectedCita && (
        <CreateMedicalRecordModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCita(null);
          }}
          citaId={selectedCita.id}
          pacienteNombre={`${selectedCita.paciente.nombres} ${selectedCita.paciente.apellidos}`}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedCita(null);
            loadAppointments(); // Reload appointments after creating record
          }}
        />
      )}
    </div>
  );
};