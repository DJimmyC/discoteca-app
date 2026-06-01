import mongoose, { Schema, Document } from "mongoose";

export interface DetalleVentaType extends Document {
  idVenta: mongoose.Types.ObjectId;
  idProducto: mongoose.Types.ObjectId;

  cantidad: number;
  precioUnitario: number;
  subtotal: number;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const DetalleVentaSchema: Schema = new Schema(
  {
    idVenta: {
      type: Schema.Types.ObjectId,
      ref: "Venta",
      required: true,
    },

    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },

    cantidad: {
      type: Number,
      required: true,
      min: 0,
    },

    precioUnitario: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    // 🔥 Auditoría
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },

    creadoPor: {
      type: String,
    },

    fechaActualizacion: {
      type: Date,
    },

    actualizadoPor: {
      type: String,
    },

    fechaEliminado: {
      type: Date,
    },

    eliminadoPor: {
      type: String,
    },
  },
  {
    versionKey: false,
    collection: "detalle_ventas",
  }
);


//  Cálculo automático (IMPORTANTE)
DetalleVentaSchema.pre("save", function (next) {
  const doc = this as any;

  doc.subtotal = Number(doc.cantidad) * Number(doc.precioUnitario);

  next();
});


//  Índice útil (opcional)
DetalleVentaSchema.index(
  { idVenta: 1, idProducto: 1 },
  { unique: false }
);

const DetalleVenta = mongoose.model<DetalleVentaType>(
  "DetalleVenta",
  DetalleVentaSchema
);

export default DetalleVenta;