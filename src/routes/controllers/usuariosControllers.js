const bcrypt = require('bcrypt');
const Usuarios = require('../../models/usuarios');
const { createToken } = require('./jwtCreate');
const transporter = require('./mailer');
const mailGenerator = require('./mail');

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

        
        let response = {
          body: {
            greeting: '¡Hola!',
            signature: 'FlexWork',
            nombre,
            intro: '¡Te has registrado con éxito a FlexWork!',
            table: {
              data: [
                {
                  nombre: nombre,
                  email: email
                },
              ],
            },
            outro: '¡Gracias por formar parte de nuestros Clientes!',
          },
        }
    
        let mail = mailGenerator.generate(response)
    
        let message = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Reservacion',
          html: mail,
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Usuarios.create({
            nombre,
            email,
            password: hashedPassword,
            admin: admin || false
        });

        let info = await transporter.sendMail(message)
        let token = createToken({ id: user._id, nombre: user.nombre, email: user.email, admin: user.admin });
        res.status(200).json({ token, email: user.email, admin: user.admin });
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
        let token = createToken({ id: user._id, nombre: user.nombre, email: user.email, admin: user.admin });
        res.status(200).json({ token, email: user.email, admin: user.admin });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ocurrió un error al intentar iniciar sesión.' });
    }
};

const getUsers = async (req, res) => {
    try {
        const allUsers = await Usuarios.find({}, { __v: 0 });
        res.status(200).json(allUsers);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Ocurrió un error al recuperar todos los usuarios.' });
    }
};


const getUserById = async (req, res) => {
    const userId = req.params.id; 
  
    try {
      const user = await Usuarios.findById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrió un error al recuperar el usuario' });
    }
  };
  
  const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;
  
    try {
      if (updatedUserData.password) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
      }
  
      const updatedUser = await Usuarios.findByIdAndUpdate(userId, updatedUserData, { new: true });
  
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Ocurrió un error al actualizar el usuario por su ID.' });
    }
  };
  

  const deleteUserById = async (req, res) => {
    const userId = req.params.id; 
  
    try {
      const deletedUser = await Usuarios.findByIdAndRemove(userId);
  
      if (deletedUser) {
        res.status(200).json({ message: 'Usuario eliminado con éxito.' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado.' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el usuario por su ID.' });
    }
  };


module.exports = { registerUser, loginUser, getUsers, getUserById, deleteUserById, updateUserById};
