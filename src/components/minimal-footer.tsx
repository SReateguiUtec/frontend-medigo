'use client';

import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

interface FooterColumn {
    heading: string;
    links: { text: string; url: string }[];
}

interface FooterWithMinimalOutlineProps {
    brandName?: string;
    columns?: FooterColumn[];
    copyright?: string;
    className?: string;
}

const defaultColumns: FooterColumn[] = [
    {
        heading: 'Enlaces Rápidos',
        links: [
            { text: 'Inicio', url: '/' },
            { text: 'Buscar Médicos', url: '/patient/search' },
            { text: 'Registrarse', url: '/register' },
            { text: 'Iniciar Sesión', url: '/login' },
        ],
    },
    {
        heading: 'Servicios',
        links: [
            { text: 'Consultas Médicas', url: '#' },
            { text: 'Especialistas', url: '#' },
            { text: 'Agenda de Citas', url: '#' },
            { text: 'Historial Médico', url: '#' },
        ],
    },
    {
        heading: 'Contacto',
        links: [
            { text: 'medigoperu@gmail.com', url: 'mailto:medigoperu@gmail.com' },
            { text: 'Lima, Perú', url: '#' },
        ],
    },
];

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export default function FooterWithMinimalOutline({
    brandName = 'MediGO',
    columns = defaultColumns,
    copyright = `© ${new Date().getFullYear()} MediGO.`,
    className,
}: FooterWithMinimalOutlineProps) {
    return (
        <footer
            className={cn(
                'relative w-full overflow-hidden bg-gray-900 px-8 py-20',
                className,
            )}
        >
            <motion.div
                variants={containerVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                className='mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-gray-400 sm:flex-row md:px-8'
            >
                <motion.div variants={itemVariants}>
                    <div className='mr-0 mb-4 md:mr-4 md:flex'>
                        <a
                            className='relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-white'
                            href='#'
                        >
                            <span className='font-medium text-white'>
                                {brandName}
                            </span>
                        </a>
                    </div>
                    <div className='mt-2 ml-2'>{copyright}</div>
                    <div className='mt-2 ml-2 text-sm text-gray-400 max-w-xs'>
                        Tu plataforma de confianza para gestionar citas médicas de manera eficiente y segura.
                    </div>
                </motion.div>

                <div className='mt-10 grid grid-cols-2 items-start gap-10 sm:grid-cols-3 sm:mt-0'>
                    {columns.map((col, ci) => (
                        <motion.div
                            key={ci}
                            variants={itemVariants}
                            className='flex w-full flex-col justify-center space-y-4'
                        >
                            <p className='font-bold text-gray-200 transition-colors'>
                                {col.heading}
                            </p>
                            <ul className='list-none space-y-4 text-gray-400 transition-colors'>
                                {col.links.map((link, li) => (
                                    <li key={li} className='list-none'>
                                        <a
                                            className='transition-colors hover:text-white'
                                            href={link.url}
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
                className='inset-x-0 mt-20 text-center font-bold text-transparent [--stroke:#4b5563]'
                style={{
                    fontSize: 'clamp(3rem, 15vw, 13rem)',
                    WebkitTextStroke: '1.5px var(--stroke, #4b5563)',
                }}
            >
                {brandName}
            </motion.p>
        </footer>
    );
}

export { FooterWithMinimalOutline };
