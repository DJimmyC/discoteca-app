// src/controllers/DetalleSolicitudController.ts

import type {
  Request,
  Response,
} from "express";

import DetalleSolicitud from "../models/DetalleSolicitud";
import Solicitud from "../models/Solicitud";

export class DetalleSolicitudController {

  /* =========================
      CREAR DETALLE
  ========================= */

  static createDetalle =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          idSolicitud,
          idProducto,
          cantidadSolicitada,
          cantidadAprobada,
          cantidadAtendida,
          unidad,
          estado,
          observacion,
          creadoPor,
        } = req.body;

        if (!idSolicitud) {

          return res.status(400).json({
            error:
              "El ID de la solicitud es obligatorio",
          });

        }

        if (!idProducto) {

          return res.status(400).json({
            error:
              "El ID del producto es obligatorio",
          });

        }

        const solicitud =
          await Solicitud.findById(
            idSolicitud
          );

        if (!solicitud) {

          return res.status(404).json({
            error:
              "Solicitud no encontrada",
          });

        }

        if (
          solicitud.estado !==
          "pendiente"
        ) {

          return res.status(400).json({
            error:
              "Solo se pueden agregar productos a una solicitud pendiente",
          });

        }

        const solicitada =
          Number(
            cantidadSolicitada
          );

        const aprobada =
          Number(
            cantidadAprobada ||
            0
          );

        const atendida =
          Number(
            cantidadAtendida ||
            0
          );

        if (
          !Number.isFinite(
            solicitada
          ) ||
          solicitada <= 0
        ) {

          return res.status(400).json({
            error:
              "La cantidad solicitada debe ser mayor a cero",
          });

        }

        if (
          aprobada < 0 ||
          atendida < 0
        ) {

          return res.status(400).json({
            error:
              "Las cantidades no pueden ser negativas",
          });

        }

        const detalleExistente =
          await DetalleSolicitud.findOne({
            idSolicitud,
            idProducto,
          });

        if (detalleExistente) {

          return res.status(400).json({
            error:
              "El producto ya está registrado en esta solicitud",
          });

        }

        const detalle =
          new DetalleSolicitud({

            idSolicitud,

            idProducto,

            cantidadSolicitada:
              solicitada,

            cantidadAprobada:
              aprobada,

            cantidadAtendida:
              atendida,

            unidad:
              unidad ||
              "unidad",

            estado:
              estado ||
              "pendiente",

            observacion:
              observacion ||
              "",

            creadoPor:
              creadoPor ||
              "sistema",

          });

        await detalle.save();

        return res
          .status(201)
          .json({

            message:
              "Detalle de solicitud creado",

            detalle,

          });

      } catch (error: any) {

        console.log(
          "Error creando detalle de solicitud:",
          error
        );

        if (
          error?.code ===
          11000
        ) {

          return res.status(400).json({
            error:
              "El producto ya está registrado en esta solicitud",
          });

        }

        return res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Error al crear detalle de solicitud",
        });

      }

    };

  /* =========================
      OBTENER TODOS
  ========================= */

  static getAllDetalles =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const detalles =
          await DetalleSolicitud
            .find({})
            .populate({
              path:
                "idSolicitud",

              select:
                "_id estado fechaSolicitud observacion",
            })
            .populate({
              path:
                "idProducto",

              select:
                "_id nombre descripcion marca estado",
            })
            .sort({
              fechaCreacion:
                -1,
            });

        return res.json(
          detalles
        );

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al obtener detalles de solicitud",
        });

      }

    };

  /* =========================
      OBTENER POR SOLICITUD
  ========================= */

  static getDetallesBySolicitud =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          idSolicitud,
        } = req.params;

        const detalles =
          await DetalleSolicitud
            .find({
              idSolicitud,
            })
            .populate({
              path:
                "idProducto",

              select:
                "_id nombre descripcion marca estado",
            })
            .sort({
              fechaCreacion:
                1,
            });

        return res.json(
          detalles
        );

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al obtener detalles de la solicitud",
        });

      }

    };

  /* =========================
      OBTENER POR ID
  ========================= */

  static getDetalleById =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          id,
        } = req.params;

        const detalle =
          await DetalleSolicitud
            .findById(id)
            .populate(
              "idSolicitud"
            )
            .populate(
              "idProducto"
            );

        if (!detalle) {

          return res.status(404).json({
            error:
              "Detalle no encontrado",
          });

        }

        return res.json(
          detalle
        );

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al obtener detalle de solicitud",
        });

      }

    };

  /* =========================
      ACTUALIZAR DETALLE
  ========================= */

  static updateDetalle =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          id,
        } = req.params;

        const detalle =
          await DetalleSolicitud.findById(
            id
          );

        if (!detalle) {

          return res.status(404).json({
            error:
              "Detalle no encontrado",
          });

        }

        const solicitud =
          await Solicitud.findById(
            detalle.idSolicitud
          );

        if (!solicitud) {

          return res.status(404).json({
            error:
              "Solicitud no encontrada",
          });

        }

        if (
          solicitud.estado ===
            "atendida" ||
          solicitud.estado ===
            "anulada"
        ) {

          return res.status(400).json({
            error:
              "No se puede modificar el detalle de una solicitud finalizada",
          });

        }

        if (
          req.body.idProducto
        ) {

          detalle.idProducto =
            req.body.idProducto;

        }

        if (
          req.body.cantidadSolicitada !==
          undefined
        ) {

          detalle.cantidadSolicitada =
            Number(
              req.body.cantidadSolicitada
            );

        }

        if (
          req.body.cantidadAprobada !==
          undefined
        ) {

          detalle.cantidadAprobada =
            Number(
              req.body.cantidadAprobada
            );

        }

        if (
          req.body.cantidadAtendida !==
          undefined
        ) {

          detalle.cantidadAtendida =
            Number(
              req.body.cantidadAtendida
            );

        }

        if (
          req.body.unidad !==
          undefined
        ) {

          detalle.unidad =
            req.body.unidad;

        }

        if (
          req.body.estado !==
          undefined
        ) {

          detalle.estado =
            req.body.estado;

        }

        if (
          req.body.observacion !==
          undefined
        ) {

          detalle.observacion =
            req.body.observacion;

        }

        detalle.actualizadoPor =
          req.body.actualizadoPor ||
          "sistema";

        detalle.fechaActualizacion =
          new Date();

        await detalle.save();

        return res.json({

          message:
            "Detalle actualizado",

          detalle,

        });

      } catch (error: any) {

        console.log(error);

        return res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Error al actualizar detalle",
        });

      }

    };

  /* =========================
      ELIMINACIÓN LÓGICA
  ========================= */

  static deleteDetalle =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          id,
        } = req.params;

        const detalle =
          await DetalleSolicitud.findById(
            id
          );

        if (!detalle) {

          return res.status(404).json({
            error:
              "Detalle no encontrado",
          });

        }

        if (
          detalle.estado ===
          "anulado"
        ) {

          return res.status(400).json({
            error:
              "El detalle ya está anulado",
          });

        }

        detalle.estado =
          "anulado";

        detalle.eliminadoPor =
          req.body.eliminadoPor ||
          "admin";

        detalle.fechaEliminado =
          new Date();

        await detalle.save();

        return res.json({
          message:
            "Detalle de solicitud anulado",
        });

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al eliminar detalle de solicitud",
        });

      }

    };

}