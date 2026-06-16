import { Video, ShieldCheck, DollarSign, CalendarCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Grid() {
    return (
        <div id="beneficios" className="py-8 md:py-16 scroll-mt-32">
            <div className="mx-auto max-w-5xl px-4 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <Badge variant="outline" className="mb-3 md:mb-4 border-slate-300">
                        Beneficios
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-normal text-gray-900">
                        ¿Por qué elegir MediGO?
                    </h2>
                </div>

                <div className="grid gap-8 md:gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Consultas en línea */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-blue-100/60 shadow-sm border border-blue-200/50">
                            <Video className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
                        </div>
                        <h3 className="mb-2 md:mb-3 text-base md:text-lg font-semibold text-gray-900">
                            Consultas en Línea
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed px-2 md:px-0">
                            Videollamadas seguras con médicos especialistas desde la comodidad de tu hogar
                        </p>
                    </div>

                    {/* Gestión de citas */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-blue-100/60 shadow-sm border border-blue-200/50">
                            <CalendarCheck className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
                        </div>
                        <h3 className="mb-2 md:mb-3 text-base md:text-lg font-semibold text-gray-900">
                            Gestión de Citas
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed px-2 md:px-0">
                            Agenda y administra tus citas médicas de forma fácil y eficiente
                        </p>
                    </div>

                    {/* Pagos Seguros */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-blue-100/60 shadow-sm border border-blue-200/50">
                            <DollarSign className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
                        </div>
                        <h3 className="mb-2 md:mb-3 text-base md:text-lg font-semibold text-gray-900">
                            Pagos Seguros
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed px-2 md:px-0">
                            Procesamiento de pagos seguro mediante Stripe
                        </p>
                    </div>

                    {/* Autenticación de médicos */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-blue-100/60 shadow-sm border border-blue-200/50">
                            <ShieldCheck className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
                        </div>
                        <h3 className="mb-2 md:mb-3 text-base md:text-lg font-semibold text-gray-900">
                            Médicos Verificados
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed px-2 md:px-0">
                            Verificación de identidad de médicos profesionales
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}