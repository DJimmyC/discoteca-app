// src/api/CierreCajaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  CierreCajaArraySchema,
  CierreCajaSchema,

  type CierreCajaForm,

  type DeleteCierreCajaType,

} from "@/types/CierreCajaType";

/* =========================
    CREATE
========================= */

export async function createCierreCaja(
  formData: CierreCajaForm
) {

  try {


    const { data } =
      await api.post(
        "/cierrecaja",
        formData
      );
console.log(data,"cierre")
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
      "Error creando cierre"
    );

  }

}

/* =========================
    GET ALL
========================= */

export async function getAllCierreCaja() {

  try {

    const { data } =
      await api(
        "/cierrecaja"
      );

    const response =
      CierreCajaArraySchema.safeParse(
        data
      );

    if (
      response.success
    ) {

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
    GET BY ID
========================= */

export async function getCierreCajaById(
  id: string
) {

  try {

    const { data } =
      await api(
        `/cierrecaja/${id}`
      );

    const response =
      CierreCajaSchema.safeParse(
        data
      );

    if (
      response.success
    ) {

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
    UPDATE
========================= */

type UpdateCierreCajaType = {

  cierreCajaId: string;

  formData: CierreCajaForm;

};

export async function updateCierreCaja({

  cierreCajaId,

  formData,

}: UpdateCierreCajaType) {

  try {

    const { data } =
      await api.put(

        `/cierrecaja/${cierreCajaId}`,

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
      "Error actualizando cierre"
    );

  }

}

/* =========================
    DELETE
========================= */

export async function deleteCierreCajaById({

  id,

  eliminadoPor,

}: DeleteCierreCajaType) {

  try {

    const { data } =
      await api.delete(

        `/cierrecaja/${id}`,

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
      "Error eliminando cierre"
    );

  }
  

}

/* =========================
    GET BY CAJA ID
========================= */

export async function
  getCierreCajaByCajaId(
    cajaId: string
  ) {

  try {

    const { data } =
      await api(

        `/cierrecaja/caja/${cajaId}`

      );
      const response =
      CierreCajaArraySchema.safeParse(
        data
      );
      
      console.log(response,"bbrepo")
      if (
        response.success
      ) {
        
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