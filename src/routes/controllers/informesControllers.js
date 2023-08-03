const EspacioTrabajo = require('../../models/espacioTrabajo')
const Reservaciones = require('../../models/reservaciones')

// funcion para buscar los espacios de trabajo con mejor rendimiento economico

const InformeRendimientoEconomicoYTendencias = async (req, res) => {
  try {
    const totalEspaciosTrabajo = await EspacioTrabajo.countDocuments()
    if (!totalEspaciosTrabajo) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontraron espacios de trabajo.',
      })
    }
    const totalReservaciones = await Reservaciones.countDocuments()
    //ORDENAMIENTO DESCENDING POR RENDERIMIENTO ECONOMICO

    const espaciosTrabajoMejorRendimiento = await EspacioTrabajo.find()
      .limit(10)
      .sort({
        rendimientoEconomico: -1,
      })
      .select('titulo descripcion direccion')

    const espaciosTrabajoPeorRendimiento = await EspacioTrabajo.find()
      .limit(10)
      .sort({
        rendimientoEconomico: 1,
      })
      .select('titulo descripcion direccion')

    const espaciosTrabajoMasReservado = await EspacioTrabajo.find()
      .limit(10)
      .sort({
        vecesReservado: -1,
      })
      .select('titulo descripcion direccion precioDia')

    const resultadoIngresos = await EspacioTrabajo.aggregate([
      {
        $group: {
          _id: null,
          ingresosTotales: {
            $sum: '$rendimientoEconomico',
          },
        },
      },
    ])

    const ingresosTotales = resultadoIngresos[0].ingresosTotales

    return res.json({
      ok: true,
      ingresosTotales: ingresosTotales,
      totalEspaciosTrabajo: totalEspaciosTrabajo,
      totalReservaciones: totalReservaciones,
      espaciosTrabajoMejorRendimiento: espaciosTrabajoMejorRendimiento,
      espaciosTrabajoPeorRendimiento: espaciosTrabajoPeorRendimiento,
      espaciosTrabajoMasReservado: espaciosTrabajoMasReservado,
    })
  } catch (error) {
    console.error('Error al obtener los espacios de trabajo:', error)
    return res.status(500).json({
      ok: false,
      mensaje: 'Hubo un error al obtener los espacios de trabajo.',
    })
  }
}

module.exports = InformeRendimientoEconomicoYTendencias
