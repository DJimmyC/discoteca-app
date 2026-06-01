import mongoose, {
  Schema,
  Document,
} from "mongoose";

/* =========================
    TIPOS
========================= */

export type TipoMovimientoInventario =
  | "entrada_compra"
  | "salida_venta"
  | "salida_transferencia"
  | "entrada_transferencia"
  | "ajuste_entrada"
  | "ajuste_salida"
  | "merma"
  | "devolucion"
  | "anulacion_venta";

export type OrigenMovimientoInventario =
  | "venta"
  | "egreso"
  | "solicitud"
  | "transferencia"
  | "ajuste_manual"
  | "merma"
  | "devolucion"
  | "sistema";

/* =========================
    INTERFACE
========================= */

export interface MovimientoInventarioType extends Document {
  codigoMovimiento?: string;

  /* =========================
      RELACIONES PRINCIPALES
  ========================= */

  idSucursal: mongoose.Types.ObjectId;
  idProducto: mongoose.Types.ObjectId;
  idAlmacen: mongoose.Types.ObjectId;

  /* =========================
      RELACIONES PARA REPORTES
  ========================= */

  idCaja?: mongoose.Types.ObjectId | null;
  idPerfil?: mongoose.Types.ObjectId | null;

  /* =========================
      ORIGEN DEL MOVIMIENTO
  ========================= */

  idVenta?: mongoose.Types.ObjectId | null;
  idDetalleVenta?: mongoose.Types.ObjectId | null;

  idEgreso?: mongoose.Types.ObjectId | null;
  idDetalleEgreso?: mongoose.Types.ObjectId | null;

  idSolicitud?: mongoose.Types.ObjectId | null;
  idDetalleSolicitud?: mongoose.Types.ObjectId | null;

  idTransferencia?: mongoose.Types.ObjectId | null;

  /* =========================
      DATOS DEL MOVIMIENTO
  ========================= */

  tipoMovimiento: TipoMovimientoInventario;
  origenMovimiento: OrigenMovimientoInventario;

  cantidad: number;

  costoUnitario?: number;
  precioVenta?: number;

  totalCosto?: number;
  totalVenta?: number;

  stockAnterior?: number;
  stockNuevo?: number;

  fechaMovimiento: Date;
  observacion?: string;

  /* =========================
      AUDITORÍA
  ========================= */

  creadoPor: string;
  actualizadoPor?: string;
  eliminadoPor?: string;

  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  fechaEliminado?: Date;
}

/* =========================
    SCHEMA
========================= */

const MovimientoInventarioSchema: Schema =
  new Schema(
    {
      codigoMovimiento: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
      },

      /* =========================
          RELACIONES PRINCIPALES
      ========================= */

      idSucursal: {
        type: Schema.Types.ObjectId,
        ref: "Sucursal",
        required: true,
        index: true,
      },

      idProducto: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
        index: true,
      },

      idAlmacen: {
        type: Schema.Types.ObjectId,
        ref: "Almacen",
        required: true,
        index: true,
      },

      /* =========================
          RELACIONES PARA REPORTES
      ========================= */

      idCaja: {
        type: Schema.Types.ObjectId,
        ref: "Caja",
        default: null,
        index: true,
      },

      idPerfil: {
        type: Schema.Types.ObjectId,
        ref: "PerfilUsuario",
        default: null,
        index: true,
      },

      /* =========================
          ORIGEN DEL MOVIMIENTO
      ========================= */

      idVenta: {
        type: Schema.Types.ObjectId,
        ref: "Venta",
        default: null,
        index: true,
      },

      idDetalleVenta: {
        type: Schema.Types.ObjectId,
        ref: "DetalleVenta",
        default: null,
        index: true,
      },

      idEgreso: {
        type: Schema.Types.ObjectId,
        ref: "Egreso",
        default: null,
        index: true,
      },

      idDetalleEgreso: {
        type: Schema.Types.ObjectId,
        ref: "DetalleEgreso",
        default: null,
        index: true,
      },

      idSolicitud: {
        type: Schema.Types.ObjectId,
        ref: "Solicitud",
        default: null,
        index: true,
      },

      idDetalleSolicitud: {
        type: Schema.Types.ObjectId,
        ref: "DetalleSolicitud",
        default: null,
        index: true,
      },

      idTransferencia: {
        type: Schema.Types.ObjectId,
        ref: "TransferenciaInventario",
        default: null,
        index: true,
      },

      /* =========================
          TIPO Y ORIGEN
      ========================= */

      tipoMovimiento: {
        type: String,
        required: true,
        enum: [
          "entrada_compra",
          "salida_venta",
          "salida_transferencia",
          "entrada_transferencia",
          "ajuste_entrada",
          "ajuste_salida",
          "merma",
          "devolucion",
          "anulacion_venta",
        ],
        index: true,
      },

      origenMovimiento: {
        type: String,
        required: true,
        enum: [
          "venta",
          "egreso",
          "solicitud",
          "transferencia",
          "ajuste_manual",
          "merma",
          "devolucion",
          "sistema",
        ],
        index: true,
      },

      /* =========================
          CANTIDADES Y VALORES
      ========================= */

      cantidad: {
        type: Number,
        required: true,
        min: [
          0.01,
          "La cantidad debe ser mayor a 0",
        ],
      },

      costoUnitario: {
        type: Number,
        default: 0,
        min: 0,
      },

      precioVenta: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalCosto: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalVenta: {
        type: Number,
        default: 0,
        min: 0,
      },

      stockAnterior: {
        type: Number,
        default: 0,
        min: 0,
      },

      stockNuevo: {
        type: Number,
        default: 0,
        min: 0,
      },

      fechaMovimiento: {
        type: Date,
        default: Date.now,
        index: true,
      },

      observacion: {
        type: String,
        trim: true,
        maxlength: 250,
      },

      /* =========================
          AUDITORÍA
      ========================= */

      creadoPor: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      actualizadoPor: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      eliminadoPor: {
        type: String,
        trim: true,
        maxlength: 100,
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
    },
    {
      timestamps: false,
    }
  );

