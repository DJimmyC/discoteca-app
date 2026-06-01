import mongoose, { Schema, Document } from "mongoose";

export interface ComandaType extends Document {
  idPerfil: mongoose.Types.ObjectId;
  idSucursal: mongoose.Types.ObjectId;

  numeroComanda?: string;
  estado: string;

  fechaApertura: Date;
  fechaCierre?: Date;

  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const ComandaSchema: Schema = new Schema(
  {
    idPerfil: {
      type: Schema.Types.ObjectId,
      ref: "PerfilUsuario",
      required: true,
    },

    idSucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal",
      required: true,
    },

    numeroComanda: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    estado: {
      type: String,
      required: true,
      enum: ["en_proceso", "impreso", "anulado", "cerrado"], // 🔥 controlado
      default: "en_proceso",
    },

    fechaApertura: {
      type: Date,
      required: true,
      default: Date.now,
    },

    fechaCierre: {
      type: Date,
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
    collection: "comandas",
  }
);

// índice opcional para evitar duplicados por número de comanda
ComandaSchema.index({ numeroComanda: 1 }, { unique: true, sparse: true });

const Comanda = mongoose.model<ComandaType>("Comanda", ComandaSchema);

export default Comanda;