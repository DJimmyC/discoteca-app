// src/types/DetalleSolicitudType.ts

import {
  z,
} from "zod";

/* =========================
    ESTADO DETALLE
========================= */

export const EstadoDetalleSolicitudSchema =
  z.enum([

    "pendiente",

    "aprobado",

    "parcial",

    "atendido",

    "rechazado",

    "anulado",

  ]);

/* =========================
    PRODUCTO POPULATE
========================= */

export const ProductoDetalleSolicitudSchema =
  z.object({

    _id:
      z.string(),

    nombre:
      z.string()
        .nullable()
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
    SOLICITUD POPULATE
========================= */

export const SolicitudDetallePopulateSchema =
  z.object({

    _id:
      z.string(),

    estado:
      z.string()
        .nullable()
        .optional(),

    fechaSolicitud:
      z.string()
        .nullable()
        .optional(),

    observacion:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    DETALLE SCHEMA
========================= */

export const DetalleSolicitudSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    idSolicitud:
      z.union([

        z.string(),

        SolicitudDetallePopulateSchema,

        z.null(),

      ]),

    idProducto:
      z.union([

        z.string(),

        ProductoDetalleSolicitudSchema,

        z.null(),

      ]),

    cantidadSolicitada:
      z.coerce
        .number(),

    cantidadAprobada:
      z.coerce
        .number()
        .default(0),

    cantidadAtendida:
      z.coerce
        .number()
        .default(0),

    unidad:
      z.string()
        .nullable()
        .optional(),

    estado:
      EstadoDetalleSolicitudSchema
        .default("pendiente"),

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
    ARRAY
========================= */

export const DetalleSolicitudArraySchema =
  z.array(
    DetalleSolicitudSchema
  );

/* =========================
    RESPONSE CREATE
========================= */

export const CreateDetalleSolicitudResponseSchema =
  z.object({

    message:
      z.string(),

    detalle:
      DetalleSolicitudSchema,

  }).passthrough();

/* =========================
    TYPES
========================= */

export type EstadoDetalleSolicitud =
  z.infer<
    typeof EstadoDetalleSolicitudSchema
  >;

export type DetalleSolicitudType =
  z.infer<
    typeof DetalleSolicitudSchema
  >;

/* =========================
    FORM
========================= */

export type DetalleSolicitudForm = {

  idSolicitud:
    string;

  idProducto:
    string;

  cantidadSolicitada:
    number;

  cantidadAprobada?:
    number;

  cantidadAtendida?:
    number;

  unidad?:
    string | null;

  estado?:
    EstadoDetalleSolicitud;

  observacion?:
    string | null;

  creadoPor?:
    string | null;

};

/* =========================
    UPDATE
========================= */

export type UpdateDetalleSolicitudType = {

  detalleSolicitudId:
    string;

  formData:
    Partial<
      DetalleSolicitudForm
    > & {

      actualizadoPor?:
        string | null;

    };

};

/* =========================
    DELETE
========================= */

export type DeleteDetalleSolicitudType = {

  id:
    string;

  eliminadoPor?:
    string;

};