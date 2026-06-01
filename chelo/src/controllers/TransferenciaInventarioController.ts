import type { Request, Response } from "express"
import TransferenciaInventario from "../models/TransferenciaInventario"

export class TransferenciaInventarioController {

    //  Crear transferencia
    static createTransferencia = async (req: Request, res: Response) => {
        const transferencia = new TransferenciaInventario(req.body)

        try {
            //  validación: origen ≠ destino
            if (
                req.body.idAlmacenOrigen &&
                req.body.idAlmacenDestino &&
                req.body.idAlmacenOrigen === req.body.idAlmacenDestino
            ) {
                return res.status(400).json({
                    error: 'El almacén origen y destino no pueden ser iguales'
                })
            }

            await transferencia.save()

            res.send('Transferencia creada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear transferencia' })
        }
    }

    //  Obtener todas
    static getAllTransferencias = async (req: Request, res: Response) => {
        try {
            const transferencias = await TransferenciaInventario.find({})
                .populate('idSolicitud')
                .populate('idPerfil')
                .populate('idSucursal')
                .populate('idAlmacenOrigen')
                .populate('idAlmacenDestino')

            res.json(transferencias)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener transferencias' })
        }
    }

    //  Obtener por ID
    static getTransferenciaById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const transferencia = await TransferenciaInventario.findById(id)
                .populate('idSolicitud')
                .populate('idPerfil')
                .populate('idSucursal')
                .populate('idAlmacenOrigen')
                .populate('idAlmacenDestino')

            if (!transferencia) {
                return res.status(404).json({
                    error: 'Transferencia no encontrada'
                })
            }

            res.json(transferencia)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener transferencia' })
        }
    }

    //  Actualizar transferencia
    static updateTransferencia = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const transferencia = await TransferenciaInventario.findById(id)

            if (!transferencia) {
                return res.status(404).json({
                    error: 'Transferencia no encontrada'
                })
            }

            //  validación origen ≠ destino
            if (
                req.body.idAlmacenOrigen &&
                req.body.idAlmacenDestino &&
                req.body.idAlmacenOrigen === req.body.idAlmacenDestino
            ) {
                return res.status(400).json({
                    error: 'El almacén origen y destino no pueden ser iguales'
                })
            }

            //  actualización manual
            transferencia.idSolicitud = req.body.idSolicitud || transferencia.idSolicitud

            transferencia.idPerfil = req.body.idPerfil || transferencia.idPerfil
            transferencia.idSucursal = req.body.idSucursal || transferencia.idSucursal

            transferencia.idAlmacenOrigen = req.body.idAlmacenOrigen || transferencia.idAlmacenOrigen
            transferencia.idAlmacenDestino = req.body.idAlmacenDestino || transferencia.idAlmacenDestino

            transferencia.fechaTransferencia = req.body.fechaTransferencia || transferencia.fechaTransferencia

            transferencia.estado = req.body.estado || transferencia.estado
            transferencia.observacion = req.body.observacion || transferencia.observacion

            transferencia.actualizadoPor = req.body.actualizadoPor
            transferencia.fechaActualizacion = new Date()

            await transferencia.save()

            res.send('Transferencia actualizada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar transferencia' })
        }
    }

    //  Eliminar (lógico)
    static deleteTransferencia = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const transferencia = await TransferenciaInventario.findById(id)

            if (!transferencia) {
                return res.status(404).json({
                    error: 'Transferencia no encontrada'
                })
            }

            //  eliminación lógica
            transferencia.estado = "anulada"
            transferencia.eliminadoPor = req.body.eliminadoPor || "admin"
            transferencia.fechaEliminado = new Date()

            await transferencia.save()

            res.send('Transferencia anulada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar transferencia' })
        }
    }
}