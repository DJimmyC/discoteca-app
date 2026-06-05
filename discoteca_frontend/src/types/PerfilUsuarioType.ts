
// import { z } from "zod";

// /* =========================
//     USUARIO POPULATE
// ========================= */
// export const UsuarioPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     username:
//       z.string(),

//   });

// /* =========================
//     ROL POPULATE
// ========================= */
// export const RolPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombre:
//       z.string(),

//   });

// /* =========================
//     SUCURSAL POPULATE
// ========================= */
// export const SucursalPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombreSucursal:
//       z.string(),

//   });
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
//       z.union([

//         z.string(),

//         RolPopulateSchema,

//         z.null(),

//       ]),

//     idSucursal:
//       z.union([

//         z.string(),

//         SucursalPopulateSchema,

//         z.null(),

//       ]),

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
//       z.number().optional(),

//     sexo:
//       z.string().optional(),

//     ci:
//       z.string().optional(),

//     telefono:
//       z.string().optional(),

//     email:
//       z.union([

//         z.string(),

//         z.literal(""),

//         z.null(),

//         z.undefined(),

//       ]),

//     password:
//       z.string().min(
//         6,
//         "Mínimo 6 caracteres"
//       ),

//     estado:
//       z.boolean().optional(),

//     /* =========================
//         AUDITORIA
//     ========================= */

//     creadoPor:
//       z.string().optional(),

//     actualizadoPor:
//       z.string().optional(),

//     eliminadoPor:
//       z.string().optional(),

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

//       ]),

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
//       z.union([

//         z.string(),

//         RolPopulateSchema,

//         z.null(),

//       ]),

//     idSucursal:
//       z.union([

//         z.string(),

//         SucursalPopulateSchema,

//         z.null(),

//       ]),

//   });

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

// export type PerfilUsuarioForm =
//   Pick<

//     PerfilUsuarioType,

    
//     | "idRol"
//     | "idSucursal"
//     | "nombres"
//     | "apellidos"
//     | "edad"
//     | "sexo"
//     | "ci"
//     | "telefono"
//     | "email"
//     | "password"
//     | "estado"
//     | "creadoPor"
//     | "actualizadoPor"

//   >;

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
//     Auth,
//     "email" | "password"
//   >;

//   const ObjectIdStringSchema =
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

//   }).passthrough();

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

//   }).passthrough();

// const UsuarioAuthPopulateSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombre:
//       z.string()
//         .optional(),

//     nombres:
//       z.string()
//         .optional(),

//     email:
//       z.string()
//         .nullable()
//         .optional(),

//   }).passthrough();

// export const UsuarioSchema =
//   PerfilUsuarioSchema.pick({

//     nombres: true,

//   }).extend({

//     _id:
//       ObjectIdStringSchema,

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

//     apellidos:
//       z.string()
//         .nullable()
//         .optional(),

//     edad:
//       z.number()
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

//   });
import { z } from "zod";

/* =========================
    USUARIO POPULATE
========================= */
export const UsuarioPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    username:
      z.string().optional(),

  }).passthrough();

/* =========================
    ROL POPULATE
========================= */
export const RolPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    nombre:
      z.string().optional(),

    nombreRol:
      z.string().optional(),

    descripcion:
      z.string().optional(),

    estado:
      z.boolean().optional(),

  }).passthrough();

/* =========================
    SUCURSAL POPULATE
========================= */
export const SucursalPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    nombreSucursal:
      z.string().optional(),

    nombre:
      z.string().optional(),

    ubicacionSucursal:
      z.string().optional(),

    estado:
      z.boolean().optional(),

  }).passthrough();

/* =========================
    ALMACEN POPULATE
========================= */
export const AlmacenPopulateSchema =
  z.object({

    _id:
      z.string().optional(),

    nombre:
      z.string().optional(),

    tipo:
      z.string().optional(),

    descripcion:
      z.string().optional(),

    ubicacionSucursal:
      z.string().optional(),

    estado:
      z.boolean().optional(),

  }).passthrough();

/* =========================
    ID ROL FLEXIBLE
========================= */
export const IdRolSchema =
  z.union([

    z.string(),

    RolPopulateSchema,

    z.null(),

  ]).optional();

