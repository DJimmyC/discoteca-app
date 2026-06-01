// import {z} from "zod"

// export const sucursalSchema = z.object({
//   _id: z.string().optional(), // MongoDB ObjectId como string
//   nombreSucursal: z
//     .string()
//     .min(1, "El nombre de la sucursal es obligatorio"),

//   ubicacionSucursal: z
//     .string()
//     .min(1, "La ubicación es obligatoria"),

//   us_creado: z
//     .string()
//     .min(1, "El usuario creador es obligatorio"),

//   us_modificado: z.string().optional(),
//   us_eliminado: z.string().optional(),

//   fecha_creado: z
//     .string()
//     .min(1, "La fecha de creación es obligatoria")
//     .refine((val) => !isNaN(Date.parse(val)), {
//       message: "La fecha debe ser válida"
//     })


//   ,
//   fecha_modificado: z.string().nullable().optional(),
//   fecha_eliminado: z.string().nullable().optional(),
// });
// export const dashboardSucursalSchema = z.array(
//   sucursalSchema.pick({
//     _id: true,
//     nombreSucursal: true,

//     ubicacionSucursal: true,
//     us_creado: true,
//     us_modificado: true,
//     us_eliminado: true,

//     fecha_creado: true,


//     fecha_modificado: true,
//     fecha_eliminado: true,

//   })
// )
// export type SucursalSchemaType = z.infer<typeof sucursalSchema>;
// export type SucursalFormData = Pick<SucursalSchemaType, 'nombreSucursal' | 'ubicacionSucursal' | 'us_creado' | 'us_modificado' | 'us_eliminado' | 'fecha_creado' | 'fecha_modificado' | 'fecha_eliminado'>

import { z } from "zod"

/* =========================
    SCHEMA
========================= */
export const SucursalSchema = z.object({
  _id: z.string().optional(),

  nombreSucursal: z
    .string()
    .min(1, "El nombre de la sucursal es obligatorio"),

  ubicacionSucursal: z
    .string()
    .min(1, "La ubicación es obligatoria"),

  us_creado: z
    .string()
    .min(1, "Usuario creador obligatorio"),

  us_modificado: z.string().optional(),
  us_eliminado: z.string().optional(),

  fecha_creado: z.string().optional(),
  fecha_modificado: z.string().nullable().optional(),
  fecha_eliminado: z.string().nullable().optional(),
})

/* =========================
    ARRAY (LISTADO)
========================= */
export const SucursalArraySchema = z.array(
  SucursalSchema.pick({
    _id: true,
    nombreSucursal: true,
    ubicacionSucursal: true,
    us_creado: true,
    fecha_creado: true
  })
)

/* =========================
    TYPES
========================= */
export type SucursalType = z.infer<typeof SucursalSchema>

/* =========================
    FORM DATA
========================= */
export type SucursalFormData = Pick<
  SucursalType,
  "nombreSucursal" | "ubicacionSucursal" | "us_creado" | "fecha_creado" | "us_modificado" |"fecha_modificado"
>