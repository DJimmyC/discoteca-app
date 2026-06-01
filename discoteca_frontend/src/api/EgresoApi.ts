// src/api/EgresoApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  EgresoArraySchema,

  EgresoSchema,

  EgresosConDetallesPorSucursalSchema,

  type EgresoForm,

  type EgresoType,

  type UpdateEgresoType,

  type DeleteEgresoType,

} from "@/types/EgresoType";

/* =========================
    CREAR EGRESO
========================= */

export async function createEgreso(
  formData: EgresoForm
) {

  try {

    const { data } =
      await api.post(

        "/egreso",

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
      "Error creando egreso"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getEgresos() {

  try {

    const { data } =
      await api(
        "/egreso"
      );

    const response =
      EgresoArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando egresos"
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
      "Error obteniendo egresos"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getEgresoById(
  id: EgresoType["_id"]
) {

  try {

    const { data } =
      await api(
        `/egreso/${id}`
      );

    const response =
      EgresoSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando egreso"
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
      "Error obteniendo egreso"
    );

  }

}

/* =========================
    OBTENER EGRESOS CON DETALLES POR SUCURSAL
========================= */

export async function getEgresosConDetallesPorSucursal(
  idSucursal: string
) {

  try {

    const { data } =
      await api(
        `/egreso/sucursal/${idSucursal}/detalles`
      );

    const response =
      EgresosConDetallesPorSucursalSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando egresos con detalles"
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
      "Error obteniendo egresos con detalles"
    );

  }

}

/* =========================
    ACTUALIZAR EGRESO
========================= */

export async function updateEgreso({

  egresoId,

  formData,

}: UpdateEgresoType) {

  try {

    const { data } =
      await api.put(

        `/egreso/${egresoId}`,

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
      "Error actualizando egreso"
    );

  }

}

/* =========================
    ELIMINAR / ANULAR EGRESO
========================= */

export async function deleteEgresoById({

  id,

  eliminadoPor,

}: DeleteEgresoType) {

  try {

    const { data } =
      await api.delete(

        `/egreso/${id}`,

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
      "Error anulando egreso"
    );

  }

}