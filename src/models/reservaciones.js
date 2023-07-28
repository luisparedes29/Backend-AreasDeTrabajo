const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
  },
  spaceId: {
    type: Schema.Types.ObjectId,
    ref: 'EspacioTrabajo',
    required: true,
  },
  startAndEndDate: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  startAndEndTime: {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  details: {
    type: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
})

const Reservations = mongoose.model('Reservaciones', reservationSchema)

module.exports = Reservations
