// src/controllers/VentaController.ts

import type {
  Request,
  Response,
} from "express";

import Venta from "../models/Venta";
import DetalleVenta from "../models/DetalleVenta";

import {
  ajustarStockInventario,
} from "./InventarioStcokService";

import Comanda from "../models/Comanda";
import DetalleComanda from "../models/DetalleComanda";
import AperturaCaja from "../models/AperturaCaja";
export class VentaController {

  /* =========================
      CREAR VENTA
  ========================= */

  static createVenta = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idComanda,
        idCaja,
        idPerfil,
        idSucursal,
        numeroVenta,
        fechaVenta,
        subtotal,
        descuento,
        metodoPago,
        estado,
        observacion,
        creadoPor,
      } = req.body;

      /* =========================
          VALIDACIONES
      ========================= */

      if (!idCaja) {

        return res.status(400).json({
          error:
            "El ID de la caja es obligatorio",
        });

      }

      if (!idPerfil) {

        return res.status(400).json({
          error:
            "El ID del perfil es obligatorio",
        });

      }

      if (!idSucursal) {

        return res.status(400).json({
          error:
            "El ID de la sucursal es obligatorio",
        });

      }

      const subtotalVenta =
        Number(
          subtotal || 0
        );

      const descuentoVenta =
        Number(
          descuento || 0
        );

      if (
        subtotalVenta < 0
      ) {

        return res.status(400).json({
          error:
            "El subtotal no puede ser negativo",
        });

      }

      if (
        descuentoVenta < 0
      ) {

        return res.status(400).json({
          error:
            "El descuento no puede ser negativo",
        });

      }

      /* =========================
          EVITAR VENTA DUPLICADA
      ========================= */

      if (idComanda) {

        const ventaExistente =
          await Venta.findOne({
            idComanda,
          });

        if (ventaExistente) {

          return res.status(400).json({
            error:
              "Esta comanda ya fue convertida en venta",
          });

        }

      }

      /* =========================
          CREAR VENTA
      ========================= */

      const venta =
        new Venta({

          idComanda:
            idComanda ||
            undefined,

          idCaja,

          idPerfil,

          idSucursal,

          numeroVenta,

          fechaVenta:
            fechaVenta ||
            new Date(),

          subtotal:
            subtotalVenta,

          descuento:
            descuentoVenta,

          /*
            El modelo calcula el total
            automáticamente.
          */
          total:
            Math.max(
              subtotalVenta -
              descuentoVenta,
              0
            ),

          metodoPago,

          estado:
            estado ||
            "pagado",

          observacion:
            observacion ||
            "",

          creadoPor:
            creadoPor ||
            "sistema",

        });

      await venta.save();

      return res.status(201).json({

        message:
          "Venta registrada",

        venta,

      });

    } catch (error: any) {

      console.log(
        "Error al crear venta:",
        error
      );

      if (
        error?.code ===
        11000
      ) {

        return res.status(400).json({
          error:
            "Ya existe una venta para esta comanda o número de venta",
        });

      }

      return res.status(500).json({

        error:
          error instanceof Error
            ? error.message
            : "Error al crear venta",

      });

    }

  };

  /* =========================
      OBTENER TODAS
  ========================= */

  static getAllVentas = async (
    req: Request,
    res: Response
  ) => {

    try {

      const ventas =
        await Venta.find({})
          .populate({
            path:
              "idComanda",

            select:
              "_id numeroComanda estado observacion fechaApertura fechaCierre",
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
              "idSucursal",

            select:
              "_id nombreSucursal ubicacionSucursal",
          })
          .sort({
            fechaVenta:
              -1,
          });

      return res.json(
        ventas
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        error:
          "Error al obtener ventas",
      });

    }

  };

  /* =========================
      OBTENER POR ID
  ========================= */

  static getVentaById = async (
    req: Request,
    res: Response
  ) => {

    const {
      id,
    } = req.params;

    try {

      const venta =
        await Venta.findById(
          id
        )
          .populate(
            "idComanda"
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

      if (!venta) {

        return res.status(404).json({
          error:
            "Venta no encontrada",
        });

      }

      return res.json(
        venta
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        error:
          "Error al obtener venta",
      });

    }

  };

  /* =========================
      ACTUALIZAR VENTA
  ========================= */

  static updateVenta = async (
    req: Request,
    res: Response
  ) => {

    const {
      id,
    } = req.params;

    try {

      const venta =
        await Venta.findById(
          id
        );

      if (!venta) {

        return res.status(404).json({
          error:
            "Venta no encontrada",
        });

      }

      if (
        venta.estado ===
        "anulado"
      ) {

        return res.status(400).json({
          error:
            "No se puede modificar una venta anulada",
        });

      }

      venta.idComanda =
        req.body.idComanda ??
        venta.idComanda;

      venta.idCaja =
        req.body.idCaja ??
        venta.idCaja;

      venta.idPerfil =
        req.body.idPerfil ??
        venta.idPerfil;

      venta.idSucursal =
        req.body.idSucursal ??
        venta.idSucursal;

      venta.numeroVenta =
        req.body.numeroVenta ??
        venta.numeroVenta;

      venta.fechaVenta =
        req.body.fechaVenta
          ? new Date(
            req.body.fechaVenta
          )
          : venta.fechaVenta;

      venta.subtotal =
        req.body.subtotal !==
          undefined
          ? Number(
            req.body.subtotal
          )
          : venta.subtotal;

      venta.descuento =
        req.body.descuento !==
          undefined
          ? Number(
            req.body.descuento
          )
          : venta.descuento;

      venta.metodoPago =
        req.body.metodoPago ??
        venta.metodoPago;

      venta.estado =
        req.body.estado ??
        venta.estado;

      venta.observacion =
        req.body.observacion ??
        venta.observacion;

      venta.actualizadoPor =
        req.body.actualizadoPor ||
        "sistema";

      venta.fechaActualizacion =
        new Date();

      /*
        El middleware del modelo
        recalcula total.
      */
      await venta.save();

      return res.json({

        message:
          "Venta actualizada",

        venta,

      });

    } catch (error: unknown) {

      console.log(error);

      return res.status(500).json({

        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar venta",

      });

    }

  };

  /* =========================
      ANULAR VENTA
      Y DEVOLVER INVENTARIO
  ========================= */

  static deleteVenta = async (
    req: Request,
    res: Response
  ) => {

    const {
      id,
    } = req.params;

    try {

      const venta =
        await Venta.findById(
          id
        );

      if (!venta) {

        return res.status(404).json({
          error:
            "Venta no encontrada",
        });

      }

      if (
        venta.estado ===
        "anulado"
      ) {

        return res.status(400).json({
          error:
            "La venta ya está anulada",
        });

      }

      const detalles =
        await DetalleVenta.find({

          idVenta:
            venta._id,

          estado:
            "activo",

        });

      /* =========================
          DEVOLVER STOCK
      ========================= */

      for (
        const detalle
        of detalles
      ) {

        await ajustarStockInventario({

          idAlmacen:
            detalle.idAlmacen,

          idProducto:
            detalle.idProducto,

          cantidad:
            Number(
              detalle.cantidad
            ),

          tipo:
            "SUMAR",

          usuario:
            req.body.eliminadoPor ||
            "admin",

        });

        detalle.estado =
          "eliminado";

        detalle.eliminadoPor =
          req.body.eliminadoPor ||
          "admin";

        detalle.fechaEliminado =
          new Date();

        await detalle.save();

      }

      /* =========================
          ANULAR VENTA
      ========================= */

      venta.estado =
        "anulado";

      venta.eliminadoPor =
        req.body.eliminadoPor ||
        "admin";

      venta.fechaEliminado =
        new Date();

      await venta.save();

      return res.json({
        message:
          "Venta anulada y stock restaurado",
      });

    } catch (error: unknown) {

      console.log(error);

      return res.status(500).json({

        error:
          error instanceof Error
            ? error.message
            : "Error al anular venta",

      });

    }

  };

  /* =========================
      MARCAR COMO CORTESÍA
  ========================= */

  static cortesiaVenta = async (
    req: Request,
    res: Response
  ) => {

    const {
      id,
    } = req.params;

    try {

      const venta =
        await Venta.findById(
          id
        );

      if (!venta) {

        return res.status(404).json({
          error:
            "Venta no encontrada",
        });

      }

      if (
        venta.estado ===
        "anulado"
      ) {

        return res.status(400).json({
          error:
            "No se puede convertir una venta anulada en cortesía",
        });

      }

      if (
        venta.estado ===
        "cortesia"
      ) {

        return res.status(400).json({
          error:
            "La venta ya está marcada como cortesía",
        });

      }

      /*
        La cortesía mantiene la salida
        de inventario, pero no debe
        considerarse ingreso.
      */

      venta.estado =
        "cortesia";

      venta.actualizadoPor =
        req.body.actualizadoPor ||
        req.body.eliminadoPor ||
        "admin";

      venta.fechaActualizacion =
        new Date();

      venta.observacion =
        req.body.observacion ||
        venta.observacion ||
        "Venta marcada como cortesía";

      await venta.save();

      return res.json({

        message:
          "Venta marcada como cortesía",

        venta,

      });

    } catch (error: unknown) {

      console.log(error);

      return res.status(500).json({

        error:
          error instanceof Error
            ? error.message
            : "Error al marcar la venta como cortesía",

      });

    }

  };

  static getReporteVentasMeseroPorCajas = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { idPerfil } = req.params;

      const {
        idSucursal,
        idAperturaCaja,
      } = req.query;

      if (!idPerfil) {
        return res.status(400).json({
          error: "El ID del mesero es obligatorio",
        });
      }

      if (!idSucursal) {
        return res.status(400).json({
          error: "El ID de la sucursal es obligatorio",
        });
      }

      const convertirNumero = (valor: any): number => {
        const numero = Number(valor || 0);
        return Number.isNaN(numero) ? 0 : numero;
      };

      const obtenerId = (valor: any): string => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;
        return String(valor._id || valor);
      };

      const obtenerNombre = (valor: any): string => {
        if (!valor) return "";
        if (typeof valor === "string") return valor;

        return (
          valor.nombre ||
          valor.nombreCaja ||
          valor.descripcion ||
          valor.nombreSucursal ||
          String(valor._id || "")
        );
      };

      const obtenerNombrePerfil = (perfil: any): string => {
        if (!perfil) return "Sin nombre";
        if (typeof perfil === "string") return perfil;

        return (
          `${perfil.nombres || ""} ${perfil.apellidos || ""}`.trim() ||
          perfil.email ||
          "Sin nombre"
        );
      };

      /*
        Buscamos aperturas.
  
        Si mandas idAperturaCaja:
        - genera reporte solo para esa caja.
  
        Si NO mandas idAperturaCaja:
        - busca las cajas abiertas de esa sucursal.
      */

      let aperturas: any[] = [];

      if (idAperturaCaja) {
        const apertura = await AperturaCaja.findById(
          String(idAperturaCaja)
        )
          .populate({
            path: "idCaja",
            select: "_id nombre descripcion estado",
          })
          .populate({
            path: "idSucursal",
            select: "_id nombreSucursal ubicacionSucursal",
          })
          .populate({
            path: "idPerfil",
            select: "_id nombres apellidos email telefono ci",
          });

        if (!apertura) {
          return res.status(404).json({
            error: "No se encontró la apertura de caja",
          });
        }

        if (
          String(apertura.idSucursal?._id || apertura.idSucursal) !==
          String(idSucursal)
        ) {
          return res.status(400).json({
            error: "La apertura no pertenece a esta sucursal",
          });
        }

        aperturas = [apertura];
      } else {
        /*
          Ajusta estos estados según tu modelo real.
          Si tu AperturaCaja usa estado: "abierta",
          esto funcionará.
  
          Si usa otro valor, cambia este array.
        */
        const estadosAperturaActiva = [
          "abierta",
          "abierto",
          "activo",
          "activa",
          true,
        ];

        aperturas = await AperturaCaja.find({
          idSucursal: String(idSucursal),
          estado: {
            $in: estadosAperturaActiva,
          },
        })
          .populate({
            path: "idCaja",
            select: "_id nombre descripcion estado",
          })
          .populate({
            path: "idSucursal",
            select: "_id nombreSucursal ubicacionSucursal",
          })
          .populate({
            path: "idPerfil",
            select: "_id nombres apellidos email telefono ci",
          })
          .sort({
            fechaApertura: 1,
          });
      }

      if (aperturas.length === 0) {
        return res.status(404).json({
          error: "No existen cajas abiertas para esta sucursal",
        });
      }

      const fechaReporte = new Date();

      const reportePorCaja = [];

      let totalGeneralVentas = 0;
      let totalGeneralEfectivo = 0;
      let totalGeneralQr = 0;
      let totalGeneralTransferencia = 0;
      let totalGeneralMixto = 0;
      let totalGeneralCortesias = 0;
      let totalGeneralAnuladas = 0;

      let cantidadGeneralVentas = 0;
      let cantidadGeneralCortesias = 0;
      let cantidadGeneralAnuladas = 0;

      for (const apertura of aperturas) {
        const idCaja =
          apertura.idCaja?._id ||
          apertura.idCaja;

        const fechaInicio =
          apertura.fechaApertura;

        const fechaFin =
          fechaReporte;

        /*
          Ventas del mesero en esta caja,
          desde apertura hasta este momento.
        */
        const ventas = await Venta.find({
          idPerfil,
          idSucursal,
          idCaja,
          fechaVenta: {
            $gte: fechaInicio,
            $lte: fechaFin,
          },
        })
          .populate({
            path: "idComanda",
            select: "_id numeroComanda estado observacion fechaApertura fechaCierre",
          })
          .populate({
            path: "idCaja",
            select: "_id nombre descripcion estado",
          })
          .populate({
            path: "idPerfil",
            select: "_id nombres apellidos email telefono ci",
          })
          .populate({
            path: "idSucursal",
            select: "_id nombreSucursal ubicacionSucursal",
          })
          .sort({
            fechaVenta: 1,
          });

        const idsVentas =
          ventas.map((venta) => venta._id);

        const detallesVenta =
          await DetalleVenta.find({
            idVenta: {
              $in: idsVentas,
            },
          })
            .populate({
              path: "idProducto",
              select: "_id nombre descripcion marca estado",
            })
            .populate({
              path: "idInventario",
              select: "_id idProducto idAlmacen cantidad costoUnitario precioVenta estado",
            })
            .populate({
              path: "idAlmacen",
              select: "_id nombre descripcion tipo estado",
            });

        const ventasPagadas =
          ventas.filter(
            (venta: any) =>
              venta.estado === "pagado"
          );

        const ventasAnuladas =
          ventas.filter(
            (venta: any) =>
              venta.estado === "anulado"
          );

        const cortesias =
          ventas.filter(
            (venta: any) =>
              venta.estado === "cortesia"
          );

        const sumarTotal = (lista: any[]) =>
          lista.reduce(
            (total, venta) =>
              total + convertirNumero(venta.total),
            0
          );

        const sumarSubtotal = (lista: any[]) =>
          lista.reduce(
            (total, venta) =>
              total + convertirNumero(venta.subtotal),
            0
          );

        const totalVentas =
          sumarTotal(ventasPagadas);

        const totalEfectivo =
          sumarTotal(
            ventasPagadas.filter(
              (venta: any) =>
                venta.metodoPago === "efectivo"
            )
          );

        const totalQr =
          sumarTotal(
            ventasPagadas.filter(
              (venta: any) =>
                venta.metodoPago === "qr"
            )
          );

        const totalTransferencia =
          sumarTotal(
            ventasPagadas.filter(
              (venta: any) =>
                venta.metodoPago === "transferencia"
            )
          );

        const totalMixto =
          sumarTotal(
            ventasPagadas.filter(
              (venta: any) =>
                venta.metodoPago === "mixto"
            )
          );

        const totalVentasAnuladas =
          sumarTotal(ventasAnuladas);

        const totalCortesias =
          sumarSubtotal(cortesias);

        /*
          Dinero físico que el mesero debe entregar
          a esta caja.
        */
        const montoEfectivoAEntregar =
          totalEfectivo;

        /*
          Monto que debe justificar con comprobantes:
          QR, transferencia y mixto.
        */
        const totalAJustificarConComprobante =
          totalQr +
          totalTransferencia +
          totalMixto;

        /*
          Total general registrado por el sistema
          para esta caja.
        */
        const totalAJustificarSistema =
          totalVentas;

        const detalleVentas =
          ventas.map((venta: any) => {
            const productos =
              detallesVenta
                .filter(
                  (detalle: any) =>
                    String(detalle.idVenta) ===
                    String(venta._id)
                )
                .map((detalle: any) => ({
                  idDetalleVenta:
                    detalle._id,

                  idProducto:
                    obtenerId(detalle.idProducto),

                  producto:
                    detalle.idProducto?.nombre ||
                    obtenerNombre(detalle.idProducto),

                  marca:
                    detalle.idProducto?.marca || "",

                  idInventario:
                    obtenerId(detalle.idInventario),

                  idAlmacen:
                    obtenerId(detalle.idAlmacen),

                  almacen:
                    obtenerNombre(detalle.idAlmacen),

                  cantidad:
                    convertirNumero(detalle.cantidad),

                  precioUnitario:
                    convertirNumero(detalle.precioUnitario),

                  costoUnitario:
                    convertirNumero(detalle.costoUnitario),

                  subtotal:
                    convertirNumero(detalle.subtotal),

                  estado:
                    detalle.estado,
                }));

            return {
              idVenta:
                venta._id,

              numeroVenta:
                venta.numeroVenta,

              idComanda:
                venta.idComanda?._id ||
                venta.idComanda ||
                null,

              numeroComanda:
                venta.idComanda?.numeroComanda ||
                "-",

              estadoComanda:
                venta.idComanda?.estado ||
                "",

              fechaVenta:
                venta.fechaVenta,

              metodoPago:
                venta.metodoPago,

              estado:
                venta.estado,

              subtotal:
                convertirNumero(venta.subtotal),

              descuento:
                convertirNumero(venta.descuento),

              total:
                convertirNumero(venta.total),

              observacion:
                venta.observacion || "",

              productos,
            };
          });

        const idsComandasDeVentas =
          ventas
            .map((venta: any) =>
              venta.idComanda?._id ||
              venta.idComanda
            )
            .filter(Boolean);

        /*
          Como tu modelo Comanda no tiene idCaja,
          la forma más segura de saber a qué caja pertenece
          una comanda es mediante la venta que la cerró.
  
          Si quieres reportar comandas abiertas por caja,
          te recomiendo agregar idCaja al modelo Comanda.
        */
        const comandasRelacionadas =
          await Comanda.find({
            _id: {
              $in: idsComandasDeVentas,
            },
          })
            .populate({
              path: "idPerfil",
              select: "_id nombres apellidos email telefono ci",
            })
            .sort({
              fechaApertura: 1,
            });

        const comandasAnuladas =
          comandasRelacionadas.filter(
            (comanda: any) =>
              comanda.estado === "anulado"
          );

        const cajaReporte = {
          idAperturaCaja:
            apertura._id,

          idCaja:
            obtenerId(idCaja),

          caja:
            obtenerNombre(apertura.idCaja),

          fechaApertura:
            fechaInicio,

          fechaReporte:
            fechaFin,

          estadoApertura:
            apertura.estado,

          responsableApertura:
            obtenerNombrePerfil(apertura.idPerfil),

          resumen: {
            cantidadVentas:
              ventasPagadas.length,

            cantidadVentasAnuladas:
              ventasAnuladas.length,

            cantidadCortesias:
              cortesias.length,

            cantidadComandasRelacionadas:
              comandasRelacionadas.length,

            cantidadComandasAnuladas:
              comandasAnuladas.length,

            totalVentas,

            totalEfectivo,

            totalQr,

            totalTransferencia,

            totalMixto,

            montoEfectivoAEntregar,

            totalAJustificarConComprobante,

            totalAJustificarSistema,

            totalVentasAnuladas,

            totalCortesias,
          },

          ventas:
            detalleVentas.filter(
              (venta) =>
                venta.estado === "pagado"
            ),

          ventasAnuladas:
            detalleVentas.filter(
              (venta) =>
                venta.estado === "anulado"
            ),

          cortesias:
            detalleVentas.filter(
              (venta) =>
                venta.estado === "cortesia"
            ),

          comandasRelacionadas,

          comandasAnuladas,
        };

        reportePorCaja.push(cajaReporte);

        totalGeneralVentas += totalVentas;
        totalGeneralEfectivo += totalEfectivo;
        totalGeneralQr += totalQr;
        totalGeneralTransferencia += totalTransferencia;
        totalGeneralMixto += totalMixto;
        totalGeneralCortesias += totalCortesias;
        totalGeneralAnuladas += totalVentasAnuladas;

        cantidadGeneralVentas += ventasPagadas.length;
        cantidadGeneralCortesias += cortesias.length;
        cantidadGeneralAnuladas += ventasAnuladas.length;
      }

      const primeraVenta =
        reportePorCaja
          .flatMap((caja: any) => caja.ventas)
        [0];

      return res.json({
        message:
          "Reporte del mesero por cajas generado correctamente",

        general: {
          idPerfil,

          idSucursal:
            String(idSucursal),

          fechaReporte,

          cantidadCajas:
            reportePorCaja.length,
        },

        resumenGeneral: {
          cantidadVentas:
            cantidadGeneralVentas,

          cantidadVentasAnuladas:
            cantidadGeneralAnuladas,

          cantidadCortesias:
            cantidadGeneralCortesias,

          totalVentas:
            totalGeneralVentas,

          totalEfectivo:
            totalGeneralEfectivo,

          totalQr:
            totalGeneralQr,

          totalTransferencia:
            totalGeneralTransferencia,

          totalMixto:
            totalGeneralMixto,

          montoEfectivoAEntregar:
            totalGeneralEfectivo,

          totalAJustificarConComprobante:
            totalGeneralQr +
            totalGeneralTransferencia +
            totalGeneralMixto,

          totalAJustificarSistema:
            totalGeneralVentas,

          totalVentasAnuladas:
            totalGeneralAnuladas,

          totalCortesias:
            totalGeneralCortesias,
        },

        explicacionCaja: {
          porCaja:
            "El mesero debe entregar o justificar el dinero separado por cada caja donde registró ventas.",

          efectivo:
            "El efectivo es dinero físico que debe entregarse a la caja correspondiente.",

          qr:
            "El QR debe justificarse con comprobante o validación de pago.",

          transferencia:
            "La transferencia debe justificarse con comprobante o validación bancaria.",

          mixto:
            "El pago mixto se muestra como total completo. Para separar efectivo, QR y transferencia dentro de una venta mixta, el modelo Venta debe guardar el desglose.",

          cortesias:
            "Las cortesías no generan dinero, pero deben justificarse porque representan productos entregados.",

          anulaciones:
            "Las ventas anuladas y comandas anuladas deben revisarse con observación y responsable.",
        },

        cajas:
          reportePorCaja,
      });
    } catch (error) {
      console.log(
        "Error reporte ventas mesero por cajas:",
        error
      );

      return res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error al generar reporte del mesero por cajas",
      });
    }
  };
  /* =========================
      VENTAS CON DETALLES
      POR PERFIL
  ========================= */

  static getVentasConDetallesPorPerfil =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const {
          idPerfil,
        } = req.params;

        const ventas =
          await Venta.find({
            idPerfil,
          })
            .populate({
              path:
                "idPerfil",

              select:
                "_id nombres apellidos email telefono ci idSucursal",

              populate: {
                path:
                  "idSucursal",

                select:
                  "_id nombreSucursal ubicacionSucursal",
              },
            })
            .populate({
              path:
                "idSucursal",

              select:
                "_id nombreSucursal ubicacionSucursal",
            })
            .populate({
              path:
                "idComanda",

              select:
                "_id numeroComanda estado observacion fechaApertura",
            })
            .populate({
              path:
                "idCaja",

              select:
                "_id nombre descripcion estado",
            })
            .sort({
              fechaCreacion:
                -1,
            })
            .lean();

        if (
          ventas.length ===
          0
        ) {

          return res.json({
            perfil:
              null,

            sucursal:
              null,

            ventas:
              [],
          });

        }

        const primeraVenta: any =
          ventas[0];

        const perfil =
          primeraVenta.idPerfil
            ? {
              _id:
                primeraVenta.idPerfil._id,

              nombres:
                primeraVenta.idPerfil.nombres,

              apellidos:
                primeraVenta.idPerfil.apellidos,

              email:
                primeraVenta.idPerfil.email,

              telefono:
                primeraVenta.idPerfil.telefono,

              ci:
                primeraVenta.idPerfil.ci,
            }
            : null;

        const sucursal =
          primeraVenta.idSucursal
            ? {
              _id:
                primeraVenta.idSucursal._id,

              nombreSucursal:
                primeraVenta.idSucursal.nombreSucursal,

              ubicacionSucursal:
                primeraVenta.idSucursal.ubicacionSucursal,
            }
            : primeraVenta.idPerfil
              ?.idSucursal
              ? {
                _id:
                  primeraVenta.idPerfil.idSucursal._id,

                nombreSucursal:
                  primeraVenta.idPerfil.idSucursal.nombreSucursal,

                ubicacionSucursal:
                  primeraVenta.idPerfil.idSucursal.ubicacionSucursal,
              }
              : null;

        const idsVentas =
          ventas.map(
            (venta) =>
              venta._id
          );

        const detalles =
          await DetalleVenta.find({

            idVenta: {
              $in:
                idsVentas,
            },

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
                "_id idProducto idAlmacen cantidad costoUnitario precioVenta stockMinimo estado",
            })
            .populate({
              path:
                "idAlmacen",

              select:
                "_id nombre descripcion tipo estado",
            })
            .lean();

        const ventasLimpias =
          ventas.map(
            (venta: any) => {

              const detallesDeVenta =
                detalles
                  .filter(
                    (
                      detalle: any
                    ) =>
                      detalle
                        .idVenta
                        .toString() ===
                      venta
                        ._id
                        .toString()
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
                              detalle.idProducto._id,

                            nombre:
                              detalle.idProducto.nombre,

                            descripcion:
                              detalle.idProducto.descripcion,

                            marca:
                              detalle.idProducto.marca,

                            estado:
                              detalle.idProducto.estado,
                          }
                          : null,

                      idInventario:
                        detalle.idInventario ||
                        null,

                      idAlmacen:
                        detalle.idAlmacen ||
                        null,

                      cantidad:
                        Number(
                          detalle.cantidad
                        ),

                      precioUnitario:
                        Number(
                          detalle.precioUnitario
                        ),

                      costoUnitario:
                        Number(
                          detalle.costoUnitario ||
                          0
                        ),

                      subtotal:
                        Number(
                          detalle.subtotal
                        ),

                      estado:
                        detalle.estado,

                      creadoPor:
                        detalle.creadoPor,

                      fechaCreacion:
                        detalle.fechaCreacion,

                      actualizadoPor:
                        detalle.actualizadoPor,

                      fechaActualizacion:
                        detalle.fechaActualizacion,

                      eliminadoPor:
                        detalle.eliminadoPor,

                      fechaEliminado:
                        detalle.fechaEliminado,

                    })
                  );

              const totalDetalles =
                detallesDeVenta.reduce(
                  (
                    acumulado,
                    detalle
                  ) =>
                    acumulado +
                    Number(
                      detalle.subtotal ||
                      0
                    ),
                  0
                );

              return {

                _id:
                  venta._id,

                numeroVenta:
                  venta.numeroVenta,

                comanda:
                  venta.idComanda
                    ? {
                      _id:
                        venta.idComanda._id,

                      numeroComanda:
                        venta.idComanda.numeroComanda,

                      estado:
                        venta.idComanda.estado,

                      observacion:
                        venta.idComanda.observacion,

                      fechaApertura:
                        venta.idComanda.fechaApertura,
                    }
                    : null,

                caja:
                  venta.idCaja
                    ? {
                      _id:
                        venta.idCaja._id,

                      nombre:
                        venta.idCaja.nombre,

                      descripcion:
                        venta.idCaja.descripcion,

                      estado:
                        venta.idCaja.estado,
                    }
                    : null,

                fechaVenta:
                  venta.fechaVenta,

                subtotal:
                  Number(
                    venta.subtotal
                  ),

                descuento:
                  Number(
                    venta.descuento ||
                    0
                  ),

                total:
                  Number(
                    venta.total
                  ),

                totalDetalles,

                metodoPago:
                  venta.metodoPago,

                estado:
                  venta.estado,

                observacion:
                  venta.observacion,

                creadoPor:
                  venta.creadoPor,

                fechaCreacion:
                  venta.fechaCreacion,

                actualizadoPor:
                  venta.actualizadoPor,

                fechaActualizacion:
                  venta.fechaActualizacion,

                eliminadoPor:
                  venta.eliminadoPor,

                fechaEliminado:
                  venta.fechaEliminado,

                detalles:
                  detallesDeVenta,

              };

            }
          );

        return res.json({

          perfil,

          sucursal,

          ventas:
            ventasLimpias,

        });

      } catch (error) {

        console.log(error);

        return res.status(500).json({
          error:
            "Error al obtener ventas con detalles por perfil",
        });

      }

    };


}