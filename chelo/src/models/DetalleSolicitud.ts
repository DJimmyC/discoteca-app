// src/models/DetalleSolicitud.ts

import mongoose, {
  Schema,
  Document,
} from "mongoose";

export type EstadoDetalleSolicitud =
  | "pendiente"
  | "aprobado"
  | "parcial"
  | "atendido"
  | "rechazado"
  | "anulado";

export interface DetalleSolicitudType
  extends Document {

  idSolicitud:
    mongoose.Types.ObjectId;

  idProducto:
    mongoose.Types.ObjectId;

  cantidadSolicitada:
    number;

  cantidadAprobada:
    number;

  cantidadAtendida:
    number;

  unidad:
    string;

  estado:
    EstadoDetalleSolicitud;

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

const DetalleSolicitudSchema =
  new Schema<DetalleSolicitudType>(
    {

      idSolicitud: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Solicitud",

        required:
          true,
      },

      idProducto: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Producto",

        required:
          true,
      },

      cantidadSolicitada: {
        type:
          Number,

        required:
          true,

        min:
          1,
      },

      cantidadAprobada: {
        type:
          Number,

        required:
          true,

        default:
          0,

        min:
          0,
      },

      cantidadAtendida: {
        type:
          Number,

        required:
          true,

        default:
          0,

        min:
          0,
      },

      unidad: {
        type:
          String,

        trim:
          true,

        default:
          "unidad",

        maxlength:
          30,
      },

      estado: {
        type:
          String,

        required:
          true,

        enum: [
          "pendiente",
          "aprobado",
          "parcial",
          "atendido",
          "rechazado",
          "anulado",
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
        "detalle_solicitudes",
    }
  );

/* =========================
    VALIDACIONES
========================= */

DetalleSolicitudSchema.pre(
  "validate",
  function (next) {

    const solicitada =
      Number(
        this.cantidadSolicitada ||
        0
      );

    const aprobada =
      Number(
        this.cantidadAprobada ||
        0
      );

    const atendida =
      Number(
        this.cantidadAtendida ||
        0
      );

    if (
      solicitada <= 0
    ) {

      return next(
        new Error(
          "La cantidad solicitada debe ser mayor a cero"
        )
      );

    }

    if (
      aprobada < 0 ||
      atendida < 0
    ) {

      return next(
        new Error(
          "Las cantidades no pueden ser negativas"
        )
      );

    }

    if (
      aprobada >
      solicitada
    ) {

      return next(
        new Error(
          "La cantidad aprobada no puede ser mayor a la solicitada"
        )
      );

    }

    /*
      Si todavía no se aprobó una cantidad,
      la cantidad atendida se compara contra
      la solicitada.
    */
    const limiteAtencion =
      aprobada > 0
        ? aprobada
        : solicitada;

    if (
      atendida >
      limiteAtencion
    ) {

      return next(
        new Error(
          "La cantidad atendida no puede ser mayor a la cantidad aprobada"
        )
      );

    }

    next();

  }
);

/* =========================
    EVITAR PRODUCTO DUPLICADO
========================= */

DetalleSolicitudSchema.index(
  {
    idSolicitud:
      1,

    idProducto:
      1,
  },
  {
    unique:
      true,
  }
);

DetalleSolicitudSchema.index({
  idSolicitud:
    1,

  estado:
    1,
});

const DetalleSolicitud =
  mongoose.model<DetalleSolicitudType>(
    "DetalleSolicitud",
    DetalleSolicitudSchema
  );

export default DetalleSolicitud;