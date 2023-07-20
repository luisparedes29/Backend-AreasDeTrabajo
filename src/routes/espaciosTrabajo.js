const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

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
  .post('/nuevo', upload.single('imagenReferencia'), nuevoEspacioTrabajo)
  .put('/editar/:espacioId', upload.single('imagenReferencia'), editarEspacioTrabajo)
  .delete('/eliminar/:espacioId', eliminarEspacioTrabajo)

module.exports = router
