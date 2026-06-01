import { z } from "zod";

/* =========================
    ROL SCHEMA
========================= */

export const RolSchema = z.object({

  _id: z.string().optional(),

  nombre: z.string(),

  descripcion: z.string(),

  estado: z.boolean(),

  ventas: z.boolean(),

  egresos: z.boolean(),

  inventario: z.boolean(),

  reportes: z.boolean(),

  usuarios: z.boolean(),

  configuracion: z.boolean(),

  creadoPor: z.string(),

  fechaCreacion:
    z.string().optional(),

  actualizadoPor:
    z.string().optional(),

  fechaActualizacion:
    z.string().optional(),

  eliminadoPor:
    z.string().optional(),

  fechaEliminado:
    z.string().optional(),

});

/* =========================
    ARRAY SCHEMA
========================= */

export const RolArraySchema =
  z.array(RolSchema);

/* =========================
    TYPES
========================= */

export type RolType = z.infer<
  typeof RolSchema
>;

export type RolFormData = Pick<
  RolType,
  | "nombre"
  | "descripcion"
  | "estado"
  | "ventas"
  | "egresos"
  | "inventario"
  | "reportes"
  | "usuarios"
  | "configuracion"
  | "creadoPor"
>;