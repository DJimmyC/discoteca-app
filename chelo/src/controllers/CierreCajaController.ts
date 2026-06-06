// src/controllers/CierreCajaController.ts

import type {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import CierreCaja from "../models/CierreCaja";
import AperturaCaja from "../models/AperturaCaja";
import Caja from "../models/Caja";
import Venta from "../models/Venta";
import DetalleVenta from "../models/DetalleVenta";
import Egreso from "../models/Egreso";
import Movimiento from "../models/Movimiento";

/* =========================
    UTILIDADES
========================= */

function redondear(
  valor: number,
  decimales = 2
): number {

  const factor =
    Math.pow(
      10,
      decimales
    );

  return (
    Math.round(
      (
        Number(valor) +
        Number.EPSILON
      ) *
        factor
    ) / factor
  );
}

/*
  Acepta:
  - fechaCierre ISO completa
  - fecha + horaCierre
  - solo horaCierre

  Regla nocturna:
  Si la hora de cierre es menor que la hora de apertura,
  se interpreta como el día siguiente.

  Ejemplo:
  apertura 23/06 19:00
  cierre 04:00
  => cierre 24/06 04:00
*/
function construirFechaCierre({
  fechaApertura,
  fechaCierre,
  fecha,
  horaCierre,
}: {
  fechaApertura: Date;
  fechaCierre?: unknown;
  fecha?: unknown;
  horaCierre?: unknown;
}): Date {

  if (
    typeof fechaCierre ===
    "string"
  ) {

    const directa =
      new Date(
        fechaCierre
      );

    if (
      !Number.isNaN(
        directa.getTime()
      )
    ) {
      return directa;
    }
  }

  const formatterFecha =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/La_Paz",
        year:
          "numeric",
        month:
          "2-digit",
        day:
          "2-digit",
      }
    );

  const formatterHora =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "America/La_Paz",
        hour:
          "2-digit",
        minute:
          "2-digit",
        hour12:
          false,
      }
    );

  const fechaAperturaLocal =
    formatterFecha.format(
      fechaApertura
    );

  const horaAperturaLocal =
    formatterHora.format(
      fechaApertura
    );

  const fechaBase =
    typeof fecha ===
    "string"
      ? fecha.slice(0, 10)
      : fechaAperturaLocal;

  const hora =
    typeof horaCierre ===
    "string"
      ? horaCierre
      : formatterHora.format(
          new Date()
        );

  let cierre =
    new Date(
      `${fechaBase}T${hora}:00-04:00`
    );

  if (
    Number.isNaN(
      cierre.getTime()
    )
  ) {
    throw new Error(
      "La fecha u hora de cierre no es válida"
    );
  }

  /*
    Si el usuario mandó la misma fecha de apertura
    y una hora menor, el cierre pertenece al día siguiente.
  */
  if (
    fechaBase ===
      fechaAperturaLocal &&
    hora <
      horaAperturaLocal
  ) {

    cierre =
      new Date(
        cierre.getTime() +
          24 *
            60 *
            60 *
            1000
      );
  }

  return cierre;
}

function obtenerMontoEgreso(
  egreso: Record<string, unknown>
): number {

  const valor =
    egreso.monto ??
    egreso.total ??
    egreso.importe ??
    egreso.montoEgreso ??
    0;

  const numero =
    Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}

function obtenerFechaEgreso(
  egreso: Record<string, unknown>
): Date | null {

  const valor =
    egreso.fechaEgreso ??
    egreso.fecha ??
    egreso.fechaCreacion;

  if (!valor) {
    return null;
  }

  const fecha =
    new Date(
      String(valor)
    );

  return Number.isNaN(
    fecha.getTime()
  )
    ? null
    : fecha;
}

function obtenerMetodoPagoEgreso(
  egreso: Record<string, unknown>
): string {

  const metodo =
    egreso.metodoPago ??
    egreso.formaPago ??
    "efectivo";

  return String(metodo);
}

export class CierreCajaController {

  static createCierre = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idCaja,
        idPerfil,
        montoReal,
        observacion,
        creadoPor,
        horaCierre,
        fechaCierre,
        fecha,
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

      const apertura =
        await AperturaCaja.findOne({
          idCaja,
          estado:
            "abierta",
        });

      if (!apertura) {
        return res.status(404).json({
          error:
            "La caja no tiene una apertura activa",
        });
      }

      const cierreExistente =
        await CierreCaja.findOne({
          idAperturaCaja:
            apertura._id,
        });

      if (cierreExistente) {
        return res.status(409).json({
          error:
            "La apertura ya tiene un cierre registrado",
        });
      }

      const fechaFinalCierre =
        construirFechaCierre({
          fechaApertura:
            apertura.fechaApertura,
          fechaCierre,
          fecha,
          horaCierre,
        });

