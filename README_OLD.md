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
- ✅ Autenticación segura
- ✅ Base de datos MongoDB

### Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: Express Session, bcryptjs
- **Gráficos**: Chart.js
- **Exportación**: XLSX

### Acceso

- **Evaluación**: `https://tu-dominio.vercel.app/`
- **Admin**: `https://tu-dominio.vercel.app/admin`
- **Login**: `https://tu-dominio.vercel.app/admin/login`

### Credenciales por Defecto

- **Usuario**: admin
- **Contraseña**: (configurar en variables de entorno)