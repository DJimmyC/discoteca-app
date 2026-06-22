// src/controllers/AperturaCajaController.ts

import type {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import AperturaCaja from "../models/AperturaCaja";
import Caja from "../models/Caja";
import Movimiento from "../models/Movimiento";

/* =========================
    UTILIDADES DE FECHA
========================= */

/*
  Bolivia usa UTC-4 todo el año.
  Acepta:
  - fechaApertura ISO completa
  - fecha + horaApertura heredadas
*/
function construirFechaApertura(
  body: Record<string, unknown>
): Date {

  if (
    typeof body.fechaApertura ===
    "string"
  ) {

    const fecha =
      new Date(
        body.fechaApertura
      );

    if (
      !Number.isNaN(
        fecha.getTime()
      )
    ) {
      return fecha;
    }
  }

  const fechaBase =
    typeof body.fecha ===
      "string"
      ? body.fecha.slice(0, 10)
      : new Date()
        .toISOString()
        .slice(0, 10);

  const hora =
    typeof body.horaApertura ===
      "string"
      ? body.horaApertura
      : new Date()
        .toLocaleTimeString(
          "es-BO",
          {
            hour:
              "2-digit",
            minute:
              "2-digit",
            hour12:
              false,
            timeZone:
              "America/La_Paz",
          }
        );

  const fecha =
    new Date(
      `${fechaBase}T${hora}:00-04:00`
    );

  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    throw new Error(
      "La fecha u hora de apertura no es válida"
    );
  }

  return fecha;
}

export class AperturaCajaController {

