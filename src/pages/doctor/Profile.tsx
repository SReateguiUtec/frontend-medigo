import { useState, useEffect } from 'react';
import { profileService } from '../../api/profile.service';
import type { Medico } from '../../types';

export const DoctorProfile = () => {
  const [profile, setProfile] = useState<Medico | null>(null);
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
    numeroColegiado: '',
    bio: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile() as Medico;
      setProfile(data);
      setFormData({
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        edad: data.edad?.toString() || '',
        dni: data.dni || '',
        numeroColegiado: data.numeroColegiado || '',
        bio: data.bio || '',
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
      const updates: Record<string, any> = {};
      if (formData.nombres) updates.nombres = formData.nombres;
      if (formData.apellidos) updates.apellidos = formData.apellidos;
      if (formData.telefono) updates.telefono = formData.telefono;
      if (formData.edad) updates.edad = parseInt(formData.edad, 10);
      if (formData.dni) updates.dni = formData.dni;
      if (formData.numeroColegiado) updates.numeroColegiado = formData.numeroColegiado;
      if (formData.bio !== undefined) updates.bio = formData.bio;

      const updated = await profileService.updateProfile(updates) as Medico;
      setProfile(updated);
      setIsEditing(false);
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
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil Profesional</h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {profile && !isEditing && (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="text-lg font-medium text-gray-900">{profile.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombres</p>
                    <p className="text-lg font-medium text-gray-900">{profile.nombres}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Apellidos</p>
                    <p className="text-lg font-medium text-gray-900">{profile.apellidos}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <p className="text-lg font-medium text-gray-900">{profile.edad} años</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="text-lg font-medium text-gray-900">{profile.telefono}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Especialidad</p>
                    <p className="text-lg font-medium text-gray-900">{profile.especialidades && profile.especialidades.length > 0 ? profile.especialidades[0].nombre : 'No especificada'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Número de Colegiado</p>
                    <p className="text-lg font-medium text-gray-900">{profile.numeroColegiado || 'No especificado'}</p>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">DNI</p>
                    <p className="text-lg font-medium text-gray-900">{profile.dni || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio de Consulta</p>
                    <p className="text-lg font-medium text-gray-900">{profile.precioConsulta ? `$${profile.precioConsulta}` : 'No especificado'}</p>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Biografía</p>
                  <p className="text-lg font-medium text-gray-900">{profile.bio || 'No especificada'}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">Estado de Cuenta</p>
                  <div className="flex items-center mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.estadoCuenta === 'ACTIVADA'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {profile.estadoCuenta}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>
            )}

            {isEditing && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres
                    </label>
                    <input
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edad
                    </label>
                    <input
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      min="18"
                      max="90"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI
                    </label>
                    <input
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      maxLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número Colegiado
                  </label>
                  <input
                    type="text"
                    name="numeroColegiado"
                    value={formData.numeroColegiado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cuéntanos sobre tu experiencia profesional..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
