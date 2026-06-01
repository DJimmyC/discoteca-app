import type { Request, Response } from "express"
import Venta from "../models/Venta"


import DetalleVenta from "../models/DetalleVenta";

export class VentaController {

    //  Crear venta
    static createVenta = async (req: Request, res: Response) => {
        const venta = new Venta(req.body)

        try {
            //  cálculo seguro backend
            

            await venta.save()

            res.status(201).json({
                message: "Venta registrada",
                venta,
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear venta' })
        }
    }

    //  Obtener todas
    static getAllVentas = async (req: Request, res: Response) => {
        try {
            const ventas = await Venta.find({})
                .populate('idComanda')
                .populate('idCaja')
                .populate('idPerfil')
                .populate('idSucursal')

            res.json(ventas)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener ventas' })
        }
    }

    //  Obtener por ID
    static getVentaById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const venta = await Venta.findById(id)
                .populate('idComanda')
                .populate('idCaja')
                .populate('idPerfil')
                .populate('idSucursal')

            if (!venta) {
                return res.status(404).json({
                    error: 'Venta no encontrada'
                })
            }

            res.json(venta)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener venta' })
        }
    }

    //  Actualizar venta
    static updateVenta = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const venta = await Venta.findById(id)

            if (!venta) {
                return res.status(404).json({
                    error: 'Venta no encontrada'
                })
            }

            //  actualización manual
            venta.idComanda = req.body.idComanda || venta.idComanda
            venta.idCaja = req.body.idCaja || venta.idCaja
            venta.idPerfil = req.body.idPerfil || venta.idPerfil
            venta.idSucursal = req.body.idSucursal || venta.idSucursal

            venta.numeroVenta = req.body.numeroVenta || venta.numeroVenta
            venta.fechaVenta = req.body.fechaVenta || venta.fechaVenta

            venta.subtotal = req.body.subtotal ?? venta.subtotal
            

            //  recalcular SIEMPRE
            

            venta.metodoPago = req.body.metodoPago || venta.metodoPago
            venta.estado = req.body.estado || venta.estado

            venta.observacion = req.body.observacion || venta.observacion

            venta.actualizadoPor = req.body.actualizadoPor
            venta.fechaActualizacion = new Date()

            await venta.save()

            res.send('Venta actualizada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar venta' })
        }
    }

    //  Eliminar (lógico)
    static deleteVenta = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const venta = await Venta.findById(id)

            if (!venta) {
                return res.status(404).json({
                    error: 'Venta no encontrada'
                })
            }

            //  eliminación lógica
            venta.estado = "anulado"
            venta.eliminadoPor = req.body.eliminadoPor || 1
            venta.fechaEliminado = new Date()

            await venta.save()

            res.send('Venta anulada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar venta' })
        }
    }



    // Obtener ventas por perfil con sus detalles
