import { z } from "zod";

/* =========================
    CATEGORIA SCHEMA
========================= */

export const CategoriaProductoPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    nombre:
      z.string(),

  });

/* =========================
    PRODUCTO SCHEMA
========================= */

export const ProductoSchema =
  z.object({

    _id:
      z.string().optional(),

    /* =========================
        RELACION
    ========================= */

    idCategoria:
      z.union([

        z.string(),

        CategoriaProductoPopulateSchema,

      ]),

    /* =========================
        DATOS
    ========================= */

    nombre:
      z.string(),

    descripcion:
      z.string().optional(),

    marca:
      z.string().optional(),

    estado:
      z.boolean(),

    /* =========================
        AUDITORIA
    ========================= */

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

export const ProductoArraySchema =
  z.array(
    ProductoSchema
  );

/* =========================
    TYPES
========================= */

export type ProductoType =
  z.infer<
    typeof ProductoSchema
  >;

export type ProductoFormData =
  Pick<
    ProductoType,

    | "idCategoria"
    | "nombre"
    | "descripcion"
    | "marca"
    | "estado"
    | "creadoPor"
    | "actualizadoPor"

  >;