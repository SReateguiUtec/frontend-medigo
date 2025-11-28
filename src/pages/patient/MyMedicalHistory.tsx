import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { historialMedicoService } from '../../api/historial-medico.service';
import { useAuth } from '../../context/AuthContext';
import type { HistorialMedico } from '../../types';
import {
    ArrowLeft, FileText, Calendar, Stethoscope, Pill, ClipboardList,
    Activity, TrendingUp, Search, Filter, Clock
} from 'lucide-react';

export const MyMedicalHistory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [historiales, setHistoriales] = useState<HistorialMedico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('all');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        if (!user) {
            setError('Debes iniciar sesión para ver tu historial');
            setLoading(false);
            return;
        }

        try {
            const data = await historialMedicoService.getMyHistory();
            const sorted = data.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setHistoriales(sorted);
        } catch (err: any) {
            console.error('Error loading medical history:', err);
            setError(err.response?.data?.message || 'Error al cargar el historial médico');
        } finally {
            setLoading(false);
        }
    };

    // Estadísticas calculadas
    const stats = useMemo(() => {
        const total = historiales.length;
        const withPrescription = historiales.filter(h => h.receta).length;
        const uniqueDoctors = new Set(historiales.map(h => h.cita.medico.id)).size;
        const thisYear = historiales.filter(h =>
            new Date(h.createdAt).getFullYear() === new Date().getFullYear()
        ).length;

        return { total, withPrescription, uniqueDoctors, thisYear };
    }, [historiales]);

    // Años disponibles para filtrar
    const availableYears = useMemo(() => {
        const years = historiales.map(h => new Date(h.createdAt).getFullYear());
        return ['all', ...Array.from(new Set(years)).sort((a, b) => b - a)];
    }, [historiales]);

    // Filtrar historiales
    const filteredHistoriales = useMemo(() => {
        return historiales.filter(h => {
            const matchesSearch = searchTerm === '' ||
                h.diagnostico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.cita.medico.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.cita.medico.apellidos.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesYear = selectedYear === 'all' ||
                new Date(h.createdAt).getFullYear().toString() === selectedYear;

            return matchesSearch && matchesYear;
        });
    }, [historiales, searchTerm, selectedYear]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
                        <Activity className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-6 text-gray-600 font-medium">Cargando tu historial médico...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-red-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Error</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-md transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                            Mi Historial Médico
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">Dashboard completo de tus consultas y tratamientos</p>
                    </div>
                </div>

                {historiales.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <FileText className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            No tienes registros médicos
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto text-lg">
                            Los registros médicos creados por tus doctores aparecerán aquí después de tus consultas.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-500 mt-1">Registros Totales</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Pill className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <Activity className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.withPrescription}</p>
                                <p className="text-sm text-gray-500 mt-1">Con Receta Médica</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <Stethoscope className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <Activity className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.uniqueDoctors}</p>
                                <p className="text-sm text-gray-500 mt-1">Doctores Diferentes</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <Clock className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.thisYear}</p>
                                <p className="text-sm text-gray-500 mt-1">Este Año</p>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por diagnóstico o doctor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="relative sm:w-48">
                                    <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white"
                                    >
                                        {availableYears.map(year => (
                                            <option key={year} value={year}>
                                                {year === 'all' ? 'Todos los años' : year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {filteredHistoriales.length !== historiales.length && (
                                <p className="text-sm text-gray-500 mt-4">
                                    Mostrando {filteredHistoriales.length} de {historiales.length} registros
                                </p>
                            )}
                        </div>

                        {/* Timeline de Registros */}
                        <div className="space-y-6">
                            {filteredHistoriales.map((historial, index) => (
                                <div
                                    key={historial.id}
                                    className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {/* Timeline connector */}
                                    {index !== filteredHistoriales.length - 1 && (
                                        <div className="absolute left-[38px] top-[80px] w-0.5 h-12 bg-gradient-to-b from-emerald-200 to-transparent"></div>
                                    )}

                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 mb-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                                <Stethoscope className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                    Dr. {historial.cita.medico.nombres} {historial.cita.medico.apellidos}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {historial.cita.medico.especialidades?.[0]?.nombre_especialidad || 'Especialista'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(historial.cita.fechaHora).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Registro: {new Date(historial.createdAt).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-5">
                                        {/* Diagnóstico */}
                                        <div className="group/item">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                    <ClipboardList className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                    Diagnóstico
                                                </h4>
                                            </div>
                                            <p className="text-gray-700 bg-gradient-to-r from-gray-50 to-emerald-50/30 p-5 rounded-xl border border-gray-100 leading-relaxed">
                                                {historial.diagnostico}
                                            </p>
                                        </div>

                                        {/* Receta */}
                                        {historial.receta && (
                                            <div className="group/item">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <Pill className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                        Receta Médica
                                                    </h4>
                                                </div>
                                                <p className="text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50/30 p-5 rounded-xl border border-blue-100 leading-relaxed">
                                                    {historial.receta}
                                                </p>
                                            </div>
                                        )}

                                        {/* Notas */}
                                        {historial.notas && (
                                            <div className="group/item">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                        Notas Adicionales
                                                    </h4>
                                                </div>
                                                <p className="text-gray-700 bg-gradient-to-r from-purple-50 to-pink-50/30 p-5 rounded-xl border border-purple-100 leading-relaxed">
                                                    {historial.notas}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredHistoriales.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-12 text-center">
                                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    No se encontraron resultados
                                </h3>
                                <p className="text-gray-500">
                                    Intenta con otros términos de búsqueda o filtros
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
