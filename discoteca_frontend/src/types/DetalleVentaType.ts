// src/types/DetalleVentaType.ts

import {
  z,
} from "zod";

/* =========================
    OBJECT ID SAFE
========================= */

export const ObjectIdStringSchema =
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

    fechaVenta:
      z.string()
        .nullable()
        .optional(),

    subtotal:
      z.coerce
        .number()
        .optional(),

    descuento:
      z.coerce
        .number()
        .optional(),

    total:
      z.coerce
        .number()
        .optional(),

    metodoPago:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.string()
        .nullable()
        .optional(),

    observacion:
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
    ALMACÉN POPULATE
========================= */

export const AlmacenDetalleVentaSchema =
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

    ubicacion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    INVENTARIO POPULATE
========================= */

export const InventarioDetalleVentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    idProducto:
      z.union([

        ObjectIdStringSchema,

        ProductoDetalleVentaSchema,

        z.null(),

      ])
        .optional(),

    idAlmacen:
      z.union([

        ObjectIdStringSchema,

        AlmacenDetalleVentaSchema,

        z.null(),

      ])
        .optional(),

    cantidad:
      z.coerce
        .number()
        .optional(),

    costoUnitario:
      z.coerce
        .number()
        .optional(),

    precioVenta:
      z.coerce
        .number()
        .optional(),

    stockMinimo:
      z.coerce
        .number()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    ESTADO DETALLE VENTA
========================= */

export const EstadoDetalleVentaSchema =
  z.enum([

    "activo",

    "eliminado",

  ]);

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

    /*
      Se dejan opcionales temporalmente para
      soportar detalles antiguos que todavía
      no tienen estos campos.
    */
    idInventario:
      z.union([

        ObjectIdStringSchema,

        InventarioDetalleVentaSchema,

        z.null(),

      ])
        .optional(),

    idAlmacen:
      z.union([

        ObjectIdStringSchema,

        AlmacenDetalleVentaSchema,

        z.null(),

      ])
        .optional(),

    /* =========================
        DATOS DEL DETALLE
    ========================= */

    cantidad:
      z.coerce
        .number(),

    precioUnitario:
      z.coerce
        .number(),

    costoUnitario:
      z.coerce
        .number()
        .default(0),

    subtotal:
      z.coerce
        .number(),

    estado:
      EstadoDetalleVentaSchema
        .default("activo"),

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

  }).passthrough();

/* =========================
    RESPUESTA CREAR DETALLE
========================= */

export const CreateDetalleVentaResponseSchema =
  z.object({

    message:
      z.string()
        .optional(),

    detalle:
      DetalleVentaSchema,

  }).passthrough();

/* =========================
    LIST SCHEMA
========================= */

export const DetalleVentaListSchema =
  DetalleVentaSchema.pick({

    _id:
      true,

    idVenta:
      true,

    idProducto:
      true,

    idInventario:
      true,

    idAlmacen:
      true,

    cantidad:
      true,

    precioUnitario:
      true,

    costoUnitario:
      true,

    subtotal:
      true,

    estado:
      true,

    creadoPor:
      true,

    fechaCreacion:
      true,

  });

/* =========================
    ARRAY SCHEMA
========================= */

export const DetalleVentaArraySchema =
  z.array(
    DetalleVentaSchema
  );

/* =========================
    SAFE SCHEMA
========================= */

export const DetalleVentaSafeSchema =
  DetalleVentaSchema.omit({

    eliminadoPor:
      true,

    fechaEliminado:
      true,

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

export type EstadoDetalleVenta =
  z.infer<
    typeof EstadoDetalleVentaSchema
  >;

/* =========================
    FORM PARA CREAR
========================= */

export type DetalleVentaForm = {

  idVenta:
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

  /*
    El backend obtiene el costo desde
    inventario, por lo que no es obligatorio
    enviarlo desde el frontend.
  */
  costoUnitario?:
    number;

  /*
    El backend también recalcula el subtotal,
    pero se permite enviarlo.
  */
  subtotal?:
    number;

  estado?:
    EstadoDetalleVenta;

  creadoPor?:
    string | null;

};

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

  formData: {

    cantidad?:
      number;

    precioUnitario?:
      number;

    actualizadoPor?:
      string | null;

  };

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