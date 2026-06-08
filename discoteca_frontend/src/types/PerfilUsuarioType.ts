// import { z } from "zod";

// /* =========================
//     USUARIO POPULATE
// ========================= */
// export const UsuarioPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     username:
//       z.string().optional(),

//   }).passthrough();

// /* =========================
//     ROL POPULATE
// ========================= */
// export const RolPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombre:
//       z.string().optional(),

//     nombreRol:
//       z.string().optional(),

//     descripcion:
//       z.string().optional(),

//     estado:
//       z.boolean().optional(),

//   }).passthrough();

// /* =========================
//     SUCURSAL POPULATE
// ========================= */
// export const SucursalPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombreSucursal:
//       z.string().optional(),

//     nombre:
//       z.string().optional(),

//     ubicacionSucursal:
//       z.string().optional(),

//     estado:
//       z.boolean().optional(),

//   }).passthrough();

// /* =========================
//     ALMACEN POPULATE
// ========================= */
// export const AlmacenPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombre:
//       z.string().optional(),

//     tipo:
//       z.string().optional(),

//     descripcion:
//       z.string().optional(),

//     ubicacionSucursal:
//       z.string().optional(),

//     estado:
//       z.boolean().optional(),

//   }).passthrough();

// /* =========================
//     ID ROL FLEXIBLE
// ========================= */
// export const IdRolSchema =
//   z.union([

//     z.string(),

//     RolPopulateSchema,

//     z.null(),

//   ]).optional();

// /* =========================
//     ID SUCURSAL FLEXIBLE
// ========================= */
// export const IdSucursalSchema =
//   z.union([

//     z.string(),

//     SucursalPopulateSchema,

//     z.null(),

//   ]).optional();

// /* =========================
//     ID ALMACEN FLEXIBLE
// ========================= */
// export const IdAlmacenSchema =
//   z.union([

//     z.string(),

//     AlmacenPopulateSchema,

//     z.null(),

//   ]).optional();

// /* =========================
//     PERFIL USUARIO SCHEMA
// ========================= */
// export const PerfilUsuarioSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     tokenjwt:
//       z.string().optional(),

//     /* =========================
//         RELACIONES
//     ========================= */
//     idRol:
//       IdRolSchema,

//     idSucursal:
//       IdSucursalSchema,

//     idAlmacen:
//       IdAlmacenSchema,

//     /* =========================
//         DATOS PERSONALES
//     ========================= */
//     nombres:
//       z.string().min(
//         1,
//         "Nombre obligatorio"
//       ),

//     apellidos:
//       z.string().min(
//         1,
//         "Apellido obligatorio"
//       ),

//     edad:
//       z.coerce.number().optional(),

//     sexo:
//       z.string().nullable().optional(),

//     ci:
//       z.string().nullable().optional(),

//     telefono:
//       z.string().nullable().optional(),

//     email:
//       z.union([

//         z.string(),

//         z.literal(""),

//         z.null(),

//         z.undefined(),

//       ]).optional(),

//     password:
//       z.string().optional(),

//     estado:
//       z.boolean().optional(),

//     /* =========================
//         AUDITORIA
//     ========================= */
//     creadoPor:
//       z.string().nullable().optional(),

//     actualizadoPor:
//       z.string().nullable().optional(),

//     eliminadoPor:
//       z.string().nullable().optional(),

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

//   }).passthrough();

// /* =========================
//     SCHEMA PARA LISTADO
// ========================= */
// export const PerfilUsuarioListSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombres:
//       z.string(),

//     apellidos:
//       z.string(),

//     email:
//       z.union([

//         z.string(),

//         z.literal(""),

//         z.null(),

//         z.undefined(),

//       ]).optional(),

//     estado:
//       z.boolean().optional(),

//     fechaCreacion:
//       z.string()
//         .nullable()
//         .optional(),

//     /* =========================
//         RELACIONES
//     ========================= */
//     idRol:
//       IdRolSchema,

//     idSucursal:
//       IdSucursalSchema,

//     idAlmacen:
//       IdAlmacenSchema,

//   }).passthrough();

// /* =========================
//     ARRAY PARA LISTADO
// ========================= */
// export const PerfilUsuarioArraySchema =
//   z.array(
//     PerfilUsuarioListSchema
//   );

// /* =========================
//     VERSION SEGURA
// ========================= */
// export const PerfilUsuarioSafeSchema =
//   PerfilUsuarioSchema.omit({

//     password: true,

//   });

// /* =========================
//     TYPES
// ========================= */
// export type PerfilUsuarioType =
//   z.infer<
//     typeof PerfilUsuarioSchema
//   >;

