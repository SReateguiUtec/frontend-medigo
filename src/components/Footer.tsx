export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-white text-2xl font-bold mb-4">MediGO</h3>
                        <p className="text-sm text-gray-400">
                            Tu plataforma de confianza para gestionar citas médicas de manera eficiente y segura.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-sm hover:text-blue-400 transition-colors">
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a href="/patient/search" className="text-sm hover:text-blue-400 transition-colors">
                                    Buscar Médicos
                                </a>
                            </li>
                            <li>
                                <a href="/register" className="text-sm hover:text-blue-400 transition-colors">
                                    Registrarse
                                </a>
                            </li>
                            <li>
                                <a href="/login" className="text-sm hover:text-blue-400 transition-colors">
                                    Iniciar Sesión
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Servicios</h4>
                        <ul className="space-y-2">
                            <li className="text-sm">Consultas Médicas</li>
                            <li className="text-sm">Especialistas</li>
                            <li className="text-sm">Agenda de Citas</li>
                            <li className="text-sm">Historial Médico</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2">
                            <li className="text-sm">
                                📧 contacto@medigo.com
                            </li>
                            <li className="text-sm">
                                📱 +51 999 888 777
                            </li>
                            <li className="text-sm">
                                📍 Lima, Perú
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-400">
                            © {currentYear} MediGO. Todos los derechos reservados.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                                Términos de Servicio
                            </a>
                            <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                                Política de Privacidad
                            </a>
                            <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
