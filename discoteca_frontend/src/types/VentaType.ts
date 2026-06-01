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
    COMANDA POPULATE
========================= */

export const ComandaVentaPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    numeroComanda:
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

    fechaApertura:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    CAJA POPULATE
========================= */

export const CajaVentaPopulateSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    nombre:
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

/* =========================
    PERFIL POPULATE
========================= */

export const PerfilVentaPopulateSchema =
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

export const SucursalVentaPopulateSchema =
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
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    METODO PAGO
========================= */

export const MetodoPagoSchema =
  z.enum([

    "efectivo",

    "qr",

    "tarjeta",

    "transferencia",

    "mixto",

  ]);

/* =========================
    VENTA SCHEMA NORMAL
========================= */

export const VentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    idComanda:
      z.union([

        ObjectIdStringSchema,

        ComandaVentaPopulateSchema,

        z.null(),

      ]),

    idCaja:
      z.union([

        ObjectIdStringSchema,

        CajaVentaPopulateSchema,

        z.null(),

      ]),

    idPerfil:
      z.union([

        ObjectIdStringSchema,

        PerfilVentaPopulateSchema,

        z.null(),

      ]),

    idSucursal:
      z.union([

        ObjectIdStringSchema,

        SucursalVentaPopulateSchema,

        z.null(),

      ]),

    numeroVenta:
      z.string()
        .nullable()
        .optional(),

    fechaVenta:
      z.string()
        .nullable()
        .optional(),

    subtotal:
      z.number(),


    total:
      z.number(),

    metodoPago:
      MetodoPagoSchema,

    /*
      Lo dejamos string porque tu backend no acepta "activo".
      Así evitamos errores hasta confirmar el enum real del modelo Venta.
    */
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

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaEliminado:
      z.string()
        .nullable()
        .optional(),

  });

/* =========================
    LIST SCHEMA NORMAL
========================= */

export const VentaListSchema =
  VentaSchema.pick({

    _id: true,

    idComanda: true,

    idCaja: true,

    idPerfil: true,

    idSucursal: true,

    numeroVenta: true,

    fechaVenta: true,

    subtotal: true,

    

    total: true,

    metodoPago: true,

    estado: true,

    observacion: true,

    creadoPor: true,

    fechaCreacion: true,

  });

/* =========================
    ARRAY NORMAL
========================= */

export const VentaArraySchema =
  z.array(
    VentaListSchema
  );

/* =========================
    PRODUCTO DETALLE VENTA
========================= */

export const ProductoDetalleVentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

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
    DETALLE DENTRO DE VENTA
========================= */

export const DetalleDentroVentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    producto:
      z.union([

        ProductoDetalleVentaSchema,

        z.null(),

      ]),

    cantidad:
      z.number(),

    precioUnitario:
      z.number(),

    subtotal:
      z.number(),

    creadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaEliminado:
      z.string()
        .nullable()
        .optional(),

  });

/* =========================
    VENTA CON DETALLES
========================= */

export const VentaConDetalleSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    numeroVenta:
      z.string()
        .nullable()
        .optional(),

    comanda:
      z.union([

        ComandaVentaPopulateSchema,

        z.null(),

      ]),

    caja:
      z.union([

        CajaVentaPopulateSchema,

        z.null(),

      ]),

    fechaVenta:
      z.string()
        .nullable()
        .optional(),

    subtotal:
      z.number(),

 

    total:
      z.number(),

    totalDetalles:
      z.number()
        .optional(),

    metodoPago:
      MetodoPagoSchema,

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

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaEliminado:
      z.string()
        .nullable()
        .optional(),

    detalles:
      z.array(
        DetalleDentroVentaSchema
      ),

  });

/* =========================
    PERFIL RESUMEN
========================= */

export const PerfilResumenVentaSchema =
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
    SUCURSAL RESUMEN
========================= */

export const SucursalResumenVentaSchema =
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

  }).nullable();

/* =========================
    RESPUESTA VENTAS CON DETALLES POR PERFIL
========================= */

export const VentasConDetallesPorPerfilSchema =
  z.object({

    perfil:
      PerfilResumenVentaSchema,

    sucursal:
      SucursalResumenVentaSchema,

    ventas:
      z.array(
        VentaConDetalleSchema
      ),

  });

/* =========================
    SAFE SCHEMA
========================= */

export const VentaSafeSchema =
  VentaSchema.omit({

    eliminadoPor: true,

    fechaEliminado: true,

  });

/* =========================
    TYPES
========================= */

export type VentaType =
  z.infer<
    typeof VentaSchema
  >;

export type VentaListType =
  z.infer<
    typeof VentaListSchema
  >;

export type MetodoPago =
  z.infer<
    typeof MetodoPagoSchema
  >;

export type ProductoDetalleVentaType =
  z.infer<
    typeof ProductoDetalleVentaSchema
  >;

export type DetalleDentroVentaType =
  z.infer<
    typeof DetalleDentroVentaSchema
  >;

export type VentaConDetalleType =
  z.infer<
    typeof VentaConDetalleSchema
  >;

export type VentasConDetallesPorPerfilType =
  z.infer<
    typeof VentasConDetallesPorPerfilSchema
  >;

/* =========================
    FORM DATA
========================= */

export type VentaForm =
  Pick<

    VentaType,

    | "idComanda"
    | "idCaja"
    | "idPerfil"
    | "idSucursal"
    | "subtotal"
    
    | "metodoPago"
    | "observacion"
    | "creadoPor"

  > & {

    /*
      Opcional porque el backend puede manejar su default.
      Mejor no mandarlo desde el modal si no sabemos el enum real.
    */
    estado?:
      string;

    numeroVenta?:
      string;

    fechaVenta?:
      string;

  };

/* =========================
    FORM DATA ALIAS
========================= */

export type VentaFormData =
  VentaForm;

/* =========================
    UPDATE TYPE
========================= */

export type UpdateVentaType = {

  ventaId:
    string;

  formData:
    Partial<VentaForm>;

};

/* =========================
    DELETE TYPE
========================= */

export type DeleteVentaType = {

  id:
    string;

  eliminadoPor?:
    string;

};