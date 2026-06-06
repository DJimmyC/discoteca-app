// src/controllers/DetalleVentaController.ts

import type {
  Request,
  Response,
} from "express";

import DetalleVenta from "../models/DetalleVenta";
import Venta from "../models/Venta";
import Inventario from "../models/Inventario";

import {
  ajustarStockInventario,
} from "./InventarioStcokService";

export class DetalleVentaController {

  /* =========================
      CREAR DETALLE DE VENTA
  ========================= */

  static createDetalle = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idVenta,
        idProducto,
        idInventario,
        idAlmacen,
        cantidad,
        precioUnitario,
        creadoPor,
      } = req.body;

      /* =========================
          VALIDACIONES BÁSICAS
      ========================= */

      if (!idVenta) {

        return res.status(400).json({
          error:
            "El ID de la venta es obligatorio",
        });

      }

      if (!idProducto) {

        return res.status(400).json({
          error:
            "El ID del producto es obligatorio",
        });

      }

      if (!idInventario) {

        return res.status(400).json({
          error:
            "El ID del inventario es obligatorio",
        });

      }

      if (!idAlmacen) {

        return res.status(400).json({
          error:
            "El ID del almacén es obligatorio",
        });

      }

      const cantidadVenta =
        Number(cantidad);

      const precioVenta =
        Number(precioUnitario);

      if (
        !Number.isFinite(cantidadVenta) ||
        cantidadVenta <= 0
      ) {

        return res.status(400).json({
          error:
            "La cantidad debe ser mayor a cero",
        });

      }

      if (
        !Number.isFinite(precioVenta) ||
        precioVenta < 0
      ) {

        return res.status(400).json({
          error:
            "El precio unitario no es válido",
        });

      }

      /* =========================
          VALIDAR VENTA
      ========================= */

      const venta =
        await Venta.findById(
          idVenta
        );

      if (!venta) {

        return res.status(404).json({
          error:
            "Venta no encontrada",
        });

      }

      /* =========================
          VALIDAR INVENTARIO EXACTO
      ========================= */

      const inventario =
        await Inventario.findOne({

          _id:
            idInventario,

          idProducto,

          idAlmacen,

          estado:
            true,

        });

      if (!inventario) {

        return res.status(404).json({
          error:
            "El inventario no corresponde al producto y almacén seleccionados",
        });

      }

      const stockDisponible =
        Number(
          inventario.cantidad || 0
        );

      if (
        stockDisponible <
        cantidadVenta
      ) {

        return res.status(400).json({

          error:
            `Stock insuficiente. Disponible: ${stockDisponible}, solicitado: ${cantidadVenta}`,

        });

      }

      /* =========================
          EVITAR DUPLICADO
      ========================= */

      const detalleExistente =
        await DetalleVenta.findOne({

          idVenta,

          idInventario,

          estado:
            "activo",

        });

      if (detalleExistente) {

        return res.status(400).json({
          error:
            "Este producto ya fue registrado en el detalle de la venta",
        });

      }

      /* =========================
          DESCONTAR STOCK
      ========================= */

      await ajustarStockInventario({

        idAlmacen:
          inventario.idAlmacen,

        idProducto:
          inventario.idProducto,

        cantidad:
          cantidadVenta,

        tipo:
          "RESTAR",

        usuario:
          creadoPor ||
          "sistema",

      });

      /* =========================
          CREAR DETALLE
      ========================= */

      const detalle =
        new DetalleVenta({

          idVenta,

          idProducto:
            inventario.idProducto,

          idInventario:
            inventario._id,

          idAlmacen:
            inventario.idAlmacen,

          cantidad:
            cantidadVenta,

          precioUnitario:
            precioVenta,

          costoUnitario:
            Number(
              inventario.costoUnitario ||
              0
            ),

          subtotal:
            cantidadVenta *
            precioVenta,

          estado:
            "activo",

          creadoPor:
            creadoPor ||
            "sistema",

        });

      await detalle.save();

      return res.status(201).json({

        message:
          "Detalle de venta creado y stock actualizado",

        detalle,

      });

    } catch (error: unknown) {

      console.log(
        "Error al crear detalle de venta:",
        error
      );

      const mensaje =
        error instanceof Error
          ? error.message
          : "Error al crear detalle de venta";

      const status =
        mensaje
          .toLowerCase()
          .includes(
            "stock insuficiente"
          )
          ? 400
          : 500;

      return res.status(status).json({
        error:
          mensaje,
      });

    }

  };

  /* =========================
      OBTENER TODOS
  ========================= */

  static getAllDetalles = async (
    req: Request,
    res: Response
  ) => {

    try {

      const detalles =
        await DetalleVenta.find({})
          .populate({
            path:
              "idVenta",

            select:
              "_id numeroVenta fechaVenta total estado metodoPago",
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
          "Error al obtener detalles de venta",
      });

    }

  };

  /* =========================
      OBTENER POR ID
  ========================= */

  static getDetalleById = async (
    req: Request,
    res: Response
  ) => {

    const {
      id,
    } = req.params;

    try {

      const detalle =
        await DetalleVenta.findById(
          id
        )
          .populate(
            "idVenta"
          )
          .populate(
            "idProducto"
          )
          .populate(
            "idInventario"
          )
          .populate(
            "idAlmacen"
          );

      if (!detalle) {

        return res.status(404).json({
          error:
            "Detalle de venta no encontrado",
        });

      }

      return res.json(
        detalle
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        error:
          "Error al obtener detalle de venta",
      });

    }

  };

  /* =========================
      ACTUALIZAR DETALLE
  ========================= */

  static updateDetalle = async (
    req: Request,
    res: Response
  ) => {

    const {
      id,
    } = req.params;

    try {

      const detalle =
        await DetalleVenta.findById(
          id
        );

      if (!detalle) {

        return res.status(404).json({
          error:
            "Detalle de venta no encontrado",
        });

      }

      if (
        detalle.estado ===
        "eliminado"
      ) {

        return res.status(400).json({
          error:
            "No se puede modificar un detalle eliminado",
        });

      }

      const cantidadAnterior =
        Number(
          detalle.cantidad
        );

      const cantidadNueva =
        req.body.cantidad !==
        undefined
          ? Number(
              req.body.cantidad
            )
          : cantidadAnterior;

      if (
        !Number.isFinite(cantidadNueva) ||
        cantidadNueva <= 0
      ) {

        return res.status(400).json({
          error:
            "La cantidad debe ser mayor a cero",
        });

      }

      /* =========================
          VALIDAR INVENTARIO
      ========================= */

      const inventario =
        await Inventario.findOne({

          _id:
            detalle.idInventario,

          idProducto:
            detalle.idProducto,

          idAlmacen:
            detalle.idAlmacen,

          estado:
            true,

        });

      if (!inventario) {

        return res.status(404).json({
          error:
            "Inventario relacionado no encontrado",
        });

      }

      /* =========================
          AJUSTAR DIFERENCIA
      ========================= */

      const diferencia =
        cantidadNueva -
        cantidadAnterior;

      if (
        diferencia > 0
      ) {

        const stockDisponible =
          Number(
            inventario.cantidad ||
            0
          );

        if (
          stockDisponible <
          diferencia
        ) {

          return res.status(400).json({

            error:
              `Stock insuficiente. Disponible: ${stockDisponible}, adicional solicitado: ${diferencia}`,

          });

        }

        await ajustarStockInventario({

          idAlmacen:
            detalle.idAlmacen,

          idProducto:
            detalle.idProducto,

          cantidad:
            diferencia,

          tipo:
            "RESTAR",

          usuario:
            req.body.actualizadoPor ||
            "sistema",

        });

      }

      if (
        diferencia < 0
      ) {

        await ajustarStockInventario({

          idAlmacen:
            detalle.idAlmacen,

          idProducto:
            detalle.idProducto,

          cantidad:
            Math.abs(
              diferencia
            ),

          tipo:
            "SUMAR",

          usuario:
            req.body.actualizadoPor ||
            "sistema",

        });

      }

      /* =========================
          ACTUALIZAR DATOS
      ========================= */

      detalle.cantidad =
        cantidadNueva;

      detalle.precioUnitario =
        req.body.precioUnitario !==
        undefined
          ? Number(
              req.body.precioUnitario
            )
          : detalle.precioUnitario;

      detalle.subtotal =
        Number(
          detalle.cantidad
        ) *
        Number(
          detalle.precioUnitario
        );

      detalle.actualizadoPor =
        req.body.actualizadoPor ||
        "sistema";

      detalle.fechaActualizacion =
        new Date();

      await detalle.save();

      return res.json({

        message:
          "Detalle actualizado y stock ajustado",

        detalle,

      });

    } catch (error: unknown) {

      console.log(error);

      return res.status(500).json({

        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar detalle de venta",

      });

    }

  };

  /* =========================
      ELIMINAR LÓGICAMENTE
      Y DEVOLVER STOCK
  ========================= */

  static deleteDetalle = async (
    req: Request,
    res: Response
  ) => {

    const {
      id,
    } = req.params;

    try {

      const detalle =
        await DetalleVenta.findById(
          id
        );

      if (!detalle) {

        return res.status(404).json({
          error:
            "Detalle de venta no encontrado",
        });

      }

      if (
        detalle.estado ===
        "eliminado"
      ) {

        return res.status(400).json({
          error:
            "El detalle ya está eliminado",
        });

      }

      /* =========================
          DEVOLVER STOCK
      ========================= */

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

      /* =========================
          ELIMINACIÓN LÓGICA
      ========================= */

      detalle.estado =
        "eliminado";

      detalle.eliminadoPor =
        req.body.eliminadoPor ||
        "admin";

      detalle.fechaEliminado =
        new Date();

      await detalle.save();

      return res.json({
        message:
          "Detalle eliminado y stock restaurado",
      });

    } catch (error: unknown) {

      console.log(error);

      return res.status(500).json({

        error:
          error instanceof Error
            ? error.message
            : "Error al eliminar detalle de venta",

      });

    }

  };

}