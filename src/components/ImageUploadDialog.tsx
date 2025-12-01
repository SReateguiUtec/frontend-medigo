import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { imagenMedicaService } from '@/api/imagen-medica.service';

interface ImageUploadDialogProps {
    historialMedicoId: number;
    onUploadSuccess: () => void;
    onClose: () => void;
}

export const ImageUploadDialog = ({ historialMedicoId, onUploadSuccess, onClose }: ImageUploadDialogProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten archivos de imagen');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('El archivo no debe superar los 10MB');
                return;
            }

            setSelectedFile(file);
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            // Simulate file input change
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
                handleFileSelect({ target: fileInputRef.current } as any);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError('');

        try {
            await imagenMedicaService.uploadImage(historialMedicoId, selectedFile, description);
            onUploadSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Subir Imagen Médica</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* File upload area */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <div className="space-y-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-lg"
                            />
                            <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                    setPreview(null);
                                }}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Cambiar imagen
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                <ImageIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-gray-900 mb-1">
                                    Arrastra una imagen aquí
                                </p>
                                <p className="text-sm text-gray-500">
                                    o haz clic para seleccionar
                                </p>
                            </div>
                            <p className="text-xs text-gray-400">
                                Formatos: JPG, PNG, GIF (máx. 10MB)
                            </p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción (opcional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej: Radiografía de tórax, vista frontal"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Subir Imagen
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
