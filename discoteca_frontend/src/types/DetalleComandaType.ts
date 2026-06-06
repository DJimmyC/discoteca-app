// src/types/DetalleComandaType.ts

import { z } from "zod";

/* =========================
    OBJECT ID SAFE
========================= */

const ObjectIdStringSchema =
  z.preprocess(
    (value) => {

      if (
        typeof value === "object" &&
        value !== null &&
        "_id" in value
      ) {
        return (
          value as {
            _id: unknown;
          }
        )._id;
      }

      return value;

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
        .nullable()
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
    ALMACÉN POPULATE
========================= */

export const AlmacenPopulateSchema =
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

    tipo:
      z.string()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    INVENTARIO POPULATE
========================= */

export const InventarioPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    idAlmacen:
      z.union([
        ObjectIdStringSchema,
        AlmacenPopulateSchema,
        z.null(),
      ]).optional(),

    idProducto:
      z.union([
        ObjectIdStringSchema,
        ProductoPopulateSchema,
        z.null(),
      ]).optional(),

    cantidad:
      z.number()
        .optional(),

    costoUnitario:
      z.number()
        .optional(),

    precioVenta:
      z.number()
        .optional(),

    stockMinimo:
      z.number()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    ESTADO
========================= */

export const EstadoDetalleComandaSchema =
  z.enum([
    "activo",
    "eliminado",
  ]);

/* =========================
    DETALLE COMANDA
========================= */

export const DetalleComandaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

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

    idInventario:
      z.union([
        ObjectIdStringSchema,
        InventarioPopulateSchema,
        z.null(),
      ]),

    idAlmacen:
      z.union([
        ObjectIdStringSchema,
        AlmacenPopulateSchema,
        z.null(),
      ]),

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

  }).passthrough();

/* =========================
    RESPUESTA CREACIÓN
========================= */

export const CreateDetalleComandaResponseSchema =
  z.object({

    message:
      z.string()
        .optional(),

    detalle:
      DetalleComandaSchema,

  }).passthrough();

/* =========================
    ARRAY
========================= */

export const DetalleComandaArraySchema =
  z.array(
    DetalleComandaSchema
  );

/* =========================
    SAFE
========================= */

export const DetalleComandaSafeSchema =
  DetalleComandaSchema.omit({

    eliminadoPor:
      true,

    fechaEliminado:
      true,

  });

/* =========================
    TYPES
========================= */

export type DetalleComandaType =
  z.infer<
    typeof DetalleComandaSchema
  >;

export type EstadoDetalleComanda =
  z.infer<
    typeof EstadoDetalleComandaSchema
  >;

/* =========================
    FORM PARA CREAR
========================= */

export type DetalleComandaForm = {

  idComanda:
    string;

  idProducto:
    string;

  idInventario:
    string;

  idAlmacen:
    string;

  cantidad:
    number;

  precioUnitario:
    number;

  subtotal:
    number;

  estado?:
    EstadoDetalleComanda;

  observacion?:
    string | null;

  creadoPor?:
    string | null;

  actualizadoPor?:
    string | null;

};

/* =========================
    ALIAS
========================= */

export type DetalleComandaFormData =
  DetalleComandaForm;

/* =========================
    UPDATE
========================= */

export type UpdateDetalleComandaType = {

  detalleComandaId:
    string;

  formData:
    Partial<DetalleComandaForm>;

};

/* =========================
    DELETE
========================= */

export type DeleteDetalleComandaType = {

  id:
    string;

  eliminadoPor?:
    string;

};