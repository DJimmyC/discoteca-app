import type { Request, Response } from "express"
import AperturaCaja from "../models/AperturaCaja"

export class AperturaCajaController {

    //  Crear apertura de caja
    static createApertura = async (req: Request, res: Response) => {
        const apertura = new AperturaCaja(req.body)

        try {

            //  VALIDACIÓN PRO: evitar doble apertura en el mismo día
            const existe = await AperturaCaja.findOne({
                idCaja: apertura.idCaja,
                fecha: apertura.fecha,
                estado: true
            })

            if (existe) {
                return res.status(400).json({
                    error: 'La caja ya fue abierta en esta fecha'
                })
            }

            await apertura.save()

            res.send('Caja abierta correctamente')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al abrir caja' })
        }
    }

    //  Obtener todas las aperturas
    static getAllAperturas = async (req: Request, res: Response) => {
        try {
            const aperturas = await AperturaCaja.find({})
                .populate('idCaja')
                .populate('idPerfil')

            res.json(aperturas)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener aperturas' })
        }
    }

    //  Obtener por ID
    static getAperturaById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const apertura = await AperturaCaja.findById(id)
                .populate('idCaja')
                .populate('idPerfil')

            if (!apertura) {
                return res.status(404).json({
                    error: 'Apertura no encontrada'
                })
            }

            res.json(apertura)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener apertura' })
        }
    }

    //  Actualizar apertura
    static updateApertura = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const apertura = await AperturaCaja.findById(id)

            if (!apertura) {
                return res.status(404).json({
                    error: 'Apertura no encontrada'
                })
            }

            //  actualización manual
            apertura.idCaja = req.body.idCaja || apertura.idCaja
            apertura.idPerfil = req.body.idPerfil || apertura.idPerfil

            apertura.fecha = req.body.fecha || apertura.fecha
            apertura.horaApertura = req.body.horaApertura || apertura.horaApertura

            apertura.montoInicial = req.body.montoInicial ?? apertura.montoInicial
            apertura.observacion = req.body.observacion || apertura.observacion

            apertura.estado = req.body.estado ?? apertura.estado

            apertura.actualizadoPor = req.body.actualizadoPor
            apertura.fechaActualizacion = new Date()

            await apertura.save()

            res.send('Apertura actualizada')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar apertura' })
        }
    }

    //  Eliminar (lógico)
    static deleteApertura = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const apertura = await AperturaCaja.findById(id)

            if (!apertura) {
                return res.status(404).json({
                    error: 'Apertura no encontrada'
                })
            }

            //  eliminación lógica
            apertura.estado = false
            apertura.eliminadoPor = req.body.eliminadoPor || 'admin'
            apertura.fechaEliminado = new Date()

            await apertura.save()

            res.send('Apertura eliminada (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar apertura' })
        }
    }


static getAperturasByCajaId =
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

      const aperturas =
        await AperturaCaja.find({

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

        });

      console.log(
        "aperturas =>",
        aperturas
      );

      /* =========================
          RESPONSE
      ========================= */

      res.json(
        aperturas
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        error:
          "Error obteniendo aperturas"

      });

    }

  }

}