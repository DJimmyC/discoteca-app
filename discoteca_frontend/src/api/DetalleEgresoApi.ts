// src/api/DetalleEgresoApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  DetalleEgresoArraySchema,

  DetalleEgresoSchema,

  type DetalleEgresoForm,

  type DetalleEgresoType,

  type UpdateDetalleEgresoType,

  type DeleteDetalleEgresoType,

} from "@/types/DetalleEgresoType";

/* =========================
    CREAR DETALLE EGRESO
========================= */

export async function createDetalleEgreso(
  formData: DetalleEgresoForm
) {

  try {

    const { data } =
      await api.post(

        "/detalleegreso",

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
      "Error creando detalle de egreso"
    );

  }

}

/* =========================
    CREAR MUCHOS DETALLES
========================= */

export async function createManyDetalleEgreso(
  detalles: DetalleEgresoForm[]
) {

  try {

    const responses =
      await Promise.all(

        detalles.map((detalle) =>
          api.post(

            "/detalleegreso",

            detalle

          )
        )

      );

    return responses.map(
      (response) => response.data
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
      "Error creando detalles de egreso"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getDetallesEgreso() {

  try {

    const { data } =
      await api(
        "/detalleegreso"
      );

    const response =
      DetalleEgresoArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalles de egreso"
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
      "Error obteniendo detalles de egreso"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getDetalleEgresoById(
  id: DetalleEgresoType["_id"]
) {

  try {

    const { data } =
      await api(
        `/detalleegreso/${id}`
      );

    const response =
      DetalleEgresoSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalle de egreso"
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
      "Error obteniendo detalle de egreso"
    );

  }

}

/* =========================
    ACTUALIZAR DETALLE EGRESO
========================= */

export async function updateDetalleEgreso({

  detalleEgresoId,

  formData,

}: UpdateDetalleEgresoType) {

  try {

    const { data } =
      await api.put(

        `/detalleegreso/${detalleEgresoId}`,

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
      "Error actualizando detalle de egreso"
    );

  }

}

/* =========================
    ELIMINAR DETALLE EGRESO
========================= */

export async function deleteDetalleEgresoById({

  id,

  eliminadoPor,

}: DeleteDetalleEgresoType) {

  try {

    const { data } =
      await api.delete(

        `/detalleegreso/${id}`,

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
      "Error eliminando detalle de egreso"
    );

  }

}