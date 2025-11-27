import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
    return (
        <div id="testimonios" className="px-4 scroll-mt-32">
            <div className="max-w-7xl mx-auto mb-15">
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
        title: "Medico Cardiologo",
    },
    {
        quote:
            "Encontrar especialistas nunca fue tan sencillo. MediGO me ayudó a conectar con el médico perfecto para mi tratamiento.",
        name: "Samantha Mejia",
        title: "Usuario",
    },
    {
        quote: "MediGO es la solución perfecta para la búsqueda de médicos. Su interfaz es intuitiva y permite encontrar el médico que necesitas con facilidad.",
        name: "Raul Ramirez",
        title: "Usuario",
    },
    {
        quote:
            "La seguridad y privacidad de mis datos médicos es impresionante. Me siento completamente tranquila usando esta plataforma.",
        name: "Emily Chen",
        title: "Usuario",
    },
    {
        quote:
            "Como médico, MediGO me ha permitido organizar mejor mi agenda y brindar un mejor servicio a mis pacientes.",
        name: "Michael Brown",
        title: "Medico General",
    },
];
