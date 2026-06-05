// // src/types/AlmacenType.ts

// import { z } from "zod";

// /* =========================
//     SUCURSAL RESUMEN
// ========================= */

// export const SucursalResumenAlmacenSchema =
//   z.object({

//     _id:
//       z.string(),

//     nombreSucursal:
//       z.string()
//         .optional(),

//     ubicacionSucursal:
//       z.string()
//         .nullable()
//         .optional(),

//   }).nullable();

// /* =========================
//     ALMACEN POR SUCURSAL
// ========================= */

// export const AlmacenPorSucursalSchema =
//   z.object({

//     _id:
//       z.string()
//         .optional(),

//     nombre:
//       z.string(),

//     descripcion:
//       z.string()
//         .nullable()
//         .optional(),

//     tipo:
//       z.string(),

//     ubicacion:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       z.boolean(),

//     creadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//     actualizadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//     eliminadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaCreacion:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaActualizacion:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaEliminado:
//       z.string()
//         .nullable()
//         .optional(),

//   });

// /* =========================
//     RESPUESTA ALMACENES POR SUCURSAL
// ========================= */

// export const AlmacenesPorSucursalResponseSchema =
//   z.object({

//     sucursal:
//       SucursalResumenAlmacenSchema,

//     almacenes:
//       z.array(
//         AlmacenPorSucursalSchema
//       ),

//   });

// /* =========================
//     SUCURSAL POPULATE
// ========================= */

// export const SucursalPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombreSucursal:
//       z.string(),

//   });

// /* =========================
//     ALMACEN SCHEMA
// ========================= */

// export const AlmacenSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     /* =========================
//         RELACION
//     ========================= */

//     idSucursal:
//       z.union([

//         z.string(),

//         SucursalPopulateSchema,

//         z.null(),

//       ]),

//     /* =========================
//         DATOS
//     ========================= */

//     nombre:
//       z.string(),

//     descripcion:
//       z.string().optional(),

//     tipo:
//       z.enum([

//         "principal",

//         "barra",

//         "deposito",

//         "auxiliar",

//       ]),


//     estado:
//       z.boolean(),

//     /* =========================
//         AUDITORIA
//     ========================= */

//     fechaCreacion:
//       z.string()
//         .nullable()
//         .optional(),

//     creadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaActualizacion:
//       z.string()
//         .nullable()
//         .optional(),

//     actualizadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaEliminado:
//       z.string()
//         .nullable()
//         .optional(),

//     eliminadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//   });

// /* =========================
//     ARRAY
// ========================= */

// export const AlmacenArraySchema =
//   z.array(
//     AlmacenSchema
//   );

// /* =========================
//     TYPES
// ========================= */

// export type AlmacenType =
//   z.infer<
//     typeof AlmacenSchema
//   >;

// /* =========================
//     FORM DATA
// ========================= */

// export type AlmacenFormData =
//   Pick<

//     AlmacenType,

//     | "idSucursal"
//     | "nombre"
//     | "descripcion"
//     | "tipo"
//     | "estado"
//     | "creadoPor"
//     | "actualizadoPor"

//   >;
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
    SUCURSAL POPULATE
========================= */

export const SucursalPopulateSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombreSucursal:
      z.string()
        .optional(),

    nombre:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    ALMACEN BASE
    Sirve para listar, crear, editar
    y también para almacenes por sucursal
========================= */

export const AlmacenSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    /* =========================
        RELACION
    ========================= */

    idSucursal:
      z.union([

        z.string(),

        SucursalPopulateSchema,

        z.null(),

      ]).optional(),

    /* =========================
        DATOS
    ========================= */

    nombre:
      z.string(),

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

  }).passthrough();

/* =========================
    ALMACEN POR SUCURSAL
========================= */

export const AlmacenPorSucursalSchema =
  AlmacenSchema;

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

  }).passthrough();

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

export type AlmacenPorSucursalType =
  z.infer<
    typeof AlmacenPorSucursalSchema
  >;

export type AlmacenesPorSucursalResponse =
  z.infer<
    typeof AlmacenesPorSucursalResponseSchema
  >;

/* =========================
    FORM DATA
========================= */

export type AlmacenFormData = {

  idSucursal:
    string;

  nombre:
    string;

  descripcion?:
    string | null;

  tipo:
    string;

  ubicacion?:
    string | null;

  estado?:
    boolean;

  creadoPor?:
    string | null;

  actualizadoPor?:
    string | null;

};