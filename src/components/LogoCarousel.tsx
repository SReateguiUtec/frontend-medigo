import { LogoCarousel } from "@/components/ui/logo-carousel";

// Componente para imágenes SVG desde public
const SvgImage = ({ src, alt, scale = 1, offsetY = 0 }: { src: string; alt: string; scale?: number; offsetY?: number }) => (
    <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        style={{
            transform: `scale(${scale}) translateY(${offsetY}px)`,
            transformOrigin: 'center'
        }}
    />
);

const allLogos = [
    { name: "TypeScript", id: 1, img: () => <SvgImage src="/HUH.svg" alt="HUH" scale={0.9} /> },
    { name: "JavaScript", id: 2, img: () => <SvgImage src="/Florida Hospital Connected Care.svg" alt="Florida Hospital Connected Care" scale={0.9} /> },
    { name: "React", id: 3, img: () => <SvgImage src="/Royal Alexandria Hospital Foundation.svg" alt="Royal Alexandria Hospital Foundation" scale={0.9} /> },
    { name: "Node.js", id: 4, img: () => <SvgImage src="/cleveland-clinic-seeklogo.svg" alt="Cleveland Clinic" scale={0.9} /> },
    { name: "Spring Boot", id: 5, img: () => <SvgImage src="/Banner Health.svg" alt="Banner Health" scale={0.9} /> },
    { name: "AWS", id: 6, img: () => <SvgImage src="/Emblem Health.svg" alt="Emblem Health" scale={0.9} /> },
    { name: "Stripe", id: 7, img: () => <SvgImage src="/Neuralink Logo.svg" alt="Neuralink" scale={0.9} /> },
    { name: "Whereby", id: 8, img: () => <SvgImage src="/Providence Health Services.svg" alt="Providence Health Services" scale={0.9} /> },
    { name: "Gemini", id: 9, img: () => <SvgImage src="/United Health.svg" alt="United Health" scale={0.9} /> },
];

export function LogoCarouselDemo() {
    return (
        <div className="space-y-8 py-12">
            <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center space-y-1">
                <LogoCarousel columnCount={3} logos={allLogos} />
            </div>
        </div>
    );
}
