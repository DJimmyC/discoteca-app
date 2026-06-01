// // src/types/SolicitudType.ts

// import { z } from "zod";

// /* =========================
//     OBJECT ID SAFE
// ========================= */

// const ObjectIdStringSchema =
//   z.preprocess(
//     (val) => {

//       if (
//         typeof val === "object" &&
//         val !== null &&
//         "_id" in val
//       ) {
//         return (val as { _id: unknown })._id;
//       }

//       return val;

//     },
//     z.string()
//   );

// /* =========================
//     PERFIL POPULATE
// ========================= */

// export const PerfilSolicitudSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     nombres:
//       z.string()
//         .nullable()
//         .optional(),

//     apellidos:
//       z.string()
//         .nullable()
//         .optional(),

//     email:
//       z.string()
//         .nullable()
//         .optional(),

//     telefono:
//       z.string()
//         .nullable()
//         .optional(),

//     ci:
//       z.string()
//         .nullable()
//         .optional(),

//   }).nullable();

// /* =========================
//     SUCURSAL POPULATE
// ========================= */

// export const SucursalSolicitudSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombreSucursal:
//       z.string()
//         .nullable()
//         .optional(),

//     ubicacionSucursal:
//       z.string()
//         .nullable()
//         .optional(),

//   }).nullable();

// /* =========================
//     ALMACEN POPULATE
// ========================= */

// export const AlmacenSolicitudSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     nombre:
//       z.string()
//         .nullable()
//         .optional(),

//     tipo:
//       z.string()
//         .nullable()
//         .optional(),

//     descripcion:
//       z.string()
//         .nullable()
//         .optional(),

//     ubicacion:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       z.boolean()
//         .nullable()
//         .optional(),

//   }).nullable();

// /* =========================
//     ESTADO SOLICITUD
// ========================= */

// export const EstadoSolicitudSchema =
//   z.enum([

//     "pendiente",

//     "en_revision",

//     "aprobada",

//     "rechazada",

//     "en_proceso",

//     "en_transito",

//     "completada",

//     "anulada",

//   ]);

// /* =========================
//     SOLICITUD BASE
// ========================= */

// export const SolicitudSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     idPerfil:
//       z.union([
//         ObjectIdStringSchema,
//         PerfilSolicitudSchema,
//         z.null(),
//       ]),

//     idSucursal:
//       z.union([
//         ObjectIdStringSchema,
//         SucursalSolicitudSchema,
//         z.null(),
//       ]),

//     idAlmacenOrigen:
//       z.union([
//         ObjectIdStringSchema,
//         AlmacenSolicitudSchema,
//         z.null(),
//       ]).optional(),

//     idAlmacenDestino:
//       z.union([
//         ObjectIdStringSchema,
//         AlmacenSolicitudSchema,
//         z.null(),
//       ]).optional(),

//     fechaSolicitud:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       EstadoSolicitudSchema,

//     observacion:
//       z.string()
//         .nullable()
//         .optional(),

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
//     SOLICITUD LIST
// ========================= */

// export const SolicitudListSchema =
//   SolicitudSchema.pick({

//     _id: true,

//     idPerfil: true,

//     idSucursal: true,

//     idAlmacenOrigen: true,

//     idAlmacenDestino: true,

//     fechaSolicitud: true,

//     estado: true,

//     observacion: true,

//     creadoPor: true,

//     fechaCreacion: true,

//   });

// /* =========================
//     ARRAY NORMAL
// ========================= */

// export const SolicitudArraySchema =
//   z.array(
//     SolicitudListSchema
//   );

// /* =========================
//     SOLICITUD LIMPIA POR SUCURSAL
//     Respuesta del nuevo servicio:
//     {
//       sucursal,
//       solicitudes: []
//     }
// ========================= */

// export const SolicitudPorSucursalSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     perfil:
//       PerfilSolicitudSchema
//         .optional(),

//     almacenOrigen:
//       AlmacenSolicitudSchema
//         .optional(),

//     almacenDestino:
//       AlmacenSolicitudSchema
//         .optional(),

