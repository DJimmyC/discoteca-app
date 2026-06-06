// src/models/CierreCaja.ts

import mongoose, {
  Schema,
  Document,
} from "mongoose";

export type EstadoCierreCaja =
  | "cuadrado"
  | "sobrante"
  | "faltante"
  | "anulado";

export interface CierreCajaType
  extends Document {

  idAperturaCaja:
    mongoose.Types.ObjectId;

  idPerfil:
    mongoose.Types.ObjectId;

  idSucursal:
    mongoose.Types.ObjectId;

  idCaja:
    mongoose.Types.ObjectId;

  fechaApertura:
    Date;

  fechaCierre:
    Date;

  montoInicial:
    number;

  totalVentas:
    number;

  totalVentasEfectivo:
    number;

  totalVentasQr:
    number;

  totalVentasTransferencia:
    number;

  totalVentasMixto:
    number;

  totalCortesias:
    number;

  totalVentasAnuladas:
    number;

  totalEgresos:
    number;

  totalEgresosEfectivo:
    number;

  totalEsperadoEfectivo:
    number;

  montoReal:
    number;

  diferencia:
    number;

  cantidadVentas:
    number;

  cantidadProductosVendidos:
    number;

  cantidadEgresos:
    number;

  estado:
    EstadoCierreCaja;

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

const CierreCajaSchema =
  new Schema<CierreCajaType>(
    {
      idAperturaCaja: {
        type: Schema.Types.ObjectId,
        ref: "AperturaCaja",
        required: true,
        unique: true,
      },

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

      totalVentasEfectivo: {
        type: Number,
        default: 0,
      },

      totalVentasQr: {
        type: Number,
        default: 0,
      },

      totalVentasTransferencia: {
        type: Number,
        default: 0,
      },

      totalVentasMixto: {
        type: Number,
        default: 0,
      },

      totalCortesias: {
        type: Number,
        default: 0,
      },

      totalVentasAnuladas: {
        type: Number,
        default: 0,
      },

      totalEgresos: {
        type: Number,
        default: 0,
      },

      totalEgresosEfectivo: {
        type: Number,
        default: 0,
      },

      totalEsperadoEfectivo: {
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

      cantidadVentas: {
        type: Number,
        default: 0,
      },

      cantidadProductosVendidos: {
        type: Number,
        default: 0,
      },

      cantidadEgresos: {
        type: Number,
        default: 0,
      },

      estado: {
        type: String,
        enum: [
          "cuadrado",
          "sobrante",
          "faltante",
          "anulado",
        ],
        required: true,
      },

      observacion: {
        type: String,
        trim: true,
        maxlength: 500,
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
      collection: "cierre_caja",
    }
  );

CierreCajaSchema.index({
  idCaja: 1,
  fechaCierre: -1,
});

CierreCajaSchema.index({
  idSucursal: 1,
  fechaCierre: -1,
});

const CierreCaja =
  mongoose.model<CierreCajaType>(
    "CierreCaja",
    CierreCajaSchema
  );

export default CierreCaja;