/* =========================
    ÍNDICES PARA REPORTES
========================= */

MovimientoInventarioSchema.index({
  idSucursal: 1,
  fechaMovimiento: -1,
});

MovimientoInventarioSchema.index({
  idAlmacen: 1,
  idProducto: 1,
  fechaMovimiento: -1,
});

MovimientoInventarioSchema.index({
  idProducto: 1,
  fechaMovimiento: -1,
});

MovimientoInventarioSchema.index({
  idPerfil: 1,
  fechaMovimiento: -1,
});

MovimientoInventarioSchema.index({
  idCaja: 1,
  fechaMovimiento: -1,
});

MovimientoInventarioSchema.index({
  tipoMovimiento: 1,
  fechaMovimiento: -1,
});

MovimientoInventarioSchema.index({
  origenMovimiento: 1,
  fechaMovimiento: -1,
});

/* =========================
    VALIDACIÓN DE COHERENCIA
========================= */

MovimientoInventarioSchema.pre(
  "save",
  function (
    this: MovimientoInventarioType,
    next
  ) {
    if (this.cantidad <= 0) {
      return next(
        new Error(
          "La cantidad debe ser mayor a 0"
        )
      );
    }

    if (!this.codigoMovimiento) {
      this.codigoMovimiento =
        `MOV-${Date.now()}`;
    }

    this.totalCosto =
      Number(this.cantidad || 0) *
      Number(this.costoUnitario || 0);

    this.totalVenta =
      Number(this.cantidad || 0) *
      Number(this.precioVenta || 0);

    /*
      Validación suave:
      según el origen, al menos debería venir
      el ID correspondiente.
    */

    if (
      this.origenMovimiento === "venta" &&
      !this.idVenta &&
      !this.idDetalleVenta
    ) {
      return next(
        new Error(
          "Un movimiento de venta debe tener idVenta o idDetalleVenta"
        )
      );
    }

    if (
      this.origenMovimiento === "egreso" &&
      !this.idEgreso &&
      !this.idDetalleEgreso
    ) {
      return next(
        new Error(
          "Un movimiento de egreso debe tener idEgreso o idDetalleEgreso"
        )
      );
    }

    if (
      this.origenMovimiento === "solicitud" &&
      !this.idSolicitud &&
      !this.idDetalleSolicitud
    ) {
      return next(
        new Error(
          "Un movimiento de solicitud debe tener idSolicitud o idDetalleSolicitud"
        )
      );
    }

    next();
  }
);

export default mongoose.model<MovimientoInventarioType>(
  "MovimientoInventario",
  MovimientoInventarioSchema
);