/* =========================
    ID SUCURSAL FLEXIBLE
========================= */
export const IdSucursalSchema =
  z.union([

    z.string(),

    SucursalPopulateSchema,

    z.null(),

  ]).optional();

/* =========================
    ID ALMACEN FLEXIBLE
========================= */
export const IdAlmacenSchema =
  z.union([

    z.string(),

    AlmacenPopulateSchema,

    z.null(),

  ]).optional();

/* =========================
    PERFIL USUARIO SCHEMA
========================= */
export const PerfilUsuarioSchema =
  z.object({

    _id:
      z.string().optional(),

    tokenjwt:
      z.string().optional(),

    /* =========================
        RELACIONES
    ========================= */
    idRol:
      IdRolSchema,

    idSucursal:
      IdSucursalSchema,

    idAlmacen:
      IdAlmacenSchema,

    /* =========================
        DATOS PERSONALES
    ========================= */
    nombres:
      z.string().min(
        1,
        "Nombre obligatorio"
      ),

    apellidos:
      z.string().min(
        1,
        "Apellido obligatorio"
      ),

    edad:
      z.coerce.number().optional(),

    sexo:
      z.string().nullable().optional(),

    ci:
      z.string().nullable().optional(),

    telefono:
      z.string().nullable().optional(),

    email:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]).optional(),

    password:
      z.string().optional(),

    estado:
      z.boolean().optional(),

    /* =========================
        AUDITORIA
    ========================= */
    creadoPor:
      z.string().nullable().optional(),

    actualizadoPor:
      z.string().nullable().optional(),

    eliminadoPor:
      z.string().nullable().optional(),

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
    SCHEMA PARA LISTADO
========================= */
export const PerfilUsuarioListSchema =
  z.object({

    _id:
      z.string().optional(),

    nombres:
      z.string(),

    apellidos:
      z.string(),

    email:
      z.union([

        z.string(),

        z.literal(""),

        z.null(),

        z.undefined(),

      ]).optional(),

    estado:
      z.boolean().optional(),

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    /* =========================
        RELACIONES
    ========================= */
    idRol:
      IdRolSchema,

    idSucursal:
      IdSucursalSchema,

    idAlmacen:
      IdAlmacenSchema,

  }).passthrough();

/* =========================
    ARRAY PARA LISTADO
========================= */
export const PerfilUsuarioArraySchema =
  z.array(
    PerfilUsuarioListSchema
  );

/* =========================
    VERSION SEGURA
========================= */
export const PerfilUsuarioSafeSchema =
  PerfilUsuarioSchema.omit({

    password: true,

  });

/* =========================
    TYPES
========================= */
export type PerfilUsuarioType =
  z.infer<
    typeof PerfilUsuarioSchema
  >;

/* =========================
    FORMULARIO CREAR / EDITAR
========================= */
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
    number;

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

/* =========================
    LOGIN
========================= */
export const LoginSchema =
  z.object({

    email:
      z.string(),

    password:
      z.string()
        .min(
          1,
          "Password requerido"
        ),

  });

export type LoginForm =
  z.infer<
    typeof LoginSchema
  >;

/* =========================
    RESPONSE LOGIN
========================= */
export const LoginResponseSchema =
  z.object({

    message:
      z.string(),

    tokenjwt:
      z.string(),

    usuario:
      PerfilUsuarioSchema,

  });

export type LoginResponse =
  z.infer<
    typeof LoginResponseSchema
  >;

/* =========================
    AUTH
========================= */
export type Auth =
  z.infer<
    typeof PerfilUsuarioSchema
  >;

export type UsuarioLoginForm =
  Pick<
    LoginForm,
    "email" | "password"
  >;

/* =========================
    OBJECT ID STRING
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
    AUTH SUCURSAL
========================= */
const SucursalAuthSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombreSucursal:
      z.string()
        .optional(),

    nombre:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    AUTH ROL
========================= */
const RolAuthSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string()
        .optional(),

    nombreRol:
      z.string()
        .optional(),

    descripcion:
      z.string()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    AUTH ALMACEN
========================= */
const AlmacenAuthSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
      z.string()
        .optional(),

    tipo:
      z.string()
        .optional(),

    descripcion:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .optional(),

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    USUARIO AUTH
========================= */
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