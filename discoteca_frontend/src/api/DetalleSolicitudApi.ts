// src/api/DetalleSolicitudApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {
  CreateDetalleSolicitudResponseSchema,
  DetalleSolicitudArraySchema,
  DetalleSolicitudSchema,

  type DetalleSolicitudForm,
  type UpdateDetalleSolicitudType,
  type DeleteDetalleSolicitudType,
} from "@/types/DetalleSolicitudType";

/* =========================
    MENSAJE ERROR
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
    VALIDAR DETALLE
========================= */

function validarDetalle(
  formData: DetalleSolicitudForm
) {

  if (!formData.idSolicitud) {

    throw new Error(
      "El ID de la solicitud es obligatorio"
    );

  }

  if (!formData.idProducto) {

    throw new Error(
      "El producto es obligatorio"
    );

  }

  const cantidad =
    Number(
      formData.cantidadSolicitada
    );

  if (
    !Number.isFinite(cantidad) ||
    cantidad <= 0
  ) {

    throw new Error(
      "La cantidad solicitada debe ser mayor a cero"
    );

  }

}

/* =========================
    CREAR DETALLE
========================= */

export async function createDetalleSolicitud(
  formData: DetalleSolicitudForm
) {

  try {

    validarDetalle(
      formData
    );

    const {
      data,
    } = await api.post(

      "/detallesolicitud",

      formData

    );

    const response =
      CreateDetalleSolicitudResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA DETALLE:",
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "La respuesta del detalle no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error creando detalle de solicitud"
      )
    );

  }

}

/* =========================
    CREAR MUCHOS
========================= */

export async function createManyDetalleSolicitud(
  detalles: DetalleSolicitudForm[]
) {

  try {

    if (
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {

      throw new Error(
        "No existen detalles para registrar"
      );

    }

    const respuestas = [];

    /*
      Se crean uno por uno para identificar
      claramente cuál producto provoca un error.
    */
    for (
      const detalle
      of detalles
    ) {

      const respuesta =
        await createDetalleSolicitud(
          detalle
        );

      respuestas.push(
        respuesta
      );

    }

    return respuestas;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error creando detalles de solicitud"
      )
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getDetalleSolicitudes() {

  try {

    const {
      data,
    } = await api.get(
      "/detallesolicitud"
    );

    const response =
      DetalleSolicitudArraySchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalles de solicitud"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo detalles de solicitud"
      )
    );

  }

}

/* =========================
    DETALLES POR SOLICITUD
========================= */

export async function getDetallesBySolicitud(
  idSolicitud: string
) {

  try {

    if (!idSolicitud) {

      throw new Error(
        "El ID de la solicitud es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(

      `/detallesolicitud/solicitud/${idSolicitud}`

    );

    const response =
      DetalleSolicitudArraySchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalles por solicitud"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo detalles de solicitud"
      )
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getDetalleSolicitudById(
  id: string
) {

  try {

    if (!id) {

      throw new Error(
        "El ID del detalle es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(
      `/detallesolicitud/${id}`
    );

    const response =
      DetalleSolicitudSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalle"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo detalle de solicitud"
      )
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */

export async function updateDetalleSolicitud({

  detalleSolicitudId,

  formData,

}: UpdateDetalleSolicitudType) {

  try {

    if (!detalleSolicitudId) {

      throw new Error(
        "El ID del detalle es obligatorio"
      );

    }

    const {
      data,
    } = await api.put(

      `/detallesolicitud/${detalleSolicitudId}`,

      formData

    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error actualizando detalle de solicitud"
      )
    );

  }

}

/* =========================
    ELIMINAR
========================= */

export async function deleteDetalleSolicitudById({

  id,

  eliminadoPor,

}: DeleteDetalleSolicitudType) {

  try {

    if (!id) {

      throw new Error(
        "El ID del detalle es obligatorio"
      );

    }

    const {
      data,
    } = await api.delete(

      `/detallesolicitud/${id}`,

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
        "Error eliminando detalle de solicitud"
      )
    );

  }

}