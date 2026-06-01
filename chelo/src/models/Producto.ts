import mongoose, { Schema, Document } from "mongoose";

export interface ProductoType extends Document {
  idCategoria: mongoose.Types.ObjectId;

  nombre: string;
  descripcion?: string;
  marca?: string;

  estado: boolean;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const ProductoSchema: Schema = new Schema(
  {
    idCategoria: {
      type: Schema.Types.ObjectId,
      ref: "CategoriaProducto", // 🔥 relación real
      required: true,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    marca: {
      type: String,
      trim: true,
      maxlength: 100,
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
    collection: "productos",
  }
);

//  índice para evitar duplicados por categoría
ProductoSchema.index(
  { idCategoria: 1, nombre: 1 },
  { unique: true }
);

const Producto = mongoose.model<ProductoType>(
  "Producto",
  ProductoSchema
);

export default Producto;