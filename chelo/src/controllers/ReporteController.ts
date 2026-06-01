// src/controllers/ReporteController.ts

import type { Request, Response } from "express";
import mongoose from "mongoose";

import Venta from "../models/Venta";
import DetalleVenta from "../models/DetalleVenta";
import Egreso from "../models/Egreso";
import Inventario from "../models/Inventario";
import MovimientoInventario from "../models/MovimientoInventario";

export class ReporteController {

    /* =========================
        HELPERS
    ========================= */

    private static toObjectId(id?: string) {
        if (!id) return undefined;

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

    private static getFiltrosBaseVentas(query: any) {
        const {
            idSucursal,
            idPerfil,
            idCaja,
            desde,
            hasta,
        } = query;

        const match: any = {
            estado: {
                $ne: "anulado",
            },
            ...ReporteController.buildDateFilter(
                "fechaVenta",
                desde,
                hasta
            ),
        };

        const sucursalObjectId =
            ReporteController.toObjectId(idSucursal);

        const perfilObjectId =
            ReporteController.toObjectId(idPerfil);

        const cajaObjectId =
            ReporteController.toObjectId(idCaja);

        if (sucursalObjectId) {
            match.idSucursal = sucursalObjectId;
        }

        if (perfilObjectId) {
            match.idPerfil = perfilObjectId;
        }

        if (cajaObjectId) {
            match.idCaja = cajaObjectId;
        }

        return match;
    }

    private static getFiltrosBaseEgresos(query: any) {
        const {
            idSucursal,
            idPerfil,
            idCaja,
            desde,
            hasta,
        } = query;

        const match: any = {
            estado: {
                $ne: "anulado",
            },
            ...ReporteController.buildDateFilter(
                "fechaEgreso",
                desde,
                hasta
            ),
        };

        const sucursalObjectId =
            ReporteController.toObjectId(idSucursal);

        const perfilObjectId =
            ReporteController.toObjectId(idPerfil);

        const cajaObjectId =
            ReporteController.toObjectId(idCaja);

        if (sucursalObjectId) {
            match.idSucursal = sucursalObjectId;
        }

        if (perfilObjectId) {
            match.idPerfil = perfilObjectId;
        }

        if (cajaObjectId) {
            match.idCaja = cajaObjectId;
        }

        return match;
    }

    private static getFiltrosBaseMovimientos(query: any) {
        const {
            idSucursal,
            idPerfil,
            idCaja,
            idAlmacen,
            idProducto,
            desde,
            hasta,
        } = query;

        const match: any = {
            fechaEliminado: {
                $exists: false,
            },
            ...ReporteController.buildDateFilter(
                "fechaMovimiento",
                desde,
                hasta
            ),
        };

        const sucursalObjectId =
            ReporteController.toObjectId(idSucursal);

        const perfilObjectId =
            ReporteController.toObjectId(idPerfil);

        const cajaObjectId =
            ReporteController.toObjectId(idCaja);

        const almacenObjectId =
            ReporteController.toObjectId(idAlmacen);

        const productoObjectId =
            ReporteController.toObjectId(idProducto);

        if (sucursalObjectId) {
            match.idSucursal = sucursalObjectId;
        }

        if (perfilObjectId) {
            match.idPerfil = perfilObjectId;
        }

        if (cajaObjectId) {
            match.idCaja = cajaObjectId;
        }

        if (almacenObjectId) {
            match.idAlmacen = almacenObjectId;
        }

        if (productoObjectId) {
            match.idProducto = productoObjectId;
        }

        return match;
    }

    /* ============================================================
        1. REPORTE DE SUCURSALES
        Saber qué sucursal vende más
        GET /api/reportes/sucursales-ventas
    ============================================================ */

    static getReporteVentasPorSucursal = async (
        req: Request,
        res: Response
    ) => {
        try {
            const {
                desde,
                hasta,
            } = req.query as {
                desde?: string;
                hasta?: string;
            };

            const match = {
                estado: {
                    $ne: "anulado",
                },
                ...ReporteController.buildDateFilter(
                    "fechaVenta",
                    desde,
                    hasta
                ),
            };

            const reporte = await Venta.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: "$idSucursal",
                        cantidadVentas: {
                            $sum: 1,
                        },
                        subtotalVentas: {
                            $sum: "$subtotal",
                        },
                        descuentos: {
                            $sum: "$descuento",
                        },
                        totalVentas: {
                            $sum: "$total",
                        },
                        promedioVenta: {
                            $avg: "$total",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "sucursals",
                        localField: "_id",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        idSucursal: "$_id",
                        nombreSucursal: "$sucursal.nombreSucursal",
                        ubicacionSucursal: "$sucursal.ubicacionSucursal",
                        cantidadVentas: 1,
                        subtotalVentas: 1,
                        descuentos: 1,
                        totalVentas: 1,
                        promedioVenta: 1,
                    },
                },
                {
                    $sort: {
                        totalVentas: -1,
                    },
                },
            ]);

