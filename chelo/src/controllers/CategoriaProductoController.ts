import type { Request, Response } from "express"
import CategoriaProducto from "../models/CategoriaProducto"

export class CategoriaProductoController {

    //  Crear categoría
    static createCategoria = async (req: Request, res: Response) => {
        const categoria = new CategoriaProducto(req.body)

        try {
            await categoria.save()
            res.send('Categoría creada')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear categoría' })
        }
    }

    //  Obtener todas
    static getAllCategorias = async (req: Request, res: Response) => {
        try {
            const categorias = await CategoriaProducto.find({})
            res.json(categorias)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener categorías' })
        }
    }

    //  Obtener por ID
    static getCategoriaById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const categoria = await CategoriaProducto.findById(id)

            if (!categoria) {
                const error = new Error('Categoría no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(categoria)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener categoría' })
        }
    }

    //  Actualizar
    static updateCategoria = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const categoria = await CategoriaProducto.findById(id)

            if (!categoria) {
                const error = new Error('Categoría no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual (tu estilo)
            categoria.nombre = req.body.nombre || categoria.nombre
            categoria.descripcion = req.body.descripcion || categoria.descripcion
            categoria.estado = req.body.estado ?? categoria.estado

            categoria.actualizadoPor = req.body.actualizadoPor
            categoria.fechaActualizacion = new Date()

            await categoria.save()

            res.send('Categoría actualizada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar categoría' })
        }
    }

    //  Eliminar lógico
    static deleteCategoria = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const categoria = await CategoriaProducto.findById(id)

            if (!categoria) {
                const error = new Error('Categoría no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  eliminación lógica
            categoria.estado = false
            categoria.eliminadoPor = req.body.eliminadoPor
            categoria.fechaEliminado = new Date()

            await categoria.save()

            res.send('Categoría eliminada (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar categoría' })
        }
    }
}