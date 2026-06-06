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

export async function createCierreCaja(
  formData: CierreCajaForm
) {

  try {

    const { data } =
      await api.post(
        "/cierrecaja",
        formData
      );

    const response =
      ReporteCierreCajaSchema.safeParse(
        data
      );

    if (!response.success) {
      console.error(
        "Error Zod reporte cierre:",
        response.error.format(),
        data
      );

      throw new Error(
        "La respuesta del cierre no coincide con el type"
      );
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
      console.error(
        response.error.format(),
        data
      );

      throw new Error(
        "Error validando cierres"
      );
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
      console.error(
        response.error.format(),
        data
      );

      throw new Error(
        "Error validando cierre"
      );
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
      console.error(
        response.error.format(),
        data
      );

      throw new Error(
        "Error validando cierres por caja"
      );
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

export async function deleteCierreCajaById({
  id,
  motivo,
  eliminadoPor,
}: DeleteCierreCajaType) {

  try {

    const { data } =
      await api.delete(
        `/cierrecaja/${id}`,
        {
          data: {
            motivo,
            eliminadoPor:
              eliminadoPor ||
              "sistema",
          },
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
