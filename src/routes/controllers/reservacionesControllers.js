const Reservaciones = require('../../models/reservaciones')
const EspacioTrabajo = require('../../models/espacioTrabajo')
const moment = require('moment')
const Usuarios = require('../../models/usuarios')
const transporter = require('./mailer')
const mailGenerator = require('./mail')

const obtenerReservaciones = async (req, res) => {
  try {
    // Obtener todas las reservaciones y sus datos de espacio de trabajo
    const reservaciones = await Reservaciones.find()
      .populate({
        path: 'usuarioId',
        select: 'nombre email',
      }) // Trae los datos del usuario relacionado
      .populate({
        path: 'espacioId',
        select: 'titulo descripcion direccion capacidad precioDia',
      }) // Trae los datos del espacio de trabajo relacionado
      .select('-__v')
      .sort({
        sort: -1,
      })

    return res.status(200).json({ ok: true, reservaciones: reservaciones })
  } catch (error) {
    console.error('Error al obtener reservaciones:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al obtener las reservaciones.' })
  }
}

const obtenerReservacionesPorEspacio = async (req, res) => {
  try {
    const espacioId = req.params.espacioId

    // Obtener las reservaciones del espacio de trabajo especificado y realizar el populate
    const reservaciones = await Reservaciones.find({ espacioId })
      .populate('espacioId')
      .populate('usuarioId')

    return res.status(200).json({ ok: true, reservaciones: reservaciones })
  } catch (error) {
    console.error(
      'Error al obtener las reservaciones por espacio de trabajo:',
      error
    )
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al obtener las reservaciones.' })
  }
}

const obtenerReservacionesPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId

    // Obtener las reservaciones realizadas por el usuario especificado y realizar el populate
    const reservaciones = await Reservaciones.find({ usuarioId }).populate(
      'espacioId'
    )

    return res.status(200).json({ ok: true, reservaciones: reservaciones })
  } catch (error) {
    console.error('Error al obtener las reservaciones por usuario:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al obtener las reservaciones.' })
  }
}

