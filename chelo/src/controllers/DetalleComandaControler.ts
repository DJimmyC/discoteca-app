import type {
  Request,
  Response,
} from "express";

import DetalleComanda from "../models/DetalleComanda";

import Comanda from "../models/Comanda";

import Inventario from "../models/Inventario";

import Almacen from "../models/Almacen";

import Producto from "../models/Producto";

export class DetalleComandaController {

  /* =========================
      CREAR DETALLE
  ========================= */

  static createDetalle = async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        idComanda,
        idProducto,
        idInventario,
        idAlmacen,
        cantidad,
        precioUnitario,
        estado,
        observacion,
        creadoPor,
      } = req.body;

      /* =========================
          VALIDAR CAMPOS
      ========================= */

      if (!idComanda) {

        return res.status(400).json({
          error:
            "El ID de la comanda es obligatorio",
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

      const cantidadDetalle =
        Number(cantidad);

      const precioDetalle =
        Number(precioUnitario);

      if (
        !Number.isFinite(cantidadDetalle) ||
        cantidadDetalle <= 0
      ) {

        return res.status(400).json({
          error:
            "La cantidad debe ser mayor a cero",
        });

      }

      if (
        !Number.isFinite(precioDetalle) ||
        precioDetalle < 0
      ) {

        return res.status(400).json({
          error:
            "El precio unitario no es válido",
        });

      }

      /* =========================
          VALIDAR COMANDA
      ========================= */

      const comanda =
        await Comanda.findById(
          idComanda
        );

      if (!comanda) {

        return res.status(404).json({
          error:
            "Comanda no encontrada",
        });

      }

      /* =========================
          VALIDAR PRODUCTO
      ========================= */

      const producto =
        await Producto.findById(
          idProducto
        );

      if (!producto) {

        return res.status(404).json({
          error:
            "Producto no encontrado",
        });

      }

      /* =========================
          VALIDAR ALMACÉN
      ========================= */

      const almacen =
        await Almacen.findById(
          idAlmacen
        );

      if (!almacen) {

        return res.status(404).json({
          error:
            "Almacén no encontrado",
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

      /*
        Por ahora solo validamos el stock.
        Todavía no descontamos inventario.
      */

      if (
        Number(inventario.cantidad) <
        cantidadDetalle
      ) {

        return res.status(400).json({

          error:
            `Stock insuficiente. Disponible: ${inventario.cantidad}, solicitado: ${cantidadDetalle}`,

        });

      }

      /* =========================
          CREAR DETALLE
      ========================= */

      const detalle =
        new DetalleComanda({

          idComanda,

          idProducto,

          idInventario,

          idAlmacen,

          cantidad:
            cantidadDetalle,

          precioUnitario:
            precioDetalle,

          subtotal:
            cantidadDetalle *
            precioDetalle,

          estado:
            estado || "activo",

          observacion:
            observacion || "",

          creadoPor:
            creadoPor || "sistema",

        });

      await detalle.save();

      return res.status(201).json({

        message:
          "Detalle de comanda creado",

        detalle,

      });

    } catch (error: unknown) {

      console.log(
        "Error al crear detalle de comanda:",
        error
      );

      return res.status(500).json({

        error:
          error instanceof Error
            ? error.message
            : "Error al crear detalle de comanda",

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
        await DetalleComanda.find({})
          .populate({
            path:
              "idComanda",

            select:
              "_id numeroComanda estado observacion",
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
              "_id idAlmacen idProducto cantidad costoUnitario precioVenta stockMinimo estado",
          })
          .populate({
            path:
              "idAlmacen",

            select:
              "_id nombre tipo descripcion estado",
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
          "Error al obtener detalles de comanda",
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
        await DetalleComanda.findById(
          id
        )
          .populate(
            "idComanda"
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
            "Detalle de comanda no encontrado",
        });

      }

      return res.json(
        detalle
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        error:
          "Error al obtener detalle de comanda",
      });

    }

  };

  /* =========================
      ACTUALIZAR
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
        await DetalleComanda.findById(
          id
        );

      if (!detalle) {

        return res.status(404).json({
          error:
            "Detalle de comanda no encontrado",
        });

      }

      detalle.idComanda =
        req.body.idComanda ||
        detalle.idComanda;

      detalle.idProducto =
        req.body.idProducto ||
        detalle.idProducto;

      detalle.idInventario =
        req.body.idInventario ||
        detalle.idInventario;

      detalle.idAlmacen =
        req.body.idAlmacen ||
        detalle.idAlmacen;

      detalle.cantidad =
        req.body.cantidad ??
        detalle.cantidad;

      detalle.precioUnitario =
        req.body.precioUnitario ??
        detalle.precioUnitario;

      detalle.estado =
        req.body.estado ||
        detalle.estado;

      detalle.observacion =
        req.body.observacion ??
        detalle.observacion;

      detalle.actualizadoPor =
        req.body.actualizadoPor;

      detalle.fechaActualizacion =
        new Date();

      detalle.subtotal =
        Number(detalle.cantidad) *
        Number(detalle.precioUnitario);

      await detalle.save();

      return res.json({

        message:
          "Detalle de comanda actualizado",

        detalle,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        error:
          "Error al actualizar detalle de comanda",
      });

    }

  };

  /* =========================
      ELIMINACIÓN LÓGICA
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
        await DetalleComanda.findById(
          id
        );

      if (!detalle) {

        return res.status(404).json({
          error:
            "Detalle de comanda no encontrado",
        });

      }

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
          "Detalle de comanda eliminado",
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        error:
          "Error al eliminar detalle de comanda",
      });

    }

  };

}