//     fechaSolicitud:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       EstadoSolicitudSchema,

//     observacion:
//       z.string()
//         .nullable()
//         .optional(),

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

// export const SolicitudesPorSucursalResponseSchema =
//   z.object({

//     sucursal:
//       SucursalSolicitudSchema,

//     solicitudes:
//       z.array(
//         SolicitudPorSucursalSchema
//       ),

//   });

// /* =========================
//     RESPONSE CREATE
// ========================= */

// export const CreateSolicitudResponseSchema =
//   z.object({

//     message:
//       z.string()
//         .optional(),

//     solicitud:
//       SolicitudSchema
//         .optional(),

//   }).passthrough();

// /* =========================
//     TYPES
// ========================= */

// export type SolicitudType =
//   z.infer<
//     typeof SolicitudSchema
//   >;

// export type SolicitudListType =
//   z.infer<
//     typeof SolicitudListSchema
//   >;

// export type SolicitudPorSucursalType =
//   z.infer<
//     typeof SolicitudPorSucursalSchema
//   >;

// export type SolicitudesPorSucursalResponseType =
//   z.infer<
//     typeof SolicitudesPorSucursalResponseSchema
//   >;

// export type EstadoSolicitud =
//   z.infer<
//     typeof EstadoSolicitudSchema
//   >;

// /* =========================
//     FORM DATA
// ========================= */

// export type SolicitudForm =
//   Pick<

//     SolicitudType,

//     | "idPerfil"
//     | "idSucursal"
//     | "estado"
//     | "observacion"
//     | "creadoPor"

//   > & {

//     idAlmacenOrigen?:
//       string | null;

//     idAlmacenDestino?:
//       string | null;

//     fechaSolicitud?:
//       string | null;

//     actualizadoPor?:
//       string | null;

//   };

// export type SolicitudFormData =
//   SolicitudForm;

// /* =========================
//     UPDATE TYPE
// ========================= */

// export type UpdateSolicitudType = {

//   solicitudId:
//     string;

//   formData:
//     Partial<SolicitudForm>;

// };

// /* =========================
//     DELETE TYPE
// ========================= */

// export type DeleteSolicitudType = {

//   id:
//     string;

//   eliminadoPor:
//     string;

// };
// src/types/SolicitudType.ts

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

      if (
        typeof val === "object" &&
        val !== null &&
        "toString" in val
      ) {
        return String(val);
      }

      return val;

    },
    z.string()
  );

/* =========================
    PERFIL POPULATE
========================= */

export const PerfilSolicitudSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    nombres:
      z.string()
        .nullable()
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
    SUCURSAL POPULATE
========================= */

export const SucursalSolicitudSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    nombreSucursal:
      z.string()
        .nullable()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  }).nullable();

/* =========================
    ALMACEN POPULATE
========================= */

export const AlmacenSolicitudSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    nombre:
      z.string()
        .nullable()
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
        .nullable()
        .optional(),

  }).nullable();

/* =========================
    PRODUCTO DETALLE
========================= */

export const ProductoDetalleSolicitudInternoSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    nombre:
      z.string()
        .nullable()
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
        .nullable()
        .optional(),

  }).nullable();

/* =========================
    DETALLE INTERNO
========================= */

export const DetalleSolicitudInternoSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    producto:
      ProductoDetalleSolicitudInternoSchema,

    cantidadSolicitada:
      z.number(),

    cantidadAprobada:
      z.number()
        .nullable()
        .optional(),

    cantidadAtendida:
      z.number()
        .nullable()
        .optional(),

    unidad:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.string()
        .nullable()
        .optional(),

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
    ESTADO SOLICITUD
========================= */

export const EstadoSolicitudSchema =
  z.enum([

    "pendiente",

    "en_revision",

    "aprobada",

    "rechazada",

    "en_proceso",

    "en_transito",

    "completada",

    "anulada",

  ]).or(z.string());

/* =========================
    SOLICITUD NORMAL
========================= */

