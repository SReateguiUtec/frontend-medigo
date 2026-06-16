import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { profileService } from '@/api/profile.service';
import type { Paciente } from '@/types';
import {
    Search,
    MessageSquare,
    FileText,
    Pill,
    Calendar,
    Clock,
    Heart,
    Activity,
    AlertCircle,
    CheckCircle,
    Bell,
    Droplet,
    Weight,
    Zap,
    ArrowRight,
    Plus,
} from 'lucide-react';
import {
    DashboardHeader,
    StatCard,
    DashboardSection,
    QuickActionGrid,
    DashboardPanel,
} from '@/components/dashboard';
import { cn } from '@/lib/utils';

export const PatientHome = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    // Sync name from profile if JWT didn't include it
    useEffect(() => {
        if (user && !user.nombres) {
            profileService.getProfile().then((profile) => {
                updateUser({ ...user, ...(profile as Paciente) });
            }).catch(() => {});
        }
    }, []);

    const quickStats = [
        { label: 'Consultas este mes', value: '3', trend: '+2', icon: Activity, trendPositive: true },
        { label: 'Adherencia al tratamiento', value: '92%', trend: '+5%', icon: CheckCircle, trendPositive: true },
        { label: 'Próximas citas', value: '2', icon: Calendar },
    ];

    const healthMetrics = [
        { label: 'Presión arterial', value: '120/80', unit: 'mmHg', change: '+2%', icon: Heart, status: 'Normal' },
        { label: 'Peso', value: '72', unit: 'kg', change: '-1.5%', icon: Weight, status: 'Normal' },
        { label: 'Glucosa', value: '95', unit: 'mg/dL', change: '0%', icon: Droplet, status: 'Normal' },
        { label: 'Frecuencia cardíaca', value: '72', unit: 'bpm', change: '+3%', icon: Zap, status: 'Normal' },
    ];

    const upcomingAppointments = [
        {
            id: 1,
            doctor: 'Dr. María González',
            specialty: 'Cardiología',
            date: '2025-12-05',
            time: '10:00 AM',
            avatar: 'MG',
        },
        {
            id: 2,
            doctor: 'Dr. Carlos Ruiz',
            specialty: 'Pediatría',
            date: '2025-12-10',
            time: '3:30 PM',
            avatar: 'CR',
        },
    ];

    const alerts = [
        { id: 1, message: 'Vacuna contra la influenza pendiente', dueDate: '14 dic', priority: 'high' as const },
        { id: 2, message: 'Examen de sangre de rutina', dueDate: '19 dic', priority: 'medium' as const },
    ];

    const activeMedications = [
        { id: 1, name: 'Losartán', dosage: '50mg', frequency: 'Cada 12 horas', nextDose: '2:00 PM' },
        { id: 2, name: 'Metformina', dosage: '850mg', frequency: 'Cada 8 horas', nextDose: '6:00 PM' },
    ];

    const quickActions = [
        {
            title: 'Buscar médico',
            description: 'Encuentra especialistas',
            icon: Search,
            onClick: () => navigate('/patient/search'),
        },
        {
            title: 'Chat MediGIA',
            description: 'Asistente de salud',
            icon: MessageSquare,
            onClick: () => navigate('/patient/ai-chat'),
        },
        {
            title: 'Mi historial',
            description: 'Registros médicos',
            icon: FileText,
            onClick: () => navigate('/patient/historial-medico'),
        },
    ];

    const todayLabel = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div>
            <DashboardHeader
                title={`Hola, ${user?.nombres?.split(' ')[0] ?? 'paciente'}`}
                subtitle={`Resumen de tu salud · ${todayLabel}`}
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/patient/search')}
                        className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva cita
                    </button>
                }
            />

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {quickStats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <DashboardSection
                        title="Indicadores de salud"
                        description="Tus métricas más recientes"
                        icon={Heart}
                    >
                        <DashboardPanel padding="none">
                            <ul className="divide-y divide-slate-100">
                                {healthMetrics.map((metric) => (
                                    <li
                                        key={metric.label}
                                        className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                            <metric.icon className="h-4 w-4" strokeWidth={1.75} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-slate-900">{metric.label}</p>
                                            <div className="mt-0.5 flex items-baseline gap-1.5">
                                                <span className="font-display text-xl font-semibold tabular-nums text-slate-900">
                                                    {metric.value}
                                                </span>
                                                <span className="text-sm text-slate-500">{metric.unit}</span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                                            <span className="text-xs text-slate-400">{metric.change}</span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                <CheckCircle className="h-3 w-3" />
                                                {metric.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </DashboardPanel>
                    </DashboardSection>

                    <DashboardSection title="Acceso rápido" description="Tareas frecuentes">
                        <QuickActionGrid actions={quickActions} columns={3} />
                    </DashboardSection>

                    <DashboardSection title="Medicamentos activos" icon={Pill}>
                        <DashboardPanel padding="none">
                            <ul className="divide-y divide-slate-100">
                                {activeMedications.map((med) => (
                                    <li
                                        key={med.id}
                                        className="flex items-center justify-between gap-4 px-5 py-4"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{med.name}</p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {med.dosage} · {med.frequency}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                                                Próxima dosis
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold tabular-nums text-blue-700">
                                                {med.nextDose}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </DashboardPanel>
                    </DashboardSection>
                </div>

                <div className="space-y-8">
                    <DashboardSection title="Alertas" icon={Bell}>
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={cn(
                                        'rounded-2xl border p-4',
                                        alert.priority === 'high'
                                            ? 'border-rose-200/80 bg-rose-50/50'
                                            : 'border-amber-200/80 bg-amber-50/50'
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <AlertCircle
                                            className={cn(
                                                'mt-0.5 h-4 w-4 shrink-0',
                                                alert.priority === 'high' ? 'text-rose-600' : 'text-amber-600'
                                            )}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                                            <p className="mt-1 text-xs text-slate-500">Vence: {alert.dueDate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardSection>

                    <DashboardSection
                        title="Próximas citas"
                        icon={Calendar}
                        action={
                            <button
                                type="button"
                                onClick={() => navigate('/patient/appointments')}
                                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-700 transition-colors hover:text-blue-800"
                            >
                                Ver todas
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        }
                    >
                        <div className="space-y-3">
                            {upcomingAppointments.map((appointment) => (
                                <DashboardPanel key={appointment.id} padding="sm" className="transition-shadow hover:shadow-[0_8px_24px_rgba(15,118,110,0.06)]">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800 ring-1 ring-blue-100">
                                            {appointment.avatar}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {appointment.doctor}
                                            </p>
                                            <p className="text-xs text-slate-500">{appointment.specialty}</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(appointment.date).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {appointment.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </DashboardPanel>
                            ))}
                        </div>
                    </DashboardSection>
                </div>
            </div>
        </div>
    );
};
