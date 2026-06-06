// src/models/Solicitud.ts

import mongoose, {
  Schema,
  Document,
} from "mongoose";

export type EstadoSolicitud =
  | "pendiente"
  | "aprobada"
  | "parcialmente_atendida"
  | "atendida"
  | "rechazada"
  | "anulada";

export interface SolicitudType
  extends Document {

  idPerfil:
    mongoose.Types.ObjectId;

  idSucursal:
    mongoose.Types.ObjectId;

  /*
    Es opcional para permitir una compra externa.

    Traslado interno:
    origen + destino

    Compra externa:
    solamente destino
  */
  idAlmacenOrigen?:
    mongoose.Types.ObjectId | null;

  idAlmacenDestino:
    mongoose.Types.ObjectId;

  fechaSolicitud:
    Date;

  estado:
    EstadoSolicitud;

  observacion?:
    string;

  fechaCreacion?:
    Date;

  creadoPor?:
    string;

  fechaActualizacion?:
    Date;

  actualizadoPor?:
    string;

  fechaEliminado?:
    Date;

  eliminadoPor?:
    string;

}

const SolicitudSchema =
  new Schema<SolicitudType>(
    {

      idPerfil: {
        type:
          Schema.Types.ObjectId,

        ref:
          "PerfilUsuario",

        required:
          true,
      },

      idSucursal: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Sucursal",

        required:
          true,
      },

      idAlmacenOrigen: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Almacen",

        required:
          false,

        default:
          null,
      },

      idAlmacenDestino: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Almacen",

        required:
          true,
      },

      fechaSolicitud: {
        type:
          Date,

        required:
          true,

        default:
          Date.now,
      },

      estado: {
        type:
          String,

        required:
          true,

        enum: [
          "pendiente",
          "aprobada",
          "parcialmente_atendida",
          "atendida",
          "rechazada",
          "anulada",
        ],

        default:
          "pendiente",
      },

      observacion: {
        type:
          String,

        trim:
          true,

        maxlength:
          200,

        default:
          "",
      },

      fechaCreacion: {
        type:
          Date,

        default:
          Date.now,
      },

      creadoPor: {
        type:
          String,

        trim:
          true,

        maxlength:
          100,
      },

      fechaActualizacion: {
        type:
          Date,
      },

      actualizadoPor: {
        type:
          String,

        trim:
          true,

        maxlength:
          100,
      },

      fechaEliminado: {
        type:
          Date,
      },

      eliminadoPor: {
        type:
          String,

        trim:
          true,

        maxlength:
          100,
      },

    },
    {
      versionKey:
        false,

      collection:
        "solicitudes",
    }
  );

/* =========================
    VALIDAR ALMACENES
========================= */

SolicitudSchema.pre(
  "validate",
  function (next) {

    if (
      this.idAlmacenOrigen &&
      this.idAlmacenDestino &&
      this.idAlmacenOrigen
        .toString() ===
        this.idAlmacenDestino
          .toString()
    ) {

      return next(
        new Error(
          "El almacén origen y destino no pueden ser iguales"
        )
      );

    }

    next();

  }
);

/* =========================
    ÍNDICES
========================= */

SolicitudSchema.index({
  idPerfil:
    1,

  idSucursal:
    1,

  fechaSolicitud:
    -1,
});

SolicitudSchema.index({
  idSucursal:
    1,

  estado:
    1,

  fechaSolicitud:
    -1,
});

const Solicitud =
  mongoose.model<SolicitudType>(
    "Solicitud",
    SolicitudSchema
  );

export default Solicitud;