            return res.json({
                filtros: {
                    desde: desde || null,
                    hasta: hasta || null,
                },
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar reporte de ventas por sucursal",
            });
        }
    };

    /* ============================================================
        2. REPORTE POR VENDEDOR / MESERO
        Cuánto vendió cada mesero o barra en su jornada
        GET /api/reportes/vendedores-ventas
    ============================================================ */

    static getReporteVentasPorVendedor = async (
        req: Request,
        res: Response
    ) => {
        try {
            const match =
                ReporteController.getFiltrosBaseVentas(
                    req.query
                );

            const reporte = await Venta.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: "$idPerfil",
                        cantidadVentas: {
                            $sum: 1,
                        },
                        subtotalVentas: {
                            $sum: "$subtotal",
                        },
                        descuentos: {
                            $sum: "$descuento",
                        },
                        totalVentas: {
                            $sum: "$total",
                        },
                        promedioVenta: {
                            $avg: "$total",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "perfil_usuarios",
                        localField: "_id",
                        foreignField: "_id",
                        as: "perfil",
                    },
                },
                {
                    $unwind: {
                        path: "$perfil",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "sucursals",
                        localField: "perfil.idSucursal",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        idPerfil: "$_id",
                        nombres: "$perfil.nombres",
                        apellidos: "$perfil.apellidos",
                        telefono: "$perfil.telefono",
                        email: "$perfil.email",
                        idSucursal: "$sucursal._id",
                        sucursal: "$sucursal.nombreSucursal",
                        cantidadVentas: 1,
                        subtotalVentas: 1,
                        descuentos: 1,
                        totalVentas: 1,
                        promedioVenta: 1,
                    },
                },
                {
                    $sort: {
                        totalVentas: -1,
                    },
                },
            ]);

            return res.json({
                filtros: req.query,
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar reporte de ventas por vendedor",
            });
        }
    };

    /* ============================================================
        3. REPORTE DE SUCURSAL CON VENTAS DE MESEROS
        Ver ventas de meseros agrupadas por sucursal
        GET /api/reportes/sucursal-vendedores
    ============================================================ */

    static getReporteSucursalVendedores = async (
        req: Request,
        res: Response
    ) => {
        try {
            const match =
                ReporteController.getFiltrosBaseVentas(
                    req.query
                );

            const reporte = await Venta.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: {
                            idSucursal: "$idSucursal",
                            idPerfil: "$idPerfil",
                        },
                        cantidadVentas: {
                            $sum: 1,
                        },
                        totalVentas: {
                            $sum: "$total",
                        },
                        promedioVenta: {
                            $avg: "$total",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "sucursals",
                        localField: "_id.idSucursal",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "perfil_usuarios",
                        localField: "_id.idPerfil",
                        foreignField: "_id",
                        as: "perfil",
                    },
                },
                {
                    $unwind: {
                        path: "$perfil",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        idSucursal: "$_id.idSucursal",
                        sucursal: "$sucursal.nombreSucursal",
                        idPerfil: "$_id.idPerfil",
                        vendedor: {
                            $concat: [
                                {
                                    $ifNull: [
                                        "$perfil.nombres",
                                        "",
                                    ],
                                },
                                " ",
                                {
                                    $ifNull: [
                                        "$perfil.apellidos",
                                        "",
                                    ],
                                },
                            ],
                        },
                        cantidadVentas: 1,
                        totalVentas: 1,
                        promedioVenta: 1,
                    },
                },
                {
                    $sort: {
                        sucursal: 1,
                        totalVentas: -1,
                    },
                },
            ]);

            return res.json({
                filtros: req.query,
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar reporte de sucursal con vendedores",
            });
        }
    };

    /* ============================================================
        4. FLUJO DE EFECTIVO POR SUCURSAL
        Entradas por ventas, salidas por egresos, flujo neto
        GET /api/reportes/flujo-efectivo-sucursal
    ============================================================ */

    static getReporteFlujoEfectivoSucursal = async (
        req: Request,
        res: Response
    ) => {
        try {
            const {
                idSucursal,
                desde,
                hasta,
            } = req.query as {
                idSucursal?: string;
                desde?: string;
                hasta?: string;
            };

            const sucursalObjectId =
                ReporteController.toObjectId(idSucursal);

            const matchVentas: any = {
                estado: {
                    $ne: "anulado",
                },
                ...ReporteController.buildDateFilter(
                    "fechaVenta",
                    desde,
                    hasta
                ),
            };

            const matchEgresos: any = {
                estado: {
                    $ne: "anulado",
                },
                ...ReporteController.buildDateFilter(
                    "fechaEgreso",
                    desde,
                    hasta
                ),
            };

            if (sucursalObjectId) {
                matchVentas.idSucursal = sucursalObjectId;
                matchEgresos.idSucursal = sucursalObjectId;
            }

            const ventas = await Venta.aggregate([
                {
                    $match: matchVentas,
                },
                {
                    $group: {
                        _id: "$idSucursal",
                        totalEntradas: {
                            $sum: "$total",
                        },
                        cantidadVentas: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const egresos = await Egreso.aggregate([
                {
                    $match: matchEgresos,
                },
                {
                    $group: {
                        _id: "$idSucursal",
                        totalSalidas: {
                            $sum: "$total",
                        },
                        cantidadEgresos: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const idsSucursales = [
                ...new Set([
                    ...ventas.map((v) => String(v._id)),
                    ...egresos.map((e) => String(e._id)),
                ]),
            ].map((id) => new mongoose.Types.ObjectId(id));

            const sucursales = await Venta.aggregate([
                {
                    $match: {
                        idSucursal: {
                            $in: idsSucursales,
                        },
                    },
                },
                {
                    $group: {
                        _id: "$idSucursal",
                    },
                },
                {
                    $lookup: {
                        from: "sucursals",
                        localField: "_id",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        idSucursal: "$_id",
                        nombreSucursal: "$sucursal.nombreSucursal",
                    },
                },
            ]);

            const reporte = idsSucursales.map((id) => {
                const idString = String(id);

                const venta = ventas.find(
                    (item) => String(item._id) === idString
                );

                const egreso = egresos.find(
                    (item) => String(item._id) === idString
                );

                const sucursal = sucursales.find(
                    (item) => String(item.idSucursal) === idString
                );

                const totalEntradas =
                    Number(venta?.totalEntradas || 0);

                const totalSalidas =
                    Number(egreso?.totalSalidas || 0);

                return {
                    idSucursal: id,
                    sucursal:
                        sucursal?.nombreSucursal ||
                        "Sucursal",
                    cantidadVentas:
                        venta?.cantidadVentas || 0,
                    totalEntradas,
                    cantidadEgresos:
                        egreso?.cantidadEgresos || 0,
                    totalSalidas,
                    flujoNeto:
                        totalEntradas - totalSalidas,
                };
            });

            return res.json({
                filtros: req.query,
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar flujo de efectivo por sucursal",
            });
        }
    };

    /* ============================================================
        5. ESTADO DE RESULTADOS POR SUCURSAL
        Ventas - costo de ventas - egresos
        GET /api/reportes/estado-resultados-sucursal
    ============================================================ */

    static getReporteEstadoResultadosSucursal = async (
        req: Request,
        res: Response
    ) => {
        try {
            const {
                idSucursal,
                desde,
                hasta,
            } = req.query as {
                idSucursal?: string;
                desde?: string;
                hasta?: string;
            };

            const sucursalObjectId =
                ReporteController.toObjectId(idSucursal);

            const matchVentas: any = {
                estado: {
                    $ne: "anulado",
                },
                ...ReporteController.buildDateFilter(
                    "fechaVenta",
                    desde,
                    hasta
                ),
            };

            const matchEgresos: any = {
                estado: {
                    $ne: "anulado",
                },
                ...ReporteController.buildDateFilter(
                    "fechaEgreso",
                    desde,
                    hasta
                ),
            };

            const matchMovimientos: any = {
                tipoMovimiento: "salida_venta",
                fechaEliminado: {
                    $exists: false,
                },
                ...ReporteController.buildDateFilter(
                    "fechaMovimiento",
                    desde,
                    hasta
                ),
            };

            if (sucursalObjectId) {
                matchVentas.idSucursal = sucursalObjectId;
                matchEgresos.idSucursal = sucursalObjectId;
                matchMovimientos.idSucursal = sucursalObjectId;
            }

            const ventas = await Venta.aggregate([
                {
                    $match: matchVentas,
                },
                {
                    $group: {
                        _id: "$idSucursal",
                        ingresosVentas: {
                            $sum: "$total",
                        },
                        descuentos: {
                            $sum: "$descuento",
                        },
                        cantidadVentas: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const egresos = await Egreso.aggregate([
                {
                    $match: matchEgresos,
                },
                {
                    $group: {
                        _id: "$idSucursal",
                        egresosOperativos: {
                            $sum: "$total",
                        },
                        cantidadEgresos: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const costos = await MovimientoInventario.aggregate([
                {
                    $match: matchMovimientos,
                },
                {
                    $group: {
                        _id: "$idSucursal",
                        costoVentas: {
                            $sum: "$totalCosto",
                        },
                    },
                },
            ]);

            const idsSucursales = [
                ...new Set([
                    ...ventas.map((v) => String(v._id)),
                    ...egresos.map((e) => String(e._id)),
                    ...costos.map((c) => String(c._id)),
                ]),
            ].map((id) => new mongoose.Types.ObjectId(id));

            const sucursales = await Venta.aggregate([
                {
                    $match: {
                        idSucursal: {
                            $in: idsSucursales,
                        },
                    },
                },
                {
                    $group: {
                        _id: "$idSucursal",
                    },
                },
                {
                    $lookup: {
                        from: "sucursals",
                        localField: "_id",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        idSucursal: "$_id",
                        nombreSucursal: "$sucursal.nombreSucursal",
                    },
                },
            ]);

            const reporte = idsSucursales.map((id) => {
                const idString = String(id);

                const venta = ventas.find(
                    (item) => String(item._id) === idString
                );

                const egreso = egresos.find(
                    (item) => String(item._id) === idString
                );

                const costo = costos.find(
                    (item) => String(item._id) === idString
                );

                const sucursal = sucursales.find(
                    (item) => String(item.idSucursal) === idString
                );

                const ingresosVentas =
                    Number(venta?.ingresosVentas || 0);

                const costoVentas =
                    Number(costo?.costoVentas || 0);

                const utilidadBruta =
                    ingresosVentas - costoVentas;

                const egresosOperativos =
                    Number(egreso?.egresosOperativos || 0);

                const utilidadOperativa =
                    utilidadBruta - egresosOperativos;

                return {
                    idSucursal: id,
                    sucursal:
                        sucursal?.nombreSucursal ||
                        "Sucursal",
                    cantidadVentas:
                        venta?.cantidadVentas || 0,
                    ingresosVentas,
                    descuentos:
                        Number(venta?.descuentos || 0),
                    costoVentas,
                    utilidadBruta,
                    cantidadEgresos:
                        egreso?.cantidadEgresos || 0,
                    egresosOperativos,
                    utilidadOperativa,
                };
            });

            return res.json({
                filtros: req.query,
                reporte,
                nota: "El costo de ventas sale de movimientoinventarios tipo salida_venta usando totalCosto.",
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar estado de resultados por sucursal",
            });
        }
    };

    /* ============================================================
        6. MÉTODOS DE PAGO POR SUCURSAL
        Efectivo, QR, tarjeta, mixto
        GET /api/reportes/metodos-pago-sucursal
    ============================================================ */

    static getReporteMetodoPagoSucursal = async (
        req: Request,
        res: Response
    ) => {
        try {
            const match =
                ReporteController.getFiltrosBaseVentas(
                    req.query
                );

            const reporte = await Venta.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: {
                            idSucursal: "$idSucursal",
                            metodoPago: "$metodoPago",
                        },
                        cantidadVentas: {
                            $sum: 1,
                        },
                        total: {
                            $sum: "$total",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "sucursals",
                        localField: "_id.idSucursal",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        idSucursal: "$_id.idSucursal",
                        sucursal: "$sucursal.nombreSucursal",
                        metodoPago: "$_id.metodoPago",
                        cantidadVentas: 1,
                        total: 1,
                    },
                },
                {
                    $sort: {
                        sucursal: 1,
                        total: -1,
                    },
                },
            ]);

            return res.json({
                filtros: req.query,
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar reporte de métodos de pago por sucursal",
            });
        }
    };

    /* ============================================================
        7. PRODUCTO MÁS VENDIDO
        Desde detalle_ventas
        GET /api/reportes/productos-mas-vendidos
    ============================================================ */

    static getReporteProductosMasVendidos = async (
        req: Request,
        res: Response
    ) => {
        try {
            const {
                idSucursal,
                idPerfil,
                idCaja,
                idProducto,
                desde,
                hasta,
            } = req.query as {
                idSucursal?: string;
                idPerfil?: string;
                idCaja?: string;
                idProducto?: string;
                desde?: string;
                hasta?: string;
            };

            const matchVenta: any = {
                "venta.estado": {
                    $ne: "anulado",
                },
            };

            if (desde || hasta) {
                Object.assign(
                    matchVenta,
                    ReporteController.buildDateFilter(
                        "venta.fechaVenta",
                        desde,
                        hasta
                    )
                );
            }

            const sucursalObjectId =
                ReporteController.toObjectId(idSucursal);

            const perfilObjectId =
                ReporteController.toObjectId(idPerfil);

            const cajaObjectId =
                ReporteController.toObjectId(idCaja);

            const productoObjectId =
                ReporteController.toObjectId(idProducto);

            if (sucursalObjectId) {
                matchVenta["venta.idSucursal"] =
                    sucursalObjectId;
            }

            if (perfilObjectId) {
                matchVenta["venta.idPerfil"] =
                    perfilObjectId;
            }

            if (cajaObjectId) {
                matchVenta["venta.idCaja"] =
                    cajaObjectId;
            }

            if (productoObjectId) {
                matchVenta.idProducto =
                    productoObjectId;
            }

            const reporte = await DetalleVenta.aggregate([
                {
                    $lookup: {
                        from: "ventas",
                        localField: "idVenta",
                        foreignField: "_id",
                        as: "venta",
                    },
                },
                {
                    $unwind: "$venta",
                },
                {
                    $match: matchVenta,
                },
                {
                    $group: {
                        _id: "$idProducto",
                        cantidadVendida: {
                            $sum: "$cantidad",
                        },
                        totalGenerado: {
                            $sum: "$subtotal",
                        },
                        precioPromedio: {
                            $avg: "$precioUnitario",
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
                        producto: "$producto.nombre",
                        marca: "$producto.marca",
                        cantidadVendida: 1,
                        totalGenerado: 1,
                        precioPromedio: 1,
                    },
                },
                {
                    $sort: {
                        cantidadVendida: -1,
                    },
                },
            ]);

            return res.json({
                filtros: req.query,
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar reporte de productos más vendidos",
            });
        }
    };

    /* ============================================================
        8. EGRESOS POR SUCURSAL
        GET /api/reportes/egresos-sucursal
    ============================================================ */

    static getReporteEgresosPorSucursal = async (
        req: Request,
        res: Response
    ) => {
        try {
            const match =
                ReporteController.getFiltrosBaseEgresos(
                    req.query
                );

            const reporte = await Egreso.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: {
                            idSucursal: "$idSucursal",
                            tipoEgreso: "$tipoEgreso",
                        },
                        cantidadEgresos: {
                            $sum: 1,
                        },
                        totalEgresos: {
                            $sum: "$total",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "sucursals",
                        localField: "_id.idSucursal",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        idSucursal: "$_id.idSucursal",
                        sucursal: "$sucursal.nombreSucursal",
                        tipoEgreso: "$_id.tipoEgreso",
                        cantidadEgresos: 1,
                        totalEgresos: 1,
                    },
                },
                {
                    $sort: {
                        sucursal: 1,
                        totalEgresos: -1,
                    },
                },
            ]);

            return res.json({
                filtros: req.query,
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar reporte de egresos por sucursal",
            });
        }
    };

    /* ============================================================
        9. INVENTARIO POR SUCURSAL
        GET /api/reportes/inventario-sucursal
    ============================================================ */

    static getReporteInventarioPorSucursal = async (
        req: Request,
        res: Response
    ) => {
        try {
            const {
                idSucursal,
                idAlmacen,
                idProducto,
            } = req.query as {
                idSucursal?: string;
                idAlmacen?: string;
                idProducto?: string;
            };

            const sucursalObjectId =
                ReporteController.toObjectId(idSucursal);

            const almacenObjectId =
                ReporteController.toObjectId(idAlmacen);

            const productoObjectId =
                ReporteController.toObjectId(idProducto);

            const pipeline: any[] = [
                {
                    $match: {
                        estado: true,
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
                        preserveNullAndEmptyArrays: false,
                    },
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
                        from: "sucursals",
                        localField: "almacen.idSucursal",
                        foreignField: "_id",
                        as: "sucursal",
                    },
                },
                {
                    $unwind: {
                        path: "$sucursal",
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];

            if (sucursalObjectId) {
                pipeline.push({
                    $match: {
                        "almacen.idSucursal": sucursalObjectId,
                    },
                });
            }

            if (almacenObjectId) {
                pipeline.push({
                    $match: {
                        idAlmacen: almacenObjectId,
                    },
                });
            }

            if (productoObjectId) {
                pipeline.push({
                    $match: {
                        idProducto: productoObjectId,
                    },
                });
            }

            pipeline.push(
                {
                    $project: {
                        _id: 0,
                        idInventario: "$_id",
                        idSucursal: "$sucursal._id",
                        sucursal: "$sucursal.nombreSucursal",
                        idAlmacen: "$almacen._id",
                        almacen: "$almacen.nombre",
                        tipoAlmacen: "$almacen.tipo",
                        idProducto: "$producto._id",
                        producto: "$producto.nombre",
                        marca: "$producto.marca",
                        cantidad: 1,
                        stockMinimo: 1,
                        costoUnitario: 1,
                        precioVenta: 1,
                        valorCostoInventario: {
                            $multiply: [
                                "$cantidad",
                                "$costoUnitario",
                            ],
                        },
                        valorVentaInventario: {
                            $multiply: [
                                "$cantidad",
                                "$precioVenta",
                            ],
                        },
                        estadoStock: {
                            $cond: [
                                {
                                    $lte: [
                                        "$cantidad",
                                        0,
                                    ],
                                },
                                "agotado",
                                {
                                    $cond: [
                                        {
                                            $lte: [
                                                "$cantidad",
                                                "$stockMinimo",
                                            ],
                                        },
                                        "bajo_stock",
                                        "disponible",
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        sucursal: 1,
                        almacen: 1,
                        producto: 1,
                    },
                }
            );

            const reporte = await Inventario.aggregate(pipeline);

            return res.json({
                filtros: req.query,
                totalItems: reporte.length,
                reporte,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error al generar reporte de inventario por sucursal",
            });
        }
    };
}