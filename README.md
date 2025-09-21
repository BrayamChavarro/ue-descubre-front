# Tu Futuro Dual - Uniempresarial

Sistema de evaluación vocacional para estudiantes de Uniempresarial.

## 🚀 Despliegue en Vercel

### Variables de Entorno Requeridas

Configura las siguientes variables en tu dashboard de Vercel:

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/uempresarial?retryWrites=true&w=majority
SESSION_SECRET=tu_clave_secreta_muy_segura_aqui
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_admin
```

### Pasos para Desplegar

1. **Sube el código a GitHub**
2. **Conecta Vercel con tu repositorio**
3. **Configura las variables de entorno**
4. **Deploy automático**

### Estructura del Proyecto

```
├── server.js              # Servidor principal
├── index.html             # Página principal de evaluación
├── admin.html             # Panel de administración
├── estudiantes.html       # Gestión de estudiantes
├── estadisticas.html      # Estadísticas y gráficos
├── login.html             # Página de login
├── styles.css             # Estilos principales
├── script.js              # Lógica de evaluación
├── admin-dashboard.js     # Dashboard principal
├── estudiantes.js         # Gestión de estudiantes
├── estadisticas.js        # Estadísticas
├── configuraciones.js     # Configuraciones
└── vercel.json            # Configuración de Vercel
```

### Funcionalidades

- ✅ Evaluación vocacional interactiva
- ✅ Panel de administración
- ✅ Gestión de estudiantes
- ✅ Estadísticas y gráficos
- ✅ Exportación a Excel
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