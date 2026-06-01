import api from "@/lib/axios";

import { isAxiosError } from "axios";

import {

  ProductoArraySchema,

  ProductoSchema,

  type ProductoFormData,

  type ProductoType,

} from "@/types/ProductoType";

/* =========================
    CREAR PRODUCTO
========================= */
export async function createProducto(
  formData: ProductoFormData
) {

  try {

    const { data } =
      await api.post(

        "/producto",

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
export async function getProductos() {

  try {

    const { data } =
      await api(
        "/producto"
      );

    const response =
      ProductoArraySchema.safeParse(
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
export async function getProductoById(
  id: ProductoType["_id"]
) {

  try {

    const { data } =
      await api(

        `/producto/${id}`

      );

    const response =
      ProductoSchema.safeParse(
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
type ProductoApiType = {

  formData:
    ProductoFormData;

  productoId:
    ProductoType["_id"];

};

export async function updateProducto({

  formData,

  productoId,

}: ProductoApiType) {

  try {

    const { data } =
      await api.put<string>(

        `/producto/${productoId}`,

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
type DeleteProductoType = {

  id:
    ProductoType["_id"];

  eliminadoPor: string;

};

export async function deleteProductoById({

  id,

  eliminadoPor,

}: DeleteProductoType) {

  try {

    const { data } =
      await api.delete<string>(

        `/producto/${id}`,

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