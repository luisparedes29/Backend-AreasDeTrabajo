const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

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
 *               ubicacion:
 *                 type: string
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
 *               imagen:
 *                 type: string
 *                 format: binary
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               precioDia:
 *                 type: number
 *               imagenReferencia:
 *                 type: string
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

const {
  obtenerSeisEspaciosTrabajo,
  obtenerEspaciosTrabajo,
  obtenerEspaciosTrabajoMapa,
  nuevoEspacioTrabajo,
  editarEspacioTrabajo,
  eliminarEspacioTrabajo,
} = require('./controllers/espaciosTrabajoControllers')

router
  .get('/', obtenerEspaciosTrabajo)
  .get('/mapa', obtenerEspaciosTrabajoMapa)
  .get('/inicio', obtenerSeisEspaciosTrabajo)
  .post('/nuevo', upload.single('imagenReferencia'), nuevoEspacioTrabajo)
  .put(
    '/editar/:espacioId',
    upload.single('imagenReferencia'),
    editarEspacioTrabajo
  )
  .delete('/eliminar/:espacioId', eliminarEspacioTrabajo)

module.exports = router
