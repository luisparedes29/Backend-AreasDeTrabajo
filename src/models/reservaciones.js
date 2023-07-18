const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservacionSchema = new Schema({
  usuario_id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuarios',
  },
  espacio_id: {
    typeof: Schema.Types.ObjectId,
    ref: 'EspacioTrabajo',
  },
  fecha_hora: {
    fecha: {
      type: Date,
      required: true,
    },
    hora: {
      type: Date,
      required: true,
    },
  },
  detalles: {
    type: String,
  },
})

const Reservaciones = mongoose.model('Reservaciones', reservacionSchema)

module.exports = Reservaciones
