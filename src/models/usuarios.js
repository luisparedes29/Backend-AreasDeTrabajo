const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
  admin: {
    type: Boolean,
    default: false,
  },
  name: {
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
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reservaciones',
    },
  ],
})

const Users = mongoose.model('Usuarios', usersSchema)

module.exports = Users
