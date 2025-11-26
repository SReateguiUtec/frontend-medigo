# 🏥 MediGo - Plataforma de Telemedicina

**MediGo** es una plataforma web moderna que conecta pacientes con médicos profesionales a través de la tecnología, facilitando consultas médicas en línea, gestión de citas y seguimiento de historiales médicos.

![MediGo](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.2-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-cyan)

## Características Principales


### Para Pacientes 👥
- 🔍 **Búsqueda Avanzada de Médicos** - Filtra por especialidad, precio, nombre o email
- 📅 **Gestión de Citas** - Agenda, visualiza y cancela citas médicas
- 📋 **Historial Médico** - Accede a tu historial médico completo
- 💳 **Pagos Seguros** - Procesamiento de pagos mediante Stripe
- 🎥 **Videollamadas** - Consultas médicas por videollamada integrada
- 👤 **Perfil Personalizado** - Gestiona tu información personal

### Para Médicos 👨‍⚕️
- 📊 **Dashboard Profesional** - Vista general de citas y pacientes
- 📝 **Gestión de Historiales** - Crea y actualiza historiales médicos
- 🗓️ **Calendario de Citas** - Visualiza y gestiona tus citas
- 💰 **Configuración de Precios** - Define el precio de tus consultas
- 🎓 **Perfil Profesional** - Muestra tu especialidad y experiencia
- 🎥 **Sala de Videollamadas** - Atiende consultas virtuales


## 🚀 Tecnologías Utilizadas

### Frontend Framework
- **React 19.2.0** - Biblioteca de UI moderna
- **TypeScript 5.9.3** - Tipado estático para JavaScript
- **Vite 7.2.2** - Build tool ultra rápido

### Styling & UI
- **TailwindCSS 4.1.17** - Framework CSS utility-first
- **Motion (Framer Motion) 12.23.24** - Animaciones fluidas
- **Headless UI 2.2.9** - Componentes accesibles sin estilos
- **Lucide React** - Iconos modernos

### Componentes UI Premium
- **Aceternity UI** - Componentes animados (Lamp, WorldMap, etc.)
- **Radix UI** - Primitivos de UI accesibles
- **Embla Carousel** - Carruseles responsivos

### State Management & Routing
- **React Router DOM 7.9.6** - Enrutamiento del lado del cliente
- **Context API** - Gestión de estado global (AuthContext)

### HTTP Client
- **Axios 1.13.2** - Cliente HTTP con interceptores


## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- Vite
- TailwindCSS
- React 19.2.0
- TypeScript 5.9.3
- Axios 1.13.2
- React Router DOM 7.9.6

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/medigo-frontend.git
cd medigo-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar el backend**
Asegúrate de que el backend esté corriendo en `http://localhost:8080`

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5001`

## 🏗️ Estructura del Proyecto

```
medigo-frontend/
├── src/
│   ├── api/                    # Servicios API
│   │   ├── axios.config.ts     # Configuración de Axios
│   │   ├── auth.service.ts     # Autenticación
│   │   ├── cita.service.ts     # Gestión de citas
│   │   ├── profile.service.ts  # Perfiles de usuario
│   │   └── ...
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes UI base
│   │   ├── NavbarDemo.tsx      # Barra de navegación
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── Sidebar.tsx         # Menú lateral
│   │   └── ...
│   ├── context/                # Context API
│   │   └── AuthContext.tsx     # Contexto de autenticación
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── auth/               # Login y registro
│   │   ├── patient/            # Páginas de pacientes
│   │   ├── doctor/             # Páginas de médicos
│   │   └── Home.tsx            # Página principal
│   ├── types/                  # Definiciones TypeScript
│   │   └── index.ts            # Tipos globales
│   ├── lib/                    # Utilidades
│   │   ├── jwt.ts              # Manejo de JWT
│   │   └── utils.ts            # Funciones auxiliares
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Punto de entrada
│   └── index.css               # Estilos globales
├── public/                     # Archivos estáticos
├── vite.config.ts              # Configuración de Vite
├── tailwind.config.js          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias del proyecto
```


## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación:

- Los tokens se almacenan en `localStorage`
- Axios interceptors añaden automáticamente el token a las peticiones
- Refresh token automático cuando expira el access token
- Redirección automática al login si la sesión expira

### Roles de Usuario
- **PACIENTE** - Acceso a búsqueda de médicos, citas y perfil
- **MEDICO** - Acceso a gestión de citas, historiales y perfil profesional


## 🎨 Características de UI/UX

### Diseño Moderno
- ✨ Animaciones suaves con Framer Motion
- 📱 Diseño completamente responsive
- 🎭 Efectos visuales premium (glassmorphism, gradientes)


## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Preview del build de producción

# Linting
npm run lint         # Ejecuta ESLint
```


## 🌐 Configuración del Proxy

El proyecto usa un proxy de Vite para el desarrollo:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

Esto permite hacer peticiones a `/api/*` que se redirigen automáticamente al backend.

## 📝 Endpoints Principales

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signup/paciente` - Registro de paciente
- `POST /api/auth/signup/medico` - Registro de médico

### Perfil
- `GET /api/profile/me` - Obtener perfil actual
- `PATCH /api/profile/me` - Actualizar perfil

### Citas
- `GET /api/citas/my-appointments` - Mis citas
- `POST /api/citas` - Crear cita
- `PATCH /api/citas/{id}/cancel` - Cancelar cita

### Búsqueda
- `GET /api/search/medicos` - Buscar médicos
- `GET /api/search/medicos/especialidad/{nombre}` - Por especialidad

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👥 Equipo

Desarrollado por estudiantes de **Ciencias de la Computación - UTEC**
| Nombre | Código |
|--------|--------|
|   Sebastian Hernan Reategui Bellido     |   202410048     |
|   Juan Diego Mejia Armas     |    202410271    |

## 📈 UI Components & Libraries

- [Aceternity UI](https://ui.aceternity.com/) - Componentes UI premium
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Headless UI](https://headlessui.com/) - Componentes accesibles
- [Lucide Icons](https://lucide.dev/) - Iconos modernos

---

**MediGO** - Conectando pacientes y médicos a través de la tecnología 🚀
