import mongoose, { Schema, Document } from "mongoose";

export interface EgresoType extends Document {
  idCaja?: mongoose.Types.ObjectId;
  idPerfil: mongoose.Types.ObjectId;
  idSucursal: mongoose.Types.ObjectId;

  numeroEgreso?: string;
  fechaEgreso: Date;

  tipoEgreso: string;
  metodoPago: string;

  total: number;

  estado: string;
  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const EgresoSchema: Schema = new Schema(
  {
    idCaja: {
      type: Schema.Types.ObjectId,
      ref: "Caja",
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

    numeroEgreso: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    fechaEgreso: {
      type: Date,
      required: true,
      default: Date.now,
    },

    tipoEgreso: {
      type: String,
      required: true,
      enum: ["compra", "servicio", "transporte", "mantenimiento"],
    },

    metodoPago: {
      type: String,
      required: true,
      enum: ["efectivo", "qr", "transferencia"],
    },

    total: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    estado: {
      type: String,
      required: true,
      enum: ["registrado", "anulado"],
      default: "registrado",
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
    collection: "egresos",
  }
);

//  Índice útil (opcional)
EgresoSchema.index({ idSucursal: 1, fechaEgreso: 1 });

//  Generar número automático (opcional)
EgresoSchema.pre("save", function (next) {
  const doc = this as any;

  if (!doc.numeroEgreso) {
    doc.numeroEgreso = "EGR-" + Date.now();
  }

  next();
});

const Egreso = mongoose.model<EgresoType>("Egreso", EgresoSchema);

export default Egreso;