import mongoose, { Schema, Document } from "mongoose";

export interface AlmacenType extends Document {
  idSucursal: mongoose.Types.ObjectId;

  nombre: string;
  descripcion?: string;
  tipo: string;
  

  estado: boolean;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const AlmacenSchema: Schema = new Schema(
  {
    idSucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal",
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

    tipo: {
      type: String,
      required: true,
      enum: ["principal", "barra", "deposito", "auxiliar"],
    },

   

    estado: {
      type: Boolean,
      default: true,
    },

    // 🔥 Auditoría (STRING como pediste)
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },

    creadoPor: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    fechaActualizacion: {
      type: Date,
    },

    actualizadoPor: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    fechaEliminado: {
      type: Date,
    },

    eliminadoPor: {
      type: String,
      trim: true,
      maxlength: 20,
    },
  },
  {
    versionKey: false,
    collection: "almacenes",
  }
);


AlmacenSchema.index({ idSucursal: 1, nombre: 1 }, { unique: true });

const Almacen = mongoose.model<AlmacenType>("Almacen", AlmacenSchema);

export default Almacen;