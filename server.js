const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const Estudiante = require('./models/Estudiante');
const Admin = require('./models/Admin');

const app = express();
const PORT = config.PORT || 3000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Servir archivos estáticos PRIMERO (antes de cualquier otra configuración)
app.use(express.static('.', {
    setHeaders: (res, path) => {
        console.log('📁 Sirviendo archivo estático:', path);
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
            console.log('✅ JavaScript detectado, MIME type establecido');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// Middleware para debuggear solicitudes de archivos JS
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        console.log('🔍 Solicitud de archivo JS:', req.path);
        console.log('🔍 Método:', req.method);
        console.log('🔍 Headers:', req.headers);
    }
    next();
});

// Configuración de sesiones optimizada para Vercel
app.use(session({
    secret: config.SESSION_SECRET || 'tu-futuro-dual-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.NODE_ENV === 'production', // true en producción con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax'
    },
    // Para Vercel, usar configuración más compatible
    proxy: config.NODE_ENV === 'production',
    name: 'sessionId'
}));

// Rate limiting para login optimizado para Vercel
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos por IP
    message: {
        success: false,
        message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Configuración específica para Vercel
    trustProxy: config.NODE_ENV === 'production',
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
});

// Middleware de autenticación
const requireAuth = (req, res, next) => {
    if (req.session && req.session.adminId) {
        return next();
    } else {
        // Si es una ruta HTML, redirigir al login
        if (req.path.startsWith('/admin') && !req.path.includes('/api/')) {
            return res.redirect('/admin/login');
        }
        // Si es una ruta API, devolver JSON
        return res.status(401).json({
            success: false,
            message: 'Acceso no autorizado'
        });
    }
};

// Conectar a MongoDB con manejo optimizado para Vercel
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        console.log('📊 Reutilizando conexión existente a MongoDB');
        return;
    }
    
    try {
        await mongoose.connect(config.MONGODB_URI, {
            dbName: config.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            bufferCommands: false // Deshabilitar buffering para serverless
        });
        
        isConnected = true;
        console.log('✅ Conectado a MongoDB exitosamente');
        console.log('📊 Base de datos:', config.DB_NAME);
        console.log('🌍 Entorno:', config.NODE_ENV);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        console.error('🔗 URI utilizada:', config.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
        throw error;
    }
};

// Middleware para asegurar conexión a la base de datos en cada request
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error de conexión a la base de datos'
        });
    }
});

// Manejar desconexiones
mongoose.connection.on('disconnected', () => {
    console.log('📊 MongoDB desconectado');
    isConnected = false;
});

