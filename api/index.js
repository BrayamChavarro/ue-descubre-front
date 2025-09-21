// Punto de entrada para Vercel
const app = require('../server');

// Exportar como handler para Vercel
module.exports = (req, res) => {
    // Log para debugging
    console.log(`🚀 Vercel Handler: ${req.method} ${req.url}`);
    return app(req, res);
};