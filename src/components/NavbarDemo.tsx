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
        // Public navigation items (for non-authenticated users)
        ...(!isAuthenticated ? [
            { name: "Beneficios", link: "/#beneficios" },
            { name: "Testimonios", link: "/#testimonios" },
            { name: "Pricing", link: "/#pricing" },
            { name: "FAQ", link: "/#faq" }
        ] : []),
        // Authenticated user navigation
        ...(isAuthenticated && user?.rol === 'PACIENTE' ? [{ name: "Buscar Médicos", link: "/patient/search" }] : []),
        ...(isAuthenticated && user?.rol === 'MEDICO' ? [{ name: "Mis Citas", link: "/doctor/appointments" }] : []),
        ...(isAuthenticated ? [{ name: "Perfil", link: "/profile" }] : []),
    ];

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="w-full max-w-7xl bg-white/30 backdrop-blur-xl rounded-full shadow-lg border border-white/20 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        <img src="/logo-navbar.png" alt="MediGO" className="h-12 w-auto scale-[2.8] object-contain ml-5" />
                    </Link>

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
                        className="md:hidden p-2 text-gray-700 hover:text-gray-900"
                    >
                        {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col gap-3">
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
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 cursor-pointer"
                                    >
                                        {item.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={idx}
                                        to={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                            <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <span className="text-sm text-gray-600 py-2">
                                            Hola, {user?.nombres}
                                        </span>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 text-left"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 text-center border border-gray-300 rounded-full"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full text-center"
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
    );
}