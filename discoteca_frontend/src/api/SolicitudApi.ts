// src/api/SolicitudApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {
  CreateSolicitudResponseSchema,
  SolicitudArraySchema,
  SolicitudSchema,
  SolicitudesPorSucursalResponseSchema,

  type SolicitudForm,
  type UpdateSolicitudType,
  type DeleteSolicitudType,
} from "@/types/SolicitudType";

/* =========================
    MENSAJE DE ERROR
========================= */

function obtenerMensajeError(
  error: unknown,
  mensajePredeterminado: string
): string {

  if (
    isAxiosError(error) &&
    error.response
  ) {

    const errorBackend =
      error.response.data?.error;

    const mensajeBackend =
      error.response.data?.message;

    if (
      typeof errorBackend ===
      "string"
    ) {
      return errorBackend;
    }

    if (
      typeof mensajeBackend ===
      "string"
    ) {
      return mensajeBackend;
    }

  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return mensajePredeterminado;

}

/* =========================
    CREAR SOLICITUD
========================= */

export async function createSolicitud(
  formData: SolicitudForm
) {

  try {

    if (!formData.idPerfil) {

      throw new Error(
        "El perfil es obligatorio"
      );

    }

    if (!formData.idSucursal) {

      throw new Error(
        "La sucursal es obligatoria"
      );

    }

    if (!formData.idAlmacenDestino) {

      throw new Error(
        "El almacén destino es obligatorio"
      );

    }

    if (
      formData.idAlmacenOrigen &&
      formData.idAlmacenOrigen ===
        formData.idAlmacenDestino
    ) {

      throw new Error(
        "El almacén origen y destino no pueden ser iguales"
      );

    }

    const {
      data,
    } = await api.post(

      "/solicitud",

      formData

    );

    const response =
      CreateSolicitudResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA REAL SOLICITUD:",
        data
      );

      console.log(
        "ERROR ZOD SOLICITUD:",
        response.error.format()
      );

      throw new Error(
        "La respuesta de la solicitud no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error creando solicitud"
      )
    );

  }

}

/* =========================
    OBTENER TODAS
========================= */

export async function getSolicitudes() {

  try {

    const {
      data,
    } = await api.get(
      "/solicitud"
    );

    const response =
      SolicitudArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando solicitudes"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo solicitudes"
      )
    );

  }

}

/* =========================
    OBTENER POR SUCURSAL
========================= */

export async function getSolicitudesBySucursal(
  idSucursal: string
) {

  try {

    if (!idSucursal) {

      throw new Error(
        "El ID de la sucursal es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(

      `/solicitud/sucursal/${idSucursal}`

    );

    const response =
      SolicitudesPorSucursalResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA SOLICITUDES:",
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando solicitudes por sucursal"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo solicitudes por sucursal"
      )
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getSolicitudById(
  id: string
) {

  try {

    if (!id) {

      throw new Error(
        "El ID de la solicitud es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(
      `/solicitud/${id}`
    );

    const response =
      SolicitudSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando solicitud"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo solicitud"
      )
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */

export async function updateSolicitud({

  solicitudId,

  formData,

}: UpdateSolicitudType) {

  try {

    if (!solicitudId) {

      throw new Error(
        "El ID de la solicitud es obligatorio"
      );

    }

    const {
      data,
    } = await api.put(

      `/solicitud/${solicitudId}`,

      formData

    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error actualizando solicitud"
      )
    );

  }

}

/* =========================
    ANULAR
========================= */

export async function deleteSolicitudById({

  id,

  eliminadoPor,

}: DeleteSolicitudType) {

  try {

    if (!id) {

      throw new Error(
        "El ID de la solicitud es obligatorio"
      );

    }

    const {
      data,
    } = await api.delete(

      `/solicitud/${id}`,

      {
        data: {

          eliminadoPor:
            eliminadoPor ||
            "admin",

        },
      }

    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error anulando solicitud"
      )
    );

  }

}