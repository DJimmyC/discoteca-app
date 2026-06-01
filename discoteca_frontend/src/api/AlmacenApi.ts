import api from "@/lib/axios";

import { isAxiosError } from "axios";

import {

  AlmacenArraySchema,

  AlmacenSchema,

  AlmacenesPorSucursalResponseSchema,

  type AlmacenFormData,

  type AlmacenType,

} from "@/types/AlmacenType";

/* =========================
    CREAR ALMACEN
========================= */

export async function createAlmacen(
  formData: AlmacenFormData
) {

  try {

    const { data } =
      await api.post(
        "/almacen",
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
      "Error creando almacén"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getAlmacenes() {

  try {

    const { data } =
      await api(
        "/almacen"
      );

    const response =
      AlmacenArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando almacenes"
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
      "Error obteniendo almacenes"
    );

  }

}

/* =========================
    OBTENER ALMACENES POR SUCURSAL
========================= */

export async function getAlmacenesBySucursal(
  idSucursal: string
) {

  try {

    const { data } =
      await api(
        `/almacen/sucursal/${idSucursal}`
      );

    const response =
      AlmacenesPorSucursalResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando almacenes por sucursal"
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
      "Error obteniendo almacenes por sucursal"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getAlmacenById(
  id: AlmacenType["_id"]
) {

  try {

    const { data } =
      await api(
        `/almacen/${id}`
      );

    const response =
      AlmacenSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando almacén"
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
      "Error obteniendo almacén"
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */

type AlmacenApiType = {

  formData:
    AlmacenFormData;

  almacenId:
    AlmacenType["_id"];

};

export async function updateAlmacen({

  formData,

  almacenId,

}: AlmacenApiType) {

  try {

    const { data } =
      await api.put<string>(

        `/almacen/${almacenId}`,

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
      "Error actualizando almacén"
    );

  }

}

/* =========================
    ELIMINAR LOGICO
========================= */

type DeleteAlmacenType = {

  id:
    AlmacenType["_id"];

  eliminadoPor:
    string;

};

export async function deleteAlmacenById({

  id,

  eliminadoPor,

}: DeleteAlmacenType) {

  try {

    const { data } =
      await api.delete<string>(

        `/almacen/${id}`,

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
      "Error eliminando almacén"
    );

  }

}