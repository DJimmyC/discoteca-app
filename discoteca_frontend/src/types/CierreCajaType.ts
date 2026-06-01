// src/types/CierreCajaType.ts

import { z } from "zod";

/* =========================
    PERFIL POPULATE
========================= */

export const PerfilPopulateSchema =
  z.object({

    _id:
      z.string(),

    nombres:
      z.string().optional(),

    apellidos:
      z.string().optional(),

    email:
      z.string().optional(),

  });

/* =========================
    SUCURSAL POPULATE
========================= */

export const SucursalPopulateSchema =
  z.object({

    _id:
      z.string(),

    nombreSucursal:
      z.string(),

    ubicacionSucursal:
      z.string().optional(),

  });

/* =========================
    CAJA POPULATE
========================= */

export const CajaPopulateSchema =
  z.object({

    _id:
      z.string(),

    nombre:
      z.string(),

    descripcion:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]),

  });

/* =========================
    CIERRE CAJA
========================= */

export const CierreCajaSchema =
  z.object({

    _id:
      z.string().optional(),

    /* =========================
        RELACIONES
    ========================= */

    idPerfil:
      z.union([

        z.string(),

        PerfilPopulateSchema,

        z.null(),

      ]),

    idSucursal:
      z.union([

        z.string(),

        SucursalPopulateSchema,

        z.null(),

      ]),

    idCaja:
      z.union([

        z.string(),

        CajaPopulateSchema,

        z.null(),

      ]),

    /* =========================
        FECHAS
    ========================= */

    fechaApertura:
      z.string(),

    fechaCierre:
      z.string(),

    /* =========================
        MONTOS
    ========================= */

    montoInicial:
      z.number(),

    totalVentas:
      z.number(),

    totalEgresos:
      z.number(),

    totalEsperado:
      z.number(),

    montoReal:
      z.number(),

    diferencia:
      z.number(),

    /* =========================
        ESTADO
    ========================= */

    estado:
      z.enum([

        "cerrado",

        "cuadrado",

        "descuadre",

      ]),

    observacion:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]),

    /* =========================
        AUDITORIA
    ========================= */

    creadoPor:
      z.string().optional(),

    actualizadoPor:
      z.string().optional(),

    eliminadoPor:
      z.string().optional(),

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
    ARRAY
========================= */

export const CierreCajaArraySchema =
  z.array(
    CierreCajaSchema
  );

/* =========================
    TYPES
========================= */

export type CierreCajaType =
  z.infer<
    typeof CierreCajaSchema
  >;

/* =========================
    FORM
========================= */

export type CierreCajaForm =
  Pick<

    CierreCajaType,

    | "idPerfil"
    | "idSucursal"
    | "idCaja"
    | "fechaApertura"
    | "fechaCierre"
    | "montoInicial"
    | "totalVentas"
    | "totalEgresos"
    | "montoReal"
    | "observacion"
    | "creadoPor"
    | "actualizadoPor"

  >;

/* =========================
    DELETE
========================= */

export type DeleteCierreCajaType = {

  id: string;

  eliminadoPor: string;

};