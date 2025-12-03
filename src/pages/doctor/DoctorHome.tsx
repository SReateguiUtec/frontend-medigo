import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    User
} from 'lucide-react';
import { Card, CardContent } from '@/components/Card';
import { citaService } from '@/api/cita.service';
import type { Cita } from '@/types';

export const DoctorHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCitas();
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

    // Filtrar citas de hoy y próximas
    // Nota: Comparamos componentes de fecha (año/mes/día) directamente en lugar de timestamps
    // para evitar problemas de zona horaria. Esto funciona correctamente sin importar
    // si el backend envía las fechas en UTC, con offset (-05:00), o en hora local.
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const todayAppointments = citas.filter(cita => {
        const citaDate = new Date(cita.fechaHora);
        return citaDate.getFullYear() === todayYear &&
            citaDate.getMonth() === todayMonth &&
            citaDate.getDate() === todayDay &&
            cita.estado !== 'CANCELADA';
    });

    const upcomingAppointments = citas.filter(cita => {
        const citaDate = new Date(cita.fechaHora);
        return citaDate > new Date() && cita.estado !== 'CANCELADA';
    }).slice(0, 5);

    // Estadísticas
    const completedThisMonth = citas.filter(cita => {
        const citaDate = new Date(cita.fechaHora);
        const now = new Date();
        return citaDate.getMonth() === now.getMonth() &&
            citaDate.getFullYear() === now.getFullYear() &&
            cita.estado === 'COMPLETADA';
    }).length;

    const pendingAppointments = citas.filter(cita =>
        cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA'
    ).length;

    const quickStats = [
        {
            label: 'Citas Hoy',
            value: todayAppointments.length.toString(),
            change: `${pendingAppointments} pendientes`,
            icon: Calendar,
            color: 'blue'
        },
        {
            label: 'Pacientes este mes',
            value: completedThisMonth.toString(),
            change: '+12%',
            icon: Users,
            color: 'emerald'
        },
        {
            label: 'Calificación',
            value: '4.8',
            change: '⭐ Excelente',
            icon: Star,
            color: 'yellow'
        },
        {
            label: 'Ingresos del mes',
            value: 'S/3,450',
            change: '+8%',
            icon: DollarSign,
            color: 'purple'
        }
    ];

    const weeklyStats = [
        { day: 'Lun', appointments: 8 },
        { day: 'Mar', appointments: 12 },
        { day: 'Mié', appointments: 10 },
        { day: 'Jue', appointments: 15 },
        { day: 'Vie', appointments: 11 },
        { day: 'Sáb', appointments: 6 },
        { day: 'Dom', appointments: 3 }
    ];

    const maxAppointments = Math.max(...weeklyStats.map(s => s.appointments));

    const quickActions = [
        {
            title: 'Mi Agenda',
            icon: Calendar,
            path: '/doctor/appointments',
            color: 'blue'
        },
        {
            title: 'Horarios',
            icon: Clock,
            path: '/doctor/schedule',
            color: 'purple'
        },
        {
            title: 'Pacientes',
            icon: Users,
            path: '/doctor/patients',
            color: 'emerald'
        },
        {
            title: 'Perfil',
            icon: Settings,
            path: '/doctor/profile',
            color: 'gray'
        }
    ];

    const recentPatients = upcomingAppointments.slice(0, 3).map(cita => ({
        id: cita.id,
        name: `${cita.paciente?.nombres || ''} ${cita.paciente?.apellidos || ''}`.trim() || 'Paciente',
        lastVisit: new Date(cita.fechaHora).toLocaleDateString('es-ES'),
        status: cita.estado,
        avatar: (cita.paciente?.nombres?.[0] || 'P') + (cita.paciente?.apellidos?.[0] || '')
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="px-4 md:px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                Dashboard Médico
                            </h1>
                            <p className="text-gray-600">Bienvenido de vuelta, Dr. {user?.apellidos}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Hoy</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {new Date().toLocaleDateString('es-ES', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickStats.map((stat, index) => (
                        <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-50' :
                                        stat.color === 'emerald' ? 'bg-emerald-50' :
                                            stat.color === 'yellow' ? 'bg-yellow-50' :
                                                'bg-purple-50'
                                        }`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color === 'blue' ? 'text-blue-600' :
                                            stat.color === 'emerald' ? 'text-emerald-600' :
                                                stat.color === 'yellow' ? 'text-yellow-600' :
                                                    'text-purple-600'
                                            }`} />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Weekly Activity Chart */}
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <BarChart3 className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-xl font-bold text-gray-900">Actividad Semanal</h2>
                                </div>
                                <div className="flex items-end justify-between gap-2 h-48">
                                    {weeklyStats.map((stat, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                                                <div
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg transition-all hover:from-blue-700 hover:to-indigo-700"
                                                    style={{ height: `${(stat.appointments / maxAppointments) * 100}%` }}
                                                >
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-900">
                                                        {stat.appointments}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">{stat.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Acceso Rápido</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigate(action.path)}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all text-center group"
                                    >
                                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${action.color === 'blue' ? 'bg-blue-50' :
                                            action.color === 'purple' ? 'bg-purple-50' :
                                                action.color === 'emerald' ? 'bg-emerald-50' :
                                                    'bg-gray-50'
                                            }`}>
                                            <action.icon className={`w-6 h-6 ${action.color === 'blue' ? 'text-blue-600' :
                                                action.color === 'purple' ? 'text-purple-600' :
                                                    action.color === 'emerald' ? 'text-emerald-600' :
                                                        'text-gray-600'
                                                }`} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Patients */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-xl font-bold text-gray-900">Pacientes Recientes</h2>
                            </div>
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="pt-4 pb-4">
                                    {loading ? (
                                        <p className="text-center text-gray-500 py-4">Cargando...</p>
                                    ) : recentPatients.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">No hay pacientes recientes</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentPatients.map((patient) => (
                                                <div
                                                    key={patient.id}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                                            {patient.avatar}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 text-sm">{patient.name}</h4>
                                                            <p className="text-xs text-gray-600">Última visita: {patient.lastVisit}</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold">
                                                        Ver historial
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Today's Appointments */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-bold text-gray-900">Citas de Hoy</h3>
                                </div>
                                <span className="text-sm font-semibold text-blue-600">{todayAppointments.length}</span>
                            </div>
                            <div className="space-y-3">
                                {loading ? (
                                    <Card className="bg-white border border-gray-200">
                                        <CardContent className="pt-4 pb-4">
                                            <p className="text-center text-gray-500 text-sm">Cargando...</p>
                                        </CardContent>
                                    </Card>
                                ) : todayAppointments.length === 0 ? (
                                    <Card className="bg-white border border-gray-200">
                                        <CardContent className="pt-4 pb-4">
                                            <p className="text-center text-gray-500 text-sm">No hay citas para hoy</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    todayAppointments.map((cita) => (
                                        <Card key={cita.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="pt-4 pb-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 text-sm truncate">
                                                            {`${cita.paciente?.nombres || ''} ${cita.paciente?.apellidos || ''}`.trim() || 'Paciente'}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Clock className="w-3 h-3 text-gray-500" />
                                                            <span className="text-xs text-gray-600">
                                                                {new Date(cita.fechaHora).toLocaleTimeString('es-ES', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cita.estado === 'CONFIRMADA' ? 'bg-emerald-50 text-emerald-600' :
                                                                cita.estado === 'PENDIENTE' ? 'bg-yellow-50 text-yellow-600' :
                                                                    'bg-gray-50 text-gray-600'
                                                                }`}>
                                                                {cita.estado === 'CONFIRMADA' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                                {cita.estado}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Upcoming Appointments */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-purple-500" />
                                    <h3 className="text-lg font-bold text-gray-900">Próximas Citas</h3>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {upcomingAppointments.slice(0, 3).map((cita) => (
                                    <Card key={cita.id} className="bg-white border border-gray-200 shadow-sm">
                                        <CardContent className="pt-3 pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">
                                                        {`${cita.paciente?.nombres || ''} ${cita.paciente?.apellidos || ''}`.trim() || 'Paciente'}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {new Date(cita.fechaHora).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
