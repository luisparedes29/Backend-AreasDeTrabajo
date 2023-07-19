const express = require('express')
const router = express.Router()
const {
  obtenerReservaciones,
  obtenerReservacionesPorEspacio,
  obtenerReservacionesPorUsuario,
  nuevaReservacion,
  eliminarReservacion,
} = require('./controllers/reservacionesControllers')

/* GET home page. */
router
  .get('/', obtenerReservaciones)
  .get('/:espacioId', obtenerReservacionesPorEspacio)
  .get('/:usuarioId', obtenerReservacionesPorUsuario)
  .post('/nuevaReservacion/:espacioId/:usuarioId', nuevaReservacion)
  .delete('/eliminarReservacion/:espacioId', eliminarReservacion)

module.exports = router
