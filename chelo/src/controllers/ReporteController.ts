// src/controllers/ReporteController.ts

import type {
  Request,
  Response,
} from "express";




import Movimiento from "../models/Movimiento";
import Almacen from "../models/Almacen";
import Venta from "../models/Venta";
import DetalleVenta from "../models/DetalleVenta";
import Egreso from "../models/Egreso";
import Inventario from "../models/Inventario";

import CierreCaja from "../models/CierreCaja";
import AperturaCaja from "../models/AperturaCaja";
import Solicitud from "../models/Solicitud";
import mongoose from "mongoose";




import {
  ReporteService,
  type ReporteFiltros,
} from "../services/ReporteService";
function obtenerString(
  valor: unknown
): string | undefined {

  if (
    typeof valor === "string"
  ) {
    return valor;
  }

  if (
    Array.isArray(valor) &&
    typeof valor[0] === "string"
  ) {
    return valor[0];
  }

  return undefined;
}

function obtenerFiltros(
  req: Request
): ReporteFiltros {

  return {

    fechaDesde:
      obtenerString(
        req.query.fechaDesde
      ),

    fechaHasta:
      obtenerString(
        req.query.fechaHasta
      ),

    idSucursal:
      obtenerString(
        req.query.idSucursal
      ),

    idCaja:
      obtenerString(
        req.query.idCaja
      ),

    idPerfil:
      obtenerString(
        req.query.idPerfil
      ),

    idAlmacen:
      obtenerString(
        req.query.idAlmacen
      ),

    idProducto:
      obtenerString(
        req.query.idProducto
      ),

    estado:
      obtenerString(
        req.query.estado
      ),

    metodoPago:
      obtenerString(
        req.query.metodoPago
      ),

    limite:
      obtenerString(
        req.query.limite
      ),

  };
}

function responderError(
  res: Response,
  error: unknown,
  mensaje: string
) {

  console.error(
    mensaje,
    error
  );

  return res.status(500).json({
    error:
      error instanceof Error
        ? error.message
        : mensaje,
  });
}
type ReferenciaPopuladaKardex = {
  _id?: mongoose.Types.ObjectId | string;
  nombre?: string;
  marca?: string;
  tipo?: string;
  descripcion?: string;
  idSucursal?: mongoose.Types.ObjectId | string;
};

type PerfilPopuladoKardex = {
  _id?: mongoose.Types.ObjectId | string;
  nombres?: string;
  apellidos?: string;
  email?: string;
};

type MovimientoKardexLean = {
  _id: mongoose.Types.ObjectId | string;

  fecha?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  tipoMovimiento?: string;

  cantidad?: number;
  cantidadEntrada?: number;
  cantidadSalida?: number;

  saldoAnterior?: number;
  saldoActual?: number;

  costoUnitario?: number;
  costoTotal?: number;

  motivo?: string;
  referencia?: string;
  observacion?: string;
  estado?: boolean | string;

  idProducto?:
    | mongoose.Types.ObjectId
    | string
    | ReferenciaPopuladaKardex
    | null;

  idAlmacen?:
    | mongoose.Types.ObjectId
    | string
    | ReferenciaPopuladaKardex
    | null;

  idAlmacenOrigen?:
    | mongoose.Types.ObjectId
    | string
    | ReferenciaPopuladaKardex
    | null;

  idAlmacenDestino?:
    | mongoose.Types.ObjectId
    | string
    | ReferenciaPopuladaKardex
    | null;

  idPerfil?:
    | mongoose.Types.ObjectId
    | string
    | PerfilPopuladoKardex
    | null;
};

type MovimientoKardexNormalizado = {
  _id: string;

  fecha?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  tipoMovimiento: string;

  cantidad: number;
  cantidadEntrada: number;
  cantidadSalida: number;

  saldoAnterior: number;
  saldoActual: number;

  costoUnitario: number;
  costoTotal: number;

  idProducto: string;
  nombreProducto: string;
  marca: string;

  idAlmacen: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;

  idAlmacenOrigen: string;
  nombreAlmacenOrigen: string;

  idAlmacenDestino: string;
  nombreAlmacenDestino: string;

  motivo?: string;
  referencia?: string;
  observacion?: string;
  estado?: boolean | string;

  idPerfil?: MovimientoKardexLean["idPerfil"];
};

function obtenerReferenciaKardex(
  valor: unknown
): ReferenciaPopuladaKardex | null {
  if (
    valor &&
    typeof valor === "object" &&
    !(valor instanceof mongoose.Types.ObjectId)
  ) {
    return valor as ReferenciaPopuladaKardex;
  }

  return null;
}

function obtenerIdReferencia(
  referencia: unknown
): string {
  if (!referencia) {
    return "";
  }

  if (typeof referencia === "string") {
    return referencia;
  }

  if (
    referencia instanceof
    mongoose.Types.ObjectId
  ) {
    return referencia.toString();
  }

  if (
    typeof referencia === "object" &&
    "_id" in referencia
  ) {
    const id = (
      referencia as {
        _id?: unknown;
      }
    )._id;

    return id
      ? String(id)
      : "";
  }

  return "";
}