// /* =========================
//     FORMULARIO CREAR / EDITAR
// ========================= */
// export type PerfilUsuarioForm = {

//   idRol:
//     string;

//   idSucursal:
//     string;

//   idAlmacen:
//     string;

//   nombres:
//     string;

//   apellidos:
//     string;

//   edad?:
//     number;

//   sexo?:
//     string | null;

//   ci?:
//     string | null;

//   telefono?:
//     string | null;

//   email?:
//     string | null;

//   password?:
//     string;

//   estado?:
//     boolean;

//   creadoPor?:
//     string;

//   actualizadoPor?:
//     string;

// };

// /* =========================
//     LOGIN
// ========================= */
// export const LoginSchema =
//   z.object({

//     email:
//       z.string(),

//     password:
//       z.string()
//         .min(
//           1,
//           "Password requerido"
//         ),

//   });

// export type LoginForm =
//   z.infer<
//     typeof LoginSchema
//   >;

// /* =========================
//     RESPONSE LOGIN
// ========================= */
// export const LoginResponseSchema =
//   z.object({

//     message:
//       z.string(),

//     tokenjwt:
//       z.string(),

//     usuario:
//       PerfilUsuarioSchema,

//   });

// export type LoginResponse =
//   z.infer<
//     typeof LoginResponseSchema
//   >;

// /* =========================
//     AUTH
// ========================= */
// export type Auth =
//   z.infer<
//     typeof PerfilUsuarioSchema
//   >;

// export type UsuarioLoginForm =
//   Pick<
//     LoginForm,
//     "email" | "password"
//   >;

// /* =========================
//     OBJECT ID STRING
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
//     AUTH SUCURSAL
// ========================= */
// const SucursalAuthSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombreSucursal:
//       z.string()
//         .optional(),

//     nombre:
//       z.string()
//         .optional(),

//     ubicacionSucursal:
//       z.string()
//         .optional(),

//     estado:
//       z.boolean()
//         .optional(),

//   }).passthrough();

// /* =========================
//     AUTH ROL
// ========================= */
// const RolAuthSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombre:
//       z.string()
//         .optional(),

//     nombreRol:
//       z.string()
//         .optional(),

//     descripcion:
//       z.string()
//         .optional(),

//     estado:
//       z.boolean()
//         .optional(),

//   }).passthrough();

// /* =========================
//     AUTH ALMACEN
// ========================= */
// const AlmacenAuthSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombre:
//       z.string()
//         .optional(),

//     tipo:
//       z.string()
//         .optional(),

//     descripcion:
//       z.string()
//         .optional(),

//     ubicacionSucursal:
//       z.string()
//         .optional(),

//     estado:
//       z.boolean()
//         .optional(),

//   }).passthrough();

// /* =========================
//     USUARIO AUTH
// ========================= */
// export const UsuarioSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombres:
//       z.string()
//         .optional(),

//     apellidos:
//       z.string()
//         .nullable()
//         .optional(),

//     email:
//       z.string()
//         .nullable()
//         .optional(),

//     idSucursal:
//       z.union([

//         SucursalAuthSchema,

//         ObjectIdStringSchema,

//         z.null(),

//       ]).optional(),

//     idRol:
//       z.union([

//         RolAuthSchema,

//         ObjectIdStringSchema,

//         z.null(),

//       ]).optional(),

//     idAlmacen:
//       z.union([

//         AlmacenAuthSchema,

//         ObjectIdStringSchema,

//         z.null(),

//       ]).optional(),

//     edad:
//       z.coerce.number()
//         .nullable()
//         .optional(),

//     sexo:
//       z.string()
//         .nullable()
//         .optional(),

//     ci:
//       z.string()
//         .nullable()
//         .optional(),

//     telefono:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       z.boolean()
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

//   }).passthrough();

import { z } from "zod";

/* =========================================
    OBJECT ID STRING
========================================= */

export const ObjectIdStringSchema =
  z.preprocess(
    (value) => {

      if (
        typeof value === "object" &&
        value !== null &&
        "_id" in value
      ) {
        return (
          value as {
            _id: unknown;
          }
        )._id;
      }

      return value;

    },
    z.string()
  );

/* =========================================
    USUARIO POPULATE
========================================= */

export const UsuarioPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    username:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================================
    ROL POPULATE
========================================= */

export const RolPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    nombre:
      z.string()
        .nullable()
        .optional(),

    nombreRol:
      z.string()
        .nullable()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    SUCURSAL POPULATE
========================================= */

export const SucursalPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

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

    direccion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    ALMACÉN POPULATE
========================================= */

export const AlmacenPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    nombre:
      z.string()
        .nullable()
        .optional(),

    nombreAlmacen:
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

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    ID ROL FLEXIBLE
========================================= */

