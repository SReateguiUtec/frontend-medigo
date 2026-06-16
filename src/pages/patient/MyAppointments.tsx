import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citaService } from '../../api/cita.service';
import { useVideoCall } from '../../hooks/useVideoCall';
import { ErrorModal } from '../../components/ErrorModal';
import type { Cita } from '../../types';
import {
    Calendar, Video, DollarSign, AlertCircle, CheckCircle,
    XCircle, Stethoscope, Clock, Search, Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentButton } from '../../components/PaymentButton';
import { DashboardHeader, DashboardPanel } from '@/components/dashboard';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'upcoming' | 'past';

const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'upcoming', label: 'Próximas' },
    { id: 'past', label: 'Historial' },
];

const statusConfig = {
    PENDIENTE:  { label: 'Pendiente',  classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80' },
    CONFIRMADA: { label: 'Confirmada', classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80' },
    CANCELADA:  { label: 'Cancelada',  classes: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/80' },
    COMPLETADA: { label: 'Completada', classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/80' },
    PASADA:     { label: 'Pasada',     classes: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/80' },
} as const;

const statusIcon = {
    PENDIENTE:  <AlertCircle className="h-3 w-3" />,
    CONFIRMADA: <CheckCircle className="h-3 w-3" />,
    CANCELADA:  <XCircle className="h-3 w-3" />,
    COMPLETADA: <CheckCircle className="h-3 w-3" />,
    PASADA:     <Clock className="h-3 w-3" />,
};

export const MyAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { joinVideoCall } = useVideoCall();
    const [appointments, setAppointments] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<FilterTab>('all');
    const [joiningCallId, setJoiningCallId] = useState<number | null>(null);
    const [earlyJoinMessage, setEarlyJoinMessage] = useState('');

    useEffect(() => { loadAppointments(); }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError('');
            if (!user) { setError('Debes iniciar sesión para ver tus citas'); setLoading(false); return; }
            if (user.rol !== 'PACIENTE') { setError('Solo los pacientes pueden ver sus citas'); setLoading(false); return; }
            const data = await citaService.getMyCitas();
            setAppointments(data);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al cargar las citas';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const isPast = (cita: Cita) =>
        new Date().getTime() > new Date(cita.fechaHora).getTime() + 60 * 60 * 1000;

    const isJoinable = (cita: Cita) => {
        const t = new Date(cita.fechaHora).getTime();
        const now = new Date().getTime();
        return cita.estado === 'CONFIRMADA' && now >= t - 15 * 60 * 1000 && now <= t + 60 * 60 * 1000;
    };

    const handleJoinVideoCall = async (citaId: number) => {
        const apt = appointments.find((a) => a.id === citaId);
        if (apt) {
            const t = new Date(apt.fechaHora).getTime();
            const now = new Date().getTime();
            if (now < t - 15 * 60 * 1000) {
                const mins = Math.ceil((t - now) / 60000);
                setEarlyJoinMessage(`La sala estará disponible 15 minutos antes de la hora agendada.\n\nTiempo restante: ${mins} minutos`);
                return;
            }
        }
        setJoiningCallId(citaId);
        const result = await joinVideoCall(citaId);
        setJoiningCallId(null);
        if (!result.success) {
            if (result.message.includes('sala de video') || result.message.includes('cita ID')) {
                setEarlyJoinMessage('La sala estará disponible a la hora agendada. Por favor intenta nuevamente en unos minutos.');
            } else {
                setError(result.message);
            }
        }
    };

    const filtered = appointments
        .filter((a) => a.esPagada === true)
        .filter((a) => {
            const d = new Date(a.fechaHora);
            const now = new Date();
            if (filter === 'upcoming') return d >= now && a.estado !== 'CANCELADA' && a.estado !== 'COMPLETADA';
            if (filter === 'past') return d < now || a.estado === 'COMPLETADA' || a.estado === 'CANCELADA';
            return true;
        })
        .sort((a, b) => {
            const pa = isPast(a), pb = isPast(b);
            if (pa && !pb) return 1;
            if (!pa && pb) return -1;
            return pa
                ? new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
                : new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();
        });

    if (loading) {
        return (
            <div>
                <DashboardHeader title="Mis citas" subtitle="Gestiona tus consultas médicas" />
                <div className="flex min-h-[320px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                        <p className="text-sm text-slate-500">Cargando citas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardHeader
                title="Mis citas"
                subtitle="Gestiona y revisa tus consultas médicas"
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/patient/search')}
                        className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        <Search className="h-4 w-4" strokeWidth={2} />
                        Buscar médico
                    </button>
                }
            />

            {/* Filter tabs */}
            <div className="mb-6 inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilter(tab.id)}
                        className={cn(
                            'min-h-[36px] cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            filter === tab.id
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 ? (
                <DashboardPanel className="flex flex-col items-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <Calendar className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">
                        {filter === 'upcoming' ? 'Sin citas próximas' : filter === 'past' ? 'Sin historial' : 'Sin citas'}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-slate-500">
                        {filter === 'upcoming'
                            ? 'Agenda tu próxima consulta con nuestros especialistas.'
                            : 'No hay citas en esta categoría.'}
                    </p>
                    {filter === 'upcoming' && (
                        <button
                            type="button"
                            onClick={() => navigate('/patient/search')}
                            className="mt-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        >
                            Buscar médicos
                        </button>
                    )}
                </DashboardPanel>
            ) : (
                <div className="space-y-3">
                    {filtered.map((apt) => {
                        const past = isPast(apt);
                        const joinable = isJoinable(apt);
                        const aptDate = new Date(apt.fechaHora);
                        const statusKey = (past && apt.estado !== 'COMPLETADA' && apt.estado !== 'CANCELADA')
                            ? 'PASADA'
                            : apt.estado as keyof typeof statusConfig;
                        const { label: statusLabel, classes: statusClasses } = statusConfig[statusKey] ?? statusConfig.PASADA;

                        return (
                            <article
                                key={apt.id}
                                className={cn(
                                    'group rounded-2xl border bg-white p-5 transition-all duration-200',
                                    past
                                        ? 'border-slate-200/80 opacity-80'
                                        : 'border-slate-200/80 hover:border-blue-200/80 hover:shadow-[0_8px_24px_rgba(15,118,110,0.07)]'
                                )}
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                                    {/* Date block */}
                                    <div className={cn(
                                        'hidden shrink-0 flex-col items-center justify-center rounded-2xl px-4 py-3 sm:flex',
                                        past ? 'bg-slate-100' : 'bg-blue-50 ring-1 ring-blue-100'
                                    )}>
                                        <span className={cn('text-xs font-semibold uppercase tracking-widest', past ? 'text-slate-400' : 'text-blue-600')}>
                                            {aptDate.toLocaleDateString('es-ES', { month: 'short' })}
                                        </span>
                                        <span className="font-display text-3xl font-bold tabular-nums text-slate-900 leading-none mt-1">
                                            {aptDate.getDate()}
                                        </span>
                                        <span className={cn('mt-1 text-xs tabular-nums', past ? 'text-slate-400' : 'text-blue-600/80')}>
                                            {aptDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className={cn('font-display text-lg font-semibold tracking-tight text-slate-900 transition-colors', !past && 'group-hover:text-blue-800')}>
                                                    Dr. {apt.medico.nombres} {apt.medico.apellidos}
                                                </h3>
                                                <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-slate-500">
                                                    <Stethoscope className="h-3.5 w-3.5" strokeWidth={1.75} />
                                                    {apt.medico.especialidades?.[0]?.nombre_especialidad || 'Especialista'}
                                                </p>
                                            </div>

                                            {/* Status badge */}
                                            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold', statusClasses)}>
                                                {statusIcon[statusKey]}
                                                {statusKey === 'PASADA' ? 'Pasada' : statusLabel}
                                            </span>
                                        </div>

                                        {/* Mobile date */}
                                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 sm:hidden">
                                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                                            {aptDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            {' · '}
                                            {aptDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </div>

                                        {/* Payment + action row */}
                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            {apt.esPagada ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
                                                    <DollarSign className="h-3 w-3" />
                                                    Pago confirmado
                                                </span>
                                            ) : (apt.estado === 'PENDIENTE' || apt.estado === 'CONFIRMADA') && (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                                                        <DollarSign className="h-3 w-3" />
                                                        Pago pendiente
                                                    </span>
                                                    <PaymentButton citaId={apt.id} className="text-xs" />
                                                </div>
                                            )}

                                            {!past && joinable && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleJoinVideoCall(apt.id)}
                                                    disabled={joiningCallId === apt.id}
                                                    className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 disabled:opacity-50"
                                                >
                                                    {joiningCallId === apt.id ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            Conectando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Video className="h-4 w-4" />
                                                            Unirse ahora
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <ErrorModal isOpen={!!error} onClose={() => setError('')} message={error} />

            {earlyJoinMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                            <Clock className="h-8 w-8 text-blue-600" strokeWidth={1.5} />
                        </div>
                        <h2 className="font-display mt-5 text-xl font-semibold text-slate-900">Un momento...</h2>
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                            {earlyJoinMessage}
                        </p>
                        <button
                            type="button"
                            onClick={() => setEarlyJoinMessage('')}
                            className="mt-7 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-xl bg-blue-700 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
