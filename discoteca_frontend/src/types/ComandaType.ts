// import { z } from "zod";

// /* =========================
//     OBJECT ID SAFE
// ========================= */

// export const ObjectIdStringSchema =
//   z.preprocess(
//     (value) => {

//       if (
//         typeof value === "object" &&
//         value !== null &&
//         "_id" in value
//       ) {
//         return (
//           value as {
//             _id: unknown;
//           }
//         )._id;
//       }

//       return value;

//     },
//     z.string()
//   );

// /* =========================
//     PERFIL POPULATE
// ========================= */

// export const PerfilPopulateSchema =
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

//     telefono:
//       z.string()
//         .nullable()
//         .optional(),

//     ci:
//       z.string()
//         .nullable()
//         .optional(),

//   }).passthrough();

// /* =========================
//     SUCURSAL POPULATE
// ========================= */

// export const SucursalPopulateSchema =
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
//         .nullable()
//         .optional(),

//     direccion:
//       z.string()
//         .nullable()
//         .optional(),

//   }).passthrough();

// /* =========================
//     PRODUCTO POPULATE
// ========================= */

// export const ProductoDetalleComandaSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombre:
//       z.string()
//         .optional(),

//     descripcion:
//       z.string()
//         .nullable()
//         .optional(),

//     marca:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       z.boolean()
//         .optional(),

//   }).passthrough();

// /* =========================
//     ALMACÉN POPULATE
// ========================= */

// export const AlmacenDetalleComandaSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombre:
//       z.string()
//         .optional(),

//     descripcion:
//       z.string()
//         .nullable()
//         .optional(),

//     tipo:
//       z.string()
//         .optional(),

//     estado:
//       z.boolean()
//         .optional(),

//   }).passthrough();

// /* =========================
//     INVENTARIO POPULATE
// ========================= */

// export const InventarioDetalleComandaSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     idAlmacen:
//       z.union([
//         ObjectIdStringSchema,
//         AlmacenDetalleComandaSchema,
//         z.null(),
//       ])
//         .optional(),

//     idProducto:
//       z.union([
//         ObjectIdStringSchema,
//         ProductoDetalleComandaSchema,
//         z.null(),
//       ])
//         .optional(),

//     cantidad:
//       z.coerce
//         .number()
//         .optional(),

//     costoUnitario:
//       z.coerce
//         .number()
//         .optional(),

//     precioVenta:
//       z.coerce
//         .number()
//         .optional(),

//     stockMinimo:
//       z.coerce
//         .number()
//         .optional(),

//     estado:
//       z.boolean()
//         .optional(),

//   }).passthrough();

// /* =========================
//     ESTADO COMANDA
// ========================= */

// export const EstadoComandaSchema =
//   z.enum([
//     "en_proceso",
//     "impreso",
//     "anulado",
//     "cerrado",
//   ]);

// /* =========================
//     COMANDA SCHEMA
// ========================= */

// export const ComandaSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     idPerfil:
//       z.union([
//         ObjectIdStringSchema,
//         PerfilPopulateSchema,
//         z.null(),
//       ]),

//     idSucursal:
//       z.union([
//         ObjectIdStringSchema,
//         SucursalPopulateSchema,
//         z.null(),
//       ]),

//     numeroComanda:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       EstadoComandaSchema,

//     observacion:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaApertura:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaCierre:
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

//   }).passthrough();

// /* =========================
//     COMANDA LIST
// ========================= */

// export const ComandaListSchema =
//   ComandaSchema.pick({

//     _id: true,

//     idPerfil: true,

//     idSucursal: true,

//     numeroComanda: true,

//     estado: true,

//     observacion: true,

//     fechaApertura: true,

//     fechaCierre: true,

//     fechaCreacion: true,

//     creadoPor: true,

//   });

// /* =========================
//     ARRAY COMANDAS
// ========================= */

// export const ComandaArraySchema =
//   z.array(
//     ComandaListSchema
//   );

