import {
    ScrollXCarousel,
    ScrollXCarouselContainer,
    ScrollXCarouselProgress,
    ScrollXCarouselWrap
} from "@/components/ui/scroll-x-carousel";
import {
    CardHoverReveal,
    CardHoverRevealContent,
    CardHoverRevealMain,
} from '@/components/ui/reveal-on-hover'
import { Badge } from '@/components/ui/badge'
const SLIDES = [
    {
        id: 'slide-1',
        title: 'Cardiología',
        description:
            'Especialistas en el diagnóstico y tratamiento de enfermedades del corazón y sistema cardiovascular. Atención integral para tu salud cardíaca.',
        services: ['Electrocardiograma', 'Ecocardiograma', 'Holter'],
        imageUrl:
            '/cardiologo1.jpg',
    },
    {
        id: 'slide-2',
        title: 'Pediatría',
        description:
            'Cuidado médico especializado para bebés, niños y adolescentes. Seguimiento del desarrollo y prevención de enfermedades infantiles.',
        services: ['Control de niño sano', 'Vacunación', 'Emergencias pediátricas'],
        imageUrl:
            'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2491&auto=format&fit=crop',
    },
    {
        id: 'slide-3',
        title: 'Neurología',
        description:
            'Diagnóstico y tratamiento de trastornos del sistema nervioso, cerebro y médula espinal. Atención especializada en enfermedades neurológicas.',
        services: ['Electroencefalograma', 'Evaluación neurológica', 'Tratamiento de migraña'],
        imageUrl:
            '/neurologo.jpg',
    },
    {
        id: 'slide-4',
        title: 'Traumatología',
        description:
            'Tratamiento de lesiones del sistema musculoesquelético, fracturas y problemas ortopédicos. Recuperación y rehabilitación integral.',
        services: ['Fracturas', 'Lesiones deportivas', 'Cirugía ortopédica'],
        imageUrl:
            '/traumatologo.jpg',
    },
    {
        id: 'slide-5',
        title: 'Dermatología',
        description:
            'Cuidado de la piel, diagnóstico y tratamiento de enfermedades dermatológicas. Salud y estética de tu piel en manos expertas.',
        services: ['Tratamiento de acné', 'Dermatología estética', 'Cirugía dermatológica'],
        imageUrl:
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2490&auto=format&fit=crop',
    },
    {
        id: 'slide-6',
        title: 'Psicología',
        description:
            'Apoyo profesional para tu salud mental y bienestar emocional. Terapia personalizada para superar desafíos y mejorar tu calidad de vida.',
        services: ['Terapia individual', 'Terapia familiar', 'Manejo de ansiedad'],
        imageUrl:
            '/psicologia.jpg',
    },
    {
        id: 'slide-cta',
        title: '¡Ve todas las especialidades!',
        description:
            'Descubre todas las especialidades médicas disponibles en nuestra plataforma.',
        isCTA: true,
    },
];

export default function DemoOne() {
    return (
        <ScrollXCarousel className="h-[120vh]">
            <ScrollXCarouselContainer className="h-[70vh] place-content-center flex flex-col gap-8 py-8">
                <div className=" pointer-events-none w-[12vw] h-[103%] absolute inset-[0_auto_0_0] z-10 bg-[linear-gradient(90deg,_var(--background)_35%,_transparent)]" />
                <div className="pointer-events-none bg-[linear-gradient(270deg,_var(--background)_35%,_transparent)] w-[15vw] h-[103%] absolute inset-[0_0_0_auto] z-10" />

                <ScrollXCarouselWrap className="flex-4/5 flex space-x-8 [&>*:first-child]:ml-8" xRange={['-0%', '-85%']}>
                    {SLIDES.map((slide) => (
                        <CardHoverReveal
                            key={slide.id}
                            className="min-w-[70vw] md:min-w-[38vw] shadow-xl xl:min-w-[30vw] rounded-xl"
                        >
                            {slide.isCTA ? (
                                <div className="size-full bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 text-center">
                                    {/* Animated background circles */}
                                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                                    {/* Content */}
                                    <div className="relative z-10 space-y-4 md:space-y-6">
                                        {/* Icon */}
                                        <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>

                                        <h2 className="text-2xl md:text-5xl font-bold text-white mb-3 leading-tight">
                                            {slide.title}
                                        </h2>

                                        <p className="text-sm md:text-lg text-white/90 mb-6 max-w-md leading-relaxed">
                                            {slide.description}
                                        </p>

                                        {/* CTA Button */}
                                        <a
                                            href="/register"
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20"
                                        >
                                            <span>Regístrate Ahora</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </a>

                                        {/* Features badges */}
                                        <div className="flex flex-wrap gap-2 justify-center mt-6">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                                                ✓ Gratis
                                            </span>
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                                                ✓ Rápido
                                            </span>
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                                                ✓ Seguro
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <CardHoverRevealMain>
                                        <img
                                            alt={slide.title}
                                            src={slide.imageUrl}
                                            className="size-full aspect-square object-cover"
                                        />
                                    </CardHoverRevealMain>
                                    <CardHoverRevealContent className="space-y-4 rounded-2xl bg-[rgba(0,0,0,.5)] backdrop-blur-3xl p-4">
                                        <div className="space-y-2">
                                            <h3 className="text-sm text-white/80">Servicios</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {slide.services?.map((service) => (
                                                    <Badge
                                                        key={service}
                                                        className="capitalize rounded-full bg-white/20 text-white border-white/30 hover:bg-white/30"
                                                    >
                                                        {service}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-2">
                                            <h3 className="text-white capitalize font-medium">
                                                {slide.title}
                                            </h3>
                                            <p className="text-white/80 text-sm">{slide.description}</p>
                                        </div>
                                    </CardHoverRevealContent>
                                </>
                            )}
                        </CardHoverReveal>
                    ))}
                </ScrollXCarouselWrap>
                <ScrollXCarouselProgress
                    className="bg-secondary mx-8 h-1 rounded-full overflow-hidden"
                    progressStyle="size-full bg-indigo-500/70 rounded-full"
                />
            </ScrollXCarouselContainer>
        </ScrollXCarousel>
    )
}