function normalizarTipoMovimiento(
  valor: unknown
): string {
  return String(valor ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
}

function numeroSeguro(
  valor: unknown
): number {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}

function nombreReferencia(
  referencia: ReferenciaPopuladaKardex | null,
  valorPredeterminado: string
): string {
  const nombre =
    referencia?.nombre?.trim();

  return nombre ||
    valorPredeterminado;
}

function normalizarMovimientosKardex(
  movimientos: MovimientoKardexLean[],
  idsAlmacenesSucursal: Set<string>,
  idAlmacenFiltro?: string
): MovimientoKardexNormalizado[] {
  const saldos =
    new Map<string, number>();

  return movimientos.map(
    (movimiento) => {
      const producto =
        obtenerReferenciaKardex(
          movimiento.idProducto
        );

      const almacenDirecto =
        obtenerReferenciaKardex(
          movimiento.idAlmacen
        );

      const almacenOrigen =
        obtenerReferenciaKardex(
          movimiento.idAlmacenOrigen
        );

      const almacenDestino =
        obtenerReferenciaKardex(
          movimiento.idAlmacenDestino
        );

      const idProductoMovimiento =
        obtenerIdReferencia(
          movimiento.idProducto
        );

      const idAlmacenDirecto =
        obtenerIdReferencia(
          movimiento.idAlmacen
        );

      const idAlmacenOrigen =
        obtenerIdReferencia(
          movimiento.idAlmacenOrigen
        );

      const idAlmacenDestino =
        obtenerIdReferencia(
          movimiento.idAlmacenDestino
        );

      const tipo =
        normalizarTipoMovimiento(
          movimiento.tipoMovimiento
        );

      const entradaGuardada =
        Math.abs(
          numeroSeguro(
            movimiento.cantidadEntrada
          )
        );

      const salidaGuardada =
        Math.abs(
          numeroSeguro(
            movimiento.cantidadSalida
          )
        );

      const cantidadGuardada =
        Math.abs(
          numeroSeguro(
            movimiento.cantidad
          )
        );

      /*
       * Algunos documentos guardan solo "cantidad";
       * otros guardan cantidadEntrada/cantidadSalida.
       * Se usa el mayor valor disponible como cantidad base.
       */
      const cantidad =
        Math.max(
          cantidadGuardada,
          entradaGuardada,
          salidaGuardada
        );

      let cantidadEntrada =
        entradaGuardada;

      let cantidadSalida =
        salidaGuardada;

      const origenPertenece =
        idsAlmacenesSucursal.has(
          idAlmacenOrigen
        );

      const destinoPertenece =
        idsAlmacenesSucursal.has(
          idAlmacenDestino
        );

      /*
       * Solo se infiere el sentido cuando el documento
       * no trae cantidadEntrada ni cantidadSalida.
       */
      if (
        cantidadEntrada === 0 &&
        cantidadSalida === 0
      ) {
        const esTransferencia =
          tipo.includes(
            "transferencia"
          ) ||
          tipo.includes(
            "solicitud"
          );

        if (esTransferencia) {
          if (idAlmacenFiltro) {
            if (
              idAlmacenDestino ===
              idAlmacenFiltro
            ) {
              cantidadEntrada =
                cantidad;
            }

            if (
              idAlmacenOrigen ===
              idAlmacenFiltro
            ) {
              cantidadSalida =
                cantidad;
            }
          } else if (
            destinoPertenece &&
            !origenPertenece
          ) {
            cantidadEntrada =
              cantidad;
          } else if (
            origenPertenece &&
            !destinoPertenece
          ) {
            cantidadSalida =
              cantidad;
          } else if (
            origenPertenece &&
            destinoPertenece
          ) {
            /*
             * Transferencia interna de la misma sucursal:
             * entra y sale la misma cantidad, por lo que
             * el efecto neto de la sucursal es cero.
             */
            cantidadEntrada =
              cantidad;

            cantidadSalida =
              cantidad;
          }
        } else if (
          tipo.includes("entrada") ||
          tipo.includes("ingreso") ||
          tipo.includes("compra") ||
          tipo.includes("devolucion_entrada")
        ) {
          cantidadEntrada =
            cantidad;
        } else if (
          tipo.includes("salida") ||
          tipo.includes("egreso") ||
          tipo.includes("venta") ||
          tipo.includes("devolucion_salida")
        ) {
          cantidadSalida =
            cantidad;
        } else if (
          tipo.includes("ajuste") ||
          tipo.includes("diferencia") ||
          tipo.includes("conteo")
        ) {
          if (
            tipo.includes("positivo") ||
            tipo.includes("entrada") ||
            tipo.includes("aumento")
          ) {
            cantidadEntrada =
              cantidad;
          }

          if (
            tipo.includes("negativo") ||
            tipo.includes("salida") ||
            tipo.includes("disminucion")
          ) {
            cantidadSalida =
              cantidad;
          }
        }
      }

      let almacenMostrar =
        almacenDirecto;

      let idAlmacenMostrar =
        idAlmacenDirecto;

      if (
        cantidadEntrada > 0 &&
        cantidadSalida === 0
      ) {
        almacenMostrar =
          almacenDestino ??
          almacenDirecto ??
          almacenOrigen;

        idAlmacenMostrar =
          idAlmacenDestino ||
          idAlmacenDirecto ||
          idAlmacenOrigen;
      }

      if (
        cantidadSalida > 0 &&
        cantidadEntrada === 0
      ) {
        almacenMostrar =
          almacenOrigen ??
          almacenDirecto ??
          almacenDestino;

        idAlmacenMostrar =
          idAlmacenOrigen ||
          idAlmacenDirecto ||
          idAlmacenDestino;
      }

      const nombreOrigen =
        nombreReferencia(
          almacenOrigen,
          ""
        );

      const nombreDestino =
        nombreReferencia(
          almacenDestino,
          ""
        );

      let nombreAlmacen =
        nombreReferencia(
          almacenMostrar,
          "Almacén sin nombre"
        );

      if (
        cantidadEntrada > 0 &&
        cantidadSalida > 0 &&
        nombreOrigen &&
        nombreDestino
      ) {
        nombreAlmacen =
          `${nombreOrigen} → ${nombreDestino}`;
      }

      const claveSaldo =
        `${idProductoMovimiento}:${idAlmacenMostrar}`;

      const saldoCalculadoAnterior =
        saldos.get(
          claveSaldo
        ) ?? 0;

      /*
       * Si el movimiento ya tiene saldos confiables,
       * se respetan. De lo contrario se calculan.
       */
      const tieneSaldoAnterior =
        movimiento.saldoAnterior !==
          undefined &&
        movimiento.saldoAnterior !==
          null;

      const tieneSaldoActual =
        movimiento.saldoActual !==
          undefined &&
        movimiento.saldoActual !==
          null;

      const saldoAnterior =
        tieneSaldoAnterior
          ? numeroSeguro(
              movimiento.saldoAnterior
            )
          : saldoCalculadoAnterior;

      const saldoActual =
        tieneSaldoActual
          ? numeroSeguro(
              movimiento.saldoActual
            )
          : saldoAnterior +
            cantidadEntrada -
            cantidadSalida;

      saldos.set(
        claveSaldo,
        saldoActual
      );

      const costoUnitario =
        Math.max(
          numeroSeguro(
            movimiento.costoUnitario
          ),
          0
        );

      const costoTotalGuardado =
        numeroSeguro(
          movimiento.costoTotal
        );

      const costoTotal =
        costoTotalGuardado > 0
          ? costoTotalGuardado
          : cantidad *
            costoUnitario;

      return {
        _id:
          String(
            movimiento._id
          ),

        fecha:
          movimiento.fecha ??
          movimiento.createdAt,

        createdAt:
          movimiento.createdAt,

        updatedAt:
          movimiento.updatedAt,

        tipoMovimiento:
          String(
            movimiento.tipoMovimiento ??
              ""
          ),

        cantidad,

        cantidadEntrada,
        cantidadSalida,

        saldoAnterior,
        saldoActual,

        costoUnitario,
        costoTotal,

        idProducto:
          idProductoMovimiento,

        nombreProducto:
          nombreReferencia(
            producto,
            "Producto sin nombre"
          ),

        marca:
          producto?.marca?.trim() ||
          "Sin marca",

        idAlmacen:
          idAlmacenMostrar,

        nombreAlmacen,

        tipoAlmacen:
          almacenMostrar?.tipo,

        idAlmacenOrigen,

        nombreAlmacenOrigen:
          nombreOrigen ||
          "Sin almacén de origen",

        idAlmacenDestino,

        nombreAlmacenDestino:
          nombreDestino ||
          "Sin almacén de destino",

        motivo:
          movimiento.motivo,

        referencia:
          movimiento.referencia,

        observacion:
          movimiento.observacion,

        estado:
          movimiento.estado,

        idPerfil:
          movimiento.idPerfil,
      };
    }
  );
}

export class ReporteController {

  /* =====================================================
      1. DASHBOARD GENERAL
  ===================================================== */

  static getDashboard =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const matchVenta =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        /*
          El dashboard considera ingresos reales:
          solamente ventas pagadas.
        */
        matchVenta.estado =
          "pagado";

        const matchEgreso =
          ReporteService
            .construirMatch(
              filtros,
              "fechaEgreso"
            );

        matchEgreso.estado =
          "registrado";

        const matchSolicitud =
          ReporteService
            .construirMatch(
              filtros,
              "fechaSolicitud"
            );

        matchSolicitud.estado =
          "pendiente";

        const inventarioMatch:
          Record<string, unknown> = {
            estado:
              true,
          };

        const idAlmacen =
          ReporteService.objectId(
            filtros.idAlmacen
          );

        const idProducto =
          ReporteService.objectId(
            filtros.idProducto
          );

        if (idAlmacen) {
          inventarioMatch.idAlmacen =
            idAlmacen;
        }

        if (idProducto) {
          inventarioMatch.idProducto =
            idProducto;
        }

        const [
          resumenVentas,
          resumenEgresos,
          cajasAbiertas,
          solicitudesPendientes,
          stockBajo,
          productoMasVendido,
          vendedorMayorVenta,
        ] = await Promise.all([

          Venta.aggregate([
            {
              $match:
                matchVenta,
            },
            {
              $group: {
                _id:
                  null,
                totalVentas: {
                  $sum:
                    "$total",
                },
                cantidadVentas: {
                  $sum:
                    1,
                },
                ticketPromedio: {
                  $avg:
                    "$total",
                },
              },
            },
          ]),

          Egreso.aggregate([
            {
              $match:
                matchEgreso,
            },
            {
              $group: {
                _id:
                  null,
                totalEgresos: {
                  $sum:
                    "$total",
                },
                cantidadEgresos: {
                  $sum:
                    1,
                },
              },
            },
          ]),

          AperturaCaja.countDocuments({
            estado:
              "abierta",
            ...(filtros.idSucursal
              ? {
                  idSucursal:
                    ReporteService.objectId(
                      filtros.idSucursal
                    ),
                }
              : {}),
          }),

          Solicitud.countDocuments(
            matchSolicitud
          ),

          Inventario.aggregate([
            {
              $match:
                inventarioMatch,
            },
            {
              $match: {
                $expr: {
                  $lte: [
                    "$cantidad",
                    "$stockMinimo",
                  ],
                },
              },
            },
            {
              $count:
                "total",
            },
          ]),

          DetalleVenta.aggregate([
            {
              $lookup: {
                from:
                  "ventas",
                localField:
                  "idVenta",
                foreignField:
                  "_id",
                as:
                  "venta",
              },
            },
            {
              $unwind:
                "$venta",
            },
            {
              $match: {
                ...(matchVenta.fechaVenta
                  ? {
                      "venta.fechaVenta":
                        matchVenta.fechaVenta,
                    }
                  : {}),

                ...(matchVenta.idSucursal
                  ? {
                      "venta.idSucursal":
                        matchVenta.idSucursal,
                    }
                  : {}),

                ...(matchVenta.idCaja
                  ? {
                      "venta.idCaja":
                        matchVenta.idCaja,
                    }
                  : {}),

                ...(matchVenta.idPerfil
                  ? {
                      "venta.idPerfil":
                        matchVenta.idPerfil,
                    }
                  : {}),

                "venta.estado":
                  "pagado",
              },
            },
            {
              $group: {
                _id:
                  "$idProducto",
                cantidadVendida: {
                  $sum:
                    "$cantidad",
                },
                totalVendido: {
                  $sum:
                    "$subtotal",
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
                1,
            },
            ...ReporteService
              .lookupProducto(
                "_id",
                "producto"
              ),
            {
              $project: {
                _id:
                  0,
                idProducto:
                  "$_id",
                nombre: {
                  $ifNull: [
                    "$producto.nombre",
                    "Producto",
                  ],
                },
                marca: {
                  $ifNull: [
                    "$producto.marca",
                    "",
                  ],
                },
                cantidadVendida:
                  1,
                totalVendido:
                  1,
              },
            },
          ]),

          Venta.aggregate([
            {
              $match:
                matchVenta,
            },
            {
              $group: {
                _id:
                  "$idPerfil",
                totalVendido: {
                  $sum:
                    "$total",
                },
                cantidadVentas: {
                  $sum:
                    1,
                },
              },
            },
            {
              $sort: {
                totalVendido:
                  -1,
              },
            },
            {
              $limit:
                1,
            },
            ...ReporteService
              .lookupPerfil(
                "_id",
                "perfil"
              ),
            {
              $project: {
                _id:
                  0,
                idPerfil:
                  "$_id",
                nombres: {
                  $ifNull: [
                    "$perfil.nombres",
                    "Sin nombre",
                  ],
                },
                apellidos: {
                  $ifNull: [
                    "$perfil.apellidos",
                    "",
                  ],
                },
                totalVendido:
                  1,
                cantidadVentas:
                  1,
              },
            },
          ]),
        ]);

        const ventas =
          resumenVentas[0] || {
            totalVentas:
              0,
            cantidadVentas:
              0,
            ticketPromedio:
              0,
          };

        const egresos =
          resumenEgresos[0] || {
            totalEgresos:
              0,
            cantidadEgresos:
              0,
          };

        const gananciaEstimada =
          ReporteService.redondear(
            Number(
              ventas.totalVentas ||
                0
            ) -
              Number(
                egresos.totalEgresos ||
                  0
              )
          );

        return res.json({
          filtros,
          resumen: {
            totalVentas:
              ReporteService.redondear(
                ventas.totalVentas ||
                  0
              ),

            cantidadVentas:
              ventas.cantidadVentas ||
              0,

            ticketPromedio:
              ReporteService.redondear(
                ventas.ticketPromedio ||
                  0
              ),

            totalEgresos:
              ReporteService.redondear(
                egresos.totalEgresos ||
                  0
              ),

            cantidadEgresos:
              egresos.cantidadEgresos ||
              0,

            gananciaEstimada,

            cajasAbiertas,

            solicitudesPendientes,

            productosStockBajo:
              stockBajo[0]?.total ||
              0,
          },

          productoMasVendido:
            productoMasVendido[0] ||
            null,

          vendedorMayorVenta:
            vendedorMayorVenta[0] ||
            null,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando dashboard"
        );
      }
    };

  /* =====================================================
      2. RESUMEN DE VENTAS
  ===================================================== */

  static getVentasResumen =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        const resultado =
          await Venta.aggregate([
            {
              $match:
                match,
            },
            {
              $group: {
                _id:
                  "$estado",

                cantidad: {
                  $sum:
                    1,
                },

                subtotal: {
                  $sum:
                    "$subtotal",
                },

                descuento: {
                  $sum:
                    "$descuento",
                },

                total: {
                  $sum:
                    "$total",
                },

                promedio: {
                  $avg:
                    "$total",
                },
              },
            },
            {
              $sort: {
                _id:
                  1,
              },
            },
          ]);

        const resumen = {
          pagado: {
            cantidad:
              0,
            subtotal:
              0,
            descuento:
              0,
            total:
              0,
            promedio:
              0,
          },

          anulado: {
            cantidad:
              0,
            subtotal:
              0,
            descuento:
              0,
            total:
              0,
            promedio:
              0,
          },

          cortesia: {
            cantidad:
              0,
            subtotal:
              0,
            descuento:
              0,
            total:
              0,
            promedio:
              0,
          },
        };

        for (
          const item
          of resultado
        ) {

          const estado =
            item._id as
              | "pagado"
              | "anulado"
              | "cortesia";

          if (
            resumen[estado]
          ) {

            resumen[estado] = {
              cantidad:
                item.cantidad,
              subtotal:
                ReporteService.redondear(
                  item.subtotal
                ),
              descuento:
                ReporteService.redondear(
                  item.descuento
                ),
              total:
                ReporteService.redondear(
                  item.total
                ),
              promedio:
                ReporteService.redondear(
                  item.promedio
                ),
            };
          }
        }

        return res.json({
          filtros,
          resumen,
          ingresosReales:
            resumen.pagado.total,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando resumen de ventas"
        );
      }
    };

  /* =====================================================
      3. VENTAS POR SUCURSAL
  ===================================================== */

  static getVentasPorSucursal =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        match.estado =
          filtros.estado ||
          "pagado";

        const resultado =
          await Venta.aggregate([
            {
              $match:
                match,
            },
            {
              $group: {
                _id:
                  "$idSucursal",
                cantidadVentas: {
                  $sum:
                    1,
                },
                subtotal: {
                  $sum:
                    "$subtotal",
                },
                descuento: {
                  $sum:
                    "$descuento",
                },
                totalVendido: {
                  $sum:
                    "$total",
                },
                ticketPromedio: {
                  $avg:
                    "$total",
                },
              },
            },
            ...ReporteService
              .lookupSucursal(
                "_id",
                "sucursal"
              ),
            {
              $project: {
                _id:
                  0,
                idSucursal:
                  "$_id",
                nombreSucursal: {
                  $ifNull: [
                    "$sucursal.nombreSucursal",
                    "$sucursal.nombre",
                    "Sucursal",
                  ],
                },
                cantidadVentas:
                  1,
                subtotal:
                  1,
                descuento:
                  1,
                totalVendido:
                  1,
                ticketPromedio: {
                  $round: [
                    "$ticketPromedio",
                    2,
                  ],
                },
              },
            },
            {
              $sort: {
                totalVendido:
                  -1,
              },
            },
          ]);

        return res.json({
          filtros,
          data:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando ventas por sucursal"
        );
      }
    };

  /* =====================================================
      4. VENTAS POR CAJA
  ===================================================== */

  static getVentasPorCaja =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        match.estado =
          filtros.estado ||
          "pagado";

        const resultado =
          await Venta.aggregate([
            {
              $match:
                match,
            },
            {
              $group: {
                _id:
                  "$idCaja",
                idSucursal: {
                  $first:
                    "$idSucursal",
                },
                cantidadVentas: {
                  $sum:
                    1,
                },
                totalVendido: {
                  $sum:
                    "$total",
                },
                ticketPromedio: {
                  $avg:
                    "$total",
                },
              },
            },
            ...ReporteService
              .lookupCaja(
                "_id",
                "caja"
              ),
            ...ReporteService
              .lookupSucursal(
                "idSucursal",
                "sucursal"
              ),
            {
              $project: {
                _id:
                  0,
                idCaja:
                  "$_id",
                nombreCaja: {
                  $ifNull: [
                    "$caja.nombre",
                    "Caja",
                  ],
                },
                idSucursal:
                  1,
                nombreSucursal: {
                  $ifNull: [
                    "$sucursal.nombreSucursal",
                    "$sucursal.nombre",
                    "Sucursal",
                  ],
                },
                cantidadVentas:
                  1,
                totalVendido:
                  1,
                ticketPromedio: {
                  $round: [
                    "$ticketPromedio",
                    2,
                  ],
                },
              },
            },
            {
              $sort: {
                totalVendido:
                  -1,
              },
            },
          ]);

        return res.json({
          filtros,
          data:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando ventas por caja"
        );
      }
    };

  /* =====================================================
      5. VENTAS POR VENDEDOR / MESERO
  ===================================================== */

  static getVentasPorVendedor =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        match.estado =
          filtros.estado ||
          "pagado";

        const resultado =
          await Venta.aggregate([
            {
              $match:
                match,
            },
            {
              $group: {
                _id:
                  "$idPerfil",
                cantidadVentas: {
                  $sum:
                    1,
                },
                subtotal: {
                  $sum:
                    "$subtotal",
                },
                descuento: {
                  $sum:
                    "$descuento",
                },
                totalVendido: {
                  $sum:
                    "$total",
                },
                ticketPromedio: {
                  $avg:
                    "$total",
                },
              },
            },
            ...ReporteService
              .lookupPerfil(
                "_id",
                "perfil"
              ),
            {
              $project: {
                _id:
                  0,
                idPerfil:
                  "$_id",
                nombres: {
                  $ifNull: [
                    "$perfil.nombres",
                    "Sin nombre",
                  ],
                },
                apellidos: {
                  $ifNull: [
                    "$perfil.apellidos",
                    "",
                  ],
                },
                email: {
                  $ifNull: [
                    "$perfil.email",
                    "",
                  ],
                },
                cantidadVentas:
                  1,
                subtotal:
                  1,
                descuento:
                  1,
                totalVendido:
                  1,
                ticketPromedio: {
                  $round: [
                    "$ticketPromedio",
                    2,
                  ],
                },
              },
            },
            {
              $sort: {
                totalVendido:
                  -1,
              },
            },
          ]);

        return res.json({
          filtros,
          data:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando ventas por vendedor"
        );
      }
    };

  /* =====================================================
      6. MÉTODOS DE PAGO
  ===================================================== */

  static getVentasPorMetodoPago =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        match.estado =
          filtros.estado ||
          "pagado";

        const resultado =
          await Venta.aggregate([
            {
              $match:
                match,
            },
            {
              $group: {
                _id:
                  "$metodoPago",
                cantidadVentas: {
                  $sum:
                    1,
                },
                totalVendido: {
                  $sum:
                    "$total",
                },
                promedio: {
                  $avg:
                    "$total",
                },
              },
            },
            {
              $project: {
                _id:
                  0,
                metodoPago:
                  "$_id",
                cantidadVentas:
                  1,
                totalVendido:
                  1,
                promedio: {
                  $round: [
                    "$promedio",
                    2,
                  ],
                },
              },
            },
            {
              $sort: {
                totalVendido:
                  -1,
              },
            },
          ]);

        return res.json({
          filtros,
          data:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando ventas por método de pago"
        );
      }
    };

  /* =====================================================
      7. PRODUCTOS MÁS VENDIDOS
  ===================================================== */

  static getProductosMasVendidos =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const limite =
          ReporteService.limite(
            filtros.limite,
            10,
            100
          );

        const matchVenta =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        matchVenta.estado =
          filtros.estado ||
          "pagado";

        const idProducto =
          ReporteService.objectId(
            filtros.idProducto
          );

        const matchDetalle:
          Record<string, unknown> = {
            estado:
              "activo",
          };

        if (idProducto) {
          matchDetalle.idProducto =
            idProducto;
        }

        const resultado =
          await DetalleVenta.aggregate([
            {
              $match:
                matchDetalle,
            },
            {
              $lookup: {
                from:
                  "ventas",
                localField:
                  "idVenta",
                foreignField:
                  "_id",
                as:
                  "venta",
              },
            },
            {
              $unwind:
                "$venta",
            },
            {
              $match: {
                ...(matchVenta.fechaVenta
                  ? {
                      "venta.fechaVenta":
                        matchVenta.fechaVenta,
                    }
                  : {}),

                ...(matchVenta.idSucursal
                  ? {
                      "venta.idSucursal":
                        matchVenta.idSucursal,
                    }
                  : {}),

                ...(matchVenta.idCaja
                  ? {
                      "venta.idCaja":
                        matchVenta.idCaja,
                    }
                  : {}),

                ...(matchVenta.idPerfil
                  ? {
                      "venta.idPerfil":
                        matchVenta.idPerfil,
                    }
                  : {}),

                "venta.estado":
                  matchVenta.estado,
              },
            },
            {
              $group: {
                _id:
                  "$idProducto",

                cantidadVendida: {
                  $sum:
                    "$cantidad",
                },

                totalVendido: {
                  $sum:
                    "$subtotal",
                },

                costoTotal: {
                  $sum: {
                    $multiply: [
                      "$cantidad",
                      "$costoUnitario",
                    ],
                  },
                },

                precioPromedio: {
                  $avg:
                    "$precioUnitario",
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
            ...ReporteService
              .lookupProducto(
                "_id",
                "producto"
              ),
            {
              $project: {
                _id:
                  0,
                idProducto:
                  "$_id",
                nombre: {
                  $ifNull: [
                    "$producto.nombre",
                    "Producto",
                  ],
                },
                marca: {
                  $ifNull: [
                    "$producto.marca",
                    "",
                  ],
                },
                idCategoria:
                  "$producto.idCategoria",
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
                precioPromedio: {
                  $round: [
                    "$precioPromedio",
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

        return res.json({
          filtros,
          limite,
          data:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando productos más vendidos"
        );
      }
    };

  /* =====================================================
      8. INVENTARIO GENERAL
  ===================================================== */

  static getInventarioGeneral =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match:
          Record<string, unknown> = {
            estado:
              true,
          };

        const idAlmacen =
          ReporteService.objectId(
            filtros.idAlmacen
          );

        const idProducto =
          ReporteService.objectId(
            filtros.idProducto
          );

        if (idAlmacen) {
          match.idAlmacen =
            idAlmacen;
        }

        if (idProducto) {
          match.idProducto =
            idProducto;
        }

        const pipeline:
          any[] = [
            {
              $match:
                match,
            },
            ...ReporteService
              .lookupAlmacen(),
            ...ReporteService
              .lookupProducto(),
          ];

        const idSucursal =
          ReporteService.objectId(
            filtros.idSucursal
          );

        if (idSucursal) {
          pipeline.push({
            $match: {
              "almacen.idSucursal":
                idSucursal,
            },
          });
        }

        pipeline.push(
          {
            $addFields: {
              valorInventario: {
                $multiply: [
                  "$cantidad",
                  "$costoUnitario",
                ],
              },
              gananciaUnitaria: {
                $subtract: [
                  "$precioVenta",
                  "$costoUnitario",
                ],
              },
              stockBajo: {
                $lte: [
                  "$cantidad",
                  "$stockMinimo",
                ],
              },
            },
          },
          {
            $project: {
              _id:
                1,
              idAlmacen:
                1,
              nombreAlmacen: {
                $ifNull: [
                  "$almacen.nombre",
                  "Almacén",
                ],
              },
              tipoAlmacen:
                "$almacen.tipo",
              idSucursal:
                "$almacen.idSucursal",
              idProducto:
                1,
              nombreProducto: {
                $ifNull: [
                  "$producto.nombre",
                  "Producto",
                ],
              },
              marca:
                "$producto.marca",
              idCategoria:
                "$producto.idCategoria",
              cantidad:
                1,
              costoUnitario:
                1,
              ultimoCostoEntrada:
                1,
              precioVenta:
                1,
              stockMinimo:
                1,
              valorInventario: {
                $round: [
                  "$valorInventario",
                  2,
                ],
              },
              gananciaUnitaria: {
                $round: [
                  "$gananciaUnitaria",
                  2,
                ],
              },
              stockBajo:
                1,
              estado:
                1,
            },
          },
          {
            $sort: {
              nombreAlmacen:
                1,
              nombreProducto:
                1,
            },
          }
        );

        const resultado =
          await Inventario.aggregate(
            pipeline
          );

        return res.json({
          filtros,
          totalRegistros:
            resultado.length,
          data:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando inventario general"
        );
      }
    };

  /* =====================================================
      9. STOCK BAJO Y AGOTADOS
  ===================================================== */

  static getInventarioStockBajo =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match:
          Record<string, unknown> = {
            estado:
              true,
          };

        const idAlmacen =
          ReporteService.objectId(
            filtros.idAlmacen
          );

        const idProducto =
          ReporteService.objectId(
            filtros.idProducto
          );

        if (idAlmacen) {
          match.idAlmacen =
            idAlmacen;
        }

        if (idProducto) {
          match.idProducto =
            idProducto;
        }

        const pipeline:
          any[] = [
            {
              $match:
                match,
            },
            {
              $match: {
                $expr: {
                  $lte: [
                    "$cantidad",
                    "$stockMinimo",
                  ],
                },
              },
            },
            ...ReporteService
              .lookupAlmacen(),
            ...ReporteService
              .lookupProducto(),
          ];

        const idSucursal =
          ReporteService.objectId(
            filtros.idSucursal
          );

        if (idSucursal) {
          pipeline.push({
            $match: {
              "almacen.idSucursal":
                idSucursal,
            },
          });
        }

        pipeline.push(
          {
            $project: {
              _id:
                1,
              idAlmacen:
                1,
              nombreAlmacen:
                "$almacen.nombre",
              tipoAlmacen:
                "$almacen.tipo",
              idSucursal:
                "$almacen.idSucursal",
              idProducto:
                1,
              nombreProducto:
                "$producto.nombre",
              marca:
                "$producto.marca",
              cantidad:
                1,
              stockMinimo:
                1,
              agotado: {
                $lte: [
                  "$cantidad",
                  0,
                ],
              },
              faltanteParaMinimo: {
                $max: [
                  {
                    $subtract: [
                      "$stockMinimo",
                      "$cantidad",
                    ],
                  },
                  0,
                ],
              },
            },
          },
          {
            $sort: {
              agotado:
                -1,
              cantidad:
                1,
            },
          }
        );

        const resultado =
          await Inventario.aggregate(
            pipeline
          );

        return res.json({
          filtros,
          totalStockBajo:
            resultado.length,
          totalAgotados:
            resultado.filter(
              (
                item
              ) =>
                item.agotado
            ).length,
          data:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando reporte de stock bajo"
        );
      }
    };

  /* =====================================================
      10. VALOR DE INVENTARIO
  ===================================================== */

  static getValorInventario =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match:
          Record<string, unknown> = {
            estado:
              true,
          };

        const idAlmacen =
          ReporteService.objectId(
            filtros.idAlmacen
          );

        if (idAlmacen) {
          match.idAlmacen =
            idAlmacen;
        }

        const pipeline:
          any[] = [
            {
              $match:
                match,
            },
            ...ReporteService
              .lookupAlmacen(),
          ];

        const idSucursal =
          ReporteService.objectId(
            filtros.idSucursal
          );

        if (idSucursal) {
          pipeline.push({
            $match: {
              "almacen.idSucursal":
                idSucursal,
            },
          });
        }

        pipeline.push(
          {
            $group: {
              _id:
                "$idAlmacen",
              idSucursal: {
                $first:
                  "$almacen.idSucursal",
              },
              nombreAlmacen: {
                $first:
                  "$almacen.nombre",
              },
              tipoAlmacen: {
                $first:
                  "$almacen.tipo",
              },
              cantidadProductos: {
                $sum:
                  1,
              },
              unidadesTotales: {
                $sum:
                  "$cantidad",
              },
              valorCosto: {
                $sum: {
                  $multiply: [
                    "$cantidad",
                    "$costoUnitario",
                  ],
                },
              },
              valorVenta: {
                $sum: {
                  $multiply: [
                    "$cantidad",
                    "$precioVenta",
                  ],
                },
              },
            },
          },
          {
            $addFields: {
              gananciaPotencial: {
                $subtract: [
                  "$valorVenta",
                  "$valorCosto",
                ],
              },
            },
          },
          {
            $project: {
              _id:
                0,
              idAlmacen:
                "$_id",
              idSucursal:
                1,
              nombreAlmacen:
                1,
              tipoAlmacen:
                1,
              cantidadProductos:
                1,
              unidadesTotales:
                1,
              valorCosto: {
                $round: [
                  "$valorCosto",
                  2,
                ],
              },
              valorVenta: {
                $round: [
                  "$valorVenta",
                  2,
                ],
              },
              gananciaPotencial: {
                $round: [
                  "$gananciaPotencial",
                  2,
                ],
              },
            },
          },
          {
            $sort: {
              valorCosto:
                -1,
            },
          }
        );

        const resultado =
          await Inventario.aggregate(
            pipeline
          );

        const totales =
          resultado.reduce(
            (
              acc,
              item
            ) => ({
              cantidadProductos:
                acc.cantidadProductos +
                Number(
                  item.cantidadProductos ||
                    0
                ),
              unidadesTotales:
                acc.unidadesTotales +
                Number(
                  item.unidadesTotales ||
                    0
                ),
              valorCosto:
                acc.valorCosto +
                Number(
                  item.valorCosto ||
                    0
                ),
              valorVenta:
                acc.valorVenta +
                Number(
                  item.valorVenta ||
                    0
                ),
              gananciaPotencial:
                acc.gananciaPotencial +
                Number(
                  item.gananciaPotencial ||
                    0
                ),
            }),
            {
              cantidadProductos:
                0,
              unidadesTotales:
                0,
              valorCosto:
                0,
              valorVenta:
                0,
              gananciaPotencial:
                0,
            }
          );

        return res.json({
          filtros,
          totales: {
            ...totales,
            valorCosto:
              ReporteService.redondear(
                totales.valorCosto
              ),
            valorVenta:
              ReporteService.redondear(
                totales.valorVenta
              ),
            gananciaPotencial:
              ReporteService.redondear(
                totales.gananciaPotencial
              ),
          },
          almacenes:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando valor de inventario"
        );
      }
    };

  /* =====================================================
      11. ESTADO DE RESULTADOS
  ===================================================== */

  static getEstadoResultados =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const matchVenta =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        matchVenta.estado =
          "pagado";

        const matchEgreso =
          ReporteService
            .construirMatch(
              filtros,
              "fechaEgreso"
            );

        matchEgreso.estado =
          "registrado";

        const [
          ingresos,
          costoVentas,
          egresos,
        ] = await Promise.all([

          Venta.aggregate([
            {
              $match:
                matchVenta,
            },
            {
              $group: {
                _id:
                  null,
                ventasBrutas: {
                  $sum:
                    "$subtotal",
                },
                descuentos: {
                  $sum:
                    "$descuento",
                },
                ventasNetas: {
                  $sum:
                    "$total",
                },
                cantidadVentas: {
                  $sum:
                    1,
                },
              },
            },
          ]),

          DetalleVenta.aggregate([
            {
              $match: {
                estado:
                  "activo",
              },
            },
            {
              $lookup: {
                from:
                  "ventas",
                localField:
                  "idVenta",
                foreignField:
                  "_id",
                as:
                  "venta",
              },
            },
            {
              $unwind:
                "$venta",
            },
            {
              $match: {
                ...(matchVenta.fechaVenta
                  ? {
                      "venta.fechaVenta":
                        matchVenta.fechaVenta,
                    }
                  : {}),
                ...(matchVenta.idSucursal
                  ? {
                      "venta.idSucursal":
                        matchVenta.idSucursal,
                    }
                  : {}),
                ...(matchVenta.idCaja
                  ? {
                      "venta.idCaja":
                        matchVenta.idCaja,
                    }
                  : {}),
                ...(matchVenta.idPerfil
                  ? {
                      "venta.idPerfil":
                        matchVenta.idPerfil,
                    }
                  : {}),
                "venta.estado":
                  "pagado",
              },
            },
            {
              $group: {
                _id:
                  null,
                costoVentas: {
                  $sum: {
                    $multiply: [
                      "$cantidad",
                      "$costoUnitario",
                    ],
                  },
                },
              },
            },
          ]),

          Egreso.aggregate([
            {
              $match:
                matchEgreso,
            },
            {
              $group: {
                _id:
                  null,
                totalEgresos: {
                  $sum:
                    "$total",
                },
                cantidadEgresos: {
                  $sum:
                    1,
                },
              },
            },
          ]),
        ]);

        const venta =
          ingresos[0] || {
            ventasBrutas:
              0,
            descuentos:
              0,
            ventasNetas:
              0,
            cantidadVentas:
              0,
          };

        const costo =
          Number(
            costoVentas[0]
              ?.costoVentas ||
              0
          );

        const gasto =
          Number(
            egresos[0]
              ?.totalEgresos ||
              0
          );

        const utilidadBruta =
          Number(
            venta.ventasNetas ||
              0
          ) -
          costo;

        const utilidadNeta =
          utilidadBruta -
          gasto;

        return res.json({
          filtros,
          estadoResultados: {
            ventasBrutas:
              ReporteService.redondear(
                venta.ventasBrutas ||
                  0
              ),

            descuentos:
              ReporteService.redondear(
                venta.descuentos ||
                  0
              ),

            ventasNetas:
              ReporteService.redondear(
                venta.ventasNetas ||
                  0
              ),

            costoVentas:
              ReporteService.redondear(
                costo
              ),

            utilidadBruta:
              ReporteService.redondear(
                utilidadBruta
              ),

            egresosOperativos:
              ReporteService.redondear(
                gasto
              ),

            utilidadNeta:
              ReporteService.redondear(
                utilidadNeta
              ),

            margenNetoPorcentaje:
              venta.ventasNetas > 0
                ? ReporteService
                    .redondear(
                      (
                        utilidadNeta /
                        venta.ventasNetas
                      ) *
                        100
                    )
                : 0,

            cantidadVentas:
              venta.cantidadVentas ||
              0,

            cantidadEgresos:
              egresos[0]
                ?.cantidadEgresos ||
              0,
          },
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando estado de resultados"
        );
      }
    };

  /* =====================================================
      12. FLUJO DE EFECTIVO
  ===================================================== */

  static getFlujoEfectivo =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const matchVenta =
          ReporteService
            .construirMatch(
              filtros,
              "fechaVenta"
            );

        matchVenta.estado =
          "pagado";

        const matchEgreso =
          ReporteService
            .construirMatch(
              filtros,
              "fechaEgreso"
            );

        matchEgreso.estado =
          "registrado";

        const [
          entradas,
          salidas,
        ] = await Promise.all([

          Venta.aggregate([
            {
              $match:
                matchVenta,
            },
            {
              $group: {
                _id:
                  "$metodoPago",
                cantidad: {
                  $sum:
                    1,
                },
                monto: {
                  $sum:
                    "$total",
                },
              },
            },
            {
              $project: {
                _id:
                  0,
                metodoPago:
                  "$_id",
                cantidad:
                  1,
                monto:
                  1,
              },
            },
          ]),

          Egreso.aggregate([
            {
              $match:
                matchEgreso,
            },
            {
              $group: {
                _id:
                  "$metodoPago",
                cantidad: {
                  $sum:
                    1,
                },
                monto: {
                  $sum:
                    "$total",
                },
              },
            },
            {
              $project: {
                _id:
                  0,
                metodoPago:
                  "$_id",
                cantidad:
                  1,
                monto:
                  1,
              },
            },
          ]),
        ]);

        const totalEntradas =
          entradas.reduce(
            (
              acc,
              item
            ) =>
              acc +
              Number(
                item.monto ||
                  0
              ),
            0
          );

        const totalSalidas =
          salidas.reduce(
            (
              acc,
              item
            ) =>
              acc +
              Number(
                item.monto ||
                  0
              ),
            0
          );

        return res.json({
          filtros,
          entradas,
          salidas,
          resumen: {
            totalEntradas:
              ReporteService.redondear(
                totalEntradas
              ),

            totalSalidas:
              ReporteService.redondear(
                totalSalidas
              ),

            flujoNeto:
              ReporteService.redondear(
                totalEntradas -
                  totalSalidas
              ),
          },
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando flujo de efectivo"
        );
      }
    };

  /* =====================================================
      13. CIERRES Y DIFERENCIAS DE CAJA
  ===================================================== */

  static getCierresCaja =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              filtros,
              "fechaCierre"
            );

        const cierres =
          await CierreCaja.find(
            match
          )
            .populate(
              "idCaja",
              "_id nombre descripcion"
            )
            .populate(
              "idSucursal",
              "_id nombreSucursal ubicacionSucursal"
            )
            .populate(
              "idPerfil",
              "_id nombres apellidos email"
            )
            .sort({
              fechaCierre:
                -1,
            })
            .lean();

        const resumen =
          cierres.reduce(
            (
              acc,
              cierre
            ) => {

              acc.totalVentas +=
                Number(
                  cierre.totalVentas ||
                    0
                );

              acc.totalEgresos +=
                Number(
                  cierre.totalEgresos ||
                    0
                );

              acc.diferencia +=
                Number(
                  cierre.diferencia ||
                    0
                );

              if (
                cierre.estado ===
                "cuadrado"
              ) {
                acc.cuadrados += 1;
              }

              if (
                cierre.estado ===
                "sobrante"
              ) {
                acc.sobrantes += 1;
              }

              if (
                cierre.estado ===
                "faltante"
              ) {
                acc.faltantes += 1;
              }

              return acc;
            },
            {
              cantidadCierres:
                cierres.length,
              totalVentas:
                0,
              totalEgresos:
                0,
              diferencia:
                0,
              cuadrados:
                0,
              sobrantes:
                0,
              faltantes:
                0,
            }
          );

        return res.json({
          filtros,
          resumen: {
            ...resumen,
            totalVentas:
              ReporteService.redondear(
                resumen.totalVentas
              ),
            totalEgresos:
              ReporteService.redondear(
                resumen.totalEgresos
              ),
            diferencia:
              ReporteService.redondear(
                resumen.diferencia
              ),
          },
          cierres,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando reporte de cierres"
        );
      }
    };

  /* =====================================================
      14. RESUMEN DE SOLICITUDES
  ===================================================== */

  static getSolicitudesResumen =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              filtros,
              "fechaSolicitud"
            );

        const resultado =
          await Solicitud.aggregate([
            {
              $match:
                match,
            },
            {
              $group: {
                _id:
                  "$estado",
                cantidad: {
                  $sum:
                    1,
                },
                tiempoPromedioHoras: {
                  $avg: {
                    $cond: [
                      {
                        $and: [
                          {
                            $ne: [
                              "$fechaActualizacion",
                              null,
                            ],
                          },
                          {
                            $ne: [
                              "$fechaSolicitud",
                              null,
                            ],
                          },
                        ],
                      },
                      {
                        $divide: [
                          {
                            $subtract: [
                              "$fechaActualizacion",
                              "$fechaSolicitud",
                            ],
                          },
                          1000 *
                            60 *
                            60,
                        ],
                      },
                      null,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id:
                  0,
                estado:
                  "$_id",
                cantidad:
                  1,
                tiempoPromedioHoras: {
                  $round: [
                    {
                      $ifNull: [
                        "$tiempoPromedioHoras",
                        0,
                      ],
                    },
                    2,
                  ],
                },
              },
            },
            {
              $sort: {
                cantidad:
                  -1,
              },
            },
          ]);

        const total =
          resultado.reduce(
            (
              acc,
              item
            ) =>
              acc +
              Number(
                item.cantidad ||
                  0
              ),
            0
          );

        return res.json({
          filtros,
          totalSolicitudes:
            total,
          porEstado:
            resultado,
        });

      } catch (error) {

        return responderError(
          res,
          error,
          "Error generando resumen de solicitudes"
        );
      }
    };

  /* =====================================================
      15. KARDEX POR PRODUCTO
  ===================================================== */

  static getKardexProducto =
    async (
      req: Request,
      res: Response
    ) => {
      try {
        const idProducto =
          obtenerString(
            req.params.idProducto
          );

        if (!idProducto) {
          return res.status(400).json({
            error:
              "El ID del producto es obligatorio",
          });
        }

        const productoId =
          ReporteService.objectId(
            idProducto
          );

        if (!productoId) {
          return res.status(400).json({
            error:
              "El ID del producto no es válido",
          });
        }

        const filtros =
          obtenerFiltros(req);

        const match =
          ReporteService
            .construirMatch(
              {
                ...filtros,
                idProducto,
              },
              "fecha"
            );

        const resultado =
          await Movimiento.find({
            ...match,

            tipoMovimiento: {
              $in: [
                "entrada_inventario",
                "salida_inventario",
                "transferencia_inventario",
                "ajuste_inventario",
                "conteo_fisico",
                "diferencia_inventario",
                "solicitud",
              ],
            },
          })
            .populate({
              path: "idProducto",
              select:
                "_id nombre marca descripcion",
            })
            .populate({
              path: "idAlmacen",
              select:
                "_id nombre tipo idSucursal",
            })
            .populate({
              path:
                "idAlmacenOrigen",
              select:
                "_id nombre tipo idSucursal",
            })
            .populate({
              path:
                "idAlmacenDestino",
              select:
                "_id nombre tipo idSucursal",
            })
            .populate({
              path: "idPerfil",
              select:
                "_id nombres apellidos email",
            })
            .sort({
              fecha: 1,
              createdAt: 1,
              _id: 1,
            })
            .lean();

        const movimientos =
          resultado as unknown as
            MovimientoKardexLean[];

        const idsAlmacenesSucursal =
          new Set<string>();

        /*
         * Para el Kardex por producto, se toman los IDs
         * de almacenes presentes en los movimientos.
         */
        movimientos.forEach(
          (movimiento) => {
            const ids = [
              obtenerIdReferencia(
                movimiento.idAlmacen
              ),
              obtenerIdReferencia(
                movimiento.idAlmacenOrigen
              ),
              obtenerIdReferencia(
                movimiento.idAlmacenDestino
              ),
            ];

            ids
              .filter(Boolean)
              .forEach(
                (id) =>
                  idsAlmacenesSucursal.add(
                    id
                  )
              );
          }
        );

        const movimientosNormalizados =
          normalizarMovimientosKardex(
            movimientos,
            idsAlmacenesSucursal,
            filtros.idAlmacen
          );

        const resumen =
          movimientosNormalizados.reduce(
            (
              acumulado,
              movimiento
            ) => {
              acumulado.entradas +=
                movimiento.cantidadEntrada;

              acumulado.salidas +=
                movimiento.cantidadSalida;

              acumulado.valorEntradas +=
                movimiento.cantidadEntrada *
                movimiento.costoUnitario;

              acumulado.valorSalidas +=
                movimiento.cantidadSalida *
                movimiento.costoUnitario;

              acumulado.valorMovimientos +=
                movimiento.costoTotal;

              return acumulado;
            },
            {
              entradas: 0,
              salidas: 0,
              valorEntradas: 0,
              valorSalidas: 0,
              valorMovimientos: 0,
            }
          );

        return res.status(200).json({
          filtros,

          idProducto,

          resumen: {
            entradas:
              resumen.entradas,

            salidas:
              resumen.salidas,

            saldoMovimientos:
              resumen.entradas -
              resumen.salidas,

            totalMovimientos:
              movimientosNormalizados.length,

            valorEntradas:
              ReporteService.redondear(
                resumen.valorEntradas
              ),

            valorSalidas:
              ReporteService.redondear(
                resumen.valorSalidas
              ),

            valorMovimientos:
              ReporteService.redondear(
                resumen.valorMovimientos
              ),
          },

          movimientos:
            movimientosNormalizados,
        });
      } catch (error) {
        return responderError(
          res,
          error,
          "Error generando Kardex por producto"
        );
      }
    };

  /* =====================================================
      16. KARDEX GENERAL POR SUCURSAL
  ===================================================== */

  static getKardexInventario =
    async (
      req: Request,
      res: Response
    ) => {
      try {
        const idSucursal =
          obtenerString(
            req.query.idSucursal
          )?.trim();

        const idProducto =
          obtenerString(
            req.query.idProducto
          )?.trim();

        const idAlmacen =
          obtenerString(
            req.query.idAlmacen
          )?.trim();

        const tipoMovimiento =
          obtenerString(
            req.query.tipoMovimiento
          )?.trim();

        const fechaDesde =
          obtenerString(
            req.query.fechaDesde
          )?.trim();

        const fechaHasta =
          obtenerString(
            req.query.fechaHasta
          )?.trim();

        if (!idSucursal) {
          return res.status(400).json({
            error:
              "El parámetro idSucursal es obligatorio",
          });
        }

        if (
          !mongoose.Types.ObjectId.isValid(
            idSucursal
          )
        ) {
          return res.status(400).json({
            error:
              "El identificador de la sucursal no es válido",
          });
        }

        if (
          idProducto &&
          !mongoose.Types.ObjectId.isValid(
            idProducto
          )
        ) {
          return res.status(400).json({
            error:
              "El identificador del producto no es válido",
          });
        }

        if (
          idAlmacen &&
          !mongoose.Types.ObjectId.isValid(
            idAlmacen
          )
        ) {
          return res.status(400).json({
            error:
              "El identificador del almacén no es válido",
          });
        }

        const sucursalObjectId =
          new mongoose.Types.ObjectId(
            idSucursal
          );

        const almacenesSucursal =
          await Almacen.find({
            idSucursal:
              sucursalObjectId,

            estado: true,
          })
            .select({
              _id: 1,
              nombre: 1,
              tipo: 1,
            })
            .lean();

        const idsAlmacenes =
          almacenesSucursal.map(
            (almacen) =>
              almacen._id
          );

        const idsAlmacenesTexto =
          new Set(
            idsAlmacenes.map(
              (almacen) =>
                String(almacen)
            )
          );

        const filtrosRespuesta = {
          idSucursal,
          idProducto,
          idAlmacen,
          tipoMovimiento,
          fechaDesde,
          fechaHasta,
        };

        if (
          idsAlmacenes.length === 0
        ) {
          return res.status(200).json({
            filtros:
              filtrosRespuesta,

            idProducto,

            resumen: {
              entradas: 0,
              salidas: 0,
              saldoMovimientos: 0,
              totalMovimientos: 0,
              valorEntradas: 0,
              valorSalidas: 0,
              valorMovimientos: 0,
            },

            movimientos: [],
          });
        }

        let almacenesFiltro =
          idsAlmacenes;

        if (idAlmacen) {
          const pertenece =
            idsAlmacenesTexto.has(
              idAlmacen
            );

          if (!pertenece) {
            return res.status(400).json({
              error:
                "El almacén no pertenece a la sucursal seleccionada",
            });
          }

          almacenesFiltro = [
            new mongoose.Types.ObjectId(
              idAlmacen
            ),
          ];
        }

        const filtro:
          Record<string, unknown> = {
            $or: [
              {
                idAlmacen: {
                  $in:
                    almacenesFiltro,
                },
              },
              {
                idAlmacenOrigen: {
                  $in:
                    almacenesFiltro,
                },
              },
              {
                idAlmacenDestino: {
                  $in:
                    almacenesFiltro,
                },
              },
            ],
          };

        if (idProducto) {
          filtro.idProducto =
            new mongoose.Types.ObjectId(
              idProducto
            );
        }

        if (tipoMovimiento) {
          const tipoSeguro =
            tipoMovimiento.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );

          filtro.tipoMovimiento = {
            $regex:
              tipoSeguro,
            $options:
              "i",
          };
        }

        if (
          fechaDesde ||
          fechaHasta
        ) {
          const rangoFecha: {
            $gte?: Date;
            $lte?: Date;
          } = {};

          if (fechaDesde) {
            const inicio =
              new Date(
                `${fechaDesde}T00:00:00.000Z`
              );

            if (
              Number.isNaN(
                inicio.getTime()
              )
            ) {
              return res.status(400).json({
                error:
                  "La fecha inicial no es válida",
              });
            }

            rangoFecha.$gte =
              inicio;
          }

          if (fechaHasta) {
            const fin =
              new Date(
                `${fechaHasta}T23:59:59.999Z`
              );

            if (
              Number.isNaN(
                fin.getTime()
              )
            ) {
              return res.status(400).json({
                error:
                  "La fecha final no es válida",
              });
            }

            rangoFecha.$lte =
              fin;
          }

          if (
            rangoFecha.$gte &&
            rangoFecha.$lte &&
            rangoFecha.$gte >
              rangoFecha.$lte
          ) {
            return res.status(400).json({
              error:
                "La fecha inicial no puede ser mayor que la fecha final",
            });
          }

          filtro.fecha =
            rangoFecha;
        }

        const resultado =
          await Movimiento.find(
            filtro
          )
            .populate({
              path: "idProducto",
              select:
                "_id nombre marca descripcion",
            })
            .populate({
              path: "idAlmacen",
              select:
                "_id nombre tipo idSucursal",
            })
            .populate({
              path:
                "idAlmacenOrigen",
              select:
                "_id nombre tipo idSucursal",
            })
            .populate({
              path:
                "idAlmacenDestino",
              select:
                "_id nombre tipo idSucursal",
            })
            .populate({
              path: "idPerfil",
              select:
                "_id nombres apellidos email",
            })
            .sort({
              fecha: 1,
              createdAt: 1,
              _id: 1,
            })
            .lean();

        const movimientos =
          resultado as unknown as
            MovimientoKardexLean[];

        const movimientosNormalizados =
          normalizarMovimientosKardex(
            movimientos,
            idsAlmacenesTexto,
            idAlmacen
          );

        const resumen =
          movimientosNormalizados.reduce(
            (
              acumulado,
              movimiento
            ) => {
              acumulado.entradas +=
                movimiento.cantidadEntrada;

              acumulado.salidas +=
                movimiento.cantidadSalida;

              acumulado.valorEntradas +=
                movimiento.cantidadEntrada *
                movimiento.costoUnitario;

              acumulado.valorSalidas +=
                movimiento.cantidadSalida *
                movimiento.costoUnitario;

              acumulado.valorMovimientos +=
                movimiento.costoTotal;

              return acumulado;
            },
            {
              entradas: 0,
              salidas: 0,
              valorEntradas: 0,
              valorSalidas: 0,
              valorMovimientos: 0,
            }
          );

        return res.status(200).json({
          filtros:
            filtrosRespuesta,

          idProducto,

          resumen: {
            entradas:
              resumen.entradas,

            salidas:
              resumen.salidas,

            saldoMovimientos:
              resumen.entradas -
              resumen.salidas,

            totalMovimientos:
              movimientosNormalizados.length,

            valorEntradas:
              ReporteService.redondear(
                resumen.valorEntradas
              ),

            valorSalidas:
              ReporteService.redondear(
                resumen.valorSalidas
              ),

            valorMovimientos:
              ReporteService.redondear(
                resumen.valorMovimientos
              ),
          },

          movimientos:
            movimientosNormalizados,
        });
      } catch (error) {
        return responderError(
          res,
          error,
          "Error generando el Kardex general de inventario"
        );
      }
    };

}
