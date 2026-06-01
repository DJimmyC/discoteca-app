// src/types/EgresoType.ts

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
    SUCURSAL POPULATE
========================= */

export const SucursalEgresoPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombreSucursal:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    CAJA POPULATE
========================= */

export const CajaEgresoPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string()
        .nullable()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    PERFIL POPULATE
========================= */

export const PerfilEgresoPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombres:
      z.string()
        .optional(),

    apellidos:
      z.string()
        .nullable()
        .optional(),

    email:
      z.string()
        .nullable()
        .optional(),

    telefono:
      z.string()
        .nullable()
        .optional(),

    ci:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    PRODUCTO DETALLE EGRESO
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
    ALMACEN DETALLE EGRESO
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
    METODO PAGO EGRESO
========================= */

export const MetodoPagoEgresoSchema =
  z.enum([

    "efectivo",

    "qr",

    "tarjeta",

    "transferencia",

    "mixto",

  ]).or(z.string());

/* =========================
    ESTADO EGRESO
========================= */

export const EstadoEgresoSchema =
  z.enum([

    "registrado",
    "activo",

    "anulado",

    "cerrado",

    "pendiente",

    "registrado",

  ]).or(z.string());

/* =========================
    EGRESO SCHEMA NORMAL
========================= */

export const EgresoSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idCaja:
      z.union([

        ObjectIdStringSchema,

        CajaEgresoPopulateSchema,

        z.null(),

      ]),

    idPerfil:
      z.union([

        ObjectIdStringSchema,

        PerfilEgresoPopulateSchema,

        z.null(),

      ]),

    idSucursal:
      z.union([

        ObjectIdStringSchema,

        SucursalEgresoPopulateSchema,

        z.null(),

      ]),

    /* =========================
        DATOS EGRESO
    ========================= */

    numeroEgreso:
      z.string()
        .nullable()
        .optional(),

    fechaEgreso:
      z.string()
        .nullable()
        .optional(),

    tipoEgreso:
      z.string()
        .nullable()
        .optional(),

    metodoPago:
      MetodoPagoEgresoSchema
        .nullable()
        .optional(),

    total:
      z.number(),

    estado:
      EstadoEgresoSchema,

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
    LIST SCHEMA NORMAL
========================= */

export const EgresoListSchema =
  EgresoSchema.pick({

    _id: true,

    idCaja: true,

    idPerfil: true,

    idSucursal: true,

    numeroEgreso: true,

    fechaEgreso: true,

    tipoEgreso: true,

    metodoPago: true,

    total: true,

    estado: true,

    observacion: true,

    creadoPor: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY NORMAL
========================= */

export const EgresoArraySchema =
  z.array(
    EgresoListSchema
  );

/* =========================
    DETALLE DENTRO DE EGRESO
========================= */

export const DetalleDentroEgresoSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    producto:
      z.union([

        ProductoDetalleEgresoSchema,

        z.null(),

      ]),

    almacen:
      z.union([

        AlmacenDetalleEgresoSchema,

        z.null(),

      ]),

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
      z.string()
        .nullable()
        .optional(),

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
    EGRESO CON DETALLES
========================= */

export const EgresoConDetalleSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    numeroEgreso:
      z.string()
        .nullable()
        .optional(),

    caja:
      z.union([

        CajaEgresoPopulateSchema,

        z.null(),

      ]),

    perfil:
      z.union([

        PerfilEgresoPopulateSchema,

        z.null(),

      ]),

    fechaEgreso:
      z.string()
        .nullable()
        .optional(),

    tipoEgreso:
      z.string()
        .nullable()
        .optional(),

    metodoPago:
      MetodoPagoEgresoSchema
        .nullable()
        .optional(),

    total:
      z.number(),

    totalDetalles:
      z.number()
        .optional(),

    estado:
      EstadoEgresoSchema,

    observacion:
      z.string()
        .nullable()
        .optional(),

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

    detalles:
      z.array(
        DetalleDentroEgresoSchema
      ),

  });

/* =========================
    SUCURSAL RESUMEN
========================= */

export const SucursalResumenEgresoSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombreSucursal:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  }).nullable();

/* =========================
    RESPUESTA EGRESOS CON DETALLES
========================= */

export const EgresosConDetallesPorSucursalSchema =
  z.object({

    sucursal:
      SucursalResumenEgresoSchema,

    egresos:
      z.array(
        EgresoConDetalleSchema
      ),

  });

/* =========================
    SAFE SCHEMA
========================= */

export const EgresoSafeSchema =
  EgresoSchema.omit({

    eliminadoPor: true,

    fechaEliminado: true,

  });

/* =========================
    TYPES
========================= */

export type EgresoType =
  z.infer<
    typeof EgresoSchema
  >;

export type EgresoListType =
  z.infer<
    typeof EgresoListSchema
  >;

export type MetodoPagoEgreso =
  z.infer<
    typeof MetodoPagoEgresoSchema
  >;

export type EstadoEgreso =
  z.infer<
    typeof EstadoEgresoSchema
  >;

export type DetalleDentroEgresoType =
  z.infer<
    typeof DetalleDentroEgresoSchema
  >;

export type EgresoConDetalleType =
  z.infer<
    typeof EgresoConDetalleSchema
  >;

export type EgresosConDetallesPorSucursalType =
  z.infer<
    typeof EgresosConDetallesPorSucursalSchema
  >;

/* =========================
    FORM DATA
========================= */

export type EgresoForm =
  Pick<

    EgresoType,

    | "idCaja"
    | "idPerfil"
    | "idSucursal"
    | "tipoEgreso"
    | "metodoPago"
    | "total"
    | "observacion"
    | "creadoPor"
    | "actualizadoPor"

  > & {

    numeroEgreso?:
      string;

    fechaEgreso?:
      string;

    estado?:
      string;

  };

/* =========================
    FORM DATA ALIAS
========================= */

export type EgresoFormData =
  EgresoForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateEgresoType = {

  egresoId:
    string;

  formData:
    Partial<EgresoForm>;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteEgresoType = {

  id:
    string;

  eliminadoPor?:
    string;

};