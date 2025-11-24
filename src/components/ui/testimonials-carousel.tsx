

import React, { forwardRef } from "react";

import { clsx } from "clsx";
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react";


const ArrowLeft = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    variant?: "outline" | "default";
    size?: "icon" | "default";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                variant === "outline" && "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                size === "icon" && "h-9 w-9",
                className
            )}
            {...props}
        />
    );
});
Button.displayName = "Button";

interface SectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const Section = ({ title, subtitle, children }: SectionProps) => {
    return (
        <section className="py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {title}
                </h2>
                {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
                {/* Quote Icon */}
                <div className="flex justify-center my-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>
                </div>
                <div className="mt-6">{children}</div>
            </div>
        </section>
    );
};

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}

const Carousel = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = "horizontal",
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: orientation === "horizontal" ? "x" : "y",
            },
            plugins,
        );
        const [canScrollPrev, setCanScrollPrev] = React.useState(false);
        const [canScrollNext, setCanScrollNext] = React.useState(false);

        const onSelect = React.useCallback((api: CarouselApi) => {
            if (!api) {
                return;
            }
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        }, []);

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev();
        }, [api]);

        const scrollNext = React.useCallback(() => {
            api?.scrollNext();
        }, [api]);

        const handleKeyDown = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    scrollPrev();
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    scrollNext();
                }
            },
            [scrollPrev, scrollNext],
        );

        React.useEffect(() => {
            if (!api || !setApi) {
                return;
            }
            setApi(api);
        }, [api, setApi]);

        React.useEffect(() => {
            if (!api) {
                return;
            }
            onSelect(api);
            api.on("reInit", onSelect);
            api.on("select", onSelect);
            return () => {
                api?.off("select", onSelect);
            };
        }, [api, onSelect]);

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api,
                    opts,
                    orientation:
                        orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={clsx("relative", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        );
    },
);
Carousel.displayName = "Carousel";

const CarouselContent = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={clsx(
                    "flex",
                    orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                    className,
                )}
                {...props}
            />
        </div>
    );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={clsx(
                "min-w-0 shrink-0 grow-0 basis-full",
                orientation === "horizontal" ? "pl-4" : "pt-4",
                className,
            )}
            {...props}
        />
    );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={clsx(
                "absolute  size-8 rounded-full",
                orientation === "horizontal"
                    ? "bottom-0 left-1/2 -translate-x-16 translate-y-4"
                    : "-top-12 right-1/2 -translate-x-1/2 rotate-90",
                className,
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={clsx(
                "absolute size-8 rounded-full",
                orientation === "horizontal"
                    ? "bottom-0 right-1/2 translate-x-16 translate-y-4"
                    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
                className,
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ArrowRight className="size-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    );
});
CarouselNext.displayName = "CarouselNext";

const companies = [
    {
        name: "Google",
        url: "https://res.cloudinary.com/eldoraui/image/upload/v1734066341/Google_fav2wl.svg",
    },
    {
        name: "GitHub",
        url: "https://res.cloudinary.com/eldoraui/image/upload/v1734066341/GitHub_honend.svg",
    },
    {
        name: "Amazon",
        url: "https://res.cloudinary.com/eldoraui/image/upload/v1734066178/Amazon_wckqtv.svg",
    },
    {
        name: "Netflix",
        url: "https://res.cloudinary.com/eldoraui/image/upload/v1734066179/Netflix_skrjyn.svg",
    },
    {
        name: "YouTube",
        url: "https://res.cloudinary.com/eldoraui/image/upload/v1734066180/YouTube_wknngk.svg",
    },
    {
        name: "Instagram",
        url: "https://res.cloudinary.com/eldoraui/image/upload/v1734066178/Instagram_mo5ttl.svg",
    },
    {
        name: "Spotify",
        url: "https://res.cloudinary.com/eldoraui/image/upload/v1734066180/Spotify_ocrrnm.svg",
    },
];

function getTestimonialQuote(index: number): string {
    const quotes = [
        "MediGO ha transformado completamente la forma en que gestiono mis citas médicas. La plataforma es intuitiva y muy fácil de usar.",
        "Encontrar especialistas nunca fue tan sencillo. MediGO me ayudó a conectar con el médico perfecto para mi tratamiento.",
        "La seguridad y privacidad de mis datos médicos es impresionante. Me siento completamente tranquilo usando esta plataforma.",
        "Agendé mi primera cita en menos de 5 minutos. El proceso es increíblemente rápido y eficiente.",
        "Como médico, MediGO me ha permitido organizar mejor mi agenda y brindar un mejor servicio a mis pacientes.",
        "El sistema de recordatorios automáticos es excelente. Nunca más olvidé una cita médica importante.",
        "La atención al cliente es excepcional. Siempre están disponibles para resolver cualquier duda o inconveniente.",
    ];
    return quotes[index % quotes.length];
}

function getTestimonialName(index: number): string {
    const names = [
        "Alex Rivera",
        "Samantha Lee",
        "Raj Patel",
        "Emily Chen",
        "Michael Brown",
        "Linda Wu",
        "Carlos Gomez",
    ];
    return names[index % names.length];
}

function getTestimonialRole(index: number): string {
    const roles = [
        "Head of Cybersecurity",
        "Chief Information Security Officer",
        "VP of Engineering",
        "Security Operations Manager",
        "Director of IT Security",
        "Lead Security Architect",
        "Chief Technology Officer",
    ];
    return roles[index % roles.length];
}

export function Component() {
    return (
        <Section
            title="Testimonios"
            subtitle="Lo que nuestros usuarios están diciendo"
        >
            <div id="testimonios">
                <Carousel>
                    <div className="relative mx-auto max-w-2xl">
                        <CarouselContent>
                            {Array.from({ length: 7 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-2 pb-5">
                                        <div className="text-center">
                                            <h4 className="text-1xl mx-auto max-w-lg px-10 font-semibold">
                                                {getTestimonialQuote(index)}
                                            </h4>
                                            <div className="mt-8">
                                                <img
                                                    src={companies[index % companies.length].url}
                                                    alt={`${companies[index % companies.length].name} Logo`}
                                                    className="mx-auto h-[40px] w-auto "
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-1xl my-2 font-semibold">
                                                    {getTestimonialName(index)}
                                                </h4>
                                            </div>
                                            <div className="mb-3">
                                                <span className="text-themeDarkGray text-sm">
                                                    {getTestimonialRole(index)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-2/12 bg-gradient-to-r from-background"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 h-full  w-2/12 bg-gradient-to-l from-background"></div>
                    </div>
                    <div className="hidden md:block">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
            </div>
        </Section>
    );
}