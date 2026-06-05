// src/types/MovimientoType.ts

import { z } from "zod";

/* =========================
    SUCURSAL POPULATE
========================= */

export const MovimientoSucursalSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombreSucursal:
      z.string()
        .optional(),

    ubicacionSucursal:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    CAJA POPULATE
========================= */

export const MovimientoCajaSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombre:
      z.string()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    PERFIL POPULATE
========================= */

export const MovimientoPerfilSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombres:
      z.string()
        .optional(),

    apellidos:
      z.string()
        .optional(),

    email:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    ALMACEN POPULATE
========================= */

export const MovimientoAlmacenSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    nombre:
      z.string()
        .optional(),

    tipo:
      z.string()
        .optional(),

    descripcion:
      z.string()
        .nullable()
        .optional(),

  }).passthrough();

/* =========================
    PRODUCTO POPULATE
========================= */

export const MovimientoProductoSchema =
  z.object({

    _id:
      z.string()
        .optional(),

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

  }).passthrough();

/* =========================
    INVENTARIO POPULATE
========================= */

export const MovimientoInventarioSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    cantidad:
      z.number()
        .optional(),

    costoUnitario:
      z.number()
        .optional(),

    precioVenta:
      z.number()
        .optional(),

    stockMinimo:
      z.number()
        .optional(),

  }).passthrough();

/* =========================
    ID FLEXIBLE
    Acepta string, objeto populate o null
========================= */

const IdSucursalSchema =
  z.union([
    z.string(),
    MovimientoSucursalSchema,
    z.null(),
  ]).optional();

const IdCajaSchema =
  z.union([
    z.string(),
    MovimientoCajaSchema,
    z.null(),
  ]).optional();

const IdPerfilSchema =
  z.union([
    z.string(),
    MovimientoPerfilSchema,
    z.null(),
  ]).optional();

const IdAlmacenSchema =
  z.union([
    z.string(),
    MovimientoAlmacenSchema,
    z.null(),
  ]).optional();

const IdProductoSchema =
  z.union([
    z.string(),
    MovimientoProductoSchema,
    z.null(),
  ]).optional();

const IdInventarioSchema =
  z.union([
    z.string(),
    MovimientoInventarioSchema,
    z.null(),
  ]).optional();

/* =========================
    MOVIMIENTO SCHEMA
========================= */

export const MovimientoSchema =
  z.object({

    _id:
      z.string()
        .optional(),

    fecha:
      z.string()
        .nullable()
        .optional(),

    tipoMovimiento:
      z.union([

        z.literal("apertura_caja"),

        z.literal("cierre_caja"),

        z.literal("venta"),

        z.literal("venta_anulada"),

        z.literal("cortesia"),

        z.literal("egreso"),

        z.literal("entrada_inventario"),

        z.literal("salida_inventario"),

        z.literal("transferencia_inventario"),

        z.literal("ajuste_inventario"),

        z.literal("conteo_fisico"),

        z.literal("diferencia_caja"),

        z.literal("diferencia_inventario"),

        z.string(),

      ]),

    origenMovimiento:
      z.union([

        z.literal("venta"),

        z.literal("cortesia"),

        z.literal("egreso"),

        z.literal("ajuste"),

        z.literal("transferencia"),

        z.literal("conteo"),

        z.literal("manual"),

        z.string(),

        z.null(),

      ]).optional(),

    modulo:
      z.union([

        z.literal("caja"),

        z.literal("venta"),

        z.literal("egreso"),

        z.literal("inventario"),

        z.literal("transferencia"),

        z.literal("cierre"),

        z.string(),

      ]),

    idSucursal:
      IdSucursalSchema,

    idCaja:
      IdCajaSchema,

    idPerfil:
      IdPerfilSchema,

    idAlmacen:
      IdAlmacenSchema,

    idProducto:
      IdProductoSchema,

    idInventario:
      IdInventarioSchema,

    referenciaId:
      z.string()
        .nullable()
        .optional(),

    referenciaModelo:
      z.string()
        .nullable()
        .optional(),

    metodoPago:
      z.union([

        z.literal("efectivo"),

        z.literal("qr"),

        z.literal("transferencia"),

        z.literal("otro"),

        z.string(),

        z.null(),

      ]).optional(),

    cantidadEntrada:
      z.number()
        .optional(),

    cantidadSalida:
      z.number()
        .optional(),

    cantidadInicial:
      z.number()
        .optional(),

    cantidadEsperada:
      z.number()
        .optional(),

    cantidadFisica:
      z.number()
        .optional(),

    diferenciaCantidad:
      z.number()
        .optional(),

    montoEntrada:
      z.number()
        .optional(),

    montoSalida:
      z.number()
        .optional(),

    montoInicial:
      z.number()
        .optional(),

    montoEsperado:
      z.number()
        .optional(),

    montoFisico:
      z.number()
        .optional(),

    diferenciaMonto:
      z.number()
        .optional(),

    costoUnitario:
      z.number()
        .optional(),

    precioUnitario:
      z.number()
        .optional(),

    subtotal:
      z.number()
        .optional(),

    total:
      z.number()
        .optional(),

    estado:
      z.string()
        .optional(),

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

  }).passthrough();

/* =========================
    ARRAY MOVIMIENTOS
========================= */

