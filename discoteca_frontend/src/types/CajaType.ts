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

export const SucursalPopulateSchema =
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
    DESCRIPCION SCHEMA
========================= */

const DescripcionSchema =
  z.union([

    z.string(),

    z.literal(""),

    z.null(),

    z.undefined(),

  ]);

/* =========================
    CAJA SCHEMA
    Para obtener una caja individual
========================= */

export const CajaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    /* =========================
        RELACION
    ========================= */

    idSucursal:
      z.union([

        ObjectIdStringSchema,

        SucursalPopulateSchema,

        z.null(),

      ]),

    /* =========================
        DATOS
    ========================= */

    nombre:
      z.string()
        .min(
          1,
          "Nombre obligatorio"
        ),

    descripcion:
      DescripcionSchema,

    estado:
      z.boolean()
        .optional(),

    /* =========================
        AUDITORIA
    ========================= */

    creadoPor:
      z.string()
        .optional(),

    actualizadoPor:
      z.string()
        .optional(),

    eliminadoPor:
      z.string()
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
    CAJA LIST SCHEMA
    Para listar cajas desde la API
    Aquí _id es obligatorio
========================= */

export const CajaListSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string(),

    descripcion:
      DescripcionSchema,

    estado:
      z.boolean()
        .optional(),

    idSucursal:
      z.union([

        ObjectIdStringSchema,

        SucursalPopulateSchema,

        z.null(),

      ]),

  });

/* =========================
    ARRAY
========================= */

export const CajaArraySchema =
  z.array(
    CajaListSchema
  );

/* =========================
    TYPES
========================= */

export type CajaType =
  z.infer<
    typeof CajaSchema
  >;

export type CajaListType =
  z.infer<
    typeof CajaListSchema
  >;

/* =========================
    FORM DATA
========================= */

export type CajaForm =
  Pick<

    CajaType,

    | "idSucursal"
    | "nombre"
    | "descripcion"
    | "estado"
    | "creadoPor"
    | "actualizadoPor"

  >;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateCajaType = {

  formData:
    CajaForm;

  cajaId:
    string;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteCajaType = {

  id:
    string;

  eliminadoPor:
    string;

};