// // src/types/InventarioType.ts

// import { z } from "zod";

// /* =========================
//     OBJECT ID SEGURO
// ========================= */

// const ObjectIdStringSchema =
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
//     SUCURSAL POPULATE
// ========================= */

// export const SucursalInventarioSchema =
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

//     nombre:
//       z.string()
//         .nullable()
//         .optional(),

//   }).passthrough();

// /* =========================
//     ALMACÉN POPULATE
// ========================= */

// export const AlmacenInventarioSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     idSucursal:
//       z.union([

//         ObjectIdStringSchema,

//         SucursalInventarioSchema,

//         z.null(),

//       ])
//         .optional(),

//     nombre:
//       z.string()
//         .nullable()
//         .optional(),

//     descripcion:
//       z.string()
//         .nullable()
//         .optional(),

//     tipo:
//       z.string()
//         .nullable()
//         .optional(),

//     ubicacion:
//       z.string()
//         .nullable()
//         .optional(),

//     estado:
//       z.boolean()
//         .optional(),

//   }).passthrough();

// /* =========================
//     PRODUCTO POPULATE
// ========================= */

// export const ProductoInventarioSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema,

//     nombre:
//       z.string()
//         .nullable()
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
//     INVENTARIO
// ========================= */

// export const InventarioSchema =
//   z.object({

//     _id:
//       ObjectIdStringSchema
//         .optional(),

//     idAlmacen:
//       z.union([

//         ObjectIdStringSchema,

//         AlmacenInventarioSchema,

//         z.null(),

//       ]),

//     idProducto:
//       z.union([

//         ObjectIdStringSchema,

//         ProductoInventarioSchema,

//         z.null(),

//       ]),

//     cantidad:
//       z.coerce
//         .number(),

//     /*
//       Costo promedio ponderado actual.
//     */
//     costoUnitario:
//       z.coerce
//         .number(),

//     /*
//       Costo de la última entrada.
//     */
//     ultimoCostoEntrada:
//       z.coerce
//         .number()
//         .default(0),

//     precioVenta:
//       z.coerce
//         .number(),

//     stockMinimo:
//       z.coerce
//         .number(),

//     /*
//       El backend puede devolverlo
//       como campo virtual.
//     */
//     valorInventario:
//       z.coerce
//         .number()
//         .optional(),

//     disponible:
//       z.boolean()
//         .optional(),

//     estado:
//       z.boolean(),

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

//   }).passthrough();

// /* =========================
//     ARRAY INVENTARIOS
// ========================= */

// export const InventarioArraySchema =
//   z.array(
//     InventarioSchema
//   );

// /* =========================
//     CÁLCULO DE COSTO
// ========================= */

// export const CalculoCostoInventarioSchema =
//   z.object({

//     cantidadAnterior:
//       z.coerce
//         .number(),

//     cantidadEntrada:
//       z.coerce
//         .number(),

//     cantidadNueva:
//       z.coerce
//         .number(),

//     costoAnterior:
//       z.coerce
//         .number(),

//     costoEntrada:
//       z.coerce
//         .number(),

//     costoPromedio:
//       z.coerce
//         .number(),

//     valorAnterior:
//       z.coerce
//         .number(),

//     valorEntrada:
//       z.coerce
//         .number(),

//     valorNuevo:
//       z.coerce
//         .number(),

//   }).passthrough();

// /* =========================
//     RESPUESTA CREAR INVENTARIO
// ========================= */

// export const CreateInventarioResponseSchema =
//   z.object({

//     message:
//       z.string(),

//     inventario:
//       InventarioSchema,

//     calculoCosto:
//       CalculoCostoInventarioSchema,

//   }).passthrough();

// /* =========================
//     INVENTARIO PRINCIPAL
// ========================= */

// export const InventarioPrincipalResponseSchema =
//   z.object({

//     almacen:
//       AlmacenInventarioSchema,

//     inventarios:
//       InventarioArraySchema,

//   }).passthrough();

// /* =========================
//     PRODUCTO TRANSFERIDO
// ========================= */

// export const ProductoTransferidoSchema =
//   z.object({

//     idProducto:
//       ObjectIdStringSchema,

//     cantidadTransferida:
//       z.coerce
//         .number(),

//     origen:
//       z.object({

//         idAlmacen:
//           ObjectIdStringSchema,

//         cantidadAnterior:
//           z.coerce
//             .number(),

//         cantidadNueva:
//           z.coerce
//             .number(),

//         costoPromedio:
//           z.coerce
//             .number(),

//       }).passthrough(),

//     destino:
//       z.object({

//         idAlmacen:
//           ObjectIdStringSchema,

//         cantidadAnterior:
//           z.coerce
//             .number(),

