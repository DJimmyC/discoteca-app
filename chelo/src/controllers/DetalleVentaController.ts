import type { Request, Response } from "express"
import DetalleVenta from "../models/DetalleVenta"
import Venta from "../models/Venta";
import Almacen from "../models/Almacen";
import { ajustarStockInventario } from "../controllers/InventarioStcokService";

export class DetalleVentaController {

    //  Crear detalle
    // static createDetalle = async (req: Request, res: Response) => {
    //     const detalle = new DetalleVenta(req.body)

    //     try {
    //         //  cálculo seguro backend

    //         detalle.subtotal = Number(detalle.cantidad) * Number(detalle.precioUnitario)
    //         await detalle.save()

    //         res.send('Detalle de venta creado')

    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Error al crear detalle de venta' })
    //     }
    // }
    static createDetalle = async (req: Request, res: Response) => {

        try {

            const {
                idVenta,
                idProducto,
                cantidad,
                precioUnitario,
                creadoPor,
            } = req.body;

            /*
                1. Validar venta
            */
            const venta = await Venta.findById(idVenta);

            if (!venta) {
                return res.status(404).json({
                    error: "Venta no encontrada",
                });
            }

            /*
                2. Buscar almacén de tipo barra de la sucursal
                IMPORTANTE:
                Si tienes varias barras, lo ideal sería mandar idAlmacen desde el frontend.
            */
            const almacenBarra = await Almacen.findOne({
                idSucursal: venta.idSucursal,
                tipo: "barra",
                estado: true,
            });

            if (!almacenBarra) {
                return res.status(404).json({
                    error: "No existe un almacén de tipo barra activo para esta sucursal",
                });
            }

            /*
                3. Descontar stock antes de crear el detalle
            */
            await ajustarStockInventario({
                idAlmacen: almacenBarra._id,
                idProducto,
                cantidad: Number(cantidad),
                tipo: "RESTAR",
                usuario: creadoPor || "sistema",
            });

            /*
                4. Crear detalle venta
            */
            const detalle = new DetalleVenta(req.body);

            detalle.subtotal =
                Number(detalle.cantidad) *
                Number(detalle.precioUnitario);

            await detalle.save();

            res.status(201).json({
                message: "Detalle de venta creado y stock actualizado",
                detalle,
            });

        } catch (error: any) {

            console.log(error);

            res.status(500).json({
                error:
                    error.message ||
                    "Error al crear detalle de venta",
            });

        }

    };

    //  Obtener todos
    static getAllDetalles = async (req: Request, res: Response) => {
        try {
            const detalles = await DetalleVenta.find({})
                .populate('idVenta')
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
            const detalle = await DetalleVenta.findById(id)
                .populate('idVenta')
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
            const detalle = await DetalleVenta.findById(id)

            if (!detalle) {
                return res.status(404).json({
                    error: 'Detalle no encontrado'
                })
            }

            //  actualización manual
            detalle.idVenta = req.body.idVenta || detalle.idVenta
            detalle.idProducto = req.body.idProducto || detalle.idProducto

            detalle.cantidad = req.body.cantidad ?? detalle.cantidad
            detalle.precioUnitario = req.body.precioUnitario ?? detalle.precioUnitario

            //  recalcular SIEMPRE
            detalle.subtotal = Number(detalle.cantidad) * Number(detalle.precioUnitario)

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
            const detalle = await DetalleVenta.findById(id)

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