// /* =========================
//     RESPUESTA CREAR COMANDA
// ========================= */

// export const CreateComandaResponseSchema =
//   z.object({

//     message:
//       z.string()
//         .optional(),

//     comanda:
//       ComandaSchema,

//   }).passthrough();

// /* =========================
//     DETALLE DENTRO DE COMANDA
// ========================= */

// export const DetalleDentroComandaSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     producto:
//       z.union([
//         ProductoDetalleComandaSchema,
//         z.null(),
//       ])
//         .optional(),

//     idProducto:
//       z.union([
//         ObjectIdStringSchema,
//         ProductoDetalleComandaSchema,
//         z.null(),
//       ])
//         .optional(),

//     idInventario:
//       z.union([
//         ObjectIdStringSchema,
//         InventarioDetalleComandaSchema,
//         z.null(),
//       ])
//         .optional(),

//     idAlmacen:
//       z.union([
//         ObjectIdStringSchema,
//         AlmacenDetalleComandaSchema,
//         z.null(),
//       ])
//         .optional(),

//     cantidad:
//       z.coerce
//         .number(),

//     precioUnitario:
//       z.coerce
//         .number(),

//     subtotal:
//       z.coerce
//         .number(),

//     estado:
//       z.string(),

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

//   }).passthrough();

// /* =========================
//     COMANDA CON DETALLES
// ========================= */

// export const ComandaConDetalleSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     numeroComanda:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       EstadoComandaSchema,

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

//     fechaApertura:
//       z.string()
//         .nullable()
//         .optional(),

//     fechaCierre:
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

//     detalles:
//       z.array(
//         DetalleDentroComandaSchema
//       ),

//     total:
//       z.coerce
//         .number()
//         .default(0),

//   }).passthrough();

// /* =========================
//     PERFIL RESUMEN
// ========================= */

// export const PerfilResumenComandaSchema =
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

//     telefono:
//       z.string()
//         .nullable()
//         .optional(),

//     ci:
//       z.string()
//         .nullable()
//         .optional(),

//   })
//     .passthrough()
//     .nullable();

// /* =========================
//     SUCURSAL RESUMEN
// ========================= */

// export const SucursalResumenComandaSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombreSucursal:
//       z.string()
//         .optional(),

//     ubicacionSucursal:
//       z.string()
//         .nullable()
//         .optional(),

//   })
//     .passthrough()
//     .nullable();

// /* =========================
//     RESPUESTA COMANDAS CON DETALLES
// ========================= */

// export const ComandasConDetallesPorPerfilSchema =
//   z.object({

//     perfil:
//       PerfilResumenComandaSchema,

//     sucursal:
//       SucursalResumenComandaSchema,

//     almacen:
//       z.object({

//         _id:
//           ObjectIdStringSchema,

//         idSucursal:
//           z.union([
//             ObjectIdStringSchema,
//             z.null(),
//           ]).optional(),

//         nombre:
//           z.string()
//             .optional(),

//         descripcion:
//           z.string()
//             .nullable()
//             .optional(),

//         tipo:
//           z.string()
//             .optional(),

//         ubicacion:
//           z.string()
//             .nullable()
//             .optional(),

//         estado:
//           z.boolean()
//             .optional(),

//       })
//         .passthrough()
//         .nullable()
//         .optional(),

//     comandas:
//       z.array(
//         ComandaConDetalleSchema
//       ),

//   }).passthrough();

// /* =========================
//     TYPES
// ========================= */

// export type ComandaType =
//   z.infer<
//     typeof ComandaSchema
//   >;

// export type ComandaListType =
//   z.infer<
//     typeof ComandaListSchema
//   >;

// export type EstadoComanda =
//   z.infer<
//     typeof EstadoComandaSchema
//   >;

// export type ProductoDetalleComandaType =
//   z.infer<
//     typeof ProductoDetalleComandaSchema
//   >;

