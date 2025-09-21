const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    respuestas: [{
        preguntaId: {
            type: Number,
            required: true
        },
        categoria: {
            type: String,
            required: true
        },
        pregunta: {
            type: String,
            required: true
        },
        respuesta: {
            type: String,
            required: true
        },
        puntuacion: {
            type: Number,
            required: true
        }
    }],
    puntuaciones: [{
        archetypeId: {
            type: Number,
            required: true
        },
        puntuacion: {
            type: Number,
            required: true
        }
    }],
    resultado: {
        archetypeId: {
            type: Number,
            required: true
        },
        nombreArchetype: {
            type: String,
            required: true
        },
        programa: {
            type: String,
            required: true
        },
        compatibilidad: {
            type: Number,
            required: true
        }
    },
    fechaCompletado: {
        type: Date,
        default: Date.now
    },
    ip: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Índices para mejorar las consultas
estudianteSchema.index({ email: 1 });
estudianteSchema.index({ fechaCompletado: -1 });
estudianteSchema.index({ 'resultado.archetypeId': 1 });

module.exports = mongoose.model('Estudiante', estudianteSchema);
