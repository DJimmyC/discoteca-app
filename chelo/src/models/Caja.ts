// src/models/Caja.ts

import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface CajaType extends Document {
  idSucursal: mongoose.Types.ObjectId;
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

const CajaSchema =
  new Schema<CajaType>(
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
        trim: true,
        maxlength: 50,
        default: "sistema",
      },

      fechaActualizacion: {
        type: Date,
      },

      actualizadoPor: {
        type: String,
        trim: true,
        maxlength: 50,
      },

      fechaEliminado: {
        type: Date,
      },

      eliminadoPor: {
        type: String,
        trim: true,
        maxlength: 50,
      },
    },
    {
      versionKey: false,
      collection: "cajas",
    }
  );

CajaSchema.index(
  {
    idSucursal: 1,
    nombre: 1,
  },
  {
    unique: true,
  }
);

const Caja =
  mongoose.model<CajaType>(
    "Caja",
    CajaSchema
  );

export default Caja;
