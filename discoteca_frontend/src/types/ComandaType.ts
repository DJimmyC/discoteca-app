// src/types/ComandaType.ts

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
    PERFIL POPULATE
========================= */

export const PerfilPopulateSchema =
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

  }).passthrough();

/* =========================
    SUCURSAL POPULATE
========================= */

export const SucursalPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombreSucursal:
      z.string()
        .optional(),

    nombre:
      z.string()
        .optional(),

    direccion:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    ESTADO COMANDA
========================= */

export const EstadoComandaSchema =
  z.enum([

    "en_proceso",

    "impreso",

    "anulado",

    "cerrado",

  ]);

/* =========================
    COMANDA SCHEMA
========================= */

export const ComandaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idPerfil:
      z.union([

        ObjectIdStringSchema,

        PerfilPopulateSchema,

        z.null(),

      ]),

    idSucursal:
      z.union([

        ObjectIdStringSchema,

        SucursalPopulateSchema,

        z.null(),

      ]),

    /* =========================
        DATOS COMANDA
    ========================= */

    numeroComanda:
      z.string(),

    estado:
      EstadoComandaSchema,

    observacion:
      z.string()
        .nullable()
        .optional(),

    /* =========================
        FECHAS DE COMANDA
    ========================= */

    fechaApertura:
      z.string()
        .nullable()
        .optional(),

    fechaCierre:
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
    COMANDA LIST SCHEMA
========================= */

export const ComandaListSchema =
  ComandaSchema.pick({

    _id: true,

    idPerfil: true,

    idSucursal: true,

    numeroComanda: true,

    estado: true,

    observacion: true,

    fechaApertura: true,

    fechaCierre: true,

    fechaCreacion: true,

    creadoPor: true,

  });

/* =========================
    ARRAY SCHEMA
========================= */

export const ComandaArraySchema =
  z.array(
    ComandaListSchema
  );

/* =========================
    SAFE SCHEMA
========================= */

export const ComandaSafeSchema =
  ComandaSchema.omit({

    eliminadoPor: true,

    fechaEliminado: true,

  });

/* =========================
    TYPES
========================= */

export type ComandaType =
  z.infer<
    typeof ComandaSchema
  >;

export type ComandaListType =
  z.infer<
    typeof ComandaListSchema
  >;

export type EstadoComanda =
  z.infer<
    typeof EstadoComandaSchema
  >;

/* =========================
    FORM DATA
========================= */

export type ComandaForm =
  Pick<

    ComandaType,

    | "idPerfil"
    | "idSucursal"
    | "observacion"
    | "creadoPor"
    | "actualizadoPor"

  > & {

    estado?:
      EstadoComanda;

  };

/* =========================
    FORM DATA ALIAS
========================= */

export type ComandaFormData =
  ComandaForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateComandaType = {

  comandaId:
    string;

  formData:
    Partial<ComandaForm>;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteComandaType = {

  id:
    string;

  eliminadoPor?:
    string;

};
/* =========================
    PRODUCTO DETALLE POPULATE
========================= */

export const ProductoDetalleComandaSchema =
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
    DETALLE DENTRO DE COMANDA
========================= */

export const DetalleDentroComandaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    producto:
      z.union([

        ProductoDetalleComandaSchema,

        z.null(),

      ]),

    cantidad:
      z.number(),

    precioUnitario:
      z.number(),

    subtotal:
      z.number(),

    estado:
      z.string(),

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

  });

/* =========================
    COMANDA CON DETALLES
========================= */

export const ComandaConDetalleSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    numeroComanda:
      z.string()
        .nullable()
        .optional(),

    estado:
      EstadoComandaSchema,

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

    fechaApertura:
      z.string()
        .nullable()
        .optional(),

    fechaCierre:
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

    detalles:
      z.array(
        DetalleDentroComandaSchema
      ),

    total:
      z.number(),

  });

/* =========================
    PERFIL RESUMEN
========================= */

export const PerfilResumenComandaSchema =
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

  }).nullable();

/* =========================
    SUCURSAL RESUMEN
========================= */

export const SucursalResumenComandaSchema =
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
    RESPUESTA COMANDAS CON DETALLES
========================= */

export const ComandasConDetallesPorPerfilSchema =
  z.object({

    perfil:
      PerfilResumenComandaSchema,

    sucursal:
      SucursalResumenComandaSchema,

    comandas:
      z.array(
        ComandaConDetalleSchema
      ),

  }); 



  /* =========================
    TYPES
========================= */



export type ProductoDetalleComandaType =
  z.infer<
    typeof ProductoDetalleComandaSchema
  >;

export type DetalleDentroComandaType =
  z.infer<
    typeof DetalleDentroComandaSchema
  >;

export type ComandaConDetalleType =
  z.infer<
    typeof ComandaConDetalleSchema
  >;

export type ComandasConDetallesPorPerfilType =
  z.infer<
    typeof ComandasConDetallesPorPerfilSchema
  >;