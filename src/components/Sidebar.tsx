import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { LogOut, Search, Calendar, User, MessageCircle, Clock, FileText, Home, Menu, X } from 'lucide-react';
import { getImageUrl } from '../utils/url.helper';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
            name: 'Inicio',
            path: '/patient/home',
            icon: Home,
        }] : []),
        ...(isPaciente ? [{
            name: 'Buscar médicos',
            path: '/patient/search',
            icon: Search,
        }] : []),
        ...(isMedico ? [{
            name: 'Inicio',
            path: '/doctor/home',
            icon: Home,
        }] : []),
        ...(isMedico ? [{
            name: 'Mis citas',
            path: '/doctor/appointments',
            icon: Calendar,
        }] : []),
        ...(isMedico ? [{
            name: 'Horarios',
            path: '/doctor/schedule',
            icon: Clock,
        }] : []),
        ...(isPaciente ? [{
            name: 'Mis citas',
            path: '/patient/appointments',
            icon: Calendar,
        }] : []),
        ...(isPaciente ? [{
            name: 'Historial médico',
            path: '/patient/historial-medico',
            icon: FileText,
        }] : []),
        {
            name: 'Mensajes',
            path: '/messages',
            icon: MessageCircle,
        },
        ...(isPaciente ? [{
            name: 'Perfil',
            path: '/patient/profile',
            icon: User,
        }] : []),
        ...(isMedico ? [{
            name: 'Perfil',
            path: '/doctor/profile',
            icon: User,
        }] : []),
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleNavClick = (path: string) => {
        if (path === '/messages') {
            clearUnreadCount();
        }
        setIsOpen(false);
    };

    const roleLabel = user?.rol === 'PACIENTE' ? 'Paciente' : user?.rol === 'MEDICO' ? 'Médico' : user?.rol;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
                aria-label="Abrir menú"
                aria-expanded={isOpen}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {isOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[2px] md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-label="Cerrar menú"
                />
            )}

            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-out md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-blue-700 shadow-sm">
                            <img
                                src="/logo-blanco.png"
                                alt="MediGO"
                                className="h-8 w-8 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="font-display text-xl font-semibold tracking-tight text-slate-900">MediGO</h1>
                            <p className="text-xs text-slate-500">Telemedicina</p>
                        </div>
                    </div>
                </div>

                <div className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-700 text-sm font-semibold text-white">
                            {user?.rutaFoto ? (
                                <img
                                    src={getImageUrl(user.rutaFoto)}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                user?.nombres?.charAt(0) || user?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900">
                                {user?.nombres || user?.email}
                            </p>
                            <p className="truncate text-xs text-slate-500">{user?.email}</p>
                            <span className="mt-1.5 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-800 uppercase ring-1 ring-blue-100">
                                {roleLabel}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => handleNavClick(item.path)}
                                className={cn(
                                    'relative flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200',
                                    active
                                        ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-100'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                )}
                                aria-current={active ? 'page' : undefined}
                            >
                                <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-blue-700' : 'text-slate-500')} strokeWidth={1.75} />
                                <span>{item.name}</span>

                                {item.path === '/messages' && unreadCount > 0 && (
                                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-100 p-3">
                    <button
                        onClick={handleLogout}
                        className="flex min-h-[44px] w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                    >
                        <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
