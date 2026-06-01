import type {
    Request,
    Response,
} from "express";

import mongoose from "mongoose";

import MovimientoInventario from "../models/MovimientoInventario";

export class MovimientoInventarioController {

    /* =========================
        HELPERS
    ========================= */

    private static toObjectId(id?: string) {

        if (!id) {
            return undefined;
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return undefined;
        }

        return new mongoose.Types.ObjectId(id);

    }

    private static buildDateFilter(
        field: string,
        desde?: string,
        hasta?: string
    ) {

        const filter: any = {};

        if (desde || hasta) {
            filter[field] = {};
        }

        if (desde) {
            filter[field].$gte = new Date(desde);
        }

        if (hasta) {
            const fechaHasta = new Date(hasta);
            fechaHasta.setHours(23, 59, 59, 999);

            filter[field].$lte = fechaHasta;
        }

        return filter;

    }

    private static buildBaseMatch(
        query: any
    ) {

        const {
            idSucursal,
            idAlmacen,
            idProducto,
            idPerfil,
            idCaja,
            tipoMovimiento,
            origenMovimiento,
            desde,
            hasta,
        } = query;

        const match: any = {
            fechaEliminado: {
                $exists: false,
            },
            ...this.buildDateFilter(
                "fechaMovimiento",
                desde,
                hasta
            ),
        };

        const sucursalObjectId =
            this.toObjectId(idSucursal);

        const almacenObjectId =
            this.toObjectId(idAlmacen);

        const productoObjectId =
            this.toObjectId(idProducto);

        const perfilObjectId =
            this.toObjectId(idPerfil);

        const cajaObjectId =
            this.toObjectId(idCaja);

        if (sucursalObjectId) {
            match.idSucursal = sucursalObjectId;
        }

        if (almacenObjectId) {
            match.idAlmacen = almacenObjectId;
        }

        if (productoObjectId) {
            match.idProducto = productoObjectId;
        }

        if (perfilObjectId) {
            match.idPerfil = perfilObjectId;
        }

        if (cajaObjectId) {
            match.idCaja = cajaObjectId;
        }

        if (tipoMovimiento) {
            match.tipoMovimiento = tipoMovimiento;
        }

        if (origenMovimiento) {
            match.origenMovimiento = origenMovimiento;
        }

        return match;

    }

    /* =========================
        POPULATE BASE
    ========================= */

    private static populateBase(query: any) {

        return query
            .populate({
                path: "idSucursal",
                select: "_id nombreSucursal ubicacionSucursal",
            })
            .populate({
                path: "idProducto",
                select: "_id nombre descripcion marca estado",
            })
            .populate({
                path: "idAlmacen",
                select: "_id nombre tipo descripcion ubicacion estado",
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
                path: "idVenta",
                select: "_id numeroVenta metodoPago total estado fechaVenta",
            })
            .populate({
                path: "idDetalleVenta",
                select: "_id cantidad precioUnitario subtotal",
            })
            .populate({
                path: "idEgreso",
                select: "_id numeroEgreso tipoEgreso metodoPago total estado fechaEgreso",
            })
            .populate({
                path: "idDetalleEgreso",
                select: "_id descripcion cantidad costoUnitario subtotal tipoItem",
            })
            .populate({
                path: "idSolicitud",
                select: "_id estado observacion fechaSolicitud",
            })
            .populate({
                path: "idDetalleSolicitud",
                select: "_id cantidadSolicitada cantidadAtendida observacion",
            })
            .populate({
                path: "idTransferencia",
                select: "_id estado observacion fechaCreacion",
            });

    }

    /* =========================
        CREAR MOVIMIENTO
    ========================= */

    static createMovimiento = async (
        req: Request,
        res: Response
    ) => {

        try {

            const movimiento = new MovimientoInventario({
                ...req.body,
                codigoMovimiento:
                    req.body.codigoMovimiento ||
                    `MOV-${Date.now()}`,
                fechaMovimiento:
                    req.body.fechaMovimiento ||
                    new Date(),
            });

            await movimiento.save();

            const movimientoCreado =
                await MovimientoInventario.findById(
                    movimiento._id
                );

            const movimientoPopulado =
                await this.populateBase(
                    movimientoCreado
                );

            return res.status(201).json({
                message: "Movimiento de inventario creado correctamente",
                movimiento: movimientoPopulado,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al crear movimiento de inventario",
            });

        }

    };

