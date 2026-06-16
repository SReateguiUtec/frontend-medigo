import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { historialMedicoService } from '../../api/historial-medico.service';
import { useAuth } from '../../context/AuthContext';
import type { HistorialMedico } from '../../types';
import {
    FileText, Calendar, Stethoscope, Pill, ClipboardList,
    Activity, TrendingUp, Search, Filter, Check, ChevronDown, ArrowRight
} from 'lucide-react';
import { MedicalAIChat } from '../../components/MedicalAIChat';
import { Listbox, Transition } from '@headlessui/react';
import { DashboardHeader, StatCard, DashboardPanel } from '@/components/dashboard';
import { cn } from '@/lib/utils';

export const MyMedicalHistory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [historiales, setHistoriales] = useState<HistorialMedico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('all');

    useEffect(() => { loadHistory(); }, []);

    const loadHistory = async () => {
        if (!user) { setError('Debes iniciar sesión'); setLoading(false); return; }
        try {
            const data = await historialMedicoService.getMyHistory();
            setHistoriales(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al cargar el historial médico';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: historiales.length,
        withPrescription: historiales.filter(h => h.receta).length,
        uniqueDoctors: new Set(historiales.map(h => h.cita.medico.id)).size,
        thisYear: historiales.filter(h => new Date(h.createdAt).getFullYear() === new Date().getFullYear()).length,
    }), [historiales]);

    const availableYears = useMemo(() => {
        const years = historiales.map(h => new Date(h.createdAt).getFullYear());
        return ['all', ...Array.from(new Set(years)).sort((a, b) => b - a)];
    }, [historiales]);

    const filtered = useMemo(() => historiales.filter(h => {
        const matchSearch = !searchTerm ||
            h.diagnostico.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.cita.medico.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.cita.medico.apellidos.toLowerCase().includes(searchTerm.toLowerCase());
        const matchYear = selectedYear === 'all' || new Date(h.createdAt).getFullYear().toString() === selectedYear;
        return matchSearch && matchYear;
    }), [historiales, searchTerm, selectedYear]);

    if (loading) {
        return (
            <div>
                <DashboardHeader title="Historial médico" subtitle="Cargando tus registros..." />
                <div className="flex min-h-[320px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                        <p className="text-sm text-slate-500">Cargando historial médico...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <DashboardHeader title="Historial médico" subtitle="" />
                <DashboardPanel className="flex flex-col items-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
                        <FileText className="h-7 w-7 text-rose-500" strokeWidth={1.5} />
                    </div>
                    <p className="mt-4 text-sm font-medium text-rose-700">{error}</p>
                    <button type="button" onClick={() => navigate(-1)}
                        className="mt-6 cursor-pointer text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900">
                        ← Volver
                    </button>
                </DashboardPanel>
            </div>
        );
    }

    return (
        <div>
            <DashboardHeader
                title="Historial médico"
                subtitle="Registro completo de tus consultas y tratamientos"
            />

            {historiales.length === 0 ? (
                <DashboardPanel className="flex flex-col items-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <FileText className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">Sin registros médicos</h3>
                    <p className="mt-2 max-w-xs text-sm text-slate-500">
                        Los registros creados por tus médicos aparecerán aquí después de tus consultas.
                    </p>
                </DashboardPanel>
            ) : (
                <>
                    {/* Stats */}
                    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatCard label="Registros totales" value={stats.total.toString()} icon={FileText} trend={`+${stats.thisYear} este año`} trendPositive />
                        <StatCard label="Con receta médica" value={stats.withPrescription.toString()} icon={Pill} />
                        <StatCard label="Médicos distintos" value={stats.uniqueDoctors.toString()} icon={Stethoscope} />
                        <StatCard label="Consultas este año" value={stats.thisYear.toString()} icon={TrendingUp} />
                    </div>

                    {/* AI Assistant */}
                    <div className="mb-8">
                        <MedicalAIChat />
                    </div>

                    {/* Search + Year filter */}
                    <DashboardPanel className="mb-8">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                                <input
                                    type="text"
                                    placeholder="Buscar por diagnóstico o médico..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                                />
                            </div>
                            <div className="sm:w-44">
                                <Listbox value={selectedYear} onChange={setSelectedYear}>
                                    <div className="relative">
                                        <Listbox.Button className="relative flex min-h-[44px] w-full cursor-pointer items-center rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                                            <Filter className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
                                            <span className="flex-1 truncate font-medium text-slate-900">
                                                {selectedYear === 'all' ? 'Todos los años' : selectedYear}
                                            </span>
                                            <ChevronDown className="pointer-events-none h-4 w-4 text-slate-400" />
                                        </Listbox.Button>
                                        <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="absolute z-20 mt-2 w-full overflow-auto rounded-xl border border-slate-200/80 bg-white py-1 shadow-lg focus:outline-none">
                                                {availableYears.map((year) => (
                                                    <Listbox.Option key={year} value={year}
                                                        className={({ active }) => cn('relative cursor-pointer py-2.5 pl-10 pr-4 text-sm', active ? 'bg-blue-50 text-blue-900' : 'text-slate-900')}>
                                                        {({ selected }) => (<>
                                                            <span className={selected ? 'font-semibold' : ''}>{year === 'all' ? 'Todos los años' : year}</span>
                                                            {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check className="h-4 w-4" /></span>}
                                                        </>)}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div>
                        {filtered.length !== historiales.length && (
                            <p className="mt-3 text-xs text-slate-500">
                                Mostrando {filtered.length} de {historiales.length} registros
                            </p>
                        )}
                    </DashboardPanel>

                    {/* Timeline */}
                    {filtered.length === 0 ? (
                        <DashboardPanel className="flex flex-col items-center py-16 text-center">
                            <Search className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
                            <h3 className="mt-4 font-display text-base font-semibold text-slate-900">Sin resultados</h3>
                            <p className="mt-1 text-sm text-slate-500">Intenta con otros términos o filtros</p>
                        </DashboardPanel>
                    ) : (
                        <div className="relative space-y-4">
                            {/* Vertical timeline line */}
                            <div className="absolute left-[23px] top-10 hidden h-[calc(100%-80px)] w-px bg-slate-100 md:block" />

                            {filtered.map((historial) => (
                                <article
                                    key={historial.id}
                                    className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-blue-200/80 hover:shadow-[0_8px_24px_rgba(37,99,235,0.07)] md:ml-12 md:p-6"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[37px] top-6 hidden h-4 w-4 rounded-full border-2 border-blue-200 bg-blue-50 ring-4 ring-white md:block" />

                                    {/* Header */}
                                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-transform group-hover:scale-105">
                                                <Stethoscope className="h-5 w-5" strokeWidth={1.75} />
                                            </div>
                                            <div>
                                                <h3 className="font-display text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                                                    Dr. {historial.cita.medico.nombres} {historial.cita.medico.apellidos}
                                                </h3>
                                                <p className="mt-0.5 text-sm text-slate-500">
                                                    {historial.cita.medico.especialidades?.[0]?.nombre_especialidad || 'Especialista'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start gap-1 sm:items-end">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(historial.cita.fechaHora).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                Registro: {new Date(historial.createdAt).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content sections */}
                                    <div className="mt-4 space-y-4">
                                        <MedicalBlock icon={ClipboardList} label="Diagnóstico" color="blue">
                                            {historial.diagnostico}
                                        </MedicalBlock>

                                        {historial.receta && (
                                            <MedicalBlock icon={Pill} label="Receta médica" color="indigo">
                                                {historial.receta}
                                            </MedicalBlock>
                                        )}

                                        {historial.notas && (
                                            <MedicalBlock icon={FileText} label="Notas adicionales" color="slate">
                                                {historial.notas}
                                            </MedicalBlock>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-5 border-t border-slate-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/patient/historial-medico/${historial.id}`)}
                                            className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                                        >
                                            <Activity className="h-4 w-4" />
                                            Ver imágenes y detalles
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

function MedicalBlock({ icon: Icon, label, color, children }: {
    icon: typeof FileText;
    label: string;
    color: 'blue' | 'indigo' | 'slate';
    children: React.ReactNode;
}) {
    const iconBg = { blue: 'bg-blue-50 text-blue-600', indigo: 'bg-indigo-50 text-indigo-600', slate: 'bg-slate-100 text-slate-600' };
    const blockBg = { blue: 'bg-blue-50/40 border-blue-100/80', indigo: 'bg-indigo-50/40 border-indigo-100/80', slate: 'bg-slate-50/60 border-slate-200/80' };

    return (
        <div>
            <div className="mb-2 flex items-center gap-2">
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', iconBg[color])}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
                <h4 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">{label}</h4>
            </div>
            <div className={cn('rounded-xl border px-4 py-3', blockBg[color])}>
                <p className="text-sm leading-relaxed text-slate-700">{children}</p>
            </div>
        </div>
    );
}
