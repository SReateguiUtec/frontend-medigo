export const PatientAppointments = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
                <p className="mt-2 text-gray-600">Gestiona tus citas médicas</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">No tienes citas programadas.</p>
                <p className="mt-2 text-sm text-gray-400">
                    Busca médicos para agendar tu primera cita.
                </p>
            </div>
        </div>
    );
};
