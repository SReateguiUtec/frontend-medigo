import { useState, useEffect } from 'react';
import { imagenMedicaService } from '@/api/imagen-medica.service';

interface MedicalImageProps {
    imageId: number;
    alt: string;
    className?: string;
    onClick?: () => void;
}

export const MedicalImage = ({ imageId, alt, className, onClick }: MedicalImageProps) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const url = await imagenMedicaService.getImageUrl(imageId);
                setImageUrl(url);
                setLoading(false);
            } catch (err) {
                console.error('Error loading image:', err);
                setError(true);
                setLoading(false);
            }
        };

        loadImage();

        // Cleanup: revoke the blob URL when component unmounts
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageId]);

    if (loading) {
        return (
            <div className={`${className} bg-gray-100 flex items-center justify-center`}>
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !imageUrl) {
        return (
            <div className={`${className} bg-gray-100 flex items-center justify-center`}>
                <p className="text-gray-400 text-sm">Error al cargar imagen</p>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onClick={onClick}
        />
    );
};
