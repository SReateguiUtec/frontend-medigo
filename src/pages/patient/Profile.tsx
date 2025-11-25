import { useState, useEffect } from 'react';
import { profileService } from '../../api/profile.service';
import { useAuth } from '../../context/AuthContext';
import type { Paciente } from '../../types';
import { IconUser, IconMail, IconPhone, IconCalendar, IconId, IconEdit, IconCheck, IconX } from '@tabler/icons-react';

export const PatientProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<Paciente | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    edad: '',
    dni: '',
    fechaNacimiento: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile() as Paciente;
      setProfile(data);
      setFormData({
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        edad: data.edad?.toString() || '',
        dni: data.dni || '',
        fechaNacimiento: data.fechaNacimiento || '',
      });
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const filteredUpdates = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== undefined)
      );

      const updated = await profileService.updateProfile(filteredUpdates) as Paciente;
      setProfile(updated);
      setIsEditing(false);
      // Update the user in AuthContext as well
      if (user) {
        updateUser({ ...user, ...updated });
      }
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMsg = err.response?.data?.message || 'Error al actualizar el perfil';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card with Avatar */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-linear-to-r from-blue-500 via-blue-600 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <IconUser size={48} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {profile?.nombres} {profile?.apellidos}
                </h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <IconMail size={18} />
                  {profile?.email}
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <IconEdit size={20} />
                  Editar Perfil
                </button>
              )}
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${profile?.estadoCuenta === 'ACTIVADA'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                {profile?.estadoCuenta === 'ACTIVADA' ? '✓ Cuenta Activa' : '⚠ Cuenta Inactiva'}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm animate-fade-in">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-sm animate-fade-in">
            <p className="font-medium">¡Éxito!</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Profile Information / Edit Form */}
        {profile && !isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <IconUser size={20} className="text-blue-600" />
                </div>
                Información Personal
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <IconUser size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Nombres</p>
                    <p className="text-gray-900 font-medium">{profile.nombres}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <IconUser size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Apellidos</p>
                    <p className="text-gray-900 font-medium">{profile.apellidos}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <IconCalendar size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Edad</p>
                    <p className="text-gray-900 font-medium">{profile.edad} años</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <IconPhone size={20} className="text-purple-600" />
                </div>
                Información de Contacto
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <IconPhone size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
                    <p className="text-gray-900 font-medium">{profile.telefono}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <IconId size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">DNI</p>
                    <p className="text-gray-900 font-medium">{profile.dni || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <IconCalendar size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha de Nacimiento</p>
                    <p className="text-gray-900 font-medium">{profile.fechaNacimiento || 'No especificada'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Información</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombres
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tus nombres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tus apellidos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    min="18"
                    max="90"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Edad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+51 999 999 999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DNI
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    maxLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  <IconCheck size={20} />
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
                >
                  <IconX size={20} />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};