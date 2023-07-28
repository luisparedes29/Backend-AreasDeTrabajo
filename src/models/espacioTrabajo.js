const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workSpaceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  referenceImage: {
    type: String,
  },
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reservaciones',
    },
  ], // Referencia a las reservaciones
  timesReserved: {
    type: Number,
    default: 0,
  },
  economicPerformance: {
    type: Number,
    default: 0,
  },
})

const WorkSpace = mongoose.model('EspacioTrabajo', workSpaceSchema)

module.exports = WorkSpace
