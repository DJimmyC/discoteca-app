import mongoose, { Schema, Document } from "mongoose";

export interface SolicitudType extends Document {
  idPerfil: mongoose.Types.ObjectId;
  idSucursal: mongoose.Types.ObjectId;

  idAlmacenOrigen: mongoose.Types.ObjectId;
  idAlmacenDestino: mongoose.Types.ObjectId;

  fechaSolicitud: Date;

  estado: string;
  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const SolicitudSchema: Schema = new Schema(
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

    idAlmacenOrigen: {
      type: Schema.Types.ObjectId,
      ref: "Almacen",
      required: true,
    },

    idAlmacenDestino: {
      type: Schema.Types.ObjectId,
      ref: "Almacen",
      required: true,
    },

    fechaSolicitud: {
      type: Date,
      required: true,
      default: Date.now,
    },

    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "aprobada", "rechazada", "atendida", "anulada"],
      default: "pendiente",
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
    collection: "solicitudes",
  }
);

//  Validación lógica: origen y destino no pueden ser iguales
SolicitudSchema.pre("save", function (next) {
  const doc = this as any;

  if (doc.idAlmacenOrigen.toString() === doc.idAlmacenDestino.toString()) {
    return next(new Error("El almacén origen y destino no pueden ser iguales"));
  }

  next();
});

//  Índice útil
SolicitudSchema.index(
  { idPerfil: 1, idSucursal: 1, fechaSolicitud: 1 }
);

const Solicitud = mongoose.model<SolicitudType>(
  "Solicitud",
  SolicitudSchema
);

export default Solicitud;