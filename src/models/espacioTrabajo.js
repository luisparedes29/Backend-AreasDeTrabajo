const mongoose = require('mongoose')
const Schema = mongoose.Schema

const espacioTrabajoSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
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
  precioDia: {
    type: Number,
    required: true,
  },
  imagenReferencia: {
    type: String,
  },
  reservaciones: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reservaciones',
    },
  ], // Referencia a las reservaciones
  vecesReservado: {
    type: Number,
    default: 0,
  },
  rendimientoEconomico: {
    type: Number,
    default: 0,
  },
})

const EspacioTrabajo = mongoose.model('EspacioTrabajo', espacioTrabajoSchema)

module.exports = EspacioTrabajo
