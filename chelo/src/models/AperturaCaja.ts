// src/models/AperturaCaja.ts

import mongoose, {
  Schema,
  Document,
} from "mongoose";

export type EstadoAperturaCaja =
  | "abierta"
  | "cerrada"
  | "anulada";

export interface AperturaCajaType
  extends Document {

  idPerfil:
    mongoose.Types.ObjectId;

  idSucursal:
    mongoose.Types.ObjectId;

  idCaja:
    mongoose.Types.ObjectId;

  fechaApertura:
    Date;

  montoInicial:
    number;

  estado:
    EstadoAperturaCaja;

  observacion?:
    string;

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

const AperturaCajaSchema =
  new Schema<AperturaCajaType>(
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

      idCaja: {
        type: Schema.Types.ObjectId,
        ref: "Caja",
        required: true,
      },

      fechaApertura: {
        type: Date,
        required: true,
        default: Date.now,
      },

      montoInicial: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      estado: {
        type: String,
        enum: [
          "abierta",
          "cerrada",
          "anulada",
        ],
        default: "abierta",
        required: true,
      },

      observacion: {
        type: String,
        trim: true,
        maxlength: 300,
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
      collection: "apertura_cajas",
    }
  );

/*
  Solo permite una apertura activa por caja.
  El índice parcial ignora aperturas cerradas o anuladas.
*/
AperturaCajaSchema.index(
  {
    idCaja: 1,
    estado: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      estado: "abierta",
    },
  }
);

AperturaCajaSchema.index({
  idSucursal: 1,
  fechaApertura: -1,
});

const AperturaCaja =
  mongoose.model<AperturaCajaType>(
    "AperturaCaja",
    AperturaCajaSchema
  );

export default AperturaCaja;
