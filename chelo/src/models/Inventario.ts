// src/models/Inventario.ts

import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface InventarioType
  extends Document {

  idAlmacen:
    mongoose.Types.ObjectId;

  idProducto:
    mongoose.Types.ObjectId;

  cantidad:
    number;

  /*
    Costo promedio ponderado actual.
  */
  costoUnitario:
    number;

  /*
    Último costo recibido.
    Sirve para auditoría.
  */
  ultimoCostoEntrada:
    number;

  precioVenta:
    number;

  stockMinimo:
    number;

  estado:
    boolean;

  fechaCreacion:
    Date;

  fechaActualizacion?:
    Date;

  fechaEliminado?:
    Date;

  creadoPor:
    string;

  actualizadoPor?:
    string;

  eliminadoPor?:
    string;

}

const InventarioSchema =
  new Schema<InventarioType>(
    {

      idAlmacen: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Almacen",

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

      cantidad: {
        type:
          Number,

        required:
          true,

        default:
          0,

        min:
          0,
      },

      /*
        Aquí se almacena el costo promedio.
      */
      costoUnitario: {
        type:
          Number,

        required:
          true,

        default:
          0,

        min:
          0,
      },

      /*
        Último costo con el que entró
        el producto.
      */
      ultimoCostoEntrada: {
        type:
          Number,

        required:
          true,

        default:
          0,

        min:
          0,
      },

      precioVenta: {
        type:
          Number,

        required:
          true,

        default:
          0,

        min:
          0,
      },

      stockMinimo: {
        type:
          Number,

        default:
          0,

        min:
          0,
      },

      estado: {
        type:
          Boolean,

        default:
          true,
      },

      fechaCreacion: {
        type:
          Date,

        default:
          Date.now,
      },

      fechaActualizacion: {
        type:
          Date,
      },

      fechaEliminado: {
        type:
          Date,
      },

      creadoPor: {
        type:
          String,

        required:
          true,

        trim:
          true,

        default:
          "sistema",
      },

      actualizadoPor: {
        type:
          String,

        trim:
          true,
      },

      eliminadoPor: {
        type:
          String,

        trim:
          true,
      },

    },
    {
      timestamps:
        false,

      versionKey:
        false,

      collection:
        "inventarios",
    }
  );

/* =========================
    UN PRODUCTO UNA SOLA VEZ
    POR ALMACÉN
========================= */

InventarioSchema.index(
  {
    idAlmacen:
      1,

    idProducto:
      1,
  },
  {
    unique:
      true,
  }
);

/* =========================
    ÍNDICES PARA CONSULTAS
========================= */

InventarioSchema.index({
  idAlmacen:
    1,

  estado:
    1,
});

InventarioSchema.index({
  idProducto:
    1,

  estado:
    1,
});

/* =========================
    VIRTUAL VALOR INVENTARIO
========================= */

InventarioSchema.virtual(
  "valorInventario"
).get(function () {

  return Number(
    (
      Number(
        this.cantidad || 0
      ) *
      Number(
        this.costoUnitario || 0
      )
    ).toFixed(4)
  );

});

InventarioSchema.set(
  "toJSON",
  {
    virtuals:
      true,
  }
);

InventarioSchema.set(
  "toObject",
  {
    virtuals:
      true,
  }
);

/* =========================
    MODELO
========================= */

const Inventario =
  mongoose.model<InventarioType>(
    "Inventario",
    InventarioSchema
  );

export default Inventario;