// export type InventarioDetalleComandaType =
//   z.infer<
//     typeof InventarioDetalleComandaSchema
//   >;

// export type AlmacenDetalleComandaType =
//   z.infer<
//     typeof AlmacenDetalleComandaSchema
//   >;

// export type DetalleDentroComandaType =
//   z.infer<
//     typeof DetalleDentroComandaSchema
//   >;

// export type ComandaConDetalleType =
//   z.infer<
//     typeof ComandaConDetalleSchema
//   >;

// export type ComandasConDetallesPorPerfilType =
//   z.infer<
//     typeof ComandasConDetallesPorPerfilSchema
//   >;

// /* =========================
//     FORM PARA CREAR COMANDA
// ========================= */

// export type ComandaForm = {

//   idPerfil:
//     string;

//   idSucursal:
//     string;

//   estado?:
//     EstadoComanda;

//   observacion?:
//     string | null;

//   creadoPor?:
//     string | null;

//   actualizadoPor?:
//     string | null;

// };

// /* =========================
//     ALIAS
// ========================= */

// export type ComandaFormData =
//   ComandaForm;

// /* =========================
//     UPDATE
// ========================= */

// export type UpdateComandaType = {

//   comandaId:
//     string;

//   formData:
//     Partial<ComandaForm>;

// };

// /* =========================
//     DELETE
// ========================= */

// export type DeleteComandaType = {

//   id:
//     string;

//   eliminadoPor?:
//     string;

// };
// src/types/ComandaType.ts

import { z } from "zod";

/* =========================
    OBJECT ID SAFE
========================= */

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

/* =========================
    PERFIL POPULATE
========================= */

export const PerfilPopulateSchema =
  z.object({

    _id:
      z.string(),

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

  }).passthrough();

/* =========================
    SUCURSAL POPULATE
========================= */

