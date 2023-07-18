const mongoose = require('mongoose')
const Schema = mongoose.Schema

const espacioTrabajoSchema = new Schema({
  descripcion: {
    type: String,
    required: true,
  },
  ubicacion: {
    latitud: {
      type: Number,
      required: true,
    },
    longitud: {
      type: Number,
      required: true,
    },
  },
  capacidad: {
    type: Number,
    required: true,
  },
  disponibilidad: {
    type: Boolean,
    default: true,
  },
  precios: {
    hora: {
      type: Number,
      required: true,
    },
    dia: {
      type: Number,
      required: true,
    },
    semana: {
      type: Number,
      required: true,
    },
  },
  reservaciones: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reservaciones',
    },
  ], // Referencia a las reservaciones
})

const EspacioTrabajo = mongoose.model('EspacioTrabajo', espacioTrabajoSchema)

module.exports = EspacioTrabajo
