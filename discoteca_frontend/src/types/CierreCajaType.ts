// src/types/CierreCajaType.ts

import { z } from "zod";

export const PerfilCierreSchema =
  z.object({
    _id: z.string(),
    nombres: z.string().nullable().optional(),
    apellidos: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
  }).passthrough();

export const SucursalCierreSchema =
  z.object({
    _id: z.string(),
    nombreSucursal: z.string().nullable().optional(),
    ubicacionSucursal: z.string().nullable().optional(),
  }).passthrough();

export const CajaCierreSchema =
  z.object({
    _id: z.string(),
    nombre: z.string().nullable().optional(),
    descripcion: z.string().nullable().optional(),
  }).passthrough();

export const AperturaCierreSchema =
  z.object({
    _id: z.string(),
    fechaApertura: z.string().optional(),
    montoInicial: z.coerce.number().optional(),
    estado: z.string().optional(),
  }).passthrough();

export const EstadoCierreCajaSchema =
  z.enum([
    "cuadrado",
    "sobrante",
    "faltante",
    "anulado",
  ]);

export const CierreCajaSchema =
  z.object({
    _id: z.string().optional(),

    idAperturaCaja: z.union([
      z.string(),
      AperturaCierreSchema,
      z.null(),
    ]),

    idPerfil: z.union([
      z.string(),
      PerfilCierreSchema,
      z.null(),
    ]),

    idSucursal: z.union([
      z.string(),
      SucursalCierreSchema,
      z.null(),
    ]),

    idCaja: z.union([
      z.string(),
      CajaCierreSchema,
      z.null(),
    ]),

    fechaApertura: z.string(),
    fechaCierre: z.string(),

    montoInicial: z.coerce.number(),
    totalVentas: z.coerce.number(),
    totalVentasEfectivo: z.coerce.number(),
    totalVentasQr: z.coerce.number(),
    totalVentasTransferencia: z.coerce.number(),
    totalVentasMixto: z.coerce.number(),
    totalCortesias: z.coerce.number(),
    totalVentasAnuladas: z.coerce.number(),

    totalEgresos: z.coerce.number(),
    totalEgresosEfectivo: z.coerce.number(),

    totalEsperadoEfectivo: z.coerce.number(),
    montoReal: z.coerce.number(),
    diferencia: z.coerce.number(),

    cantidadVentas: z.coerce.number(),
    cantidadProductosVendidos: z.coerce.number(),
    cantidadEgresos: z.coerce.number(),

    estado: EstadoCierreCajaSchema,

    observacion: z.string().nullable().optional(),

    creadoPor: z.string().nullable().optional(),
    actualizadoPor: z.string().nullable().optional(),
    eliminadoPor: z.string().nullable().optional(),

    fechaCreacion: z.string().nullable().optional(),
    fechaActualizacion: z.string().nullable().optional(),
    fechaEliminado: z.string().nullable().optional(),
  }).passthrough();

export const CierreCajaArraySchema =
  z.array(CierreCajaSchema);

export const ProductoVendidoCierreSchema =
  z.object({
    idProducto: z.string(),
    nombre: z.string(),
    marca: z.string().optional(),
    cantidadVendida: z.coerce.number(),
    precioPromedio: z.coerce.number(),
    totalVendido: z.coerce.number(),
  }).passthrough();

export const ReporteCierreCajaSchema =
  z.object({
    message: z.string(),
    cierre: CierreCajaSchema,

    jornada: z.object({
      fechaApertura: z.string(),
      fechaCierre: z.string(),
      duracionMinutos: z.coerce.number(),
    }).passthrough(),

    resumen: z.object({
      cantidadVentas: z.coerce.number(),
      cantidadProductosVendidos: z.coerce.number(),
      cantidadEgresos: z.coerce.number(),

      totalVentas: z.coerce.number(),
      totalVentasEfectivo: z.coerce.number(),
      totalVentasQr: z.coerce.number(),
      totalVentasTransferencia: z.coerce.number(),
      totalVentasMixto: z.coerce.number(),

      totalCortesias: z.coerce.number(),
      totalVentasAnuladas: z.coerce.number(),

      totalEgresos: z.coerce.number(),
      totalEgresosEfectivo: z.coerce.number(),

      montoInicial: z.coerce.number(),
      totalEsperadoEfectivo: z.coerce.number(),
      montoReal: z.coerce.number(),
      diferencia: z.coerce.number(),

      estado: EstadoCierreCajaSchema,
    }).passthrough(),

    productosVendidos:
      z.array(ProductoVendidoCierreSchema),

    ventas:
      z.array(z.record(z.unknown())),

    egresos:
      z.array(z.record(z.unknown())),
  }).passthrough();

export type CierreCajaType =
  z.infer<typeof CierreCajaSchema>;

export type ReporteCierreCajaType =
  z.infer<typeof ReporteCierreCajaSchema>;

export type CierreCajaForm = {
  idPerfil: string;
  idCaja: string;

  /*
    Puede enviarse fechaCierre completa
    o la combinación fecha + horaCierre.
  */
  fechaCierre?: string;
  fecha?: string;
  horaCierre?: string;

  montoReal: number;
  observacion?: string;
  creadoPor?: string;
};

export type UpdateCierreCajaForm = {
  observacion?: string;
  actualizadoPor?: string;
};

export type UpdateCierreCajaType = {
  cierreCajaId: string;
  formData: UpdateCierreCajaForm;
};

export type DeleteCierreCajaType = {
  id: string;
  motivo: string;
  eliminadoPor?: string;
};
