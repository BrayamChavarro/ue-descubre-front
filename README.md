# Tu Futuro Dual - Uniempresarial

Sistema de evaluación vocacional para estudiantes de Uniempresarial que recomienda programas académicos basado en un test psicométrico.

## 🚀 Características

- **Evaluación Interactiva**: Test de 15 preguntas con diferentes categorías (intereses, personalidad, habilidades, motivaciones)
- **Algoritmo de Recomendación**: Sistema de puntuación que asigna arquetipos profesionales
- **Visualización de Resultados**: Gráfico radar interactivo con Chart.js
- **Base de Datos**: Almacenamiento en MongoDB con información detallada de cada evaluación
- **Panel de Administración**: Dashboard completo para visualizar estadísticas y respuestas

## 📋 Requisitos

- Node.js (versión 14 o superior)
- MongoDB Atlas (o MongoDB local)
- Navegador web moderno

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd ue-descubre
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - El proyecto ya está configurado para usar MongoDB Atlas
   - La conexión se encuentra en `config.js`
   - Base de datos: `uempresarial`
   - Colección: `posibles-estudiantes`

4. **Iniciar el servidor**
   ```bash
   npm start
   ```
   
   Para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

## 🌐 Acceso

- **Aplicación Principal**: http://localhost:3000
- **Panel de Administración**: http://localhost:3000/admin
- **Login de Administración**: http://localhost:3000/admin/login

### 🔐 Credenciales de Administrador

**Usuario inicial creado automáticamente:**
- **Username**: `admin`
- **Email**: `admin@uniempresarial.edu.co`
- **Password**: `admin123`

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer login por seguridad.

## 📊 Estructura del Proyecto

```
ue-descubre/
├── index.html          # Aplicación principal
├── admin.html          # Panel de administración
├── login.html          # Página de login
├── styles.css          # Estilos CSS
├── script.js           # Lógica de la aplicación
├── admin.js            # Lógica del panel de admin
├── server.js           # Servidor Express
├── config.js           # Configuración de la base de datos
├── createAdmin.js      # Script para crear usuario admin
├── models/
│   ├── Estudiante.js   # Modelo de datos MongoDB
│   └── Admin.js        # Modelo de administradores
├── package.json        # Dependencias del proyecto
└── README.md          # Este archivo
```

## 🎯 Flujo de la Aplicación

1. **Onboarding**: El usuario ingresa su nombre
2. **Evaluación**: 15 preguntas categorizadas en:
   - Brújula de Intereses (3 preguntas)
   - Blueprint de Personalidad (5 preguntas)
   - Inventario de Habilidades (4 preguntas)
   - Motor de Motivación (3 preguntas)
3. **Cálculo**: Sistema de puntuación asigna arquetipos
4. **Resultados**: Visualización del perfil y programa recomendado
5. **Formulario**: Captura de email y teléfono
6. **Almacenamiento**: Datos guardados en MongoDB

## 🏛️ Arquetipos y Programas

| ID | Arquetipo | Programa |
|----|-----------|----------|
| 0 | El Líder Estratégico | Administración de Empresas |
| 1 | El Analista de Riesgos Globales | Finanzas y Comercio Exterior |
| 2 | El Conector Multicultural | Negocios Internacionales |
| 3 | El Innovador Centrado en el Usuario | Diseño de Producto |
| 4 | El Estratega de Crecimiento Digital | Marketing |
| 5 | El Optimizador de Sistemas | Ingeniería Industrial |
| 6 | El Arquitecto de Soluciones Digitales | Ingeniería de Software |
| 7 | El Impulsor de Ventas | Tecnología en Gestión Comercial |
| 8 | El Maestro de la Eficiencia | Tecnología en Producción Industrial |
| 9 | El Desarrollador de Potencial | Tecnología en Gestión del Talento Humano |

## 📈 Panel de Administración

El panel de administración incluye:

- **Estadísticas Generales**: Total de estudiantes, actividad reciente
- **Gráfico de Distribución**: Distribución por programa
- **Filtros Avanzados**: Por programa, fechas
- **Lista de Estudiantes**: Con paginación
- **Detalles Completos**: Información personal, respuestas, puntuaciones

## 🔐 Sistema de Autenticación

El panel de administración está protegido con un sistema de autenticación robusto:

### **Características de Seguridad:**
- ✅ **Sesiones seguras** con cookies HttpOnly
- ✅ **Rate limiting** (máximo 5 intentos por 15 minutos)
- ✅ **Bloqueo de cuenta** después de 5 intentos fallidos
- ✅ **Contraseñas hasheadas** con bcrypt
- ✅ **Verificación de sesión** en cada petición

### **Endpoints de Autenticación:**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión  
- `GET /api/auth/verify` - Verificar sesión activa

### **Crear Nuevos Administradores:**
```bash
# Ejecutar el script para crear un admin
node createAdmin.js
```

## 🔧 API Endpoints

### POST /api/estudiantes
Guarda un nuevo estudiante con sus respuestas y resultados.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "respuestas": [...],
  "puntuaciones": [...],
  "resultado": {...}
}
```

### GET /api/estudiantes
Obtiene la lista de estudiantes con filtros y paginación.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20)
- `archetype`: ID del arquetipo para filtrar
- `fechaDesde`: Fecha de inicio (YYYY-MM-DD)
- `fechaHasta`: Fecha de fin (YYYY-MM-DD)

### GET /api/estadisticas
Obtiene estadísticas generales del sistema.

### GET /api/estudiantes/:id
Obtiene los detalles completos de un estudiante específico.

## 🗄️ Estructura de la Base de Datos

### Colección: posibles-estudiantes

```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String,
  telefono: String,
  respuestas: [{
    preguntaId: Number,
    categoria: String,
    pregunta: String,
    respuesta: String,
    puntuacion: Number
  }],
  puntuaciones: [{
    archetypeId: Number,
    puntuacion: Number
  }],
  resultado: {
    archetypeId: Number,
    nombreArchetype: String,
    programa: String,
    compatibilidad: Number
  },
  fechaCompletado: Date,
  ip: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Despliegue

Para desplegar en producción:

1. **Configurar variables de entorno**:
   - `MONGODB_URI`: URL de conexión a MongoDB
   - `PORT`: Puerto del servidor (default: 3000)

2. **Instalar dependencias de producción**:
   ```bash
   npm install --production
   ```

3. **Iniciar el servidor**:
   ```bash
   npm start
   ```

## 📝 Notas de Desarrollo

- El frontend está separado en archivos HTML, CSS y JS independientes
- Se usa Tailwind CSS para el diseño
- Chart.js para visualizaciones
- Express.js para el backend
- Mongoose para la conexión a MongoDB

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
