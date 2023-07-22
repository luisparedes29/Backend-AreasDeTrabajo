const Reservaciones = require('../../models/reservaciones')
const EspacioTrabajo = require('../../models/espacioTrabajo')
const moment = require('moment')
const Usuarios = require('../../models/usuarios')

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

    // Crear la reservación con el array de fechas completo y el precio total
    const nuevaReservacionData = {
      usuarioId,
      espacioId,
      validacionFechasReservacion: fechasReservacion,
      fechaInicioYFinal: { fechaInicio, fechaFin },
      horaInicioYFinal: {
        horaInicio: horaInicioDate,
        horaFin: horaFinDate,
      },
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

    // Buscar y eliminar la reserva por su ID utilizando findByIdAndDelete
    const reservacionEliminada = await Reservaciones.findByIdAndDelete(
      reservacionId
    )

    if (!reservacionEliminada) {
      return res.status(404).json({ mensaje: 'Reservación no encontrada.' })
    }

    // Eliminar la referencia de la reserva en el espacio de trabajo utilizando findByIdAndUpdate
    const espacioTrabajoId = reservacionEliminada.espacioId
    await EspacioTrabajo.findByIdAndUpdate(espacioTrabajoId, {
      $pull: { reservaciones: reservacionId },
    })

    return res.status(200).json({
      ok: true,
      _id: reservacionId,
    })
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
