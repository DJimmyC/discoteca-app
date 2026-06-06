// src/controllers/CajaController.ts

import type {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import Caja from "../models/Caja";
import AperturaCaja from "../models/AperturaCaja";

export class CajaController {

  static createCaja = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idSucursal,
        nombre,
        descripcion,
        estado,
        creadoPor,
      } = req.body;

      if (
        !idSucursal ||
        !mongoose.isValidObjectId(
          idSucursal
        )
      ) {
        return res.status(400).json({
          error:
            "El ID de la sucursal no es válido",
        });
      }

      if (
        !nombre ||
        !String(nombre).trim()
      ) {
        return res.status(400).json({
          error:
            "El nombre de la caja es obligatorio",
        });
      }

      const caja =
        await Caja.create({
          idSucursal,
          nombre:
            String(nombre).trim(),
          descripcion:
            descripcion || "",
          estado:
            estado ?? true,
          creadoPor:
            creadoPor || "sistema",
        });

      return res.status(201).json({
        message:
          "Caja creada correctamente",
        caja,
      });

    } catch (error: unknown) {

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        return res.status(409).json({
          error:
            "Ya existe una caja con ese nombre en la sucursal",
        });
      }

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al crear caja",
      });
    }
  };

  static getAllCajas = async (
    _req: Request,
    res: Response
  ) => {

    try {

      const cajas =
        await Caja.find({})
          .populate(
            "idSucursal"
          )
          .sort({
            fechaCreacion: -1,
          });

      return res.json(cajas);

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al obtener cajas",
      });
    }
  };

  static getCajaById = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        id,
      } = req.params;

      const caja =
        await Caja.findById(id)
          .populate(
            "idSucursal"
          );

      if (!caja) {
        return res.status(404).json({
          error:
            "Caja no encontrada",
        });
      }

      const aperturaActiva =
        await AperturaCaja.findOne({
          idCaja:
            caja._id,
          estado:
            "abierta",
        })
          .populate(
            "idPerfil"
          );

      return res.json({
        caja,
        aperturaActiva,
      });

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al obtener caja",
      });
    }
  };

  static updateCaja = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        id,
      } = req.params;

      const caja =
        await Caja.findById(id);

      if (!caja) {
        return res.status(404).json({
          error:
            "Caja no encontrada",
        });
      }

      if (
        req.body.nombre !==
        undefined
      ) {
        caja.nombre =
          String(
            req.body.nombre
          ).trim();
      }

      if (
        req.body.descripcion !==
        undefined
      ) {
        caja.descripcion =
          req.body.descripcion;
      }

      if (
        req.body.estado !==
        undefined
      ) {
        caja.estado =
          Boolean(
            req.body.estado
          );
      }

      caja.actualizadoPor =
        req.body.actualizadoPor ||
        "sistema";

      caja.fechaActualizacion =
        new Date();

      await caja.save();

      return res.json({
        message:
          "Caja actualizada correctamente",
        caja,
      });

    } catch (error: unknown) {

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar caja",
      });
    }
  };

  static deleteCaja = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        id,
      } = req.params;

      const aperturaActiva =
        await AperturaCaja.findOne({
          idCaja:
            id,
          estado:
            "abierta",
        });

      if (aperturaActiva) {
        return res.status(400).json({
          error:
            "No se puede desactivar una caja con una apertura activa",
        });
      }

      const caja =
        await Caja.findByIdAndUpdate(
          id,
          {
            estado:
              false,
            eliminadoPor:
              req.body
                .eliminadoPor ||
              "sistema",
            fechaEliminado:
              new Date(),
          },
          {
            new:
              true,
          }
        );

      if (!caja) {
        return res.status(404).json({
          error:
            "Caja no encontrada",
        });
      }

      return res.json({
        message:
          "Caja desactivada correctamente",
        caja,
      });

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al eliminar caja",
      });
    }
  };

  static getCajasBySucursal = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idSucursal,
      } = req.params;

      const cajas =
        await Caja.find({
          idSucursal,
          estado:
            true,
        })
          .populate(
            "idSucursal"
          )
          .sort({
            fechaCreacion: -1,
          });

      const cajasConEstado =
        await Promise.all(
          cajas.map(
            async (
              caja
            ) => {

              const aperturaActiva =
                await AperturaCaja.findOne({
                  idCaja:
                    caja._id,
                  estado:
                    "abierta",
                })
                  .select(
                    "_id fechaApertura montoInicial estado idPerfil"
                  )
                  .lean();

              return {
                ...caja.toObject(),
                aperturaActiva,
              };
            }
          )
        );

      return res.json(
        cajasConEstado
      );

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al obtener cajas por sucursal",
      });
    }
  };
}
