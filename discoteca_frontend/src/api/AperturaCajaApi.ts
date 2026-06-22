// src/api/AperturaCajaApi.ts

import api from "@/lib/axios";
import { isAxiosError } from "axios";

import {
  AperturaCajaArraySchema,
  AperturaCajaSchema,
  AperturaCajaActivaArraySchema,
  CreateAperturaCajaResponseSchema,
  type AperturaCajaForm,
  type UpdateAperturaCajaType,
  type DeleteAperturaCajaType,
} from "@/types/AperturaCajaType";
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

export async function createAperturaCaja(
  formData: AperturaCajaForm
) {

  try {

    const { data } =
      await api.post(
        "/aperturacaja",
        formData
      );

    const response =
      CreateAperturaCajaResponseSchema.safeParse(
        data
      );

    if (!response.success) {
      console.error(
        "Error Zod apertura:",
        response.error.format(),
        data
      );

      throw new Error(
        "La respuesta de apertura no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error creando apertura"
      )
    );
  }
}

export async function getAperturasCaja() {

  try {

    const { data } =
      await api.get(
        "/aperturacaja"
      );

    const response =
      AperturaCajaArraySchema.safeParse(
        data
      );

    if (!response.success) {
      console.error(
        response.error.format(),
        data
      );

      throw new Error(
        "Error validando aperturas"
      );
    }

    return response.data;

  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo aperturas"
      )
    );
  }
}

export async function getAperturaCajaById(
  id: string
) {

  try {

    const { data } =
      await api.get(
        `/aperturacaja/${id}`
      );

    const response =
      AperturaCajaSchema.safeParse(
        data
      );

    if (!response.success) {
      console.error(
        response.error.format(),
        data
      );

      throw new Error(
        "Error validando apertura"
      );
    }

    return response.data;

  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo apertura"
      )
    );
  }
}

export async function getAperturaActivaByCaja(
  cajaId: string
) {

  try {

    const { data } =
      await api.get(
        `/aperturacaja/caja/${cajaId}/activa`
      );

    if (data === null) {
      return null;
    }

    const response =
      AperturaCajaSchema.safeParse(
        data
      );

    if (!response.success) {
      console.error(
        response.error.format(),
        data
      );

      throw new Error(
        "Error validando apertura activa"
      );
    }

    return response.data;

  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo apertura activa"
      )
    );
  }
}

export async function getAperturasCajaByCajaId(
  cajaId: string
) {

  try {

    const { data } =
      await api.get(
        `/aperturacaja/caja/${cajaId}`
      );

    const response =
      AperturaCajaArraySchema.safeParse(
        data
      );

    if (!response.success) {
      console.error(
        response.error.format(),
        data
      );

      throw new Error(
        "Error validando aperturas por caja"
      );
    }

    return response.data;

  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo aperturas por caja"
      )
    );
  }
}

export async function updateAperturaCaja({
  aperturaCajaId,
  formData,
}: UpdateAperturaCajaType) {

  try {

    const { data } =
      await api.put(
        `/aperturacaja/${aperturaCajaId}`,
        formData
      );

    return data;

  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error actualizando apertura"
      )
    );
  }
}

export async function deleteAperturaCajaById({
  id,
  eliminadoPor,
}: DeleteAperturaCajaType) {

  try {

    const { data } =
      await api.delete(
        `/aperturacaja/${id}`,
        {
          data: {
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
        "Error anulando apertura"
      )
    );
  }
  
}
/* =========================
    OBTENER APERTURAS ACTIVAS
    POR SUCURSAL
========================= */

export async function getAperturasActivasBySucursal(
  idSucursal: string
) {
  try {
    if (!idSucursal) {
      throw new Error(
        "El ID de la sucursal es obligatorio"
      );
    }

    const { data } =
      await api.get(
        `/aperturacaja/sucursal/${idSucursal}/activas`
      );

    const response =
      AperturaCajaActivaArraySchema.safeParse(
        data
      );

    if (!response.success) {
      console.error(
        "RESPUESTA REAL DE APERTURAS ACTIVAS:",
        data
      );

      console.error(
        "ERROR ZOD APERTURAS ACTIVAS:",
        response.error.format()
      );

      throw new Error(
        "La estructura de aperturas activas no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {
    throw new Error(
      mensajeError(
        error,
        "Error obteniendo aperturas activas por sucursal"
      )
    );
  }
}