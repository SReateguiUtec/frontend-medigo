import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Search, Calendar, User } from 'lucide-react';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isPaciente = user?.rol === 'PACIENTE';
    const isMedico = user?.rol === 'MEDICO';

    const navigationItems = [
        ...(isPaciente ? [{
            name: 'Buscar Médicos',
            path: '/patient/search',
            icon: <Search className="w-5 h-5" />
        }] : []),
        ...(isMedico ? [{
            name: 'Mis Citas',
            path: '/doctor/appointments',
            icon: <Calendar className="w-5 h-5" />
        }] : []),
        ...(isPaciente ? [{
            name: 'Mis Citas',
            path: '/patient/appointments',
            icon: <Calendar className="w-5 h-5" />
        }] : []),
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

    return (
        <div className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col fixed left-0 top-0">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-white">MediGO</h1>
                <p className="text-sm text-gray-400 mt-1">Tu panel de control</p>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.nombres?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
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
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
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
    );
};
