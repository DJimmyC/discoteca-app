import mongoose, { Schema, Document } from "mongoose";

export interface TransferenciaInventarioType extends Document {
  idSolicitud?: mongoose.Types.ObjectId;

  idPerfil: mongoose.Types.ObjectId;
  idSucursal: mongoose.Types.ObjectId;

  idAlmacenOrigen: mongoose.Types.ObjectId;
  idAlmacenDestino: mongoose.Types.ObjectId;

  fechaTransferencia: Date;

  estado: string;
  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const TransferenciaInventarioSchema: Schema = new Schema(
  {
    idSolicitud: {
      type: Schema.Types.ObjectId,
      ref: "Solicitud",
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

    fechaTransferencia: {
      type: Date,
      required: true,
      default: Date.now,
    },

    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "aprobada", "enviada", "recibida", "anulada"],
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
    collection: "transferencia_inventarios",
  }
);

// 🔥 Validación: origen y destino no pueden ser iguales
TransferenciaInventarioSchema.pre("save", function (next) {
  const doc = this as any;

  if (
    doc.idAlmacenOrigen &&
    doc.idAlmacenDestino &&
    doc.idAlmacenOrigen.toString() === doc.idAlmacenDestino.toString()
  ) {
    return next(
      new Error("El almacén origen y destino no pueden ser iguales")
    );
  }

  next();
});

//  Índice útil para búsquedas
TransferenciaInventarioSchema.index({
  idSucursal: 1,
  fechaTransferencia: -1,
});

// Índice para evitar duplicados lógicos (opcional)
TransferenciaInventarioSchema.index(
  { idSolicitud: 1, idAlmacenOrigen: 1, idAlmacenDestino: 1 },
  { unique: false }
);

const TransferenciaInventario = mongoose.model<TransferenciaInventarioType>(
  "TransferenciaInventario",
  TransferenciaInventarioSchema
);

export default TransferenciaInventario;