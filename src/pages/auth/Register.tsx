import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import {
    ArrowLeft, Eye, EyeOff, Mail, Lock, User, IdCard,
    Users, Stethoscope, CheckCircle2, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sideFeatures = [
    { icon: ShieldCheck, label: 'Datos 100% cifrados y seguros' },
    { icon: Stethoscope, label: 'Médicos verificados y certificados' },
    { icon: Users, label: 'Más de 10,000 pacientes activos' },
];

export const Register = () => {
    const [searchParams] = useSearchParams();
    const [userType, setUserType] = useState<'PACIENTE' | 'MEDICO'>(
        searchParams.get('role') === 'MEDICO' ? 'MEDICO' : 'PACIENTE'
    );
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        dni: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (userType === 'PACIENTE') {
                await authService.registerPaciente({
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    email: formData.email,
                    password: formData.password,
                });
            } else {
                await authService.registerMedico({
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    email: formData.email,
                    password: formData.password,
                    dni: formData.dni,
                });
            }
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left panel — visual brand */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
                <img
                    src="/medico1.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/80 via-blue-800/60 to-blue-600/40" />

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
                            Únete a MediGO
                        </h1>
                        <p className="text-white/75 text-lg leading-relaxed max-w-sm">
                            Crea tu cuenta y accede a la red de especialistas médicos más completa del país.
                        </p>

                        <div className="mt-10 space-y-4">
                            {sideFeatures.map(({ icon: Icon, label }) => (
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
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16 overflow-y-auto">
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

                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Crear cuenta
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Completa el formulario para unirte a MediGO
                        </p>
                    </div>

                    {success ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 mb-5">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">¡Cuenta creada!</h3>
                            <p className="mt-2 text-sm text-slate-500 max-w-xs">
                                Te redirigiremos al inicio de sesión en un momento.
                            </p>
                        </div>
                    ) : (
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

                            {/* Role selector */}
                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-slate-700">
                                    Tipo de cuenta
                                </span>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {([
                                        { value: 'PACIENTE', label: 'Paciente', icon: Users },
                                        { value: 'MEDICO', label: 'Médico', icon: Stethoscope },
                                    ] as const).map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setUserType(value)}
                                            className={cn(
                                                'flex items-center justify-center gap-2.5 min-h-[48px] rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer',
                                                userType === value
                                                    ? 'border-blue-700 bg-blue-50 text-blue-800'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                            )}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Names row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="nombres" className="block text-sm font-medium text-slate-700">
                                        Nombres
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                                        <input
                                            id="nombres"
                                            name="nombres"
                                            type="text"
                                            required
                                            autoComplete="given-name"
                                            placeholder="Juan"
                                            value={formData.nombres}
                                            onChange={handleChange}
                                            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="apellidos" className="block text-sm font-medium text-slate-700">
                                        Apellidos
                                    </label>
                                    <input
                                        id="apellidos"
                                        name="apellidos"
                                        type="text"
                                        required
                                        autoComplete="family-name"
                                        placeholder="Pérez"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:bg-white"
                                    />
                                </div>
                            </div>

                            {/* DNI — solo médicos */}
                            {userType === 'MEDICO' && (
                                <div className="space-y-1.5">
                                    <label htmlFor="dni" className="block text-sm font-medium text-slate-700">
                                        DNI
                                    </label>
                                    <div className="relative">
                                        <IdCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                                        <input
                                            id="dni"
                                            name="dni"
                                            type="text"
                                            required
                                            maxLength={8}
                                            autoComplete="off"
                                            placeholder="12345678"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:bg-white"
                                        />
                                    </div>
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
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        autoComplete="new-password"
                                        placeholder="Mínimo 8 caracteres"
                                        value={formData.password}
                                        onChange={handleChange}
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
                                <p className="text-xs text-slate-400">Mínimo 8 caracteres</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full min-h-[44px] cursor-pointer rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Creando cuenta...
                                    </span>
                                ) : (
                                    'Crear cuenta'
                                )}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-slate-500">
                        ¿Ya tienes cuenta?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                        >
                            Inicia sesión
                        </Link>
                    </p>

                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <p className="text-center text-xs text-slate-400">
                            Al registrarte aceptas nuestros{' '}
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
