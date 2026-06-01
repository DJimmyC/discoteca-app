// src/types/DetalleSolicitudType.ts

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
    PRODUCTO POPULATE
========================= */

export const ProductoDetalleSolicitudSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

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
        .nullable()
        .optional(),

  }).nullable();

/* =========================
    SOLICITUD POPULATE SIMPLE
========================= */

export const SolicitudPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    estado:
      z.string()
        .nullable()
        .optional(),

    observacion:
      z.string()
        .nullable()
        .optional(),

    fechaSolicitud:
      z.string()
        .nullable()
        .optional(),

  }).nullable();

/* =========================
    DETALLE SOLICITUD SCHEMA
========================= */

export const DetalleSolicitudSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    idSolicitud:
      z.union([

        ObjectIdStringSchema,

        SolicitudPopulateSchema,

        z.null(),

      ]),

    idProducto:
      z.union([

        ObjectIdStringSchema,

        ProductoDetalleSolicitudSchema,

        z.null(),

      ]),

    cantidadSolicitada:
      z.number(),

    cantidadAprobada:
      z.number()
        .nullable()
        .optional(),

    cantidadAtendida:
      z.number()
        .nullable()
        .optional(),

    unidad:
      z.string()
        .nullable()
        .optional(),

    observacion:
      z.string()
        .nullable()
        .optional(),

    estado:
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

  });

/* =========================
    LIST SCHEMA
========================= */

export const DetalleSolicitudListSchema =
  DetalleSolicitudSchema.pick({

    _id: true,

    idSolicitud: true,

    idProducto: true,

    cantidadSolicitada: true,

    cantidadAprobada: true,

    cantidadAtendida: true,

    unidad: true,

    observacion: true,

    estado: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY
========================= */

export const DetalleSolicitudArraySchema =
  z.array(
    DetalleSolicitudListSchema
  );

/* =========================
    RESPONSE CREATE
========================= */

export const CreateDetalleSolicitudResponseSchema =
  z.object({

    message:
      z.string()
        .optional(),

    detalle:
      DetalleSolicitudSchema
        .optional(),

  }).passthrough();

/* =========================
    TYPES
========================= */

export type DetalleSolicitudType =
  z.infer<
    typeof DetalleSolicitudSchema
  >;

export type DetalleSolicitudListType =
  z.infer<
    typeof DetalleSolicitudListSchema
  >;

/* =========================
    FORM DATA
========================= */

export type DetalleSolicitudForm =
  Pick<

    DetalleSolicitudType,

    | "cantidadSolicitada"
    | "observacion"
    | "creadoPor"

  > & {

    idSolicitud:
      string;

    idProducto:
      string;

    cantidadAprobada?:
      number | null;

    cantidadAtendida?:
      number | null;

    unidad?:
      string | null;

    estado?:
      string | null;

    actualizadoPor?:
      string | null;

  };

export type DetalleSolicitudFormData =
  DetalleSolicitudForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateDetalleSolicitudType = {

  detalleSolicitudId:
    string;

  formData:
    Partial<DetalleSolicitudForm>;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteDetalleSolicitudType = {

  id:
    string;

  eliminadoPor:
    string;

};