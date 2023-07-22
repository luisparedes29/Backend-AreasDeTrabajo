const EspacioTrabajo = require('../../models/espacioTrabajo')
const Reservaciones = require('../../models/reservaciones')
const Usuarios = require('../../models/usuarios')
const cloudinary = require('../../utilities/cloudinary')
const mongoose = require('mongoose')

//funcion para obtener un solo espacio de trabajo por su ID
const obtenerEspacioTrabajoID = async (req, res) => {
  try {
    //validacion del ID para que sea como el ID de Mongoose
    if (!mongoose.Types.ObjectId.isValid(req.params.espacioId)) {
      return res.status(400).json({ error: 'ID no válido' })
    }

    const espacioTrabajo = await EspacioTrabajo.findById(req.params.espacioId)
      .populate({
        path: 'reservaciones',
        populate: {
          path: 'usuarioId',
          select: 'nombre email',
        },
        select: '-__v',
      })
      .select('-__v')

    return res.json({ ok: true, espacioTrabajo: espacioTrabajo })
  } catch (error) {
    console.error('Error al obtener el espacio de trabajo:', error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hubo un error al obtener el espacio de trabajo.',
    })
  }
}

// funcion para obtener solo 6 espacios de trabajo
const obtenerSeisEspaciosTrabajo = async (req, res) => {
  try {
    const espaciosTrabajo = await EspacioTrabajo.find().limit(6)
    return res.json({ ok: true, espaciosTrabajo: espaciosTrabajo })
  } catch (error) {
    console.error('Error al obtener los espacios de trabajo:', error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hubo un error al obtener los espacios de trabajo.',
    })
  }
}

//funcion para obtener todos los espacios de trabajo para el mapa

const obtenerEspaciosTrabajoMapa = async (req, res) => {
  try {
    const espaciosTrabajo = await EspacioTrabajo.find().select(
      'titulo descripcion ubicacion precioDia'
    )
    return res.json({ ok: true, espaciosTrabajo: espaciosTrabajo })
  } catch (error) {
    console.error('Error al obtener los espacios de trabajo:', error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hubo un error al obtener los espacios de trabajo.',
    })
  }
}

//funcion para obtener todos los espacios de trabajo con un paginador

const obtenerEspaciosTrabajo = async (req, res) => {
  try {
    const pagina = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const skip = (pagina - 1) * limit // Calcular el número de documentos a saltar

    const espaciosTrabajoConteo = await EspacioTrabajo.countDocuments()
    const espaciosTrabajo = await EspacioTrabajo.find()
      .skip(skip)
      .limit(limit)
      .select('titulo imagenReferencia precioDia direccion')

    const paginasTotal = Math.ceil(espaciosTrabajoConteo / limit)

    return res.json({
      ok: true,
      espacioTrabajo: espaciosTrabajo,
      ConteoTotal: espaciosTrabajoConteo,
      currentPagina: pagina,
      paginasTotal,
    })
  } catch (error) {
    console.error('Error al obtener los espacios de trabajo:', error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hubo un error al obtener los espacios de trabajo',
    })
  }
}

//funcion para crear un nuevo espacio de trabajo
const nuevoEspacioTrabajo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'No se proporcionó ningún archivo de imagen' })
    }

    const result = await cloudinary.uploader.upload(req.file.path)
    if (!result || !result.secure_url) {
      return res.status(500).json({ error: 'Error al subir la imagen' })
    }

    const imageUrl = result.secure_url

    const { titulo, descripcion, ubicacion, capacidad, precioDia, direccion } =
      req.body

    //validamos los campos del req.body
    if (
      !titulo ||
      !descripcion ||
      !ubicacion ||
      !capacidad ||
      !precioDia ||
      !direccion
    ) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios',
      })
    }

    //validamos que no exista otro espacio de trabajo con el mismo nombre
    const existeEspacioTrabajo = await EspacioTrabajo.findOne({
      titulo,
    })

    if (existeEspacioTrabajo) {
      return res.status(400).json({
        mensaje: 'Ya existe un espacio de trabajo con ese nombre',
      })
    }
    // validacion para que sean numeros en capacidad y precio dia
    if (isNaN(capacidad) || isNaN(precioDia)) {
      return res.status(400).json({ error: 'La capacidad y el precio deben ser valores numéricos' })
    }

    // validacion para que no incluyan numeros igual a cero o menos
    if (capacidad <= 0 || precioDia <= 0) {
      return res.status(400).json({ error: 'La capacidad y el precio deben ser mayores que cero' })
    }

    const nuevoEspacioTrabajo = {
      titulo,
      descripcion,
      ubicacion,
      capacidad,
      precioDia,
      direccion,
      imagenReferencia: imageUrl,
    }
    const EspacioTrabajoCreada = await EspacioTrabajo.create(
      nuevoEspacioTrabajo
    )
    if (!EspacioTrabajoCreada) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Hubo un error al crear el espacio de trabajo',
      })
    }
    res.json({
      ok: true,
      EspacioTrabajo: nuevoEspacioTrabajo,
    })
  } catch (error) {
    console.error('Error al crear el espacio de trabajo:', error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hubo un error al crear el espacio de trabajo',
    })
  }
}