  static createApertura = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idCaja,
        idPerfil,
        montoInicial,
        observacion,
        creadoPor,
      } = req.body;

      if (
        !mongoose.isValidObjectId(
          idCaja
        )
      ) {
        return res.status(400).json({
          error:
            "El ID de caja no es válido",
        });
      }

      if (
        !mongoose.isValidObjectId(
          idPerfil
        )
      ) {
        return res.status(400).json({
          error:
            "El ID del perfil no es válido",
        });
      }

      const caja =
        await Caja.findOne({
          _id:
            idCaja,
          estado:
            true,
        });

      if (!caja) {
        return res.status(404).json({
          error:
            "La caja no existe o está inactiva",
        });
      }

      const aperturaActiva =
        await AperturaCaja.findOne({
          idCaja,
          estado:
            "abierta",
        });

      if (aperturaActiva) {
        return res.status(400).json({
          error:
            "La caja ya tiene una apertura activa",
          aperturaActiva,
        });
      }

      const monto =
        Number(
          montoInicial
        );

      if (
        !Number.isFinite(monto) ||
        monto < 0
      ) {
        return res.status(400).json({
          error:
            "El monto inicial no es válido",
        });
      }

      const fechaApertura =
        construirFechaApertura(
          req.body
        );

      const usuario =
        creadoPor ||
        "sistema";

      const apertura =
        await AperturaCaja.create({
          idCaja,
          idPerfil,
          idSucursal:
            caja.idSucursal,
          fechaApertura,
          montoInicial:
            monto,
          observacion:
            observacion || "",
          estado:
            "abierta",
          creadoPor:
            usuario,
        });

      await Movimiento.create({
        fecha:
          fechaApertura,
        tipoMovimiento:
          "apertura_caja",
        origenMovimiento:
          "apertura_caja",
        modulo:
          "caja",
        idSucursal:
          caja.idSucursal,
        idCaja,
        idPerfil,
        idAperturaCaja:
          apertura._id,
        referenciaId:
          apertura._id,
        referenciaModelo:
          "AperturaCaja",
        montoInicial:
          monto,
        montoEntrada:
          monto,
        total:
          monto,
        estado:
          "abierta",
        observacion:
          observacion ||
          "Apertura de caja",
        creadoPor:
          usuario,
      });

      return res.status(201).json({
        message:
          "Caja abierta correctamente",
        apertura,
      });

    } catch (error: unknown) {

      if (
        typeof error ===
        "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        return res.status(409).json({
          error:
            "La caja ya tiene una apertura activa",
        });
      }

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al abrir caja",
      });
    }
  };

  static getAllAperturas = async (
    _req: Request,
    res: Response
  ) => {

    try {

      const aperturas =
        await AperturaCaja.find({})
          .populate(
            "idCaja"
          )
          .populate(
            "idPerfil"
          )
          .populate(
            "idSucursal"
          )
          .sort({
            fechaApertura: -1,
          });

      return res.json(
        aperturas
      );

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al obtener aperturas",
      });
    }
  };

  static getAperturaById = async (
    req: Request,
    res: Response
  ) => {

    try {

      const apertura =
        await AperturaCaja.findById(
          req.params.id
        )
          .populate(
            "idCaja"
          )
          .populate(
            "idPerfil"
          )
          .populate(
            "idSucursal"
          );

      if (!apertura) {
        return res.status(404).json({
          error:
            "Apertura no encontrada",
        });
      }

      return res.json(
        apertura
      );

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al obtener apertura",
      });
    }
  };

  static getAperturaActivaByCaja =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const apertura =
          await AperturaCaja.findOne({
            idCaja:
              req.params.cajaId,
            estado:
              "abierta",
          })
            .populate(
              "idCaja"
            )
            .populate(
              "idPerfil"
            )
            .populate(
              "idSucursal"
            );

        return res.json(
          apertura
        );

      } catch (error) {

        return res.status(500).json({
          error:
            "Error al obtener apertura activa",
        });
      }
    };

  static updateApertura = async (
    req: Request,
    res: Response
  ) => {

    try {

      const apertura =
        await AperturaCaja.findById(
          req.params.id
        );

      if (!apertura) {
        return res.status(404).json({
          error:
            "Apertura no encontrada",
        });
      }

      if (
        apertura.estado !==
        "abierta"
      ) {
        return res.status(400).json({
          error:
            "Solo se puede modificar una apertura activa",
        });
      }

      if (
        req.body.montoInicial !==
        undefined
      ) {

        const monto =
          Number(
            req.body.montoInicial
          );

        if (
          !Number.isFinite(monto) ||
          monto < 0
        ) {
          return res.status(400).json({
            error:
              "El monto inicial no es válido",
          });
        }

        apertura.montoInicial =
          monto;
      }

      if (
        req.body.observacion !==
        undefined
      ) {
        apertura.observacion =
          req.body.observacion;
      }

      apertura.actualizadoPor =
        req.body.actualizadoPor ||
        "sistema";

      apertura.fechaActualizacion =
        new Date();

      await apertura.save();

      return res.json({
        message:
          "Apertura actualizada correctamente",
        apertura,
      });

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al actualizar apertura",
      });
    }
  };

  static deleteApertura = async (
    req: Request,
    res: Response
  ) => {

    try {

      const apertura =
        await AperturaCaja.findById(
          req.params.id
        );

      if (!apertura) {
        return res.status(404).json({
          error:
            "Apertura no encontrada",
        });
      }

      if (
        apertura.estado ===
        "cerrada"
      ) {
        return res.status(400).json({
          error:
            "No se puede anular una apertura ya cerrada",
        });
      }

      apertura.estado =
        "anulada";

      apertura.eliminadoPor =
        req.body.eliminadoPor ||
        "sistema";

      apertura.fechaEliminado =
        new Date();

      await apertura.save();

      return res.json({
        message:
          "Apertura anulada correctamente",
        apertura,
      });

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al anular apertura",
      });
    }
  };

  static getAperturasByCajaId =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const aperturas =
          await AperturaCaja.find({
            idCaja:
              req.params.cajaId,
          })
            .populate(
              "idCaja"
            )
            .populate(
              "idPerfil"
            )
            .populate(
              "idSucursal"
            )
            .sort({
              fechaApertura: -1,
            });

        return res.json(
          aperturas
        );

      } catch (error) {

        return res.status(500).json({
          error:
            "Error obteniendo aperturas",
        });
      }
    };
  /* =========================
  OBTENER APERTURAS ACTIVAS
  POR SUCURSAL
========================= */

  static getAperturasActivasBySucursal = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        idSucursal,
      } = req.params;

      if (
        !mongoose.isValidObjectId(
          idSucursal
        )
      ) {
        return res.status(400).json({
          error:
            "El ID de la sucursal no es válido",
        });
      }

      const aperturas =
        await AperturaCaja.find({
          idSucursal,
          estado:
            "abierta",
        })
          .populate({
            path:
              "idCaja",
            select:
              "_id nombre descripcion estado idSucursal",
          })
          .populate({
            path:
              "idPerfil",
            select:
              "_id nombres apellidos email ci telefono",
          })
          .populate({
            path:
              "idSucursal",
            select:
              "_id nombreSucursal ubicacionSucursal",
          })
          .sort({
            fechaApertura:
              -1,
          });

      return res.json(
        aperturas
      );
    } catch (error) {
      console.log(
        "Error obteniendo aperturas activas por sucursal:",
        error
      );

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error obteniendo aperturas activas por sucursal",
      });
    }
  };
}
