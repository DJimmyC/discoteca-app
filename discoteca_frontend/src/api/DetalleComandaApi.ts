import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  CreateDetalleComandaResponseSchema,

  DetalleComandaArraySchema,

  DetalleComandaSchema,

  type DetalleComandaForm,

  type DetalleComandaType,

  type UpdateDetalleComandaType,

  type DeleteDetalleComandaType,

} from "@/types/DetalleComandaType";

/* =========================
    OBTENER MENSAJE DE ERROR
========================= */

function getErrorMessage(
  error: unknown,
  defaultMessage: string
): string {

  if (
    isAxiosError(error) &&
    error.response
  ) {

    const responseError =
      error.response.data?.error;

    if (
      typeof responseError ===
      "string"
    ) {
      return responseError;
    }

  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return defaultMessage;

}

/* =========================
    CREAR DETALLE
========================= */

export async function createDetalleComanda(
  formData:
    DetalleComandaForm
) {

  try {

    const {
      data,
    } = await api.post(

      "/detallecomanda",

      formData

    );

    const response =
      CreateDetalleComandaResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "Error validando detalle creado:",
        response.error.format()
      );

      throw new Error(
        "El backend devolvió un detalle de comanda inválido"
      );

    }

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error creando detalle de comanda"
      )
    );

  }

}

/* =========================
    CREAR MUCHOS DETALLES
========================= */

export async function createManyDetalleComanda(
  detalles:
    DetalleComandaForm[]
) {

  try {

    if (
      detalles.length === 0
    ) {
      throw new Error(
        "No existen detalles para registrar"
      );
    }

    /*
      Se envían uno por uno porque tu backend
      actualmente tiene un endpoint individual.
    */
    const responses =
      await Promise.all(

        detalles.map(
          async (detalle) => {

            const {
              data,
            } = await api.post(

              "/detallecomanda",

              detalle

            );

            const response =
              CreateDetalleComandaResponseSchema
                .safeParse(data);

            if (!response.success) {

              console.log(
                "Detalle inválido:",
                detalle
              );

              console.log(
                response.error.format()
              );

              throw new Error(
                "El backend devolvió un detalle inválido"
              );

            }

            return response.data;

          }
        )

      );

    return responses;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error creando detalles de comanda"
      )
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getDetallesComanda() {

  try {

    const {
      data,
    } = await api.get(
      "/detallecomanda"
    );

    const response =
      DetalleComandaArraySchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalles de comanda"
      );

    }

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error obteniendo detalles de comanda"
      )
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getDetalleComandaById(
  id:
    DetalleComandaType["_id"]
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
      `/detallecomanda/${id}`
    );

    const response =
      DetalleComandaSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalle de comanda"
      );

    }

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error obteniendo detalle de comanda"
      )
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */

export async function updateDetalleComanda({

  detalleComandaId,

  formData,

}: UpdateDetalleComandaType) {

  try {

    if (!detalleComandaId) {

      throw new Error(
        "El ID del detalle es obligatorio"
      );

    }

    const {
      data,
    } = await api.put(

      `/detallecomanda/${detalleComandaId}`,

      formData

    );

    /*
      Tu backend puede devolver texto o un objeto.
      No aplicamos DetalleComandaSchema aquí hasta
      que la respuesta sea uniforme.
    */
    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error actualizando detalle de comanda"
      )
    );

  }

}

/* =========================
    ELIMINAR
========================= */

export async function deleteDetalleComandaById({

  id,

  eliminadoPor,

}: DeleteDetalleComandaType) {

  try {

    if (!id) {

      throw new Error(
        "El ID del detalle es obligatorio"
      );

    }

    const {
      data,
    } = await api.delete(

      `/detallecomanda/${id}`,

      {
        data: {
          eliminadoPor:
            eliminadoPor ||
            "admin",
        },
      }

    );

    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error eliminando detalle de comanda"
      )
    );

  }

}