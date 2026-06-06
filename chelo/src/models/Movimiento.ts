// src/models/Movimiento.ts

import mongoose, {
  Schema,
  Document,
} from "mongoose";

/* =========================
    TIPOS DE MOVIMIENTO
========================= */

export type TipoMovimiento =
  | "apertura_caja"
  | "cierre_caja"
  | "venta"
  | "venta_anulada"
  | "cortesia"
  | "egreso"
  | "solicitud"
  | "solicitud_aprobada"
  | "solicitud_rechazada"
  | "solicitud_anulada"
  | "entrada_inventario"
  | "salida_inventario"
  | "transferencia_inventario"
  | "ajuste_inventario"
  | "conteo_fisico"
  | "diferencia_caja"
  | "diferencia_inventario";

/* =========================
    ORIGEN DEL MOVIMIENTO
========================= */

export type OrigenMovimiento =
  | "venta"
  | "cortesia"
  | "egreso"
  | "apertura_caja"
  | "cierre_caja"
  | "inventario"
  | "solicitud"
  | "transferencia"
  | "ajuste"
  | "conteo_fisico"
  | "sistema";

/* =========================
    MÓDULO
========================= */

export type ModuloMovimiento =
  | "caja"
  | "venta"
  | "ventas"
  | "egreso"
  | "inventario"
  | "transferencia"
  | "solicitud"
  | "cierre"
  | "sistema";

/* =========================
    MÉTODO DE PAGO
========================= */

export type MetodoPagoMovimiento =
  | "efectivo"
  | "qr"
  | "transferencia"
  | "mixto"
  | "otro";

/* =========================
    INTERFAZ
========================= */

export interface MovimientoType
  extends Document {

  fecha:
    Date;

  tipoMovimiento:
    TipoMovimiento;

  origenMovimiento?:
    OrigenMovimiento;

  modulo:
    ModuloMovimiento;

  /* =========================
      RELACIONES GENERALES
  ========================= */

  idSucursal?:
    mongoose.Types.ObjectId;

  idCaja?:
    mongoose.Types.ObjectId;

  idPerfil?:
    mongoose.Types.ObjectId;

  idAlmacen?:
    mongoose.Types.ObjectId;

  idAlmacenOrigen?:
    mongoose.Types.ObjectId;

  idAlmacenDestino?:
    mongoose.Types.ObjectId;

  idProducto?:
    mongoose.Types.ObjectId;

  idInventario?:
    mongoose.Types.ObjectId;

  /* =========================
      RELACIONES DE MÓDULOS
  ========================= */

  idVenta?:
    mongoose.Types.ObjectId;

  idComanda?:
    mongoose.Types.ObjectId;

  idEgreso?:
    mongoose.Types.ObjectId;

  idSolicitud?:
    mongoose.Types.ObjectId;

  idAperturaCaja?:
    mongoose.Types.ObjectId;

  idCierreCaja?:
    mongoose.Types.ObjectId;

  /* =========================
      REFERENCIA FLEXIBLE
  ========================= */

  referenciaId?:
    mongoose.Types.ObjectId;

  referenciaModelo?:
    string;

  /* =========================
      MÉTODO DE PAGO
  ========================= */

  metodoPago?:
    MetodoPagoMovimiento;

  /* =========================
      CANTIDADES
  ========================= */

  cantidad?:
    number;

  cantidadEntrada?:
    number;

  cantidadSalida?:
    number;

  cantidadInicial?:
    number;

  cantidadAnterior?:
    number;

  cantidadNueva?:
    number;

  cantidadEsperada?:
    number;

  cantidadFisica?:
    number;

  diferenciaCantidad?:
    number;

  /* =========================
      COSTOS DE INVENTARIO
  ========================= */

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

  /* =========================
      IMPORTES
  ========================= */

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

  montoFisico?:
    number;

  diferenciaMonto?:
    number;

  subtotal?:
    number;

  descuento?:
    number;

  total?:
    number;

  valorDiferencia?:
    number;

  /* =========================
      INFORMACIÓN GENERAL
  ========================= */

  estado?:
    string;

  observacion?:
    string;

  /* =========================
      AUDITORÍA
  ========================= */

  creadoPor?:
    string;

  fechaCreacion?:
    Date;

  actualizadoPor?:
    string;

  fechaActualizacion?:
    Date;

  eliminadoPor?:
    string;

  fechaEliminado?:
    Date;

}

