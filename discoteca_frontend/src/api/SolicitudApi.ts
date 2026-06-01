// src/api/SolicitudApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  SolicitudArraySchema,

  SolicitudSchema,

  SolicitudesPorSucursalResponseSchema,

  CreateSolicitudResponseSchema,

  type SolicitudForm,

  type SolicitudType,

  type UpdateSolicitudType,

  type DeleteSolicitudType,

} from "@/types/SolicitudType";

/* =========================
    CREAR SOLICITUD
========================= */

export async function createSolicitud(
  formData: SolicitudForm
) {

  try {

    const { data } =
      await api.post(

        "/solicitud",

        formData

      );

    const response =
      CreateSolicitudResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      /*
        Por si tu backend todavía devuelve solo texto:
        "Solicitud creada"
      */
      return data;

    }

    return response.data;

  } catch (error) {

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error creando solicitud"
    );

  }

}

/* =========================
    OBTENER TODAS
========================= */

export async function getSolicitudes() {

  try {

    const { data } =
      await api(
        "/solicitud"
      );

    const response =
      SolicitudArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando solicitudes"
      );

    }

    return response.data;

  } catch (error) {

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error obteniendo solicitudes"
    );

  }

}

/* =========================
    OBTENER SOLICITUDES POR SUCURSAL
========================= */

export async function getSolicitudesBySucursal(
  idSucursal: string
) {

  try {

    const { data } =
      await api(
        `/solicitud/sucursal/${idSucursal}`
      );

    const response =
      SolicitudesPorSucursalResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando solicitudes por sucursal"
      );

    }

    return response.data;

  } catch (error) {

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error obteniendo solicitudes por sucursal"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getSolicitudById(
  id: SolicitudType["_id"]
) {

  try {

    const { data } =
      await api(
        `/solicitud/${id}`
      );

    const response =
      SolicitudSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando solicitud"
      );

    }

    return response.data;

  } catch (error) {

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error obteniendo solicitud"
    );

  }

}

/* =========================
    ACTUALIZAR SOLICITUD
========================= */

export async function updateSolicitud({

  solicitudId,

  formData,

}: UpdateSolicitudType) {

  try {

    const { data } =
      await api.put(

        `/solicitud/${solicitudId}`,

        formData

      );

    return data;

  } catch (error) {

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error actualizando solicitud"
    );

  }

}

/* =========================
    ELIMINAR / ANULAR SOLICITUD
========================= */

export async function deleteSolicitudById({

  id,

  eliminadoPor,

}: DeleteSolicitudType) {

  try {

    const { data } =
      await api.delete(

        `/solicitud/${id}`,

        {
          data: {
            eliminadoPor,
          },
        }

      );

    return data;

  } catch (error) {

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error anulando solicitud"
    );

  }

}