// Ruta para crear una nueva reservación
const nuevaReservacion = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, detalles, horaInicio, horaFin } = req.body
    const espacioId = req.params.espacioId
    const usuarioId = req.params.usuarioId

    // Generar el array de fechas dentro del rango
    const fechasReservacion = []
    const currentDate = moment(fechaInicio)
    const endDate = moment(fechaFin)
    const horaInicioDate = moment(horaInicio, 'HH:mm').toDate()
    const horaFinDate = moment(horaFin, 'HH:mm').toDate()
    const hoy = moment()
    const fechaLimiteCancelar = hoy.add(3, 'days').toDate()

    while (currentDate.isSameOrBefore(endDate, 'day')) {
      fechasReservacion.push(currentDate.toDate())
      currentDate.add(1, 'day')
    }

    // Verificar si alguna de las fechas ya está reservada
    const reservacionesExistentes = await Reservaciones.find({
      espacioId,
      $or: fechasReservacion.map((fecha) => ({
        'fechaInicioYFinal.fechaInicio': { $lte: fecha },
        'fechaInicioYFinal.fechaFin': { $gte: fecha },
        $or: [
          {
            $and: [
              { 'horaInicioYFinal.horaInicio': { $lte: horaInicioDate } },
              { 'horaInicioYFinal.horaFin': { $gt: horaInicioDate } },
            ],
          },
          {
            $and: [
              { 'horaInicioYFinal.horaInicio': { $lt: horaFinDate } },
              { 'horaInicioYFinal.horaFin': { $gte: horaFinDate } },
            ],
          },
          {
            $and: [
              { 'horaInicioYFinal.horaInicio': { $gte: horaInicioDate } },
              { 'horaInicioYFinal.horaFin': { $lte: horaFinDate } },
            ],
          },
        ],
      })),
    })

    if (reservacionesExistentes.length > 0) {
      return res
        .status(400)
        .json({ mensaje: 'Alguna de las fechas ya está reservada.' })
    }

    // Obtener el espacio de trabajo para obtener el costo por día y vecesReservado
    const espacioTrabajo = await EspacioTrabajo.findById(espacioId)

    if (!espacioTrabajo) {
      return res
        .status(404)
        .json({ mensaje: 'Espacio de trabajo no encontrado.' })
    }

    // Calcular el número de días de la reservación
    const numeroDias = fechasReservacion.length

    // Calcular el precio total de la reservación
    const precioTotal = espacioTrabajo.precioDia * numeroDias

    // Preparamos la notificacion
    const datosUsuario = await Usuarios.findById(usuarioId)

    let name = datosUsuario.nombre

    let response = {
      body: {
        greeting: '¡Hola!',
        signature: 'FlexWork',
        name,
        intro: '¡Tu reservación ha sido exitosa!',
        table: {
          data: [
            {
              espacio: espacioTrabajo.titulo,
              precio: `$${precioTotal}`,
              detalles: detalles,
              fechaInicio: fechaInicio,
              fechaFin: fechaFin,
              horaInicio: horaInicioDate,
              horaFin: horaFinDate,
            },
          ],
        },
        outro: '¡Esperamos seguir ofreciendo un servicio de calidad!',
      },
    }

    let mail = mailGenerator.generate(response)

    let message = {
      from: process.env.EMAIL,
      to: datosUsuario.email,
      subject: 'Reservacion',
      html: mail,
    }

    // Crear la reservación con el array de fechas completo y el precio total
    const nuevaReservacionData = {
      usuarioId,
      espacioId,
      fechaInicioYFinal: { fechaInicio, fechaFin },
      horaInicioYFinal: {
        horaInicio: horaInicioDate,
        horaFin: horaFinDate,
      },
      fechaLimiteCancelacion: fechaLimiteCancelar,
      detalles,
      precioTotal,
    }

    const nuevaReservacion = await Reservaciones.create(nuevaReservacionData)

    // Agregar el ID de la reserva en el arreglo de reservaciones del espacio de trabajo y actualizar vecesReservado y rendimientoEconomico
    await EspacioTrabajo.findByIdAndUpdate(
      espacioId,
      {
        $push: { reservaciones: nuevaReservacion._id },
        $inc: { vecesReservado: 1, rendimientoEconomico: precioTotal },
      },
      { new: true }
    )

    await Usuarios.findByIdAndUpdate(
      usuarioId,
      { $push: { reservaciones: nuevaReservacion._id } },
      { new: true }
    )

    let info = await transporter.sendMail(message)
    return res.status(201).json({ ok: true, reservacion: nuevaReservacion })
  } catch (error) {
    console.error('Error al crear reservación:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al crear la reservación.' })
  }
}

const eliminarReservacion = async (req, res) => {
  try {
    const reservacionId = req.params.reservacionId

    // Buscar la reserva por su ID utilizando findById
    const reservacion = await Reservaciones.findById(reservacionId)

    if (!reservacion) {
      return res.status(404).json({ mensaje: 'Reservación no encontrada.' })
    }

    // Validar la fecha actual
    const fechaLimiteCancelar = reservacion.fechaLimiteCancelacion
    const fechaActual = moment()

    if (fechaActual.isBefore(fechaLimiteCancelar)) {
      // La fecha actual es menor a la fecha límite de cancelación
      // Eliminar la referencia de la reserva en el espacio de trabajo utilizando findByIdAndUpdate
      const espacioTrabajoId = reservacion.espacioId
      await EspacioTrabajo.findByIdAndUpdate(espacioTrabajoId, {
        $pull: { reservaciones: reservacionId },
      })

      // Eliminar la reserva utilizando findByIdAndDelete
      const reservacionEliminada = await Reservaciones.findByIdAndDelete(
        reservacionId
      )

      return res.status(200).json({
        ok: true,
        _id: reservacionId,
      })
    } else {
      // La fecha actual es mayor o igual a la fecha límite de cancelación
      return res.status(400).json({
        mensaje:
          'No se puede cancelar la reserva. La fecha límite de cancelación ha pasado.',
      })
    }
  } catch (error) {
    console.error('Error al eliminar reservación:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al eliminar la reservación.' })
  }
}

module.exports = {
  obtenerReservaciones,
  obtenerReservacionesPorEspacio,
  obtenerReservacionesPorUsuario,
  nuevaReservacion,
  eliminarReservacion,
}
