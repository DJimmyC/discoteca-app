// src/models/Venta.ts

import mongoose, {
  Schema,
  Types,
} from "mongoose";

/* =========================
    TIPOS CONTROLADOS
========================= */

export type MetodoPagoVenta =
  | "efectivo"
  | "qr"
  | "transferencia"
  | "mixto";

export type EstadoVenta =
  | "pagado"
  | "anulado"
  | "cortesia";

/* =========================
    INTERFAZ
========================= */

export interface VentaType {

  idComanda?:
    Types.ObjectId;

  idCaja:
    Types.ObjectId;

  idPerfil:
    Types.ObjectId;
c
  idSucursal:
    Types.ObjectId;

  numeroVenta?:
    string;

  fechaVenta:
    Date;

  subtotal:
    number;

  descuento:
    number;

  total:
    number;

  metodoPago:
    MetodoPagoVenta;

  estado:
    EstadoVenta;

  observacion?:
    string;

  fechaCreacion?:
    Date;

  creadoPor?:
    string;

  fechaActualizacion?:
    Date;

  actualizadoPor?:
    string;

  fechaEliminado?:
    Date;

  eliminadoPor?:
    string;

}

/* =========================
    SCHEMA
========================= */

const VentaSchema =
  new Schema<VentaType>(
    {

      idComanda: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Comanda",
      },

      idCaja: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Caja",

        required:
          true,
      },

      idPerfil: {
        type:
          Schema.Types.ObjectId,

        ref:
          "PerfilUsuario",

        required:
          true,
      },

      idSucursal: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Sucursal",

        required:
          true,
      },

      numeroVenta: {
        type:
          String,

        trim:
          true,

        maxlength:
          30,
      },

      fechaVenta: {
        type:
          Date,

        required:
          true,

        default:
          Date.now,
      },

      subtotal: {
        type:
          Number,

        required:
          true,

        min:
          0,

        default:
          0,
      },

      descuento: {
        type:
          Number,

        required:
          true,

        min:
          0,

        default:
          0,
      },

      total: {
        type:
          Number,

        required:
          true,

        min:
          0,

        default:
          0,
      },

      metodoPago: {
        type:
          String,

        required:
          true,

        enum: [
          "efectivo",
          "qr",
          "transferencia",
          "mixto",
        ],
      },

      estado: {
        type:
          String,

        required:
          true,

        enum: [
          "pagado",
          "anulado",
          "cortesia",
        ],

        default:
          "pagado",
      },

      observacion: {
        type:
          String,

        trim:
          true,

        maxlength:
          200,

        default:
          "",
      },

      /* =========================
          AUDITORÍA
      ========================= */

      fechaCreacion: {
        type:
          Date,

        default:
          Date.now,
      },

      creadoPor: {
        type:
          String,

        trim:
          true,
      },

      fechaActualizacion: {
        type:
          Date,
      },

      actualizadoPor: {
        type:
          String,

        trim:
          true,
      },

      fechaEliminado: {
        type:
          Date,
      },

      eliminadoPor: {
        type:
          String,

        trim:
          true,
      },

    },
    {
      versionKey:
        false,

      collection:
        "ventas",
    }
  );

/* =========================
    CALCULAR TOTAL
========================= */

VentaSchema.pre(
  "validate",
  function () {

    const subtotal =
      Number(
        this.subtotal || 0
      );

    const descuento =
      Number(
        this.descuento || 0
      );

    /*
      El descuento nunca puede ser
      mayor al subtotal.
    */
    this.descuento =
      Math.min(
        descuento,
        subtotal
      );

    this.total =
      Math.max(
        subtotal -
        this.descuento,
        0
      );

  }
);

/* =========================
    ÍNDICES
========================= */

/*
  Número de venta único.
*/
VentaSchema.index(
  {
    numeroVenta:
      1,
  },
  {
    unique:
      true,

    sparse:
      true,
  }
);

/*
  Una comanda solo debería convertirse
  una vez en venta.
*/
VentaSchema.index(
  {
    idComanda:
      1,
  },
  {
    unique:
      true,

    sparse:
      true,
  }
);

/*
  Reportes de ventas por sucursal
  y periodo.
*/
VentaSchema.index({
  idSucursal:
    1,

  fechaVenta:
    -1,
});

/*
  Reportes de ventas por mesero.
*/
VentaSchema.index({
  idPerfil:
    1,

  fechaVenta:
    -1,
});

/*
  Reportes y cierre por caja.
*/
VentaSchema.index({
  idCaja:
    1,

  fechaVenta:
    -1,
});

/*
  Consultas por estado.
*/
VentaSchema.index({
  estado:
    1,

  fechaVenta:
    -1,
});

/* =========================
    MODELO
========================= */

const Venta =
  mongoose.model<VentaType>(
    "Venta",
    VentaSchema
  );

export default Venta;