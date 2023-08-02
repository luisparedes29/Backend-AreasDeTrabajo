const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const {
  obtenerSeisEspaciosTrabajo,
  obtenerEspacioTrabajoID,
  obtenerEspaciosTrabajo,
  obtenerEspaciosTrabajoMapa,
  nuevoEspacioTrabajo,
  editarEspacioTrabajo,
  eliminarEspacioTrabajo,
  searchEspaciosTrabajo
} = require('./controllers/espaciosTrabajoControllers')
const validateToken = require('./controllers/jwtAuth')

router
  .get('/', obtenerEspaciosTrabajo)
  .get('/buscar/:espacioId', obtenerEspacioTrabajoID)
  .get('/mapa', obtenerEspaciosTrabajoMapa)
  .get('/espacios', obtenerSeisEspaciosTrabajo)
  .post('/nuevo', validateToken, upload.single('imagenReferencia'), nuevoEspacioTrabajo)
  .put(
    '/editar/:espacioId',
    validateToken,
    upload.single('imagenReferencia'),
    editarEspacioTrabajo
  )
  .delete('/eliminar/:espacioId', validateToken, eliminarEspacioTrabajo)
  .get('/buscar/', searchEspaciosTrabajo)


// Esquema de espacios de trabajo Swagger
/**
 * @openapi
 * components:
 *   schemas:
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
 *         imagenReferencia:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/dhdm4ter5/image/upload/v1689835829/jkwprgjszmehbqa9g8nx.jpg
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



// Endpoints documentados de los espacios de trabajo Swagger
/**
 * @openapi
 * /espaciosTrabajo/:
 *   get:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Obtener espacios de trabajo paginados.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de espacios de trabajo por página
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve los espacios de trabajo paginados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 espaciosTrabajo:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EspacioTrabajo'
 *                 ConteoTotal:
 *                   type: integer
 *                   description: Cantidad total de espacios de trabajo.
 *                 currentPagina:
 *                   type: integer
 *                   description: Número de página actual.
 *                 paginasTotal:
 *                   type: integer
 *                   description: Cantidad total de páginas.
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
 *                   example:  Hubo un problema al obtener los espacios de trabajo.
 *
 * 
 * 
 * /espaciosTrabajo/{espacioId}:
 *   get:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Obtener un espacio de trabajo por su ID.
 *     parameters:
 *       - in: path
 *         name: espacioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del espacio de trabajo a obtener.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve el espacio de trabajo solicitado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 espacioTrabajo:
 *                   $ref: '#/components/schemas/EspacioTrabajo'
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
 *                   example: ID no válido.
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
 *                   example: Hubo un error al obtener el espacio de trabajo.
 * 
 * 
 * /espaciosTrabajo/espacios:
 *   get:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Obtener seis espacios de trabajo.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve los seis espacios de trabajo solicitados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 espaciosTrabajo:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EspacioTrabajo'
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
 *                   example: Hubo un error al obtener los espacios de trabajo.
 * 
 * /espaciosTrabajo/mapa:
 *   get:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Obtener espacios de trabajo para mostrar en un mapa.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve los espacios de trabajo para mostrar en un mapa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 espaciosTrabajo:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EspacioTrabajo'
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
 *                   example: Hubo un error al obtener los espacios de trabajo para el mapa.
 * 
 * /espaciosTrabajo/nuevo:
 *   post:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Crear un nuevo espacio de trabajo.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion[latitud]:
 *                 type: number
  *               ubicacion[longitud]:
 *                 type: number
 *               capacidad:
 *                 type: integer
 *               precioDia:
 *                 type: number
 *               direccion:
 *                 type: string
 *               imagenReferencia:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve el nuevo espacio de trabajo creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 EspacioTrabajo:
 *                   $ref: '#/components/schemas/EspacioTrabajo'
 *       '400':
 *         description: Solicitud incorrecta. Puede haber problemas con los datos enviados o el nombre del espacio de trabajo ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Ya existe un espacio de trabajo con ese nombre
 *       '500':
 *         description: Error del servidor. Hubo un problema al crear el espacio de trabajo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Hubo un error al crear el espacio de trabajo
 *
 * /espaciosTrabajo/editar/{espacioId}:
 *   put:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Editar un espacio de trabajo existente.
 *     parameters:
 *       - in: path
 *         name: espacioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del espacio de trabajo a editar.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion[latitud]:
 *                 type: number
  *               ubicacion[longitud]:
 *                 type: number
 *               capacidad:
 *                 type: integer
 *               precioDia:
 *                 type: number
 *               imagenReferencia:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Devuelve el espacio de trabajo editado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                   example: Espacio de trabajo editado
 *                 espacioTrabajo:
 *                   $ref: '#/components/schemas/EspacioTrabajo'
 *       '400':
 *         description: Solicitud incorrecta. Puede haber problemas con los datos enviados o no se encontró el espacio de trabajo con el ID proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: No se encontró el espacio de trabajo con el ID proporcionado.
 *       '500':
 *         description: Error del servidor. Hubo un problema al editar el espacio de trabajo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Hubo un error al editar el espacio de trabajo.
 *
 * /espaciosTrabajo/eliminar/{espacioId}:
 *   delete:
 *     tags:
 *       - Espacios de Trabajo
 *     summary: Eliminar un espacio de trabajo.
 *     parameters:
 *       - in: path
 *         name: espacioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del espacio de trabajo a eliminar.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa. Indica que el espacio de trabajo fue eliminado correctamente.
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
 *                   description: ID del espacio de trabajo eliminado.
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                   example: Espacio de trabajo eliminado.
 *       '400':
 *         description: Solicitud incorrecta. Puede haber problemas al eliminar el espacio de trabajo o no se encontró el espacio de trabajo con el ID proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Hubo un error al eliminar el espacio de trabajo.
 *       '500':
 *         description: Error del servidor. Hubo un problema al eliminar el espacio de trabajo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de error.
 *                   example: Hubo un error al eliminar el espacio de trabajo.
 */





module.exports = router
