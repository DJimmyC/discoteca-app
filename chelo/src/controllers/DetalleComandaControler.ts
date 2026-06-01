import type { Request, Response } from "express"
import DetalleComanda from "../models/DetalleComanda"

export class DetalleComandaController {

    //  Crear detalle
    // static createDetalle = async (req: Request, res: Response) => {
    //     const detalle = new DetalleComanda(req.body)

    //     try {
    //         //  cálculo seguro en backend
    //         detalle.subtotal = detalle.cantidad * detalle.precioUnitario

    //         await detalle.save()

    //         res.send('Detalle de comanda creado')
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Error al crear detalle' })
    //     }
    // }
    static createDetalle = async (req: Request, res: Response) => {
        const detalle = new DetalleComanda(req.body);

        try {
            detalle.subtotal = detalle.cantidad * detalle.precioUnitario;

            await detalle.save();

            res.status(201).json({
                message: "Detalle de comanda creado",
                detalle,
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                error: "Error al crear detalle",
            });
        }
    };

    //  Obtener todos
    static getAllDetalles = async (req: Request, res: Response) => {
        try {
            const detalles = await DetalleComanda.find({})
                .populate('idComanda')
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
            const detalle = await DetalleComanda.findById(id)
                .populate('idComanda')
                .populate('idProducto')

            if (!detalle) {
                const error = new Error('Detalle no encontrado')
                res.status(404).json({ error: error.message })
                return
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
            const detalle = await DetalleComanda.findById(id)

            if (!detalle) {
                const error = new Error('Detalle no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual
            detalle.idComanda = req.body.idComanda || detalle.idComanda
            detalle.idProducto = req.body.idProducto || detalle.idProducto

            detalle.cantidad = req.body.cantidad ?? detalle.cantidad
            detalle.precioUnitario = req.body.precioUnitario ?? detalle.precioUnitario

            //  recalcular subtotal SIEMPRE
            detalle.subtotal = detalle.cantidad * detalle.precioUnitario

            detalle.estado = req.body.estado ?? detalle.estado
            detalle.observacion = req.body.observacion || detalle.observacion

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
            const detalle = await DetalleComanda.findById(id)

            if (!detalle) {
                const error = new Error('Detalle no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            //  eliminación lógica
            detalle.estado = "eliminado"
            detalle.eliminadoPor = req.body.eliminadoPor || 1
            detalle.fechaEliminado = new Date()

            await detalle.save()

            res.send('Detalle eliminado (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar detalle' })
        }
    }
}