static getVentasConDetallesPorPerfil = async (
    req: Request,
    res: Response
) => {

    try {

        const { idPerfil } = req.params;

        /*
            1. Buscar ventas del perfil
            Se seleccionan solo datos necesarios para evitar redundancia.
        */
        const ventas = await Venta.find({
            idPerfil,
        })
            .populate({
                path: "idPerfil",
                select: "_id nombres apellidos email telefono ci idSucursal",
                populate: {
                    path: "idSucursal",
                    select: "_id nombreSucursal ubicacionSucursal",
                },
            })
            .populate({
                path: "idSucursal",
                select: "_id nombreSucursal ubicacionSucursal",
            })
            .populate({
                path: "idComanda",
                select: "_id numeroComanda estado observacion fechaApertura",
            })
            .populate({
                path: "idCaja",
                select: "_id nombre descripcion estado",
            })
            .sort({
                fechaCreacion: -1,
            })
            .lean();

        /*
            2. Si no tiene ventas
        */
        if (ventas.length === 0) {
            return res.json({
                perfil: null,
                sucursal: null,
                ventas: [],
            });
        }

        /*
            3. Sacar perfil y sucursal una sola vez
        */
        const primeraVenta: any = ventas[0];

        const perfil = primeraVenta.idPerfil
            ? {
                _id: primeraVenta.idPerfil._id,
                nombres: primeraVenta.idPerfil.nombres,
                apellidos: primeraVenta.idPerfil.apellidos,
                email: primeraVenta.idPerfil.email,
                telefono: primeraVenta.idPerfil.telefono,
                ci: primeraVenta.idPerfil.ci,
            }
            : null;

        const sucursal = primeraVenta.idSucursal
            ? {
                _id: primeraVenta.idSucursal._id,
                nombreSucursal: primeraVenta.idSucursal.nombreSucursal,
                ubicacionSucursal: primeraVenta.idSucursal.ubicacionSucursal,
            }
            : primeraVenta.idPerfil?.idSucursal
                ? {
                    _id: primeraVenta.idPerfil.idSucursal._id,
                    nombreSucursal: primeraVenta.idPerfil.idSucursal.nombreSucursal,
                    ubicacionSucursal: primeraVenta.idPerfil.idSucursal.ubicacionSucursal,
                }
                : null;

        /*
            4. Obtener IDs de ventas
        */
        const idsVentas = ventas.map(
            (venta) => venta._id
        );

        /*
            5. Buscar detalles de esas ventas
        */
        const detalles = await DetalleVenta.find({
            idVenta: {
                $in: idsVentas,
            },
        })
            .populate({
                path: "idProducto",
                select: "_id nombre descripcion marca estado",
            })
            .lean();

        /*
            6. Armar respuesta limpia
        */
        const ventasLimpias = ventas.map(
            (venta: any) => {

                const detallesDeVenta = detalles
                    .filter(
                        (detalle: any) =>
                            detalle.idVenta.toString() ===
                            venta._id.toString()
                    )
                    .map((detalle: any) => ({
                        _id: detalle._id,

                        producto: detalle.idProducto
                            ? {
                                _id: detalle.idProducto._id,
                                nombre: detalle.idProducto.nombre,
                                descripcion: detalle.idProducto.descripcion,
                                marca: detalle.idProducto.marca,
                                estado: detalle.idProducto.estado,
                            }
                            : null,

                        cantidad: detalle.cantidad,
                        precioUnitario: detalle.precioUnitario,
                        subtotal: detalle.subtotal,

                        creadoPor: detalle.creadoPor,
                        fechaCreacion: detalle.fechaCreacion,

                        actualizadoPor: detalle.actualizadoPor,
                        fechaActualizacion: detalle.fechaActualizacion,

                        eliminadoPor: detalle.eliminadoPor,
                        fechaEliminado: detalle.fechaEliminado,
                    }));

                const totalDetalles = detallesDeVenta.reduce(
                    (acc, detalle) =>
                        acc + Number(detalle.subtotal || 0),
                    0
                );

                return {
                    _id: venta._id,

                    numeroVenta: venta.numeroVenta,

                    comanda: venta.idComanda
                        ? {
                            _id: venta.idComanda._id,
                            numeroComanda: venta.idComanda.numeroComanda,
                            estado: venta.idComanda.estado,
                            observacion: venta.idComanda.observacion,
                            fechaApertura: venta.idComanda.fechaApertura,
                        }
                        : null,

                    caja: venta.idCaja
                        ? {
                            _id: venta.idCaja._id,
                            nombre: venta.idCaja.nombre,
                            descripcion: venta.idCaja.descripcion,
                            estado: venta.idCaja.estado,
                        }
                        : null,

                    fechaVenta: venta.fechaVenta,

                    subtotal: venta.subtotal,
                    
                    total: venta.total,

                    totalDetalles,

                    metodoPago: venta.metodoPago,
                    estado: venta.estado,
                    observacion: venta.observacion,

                    creadoPor: venta.creadoPor,
                    fechaCreacion: venta.fechaCreacion,

                    actualizadoPor: venta.actualizadoPor,
                    fechaActualizacion: venta.fechaActualizacion,

                    eliminadoPor: venta.eliminadoPor,
                    fechaEliminado: venta.fechaEliminado,

                    detalles: detallesDeVenta,
                };

            }
        );

        /*
            7. Respuesta final ordenada
        */
        return res.json({
            perfil,
            sucursal,
            ventas: ventasLimpias,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al obtener ventas con detalles por perfil",
        });

    }

};
}