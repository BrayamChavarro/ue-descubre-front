const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const config = require('./config');

async function createAdmin() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(config.MONGODB_URI, {
            dbName: config.DB_NAME
        });
        
        console.log('✅ Conectado a MongoDB');
        
        // Verificar si ya existe un admin
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('⚠️ El usuario administrador ya existe');
            console.log('Username: admin');
            console.log('Email: admin@uniempresarial.edu.co');
            return;
        }
        
        // Crear el administrador inicial
        const admin = new Admin({
            username: 'admin',
            email: 'admin@uniempresarial.edu.co',
            password: 'admin123', // Se hasheará automáticamente
            role: 'super_admin'
        });
        
        await admin.save();
        
        console.log('✅ Usuario administrador creado exitosamente');
        console.log('Username: admin');
        console.log('Email: admin@uniempresarial.edu.co');
        console.log('Password: admin123');
        console.log('');
        console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer login');
        
    } catch (error) {
        console.error('❌ Error creando administrador:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    createAdmin();
}

module.exports = createAdmin;
