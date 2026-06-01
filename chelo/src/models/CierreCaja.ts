import mongoose, { Schema, Document } from "mongoose";

export interface CierreCajaType extends Document {
  idPerfil: mongoose.Types.ObjectId;
  idSucursal: mongoose.Types.ObjectId;
  idCaja: mongoose.Types.ObjectId;

  fechaApertura: Date;
  fechaCierre: Date;

  montoInicial: number;
  totalVentas: number;
  totalEgresos: number;
  totalEsperado: number;
  montoReal: number;
  diferencia: number;

  estado: string; // cerrado | cuadrado | descuadre
  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const CierreCajaSchema: Schema = new Schema(
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
    },

    fechaCierre: {
      type: Date,
      required: true,
    },

    montoInicial: {
      type: Number,
      default: 0,
    },

    totalVentas: {
      type: Number,
      default: 0,
    },

    totalEgresos: {
      type: Number,
      default: 0,
    },

    totalEsperado: {
      type: Number,
      default: 0,
    },

    montoReal: {
      type: Number,
      default: 0,
    },

    diferencia: {
      type: Number,
      default: 0,
    },

    estado: {
      type: String,
      required: true,
      enum: ["cerrado", "cuadrado", "descuadre"],
      default: "cerrado",
    },

    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
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
    collection: "cierre_caja",
  }
);

const CierreCaja = mongoose.model<CierreCajaType>(
  "CierreCaja",
  CierreCajaSchema
);

export default CierreCaja;