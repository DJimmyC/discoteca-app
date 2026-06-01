import mongoose, { Schema, Document } from "mongoose";

export interface RolType extends Document {
  nombre: string;
  descripcion?: string;
  estado: boolean;
  ventas: boolean;
  egresos: boolean;
  inventario: boolean;
  reportes: boolean;
  usuarios: boolean;
  configuracion: boolean;
  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const RolSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    ventas: {
      type: Boolean,
      default: false,
    },
    egresos: {
      type: Boolean,
      default: false,
    },
    inventario: {
      type: Boolean,
      default: false,
    },
    reportes: {
      type: Boolean,
      default: false,
    },
    usuarios: {
      type: Boolean,
      default: false,
    },
    configuracion: {
      type: Boolean,
      default: false,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    creadoPor: {
      type: String,
      trim: true,
      maxlength: 10,
    },
    fechaActualizacion: {
      type: Date,
    },
    actualizadoPor: {
      type: String,
      trim: true,
      maxlength: 10,
    },
    fechaEliminado: {
      type: Date,
    },
    eliminadoPor: {
      type: String,
      trim: true,
      maxlength: 10,
    },
  },
  {
    versionKey: false,
    collection: "roles",
  }
);

const Rol = mongoose.model<RolType>("Rol", RolSchema);

export default Rol;