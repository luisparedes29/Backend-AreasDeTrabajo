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

/**
 * @openapi
 * components:
 *   schemas:
 *     Usuarios:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         admin:
 *           type: boolean
 *           example: false
 *         nombre:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: password123
 *         reservaciones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reservaciones'
 *
 *     Reservaciones:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a5f4998efc06921c887e72
 *         usuarioId:
 *           $ref: '#/components/schemas/Usuarios'
 *         espacioId:
 *           $ref: '#/components/schemas/EspacioTrabajo'
 *         validacionFechasReservacion:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *             example: 2022-01-01
 *         fechaInicioYFinal:
 *           type: object
 *           properties:
 *             fechaInicio:
 *               type: string
 *               format: date
 *               example: 2022-01-01
 *             fechaFin:
 *               type: string
 *               format: date
 *               example: 2022-01-05
 *         detalles:
 *           type: string
 *         precioTotal:
 *           type: number
 *           example: 500.00
 *
 *     EspacioTrabajo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         descripcion:
 *           type: string
 *           example: Espacio de trabajo acogedor
 *         ubicacion:
 *           type: object
 *           properties:
 *             latitud:
 *               type: number
 *               example: 37.7749
 *             longitud:
 *               type: number
 *               example: -122.4194
 *         capacidad:
 *           type: number
 *           example: 10
 *         precioDia:
 *           type: number
 *           example: 50.0
 *         reservaciones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reservaciones'
 *         vecesReservado:
 *           type: number
 *           example: 3
 *         rendimientoEconomico:
 *           type: number
 *           example: 150.0
 */

/**
 * @openapi
 * /obtenerReservaciones:
 *   get:
 *     tags:
 *       - Reservaciones
 *     summary: Obtener todas las reservaciones y sus datos de espacio de trabajo.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve todas las reservaciones con sus datos de espacio de trabajo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 reservaciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservaciones'
 *       '500':
 *         description: Error del servidor. Hubo un problema al obtener las reservaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                   example: false
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Hubo un problema al obtener las reservaciones
 */

/**
 * @openapi
 * /obtenerReservacionesPorEspacio/{espacioId}:
 *   get:
 *     tags:
 *       - Reservaciones
 *     summary: Obtener reservaciones por espacio de trabajo.
 *     parameters:
 *       - in: path
 *         name: espacioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del espacio de trabajo.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve las reservaciones del espacio de trabajo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 reservaciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservaciones'
 *       '500':
 *         description: Error del servidor. Hubo un problema al obtener las reservaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 */

module.exports = router
