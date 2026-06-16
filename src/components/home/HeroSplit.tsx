import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { AnimatedSection } from '@/components/animated-section';

import { ArrowRight, Heart, ShieldPlus, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Modified WhisperText for custom alignment
const WhisperText = ({ text, className = "", delay = 50, startDelay = 0 }: { text: string, className?: string, delay?: number, startDelay?: number }) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const targets = containerRef.current ? gsap.utils.toArray("[data-word]", containerRef.current) : [];

            gsap.set(targets, { opacity: 0, y: 10 });

            gsap.to(targets, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                stagger: delay / 1000,
                delay: startDelay / 1000,
            });
        }, containerRef);

        return () => ctx.revert();
    }, [text, delay, startDelay]);

    const words = text.split(" ");

    return (
        <span ref={containerRef} className="inline">
            {words.map((word, index) => (
                <span
                    key={index}
                    data-word
                    className={`inline-block mr-2 ${className}`}
                >
                    {word}
                </span>
            ))}
        </span>
    );
};

export function HeroSplit() {
    const firstTextWords = "Tu salud, siempre a tu alcance con ".split(" ").length;
    const secondTextDelay = firstTextWords * 100;

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-12 lg:gap-8">
                
                {/* Left Side: Content */}
                <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <AnimatedSection>
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm mb-8 text-sm font-semibold text-gray-800 hover:shadow-md transition-shadow cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                            </span>
                            Plataforma de Telemedicina
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <div className="text-4xl md:text-5xl tracking-tight text-gray-800 mb-4 md:mb-6 max-w-2xl leading-tight">
                            <WhisperText
                                text="Tu salud, siempre a tu alcance con "
                                className="text-gray-800 font-medium"
                                delay={100}
                                startDelay={0}
                            />
                            <br className="hidden md:block" />
                            <WhisperText
                                text="MediGO"
                                className="text-blue-600 font-semibold underline decoration-blue-600/30 decoration-4 underline-offset-8 text-5xl md:text-6xl mt-2 md:mt-0"
                                delay={100}
                                startDelay={secondTextDelay}
                            />
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-10 max-w-xl font-medium leading-relaxed px-4 md:px-0">
                            La experiencia de muchos a <span className="font-bold text-blue-600">tu servicio.</span> Conéctate con especialistas certificados desde la comodidad de tu hogar.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={300} className="w-full px-4 md:px-0">
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full justify-center lg:justify-start items-center lg:items-start">
                            <button className="w-3/4 sm:w-auto px-5 py-2.5 md:px-8 md:py-4 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 cursor-pointer">
                                Comienza Ahora
                                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                            <button className="w-3/4 sm:w-auto px-5 py-2.5 md:px-8 md:py-4 text-sm md:text-base bg-white/50 hover:bg-white/80 backdrop-blur-md text-blue-900 border border-blue-200 rounded-full font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                                Ver Especialidades
                            </button>
                        </div>
                    </AnimatedSection>
                </div>

                {/* Right Side: Visuals / Mockup */}
                <div className="lg:w-1/2 w-full max-w-lg mx-auto lg:mx-0 mt-4 md:mt-8 lg:mt-0">
                    <AnimatedSection delay={400} className="relative w-full aspect-square flex items-center justify-center scale-95 md:scale-100">
                        
                        {/* Decorative Background Glow */}
                        <div className="absolute w-[110%] h-[110%] bg-linear-to-tr from-blue-300/40 via-indigo-400/30 to-purple-400/30 blur-[80px] rounded-full animate-pulse-slow z-0"></div>
                        
                        {/* Main Glass Card */}
                        <motion.div 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="relative z-10 w-[95%] md:w-[85%] bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-5 md:p-6 lg:p-8 flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between border-b border-white/40 pb-4 md:pb-5 mb-4 md:mb-5">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-inner shrink-0">
                                        <Heart className="h-6 w-6 md:h-7 md:w-7" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-900 text-base md:text-lg">Consulta Activa</h4>
                                        <p className="text-xs md:text-sm text-blue-700 font-medium line-clamp-1">Dra. Sarah Johnson</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 md:px-3 md:py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full border border-green-200 shadow-sm animate-pulse whitespace-nowrap ml-2">En línea</span>
                            </div>
                            
                            <div className="space-y-3 md:space-y-4 mb-2">
                                <div className="w-full h-10 md:h-12 bg-white/60 rounded-xl flex items-center px-4 shadow-sm border border-white/40">
                                    <div className="w-2/3 h-2 md:h-3 bg-gray-300/60 rounded-full"></div>
                                </div>
                                <div className="w-5/6 h-10 md:h-12 bg-blue-100/60 rounded-xl flex items-center px-4 ml-auto shadow-sm border border-blue-200/40">
                                    <div className="w-full h-2 md:h-3 bg-blue-400/60 rounded-full"></div>
                                </div>
                                <div className="w-[90%] h-10 md:h-12 bg-white/60 rounded-xl flex items-center px-4 shadow-sm border border-white/40">
                                    <div className="w-1/2 h-2 md:h-3 bg-gray-300/60 rounded-full"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Stats Card */}
                        <motion.div 
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="absolute -right-2 md:-right-4 lg:-right-8 top-[10%] md:top-[20%] z-20 bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:-translate-y-1 transition-transform cursor-default scale-90 md:scale-100 origin-right"
                        >
                            <div className="p-2 md:p-3 bg-indigo-100 rounded-lg md:rounded-xl text-indigo-600 shadow-inner">
                                <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Asistente A.L.M.A</p>
                                <p className="font-extrabold text-gray-900 text-sm md:text-lg">Soporte Continuo</p>
                            </div>
                        </motion.div>

                        {/* Floating Shield Card */}
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                            className="absolute -left-2 md:-left-2 lg:-left-6 bottom-[10%] md:bottom-[15%] z-20 bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:-translate-y-1 transition-transform cursor-default scale-90 md:scale-100 origin-left"
                        >
                            <div className="p-2 md:p-3 bg-emerald-100 rounded-lg md:rounded-xl text-emerald-600 shadow-inner">
                                <ShieldPlus className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-extrabold text-gray-900 text-sm md:text-lg">Privacidad</p>
                                <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Seguridad E2E</p>
                            </div>
                        </motion.div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
}
