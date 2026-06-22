// src/types/VentaType.ts

import {
  z,
} from "zod";

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
    MÉTODO DE PAGO
========================= */

export const MetodoPagoVentaSchema =
  z.enum([

    "efectivo",

    "qr",

    "transferencia",

    "mixto",

  ]);

/* =========================
    ESTADO DE VENTA
========================= */

export const EstadoVentaSchema =
  z.enum([

    "pagado",

    "anulado",

    "cortesia",

  ]);

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

    fechaCierre:
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

    estado:
      z.boolean()
        .optional(),

  }).passthrough();

/* =========================
    PRODUCTO POPULATE
========================= */

export const ProductoVentaDetalleSchema =
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
    ALMACÉN POPULATE
========================= */

export const AlmacenVentaDetalleSchema =
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

  }).passthrough();

/* =========================
    INVENTARIO POPULATE
========================= */

export const InventarioVentaDetalleSchema =
  z.object({

    _id:
      ObjectIdStringSchema,

    idProducto:
      z.union([

        ObjectIdStringSchema,

        ProductoVentaDetalleSchema,

        z.null(),

      ])
        .optional(),

    idAlmacen:
      z.union([

        ObjectIdStringSchema,

        AlmacenVentaDetalleSchema,

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

  }).passthrough();

/* =========================
    VENTA SCHEMA
========================= */

export const VentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idComanda:
      z.union([

        ObjectIdStringSchema,

        ComandaVentaPopulateSchema,

        z.null(),

      ])
        .optional(),

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

    /* =========================
        DATOS DE VENTA
    ========================= */

    numeroVenta:
      z.string()
        .nullable()
        .optional(),

    fechaVenta:
      z.string()
        .nullable()
        .optional(),

    subtotal:
      z.coerce
        .number(),

    descuento:
      z.coerce
        .number()
        .default(0),

    total:
      z.coerce
        .number(),

    metodoPago:
      MetodoPagoVentaSchema,

    estado:
      EstadoVentaSchema,

    observacion:
      z.string()
        .nullable()
        .optional(),

    /* =========================
        AUDITORÍA
    ========================= */

    fechaCreacion:
      z.string()
        .nullable()
        .optional(),

    creadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaActualizacion:
      z.string()
        .nullable()
        .optional(),

    actualizadoPor:
      z.string()
        .nullable()
        .optional(),

    fechaEliminado:
      z.string()
        .nullable()
        .optional(),

    eliminadoPor:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    ARRAY DE VENTAS
========================= */

export const VentaArraySchema =
  z.array(
    VentaSchema
  );

/* =========================
    RESPUESTA CREAR VENTA
========================= */

export const CreateVentaResponseSchema =
  z.object({

    message:
      z.string(),

    venta:
      VentaSchema,

  }).passthrough();

/* =========================
    DETALLE DE VENTA EN REPORTE
========================= */

export const DetalleVentaDentroVentaSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    idProducto:
      z.union([

        ObjectIdStringSchema,

        ProductoVentaDetalleSchema,

        z.null(),

      ])
        .optional(),

    producto:
      z.union([

        ProductoVentaDetalleSchema,

        z.null(),

      ])
        .optional(),

    idInventario:
      z.union([

        ObjectIdStringSchema,

        InventarioVentaDetalleSchema,

        z.null(),

      ])
        .optional(),

    idAlmacen:
      z.union([

        ObjectIdStringSchema,

        AlmacenVentaDetalleSchema,

        z.null(),

      ])
        .optional(),

    cantidad:
      z.coerce
        .number(),

    precioUnitario:
      z.coerce
        .number(),

    costoUnitario:
      z.coerce
        .number()
        .default(0),

    subtotal:
      z.coerce
        .number(),

    estado:
      z.string()
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

  }).passthrough();

/* =========================
    COMANDA RESUMEN EN VENTA
========================= */

export const ComandaResumenVentaSchema =
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

  })
    .passthrough()
    .nullable();

/* =========================
    CAJA RESUMEN EN VENTA
========================= */

export const CajaResumenVentaSchema =
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

    estado:
      z.boolean()
        .optional(),

  })
    .passthrough()
    .nullable();

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

  })
    .passthrough()
    .nullable();

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

  })
    .passthrough()
    .nullable();

/* =========================
    VENTA CON DETALLES
========================= */

export const VentaConDetallesSchema =
  z.object({

    _id:
      ObjectIdStringSchema
        .optional(),

    numeroVenta:
      z.string()
        .nullable()
        .optional(),

    comanda:
      ComandaResumenVentaSchema,

    caja:
      CajaResumenVentaSchema,

    fechaVenta:
      z.string()
        .nullable()
        .optional(),

    subtotal:
      z.coerce
        .number(),

    descuento:
      z.coerce
        .number()
        .default(0),

    total:
      z.coerce
        .number(),

    totalDetalles:
      z.coerce
        .number()
        .default(0),

    metodoPago:
      MetodoPagoVentaSchema,

    estado:
      EstadoVentaSchema,

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
        DetalleVentaDentroVentaSchema
      ),

  }).passthrough();

