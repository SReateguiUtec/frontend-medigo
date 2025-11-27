import { useState, useRef } from 'react';
import { IconCamera, IconTrash, IconUpload, IconX } from '@tabler/icons-react';

interface ProfilePhotoUploadProps {
    currentPhotoUrl?: string | null;
    onPhotoUpdate: (file: File) => Promise<void>;
    onPhotoDelete: () => Promise<void>;
}

export const ProfilePhotoUpload = ({
    currentPhotoUrl,
    onPhotoUpdate,
    onPhotoDelete
}: ProfilePhotoUploadProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Solo se permiten imágenes (JPG, PNG, WEBP)';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'La imagen no debe superar los 5MB';
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
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
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
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setUploading(true);
            setError('');
            await onPhotoUpdate(selectedFile);
            setSelectedFile(null);
            setPreview(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al subir la foto');
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
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al eliminar la foto');
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayPhoto = preview || currentPhotoUrl;

    return (
        <div className="space-y-4">
            {/* Photo Display */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg mx-auto">
                    {displayPhoto ? (
                        <img
                            src={displayPhoto}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <IconCamera size={48} className="text-white" />
                        </div>
                    )}
                </div>

                {/* Overlay on hover */}
                {!preview && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition-all"
                        >
                            Cambiar foto
                        </button>
                    </div>
                )}
            </div>

            {/* File Input (Hidden) */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Drag & Drop Zone (only show if no preview) */}
            {!preview && !currentPhotoUrl && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <IconUpload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                        Arrastra una imagen o haz click para seleccionar
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG o WEBP (máx. 5MB)
                    </p>
                </div>
            )}

            {/* Preview Actions */}
            {preview && selectedFile && (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <IconUpload size={18} />
                                Subir Foto
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        <IconX size={18} />
                        Cancelar
                    </button>
                </div>
            )}

            {/* Delete Button (only if photo exists and no preview) */}
            {currentPhotoUrl && !preview && (
                <div className="flex justify-center">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        {deleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <IconTrash size={18} />
                                Eliminar Foto
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};
