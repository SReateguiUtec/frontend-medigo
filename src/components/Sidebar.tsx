import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { LogOut, Search, Calendar, User, MessageCircle, Clock, FileText, Home, Menu, X } from 'lucide-react';
import { getImageUrl } from '../utils/url.helper';
import { useState } from 'react';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const { unreadCount, clearUnreadCount } = useNotification();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isPaciente = user?.rol === 'PACIENTE';
    const isMedico = user?.rol === 'MEDICO';

    const navigationItems = [
        ...(isPaciente ? [{
            name: 'Home',
            path: '/patient/home',
            icon: <Home className="w-5 h-5" />
        }] : []),
        ...(isPaciente ? [{
            name: 'Buscar Médicos',
            path: '/patient/search',
            icon: <Search className="w-5 h-5" />
        }] : []),
        ...(isMedico ? [{
            name: 'Home',
            path: '/doctor/home',
            icon: <Home className="w-5 h-5" />
        }] : []),
        ...(isMedico ? [{
            name: 'Mis Citas',
            path: '/doctor/appointments',
            icon: <Calendar className="w-5 h-5" />
        }] : []),
        ...(isMedico ? [{
            name: 'Horarios',
            path: '/doctor/schedule',
            icon: <Clock className="w-5 h-5" />
        }] : []),
        ...(isPaciente ? [{
            name: 'Mis Citas',
            path: '/patient/appointments',
            icon: <Calendar className="w-5 h-5" />
        }] : []),
        ...(isPaciente ? [{
            name: 'Historial Médico',
            path: '/patient/historial-medico',
            icon: <FileText className="w-5 h-5" />
        }] : []),
        {
            name: 'Mensajes',
            path: '/messages',
            icon: <MessageCircle className="w-5 h-5" />
        },
        ...(isPaciente ? [{
            name: 'Perfil',
            path: '/patient/profile',
            icon: <User className="w-5 h-5" />
        }] : []),
        ...(isMedico ? [{
            name: 'Perfil',
            path: '/doctor/profile',
            icon: <User className="w-5 h-5" />
        }] : [])
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleNavClick = (path: string) => {
        if (path === '/messages') {
            clearUnreadCount();
        }
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <div className={`h-screen w-full md:w-64 bg-gray-900 text-gray-100 flex flex-col fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                } md:translate-x-0`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                                src="/logo-blanco.png"
                                alt="MediGO Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">MediGO</h1>
                            <p className="text-xs text-gray-400">Panel de Control</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                            {user?.rutaFoto ? (
                                <img
                                    src={getImageUrl(user.rutaFoto)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user?.nombres?.charAt(0) || user?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.nombres || user?.email}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-600 text-white">
                                {user?.rol}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => handleNavClick(item.path)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${isActive(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>

                            {item.path === '/messages' && unreadCount > 0 && (
                                <span className="absolute right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
};