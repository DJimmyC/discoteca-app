// src/types/AperturaCajaType.ts

import { z } from "zod";

export const PerfilAperturaSchema =
  z.object({
    _id: z.string(),
    nombres: z.string().nullable().optional(),
    apellidos: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
  }).passthrough();

export const SucursalAperturaSchema =
  z.object({
    _id: z.string(),
    nombreSucursal: z.string().nullable().optional(),
    ubicacionSucursal: z.string().nullable().optional(),
  }).passthrough();

export const CajaAperturaSchema =
  z.object({
    _id: z.string(),
    idSucursal: z.union([
      z.string(),
      SucursalAperturaSchema,
      z.null(),
    ]).optional(),
    nombre: z.string().nullable().optional(),
    descripcion: z.string().nullable().optional(),
    estado: z.boolean().optional(),
  }).passthrough();

export const EstadoAperturaCajaSchema =
  z.enum([
    "abierta",
    "cerrada",
    "anulada",
  ]);

export const AperturaCajaSchema =
  z.object({
    _id: z.string().optional(),

    idPerfil: z.union([
      z.string(),
      PerfilAperturaSchema,
      z.null(),
    ]),

    idSucursal: z.union([
      z.string(),
      SucursalAperturaSchema,
      z.null(),
    ]),

    idCaja: z.union([
      z.string(),
      CajaAperturaSchema,
      z.null(),
    ]),

    fechaApertura:
      z.string(),

    montoInicial:
      z.coerce.number().min(0),

    estado:
      EstadoAperturaCajaSchema,

    observacion:
      z.string().nullable().optional(),

    creadoPor:
      z.string().nullable().optional(),

    actualizadoPor:
      z.string().nullable().optional(),

    eliminadoPor:
      z.string().nullable().optional(),

    fechaCreacion:
      z.string().nullable().optional(),

    fechaActualizacion:
      z.string().nullable().optional(),

    fechaEliminado:
      z.string().nullable().optional(),
  }).passthrough();

export const AperturaCajaArraySchema =
  z.array(AperturaCajaSchema);

export const CreateAperturaCajaResponseSchema =
  z.object({
    message: z.string(),
    apertura: AperturaCajaSchema,
  }).passthrough();

export type EstadoAperturaCaja =
  z.infer<typeof EstadoAperturaCajaSchema>;

export type AperturaCajaType =
  z.infer<typeof AperturaCajaSchema>;

export type AperturaCajaForm = {
  idPerfil: string;
  idCaja: string;
  fechaApertura: string;
  montoInicial: number;
  observacion?: string;
  creadoPor?: string;
};

export type UpdateAperturaCajaForm = {
  montoInicial?: number;
  observacion?: string;
  actualizadoPor?: string;
};

export type UpdateAperturaCajaType = {
  aperturaCajaId: string;
  formData: UpdateAperturaCajaForm;
};

export type DeleteAperturaCajaType = {
  id: string;
  eliminadoPor?: string;
};
/* =========================
    APERTURAS ACTIVAS
    POR SUCURSAL
========================= */

export const AperturaCajaActivaArraySchema =
  AperturaCajaArraySchema;

export type AperturaCajaActivaType =
  z.infer<typeof AperturaCajaSchema>;

export type CajaAbiertaOptionType = {
  _id: string;
  nombre: string;
  descripcion?: string;
  idAperturaCaja: string;
  fechaApertura: string;
  montoInicial: number;
};