/* =========================
    RESPUESTA VENTAS POR PERFIL
========================= */

export const VentasConDetallesPorPerfilSchema =
  z.object({

    perfil:
      PerfilResumenVentaSchema,

    sucursal:
      SucursalResumenVentaSchema,

    ventas:
      z.array(
        VentaConDetallesSchema
      ),

  }).passthrough();

/* =========================
    TYPES
========================= */

export type MetodoPagoVenta =
  z.infer<
    typeof MetodoPagoVentaSchema
  >;

export type EstadoVenta =
  z.infer<
    typeof EstadoVentaSchema
  >;

export type VentaType =
  z.infer<
    typeof VentaSchema
  >;

export type DetalleVentaDentroVentaType =
  z.infer<
    typeof DetalleVentaDentroVentaSchema
  >;

export type VentaConDetallesType =
  z.infer<
    typeof VentaConDetallesSchema
  >;

export type VentasConDetallesPorPerfilType =
  z.infer<
    typeof VentasConDetallesPorPerfilSchema
  >;

/* =========================
    FORM PARA CREAR VENTA
========================= */

export type VentaForm = {

  idComanda?:
    string;

  idCaja:
    string;

  idPerfil:
    string;

  idSucursal:
    string;

  numeroVenta?:
    string;

  fechaVenta?:
    string;

  subtotal:
    number;

  descuento?:
    number;

  /*
    No necesitas enviar total porque
    el backend lo calcula.
  */
  total?:
    number;

  metodoPago:
    MetodoPagoVenta;

  estado?:
    EstadoVenta;

  observacion?:
    string | null;

  creadoPor?:
    string | null;

};

/* =========================
    ALIAS FORM
========================= */

export type VentaFormData =
  VentaForm;

/* =========================
    ACTUALIZAR VENTA
========================= */

export type UpdateVentaForm = {

  idCaja?:
    string;

  idPerfil?:
    string;

  idSucursal?:
    string;

  numeroVenta?:
    string;

  fechaVenta?:
    string;

  subtotal?:
    number;

  descuento?:
    number;

  metodoPago?:
    MetodoPagoVenta;

  estado?:
    EstadoVenta;

  observacion?:
    string | null;

  actualizadoPor?:
    string | null;

};

export type UpdateVentaType = {

  ventaId:
    string;

  formData:
    UpdateVentaForm;

};

/* =========================
    ELIMINAR / ANULAR
========================= */

export type DeleteVentaType = {

  id:
    string;

  eliminadoPor?:
    string;

};

/* =========================
    MARCAR COMO CORTESÍA
========================= */

export type CortesiaVentaType = {

  id:
    string;

  actualizadoPor?:
    string;

  observacion?:
    string;

};

/* =========================
    REPORTE MESERO POR CAJAS
========================= */

export const ProductoReporteMeseroSchema =
  z.object({
    idDetalleVenta:
      z.union([
        z.string(),
        ObjectIdStringSchema,
      ])
        .optional(),

    idDetalleComanda:
      z.union([
        z.string(),
        ObjectIdStringSchema,
      ])
        .optional(),

    idProducto:
      z.string()
        .optional(),

    producto:
      z.string()
        .optional(),

    marca:
      z.string()
        .nullable()
        .optional(),

    idInventario:
      z.string()
        .optional(),

    idAlmacen:
      z.string()
        .optional(),

    almacen:
      z.string()
        .optional(),

    cantidad:
      z.number()
        .optional(),

    precioUnitario:
      z.number()
        .optional(),

    costoUnitario:
      z.number()
        .optional(),

    subtotal:
      z.number()
        .optional(),

    estado:
      z.string()
        .nullable()
        .optional(),

    observacion:
      z.string()
        .nullable()
        .optional(),
  })
    .passthrough();

export const VentaReporteMeseroSchema =
  z.object({
    idVenta:
      z.union([
        z.string(),
        ObjectIdStringSchema,
      ]),

    numeroVenta:
      z.union([
        z.string(),
        z.number(),
      ])
        .optional(),

    idComanda:
      z.union([
        z.string(),
        ObjectIdStringSchema,
      ])
        .nullable()
        .optional(),

    numeroComanda:
      z.union([
        z.string(),
        z.number(),
      ])
        .optional(),

    estadoComanda:
      z.string()
        .nullable()
        .optional(),

    fechaVenta:
      z.string(),

    metodoPago:
      MetodoPagoVentaSchema,

    estado:
      EstadoVentaSchema,

    subtotal:
      z.number(),

    descuento:
      z.number()
        .optional(),

    total:
      z.number(),

    observacion:
      z.string()
        .nullable()
        .optional(),

    productos:
      z.array(
        ProductoReporteMeseroSchema
      )
        .default([]),
  })
    .passthrough();

