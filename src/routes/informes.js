const express = require('express')
const router = express.Router()
const InformeRendimientoEconomicoYTendencias = require('./controllers/informesControllers')
const validateToken = require('./controllers/jwtAuth')

router.get('/', validateToken, InformeRendimientoEconomicoYTendencias)

module.exports = router
