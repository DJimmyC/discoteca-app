import type { Request, Response } from "express"
import Producto from "../models/Producto"

export class ProductoController {

    //  Crear producto
    static createProducto = async (req: Request, res: Response) => {
        const producto = new Producto(req.body)

        try {
            await producto.save()
            res.send('Producto creado')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear producto' })
        }
    }

    //  Obtener todos
    static getAllProductos = async (req: Request, res: Response) => {
        try {
            const productos = await Producto.find({})
                .populate('idCategoria')

            res.json(productos)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener productos' })
        }
    }

    //  Obtener por ID
    static getProductoById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const producto = await Producto.findById(id)
                .populate('idCategoria')

            if (!producto) {
                const error = new Error('Producto no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(producto)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener producto' })
        }
    }

    //  Actualizar producto
    static updateProducto = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const producto = await Producto.findById(id)

            if (!producto) {
                const error = new Error('Producto no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual (tu estilo)
            producto.idCategoria = req.body.idCategoria || producto.idCategoria

            producto.nombre = req.body.nombre || producto.nombre
            producto.descripcion = req.body.descripcion || producto.descripcion
            producto.marca = req.body.marca || producto.marca

            producto.estado = req.body.estado ?? producto.estado

            producto.actualizadoPor = req.body.actualizadoPor
            producto.fechaActualizacion = new Date()

            await producto.save()

            res.send('Producto actualizado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar producto' })
        }
    }

    //  Eliminar (lógico)
    static deleteProducto = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const producto = await Producto.findById(id)

            if (!producto) {
                const error = new Error('Producto no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            //  eliminación lógica
            producto.estado = false
            producto.eliminadoPor = req.body.eliminadoPor
            producto.fechaEliminado = new Date()

            await producto.save()

            res.send('Producto eliminado (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar producto' })
        }
    }
}