export const ComandaReporteMeseroSchema =
  z.object({
    _id:
      z.union([
        z.string(),
        ObjectIdStringSchema,
      ])
        .optional(),

    idComanda:
      z.union([
        z.string(),
        ObjectIdStringSchema,
      ])
        .optional(),

    numeroComanda:
      z.union([
        z.string(),
        z.number(),
      ])
        .optional(),

    estado:
      z.string()
        .optional(),

    fechaApertura:
      z.string()
        .nullable()
        .optional(),

    fechaCierre:
      z.string()
        .nullable()
        .optional(),

    observacion:
      z.string()
        .nullable()
        .optional(),

    totalReferencial:
      z.number()
        .optional(),

    productos:
      z.array(
        ProductoReporteMeseroSchema
      )
        .optional(),
  })
    .passthrough();

export const ResumenCajaMeseroSchema =
  z.object({
    cantidadVentas:
      z.number(),

    cantidadVentasAnuladas:
      z.number(),

    cantidadCortesias:
      z.number(),

    cantidadComandasRelacionadas:
      z.number(),

    cantidadComandasAnuladas:
      z.number(),

    totalVentas:
      z.number(),

    totalEfectivo:
      z.number(),

    totalQr:
      z.number(),

    totalTransferencia:
      z.number(),

    totalMixto:
      z.number(),

    montoEfectivoAEntregar:
      z.number(),

    totalAJustificarConComprobante:
      z.number(),

    totalAJustificarSistema:
      z.number(),

    totalVentasAnuladas:
      z.number(),

    totalCortesias:
      z.number(),
  })
    .passthrough();

export const CajaReporteMeseroSchema =
  z.object({
    idAperturaCaja:
      z.union([
        z.string(),
        ObjectIdStringSchema,
      ]),

    idCaja:
      z.string(),

    caja:
      z.string(),

    fechaApertura:
      z.string(),

    fechaReporte:
      z.string(),

    estadoApertura:
      z.union([
        z.string(),
        z.boolean(),
      ])
        .optional(),

    responsableApertura:
      z.string()
        .optional(),

    resumen:
      ResumenCajaMeseroSchema,

    ventas:
      z.array(
        VentaReporteMeseroSchema
      )
        .default([]),

    ventasAnuladas:
      z.array(
        VentaReporteMeseroSchema
      )
        .default([]),

    cortesias:
      z.array(
        VentaReporteMeseroSchema
      )
        .default([]),

    comandasRelacionadas:
      z.array(
        ComandaReporteMeseroSchema
      )
        .default([]),

    comandasAnuladas:
      z.array(
        ComandaReporteMeseroSchema
      )
        .default([]),
  })
    .passthrough();

export const ResumenGeneralReporteMeseroSchema =
  z.object({
    cantidadVentas:
      z.number(),

    cantidadVentasAnuladas:
      z.number(),

    cantidadCortesias:
      z.number(),

    totalVentas:
      z.number(),

    totalEfectivo:
      z.number(),

    totalQr:
      z.number(),

    totalTransferencia:
      z.number(),

    totalMixto:
      z.number(),

    montoEfectivoAEntregar:
      z.number(),

    totalAJustificarConComprobante:
      z.number(),

    totalAJustificarSistema:
      z.number(),

    totalVentasAnuladas:
      z.number(),

    totalCortesias:
      z.number(),
  })
    .passthrough();

export const ReporteVentasMeseroPorCajasSchema =
  z.object({
    message:
      z.string(),

    general:
      z.object({
        idPerfil:
          z.string(),

        idSucursal:
          z.string(),

        fechaReporte:
          z.string(),

        cantidadCajas:
          z.number(),
      })
        .passthrough(),

    resumenGeneral:
      ResumenGeneralReporteMeseroSchema,

    explicacionCaja:
      z.object({
        porCaja:
          z.string()
            .optional(),

        efectivo:
          z.string()
            .optional(),

        qr:
          z.string()
            .optional(),

        transferencia:
          z.string()
            .optional(),

        mixto:
          z.string()
            .optional(),

        cortesias:
          z.string()
            .optional(),

        anulaciones:
          z.string()
            .optional(),
      })
        .passthrough(),

    cajas:
      z.array(
        CajaReporteMeseroSchema
      ),
  })
    .passthrough();

export type ReporteVentasMeseroPorCajasType =
  z.infer<
    typeof ReporteVentasMeseroPorCajasSchema
  >;

export type GetReporteVentasMeseroPorCajasParams = {
  idPerfil: string;
  idSucursal: string;
  idAperturaCaja?: string;
};