    /* =========================
        OBTENER TODOS
        Query opcional:
        ?idSucursal=
        ?idAlmacen=
        ?idProducto=
        ?idPerfil=
        ?idCaja=
        ?tipoMovimiento=
        ?origenMovimiento=
        ?desde=
        ?hasta=
    ========================= */

    static getAllMovimientos = async (
        req: Request,
        res: Response
    ) => {

        try {

            const match =
                this.buildBaseMatch(
                    req.query
                );

            const movimientosQuery =
                MovimientoInventario.find(match)
                    .sort({
                        fechaMovimiento: -1,
                    });

            const movimientos =
                await this.populateBase(
                    movimientosQuery
                );

            return res.json(movimientos);

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al obtener movimientos de inventario",
            });

        }

    };

    /* =========================
        OBTENER POR ID
    ========================= */

    static getMovimientoById = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                id,
            } = req.params;

            const movimientoQuery =
                MovimientoInventario.findOne({
                    _id: id,
                    fechaEliminado: {
                        $exists: false,
                    },
                });

            const movimiento =
                await this.populateBase(
                    movimientoQuery
                );

            if (!movimiento) {
                return res.status(404).json({
                    error: "Movimiento no encontrado",
                });
            }

            return res.json(movimiento);

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al obtener movimiento de inventario",
            });

        }

    };

    /* =========================
        ACTUALIZAR MOVIMIENTO
    ========================= */

    static updateMovimiento = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                id,
            } = req.params;

            const movimiento =
                await MovimientoInventario.findOne({
                    _id: id,
                    fechaEliminado: {
                        $exists: false,
                    },
                });

            if (!movimiento) {
                return res.status(404).json({
                    error: "Movimiento no encontrado",
                });
            }

            movimiento.idSucursal =
                req.body.idSucursal ||
                movimiento.idSucursal;

            movimiento.idProducto =
                req.body.idProducto ||
                movimiento.idProducto;

            movimiento.idAlmacen =
                req.body.idAlmacen ||
                movimiento.idAlmacen;

            movimiento.idCaja =
                req.body.idCaja ??
                movimiento.idCaja;

            movimiento.idPerfil =
                req.body.idPerfil ??
                movimiento.idPerfil;

            movimiento.idVenta =
                req.body.idVenta ??
                movimiento.idVenta;

            movimiento.idDetalleVenta =
                req.body.idDetalleVenta ??
                movimiento.idDetalleVenta;

            movimiento.idEgreso =
                req.body.idEgreso ??
                movimiento.idEgreso;

            movimiento.idDetalleEgreso =
                req.body.idDetalleEgreso ??
                movimiento.idDetalleEgreso;

            movimiento.idSolicitud =
                req.body.idSolicitud ??
                movimiento.idSolicitud;

            movimiento.idDetalleSolicitud =
                req.body.idDetalleSolicitud ??
                movimiento.idDetalleSolicitud;

            movimiento.idTransferencia =
                req.body.idTransferencia ??
                movimiento.idTransferencia;

            movimiento.tipoMovimiento =
                req.body.tipoMovimiento ||
                movimiento.tipoMovimiento;

            movimiento.origenMovimiento =
                req.body.origenMovimiento ||
                movimiento.origenMovimiento;

            movimiento.cantidad =
                req.body.cantidad ??
                movimiento.cantidad;

            movimiento.costoUnitario =
                req.body.costoUnitario ??
                movimiento.costoUnitario;

            movimiento.precioVenta =
                req.body.precioVenta ??
                movimiento.precioVenta;

            movimiento.stockAnterior =
                req.body.stockAnterior ??
                movimiento.stockAnterior;

            movimiento.stockNuevo =
                req.body.stockNuevo ??
                movimiento.stockNuevo;

            movimiento.fechaMovimiento =
                req.body.fechaMovimiento ||
                movimiento.fechaMovimiento;

            movimiento.observacion =
                req.body.observacion ??
                movimiento.observacion;

            movimiento.actualizadoPor =
                req.body.actualizadoPor ||
                "sistema";

            movimiento.fechaActualizacion =
                new Date();

            await movimiento.save();

            const movimientoActualizadoQuery =
                MovimientoInventario.findById(
                    movimiento._id
                );

            const movimientoActualizado =
                await this.populateBase(
                    movimientoActualizadoQuery
                );

            return res.json({
                message: "Movimiento actualizado correctamente",
                movimiento: movimientoActualizado,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al actualizar movimiento",
            });

        }

    };

    /* =========================
        ELIMINACIÓN LÓGICA
    ========================= */

    static deleteMovimiento = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                id,
            } = req.params;

            const movimiento =
                await MovimientoInventario.findOne({
                    _id: id,
                    fechaEliminado: {
                        $exists: false,
                    },
                });

            if (!movimiento) {
                return res.status(404).json({
                    error: "Movimiento no encontrado",
                });
            }

            movimiento.fechaEliminado =
                new Date();

            movimiento.eliminadoPor =
                req.body.eliminadoPor ||
                "sistema";

            await movimiento.save();

            return res.json({
                message: "Movimiento eliminado correctamente",
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al eliminar movimiento",
            });

        }

    };

    /* ============================================================
        SERVICIOS PARA REPORTES
    ============================================================ */

    /* =========================
        MOVIMIENTOS POR SUCURSAL
        /api/movimiento-inventario/sucursal/:idSucursal
        Query:
        ?desde=
        ?hasta=
        ?tipoMovimiento=
        ?origenMovimiento=
    ========================= */

    static getMovimientosBySucursal = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                idSucursal,
            } = req.params;

            const match =
                this.buildBaseMatch({
                    ...req.query,
                    idSucursal,
                });

            const movimientosQuery =
                MovimientoInventario.find(match)
                    .sort({
                        fechaMovimiento: -1,
                    });

            const movimientos =
                await this.populateBase(
                    movimientosQuery
                );

            const resumen =
                await MovimientoInventario.aggregate([
                    {
                        $match: match,
                    },
                    {
                        $group: {
                            _id: "$tipoMovimiento",
                            cantidadMovimientos: {
                                $sum: 1,
                            },
                            cantidadTotal: {
                                $sum: "$cantidad",
                            },
                            totalCosto: {
                                $sum: "$totalCosto",
                            },
                            totalVenta: {
                                $sum: "$totalVenta",
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            tipoMovimiento: "$_id",
                            cantidadMovimientos: 1,
                            cantidadTotal: 1,
                            totalCosto: 1,
                            totalVenta: 1,
                        },
                    },
                    {
                        $sort: {
                            cantidadTotal: -1,
                        },
                    },
                ]);

            const entradas =
                resumen
                    .filter((item) =>
                        [
                            "entrada_compra",
                            "entrada_transferencia",
                            "ajuste_entrada",
                            "devolucion",
                            "anulacion_venta",
                        ].includes(item.tipoMovimiento)
                    )
                    .reduce(
                        (acc, item) =>
                            acc + Number(item.cantidadTotal || 0),
                        0
                    );

            const salidas =
                resumen
                    .filter((item) =>
                        [
                            "salida_venta",
                            "salida_transferencia",
                            "ajuste_salida",
                            "merma",
                        ].includes(item.tipoMovimiento)
                    )
                    .reduce(
                        (acc, item) =>
                            acc + Number(item.cantidadTotal || 0),
                        0
                    );

            return res.json({
                filtros: {
                    idSucursal,
                    ...req.query,
                },
                resumenGeneral: {
                    totalMovimientos:
                        movimientos.length,
                    totalEntradas:
                        entradas,
                    totalSalidas:
                        salidas,
                    saldoMovimiento:
                        entradas - salidas,
                },
                resumenPorTipo:
                    resumen,
                movimientos,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al obtener movimientos por sucursal",
            });

        }

    };

    /* =========================
        MOVIMIENTOS POR ALMACÉN
        /api/movimiento-inventario/almacen/:idAlmacen
    ========================= */

    static getMovimientosByAlmacen = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                idAlmacen,
            } = req.params;

            const match =
                this.buildBaseMatch({
                    ...req.query,
                    idAlmacen,
                });

            const movimientosQuery =
                MovimientoInventario.find(match)
                    .sort({
                        fechaMovimiento: -1,
                    });

            const movimientos =
                await this.populateBase(
                    movimientosQuery
                );

            return res.json({
                filtros: {
                    idAlmacen,
                    ...req.query,
                },
                total:
                    movimientos.length,
                movimientos,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al obtener movimientos por almacén",
            });

        }

    };

    /* =========================
        MOVIMIENTOS POR PRODUCTO
        /api/movimiento-inventario/producto/:idProducto
    ========================= */

    static getMovimientosByProducto = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                idProducto,
            } = req.params;

            const match =
                this.buildBaseMatch({
                    ...req.query,
                    idProducto,
                });

            const movimientosQuery =
                MovimientoInventario.find(match)
                    .sort({
                        fechaMovimiento: -1,
                    });

            const movimientos =
                await this.populateBase(
                    movimientosQuery
                );

            return res.json({
                filtros: {
                    idProducto,
                    ...req.query,
                },
                total:
                    movimientos.length,
                movimientos,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al obtener movimientos por producto",
            });

        }

    };

    /* =========================
        KARDEX POR PRODUCTO
        /api/movimiento-inventario/kardex/:idProducto
        Query opcional:
        ?idAlmacen=
        ?idSucursal=
        ?desde=
        ?hasta=
    ========================= */

    static getKardexProducto = async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                idProducto,
            } = req.params;

            const match =
                this.buildBaseMatch({
                    ...req.query,
                    idProducto,
                });

            const movimientos =
                await MovimientoInventario.aggregate([
                    {
                        $match: match,
                    },
                    {
                        $lookup: {
                            from: "productos",
                            localField: "idProducto",
                            foreignField: "_id",
                            as: "producto",
                        },
                    },
                    {
                        $unwind: {
                            path: "$producto",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "almacenes",
                            localField: "idAlmacen",
                            foreignField: "_id",
                            as: "almacen",
                        },
                    },
                    {
                        $unwind: {
                            path: "$almacen",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $sort: {
                            fechaMovimiento: 1,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            codigoMovimiento: 1,
                            fechaMovimiento: 1,
                            tipoMovimiento: 1,
                            origenMovimiento: 1,
                            producto: {
                                _id: "$producto._id",
                                nombre: "$producto.nombre",
                                marca: "$producto.marca",
                            },
                            almacen: {
                                _id: "$almacen._id",
                                nombre: "$almacen.nombre",
                                tipo: "$almacen.tipo",
                            },
                            cantidad: 1,
                            costoUnitario: 1,
                            precioVenta: 1,
                            totalCosto: 1,
                            totalVenta: 1,
                            stockAnterior: 1,
                            stockNuevo: 1,
                            observacion: 1,
                            creadoPor: 1,
                        },
                    },
                ]);

            const entradas =
                movimientos
                    .filter((item) =>
                        [
                            "entrada_compra",
                            "entrada_transferencia",
                            "ajuste_entrada",
                            "devolucion",
                            "anulacion_venta",
                        ].includes(item.tipoMovimiento)
                    )
                    .reduce(
                        (acc, item) =>
                            acc + Number(item.cantidad || 0),
                        0
                    );

            const salidas =
                movimientos
                    .filter((item) =>
                        [
                            "salida_venta",
                            "salida_transferencia",
                            "ajuste_salida",
                            "merma",
                        ].includes(item.tipoMovimiento)
                    )
                    .reduce(
                        (acc, item) =>
                            acc + Number(item.cantidad || 0),
                        0
                    );

            return res.json({
                filtros: {
                    idProducto,
                    ...req.query,
                },
                resumen: {
                    totalMovimientos:
                        movimientos.length,
                    totalEntradas:
                        entradas,
                    totalSalidas:
                        salidas,
                    saldo:
                        entradas - salidas,
                },
                movimientos,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al generar kardex del producto",
            });

        }

    };

    /* =========================
        RESUMEN DE MOVIMIENTOS
        /api/movimiento-inventario/resumen
        Query:
        ?idSucursal=
        ?idAlmacen=
        ?idProducto=
        ?idPerfil=
        ?idCaja=
        ?desde=
        ?hasta=
    ========================= */

    static getResumenMovimientos = async (
        req: Request,
        res: Response
    ) => {

        try {

            const match =
                this.buildBaseMatch(
                    req.query
                );

            const resumenPorTipo =
                await MovimientoInventario.aggregate([
                    {
                        $match: match,
                    },
                    {
                        $group: {
                            _id: "$tipoMovimiento",
                            cantidadMovimientos: {
                                $sum: 1,
                            },
                            cantidadTotal: {
                                $sum: "$cantidad",
                            },
                            totalCosto: {
                                $sum: "$totalCosto",
                            },
                            totalVenta: {
                                $sum: "$totalVenta",
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            tipoMovimiento: "$_id",
                            cantidadMovimientos: 1,
                            cantidadTotal: 1,
                            totalCosto: 1,
                            totalVenta: 1,
                        },
                    },
                    {
                        $sort: {
                            cantidadTotal: -1,
                        },
                    },
                ]);

            const resumenPorOrigen =
                await MovimientoInventario.aggregate([
                    {
                        $match: match,
                    },
                    {
                        $group: {
                            _id: "$origenMovimiento",
                            cantidadMovimientos: {
                                $sum: 1,
                            },
                            cantidadTotal: {
                                $sum: "$cantidad",
                            },
                            totalCosto: {
                                $sum: "$totalCosto",
                            },
                            totalVenta: {
                                $sum: "$totalVenta",
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            origenMovimiento: "$_id",
                            cantidadMovimientos: 1,
                            cantidadTotal: 1,
                            totalCosto: 1,
                            totalVenta: 1,
                        },
                    },
                    {
                        $sort: {
                            cantidadTotal: -1,
                        },
                    },
                ]);

            const entradas =
                resumenPorTipo
                    .filter((item) =>
                        [
                            "entrada_compra",
                            "entrada_transferencia",
                            "ajuste_entrada",
                            "devolucion",
                            "anulacion_venta",
                        ].includes(item.tipoMovimiento)
                    )
                    .reduce(
                        (acc, item) =>
                            acc + Number(item.cantidadTotal || 0),
                        0
                    );

            const salidas =
                resumenPorTipo
                    .filter((item) =>
                        [
                            "salida_venta",
                            "salida_transferencia",
                            "ajuste_salida",
                            "merma",
                        ].includes(item.tipoMovimiento)
                    )
                    .reduce(
                        (acc, item) =>
                            acc + Number(item.cantidadTotal || 0),
                        0
                    );

            return res.json({
                filtros:
                    req.query,
                resumenGeneral: {
                    totalEntradas:
                        entradas,
                    totalSalidas:
                        salidas,
                    saldo:
                        entradas - salidas,
                },
                resumenPorTipo,
                resumenPorOrigen,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al generar resumen de movimientos",
            });

        }

    };

    /* =========================
        PRODUCTOS CON MÁS MOVIMIENTOS
        /api/movimiento-inventario/top-productos
    ========================= */

    static getTopProductosMovimiento = async (
        req: Request,
        res: Response
    ) => {

        try {

            const match =
                this.buildBaseMatch(
                    req.query
                );

            const productos =
                await MovimientoInventario.aggregate([
                    {
                        $match: match,
                    },
                    {
                        $group: {
                            _id: "$idProducto",
                            cantidadMovida: {
                                $sum: "$cantidad",
                            },
                            cantidadMovimientos: {
                                $sum: 1,
                            },
                            totalCosto: {
                                $sum: "$totalCosto",
                            },
                            totalVenta: {
                                $sum: "$totalVenta",
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "productos",
                            localField: "_id",
                            foreignField: "_id",
                            as: "producto",
                        },
                    },
                    {
                        $unwind: {
                            path: "$producto",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            idProducto: "$_id",
                            nombre: "$producto.nombre",
                            marca: "$producto.marca",
                            cantidadMovida: 1,
                            cantidadMovimientos: 1,
                            totalCosto: 1,
                            totalVenta: 1,
                        },
                    },
                    {
                        $sort: {
                            cantidadMovida: -1,
                        },
                    },
                    {
                        $limit: 10,
                    },
                ]);

            return res.json({
                filtros:
                    req.query,
                productos,
            });

        } catch (error: any) {

            console.log(error);

            return res.status(500).json({
                error:
                    error.message ||
                    "Error al obtener top de productos por movimiento",
            });

        }

    };

}