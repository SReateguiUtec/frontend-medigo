import { IdCard, ShieldCheck, CalendarCheck } from 'lucide-react';

export default function Grid() {
    return (
        <div id="beneficios" className="py-12 sm:py-16 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-center text-base/7 font-semibold text-indigo-600">Tu salud en tus manos</h2>
                <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
                    Tus medicos favoritos en tu hogar!
                </p>
                <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                    Consultas en linea
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Videollamadas seguras con médicos especialistas desde la comodidad de tu hogar
                                </p>
                            </div>
                            <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                                <div className="absolute inset-x-10 top-10 bottom-4 overflow-hidden">
                                    <img
                                        alt=""
                                        src="/medico.png"
                                        className="size-full object-cover object-top"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl" />
                    </div>
                    <div className="relative max-lg:row-start-1">
                        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Gestion de citas</p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Agenda y administra tus citas médicas de forma fácil y eficiente                                </p>
                            </div>
                            <div className="relative min-h-50 w-full grow flex items-center justify-center">
                                <CalendarCheck className="h-22 w-22 text-black-500" />
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl" />
                    </div>
                    <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="absolute inset-px rounded-lg bg-white" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Pagos Seguros</p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Procesamiento de pagos seguro mediante Stripe (pronto nuevos metodos de pagos)
                                </p>
                            </div>
                            <div className="relative min-h-50 w-full grow flex items-center justify-center">
                                <ShieldCheck className="h-32 w-32 text-black-500" />
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                    </div>
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                    Autenticacion de medicos
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                                    Verificacion de identidad de medicos
                                </p>
                            </div>
                            <div className="relative min-h-120 w-full grow flex items-center justify-center">
                                <IdCard className="h-72 w-72 text-black-500" />
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
