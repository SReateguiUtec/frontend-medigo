import { Activity } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-8 h-8 text-white" />
                            <h3 className="text-white text-2xl font-bold">MediGO</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Tu plataforma de confianza para gestionar citas médicas de manera eficiente y segura.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-base">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="/" className="text-sm hover:text-blue-400 transition-colors duration-200 inline-block">
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a href="/patient/search" className="text-sm hover:text-blue-400 transition-colors duration-200 inline-block">
                                    Buscar Médicos
                                </a>
                            </li>
                            <li>
                                <a href="/register" className="text-sm hover:text-blue-400 transition-colors duration-200 inline-block">
                                    Registrarse
                                </a>
                            </li>
                            <li>
                                <a href="/login" className="text-sm hover:text-blue-400 transition-colors duration-200 inline-block">
                                    Iniciar Sesión
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-base">Servicios</h4>
                        <ul className="space-y-3">
                            <li className="text-sm text-gray-400">Consultas Médicas</li>
                            <li className="text-sm text-gray-400">Especialistas</li>
                            <li className="text-sm text-gray-400">Agenda de Citas</li>
                            <li className="text-sm text-gray-400">Historial Médico</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-base">Contacto</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <a href="mailto:medigoperu@gmail.com" className="hover:text-blue-400 transition-colors duration-200">
                                    medigoperu@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <span>Lima, Perú</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400 text-center sm:text-left">
                            © {currentYear} MediGO. Todos los derechos reservados.
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
                            <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                                Términos de Servicio
                            </a>
                            <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                                Política de Privacidad
                            </a>
                            <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
