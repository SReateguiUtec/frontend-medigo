import { Users, Calendar, Shield, Activity } from 'lucide-react';
import { DashboardHeader, StatCard, DashboardPanel, DashboardSection } from '@/components/dashboard';

export const AdminDashboard = () => {
    const stats = [
        { label: 'Usuarios activos', value: '—', icon: Users },
        { label: 'Citas del mes', value: '—', icon: Calendar },
        { label: 'Médicos registrados', value: '—', icon: Shield },
        { label: 'Actividad del sistema', value: 'Estable', icon: Activity },
    ];

    return (
        <div>
            <DashboardHeader
                title="Administración"
                subtitle="Panel de control de MediGO · Sección en desarrollo"
            />

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <DashboardSection
                title="Bienvenido"
                description="Herramientas de gestión próximamente"
            >
                <DashboardPanel>
                    <p className="text-sm leading-relaxed text-slate-600">
                        Este panel centralizará la gestión de usuarios, citas, reportes y configuración
                        de la plataforma. Mientras tanto, puedes navegar con el menú lateral.
                    </p>
                </DashboardPanel>
            </DashboardSection>
        </div>
    );
};