export const MovimientoArraySchema =
  z.array(
    MovimientoSchema
  );

/* =========================
    MOVIMIENTO FORM
========================= */

export const MovimientoFormSchema =
  z.object({

    fecha:
      z.string()
        .optional(),

    tipoMovimiento:
      z.string(),

    origenMovimiento:
      z.string()
        .optional(),

    modulo:
      z.string(),

    idSucursal:
      z.string()
        .optional(),

    idCaja:
      z.string()
        .optional(),

    idPerfil:
      z.string()
        .optional(),

    idAlmacen:
      z.string()
        .optional(),

    idProducto:
      z.string()
        .optional(),

    idInventario:
      z.string()
        .optional(),

    referenciaId:
      z.string()
        .optional(),

    referenciaModelo:
      z.string()
        .optional(),

    metodoPago:
      z.string()
        .optional(),

    cantidadEntrada:
      z.number()
        .optional(),

    cantidadSalida:
      z.number()
        .optional(),

    cantidadInicial:
      z.number()
        .optional(),

    cantidadEsperada:
      z.number()
        .optional(),

    cantidadFisica:
      z.number()
        .optional(),

    diferenciaCantidad:
      z.number()
        .optional(),

    montoEntrada:
      z.number()
        .optional(),

    montoSalida:
      z.number()
        .optional(),

    montoInicial:
      z.number()
        .optional(),

    montoEsperado:
      z.number()
        .optional(),

    montoFisico:
      z.number()
        .optional(),

    diferenciaMonto:
      z.number()
        .optional(),

    costoUnitario:
      z.number()
        .optional(),

    precioUnitario:
      z.number()
        .optional(),

    subtotal:
      z.number()
        .optional(),

    total:
      z.number()
        .optional(),

    estado:
      z.string()
        .optional(),

    observacion:
      z.string()
        .optional(),

    creadoPor:
      z.string()
        .optional(),

  });

/* =========================
    REPORTE PRODUCTOS MAS VENDIDOS
========================= */

export const ProductoMasVendidoSchema =
  z.object({

    idProducto:
      z.string()
        .or(
          z.object({}).passthrough()
        )
        .optional(),

    producto:
      MovimientoProductoSchema
        .optional(),

    cantidadVendida:
      z.number(),

    totalVendido:
      z.number(),

    costoTotal:
      z.number()
        .optional(),

    utilidad:
      z.number()
        .optional(),

  }).passthrough();

export const ProductosMasVendidosArraySchema =
  z.array(
    ProductoMasVendidoSchema
  );

/* =========================
    REPORTE CAJA DIARIA
========================= */

export const ReporteCajaDiariaSchema =
  z.object({

    montoInicial:
      z.number(),

    ventas:
      z.object({

        efectivo:
          z.number(),

        qr:
          z.number(),

        transferencia:
          z.number(),

        total:
          z.number(),

      }),

    egresos:
      z.object({

        efectivo:
          z.number(),

        qr:
          z.number(),

        transferencia:
          z.number(),

        total:
          z.number(),

      }),

    cortesias:
      z.number(),

    ventasAnuladas:
      z.number(),

    montoEsperadoCajaFisica:
      z.number(),

  }).passthrough();

/* =========================
    ESTADO DE RESULTADOS
========================= */

export const EstadoResultadosSchema =
  z.object({

    ingresosVentas:
      z.number(),

    cortesias:
      z.number(),

    anuladas:
      z.number(),

    costoVentas:
      z.number(),

    egresos:
      z.number(),

    utilidadBruta:
      z.number(),

    utilidadNeta:
      z.number(),

  }).passthrough();

/* =========================
    FLUJO DE EFECTIVO
========================= */

export const FlujoEfectivoSchema =
  z.object({

    saldoInicial:
      z.number(),

    entradas:
      z.object({

        efectivo:
          z.number(),

        qr:
          z.number(),

        transferencia:
          z.number(),

        total:
          z.number(),

      }),

    salidas:
      z.object({

        efectivo:
          z.number(),

        qr:
          z.number(),

        transferencia:
          z.number(),

        total:
          z.number(),

      }),

    flujoNeto:
      z.number(),

    saldoFinalEsperado:
      z.number(),

  }).passthrough();

/* =========================
    FILTROS
========================= */

export type MovimientoFiltros = {

  fechaInicio?:
    string;

  fechaFin?:
    string;

  idSucursal?:
    string;

  idCaja?:
    string;

  idPerfil?:
    string;

  idAlmacen?:
    string;

  idProducto?:
    string;

  tipoMovimiento?:
    string;

  modulo?:
    string;

  metodoPago?:
    string;

  origenMovimiento?:
    string;

  limite?:
    number;

};

/* =========================
    TYPES
========================= */

export type MovimientoType =
  z.infer<
    typeof MovimientoSchema
  >;

export type MovimientoForm =
  z.infer<
    typeof MovimientoFormSchema
  >;

export type ProductoMasVendidoType =
  z.infer<
    typeof ProductoMasVendidoSchema
  >;

export type ReporteCajaDiariaType =
  z.infer<
    typeof ReporteCajaDiariaSchema
  >;

export type EstadoResultadosType =
  z.infer<
    typeof EstadoResultadosSchema
  >;

export type FlujoEfectivoType =
  z.infer<
    typeof FlujoEfectivoSchema
  >;