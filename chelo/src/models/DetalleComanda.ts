// src/models/DetalleComanda.ts

import mongoose, {
  Schema,
  Types,
} from "mongoose";

/* =========================
    INTERFAZ
========================= */

export interface DetalleComandaType {

  idComanda:
    Types.ObjectId;

  idProducto:
    Types.ObjectId;

  idInventario:
    Types.ObjectId;

  idAlmacen:
    Types.ObjectId;

  cantidad:
    number;

  precioUnitario:
    number;

  subtotal:
    number;

  estado:
    "activo" | "eliminado";

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

const DetalleComandaSchema =
  new Schema<DetalleComandaType>(
    {

      idComanda: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Comanda",

        required:
          true,
      },

      idProducto: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Producto",

        required:
          true,
      },

      idInventario: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Inventario",

        required:
          true,
      },

      idAlmacen: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Almacen",

        required:
          true,
      },

      cantidad: {
        type:
          Number,

        required:
          true,

        min:
          1,
      },

      precioUnitario: {
        type:
          Number,

        required:
          true,

        min:
          0,
      },

      subtotal: {
        type:
          Number,

        required:
          true,

        default:
          0,
      },

      estado: {
        type:
          String,

        enum: [
          "activo",
          "eliminado",
        ],

        default:
          "activo",

        required:
          true,
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
        "detalle_comandas",
    }
  );

/* =========================
    CALCULAR SUBTOTAL
========================= */

DetalleComandaSchema.pre(
  "save",
  function () {

    this.subtotal =
      Number(this.cantidad) *
      Number(this.precioUnitario);

  }
);

/* =========================
    ÍNDICE
========================= */

DetalleComandaSchema.index(
  {
    idComanda:
      1,

    idInventario:
      1,
  },
  {
    unique:
      false,
  }
);

/* =========================
    MODELO
========================= */

const DetalleComanda =
  mongoose.model<DetalleComandaType>(
    "DetalleComanda",
    DetalleComandaSchema
  );

export default DetalleComanda;