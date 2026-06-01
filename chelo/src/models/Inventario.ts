import mongoose, { Schema, Document } from "mongoose";

export interface Inventario extends Document {

  idAlmacen: mongoose.Types.ObjectId;
  idProducto: mongoose.Types.ObjectId;

  cantidad: number;
  costoUnitario: number;
  precioVenta: number;
  stockMinimo: number;

  estado: boolean;

  fechaCreacion: Date;
  fechaActualizacion?: Date;
  fechaEliminado?: Date;

  creadoPor: string;
  actualizadoPor?: string;
  eliminadoPor?: string;
}

const InventarioSchema: Schema = new Schema(
  {
   

    idAlmacen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Almacen",
      required: true,
    },

    idProducto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },

    cantidad: {
      type: Number,
      required: true,
      default: 0,
    },

    costoUnitario: {
      type: Number,
      required: true,
      default: 0,
    },

    precioVenta: {
      type: Number,
      required: true,
      default: 0,
    },

    stockMinimo: {
      type: Number,
      default: 0,
    },

    estado: {
      type: Boolean,
      default: true,
    },

    fechaCreacion: {
      type: Date,
      default: Date.now,
    },

    fechaActualizacion: {
      type: Date,
    },

    fechaEliminado: {
      type: Date,
    },

    
    creadoPor: {
      type: String,
      required: true,
    },

    actualizadoPor: {
      type: String,
    },

    eliminadoPor: {
      type: String,
    },
  },
  {
    timestamps: false, // tú ya manejas fechas manual
  }
);

//  Índice compuesto (IMPORTANTE)
InventarioSchema.index(
  { idAlmacen: 1, idProducto: 1 },
  { unique: true }
);

export default mongoose.model<Inventario>(
  "Inventario",
  InventarioSchema
);