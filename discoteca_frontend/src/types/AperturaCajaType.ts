import { z } from "zod";

/* =========================
    PERFIL POPULATE
========================= */

export const PerfilPopulateSchema =
  z.object({

    _id:
      z.string(),


    idRol:
      z.string().optional(),

    idSucursal:
      z.string().optional(),

    nombres:
      z.string().optional(),

    apellidos:
      z.string().optional(),

    edad:
      z.number().optional(),

    sexo:
      z.string().optional(),

    ci:
      z.string().optional(),

    telefono:
      z.string().optional(),

    email:
      z.string().optional(),

    estado:
      z.boolean().optional(),

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
    CAJA POPULATE
========================= */

export const CajaPopulateSchema =
  z.object({

    _id:
      z.string(),

    idSucursal:
      z.string().optional(),

    nombre:
      z.string(),

    descripcion:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]),

    estado:
      z.boolean().optional(),

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
    APERTURA CAJA
========================= */

export const AperturaCajaSchema =
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

    idCaja:
      z.union([

        z.string(),

        CajaPopulateSchema,

        z.null(),

      ]),

    /* =========================
        DATOS
    ========================= */

    fecha:
      z.string({

        required_error:
          "Fecha obligatoria",

      }),

    horaApertura:
      z.string({

        required_error:
          "Hora obligatoria",

      }).regex(

        /^([0-1]\d|2[0-3]):([0-5]\d)$/,

        "Formato inválido HH:mm"

      ),

    montoInicial:
      z.number({

        required_error:
          "Monto inicial obligatorio",

      }).min(

        0,

        "El monto no puede ser negativo"

      ),

    observacion:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]),

    estado:
      z.boolean().optional(),

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

export const AperturaCajaArraySchema =
  z.array(
    AperturaCajaSchema
  );

/* =========================
    TYPES
========================= */

export type AperturaCajaType =
  z.infer<
    typeof AperturaCajaSchema
  >;

export type AperturaCajaForm =
  Pick<

    AperturaCajaType,

    | "idPerfil"
    | "idCaja"
    | "fecha"
    | "horaApertura"
    | "montoInicial"
    | "observacion"
    | "estado"
    | "creadoPor"
    | "actualizadoPor"

  >;
