import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../api/search.service';
import { Search, User, ChevronLeft, ChevronRight, Mail, DollarSign, Stethoscope, Check, ChevronDown } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { AnimatedImage } from '../../components/AnimatedImage';

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
    especialidades: [{ id: 1, nombre_especialidad: 'Cardiología' }],
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
    especialidades: [{ id: 2, nombre_especialidad: 'Pediatría' }],
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
    especialidades: [{ id: 3, nombre_especialidad: 'Traumatología' }],
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
    especialidades: [{ id: 4, nombre_especialidad: 'Dermatología' }],
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
    especialidades: [{ id: 5, nombre_especialidad: 'Neurología' }],
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
    especialidades: [{ id: 6, nombre_especialidad: 'Ginecología' }],
  },
];

type FilterType = 'name' | 'email' | 'price' | 'specialty';

export const SearchDoctors = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('name');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');

  const [allDoctors, setAllDoctors] = useState<any[]>(showcaseDoctors); // Todos los doctores disponibles
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

  // Filtrado en tiempo real usando useMemo
  const filteredDoctors = useMemo(() => {
    // Si estamos buscando en el backend, confiamos en los resultados del backend
    // y solo aplicamos filtrado local si es necesario para una experiencia más fluida
    // mientras llega la nueva respuesta del backend.

    if (activeFilter !== 'name' || !searchTerm.trim()) {
      return allDoctors;
    }

    const term = searchTerm.toLowerCase();
    return allDoctors.filter(doctor => {
      const fullName = `${doctor.nombres} ${doctor.apellidos}`.toLowerCase();
      const nombres = doctor.nombres.toLowerCase();
      const apellidos = doctor.apellidos.toLowerCase();

      // Verificamos si es un doctor de demo (ids 1-6) para filtrar localmente
      // Si son resultados del backend, generalmente ya vienen filtrados, pero esto no hace daño
      return fullName.includes(term) ||
        nombres.includes(term) ||
        apellidos.includes(term);
    });
  }, [allDoctors, searchTerm, activeFilter]);

  // Debounce para búsqueda automática
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeFilter === 'name') {
        handleSearch(0);
      }
    }, 200); // Esperar 300ms para una respuesta más rápida

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeFilter]);

  const handleSearch = async (page: number = 0) => {
    console.log('Performing search with filter:', activeFilter);
    setLoading(true);
    setError('');
    setIsSearching(true);
    const pageSize = 9;

    try {
      let response;

      switch (activeFilter) {
        case 'name':
          if (!searchTerm.trim()) {
            console.log('No search term, showing showcase doctors');
            setAllDoctors(showcaseDoctors);
            setIsSearching(false);
            setLoading(false);
            return;
          }
          console.log('Searching by name:', searchTerm);
          response = await searchService.searchMedicosByNombre(searchTerm, page, pageSize);
          break;

        case 'email':
          if (!searchEmail.trim()) {
            setError('Por favor ingrese un correo electrónico');
            setLoading(false);
            return;
          }
          console.log('Searching by email:', searchEmail);
          try {
            const medico = await searchService.getMedicoByEmail(searchEmail);
            response = {
              content: [medico],
              totalPages: 1,
              number: 0,
              totalElements: 1,
              first: true,
              last: true,
              size: pageSize
            };
          } catch (e) {
            // Si no encuentra retornamos lista vacia
            response = {
              content: [],
              totalPages: 0,
              number: 0,
              totalElements: 0,
              first: true,
              last: true,
              size: pageSize
            };
          }
          break;

        case 'price':
          if (!minPrice || !maxPrice) {
            setError('Por favor ingrese el rango de precios');
            setLoading(false);
            return;
          }
          console.log('Searching by price range:', minPrice, '-', maxPrice);
          response = await searchService.getMedicosByPrecioRange(
            Number(minPrice),
            Number(maxPrice),
            page,
            pageSize
          );
          break;

        case 'specialty':
          if (!specialtyId) {
            setError('Por favor seleccione una especialidad');
            setLoading(false);
            return;
          }
          console.log('Searching by specialty name:', specialtyId);
          response = await searchService.getMedicosByEspecialidadNombre(
            specialtyId, // Now this is the specialty name, not ID
            page,
            pageSize
          );
          break;
      }

      if (response) {
        console.log('Search results:', response.content); // Debug log
        setAllDoctors(response.content);
        setPageInfo({
          totalPages: response.totalPages,
          number: response.number,
          first: response.number === 0,
          last: response.number === response.totalPages - 1,
          totalElements: response.totalElements,
        });
      }

      if (page > 0) {
        const resultsElement = document.getElementById('search-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err: any) {
      console.error('Error searching doctors:', err);
      setError('Error al buscar médicos. Intente nuevamente.');
      setAllDoctors([]);
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
    if (!isSearching) {
      const demoIds = [1, 2, 3, 4, 5, 6];
      if (demoIds.includes(doctorId)) {
        return;
      }
    }
    navigate(`/patient/doctor/${doctorId}`);
  };

  const getEspecialidadNombre = (doctor: any): string => {
    if (doctor?.especialidades && doctor.especialidades.length > 0) {
      return doctor.especialidades[0].nombre_especialidad;
    }
    return 'No especificada';
  };

  return (
    <div className="space-y-6" id="search-results">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buscar Médicos</h1>
        <p className="mt-2 text-gray-600">Encuentra al especialista que necesitas</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
          <button
            onClick={() => { setActiveFilter('name'); setError(''); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeFilter === 'name'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Search className="w-4 h-4" />
            Nombre
          </button>
          <button
            onClick={() => { setActiveFilter('email'); setError(''); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeFilter === 'email'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Mail className="w-4 h-4" />
            Correo
          </button>
          <button
            onClick={() => { setActiveFilter('price'); setError(''); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeFilter === 'price'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <DollarSign className="w-4 h-4" />
            Precio
          </button>
          <button
            onClick={() => { setActiveFilter('specialty'); setError(''); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeFilter === 'specialty'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Stethoscope className="w-4 h-4" />
            Especialidad
          </button>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            {activeFilter === 'name' && (
              <>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o apellido..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(0)}
                />
              </>
            )}

            {activeFilter === 'email' && (
              <>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Buscar por correo electrónico..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(0)}
                />
              </>
            )}

            {activeFilter === 'price' && (
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeFilter === 'specialty' && (
              <Listbox value={specialtyId} onChange={setSpecialtyId}>
                <div className="relative w-full">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-10 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <span className={`block truncate ${!specialtyId ? 'text-gray-400' : 'text-gray-900'}`}>
                      {specialtyId || 'Seleccionar especialidad...'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as="div"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-xl bg-white py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Listbox.Option
                        value=""
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                              Seleccionar especialidad...
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>

                      {['Cardiología', 'Pediatría', 'Traumatología', 'Dermatología', 'Neurología', 'Ginecología'].map((specialty) => (
                        <Listbox.Option
                          key={specialty}
                          value={specialty}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                {specialty}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            )}
          </div>

          <button
            onClick={() => handleSearch(0)}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Buscando médicos...</p>
        </div>
      )}

      {/* Doctors Grid */}
      {!loading && filteredDoctors.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleDoctorClick(doctor.id)}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${(isSearching || ![1, 2, 3, 4, 5, 6].includes(doctor.id)) ? 'cursor-pointer transform hover:-translate-y-1' : ''}`}
              >
                {/* Doctor Image */}
                <div className="relative h-48 bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                  {doctor.rutaFoto ? (
                    <AnimatedImage
                      src={doctor.rutaFoto}
                      alt={`${doctor.nombres} ${doctor.apellidos}`}
                      className="w-full h-full object-cover"
                      fallbackSrc=""
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

                  {/* Solo mostrar botón si NO es un doctor de demostración */}
                  {(isSearching || ![1, 2, 3, 4, 5, 6].includes(doctor.id)) && (
                    <button
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      onClick={() => {
                        console.log('Navigating to doctor profile with ID:', doctor.id);
                        navigate(`/patient/doctor/${doctor.id}`);
                      }}
                    >
                      Ver Perfil
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

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

      {!loading && filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No se encontraron médicos</p>
          <p className="text-gray-400 text-sm mb-4">
            Intenta con otros términos de búsqueda
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setAllDoctors(showcaseDoctors);
              setIsSearching(false);
              setActiveFilter('name');
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