export const SolicitudSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    idPerfil:
      z.union([

        ObjectIdStringSchema,

        PerfilSolicitudSchema,

        z.null(),

      ]),

    idSucursal:
      z.union([

        ObjectIdStringSchema,

        SucursalSolicitudSchema,

        z.null(),

      ]),

    idAlmacenOrigen:
      z.union([

        ObjectIdStringSchema,

        AlmacenSolicitudSchema,

        z.null(),

      ]).optional(),

    idAlmacenDestino:
      z.union([

        ObjectIdStringSchema,

        AlmacenSolicitudSchema,

        z.null(),

      ]).optional(),

    fechaSolicitud:
      z.string()
        .nullable()
        .optional(),

    estado:
      EstadoSolicitudSchema,

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
    SOLICITUD LISTA NORMAL
========================= */

export const SolicitudListSchema =
  SolicitudSchema.pick({

    _id: true,

    idPerfil: true,

    idSucursal: true,

    idAlmacenOrigen: true,

    idAlmacenDestino: true,

    fechaSolicitud: true,

    estado: true,

    observacion: true,

    creadoPor: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY NORMAL
========================= */

export const SolicitudArraySchema =
  z.array(
    SolicitudListSchema
  );

/* =========================
    SOLICITUD POR SUCURSAL
    Respuesta limpia del backend:
    {
      sucursal,
      solicitudes: [
        {
          perfil,
          almacenOrigen,
          almacenDestino,
          detalles,
          totalProductos,
          totalSolicitado,
          totalAprobado
        }
      ]
    }
========================= */

export const SolicitudPorSucursalSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    perfil:
      PerfilSolicitudSchema
        .optional(),

    almacenOrigen:
      AlmacenSolicitudSchema
        .optional(),

    almacenDestino:
      AlmacenSolicitudSchema
        .optional(),

    fechaSolicitud:
      z.string()
        .nullable()
        .optional(),

    estado:
      EstadoSolicitudSchema,

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
        DetalleSolicitudInternoSchema
      )
        .optional()
        .default([]),

    totalProductos:
      z.number()
        .optional(),

    totalSolicitado:
      z.number()
        .optional(),

    totalAprobado:
      z.number()
        .optional(),

  });

/* =========================
    RESPUESTA POR SUCURSAL
========================= */

export const SolicitudesPorSucursalResponseSchema =
  z.object({

    sucursal:
      SucursalSolicitudSchema,

    solicitudes:
      z.array(
        SolicitudPorSucursalSchema
      ),

  });

/* =========================
    RESPONSE CREATE
========================= */

export const CreateSolicitudResponseSchema =
  z.object({

    message:
      z.string()
        .optional(),

    solicitud:
      SolicitudSchema
        .optional(),

  }).passthrough();

/* =========================
    TYPES
========================= */

export type SolicitudType =
  z.infer<
    typeof SolicitudSchema
  >;

export type SolicitudListType =
  z.infer<
    typeof SolicitudListSchema
  >;

export type SolicitudPorSucursalType =
  z.infer<
    typeof SolicitudPorSucursalSchema
  >;

export type SolicitudesPorSucursalResponseType =
  z.infer<
    typeof SolicitudesPorSucursalResponseSchema
  >;

export type DetalleSolicitudInternoType =
  z.infer<
    typeof DetalleSolicitudInternoSchema
  >;

export type EstadoSolicitud =
  z.infer<
    typeof EstadoSolicitudSchema
  >;

/* =========================
    FORM DATA
========================= */

export type SolicitudForm =
  Pick<

    SolicitudType,

    | "idPerfil"
    | "idSucursal"
    | "estado"
    | "observacion"
    | "creadoPor"

  > & {

    idAlmacenOrigen?:
      string | null;

    idAlmacenDestino?:
      string | null;

    fechaSolicitud?:
      string | null;

    actualizadoPor?:
      string | null;

  };

export type SolicitudFormData =
  SolicitudForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateSolicitudType = {

  solicitudId:
    string;

  formData:
    Partial<SolicitudForm>;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteSolicitudType = {

  id:
    string;

  eliminadoPor:
    string;

};