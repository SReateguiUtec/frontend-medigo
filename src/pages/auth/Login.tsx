import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Heart, Bell, Zap, Activity } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.rol === 'PACIENTE') {
          navigate('/patient/search');
        } else if (userData.rol === 'MEDICO') {
          navigate('/doctor/appointments');
        } else if (userData.rol === 'ADMIN') {
          navigate('/admin');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Notificaciones en Tiempo Real',
      description: 'Recibe actualizaciones instantáneas sobre tus citas'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Salud en Tus Manos',
      description: 'Gestiona tu bienestar con herramientas diseñadas para ti'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Atención Rápida',
      description: 'Conecta con médicos en menos de 20 minutos'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Gradient with Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>

          <div className="mb-12">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Bienvenido a MediGO
            </h1>
            <p className="text-xl text-white/90">
              Accede a tu cuenta y gestiona tu salud de manera rápida y segura
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="relative z-10 flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
        </div>
      </div>

      {/* Right Panel - Dark Form */}
      <div className="w-full lg:w-1/2 bg-gray-950 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile back button */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>

          {/* Logo for mobile */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MediGO</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h2>
            <p className="text-gray-400">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tu.correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <div className="text-center">
              <span className="text-gray-400">¿No tienes una cuenta? </span>
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Regístrate aquí
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
