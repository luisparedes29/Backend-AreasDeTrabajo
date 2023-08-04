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
  .delete('/eliminarReservacion/:reservacionId', eliminarReservacion)

// Rutas para el esquema de reservaciones Swagger
/**
 * @openapi
 * components:
 *   schemas:
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
 */

// Endpoints documentados correspondiente a las reservaciones Swagger
/**
 * @openapi
 * /reservaciones:
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
 * /reservaciones/{espacioId}:
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
 *         description: Error del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example:  Hubo un problema al obtener las reservaciones.
 */

/**
 * @openapi
 * /obtenerReservacionesPorUsuario/{usuarioId}:
 *   get:
 *     tags:
 *       - Reservaciones
 *     summary: Obtener reservaciones por usuario.
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve las reservaciones del usuario.
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
 *         description: Error del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Hubo un problema al obtener las reservaciones
 */

/**
 * @openapi
 * /reservaciones/nuevaReservacion/{espacioId}/{usuarioId}:
 *   post:
 *     tags:
 *       - Reservaciones
 *     summary: Crear una nueva reservación.
 *     parameters:
 *       - in: path
 *         name: espacioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del espacio de trabajo.
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: 2022-01-01
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: 2022-01-05
 *               horaInicio:
 *                 type: string
 *                 format: date
 *                 example: 14:00
 *               horaFin:
 *                 type: string
 *                 format: date
 *                 example: 16:00
 *               detalles:
 *                 type: string
 *             required:
 *               - fechaInicio
 *               - fechaFin
 *     responses:
 *       '201':
 *         description: Reservación creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 reservacion:
 *                   $ref: '#/components/schemas/Reservaciones'
 *       '400':
 *         description: Alguna de las fechas ya está reservada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *       '404':
 *         description: Espacio de trabajo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *       '500':
 *         description: Error del servidor. Hubo un problema al crear la reservación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 */

/**
 * @openapi
 * /reservaciones/eliminarReservacion/{reservacionId}:
 *   delete:
 *     tags:
 *       - Reservaciones
 *     summary: Eliminar una reservación.
 *     parameters:
 *       - in: path
 *         name: reservacionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reservación.
 *     responses:
 *       '200':
 *         description: Reservación eliminada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 _id:
 *                   type: string
 *                   description: ID de la reservación eliminada.
 *       '404':
 *         description: Reservación no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *       '500':
 *         description: Error del servidor. Hubo un problema al eliminar la reservación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 */

/**
 * @openapi
 * /espaciosTrabajo/buscar/:
 *   post:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Buscar espacios de trabajo por palabra clave.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               palabraClave:
 *                 type: string
 *             example:
 *               palabraClave: "oficina"
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve los espacios de trabajo que coinciden con la palabra clave.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EspacioTrabajo'
 *       '400':
 *         description: Solicitud incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: No se proporcionó una palabra clave.
 *       '500':
 *         description: Error del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Hubo un problema al buscar los espacios de trabajo.
 */

module.exports = router
