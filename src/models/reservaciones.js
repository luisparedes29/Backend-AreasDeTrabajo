const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservacionSchema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  },
  espacioId: {
    type: Schema.Types.ObjectId,
    ref: 'EspacioTrabajo',
    required: true,
  },
  fechaInicioYFinal: {
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
  },
  horaInicioYFinal: {
    horaInicio: {
      type: Date,
      required: true,
    },
    horaFin: {
      type: Date,
      required: true,
    },
  },
  detalles: {
    type: String,
  },
  precioTotal: {
    type: Number,
    required: true,
  },
})

const Reservaciones = mongoose.model('Reservaciones', reservacionSchema)

module.exports = Reservaciones
