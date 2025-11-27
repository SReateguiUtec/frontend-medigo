import { IdCard, CalendarCheck, DollarSign } from 'lucide-react';

export default function Grid() {
    return (
        <div id="beneficios" className="py-12 sm:py-16 scroll-mt-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-center text-base/7 font-semibold text-indigo-600">Tu salud en tus manos</h2>
                <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl">
                    Tus medicos favoritos en tu hogar!
                </p>
                <div className="mt-10 grid gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-2">
                    {/* Consultas en linea */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                        <div className="relative h-full bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden min-h-[400px] flex flex-col">
                            <div className="px-8 pt-8 pb-4">
                                <p className="text-2xl font-bold tracking-tight text-gray-900">
                                    Consultas en linea
                                </p>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                    Videollamadas seguras con WhereBy, con médicos especialistas desde la comodidad de tu hogar
                                </p>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-6">
                                <div className="w-full max-w-[280px] transform group-hover:scale-105 transition-transform duration-300">
                                    <img
                                        src="/medico.png"
                                        alt="Médico profesional"
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gestion de citas */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                        <div className="relative h-full bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col">
                            <div className="px-8 pt-8 pb-4">
                                <p className="text-2xl font-bold tracking-tight text-gray-900">Gestion de citas</p>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                    Agenda y administra tus citas médicas de forma fácil y eficiente
                                </p>
                            </div>
                            <div className="flex-1 flex items-center justify-center pb-8">
                                <div className="p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                    <CalendarCheck className="h-24 w-24 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagos Seguros */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                        <div className="relative h-full bg-gradient-to-br from-green-50 to-white rounded-3xl border border-green-100 shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col">
                            <div className="px-8 pt-8 pb-4">
                                <p className="text-2xl font-bold tracking-tight text-gray-900">Pagos Seguros</p>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                    Procesamiento de pagos seguro mediante Stripe
                                </p>
                            </div>
                            <div className="flex-1 flex items-center justify-center pb-8">
                                <div className="p-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                    <DollarSign className="h-24 w-24 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Autenticacion de medicos */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                        <div className="relative h-full bg-gradient-to-br from-orange-50 to-white rounded-3xl border border-orange-100 shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col">
                            <div className="px-8 pt-8 pb-4">
                                <p className="text-2xl font-bold tracking-tight text-gray-900">
                                    Autenticacion de medicos
                                </p>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                    Verificacion de identidad de medicos
                                </p>
                            </div>
                            <div className="flex-1 flex items-center justify-center pb-8">
                                <div className="p-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-lg">
                                    <IdCard className="h-24 w-24 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}