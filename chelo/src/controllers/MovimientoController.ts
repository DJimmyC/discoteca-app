// src/controllers/MovimientoController.ts

import type {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import Movimiento from "../models/Movimiento";

/* =====================================================
    HELPERS
===================================================== */

function obtenerString(
  valor: unknown
): string | undefined {

  if (
    typeof valor === "string"
  ) {
    const limpio =
      valor.trim();

    return limpio ||
      undefined;
  }

  if (
    Array.isArray(valor) &&
    typeof valor[0] === "string"
  ) {
    const limpio =
      valor[0].trim();

    return limpio ||
      undefined;
  }

  return undefined;
}

function crearFechaInicio(
  valor?: string
): Date | undefined {

  if (!valor) {
    return undefined;
  }

  const fecha =
    valor.length === 10
      ? new Date(
          `${valor}T00:00:00.000-04:00`
        )
      : new Date(valor);

  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return undefined;
  }

  return fecha;
}

function crearFechaFin(
  valor?: string
): Date | undefined {

  if (!valor) {
    return undefined;
  }

  const fecha =
    valor.length === 10
      ? new Date(
          `${valor}T23:59:59.999-04:00`
        )
      : new Date(valor);

  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return undefined;
  }

  return fecha;
}

function convertirObjectId(
  valor: string | undefined,
  nombreCampo: string
):
  | mongoose.Types.ObjectId
  | undefined {

  if (!valor) {
    return undefined;
  }

  if (
    !mongoose.isValidObjectId(
      valor
    )
  ) {
    throw new Error(
      `${nombreCampo} no es válido`
    );
  }

  return new mongoose.Types.ObjectId(
    valor
  );
}

function construirFiltroBase(
  req: Request
): Record<string, unknown> {

  const fechaInicio =
    obtenerString(
      req.query.fechaInicio
    );

  const fechaFin =
    obtenerString(
      req.query.fechaFin
    );

  const idSucursal =
    obtenerString(
      req.query.idSucursal
    );

  const idCaja =
    obtenerString(
      req.query.idCaja
    );

  const idPerfil =
    obtenerString(
      req.query.idPerfil
    );

  const idAlmacen =
    obtenerString(
      req.query.idAlmacen
    );

  const idProducto =
    obtenerString(
      req.query.idProducto
    );

  const tipoMovimiento =
    obtenerString(
      req.query.tipoMovimiento
    );

  const modulo =
    obtenerString(
      req.query.modulo
    );

  const metodoPago =
    obtenerString(
      req.query.metodoPago
    );

  const origenMovimiento =
    obtenerString(
      req.query.origenMovimiento
    );

  const estado =
    obtenerString(
      req.query.estado
    );

  const filtro:
    Record<string, unknown> = {};

  const inicio =
    crearFechaInicio(
      fechaInicio
    );

  const fin =
    crearFechaFin(
      fechaFin
    );

  if (
    fechaInicio &&
    !inicio
  ) {
    throw new Error(
      "La fecha de inicio no es válida"
    );
  }

  if (
    fechaFin &&
    !fin
  ) {
    throw new Error(
      "La fecha final no es válida"
    );
  }

  if (
    inicio ||
    fin
  ) {

    const rango: {
      $gte?: Date;
      $lte?: Date;
    } = {};

    if (inicio) {
      rango.$gte =
        inicio;
    }

    if (fin) {
      rango.$lte =
        fin;
    }

    filtro.fecha =
      rango;
  }

  const sucursalObjectId =
    convertirObjectId(
      idSucursal,
      "El ID de la sucursal"
    );

  const cajaObjectId =
    convertirObjectId(
      idCaja,
      "El ID de la caja"
    );

  const perfilObjectId =
    convertirObjectId(
      idPerfil,
      "El ID del perfil"
    );

  const almacenObjectId =
    convertirObjectId(
      idAlmacen,
      "El ID del almacén"
    );

  const productoObjectId =
    convertirObjectId(
      idProducto,
      "El ID del producto"
    );

  if (sucursalObjectId) {
    filtro.idSucursal =
      sucursalObjectId;
  }

  if (cajaObjectId) {
    filtro.idCaja =
      cajaObjectId;
  }

  if (perfilObjectId) {
    filtro.idPerfil =
      perfilObjectId;
  }

  if (almacenObjectId) {
    filtro.idAlmacen =
      almacenObjectId;
  }

  if (productoObjectId) {
    filtro.idProducto =
      productoObjectId;
  }

  if (tipoMovimiento) {
    filtro.tipoMovimiento =
      tipoMovimiento;
  }

  if (modulo) {
    filtro.modulo =
      modulo;
  }

  if (metodoPago) {
    filtro.metodoPago =
      metodoPago;
  }

  if (origenMovimiento) {
    filtro.origenMovimiento =
      origenMovimiento;
  }

  if (estado) {
    filtro.estado =
      estado;
  }

  return filtro;
}

