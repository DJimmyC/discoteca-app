// // src/types/InventarioType.ts

// import { z } from "zod";

// /* =========================
//     ALMACEN POPULATE
// ========================= */

// export const AlmacenPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombre:
//       z.string(),
//     tipo:
//       z.string(),

//     idSucursal:
//       z.union([

//         z.string(),

//         z.object({

//           _id:
//             z.string(),

//           nombreSucursal:
//             z.string().optional(),

//         }),

//       ]).optional(),

//   });

// /* =========================
//     PRODUCTO POPULATE
// ========================= */

// export const ProductoPopulateSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     nombre:
//       z.string(),

//     descripcion:
//       z.string()
//         .optional(),

//     marca:
//       z.string()
//         .optional(),

//   });

// /* =========================
//     INVENTARIO SCHEMA
// ========================= */

// export const InventarioSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     /* =========================
//         RELACIONES
//     ========================= */

//     idAlmacen:
//       z.union([

//         z.string(),

//         AlmacenPopulateSchema,

//         z.null(),

//       ]),

//     idProducto:
//       z.union([

//         z.string(),

//         ProductoPopulateSchema,

//         z.null(),

//       ]),

//     /* =========================
//         INVENTARIO
//     ========================= */

//     cantidad:
//       z.number(),

//     costoUnitario:
//       z.number(),

//     precioVenta:
//       z.number(),

//     stockMinimo:
//       z.number(),

//     estado:
//       z.boolean(),

//     /* =========================
//         FECHAS
//     ========================= */

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

//     /* =========================
//         AUDITORIA
//     ========================= */

//     creadoPor:
//       z.string(),

//     actualizadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//     eliminadoPor:
//       z.string()
//         .nullable()
//         .optional(),

//   });

// /* =========================
//     LIST SCHEMA
// ========================= */

// export const InventarioListSchema =
//   z.object({

//     _id:
//       z.string().optional(),

//     cantidad:
//       z.number(),

//     costoUnitario:
//       z.number(),

//     precioVenta:
//       z.number(),

//     stockMinimo:
//       z.number(),

//     estado:
//       z.boolean(),

//     fechaCreacion:
//       z.string()
//         .nullable()
//         .optional(),

//     /* =========================
//         RELACIONES
//     ========================= */

//     idAlmacen:
//       z.union([

//         z.string(),

//         AlmacenPopulateSchema,

//         z.null(),

//       ]),

//     idProducto:
//       z.union([

//         z.string(),

//         ProductoPopulateSchema,

//         z.null(),

//       ]),

//   });

// /* =========================
//     ARRAY SCHEMA
// ========================= */

// export const InventarioArraySchema =
//   z.array(
//     InventarioListSchema
//   );

// /* =========================
//     SAFE SCHEMA
// ========================= */

// export const InventarioSafeSchema =
//   InventarioSchema.omit({

//     eliminadoPor: true,

//   });

// /* =========================
//     TYPES
// ========================= */

// export type InventarioType =
//   z.infer<
//     typeof InventarioSchema
//   >;

// export type InventarioListType =
//   z.infer<
//     typeof InventarioListSchema
//   >;

// /* =========================
//     FORM DATA
// ========================= */

// export type InventarioForm =
//   Pick<

//     InventarioType,

//     | "idAlmacen"
//     | "idProducto"
//     | "cantidad"
//     | "costoUnitario"
//     | "precioVenta"
//     | "stockMinimo"
//     | "estado"
//     | "creadoPor"

//   >;

// /* =========================
//     FORM DATA ALIAS
// ========================= */

// export type InventarioFormData =
//   InventarioForm;

// /* =========================
//     DELETE TYPE
// ========================= */

// export type DeleteInventarioType = {

//   id:
//   string;

//   eliminadoPor?:
//   string;

// };

// src/types/InventarioType.ts

import { z } from "zod";

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

  });

/* =========================
    ALMACEN POPULATE
========================= */

export const AlmacenPopulateSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombre:
      z.string(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    tipo:
      z.string(),

    ubicacion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),

    idSucursal:
      z.union([

        z.string(),

        SucursalPopulateSchema,

        z.null(),

      ]).optional(),

  });

/* =========================
    PRODUCTO POPULATE
========================= */

export const ProductoPopulateSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombre:
      z.string(),

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

  });

/* =========================
    INVENTARIO SCHEMA
========================= */

export const InventarioSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idAlmacen:
      z.union([

        z.string(),

        AlmacenPopulateSchema,

        z.null(),

      ]),

    idProducto:
      z.union([

        z.string(),

        ProductoPopulateSchema,

        z.null(),

      ]),

    /* =========================
        INVENTARIO
    ========================= */

    cantidad:
      z.number(),

    costoUnitario:
      z.number(),

    precioVenta:
      z.number(),

    stockMinimo:
      z.number(),

    estado:
      z.boolean(),

    /* =========================
        FECHAS
    ========================= */

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

    /* =========================
        AUDITORIA
    ========================= */

    creadoPor:
      z.string()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

  });

/* =========================
    LIST SCHEMA
========================= */

export const InventarioListSchema =
  InventarioSchema.pick({

    _id: true,

    idAlmacen: true,

    idProducto: true,

    cantidad: true,

    costoUnitario: true,

    precioVenta: true,

    stockMinimo: true,

    estado: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY SCHEMA
========================= */

export const InventarioArraySchema =
  z.array(
    InventarioListSchema
  );

/* =========================
    SAFE SCHEMA
========================= */

export const InventarioSafeSchema =
  InventarioSchema.omit({

    eliminadoPor: true,

  });

/* =========================
    TYPES
========================= */

export type InventarioType =
  z.infer<
    typeof InventarioSchema
  >;

export type InventarioListType =
  z.infer<
    typeof InventarioListSchema
  >;

/* =========================
    FORM DATA
========================= */

export type InventarioForm =
  Pick<

    InventarioType,

    | "idAlmacen"
    | "idProducto"
    | "cantidad"
    | "costoUnitario"
    | "precioVenta"
    | "stockMinimo"
    | "estado"
    | "creadoPor"

  >;

/* =========================
    FORM DATA ALIAS
========================= */

export type InventarioFormData =
  InventarioForm;

/* =========================
    DELETE TYPE
========================= */

export type DeleteInventarioType = {

  id:
    string;

  eliminadoPor?:
    string;

};