// src/api/AperturaCajaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  AperturaCajaArraySchema,

  AperturaCajaSchema,

  type AperturaCajaForm,

  type AperturaCajaType,

} from "@/types/AperturaCajaType";

/* =========================
    CREAR
========================= */

export async function createAperturaCaja(
  formData: AperturaCajaForm
) {

  try {

    const { data } =
      await api.post(

        "/aperturacaja",

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
    OBTENER TODAS
========================= */

export async function getAperturasCaja() {

  try {

    const { data } =
      await api(

        "/aperturacaja"

      );

    const response =
      AperturaCajaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando aperturas"
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
      "Error obteniendo aperturas"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getAperturaCajaById(
  id: AperturaCajaType["_id"]
) {

  try {

    const { data } =
      await api(

        `/aperturacaja/${id}`

      );

    const response =
      AperturaCajaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando apertura"
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
      "Error obteniendo apertura"
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */

type UpdateAperturaCajaType = {

  formData:
  AperturaCajaForm;

  aperturaCajaId:
  AperturaCajaType["_id"];

};

export async function updateAperturaCaja({

  formData,

  aperturaCajaId,

}: UpdateAperturaCajaType) {

  try {

    const { data } =
      await api.put(

        `/aperturacaja/${aperturaCajaId}`,

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
    ELIMINAR
========================= */

type DeleteAperturaCajaType = {

  id: string;

  eliminadoPor: string;

};

export async function deleteAperturaCajaById({

  id,

  eliminadoPor,

}: DeleteAperturaCajaType) {

  try {

    const { data } =
      await api.delete(

        `/aperturacaja/${id}`,

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
      "Error eliminando apertura"
    );

  }




}

/* =========================
    OBTENER POR CAJA ID
========================= */

 
export async function
getAperturasCajaByCajaId(
  cajaId: string
) {

  try {

    /* =========================
        VALIDAR PARAM
    ========================= */

    if (!cajaId) {

      throw new Error(
        "cajaId es requerido"
      );

    }

  

    /* =========================
        REQUEST
    ========================= */

    const { data } =
      await api.get(

        `/aperturacaja/caja/${cajaId}`

      );

    console.log(
      "respuesta backend =>",
      data
    );

    /* =========================
        VALIDACION
    ========================= */

    const response =
      AperturaCajaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(

        "zod error =>",

        response.error.format()

      );

      throw new Error(
        "Error validando aperturas"
      );

    }

    /* =========================
        RETURN
    ========================= */

    return response.data;

  } catch (error) {

    console.log(
      "api error =>",
      error
    );

    if (

      isAxiosError(error) &&

      error.response

    ) {

      throw new Error(

        error.response.data.error ||

        "Error backend"

      );

    }

    throw new Error(
      "Error obteniendo aperturas"
    );

  }

}
