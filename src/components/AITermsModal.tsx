import { X, AlertTriangle } from 'lucide-react';

interface AITermsModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export const AITermsModal = ({ isOpen, onAccept, onDecline }: AITermsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">Asistente de IA Médica</h2>
                        </div>
                        <button
                            onClick={onDecline}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-yellow-800 font-semibold">
                                ⚠️ IMPORTANTE: Lee cuidadosamente antes de usar
                            </p>
                        </div>

                        <div className="space-y-3 text-gray-700">
                            <h3 className="font-bold text-lg text-gray-900">¿Qué puede hacer este asistente?</h3>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Explicar términos médicos de tu historial</li>
                                <li>Aclarar información sobre diagnósticos existentes</li>
                                <li>Ayudarte a entender tus recetas médicas</li>
                                <li>Responder preguntas sobre tu historial médico</li>
                            </ul>

                            <h3 className="font-bold text-lg text-gray-900 mt-6">¿Qué NO puede hacer?</h3>
                            <ul className="list-disc list-inside space-y-2 ml-2 text-red-600">
                                <li>NO puede dar diagnósticos nuevos</li>
                                <li>NO puede recetar medicamentos</li>
                                <li>NO puede dar consejos médicos específicos</li>
                                <li>NO reemplaza la consulta con un médico profesional</li>
                            </ul>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
                                <h3 className="font-bold text-blue-900 mb-2">Límites de uso:</h3>
                                <p className="text-blue-800">
                                    • Máximo 10 consultas por hora<br />
                                    • Solo puedes consultar sobre TU historial médico<br />
                                    • Todas las consultas son registradas para auditoría
                                </p>
                            </div>

                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
                                <p className="text-red-800 font-semibold">
                                    Esta herramienta es solo educativa. Para cualquier decisión médica,
                                    SIEMPRE consulta con tu médico profesional.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onDecline}
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onAccept}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                        >
                            Acepto y Entiendo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
