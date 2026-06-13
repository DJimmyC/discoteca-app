import { z } from "zod";

/* =========================
   ROL SCHEMA
========================= */

export const RolSchema = z
  .object({
    _id: z.string().optional(),

    nombre: z.string().optional(),

    descripcion: z
      .string()
      .nullable()
      .optional(),

    estado: z.boolean().optional(),

    ventas: z.boolean().optional(),

    egresos: z.boolean().optional(),

    inventario: z.boolean().optional(),

    reportes: z.boolean().optional(),

    usuarios: z.boolean().optional(),

    configuracion: z.boolean().optional(),

    creadoPor: z
      .string()
      .nullable()
      .optional(),

    actualizadoPor: z
      .string()
      .nullable()
      .optional(),

    eliminadoPor: z
      .string()
      .nullable()
      .optional(),

    fechaCreacion: z
      .string()
      .nullable()
      .optional(),

    fechaActualizacion: z
      .string()
      .nullable()
      .optional(),

    fechaEliminado: z
      .string()
      .nullable()
      .optional(),
  })
  .passthrough();

/* =========================
   ARRAY
========================= */

export const RolArraySchema =
  z.array(RolSchema);

/* =========================
   RESPUESTA
========================= */

export type RolType =
  z.infer<typeof RolSchema>;

/* =========================
   FORMULARIO
========================= */

export type RolFormData = {
  nombre: string;

  descripcion: string;

  estado: boolean;

  ventas: boolean;

  egresos: boolean;

  inventario: boolean;

  reportes: boolean;

  usuarios: boolean;

  configuracion: boolean;

  creadoPor?: string;

  actualizadoPor?: string;
};

/* =========================
   ACTUALIZAR
========================= */

export type UpdateRolType = {
  rolId: string;

  formData: RolFormData;
};

/* =========================
   ELIMINAR
========================= */

export type DeleteRolType = {
  id: string;

  eliminadoPor?: string;
};