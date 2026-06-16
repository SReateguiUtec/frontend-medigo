import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, Calendar, Stethoscope, X, ClipboardList, Pill, FileText, MessageCircle } from 'lucide-react';
import { historialMedicoService } from '@/api/historial-medico.service';
import { imagenMedicaService, type ImagenMedica } from '@/api/imagen-medica.service';
import { MedicalImageViewer } from '@/components/MedicalImageViewer';
import { ImageUploadDialog } from '@/components/ImageUploadDialog';
import { MedicalImage } from '@/components/MedicalImage';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import type { HistorialMedico } from '@/types';
import { DashboardHeader, DashboardPanel } from '@/components/dashboard';
import { cn } from '@/lib/utils';

export const HistorialMedicoPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [historial, setHistorial] = useState<HistorialMedico | null>(null);
    const [imagenes, setImagenes] = useState<ImagenMedica[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImagenMedica | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageToDelete, setImageToDelete] = useState<ImagenMedica | null>(null);

    const canAnnotate = user?.rol === 'MEDICO';

    const loadHistorial = async () => {
        if (!id) return;
        try {
            const data = await historialMedicoService.getById(Number(id));
            setHistorial(data);
        } catch {
            setError('Error al cargar el historial médico');
        }
    };

    const loadImages = async () => {
        if (!id) return;
        try {
            const data = await imagenMedicaService.getImagesByHistorial(Number(id));
            setImagenes(data);
        } catch {
            setImagenes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistorial();
        loadImages();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[320px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                    <p className="text-sm text-slate-500">Cargando historial...</p>
                </div>
            </div>
        );
    }

    if (error || !historial) {
        return (
            <div>
                <DashboardHeader title="Historial médico" subtitle="" />
                <DashboardPanel className="flex flex-col items-center py-16 text-center">
                    <p className="text-sm font-medium text-rose-700">{error || 'Registro no encontrado'}</p>
                    <button type="button" onClick={() => navigate(-1)}
                        className="mt-4 cursor-pointer text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900">
                        ← Volver
                    </button>
                </DashboardPanel>
            </div>
        );
    }

    const doctor = historial.cita.medico;
    const especialidad = doctor.especialidades?.[0]?.nombre_especialidad || 'Especialista';

    return (
        <div>
            <DashboardHeader
                title={`Dr. ${doctor.nombres} ${doctor.apellidos}`}
                subtitle={`${especialidad} · ${new Date(historial.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-5 lg:col-span-2">
                    {/* Doctor header card */}
                    <DashboardPanel className="overflow-hidden p-0">
                        <div className="h-2 bg-linear-to-r from-blue-600 to-blue-700" />
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                    <Stethoscope className="h-5 w-5" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <p className="font-display text-base font-semibold text-slate-900">
                                        Dr. {doctor.nombres} {doctor.apellidos}
                                    </p>
                                    <p className="text-sm text-slate-500">{especialidad}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                                {new Date(historial.cita.fechaHora).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </DashboardPanel>

                    {/* Medical content */}
                    <DashboardPanel className="space-y-5">
                        <MedicalBlock icon={ClipboardList} label="Diagnóstico" color="blue">
                            {historial.diagnostico}
                        </MedicalBlock>
                        {historial.receta && (
                            <MedicalBlock icon={Pill} label="Receta médica" color="indigo">
                                {historial.receta}
                            </MedicalBlock>
                        )}
                        {historial.notas && (
                            <MedicalBlock icon={FileText} label="Notas adicionales" color="slate">
                                {historial.notas}
                            </MedicalBlock>
                        )}
                    </DashboardPanel>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Message doctor */}
                    <DashboardPanel>
                        <h2 className="font-display mb-3 text-sm font-semibold text-slate-900">¿Tienes dudas?</h2>
                        <p className="mb-4 text-xs leading-relaxed text-slate-500">
                            Puedes contactar a tu médico directamente para aclarar el diagnóstico o la receta.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate(`/messages/chat/${doctor.id}`)}
                            className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        >
                            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                            Consultar con el médico
                        </button>
                    </DashboardPanel>

                    {/* Date info */}
                    <DashboardPanel className="space-y-3">
                        <h2 className="font-display text-sm font-semibold text-slate-900">Detalles del registro</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Fecha de cita</span>
                                <span className="font-medium text-slate-900">
                                    {new Date(historial.cita.fechaHora).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Registro creado</span>
                                <span className="font-medium text-slate-900">
                                    {new Date(historial.createdAt).toLocaleDateString('es-ES')}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Con receta</span>
                                <span className={cn('font-semibold', historial.receta ? 'text-blue-600' : 'text-slate-400')}>
                                    {historial.receta ? 'Sí' : 'No'}
                                </span>
                            </div>
                        </div>
                    </DashboardPanel>
                </div>
            </div>

            {/* Medical images */}
            <section className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <ImageIcon className="h-4 w-4" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-semibold text-slate-900">Imágenes médicas</h2>
                            <p className="text-xs text-slate-500">{imagenes.length} archivo{imagenes.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowUploadDialog(true)}
                        className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        <Upload className="h-4 w-4" strokeWidth={1.75} />
                        Subir imagen
                    </button>
                </div>

                {imagenes.length === 0 ? (
                    <DashboardPanel className="flex flex-col items-center py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                            <ImageIcon className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
                        </div>
                        <p className="mt-4 text-sm font-medium text-slate-700">Sin imágenes médicas</p>
                        <p className="mt-1 max-w-xs text-xs text-slate-500">
                            Sube radiografías, análisis o resonancias para mantener tu historial completo.
                        </p>
                    </DashboardPanel>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {imagenes.map((imagen) => (
                            <article
                                key={imagen.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-blue-200/80 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]"
                            >
                                <button
                                    type="button"
                                    onClick={() => setImageToDelete(imagen)}
                                    className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-500 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
                                    aria-label="Eliminar imagen"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>

                                <div
                                    className="relative aspect-square cursor-pointer overflow-hidden bg-slate-100"
                                    onClick={() => setSelectedImage(imagen)}
                                >
                                    <MedicalImage
                                        imageId={imagen.id}
                                        alt={imagen.fileName}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors group-hover:bg-slate-900/25">
                                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                            Ver imagen
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-medium text-slate-900">{imagen.fileName}</p>
                                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                            {(imagen.fileSize / 1024).toFixed(0)} KB
                                        </span>
                                    </div>
                                    {imagen.description && (
                                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{imagen.description}</p>
                                    )}
                                    <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(imagen.uploadedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-6xl">
                        <MedicalImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} canAnnotate={canAnnotate} />
                    </div>
                </div>
            )}

            {showUploadDialog && id && (
                <ImageUploadDialog
                    historialMedicoId={Number(id)}
                    onUploadSuccess={() => loadImages()}
                    onClose={() => setShowUploadDialog(false)}
                />
            )}

            <DeleteConfirmDialog
                isOpen={imageToDelete !== null}
                onClose={() => setImageToDelete(null)}
                onConfirm={async () => {
                    if (imageToDelete) {
                        try {
                            await imagenMedicaService.deleteImage(imageToDelete.id);
                            loadImages();
                        } catch (err: unknown) {
                            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error desconocido';
                            alert(`Error al eliminar la imagen: ${msg}`);
                        }
                    }
                }}
                title="¿Eliminar imagen médica?"
                message={`¿Estás seguro de eliminar "${imageToDelete?.fileName}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

function MedicalBlock({ icon: Icon, label, color, children }: {
    icon: typeof FileText;
    label: string;
    color: 'blue' | 'indigo' | 'slate';
    children: React.ReactNode;
}) {
    const iconBg = { blue: 'bg-blue-50 text-blue-600', indigo: 'bg-indigo-50 text-indigo-600', slate: 'bg-slate-100 text-slate-600' };
    const blockBg = { blue: 'bg-blue-50/40 border-blue-100/80', indigo: 'bg-indigo-50/40 border-indigo-100/80', slate: 'bg-slate-50/60 border-slate-200/80' };

    return (
        <div>
            <div className="mb-2 flex items-center gap-2">
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', iconBg[color])}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
                <h4 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{label}</h4>
            </div>
            <div className={cn('rounded-xl border px-4 py-3', blockBg[color])}>
                <p className="text-sm leading-relaxed text-slate-700">{children}</p>
            </div>
        </div>
    );
}
