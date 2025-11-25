import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../api/search.service';
import type { MedicoSearchResponse } from '../../api/search.service';
import { Search, User, ChevronLeft, ChevronRight } from 'lucide-react';

// Doctores de demostración
const showcaseDoctors = [
  {
    id: 1,
    nombres: 'Dr. Carl',
    apellidos: 'Skywalker',
    email: 'carl.skywalker@medigo.com',
    rutaFoto: '/medico2.png',
    bio: 'Especialista en enfermedades cardiovasculares con más de 15 años de experiencia. Certificado por el Colegio Americano de Cardiología.',
    precioConsulta: 120,
    numeroColegiado: 'CMP-12345',
    especialidades: [{ id: 1, nombre: 'Cardiología' }],
  },
  {
    id: 2,
    nombres: 'Dra. Ana',
    apellidos: 'Rodriguez',
    email: 'ana.rodriguez@medigo.com',
    rutaFoto: '/medico1.png',
    bio: 'Pediatra dedicada al cuidado integral de niños y adolescentes. Experta en desarrollo infantil y vacunación.',
    precioConsulta: 85,
    numeroColegiado: 'CMP-23456',
    especialidades: [{ id: 2, nombre: 'Pediatría' }],
  },
  {
    id: 3,
    nombres: 'Dr. Miguel',
    apellidos: 'James Sr',
    email: 'miguel.james@medigo.com',
    rutaFoto: '/medico3.png',
    bio: 'Cirujano traumatólogo especializado en lesiones deportivas y cirugía de columna. Atención personalizada.',
    precioConsulta: 150,
    numeroColegiado: 'CMP-34567',
    especialidades: [{ id: 3, nombre: 'Traumatología' }],
  },
  {
    id: 4,
    nombres: 'Dra. Patricia',
    apellidos: 'Silva',
    email: 'patricia.silva@medigo.com',
    rutaFoto: '/medico4.png',
    bio: 'Dermatóloga con enfoque en tratamientos estéticos y dermatología clínica. Certificada internacionalmente.',
    precioConsulta: 95,
    numeroColegiado: 'CMP-45678',
    especialidades: [{ id: 4, nombre: 'Dermatología' }],
  },
  {
    id: 5,
    nombres: 'Dr. Roberto',
    apellidos: 'Vargas',
    email: 'roberto.vargas@medigo.com',
    rutaFoto: '/medico6.png',
    bio: 'Neurólogo especializado en trastornos del sistema nervioso. Experto en migrañas y epilepsia.',
    precioConsulta: 130,
    numeroColegiado: 'CMP-56789',
    especialidades: [{ id: 5, nombre: 'Neurología' }],
  },
  {
    id: 6,
    nombres: 'Dra. Laura',
    apellidos: 'Campos',
    email: 'laura.campos@medigo.com',
    rutaFoto: '/medico5.png',
    bio: 'Ginecóloga obstetra con amplia experiencia en salud reproductiva y embarazo de alto riesgo.',
    precioConsulta: 110,
    numeroColegiado: 'CMP-67890',
    especialidades: [{ id: 6, nombre: 'Ginecología' }],
  },
];

export const SearchDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<any[]>(showcaseDoctors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    number: 0,
    first: true,
    last: true,
    totalElements: 0,
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (page: number = 0) => {
    if (!searchTerm.trim()) {
      setDoctors(showcaseDoctors);
      setIsSearching(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setIsSearching(true);
      // CAMBIO: Usar tamaño 6 para probar la paginación
      const pageSize = 9;
      console.log(`Solicitando página ${page} con tamaño ${pageSize}`);

      const response = await searchService.searchMedicosByNombre(searchTerm, page, pageSize);
      console.log('Respuesta del backend:', response);

      setDoctors(response.content);
      setPageInfo({
        totalPages: response.totalPages,
        number: response.number,
        first: response.number === 0,
        last: response.number === response.totalPages - 1,
        totalElements: response.totalElements,
      });

      if (page > 0) {
        const resultsElement = document.getElementById('search-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err: any) {
      console.error('Error searching doctors:', err);
      setError('Error al buscar médicos');
      setDoctors(showcaseDoctors);
      setIsSearching(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      handleSearch(newPage);
    }
  };

  const handleDoctorClick = (doctorId: number) => {
    console.log('Doctor clicked:', doctorId, 'isSearching:', isSearching);
    // Solo bloquear los doctores de demostración cuando NO estamos buscando
    if (!isSearching) {
      const demoIds = [1, 2, 3, 4, 5, 6];
      if (demoIds.includes(doctorId)) {
        console.log('Es demo, no navegar');
        return; // No hacer nada para doctores de demostración
      }
    }
    console.log('Navegando a perfil:', doctorId);
    navigate(`/patient/doctor/${doctorId}`);
  };

  const getEspecialidadNombre = (doctor: any): string => {
    if (doctor.especialidades && doctor.especialidades.length > 0) {
      const especialidadesArray = Array.isArray(doctor.especialidades)
        ? doctor.especialidades
        : Array.from(doctor.especialidades);
      return especialidadesArray[0].nombre;
    }
    return 'No especificada';
  };

  return (
    <div className="space-y-6" id="search-results">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buscar Médicos</h1>
        <p className="mt-2 text-gray-600">Encuentra al especialista que necesitas</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o apellido..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(0)}
            />
          </div>
          <button
            onClick={() => handleSearch(0)}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {!isSearching && (
          <p className="mt-2 text-sm text-gray-500">
            Usa la búsqueda para encontrar doctores.
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Buscando médicos...</p>
        </div>
      )}

      {/* Doctors Grid */}
      {!loading && doctors.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleDoctorClick(doctor.id)}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${(isSearching || ![1, 2, 3, 4, 5, 6].includes(doctor.id)) ? 'cursor-pointer transform hover:-translate-y-1' : ''}`}
              >
                {/* Doctor Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  {doctor.rutaFoto ? (
                    <img
                      src={doctor.rutaFoto}
                      alt={`${doctor.nombres} ${doctor.apellidos}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center"><svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {doctor.nombres} {doctor.apellidos}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {getEspecialidadNombre(doctor)}
                  </p>

                  {doctor.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {doctor.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    {doctor.numeroColegiado && (
                      <div>
                        <p className="text-xs text-gray-500">Colegiado</p>
                        <p className="text-sm font-semibold text-gray-900">{doctor.numeroColegiado}</p>
                      </div>
                    )}
                    {doctor.precioConsulta && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Consulta desde</p>
                        <p className="text-lg font-bold text-blue-600">S/ {doctor.precioConsulta}</p>
                      </div>
                    )}
                  </div>

                  {/* Solo mostrar botón para doctores reales o resultados de búsqueda */}
                  {(isSearching || ![1, 2, 3, 4, 5, 6].includes(doctor.id)) && (
                    <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Ver Perfil
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {isSearching && pageInfo.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(pageInfo.number - 1)}
                disabled={pageInfo.first}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <span className="text-sm font-medium text-gray-700">
                Página {pageInfo.number + 1} de {pageInfo.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pageInfo.number + 1)}
                disabled={pageInfo.last}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && doctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No se encontraron médicos</p>
          <p className="text-gray-400 text-sm mb-4">
            Intenta con otros términos de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setDoctors(showcaseDoctors);
              setIsSearching(false);
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver doctores de demostración
          </button>
        </div>
      )}
    </div>
  );
};
