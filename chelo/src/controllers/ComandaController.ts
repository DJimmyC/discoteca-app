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



    // Obtener comandas por perfil con sus detalles
 static getComandasConDetallesPorPerfil = async (
    req: Request,
    res: Response
) => {

    try {

        const { idPerfil } = req.params;

        /*
            1. Buscar comandas del perfil
            Se seleccionan solo los datos necesarios.
        */
        const comandas = await Comanda.find({
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
            .sort({
                fechaCreacion: -1,
            })
            .lean();

        /*
            2. Si no existen comandas
        */
        if (comandas.length === 0) {
            return res.json({
                perfil: null,
                sucursal: null,
                comandas: [],
            });
        }

        /*
            3. Sacar perfil y sucursal una sola vez
        */
        const primeraComanda: any = comandas[0];

        const perfil = primeraComanda.idPerfil
            ? {
                _id: primeraComanda.idPerfil._id,
                nombres: primeraComanda.idPerfil.nombres,
                apellidos: primeraComanda.idPerfil.apellidos,
                email: primeraComanda.idPerfil.email,
                telefono: primeraComanda.idPerfil.telefono,
                ci: primeraComanda.idPerfil.ci,
            }
            : null;

        const sucursal = primeraComanda.idSucursal
            ? {
                _id: primeraComanda.idSucursal._id,
                nombreSucursal: primeraComanda.idSucursal.nombreSucursal,
                ubicacionSucursal: primeraComanda.idSucursal.ubicacionSucursal,
            }
            : primeraComanda.idPerfil?.idSucursal
                ? {
                    _id: primeraComanda.idPerfil.idSucursal._id,
                    nombreSucursal: primeraComanda.idPerfil.idSucursal.nombreSucursal,
                    ubicacionSucursal: primeraComanda.idPerfil.idSucursal.ubicacionSucursal,
                }
                : null;

        /*
            4. Obtener IDs de comandas
        */
        const idsComandas = comandas.map(
            (comanda) => comanda._id
        );

        /*
            5. Buscar detalles de esas comandas
        */
        const detalles = await DetalleComanda.find({
            idComanda: {
                $in: idsComandas,
            },
        })
            .populate({
                path: "idProducto",
                select: "_id nombre descripcion marca estado",
            })
            .lean();

        /*
            6. Armar comandas limpias
        */
        const comandasLimpias = comandas.map(
            (comanda: any) => {

                const detallesDeComanda = detalles
                    .filter(
                        (detalle: any) =>
                            detalle.idComanda.toString() ===
                            comanda._id.toString()
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
                        estado: detalle.estado,
                        observacion: detalle.observacion,
                        creadoPor: detalle.creadoPor,
                        fechaCreacion: detalle.fechaCreacion,
                    }));

                const total = detallesDeComanda.reduce(
                    (acc, detalle) =>
                        acc + Number(detalle.subtotal || 0),
                    0
                );

                return {
                    _id: comanda._id,

                    numeroComanda: comanda.numeroComanda,

                    estado: comanda.estado,

                    observacion: comanda.observacion,

                    creadoPor: comanda.creadoPor,

                    actualizadoPor: comanda.actualizadoPor,

                    eliminadoPor: comanda.eliminadoPor,

                    fechaApertura: comanda.fechaApertura,

                    fechaCierre: comanda.fechaCierre,

                    fechaCreacion: comanda.fechaCreacion,

                    fechaActualizacion: comanda.fechaActualizacion,

                    fechaEliminado: comanda.fechaEliminado,

                    detalles: detallesDeComanda,

                    total,
                };

            }
        );

        /*
            7. Respuesta final organizada
        */
        return res.json({
            perfil,
            sucursal,
            comandas: comandasLimpias,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al obtener comandas con detalles por perfil",
        });

    }

};
}