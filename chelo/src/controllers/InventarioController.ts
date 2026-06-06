// src/controllers/InventarioController.ts

import type {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import Inventario from "../models/Inventario";
import Almacen from "../models/Almacen";
import Solicitud from "../models/Solicitud";
import DetalleSolicitud from "../models/DetalleSolicitud";
import Movimiento from "../models/Movimiento";

/* =========================
    UTILIDADES
========================= */

function redondear(
  valor: number,
  decimales = 4
): number {
  const factor = Math.pow(10, decimales);

  return (
    Math.round(
      (Number(valor) + Number.EPSILON) *
        factor
    ) / factor
  );
}

function calcularCostoPromedio({
  cantidadAnterior,
  costoAnterior,
  cantidadEntrada,
  costoEntrada,
}: {
  cantidadAnterior: number;
  costoAnterior: number;
  cantidadEntrada: number;
  costoEntrada: number;
}): number {
  const cantidadTotal =
    cantidadAnterior + cantidadEntrada;

  if (cantidadTotal <= 0) {
    return 0;
  }

  const valorAnterior =
    cantidadAnterior * costoAnterior;

  const valorEntrada =
    cantidadEntrada * costoEntrada;

  return redondear(
    (valorAnterior + valorEntrada) /
      cantidadTotal
  );
}

/* =========================
    CONTROLADOR
========================= */

export class InventarioController {
  /* =====================================================
      CREAR INVENTARIO O REGISTRAR UNA NUEVA ENTRADA

      - Si no existe el producto en el almacén, lo crea.
      - Si ya existe, suma la cantidad.
      - Recalcula el costo promedio ponderado.
      - Registra el movimiento de entrada.
  ===================================================== */

  static crearInventario = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        idAlmacen,
        idProducto,
        cantidad,
        costoUnitario,
        precioVenta,
        stockMinimo,
        estado,
        creadoPor,
      } = req.body;

      if (
        !idAlmacen ||
        !mongoose.isValidObjectId(idAlmacen)
      ) {
        return res.status(400).json({
          error:
            "El almacén es obligatorio o no es válido",
        });
      }

      if (
        !idProducto ||
        !mongoose.isValidObjectId(idProducto)
      ) {
        return res.status(400).json({
          error:
            "El producto es obligatorio o no es válido",
        });
      }

      const cantidadEntrada =
        Number(cantidad);

      const costoEntrada =
        Number(costoUnitario);

      if (
        !Number.isFinite(cantidadEntrada) ||
        cantidadEntrada <= 0
      ) {
        return res.status(400).json({
          error:
            "La cantidad de entrada debe ser mayor a cero",
        });
      }

      if (
        !Number.isFinite(costoEntrada) ||
        costoEntrada < 0
      ) {
        return res.status(400).json({
          error:
            "El costo de entrada no es válido",
        });
      }

      const usuario =
        creadoPor || "sistema";

      const almacen =
        await Almacen.findById(idAlmacen);

      if (!almacen) {
        return res.status(404).json({
          error:
            "Almacén no encontrado",
        });
      }

      const inventarioExistente =
        await Inventario.findOne({
          idAlmacen,
          idProducto,
        });

      let inventarioFinal;

      let cantidadAnterior = 0;
      let costoAnterior = 0;

      /*
        PRODUCTO NUEVO EN EL ALMACÉN
      */
      if (!inventarioExistente) {
        inventarioFinal =
          await Inventario.create({
            idAlmacen,
            idProducto,

            cantidad:
              cantidadEntrada,

            costoUnitario:
              redondear(
                costoEntrada
              ),

            ultimoCostoEntrada:
              redondear(
                costoEntrada
              ),

            precioVenta:
              Number(
                precioVenta ?? 0
              ),

            stockMinimo:
              Number(
                stockMinimo ?? 0
              ),

            estado:
              estado ?? true,

            creadoPor:
              usuario,

            fechaCreacion:
              new Date(),
          });
      } else {
        /*
          PRODUCTO YA EXISTENTE:
          se calcula costo promedio ponderado.
        */

        cantidadAnterior =
          Number(
            inventarioExistente.cantidad ||
              0
          );

        costoAnterior =
          Number(
            inventarioExistente
              .costoUnitario || 0
          );

        const costoPromedio =
          calcularCostoPromedio({
            cantidadAnterior,
            costoAnterior,
            cantidadEntrada,
            costoEntrada,
          });

        inventarioExistente.cantidad =
          cantidadAnterior +
          cantidadEntrada;

        inventarioExistente.costoUnitario =
          costoPromedio;

        inventarioExistente.ultimoCostoEntrada =
          redondear(
            costoEntrada
          );

        /*
          El precio de venta solo cambia
          cuando llega expresamente.
        */
        if (
          precioVenta !== undefined &&
          precioVenta !== null
        ) {
          inventarioExistente.precioVenta =
            Number(precioVenta);
        }

        if (
          stockMinimo !== undefined &&
          stockMinimo !== null
        ) {
          inventarioExistente.stockMinimo =
            Number(stockMinimo);
        }

        inventarioExistente.estado =
          estado ?? true;

        inventarioExistente.actualizadoPor =
          usuario;

        inventarioExistente.fechaActualizacion =
          new Date();

        await inventarioExistente.save();

        inventarioFinal =
          inventarioExistente;
      }

      const cantidadNueva =
        Number(
          inventarioFinal.cantidad || 0
        );

      const costoPromedioFinal =
        Number(
          inventarioFinal
            .costoUnitario || 0
        );

      const valorAnterior =
        redondear(
          cantidadAnterior *
            costoAnterior,
          2
        );

      const valorEntrada =
        redondear(
          cantidadEntrada *
            costoEntrada,
          2
        );

      const valorNuevo =
        redondear(
          cantidadNueva *
            costoPromedioFinal,
          2
        );

      /*
        REGISTRAR MOVIMIENTO DE ENTRADA
      */
      await Movimiento.create({
        fecha:
          new Date(),

        tipoMovimiento:
          "entrada_inventario",

        origenMovimiento:
          "inventario",

        modulo:
          "inventario",

        idSucursal:
          almacen.idSucursal,

        idAlmacen:
          almacen._id,

        idProducto,

        idInventario:
          inventarioFinal._id,

        cantidad:
          cantidadEntrada,

        cantidadEntrada,

        cantidadSalida:
          0,

        cantidadAnterior,

        cantidadNueva,

        costoUnitario:
          redondear(
            costoEntrada
          ),

        costoAnterior:
          redondear(
            costoAnterior
          ),

        costoEntrada:
          redondear(
            costoEntrada
          ),

        costoPromedio:
          redondear(
            costoPromedioFinal
          ),

        ultimoCostoEntrada:
          redondear(
            costoEntrada
          ),

        subtotal:
          valorEntrada,

        total:
          valorEntrada,

        estado:
          "activo",

        referenciaId:
          inventarioFinal._id,

        referenciaModelo:
          "Inventario",

        observacion:
          inventarioExistente
            ? `Entrada de ${cantidadEntrada} unidades. Stock anterior: ${cantidadAnterior}. Stock nuevo: ${cantidadNueva}.`
            : `Creación de inventario con ${cantidadEntrada} unidades.`,

        creadoPor:
          usuario,
      });

      return res
        .status(
          inventarioExistente
            ? 200
            : 201
        )
        .json({
          message:
            inventarioExistente
              ? "Entrada registrada y costo promedio actualizado"
              : "Inventario creado correctamente",

          inventario:
            inventarioFinal,

          calculoCosto: {
            cantidadAnterior,
            cantidadEntrada,
            cantidadNueva,

            costoAnterior:
              redondear(
                costoAnterior
              ),

            costoEntrada:
              redondear(
                costoEntrada
              ),

            costoPromedio:
              redondear(
                costoPromedioFinal
              ),

            valorAnterior,
            valorEntrada,
            valorNuevo,
          },
        });
    } catch (error: unknown) {
      console.error(
        "Error registrando inventario:",
        error
      );

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        return res.status(409).json({
          error:
            "Ya existe este producto en el almacén",
        });
      }

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al registrar inventario",
      });
    }
  };

  /* =========================
      OBTENER TODOS
  ========================= */

  static obtenerInventarios = async (
    _req: Request,
    res: Response
  ) => {
    try {
      const inventarios =
        await Inventario.find()
          .populate({
            path:
              "idAlmacen",
            populate: {
              path:
                "idSucursal",
            },
          })
          .populate(
            "idProducto"
          )
          .sort({
            fechaCreacion:
              -1,
          });

      return res.json(
        inventarios
      );
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Error al obtener inventarios",
      });
    }
  };

  /* =========================
      OBTENER POR SUCURSAL
  ========================= */

  static obtenerInventariosPorSucursal =
    async (
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
              "ID de sucursal no válido",
          });
        }

        const almacenes =
          await Almacen.find({
            idSucursal,
          })
            .select(
              "_id idSucursal nombre descripcion tipo ubicacion estado"
            )
            .lean();

        const idsAlmacenes =
          almacenes.map(
            (almacen) =>
              almacen._id
          );

        if (
          idsAlmacenes.length ===
          0
        ) {
          return res.json([]);
        }

        const inventarios =
          await Inventario.find({
            idAlmacen: {
              $in:
                idsAlmacenes,
            },
          })
            .populate({
              path:
                "idAlmacen",
              select:
                "_id idSucursal nombre descripcion tipo ubicacion estado",
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
          inventarios
        );
      } catch (error) {
        console.error(
          "Error obteniendo inventarios por sucursal:",
          error
        );

        return res.status(500).json({
          error:
            "Error al obtener inventarios de la sucursal",
        });
      }
    };

  /* =========================
      OBTENER POR ID
  ========================= */

  static obtenerInventarioPorId =
    async (
      req: Request,
      res: Response
    ) => {
      try {
        const {
          id,
        } = req.params;

        if (
          !mongoose.isValidObjectId(
            id
          )
        ) {
          return res.status(400).json({
            error:
              "ID de inventario no válido",
          });
        }

        const inventario =
          await Inventario.findById(
            id
          )
            .populate(
              "idProducto"
            )
            .populate({
              path:
                "idAlmacen",
              populate: {
                path:
                  "idSucursal",
              },
            });

        if (!inventario) {
          return res.status(404).json({
            error:
              "Inventario no encontrado",
          });
        }

        return res.json(
          inventario
        );
      } catch (error) {
        console.error(error);

        return res.status(500).json({
          error:
            "Error al obtener inventario",
        });
      }
    };

  /* =========================
      ACTUALIZAR CONFIGURACIÓN

      No permite editar cantidad ni
      costo promedio manualmente.
  ========================= */

  static actualizarInventario =
    async (
      req: Request,
      res: Response
    ) => {
      try {
        const {
          id,
        } = req.params;

        const inventario =
          await Inventario.findById(
            id
          );

        if (!inventario) {
          return res.status(404).json({
            error:
              "Inventario no encontrado",
          });
        }

        if (
          req.body.precioVenta !==
          undefined
        ) {
          const precioVenta =
            Number(
              req.body.precioVenta
            );

          if (
            !Number.isFinite(
              precioVenta
            ) ||
            precioVenta < 0
          ) {
            return res.status(400).json({
              error:
                "El precio de venta no es válido",
            });
          }

          inventario.precioVenta =
            precioVenta;
        }

        if (
          req.body.stockMinimo !==
          undefined
        ) {
          const stockMinimo =
            Number(
              req.body.stockMinimo
            );

          if (
            !Number.isFinite(
              stockMinimo
            ) ||
            stockMinimo < 0
          ) {
            return res.status(400).json({
              error:
                "El stock mínimo no es válido",
            });
          }

          inventario.stockMinimo =
            stockMinimo;
        }

        if (
          req.body.estado !==
          undefined
        ) {
          inventario.estado =
            Boolean(
              req.body.estado
            );
        }

        inventario.actualizadoPor =
          req.body.actualizadoPor ||
          "sistema";

        inventario.fechaActualizacion =
          new Date();

        await inventario.save();

        return res.json({
          message:
            "Inventario actualizado",
          inventario,
        });
      } catch (error) {
        console.error(error);

        return res.status(500).json({
          error:
            "Error al actualizar inventario",
        });
      }
    };

  /* =========================
      ELIMINACIÓN LÓGICA
  ========================= */

  static eliminarInventario =
    async (
      req: Request,
      res: Response
    ) => {
      try {
        const {
          id,
        } = req.params;

        const inventario =
          await Inventario.findByIdAndUpdate(
            id,
            {
              estado:
                false,

              fechaEliminado:
                new Date(),

              eliminadoPor:
                req.body
                  .eliminadoPor ||
                "sistema",
            },
            {
              new:
                true,
            }
          );

        if (!inventario) {
          return res.status(404).json({
            error:
              "Inventario no encontrado",
          });
        }

        return res.json({
          message:
            "Inventario eliminado correctamente",
          inventario,
        });
      } catch (error) {
        console.error(error);

        return res.status(500).json({
          error:
            "Error al eliminar inventario",
        });
      }
    };

  /* =========================
      INVENTARIO BARRA
  ========================= */

  static obtenerInventarioBarraPorSucursal =
    async (
      req: Request,
      res: Response
    ) => {
      try {
        const {
          idSucursal,
        } = req.params;

        const almacenesBarra =
          await Almacen.find({
            idSucursal,
            tipo:
              "barra",
            estado:
              true,
          });

        if (
          almacenesBarra.length ===
          0
        ) {
          return res.status(404).json({
            error:
              "No existen almacenes tipo barra para esta sucursal",
          });
        }

        const idsAlmacenes =
          almacenesBarra.map(
            (almacen) =>
              almacen._id
          );

        const inventarios =
          await Inventario.find({
            idAlmacen: {
              $in:
                idsAlmacenes,
            },
            estado:
              true,
          })
            .populate({
              path:
                "idAlmacen",
              populate: {
                path:
                  "idSucursal",
              },
            })
            .populate(
              "idProducto"
            );

        return res.json(
          inventarios
        );
      } catch (error) {
        console.error(error);

        return res.status(500).json({
          error:
            "Error al obtener inventario de barra",
        });
      }
    };

  /* =========================
      INVENTARIO PRINCIPAL
  ========================= */

  static obtenerInventarioPrincipalPorSucursal =
    async (
      req: Request,
      res: Response
    ) => {
      try {
        const {
          idSucursal,
        } = req.params;

        const almacenPrincipal =
          await Almacen.findOne({
            idSucursal,
            tipo:
              "principal",
            estado:
              true,
          })
            .select(
              "_id idSucursal nombre descripcion tipo ubicacion estado"
            )
            .lean();

        if (!almacenPrincipal) {
          return res.status(404).json({
            error:
              "No existe un almacén principal activo en esta sucursal",
          });
        }

        const inventarios =
          await Inventario.find({
            idAlmacen:
              almacenPrincipal._id,
            estado:
              true,
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
            })
            .lean();

        const inventariosLimpios =
          inventarios.map(
            (inventario: any) => ({
              _id:
                inventario._id,

              idAlmacen:
                almacenPrincipal._id,

              idProducto:
                inventario.idProducto,

              cantidad:
                Number(
                  inventario.cantidad ||
                    0
                ),

              costoUnitario:
                Number(
                  inventario
                    .costoUnitario ||
                    0
                ),

              ultimoCostoEntrada:
                Number(
                  inventario
                    .ultimoCostoEntrada ||
                    0
                ),

              precioVenta:
                Number(
                  inventario
                    .precioVenta ||
                    0
                ),

              stockMinimo:
                Number(
                  inventario
                    .stockMinimo ||
                    0
                ),

              valorInventario:
                redondear(
                  Number(
                    inventario.cantidad ||
                      0
                  ) *
                    Number(
                      inventario
                        .costoUnitario ||
                        0
                    ),
                  2
                ),

              disponible:
                Number(
                  inventario.cantidad ||
                    0
                ) > 0,

              estado:
                inventario.estado,
            })
          );

        return res.json({
          almacen: {
            _id:
              almacenPrincipal._id,

            idSucursal:
              almacenPrincipal.idSucursal,

            nombre:
              almacenPrincipal.nombre,

            descripcion:
              almacenPrincipal.descripcion,

            tipo:
              almacenPrincipal.tipo,

           
            estado:
              almacenPrincipal.estado,
          },

          inventarios:
            inventariosLimpios,
        });
      } catch (error: unknown) {
        console.error(error);

        return res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Error al obtener inventario principal",
        });
      }
    };

  /* =====================================================
      APROBAR SOLICITUD Y TRANSFERIR INVENTARIO

      1. Valida solicitud.
      2. Obtiene almacén principal como origen.
      3. Valida el stock de todos los productos.
      4. Registra aprobación.
      5. Resta del origen.
      6. Suma o crea en destino.
      7. Recalcula costo promedio del destino.
      8. Registra salida y entrada.
      9. Actualiza detalles.
      10. Marca solicitud como atendida.
  ===================================================== */

  static aprobarYTransferirSolicitud =
    async (
      req: Request,
      res: Response
    ) => {
      const session =
        await mongoose.startSession();

      try {
        const {
          idSolicitud,
        } = req.params;

        const usuario =
          req.body.actualizadoPor ||
          req.body.creadoPor ||
          "sistema";

        if (
          !mongoose.isValidObjectId(
            idSolicitud
          )
        ) {
          return res.status(400).json({
            error:
              "ID de solicitud no válido",
          });
        }

        let respuestaFinal:
          | Record<string, unknown>
          | undefined;

        await session.withTransaction(
          async () => {
            const solicitud =
              await Solicitud.findById(
                idSolicitud
              ).session(session);

            if (!solicitud) {
              throw new Error(
                "Solicitud no encontrada"
              );
            }

            if (
              solicitud.estado ===
              "atendida"
            ) {
              throw new Error(
                "La solicitud ya fue atendida"
              );
            }

            if (
              solicitud.estado ===
                "rechazada" ||
              solicitud.estado ===
                "anulada"
            ) {
              throw new Error(
                `No se puede procesar una solicitud ${solicitud.estado}`
              );
            }

            const almacenOrigen =
              await Almacen.findOne({
                idSucursal:
                  solicitud.idSucursal,

                tipo:
                  "principal",

                estado:
                  true,
              }).session(session);

            if (!almacenOrigen) {
              throw new Error(
                "No existe un almacén principal activo para esta sucursal"
              );
            }

            const almacenDestino =
              await Almacen.findOne({
                _id:
                  solicitud.idAlmacenDestino,

                estado:
                  true,
              }).session(session);

            if (!almacenDestino) {
              throw new Error(
                "El almacén destino no existe o está inactivo"
              );
            }

            if (
              String(
                almacenOrigen._id
              ) ===
              String(
                almacenDestino._id
              )
            ) {
              throw new Error(
                "El almacén origen y el almacén destino no pueden ser iguales"
              );
            }

            const detalles =
              await DetalleSolicitud.find({
                idSolicitud:
                  solicitud._id,

                fechaEliminado: {
                  $exists:
                    false,
                },
              }).session(session);

            if (
              detalles.length === 0
            ) {
              throw new Error(
                "La solicitud no tiene productos"
              );
            }

            const operaciones: Array<{
              detalle:
                (typeof detalles)[number];

              inventarioOrigen:
                any;

              inventarioDestino:
                any | null;

              cantidadTransferir:
                number;

              costoTransferencia:
                number;
            }> = [];

            /*
              VALIDAR TODO ANTES DE MODIFICAR
            */
            for (
              const detalle
              of detalles
            ) {
              const cantidadSolicitada =
                Number(
                  detalle
                    .cantidadSolicitada ||
                    0
                );

              const cantidadAtendidaActual =
                Number(
                  detalle
                    .cantidadAtendida ||
                    0
                );

              /*
                Si ya existe una cantidad atendida,
                solo se traslada lo pendiente.
              */
              const cantidadPendiente =
                cantidadSolicitada -
                cantidadAtendidaActual;

              if (
                !Number.isFinite(
                  cantidadPendiente
                ) ||
                cantidadPendiente <= 0
              ) {
                continue;
              }

              const inventarioOrigen =
                await Inventario.findOne({
                  idAlmacen:
                    almacenOrigen._id,

                  idProducto:
                    detalle.idProducto,

                  estado:
                    true,
                })
                  .populate(
                    "idProducto"
                  )
                  .session(session);

              if (!inventarioOrigen) {
                throw new Error(
                  `El producto ${String(
                    detalle.idProducto
                  )} no existe en el almacén principal`
                );
              }

              const stockDisponible =
                Number(
                  inventarioOrigen.cantidad ||
                    0
                );

              if (
                stockDisponible <
                cantidadPendiente
              ) {
                const producto =
                  inventarioOrigen.idProducto as
                    | {
                        nombre?:
                          string;
                      }
                    | null;

                throw new Error(
                  `Stock insuficiente para ${
                    producto?.nombre ||
                    "el producto"
                  }. Disponible: ${stockDisponible}. Requerido: ${cantidadPendiente}.`
                );
              }

              const inventarioDestino =
                await Inventario.findOne({
                  idAlmacen:
                    almacenDestino._id,

                  idProducto:
                    detalle.idProducto,
                }).session(session);

              operaciones.push({
                detalle,
                inventarioOrigen,
                inventarioDestino,

                cantidadTransferir:
                  cantidadPendiente,

                /*
                  El producto sale con el costo
                  promedio del almacén origen.
                */
                costoTransferencia:
                  Number(
                    inventarioOrigen
                      .costoUnitario ||
                      0
                  ),
              });
            }

            if (
              operaciones.length ===
              0
            ) {
              throw new Error(
                "No existen cantidades pendientes para transferir"
              );
            }

            /*
              REGISTRAR APROBACIÓN
            */
            solicitud.estado =
              "aprobada";

            solicitud.idAlmacenOrigen =
              almacenOrigen._id;

            solicitud.actualizadoPor =
              usuario;

            solicitud.fechaActualizacion =
              new Date();

            await solicitud.save({
              session,
            });

            const cantidadTotal =
              operaciones.reduce(
                (
                  total,
                  operacion
                ) =>
                  total +
                  operacion
                    .cantidadTransferir,
                0
              );

            await Movimiento.create(
              [
                {
                  fecha:
                    new Date(),

                  tipoMovimiento:
                    "solicitud_aprobada",

                  origenMovimiento:
                    "solicitud",

                  modulo:
                    "solicitud",

                  idSolicitud:
                    solicitud._id,

                  idSucursal:
                    solicitud.idSucursal,

                  idPerfil:
                    solicitud.idPerfil,

                  idAlmacenOrigen:
                    almacenOrigen._id,

                  idAlmacenDestino:
                    almacenDestino._id,

                  cantidad:
                    cantidadTotal,

                  estado:
                    "aprobada",

                  referenciaId:
                    solicitud._id,

                  referenciaModelo:
                    "Solicitud",

                  observacion:
                    "Solicitud aprobada para transferencia de inventario",

                  creadoPor:
                    usuario,
                },
              ],
              {
                session,
              }
            );

            const resultados: Array<
              Record<string, unknown>
            > = [];

            /*
              EJECUTAR TRANSFERENCIA
            */
            for (
              const operacion
              of operaciones
            ) {
              const {
                detalle,
                inventarioOrigen,
                inventarioDestino,
                cantidadTransferir,
                costoTransferencia,
              } = operacion;

              const cantidadOrigenAnterior =
                Number(
                  inventarioOrigen
                    .cantidad ||
                    0
                );

              const cantidadOrigenNueva =
                cantidadOrigenAnterior -
                cantidadTransferir;

              /*
                RESTAR DEL ORIGEN
              */
              inventarioOrigen.cantidad =
                cantidadOrigenNueva;

              inventarioOrigen.actualizadoPor =
                usuario;

              inventarioOrigen.fechaActualizacion =
                new Date();

              await inventarioOrigen.save({
                session,
              });

              /*
                CREAR O ACTUALIZAR DESTINO
              */
              let inventarioDestinoFinal;

              let cantidadDestinoAnterior =
                0;

              let costoDestinoAnterior =
                0;

              let costoPromedioDestino =
                costoTransferencia;

              if (
                inventarioDestino
              ) {
                cantidadDestinoAnterior =
                  Number(
                    inventarioDestino
                      .cantidad ||
                      0
                  );

                costoDestinoAnterior =
                  Number(
                    inventarioDestino
                      .costoUnitario ||
                      0
                  );

                costoPromedioDestino =
                  calcularCostoPromedio({
                    cantidadAnterior:
                      cantidadDestinoAnterior,

                    costoAnterior:
                      costoDestinoAnterior,

                    cantidadEntrada:
                      cantidadTransferir,

                    costoEntrada:
                      costoTransferencia,
                  });

                inventarioDestino.cantidad =
                  cantidadDestinoAnterior +
                  cantidadTransferir;

                inventarioDestino.costoUnitario =
                  costoPromedioDestino;

                inventarioDestino.ultimoCostoEntrada =
                  costoTransferencia;

                inventarioDestino.estado =
                  true;

                inventarioDestino.actualizadoPor =
                  usuario;

                inventarioDestino.fechaActualizacion =
                  new Date();

                await inventarioDestino.save({
                  session,
                });

                inventarioDestinoFinal =
                  inventarioDestino;
              } else {
                const documentosDestino =
                  await Inventario.create(
                    [
                      {
                        idAlmacen:
                          almacenDestino._id,

                        idProducto:
                          detalle.idProducto,

                        cantidad:
                          cantidadTransferir,

                        costoUnitario:
                          costoTransferencia,

                        ultimoCostoEntrada:
                          costoTransferencia,

                        precioVenta:
                          Number(
                            inventarioOrigen
                              .precioVenta ||
                              0
                          ),

                        stockMinimo:
                          Number(
                            inventarioOrigen
                              .stockMinimo ||
                              0
                          ),

                        estado:
                          true,

                        creadoPor:
                          usuario,

                        fechaCreacion:
                          new Date(),
                      },
                    ],
                    {
                      session,
                    }
                  );

                inventarioDestinoFinal =
                  documentosDestino[0];
              }

              const cantidadDestinoNueva =
                Number(
                  inventarioDestinoFinal
                    .cantidad ||
                    0
                );

              const valorTransferido =
                redondear(
                  cantidadTransferir *
                    costoTransferencia,
                  2
                );

              /*
                MOVIMIENTO DE SALIDA
              */
              await Movimiento.create(
                [
                  {
                    fecha:
                      new Date(),

                    tipoMovimiento:
                      "salida_inventario",

                    origenMovimiento:
                      "solicitud",

                    modulo:
                      "inventario",

                    idSolicitud:
                      solicitud._id,

                    idSucursal:
                      solicitud.idSucursal,

                    idPerfil:
                      solicitud.idPerfil,

                    idAlmacen:
                      almacenOrigen._id,

                    idAlmacenOrigen:
                      almacenOrigen._id,

                    idAlmacenDestino:
                      almacenDestino._id,

                    idProducto:
                      detalle.idProducto,

                    idInventario:
                      inventarioOrigen._id,

                    cantidad:
                      cantidadTransferir,

                    cantidadSalida:
                      cantidadTransferir,

                    cantidadEntrada:
                      0,

                    cantidadAnterior:
                      cantidadOrigenAnterior,

                    cantidadNueva:
                      cantidadOrigenNueva,

                    costoUnitario:
                      costoTransferencia,

                    costoAnterior:
                      costoTransferencia,

                    costoEntrada:
                      0,

                    costoPromedio:
                      costoTransferencia,

                    subtotal:
                      valorTransferido,

                    total:
                      valorTransferido,

                    estado:
                      "atendida",

                    referenciaId:
                      solicitud._id,

                    referenciaModelo:
                      "Solicitud",

                    observacion:
                      "Salida del almacén principal por solicitud aprobada",

                    creadoPor:
                      usuario,
                  },
                ],
                {
                  session,
                }
              );

              /*
                MOVIMIENTO DE ENTRADA
              */
              await Movimiento.create(
                [
                  {
                    fecha:
                      new Date(),

                    tipoMovimiento:
                      "entrada_inventario",

                    origenMovimiento:
                      "solicitud",

                    modulo:
                      "inventario",

                    idSolicitud:
                      solicitud._id,

                    idSucursal:
                      solicitud.idSucursal,

                    idPerfil:
                      solicitud.idPerfil,

                    idAlmacen:
                      almacenDestino._id,

                    idAlmacenOrigen:
                      almacenOrigen._id,

                    idAlmacenDestino:
                      almacenDestino._id,

                    idProducto:
                      detalle.idProducto,

                    idInventario:
                      inventarioDestinoFinal._id,

                    cantidad:
                      cantidadTransferir,

                    cantidadEntrada:
                      cantidadTransferir,

                    cantidadSalida:
                      0,

                    cantidadAnterior:
                      cantidadDestinoAnterior,

                    cantidadNueva:
                      cantidadDestinoNueva,

                    costoUnitario:
                      costoTransferencia,

                    costoAnterior:
                      costoDestinoAnterior,

                    costoEntrada:
                      costoTransferencia,

                    costoPromedio:
                      costoPromedioDestino,

                    ultimoCostoEntrada:
                      costoTransferencia,

                    subtotal:
                      valorTransferido,

                    total:
                      valorTransferido,

                    estado:
                      "atendida",

                    referenciaId:
                      solicitud._id,

                    referenciaModelo:
                      "Solicitud",

                    observacion:
                      "Entrada al almacén destino por solicitud aprobada",

                    creadoPor:
                      usuario,
                  },
                ],
                {
                  session,
                }
              );

              /*
                ACTUALIZAR DETALLE
              */
              detalle.cantidadAtendida =
                Number(
                  detalle
                    .cantidadAtendida ||
                    0
                ) +
                cantidadTransferir;

              detalle.actualizadoPor =
                usuario;

              detalle.fechaActualizacion =
                new Date();

              await detalle.save({
                session,
              });

              resultados.push({
                idProducto:
                  detalle.idProducto,

                cantidadTransferida:
                  cantidadTransferir,

                origen: {
                  idAlmacen:
                    almacenOrigen._id,

                  cantidadAnterior:
                    cantidadOrigenAnterior,

                  cantidadNueva:
                    cantidadOrigenNueva,

                  costoPromedio:
                    costoTransferencia,
                },

                destino: {
                  idAlmacen:
                    almacenDestino._id,

                  cantidadAnterior:
                    cantidadDestinoAnterior,

                  cantidadNueva:
                    cantidadDestinoNueva,

                  costoAnterior:
                    costoDestinoAnterior,

                  costoEntrada:
                    costoTransferencia,

                  costoPromedio:
                    costoPromedioDestino,
                },
              });
            }

            /*
              MOVIMIENTO GENERAL DE TRANSFERENCIA
            */
            await Movimiento.create(
              [
                {
                  fecha:
                    new Date(),

                  tipoMovimiento:
                    "transferencia_inventario",

                  origenMovimiento:
                    "solicitud",

                  modulo:
                    "transferencia",

                  idSolicitud:
                    solicitud._id,

                  idSucursal:
                    solicitud.idSucursal,

                  idPerfil:
                    solicitud.idPerfil,

                  idAlmacenOrigen:
                    almacenOrigen._id,

                  idAlmacenDestino:
                    almacenDestino._id,

                  cantidad:
                    cantidadTotal,

                  estado:
                    "atendida",

                  referenciaId:
                    solicitud._id,

                  referenciaModelo:
                    "Solicitud",

                  observacion:
                    "Transferencia completada desde el almacén principal",

                  creadoPor:
                    usuario,
                },
              ],
              {
                session,
              }
            );

            /*
              FINALIZAR SOLICITUD
            */
            solicitud.estado =
              "atendida";

            solicitud.actualizadoPor =
              usuario;

            solicitud.fechaActualizacion =
              new Date();

            await solicitud.save({
              session,
            });

            respuestaFinal = {
              message:
                "Solicitud aprobada, inventarios actualizados y movimientos registrados",

              solicitud,

              almacenOrigen: {
                _id:
                  almacenOrigen._id,

                nombre:
                  almacenOrigen.nombre,

                tipo:
                  almacenOrigen.tipo,
              },

              almacenDestino: {
                _id:
                  almacenDestino._id,

                nombre:
                  almacenDestino.nombre,

                tipo:
                  almacenDestino.tipo,
              },

              cantidadTotal,

              productos:
                resultados,
            };
          }
        );

        return res.json(
          respuestaFinal
        );
      } catch (error: unknown) {
        console.error(
          "Error aprobando y transfiriendo solicitud:",
          error
        );

        return res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Error al aprobar y transferir la solicitud",
        });
      } finally {
        await session.endSession();
      }
    };
}