// Middleware de logging para debugging en Vercel
app.use((req, res, next) => {
    console.log(`📊 ${req.method} ${req.path} - IP: ${req.ip}`);
    console.log(`📊 User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
    next();
});

// Rutas de la API

// === RUTAS DE AUTENTICACIÓN ===

// Login
app.post('/api/auth/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username y password son requeridos'
            });
        }

        // Buscar el admin
        const admin = await Admin.findOne({ 
            $or: [
                { username: username },
                { email: username }
            ],
            isActive: true
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si la cuenta está bloqueada
        if (admin.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Cuenta bloqueada por demasiados intentos fallidos. Intenta de nuevo más tarde.'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            // Incrementar intentos fallidos
            await admin.incLoginAttempts();
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Resetear intentos fallidos
        await admin.resetLoginAttempts();

        // Actualizar último login
        admin.lastLogin = new Date();
        await admin.save();

        // Crear sesión
        req.session.adminId = admin._id;
        req.session.adminUsername = admin.username;
        req.session.adminRole = admin.role;

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                username: admin.username,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al cerrar sesión'
            });
        }
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    });
});

// Verificar sesión
app.get('/api/auth/verify', (req, res) => {
    if (req.session && req.session.adminId) {
        res.json({
            success: true,
            authenticated: true,
            data: {
                username: req.session.adminUsername,
                role: req.session.adminRole
            }
        });
    } else {
        res.json({
            success: true,
            authenticated: false
        });
    }
});

// === RUTAS PROTEGIDAS ===

// Guardar resultados de la evaluación (público - sin autenticación)
app.post('/api/estudiantes/registro', async (req, res) => {
    try {
        const {
            nombre,
            email,
            telefono,
            respuestas,
            puntuaciones,
            resultado
        } = req.body;

        // Validar datos requeridos
        if (!nombre || !email || !telefono || !resultado) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }

        // Crear nuevo estudiante
        const nuevoEstudiante = new Estudiante({
            nombre,
            email,
            telefono,
            respuestas: respuestas || [],
            puntuaciones: puntuaciones || [],
            resultado,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        const estudianteGuardado = await nuevoEstudiante.save();

        res.status(201).json({
            success: true,
            message: 'Estudiante registrado exitosamente',
            data: {
                id: estudianteGuardado._id,
                nombre: estudianteGuardado.nombre,
                resultado: estudianteGuardado.resultado
            }
        });

    } catch (error) {
        console.error('Error guardando estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Obtener todos los estudiantes (para el panel de admin)
app.get('/api/estudiantes', requireAuth, async (req, res) => {
    try {
        console.log('📊 Solicitando lista de estudiantes...');
        const { page = 1, limit = 20, archetype, fechaDesde, fechaHasta } = req.query;
        console.log('🔍 Parámetros recibidos:', { page, limit, archetype, fechaDesde, fechaHasta });
        
        // Construir filtros
        const filtros = {};
        
        if (archetype) {
            filtros['resultado.archetypeId'] = parseInt(archetype);
        }
        
        if (fechaDesde || fechaHasta) {
            filtros.fechaCompletado = {};
            if (fechaDesde) {
                filtros.fechaCompletado.$gte = new Date(fechaDesde);
            }
            if (fechaHasta) {
                filtros.fechaCompletado.$lte = new Date(fechaHasta);
            }
        }

        const estudiantes = await Estudiante.find(filtros)
            .sort({ fechaCompletado: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await Estudiante.countDocuments(filtros);

        console.log('📊 Resultados de la consulta:');
        console.log('   - Estudiantes encontrados:', estudiantes.length);
        console.log('   - Total en la base de datos:', total);
        console.log('   - Página actual:', page);
        console.log('   - Límite por página:', limit);

        res.json({
            success: true,
            data: estudiantes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error obteniendo estudiantes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Obtener estadísticas
app.get('/api/estadisticas', requireAuth, async (req, res) => {
    try {
        const totalEstudiantes = await Estudiante.countDocuments();
        
        // Estadísticas por arquetipo
        const estadisticasArchetype = await Estudiante.aggregate([
            {
                $group: {
                    _id: '$resultado.archetypeId',
                    nombre: { $first: '$resultado.nombreArchetype' },
                    programa: { $first: '$resultado.programa' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Estadísticas por fecha (últimos 30 días)
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 30);
        
        const estudiantesUltimos30Dias = await Estudiante.countDocuments({
            fechaCompletado: { $gte: fechaLimite }
        });

        res.json({
            success: true,
            data: {
                totalEstudiantes,
                estudiantesUltimos30Dias,
                estadisticasArchetype
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Obtener un estudiante específico
app.get('/api/estudiantes/:id', requireAuth, async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.params.id);
        
        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        res.json({
            success: true,
            data: estudiante
        });

    } catch (error) {
        console.error('Error obteniendo estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Eliminar un estudiante específico
app.delete('/api/estudiantes/:id', requireAuth, async (req, res) => {
    try {
        console.log('🗑️ Eliminando estudiante con ID:', req.params.id);
        
        const estudiante = await Estudiante.findById(req.params.id);
        
        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        // Eliminar el estudiante
        await Estudiante.findByIdAndDelete(req.params.id);
        
        console.log('✅ Estudiante eliminado exitosamente:', estudiante.nombre);

        res.json({
            success: true,
            message: 'Estudiante eliminado exitosamente',
            data: {
                id: req.params.id,
                nombre: estudiante.nombre
            }
        });

    } catch (error) {
        console.error('Error eliminando estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// ==================== CONFIGURACIONES SIMPLIFICADAS ====================
// Los endpoints de gestión de administradores han sido removidos

// Ruta para servir el panel de administración
app.get('/admin', (req, res) => {
    console.log('📊 Acceso a /admin - Verificando autenticación');
    console.log('📊 Sesión presente:', !!req.session);
    console.log('📊 Admin ID en sesión:', req.session?.adminId);
    
    // Verificar autenticación antes de servir el panel
    if (req.session && req.session.adminId) {
        console.log('📊 Usuario autenticado, sirviendo panel admin');
        res.sendFile(path.join(__dirname, 'admin.html'));
    } else {
        console.log('📊 Usuario no autenticado, redirigiendo a login');
        // Redirigir al login si no está autenticado
        res.redirect('/admin/login');
    }
});

app.get('/admin/estudiantes', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'estudiantes.html'));
});

app.get('/admin/estadisticas', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'estadisticas.html'));
});

app.get('/admin/configuraciones', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'configuraciones.html'));
});

// Ruta para servir la página de login
app.get('/admin/login', (req, res) => {
    console.log('📊 Acceso a /admin/login - Sirviendo página de login');
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Ruta principal - servir la aplicación principal
app.get('/', (req, res) => {
    console.log('📊 Acceso a / - Sirviendo página principal');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor solo en desarrollo local
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        console.log(`📊 Panel de administración: http://localhost:${PORT}/admin`);
    });
}

// Exportar la aplicación para Vercel
module.exports = app;
