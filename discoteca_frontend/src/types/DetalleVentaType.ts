// src/types/DetalleVentaType.ts

import { z } from "zod";

/* =========================
    OBJECT ID SAFE
========================= */

const ObjectIdStringSchema =
  z.preprocess(
    (val) => {

      if (
        typeof val === "object" &&
        val !== null &&
        "_id" in val
      ) {
        return (val as { _id: unknown })._id;
      }

      return val;

    },
    z.string()
  );

/* =========================
    VENTA POPULATE
========================= */

export const VentaDetallePopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    numeroVenta:
      z.string()
        .nullable()
        .optional(),

    metodoPago:
      z.string()
        .nullable()
        .optional(),

    total:
      z.number()
        .optional(),

    estado:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    PRODUCTO POPULATE
========================= */

export const ProductoDetalleVentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    marca:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    DETALLE VENTA SCHEMA
========================= */

export const DetalleVentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idVenta:
      z.union([

        ObjectIdStringSchema,

        VentaDetallePopulateSchema,

        z.null(),

      ]),

    idProducto:
      z.union([

        ObjectIdStringSchema,

        ProductoDetalleVentaSchema,

        z.null(),

      ]),

    /* =========================
        DATOS DEL DETALLE
    ========================= */

    cantidad:
      z.number(),

    precioUnitario:
      z.number(),

    subtotal:
      z.number(),

    /* =========================
        AUDITORÍA
    ========================= */

    creadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaEliminado:
      z.string()
        .nullable()
        .optional(),

  });

/* =========================
    LIST SCHEMA
========================= */

export const DetalleVentaListSchema =
  DetalleVentaSchema.pick({

    _id: true,

    idVenta: true,

    idProducto: true,

    cantidad: true,

    precioUnitario: true,

    subtotal: true,

    creadoPor: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY SCHEMA
========================= */

export const DetalleVentaArraySchema =
  z.array(
    DetalleVentaListSchema
  );

/* =========================
    SAFE SCHEMA
========================= */

export const DetalleVentaSafeSchema =
  DetalleVentaSchema.omit({

    eliminadoPor: true,

    fechaEliminado: true,

  });

/* =========================
    TYPES
========================= */

export type DetalleVentaType =
  z.infer<
    typeof DetalleVentaSchema
  >;

export type DetalleVentaListType =
  z.infer<
    typeof DetalleVentaListSchema
  >;

/* =========================
    FORM DATA
========================= */

export type DetalleVentaForm =
  Pick<

    DetalleVentaType,

    | "idVenta"
    | "idProducto"
    | "cantidad"
    | "precioUnitario"
    | "subtotal"
    | "creadoPor"

  >;

/* =========================
    FORM DATA ALIAS
========================= */

export type DetalleVentaFormData =
  DetalleVentaForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateDetalleVentaType = {

  detalleVentaId:
    string;

  formData:
    Partial<DetalleVentaForm>;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteDetalleVentaType = {

  id:
    string;

  eliminadoPor?:
    string;

};