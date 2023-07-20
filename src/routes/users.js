const express = require('express')
const { registerUser, loginUser } = require('../routes/controllers/usuariosControllers')
const router = express.Router()

/**
 * @openapi
 * /users/signup:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Registrar un nuevo usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - nombre
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación generado al registrar al usuario.
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario registrado.
 *                 admin:
 *                   type: boolean
 *                   description: Indica si el usuario registrado es administrador.
 *       '400':
 *         description: Solicitud incorrecta. Datos requeridos faltantes o inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *       '500':
 *         description: Error del servidor. Hubo un problema al intentar registrar el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 * 
 * /users/login:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Iniciar sesión de usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Usuario autenticado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación generado al iniciar sesión exit'osamente.
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario autenticado.
 *                 admin:
 *                   type: boolean
 *                   description: Indica si el usuario autenticado es administrador.
 *       '400':
 *         description: Solicitud incorrecta. Datos requeridos faltantes o inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 *       '500':
 *         description: Error del servidor. Hubo un problema al intentar iniciar sesión.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 */


// Ruta para registrar admin
router
  .post('/signup', registerUser)

  // Ruta para iniciar sesion
  .post('/login', loginUser)

module.exports = router