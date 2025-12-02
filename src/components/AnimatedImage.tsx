import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface AnimatedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export const AnimatedImage = ({
    src,
    alt,
    className = '',
    fallbackSrc,
    ...props
}: AnimatedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        if (fallbackSrc) {
            setIsLoaded(true);
        }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Skeleton loader while image is loading */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}

            <img
                src={hasError && fallbackSrc ? fallbackSrc : src}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                {...props}
            />
        </div>
    );
};
