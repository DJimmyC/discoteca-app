// src/controllers/SolicitudController.ts

import type {
  Request,
  Response,
} from "express";

import Solicitud from "../models/Solicitud";
import DetalleSolicitud from "../models/DetalleSolicitud";

import {
  ajustarStockInventario,
} from "./InventarioStcokService";

export class SolicitudController {

  /* =========================
      CREAR SOLICITUD
  ========================= */

  static createSolicitud =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          idPerfil,
          idSucursal,
          idAlmacenOrigen,
          idAlmacenDestino,
          fechaSolicitud,
          observacion,
          creadoPor,
        } = req.body;

        if (!idPerfil) {

          return res.status(400).json({
            error:
              "El perfil es obligatorio",
          });

        }

        if (!idSucursal) {

          return res.status(400).json({
            error:
              "La sucursal es obligatoria",
          });

        }

        if (!idAlmacenDestino) {

          return res.status(400).json({
            error:
              "El almacén destino es obligatorio",
          });

        }

        if (
          idAlmacenOrigen &&
          String(
            idAlmacenOrigen
          ) ===
          String(
            idAlmacenDestino
          )
        ) {

          return res.status(400).json({
            error:
              "El almacén origen y destino no pueden ser iguales",
          });

        }

        const solicitud =
          new Solicitud({

            idPerfil,

            idSucursal,

            idAlmacenOrigen:
              idAlmacenOrigen ||
              null,

            idAlmacenDestino,

            fechaSolicitud:
              fechaSolicitud ||
              new Date(),

            estado:
              "pendiente",

            observacion:
              observacion ||
              "",

            creadoPor:
              creadoPor ||
              "sistema",

          });

        await solicitud.save();

        return res
          .status(201)
          .json({

            message:
              "Solicitud creada",

            solicitud,

          });

      } catch (error: any) {

        console.log(error);

        return res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Error al crear solicitud",
        });

      }

    };

  /* =========================
      OBTENER TODAS
  ========================= */

  static getAllSolicitudes =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const solicitudes =
          await Solicitud
            .find({})
            .populate(
              "idPerfil"
            )
            .populate(
              "idSucursal"
            )
            .populate(
              "idAlmacenOrigen"
            )
            .populate(
              "idAlmacenDestino"
            )
            .sort({
              fechaCreacion:
                -1,
            });

        return res.json(
          solicitudes
        );

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al obtener solicitudes",
        });

      }

    };

  /* =========================
      OBTENER POR ID
  ========================= */

  static getSolicitudById =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          id,
        } = req.params;

        const solicitud =
          await Solicitud
            .findById(id)
            .populate(
              "idPerfil"
            )
            .populate(
              "idSucursal"
            )
            .populate(
              "idAlmacenOrigen"
            )
            .populate(
              "idAlmacenDestino"
            );

        if (!solicitud) {

          return res.status(404).json({
            error:
              "Solicitud no encontrada",
          });

        }

        return res.json(
          solicitud
        );

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al obtener solicitud",
        });

      }

    };

  /* =========================
      ACTUALIZAR SOLICITUD
  ========================= */

  static updateSolicitud =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          id,
        } = req.params;

        const solicitud =
          await Solicitud.findById(
            id
          );

        if (!solicitud) {

          return res.status(404).json({
            error:
              "Solicitud no encontrada",
          });

        }

        const estadoAnterior =
          solicitud.estado;

        const nuevoOrigen =
          req.body.idAlmacenOrigen !==
          undefined
            ? req.body.idAlmacenOrigen
            : solicitud.idAlmacenOrigen;

        const nuevoDestino =
          req.body.idAlmacenDestino ||
          solicitud.idAlmacenDestino;

        if (
          nuevoOrigen &&
          nuevoDestino &&
          String(
            nuevoOrigen
          ) ===
          String(
            nuevoDestino
          )
        ) {

          return res.status(400).json({
            error:
              "El almacén origen y destino no pueden ser iguales",
          });

        }

        /*
          No permitimos volver a ejecutar
          una solicitud ya atendida.
        */
        if (
          estadoAnterior ===
            "atendida" &&
          req.body.estado &&
          req.body.estado !==
            "atendida"
        ) {

          return res.status(400).json({
            error:
              "Una solicitud atendida no puede cambiar nuevamente de estado",
          });

        }

        solicitud.idPerfil =
          req.body.idPerfil ||
          solicitud.idPerfil;

        solicitud.idSucursal =
          req.body.idSucursal ||
          solicitud.idSucursal;

        solicitud.idAlmacenOrigen =
          nuevoOrigen ||
          null;

        solicitud.idAlmacenDestino =
          nuevoDestino;

        solicitud.fechaSolicitud =
          req.body.fechaSolicitud
            ? new Date(
                req.body.fechaSolicitud
              )
            : solicitud.fechaSolicitud;

        solicitud.observacion =
          req.body.observacion !==
          undefined
            ? req.body.observacion
            : solicitud.observacion;

        const nuevoEstado =
          req.body.estado ||
          solicitud.estado;

        /*
          APROBAR:
          solamente cambia estado.
          Todavía no modifica inventario.
        */
        if (
          estadoAnterior !==
            "aprobada" &&
          nuevoEstado ===
            "aprobada"
        ) {

          const detalles =
            await DetalleSolicitud.find({
              idSolicitud:
                solicitud._id,

              estado: {
                $ne:
                  "anulado",
              },
            });

          if (
            detalles.length ===
            0
          ) {

            return res.status(400).json({
              error:
                "La solicitud no tiene productos",
            });

          }

          for (
            const detalle
            of detalles
          ) {

            if (
              Number(
                detalle
                  .cantidadAprobada ||
                0
              ) <= 0
            ) {

              detalle.cantidadAprobada =
                detalle
                  .cantidadSolicitada;

            }

            detalle.estado =
              "aprobado";

            detalle.actualizadoPor =
              req.body.actualizadoPor ||
              "sistema";

            detalle.fechaActualizacion =
              new Date();

            await detalle.save();

          }

        }

        /*
          ATENDER:
          aquí sí se mueve el inventario.
        */
        const pasaAAtendida =
          estadoAnterior !==
            "atendida" &&
          nuevoEstado ===
            "atendida";

        const pasaAParcial =
          nuevoEstado ===
            "parcialmente_atendida" &&
          estadoAnterior !==
            "parcialmente_atendida";

        if (
          pasaAAtendida ||
          pasaAParcial
        ) {

          const detalles =
            await DetalleSolicitud.find({
              idSolicitud:
                solicitud._id,

              estado: {
                $ne:
                  "anulado",
              },
            });

          if (
            detalles.length ===
            0
          ) {

            return res.status(400).json({
              error:
                "La solicitud no tiene productos",
            });

          }

          for (
            const detalle
            of detalles
          ) {

            let cantidad =
              Number(
                detalle
                  .cantidadAtendida ||
                0
              );

            /*
              Para atención completa, si todavía
              no indicaron cantidad atendida,
              usamos la aprobada.
            */
            if (
              pasaAAtendida &&
              cantidad <= 0
            ) {

              cantidad =
                Number(
                  detalle
                    .cantidadAprobada ||
                  detalle
                    .cantidadSolicitada
                );

              detalle.cantidadAtendida =
                cantidad;

            }

            if (
              cantidad <= 0
            ) {
              continue;
            }

            /*
              Traslado interno:
              resta origen y suma destino.
            */
            if (
              solicitud.idAlmacenOrigen
            ) {

              await ajustarStockInventario({

                idAlmacen:
                  solicitud
                    .idAlmacenOrigen,

                idProducto:
                  detalle.idProducto,

                cantidad,

                tipo:
                  "RESTAR",

                usuario:
                  req.body
                    .actualizadoPor ||
                  "sistema",

              });

            }

            /*
              Traslado interno o compra externa:
              siempre suma al destino.
            */
            await ajustarStockInventario({

              idAlmacen:
                solicitud
                  .idAlmacenDestino,

              idProducto:
                detalle.idProducto,

              cantidad,

              tipo:
                "SUMAR",

              usuario:
                req.body
                  .actualizadoPor ||
                "sistema",

            });

            detalle.estado =
              cantidad <
              Number(
                detalle
                  .cantidadAprobada ||
                detalle
                  .cantidadSolicitada
              )
                ? "parcial"
                : "atendido";

            detalle.actualizadoPor =
              req.body.actualizadoPor ||
              "sistema";

            detalle.fechaActualizacion =
              new Date();

            await detalle.save();

          }

        }

        solicitud.estado =
          nuevoEstado;

        solicitud.actualizadoPor =
          req.body.actualizadoPor ||
          "sistema";

        solicitud.fechaActualizacion =
          new Date();

        await solicitud.save();

        return res.json({

          message:
            pasaAAtendida ||
            pasaAParcial
              ? "Solicitud atendida e inventario actualizado"
              : nuevoEstado ===
                  "aprobada"
                ? "Solicitud aprobada"
                : "Solicitud actualizada",

          solicitud,

        });

      } catch (error: any) {

        console.log(error);

        return res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Error al actualizar solicitud",
        });

      }

    };

  /* =========================
      ANULAR SOLICITUD
  ========================= */

  static deleteSolicitud =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          id,
        } = req.params;

        const solicitud =
          await Solicitud.findById(
            id
          );

        if (!solicitud) {

          return res.status(404).json({
            error:
              "Solicitud no encontrada",
          });

        }

        if (
          solicitud.estado ===
          "atendida"
        ) {

          return res.status(400).json({
            error:
              "No se puede anular una solicitud que ya fue atendida",
          });

        }

        if (
          solicitud.estado ===
          "anulada"
        ) {

          return res.status(400).json({
            error:
              "La solicitud ya está anulada",
          });

        }

        solicitud.estado =
          "anulada";

        solicitud.eliminadoPor =
          req.body.eliminadoPor ||
          "admin";

        solicitud.fechaEliminado =
          new Date();

        await solicitud.save();

        await DetalleSolicitud.updateMany(
          {
            idSolicitud:
              solicitud._id,
          },
          {
            $set: {
              estado:
                "anulado",

              eliminadoPor:
                req.body.eliminadoPor ||
                "admin",

              fechaEliminado:
                new Date(),
            },
          }
        );

        return res.json({
          message:
            "Solicitud anulada",
        });

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al anular solicitud",
        });

      }

    };

  /* =========================
      SOLICITUDES POR SUCURSAL
  ========================= */

  static getSolicitudesBySucursal =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          idSucursal,
        } = req.params;

        const solicitudes =
          await Solicitud.find({
            idSucursal,
          })
            .populate({
              path:
                "idPerfil",

              select:
                "_id nombres apellidos email telefono ci",
            })
            .populate({
              path:
                "idSucursal",

              select:
                "_id nombreSucursal ubicacionSucursal",
            })
            .populate({
              path:
                "idAlmacenOrigen",

              select:
                "_id nombre tipo descripcion ubicacion estado",
            })
            .populate({
              path:
                "idAlmacenDestino",

              select:
                "_id nombre tipo descripcion ubicacion estado",
            })
            .sort({
              fechaCreacion:
                -1,
            })
            .lean();

        if (
          solicitudes.length ===
          0
        ) {

          return res.json({
            sucursal:
              null,

            solicitudes:
              [],
          });

        }

        const idsSolicitudes =
          solicitudes.map(
            (solicitud) =>
              solicitud._id
          );

        const detalles =
          await DetalleSolicitud.find({

            idSolicitud: {
              $in:
                idsSolicitudes,
            },

          })
            .populate({
              path:
                "idProducto",

              select:
                "_id nombre descripcion marca estado",
            })
            .lean();

        const primeraSolicitud: any =
          solicitudes[0];

        const sucursal =
          primeraSolicitud.idSucursal
            ? {
                _id:
                  primeraSolicitud
                    .idSucursal
                    ._id,

                nombreSucursal:
                  primeraSolicitud
                    .idSucursal
                    .nombreSucursal,

                ubicacionSucursal:
                  primeraSolicitud
                    .idSucursal
                    .ubicacionSucursal,
              }
            : null;

        const solicitudesLimpias =
          solicitudes.map(
            (
              solicitud: any
            ) => {

              const detallesSolicitud =
                detalles
                  .filter(
                    (
                      detalle: any
                    ) =>
                      String(
                        detalle
                          .idSolicitud
                      ) ===
                      String(
                        solicitud._id
                      )
                  )
                  .map(
                    (
                      detalle: any
                    ) => ({

                      _id:
                        detalle._id,

                      idProducto:
                        detalle.idProducto,

                      producto:
                        detalle.idProducto
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
                          : null,

                      cantidadSolicitada:
                        Number(
                          detalle
                            .cantidadSolicitada ||
                          0
                        ),

                      cantidadAprobada:
                        Number(
                          detalle
                            .cantidadAprobada ||
                          0
                        ),

                      cantidadAtendida:
                        Number(
                          detalle
                            .cantidadAtendida ||
                          0
                        ),

                      unidad:
                        detalle.unidad,

                      estado:
                        detalle.estado,

                      observacion:
                        detalle.observacion,

                      creadoPor:
                        detalle.creadoPor,

                      actualizadoPor:
                        detalle.actualizadoPor,

                      eliminadoPor:
                        detalle.eliminadoPor,

                      fechaCreacion:
                        detalle.fechaCreacion,

                      fechaActualizacion:
                        detalle
                          .fechaActualizacion,

                      fechaEliminado:
                        detalle.fechaEliminado,

                    })
                  );

              const totalSolicitado =
                detallesSolicitud.reduce(
                  (
                    total,
                    detalle
                  ) =>
                    total +
                    Number(
                      detalle
                        .cantidadSolicitada ||
                      0
                    ),
                  0
                );

              const totalAprobado =
                detallesSolicitud.reduce(
                  (
                    total,
                    detalle
                  ) =>
                    total +
                    Number(
                      detalle
                        .cantidadAprobada ||
                      0
                    ),
                  0
                );

              const totalAtendido =
                detallesSolicitud.reduce(
                  (
                    total,
                    detalle
                  ) =>
                    total +
                    Number(
                      detalle
                        .cantidadAtendida ||
                      0
                    ),
                  0
                );

              return {

                _id:
                  solicitud._id,

                perfil:
                  solicitud.idPerfil ||
                  null,

                almacenOrigen:
                  solicitud
                    .idAlmacenOrigen ||
                  null,

                almacenDestino:
                  solicitud
                    .idAlmacenDestino ||
                  null,

                fechaSolicitud:
                  solicitud
                    .fechaSolicitud,

                estado:
                  solicitud.estado,

                observacion:
                  solicitud.observacion,

                creadoPor:
                  solicitud.creadoPor,

                actualizadoPor:
                  solicitud
                    .actualizadoPor,

                eliminadoPor:
                  solicitud.eliminadoPor,

                fechaCreacion:
                  solicitud
                    .fechaCreacion,

                fechaActualizacion:
                  solicitud
                    .fechaActualizacion,

                fechaEliminado:
                  solicitud
                    .fechaEliminado,

                detalles:
                  detallesSolicitud,

                totalProductos:
                  detallesSolicitud.length,

                totalSolicitado,

                totalAprobado,

                totalAtendido,

              };

            }
          );

        return res.json({

          sucursal,

          solicitudes:
            solicitudesLimpias,

        });

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al obtener solicitudes por sucursal",
        });

      }

    };

}