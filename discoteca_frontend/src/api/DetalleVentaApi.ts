// src/api/DetalleVentaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  DetalleVentaArraySchema,

  DetalleVentaSchema,

  type DetalleVentaForm,

  type DetalleVentaType,

  type UpdateDetalleVentaType,

  type DeleteDetalleVentaType,

} from "@/types/DetalleVentaType";

/* =========================
    CREAR DETALLE VENTA
========================= */

export async function createDetalleVenta(
  formData: DetalleVentaForm
) {

  try {

    const { data } =
      await api.post(

        "/detalleventa",

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
      "Error creando detalle de venta"
    );

  }

}

/* =========================
    CREAR MUCHOS DETALLES
========================= */

export async function createManyDetalleVenta(
  detalles: DetalleVentaForm[]
) {

  try {

    const responses =
      await Promise.all(

        detalles.map((detalle) =>
          api.post(

            "/detalleventa",

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
      "Error creando detalles de venta"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getDetallesVenta() {

  try {

    const { data } =
      await api(
        "/detalleventa"
      );

    const response =
      DetalleVentaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalles de venta"
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
      "Error obteniendo detalles de venta"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getDetalleVentaById(
  id: DetalleVentaType["_id"]
) {

  try {

    const { data } =
      await api(
        `/detalleventa/${id}`
      );

    const response =
      DetalleVentaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando detalle de venta"
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
      "Error obteniendo detalle de venta"
    );

  }

}

/* =========================
    ACTUALIZAR DETALLE VENTA
========================= */

export async function updateDetalleVenta({

  detalleVentaId,

  formData,

}: UpdateDetalleVentaType) {

  try {

    const { data } =
      await api.put(

        `/detalleventa/${detalleVentaId}`,

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
      "Error actualizando detalle de venta"
    );

  }

}

/* =========================
    ELIMINAR DETALLE VENTA
========================= */

export async function deleteDetalleVentaById({

  id,

  eliminadoPor,

}: DeleteDetalleVentaType) {

  try {

    const { data } =
      await api.delete(

        `/detalleventa/${id}`,

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
      "Error eliminando detalle de venta"
    );

  }

}