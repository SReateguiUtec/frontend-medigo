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
    { name: "HUH", id: 1, img: () => <SvgImage src="/HUH.svg" alt="HUH" scale={0.9} /> },
    { name: "Florida Hospital Connected Care", id: 2, img: () => <SvgImage src="/Florida Hospital Connected Care.svg" alt="Florida Hospital Connected Care" scale={0.9} /> },
    { name: "Royal Alexandria Hospital Foundation", id: 3, img: () => <SvgImage src="/Royal Alexandria Hospital Foundation.svg" alt="Royal Alexandria Hospital Foundation" scale={0.9} /> },
    { name: "Cleveland Clinic", id: 4, img: () => <SvgImage src="/cleveland-clinic-seeklogo.svg" alt="Cleveland Clinic" scale={0.9} /> },
    { name: "Banner Health", id: 5, img: () => <SvgImage src="/Banner Health.svg" alt="Banner Health" scale={0.9} /> },
    { name: "Emblem Health", id: 6, img: () => <SvgImage src="/Emblem Health.svg" alt="Emblem Health" scale={0.9} /> },
    { name: "Neuralink", id: 7, img: () => <SvgImage src="/Neuralink Logo.svg" alt="Neuralink" scale={0.9} /> },
    { name: "Providence Health Services", id: 8, img: () => <SvgImage src="/Providence Health Services.svg" alt="Providence Health Services" scale={0.9} /> },
    { name: "United Health", id: 9, img: () => <SvgImage src="/United Health.svg" alt="United Health" scale={0.9} /> },
    { name: "Clinica Anglo Americana", id: 10, img: () => <SvgImage src="/ClinicaAngloAmericana.svg" alt="Clinica Anglo Americana" scale={4} /> },
    { name: "Clinica Sanna", id: 11, img: () => <SvgImage src="/Clinic Sanna.svg" alt="Clinica Sanna" scale={0.9} /> },
    { name: "Clinica Internacional", id: 12, img: () => <SvgImage src="/Clinica Internacional Logo.svg" alt="Clinica Internacional" scale={2} /> },
    { name: "Clinica Ricardo Palma", id: 13, img: () => <SvgImage src="/Clinica Ricardo Palma Logo.svg" alt="Clinica Ricardo Palma" scale={2} /> },
    { name: "Lions Gate Hospital Foundation", id: 14, img: () => <SvgImage src="/Lions Gate Hospital Foundation.svg" alt="Lions Gate Hospital Foundation" scale={0.9} /> },
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