/* =========================
    ESQUEMA
========================= */

const MovimientoSchema =
  new Schema<MovimientoType>(
    {

      fecha: {
        type:
          Date,

        required:
          true,

        default:
          Date.now,
      },

      tipoMovimiento: {
        type:
          String,

        required:
          true,

        enum: [
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
        ],
      },

      origenMovimiento: {
        type:
          String,

        enum: [
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
        ],

        default:
          "sistema",
      },

      modulo: {
        type:
          String,

        required:
          true,

        enum: [
          "caja",
          "venta",
          "ventas",
          "egreso",
          "inventario",
          "transferencia",
          "solicitud",
          "cierre",
          "sistema",
        ],
      },

      /* =========================
          RELACIONES GENERALES
      ========================= */

      idSucursal: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Sucursal",
      },

      idCaja: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Caja",
      },

      idPerfil: {
        type:
          Schema.Types.ObjectId,

        ref:
          "PerfilUsuario",
      },

      idAlmacen: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Almacen",
      },

      idAlmacenOrigen: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Almacen",
      },

      idAlmacenDestino: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Almacen",
      },

      idProducto: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Producto",
      },

      idInventario: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Inventario",
      },

      /* =========================
          RELACIONES DE MÓDULOS
      ========================= */

      idVenta: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Venta",
      },

      idComanda: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Comanda",
      },

      idEgreso: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Egreso",
      },

      idSolicitud: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Solicitud",
      },

      idAperturaCaja: {
        type:
          Schema.Types.ObjectId,

        ref:
          "AperturaCaja",
      },

      idCierreCaja: {
        type:
          Schema.Types.ObjectId,

        ref:
          "CierreCaja",
      },

      /* =========================
          REFERENCIA FLEXIBLE
      ========================= */

      referenciaId: {
        type:
          Schema.Types.ObjectId,
      },

      referenciaModelo: {
        type:
          String,

        trim:
          true,

        maxlength:
          100,
      },

      /* =========================
          MÉTODO DE PAGO
      ========================= */

      metodoPago: {
        type:
          String,

        enum: [
          "efectivo",
          "qr",
          "transferencia",
          "mixto",
          "otro",
        ],
      },

      /* =========================
          CANTIDADES
      ========================= */

      cantidad: {
        type:
          Number,

        default:
          0,
      },

      cantidadEntrada: {
        type:
          Number,

        default:
          0,
      },

      cantidadSalida: {
        type:
          Number,

        default:
          0,
      },

      cantidadInicial: {
        type:
          Number,

        default:
          0,
      },

      cantidadAnterior: {
        type:
          Number,

        default:
          0,
      },

      cantidadNueva: {
        type:
          Number,

        default:
          0,
      },

      cantidadEsperada: {
        type:
          Number,

        default:
          0,
      },

      cantidadFisica: {
        type:
          Number,

        default:
          0,
      },

      diferenciaCantidad: {
        type:
          Number,

        default:
          0,
      },

      /* =========================
          COSTOS
      ========================= */

      /*
        En una entrada de inventario
        representa el costo de la entrada.
      */
      costoUnitario: {
        type:
          Number,

        default:
          0,
      },

      /*
        Costo promedio antes del movimiento.
      */
      costoAnterior: {
        type:
          Number,

        default:
          0,
      },

      /*
        Costo con el que ingresaron
        las nuevas unidades.
      */
      costoEntrada: {
        type:
          Number,

        default:
          0,
      },

      /*
        Costo promedio ponderado
        después del movimiento.
      */
      costoPromedio: {
        type:
          Number,

        default:
          0,
      },

      ultimoCostoEntrada: {
        type:
          Number,

        default:
          0,
      },

      precioUnitario: {
        type:
          Number,

        default:
          0,
      },

      /* =========================
          IMPORTES
      ========================= */

      montoEntrada: {
        type:
          Number,

        default:
          0,
      },

      montoSalida: {
        type:
          Number,

        default:
          0,
      },

      montoInicial: {
        type:
          Number,

        default:
          0,
      },

      montoEsperado: {
        type:
          Number,

        default:
          0,
      },

      montoReal: {
        type:
          Number,

        default:
          0,
      },

      montoFisico: {
        type:
          Number,

        default:
          0,
      },

      diferenciaMonto: {
        type:
          Number,

        default:
          0,
      },

      subtotal: {
        type:
          Number,

        default:
          0,
      },

      descuento: {
        type:
          Number,

        default:
          0,
      },

      total: {
        type:
          Number,

        default:
          0,
      },

      valorDiferencia: {
        type:
          Number,

        default:
          0,
      },

      /* =========================
          INFORMACIÓN GENERAL
      ========================= */

      estado: {
        type:
          String,

        trim:
          true,

        default:
          "activo",
      },

      observacion: {
        type:
          String,

        trim:
          true,

        maxlength:
          500,

        default:
          "",
      },

      /* =========================
          AUDITORÍA
      ========================= */

      creadoPor: {
        type:
          String,

        trim:
          true,

        maxlength:
          100,

        default:
          "sistema",
      },

      fechaCreacion: {
        type:
          Date,

        default:
          Date.now,
      },

      actualizadoPor: {
        type:
          String,

        trim:
          true,

        maxlength:
          100,
      },

      fechaActualizacion: {
        type:
          Date,
      },

      eliminadoPor: {
        type:
          String,

        trim:
          true,

        maxlength:
          100,
      },

      fechaEliminado: {
        type:
          Date,
      },

    },
    {
      versionKey:
        false,

      collection:
        "movimientos",
    }
  );

