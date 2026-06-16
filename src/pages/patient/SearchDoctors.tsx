import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../api/search.service';
import { Search, User, ChevronLeft, ChevronRight, Mail, DollarSign, Stethoscope, Check, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { AnimatedImage } from '../../components/AnimatedImage';
import { DashboardHeader } from '@/components/dashboard';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/utils/url.helper';

const showcaseDoctors = [
  { id: 1, nombres: 'Dr. Carl', apellidos: 'Skywalker', email: 'carl.skywalker@medigo.com', rutaFoto: '/medico2.png', bio: 'Especialista en enfermedades cardiovasculares con más de 15 años de experiencia. Certificado por el Colegio Americano de Cardiología.', precioConsulta: 120, numeroColegiado: 'CMP-12345', especialidades: [{ id: 1, nombre_especialidad: 'Cardiología' }] },
  { id: 2, nombres: 'Dra. Ana', apellidos: 'Rodriguez', email: 'ana.rodriguez@medigo.com', rutaFoto: '/medico1.png', bio: 'Pediatra dedicada al cuidado integral de niños y adolescentes. Experta en desarrollo infantil y vacunación.', precioConsulta: 85, numeroColegiado: 'CMP-23456', especialidades: [{ id: 2, nombre_especialidad: 'Pediatría' }] },
  { id: 3, nombres: 'Dr. Miguel', apellidos: 'James Sr', email: 'miguel.james@medigo.com', rutaFoto: '/medico3.png', bio: 'Cirujano traumatólogo especializado en lesiones deportivas y cirugía de columna. Atención personalizada.', precioConsulta: 150, numeroColegiado: 'CMP-34567', especialidades: [{ id: 3, nombre_especialidad: 'Traumatología' }] },
  { id: 4, nombres: 'Dra. Patricia', apellidos: 'Silva', email: 'patricia.silva@medigo.com', rutaFoto: '/medico4.png', bio: 'Dermatóloga con enfoque en tratamientos estéticos y dermatología clínica. Certificada internacionalmente.', precioConsulta: 95, numeroColegiado: 'CMP-45678', especialidades: [{ id: 4, nombre_especialidad: 'Dermatología' }] },
  { id: 5, nombres: 'Dr. Roberto', apellidos: 'Vargas', email: 'roberto.vargas@medigo.com', rutaFoto: '/medico6.png', bio: 'Neurólogo especializado en trastornos del sistema nervioso. Experto en migrañas y epilepsia.', precioConsulta: 130, numeroColegiado: 'CMP-56789', especialidades: [{ id: 5, nombre_especialidad: 'Neurología' }] },
  { id: 6, nombres: 'Dra. Laura', apellidos: 'Campos', email: 'laura.campos@medigo.com', rutaFoto: '/medico5.png', bio: 'Ginecóloga obstetra con amplia experiencia en salud reproductiva y embarazo de alto riesgo.', precioConsulta: 110, numeroColegiado: 'CMP-67890', especialidades: [{ id: 6, nombre_especialidad: 'Ginecología' }] },
];

const SPECIALTIES = ['Cardiología', 'Pediatría', 'Traumatología', 'Dermatología', 'Neurología', 'Ginecología', 'Oftalmología', 'Psiquiatría'];

type FilterType = 'name' | 'email' | 'price' | 'specialty';

const filterTabs: { id: FilterType; label: string; icon: typeof Search }[] = [
  { id: 'name', label: 'Nombre', icon: Search },
  { id: 'email', label: 'Correo', icon: Mail },
  { id: 'price', label: 'Precio', icon: DollarSign },
  { id: 'specialty', label: 'Especialidad', icon: Stethoscope },
];

export const SearchDoctors = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [allDoctors, setAllDoctors] = useState<any[]>(showcaseDoctors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, number: 0, first: true, last: true, totalElements: 0 });
  const [isSearching, setIsSearching] = useState(false);

  const filteredDoctors = useMemo(() => {
    if (activeFilter !== 'name' || !searchTerm.trim()) return allDoctors;
    const term = searchTerm.toLowerCase();
    return allDoctors.filter((doctor) => {
      const fullName = `${doctor.nombres} ${doctor.apellidos}`.toLowerCase();
      return fullName.includes(term) || doctor.nombres.toLowerCase().includes(term) || doctor.apellidos.toLowerCase().includes(term);
    });
  }, [allDoctors, searchTerm, activeFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (activeFilter === 'name') handleSearch(0);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, activeFilter]);

  const handleSearch = async (page = 0) => {
    setLoading(true);
    setError('');
    setIsSearching(true);
    const pageSize = 9;
    try {
      let response: any;
      switch (activeFilter) {
        case 'name':
          if (!searchTerm.trim()) { setAllDoctors(showcaseDoctors); setIsSearching(false); setLoading(false); return; }
          response = await searchService.searchMedicosByNombre(searchTerm, page, pageSize);
          break;
        case 'email':
          if (!searchEmail.trim()) { setError('Ingresa un correo electrónico'); setLoading(false); return; }
          try {
            const medico = await searchService.getMedicoByEmail(searchEmail);
            response = { content: [medico], totalPages: 1, number: 0, totalElements: 1, first: true, last: true };
          } catch { response = { content: [], totalPages: 0, number: 0, totalElements: 0, first: true, last: true }; }
          break;
        case 'price':
          if (!minPrice || !maxPrice) { setError('Ingresa el rango de precios'); setLoading(false); return; }
          response = await searchService.getMedicosByPrecioRange(Number(minPrice), Number(maxPrice), page, pageSize);
          break;
        case 'specialty':
          if (!specialtyId) { setError('Selecciona una especialidad'); setLoading(false); return; }
          response = await searchService.getMedicosByEspecialidadNombre(specialtyId, page, pageSize);
          break;
      }
      if (response) {
        setAllDoctors(response.content);
        setPageInfo({ totalPages: response.totalPages, number: response.number, first: response.number === 0, last: response.number === response.totalPages - 1, totalElements: response.totalElements });
      }
      if (page > 0) document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      setError('Error al buscar médicos. Intenta nuevamente.');
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) handleSearch(newPage);
  };

  const handleDoctorClick = (doctorId: number) => {
    if (!isSearching && [1, 2, 3, 4, 5, 6].includes(doctorId)) return;
    navigate(`/patient/doctor/${doctorId}`);
  };

  const getEspecialidad = (doctor: any) =>
    doctor?.especialidades?.[0]?.nombre_especialidad ?? 'Especialista';

  const isDemo = (id: number) => !isSearching && [1, 2, 3, 4, 5, 6].includes(id);

  return (
    <div id="search-results">
      <DashboardHeader
        title="Buscar médicos"
        subtitle="Encuentra al especialista que necesitas y agenda tu consulta"
      />

      {/* Search toolbar */}
      <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 border-b border-slate-100 px-3 pb-1 pt-1">
          {filterTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setActiveFilter(id); setError(''); }}
              className={cn(
                'inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                activeFilter === id
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="relative flex-1">
            {activeFilter === 'name' && (
              <>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o apellido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(0)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  autoComplete="off"
                />
              </>
            )}
            {activeFilter === 'email' && (
              <>
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(0)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  autoComplete="email"
                />
              </>
            )}
            {activeFilter === 'price' && (
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">S/</span>
                  <input type="number" placeholder="Mínimo" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2" />
                </div>
                <span className="text-slate-300">—</span>
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">S/</span>
                  <input type="number" placeholder="Máximo" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2" />
                </div>
              </div>
            )}
            {activeFilter === 'specialty' && (
              <Listbox value={specialtyId} onChange={setSpecialtyId}>
                <div className="relative">
                  <Listbox.Button className="relative flex min-h-[44px] w-full cursor-pointer items-center rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    <Stethoscope className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
                    <span className={specialtyId ? 'text-slate-900' : 'text-slate-400'}>
                      {specialtyId || 'Seleccionar especialidad...'}
                    </span>
                    <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
                  </Listbox.Button>
                  <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200/80 bg-white py-1 shadow-lg focus:outline-none">
                      <Listbox.Option value="" className={({ active }) => cn('relative cursor-pointer py-2.5 pl-10 pr-4 text-sm', active ? 'bg-blue-50 text-blue-900' : 'text-slate-600')}>
                        {({ selected }) => (<><span className={selected ? 'font-semibold' : ''}>Todas las especialidades</span>{selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-700"><Check className="h-4 w-4" /></span>}</>)}
                      </Listbox.Option>
                      {SPECIALTIES.map((s) => (
                        <Listbox.Option key={s} value={s} className={({ active }) => cn('relative cursor-pointer py-2.5 pl-10 pr-4 text-sm', active ? 'bg-blue-50 text-blue-900' : 'text-slate-900')}>
                          {({ selected }) => (<><span className={selected ? 'font-semibold' : ''}>{s}</span>{selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-700"><Check className="h-4 w-4" /></span>}</>)}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSearch(0)}
            disabled={loading}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" strokeWidth={2} />}
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-2xl border border-rose-200/80 bg-rose-50/80 px-4 py-3.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Results label */}
      {!loading && isSearching && (
        <p className="mb-4 text-sm text-slate-500">
          {filteredDoctors.length === 0 ? 'Sin resultados' : `${pageInfo.totalElements} médico${pageInfo.totalElements !== 1 ? 's' : ''} encontrado${pageInfo.totalElements !== 1 ? 's' : ''}`}
        </p>
      )}
      {!loading && !isSearching && (
        <p className="mb-4 text-sm font-medium tracking-wide text-slate-400 uppercase">
          Médicos destacados
        </p>
      )}

      {/* Doctors grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : filteredDoctors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => {
              const especialidad = getEspecialidad(doctor);
              const demo = isDemo(doctor.id);
              const photoSrc = doctor.rutaFoto?.startsWith('/')
                ? doctor.rutaFoto
                : doctor.rutaFoto
                  ? getImageUrl(doctor.rutaFoto)
                  : null;

              return (
                <article
                  key={doctor.id}
                  onClick={() => handleDoctorClick(doctor.id)}
                  className={cn(
                    'group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200',
                    !demo && 'cursor-pointer hover:border-blue-200/80 hover:shadow-[0_8px_32px_rgba(15,118,110,0.10)]'
                  )}
                >
                  {/* Photo */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {photoSrc ? (
                      <AnimatedImage
                        src={photoSrc}
                        alt={`${doctor.nombres} ${doctor.apellidos}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        fallbackSrc=""
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-700 to-blue-800">
                        <User className="h-14 w-14 text-white/60" strokeWidth={1} />
                      </div>
                    )}
                    {/* Specialty pill over image */}
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-900 backdrop-blur-sm ring-1 ring-blue-100/80 shadow-sm">
                        {especialidad}
                      </span>
                    </div>
                    {/* Price pill */}
                    {doctor.precioConsulta && (
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-blue-700/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-sm">
                          S/ {doctor.precioConsulta}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-slate-900">
                      {doctor.nombres} {doctor.apellidos}
                    </h3>
                    {doctor.numeroColegiado && (
                      <p className="mt-0.5 text-xs text-slate-400">{doctor.numeroColegiado}</p>
                    )}
                    {doctor.bio && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {doctor.bio}
                      </p>
                    )}
                    {!demo && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/patient/doctor/${doctor.id}`); }}
                        className="mt-4 inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50/50 group-hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      >
                        Ver perfil
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {isSearching && pageInfo.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handlePageChange(pageInfo.number - 1)}
                disabled={pageInfo.first}
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-slate-600">
                {pageInfo.number + 1} / {pageInfo.totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(pageInfo.number + 1)}
                disabled={pageInfo.last}
                className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <User className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">Sin resultados</h3>
          <p className="mt-2 max-w-xs text-sm text-slate-500">Intenta con otros términos o cambia el filtro de búsqueda</p>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setAllDoctors(showcaseDoctors); setIsSearching(false); setActiveFilter('name'); }}
            className="mt-6 cursor-pointer text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
          >
            Ver médicos destacados
          </button>
        </div>
      )}
    </div>
  );
};
