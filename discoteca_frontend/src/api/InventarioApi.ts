// src/api/InventarioApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  InventarioArraySchema,

  InventarioSchema,

  type InventarioForm,

  type InventarioType,

} from "@/types/InventarioType";

/* =========================
    CREAR INVENTARIO
========================= */

export async function createInventario(
  formData: InventarioForm
) {

  try {

    const { data } =
      await api.post(

        "/inventario",

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
      "Error creando inventario"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getInventarios() {

  try {

    const { data } =
      await api(
        "/inventario"
      );

    const response =
      InventarioArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando inventarios"
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
      "Error obteniendo inventarios"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getInventarioById(
  id: InventarioType["_id"]
) {

  try {

    const { data } =
      await api(
        `/inventario/${id}`
      );

    const response =
      InventarioSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando inventario"
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
      "Error obteniendo inventario"
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */

type UpdateInventarioType = {

  inventarioId:
    InventarioType["_id"];

  formData:
    InventarioForm;

};

export async function updateInventario({

  inventarioId,

  formData,

}: UpdateInventarioType) {

  try {

    const { data } =
      await api.put(

        `/inventario/${inventarioId}`,

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
      "Error actualizando inventario"
    );

  }

}

/* =========================
    ELIMINAR
========================= */

type DeleteInventarioType = {

  id:
    InventarioType["_id"];

  eliminadoPor:
    string;

};

export async function deleteInventarioById({

  id,

  eliminadoPor,

}: DeleteInventarioType) {

  try {

    const { data } =
      await api.delete(

        `/inventario/${id}`,

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
      "Error eliminando inventario"
    );

  }

  

}
/* =========================
    OBTENER INVENTARIO BARRA POR SUCURSAL
========================= */

export async function getInventarioBarraPorSucursal(
  idSucursal: string
) {

  try {

    const { data } =
      await api(
        `/inventario/sucursal/${idSucursal}/barra`
      );
      

    const response =
      InventarioArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando inventario de barra"
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
      "Error obteniendo inventario de barra"
    );

  }

}