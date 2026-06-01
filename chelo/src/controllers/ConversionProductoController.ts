import type { Request, Response } from "express"
import ConversionProducto from "../models/ConversionProducto"

export class ConversionProductoController {

    //  Crear conversión
    static createConversion = async (req: Request, res: Response) => {
        const conversion = new ConversionProducto(req.body)

        try {
            await conversion.save()
            res.send('Conversión creada')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear conversión' })
        }
    }

    //  Obtener todas
    static getAllConversiones = async (req: Request, res: Response) => {
        try {
            const conversiones = await ConversionProducto.find({})
                .populate('idProducto')

            res.json(conversiones)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener conversiones' })
        }
    }

    //  Obtener por ID
    static getConversionById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const conversion = await ConversionProducto.findById(id)
                .populate('idProducto')

            if (!conversion) {
                const error = new Error('Conversión no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(conversion)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener conversión' })
        }
    }

    //  Actualizar conversión
    static updateConversion = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const conversion = await ConversionProducto.findById(id)

            if (!conversion) {
                const error = new Error('Conversión no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual (tu estilo)
            conversion.idProducto = req.body.idProducto || conversion.idProducto

            conversion.unidadOrigen = req.body.unidadOrigen || conversion.unidadOrigen
            conversion.cantidadOrigen = req.body.cantidadOrigen ?? conversion.cantidadOrigen

            conversion.unidadDestino = req.body.unidadDestino || conversion.unidadDestino
            conversion.cantidadDestino = req.body.cantidadDestino ?? conversion.cantidadDestino

            conversion.estado = req.body.estado ?? conversion.estado

            conversion.actualizadoPor = req.body.actualizadoPor
            conversion.fechaActualizacion = new Date()

            await conversion.save()

            res.send('Conversión actualizada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar conversión' })
        }
    }

    //  Eliminar (lógico)
    static deleteConversion = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const conversion = await ConversionProducto.findById(id)

            if (!conversion) {
                const error = new Error('Conversión no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  eliminación lógica
            conversion.estado = false
            conversion.eliminadoPor = req.body.eliminadoPor || 1
            conversion.fechaEliminado = new Date()

            await conversion.save()

            res.send('Conversión eliminada (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar conversión' })
        }
    }
}