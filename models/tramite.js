const { Schema, model } = require('mongoose');

const TramiteSchema = Schema({
  tramites: [
    {
      nombre: {
        type: String,
        required: [true, "El campo nombre es requerido"],
        trim: true
      },
      valor: {
        type: String,
        trim: true,
        default: null
      }
    }
  ],
  contadorTramites: {
    type: Number,
    default: 0 // Inicialmente no hay tramites, así que el contador se inicia en 0
  },
  createAt: { type: Date, default: new Date() }
});

module.exports = model('Tramite', TramiteSchema);