import type { Request, Response } from "express"
import Solicitud from "../models/Solicitud"
import DetalleSolicitud from "../models/DetalleSolicitud";

import { ajustarStockInventario } from "../controllers/InventarioStcokService";

export class SolicitudController {

    //  Crear solicitud
    // static createSolicitud = async (req: Request, res: Response) => {
    //     const solicitud = new Solicitud(req.body)

    //     try {
    //         //  validación: origen ≠ destino
    //         if (
    //             req.body.idAlmacenOrigen &&
    //             req.body.idAlmacenDestino &&
    //             req.body.idAlmacenOrigen === req.body.idAlmacenDestino
    //         ) {
    //             return res.status(400).json({
    //                 error: 'El almacén origen y destino no pueden ser iguales'
    //             })
    //         }

    //         await solicitud.save()

    //         res.send('Solicitud creada')

    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Error al crear solicitud' })
    //     }
    // }
    static createSolicitud = async (req: Request, res: Response) => {
    const solicitud = new Solicitud(req.body)

    try {
        if (
            req.body.idAlmacenOrigen &&
            req.body.idAlmacenDestino &&
            req.body.idAlmacenOrigen === req.body.idAlmacenDestino
        ) {
            return res.status(400).json({
                error: "El almacén origen y destino no pueden ser iguales"
            })
        }

        await solicitud.save()

        res.status(201).json({
            message: "Solicitud creada",
            solicitud,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error al crear solicitud" })
    }
}

    //  Obtener todas
    static getAllSolicitudes = async (req: Request, res: Response) => {
        try {
            const solicitudes = await Solicitud.find({})
                .populate('idPerfil')
                .populate('idSucursal')
                .populate('idAlmacenOrigen')
                .populate('idAlmacenDestino')

            res.json(solicitudes)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener solicitudes' })
        }
    }

    //  Obtener por ID
    static getSolicitudById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const solicitud = await Solicitud.findById(id)
                .populate('idPerfil')
                .populate('idSucursal')
                .populate('idAlmacenOrigen')
                .populate('idAlmacenDestino')

            if (!solicitud) {
                return res.status(404).json({
                    error: 'Solicitud no encontrada'
                })
            }

            res.json(solicitud)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener solicitud' })
        }
    }

    //  Actualizar solicitud
    // static updateSolicitud = async (req: Request, res: Response) => {
    //     const { id } = req.params

    //     try {
    //         const solicitud = await Solicitud.findById(id)

    //         if (!solicitud) {
    //             return res.status(404).json({
    //                 error: 'Solicitud no encontrada'
    //             })
    //         }

    //         //  validación origen ≠ destino
    //         if (
    //             req.body.idAlmacenOrigen &&
    //             req.body.idAlmacenDestino &&
    //             req.body.idAlmacenOrigen === req.body.idAlmacenDestino
    //         ) {
    //             return res.status(400).json({
    //                 error: 'El almacén origen y destino no pueden ser iguales'
    //             })
    //         }

    //         //  actualización manual
    //         solicitud.idPerfil = req.body.idPerfil || solicitud.idPerfil
    //         solicitud.idSucursal = req.body.idSucursal || solicitud.idSucursal

    //         solicitud.idAlmacenOrigen = req.body.idAlmacenOrigen || solicitud.idAlmacenOrigen
    //         solicitud.idAlmacenDestino = req.body.idAlmacenDestino || solicitud.idAlmacenDestino

    //         solicitud.fechaSolicitud = req.body.fechaSolicitud || solicitud.fechaSolicitud

    //         solicitud.estado = req.body.estado || solicitud.estado
    //         solicitud.observacion = req.body.observacion || solicitud.observacion

    //         solicitud.actualizadoPor = req.body.actualizadoPor
    //         solicitud.fechaActualizacion = new Date()

    //         await solicitud.save()

    //         res.send('Solicitud actualizada')

    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Error al actualizar solicitud' })
    //     }
    // }
    static updateSolicitud = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

        const solicitud = await Solicitud.findById(id);

        if (!solicitud) {
            return res.status(404).json({
                error: "Solicitud no encontrada",
            });
        }

        /*
            Guardamos el estado anterior para evitar
            actualizar stock dos veces.
        */
        const estadoAnterior = solicitud.estado;

        /*
            Validación origen ≠ destino
        */
        if (
            req.body.idAlmacenOrigen &&
            req.body.idAlmacenDestino &&
            req.body.idAlmacenOrigen === req.body.idAlmacenDestino
        ) {
            return res.status(400).json({
                error: "El almacén origen y destino no pueden ser iguales",
            });
        }

