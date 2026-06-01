// src/types/DetalleEgresoType.ts

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
    EGRESO POPULATE
========================= */

export const EgresoDetallePopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    numeroEgreso:
      z.string()
        .nullable()
        .optional(),

    tipoEgreso:
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

export const ProductoDetalleEgresoSchema =
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
    ALMACEN POPULATE
========================= */

export const AlmacenDetalleEgresoSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string()
        .optional(),

    tipo:
      z.string()
        .nullable()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    ubicacion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    TIPO ITEM
========================= */

export const TipoItemEgresoSchema =
  z.enum([

    "producto",

    "servicio",

    "otro",

  ]).or(z.string());

/* =========================
    DETALLE EGRESO SCHEMA
========================= */

export const DetalleEgresoSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idEgreso:
      z.union([

        ObjectIdStringSchema,

        EgresoDetallePopulateSchema,

        z.null(),

      ]),

    idProducto:
      z.union([

        ObjectIdStringSchema,

        ProductoDetalleEgresoSchema,

        z.null(),

      ]).optional(),

    idAlmacen:
      z.union([

        ObjectIdStringSchema,

        AlmacenDetalleEgresoSchema,

        z.null(),

      ]).optional(),

    /* =========================
        DATOS DEL DETALLE
    ========================= */

    descripcion:
      z.string()
        .nullable()
        .optional(),

    cantidad:
      z.number(),

    costoUnitario:
      z.number(),

    subtotal:
      z.number(),

    tipoItem:
      TipoItemEgresoSchema
        .nullable()
        .optional(),

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

export const DetalleEgresoListSchema =
  DetalleEgresoSchema.pick({

    _id: true,

    idEgreso: true,

    idProducto: true,

    idAlmacen: true,

    descripcion: true,

    cantidad: true,

    costoUnitario: true,

    subtotal: true,

    tipoItem: true,

    creadoPor: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY SCHEMA
========================= */

export const DetalleEgresoArraySchema =
  z.array(
    DetalleEgresoListSchema
  );

/* =========================
    SAFE SCHEMA
========================= */

export const DetalleEgresoSafeSchema =
  DetalleEgresoSchema.omit({

    eliminadoPor: true,

    fechaEliminado: true,

  });

/* =========================
    TYPES
========================= */

export type DetalleEgresoType =
  z.infer<
    typeof DetalleEgresoSchema
  >;

export type DetalleEgresoListType =
  z.infer<
    typeof DetalleEgresoListSchema
  >;

export type TipoItemEgreso =
  z.infer<
    typeof TipoItemEgresoSchema
  >;

/* =========================
    FORM DATA
========================= */

export type DetalleEgresoForm =
  Pick<

    DetalleEgresoType,

    | "idEgreso"
    | "descripcion"
    | "cantidad"
    | "costoUnitario"
    | "subtotal"
    | "tipoItem"
    | "creadoPor"

  > & {

    idProducto?:
      string | null;

    idAlmacen?:
      string | null;

  };

/* =========================
    FORM DATA ALIAS
========================= */

export type DetalleEgresoFormData =
  DetalleEgresoForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateDetalleEgresoType = {

  detalleEgresoId:
    string;

  formData:
    Partial<DetalleEgresoForm> & {
      actualizadoPor?: string;
    };

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteDetalleEgresoType = {

  id:
    string;

  eliminadoPor?:
    string;

};