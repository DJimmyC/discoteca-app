import mongoose, { Schema, Document } from "mongoose";

export interface DetalleSolicitudType extends Document {
  idSolicitud: mongoose.Types.ObjectId;
  idProducto: mongoose.Types.ObjectId;

  cantidadSolicitada: number;
  cantidadAtendida: number;

  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const DetalleSolicitudSchema: Schema = new Schema(
  {
    idSolicitud: {
      type: Schema.Types.ObjectId,
      ref: "Solicitud",
      required: true,
    },

    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },

    cantidadSolicitada: {
      type: Number,
      required: true,
      min: 0,
    },

    cantidadAtendida: {
      type: Number,
      default: 0,
      min: 0,
    },

    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
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
    collection: "detalle_solicitudes",
  }
);

//  Índice compuesto (equivalente a PK SQL)
DetalleSolicitudSchema.index(
  { idSolicitud: 1, idProducto: 1 },
  { unique: true } // evita duplicar el mismo producto en la misma solicitud
);

//  Validación lógica (no puede atender más de lo solicitado)
DetalleSolicitudSchema.pre("save", function (next) {
  const doc = this as any;

  if (doc.cantidadAtendida > doc.cantidadSolicitada) {
    return next(new Error("La cantidad atendida no puede ser mayor a la solicitada"));
  }

  next();
});

const DetalleSolicitud = mongoose.model<DetalleSolicitudType>(
  "DetalleSolicitud",
  DetalleSolicitudSchema
);

export default DetalleSolicitud;