require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://root:12345@clusterclientessedes.udohouw.mongodb.net/uempresarial?retryWrites=true&w=majority',
    DB_NAME: process.env.DB_NAME || 'uempresarial',
    SESSION_SECRET: process.env.SESSION_SECRET || 'tu_clave_secreta_muy_segura_aqui',
    NODE_ENV: process.env.NODE_ENV || 'development',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123'
};