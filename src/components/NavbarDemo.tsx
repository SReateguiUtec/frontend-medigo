// Navigation Demo Component
"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { IconMenu2, IconX } from "@tabler/icons-react";

export function NavbarDemo() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        // for non-authenticated users
        ...(!isAuthenticated ? [
            { name: "Beneficios", link: "/#beneficios" },
            { name: "Testimonios", link: "/#testimonios" },
            { name: "Pricing", link: "/#pricing" },
            { name: "FAQ", link: "/#faq" }
        ] : []),
        // Authenticated
        ...(isAuthenticated && user?.rol === 'PACIENTE' ? [{ name: "Buscar Médicos", link: "/patient/search" }] : []),
        ...(isAuthenticated && user?.rol === 'MEDICO' ? [{ name: "Mis Citas", link: "/doctor/appointments" }] : []),
        ...(isAuthenticated ? [{ name: "Perfil", link: "/profile" }] : []),
    ];

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className="w-full max-w-7xl">
                <nav className={`shadow-lg border px-6 py-3 transition-colors duration-300 ${isMobileMenuOpen ? 'rounded-3xl bg-white border-gray-200' : 'rounded-full bg-white/30 backdrop-blur-xl border-white/20'}`}>
                    <div className="flex items-center justify-between w-full">
                        {/* Logo */}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            <img src="/logo-navbar.png" alt="MediGO" className="h-12 w-auto scale-[2.8] object-contain ml-5" />
                        </a>

                        {/* Desktop Navigation - Centered */}
                        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                            {navItems.map((item, idx) => (
                                item.link.startsWith('/#') ? (
                                    <a
                                        key={idx}
                                        href={item.link}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const id = item.link.replace('/#', '');
                                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                                    >
                                        {item.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={idx}
                                        to={item.link}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm text-gray-600">
                                        Hola, {user?.nombres}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-sm"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-transform duration-200"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden mt-4 pt-4 border-t border-white/30 pb-2">
                            <div className="flex flex-col gap-1">
                                {navItems.map((item, idx) => (
                                    item.link.startsWith('/#') ? (
                                        <a
                                            key={idx}
                                            href={item.link}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const id = item.link.replace('/#', '');
                                                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/40 py-2.5 px-4 rounded-lg transition-all cursor-pointer"
                                        >
                                            {item.name}
                                        </a>
                                    ) : (
                                        <Link
                                            key={idx}
                                            to={item.link}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/40 py-2.5 px-4 rounded-lg transition-all"
                                        >
                                            {item.name}
                                        </Link>
                                    )
                                ))}
                                <div className="pt-3 mt-2 border-t border-white/30 flex flex-col gap-2.5">
                                    {isAuthenticated ? (
                                        <>
                                            <span className="text-sm text-gray-700 font-medium py-1 px-4">
                                                Hola, {user?.nombres}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all text-center border border-red-200"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/50 text-center border border-gray-300 rounded-lg transition-all"
                                            >
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                to="/register"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center shadow-sm transition-all"
                                            >
                                                Registrarse
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}