function queryMovimientos(
  filtro: Record<string, unknown>
) {

  return Movimiento.find(
    filtro
  )
    .populate({
      path:
        "idSucursal",
      select:
        "_id nombreSucursal nombre ubicacionSucursal",
    })
    .populate({
      path:
        "idCaja",
      select:
        "_id nombre descripcion estado",
    })
    .populate({
      path:
        "idPerfil",
      select:
        "_id nombres apellidos email telefono ci",
    })
    .populate({
      path:
        "idAlmacen",
      select:
        "_id nombre tipo descripcion ubicacion",
    })
    .populate({
      path:
        "idAlmacenOrigen",
      select:
        "_id nombre tipo descripcion ubicacion",
    })
    .populate({
      path:
        "idAlmacenDestino",
      select:
        "_id nombre tipo descripcion ubicacion",
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
        "_id cantidad costoUnitario ultimoCostoEntrada precioVenta stockMinimo",
    })
    .sort({
      fecha:
        -1,
      fechaCreacion:
        -1,
    });
}

function numero(
  valor: unknown
): number {

  const convertido =
    Number(valor);

  return Number.isFinite(
    convertido
  )
    ? convertido
    : 0;
}

function redondear(
  valor: number
): number {

  return Math.round(
    (
      valor +
      Number.EPSILON
    ) *
      100
  ) / 100;
}

/* =====================================================
    CONTROLLER
===================================================== */

export class MovimientoController {

  /* =========================
      CREAR MOVIMIENTO
  ========================= */

  static createMovimiento =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const movimiento =
          new Movimiento({
            ...req.body,
            fecha:
              req.body.fecha ||
              new Date(),
            fechaCreacion:
              new Date(),
          });

        await movimiento.save();

