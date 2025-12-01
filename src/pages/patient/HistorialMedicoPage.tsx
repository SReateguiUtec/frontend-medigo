import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, Calendar, User, Stethoscope, X } from 'lucide-react';
import { historialMedicoService } from '@/api/historial-medico.service';
import { imagenMedicaService, type ImagenMedica } from '@/api/imagen-medica.service';
import { MedicalImageViewer } from '@/components/MedicalImageViewer';
import { ImageUploadDialog } from '@/components/ImageUploadDialog';
import { MedicalImage } from '@/components/MedicalImage';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import type { HistorialMedico } from '@/types';

export const HistorialMedicoPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [historial, setHistorial] = useState<HistorialMedico | null>(null);
    const [imagenes, setImagenes] = useState<ImagenMedica[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImagenMedica | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [imageToDelete, setImageToDelete] = useState<ImagenMedica | null>(null);

    const canAnnotate = user?.rol === 'MEDICO';

    const loadHistorial = async () => {
        if (!id) return;
        try {
            const data = await historialMedicoService.getById(Number(id));
            setHistorial(data);
        } catch (error) {
            console.error('Error loading historial:', error);
            setError('Error al cargar el historial médico');
        }
    };

    const loadImages = async () => {
        if (!id) return;
        try {
            const data = await imagenMedicaService.getImagesByHistorial(Number(id));
            setImagenes(data);
        } catch (error) {
            console.error('Error loading images:', error);
            // Don't set error here, just log it - images might not exist yet
            setImagenes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistorial();
        loadImages();
    }, [id]);

    const handleUploadSuccess = () => {
        loadImages();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <p className="text-gray-500 text-sm mb-6">
                        Verifica que el backend esté corriendo en http://localhost:8080
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    if (!historial) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Historial médico no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Card with Doctor Info */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white">
                                    Dr. {historial.cita.medico.nombres} {historial.cita.medico.apellidos}
                                </h1>
                                <p className="text-emerald-100">Especialista</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <div className="flex items-center gap-2 text-white">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-medium">
                                        {new Date(historial.createdAt).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-emerald-100">
                            Registro: {new Date(historial.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                        </div>
                    </div>

                    {/* Diagnosis Section */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Stethoscope className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Diagnóstico</h3>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-l-4 border-emerald-500">
                            <p className="text-gray-700 leading-relaxed">{historial.diagnostico}</p>
                        </div>
                    </div>

                    {/* Prescription Section */}
                    {historial.receta && (
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Receta Médica</h3>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                                <p className="text-gray-700 leading-relaxed">{historial.receta}</p>
                            </div>
                        </div>
                    )}

                    {/* Notes Section */}
                    {historial.notas && (
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Notas Adicionales</h3>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500">
                                <p className="text-gray-700 leading-relaxed">{historial.notas}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Consult Doctor Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/messages/chat/${historial.cita.medico.id}`)}
                        className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <User className="w-5 h-5" />
                        Consulta con tu médico
                    </button>
                </div>
                {/* Imágenes Médicas */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="w-6 h-6" />
                            Imágenes Médicas
                        </h2>
                        <button
                            onClick={() => setShowUploadDialog(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            Subir Imagen
                        </button>
                    </div>

                    {imagenes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 mb-2">No hay imágenes médicas</p>
                            <p className="text-sm text-gray-500">
                                Haz clic en "Subir Imagen" para agregar radiografías, análisis, resonancias, etc.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {imagenes.map((imagen) => (
                                <div
                                    key={imagen.id}
                                    className="group relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
                                >
                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageToDelete(imagen);
                                        }}
                                        className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Image */}
                                    <div
                                        className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer relative overflow-hidden"
                                        onClick={() => setSelectedImage(imagen)}
                                    >
                                        <MedicalImage
                                            imageId={imagen.id}
                                            alt={imagen.fileName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                                    <p className="text-sm font-semibold text-gray-900">Click para ver</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-900 truncate flex-1">
                                                {imagen.fileName}
                                            </h4>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                                                {(imagen.fileSize / 1024).toFixed(0)} KB
                                            </span>
                                        </div>
                                        {imagen.description && (
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {imagen.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(imagen.uploadedAt).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl">
                        <MedicalImageViewer
                            image={selectedImage}
                            onClose={() => setSelectedImage(null)}
                            canAnnotate={canAnnotate}
                        />
                    </div>
                </div>
            )}

            {/* Upload Dialog */}
            {showUploadDialog && id && (
                <ImageUploadDialog
                    historialMedicoId={Number(id)}
                    onUploadSuccess={handleUploadSuccess}
                    onClose={() => setShowUploadDialog(false)}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={imageToDelete !== null}
                onClose={() => setImageToDelete(null)}
                onConfirm={async () => {
                    if (imageToDelete) {
                        try {
                            await imagenMedicaService.deleteImage(imageToDelete.id);
                            loadImages();
                        } catch (error: any) {
                            console.error('Error deleting image:', error);
                            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
                            alert(`Error al eliminar la imagen: ${errorMessage}`);
                        }
                    }
                }}
                title="¿Eliminar imagen médica?"
                message={`¿Estás seguro de eliminar "${imageToDelete?.fileName}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};
