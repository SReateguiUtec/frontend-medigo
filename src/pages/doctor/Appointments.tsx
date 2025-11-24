import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios.config';
import type { Cita } from '../../types';

export const Appointments = () => {
  const [appointments, setAppointments] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

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
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      case 'COMPLETADA':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Mis Citas</h1>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : (
          <div className="space-y-4">
            {appointments.map((cita) => (
              <div key={cita.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {cita.paciente.nombres} {cita.paciente.apellidos}
                    </h3>
                    <p className="text-gray-600">{cita.paciente.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      cita.estado
                    )}`}
                  >
                    {cita.estado}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      <strong>Fecha:</strong>{' '}
                      {new Date(cita.fechaHora).toLocaleString('es-PE')}
                    </p>
                    <p className="text-gray-600">
                      <strong>Motivo:</strong> {cita.motivo}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Pagado:</strong> {cita.esPagada ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tienes citas programadas
          </div>
        )}
      </div>
    </div>
  );
};