      if (
        fechaFinalCierre <=
        apertura.fechaApertura
      ) {
        return res.status(400).json({
          error:
            "La fecha de cierre debe ser posterior a la apertura",
        });
      }

      const montoContado =
        Number(
          montoReal
        );

      if (
        !Number.isFinite(
          montoContado
        ) ||
        montoContado < 0
      ) {
        return res.status(400).json({
          error:
            "El monto real no es válido",
        });
      }

      /*
        Consulta por rango real de jornada.
        Esto permite abrir el 23 a las 19:00
        y cerrar el 24 a las 04:00.
      */
      const ventas =
        await Venta.find({
          idCaja,
          idSucursal:
            apertura.idSucursal,
          fechaVenta: {
            $gte:
              apertura.fechaApertura,
            $lte:
              fechaFinalCierre,
          },
        })
          .lean();

      const ventasValidas =
        ventas.filter(
          (
            venta: any
          ) =>
            venta.estado ===
              "pagado" ||
            venta.estado ===
              "cortesia"
        );

      const idsVentas =
        ventasValidas.map(
          (
            venta: any
          ) =>
            venta._id
        );

      const detallesVenta =
        idsVentas.length > 0
          ? await DetalleVenta.find({
              idVenta: {
                $in:
                  idsVentas,
              },
            })
              .populate({
                path:
                  "idProducto",
                select:
                  "_id nombre marca descripcion",
              })
              .lean()
          : [];

      /*
        Se consultan egresos por sucursal y luego
        se filtran por fecha para tolerar nombres
        de campo diferentes en tu modelo actual.
      */
      const egresosTodos =
        await Egreso.find({
          idSucursal:
            apertura.idSucursal,
        })
          .lean();

      const egresos =
        egresosTodos.filter(
          (
            egreso: any
          ) => {

            const fechaEgreso =
              obtenerFechaEgreso(
                egreso
              );

            if (!fechaEgreso) {
              return false;
            }

            const perteneceCaja =
              !egreso.idCaja ||
              String(
                egreso.idCaja
              ) ===
                String(idCaja);

            const estadoValido =
              egreso.estado !==
                "anulado" &&
              egreso.estado !==
                "eliminado" &&
              !egreso.fechaEliminado;

            return (
              perteneceCaja &&
              estadoValido &&
              fechaEgreso >=
                apertura.fechaApertura &&
              fechaEgreso <=
                fechaFinalCierre
            );
          }
        );

      let totalVentas = 0;
      let totalVentasEfectivo = 0;
      let totalVentasQr = 0;
      let totalVentasTransferencia = 0;
      let totalVentasMixto = 0;
      let totalCortesias = 0;
      let totalVentasAnuladas = 0;

      for (
        const venta
        of ventas as any[]
      ) {

        const total =
          Number(
            venta.total || 0
          );

        if (
          venta.estado ===
          "anulado"
        ) {
          totalVentasAnuladas +=
            total;
          continue;
        }

        if (
          venta.estado ===
          "cortesia"
        ) {
          totalCortesias +=
            total;
          continue;
        }

        if (
          venta.estado !==
          "pagado"
        ) {
          continue;
        }

        totalVentas +=
          total;

        switch (
          venta.metodoPago
        ) {
          case "efectivo":
            totalVentasEfectivo +=
              total;
            break;

          case "qr":
            totalVentasQr +=
              total;
            break;

          case "transferencia":
            totalVentasTransferencia +=
              total;
            break;

          case "mixto":
            totalVentasMixto +=
              total;

            /*
              Si tu modelo Venta luego incorpora:
              montoEfectivo, montoQr, montoTransferencia,
              esta lógica ya lo aprovecha.
            */
            totalVentasEfectivo +=
              Number(
                venta.montoEfectivo ||
                  0
              );

            totalVentasQr +=
              Number(
                venta.montoQr ||
                  0
              );

            totalVentasTransferencia +=
              Number(
                venta.montoTransferencia ||
                  0
              );
            break;
        }
      }

      let totalEgresos = 0;
      let totalEgresosEfectivo = 0;

      for (
        const egreso
        of egresos as any[]
      ) {

        const monto =
          obtenerMontoEgreso(
            egreso
          );

        totalEgresos +=
          monto;

        if (
          obtenerMetodoPagoEgreso(
            egreso
          ) ===
          "efectivo"
        ) {
          totalEgresosEfectivo +=
            monto;
        }
      }

      const cantidadProductosVendidos =
        detallesVenta.reduce(
          (
            acumulado,
            detalle: any
          ) =>
            acumulado +
            Number(
              detalle.cantidad ||
                0
            ),
          0
        );

