import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
    {
        text: "MediGO transformó mi práctica médica. Ahora puedo atender pacientes desde cualquier lugar y el sistema de videoconsultas es excelente.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Dr. Carlos Mendoza",
        role: "Cardiólogo",
    },
    {
        text: "La plataforma es muy intuitiva. Pude agendar mi cita en minutos y la consulta con mi doctora fue tan profesional como en persona.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "María González",
        role: "Paciente",
    },
    {
        text: "ALMA, la asistente de IA, me ayudó a entender mi diagnóstico de forma clara. Es increíble tener acceso a información médica las 24 horas.",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        name: "Jorge Ramírez",
        role: "Paciente",
    },
    {
        text: "Como médico, valoro mucho el historial médico digital. Puedo hacer seguimiento a mis pacientes de manera eficiente y segura.",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        name: "Dra. Ana Flores",
        role: "Pediatra",
    },
    {
        text: "La calidad de las videoconsultas es excelente y el proceso de pago es transparente. Me siento segura usando esta plataforma.",
        image: "https://randomuser.me/api/portraits/women/28.jpg",
        name: "Patricia Silva",
        role: "Paciente",
    },
    {
        text: "MediGO me permitió expandir mi consulta más allá de mi ciudad. Ahora atiendo pacientes de todo el país sin complicaciones.",
        image: "https://randomuser.me/api/portraits/men/46.jpg",
        name: "Dr. Roberto Chávez",
        role: "Dermatólogo",
    },
    {
        text: "El soporte técnico es rápido y eficiente. Cualquier duda que tuve fue resuelta inmediatamente. Muy profesionales.",
        image: "https://randomuser.me/api/portraits/women/50.jpg",
        name: "Laura Martínez",
        role: "Paciente",
    },
    {
        text: "La integración con el sistema de imágenes médicas es fantástica. Puedo revisar estudios de mis pacientes en tiempo real.",
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        name: "Dr. Luis Torres",
        role: "Radiólogo",
    },
    {
        text: "Encontré a mi médico ideal en MediGO. Las reseñas de otros pacientes me ayudaron a tomar la mejor decisión para mi salud.",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        name: "Carmen Vega",
        role: "Paciente",
    },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);


const Testimonials = () => {
    return (
        <section className="bg-background my-20 relative">

            <div className="container z-10 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4"
                >
                    <div className="flex justify-center mb-4">
                        <Badge variant="outline" className="border-black">
                            Testimonios
                        </Badge>
                    </div>

                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-gray-900 mb-4 text-center">
                        Lo que dicen nuestros usuarios
                    </h3>
                </motion.div>

                <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
};

export default Testimonials;