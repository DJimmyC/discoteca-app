// src/api/CierreCajaApi.ts

import api from "@/lib/axios";
import { isAxiosError } from "axios";

import {
  CierreCajaArraySchema,
  CierreCajaSchema,
  ReporteCierreCajaSchema,
  type CierreCajaForm,
  type UpdateCierreCajaType,
  type DeleteCierreCajaType,
} from "@/types/CierreCajaType";

/* =====================================================
    UTILIDAD PARA MANEJAR ERRORES
===================================================== */

function mensajeError(
  error: unknown,
  predeterminado: string
): string {
  if (
    isAxiosError(error) &&
    error.response
  ) {
    return (
      error.response.data?.error ||
      error.response.data?.message ||
      predeterminado
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return predeterminado;
}

/* =====================================================
    PREVIEW CIERRE DE CAJA
    NO CIERRA LA CAJA, SOLO GENERA EL REPORTE
===================================================== */

export async function previewCierreCaja({
  cajaId,
  idSucursal,
  idPerfil,
  montoReal,
  fechaCierre,
}: {
  cajaId: string;
  idSucursal: string;
  idPerfil: string;
  montoReal?: number;
  fechaCierre?: string;
}) {
  try {
    const params =
      new URLSearchParams();

    params.append(
      "idSucursal",
      idSucursal
    );

    params.append(
      "idPerfil",
      idPerfil
    );

    if (
      montoReal !== undefined &&
      montoReal !== null
    ) {
      params.append(
        "montoReal",
        String(montoReal)
      );
    }

    if (fechaCierre) {
      params.append(
        "fechaCierre",
        fechaCierre
      );
    }

    const { data } =
      await api.get(
        `/cierrecaja/preview/${cajaId}?${params.toString()}`
      );

    /*
      Si tu schema todavía no está actualizado,
      puedes retornar data directo.
      Pero dejamos validación flexible.
    */
    const response =
      ReporteCierreCajaSchema.safeParse(
        data
      );

    if (!response.success) {
      console.warn(
        "Advertencia Zod preview cierre:",
        response.error.format(),
        data
      );

      return data;
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error generando preview del cierre"
      )
    );
  }
}

/* =====================================================
    CREAR CIERRE DE CAJA
    CIERRA LA CAJA DEFINITIVAMENTE
===================================================== */

export async function createCierreCaja(
  formData: CierreCajaForm
) {
  try {
    const { data } =
      await api.post(
        "/cierrecaja",
        formData
      );

    /*
      Si el backend devuelve el reporte centralizado completo,
      puede que Zod falle si el schema no está actualizado.
      Por eso hacemos validación no bloqueante.
    */
    const response =
      ReporteCierreCajaSchema.safeParse(
        data
      );

    if (!response.success) {
      console.warn(
        "Advertencia Zod reporte cierre:",
        response.error.format(),
        data
      );

      return data;
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error creando cierre"
      )
    );
  }
}

/* =====================================================
    OBTENER TODOS LOS CIERRES
===================================================== */

export async function getAllCierreCaja() {
  try {
    const { data } =
      await api.get(
        "/cierrecaja"
      );

    const response =
      CierreCajaArraySchema.safeParse(
        data
      );

    if (!response.success) {
      console.warn(
        "Advertencia Zod cierres:",
        response.error.format(),
        data
      );

      return data;
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo cierres"
      )
    );
  }
}

/* =====================================================
    OBTENER CIERRE POR ID
===================================================== */

export async function getCierreCajaById(
  id: string
) {
  try {
    const { data } =
      await api.get(
        `/cierrecaja/${id}`
      );

    const response =
      CierreCajaSchema.safeParse(
        data
      );

    if (!response.success) {
      console.warn(
        "Advertencia Zod cierre:",
        response.error.format(),
        data
      );

      return data;
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo cierre"
      )
    );
  }
}

/* =====================================================
    OBTENER CIERRES POR CAJA
===================================================== */

export async function getCierreCajaByCajaId(
  cajaId: string
) {
  try {
    const { data } =
      await api.get(
        `/cierrecaja/caja/${cajaId}`
      );

    const response =
      CierreCajaArraySchema.safeParse(
        data
      );

    if (!response.success) {
      console.warn(
        "Advertencia Zod cierres por caja:",
        response.error.format(),
        data
      );

      return data;
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo cierres por caja"
      )
    );
  }
}

/* =====================================================
    ACTUALIZAR CIERRE DE CAJA
    SOLO SI TODAVÍA USAS ESTA RUTA
===================================================== */

export async function updateCierreCaja({
  cierreCajaId,
  formData,
}: UpdateCierreCajaType) {
  try {
    const { data } =
      await api.put(
        `/cierrecaja/${cierreCajaId}`,
        formData
      );

    return data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error actualizando cierre"
      )
    );
  }
}

/* =====================================================
    ANULAR CIERRE DE CAJA
    USA PATCH /:id/anular
===================================================== */

export async function deleteCierreCajaById({
  id,
  motivo,
  eliminadoPor,
}: DeleteCierreCajaType) {
  try {
    const { data } =
      await api.patch(
        `/cierrecaja/${id}/anular`,
        {
          observacion:
            motivo ||
            "Cierre anulado.",
          eliminadoPor:
            eliminadoPor ||
            "sistema",
        }
      );

    return data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error anulando cierre"
      )
    );
  }
}
export async function getReporteCierreCajaById(
  id: string
) {
  try {
    const { data } =
      await api.get(
        `/cierrecaja/${id}/reporte`
      );

    const response =
      ReporteCierreCajaSchema.safeParse(
        data
      );

    if (!response.success) {
      console.warn(
        "Advertencia Zod reporte cierre detalle:",
        response.error.format(),
        data
      );

      return data;
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo reporte del cierre"
      )
    );
  }
}
/* =====================================================
    ALIAS OPCIONAL
    Por si en alguna parte de tu frontend usas otro nombre
===================================================== */

export const anularCierreCajaById =
  deleteCierreCajaById;