      const productosMap =
        new Map<
          string,
          {
            idProducto:
              string;
            nombre:
              string;
            marca:
              string;
            cantidadVendida:
              number;
            totalVendido:
              number;
          }
        >();

      for (
        const detalle
        of detallesVenta as any[]
      ) {

        const producto =
          detalle.idProducto;

        const idProducto =
          producto?._id
            ? String(
                producto._id
              )
            : String(
                detalle.idProducto
              );

        const actual =
          productosMap.get(
            idProducto
          ) || {
            idProducto,
            nombre:
              producto?.nombre ||
              "Producto",
            marca:
              producto?.marca ||
              "",
            cantidadVendida:
              0,
            totalVendido:
              0,
          };

        actual.cantidadVendida +=
          Number(
            detalle.cantidad || 0
          );

        actual.totalVendido +=
          Number(
            detalle.subtotal || 0
          );

        productosMap.set(
          idProducto,
          actual
        );
      }

      const productosVendidos =
        Array.from(
          productosMap.values()
        )
          .map(
            (
              producto
            ) => ({
              ...producto,
              precioPromedio:
                producto
                  .cantidadVendida >
                0
                  ? redondear(
                      producto
                        .totalVendido /
                        producto
                          .cantidadVendida
                    )
                  : 0,
              totalVendido:
                redondear(
                  producto
                    .totalVendido
                ),
            })
          )
          .sort(
            (
              a,
              b
            ) =>
              b.cantidadVendida -
              a.cantidadVendida
          );

      const totalEsperadoEfectivo =
        redondear(
          Number(
            apertura.montoInicial ||
              0
          ) +
            totalVentasEfectivo -
            totalEgresosEfectivo
        );

      const diferencia =
        redondear(
          montoContado -
            totalEsperadoEfectivo
        );

      const tolerancia =
        0.009;

      const estado =
        Math.abs(
          diferencia
        ) <= tolerancia
          ? "cuadrado"
          : diferencia > 0
            ? "sobrante"
            : "faltante";

      const usuario =
        creadoPor ||
        "sistema";

      const cierre =
        await CierreCaja.create({
          idAperturaCaja:
            apertura._id,
          idPerfil,
          idSucursal:
            apertura.idSucursal,
          idCaja,
          fechaApertura:
            apertura.fechaApertura,
          fechaCierre:
            fechaFinalCierre,
          montoInicial:
            redondear(
              apertura.montoInicial
            ),
          totalVentas:
            redondear(
              totalVentas
            ),
          totalVentasEfectivo:
            redondear(
              totalVentasEfectivo
            ),
          totalVentasQr:
            redondear(
              totalVentasQr
            ),
          totalVentasTransferencia:
            redondear(
              totalVentasTransferencia
            ),
          totalVentasMixto:
            redondear(
              totalVentasMixto
            ),
          totalCortesias:
            redondear(
              totalCortesias
            ),
          totalVentasAnuladas:
            redondear(
              totalVentasAnuladas
            ),
          totalEgresos:
            redondear(
              totalEgresos
            ),
          totalEgresosEfectivo:
            redondear(
              totalEgresosEfectivo
            ),
          totalEsperadoEfectivo,
          montoReal:
            redondear(
              montoContado
            ),
          diferencia,
          cantidadVentas:
            ventasValidas.filter(
              (
                venta: any
              ) =>
                venta.estado ===
                "pagado"
            ).length,
          cantidadProductosVendidos,
          cantidadEgresos:
            egresos.length,
          estado,
          observacion:
            observacion || "",
          creadoPor:
            usuario,
        });

      apertura.estado =
        "cerrada";

      apertura.actualizadoPor =
        usuario;

      apertura.fechaActualizacion =
        new Date();

      await apertura.save();

      await Movimiento.create({
        fecha:
          fechaFinalCierre,
        tipoMovimiento:
          "cierre_caja",
        origenMovimiento:
          "cierre_caja",
        modulo:
          "cierre",
        idSucursal:
          apertura.idSucursal,
        idCaja,
        idPerfil,
        idAperturaCaja:
          apertura._id,
        idCierreCaja:
          cierre._id,
        referenciaId:
          cierre._id,
        referenciaModelo:
          "CierreCaja",
        montoInicial:
          apertura.montoInicial,
        montoEntrada:
          totalVentasEfectivo,
        montoSalida:
          totalEgresosEfectivo,
        montoEsperado:
          totalEsperadoEfectivo,
        montoReal:
          montoContado,
        montoFisico:
          montoContado,
        diferenciaMonto:
          diferencia,
        total:
          totalVentas,
        estado,
        observacion:
          observacion ||
          "Cierre de caja",
        creadoPor:
          usuario,
      });

