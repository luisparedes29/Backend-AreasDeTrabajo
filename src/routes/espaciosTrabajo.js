const express = require('express')
const router = express.Router()
const {
  obtenerEspaciosTrabajo,
  obtenerEspaciosTrabajoMapa,
  nuevoEspacioTrabajo,
  editarEspacioTrabajo,
  eliminarEspacioTrabajo,
} = require('./controllers/espaciosTrabajoControllers')

router
  .get('/', obtenerEspaciosTrabajo)
  .get('/mapa', obtenerEspaciosTrabajoMapa)
  .post('/nuevo', nuevoEspacioTrabajo)
  .put('/editar/:espacioId', editarEspacioTrabajo)
  .delete('/eliminar/:espacioId', eliminarEspacioTrabajo)

module.exports = router
