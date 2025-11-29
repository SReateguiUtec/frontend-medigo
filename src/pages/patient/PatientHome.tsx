import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/Card';

export const PatientHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const quickStats = [
        {
            label: 'Consultas este mes',
            value: '3',
            change: '+2',
            icon: Activity,
            color: 'blue'
        },
        {
            label: 'Adherencia tratamiento',
            value: '92%',
            change: '+5%',
            icon: CheckCircle,
            color: 'emerald'
        },
        {
            label: 'Próximas citas',
            value: '2',
            change: '0',
            icon: Calendar,
            color: 'purple'
        }
    ];

    const healthMetrics = [
        {
            label: 'Presión Arterial',
            value: '120/80',
            unit: 'mmHg',
            change: '+2%',
            icon: Heart,
            status: 'Normal'
        },
        {
            label: 'Peso',
            value: '72',
            unit: 'kg',
            change: '-1.5%',
            icon: Weight,
            status: 'Normal'
        },
        {
            label: 'Glucosa',
            value: '95',
            unit: 'mg/dL',
            change: '0%',
            icon: Droplet,
            status: 'Normal'
        },
        {
            label: 'Frecuencia Cardíaca',
            value: '72',
            unit: 'bpm',
            change: '+3%',
            icon: Zap,
            status: 'Normal'
        }
    ];

    const upcomingAppointments = [
        {
            id: 1,
            doctor: 'Dr. María González',
            specialty: 'Cardiología',
            date: '2025-12-05',
            time: '10:00 AM',
            avatar: 'MG',
            color: 'blue'
        },
        {
            id: 2,
            doctor: 'Dr. Carlos Ruiz',
            specialty: 'Pediatría',
            date: '2025-12-10',
            time: '3:30 PM',
            avatar: 'CR',
            color: 'purple'
        }
    ];

    const alerts = [
        {
            id: 1,
            message: 'Vacuna contra la influenza pendiente',
            dueDate: '14 dic',
            priority: 'high'
        },
        {
            id: 2,
            message: 'Examen de sangre de rutina',
            dueDate: '19 dic',
            priority: 'medium'
        }
    ];

    const activeMedications = [
        {
            id: 1,
            name: 'Losartán',
            dosage: '50mg',
            frequency: 'Cada 12 horas',
            nextDose: '2:00 PM'
        },
        {
            id: 2,
            name: 'Metformina',
            dosage: '850mg',
            frequency: 'Cada 8 horas',
            nextDose: '6:00 PM'
        }
    ];

    const quickActions = [
        {
            title: 'Buscar Médico',
            icon: Search,
            path: '/patient/search',
            color: 'blue'
        },
        {
            title: 'Chat MediGIA',
            icon: MessageSquare,
            path: '/patient/ai-chat',
            color: 'purple'
        },
        {
            title: 'Mi Historial',
            icon: FileText,
            path: '/patient/historial-medico',
            color: 'emerald'
        },
        {
            title: 'Mis Recetas',
            icon: Pill,
            path: '/patient/prescriptions',
            color: 'orange'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                Dashboard
                            </h1>
                            <p className="text-gray-600">Bienvenido de vuelta a tu dashboard, {user?.nombres}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-12">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {quickStats.map((stat, index) => (
                        <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-50' :
                                        stat.color === 'emerald' ? 'bg-emerald-50' :
                                            'bg-purple-50'
                                        }`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color === 'blue' ? 'text-blue-600' :
                                            stat.color === 'emerald' ? 'text-emerald-600' :
                                                'text-purple-600'
                                            }`} />
                                    </div>
                                    {stat.change !== '0' && (
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {stat.change}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Health Dashboard */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="w-5 h-5 text-red-500" />
                                <h2 className="text-xl font-bold text-gray-900">Dashboard de Salud</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {healthMetrics.map((metric, index) => (
                                    <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="pt-5 pb-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.label === 'Presión Arterial' ? 'bg-red-50' :
                                                    metric.label === 'Peso' ? 'bg-blue-50' :
                                                        metric.label === 'Glucosa' ? 'bg-purple-50' :
                                                            'bg-orange-50'
                                                    }`}>
                                                    <metric.icon className={`w-6 h-6 ${metric.label === 'Presión Arterial' ? 'text-red-600' :
                                                        metric.label === 'Peso' ? 'text-blue-600' :
                                                            metric.label === 'Glucosa' ? 'text-purple-600' :
                                                                'text-orange-600'
                                                        }`} />
                                                </div>
                                                <span className="text-xs text-gray-500">{metric.change}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                                                <span className="text-sm text-gray-500">{metric.unit}</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                                                <CheckCircle className="w-3 h-3" />
                                                {metric.status}
                                            </span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Acceso Rápido</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            console.log('Navigating to:', action.path);
                                            navigate(action.path);
                                        }}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all text-center group"
                                    >
                                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${action.color === 'blue' ? 'bg-blue-50' :
                                            action.color === 'purple' ? 'bg-purple-50' :
                                                action.color === 'emerald' ? 'bg-emerald-50' :
                                                    'bg-orange-50'
                                            }`}>
                                            <action.icon className={`w-6 h-6 ${action.color === 'blue' ? 'text-blue-600' :
                                                action.color === 'purple' ? 'text-purple-600' :
                                                    action.color === 'emerald' ? 'text-emerald-600' :
                                                        'text-orange-600'
                                                }`} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Medications */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Pill className="w-5 h-5 text-pink-500" />
                                <h2 className="text-xl font-bold text-gray-900">Medicamentos Activos</h2>
                            </div>
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="pt-4 pb-4">
                                    <div className="space-y-3">
                                        {activeMedications.map((med, index) => (
                                            <div
                                                key={med.id}
                                                className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 ${index !== activeMedications.length - 1 ? 'border-b border-gray-100' : ''}`}
                                            >
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">{med.name}</h4>
                                                    <p className="text-xs text-gray-600">{med.dosage} • {med.frequency}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 mb-1">Próxima dosis</p>
                                                    <span className="text-sm font-semibold text-blue-600">{med.nextDose}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Alerts */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Bell className="w-5 h-5 text-orange-500" />
                                <h3 className="text-lg font-bold text-gray-900">Alertas Importantes</h3>
                            </div>
                            <div className="space-y-3">
                                {alerts.map((alert) => (
                                    <Card key={alert.id} className={`border-l-4 ${alert.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
                                        <CardContent className="pt-4 pb-4">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                                                    <p className="text-xs text-gray-600 mt-1">Vence: {alert.dueDate}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Appointments */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-bold text-gray-900">Próximas Citas</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/patient/search')}
                                    className="text-blue-600 hover:text-blue-700 font-semibold text-xs"
                                >
                                    + Nueva
                                </button>
                            </div>
                            <div className="space-y-3">
                                {upcomingAppointments.map((appointment) => (
                                    <Card key={appointment.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="pt-4 pb-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-12 h-12 rounded-full bg-${appointment.color}-100 flex items-center justify-center text-${appointment.color}-700 font-bold text-sm shrink-0`}>
                                                    {appointment.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 text-sm truncate">{appointment.doctor}</h4>
                                                    <p className="text-xs text-gray-600 mb-2">{appointment.specialty}</p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(appointment.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {appointment.time}
                                                        </span>
                                                    </div>
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
