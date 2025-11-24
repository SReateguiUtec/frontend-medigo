import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchService } from '../../api/search.service';
import type { MedicoSearchResponse } from '../../api/search.service';
import { User, Mail, Phone, Calendar, DollarSign, Award, ArrowLeft, Stethoscope } from 'lucide-react';

export const DoctorPublicProfile = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState<MedicoSearchResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (doctorId) {
            loadDoctorProfile();
        }
    }, [doctorId]);

    const loadDoctorProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await searchService.getMedicoById(Number(doctorId));
            setDoctor(data);
        } catch (err: any) {
            console.error('Error loading doctor profile:', err);
            setError('Error al cargar el perfil del médico');
        } finally {
            setLoading(false);
        }
    };

    const getEspecialidadNombre = (): string => {
        if (doctor?.especialidades && doctor.especialidades.length > 0) {
            return Array.from(doctor.especialidades)[0].nombre;
        }
        return 'No especificada';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">{error || 'Médico no encontrado'}</p>
                    <button
                        onClick={() => navigate('/patient/search')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Volver a la búsqueda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/patient/search')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a la búsqueda
                </button>

                {/* Header Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="p-8 text-white">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {doctor.rutaFoto ? (
                                    <img
                                        src={doctor.rutaFoto}
                                        alt={`${doctor.nombres} ${doctor.apellidos}`}
                                        className="w-32 h-32 rounded-full border-4 border-white/30 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">
                                    {doctor.nombres} {doctor.apellidos}
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <Stethoscope className="w-5 h-5" />
                                    <span className="text-xl">{getEspecialidadNombre()}</span>
                                </div>
                                {doctor.numeroColegiado && (
                                    <div className="flex items-center gap-2 text-white/90">
                                        <Award className="w-4 h-4" />
                                        <span>CMP: {doctor.numeroColegiado}</span>
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            {doctor.precioConsulta && (
                                <div className="text-right">
                                    <p className="text-white/80 text-sm mb-1">Consulta desde</p>
                                    <p className="text-4xl font-bold">S/ {doctor.precioConsulta}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                {doctor.bio && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-600" />
                            Sobre el médico
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                    </div>
                )}

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h2>
                    <div className="space-y-3">
                        {doctor.email && (
                            <div className="flex items-center gap-3 text-gray-700">
                                <Mail className="w-5 h-5 text-emerald-600" />
                                <span>{doctor.email}</span>
                            </div>
                        )}
                        {doctor.telefono && (
                            <div className="flex items-center gap-3 text-gray-700">
                                <Phone className="w-5 h-5 text-emerald-600" />
                                <span>{doctor.telefono}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Specialties */}
                {doctor.especialidades && doctor.especialidades.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Especialidades</h2>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(doctor.especialidades).map((esp, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                                >
                                    {esp.nombre}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <button
                        onClick={() => {
                            // TODO: Navigate to appointment booking
                            alert('Funcionalidad de agendar cita próximamente');
                        }}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-6 h-6" />
                        Agendar Cita
                    </button>
                </div>
            </div>
        </div>
    );
};
