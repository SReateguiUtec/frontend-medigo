import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchService } from '../../api/search.service';
import type { MedicoSearchResponse } from '../../api/search.service';
import { User, Mail, Phone, Calendar, Award, ArrowLeft, Stethoscope } from 'lucide-react';
import { BookAppointmentModal } from '../../components/BookAppointmentModal';
import type { Medico } from '../../types';

export const DoctorPublicProfile = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState<MedicoSearchResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            console.log('Doctor data loaded:', data); // Debug log
            console.log('numeroColegiado value:', data.numeroColegiado); // Specific field check
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
            return doctor.especialidades[0].nombre_especialidad;
        }
        return 'No especificada';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando perfil del médico...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                        >
                            Volver atrás
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Médico no encontrado</h3>
                        <p className="text-gray-600 mb-6">No pudimos encontrar el perfil del médico solicitado.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                        >
                            Volver atrás
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Debug log to see what data we have
    console.log('Doctor data in profile view:', doctor);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                                    <span className="text-4xl font-bold text-white">
                                        {doctor.nombres?.charAt(0)}{doctor.apellidos?.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2 text-white">
                                    {doctor.nombres} {doctor.apellidos}
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <Stethoscope className="w-5 h-5 text-white" />
                                    <span className="text-xl text-white">{getEspecialidadNombre()}</span>
                                </div>
                                {doctor.numeroColegiado && doctor.numeroColegiado.trim() !== '' && (
                                    <div className="inline-flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-lg">
                                        <Award className="w-4 h-4" />
                                        <span className="font-medium">CMP: {doctor.numeroColegiado}</span>
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            {doctor.precioConsulta && (
                                <div className="text-right">
                                    <p className="text-white/80 text-sm mb-1">Consulta desde</p>
                                    <p className="text-4xl font-bold text-white">S/ {doctor.precioConsulta}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
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
                                            {esp.nombre_especialidad}
                                        </span>
                                    ))}
                                </div>
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
                    </div>

                    <div className="space-y-6">
                        {/* Action Button */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-6 h-6" />
                                Agendar Cita
                            </button>

                            {/* Appointment Modal */}
                            {doctor && (
                                <BookAppointmentModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    doctor={doctor as unknown as Medico}
                                    onSuccess={() => {
                                        // Show success message or redirect
                                        console.log('Appointment created successfully!');
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};