        /*
            Actualización manual
        */
        solicitud.idPerfil =
            req.body.idPerfil || solicitud.idPerfil;

        solicitud.idSucursal =
            req.body.idSucursal || solicitud.idSucursal;

        solicitud.idAlmacenOrigen =
            req.body.idAlmacenOrigen ?? solicitud.idAlmacenOrigen;

        solicitud.idAlmacenDestino =
            req.body.idAlmacenDestino || solicitud.idAlmacenDestino;

        solicitud.fechaSolicitud =
            req.body.fechaSolicitud || solicitud.fechaSolicitud;

        solicitud.estado =
            req.body.estado || solicitud.estado;

        solicitud.observacion =
            req.body.observacion || solicitud.observacion;

        solicitud.actualizadoPor =
            req.body.actualizadoPor;

        solicitud.fechaActualizacion =
            new Date();

        /*
            Si pasa a aprobada recién ahora,
            actualizamos inventario.
        */
        const pasaAAprobada =
            estadoAnterior !== "aprobada" &&
            solicitud.estado === "aprobada";

        if (pasaAAprobada) {

            const detalles = await DetalleSolicitud.find({
                idSolicitud: solicitud._id,
            });

            if (detalles.length === 0) {
                return res.status(400).json({
                    error: "La solicitud no tiene detalles para actualizar inventario",
                });
            }

            for (const detalle of detalles) {

                const cantidad =
                    Number(
                        detalle.cantidadAtendida ??
                        detalle.cantidadSolicitada
                    );

                if (cantidad <= 0) {
                    continue;
                }

                /*
                    CASO 1:
                    Reposición interna:
                    tiene almacén origen y destino.
                    Entonces resta del origen y suma al destino.
                */
                if (
                    solicitud.idAlmacenOrigen &&
                    solicitud.idAlmacenDestino
                ) {

                    await ajustarStockInventario({
                        idAlmacen: solicitud.idAlmacenOrigen,
                        idProducto: detalle.idProducto,
                        cantidad,
                        tipo: "RESTAR",
                        usuario: req.body.actualizadoPor || "sistema",
                    });

                    await ajustarStockInventario({
                        idAlmacen: solicitud.idAlmacenDestino,
                        idProducto: detalle.idProducto,
                        cantidad,
                        tipo: "SUMAR",
                        usuario: req.body.actualizadoPor || "sistema",
                    });

                } else {

                    /*
                        CASO 2:
                        Compra externa:
                        no tiene almacén origen.
                        Solo suma al almacén destino.
                    */
                    await ajustarStockInventario({
                        idAlmacen: solicitud.idAlmacenDestino,
                        idProducto: detalle.idProducto,
                        cantidad,
                        tipo: "SUMAR",
                        usuario: req.body.actualizadoPor || "sistema",
                    });

                }

            }

        }

        await solicitud.save();

