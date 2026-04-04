'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LayerStack, Card } from '@/components/ui/layer-stack';

interface FAQItem {
    question: string;
    answer: string;
}

interface FrequentlyAskedQuestionsStackProps {
    title?: string;
    description?: string;
    data?: FAQItem[];
    className?: string;
    supportEmail?: string;
}

const defaultFAQs: FAQItem[] = [
    {
        question: '¿Es gratuito?',
        answer:
            'Actualmente no contamos con un plan gratuito, pero el costo es de una comision de 5% por cada consulta.',
    },
    {
        question: '¿Hay limite de tiempo en la video llamada?',
        answer:
            'Si! Dependiendo del plan que tengas, el tiempo puede variar.',
    },
    {
        question: '¿Cuánto tiempo tarda en atender un medico?',
        answer:
            'En promedio, un medico tarda en atender un paciente entre 15 y 20 minutos.',
    },
    {
        question: '¿Es segura la plataforma?',
        answer:
            'Tenemos un sistema de verificacion automatica que incluye tener los numeros de colegiados de los medicos para verificar que esten abalados por la institucion correspondiente.',
    },
    {
        question: '¿Mi medico puede hacerme un seguimiento?',
        answer:
            'Absolutamente. Todos tus medicos tendran un historial de tus citas y podran hacer seguimiento de tus citas. Asi como tu historial medico.',
    },
    {
        question: '¿Puedo cancelar mi suscripcion?',
        answer:
            'Si! Puedes cancelar tu suscripcion en cualquier momento.',
    },
];

export default function FrequentlyAskedQuestionsStack({
    title = '',
    description = "Estamos aqui para ayudarte con cualquier pregunta que puedas tener, Si no encuentras lo que necesitas, por favor contactanos",
    data = defaultFAQs,
    className,
    supportEmail = 'medigoperu@gmail.com',
}: FrequentlyAskedQuestionsStackProps) {
    const words = title.split(' ');

    return (
        <section className={cn('relative w-full overflow-hidden py-10', className)}>
            <div className='mx-auto max-w-5xl px-6'>
                {title && (
                    <h1 className='relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight text-zinc-800 md:text-5xl lg:text-6xl dark:text-zinc-100'>
                        {words.map((word, index) => (
                            <motion.span
                                key={`${word}-${index}`}
                                initial={{ opacity: 0, filter: 'blur(6px)', y: 12 }}
                                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.08,
                                    ease: 'easeInOut',
                                }}
                                className='mr-2 inline-block'
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h1>
                )}

                {description && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className='relative z-10 mx-auto -mt-4 max-w-2xl text-center text-base text-zinc-500 dark:text-zinc-400 md:text-lg'
                    >
                        {description}{' '}
                        {supportEmail && (
                            <a
                                href={`mailto:${supportEmail}`}
                                className='text-primary underline underline-offset-4 hover:opacity-80 transition-opacity'
                            >
                                {supportEmail}
                            </a>
                        )}
                    </motion.p>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className='mt-12 md:mt-16'
                >
                    <LayerStack
                        cardWidth={360}
                        cardGap={16}
                        stageHeight={320}
                        lastCardFullWidth={true}
                        mobileSensitivity={1.8}
                    >
                        {data.map((item, index) => {
                            const isLast = index === data.length - 1;

                            if (isLast) {
                                return (
                                    <Card
                                        key={index}
                                        className='bg-card text-foreground border border-border overflow-hidden'
                                        style={{ backgroundColor: '#eef1f6' }}
                                    >
                                        <div className='flex h-full flex-col justify-between p-6 md:p-8 gap-4'>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-[11px] font-medium tracking-[0.16em] uppercase text-muted-foreground'>
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div className='size-1.5 rounded-full bg-foreground/20 dark:bg-foreground/40' />
                                            </div>
                                            <div className='space-y-3 flex-1'>
                                                <div className='h-px w-8 bg-border' />
                                                <h3 className='text-xl md:text-2xl font-semibold tracking-tight leading-tight'>
                                                    {item.question}
                                                </h3>
                                                <p className='text-sm leading-relaxed text-muted-foreground'>
                                                    {item.answer}
                                                </p>
                                            </div>
                                            <div className='pt-3 border-t border-border'>
                                                <p className='text-[10px] tracking-[0.14em] uppercase text-muted-foreground'>
                                                    Question {index + 1} of {data.length}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            }

                            return (
                                <Card
                                    key={index}
                                    className='bg-card text-foreground border border-border overflow-hidden'
                                    style={{ backgroundColor: '#eef1f6' }}
                                >
                                    <div className='flex h-full flex-col justify-between p-6 md:p-8 gap-4'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-[11px] font-medium tracking-[0.16em] uppercase text-muted-foreground'>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className='size-1.5 rounded-full bg-foreground/20 dark:bg-foreground/40' />
                                        </div>

                                        <div className='space-y-3 flex-1'>
                                            <div className='h-px w-8 bg-border' />
                                            <h3 className='text-xl md:text-2xl font-semibold tracking-tight leading-tight'>
                                                {item.question}
                                            </h3>
                                            <p className='text-sm leading-relaxed text-muted-foreground'>
                                                {item.answer}
                                            </p>
                                        </div>

                                        <div className='pt-3 border-t border-border'>
                                            <p className='text-[10px] tracking-[0.14em] uppercase text-muted-foreground'>
                                                Pregunta {index + 1} de {data.length}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </LayerStack>
                </motion.div>
            </div>
        </section>
    );
}
