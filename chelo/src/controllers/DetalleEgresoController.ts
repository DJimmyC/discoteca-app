import type { Request, Response } from "express"
import DetalleEgreso from "../models/DetalleEgreso"

export class DetalleEgresoController {

    //  Crear detalle de egreso
    static createDetalle = async (req: Request, res: Response) => {
        const detalle = new DetalleEgreso(req.body)

        try {
            //  validaciones básicas
            if (detalle.cantidad < 0 || detalle.costoUnitario < 0) {
                return res.status(400).json({
                    error: 'Cantidad y costo no pueden ser negativos'
                })
            }

            //  cálculo backend
            detalle.subtotal = Number(detalle.cantidad) * Number(detalle.costoUnitario)

            await detalle.save()

            res.send('Detalle de egreso creado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear detalle de egreso' })
        }
    }

    //  Obtener todos
    static getAllDetalles = async (req: Request, res: Response) => {
        try {
            const detalles = await DetalleEgreso.find({})
                .populate('idEgreso')
                .populate('idProducto')
                .populate('idAlmacen')

            res.json(detalles)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener detalles' })
        }
    }

    //  Obtener por ID
    static getDetalleById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const detalle = await DetalleEgreso.findById(id)
                .populate('idEgreso')
                .populate('idProducto')
                .populate('idAlmacen')

            if (!detalle) {
                return res.status(404).json({
                    error: 'Detalle no encontrado'
                })
            }

            res.json(detalle)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener detalle' })
        }
    }

    //  Actualizar detalle
    static updateDetalle = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const detalle = await DetalleEgreso.findById(id)

            if (!detalle) {
                return res.status(404).json({
                    error: 'Detalle no encontrado'
                })
            }

            //  actualización manual
            detalle.idEgreso = req.body.idEgreso || detalle.idEgreso
            detalle.idProducto = req.body.idProducto || detalle.idProducto
            detalle.idAlmacen = req.body.idAlmacen || detalle.idAlmacen

            detalle.descripcion = req.body.descripcion || detalle.descripcion

            detalle.cantidad = req.body.cantidad ?? detalle.cantidad
            detalle.costoUnitario = req.body.costoUnitario ?? detalle.costoUnitario

            detalle.tipoItem = req.body.tipoItem || detalle.tipoItem

            //  validación
            if (detalle.cantidad < 0 || detalle.costoUnitario < 0) {
                return res.status(400).json({
                    error: 'Cantidad y costo no pueden ser negativos'
                })
            }

            //  recalcular SIEMPRE
            detalle.subtotal = Number(detalle.cantidad) * Number(detalle.costoUnitario)

            detalle.actualizadoPor = req.body.actualizadoPor
            detalle.fechaActualizacion = new Date()

            await detalle.save()

            res.send('Detalle actualizado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar detalle' })
        }
    }

    //  Eliminar (lógico)
    static deleteDetalle = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const detalle = await DetalleEgreso.findById(id)

            if (!detalle) {
                return res.status(404).json({
                    error: 'Detalle no encontrado'
                })
            }

            //  eliminación lógica
            detalle.eliminadoPor = req.body.eliminadoPor || "admin"
            detalle.fechaEliminado = new Date()

            await detalle.save()

            res.send('Detalle eliminado (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar detalle' })
        }
    }
}