import { useState, useEffect } from 'react';
import { profileService } from '../../api/profile.service';
import { useAuth } from '../../context/AuthContext';
import type { Medico } from '../../types';
import { User, Phone, Calendar, IdCard, Stethoscope, FileText, BadgeDollarSign, Check, ChevronDown } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { ProfilePhotoUpload } from '../../components/ProfilePhotoUpload';
import { DashboardHeader, DashboardPanel } from '@/components/dashboard';
import {
    ProfileHero,
    ProfileAlert,
    ProfileLoading,
    ProfileField,
    ProfileInfoSection,
    ProfileFormField,
    ProfileFormActions,
} from '@/components/profile';
import { cn } from '@/lib/utils';

const SPECIALTIES = [
    'Cardiología',
    'Pediatría',
    'Traumatología',
    'Dermatología',
    'Neurología',
    'Ginecología',
    'Oftalmología',
    'Psiquiatría',
];

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
            const data = (await profileService.getProfile()) as Medico;
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
                especialidad:
                    data.especialidades && data.especialidades.length > 0
                        ? data.especialidades[0].nombre_especialidad
                        : '',
            });
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleActivateAccount = async () => {
        try {
            const updated = (await profileService.updateAccountStatus('ACTIVADA')) as Medico;
            setProfile(updated);
            if (user) updateUser({ ...user, estadoCuenta: 'ACTIVADA' });
            setSuccess('Cuenta activada correctamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            console.error('Error activating account:', err);
            const errorMsg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Error al activar la cuenta';
            setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        }
    };

    const handlePhotoUpdate = async (file: File) => {
        const updated = (await profileService.uploadProfilePhoto(file)) as Medico;
        setProfile(updated);
        if (user) updateUser({ ...user, ...updated });
        setSuccess('Foto actualizada correctamente');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handlePhotoDelete = async () => {
        const updated = (await profileService.deleteProfilePhoto()) as Medico;
        setProfile(updated);
        if (user) updateUser({ ...user, ...updated });
        setSuccess('Foto eliminada correctamente');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updates: Record<string, unknown> = {};
            if (formData.nombres) updates.nombres = formData.nombres;
            if (formData.apellidos) updates.apellidos = formData.apellidos;
            if (formData.telefono) updates.telefono = formData.telefono;
            if (formData.edad) updates.edad = parseInt(formData.edad, 10);
            if (formData.dni) updates.dni = formData.dni;
            if (formData.numeroColegiado) updates.numeroColegiado = formData.numeroColegiado;
            if (formData.bio !== undefined) updates.bio = formData.bio;
            if (formData.precioConsulta) updates.precioConsulta = parseFloat(formData.precioConsulta);
            if (formData.especialidad) updates.especialidad = formData.especialidad;

            const updated = (await profileService.updateProfile(updates)) as Medico;
            setProfile(updated);
            setIsEditing(false);
            if (user) updateUser({ ...user, ...updated });
            setSuccess('Perfil actualizado correctamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            console.error('Error updating profile:', err);
            const errorMsg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Error al actualizar el perfil';
            setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const specialtyName =
        profile?.especialidades && profile.especialidades.length > 0
            ? profile.especialidades[0].nombre_especialidad
            : null;

    const initials =
        `${profile?.nombres?.charAt(0) ?? ''}${profile?.apellidos?.charAt(0) ?? ''}`.toUpperCase() || '?';

    if (loading) return <ProfileLoading />;

    return (
        <div>
            <DashboardHeader
                title="Mi perfil profesional"
                subtitle="Tu información visible para pacientes y la plataforma"
            />

            {error && <ProfileAlert type="error" message={error} />}
            {success && <ProfileAlert type="success" message={success} />}

            {profile && (
                <>
                    <ProfileHero
                        title={`Dr. ${profile.nombres} ${profile.apellidos}`}
                        email={profile.email}
                        accountActive={profile.estadoCuenta === 'ACTIVADA'}
                        badges={
                            specialtyName ? (
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
                                    {specialtyName}
                                </span>
                            ) : undefined
                        }
                        onEdit={!isEditing ? () => setIsEditing(true) : undefined}
                        footer={
                            profile.estadoCuenta !== 'ACTIVADA' && !isEditing ? (
                                <button
                                    type="button"
                                    onClick={handleActivateAccount}
                                    className="cursor-pointer text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
                                >
                                    Activar mi cuenta ahora →
                                </button>
                            ) : undefined
                        }
                        photoSlot={
                            <ProfilePhotoUpload
                                currentPhotoUrl={profile.rutaFoto}
                                onPhotoUpdate={handlePhotoUpdate}
                                onPhotoDelete={handlePhotoDelete}
                                initials={initials}
                            />
                        }
                    />

                    {!isEditing ? (
                        <div className="space-y-6">
                            {profile.bio && (
                                <DashboardPanel>
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                                            <FileText className="h-4 w-4" strokeWidth={1.75} />
                                        </div>
                                        <div>
                                            <h2 className="font-display text-base font-semibold text-slate-900">
                                                Biografía profesional
                                            </h2>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-600">{profile.bio}</p>
                                </DashboardPanel>
                            )}

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <ProfileInfoSection
                                    title="Información personal"
                                    icon={User}
                                >
                                    <ProfileField icon={User} label="Nombres" value={profile.nombres} />
                                    <ProfileField icon={User} label="Apellidos" value={profile.apellidos} />
                                    <ProfileField icon={Calendar} label="Edad" value={`${profile.edad} años`} />
                                    <ProfileField icon={IdCard} label="DNI" value={profile.dni || 'No especificado'} />
                                </ProfileInfoSection>

                                <ProfileInfoSection
                                    title="Información profesional"
                                    icon={Stethoscope}
                                >
                                    <ProfileField icon={Phone} label="Teléfono" value={profile.telefono} />
                                    <ProfileField
                                        icon={IdCard}
                                        label="Número de colegiado"
                                        value={profile.numeroColegiado || 'No especificado'}
                                    />
                                    <ProfileField
                                        icon={Stethoscope}
                                        label="Especialidad"
                                        value={specialtyName || 'No especificada'}
                                    />
                                    <ProfileField
                                        icon={BadgeDollarSign}
                                        label="Precio de consulta"
                                        value={profile.precioConsulta ? `S/ ${profile.precioConsulta}` : 'No especificado'}
                                    />
                                </ProfileInfoSection>
                            </div>
                        </div>
                    ) : (
                        <DashboardPanel>
                            <h2 className="font-display mb-6 text-lg font-semibold text-slate-900">
                                Editar información profesional
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <ProfileFormField
                                        label="Nombres"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                    />
                                    <ProfileFormField
                                        label="Apellidos"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        autoComplete="family-name"
                                    />
                                    <ProfileFormField
                                        label="Edad"
                                        name="edad"
                                        type="number"
                                        value={formData.edad}
                                        onChange={handleChange}
                                        min={18}
                                        max={90}
                                    />
                                    <ProfileFormField
                                        label="Teléfono"
                                        name="telefono"
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                    />
                                    <ProfileFormField
                                        label="DNI"
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        maxLength={8}
                                        disabled={!!profile.dni}
                                        helperText={profile.dni ? 'El DNI no puede modificarse' : undefined}
                                    />
                                    <ProfileFormField
                                        label="Número colegiado"
                                        name="numeroColegiado"
                                        value={formData.numeroColegiado}
                                        onChange={handleChange}
                                        disabled={!!profile.numeroColegiado}
                                        helperText={
                                            profile.numeroColegiado
                                                ? 'El número colegiado no puede modificarse'
                                                : undefined
                                        }
                                    />
                                    <ProfileFormField
                                        label="Precio de consulta (S/)"
                                        name="precioConsulta"
                                        type="number"
                                        value={formData.precioConsulta}
                                        onChange={handleChange}
                                        min={0}
                                        step={0.01}
                                    />

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Especialidad
                                        </label>
                                        <Listbox
                                            value={formData.especialidad}
                                            onChange={(value) => setFormData({ ...formData, especialidad: value })}
                                        >
                                            <div className="relative">
                                                <Listbox.Button className="relative flex min-h-[44px] w-full cursor-pointer items-center rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-left text-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                                                    <span
                                                        className={cn(
                                                            'block truncate',
                                                            !formData.especialidad ? 'text-slate-400' : 'text-slate-900'
                                                        )}
                                                    >
                                                        {formData.especialidad || 'Seleccionar especialidad...'}
                                                    </span>
                                                    <ChevronDown
                                                        className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400"
                                                        aria-hidden
                                                    />
                                                </Listbox.Button>
                                                <Transition
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200/80 bg-white py-1 shadow-lg focus:outline-none">
                                                        <Listbox.Option
                                                            value=""
                                                            className={({ active }) =>
                                                                cn(
                                                                    'relative cursor-pointer py-2.5 pr-4 pl-10 text-sm',
                                                                    active ? 'bg-blue-50 text-blue-900' : 'text-slate-900'
                                                                )
                                                            }
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={selected ? 'font-semibold' : 'font-normal'}>
                                                                        Seleccionar especialidad...
                                                                    </span>
                                                                    {selected && (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-700">
                                                                            <Check className="h-4 w-4" />
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                        {SPECIALTIES.map((specialty) => (
                                                            <Listbox.Option
                                                                key={specialty}
                                                                value={specialty}
                                                                className={({ active }) =>
                                                                    cn(
                                                                        'relative cursor-pointer py-2.5 pr-4 pl-10 text-sm',
                                                                        active
                                                                            ? 'bg-blue-50 text-blue-900'
                                                                            : 'text-slate-900'
                                                                    )
                                                                }
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className={selected ? 'font-semibold' : 'font-normal'}>
                                                                            {specialty}
                                                                        </span>
                                                                        {selected && (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-700">
                                                                                <Check className="h-4 w-4" />
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

                                <ProfileFormField
                                    label="Biografía profesional"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    as="textarea"
                                    placeholder="Cuéntanos sobre tu experiencia, especialidades y enfoque clínico..."
                                />

                                <ProfileFormActions onCancel={() => setIsEditing(false)} />
                            </form>
                        </DashboardPanel>
                    )}
                </>
            )}
        </div>
    );
};
