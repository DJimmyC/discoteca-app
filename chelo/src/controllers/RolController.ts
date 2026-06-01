import type { Request, Response } from "express"
import Rol from "../models/Rol"

export class RolController {

    //  Crear rol
    static createRol = async (req: Request, res: Response) => {
        const rol = new Rol(req.body)

        try {
            await rol.save()
            res.send('Rol creado')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear rol' })
        }
    }

    //  Obtener todos
    static getAllRoles = async (req: Request, res: Response) => {
        try {
            const roles = await Rol.find({})
            res.json(roles)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener roles' })
        }
    }

    //  Obtener por ID
    static getRolById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const rol = await Rol.findById(id)

            if (!rol) {
                const error = new Error('Rol no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(rol)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener rol' })
        }
    }

    //  Actualizar rol
    static updateRol = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const rol = await Rol.findById(id)

            if (!rol) {
                const error = new Error('Rol no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual
            rol.nombre = req.body.nombre || rol.nombre
            rol.descripcion = req.body.descripcion || rol.descripcion
            rol.estado = req.body.estado ?? rol.estado

            // permisos
            rol.ventas = req.body.ventas ?? rol.ventas
            rol.egresos = req.body.egresos ?? rol.egresos
            rol.inventario = req.body.inventario ?? rol.inventario
            rol.reportes = req.body.reportes ?? rol.reportes
            rol.usuarios = req.body.usuarios ?? rol.usuarios
            rol.configuracion = req.body.configuracion ?? rol.configuracion

            rol.actualizadoPor = req.body.actualizadoPor
            rol.fechaActualizacion = new Date()

            await rol.save()

            res.send('Rol actualizado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar rol' })
        }
    }

    //  Eliminar lógico
    static deleteRol = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const rol = await Rol.findById(id)

            if (!rol) {
                const error = new Error('Rol no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            rol.estado = false
            rol.eliminadoPor = req.body.eliminadoPor
            rol.fechaEliminado = new Date()

            await rol.save()

            res.send('Rol eliminado (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar rol' })
        }
    }
}