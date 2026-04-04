import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface WhisperTextProps {
    text: string;
    className?: string;
    delay?: number;
    startDelay?: number;
}

const WhisperText = ({ text, className = "", delay = 50, startDelay = 0 }: WhisperTextProps) => {
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

export function WhisperDemo() {
    const firstTextWords = "Tu salud, siempre a tu alcance con ".split(" ").length;
    const secondTextDelay = firstTextWords * 100; // Aumentado de 50 a 100ms

    return (
        <div className="mx-auto max-w-5xl py-4 text-center">
            <div className="text-5xl md:text-6xl font-bold tracking-tight text-gray-800">
                <WhisperText
                    text="Tu salud, siempre a tu alcance con "
                    className="text-black"
                    delay={100}
                    startDelay={0}
                />
                <WhisperText
                    text="MediGO"
                    className="text-blue-600 underline decoration-blue-600/30 decoration-4 underline-offset-[20px] text-7xl md:text-7xl"
                    delay={100}
                    startDelay={secondTextDelay}
                />
            </div>
        </div>
    );
}