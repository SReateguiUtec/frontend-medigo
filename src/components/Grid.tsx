import { Video, ShieldCheck, DollarSign, CalendarCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Grid() {
    return (
        <div id="beneficios" className="py-12 sm:py-16 scroll-mt-32">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Beneficios
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                        ¿Por qué elegir MediGO?
                    </h2>
                </div>

                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Consultas en línea */}
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <Video className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">
                            Consultas en Línea
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Videollamadas seguras con médicos especialistas desde la comodidad de tu hogar
                        </p>
                    </div>

                    {/* Gestión de citas */}
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <CalendarCheck className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">
                            Gestión de Citas
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Agenda y administra tus citas médicas de forma fácil y eficiente
                        </p>
                    </div>

                    {/* Pagos Seguros */}
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <DollarSign className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">
                            Pagos Seguros
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Procesamiento de pagos seguro mediante Stripe
                        </p>
                    </div>

                    {/* Autenticación de médicos */}
                    <div className="text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <ShieldCheck className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">
                            Médicos Verificados
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Verificación de identidad de médicos profesionales
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}