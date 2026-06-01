import mongoose, { Schema, Document } from "mongoose";

export interface AperturaCajaType extends Document {
  idPerfil: mongoose.Types.ObjectId;
  idCaja: mongoose.Types.ObjectId;

  fecha: Date;
  horaApertura: string;

  montoInicial: number;

  observacion?: string;

  estado: boolean;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const AperturaCajaSchema: Schema = new Schema(
  {
    idPerfil: {
      type: Schema.Types.ObjectId,
      ref: "PerfilUsuario",
      required: true,
    },

    idCaja: {
      type: Schema.Types.ObjectId,
      ref: "Caja",
      required: true,
    },

    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // 🔥 TIME en Mongo → string
    horaApertura: {
      type: String,
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // formato HH:mm
    },

    montoInicial: {
      type: Number,
      required: true,
      min: 0,
    },

    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    estado: {
      type: Boolean,
      default: true,
    },

    // 🔥 Auditoría
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },

    creadoPor: {
      type: String,
      trim: true,
      maxlength: 10,
    },

    fechaActualizacion: {
      type: Date,
    },

    actualizadoPor: {
      type: String,
      trim: true,
      maxlength: 10,
    },

    fechaEliminado: {
      type: Date,
    },

    eliminadoPor: {
      type: String,
      trim: true,
      maxlength: 10,
    },
  },
  {
    versionKey: false,
    collection: "apertura_cajas",
  }
);

//  índice: evita múltiples aperturas activas en la misma caja el mismo día
AperturaCajaSchema.index(
  { idCaja: 1, fecha: 1 },
  { unique: false }
);

const AperturaCaja = mongoose.model<AperturaCajaType>(
  "AperturaCaja",
  AperturaCajaSchema
);

export default AperturaCaja;