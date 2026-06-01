import type { Request, Response } from "express"
import Egreso from "../models/Egreso"
import DetalleEgreso from "../models/DetalleEgreso";

export class EgresoController {

    //  Crear egreso
    static createEgreso = async (req: Request, res: Response) => {
        const egreso = new Egreso(req.body)

        try {
            if (egreso.total < 0) {
                return res.status(400).json({
                    error: "El total no puede ser negativo"
                })
            }

            await egreso.save()

            res.status(201).json({
                message: "Egreso registrado",
                egreso,
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al crear egreso" })
        }
    }

    //  Obtener todos
    static getAllEgresos = async (req: Request, res: Response) => {
        try {
            const egresos = await Egreso.find({})
                .populate('idCaja')
                .populate('idPerfil')
                .populate('idSucursal')

            res.json(egresos)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener egresos' })
        }
    }

    //  Obtener por ID
    static getEgresoById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const egreso = await Egreso.findById(id)
                .populate('idCaja')
                .populate('idPerfil')
                .populate('idSucursal')

            if (!egreso) {
                return res.status(404).json({
                    error: 'Egreso no encontrado'
                })
            }

            res.json(egreso)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener egreso' })
        }
    }

    //  Actualizar egreso
    static updateEgreso = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const egreso = await Egreso.findById(id)

            if (!egreso) {
                return res.status(404).json({
                    error: 'Egreso no encontrado'
                })
            }

            //  actualización manual
            egreso.idCaja = req.body.idCaja || egreso.idCaja
            egreso.idPerfil = req.body.idPerfil || egreso.idPerfil
            egreso.idSucursal = req.body.idSucursal || egreso.idSucursal

            egreso.numeroEgreso = req.body.numeroEgreso || egreso.numeroEgreso
            egreso.fechaEgreso = req.body.fechaEgreso || egreso.fechaEgreso

            egreso.tipoEgreso = req.body.tipoEgreso || egreso.tipoEgreso
            egreso.metodoPago = req.body.metodoPago || egreso.metodoPago

            egreso.total = req.body.total ?? egreso.total

            egreso.estado = req.body.estado || egreso.estado
            egreso.observacion = req.body.observacion || egreso.observacion

            //  validación
            if (egreso.total < 0) {
                return res.status(400).json({
                    error: 'El total no puede ser negativo'
                })
            }

            egreso.actualizadoPor = req.body.actualizadoPor
            egreso.fechaActualizacion = new Date()

            await egreso.save()