//funcion para editar espacio de trabajo
const editarEspacioTrabajo = async (req, res) => {
  try {
    const { espacioId } = req.params
    const { titulo, descripcion, ubicacion, capacidad, precioDia } = req.body

    //validamos los campos que llegan del req.body
    if (!titulo || !descripcion || !ubicacion || !capacidad || !precioDia) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios',
      })
    }
    //validamos que no exista otro espacio de trabajo con el mismo nombre
    const otroEspacioConMismoTitulo = await EspacioTrabajo.findOne({ titulo })
    if (otroEspacioConMismoTitulo && otroEspacioConMismoTitulo._id.toString() !== espacioId) {
      return res.status(400).json({ error: 'Ya existe otro espacio de trabajo con el mismo título' })
    }

    // validacion para que sean numeros en capacidad y precio dia
    if (isNaN(capacidad) || isNaN(precioDia)) {
      return res.status(400).json({ error: 'La capacidad y el precio deben ser valores numéricos' })
    }

    // validacion para que no incluyan numeros igual a cero o menos
    if (capacidad <= 0 || precioDia <= 0) {
      return res.status(400).json({ error: 'La capacidad y el precio deben ser mayores a cero' })
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'No se proporcionó ningún archivo de imagen' })
    }

    const result = await cloudinary.uploader.upload(req.file.path)
    if (!result || !result.secure_url) {
      return res.status(500).json({ error: 'Error al subir la imagen' })
    }

    const imageUrl = result.secure_url

    const EspacioTrabajoEditado = await EspacioTrabajo.findByIdAndUpdate(
      espacioId,
      {
        titulo,
        descripcion,
        ubicacion,
        capacidad,
        precioDia,
        imagenReferencia: imageUrl,
      },
      { new: true }
    )
    if (!EspacioTrabajoEditado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Hubo un error al editar el espacio de trabajo',
      })
    }
    console.log(EspacioTrabajoEditado)
    return res.status(200).json({
      ok: true,
      mensaje: 'Espacio de trabajo editado',
      espacioTrabajo: EspacioTrabajoEditado,
    })
  } catch (error) {
    console.error('Error al editar el espacio de trabajo:', error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hubo un error al editar el espacio de trabajo',
    })
  }
}

const eliminarEspacioTrabajo = async (req, res) => {
  const espacioId = req.params.espacioId
  ///validacion del ID para que sea como el ID de Mongoose
  if (!mongoose.isValidObjectId(espacioId)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'ID no válido',
    })
  }

  const espacioEliminado = await EspacioTrabajo.findByIdAndDelete(espacioId)
  if (!espacioEliminado) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Hubo un error al eliminar el espacio de trabajo',
    })
  }
  //eliminar reservaciones que tengan este espacio de trabajo

  await Reservaciones.deleteMany({ espacioId })

  //eliminar reservaciones de los usuarios

  await Usuarios.updateMany(
    { reservaciones: espacioId },
    { $pull: { reservaciones: espacioId } }
  )

  res.json({
    ok: true,
    _id: espacioEliminado._id,
    mensaje: 'Espacio de trabajo eliminado',
  })
}
module.exports = {
  obtenerSeisEspaciosTrabajo,
  obtenerEspacioTrabajoID,
  obtenerEspaciosTrabajoMapa,
  obtenerEspaciosTrabajo,
  nuevoEspacioTrabajo,
  editarEspacioTrabajo,
  eliminarEspacioTrabajo,
}
