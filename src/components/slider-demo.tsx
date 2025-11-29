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
            'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=2487&auto=format&fit=crop',
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
            'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2464&auto=format&fit=crop',
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
            '/psicologa.jpg',
    },
    {
        id: 'slide-cta',
        title: '¡Ve todas las especialidades!',
        description:
            'Descubre todas las especialidades médicas disponibles en nuestra plataforma. Regístrate ahora y accede a atención médica de calidad.',
        isCTA: true,
    },
];

export default function DemoOne() {
    return (
        <ScrollXCarousel className="h-[120vh]">
            <ScrollXCarouselContainer className="h-[70vh] place-content-center flex flex-col gap-8 py-8">
                <div className=" pointer-events-none w-[12vw] h-[103%] absolute inset-[0_auto_0_0] z-10 bg-[linear-gradient(90deg,_var(--background)_35%,_transparent)]" />
                <div className="pointer-events-none bg-[linear-gradient(270deg,_var(--background)_35%,_transparent)] w-[15vw] h-[103%] absolute inset-[0_0_0_auto] z-10" />

                <ScrollXCarouselWrap className="flex-4/5 flex space-x-8 [&>*:first-child]:ml-8">
                    {SLIDES.map((slide) => (
                        <CardHoverReveal
                            key={slide.id}
                            className="min-w-[70vw] md:min-w-[38vw] shadow-xl border xl:min-w-[30vw] rounded-xl"
                        >
                            {slide.isCTA ? (
                                <div className="size-full aspect-square bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex flex-col items-center justify-center p-8 text-center">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg text-white/90 mb-8 max-w-md">
                                        {slide.description}
                                    </p>
                                    <a
                                        href="/register"
                                        className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                                    >
                                        Regístrate Ahora
                                    </a>
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
                                                        className="capitalize rounded-full"
                                                        variant={'secondary'}
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
