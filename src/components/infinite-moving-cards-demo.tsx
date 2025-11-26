import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
    return (
        <div id="testimonios" className="py-16 px-4">
            <div className="max-w-7xl mx-auto mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-800 text-center mb-4">
                    Testimonios
                </h2>
                <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
                    Lo que nuestros usuarios dicen sobre MediGO
                </p>
            </div>
            <InfiniteMovingCards
                items={testimonials}
                direction="right"
                speed="slow"
            />
        </div>
    );
}

const testimonials = [
    {
        quote:
            "MediGO ha transformado completamente la forma en que gestiono mis citas médicas. La plataforma es intuitiva y muy fácil de usar.",
        name: "Alex Rivera",
        title: "Google, Head of Cybersecurity",
    },
    {
        quote:
            "Encontrar especialistas nunca fue tan sencillo. MediGO me ayudó a conectar con el médico perfecto para mi tratamiento.",
        name: "Samantha Lee",
        title: "Github, Chief Information Security Officer",
    },
    {
        quote: "MediGO es la solución perfecta para la búsqueda de médicos. Su interfaz es intuitiva y permite encontrar el médico que necesitas con facilidad.",
        name: "Raj Patel",
        title: "Amazon, VP of Engineering",
    },
    {
        quote:
            "La seguridad y privacidad de mis datos médicos es impresionante. Me siento completamente tranquilo usando esta plataforma.",
        name: "Emily Chen",
        title: "Netflix, Security Operations Manager",
    },
    {
        quote:
            "Como médico, MediGO me ha permitido organizar mejor mi agenda y brindar un mejor servicio a mis pacientes.",
        name: "Michael Brown",
        title: "Youtube, Director of IT Security",
    },
];
