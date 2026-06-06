import type { Request, Response } from "express"
import Comanda from "../models/Comanda"
import DetalleComanda from "../models/DetalleComanda";
export class ComandaController {

    //  Crear comanda
    // static createComanda = async (req: Request, res: Response) => {
    //     const comanda = new Comanda(req.body)

    //     try {
    //         await comanda.save()
    //         res.send('Comanda creada')
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Error al crear comanda' })
    //     }
    // }
 static createComanda = async (
    req: Request,
    res: Response
) => {

    try {

        const ultimaComanda = await Comanda.findOne({
            numeroComanda: {
                $regex: /^CMD-\d+$/,
            },
        })
            .sort({
                _id: -1,
            });

        let siguienteNumero = 1;

        if (ultimaComanda?.numeroComanda) {

            const numeroActual = Number(
                ultimaComanda.numeroComanda.replace(
                    "CMD-",
                    ""
                )
            );

            if (!isNaN(numeroActual)) {
                siguienteNumero = numeroActual + 1;
            }

        }

        const numeroComanda =
            `CMD-${String(siguienteNumero).padStart(3, "0")}`;

        const comanda = new Comanda({
            ...req.body,
            numeroComanda,
            estado:
                req.body.estado || "en_proceso",
            fechaApertura:
                req.body.fechaApertura || new Date(),
            fechaCreacion:
                req.body.fechaCreacion || new Date(),
        });

        await comanda.save();

        res.status(201).json({
            message: "Comanda creada",
            comanda,
        });

    } catch (error: any) {

        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                error: "Ya existe una comanda con ese número. Intente nuevamente.",
            });
        }

        res.status(500).json({
            error: "Error al crear comanda",
        });

    }

};

    //  Obtener todas
    static getAllComandas = async (req: Request, res: Response) => {
        try {
            const comandas = await Comanda.find({})
                .populate('idPerfil')
                .populate('idSucursal')

            res.json(comandas)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener comandas' })
        }
    }

    //  Obtener por ID
    static getComandaById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const comanda = await Comanda.findById(id)
                .populate('idPerfil')
                .populate('idSucursal')

            if (!comanda) {
                const error = new Error('Comanda no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(comanda)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener comanda' })
        }
    }

    //  Actualizar comanda
    static updateComanda = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const comanda = await Comanda.findById(id)

            if (!comanda) {
                const error = new Error('Comanda no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual
            comanda.idPerfil = req.body.idPerfil || comanda.idPerfil
            comanda.idSucursal = req.body.idSucursal || comanda.idSucursal

            comanda.numeroComanda = req.body.numeroComanda || comanda.numeroComanda
            comanda.estado = req.body.estado || comanda.estado

            comanda.fechaApertura = req.body.fechaApertura || comanda.fechaApertura
            comanda.fechaCierre = req.body.fechaCierre || comanda.fechaCierre

            comanda.observacion = req.body.observacion || comanda.observacion

            comanda.actualizadoPor = req.body.actualizadoPor
            comanda.fechaActualizacion = new Date()

            await comanda.save()

            res.send('Comanda actualizada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar comanda' })
        }
    }

    //  Eliminar (lógico)
    static deleteComanda = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const comanda = await Comanda.findById(id)

            if (!comanda) {
                const error = new Error('Comanda no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            //  eliminación lógica
            comanda.estado = "anulado" //  importante en comandas
            comanda.eliminadoPor = req.body.eliminadoPor || 1
            comanda.fechaEliminado = new Date()

            await comanda.save()

            res.send('Comanda anulada (eliminación lógica)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar comanda' })
        }
    }



  static getComandasConDetallesPorPerfil = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            idPerfil,
        } = req.params;

        /* =========================
            1. VALIDAR ID PERFIL
        ========================= */

        if (!idPerfil) {

            return res.status(400).json({
                error:
                    "El ID del perfil es obligatorio",
            });

        }

        /* =========================
            2. BUSCAR COMANDAS
        ========================= */

        const comandas =
            await Comanda.find({
                idPerfil,
            })
                .populate({
                    path:
                        "idPerfil",

                    select:
                        "_id nombres apellidos email telefono ci idSucursal idAlmacen",

                    populate: [
                        {
                            path:
                                "idSucursal",

                            select:
                                "_id nombreSucursal ubicacionSucursal",
                        },
                        {
                            path:
                                "idAlmacen",

                            select:
                                "_id idSucursal nombre descripcion tipo ubicacion estado",
                        },
                    ],
                })
                .populate({
                    path:
                        "idSucursal",

                    select:
                        "_id nombreSucursal ubicacionSucursal",
                })
                .sort({
                    fechaCreacion:
                        -1,
                })
                .lean();

        /* =========================
            3. SIN COMANDAS
        ========================= */

        if (
            comandas.length === 0
        ) {

            return res.json({

                perfil:
                    null,

                sucursal:
                    null,

                almacen:
                    null,

                comandas:
                    [],

            });

        }

        /* =========================
            4. PERFIL, SUCURSAL
            Y ALMACÉN GENERAL
        ========================= */

        const primeraComanda: any =
            comandas[0];

        const perfil =
            primeraComanda.idPerfil
                ? {

                    _id:
                        primeraComanda
                            .idPerfil
                            ._id,

                    nombres:
                        primeraComanda
                            .idPerfil
                            .nombres,

                    apellidos:
                        primeraComanda
                            .idPerfil
                            .apellidos,

                    email:
                        primeraComanda
                            .idPerfil
                            .email,

                    telefono:
                        primeraComanda
                            .idPerfil
                            .telefono,

                    ci:
                        primeraComanda
                            .idPerfil
                            .ci,

                }
                : null;

        const sucursal =
            primeraComanda.idSucursal
                ? {

                    _id:
                        primeraComanda
                            .idSucursal
                            ._id,

                    nombreSucursal:
                        primeraComanda
                            .idSucursal
                            .nombreSucursal,

                    ubicacionSucursal:
                        primeraComanda
                            .idSucursal
                            .ubicacionSucursal,

                }
                : primeraComanda
                    .idPerfil
                    ?.idSucursal
                    ? {

                        _id:
                            primeraComanda
                                .idPerfil
                                .idSucursal
                                ._id,

                        nombreSucursal:
                            primeraComanda
                                .idPerfil
                                .idSucursal
                                .nombreSucursal,

                        ubicacionSucursal:
                            primeraComanda
                                .idPerfil
                                .idSucursal
                                .ubicacionSucursal,

                    }
                    : null;

        const almacen =
            primeraComanda
                .idPerfil
                ?.idAlmacen
                ? {

                    _id:
                        primeraComanda
                            .idPerfil
                            .idAlmacen
                            ._id,

                    idSucursal:
                        primeraComanda
                            .idPerfil
                            .idAlmacen
                            .idSucursal,

                    nombre:
                        primeraComanda
                            .idPerfil
                            .idAlmacen
                            .nombre,

                    descripcion:
                        primeraComanda
                            .idPerfil
                            .idAlmacen
                            .descripcion,

                    tipo:
                        primeraComanda
                            .idPerfil
                            .idAlmacen
                            .tipo,

                    ubicacion:
                        primeraComanda
                            .idPerfil
                            .idAlmacen
                            .ubicacion,

                    estado:
                        primeraComanda
                            .idPerfil
                            .idAlmacen
                            .estado,

                }
                : null;

        /* =========================
            5. IDS DE COMANDAS
        ========================= */

        const idsComandas =
            comandas.map(
                (comanda) =>
                    comanda._id
            );

        /* =========================
            6. BUSCAR DETALLES
            CON TODAS LAS RELACIONES
        ========================= */

        const detalles =
            await DetalleComanda.find({

                idComanda: {
                    $in:
                        idsComandas,
                },

            })
                .populate({
                    path:
                        "idProducto",

                    select:
                        "_id nombre descripcion marca estado",
                })
                .populate({
                    path:
                        "idInventario",

                    select:
                        "_id idAlmacen idProducto cantidad costoUnitario precioVenta stockMinimo estado creadoPor fechaCreacion",

                    populate: [
                        {
                            path:
                                "idProducto",

                            select:
                                "_id nombre descripcion marca estado",
                        },
                        {
                            path:
                                "idAlmacen",

                            select:
                                "_id idSucursal nombre descripcion tipo ubicacion estado",
                        },
                    ],
                })
                .populate({
                    path:
                        "idAlmacen",

                    select:
                        "_id idSucursal nombre descripcion tipo ubicacion estado",
                })
                .sort({
                    fechaCreacion:
                        1,
                })
                .lean();

        /* =========================
            7. ARMAR COMANDAS
        ========================= */

        const comandasLimpias =
            comandas.map(
                (comanda: any) => {

                    const detallesDeComanda =
                        detalles
                            .filter(
                                (
                                    detalle: any
                                ) =>
                                    String(
                                        detalle.idComanda
                                    ) ===
                                    String(
                                        comanda._id
                                    )
                            )
                            .map(
                                (
                                    detalle: any
                                ) => {

                                    /*
                                        Producto poblado directamente.
                                    */
                                    const producto =
                                        detalle.idProducto &&
                                        typeof detalle.idProducto ===
                                            "object"
                                            ? {
                                                _id:
                                                    detalle
                                                        .idProducto
                                                        ._id,

                                                nombre:
                                                    detalle
                                                        .idProducto
                                                        .nombre,

                                                descripcion:
                                                    detalle
                                                        .idProducto
                                                        .descripcion,

                                                marca:
                                                    detalle
                                                        .idProducto
                                                        .marca,

                                                estado:
                                                    detalle
                                                        .idProducto
                                                        .estado,
                                            }
                                            : null;

                                    /*
                                        Inventario poblado.
                                    */
                                    const inventario =
                                        detalle.idInventario &&
                                        typeof detalle.idInventario ===
                                            "object"
                                            ? {
                                                _id:
                                                    detalle
                                                        .idInventario
                                                        ._id,

                                                idProducto:
                                                    detalle
                                                        .idInventario
                                                        .idProducto,

                                                idAlmacen:
                                                    detalle
                                                        .idInventario
                                                        .idAlmacen,

                                                cantidad:
                                                    Number(
                                                        detalle
                                                            .idInventario
                                                            .cantidad ||
                                                        0
                                                    ),

                                                costoUnitario:
                                                    Number(
                                                        detalle
                                                            .idInventario
                                                            .costoUnitario ||
                                                        0
                                                    ),

                                                precioVenta:
                                                    Number(
                                                        detalle
                                                            .idInventario
                                                            .precioVenta ||
                                                        0
                                                    ),

                                                stockMinimo:
                                                    Number(
                                                        detalle
                                                            .idInventario
                                                            .stockMinimo ||
                                                        0
                                                    ),

                                                estado:
                                                    detalle
                                                        .idInventario
                                                        .estado,
                                            }
                                            : detalle.idInventario ||
                                            null;

                                    /*
                                        Almacén guardado directamente
                                        en detalle_comandas.

                                        Para comandas antiguas se usa
                                        como respaldo el almacén del
                                        inventario o del perfil.
                                    */
                                    let almacenDetalle =
                                        null;

                                    if (
                                        detalle.idAlmacen &&
                                        typeof detalle.idAlmacen ===
                                            "object"
                                    ) {

                                        almacenDetalle = {

                                            _id:
                                                detalle
                                                    .idAlmacen
                                                    ._id,

                                            idSucursal:
                                                detalle
                                                    .idAlmacen
                                                    .idSucursal,

                                            nombre:
                                                detalle
                                                    .idAlmacen
                                                    .nombre,

                                            descripcion:
                                                detalle
                                                    .idAlmacen
                                                    .descripcion,

                                            tipo:
                                                detalle
                                                    .idAlmacen
                                                    .tipo,

                                            ubicacion:
                                                detalle
                                                    .idAlmacen
                                                    .ubicacion,

                                            estado:
                                                detalle
                                                    .idAlmacen
                                                    .estado,

                                        };

                                    } else if (
                                        detalle
                                            .idInventario
                                            ?.idAlmacen &&
                                        typeof detalle
                                            .idInventario
                                            .idAlmacen ===
                                            "object"
                                    ) {

                                        almacenDetalle = {

                                            _id:
                                                detalle
                                                    .idInventario
                                                    .idAlmacen
                                                    ._id,

                                            idSucursal:
                                                detalle
                                                    .idInventario
                                                    .idAlmacen
                                                    .idSucursal,

                                            nombre:
                                                detalle
                                                    .idInventario
                                                    .idAlmacen
                                                    .nombre,

                                            descripcion:
                                                detalle
                                                    .idInventario
                                                    .idAlmacen
                                                    .descripcion,

                                            tipo:
                                                detalle
                                                    .idInventario
                                                    .idAlmacen
                                                    .tipo,

                                            ubicacion:
                                                detalle
                                                    .idInventario
                                                    .idAlmacen
                                                    .ubicacion,

                                            estado:
                                                detalle
                                                    .idInventario
                                                    .idAlmacen
                                                    .estado,

                                        };

                                    } else {

                                        almacenDetalle =
                                            almacen;

                                    }

                                    const cantidad =
                                        Number(
                                            detalle.cantidad ||
                                            0
                                        );

                                    /*
                                        Usa el precio guardado en el
                                        detalle. Si es una comanda
                                        antigua con precio 0, usa como
                                        respaldo precioVenta del inventario.
                                    */
                                    const precioUnitarioGuardado =
                                        Number(
                                            detalle
                                                .precioUnitario ||
                                            0
                                        );

                                    const precioInventario =
                                        detalle
                                            .idInventario &&
                                        typeof detalle
                                            .idInventario ===
                                            "object"
                                            ? Number(
                                                detalle
                                                    .idInventario
                                                    .precioVenta ||
                                                0
                                            )
                                            : 0;

                                    const precioUnitario =
                                        precioUnitarioGuardado >
                                            0
                                            ? precioUnitarioGuardado
                                            : precioInventario;

                                    /*
                                        Recalcular subtotal para
                                        comandas antiguas con subtotal 0.
                                    */
                                    const subtotalGuardado =
                                        Number(
                                            detalle.subtotal ||
                                            0
                                        );

                                    const subtotal =
                                        subtotalGuardado >
                                            0
                                            ? subtotalGuardado
                                            : cantidad *
                                            precioUnitario;

                                    return {

                                        _id:
                                            detalle._id,

                                        /*
                                            Se devuelve también el ID
                                            o populate original.
                                        */
                                        idProducto:
                                            detalle.idProducto ||
                                            null,

                                        producto,

                                        idInventario:
                                            inventario,

                                        idAlmacen:
                                            almacenDetalle,

                                        cantidad,

                                        precioUnitario,

                                        subtotal,

                                        estado:
                                            detalle.estado,

                                        observacion:
                                            detalle.observacion ||
                                            "",

                                        creadoPor:
                                            detalle.creadoPor,

                                        actualizadoPor:
                                            detalle
                                                .actualizadoPor,

                                        eliminadoPor:
                                            detalle
                                                .eliminadoPor,

                                        fechaCreacion:
                                            detalle
                                                .fechaCreacion,

                                        fechaActualizacion:
                                            detalle
                                                .fechaActualizacion,

                                        fechaEliminado:
                                            detalle
                                                .fechaEliminado,

                                    };

                                }
                            );

                    /* =========================
                        TOTAL DE LA COMANDA
                    ========================= */

                    const total =
                        detallesDeComanda.reduce(
                            (
                                acumulado,
                                detalle
                            ) =>
                                acumulado +
                                Number(
                                    detalle.subtotal ||
                                    0
                                ),
                            0
                        );

                    return {

                        _id:
                            comanda._id,

                        numeroComanda:
                            comanda.numeroComanda,

                        estado:
                            comanda.estado,

                        observacion:
                            comanda.observacion,

                        creadoPor:
                            comanda.creadoPor,

                        actualizadoPor:
                            comanda.actualizadoPor,

                        eliminadoPor:
                            comanda.eliminadoPor,

                        fechaApertura:
                            comanda.fechaApertura,

                        fechaCierre:
                            comanda.fechaCierre,

                        fechaCreacion:
                            comanda.fechaCreacion,

                        fechaActualizacion:
                            comanda.fechaActualizacion,

                        fechaEliminado:
                            comanda.fechaEliminado,

                        detalles:
                            detallesDeComanda,

                        total,

                    };

                }
            );

        /* =========================
            8. RESPUESTA FINAL
        ========================= */

        return res.json({

            perfil,

            sucursal,

            almacen,

            comandas:
                comandasLimpias,

        });

    } catch (error) {

        console.log(
            "Error obteniendo comandas con detalles:",
            error
        );

        return res.status(500).json({

            error:
                error instanceof Error
                    ? error.message
                    : "Error al obtener comandas con detalles por perfil",

        });

    }

};
}