// src/types/MovimientoType.ts

import { z } from "zod";

/* =========================
    OBJECT ID SAFE
========================= */

export const MovimientoObjectIdSchema =
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
    SUCURSAL POPULATE
========================= */

export const MovimientoSucursalSchema =
  z.object({
    _id:
      MovimientoObjectIdSchema,

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
  })
    .passthrough();

/* =========================
    CAJA POPULATE
========================= */

export const MovimientoCajaSchema =
  z.object({
    _id:
      MovimientoObjectIdSchema,

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
    .passthrough();

/* =========================
    PERFIL POPULATE
========================= */

export const MovimientoPerfilSchema =
  z.object({
    _id:
      MovimientoObjectIdSchema,

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
    .passthrough();

/* =========================
    ALMACÉN POPULATE
========================= */

export const MovimientoAlmacenSchema =
  z.object({
    _id:
      MovimientoObjectIdSchema,

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

    ubicacion:
      z.string()
        .nullable()
        .optional(),

    estado:
      z.boolean()
        .optional(),
  })
    .passthrough();

/* =========================
    PRODUCTO POPULATE
========================= */

export const MovimientoProductoSchema =
  z.object({
    _id:
      MovimientoObjectIdSchema,

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
  })
    .passthrough();

/* =========================
    INVENTARIO POPULATE
========================= */

export const MovimientoInventarioSchema =
  z.object({
    _id:
      MovimientoObjectIdSchema,

    idAlmacen:
      z.union([
        MovimientoObjectIdSchema,
        MovimientoAlmacenSchema,
        z.null(),
      ])
        .optional(),

    idProducto:
      z.union([
        MovimientoObjectIdSchema,
        MovimientoProductoSchema,
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
  })
    .passthrough();

/* =========================
    RELACIONES FLEXIBLES
========================= */

const IdSucursalSchema =
  z.union([
    MovimientoObjectIdSchema,
    MovimientoSucursalSchema,
    z.null(),
  ])
    .optional();

const IdCajaSchema =
  z.union([
    MovimientoObjectIdSchema,
    MovimientoCajaSchema,
    z.null(),
  ])
    .optional();

const IdPerfilSchema =
  z.union([
    MovimientoObjectIdSchema,
    MovimientoPerfilSchema,
    z.null(),
  ])
    .optional();

const IdAlmacenSchema =
  z.union([
    MovimientoObjectIdSchema,
    MovimientoAlmacenSchema,
    z.null(),
  ])
    .optional();

const IdProductoSchema =
  z.union([
    MovimientoObjectIdSchema,
    MovimientoProductoSchema,
    z.null(),
  ])
    .optional();

const IdInventarioSchema =
  z.union([
    MovimientoObjectIdSchema,
    MovimientoInventarioSchema,
    z.null(),
  ])
    .optional();

const IdReferenciaSchema =
  z.union([
    MovimientoObjectIdSchema,
    z.null(),
  ])
    .optional();

/* =========================
    TIPO DE MOVIMIENTO
========================= */

export const TipoMovimientoSchema =
  z.enum([
    "apertura_caja",
    "cierre_caja",
    "venta",
    "venta_anulada",
    "cortesia",
    "egreso",
    "solicitud",
    "solicitud_aprobada",
    "solicitud_rechazada",
    "solicitud_anulada",
    "entrada_inventario",
    "salida_inventario",
    "transferencia_inventario",
    "ajuste_inventario",
    "conteo_fisico",
    "diferencia_caja",
    "diferencia_inventario",
  ]);

/* =========================
    ORIGEN DE MOVIMIENTO
========================= */

export const OrigenMovimientoSchema =
  z.enum([
    "venta",
    "cortesia",
    "egreso",
    "apertura_caja",
    "cierre_caja",
    "inventario",
    "solicitud",
    "transferencia",
    "ajuste",
    "conteo_fisico",
    "sistema",
  ]);

/* =========================
    MÓDULO
========================= */

export const ModuloMovimientoSchema =
  z.enum([
    "venta",
    "ventas",
    "caja",
    "inventario",
    "egreso",
    "solicitud",
    "transferencia",
    "cierre",
    "sistema",
  ]);

/* =========================
    MÉTODO DE PAGO
========================= */

export const MetodoPagoMovimientoSchema =
  z.enum([
    "efectivo",
    "qr",
    "transferencia",
    "mixto",
    "otro",
  ]);

/* =========================
    ESTADO DEL MOVIMIENTO
========================= */

export const EstadoMovimientoSchema =
  z.enum([
    "activo",
    "anulado",
    "pagado",
    "cortesia",
    "pendiente",
    "aprobada",
    "atendida",
    "rechazada",
    "cerrado",
  ]);

/* =========================
    MOVIMIENTO SCHEMA
========================= */

export const MovimientoSchema =
  z.object({
    _id:
      MovimientoObjectIdSchema
        .optional(),

    fecha:
      z.string()
        .nullable()
        .optional(),

    tipoMovimiento:
      TipoMovimientoSchema,

    origenMovimiento:
      OrigenMovimientoSchema
        .optional(),

    modulo:
      ModuloMovimientoSchema
        .optional(),

    /* =========================
        RELACIONES
    ========================= */

    idSucursal:
      IdSucursalSchema,

    idCaja:
      IdCajaSchema,

    idPerfil:
      IdPerfilSchema,

    idAlmacen:
      IdAlmacenSchema,

    idAlmacenOrigen:
      IdAlmacenSchema,

    idAlmacenDestino:
      IdAlmacenSchema,

    idProducto:
      IdProductoSchema,

    idInventario:
      IdInventarioSchema,

    idVenta:
      IdReferenciaSchema,

    idComanda:
      IdReferenciaSchema,

    idEgreso:
      IdReferenciaSchema,

    idSolicitud:
      IdReferenciaSchema,

    idAperturaCaja:
      IdReferenciaSchema,

    idCierreCaja:
      IdReferenciaSchema,

    /* =========================
        CANTIDADES
    ========================= */

    cantidad:
      z.coerce
        .number()
        .default(0),

    cantidadEntrada:
      z.coerce
        .number()
        .default(0),

    cantidadSalida:
      z.coerce
        .number()
        .default(0),

    cantidadAnterior:
      z.coerce
        .number()
        .optional(),

    cantidadNueva:
      z.coerce
        .number()
        .optional(),

    cantidadFisica:
      z.coerce
        .number()
        .optional(),

    cantidadEsperada:
      z.coerce
        .number()
        .optional(),

    diferenciaCantidad:
      z.coerce
        .number()
        .optional(),

    /* =========================
        IMPORTES
    ========================= */

    montoEntrada:
      z.coerce
        .number()
        .default(0),

    montoSalida:
      z.coerce
        .number()
        .default(0),

    montoInicial:
      z.coerce
        .number()
        .default(0),

    montoEsperado:
      z.coerce
        .number()
        .optional(),

    montoReal:
      z.coerce
        .number()
        .optional(),

    diferenciaMonto:
      z.coerce
        .number()
        .optional(),

    costoUnitario:
      z.coerce
        .number()
        .default(0),

    costoAnterior:
      z.coerce
        .number()
        .default(0),

    costoEntrada:
      z.coerce
        .number()
        .default(0),

    costoPromedio:
      z.coerce
        .number()
        .default(0),

    ultimoCostoEntrada:
      z.coerce
        .number()
        .default(0),

    precioUnitario:
      z.coerce
        .number()
        .default(0),

    subtotal:
      z.coerce
        .number()
        .default(0),

    descuento:
      z.coerce
        .number()
        .default(0),

    total:
      z.coerce
        .number()
        .default(0),

    valorDiferencia:
      z.coerce
        .number()
        .default(0),

    /* =========================
        OTROS DATOS
    ========================= */

    metodoPago:
      MetodoPagoMovimientoSchema
        .optional(),

    estado:
      EstadoMovimientoSchema
        .default("activo"),

    referenciaId:
      z.string()
        .nullable()
        .optional(),

    referenciaModelo:
      z.string()
        .nullable()
        .optional(),

    observacion:
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
  })
    .passthrough();

/* =========================
    ARRAY DE MOVIMIENTOS
========================= */

export const MovimientoArraySchema =
  z.array(
    MovimientoSchema
  );

/* =========================
    FORMULARIO PARA CREAR
========================= */

export type MovimientoForm = {
  fecha?:
    string;

  tipoMovimiento:
    z.infer<
      typeof TipoMovimientoSchema
    >;

  origenMovimiento?:
    z.infer<
      typeof OrigenMovimientoSchema
    >;

  modulo?:
    z.infer<
      typeof ModuloMovimientoSchema
    >;

  idSucursal?:
    string;

  idCaja?:
    string;

  idPerfil?:
    string;

  idAlmacen?:
    string;

  idAlmacenOrigen?:
    string;

  idAlmacenDestino?:
    string;

  idProducto?:
    string;

  idInventario?:
    string;

  idVenta?:
    string;

  idComanda?:
    string;

  idEgreso?:
    string;

  idSolicitud?:
    string;

  idAperturaCaja?:
    string;

  idCierreCaja?:
    string;

  cantidad?:
    number;

  cantidadEntrada?:
    number;

  cantidadSalida?:
    number;

  cantidadAnterior?:
    number;

  cantidadNueva?:
    number;

  cantidadFisica?:
    number;

  cantidadEsperada?:
    number;

  diferenciaCantidad?:
    number;

  montoEntrada?:
    number;

  montoSalida?:
    number;

  montoInicial?:
    number;

  montoEsperado?:
    number;

  montoReal?:
    number;

  diferenciaMonto?:
    number;

  costoUnitario?:
    number;

  costoAnterior?:
    number;

  costoEntrada?:
    number;

  costoPromedio?:
    number;

  ultimoCostoEntrada?:
    number;

  precioUnitario?:
    number;

  subtotal?:
    number;

  descuento?:
    number;

  total?:
    number;

  valorDiferencia?:
    number;

  metodoPago?:
    z.infer<
      typeof MetodoPagoMovimientoSchema
    >;

  estado?:
    z.infer<
      typeof EstadoMovimientoSchema
    >;

  referenciaId?:
    string;

  referenciaModelo?:
    string;

  observacion?:
    string | null;

  creadoPor?:
    string | null;

  actualizadoPor?:
    string | null;
};

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

  origenMovimiento?:
    string;

  modulo?:
    string;

  metodoPago?:
    string;

  estado?:
    string;
};

/* =========================
    PRODUCTOS MÁS VENDIDOS
========================= */

export const ProductoMasVendidoSchema =
  z.object({
    idProducto:
      z.union([
        MovimientoObjectIdSchema,
        MovimientoProductoSchema,
        z.null(),
      ])
        .optional(),

    producto:
      MovimientoProductoSchema
        .nullable()
        .optional(),

    nombre:
      z.string()
        .optional(),

    cantidadVendida:
      z.coerce
        .number()
        .default(0),

    totalVendido:
      z.coerce
        .number()
        .default(0),

    costoTotal:
      z.coerce
        .number()
        .default(0),

    utilidad:
      z.coerce
        .number()
        .default(0),
  })
    .passthrough();

export const ProductosMasVendidosArraySchema =
  z.array(
    ProductoMasVendidoSchema
  );

/* =========================
    REPORTE DE CAJA DIARIA
========================= */

export const ReporteCajaDiariaSchema =
  z.object({
    fecha:
      z.string()
        .nullable()
        .optional(),

    caja:
      MovimientoCajaSchema
        .nullable()
        .optional(),

    sucursal:
      MovimientoSucursalSchema
        .nullable()
        .optional(),

    responsable:
      MovimientoPerfilSchema
        .nullable()
        .optional(),

    montoInicial:
      z.coerce
        .number()
        .default(0),

    ventasEfectivo:
      z.coerce
        .number()
        .default(0),

    ventasQr:
      z.coerce
        .number()
        .default(0),

    ventasTransferencia:
      z.coerce
        .number()
        .default(0),

    ventasMixtas:
      z.coerce
        .number()
        .default(0),

    totalVentas:
      z.coerce
        .number()
        .default(0),

    egresosEfectivo:
      z.coerce
        .number()
        .default(0),

    egresosQr:
      z.coerce
        .number()
        .default(0),

    egresosTransferencia:
      z.coerce
        .number()
        .default(0),

    totalEgresos:
      z.coerce
        .number()
        .default(0),

    cortesias:
      z.coerce
        .number()
        .default(0),

    ventasAnuladas:
      z.coerce
        .number()
        .default(0),

    montoEsperado:
      z.coerce
        .number()
        .default(0),

    montoReal:
      z.coerce
        .number()
        .default(0),

    diferencia:
      z.coerce
        .number()
        .default(0),

    estado:
      z.string()
        .optional(),

    movimientos:
      MovimientoArraySchema
        .optional(),
  })
    .passthrough();

/* =========================
    ESTADO DE RESULTADOS
========================= */

export const EstadoResultadosSchema =
  z.object({
    fechaInicio:
      z.string()
        .nullable()
        .optional(),

    fechaFin:
      z.string()
        .nullable()
        .optional(),

    ingresosVentas:
      z.coerce
        .number()
        .default(0),

    cortesias:
      z.coerce
        .number()
        .default(0),

    ventasAnuladas:
      z.coerce
        .number()
        .default(0),

    costoVentas:
      z.coerce
        .number()
        .default(0),

    utilidadBruta:
      z.coerce
        .number()
        .default(0),

    egresos:
      z.coerce
        .number()
        .default(0),

    utilidadNeta:
      z.coerce
        .number()
        .default(0),
  })
    .passthrough();

/* =========================
    FLUJO DE EFECTIVO
========================= */

export const FlujoEfectivoSchema =
  z.object({
    fechaInicio:
      z.string()
        .nullable()
        .optional(),

    fechaFin:
      z.string()
        .nullable()
        .optional(),

    entradasEfectivo:
      z.coerce
        .number()
        .default(0),

    entradasQr:
      z.coerce
        .number()
        .default(0),

    entradasTransferencia:
      z.coerce
        .number()
        .default(0),

    totalEntradas:
      z.coerce
        .number()
        .default(0),

    salidasEfectivo:
      z.coerce
        .number()
        .default(0),

    salidasQr:
      z.coerce
        .number()
        .default(0),

    salidasTransferencia:
      z.coerce
        .number()
        .default(0),

    totalSalidas:
      z.coerce
        .number()
        .default(0),

    flujoNeto:
      z.coerce
        .number()
        .default(0),

    saldoInicial:
      z.coerce
        .number()
        .default(0),

    saldoFinal:
      z.coerce
        .number()
        .default(0),
  })
    .passthrough();

/* =========================
    TYPES
========================= */

export type MovimientoType =
  z.infer<
    typeof MovimientoSchema
  >;

export type TipoMovimiento =
  z.infer<
    typeof TipoMovimientoSchema
  >;

export type OrigenMovimiento =
  z.infer<
    typeof OrigenMovimientoSchema
  >;

export type ModuloMovimiento =
  z.infer<
    typeof ModuloMovimientoSchema
  >;

export type MetodoPagoMovimiento =
  z.infer<
    typeof MetodoPagoMovimientoSchema
  >;

export type EstadoMovimiento =
  z.infer<
    typeof EstadoMovimientoSchema
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