        res.json({
            message: pasaAAprobada
                ? "Solicitud aprobada e inventario actualizado"
                : "Solicitud actualizada",
            solicitud,
        });

    } catch (error: any) {

        console.log(error);

        res.status(500).json({
            error:
                error.message ||
                "Error al actualizar solicitud",
        });

    }
};

    //  Eliminar (lógico)
    static deleteSolicitud = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const solicitud = await Solicitud.findById(id)

            if (!solicitud) {
                return res.status(404).json({
                    error: 'Solicitud no encontrada'
                })
            }

            //  eliminación lógica
            solicitud.estado = "anulada"
            solicitud.eliminadoPor = req.body.eliminadoPor || "admin"
            solicitud.fechaEliminado = new Date()

            await solicitud.save()

            res.send('Solicitud anulada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar solicitud' })
        }
    }







    static getSolicitudesBySucursal = async (
        req: Request,
        res: Response
    ) => {

        const { idSucursal } = req.params;

        try {

            const solicitudes = await Solicitud.find({
                idSucursal,
            })
                .populate({
                    path: "idPerfil",
                    select: "_id nombres apellidos email telefono ci",
                })
                .populate({
                    path: "idSucursal",
                    select: "_id nombreSucursal ubicacionSucursal",
                })
                .populate({
                    path: "idAlmacenOrigen",
                    select: "_id nombre tipo descripcion ubicacion estado",
                })
                .populate({
                    path: "idAlmacenDestino",
                    select: "_id nombre tipo descripcion ubicacion estado",
                })
                .sort({
                    fechaCreacion: -1,
                })
                .lean();

            if (solicitudes.length === 0) {
                return res.json({
                    sucursal: null,
                    solicitudes: [],
                });
            }

            const primeraSolicitud: any = solicitudes[0];

            const sucursal = primeraSolicitud.idSucursal
                ? {
                    _id: primeraSolicitud.idSucursal._id,
                    nombreSucursal: primeraSolicitud.idSucursal.nombreSucursal,
                    ubicacionSucursal: primeraSolicitud.idSucursal.ubicacionSucursal,
                }
                : null;

            const idsSolicitudes = solicitudes.map(
                (solicitud) => solicitud._id
            );

            const detalles = await DetalleSolicitud.find({
                idSolicitud: {
                    $in: idsSolicitudes,
                },
            })
                .populate({
                    path: "idProducto",
                    select: "_id nombre descripcion marca estado",
                })
                .lean();

            const solicitudesLimpias = solicitudes.map(
                (solicitud: any) => {

                    const detallesDeSolicitud = detalles
                        .filter(
                            (detalle: any) =>
                                detalle.idSolicitud.toString() ===
                                solicitud._id.toString()
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

                            cantidadSolicitada:
                                detalle.cantidadSolicitada,

                            cantidadAprobada:
                                detalle.cantidadAprobada,

                            cantidadAtendida:
                                detalle.cantidadAtendida,

                            unidad:
                                detalle.unidad,

                            estado:
                                detalle.estado,

                            observacion:
                                detalle.observacion,

                            creadoPor:
                                detalle.creadoPor,

                            actualizadoPor:
                                detalle.actualizadoPor,

                            eliminadoPor:
                                detalle.eliminadoPor,

                            fechaCreacion:
                                detalle.fechaCreacion,

                            fechaActualizacion:
                                detalle.fechaActualizacion,

                            fechaEliminado:
                                detalle.fechaEliminado,

                        }));

                    const totalSolicitado = detallesDeSolicitud.reduce(
                        (acc, detalle) =>
                            acc + Number(detalle.cantidadSolicitada || 0),
                        0
                    );

                    const totalAprobado = detallesDeSolicitud.reduce(
                        (acc, detalle) =>
                            acc + Number(
                                detalle.cantidadAprobada ??
                                detalle.cantidadSolicitada ??
                                0
                            ),
                        0
                    );

                    return {

                        _id:
                            solicitud._id,

                        perfil:
                            solicitud.idPerfil
                                ? {
                                    _id: solicitud.idPerfil._id,
                                    nombres: solicitud.idPerfil.nombres,
                                    apellidos: solicitud.idPerfil.apellidos,
                                    email: solicitud.idPerfil.email,
                                    telefono: solicitud.idPerfil.telefono,
                                    ci: solicitud.idPerfil.ci,
                                }
                                : null,

                        almacenOrigen:
                            solicitud.idAlmacenOrigen
                                ? {
                                    _id: solicitud.idAlmacenOrigen._id,
                                    nombre: solicitud.idAlmacenOrigen.nombre,
                                    tipo: solicitud.idAlmacenOrigen.tipo,
                                    descripcion: solicitud.idAlmacenOrigen.descripcion,
                                    ubicacion: solicitud.idAlmacenOrigen.ubicacion,
                                    estado: solicitud.idAlmacenOrigen.estado,
                                }
                                : null,

                        almacenDestino:
                            solicitud.idAlmacenDestino
                                ? {
                                    _id: solicitud.idAlmacenDestino._id,
                                    nombre: solicitud.idAlmacenDestino.nombre,
                                    tipo: solicitud.idAlmacenDestino.tipo,
                                    descripcion: solicitud.idAlmacenDestino.descripcion,
                                    ubicacion: solicitud.idAlmacenDestino.ubicacion,
                                    estado: solicitud.idAlmacenDestino.estado,
                                }
                                : null,

                        fechaSolicitud:
                            solicitud.fechaSolicitud,

                        estado:
                            solicitud.estado,

                        observacion:
                            solicitud.observacion,

                        creadoPor:
                            solicitud.creadoPor,

                        actualizadoPor:
                            solicitud.actualizadoPor,

                        eliminadoPor:
                            solicitud.eliminadoPor,

                        fechaCreacion:
                            solicitud.fechaCreacion,

                        fechaActualizacion:
                            solicitud.fechaActualizacion,

                        fechaEliminado:
                            solicitud.fechaEliminado,

                        detalles:
                            detallesDeSolicitud,

                        totalProductos:
                            detallesDeSolicitud.length,

                        totalSolicitado,

                        totalAprobado,

                    };

                }
            );

            return res.json({
                sucursal,
                solicitudes: solicitudesLimpias,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error: "Error al obtener solicitudes por sucursal",
            });

        }

    };

}
