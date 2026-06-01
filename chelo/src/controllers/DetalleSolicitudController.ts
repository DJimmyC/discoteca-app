import type { Request, Response } from "express"
import DetalleSolicitud from "../models/DetalleSolicitud"

export class DetalleSolicitudController {

    //  Crear detalle de solicitud
    static createDetalle = async (req: Request, res: Response) => {
        const detalle = new DetalleSolicitud(req.body)

        try {
            //  validaciones
            if (detalle.cantidadSolicitada < 0 || detalle.cantidadAtendida < 0) {
                return res.status(400).json({
                    error: 'Las cantidades no pueden ser negativas'
                })
            }

            if (detalle.cantidadAtendida > detalle.cantidadSolicitada) {
                return res.status(400).json({
                    error: 'La cantidad atendida no puede ser mayor a la solicitada'
                })
            }

            await detalle.save()

            res.send('Detalle de solicitud creado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear detalle de solicitud' })
        }
    }

    //  Obtener todos
    static getAllDetalles = async (req: Request, res: Response) => {
        try {
            const detalles = await DetalleSolicitud.find({})
                .populate('idSolicitud')
                .populate('idProducto')

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
            const detalle = await DetalleSolicitud.findById(id)
                .populate('idSolicitud')
                .populate('idProducto')

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
            const detalle = await DetalleSolicitud.findById(id)

            if (!detalle) {
                return res.status(404).json({
                    error: 'Detalle no encontrado'
                })
            }

            //  actualización manual
            detalle.idSolicitud = req.body.idSolicitud || detalle.idSolicitud
            detalle.idProducto = req.body.idProducto || detalle.idProducto

            detalle.cantidadSolicitada = req.body.cantidadSolicitada ?? detalle.cantidadSolicitada
            detalle.cantidadAtendida = req.body.cantidadAtendida ?? detalle.cantidadAtendida

            detalle.observacion = req.body.observacion || detalle.observacion

            //  validaciones
            if (detalle.cantidadSolicitada < 0 || detalle.cantidadAtendida < 0) {
                return res.status(400).json({
                    error: 'Las cantidades no pueden ser negativas'
                })
            }

            if (detalle.cantidadAtendida > detalle.cantidadSolicitada) {
                return res.status(400).json({
                    error: 'La cantidad atendida no puede ser mayor a la solicitada'
                })
            }

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
            const detalle = await DetalleSolicitud.findById(id)

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