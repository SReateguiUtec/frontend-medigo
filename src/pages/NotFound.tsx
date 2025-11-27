import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Number */}
                <h1 className="text-[120px] font-bold text-gray-900 leading-none mb-4">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Página no encontrada
                </h2>
                <p className="text-gray-600 mb-8">
                    La página que buscas no existe o ha sido movida.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        <Home className="w-4 h-4" />
                        Ir al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};
