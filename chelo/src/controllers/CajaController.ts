import type { Request, Response } from "express"
import Caja from "../models/Caja"

export class CajaController {

    //  Crear caja
    static createCaja = async (req: Request, res: Response) => {
        const caja = new Caja(req.body)

        try {
            await caja.save()
            res.send('Caja creada')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear caja' })
        }
    }

    //  Obtener todas las cajas
    static getAllCajas = async (req: Request, res: Response) => {
        try {
            const cajas = await Caja.find({})
                .populate('idSucursal')

            res.json(cajas)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener cajas' })
        }
    }

    //  Obtener caja por ID
    static getCajaById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const caja = await Caja.findById(id)
                .populate('idSucursal')

            if (!caja) {
                const error = new Error('Caja no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(caja)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener caja' })
        }
    }

    //  Actualizar caja
    static updateCaja = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const caja = await Caja.findById(id)

            if (!caja) {
                const error = new Error('Caja no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual
            caja.idSucursal = req.body.idSucursal || caja.idSucursal

            caja.nombre = req.body.nombre || caja.nombre
            caja.descripcion = req.body.descripcion || caja.descripcion

            caja.estado = req.body.estado ?? caja.estado

            caja.actualizadoPor = req.body.actualizadoPor
            caja.fechaActualizacion = new Date()

            await caja.save()

            res.send('Caja actualizada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar caja' })
        }
    }

    //  Eliminar caja (lógico)
    static deleteCaja = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const caja = await Caja.findById(id)

            if (!caja) {
                const error = new Error('Caja no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  eliminación lógica
            caja.estado = false
            caja.eliminadoPor = req.body.eliminadoPor || 'admin'
            caja.fechaEliminado = new Date()

            await caja.save()

            res.send('Caja eliminada (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar caja' })
        }
    }

    // Obtener cajas por sucursal
    static getCajasBySucursal = async (
        req: Request,
        res: Response
    ) => {

        const { idSucursal } = req.params;

        try {

            const cajas = await Caja.find({
                idSucursal,
                estado: true,
            })
                .populate("idSucursal")
                .sort({
                    fechaCreacion: -1,
                });

            res.json(cajas);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error: "Error al obtener cajas por sucursal",
            });

        }

    };
}