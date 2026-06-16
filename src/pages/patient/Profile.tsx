import { useState, useEffect } from 'react';
import { profileService } from '../../api/profile.service';
import { useAuth } from '../../context/AuthContext';
import type { Paciente } from '../../types';
import { User, Phone, Calendar, IdCard } from 'lucide-react';
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
            const data = (await profileService.getProfile()) as Paciente;
            setProfile(data);
            setFormData({
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                edad: data.edad?.toString() || '',
                dni: data.dni || '',
                fechaNacimiento: data.fechaNacimiento || '',
            });
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpdate = async (file: File) => {
        const updated = (await profileService.uploadProfilePhoto(file)) as Paciente;
        setProfile(updated);
        if (user) updateUser({ ...user, ...updated });
        setSuccess('Foto actualizada correctamente');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handlePhotoDelete = async () => {
        const updated = (await profileService.deleteProfilePhoto()) as Paciente;
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
            const filteredUpdates = Object.fromEntries(
                Object.entries(formData).filter(([, value]) => value !== '' && value !== undefined)
            );
            const updated = (await profileService.updateProfile(filteredUpdates)) as Paciente;
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

    const initials =
        `${profile?.nombres?.charAt(0) ?? ''}${profile?.apellidos?.charAt(0) ?? ''}`.toUpperCase() || '?';

    if (loading) return <ProfileLoading />;

    return (
        <div>
            <DashboardHeader
                title="Mi perfil"
                subtitle="Administra tu información personal y de contacto"
            />

            {error && <ProfileAlert type="error" message={error} />}
            {success && <ProfileAlert type="success" message={success} />}

            {profile && (
                <>
                    <ProfileHero
                        title={`${profile.nombres} ${profile.apellidos}`}
                        email={profile.email}
                        accountActive={profile.estadoCuenta === 'ACTIVADA'}
                        onEdit={!isEditing ? () => setIsEditing(true) : undefined}
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
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <ProfileInfoSection
                                title="Información personal"
                                description="Datos básicos de identificación"
                                icon={User}
                            >
                                <ProfileField icon={User} label="Nombres" value={profile.nombres} />
                                <ProfileField icon={User} label="Apellidos" value={profile.apellidos} />
                                <ProfileField icon={Calendar} label="Edad" value={`${profile.edad} años`} />
                            </ProfileInfoSection>

                            <ProfileInfoSection
                                title="Contacto y documentos"
                                description="Cómo podemos comunicarnos contigo"
                                icon={Phone}
                            >
                                <ProfileField icon={Phone} label="Teléfono" value={profile.telefono} />
                                <ProfileField icon={IdCard} label="DNI" value={profile.dni || 'No especificado'} />
                                <ProfileField
                                    icon={Calendar}
                                    label="Fecha de nacimiento"
                                    value={profile.fechaNacimiento || 'No especificada'}
                                />
                            </ProfileInfoSection>
                        </div>
                    ) : (
                        <DashboardPanel>
                            <h2 className="font-display mb-6 text-lg font-semibold text-slate-900">
                                Editar información
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
                                        placeholder="+51 999 999 999"
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
                                        label="Fecha de nacimiento"
                                        name="fechaNacimiento"
                                        type="date"
                                        value={formData.fechaNacimiento}
                                        onChange={handleChange}
                                    />
                                </div>
                                <ProfileFormActions onCancel={() => setIsEditing(false)} />
                            </form>
                        </DashboardPanel>
                    )}
                </>
            )}
        </div>
    );
};
