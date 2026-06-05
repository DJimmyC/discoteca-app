import mongoose, { Schema, Document } from "mongoose";

export interface PerfilUsuarioType extends Document {

  idRol: mongoose.Types.ObjectId;
  idSucursal: mongoose.Types.ObjectId;
  idAlmacen: mongoose.Types.ObjectId;

  nombres: string;
  apellidos: string;
  edad?: number;
  sexo?: string;
  ci?: string;
  telefono?: string;
  email?: string;
  password: string;
  estado: boolean;

  fechaCreacion?: Date;
  creadoPor?: string;
  fechaActualizacion?: Date;
  actualizadoPor?: string;
  fechaEliminado?: Date;
  eliminadoPor?: string;
}

const PerfilUsuarioSchema: Schema = new Schema(
  {

    idRol: {
      type: Schema.Types.ObjectId,
      ref: "Rol",
      required: true,
    },
    idSucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal",
      required: true,
    },

    idAlmacen: {
      type: Schema.Types.ObjectId,
      ref: "Almacen",
      required: true,
    },

    nombres: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    apellidos: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    edad: {
      type: Number,
    },

    sexo: {
      type: String,
      trim: true,
      maxlength: 10,
    },

    ci: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    telefono: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },

    password: {
      type: String,
      required: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },

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
    collection: "perfil_usuarios",
  }
);



const PerfilUsuario = mongoose.model<PerfilUsuarioType>("PerfilUsuario", PerfilUsuarioSchema);

export default PerfilUsuario;