export const SucursalPopulateSchema =
  z.object({

    _id:
      z.string(),

    nombreSucursal:
      z.string()
        .optional(),

    nombre:
      z.string()
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

/* =========================
    PRODUCTO POPULATE
========================= */

export const ProductoDetalleComandaSchema =
  z.object({

    _id:
      z.string(),

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
    ALMACÉN POPULATE
========================= */

export const AlmacenDetalleComandaSchema =
  z.object({

    _id:
      z.string(),

    idSucursal:
      z.union([

        SucursalPopulateSchema,

        z.string(),

        z.null(),

      ])
        .optional(),

    nombre:
      z.string()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    tipo:
      z.string()
        .optional(),

    ubicacion:
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

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    INVENTARIO POPULATE
========================= */

export const InventarioDetalleComandaSchema =
  z.object({

    _id:
      z.string(),

    /*
      El objeto poblado debe estar primero.
      Si ponemos primero ObjectIdStringSchema,
      Zod convierte el objeto completo en string.
    */

    idAlmacen:
      z.union([

        AlmacenDetalleComandaSchema,

        z.string(),

        z.null(),

      ])
        .optional(),

    idProducto:
      z.union([

        ProductoDetalleComandaSchema,

        z.string(),

        z.null(),

      ])
        .optional(),

    cantidad:
      z.coerce
        .number()
        .optional(),

    costoUnitario:
      z.coerce
        .number()
        .optional(),

    precioVenta:
      z.coerce
        .number()
        .optional(),

    stockMinimo:
      z.coerce
        .number()
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

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
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
      z.string()
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idPerfil:
      z.union([

        PerfilPopulateSchema,

        z.string(),

        z.null(),

      ]),

    idSucursal:
      z.union([

        SucursalPopulateSchema,

        z.string(),

        z.null(),

      ]),

    /* =========================
        DATOS
    ========================= */

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

  }).passthrough();

/* =========================
    COMANDA LIST
========================= */

export const ComandaListSchema =
  ComandaSchema.pick({

    _id:
      true,

    idPerfil:
      true,

    idSucursal:
      true,

    numeroComanda:
      true,

    estado:
      true,

    observacion:
      true,

    fechaApertura:
      true,

    fechaCierre:
      true,

    fechaCreacion:
      true,

    creadoPor:
      true,

  });

/* =========================
    ARRAY COMANDAS
========================= */

export const ComandaArraySchema =
  z.array(
    ComandaListSchema
  );

/* =========================
    RESPUESTA CREAR COMANDA
========================= */

export const CreateComandaResponseSchema =
  z.object({

    message:
      z.string()
        .optional(),

    comanda:
      ComandaSchema,

  }).passthrough();

/* =========================
    DETALLE DENTRO DE COMANDA
========================= */

export const DetalleDentroComandaSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    /*
      "producto" es la versión limpia que arma
      tu controller.
    */

    producto:
      z.union([

        ProductoDetalleComandaSchema,

        z.null(),

      ])
        .optional(),

    /*
      idProducto puede venir poblado o como string.
      El objeto debe colocarse primero.
    */

    idProducto:
      z.union([

        ProductoDetalleComandaSchema,

        z.string(),

        z.null(),

      ])
        .optional(),

    idInventario:
      z.union([

        InventarioDetalleComandaSchema,

        z.string(),

        z.null(),

      ])
        .optional(),

    idAlmacen:
      z.union([

        AlmacenDetalleComandaSchema,

        z.string(),

        z.null(),

      ])
        .optional(),

    cantidad:
      z.coerce
        .number(),

    precioUnitario:
      z.coerce
        .number(),

    subtotal:
      z.coerce
        .number(),

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
    COMANDA CON DETALLES
========================= */

export const ComandaConDetalleSchema =
  z.object({

    _id:
      z.string()
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
      z.coerce
        .number()
        .default(0),

  }).passthrough();

/* =========================
    PERFIL RESUMEN
========================= */

export const PerfilResumenComandaSchema =
  z.object({

    _id:
      z.string(),

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

  })
    .passthrough()
    .nullable();

/* =========================
    SUCURSAL RESUMEN
========================= */

export const SucursalResumenComandaSchema =
  z.object({

    _id:
      z.string(),

    nombreSucursal:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  })
    .passthrough()
    .nullable();

/* =========================
    ALMACÉN RESUMEN
========================= */

export const AlmacenResumenComandaSchema =
  AlmacenDetalleComandaSchema
    .nullable()
    .optional();

/* =========================
    RESPUESTA COMANDAS CON DETALLES
========================= */

export const ComandasConDetallesPorPerfilSchema =
  z.object({

    perfil:
      PerfilResumenComandaSchema,

    sucursal:
      SucursalResumenComandaSchema,

    almacen:
      AlmacenResumenComandaSchema,

    comandas:
      z.array(
        ComandaConDetalleSchema
      ),

  }).passthrough();

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

export type ProductoDetalleComandaType =
  z.infer<
    typeof ProductoDetalleComandaSchema
  >;

export type InventarioDetalleComandaType =
  z.infer<
    typeof InventarioDetalleComandaSchema
  >;

export type AlmacenDetalleComandaType =
  z.infer<
    typeof AlmacenDetalleComandaSchema
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

/* =========================
    FORM PARA CREAR COMANDA
========================= */

export type ComandaForm = {

  idPerfil:
    string;

  idSucursal:
    string;

  estado?:
    EstadoComanda;

  observacion?:
    string | null;

  creadoPor?:
    string | null;

  actualizadoPor?:
    string | null;

};

/* =========================
    ALIAS
========================= */

export type ComandaFormData =
  ComandaForm;

/* =========================
    UPDATE
========================= */

export type UpdateComandaType = {

  comandaId:
    string;

  formData:
    Partial<ComandaForm>;

};

/* =========================
    DELETE
========================= */

export type DeleteComandaType = {

  id:
    string;

  eliminadoPor?:
    string;

};