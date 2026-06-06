// src/types/SolicitudType.ts

import {
  z,
} from "zod";

/* =========================
    OBJECT ID SEGURO

    Acepta:
    - un string
    - un objeto que contiene _id
========================= */

export const ObjectIdSolicitudSchema =
  z.preprocess(
    (
      valor
    ) => {

      if (
        typeof valor ===
          "object" &&
        valor !== null &&
        "_id" in valor
      ) {

        return (
          valor as {
            _id:
              unknown;
          }
        )._id;

      }

      return valor;

    },
    z.string()
  );

/* =========================
    ESTADO SOLICITUD
========================= */

export const EstadoSolicitudSchema =
  z.enum([

    "pendiente",

    "aprobada",

    "parcialmente_atendida",

    "atendida",

    "rechazada",

    "anulada",

  ]);

/* =========================
    PERFIL POPULATE
========================= */

export const PerfilSolicitudSchema =
  z.object({

    _id:
      ObjectIdSolicitudSchema,

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

  }).passthrough();

/* =========================
    SUCURSAL POPULATE
========================= */

export const SucursalSolicitudSchema =
  z.object({

    _id:
      ObjectIdSolicitudSchema,

    nombreSucursal:
      z.string()
        .nullable()
        .optional(),

    nombre:
      z.string()
        .nullable()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    ALMACÉN POPULATE
========================= */

export const AlmacenSolicitudSchema =
  z.object({

    _id:
      ObjectIdSolicitudSchema,

    idSucursal:
      z.union([

        ObjectIdSolicitudSchema,

        SucursalSolicitudSchema,

        z.null(),

      ])
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
        .optional(),

  }).passthrough();

/* =========================
    PRODUCTO DETALLE
========================= */

export const ProductoSolicitudSchema =
  z.object({

    _id:
      ObjectIdSolicitudSchema,

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
        .optional(),

  }).passthrough();

/* =========================
    DETALLE DE SOLICITUD
========================= */

export const DetalleDentroSolicitudSchema =
  z.object({

    _id:
      ObjectIdSolicitudSchema
        .optional(),

    /*
      Algunos endpoints pueden devolver:

      idProducto: "ID"

      o:

      idProducto: {
        _id,
        nombre,
        ...
      }
    */
    idProducto:
      z.union([

        ObjectIdSolicitudSchema,

        ProductoSolicitudSchema,

        z.null(),

      ])
        .optional(),

    /*
      El método getSolicitudesBySucursal
      devuelve el producto con el nombre
      "producto".
    */
    producto:
      ProductoSolicitudSchema
        .nullable()
        .optional(),

    cantidadSolicitada:
      z.coerce
        .number()
        .default(0),

    cantidadAprobada:
      z.coerce
        .number()
        .default(0),

    cantidadAtendida:
      z.coerce
        .number()
        .default(0),

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

  }).passthrough();

/* =========================
    SOLICITUD GENERAL

    Utilizada para:
    - crear
    - obtener por ID
    - listar solicitudes
========================= */

export const SolicitudSchema =
  z.object({

    _id:
      ObjectIdSolicitudSchema
        .optional(),

    idPerfil:
      z.union([

        ObjectIdSolicitudSchema,

        PerfilSolicitudSchema,

        z.null(),

      ]),

    idSucursal:
      z.union([

        ObjectIdSolicitudSchema,

        SucursalSolicitudSchema,

        z.null(),

      ]),

    idAlmacenOrigen:
      z.union([

        ObjectIdSolicitudSchema,

        AlmacenSolicitudSchema,

        z.null(),

      ])
        .optional(),

    idAlmacenDestino:
      z.union([

        ObjectIdSolicitudSchema,

        AlmacenSolicitudSchema,

        z.null(),

      ]),

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

  }).passthrough();

/* =========================
    ARRAY DE SOLICITUDES
========================= */

export const SolicitudArraySchema =
  z.array(
    SolicitudSchema
  );

/* =========================
    RESPUESTA CREAR
========================= */

export const CreateSolicitudResponseSchema =
  z.object({

    message:
      z.string(),

    solicitud:
      SolicitudSchema,

  }).passthrough();

/* =========================
    SOLICITUD POR SUCURSAL
    CON SUS DETALLES

    Coincide con la respuesta de:
    GET /api/solicitud/sucursal/:idSucursal
========================= */

export const SolicitudPorSucursalSchema =
  z.object({

    _id:
      ObjectIdSolicitudSchema,

    perfil:
      PerfilSolicitudSchema
        .nullable(),

    almacenOrigen:
      AlmacenSolicitudSchema
        .nullable(),

    almacenDestino:
      AlmacenSolicitudSchema
        .nullable(),

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
        DetalleDentroSolicitudSchema
      )
        .default([]),

    totalProductos:
      z.coerce
        .number()
        .default(0),

    totalSolicitado:
      z.coerce
        .number()
        .default(0),

    totalAprobado:
      z.coerce
        .number()
        .default(0),

    /*
      Tu backend puede no devolver todavía
      totalAtendido. Por eso tiene valor
      predeterminado.
    */
    totalAtendido:
      z.coerce
        .number()
        .default(0),

  }).passthrough();

/* =========================
    ALIAS DEL SCHEMA

    Conservamos este nombre para no romper
    otras vistas que ya lo utilizan.
========================= */

export const SolicitudConDetallesSchema =
  SolicitudPorSucursalSchema;

/* =========================
    RESPUESTA POR SUCURSAL
========================= */

export const SolicitudesPorSucursalResponseSchema =
  z.object({

    sucursal:
      SucursalSolicitudSchema
        .nullable(),

    solicitudes:
      z.array(
        SolicitudPorSucursalSchema
      ),

  }).passthrough();

/* =========================
    TYPES DE CATÁLOGOS
========================= */

export type EstadoSolicitud =
  z.infer<
    typeof EstadoSolicitudSchema
  >;

export type PerfilSolicitudType =
  z.infer<
    typeof PerfilSolicitudSchema
  >;

export type SucursalSolicitudType =
  z.infer<
    typeof SucursalSolicitudSchema
  >;

export type AlmacenSolicitudType =
  z.infer<
    typeof AlmacenSolicitudSchema
  >;

export type ProductoSolicitudType =
  z.infer<
    typeof ProductoSolicitudSchema
  >;

export type DetalleDentroSolicitudType =
  z.infer<
    typeof DetalleDentroSolicitudSchema
  >;

/* =========================
    TYPES DE SOLICITUD
========================= */

export type SolicitudType =
  z.infer<
    typeof SolicitudSchema
  >;

/*
  Este es el tipo que te faltaba
  y que importa SolicitudDetailView.
*/
export type SolicitudPorSucursalType =
  z.infer<
    typeof SolicitudPorSucursalSchema
  >;

/*
  Alias para mantener compatibilidad con
  componentes o vistas anteriores.
*/
export type SolicitudConDetallesType =
  SolicitudPorSucursalType;

export type SolicitudesPorSucursalResponseType =
  z.infer<
    typeof SolicitudesPorSucursalResponseSchema
  >;

/* =========================
    FORM CREAR SOLICITUD
========================= */

export type SolicitudForm = {

  idPerfil:
    string;

  idSucursal:
    string;

  idAlmacenOrigen?:
    string | null;

  idAlmacenDestino:
    string;

  fechaSolicitud?:
    string;

  estado?:
    EstadoSolicitud;

  observacion?:
    string | null;

  creadoPor?:
    string | null;

};

/* =========================
    ALIAS FORM DATA
========================= */

export type SolicitudFormData =
  SolicitudForm;

/* =========================
    ACTUALIZAR SOLICITUD
========================= */

export type UpdateSolicitudForm = {

  idPerfil?:
    string;

  idSucursal?:
    string;

  idAlmacenOrigen?:
    string | null;

  idAlmacenDestino?:
    string;

  fechaSolicitud?:
    string;

  estado?:
    EstadoSolicitud;

  observacion?:
    string | null;

  actualizadoPor?:
    string | null;

};

export type UpdateSolicitudType = {

  solicitudId:
    string;

  formData:
    UpdateSolicitudForm;

};

/* =========================
    ELIMINAR SOLICITUD
========================= */

export type DeleteSolicitudType = {

  id:
    string;

  eliminadoPor?:
    string;

};