const request = require('supertest')
const app = require('../app') // Reemplaza 'tu_app' con la ruta al archivo principal de tu aplicación
const mongoose = require('mongoose')
const Usuarios = require('../models/usuarios') // Reemplaza 'ruta_al_modelo_Usuarios' con la ruta al modelo Usuarios

describe('Pruebas para getUsers', () => {
  it('Debería obtener todos los usuarios de la base de datos', async () => {
    // Realiza una solicitud GET a la ruta /users
    const response = await request(app).get('/users/all')

    // Verifica que la respuesta tenga un código de estado 200
    expect(response.status).toBe(200)

    // Verifica que la respuesta sea un objeto JSON y contenga la propiedad 'length' con el número correcto de usuarios
  })

  it('Debería devolver un código de estado 500 si ocurre un error al obtener los usuarios', async () => {
    // Mock la función Usuarios.find para que arroje un error
    jest.spyOn(Usuarios, 'find').mockImplementation(() => {
      throw new Error('Error simulado al obtener los usuarios')
    })

    // Realiza una solicitud GET a la ruta /users
    const response = await request(app).get('/users/all')

    // Verifica que la respuesta tenga un código de estado 500
    expect(response.status).toBe(500)

    // Verifica que la respuesta sea un objeto JSON y contenga la propiedad 'error' con un mensaje de error
    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Ocurrió un error al recuperar todos los usuarios.',
      })
    )
  })
})
