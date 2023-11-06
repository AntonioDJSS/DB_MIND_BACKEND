const { Schema, model } = require('mongoose');

const RespuestaSchema = Schema({
    respuesta01: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    respuesta02: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    respuesta03: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    respuesta04: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    respuesta05: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: [true, 'El Usuario es requerido para la creación del proyecto'],
    },
    curso: {
        type: String,
        required: [true, 'El Curso es requerido para la creación del proyecto'],
        ref: 'Evaluacion'
    },
    calificacion: {
        type: String,
        default: "",
    },
    evaluacion:{
        type: Object,
        default: "",
    },
    createAt: {
        type: Date,
        default: Date.now // Utiliza Date.now como valor predeterminado
      },
});

module.exports = model('Respuesta', RespuestaSchema);
