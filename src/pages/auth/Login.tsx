import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, ShieldCheck, Clock, Stethoscope } from 'lucide-react';

const trustItems = [
    {
        icon: ShieldCheck,
        label: 'Datos cifrados y seguros',
    },
    {
        icon: Clock,
        label: 'Atención médica 24/7',
    },
    {
        icon: Stethoscope,
        label: 'Especialistas certificados',
    },
];

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (userData.rol === 'PACIENTE') navigate('/patient/search');
                else if (userData.rol === 'MEDICO') navigate('/doctor/appointments');
                else if (userData.rol === 'ADMIN') navigate('/admin');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left panel — visual brand */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
                <img
                    src="/medico2.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/80 via-blue-800/60 to-blue-700/40" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Volver al inicio</span>
                    </Link>

                    <div>
                        <div className="mb-8">
                            <img
                                src="/logo-completo-blanco.png"
                                alt="MediGO"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-white leading-tight mb-3">
                            Tu salud,<br />nuestra prioridad
                        </h1>
                        <p className="text-white/75 text-lg leading-relaxed max-w-sm">
                            Consultas médicas online con especialistas certificados desde cualquier lugar.
                        </p>

                        <div className="mt-10 space-y-4">
                            {trustItems.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                                        <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
                                    </div>
                                    <span className="text-sm font-medium text-white/85">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-white/40">
                        © 2025 MediGO · Plataforma de Telemedicina
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
                {/* Mobile back */}
                <div className="w-full max-w-sm lg:hidden mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Volver al inicio</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 flex justify-center">
                        <img src="/logo-completo-blanco.png" alt="MediGO" className="h-10 w-auto invert" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Iniciar sesión
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Ingresa tus datos para acceder a tu cuenta
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                            >
                                <span className="mt-0.5 shrink-0">⚠</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full min-h-[44px] cursor-pointer rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar sesión'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        ¿No tienes cuenta?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                        >
                            Regístrate gratis
                        </Link>
                    </p>

                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <p className="text-center text-xs text-slate-400">
                            Al continuar aceptas nuestros{' '}
                            <span className="text-slate-500 font-medium">Términos de servicio</span>
                            {' '}y{' '}
                            <span className="text-slate-500 font-medium">Política de privacidad</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
