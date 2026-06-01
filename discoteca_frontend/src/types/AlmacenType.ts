// src/types/AlmacenType.ts

import { z } from "zod";

/* =========================
    SUCURSAL RESUMEN
========================= */

export const SucursalResumenAlmacenSchema =
  z.object({

    _id:
      z.string(),

    nombreSucursal:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  }).nullable();

/* =========================
    ALMACEN POR SUCURSAL
========================= */

export const AlmacenPorSucursalSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombre:
      z.string(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    tipo:
      z.string(),

    ubicacion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean(),

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
    RESPUESTA ALMACENES POR SUCURSAL
========================= */

export const AlmacenesPorSucursalResponseSchema =
  z.object({

    sucursal:
      SucursalResumenAlmacenSchema,

    almacenes:
      z.array(
        AlmacenPorSucursalSchema
      ),

  });

/* =========================
    SUCURSAL POPULATE
========================= */

export const SucursalPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    nombreSucursal:
      z.string(),

  });

/* =========================
    ALMACEN SCHEMA
========================= */

export const AlmacenSchema =
  z.object({

    _id:
      z.string().optional(),

    /* =========================
        RELACION
    ========================= */

    idSucursal:
      z.union([

        z.string(),

        SucursalPopulateSchema,

        z.null(),

      ]),

    /* =========================
        DATOS
    ========================= */

    nombre:
      z.string(),

    descripcion:
      z.string().optional(),

    tipo:
      z.enum([

        "principal",

        "barra",

        "deposito",

        "auxiliar",

      ]),


    estado:
      z.boolean(),

    /* =========================
        AUDITORIA
    ========================= */

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    creadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaEliminado:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

  });

/* =========================
    ARRAY
========================= */

export const AlmacenArraySchema =
  z.array(
    AlmacenSchema
  );

/* =========================
    TYPES
========================= */

export type AlmacenType =
  z.infer<
    typeof AlmacenSchema
  >;

/* =========================
    FORM DATA
========================= */

export type AlmacenFormData =
  Pick<

    AlmacenType,

    | "idSucursal"
    | "nombre"
    | "descripcion"
    | "tipo"
    | "estado"
    | "creadoPor"
    | "actualizadoPor"

  >;