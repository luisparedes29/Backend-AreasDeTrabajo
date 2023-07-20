const EspacioTrabajo = require('../../models/espacioTrabajo')
const Reservaciones = require('../../models/reservaciones')
const Usuarios = require('../../models/usuarios')
const cloudinary = require('../../utilities/cloudinary')


//funcion para obtener todos los espacios de trabajo para el mapa

const obtenerEspaciosTrabajoMapa = async (req, res) => {
  try {
    const espaciosTrabajo = await EspacioTrabajo.find().select(
      'titulo descripcion ubicacion precioDia'
    )
    return res.json(espaciosTrabajo)
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
      espaciosTrabajo,
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

    const { titulo, descripcion, ubicacion, capacidad, precioDia, direccion, imagenReferencia } =
      req.body

    //validamos que no exista otro espacio de trabajo con el mismo nombre
    const existeEspacioTrabajo = await EspacioTrabajo.findOne({
      titulo,
    })
    if (existeEspacioTrabajo) {
      return res.status(400).json({
        mensaje: 'Ya existe un espacio de trabajo con ese nombre',
      })
    }

    const nuevoEspacioTrabajo = {
      titulo,
      descripcion,
      ubicacion,
      capacidad,
      precioDia,
      direccion,
      imagenReferencia: imageUrl
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
    const { titulo, descripcion, ubicacion, capacidad, precioDia, imagenReferencia } = req.body

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
        imagenReferencia: imageUrl
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
    mensaje: "Espacio de trabajo eliminado"
  })
}
module.exports = {
  obtenerEspaciosTrabajoMapa,
  obtenerEspaciosTrabajo,
  nuevoEspacioTrabajo,
  editarEspacioTrabajo,
  eliminarEspacioTrabajo,
}
