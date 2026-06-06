// import { z } from "zod";

// /* =========================
//     ROL SCHEMA
// ========================= */

// export const RolSchema = z.object({

//   _id: z.string().optional(),

//   nombre: z.string(),

//   descripcion: z.string(),

//   estado: z.boolean(),

//   ventas: z.boolean(),

//   egresos: z.boolean(),

//   inventario: z.boolean(),

//   reportes: z.boolean(),

//   usuarios: z.boolean(),

//   configuracion: z.boolean(),

//   creadoPor: z.string(),

//   fechaCreacion:
//     z.string().optional(),

//   actualizadoPor:
//     z.string().optional(),

//   fechaActualizacion:
//     z.string().optional(),

//   eliminadoPor:
//     z.string().optional(),

//   fechaEliminado:
//     z.string().optional(),

// });

// /* =========================
//     ARRAY SCHEMA
// ========================= */

// export const RolArraySchema =
//   z.array(RolSchema);

// /* =========================
//     TYPES
// ========================= */

// export type RolType = z.infer<
//   typeof RolSchema
// >;

// export type RolFormData = Pick<
//   RolType,
//   | "nombre"
//   | "descripcion"
//   | "estado"
//   | "ventas"
//   | "egresos"
//   | "inventario"
//   | "reportes"
//   | "usuarios"
//   | "configuracion"
//   | "creadoPor"
// >;

// src/types/RolType.ts

import { z } from "zod";

/* =========================
    ROL SCHEMA
========================= */

export const RolSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombre:
      z.string()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

    ventas:
      z.boolean()
        .optional(),

    egresos:
      z.boolean()
        .optional(),

    inventario:
      z.boolean()
        .optional(),

    reportes:
      z.boolean()
        .optional(),

    usuarios:
      z.boolean()
        .optional(),

    configuracion:
      z.boolean()
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

export const RolArraySchema =
  z.array(
    RolSchema
  );

/* =========================
    TYPES DE RESPUESTA
========================= */

export type RolType =
  z.infer<
    typeof RolSchema
  >;

/* =========================
    FORM DATA

    Los campos son obligatorios
    dentro del formulario.
========================= */

export type RolFormData = {

  nombre:
    string;

  descripcion:
    string;

  estado:
    boolean;

  ventas:
    boolean;

  egresos:
    boolean;

  inventario:
    boolean;

  reportes:
    boolean;

  usuarios:
    boolean;

  configuracion:
    boolean;

  creadoPor:
    string;

};

/* =========================
    ACTUALIZAR ROL
========================= */

export type UpdateRolType = {

  rolId:
    string;

  formData:
    RolFormData;

};

/* =========================
    ELIMINAR ROL
========================= */

export type DeleteRolType = {

  id:
    string;

  eliminadoPor?:
    string;

};