import { useState } from 'react';

const showcaseDoctors = [
  {
    id: 1,
    image: '/medico2.png',
    nombre: 'Dr. Carl Skywalker',
    especialidad: 'Cardiología',
    bio: 'Especialista en enfermedades cardiovasculares con más de 15 años de experiencia. Certificado por el Colegio Americano de Cardiología.',
    precio: 120,
    experiencia: 15
  },
  {
    id: 2,
    image: '/medico1.png',
    nombre: 'Dra. Ana Rodriguez',
    especialidad: 'Pediatría',
    bio: 'Pediatra dedicada al cuidado integral de niños y adolescentes. Experta en desarrollo infantil y vacunación.',
    precio: 85,
    experiencia: 10
  },
  {
    id: 3,
    image: '/medico3.png',
    nombre: 'Dr. Miguel James Sr',
    especialidad: 'Traumatología',
    bio: 'Cirujano traumatólogo especializado en lesiones deportivas y cirugía de columna. Atención personalizada.',
    precio: 150,
    experiencia: 18
  },
  {
    id: 4,
    image: '/medico4.png',
    nombre: 'Dra. Patricia Silva',
    especialidad: 'Dermatología',
    bio: 'Dermatóloga con enfoque en tratamientos estéticos y dermatología clínica. Certificada internacionalmente.',
    precio: 95,
    experiencia: 12
  },
  {
    id: 5,
    image: '/medico6.png',
    nombre: 'Dr. Roberto Vargas',
    especialidad: 'Neurología',
    bio: 'Neurólogo especializado en trastornos del sistema nervioso. Experto en migrañas y epilepsia.',
    precio: 130,
    experiencia: 20
  },
  {
    id: 6,
    image: '/medico5.png',
    nombre: 'Dra. Laura Campos',
    especialidad: 'Ginecología',
    bio: 'Ginecóloga obstetra con amplia experiencia en salud reproductiva y embarazo de alto riesgo.',
    precio: 110,
    experiencia: 14
  }
];

export const SearchDoctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(showcaseDoctors);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(showcaseDoctors);
      return;
    }

    const filtered = showcaseDoctors.filter(doctor =>
      doctor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buscar Médicos</h1>
        <p className="mt-2 text-gray-600">Encuentra al especialista que necesitas</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Doctors Showcase Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Doctor Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
              <img
                src={doctor.image}
                alt={doctor.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Doctor';
                }}
              />
            </div>

            {/* Doctor Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {doctor.nombre}
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                {doctor.especialidad}
              </p>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {doctor.bio}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Experiencia</p>
                  <p className="text-sm font-semibold text-gray-900">{doctor.experiencia} años</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Consulta desde</p>
                  <p className="text-lg font-bold text-blue-600">S/ {doctor.precio}</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Agendar Cita
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No se encontraron médicos</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilteredDoctors(showcaseDoctors);
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos los médicos
          </button>
        </div>
      )}
    </div>
  );
};
