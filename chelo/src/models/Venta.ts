import mongoose, { Schema, Document } from "mongoose";

export interface VentaType extends Document {
  idComanda?: mongoose.Types.ObjectId;
  idCaja: mongoose.Types.ObjectId;
  idPerfil: mongoose.Types.ObjectId;
  idSucursal: mongoose.Types.ObjectId;

  numeroVenta?: string;
  fechaVenta: Date;

  subtotal: number;
  
  total: number;

  metodoPago: string;
  estado: string;

  observacion?: string;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const VentaSchema: Schema = new Schema(
  {
    idComanda: {
      type: Schema.Types.ObjectId,
      ref: "Comanda",
    },

    idCaja: {
      type: Schema.Types.ObjectId,
      ref: "Caja",
      required: true,
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

    numeroVenta: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    fechaVenta: {
      type: Date,
      required: true,
      default: Date.now,
    },

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    descuento: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      default: 0,
    },

    metodoPago: {
      type: String,
      required: true,
      enum: ["efectivo", "qr", "transferencia","mixto"],
    },

    estado: {
      type: String,
      required: true,
      enum: ["pagado", "anulado","cortesia"],
      default: "pagado",
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
    collection: "ventas",
  }
);


// Hook automático (MUY IMPORTANTE)
VentaSchema.pre("save", function (next) {
  const doc = this as any;

  doc.total = doc.subtotal - doc.descuento;

  next();
});

//  Índice útil (opcional)
VentaSchema.index({ numeroVenta: 1 }, { unique: true, sparse: true });

const Venta = mongoose.model<VentaType>("Venta", VentaSchema);

export default Venta;