export const IdRolSchema =
  z.union([

    z.string(),

    RolPopulateSchema,

    z.null(),

  ]).optional();

/* =========================================
    ID SUCURSAL FLEXIBLE
========================================= */

export const IdSucursalSchema =
  z.union([

    z.string(),

    SucursalPopulateSchema,

    z.null(),

  ]).optional();

/* =========================================
    ID ALMACÉN FLEXIBLE
========================================= */

export const IdAlmacenSchema =
  z.union([

    z.string(),

    AlmacenPopulateSchema,

    z.null(),

  ]).optional();

/* =========================================
    PERFIL USUARIO
========================================= */

export const PerfilUsuarioSchema =
  z.object({

    _id:
      z.string().optional(),

    tokenjwt:
      z.string().optional(),

    /* =====================================
        RELACIONES
    ===================================== */

    idRol:
      IdRolSchema,

    idSucursal:
      IdSucursalSchema,

    idAlmacen:
      IdAlmacenSchema,

    /* =====================================
        DATOS PERSONALES
    ===================================== */

    nombres:
      z.string()
        .min(
          1,
          "Nombre obligatorio"
        ),

    apellidos:
      z.string()
        .min(
          1,
          "Apellido obligatorio"
        ),

    edad:
      z.coerce.number()
        .nullable()
        .optional(),

    sexo:
      z.string()
        .nullable()
        .optional(),

    ci:
      z.string()
        .nullable()
        .optional(),

    telefono:
      z.string()
        .nullable()
        .optional(),

    email:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]).optional(),

    password:
      z.string()
        .optional(),

    estado:
      z.boolean()
        .optional(),

    /* =====================================
        AUDITORÍA
    ===================================== */

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

    createdAt:
      z.string()
        .nullable()
        .optional(),

    updatedAt:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================================
    PERFIL USUARIO PARA LISTADO
========================================= */

export const PerfilUsuarioListSchema =
  z.object({

    _id:
      z.string(),

    nombres:
      z.string(),

    apellidos:
      z.string(),

    edad:
      z.coerce.number()
        .nullable()
        .optional(),

    sexo:
      z.string()
        .nullable()
        .optional(),

    ci:
      z.string()
        .nullable()
        .optional(),

    telefono:
      z.string()
        .nullable()
        .optional(),

    email:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]).optional(),

    estado:
      z.boolean()
        .optional(),

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    /* =====================================
        RELACIONES
    ===================================== */

    idRol:
      IdRolSchema,

    idSucursal:
      IdSucursalSchema,

    idAlmacen:
      IdAlmacenSchema,

  }).passthrough();

/* =========================================
    ARRAY DE PERFILES
========================================= */

export const PerfilUsuarioArraySchema =
  z.array(
    PerfilUsuarioListSchema
  );

/* =========================================
    PERFIL SEGURO SIN PASSWORD
========================================= */

export const PerfilUsuarioSafeSchema =
  PerfilUsuarioSchema.omit({

    password: true,

  });

/* =========================================
    LOGIN
========================================= */

export const LoginSchema =
  z.object({

    email:
      z.string()
        .min(
          1,
          "El correo es obligatorio"
        ),

    password:
      z.string()
        .min(
          1,
          "La contraseña es obligatoria"
        ),

  });

/* =========================================
    RESPUESTA LOGIN
========================================= */

export const LoginResponseSchema =
  z.object({

    message:
      z.string(),

    tokenjwt:
      z.string(),

    usuario:
      PerfilUsuarioSchema,

  }).passthrough();

/* =========================================
    AUTH SUCURSAL
========================================= */

export const SucursalAuthSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

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

    direccion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    AUTH ROL
========================================= */

export const RolAuthSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string()
        .nullable()
        .optional(),

    nombreRol:
      z.string()
        .nullable()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    AUTH ALMACÉN
========================================= */

export const AlmacenAuthSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string()
        .nullable()
        .optional(),

    nombreAlmacen:
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

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    USUARIO AUTENTICADO
========================================= */

export const UsuarioSchema =
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

    idSucursal:
      z.union([

        SucursalAuthSchema,

        ObjectIdStringSchema,

        z.null(),

      ]).optional(),

    idRol:
      z.union([

        RolAuthSchema,

        ObjectIdStringSchema,

        z.null(),

      ]).optional(),

    idAlmacen:
      z.union([

        AlmacenAuthSchema,

        ObjectIdStringSchema,

        z.null(),

      ]).optional(),

    edad:
      z.coerce.number()
        .nullable()
        .optional(),

    sexo:
      z.string()
        .nullable()
        .optional(),

    ci:
      z.string()
        .nullable()
        .optional(),

    telefono:
      z.string()
        .nullable()
        .optional(),

    estado:
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

