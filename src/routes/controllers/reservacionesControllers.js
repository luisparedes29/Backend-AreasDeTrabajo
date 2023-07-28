const Reservations = require('../../models/reservaciones')
const WorkSpace = require('../../models/espacioTrabajo')
const moment = require('moment')
const Users = require('../../models/usuarios')

const getReservations = async (req, res) => {
  try {
    // Obtener todas las reservaciones y sus datos de espacio de trabajo
    const reservations = await Reservations.find()
      .populate('userId') // Trae los datos del usuario relacionado
      .populate('spaceId') // Trae los datos del espacio de trabajo relacionado

    return res.status(200).json({ ok: true, reservations: reservations })
  } catch (error) {
    console.error('Error al obtener reservaciones:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al obtener las reservaciones.' })
  }
}

const getReservationBySpace = async (req, res) => {
  try {
    const spaceId = req.params.spaceId

    // Obtener las reservaciones del espacio de trabajo especificado y realizar el populate
    const reservations = await Reservations.find({ spaceId })
      .populate('spaceId')
      .populate('userId')

    return res.status(200).json({ ok: true, reservations: reservations })
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

const getReservationByUser = async (req, res) => {
  try {
    const userId = req.params.userId

    // Obtener las reservaciones realizadas por el usuario especificado y realizar el populate
    const reservations = await Reservations.find({ userId }).populate(
      'spaceId'
    )

    return res.status(200).json({ ok: true, reservations: reservations })
  } catch (error) {
    console.error('Error al obtener las reservaciones por usuario:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al obtener las reservaciones.' })
  }
}

// Ruta para crear una nueva reservación
const createReservation = async (req, res) => {
  try {
    const { startDate, endDate, details, startTime, endTime } = req.body
    const spaceId = req.params.spaceId
    const userId = req.params.userId

    // Generar el array de fechas dentro del rango
    const reservationDates = []
    const currentDate = moment(startDate)
    const endingDate = moment(endDate)
    const startTimeDate = moment(startTime, 'HH:mm').toDate()
    const endTimeDate = moment(endTime, 'HH:mm').toDate()

    while (currentDate.isSameOrBefore(endingDate, 'day')) {
      reservationDates.push(currentDate.toDate())
      currentDate.add(1, 'day')
    }

    // Verificar si alguna de las fechas ya está reservada
    const existingReservations = await Reservations.find({
      spaceId,
      $or: reservationDates.map((date) => ({
        'startAndEndDate.startDate': { $lte: date },
        'startAndEndDate.endDate': { $gte: date },
        $or: [
          {
            $and: [
              { 'startAndEndTime.startTime': { $lte: startTimeDate } },
              { 'startAndEndTime.endTime': { $gt: startTimeDate } },
            ],
          },
          {
            $and: [
              { 'startAndEndTime.startTime': { $lt: endTimeDate } },
              { 'startAndEndTime.endTime': { $gte: endTimeDate } },
            ],
          },
          {
            $and: [
              { 'startAndEndTime.startTime': { $gte: startTimeDate } },
              { 'startAndEndTime.endTime': { $lte: endTimeDate} },
            ],
          },
        ],
      })),
    })

    if (existingReservations.length > 0) {
      return res
        .status(400)
        .json({ mensaje: 'Alguna de las fechas ya está reservada.' })
    }

    // Obtener el espacio de trabajo para obtener el costo por día y vecesReservado
    const workSpace = await WorkSpace.findById(espacioId)

    if (!workSpace) {
      return res
        .status(404)
        .json({ mensaje: 'Espacio de trabajo no encontrado.' })
    }

    // Calcular el número de días de la reservación
    const numberOfDays = reservationDates.length

    // Calcular el precio total de la reservación
    const totalPrice = espacioTrabajo.precioDia * numberOfDays

    // Crear la reservación con el array de fechas completo y el precio total
    const newReservationData = {
      userId,
      spaceId,
      validateReservationDates: reservationDates,
      startAndEndDate: { startDate, endDate },
      startAndEndTime: {
        startTime: startTimeDate,
        endTime: endTimeDate,
      },
      details,
      totalPrice,
    }

    const newReservation = await Reservations.create(newReservationData)

    // Agregar el ID de la reserva en el arreglo de reservaciones del espacio de trabajo y actualizar vecesReservado y rendimientoEconomico
    await WorkSpace.findByIdAndUpdate(
      spaceId,
      {
        $push: { reservations: newReservation._id },
        $inc: { timesReserved: 1, economicPerformance: totalPrice },
      },
      { new: true }
    )

    await Users.findByIdAndUpdate(
      userId,
      { $push: { reservations: newReservation._id } },
      { new: true }
    )

    return res.status(201).json({ ok: true, reservation: newReservation })
  } catch (error) {
    console.error('Error al crear reservación:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al crear la reservación.' })
  }
}

const deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.reservationId

    // Buscar y eliminar la reserva por su ID utilizando findByIdAndDelete
    const deletedReservation = await Reservations.findByIdAndDelete(
      reservationId
    )

    if (!deletedReservation) {
      return res.status(404).json({ mensaje: 'Reservación no encontrada.' })
    }

    // Eliminar la referencia de la reserva en el espacio de trabajo utilizando findByIdAndUpdate
    const workSpaceId = deletedReservation.spaceId
    await WorkSpace.findByIdAndUpdate(workSpaceId, {
      $pull: { reservations: reservationId },
    })

    return res.status(200).json({
      ok: true,
      _id: reservationId,
    })
  } catch (error) {
    console.error('Error al eliminar reservación:', error)
    return res
      .status(500)
      .json({ mensaje: 'Hubo un error al eliminar la reservación.' })
  }
}

module.exports = {
  getReservations,
  getReservationBySpace,
  getReservationByUser,
  createReservation,
  deleteReservation,
}
