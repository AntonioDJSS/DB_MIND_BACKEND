const { Schema, model } = require('mongoose');

const OpcionSchema = Schema({
    texto: {
        type: String,
        required: [true, 'El texto de la opción es obligatorio']
    }
});

const PreguntaSchema = Schema({
    pregunta: {
        type: String,
        required: [true, 'El texto de la pregunta es obligatorio']
    },
    opciones: [OpcionSchema],
    respuestaCorrecta: {
        type: String,
        required: [true, 'La respuesta correcta es obligatoria']
    }
});

const EvaluacionSchema = Schema({
    cursoID: {
        type: String,
        required: [true, 'El ID del curso es obligatorio']
    },
    preguntas: [PreguntaSchema],
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
EvaluacionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Crear el modelo 'Curso' basado en el esquema
module.exports = model('Evaluacion', EvaluacionSchema);