/* =========================================
    SUCURSAL RESUMEN PARA PERSONAL
========================================= */

export const SucursalPersonalSchema =
  z.object({

    _id:
      z.string(),

    nombre:
      z.string(),

    ubicacion:
      z.string()
        .nullable()
        .optional()
        .default(""),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    ROL DEL PERSONAL
========================================= */

export const RolPersonalSchema =
  z.object({

    _id:
      z.string(),

    nombre:
      z.string(),

    descripcion:
      z.string()
        .nullable()
        .optional()
        .default(""),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    ALMACÉN DEL PERSONAL
========================================= */

export const AlmacenPersonalSchema =
  z.object({

    _id:
      z.string(),

    nombre:
      z.string(),

    tipo:
      z.string()
        .nullable()
        .optional()
        .default("Sin tipo"),

    descripcion:
      z.string()
        .nullable()
        .optional()
        .default(""),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================================
    PERSONAL DE SUCURSAL
========================================= */

export const PersonalSucursalSchema =
  z.object({

    _id:
      z.string(),

    nombres:
      z.string(),

    apellidos:
      z.string(),

    nombreCompleto:
      z.string(),

    edad:
      z.coerce.number()
        .nullable()
        .optional(),

    sexo:
      z.string()
        .nullable()
        .optional(),

    ci:
      z.string()
        .nullable()
        .optional(),

    telefono:
      z.string()
        .nullable()
        .optional(),

    email:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]).optional(),

    estado:
      z.boolean(),

    rol:
      RolPersonalSchema
        .nullable()
        .optional(),

    almacen:
      AlmacenPersonalSchema
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

  }).passthrough();

/* =========================================
    ARRAY PERSONAL DE SUCURSAL
========================================= */

export const PersonalSucursalArraySchema =
  z.array(
    PersonalSucursalSchema
  );

/* =========================================
    RESPUESTA PERSONAL POR SUCURSAL
========================================= */

export const PersonalPorSucursalResponseSchema =
  z.object({

    message:
      z.string(),

    sucursal:
      SucursalPersonalSchema
        .nullable(),

    cantidadPersonal:
      z.coerce.number(),

    cantidadActivos:
      z.coerce.number(),

    cantidadInactivos:
      z.coerce.number(),

    personal:
      PersonalSucursalArraySchema,

  }).passthrough();

/* =========================================
    TYPES GENERALES
========================================= */

export type PerfilUsuarioType =
  z.infer<
    typeof PerfilUsuarioSchema
  >;

export type PerfilUsuarioListType =
  z.infer<
    typeof PerfilUsuarioListSchema
  >;

export type PerfilUsuarioSafeType =
  z.infer<
    typeof PerfilUsuarioSafeSchema
  >;

export type LoginForm =
  z.infer<
    typeof LoginSchema
  >;

export type LoginResponse =
  z.infer<
    typeof LoginResponseSchema
  >;

export type Auth =
  z.infer<
    typeof UsuarioSchema
  >;

export type UsuarioLoginForm =
  Pick<
    LoginForm,
    "email" | "password"
  >;

/* =========================================
    TYPES PERSONAL SUCURSAL
========================================= */

export type SucursalPersonalType =
  z.infer<
    typeof SucursalPersonalSchema
  >;

export type RolPersonalType =
  z.infer<
    typeof RolPersonalSchema
  >;

export type AlmacenPersonalType =
  z.infer<
    typeof AlmacenPersonalSchema
  >;

export type PersonalSucursalType =
  z.infer<
    typeof PersonalSucursalSchema
  >;

export type PersonalPorSucursalResponse =
  z.infer<
    typeof PersonalPorSucursalResponseSchema
  >;

/* =========================================
    FORMULARIO CREAR Y EDITAR
========================================= */

export type PerfilUsuarioForm = {

  idRol:
    string;

  idSucursal:
    string;

  idAlmacen:
    string;

  nombres:
    string;

  apellidos:
    string;

  edad?:
    number | null;

  sexo?:
    string | null;

  ci?:
    string | null;

  telefono?:
    string | null;

  email?:
    string | null;

  password?:
    string;

  estado?:
    boolean;

  creadoPor?:
    string;

  actualizadoPor?:
    string;

};

/* =========================================
    FORMULARIO PERFIL PERSONAL
========================================= */

export type PerfilPersonalForm = {

  nombres:
    string;

  apellidos?:
    string | null;

  edad?:
    number | null;

  sexo?:
    string | null;

  ci?:
    string | null;

  telefono?:
    string | null;

  email?:
    string | null;

  actualizadoPor?:
    string | null;

};