        return res
          .status(201)
          .json({
            message:
              "Movimiento registrado correctamente",
            movimiento,
          });

      } catch (error) {

        console.error(
          "ERROR CREANDO MOVIMIENTO:",
          error
        );

        return res
          .status(500)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al registrar movimiento",
          });
      }
    };

  /* =========================
      USO INTERNO
  ========================= */

  static registrarMovimiento =
    async (
      data: Record<string, unknown>
    ) => {

      const movimiento =
        new Movimiento({
          ...data,
          fecha:
            data.fecha ||
            new Date(),
          fechaCreacion:
            new Date(),
        });

      await movimiento.save();

      return movimiento;
    };

  /* =========================
      OBTENER TODOS
  ========================= */

  static getAllMovimientos =
    async (
      _req: Request,
      res: Response
    ) => {

      try {

        const movimientos =
          await queryMovimientos(
            {}
          ).lean();

        return res
          .status(200)
          .json(
            movimientos
          );

      } catch (error) {

        console.error(
          "ERROR OBTENIENDO MOVIMIENTOS:",
          error
        );

        return res
          .status(500)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener movimientos",
          });
      }
    };

  /* =========================
      OBTENER POR ID
  ========================= */

  static getMovimientoById =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const id =
          obtenerString(
            req.params.id
          );

        if (
          !id ||
          !mongoose.isValidObjectId(
            id
          )
        ) {
          return res
            .status(400)
            .json({
              error:
                "El ID del movimiento no es válido",
            });
        }

        const movimiento =
          await queryMovimientos({
            _id:
              new mongoose.Types.ObjectId(
                id
              ),
          })
            .findOne()
            .lean();

        if (!movimiento) {
          return res
            .status(404)
            .json({
              error:
                "Movimiento no encontrado",
            });
        }

        return res
          .status(200)
          .json(
            movimiento
          );

      } catch (error) {

        console.error(
          "ERROR OBTENIENDO MOVIMIENTO:",
          error
        );

        return res
          .status(500)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener movimiento",
          });
      }
    };

  /* =========================
      FILTRAR MOVIMIENTOS
  ========================= */

  static getMovimientosFiltrados =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtro =
          construirFiltroBase(
            req
          );

        console.log(
          "FILTRO MOVIMIENTOS:",
          JSON.stringify(
            filtro,
            null,
            2
          )
        );

        const movimientos =
          await queryMovimientos(
            filtro
          ).lean();

        console.log(
          `MOVIMIENTOS ENCONTRADOS: ${movimientos.length}`
        );

        return res
          .status(200)
          .json(
            movimientos
          );

      } catch (error) {

        console.error(
          "ERROR FILTRANDO MOVIMIENTOS:",
          error
        );

        return res
          .status(400)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al filtrar movimientos",
          });
      }
    };

  /* =========================
      PRODUCTOS MÁS VENDIDOS
  ========================= */

  static getProductosMasVendidos =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtroBase =
          construirFiltroBase(
            req
          );

        const limiteRaw =
          obtenerString(
            req.query.limite
          );

        const limite =
          Math.min(
            Math.max(
              numero(
                limiteRaw ||
                  10
              ),
              1
            ),
            100
          );

        /*
          No exigimos origenMovimiento="venta",
          porque varios movimientos antiguos no tienen
          ese campo. Basta con salida_inventario y
          referenciaModelo Venta, o con origen venta.
        */
        const filtroProducto: Record<
          string,
          unknown
        > = {
          ...filtroBase,
          tipoMovimiento:
            "salida_inventario",
          idProducto: {
            $ne:
              null,
          },
          $or: [
            {
              origenMovimiento:
                "venta",
            },
            {
              referenciaModelo:
                "Venta",
            },
            {
              idVenta: {
                $ne:
                  null,
              },
            },
          ],
        };

        const productos =
          await Movimiento.aggregate([
            {
              $match:
                filtroProducto,
            },
            {
              $group: {
                _id:
                  "$idProducto",

                cantidadVendida: {
                  $sum: {
                    $ifNull: [
                      "$cantidadSalida",
                      "$cantidad",
                    ],
                  },
                },

                totalVendido: {
                  $sum: {
                    $cond: [
                      {
                        $gt: [
                          {
                            $ifNull: [
                              "$subtotal",
                              0,
                            ],
                          },
                          0,
                        ],
                      },
                      "$subtotal",
                      {
                        $multiply: [
                          {
                            $ifNull: [
                              "$cantidadSalida",
                              "$cantidad",
                            ],
                          },
                          {
                            $ifNull: [
                              "$precioUnitario",
                              0,
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },

                costoTotal: {
                  $sum: {
                    $multiply: [
                      {
                        $ifNull: [
                          "$cantidadSalida",
                          "$cantidad",
                        ],
                      },
                      {
                        $ifNull: [
                          "$costoUnitario",
                          0,
                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              $addFields: {
                utilidad: {
                  $subtract: [
                    "$totalVendido",
                    "$costoTotal",
                  ],
                },
              },
            },
            {
              $lookup: {
                from:
                  "productos",
                localField:
                  "_id",
                foreignField:
                  "_id",
                as:
                  "producto",
              },
            },
            {
              $unwind: {
                path:
                  "$producto",
                preserveNullAndEmptyArrays:
                  true,
              },
            },
            {
              $project: {
                _id:
                  0,
                idProducto:
                  "$_id",
                producto:
                  "$producto",
                nombre: {
                  $ifNull: [
                    "$producto.nombre",
                    "Producto sin nombre",
                  ],
                },
                cantidadVendida:
                  1,
                totalVendido: {
                  $round: [
                    "$totalVendido",
                    2,
                  ],
                },
                costoTotal: {
                  $round: [
                    "$costoTotal",
                    2,
                  ],
                },
                utilidad: {
                  $round: [
                    "$utilidad",
                    2,
                  ],
                },
              },
            },
            {
              $sort: {
                cantidadVendida:
                  -1,
              },
            },
            {
              $limit:
                limite,
            },
          ]);

        return res
          .status(200)
          .json(
            productos
          );

      } catch (error) {

        console.error(
          "ERROR PRODUCTOS MÁS VENDIDOS:",
          error
        );

        return res
          .status(400)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener productos más vendidos",
          });
      }
    };

  /* =========================
      REPORTE CAJA DIARIA
  ========================= */

  static getReporteCajaDiaria =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtro =
          construirFiltroBase(
            req
          );

        const movimientos =
          await queryMovimientos(
            filtro
          ).lean();

        let montoInicial =
          0;

        let ventasEfectivo =
          0;

        let ventasQr =
          0;

        let ventasTransferencia =
          0;

        let ventasMixtas =
          0;

        let egresosEfectivo =
          0;

        let egresosQr =
          0;

        let egresosTransferencia =
          0;

        let cortesias =
          0;

        let ventasAnuladas =
          0;

        let montoReal =
          0;

        let diferencia =
          0;

        let estado =
          "sin_cierre";

        for (
          const movimiento
          of movimientos
        ) {

          if (
            movimiento.tipoMovimiento ===
            "apertura_caja"
          ) {
            montoInicial +=
              numero(
                movimiento.montoInicial ||
                  movimiento.montoEntrada
              );
          }

          if (
            movimiento.tipoMovimiento ===
            "venta" &&
            movimiento.estado !==
              "anulado" &&
            movimiento.estado !==
              "cortesia"
          ) {

            const monto =
              numero(
                movimiento.total ||
                  movimiento.montoEntrada ||
                  movimiento.subtotal
              );

            if (
              movimiento.metodoPago ===
              "efectivo"
            ) {
              ventasEfectivo +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "qr"
            ) {
              ventasQr +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "transferencia"
            ) {
              ventasTransferencia +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "mixto"
            ) {
              ventasMixtas +=
                monto;
            }
          }

          if (
            movimiento.tipoMovimiento ===
            "egreso" &&
            movimiento.estado !==
              "anulado"
          ) {

            const monto =
              numero(
                movimiento.total ||
                  movimiento.montoSalida
              );

            if (
              movimiento.metodoPago ===
              "efectivo"
            ) {
              egresosEfectivo +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "qr"
            ) {
              egresosQr +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "transferencia"
            ) {
              egresosTransferencia +=
                monto;
            }
          }

          if (
            movimiento.tipoMovimiento ===
            "cortesia"
          ) {
            cortesias +=
              numero(
                movimiento.total ||
                  movimiento.subtotal ||
                  movimiento.montoSalida
              );
          }

          if (
            movimiento.tipoMovimiento ===
            "venta_anulada"
          ) {
            ventasAnuladas +=
              numero(
                movimiento.total ||
                  movimiento.subtotal ||
                  movimiento.montoSalida
              );
          }

          if (
            movimiento.tipoMovimiento ===
            "cierre_caja"
          ) {
            montoReal =
              numero(
                movimiento.montoReal ||
                  movimiento.montoFisico
              );

            diferencia =
              numero(
                movimiento.diferenciaMonto
              );

            estado =
              movimiento.estado ||
              "cerrado";
          }
        }

        const totalVentas =
          ventasEfectivo +
          ventasQr +
          ventasTransferencia +
          ventasMixtas;

        const totalEgresos =
          egresosEfectivo +
          egresosQr +
          egresosTransferencia;

        const montoEsperado =
          montoInicial +
          ventasEfectivo -
          egresosEfectivo;

        return res
          .status(200)
          .json({
            fechaInicio:
              obtenerString(
                req.query.fechaInicio
              ) ||
              null,

            fechaFin:
              obtenerString(
                req.query.fechaFin
              ) ||
              null,

            montoInicial:
              redondear(
                montoInicial
              ),

            ventasEfectivo:
              redondear(
                ventasEfectivo
              ),

            ventasQr:
              redondear(
                ventasQr
              ),

            ventasTransferencia:
              redondear(
                ventasTransferencia
              ),

            ventasMixtas:
              redondear(
                ventasMixtas
              ),

            totalVentas:
              redondear(
                totalVentas
              ),

            egresosEfectivo:
              redondear(
                egresosEfectivo
              ),

            egresosQr:
              redondear(
                egresosQr
              ),

            egresosTransferencia:
              redondear(
                egresosTransferencia
              ),

            totalEgresos:
              redondear(
                totalEgresos
              ),

            cortesias:
              redondear(
                cortesias
              ),

            ventasAnuladas:
              redondear(
                ventasAnuladas
              ),

            montoEsperado:
              redondear(
                montoEsperado
              ),

            montoReal:
              redondear(
                montoReal
              ),

            diferencia:
              redondear(
                diferencia
              ),

            estado,

            movimientos,
          });

      } catch (error) {

        console.error(
          "ERROR REPORTE CAJA:",
          error
        );

        return res
          .status(400)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener reporte de caja diaria",
          });
      }
    };

  /* =========================
      ESTADO DE RESULTADOS
  ========================= */

  static getEstadoResultados =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtro =
          construirFiltroBase(
            req
          );

        const movimientos =
          await Movimiento.find(
            filtro
          )
            .sort({
              fecha:
                1,
            })
            .lean();

        let ingresosVentas =
          0;

        let cortesias =
          0;

        let ventasAnuladas =
          0;

        let costoVentas =
          0;

        let egresos =
          0;

        for (
          const movimiento
          of movimientos
        ) {

          if (
            movimiento.tipoMovimiento ===
            "venta" &&
            movimiento.estado !==
              "anulado" &&
            movimiento.estado !==
              "cortesia"
          ) {
            ingresosVentas +=
              numero(
                movimiento.total ||
                  movimiento.montoEntrada ||
                  movimiento.subtotal
              );
          }

          if (
            movimiento.tipoMovimiento ===
            "cortesia"
          ) {
            cortesias +=
              numero(
                movimiento.total ||
                  movimiento.subtotal ||
                  movimiento.montoSalida
              );
          }

          if (
            movimiento.tipoMovimiento ===
            "venta_anulada"
          ) {
            ventasAnuladas +=
              numero(
                movimiento.total ||
                  movimiento.subtotal ||
                  movimiento.montoSalida
              );
          }

          if (
            movimiento.tipoMovimiento ===
            "salida_inventario" &&
            (
              movimiento.origenMovimiento ===
                "venta" ||
              movimiento.referenciaModelo ===
                "Venta" ||
              movimiento.idVenta
            )
          ) {
            costoVentas +=
              numero(
                movimiento.cantidadSalida ||
                  movimiento.cantidad
              ) *
              numero(
                movimiento.costoUnitario
              );
          }

          if (
            movimiento.tipoMovimiento ===
            "egreso" &&
            movimiento.estado !==
              "anulado"
          ) {
            egresos +=
              numero(
                movimiento.total ||
                  movimiento.montoSalida
              );
          }
        }

        const utilidadBruta =
          ingresosVentas -
          costoVentas;

        const utilidadNeta =
          utilidadBruta -
          egresos;

        return res
          .status(200)
          .json({
            fechaInicio:
              obtenerString(
                req.query.fechaInicio
              ) ||
              null,

            fechaFin:
              obtenerString(
                req.query.fechaFin
              ) ||
              null,

            ingresosVentas:
              redondear(
                ingresosVentas
              ),

            cortesias:
              redondear(
                cortesias
              ),

            ventasAnuladas:
              redondear(
                ventasAnuladas
              ),

            costoVentas:
              redondear(
                costoVentas
              ),

            utilidadBruta:
              redondear(
                utilidadBruta
              ),

            egresos:
              redondear(
                egresos
              ),

            utilidadNeta:
              redondear(
                utilidadNeta
              ),
          });

      } catch (error) {

        console.error(
          "ERROR ESTADO RESULTADOS:",
          error
        );

        return res
          .status(400)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener estado de resultados",
          });
      }
    };

  /* =========================
      FLUJO DE EFECTIVO
  ========================= */

  static getFlujoEfectivo =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtro =
          construirFiltroBase(
            req
          );

        const movimientos =
          await Movimiento.find(
            filtro
          )
            .sort({
              fecha:
                1,
            })
            .lean();

        let saldoInicial =
          0;

        let entradasEfectivo =
          0;

        let entradasQr =
          0;

        let entradasTransferencia =
          0;

        let entradasMixto =
          0;

        let salidasEfectivo =
          0;

        let salidasQr =
          0;

        let salidasTransferencia =
          0;

        for (
          const movimiento
          of movimientos
        ) {

          if (
            movimiento.tipoMovimiento ===
            "apertura_caja"
          ) {
            saldoInicial +=
              numero(
                movimiento.montoInicial ||
                  movimiento.montoEntrada
              );

            continue;
          }

          if (
            movimiento.tipoMovimiento ===
            "venta" &&
            movimiento.estado !==
              "anulado" &&
            movimiento.estado !==
              "cortesia"
          ) {

            const monto =
              numero(
                movimiento.total ||
                  movimiento.montoEntrada ||
                  movimiento.subtotal
              );

            if (
              movimiento.metodoPago ===
              "efectivo"
            ) {
              entradasEfectivo +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "qr"
            ) {
              entradasQr +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "transferencia"
            ) {
              entradasTransferencia +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "mixto"
            ) {
              entradasMixto +=
                monto;
            }
          }

          if (
            movimiento.tipoMovimiento ===
            "egreso" &&
            movimiento.estado !==
              "anulado"
          ) {

            const monto =
              numero(
                movimiento.total ||
                  movimiento.montoSalida
              );

            if (
              movimiento.metodoPago ===
              "efectivo"
            ) {
              salidasEfectivo +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "qr"
            ) {
              salidasQr +=
                monto;
            }

            if (
              movimiento.metodoPago ===
              "transferencia"
            ) {
              salidasTransferencia +=
                monto;
            }
          }
        }

        const totalEntradas =
          entradasEfectivo +
          entradasQr +
          entradasTransferencia +
          entradasMixto;

        const totalSalidas =
          salidasEfectivo +
          salidasQr +
          salidasTransferencia;

        const flujoNeto =
          totalEntradas -
          totalSalidas;

        const saldoFinal =
          saldoInicial +
          flujoNeto;

        return res
          .status(200)
          .json({
            fechaInicio:
              obtenerString(
                req.query.fechaInicio
              ) ||
              null,

            fechaFin:
              obtenerString(
                req.query.fechaFin
              ) ||
              null,

            entradasEfectivo:
              redondear(
                entradasEfectivo
              ),

            entradasQr:
              redondear(
                entradasQr
              ),

            entradasTransferencia:
              redondear(
                entradasTransferencia
              ),

            entradasMixto:
              redondear(
                entradasMixto
              ),

            totalEntradas:
              redondear(
                totalEntradas
              ),

            salidasEfectivo:
              redondear(
                salidasEfectivo
              ),

            salidasQr:
              redondear(
                salidasQr
              ),

            salidasTransferencia:
              redondear(
                salidasTransferencia
              ),

            totalSalidas:
              redondear(
                totalSalidas
              ),

            flujoNeto:
              redondear(
                flujoNeto
              ),

            saldoInicial:
              redondear(
                saldoInicial
              ),

            saldoFinal:
              redondear(
                saldoFinal
              ),
          });

      } catch (error) {

        console.error(
          "ERROR FLUJO EFECTIVO:",
          error
        );

        return res
          .status(400)
          .json({
            error:
              error instanceof Error
                ? error.message
                : "Error al obtener flujo de efectivo",
          });
      }
    };
}