//         cantidadNueva:
//           z.coerce
//             .number(),

//         costoAnterior:
//           z.coerce
//             .number(),

//         costoEntrada:
//           z.coerce
//             .number(),

//         costoPromedio:
//           z.coerce
//             .number(),

//       }).passthrough(),

//   }).passthrough();

// /* =========================
//     RESPUESTA TRANSFERENCIA
// ========================= */

// export const TransferenciaSolicitudResponseSchema =
//   z.object({

//     message:
//       z.string(),

//     solicitud:
//       z.object({

//         _id:
//           ObjectIdStringSchema,

//         estado:
//           z.string(),

//       }).passthrough(),

//     almacenOrigen:
//       AlmacenInventarioSchema,

//     almacenDestino:
//       AlmacenInventarioSchema,

//     cantidadTotal:
//       z.coerce
//         .number(),

//     productos:
//       z.array(
//         ProductoTransferidoSchema
//       ),

//   }).passthrough();

// /* =========================
//     TYPES
// ========================= */

// export type InventarioType =
//   z.infer<
//     typeof InventarioSchema
//   >;

// export type InventarioListType =
//   InventarioType;

// export type InventarioPrincipalResponse =
//   z.infer<
//     typeof InventarioPrincipalResponseSchema
//   >;

// export type CreateInventarioResponse =
//   z.infer<
//     typeof CreateInventarioResponseSchema
//   >;

// export type TransferenciaSolicitudResponse =
//   z.infer<
//     typeof TransferenciaSolicitudResponseSchema
//   >;

// /* =========================
//     FORM CREAR ENTRADA
// ========================= */

// export type InventarioForm = {

//   idAlmacen:
//     string;

//   idProducto:
//     string;

//   /*
//     Cantidad que está ingresando.
//   */
//   cantidad:
//     number;

//   /*
//     En el formulario representa
//     el costo de esta nueva entrada.

//     El backend calculará el nuevo
//     costo promedio ponderado.
//   */
//   costoUnitario:
//     number;

//   precioVenta:
//     number;

//   stockMinimo:
//     number;

//   estado:
//     boolean;

//   creadoPor:
//     string;

// };

// export type InventarioFormData =
//   InventarioForm;

// /* =========================
//     FORM ACTUALIZAR
// ========================= */

// export type UpdateInventarioForm = {

//   precioVenta?:
//     number;

//   stockMinimo?:
//     number;

//   estado?:
//     boolean;

//   actualizadoPor?:
//     string;

// };

// export type UpdateInventarioType = {

//   inventarioId:
//     string;

//   formData:
//     UpdateInventarioForm;

// };

// /* =========================
//     ELIMINAR
// ========================= */

// export type DeleteInventarioType = {

//   id:
//     string;

//   eliminadoPor?:
//     string;

// };

// /* =========================
//     APROBAR Y TRANSFERIR
// ========================= */

// export type AprobarTransferenciaSolicitudType = {

//   idSolicitud:
//     string;

//   actualizadoPor?:
//     string;

// };

// src/types/InventarioType.ts

import { z } from "zod";

/* =========================
    OBJECT ID

    No debe transformar objetos
    populados en strings.
========================= */

export const ObjectIdSchema =
  z.string();

/* =========================
    SUCURSAL POPULATE
========================= */

