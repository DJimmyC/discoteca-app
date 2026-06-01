import api from "@/lib/axios";

import { isAxiosError } from "axios";

import {

  CategoriaProductoArraySchema,

  CategoriaProductoSchema,

  type CategoriaProductoFormData,

  type CategoriaProductoType,

} from "@/types/CategoriaProductoType";

/* =========================
    CREAR CATEGORIA
========================= */
export async function createCategoriaProducto(
  formData: CategoriaProductoFormData
) {

  try {

    const { data } =
      await api.post(

        "/categoriaproducto",

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

  }

}

/* =========================
    OBTENER TODOS
========================= */
export async function getCategoriaProductos() {

  try {

    const { data } =
      await api(
        "/categoriaproducto"
      );

    const response =
      CategoriaProductoArraySchema.safeParse(
        data
      );

    if (response.success) {

      return response.data;

    }

  } catch (error) {

    if (

      isAxiosError(error) &&
      error.response

    ) {

      throw new Error(
        error.response.data.error
      );

    }

  }

}

/* =========================
    OBTENER POR ID
========================= */
export async function getCategoriaProductoById(
  id: CategoriaProductoType["_id"]
) {

  try {

    const { data } =
      await api(

        `/categoriaproducto/${id}`

      );

    const response =
      CategoriaProductoSchema.safeParse(
        data
      );

    if (response.success) {

      return response.data;

    }

  } catch (error) {

    if (

      isAxiosError(error) &&
      error.response

    ) {

      throw new Error(
        error.response.data.error
      );

    }

  }

}

/* =========================
    ACTUALIZAR
========================= */
type CategoriaProductoApiType = {

  formData:
    CategoriaProductoFormData;

  categoriaProductoId:
    CategoriaProductoType["_id"];

};

export async function updateCategoriaProducto({

  formData,

  categoriaProductoId,

}: CategoriaProductoApiType) {

  try {

    const { data } =
      await api.put<string>(

        `/categoriaproducto/${categoriaProductoId}`,

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

  }

}

/* =========================
    ELIMINAR (SOFT DELETE)
========================= */
type DeleteCategoriaProductoType = {

  id:
    CategoriaProductoType["_id"];

  eliminadoPor: string;

};

export async function deleteCategoriaProductoById({

  id,

  eliminadoPor,

}: DeleteCategoriaProductoType) {

  try {

    const { data } =
      await api.delete<string>(

        `/categoriaproducto/${id}`,

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
      "Error inesperado"
    );

  }

}