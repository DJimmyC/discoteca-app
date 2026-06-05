import mongoose, { Schema, Document } from "mongoose";

export interface MovimientoType extends Document {
  fecha: Date;

  tipoMovimiento:
    | "apertura_caja"
    | "cierre_caja"
    | "venta"
    | "venta_anulada"
    | "cortesia"
    | "egreso"
    | "entrada_inventario"
    | "salida_inventario"
    | "transferencia_inventario"
    | "ajuste_inventario"
    | "conteo_fisico"
    | "diferencia_caja"
    | "diferencia_inventario";

  modulo:
    | "caja"
    | "venta"
    | "egreso"
    | "inventario"
    | "transferencia"
    | "cierre";

  idSucursal?: mongoose.Types.ObjectId;
  idCaja?: mongoose.Types.ObjectId;
  idPerfil?: mongoose.Types.ObjectId;
  idAlmacen?: mongoose.Types.ObjectId;
  idProducto?: mongoose.Types.ObjectId;
  idInventario?: mongoose.Types.ObjectId;

  referenciaId?: mongoose.Types.ObjectId;
  referenciaModelo?: string;

  metodoPago?: "efectivo" | "qr" | "transferencia" | "otro" | "mixto";

  cantidadEntrada?: number;
  cantidadSalida?: number;
  cantidadInicial?: number;
  cantidadEsperada?: number;
  cantidadFisica?: number;
  diferenciaCantidad?: number;

  montoEntrada?: number;
  montoSalida?: number;
  montoInicial?: number;
  montoEsperado?: number;
  montoFisico?: number;
  diferenciaMonto?: number;

  costoUnitario?: number;
  precioUnitario?: number;
  subtotal?: number;
  total?: number;

  estado?: string;
  observacion?: string;

  creadoPor?: string;
  fechaCreacion?: Date;
}

const MovimientoSchema = new Schema(
  {
    fecha: {
      type: Date,
      required: true,
      default: Date.now,
    },

    tipoMovimiento: {
      type: String,
      required: true,
      enum: [
        "apertura_caja",
        "cierre_caja",
        "venta",
        "venta_anulada",
        "cortesia",
        "egreso",
        "entrada_inventario",
        "salida_inventario",
        "transferencia_inventario",
        "ajuste_inventario",
        "conteo_fisico",
        "diferencia_caja",
        "diferencia_inventario",
      ],
    },

    modulo: {
      type: String,
      required: true,
      enum: [
        "caja",
        "venta",
        "egreso",
        "inventario",
        "transferencia",
        "cierre",
      ],
    },

    idSucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal",
    },

    idCaja: {
      type: Schema.Types.ObjectId,
      ref: "Caja",
    },

    idPerfil: {
      type: Schema.Types.ObjectId,
      ref: "PerfilUsuario",
    },

    idAlmacen: {
      type: Schema.Types.ObjectId,
      ref: "Almacen",
    },

    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
    },

    idInventario: {
      type: Schema.Types.ObjectId,
      ref: "Inventario",
    },

    referenciaId: {
      type: Schema.Types.ObjectId,
    },

    referenciaModelo: {
      type: String,
    },

    metodoPago: {
      type: String,
      enum: [
        "efectivo",
        "qr",
        "transferencia",
        "otro",
      ],
    },

    cantidadEntrada: {
      type: Number,
      default: 0,
    },

    cantidadSalida: {
      type: Number,
      default: 0,
    },

    cantidadInicial: {
      type: Number,
      default: 0,
    },

    cantidadEsperada: {
      type: Number,
      default: 0,
    },

    cantidadFisica: {
      type: Number,
      default: 0,
    },

    diferenciaCantidad: {
      type: Number,
      default: 0,
    },

    montoEntrada: {
      type: Number,
      default: 0,
    },

    montoSalida: {
      type: Number,
      default: 0,
    },

    montoInicial: {
      type: Number,
      default: 0,
    },

    montoEsperado: {
      type: Number,
      default: 0,
    },

    montoFisico: {
      type: Number,
      default: 0,
    },

    diferenciaMonto: {
      type: Number,
      default: 0,
    },

    costoUnitario: {
      type: Number,
      default: 0,
    },

    precioUnitario: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    estado: {
      type: String,
      default: "activo",
    },

    observacion: {
      type: String,
      trim: true,
    },

    creadoPor: {
      type: String,
      trim: true,
    },

    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    collection: "movimientos",
  }
);

MovimientoSchema.index({
  fecha: 1,
});

MovimientoSchema.index({
  idSucursal: 1,
  fecha: 1,
});

MovimientoSchema.index({
  idCaja: 1,
  fecha: 1,
});

MovimientoSchema.index({
  idPerfil: 1,
  fecha: 1,
});

MovimientoSchema.index({
  idAlmacen: 1,
  fecha: 1,
});

MovimientoSchema.index({
  tipoMovimiento: 1,
  fecha: 1,
});

const Movimiento = mongoose.model<MovimientoType>(
  "Movimiento",
  MovimientoSchema
);

export default Movimiento;