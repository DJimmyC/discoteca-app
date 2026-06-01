import mongoose, { Schema, Document } from "mongoose";
import { HydratedDocument } from "mongoose";

export interface DetalleComandaType extends Document {
  idComanda: mongoose.Types.ObjectId;
  idProducto: mongoose.Types.ObjectId;

  cantidad: number;
  precioUnitario: number;
  subtotal: number;

  estado: string;
  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const DetalleComandaSchema: Schema = new Schema(
  {
    idComanda: {
      type: Schema.Types.ObjectId,
      ref: "Comanda",
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
    },

    precioUnitario: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
    },

    estado: {
      type: String,
      required: true,
      enum: ["activo", "eliminado"],
      default: "activo",
    },

    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
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
    collection: "detalle_comandas",
  }
);

//  Middleware para calcular subtotal automáticamente
DetalleComandaSchema.pre("save", function (next) {
  const doc = this as HydratedDocument<any>;

  doc.subtotal = doc.cantidad * doc.precioUnitario;

  next();
});

//  Índice para evitar duplicados dentro de la misma comanda
DetalleComandaSchema.index(
  { idComanda: 1, idProducto: 1 },
  { unique: false } // puedes cambiar a true si quieres evitar repetir producto
);

const DetalleComanda = mongoose.model<DetalleComandaType>(
  "DetalleComanda",
  DetalleComandaSchema
);

export default DetalleComanda;