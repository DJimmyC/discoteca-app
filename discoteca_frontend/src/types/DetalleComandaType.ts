// src/types/DetalleComandaType.ts

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
    COMANDA POPULATE
========================= */

export const ComandaPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    numeroComanda:
      z.string()
        .optional(),

    estado:
      z.string()
        .optional(),

    observacion:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    PRODUCTO POPULATE
========================= */

export const ProductoPopulateSchema =
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
    INVENTARIO POPULATE
    OPCIONAL, SI LUEGO AGREGAS idInventario
========================= */

export const InventarioPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    cantidad:
      z.number()
        .optional(),

    precioVenta:
      z.number()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    ESTADO DETALLE COMANDA
========================= */

export const EstadoDetalleComandaSchema =
  z.enum([

    "activo",

    "eliminado",

    "anulado",

  ]);

/* =========================
    DETALLE COMANDA SCHEMA
========================= */

export const DetalleComandaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idComanda:
      z.union([

        ObjectIdStringSchema,

        ComandaPopulateSchema,

        z.null(),

      ]),

    idProducto:
      z.union([

        ObjectIdStringSchema,

        ProductoPopulateSchema,

        z.null(),

      ]),

    /*
      Si decides agregar idInventario en tu modelo,
      ya queda preparado.
    */
    idInventario:
      z.union([

        ObjectIdStringSchema,

        InventarioPopulateSchema,

        z.null(),

      ]).optional(),

    /* =========================
        DATOS DEL DETALLE
    ========================= */

    cantidad:
      z.number(),

    precioUnitario:
      z.number(),

    subtotal:
      z.number(),

    estado:
      EstadoDetalleComandaSchema,

    observacion:
      z.string()
        .nullable()
        .optional(),

    /* =========================
        AUDITORÍA
    ========================= */

    creadoPor:
      z.string()
        .nullable()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    fechaEliminado:
      z.string()
        .nullable()
        .optional(),

  });

/* =========================
    DETALLE LIST SCHEMA
========================= */

export const DetalleComandaListSchema =
  DetalleComandaSchema.pick({

    _id: true,

    idComanda: true,

    idProducto: true,

    idInventario: true,

    cantidad: true,

    precioUnitario: true,

    subtotal: true,

    estado: true,

    observacion: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY SCHEMA
========================= */

export const DetalleComandaArraySchema =
  z.array(
    DetalleComandaListSchema
  );

/* =========================
    SAFE SCHEMA
========================= */

export const DetalleComandaSafeSchema =
  DetalleComandaSchema.omit({

    eliminadoPor: true,

    fechaEliminado: true,

  });

/* =========================
    TYPES
========================= */

export type DetalleComandaType =
  z.infer<
    typeof DetalleComandaSchema
  >;

export type DetalleComandaListType =
  z.infer<
    typeof DetalleComandaListSchema
  >;

export type EstadoDetalleComanda =
  z.infer<
    typeof EstadoDetalleComandaSchema
  >;

/* =========================
    FORM DATA
========================= */

export type DetalleComandaForm =
  Pick<

    DetalleComandaType,

    | "idComanda"
    | "idProducto"
    | "cantidad"
    | "precioUnitario"
    | "subtotal"
    | "observacion"
    | "creadoPor"

  > & {

    estado?:
      EstadoDetalleComanda;

    idInventario?:
      string;

  };

/* =========================
    FORM DATA ALIAS
========================= */

export type DetalleComandaFormData =
  DetalleComandaForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateDetalleComandaType = {

  detalleComandaId:
    string;

  formData:
    Partial<DetalleComandaForm>;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteDetalleComandaType = {

  id:
    string;

  eliminadoPor?:
    string;

};