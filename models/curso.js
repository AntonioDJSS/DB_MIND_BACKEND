const { Schema, model } = require('mongoose');

const BloqueSchema = new Schema({
    nombreModulo: {
        type: String,
        required: [true, 'El nombre del módulo es obligatorio']
    },
    imagen: {
        type: String,
        required: [true, 'La imagen del módulo es obligatoria']
    },
    bloqueIntroduccion: {
        texto: {
            type: String,
            required: [true, 'El texto de introducción es obligatorio']
        },
        codigo: {
            type: String,
            required: [true, 'El código de introducción es obligatorio']
        }
    },
    bloqueDesarrollo: {
        texto: {
            type: String,
            required: [true, 'El texto de desarrollo es obligatorio']
        },
        codigo: {
            type: String,
            required: [true, 'El código de desarrollo es obligatorio']
        }
    },
    bloqueFinal: {
        texto: {
            type: String,
            required: [true, 'El texto de final es obligatorio']
        },
        codigo: {
            type: String,
            required: [true, 'El código de final es obligatorio']
        }
    }
});

const CursoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es obligatoria']
    },
    modulo1: BloqueSchema,
    modulo2: BloqueSchema,
    modulo3: BloqueSchema,
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Middleware para actualizar la fecha de última modificación
CursoSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Ahora, puedes crear el modelo usando este esquema
module.exports = model('Curso', CursoSchema);
