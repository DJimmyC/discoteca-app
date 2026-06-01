// src/api/DetalleSolicitudApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  DetalleSolicitudArraySchema,

  DetalleSolicitudSchema,

  CreateDetalleSolicitudResponseSchema,

  type DetalleSolicitudForm,

  type DetalleSolicitudType,

  type UpdateDetalleSolicitudType,

  type DeleteDetalleSolicitudType,

} from "@/types/DetalleSolicitudType";

/* =========================
    CREAR DETALLE SOLICITUD
========================= */

export async function createDetalleSolicitud(
  formData: DetalleSolicitudForm
) {

  try {

    const { data } =
      await api.post(

        "/detallesolicitud",

        formData

      );

    const response =
      CreateDetalleSolicitudResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

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
      "Error creando detalle de solicitud"
    );

  }

}

/* =========================
    CREAR MUCHOS DETALLES
========================= */

export async function createManyDetalleSolicitud(
  detalles: DetalleSolicitudForm[]
) {

  try {

    const responses =
      await Promise.all(
        detalles.map(
          (detalle) =>
            api.post(
              "/detallesolicitud",
              detalle
            )
        )
      );

    return responses.map(
      (response) =>
        response.data
    );

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
      "Error creando detalles de solicitud"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getDetalleSolicitudes() {

  try {

    const { data } =
      await api(
        "/detallesolicitud"
      );

    const response =
      DetalleSolicitudArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalles de solicitud"
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
      "Error obteniendo detalles de solicitud"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getDetalleSolicitudById(
  id: DetalleSolicitudType["_id"]
) {

  try {

    const { data } =
      await api(
        `/detallesolicitud/${id}`
      );

    const response =
      DetalleSolicitudSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalle de solicitud"
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
      "Error obteniendo detalle de solicitud"
    );

  }

}

/* =========================
    OBTENER DETALLES POR SOLICITUD
    Esta función requiere que luego agregues
    una ruta en backend:
    GET /api/detallesolicitud/solicitud/:idSolicitud
========================= */

export async function getDetallesBySolicitud(
  idSolicitud: string
) {

  try {

    const { data } =
      await api(
        `/detallesolicitud/solicitud/${idSolicitud}`
      );

    const response =
      DetalleSolicitudArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalles por solicitud"
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
      "Error obteniendo detalles por solicitud"
    );

  }

}

/* =========================
    ACTUALIZAR DETALLE
========================= */

export async function updateDetalleSolicitud({

  detalleSolicitudId,

  formData,

}: UpdateDetalleSolicitudType) {

  try {

    const { data } =
      await api.put(

        `/detallesolicitud/${detalleSolicitudId}`,

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
      "Error actualizando detalle de solicitud"
    );

  }

}

/* =========================
    ELIMINAR DETALLE
========================= */

export async function deleteDetalleSolicitudById({

  id,

  eliminadoPor,

}: DeleteDetalleSolicitudType) {

  try {

    const { data } =
      await api.delete(

        `/detallesolicitud/${id}`,

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
      "Error eliminando detalle de solicitud"
    );

  }

}