import mongoose, { Schema, Document } from "mongoose";

export interface ConversionProductoType extends Document {
  idProducto: mongoose.Types.ObjectId;

  unidadOrigen: string;
  cantidadOrigen: number;

  unidadDestino: string;
  cantidadDestino: number;

  estado: boolean;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const ConversionProductoSchema: Schema = new Schema(
  {
    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "Producto", // 🔥 relación real
      required: true,
    },

    unidadOrigen: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    cantidadOrigen: {
      type: Number,
      required: true,
    },

    unidadDestino: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    cantidadDestino: {
      type: Number,
      required: true,
    },

    estado: {
      type: Boolean,
      default: true,
    },

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
    collection: "conversion_productos",
  }
);

//  índice compuesto (equivalente a PK compuesta en SQL)
ConversionProductoSchema.index(
  { idProducto: 1, unidadOrigen: 1, unidadDestino: 1 },
  { unique: true }
);

const ConversionProducto = mongoose.model<ConversionProductoType>(
  "ConversionProducto",
  ConversionProductoSchema
);

export default ConversionProducto;