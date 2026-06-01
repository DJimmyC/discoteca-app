import { z } from "zod";

/* =========================
    CATEGORIA PRODUCTO SCHEMA
========================= */

export const CategoriaProductoSchema =
  z.object({

    _id:
      z.string().optional(),

    nombre:
      z.string(),

    descripcion:
      z.string().optional(),

    estado:
      z.boolean(),

    fechaCreacion:
      z.string().optional(),

    creadoPor:
      z.string().optional(),

    fechaActualizacion:
      z.string().optional(),

    actualizadoPor:
      z.string().optional(),

    fechaEliminado:
      z.string().optional(),

    eliminadoPor:
      z.string().optional(),

  });

/* =========================
    ARRAY SCHEMA
========================= */

export const CategoriaProductoArraySchema =
  z.array(
    CategoriaProductoSchema
  );

/* =========================
    TYPES
========================= */

export type CategoriaProductoType =
  z.infer<
    typeof CategoriaProductoSchema
  >;

export type CategoriaProductoFormData =
  Pick<
    CategoriaProductoType,

    | "nombre"
    | "descripcion"
    | "estado"
    | "creadoPor"

  >;