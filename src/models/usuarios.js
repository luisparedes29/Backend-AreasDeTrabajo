const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuariosSchema = new Schema(
  {
    admin: {
      type: Boolean,
      default: false,
    },
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    reservaciones: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reservaciones',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Usuarios = mongoose.model('Usuarios', usuariosSchema)

module.exports = Usuarios
