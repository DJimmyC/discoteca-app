import mongoose, { Schema, Document } from "mongoose";

export interface CategoriaProductoType extends Document {
  nombre: string;
  descripcion?: string;
  estado: boolean;

  fechaCreacion?: Date;
  creadoPor?: string;

  fechaActualizacion?: Date;
  actualizadoPor?: string;

  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const CategoriaProductoSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: 150,
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
    collection: "categoria_productos",
  }
);

// Opcional (recomendado): evitar nombres duplicados
CategoriaProductoSchema.index({ nombre: 1 }, { unique: true });

const CategoriaProducto = mongoose.model<CategoriaProductoType>(
  "CategoriaProducto",
  CategoriaProductoSchema
);

export default CategoriaProducto;