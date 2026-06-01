// src/api/DetalleComandaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  DetalleComandaArraySchema,

  DetalleComandaSchema,

  type DetalleComandaForm,

  type DetalleComandaType,

  type UpdateDetalleComandaType,

  type DeleteDetalleComandaType,

} from "@/types/DetalleComandaType";

/* =========================
    CREAR DETALLE COMANDA
========================= */

export async function createDetalleComanda(
  formData: DetalleComandaForm
) {

  try {

    const { data } =
      await api.post(

        "/detallecomanda",

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
      "Error creando detalle de comanda"
    );

  }

}

/* =========================
    CREAR MUCHOS DETALLES
========================= */

export async function createManyDetalleComanda(
  detalles: DetalleComandaForm[]
) {

  try {

    const responses = await Promise.all(
      detalles.map((detalle) =>
        api.post(
          "/detallecomanda",
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
      "Error creando detalles de comanda"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getDetallesComanda() {

  try {

    const { data } =
      await api(
        "/detallecomanda"
      );

    const response =
      DetalleComandaArraySchema.safeParse(
        data
      );

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

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error obteniendo detalles de comanda"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getDetalleComandaById(
  id: DetalleComandaType["_id"]
) {

  try {

    const { data } =
      await api(
        `/detallecomanda/${id}`
      );

    const response =
      DetalleComandaSchema.safeParse(
        data
      );

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

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error obteniendo detalle de comanda"
    );

  }

}

/* =========================
    ACTUALIZAR DETALLE COMANDA
========================= */

export async function updateDetalleComanda({

  detalleComandaId,

  formData,

}: UpdateDetalleComandaType) {

  try {

    const { data } =
      await api.put(

        `/detallecomanda/${detalleComandaId}`,

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
      "Error actualizando detalle de comanda"
    );

  }

}

/* =========================
    ELIMINAR DETALLE COMANDA
========================= */

export async function deleteDetalleComandaById({

  id,

  eliminadoPor,

}: DeleteDetalleComandaType) {

  try {

    const { data } =
      await api.delete(

        `/detallecomanda/${id}`,

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
      "Error eliminando detalle de comanda"
    );

  }

}