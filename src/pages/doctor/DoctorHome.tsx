import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileService } from '@/api/profile.service';
import type { Medico } from '@/types';
import {
    Calendar,
    Clock,
    Users,
    DollarSign,
    Star,
    Activity,
    Settings,
    BarChart3,
    CheckCircle,
    AlertCircle,
    User,
    ArrowRight,
} from 'lucide-react';
import { citaService } from '@/api/cita.service';
import type { Cita } from '@/types';
import {
    DashboardHeader,
    StatCard,
    DashboardSection,
    QuickActionGrid,
    DashboardPanel,
} from '@/components/dashboard';
import { cn } from '@/lib/utils';

export const DoctorHome = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCitas();
        // Sync name from profile if JWT didn't include it
        if (user && !user.nombres) {
            profileService.getProfile().then((profile) => {
                updateUser({ ...user, ...(profile as Medico) });
            }).catch(() => {});
        }
    }, []);

    const loadCitas = async () => {
        try {
            const data = await citaService.getMyCitas();
            setCitas(data);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const todayAppointments = citas.filter((cita) => {
        const citaDate = new Date(cita.fechaHora);
        return (
            citaDate.getFullYear() === todayYear &&
            citaDate.getMonth() === todayMonth &&
            citaDate.getDate() === todayDay &&
            cita.estado !== 'CANCELADA'
        );
    });

    const upcomingAppointments = citas
        .filter((cita) => new Date(cita.fechaHora) > new Date() && cita.estado !== 'CANCELADA')
        .slice(0, 5);

    const completedThisMonth = citas.filter((cita) => {
        const citaDate = new Date(cita.fechaHora);
        const now = new Date();
        return (
            citaDate.getMonth() === now.getMonth() &&
            citaDate.getFullYear() === now.getFullYear() &&
            cita.estado === 'COMPLETADA'
        );
    }).length;

    const pendingAppointments = citas.filter(
        (cita) => cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA'
    ).length;

    const quickStats = [
        {
            label: 'Citas hoy',
            value: todayAppointments.length.toString(),
            hint: `${pendingAppointments} pendientes`,
            icon: Calendar,
        },
        {
            label: 'Pacientes este mes',
            value: completedThisMonth.toString(),
            trend: '+12%',
            icon: Users,
            trendPositive: true,
        },
        {
            label: 'Calificación',
            value: '4.8',
            hint: 'Excelente',
            icon: Star,
        },
        {
            label: 'Ingresos del mes',
            value: 'S/3,450',
            trend: '+8%',
            icon: DollarSign,
            trendPositive: true,
        },
    ];

    const weeklyStats = [
        { day: 'Lun', appointments: 8 },
        { day: 'Mar', appointments: 12 },
        { day: 'Mié', appointments: 10 },
        { day: 'Jue', appointments: 15 },
        { day: 'Vie', appointments: 11 },
        { day: 'Sáb', appointments: 6 },
        { day: 'Dom', appointments: 3 },
    ];

    const maxAppointments = Math.max(...weeklyStats.map((s) => s.appointments));

    const quickActions = [
        {
            title: 'Mi agenda',
            description: 'Gestiona tus citas',
            icon: Calendar,
            onClick: () => navigate('/doctor/appointments'),
        },
        {
            title: 'Horarios',
            description: 'Configura disponibilidad',
            icon: Clock,
            onClick: () => navigate('/doctor/schedule'),
        },
        {
            title: 'Pacientes',
            description: 'Historiales clínicos',
            icon: Users,
            onClick: () => navigate('/doctor/patients'),
        },
        {
            title: 'Perfil',
            description: 'Tu información',
            icon: Settings,
            onClick: () => navigate('/doctor/profile'),
        },
    ];

    const recentPatients = upcomingAppointments.slice(0, 3).map((cita) => ({
        id: cita.id,
        name:
            `${cita.paciente?.nombres || ''} ${cita.paciente?.apellidos || ''}`.trim() || 'Paciente',
        lastVisit: new Date(cita.fechaHora).toLocaleDateString('es-ES'),
        avatar: (cita.paciente?.nombres?.[0] || 'P') + (cita.paciente?.apellidos?.[0] || ''),
    }));

    const todayLabel = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    const getStatusStyles = (estado: string) => {
        if (estado === 'CONFIRMADA') return 'bg-emerald-50 text-emerald-700';
        if (estado === 'PENDIENTE') return 'bg-amber-50 text-amber-700';
        return 'bg-slate-100 text-slate-600';
    };

    return (
        <div>
            <DashboardHeader
                title={`Dr. ${user?.apellidos ?? ''}`}
                subtitle={`Agenda del día · ${todayLabel}`}
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/doctor/appointments')}
                        className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        Ver agenda
                        <ArrowRight className="h-4 w-4" />
                    </button>
                }
            />

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {quickStats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <DashboardSection
                        title="Actividad semanal"
                        description="Citas atendidas por día"
                        icon={BarChart3}
                    >
                        <DashboardPanel>
                            <div className="flex h-44 items-end justify-between gap-2 sm:gap-3">
                                {weeklyStats.map((stat) => {
                                    const height = `${(stat.appointments / maxAppointments) * 100}%`;
                                    return (
                                        <div key={stat.day} className="flex flex-1 flex-col items-center gap-2">
                                            <span className="text-xs font-semibold tabular-nums text-slate-700">
                                                {stat.appointments}
                                            </span>
                                            <div className="relative flex h-32 w-full items-end rounded-xl bg-slate-100/80 p-1">
                                                <div
                                                    className="w-full rounded-lg bg-blue-600 transition-all duration-300 hover:bg-blue-700"
                                                    style={{ height }}
                                                    role="img"
                                                    aria-label={`${stat.day}: ${stat.appointments} citas`}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-500">{stat.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </DashboardPanel>
                    </DashboardSection>

                    <DashboardSection title="Acceso rápido">
                        <QuickActionGrid actions={quickActions} columns={4} />
                    </DashboardSection>

                    <DashboardSection title="Pacientes recientes" icon={Users}>
                        <DashboardPanel padding="none">
                            {loading ? (
                                <p className="px-5 py-8 text-center text-sm text-slate-500">Cargando...</p>
                            ) : recentPatients.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-slate-500">
                                    No hay pacientes recientes
                                </p>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {recentPatients.map((patient) => (
                                        <li
                                            key={patient.id}
                                            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800 ring-1 ring-blue-100">
                                                    {patient.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
                                                    <p className="text-xs text-slate-500">
                                                        Última visita: {patient.lastVisit}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="cursor-pointer text-xs font-semibold text-blue-700 transition-colors hover:text-blue-800"
                                            >
                                                Ver historial
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </DashboardPanel>
                    </DashboardSection>
                </div>

                <div className="space-y-8">
                    <DashboardSection
                        title="Citas de hoy"
                        icon={Calendar}
                        action={
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
                                {todayAppointments.length}
                            </span>
                        }
                    >
                        <div className="space-y-3">
                            {loading ? (
                                <DashboardPanel padding="sm">
                                    <p className="text-center text-sm text-slate-500">Cargando...</p>
                                </DashboardPanel>
                            ) : todayAppointments.length === 0 ? (
                                <DashboardPanel padding="sm">
                                    <p className="text-center text-sm text-slate-500">No hay citas para hoy</p>
                                </DashboardPanel>
                            ) : (
                                todayAppointments.map((cita) => (
                                    <DashboardPanel key={cita.id} padding="sm">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {`${cita.paciente?.nombres || ''} ${cita.paciente?.apellidos || ''}`.trim() ||
                                                        'Paciente'}
                                                </p>
                                                <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(cita.fechaHora).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                                <span
                                                    className={cn(
                                                        'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                                        getStatusStyles(cita.estado)
                                                    )}
                                                >
                                                    {cita.estado === 'CONFIRMADA' ? (
                                                        <CheckCircle className="h-3 w-3" />
                                                    ) : (
                                                        <AlertCircle className="h-3 w-3" />
                                                    )}
                                                    {cita.estado}
                                                </span>
                                            </div>
                                        </div>
                                    </DashboardPanel>
                                ))
                            )}
                        </div>
                    </DashboardSection>

                    <DashboardSection title="Próximas citas" icon={Activity}>
                        <div className="space-y-2">
                            {upcomingAppointments.slice(0, 3).map((cita) => (
                                <DashboardPanel key={cita.id} padding="sm">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {`${cita.paciente?.nombres || ''} ${cita.paciente?.apellidos || ''}`.trim() ||
                                            'Paciente'}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {new Date(cita.fechaHora).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </DashboardPanel>
                            ))}
                        </div>
                    </DashboardSection>
                </div>
            </div>
        </div>
    );
};
