# Tu Futuro Dual - Frontend

Este es el frontend de la aplicación "Tu Futuro Dual" de Uniempresarial, diseñado para ayudar a los estudiantes a descubrir su carrera ideal a través de una evaluación personalizada. **Este frontend se conecta al API externo alojado en `https://ue-descubre.vercel.app`.**

## 🚀 Características

- **Frontend estático** sin dependencias de backend local
- **Evaluación interactiva** con preguntas psicométricas
- **Resultados visuales** con gráficos de radar
- **Panel de administración** completo con estadísticas
- **Sistema de autenticación** conectado al API externo
- **Responsive design** para todos los dispositivos
- **Exportación de datos** en formato Excel
- **Interfaz moderna** con Tailwind CSS

## 📊 Tecnologías

- **HTML5**, **CSS3** y **JavaScript** puro (Vanilla JS)
- **Tailwind CSS** para estilos modernos
- **Chart.js** para visualización de datos
- **Font Awesome** para iconografía
- **API Fetch** para comunicación con el backend externo

## 🔧 Instalación y Uso Local

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd ue-descubre-frontend
```

2. Inicia un servidor HTTP local:
```bash
# Opción 1: Python 3
python3 -m http.server 8000

# Opción 2: Python 2
python -m SimpleHTTPServer 8000

# Opción 3: Node.js (si tienes http-server instalado)
npx http-server -p 8000

# Opción 4: PHP
php -S localhost:8000
```

3. Abre tu navegador en `http://localhost:8000`

## 🌐 API Externa

El frontend se conecta automáticamente al API externo:
- **Base URL**: `https://ue-descubre.vercel.app`
- **Documentación completa**: Ver archivo `FRONTEND_INTEGRATION_GUIDE.md`
- **Autenticación**: Sistema híbrido con cookies y JWT tokens
- **CORS**: Habilitado para todos los orígenes

## 📱 Páginas Disponibles

### Para Estudiantes
- `index.html` - Evaluación interactiva principal
- Flujo completo: Onboarding → Evaluación → Resultados → Registro

### Para Administradores
- `login.html` - Página de inicio de sesión
- `admin.html` - Dashboard principal con estadísticas
- `estudiantes.html` - Gestión de estudiantes registrados
- `estadisticas.html` - Estadísticas avanzadas y reportes
- `configuraciones.html` - Configuraciones del sistema

## 🔐 Sistema de Autenticación

### Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `AdminCambiar123!`

### Flujo de Autenticación
1. Login en `login.html`
2. Verificación automática de sesión
3. Redirección al panel correspondiente
4. Logout desde cualquier página administrativa

## 🏗️ Estructura del Proyecto

```
├── index.html             # Evaluación principal
├── login.html             # Login administrativo
├── admin.html             # Dashboard principal
├── estudiantes.html       # Gestión de estudiantes
├── estadisticas.html      # Estadísticas avanzadas
├── configuraciones.html   # Configuraciones
├── config.js              # Configuración del API
├── script.js              # Lógica de la evaluación
├── admin.js               # Lógica del dashboard
├── estudiantes.js         # Gestión de estudiantes
├── estadisticas.js        # Estadísticas y reportes
├── configuraciones.js     # Configuraciones
├── styles.css             # Estilos personalizados
└── FRONTEND_INTEGRATION_GUIDE.md # Guía de integración del API
```

## ⚙️ Configuración del API

El archivo `config.js` contiene toda la configuración necesaria:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://ue-descubre.vercel.app',
    ENDPOINTS: {
        HEALTH: '/api/health',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        VERIFY: '/api/auth/verify',
        ESTUDIANTES: '/api/estudiantes',
        REGISTRO_ESTUDIANTE: '/api/estudiantes/registro',
        ADMIN_STATS: '/api/admin/estadisticas'
    }
};
```

## 🚀 Despliegue

### Opción 1: Netlify
1. Conecta tu repositorio a Netlify
2. Build command: `echo "Frontend estático"`
3. Publish directory: `./`

### Opción 2: Vercel
1. Importa tu repositorio en Vercel
2. Framework preset: "Other"
3. Build command: `echo "Frontend estático"`
4. Output directory: `./`

### Opción 3: GitHub Pages
1. Activa GitHub Pages en tu repositorio
2. Selecciona la rama main
3. El sitio estará disponible automáticamente

## 📊 Funcionalidades Principales

### Evaluación de Estudiantes
- Cuestionario interactivo de múltiples categorías
- Algoritmo de puntuación por arquetipos
- Resultados visuales con compatibilidad
- Registro automático en la base de datos

### Panel Administrativo
- Dashboard con métricas en tiempo real
- Lista de estudiantes con filtros avanzados
- Estadísticas detalladas con gráficos
- Exportación de datos a Excel
- Gestión de usuarios y configuraciones

## 🔄 Migración desde Backend Local

Si estás migrando desde una versión con backend local:

1. **Archivos eliminados**:
   - `server.js` (servidor Node.js)
   - `models/` (modelos de base de datos)
   - `api/` (rutas del API)
   - `vercel.json` (configuración de Vercel para Node.js)

2. **Archivos modificados**:
   - Todos los archivos JavaScript actualizados para usar API externo
   - Todos los archivos HTML con referencias a `config.js`
   - `package.json` simplificado para frontend

3. **Configuración automática**:
   - El script `update_api_calls.sh` automatizó la migración
   - Backups disponibles con extensión `.backup`

## 🐛 Solución de Problemas

### Error de CORS
Si tienes problemas de CORS, verifica que el API externo esté funcionando:
```javascript
// Probar conectividad
fetch('https://ue-descubre.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('API Status:', data));
```

### Problemas de Autenticación
1. Verifica las credenciales: `admin` / `AdminCambiar123!`
2. Limpia cookies del navegador
3. Verifica la conectividad al API externo

### Datos No Se Guardan
1. Abre las herramientas de desarrollador (F12)
2. Revisa la consola por errores
3. Verifica la pestaña Network por llamadas fallidas

## 📞 Soporte

Para soporte técnico o consultas:
1. Revisa la documentación en `FRONTEND_INTEGRATION_GUIDE.md`
2. Verifica los logs en la consola del navegador
3. Contacta al equipo de desarrollo de Uniempresarial

---

**Frontend desarrollado con ❤️ para Uniempresarial**  
**Conectado al API: https://ue-descubre.vercel.app**