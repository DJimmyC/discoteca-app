import mongoose, { Schema, Document } from "mongoose";

export interface DetalleEgresoType extends Document {
  idEgreso: mongoose.Types.ObjectId;
  idProducto?: mongoose.Types.ObjectId;
  idAlmacen?: mongoose.Types.ObjectId;

  descripcion: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;

  tipoItem: string; // producto | gasto

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const DetalleEgresoSchema: Schema = new Schema(
  {
    idEgreso: {
      type: Schema.Types.ObjectId,
      ref: "Egreso",
      required: true,
    },

    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
    },

    idAlmacen: {
      type: Schema.Types.ObjectId,
      ref: "Almacen",
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    cantidad: {
      type: Number,
      required: true,
      min: 0,
    },

    costoUnitario: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    tipoItem: {
      type: String,
      required: true,
      enum: ["producto", "gasto","servicio","mantenimiento","otro"],
    },

    // 🔥 Auditoría (STRING como pediste)
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },

    creadoPor: {
      type: String,
      trim: true,
      maxlength: 50,
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
    collection: "detalle_egresos",
  }
);

//  índice compuesto (como PK lógica)
DetalleEgresoSchema.index(
  { idEgreso: 1, idProducto: 1, idAlmacen: 1 },
  { unique: false } // puedes poner true si quieres evitar duplicados
);

// cálculo automático del subtotal
DetalleEgresoSchema.pre("save", function (next) {
  const doc = this as any;

  doc.subtotal = Number(doc.cantidad) * Number(doc.costoUnitario);

  next();
});

const DetalleEgreso = mongoose.model<DetalleEgresoType>(
  "DetalleEgreso",
  DetalleEgresoSchema
);

export default DetalleEgreso;