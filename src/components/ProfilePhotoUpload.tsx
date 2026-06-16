import { useState, useRef } from 'react';
import { Camera, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { getImageUrl } from '@/utils/url.helper';
import { cn } from '@/lib/utils';

interface ProfilePhotoUploadProps {
    currentPhotoUrl?: string | null;
    onPhotoUpdate: (file: File) => Promise<void>;
    onPhotoDelete: () => Promise<void>;
    initials?: string;
}

export const ProfilePhotoUpload = ({
    currentPhotoUrl,
    onPhotoUpdate,
    onPhotoDelete,
    initials = '?',
}: ProfilePhotoUploadProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Solo se permiten imágenes JPG, PNG o WEBP';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'La imagen no debe superar los 5 MB';
        }
        return null;
    };

    const handleFileSelect = (file: File) => {
        setError('');
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        try {
            setUploading(true);
            setError('');
            await onPhotoUpdate(selectedFile);
            setSelectedFile(null);
            setPreview(null);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Error al subir la foto';
            setError(message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            setError('');
            await onPhotoDelete();
            setSelectedFile(null);
            setPreview(null);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Error al eliminar la foto';
            setError(message);
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const resolvedPhoto = preview || (currentPhotoUrl ? getImageUrl(currentPhotoUrl) : null);

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Avatar + hover overlay */}
            <div className="group relative inline-block">
                <div className="rounded-full bg-white p-1 ring-4 ring-white shadow-[0_8px_24px_rgba(15,118,110,0.12)]">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full bg-blue-50 md:h-28 md:w-28">
                        {resolvedPhoto ? (
                            <img src={resolvedPhoto} alt="Foto de perfil" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-600 to-blue-700">
                                {initials !== '?' ? (
                                    <span className="font-display text-2xl font-semibold text-white">{initials}</span>
                                ) : (
                                    <Camera className="h-8 w-8 text-white/90" strokeWidth={1.5} />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {!preview && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-slate-900/0 opacity-0 transition-all duration-200 group-hover:bg-slate-900/45 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        aria-label="Cambiar foto de perfil"
                    >
                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">
                            Cambiar
                        </span>
                    </button>
                )}
            </div>

            {/* Delete button — directly below the avatar */}
            {currentPhotoUrl && !preview && (
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                >
                    {deleting ? (
                        <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Eliminando...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-3 w-3" />
                            Eliminar foto
                        </>
                    )}
                </button>
            )}

            {/* Upload zone — only when no photo exists */}
            {!preview && !currentPhotoUrl && (
                <button
                    type="button"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        'w-full max-w-xs cursor-pointer rounded-xl border border-dashed px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                        isDragging
                            ? 'border-blue-400 bg-blue-50/50'
                            : 'border-slate-200 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/30'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Upload className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                        <div>
                            <p className="text-xs font-medium text-slate-700">Subir foto de perfil</p>
                            <p className="text-[11px] text-slate-500">JPG, PNG o WEBP · máx. 5 MB</p>
                        </div>
                    </div>
                </button>
            )}

            {/* Preview confirm/cancel */}
            {preview && selectedFile && (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <Upload className="h-3.5 w-3.5" />
                                Confirmar
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={uploading}
                        className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                        <X className="h-3.5 w-3.5" />
                        Cancelar
                    </button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Seleccionar imagen de perfil"
            />

            {error && (
                <p role="alert" className="max-w-xs text-center text-xs text-rose-600">
                    {error}
                </p>
            )}
        </div>
    );
};