export const SucursalInventarioSchema =
  z.object({

    _id:
      ObjectIdSchema,

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

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    ALMACÉN POPULATE
========================= */

export const AlmacenInventarioSchema =
  z.object({

    _id:
      ObjectIdSchema,

    idSucursal:
      z.union([

        SucursalInventarioSchema,

        ObjectIdSchema,

        z.null(),

      ])
        .optional(),

    nombre:
      z.string()
        .nullable()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

    tipo:
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
    PRODUCTO POPULATE
========================= */

export const ProductoInventarioSchema =
  z.object({

    _id:
      ObjectIdSchema,

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
    INVENTARIO
========================= */

export const InventarioSchema =
  z.object({

    _id:
      ObjectIdSchema
        .optional(),

    /*
      Puede llegar como objeto populado
      o como ID string.
      El objeto debe estar primero.
    */
    idAlmacen:
      z.union([

        AlmacenInventarioSchema,

        ObjectIdSchema,

        z.null(),

      ]),

    idProducto:
      z.union([

        ProductoInventarioSchema,

        ObjectIdSchema,

        z.null(),

      ]),

    cantidad:
      z.coerce
        .number()
        .default(0),

    costoUnitario:
      z.coerce
        .number()
        .default(0),

    ultimoCostoEntrada:
      z.coerce
        .number()
        .default(0),

    precioVenta:
      z.coerce
        .number()
        .default(0),

    stockMinimo:
      z.coerce
        .number()
        .default(0),

    valorInventario:
      z.coerce
        .number()
        .optional(),

    disponible:
      z.boolean()
        .optional(),

    estado:
      z.boolean()
        .default(true),

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

  }).passthrough();

/* =========================
    ARRAY
========================= */

export const InventarioArraySchema =
  z.array(
    InventarioSchema
  );

/* =========================
    RESPUESTA CREAR
========================= */

export const CalculoCostoInventarioSchema =
  z.object({

    cantidadAnterior:
      z.coerce.number(),

    cantidadEntrada:
      z.coerce.number(),

    cantidadNueva:
      z.coerce.number(),

    costoAnterior:
      z.coerce.number(),

    costoEntrada:
      z.coerce.number(),

    costoPromedio:
      z.coerce.number(),

    valorAnterior:
      z.coerce.number(),

    valorEntrada:
      z.coerce.number(),

    valorNuevo:
      z.coerce.number(),

  }).passthrough();

export const CreateInventarioResponseSchema =
  z.object({

    message:
      z.string(),

    inventario:
      InventarioSchema,

    calculoCosto:
      CalculoCostoInventarioSchema,

  }).passthrough();

/* =========================
    INVENTARIO PRINCIPAL
========================= */

export const InventarioPrincipalResponseSchema =
  z.object({

    almacen:
      AlmacenInventarioSchema,

    inventarios:
      InventarioArraySchema,

  }).passthrough();

/* =========================
    TRANSFERENCIA
========================= */

export const ProductoTransferidoSchema =
  z.object({

    idProducto:
      ObjectIdSchema,

    cantidadTransferida:
      z.coerce.number(),

    origen:
      z.object({

        idAlmacen:
          ObjectIdSchema,

        cantidadAnterior:
          z.coerce.number(),

        cantidadNueva:
          z.coerce.number(),

        costoPromedio:
          z.coerce.number(),

      }).passthrough(),

    destino:
      z.object({

        idAlmacen:
          ObjectIdSchema,

        cantidadAnterior:
          z.coerce.number(),

        cantidadNueva:
          z.coerce.number(),

        costoAnterior:
          z.coerce.number(),

        costoEntrada:
          z.coerce.number(),

        costoPromedio:
          z.coerce.number(),

      }).passthrough(),

  }).passthrough();

export const TransferenciaSolicitudResponseSchema =
  z.object({

    message:
      z.string(),

    solicitud:
      z.object({

        _id:
          ObjectIdSchema,

        estado:
          z.string(),

      }).passthrough(),

    almacenOrigen:
      AlmacenInventarioSchema,

    almacenDestino:
      AlmacenInventarioSchema,

    cantidadTotal:
      z.coerce.number(),

    productos:
      z.array(
        ProductoTransferidoSchema
      ),

  }).passthrough();

/* =========================
    TYPES
========================= */

export type InventarioType =
  z.infer<
    typeof InventarioSchema
  >;

export type InventarioListType =
  InventarioType;

export type AlmacenInventarioType =
  z.infer<
    typeof AlmacenInventarioSchema
  >;

export type ProductoInventarioType =
  z.infer<
    typeof ProductoInventarioSchema
  >;

export type InventarioPrincipalResponse =
  z.infer<
    typeof InventarioPrincipalResponseSchema
  >;

export type CreateInventarioResponse =
  z.infer<
    typeof CreateInventarioResponseSchema
  >;

export type TransferenciaSolicitudResponse =
  z.infer<
    typeof TransferenciaSolicitudResponseSchema
  >;

/* =========================
    FORMULARIO CREAR
========================= */

export type InventarioForm = {

  idAlmacen:
    string;

  idProducto:
    string;

  cantidad:
    number;

  costoUnitario:
    number;

  precioVenta:
    number;

  stockMinimo:
    number;

  estado:
    boolean;

  creadoPor:
    string;

};

export type InventarioFormData =
  InventarioForm;

/* =========================
    ACTUALIZAR
========================= */

export type UpdateInventarioForm = {

  precioVenta?:
    number;

  stockMinimo?:
    number;

  estado?:
    boolean;

  actualizadoPor?:
    string;

};

export type UpdateInventarioType = {

  inventarioId:
    string;

  formData:
    UpdateInventarioForm;

};

/* =========================
    ELIMINAR
========================= */

export type DeleteInventarioType = {

  id:
    string;

  eliminadoPor?:
    string;

};

/* =========================
    APROBAR TRANSFERENCIA
========================= */

export type AprobarTransferenciaSolicitudType = {

  idSolicitud:
    string;

  actualizadoPor?:
    string;

};