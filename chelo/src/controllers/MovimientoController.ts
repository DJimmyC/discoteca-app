import type { Request, Response } from "express";
import Movimiento from "../models/Movimiento";

export class MovimientoController {

    /* =========================
        CREAR MOVIMIENTO
        Endpoint normal
    ========================= */
    static createMovimiento = async (
        req: Request,
        res: Response
    ) => {

        try {

            const movimiento = new Movimiento(req.body);

            await movimiento.save();

            return res.json({
                message: "Movimiento registrado correctamente",
                movimiento,
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al registrar movimiento",
            });

        }

    };

    /* =========================
        REGISTRAR MOVIMIENTO
        Uso interno desde otros controllers
    ========================= */
    static registrarMovimiento = async (
        data: any
    ) => {

        try {

            const movimiento = new Movimiento({
                ...data,
                fecha: data.fecha || new Date(),
                fechaCreacion: new Date(),
            });

            await movimiento.save();

            return movimiento;

        } catch (error) {

            console.log("Error registrando movimiento:", error);

            throw new Error(
                "Error registrando movimiento"
            );

        }

    };

    /* =========================
        OBTENER TODOS LOS MOVIMIENTOS
    ========================= */
    static getAllMovimientos = async (
        req: Request,
        res: Response
    ) => {

        try {

            const movimientos = await Movimiento.find({})
                .populate({
                    path: "idSucursal",
                    select: "_id nombreSucursal ubicacionSucursal",
                })
                .populate({
                    path: "idCaja",
                    select: "_id nombre descripcion",
                })
                .populate({
                    path: "idPerfil",
                    select: "_id nombres apellidos email",
                })
                .populate({
                    path: "idAlmacen",
                    select: "_id nombre tipo descripcion",
                })
                .populate({
                    path: "idProducto",
                    select: "_id nombre descripcion marca",
                })
                .populate({
                    path: "idInventario",
                    select: "_id cantidad costoUnitario precioVenta stockMinimo",
                })
                .sort({
                    fecha: -1,
                });

            return res.json(movimientos);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al obtener movimientos",
            });

        }

    };

    /* =========================
        OBTENER MOVIMIENTO POR ID
    ========================= */
    static getMovimientoById = async (
        req: Request,
        res: Response
    ) => {

        const { id } = req.params;

        try {

            const movimiento = await Movimiento.findById(id)
                .populate({
                    path: "idSucursal",
                    select: "_id nombreSucursal ubicacionSucursal",
                })
                .populate({
                    path: "idCaja",
                    select: "_id nombre descripcion",
                })
                .populate({
                    path: "idPerfil",
                    select: "_id nombres apellidos email",
                })
                .populate({
                    path: "idAlmacen",
                    select: "_id nombre tipo descripcion",
                })
                .populate({
                    path: "idProducto",
                    select: "_id nombre descripcion marca",
                })
                .populate({
                    path: "idInventario",
                    select: "_id cantidad costoUnitario precioVenta stockMinimo",
                });

            if (!movimiento) {
                return res.status(404).json({
                    error: "Movimiento no encontrado",
                });
            }

            return res.json(movimiento);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al obtener movimiento",
            });

        }

    };

    /* =========================
        FILTRAR MOVIMIENTOS
        Por fecha, sucursal, caja, perfil,
        almacen, producto y tipo
    ========================= */
    static getMovimientosFiltrados = async (
        req: Request,
        res: Response
    ) => {

        const {
            fechaInicio,
            fechaFin,
            idSucursal,
            idCaja,
            idPerfil,
            idAlmacen,
            idProducto,
            tipoMovimiento,
            modulo,
            metodoPago,
            origenMovimiento,
        } = req.query;

        try {

            const filtro: any = {};

            if (fechaInicio || fechaFin) {

                filtro.fecha = {};

                if (fechaInicio) {
                    filtro.fecha.$gte = new Date(
                        fechaInicio as string
                    );
                }

                if (fechaFin) {

                    const fin = new Date(
                        fechaFin as string
                    );

                    fin.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    filtro.fecha.$lte = fin;

                }

            }

            if (idSucursal) {
                filtro.idSucursal = idSucursal;
            }

            if (idCaja) {
                filtro.idCaja = idCaja;
            }

            if (idPerfil) {
                filtro.idPerfil = idPerfil;
            }

            if (idAlmacen) {
                filtro.idAlmacen = idAlmacen;
            }

            if (idProducto) {
                filtro.idProducto = idProducto;
            }

            if (tipoMovimiento) {
                filtro.tipoMovimiento = tipoMovimiento;
            }

            if (modulo) {
                filtro.modulo = modulo;
            }

            if (metodoPago) {
                filtro.metodoPago = metodoPago;
            }

            if (origenMovimiento) {
                filtro.origenMovimiento = origenMovimiento;
            }

            const movimientos = await Movimiento.find(filtro)
                .populate({
                    path: "idSucursal",
                    select: "_id nombreSucursal ubicacionSucursal",
                })
                .populate({
                    path: "idCaja",
                    select: "_id nombre descripcion",
                })
                .populate({
                    path: "idPerfil",
                    select: "_id nombres apellidos email",
                })
                .populate({
                    path: "idAlmacen",
                    select: "_id nombre tipo descripcion",
                })
                .populate({
                    path: "idProducto",
                    select: "_id nombre descripcion marca",
                })
                .sort({
                    fecha: -1,
                });

            return res.json(movimientos);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al filtrar movimientos",
            });

        }

    };

    /* =========================
        REPORTE PRODUCTOS MAS VENDIDOS
    ========================= */
    static getProductosMasVendidos = async (
        req: Request,
        res: Response
    ) => {

        const {
            fechaInicio,
            fechaFin,
            idSucursal,
            idAlmacen,
            idPerfil,
            limite,
        } = req.query;

        try {

            const filtro: any = {
                tipoMovimiento: "salida_inventario",
                origenMovimiento: "venta",
            };

            if (fechaInicio || fechaFin) {

                filtro.fecha = {};

                if (fechaInicio) {
                    filtro.fecha.$gte = new Date(
                        fechaInicio as string
                    );
                }

                if (fechaFin) {

                    const fin = new Date(
                        fechaFin as string
                    );

                    fin.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    filtro.fecha.$lte = fin;

                }

            }

            if (idSucursal) {
                filtro.idSucursal = idSucursal;
            }

            if (idAlmacen) {
                filtro.idAlmacen = idAlmacen;
            }

            if (idPerfil) {
                filtro.idPerfil = idPerfil;
            }

            const limitNumber =
                Number(limite) || 10;

            const productos = await Movimiento.aggregate([

                {
                    $match: filtro,
                },

                {
                    $group: {
                        _id: "$idProducto",

                        cantidadVendida: {
                            $sum: "$cantidadSalida",
                        },

                        totalVendido: {
                            $sum: "$subtotal",
                        },

                        costoTotal: {
                            $sum: {
                                $multiply: [
                                    "$cantidadSalida",
                                    "$costoUnitario",
                                ],
                            },
                        },

                        utilidad: {
                            $sum: {
                                $subtract: [
                                    "$subtotal",
                                    {
                                        $multiply: [
                                            "$cantidadSalida",
                                            "$costoUnitario",
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },

                {
                    $sort: {
                        cantidadVendida: -1,
                    },
                },

                {
                    $limit: limitNumber,
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
                        producto: {
                            _id: "$producto._id",
                            nombre: "$producto.nombre",
                            descripcion: "$producto.descripcion",
                            marca: "$producto.marca",
                        },
                        cantidadVendida: 1,
                        totalVendido: 1,
                        costoTotal: 1,
                        utilidad: 1,
                    },
                },

            ]);

            return res.json(productos);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al obtener productos más vendidos",
            });

        }

    };

    /* =========================
        REPORTE DE CAJA DIARIA
        Basado en movimientos
    ========================= */
    static getReporteCajaDiaria = async (
        req: Request,
        res: Response
    ) => {

        const {
            fechaInicio,
            fechaFin,
            idSucursal,
            idCaja,
        } = req.query;

        try {

            const filtro: any = {};

            if (fechaInicio || fechaFin) {

                filtro.fecha = {};

                if (fechaInicio) {
                    filtro.fecha.$gte = new Date(
                        fechaInicio as string
                    );
                }

                if (fechaFin) {

                    const fin = new Date(
                        fechaFin as string
                    );

                    fin.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    filtro.fecha.$lte = fin;

                }

            }

            if (idSucursal) {
                filtro.idSucursal = idSucursal;
            }

            if (idCaja) {
                filtro.idCaja = idCaja;
            }

            const resumen = await Movimiento.aggregate([

                {
                    $match: filtro,
                },

                {
                    $group: {
                        _id: null,

                        montoInicial: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "apertura_caja",
                                        ],
                                    },
                                    "$montoInicial",
                                    0,
                                ],
                            },
                        },

                        ventasEfectivo: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "venta",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "efectivo",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoEntrada",
                                    0,
                                ],
                            },
                        },

                        ventasQr: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "venta",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "qr",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoEntrada",
                                    0,
                                ],
                            },
                        },

                        ventasTransferencia: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "venta",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "transferencia",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoEntrada",
                                    0,
                                ],
                            },
                        },

                        egresosEfectivo: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "egreso",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "efectivo",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoSalida",
                                    0,
                                ],
                            },
                        },

                        egresosQr: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "egreso",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "qr",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoSalida",
                                    0,
                                ],
                            },
                        },

                        egresosTransferencia: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "egreso",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "transferencia",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoSalida",
                                    0,
                                ],
                            },
                        },

                        cortesias: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "cortesia",
                                        ],
                                    },
                                    "$total",
                                    0,
                                ],
                            },
                        },

                        ventasAnuladas: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "venta_anulada",
                                        ],
                                    },
                                    "$total",
                                    0,
                                ],
                            },
                        },
                    },
                },

                {
                    $project: {
                        _id: 0,

                        montoInicial: 1,

                        ventas: {
                            efectivo: "$ventasEfectivo",
                            qr: "$ventasQr",
                            transferencia: "$ventasTransferencia",
                            total: {
                                $add: [
                                    "$ventasEfectivo",
                                    "$ventasQr",
                                    "$ventasTransferencia",
                                ],
                            },
                        },

                        egresos: {
                            efectivo: "$egresosEfectivo",
                            qr: "$egresosQr",
                            transferencia: "$egresosTransferencia",
                            total: {
                                $add: [
                                    "$egresosEfectivo",
                                    "$egresosQr",
                                    "$egresosTransferencia",
                                ],
                            },
                        },

                        cortesias: 1,

                        ventasAnuladas: 1,

                        montoEsperadoCajaFisica: {
                            $subtract: [
                                {
                                    $add: [
                                        "$montoInicial",
                                        "$ventasEfectivo",
                                    ],
                                },
                                "$egresosEfectivo",
                            ],
                        },
                    },
                },

            ]);

            return res.json(
                resumen[0] || {
                    montoInicial: 0,
                    ventas: {
                        efectivo: 0,
                        qr: 0,
                        transferencia: 0,
                        total: 0,
                    },
                    egresos: {
                        efectivo: 0,
                        qr: 0,
                        transferencia: 0,
                        total: 0,
                    },
                    cortesias: 0,
                    ventasAnuladas: 0,
                    montoEsperadoCajaFisica: 0,
                }
            );

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al obtener reporte de caja diaria",
            });

        }

    };

    /* =========================
        REPORTE ESTADO DE RESULTADOS
    ========================= */
    static getEstadoResultados = async (
        req: Request,
        res: Response
    ) => {

        const {
            fechaInicio,
            fechaFin,
            idSucursal,
        } = req.query;

        try {

            const filtro: any = {};

            if (fechaInicio || fechaFin) {

                filtro.fecha = {};

                if (fechaInicio) {
                    filtro.fecha.$gte = new Date(
                        fechaInicio as string
                    );
                }

                if (fechaFin) {

                    const fin = new Date(
                        fechaFin as string
                    );

                    fin.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    filtro.fecha.$lte = fin;

                }

            }

            if (idSucursal) {
                filtro.idSucursal = idSucursal;
            }

            const resumen = await Movimiento.aggregate([

                {
                    $match: filtro,
                },

                {
                    $group: {
                        _id: null,

                        ingresosVentas: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "venta",
                                        ],
                                    },
                                    "$montoEntrada",
                                    0,
                                ],
                            },
                        },

                        egresos: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "egreso",
                                        ],
                                    },
                                    "$montoSalida",
                                    0,
                                ],
                            },
                        },

                        cortesias: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "cortesia",
                                        ],
                                    },
                                    "$total",
                                    0,
                                ],
                            },
                        },

                        anuladas: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "venta_anulada",
                                        ],
                                    },
                                    "$total",
                                    0,
                                ],
                            },
                        },

                        costoVentas: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "salida_inventario",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$origenMovimiento",
                                                    "venta",
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        $multiply: [
                                            "$cantidadSalida",
                                            "$costoUnitario",
                                        ],
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                },

                {
                    $project: {
                        _id: 0,

                        ingresosVentas: 1,
                        cortesias: 1,
                        anuladas: 1,
                        costoVentas: 1,
                        egresos: 1,

                        utilidadBruta: {
                            $subtract: [
                                "$ingresosVentas",
                                "$costoVentas",
                            ],
                        },

                        utilidadNeta: {
                            $subtract: [
                                {
                                    $subtract: [
                                        "$ingresosVentas",
                                        "$costoVentas",
                                    ],
                                },
                                "$egresos",
                            ],
                        },
                    },
                },

            ]);

            return res.json(
                resumen[0] || {
                    ingresosVentas: 0,
                    cortesias: 0,
                    anuladas: 0,
                    costoVentas: 0,
                    egresos: 0,
                    utilidadBruta: 0,
                    utilidadNeta: 0,
                }
            );

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al obtener estado de resultados",
            });

        }

    };

    /* =========================
        REPORTE FLUJO DE EFECTIVO
    ========================= */
    static getFlujoEfectivo = async (
        req: Request,
        res: Response
    ) => {

        const {
            fechaInicio,
            fechaFin,
            idSucursal,
            idCaja,
        } = req.query;

        try {

            const filtro: any = {};

            if (fechaInicio || fechaFin) {

                filtro.fecha = {};

                if (fechaInicio) {
                    filtro.fecha.$gte = new Date(
                        fechaInicio as string
                    );
                }

                if (fechaFin) {

                    const fin = new Date(
                        fechaFin as string
                    );

                    fin.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    filtro.fecha.$lte = fin;

                }

            }

            if (idSucursal) {
                filtro.idSucursal = idSucursal;
            }

            if (idCaja) {
                filtro.idCaja = idCaja;
            }

            const resumen = await Movimiento.aggregate([

                {
                    $match: filtro,
                },

                {
                    $group: {
                        _id: null,

                        saldoInicial: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$tipoMovimiento",
                                            "apertura_caja",
                                        ],
                                    },
                                    "$montoInicial",
                                    0,
                                ],
                            },
                        },

                        entradasEfectivo: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "venta",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "efectivo",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoEntrada",
                                    0,
                                ],
                            },
                        },

                        entradasQr: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "venta",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "qr",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoEntrada",
                                    0,
                                ],
                            },
                        },

                        entradasTransferencia: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "venta",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "transferencia",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoEntrada",
                                    0,
                                ],
                            },
                        },

                        salidasEfectivo: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "egreso",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "efectivo",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoSalida",
                                    0,
                                ],
                            },
                        },

                        salidasQr: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "egreso",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "qr",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoSalida",
                                    0,
                                ],
                            },
                        },

                        salidasTransferencia: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$tipoMovimiento",
                                                    "egreso",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$metodoPago",
                                                    "transferencia",
                                                ],
                                            },
                                        ],
                                    },
                                    "$montoSalida",
                                    0,
                                ],
                            },
                        },
                    },
                },

                {
                    $project: {
                        _id: 0,

                        saldoInicial: 1,

                        entradas: {
                            efectivo: "$entradasEfectivo",
                            qr: "$entradasQr",
                            transferencia: "$entradasTransferencia",
                            total: {
                                $add: [
                                    "$entradasEfectivo",
                                    "$entradasQr",
                                    "$entradasTransferencia",
                                ],
                            },
                        },

                        salidas: {
                            efectivo: "$salidasEfectivo",
                            qr: "$salidasQr",
                            transferencia: "$salidasTransferencia",
                            total: {
                                $add: [
                                    "$salidasEfectivo",
                                    "$salidasQr",
                                    "$salidasTransferencia",
                                ],
                            },
                        },

                        flujoNeto: {
                            $subtract: [
                                {
                                    $add: [
                                        "$entradasEfectivo",
                                        "$entradasQr",
                                        "$entradasTransferencia",
                                    ],
                                },
                                {
                                    $add: [
                                        "$salidasEfectivo",
                                        "$salidasQr",
                                        "$salidasTransferencia",
                                    ],
                                },
                            ],
                        },

                        saldoFinalEsperado: {
                            $subtract: [
                                {
                                    $add: [
                                        "$saldoInicial",
                                        "$entradasEfectivo",
                                        "$entradasQr",
                                        "$entradasTransferencia",
                                    ],
                                },
                                {
                                    $add: [
                                        "$salidasEfectivo",
                                        "$salidasQr",
                                        "$salidasTransferencia",
                                    ],
                                },
                            ],
                        },
                    },
                },

            ]);

            return res.json(
                resumen[0] || {
                    saldoInicial: 0,
                    entradas: {
                        efectivo: 0,
                        qr: 0,
                        transferencia: 0,
                        total: 0,
                    },
                    salidas: {
                        efectivo: 0,
                        qr: 0,
                        transferencia: 0,
                        total: 0,
                    },
                    flujoNeto: 0,
                    saldoFinalEsperado: 0,
                }
            );

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al obtener flujo de efectivo",
            });

        }

    };

}