import { Pill, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/Card';

export const PrescriptionsPage = () => {
    // Mock data for prescriptions
    const prescriptions = [
        {
            id: 1,
            medication: 'Losartán',
            dosage: '50mg',
            frequency: 'Cada 12 horas',
            doctor: 'Dr. María González',
            date: '2025-11-15',
            status: 'Activo',
            duration: '3 meses'
        },
        {
            id: 2,
            medication: 'Metformina',
            dosage: '850mg',
            frequency: 'Cada 8 horas',
            doctor: 'Dr. Carlos Ruiz',
            date: '2025-11-10',
            status: 'Activo',
            duration: 'Indefinido'
        },
        {
            id: 3,
            medication: 'Amoxicilina',
            dosage: '500mg',
            frequency: 'Cada 8 horas',
            doctor: 'Dr. Juan Pérez',
            date: '2025-10-01',
            status: 'Finalizado',
            duration: '7 días'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Pill className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Mis Recetas</h1>
                </div>

                <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                        <Card key={prescription.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{prescription.medication}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prescription.status === 'Activo'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {prescription.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 font-medium">{prescription.dosage} • {prescription.frequency}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span>Dr. {prescription.doctor}</span>
                                            <span>•</span>
                                            <span>Recetado: {new Date(prescription.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-sm text-gray-500">Duración: {prescription.duration}</span>
                                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {prescriptions.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No tienes recetas registradas</h3>
                            <p className="text-gray-500">Las recetas médicas aparecerán aquí cuando tu médico las genere.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