/* =========================
    VALIDACIÓN DE NÚMEROS
========================= */

MovimientoSchema.pre(
  "validate",
  function (next) {

    const camposNumericos = [

      "cantidad",
      "cantidadEntrada",
      "cantidadSalida",
      "cantidadInicial",
      "cantidadAnterior",
      "cantidadNueva",
      "cantidadEsperada",
      "cantidadFisica",
      "diferenciaCantidad",

      "costoUnitario",
      "costoAnterior",
      "costoEntrada",
      "costoPromedio",
      "ultimoCostoEntrada",
      "precioUnitario",

      "montoEntrada",
      "montoSalida",
      "montoInicial",
      "montoEsperado",
      "montoReal",
      "montoFisico",
      "diferenciaMonto",

      "subtotal",
      "descuento",
      "total",
      "valorDiferencia",

    ] as const;

    for (
      const campo
      of camposNumericos
    ) {

      const valor =
        this[campo];

      if (
        valor === undefined ||
        valor === null
      ) {
        continue;
      }

      const numero =
        Number(valor);

      if (
        !Number.isFinite(numero)
      ) {

        return next(
          new Error(
            `El campo ${campo} debe ser numérico`
          )
        );

      }

      (
        this as unknown as
        Record<string, number>
      )[campo] =
        numero;

    }

    next();

  }
);

/* =========================
    ÍNDICES
========================= */

MovimientoSchema.index({
  fecha:
    -1,
});

MovimientoSchema.index({
  tipoMovimiento:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  modulo:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idSucursal:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idCaja:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idPerfil:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idAlmacen:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idAlmacenOrigen:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idAlmacenDestino:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idProducto:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idInventario:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idSolicitud:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  idVenta:
    1,

  fecha:
    -1,
});

MovimientoSchema.index({
  referenciaId:
    1,

  referenciaModelo:
    1,
});

/* =========================
    MODELO
========================= */

const Movimiento =
  mongoose.model<MovimientoType>(
    "Movimiento",
    MovimientoSchema
  );

export default Movimiento;