            res.send('Egreso actualizado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar egreso' })
        }
    }

    //  Eliminar (lógico)
    static deleteEgreso = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const egreso = await Egreso.findById(id)

            if (!egreso) {
                return res.status(404).json({
                    error: 'Egreso no encontrado'
                })
            }

            //  eliminación lógica
            egreso.estado = "anulado"
            egreso.eliminadoPor = req.body.eliminadoPor || "admin"
            egreso.fechaEliminado = new Date()

            await egreso.save()

            res.send('Egreso anulado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar egreso' })
        }
    }


    // Obtener egresos por sucursal con sus detalles
    static getEgresosConDetallesPorSucursal = async (
        req: Request,
        res: Response
    ) => {

        try {

            const { idSucursal } = req.params;

            /*
                1. Buscar egresos de la sucursal
            */
            const egresos = await Egreso.find({
                idSucursal,
            })
                .populate({
                    path: "idCaja",
                    select: "_id nombre descripcion estado",
                })
                .populate({
                    path: "idPerfil",
                    select: "_id nombres apellidos email telefono ci",
                })
                .populate({
                    path: "idSucursal",
                    select: "_id nombreSucursal ubicacionSucursal",
                })
                .sort({
                    fechaCreacion: -1,
                })
                .lean();

            /*
                2. Si no existen egresos
            */
            if (egresos.length === 0) {
                return res.json({
                    sucursal: null,
                    egresos: [],
                });
            }

            /*
                3. Sacar sucursal una sola vez
            */
            const primerEgreso: any = egresos[0];

            const sucursal = primerEgreso.idSucursal
                ? {
                    _id: primerEgreso.idSucursal._id,
                    nombreSucursal: primerEgreso.idSucursal.nombreSucursal,
                    ubicacionSucursal: primerEgreso.idSucursal.ubicacionSucursal,
                }
                : null;

            /*
                4. Obtener IDs de egresos
            */
            const idsEgresos = egresos.map(
                (egreso) => egreso._id
            );

            /*
                5. Buscar detalles de esos egresos
            */
            const detalles = await DetalleEgreso.find({
                idEgreso: {
                    $in: idsEgresos,
                },
            })
                .populate({
                    path: "idProducto",
                    select: "_id nombre descripcion marca estado",
                })
                .populate({
                    path: "idAlmacen",
                    select: "_id nombre tipo descripcion ubicacion estado",
                })
                .lean();

            /*
                6. Armar respuesta limpia
            */
            const egresosLimpios = egresos.map(
                (egreso: any) => {

                    const detallesDeEgreso = detalles
                        .filter(
                            (detalle: any) =>
                                detalle.idEgreso.toString() ===
                                egreso._id.toString()
                        )
                        .map((detalle: any) => ({

                            _id:
                                detalle._id,

                            producto:
                                detalle.idProducto
                                    ? {
                                        _id: detalle.idProducto._id,
                                        nombre: detalle.idProducto.nombre,
                                        descripcion: detalle.idProducto.descripcion,
                                        marca: detalle.idProducto.marca,
                                        estado: detalle.idProducto.estado,
                                    }
                                    : null,

                            almacen:
                                detalle.idAlmacen
                                    ? {
                                        _id: detalle.idAlmacen._id,
                                        nombre: detalle.idAlmacen.nombre,
                                        tipo: detalle.idAlmacen.tipo,
                                        descripcion: detalle.idAlmacen.descripcion,
                                        ubicacion: detalle.idAlmacen.ubicacion,
                                        estado: detalle.idAlmacen.estado,
                                    }
                                    : null,

                            descripcion:
                                detalle.descripcion,

                            cantidad:
                                detalle.cantidad,

                            costoUnitario:
                                detalle.costoUnitario,

                            subtotal:
                                detalle.subtotal,

                            tipoItem:
                                detalle.tipoItem,

                            creadoPor:
                                detalle.creadoPor,

                            fechaCreacion:
                                detalle.fechaCreacion,

                            actualizadoPor:
                                detalle.actualizadoPor,

                            fechaActualizacion:
                                detalle.fechaActualizacion,

                            eliminadoPor:
                                detalle.eliminadoPor,

                            fechaEliminado:
                                detalle.fechaEliminado,

                        }));

                    const totalDetalles = detallesDeEgreso.reduce(
                        (acc, detalle) =>
                            acc + Number(detalle.subtotal || 0),
                        0
                    );

                    return {

                        _id:
                            egreso._id,

                        numeroEgreso:
                            egreso.numeroEgreso,

                        caja:
                            egreso.idCaja
                                ? {
                                    _id: egreso.idCaja._id,
                                    nombre: egreso.idCaja.nombre,
                                    descripcion: egreso.idCaja.descripcion,
                                    estado: egreso.idCaja.estado,
                                }
                                : null,

                        perfil:
                            egreso.idPerfil
                                ? {
                                    _id: egreso.idPerfil._id,
                                    nombres: egreso.idPerfil.nombres,
                                    apellidos: egreso.idPerfil.apellidos,
                                    email: egreso.idPerfil.email,
                                    telefono: egreso.idPerfil.telefono,
                                    ci: egreso.idPerfil.ci,
                                }
                                : null,

                        fechaEgreso:
                            egreso.fechaEgreso,

                        tipoEgreso:
                            egreso.tipoEgreso,

                        metodoPago:
                            egreso.metodoPago,

                        total:
                            egreso.total,

                        totalDetalles,

                        estado:
                            egreso.estado,

                        observacion:
                            egreso.observacion,

                        creadoPor:
                            egreso.creadoPor,

                        fechaCreacion:
                            egreso.fechaCreacion,

                        actualizadoPor:
                            egreso.actualizadoPor,

                        fechaActualizacion:
                            egreso.fechaActualizacion,

                        eliminadoPor:
                            egreso.eliminadoPor,

                        fechaEliminado:
                            egreso.fechaEliminado,

                        detalles:
                            detallesDeEgreso,

                    };

                }
            );

            /*
                7. Respuesta final
            */
            return res.json({
                sucursal,
                egresos: egresosLimpios,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error: "Error al obtener egresos con detalles por sucursal",
            });

        }

    };
}