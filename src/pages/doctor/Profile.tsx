import { useState, useEffect } from 'react';
import { profileService } from '../../api/profile.service';
import { useAuth } from '../../context/AuthContext';
import type { Medico } from '../../types';
import { IconUser, IconMail, IconPhone, IconCalendar, IconId, IconEdit, IconCheck, IconX, IconStethoscope, IconFileText, IconCurrencyDollar } from '@tabler/icons-react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { ProfilePhotoUpload } from '../../components/ProfilePhotoUpload';

export const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
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
    precioConsulta: '',
    especialidad: '',
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
        precioConsulta: data.precioConsulta?.toString() || '',
        especialidad: data.especialidades && data.especialidades.length > 0
          ? data.especialidades[0].nombre_especialidad
          : '',
      });
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAccount = async () => {
    try {
      const updated = await profileService.updateAccountStatus('ACTIVADA');
      setProfile(updated as Medico);
      // Update the user in AuthContext as well
      if (user) {
        updateUser({ ...user, estadoCuenta: 'ACTIVADA' });
      }
      setSuccess('Cuenta activada correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error activating account:', err);
      const errorMsg = err.response?.data?.message || 'Error al activar la cuenta';
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const handlePhotoUpdate = async (file: File) => {
    const updated = await profileService.uploadProfilePhoto(file) as Medico;
    setProfile(updated);
    if (user) {
      updateUser({ ...user, ...updated });
    }
    setSuccess('Foto actualizada correctamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePhotoDelete = async () => {
    const updated = await profileService.deleteProfilePhoto() as Medico;
    setProfile(updated);
    if (user) {
      updateUser({ ...user, ...updated });
    }
    setSuccess('Foto eliminada correctamente');
    setTimeout(() => setSuccess(''), 3000);
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
      if (formData.precioConsulta) updates.precioConsulta = parseFloat(formData.precioConsulta);
      // Send specialty as an object with name property
      if (formData.especialidad) updates.especialidad = formData.especialidad;

      const updated = await profileService.updateProfile(updates) as Medico;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card with Avatar */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-linear-to-r from-emerald-500 via-teal-600 to-cyan-600 relative">
          </div>

          <div className="-mt-16 pb-6 px-8">
            {/* Profile Photo Upload */}
            <div className="mb-6">
              <ProfilePhotoUpload
                currentPhotoUrl={profile?.rutaFoto}
                onPhotoUpdate={handlePhotoUpdate}
                onPhotoDelete={handlePhotoDelete}
              />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Dr. {profile?.nombres} {profile?.apellidos}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mb-2 justify-center">
                <IconMail size={18} />
                {profile?.email}
              </p>
              {profile?.especialidades && profile.especialidades.length > 0 && (
                <div className="flex items-center gap-2 justify-center mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200">
                    {profile.especialidades[0].nombre_especialidad}
                  </span>
                </div>
              )}

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
                >
                  <IconEdit size={20} />
                  Editar Perfil
                </button>
              )}

              {/* Status Badge */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${profile?.estadoCuenta === 'ACTIVADA'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                  {profile?.estadoCuenta === 'ACTIVADA' ? '✓ Cuenta Activa' : '⚠ Cuenta Inactiva'}
                </span>

                {profile?.estadoCuenta !== 'ACTIVADA' && !isEditing && (
                  <button
                    onClick={handleActivateAccount}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline decoration-2 underline-offset-2 hover:decoration-emerald-700 transition-colors cursor-pointer"
                  >
                    Activar mi cuenta ahora
                  </button>
                )}
              </div>
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
          <div className="space-y-6">
            {/* Bio Card */}
            {profile.bio && (
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <IconFileText size={20} className="text-emerald-600" />
                  </div>
                  Biografía Profesional
                </h2>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <IconUser size={20} className="text-emerald-600" />
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

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <IconId size={20} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">DNI</p>
                      <p className="text-gray-900 font-medium">{profile.dni || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <IconStethoscope size={20} className="text-teal-600" />
                  </div>
                  Información Profesional
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
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Número de Colegiado</p>
                      <p className="text-gray-900 font-medium">{profile.numeroColegiado || 'No especificado'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <IconStethoscope size={20} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Especialidad</p>
                      <p className="text-gray-900 font-medium">
                        {profile.especialidades && profile.especialidades.length > 0
                          ? profile.especialidades[0].nombre_especialidad
                          : 'No especificada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <IconCurrencyDollar size={20} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Precio de Consulta</p>
                      <p className="text-gray-900 font-medium">
                        {profile.precioConsulta ? `S/ ${profile.precioConsulta}` : 'No especificado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Información Profesional</h2>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número Colegiado
                  </label>
                  <input
                    type="text"
                    name="numeroColegiado"
                    value={formData.numeroColegiado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="CMP-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio de Consulta (S/)
                  </label>
                  <input
                    type="number"
                    name="precioConsulta"
                    value={formData.precioConsulta}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="150.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Especialidad
                  </label>
                  <Listbox value={formData.especialidad} onChange={(value) => setFormData({ ...formData, especialidad: value })}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:border-gray-400">
                        <span className={`block truncate ${!formData.especialidad ? 'text-gray-400' : 'text-gray-900'}`}>
                          {formData.especialidad || 'Seleccionar especialidad...'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as="div"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Listbox.Option
                            value=""
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                  Seleccionar especialidad...
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                    <Check className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>

                          {['Cardiología', 'Pediatría', 'Traumatología', 'Dermatología', 'Neurología', 'Ginecología', 'Oftalmología', 'Psiquiatría'].map((specialty) => (
                            <Listbox.Option
                              key={specialty}
                              value={specialty}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900'
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                    {specialty}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                      <Check className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Biografía Profesional
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  placeholder="Cuéntanos sobre tu experiencia profesional, especialidades, y logros..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
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