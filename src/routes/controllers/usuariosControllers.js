const bcrypt = require('bcrypt');
const Usuarios = require('../../models/usuarios');
const { createToken } = require('./jwtCreate');

const registerUser = async (req, res) => {
    try {
        const { nombre, email, password, admin } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'El nombre, correoo electrónico y la contraseña son requeridos.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'El correo electrónico ingresado no es válido. Por favor ingrese un correo electronico con el formato adecuado.' });
        }

        const correoExistente = await Usuarios.findOne({ email });
        if (correoExistente) {
            return res.status(400).json({ error: 'El correo electrónico ya existe. Por favor escoja otro.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'La contraseña debe ser de al menos 6 caracteres, incluir una mayúscula y un número.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Usuarios.create({
            nombre,
            email,
            password: hashedPassword,
            admin: admin || false
        });
        let token = createToken({ id: user._id, nombre: user.nombre, email: user.email, admin: user.admin });
        res.status(200).json({ token, email: user.email, isAdmin: user.admin });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El usuario ya existe. Por favor escoja otro' });
        }
        res.status(500).json({ error: 'Ocurrió un error al intentar crear un nuevo usuario.' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'El correo electrónico y la contraseña son requeridos para iniciar sesión' });
        }
        const user = await Usuarios.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'El correo electrónico ingresado no existe' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'La contraseña es incorrecta' });
        }
        let token = createToken({ id: user._id, nombre: user.nombre, email: user.email, isAdmin: user.admin });
        res.status(200).json({ token, email: user.email, isAdmin: user.admin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ocurrió un error al intentar iniciar sesión.' });
    }
};

module.exports = { registerUser, loginUser };
