import mongoose, {
  Schema,
  Types,
} from "mongoose";

/* =========================
    INTERFAZ
========================= */

export interface DetalleVentaType {

  idVenta:
    Types.ObjectId;

  idProducto:
    Types.ObjectId;

  /*
    Inventario exacto del que
    salió el producto.
  */
  idInventario:
    Types.ObjectId;

  /*
    Almacén exacto al que
    pertenecía el inventario.
  */
  idAlmacen:
    Types.ObjectId;

  cantidad:
    number;

  precioUnitario:
    number;

  /*
    Se guarda el costo utilizado
    al momento de la venta.

    Esto permitirá calcular:
    - costo de ventas
    - utilidad por producto
    - estado de resultados
  */
  costoUnitario:
    number;

  subtotal:
    number;

  estado:
    "activo" | "eliminado";

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

const DetalleVentaSchema =
  new Schema<DetalleVentaType>(
    {

      idVenta: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Venta",

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

      costoUnitario: {
        type:
          Number,

        required:
          true,

        min:
          0,

        default:
          0,
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
        "detalle_ventas",
    }
  );

/* =========================
    CALCULAR SUBTOTAL
========================= */

DetalleVentaSchema.pre(
  "validate",
  function () {

    this.subtotal =
      Number(this.cantidad) *
      Number(this.precioUnitario);

  }
);

/* =========================
    ÍNDICES
========================= */

/*
  Ayuda a buscar todos los productos
  correspondientes a una venta.
*/
DetalleVentaSchema.index({
  idVenta:
    1,
});

/*
  Ayuda a obtener ventas y reportes
  por producto.
*/
DetalleVentaSchema.index({
  idProducto:
    1,

  fechaCreacion:
    -1,
});

/*
  Permite localizar rápidamente
  el inventario usado en la venta.
*/
DetalleVentaSchema.index({
  idInventario:
    1,

  idVenta:
    1,
});

/* =========================
    MODELO
========================= */

const DetalleVenta =
  mongoose.model<DetalleVentaType>(
    "DetalleVenta",
    DetalleVentaSchema
  );

export default DetalleVenta;