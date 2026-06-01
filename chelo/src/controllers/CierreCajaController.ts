import type { Request, Response } from "express"
import CierreCaja from "../models/CierreCaja"

export class CierreCajaController {

    //  Crear cierre de caja
    static createCierre = async (req: Request, res: Response) => {
        const cierre = new CierreCaja(req.body)

        try {
            //  cálculo backend (NO confiar en frontend)
            cierre.totalEsperado = cierre.montoInicial + cierre.totalVentas - cierre.totalEgresos
            cierre.diferencia = cierre.montoReal - cierre.totalEsperado

            //  definir estado automáticamente
            if (cierre.diferencia === 0) {
                cierre.estado = "cuadrado"
            } else {
                cierre.estado = "descuadre"
            }

            await cierre.save()

            res.send('Cierre de caja registrado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear cierre de caja' })
        }
    }

    //  Obtener todos
    static getAllCierres = async (req: Request, res: Response) => {
        try {
            const cierres = await CierreCaja.find({})
                .populate('idPerfil')
                .populate('idSucursal')
                .populate('idCaja')

            res.json(cierres)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener cierres' })
        }
    }

    //  Obtener por ID
    static getCierreById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const cierre = await CierreCaja.findById(id)
                .populate('idPerfil')
                .populate('idSucursal')
                .populate('idCaja')

            if (!cierre) {
                return res.status(404).json({
                    error: 'Cierre no encontrado'
                })
            }

            res.json(cierre)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener cierre' })
        }
    }

    //  Actualizar cierre
    static updateCierre = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const cierre = await CierreCaja.findById(id)

            if (!cierre) {
                return res.status(404).json({
                    error: 'Cierre no encontrado'
                })
            }

            //  actualización manual
            cierre.idPerfil = req.body.idPerfil || cierre.idPerfil
            cierre.idSucursal = req.body.idSucursal || cierre.idSucursal
            cierre.idCaja = req.body.idCaja || cierre.idCaja

            cierre.fechaApertura = req.body.fechaApertura || cierre.fechaApertura
            cierre.fechaCierre = req.body.fechaCierre || cierre.fechaCierre

            cierre.montoInicial = req.body.montoInicial ?? cierre.montoInicial
            cierre.totalVentas = req.body.totalVentas ?? cierre.totalVentas
            cierre.totalEgresos = req.body.totalEgresos ?? cierre.totalEgresos
            cierre.montoReal = req.body.montoReal ?? cierre.montoReal

            cierre.observacion = req.body.observacion || cierre.observacion

            //  recalcular SIEMPRE
            cierre.totalEsperado = cierre.montoInicial + cierre.totalVentas - cierre.totalEgresos
            cierre.diferencia = cierre.montoReal - cierre.totalEsperado

            //  actualizar estado
            cierre.estado = cierre.diferencia === 0 ? "cuadrado" : "descuadre"

            cierre.actualizadoPor = req.body.actualizadoPor
            cierre.fechaActualizacion = new Date()

            await cierre.save()

            res.send('Cierre actualizado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar cierre' })
        }
    }

    //  Eliminar (lógico)
    static deleteCierre = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const cierre = await CierreCaja.findById(id)

            if (!cierre) {
                return res.status(404).json({
                    error: 'Cierre no encontrado'
                })
            }

            //  eliminación lógica
            cierre.eliminadoPor = req.body.eliminadoPor || 1
            cierre.fechaEliminado = new Date()

            await cierre.save()

            res.send('Cierre eliminado (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar cierre' })
        }
    }


    // Obtener cierres por ID de caja
    static getCierresByCajaId =
        async (
            req: Request,
            res: Response
        ) => {

            try {

                /* =========================
                    PARAMS
                ========================= */

                const {
                    cajaId
                } = req.params;

                console.log(
                    "cajaId =>",
                    cajaId
                );

                /* =========================
                    QUERY
                ========================= */

                const cierres =
                    await CierreCaja.find({

                        idCaja: cajaId

                    })

                        .populate({

                            path: "idCaja",

                            select:
                                "nombre descripcion estado"

                        })

                        .populate({

                            path: "idPerfil",

                            select:
                                "nombres apellidos email"

                        })

                        .populate({

                            path: "idSucursal",

                            select:
                                "nombreSucursal ubicacionSucursal"

                        });

                console.log(
                    "cierres =>",
                    cierres
                );

                /* =========================
                    RESPONSE
                ========================= */

                res.json(
                    cierres
                );

            } catch (error) {

                console.log(error);

                res.status(500).json({

                    error:
                        "Error obteniendo cierres"

                });

            }

        }
}