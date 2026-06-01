import type { Request, Response } from "express"
import Sucursal from "../models/Sucursal"

export class SucursalController {

    static createSucursal = async (req: Request, res: Response) => {
        const sucursal = new Sucursal(req.body)
       
        try {
            await sucursal.save()
            res.send('Sucursal Creado ')

        } catch (error) {
            console.log(error)
        }
      

    }
    static getAllSucursal = async (req: Request, res: Response) => {
        try {
            const sucursal = await Sucursal.find({})
            res.json(sucursal)

        } catch (error) {
            console.log(error)
        }

    }
    static getSucursalById = async (req: Request, res: Response) => {
        const { id } = req.params
        console.log(req.params)
        try {
            const sucursal = await Sucursal.findById(id)
            if (!sucursal) {
                const error = new Error('No en contrado')
                res.status(404).json({ error: error.message })
                return
            }
            res.json(sucursal)

        } catch (error) {
            console.log(error)
        }

    }
    static updateSucursal = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const sucursal = await Sucursal.findByIdAndUpdate(id, req.body)
            if (!sucursal) {
                const error = new Error('No en contrado')
                res.status(404).json({ error: error.message })
                return
            }
            await sucursal.save()
            res.send('Actualizado')

        } catch (error) {
            console.log(error)
        }

    }

    static deleteSucursal = async (req: Request, res: Response) => {
        const { id } = req.params
        console.log('eliminando')
        try {
            const sucursal = await Sucursal.findById(id)
            if (!sucursal) {
                const error = new Error('no encontrado')
                res.status(404).json({ error: error.message })
                return
            }
            await sucursal.deleteOne()
            res.send('Eliminado')

        } catch (error) {
            console.log(error)
        }
    }
}