      return res.status(201).json({
        message:
          "Caja cerrada correctamente",
        cierre,
        jornada: {
          fechaApertura:
            apertura.fechaApertura,
          fechaCierre:
            fechaFinalCierre,
          duracionMinutos:
            Math.round(
              (
                fechaFinalCierre.getTime() -
                apertura.fechaApertura.getTime()
              ) /
                60000
            ),
        },
        resumen: {
          cantidadVentas:
            cierre.cantidadVentas,
          cantidadProductosVendidos,
          cantidadEgresos:
            egresos.length,
          totalVentas:
            cierre.totalVentas,
          totalVentasEfectivo:
            cierre.totalVentasEfectivo,
          totalVentasQr:
            cierre.totalVentasQr,
          totalVentasTransferencia:
            cierre.totalVentasTransferencia,
          totalVentasMixto:
            cierre.totalVentasMixto,
          totalCortesias:
            cierre.totalCortesias,
          totalVentasAnuladas:
            cierre.totalVentasAnuladas,
          totalEgresos:
            cierre.totalEgresos,
          totalEgresosEfectivo:
            cierre.totalEgresosEfectivo,
          montoInicial:
            cierre.montoInicial,
          totalEsperadoEfectivo:
            cierre.totalEsperadoEfectivo,
          montoReal:
            cierre.montoReal,
          diferencia:
            cierre.diferencia,
          estado:
            cierre.estado,
        },
        productosVendidos,
        ventas,
        egresos,
      });

    } catch (error: unknown) {

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al crear cierre de caja",
      });
    }
  };

  static getAllCierres = async (
    _req: Request,
    res: Response
  ) => {

    try {

      const cierres =
        await CierreCaja.find({})
          .populate(
            "idAperturaCaja"
          )
          .populate(
            "idPerfil"
          )
          .populate(
            "idSucursal"
          )
          .populate(
            "idCaja"
          )
          .sort({
            fechaCierre: -1,
          });

      return res.json(
        cierres
      );

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al obtener cierres",
      });
    }
  };

  static getCierreById = async (
    req: Request,
    res: Response
  ) => {

    try {

      const cierre =
        await CierreCaja.findById(
          req.params.id
        )
          .populate(
            "idAperturaCaja"
          )
          .populate(
            "idPerfil"
          )
          .populate(
            "idSucursal"
          )
          .populate(
            "idCaja"
          );

      if (!cierre) {
        return res.status(404).json({
          error:
            "Cierre no encontrado",
        });
      }

      return res.json(
        cierre
      );

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al obtener cierre",
      });
    }
  };

  /*
    El cierre financiero no debe recalcularse manualmente.
    Solo permite actualizar observación y auditoría.
  */
  static updateCierre = async (
    req: Request,
    res: Response
  ) => {

    try {

      const cierre =
        await CierreCaja.findById(
          req.params.id
        );

      if (!cierre) {
        return res.status(404).json({
          error:
            "Cierre no encontrado",
        });
      }

      if (
        req.body.observacion !==
        undefined
      ) {
        cierre.observacion =
          req.body.observacion;
      }

      cierre.actualizadoPor =
        req.body.actualizadoPor ||
        "sistema";

      cierre.fechaActualizacion =
        new Date();

      await cierre.save();

      return res.json({
        message:
          "Observación del cierre actualizada",
        cierre,
      });

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al actualizar cierre",
      });
    }
  };

  static deleteCierre = async (
    req: Request,
    res: Response
  ) => {

    try {

      const cierre =
        await CierreCaja.findById(
          req.params.id
        );

      if (!cierre) {
        return res.status(404).json({
          error:
            "Cierre no encontrado",
        });
      }

      if (
        !req.body.motivo
      ) {
        return res.status(400).json({
          error:
            "El motivo de anulación es obligatorio",
        });
      }

      cierre.estado =
        "anulado";

      cierre.observacion =
        `${cierre.observacion || ""}\nANULADO: ${req.body.motivo}`.trim();

      cierre.eliminadoPor =
        req.body.eliminadoPor ||
        "sistema";

      cierre.fechaEliminado =
        new Date();

      await cierre.save();

      return res.json({
        message:
          "Cierre anulado correctamente",
        cierre,
      });

    } catch (error) {

      return res.status(500).json({
        error:
          "Error al anular cierre",
      });
    }
  };

  static getCierresByCajaId =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const cierres =
          await CierreCaja.find({
            idCaja:
              req.params.cajaId,
          })
            .populate(
              "idAperturaCaja"
            )
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
              fechaCierre: -1,
            });

        return res.json(
          cierres
        );

      } catch (error) {

        return res.status(500).json({
          error:
            "Error obteniendo cierres",
        });
      }
    };
}
