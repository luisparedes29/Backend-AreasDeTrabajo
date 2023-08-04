const request = require('supertest')
const app = require('../app') // Reemplaza 'tu_app' con la ruta al archivo principal de tu aplicación
const mongoose = require('mongoose')
const Reservaciones = require('../models/reservaciones') // Reemplaza 'ruta_al_modelo_Reservaciones' con la ruta al modelo Reservaciones

describe('Pruebas para obtenerReservaciones', () => {
  // Antes de cada prueba, conectamos a la base de datos

  it('Debería obtener todas las reservaciones y sus datos de espacio de trabajo', async () => {
    // Realiza una solicitud GET a la ruta /obtenerReservaciones
    const response = await request(app).get('/reservaciones')

    // Verifica que la respuesta tenga un código de estado 200
    expect(response.status).toBe(200)

    // Verifica que la respuesta sea un objeto JSON y contenga la propiedad 'ok' con valor true
    expect(response.body).toEqual(expect.objectContaining({ ok: true }))

    // Verifica que la respuesta contenga la propiedad 'reservaciones' que es un array
    expect(response.body).toHaveProperty('reservaciones')
    expect(Array.isArray(response.body.reservaciones)).toBe(true)

    // Verifica que la respuesta contenga los datos de espacio de trabajo y usuario relacionados
    const reservaciones = response.body.reservaciones
    for (const reservacion of reservaciones) {
      expect(reservacion).toHaveProperty('usuarioId')
      expect(reservacion).toHaveProperty('espacioId')

      expect(reservacion.usuarioId).toHaveProperty('nombre')
      expect(reservacion.usuarioId).toHaveProperty('email')

      expect(reservacion.espacioId).toHaveProperty('titulo')
      expect(reservacion.espacioId).toHaveProperty('descripcion')
      expect(reservacion.espacioId).toHaveProperty('direccion')
      expect(reservacion.espacioId).toHaveProperty('capacidad')
      expect(reservacion.espacioId).toHaveProperty('precioDia')
    }
  })

  it('Debería devolver un código de estado 500 si ocurre un error al obtener las reservaciones', async () => {
    // Mock la función Reservaciones.find para que arroje un error
    jest.spyOn(Reservaciones, 'find').mockImplementation(() => {
      throw new Error('Error simulado al obtener las reservaciones')
    })

    // Realiza una solicitud GET a la ruta /obtenerReservaciones
    const response = await request(app).get('/reservaciones')

    // Verifica que la respuesta tenga un código de estado 500
    expect(response.status).toBe(500)

    // Verifica que la respuesta sea un objeto JSON y contenga la propiedad 'mensaje' con un mensaje de error
    expect(response.body).toEqual(
      expect.objectContaining({
        mensaje: 'Hubo un error al obtener las reservaciones.',
      })
    )
  })
})

describe('Pruebas para obtenerReservacionesPorEspacio', () => {
  it('Debería obtener las reservaciones de un espacio de trabajo específico', async () => {
    // Crear algunos datos de prueba para el espacio de trabajo y las reservaciones
    const ID = '64b8bf8cf4ec4c968280a1ec'
    //hacemos de espcioId un id de mongoose
    const espacioId = new mongoose.Types.ObjectId(ID)

    // Realiza una solicitud GET a la ruta /reservaciones/:espacioId, donde espacioId es el ID del espacio de trabajo creado
    const response = await request(app).get(`/reservaciones/1/${espacioId}`)

    // Verifica que la respuesta tenga un código de estado 200
    expect(response.status).toBe(200)

    // Verifica que la respuesta sea un objeto JSON y contenga la propiedad 'ok' con valor true
    expect(response.body).toEqual(expect.objectContaining({ ok: true }))

    // Verifica que la respuesta contenga la propiedad 'reservaciones' que es un array
    expect(response.body).toHaveProperty('reservaciones')
    expect(Array.isArray(response.body.reservaciones)).toBe(true)

    // Verifica que las reservaciones devueltas sean las del espacio de trabajo específico
    const reservaciones = response.body.reservaciones
    expect(reservaciones).toHaveLength(reservacionesData.length)
    reservaciones.forEach((reservacion) => {
      expect(reservacion.espacioId.toString()).toBe(espacioId.toString())
    })
  })

  it('Debería devolver un código de estado 400 si se proporciona un ID no válido', async () => {
    // Realiza una solicitud GET a la ruta /reservaciones/:espacioId, donde espacioId no es un ID válido de Mongoose
    const response = await request(app).get('/reservaciones/1/464151616')

    // Verifica que la respuesta tenga un código de estado 400
    expect(response.status).toBe(400)

    // Verifica que la respuesta sea un objeto JSON y contenga la propiedad 'ok' con valor false
    expect(response.body).toEqual(
      expect.objectContaining({
        ok: false,
      })
    )

    // Verifica que la respuesta contenga la propiedad 'mensaje' con un mensaje de error
    expect(response.body).toHaveProperty('mensaje', 'ID no válido')
  })

  it('Debería devolver un código de estado 500 si ocurre un error al obtener las reservaciones', async () => {
    // Mock la función Reservaciones.find para que arroje un error
    jest.spyOn(Reservaciones, 'find').mockImplementation(() => {
      throw new Error(
        'Error simulado al obtener las reservaciones por espacio de trabajo'
      )
    })

    // Realiza una solicitud GET a la ruta /reservaciones/:espacioId, donde espacioId es un ID válido de Mongoose

    const response = await request(app).get(
      `/reservaciones/1/64b8bf8cf4ec4c968280a1ec`
    )

    // Verifica que la respuesta tenga un código de estado 500
    expect(response.status).toBe(500)

    // Verifica que la respuesta sea un objeto JSON y contenga la propiedad 'mensaje' con un mensaje de error
    expect(response.body).toEqual(
      expect.objectContaining({
        mensaje: 'Hubo un error al obtener las reservaciones.',
      })
    )
  })
})
