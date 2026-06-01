import mongoose, { Schema, Document } from "mongoose"

export interface DetalleTransferenciaType extends Document {
  idProducto: mongoose.Types.ObjectId
  idTransferencia: mongoose.Types.ObjectId
  cantidadEnviada: number
  cantidadRecibida: number
  observacion?: string

  fechaCreacion?: Date
  creadoPor?: string

  fechaActualizacion?: Date
  actualizadoPor?: string

  fechaEliminado?: Date
  eliminadoPor?: string
}

const DetalleTransferenciaSchema: Schema = new Schema(
  {
    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: true
    },

    idTransferencia: {
      type: Schema.Types.ObjectId,
      ref: "TransferenciaInventario",
      required: true
    },

    cantidadEnviada: {
      type: Number,
      required: true
    },

    cantidadRecibida: {
      type: Number,
      default: 0
    },

    observacion: {
      type: String,
      trim: true
    },

    // Auditoría
    fechaCreacion: {
      type: Date,
      default: Date.now
    },

    creadoPor: {
      type: String
    },

    fechaActualizacion: {
      type: Date
    },

    actualizadoPor: {
      type: String
    },

    fechaEliminado: {
      type: Date
    },

    eliminadoPor: {
      type: String
    }
  },
  {
    timestamps: false
  }
)

export default mongoose.model<DetalleTransferenciaType>(
  "DetalleTransferencia",
  DetalleTransferenciaSchema
)