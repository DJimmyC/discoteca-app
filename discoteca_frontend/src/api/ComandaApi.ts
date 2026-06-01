// // src/api/ComandaApi.ts

// import api from "@/lib/axios";

// import {
//   isAxiosError,
// } from "axios";

// import {

//   ComandaArraySchema,

//   ComandaSchema,

//   type ComandaForm,

//   type ComandaType,

//   type UpdateComandaType,

//   type DeleteComandaType,

// } from "@/types/ComandaType";

// /* =========================
//     CREAR COMANDA
// ========================= */

// export async function createComanda(
//   formData: ComandaForm
// ) {

//   try {

//     const { data } =
//       await api.post(

//         "/comanda",

//         formData

//       );

//     return data;

//   } catch (error) {

//     if (
//       isAxiosError(error) &&
//       error.response
//     ) {

//       throw new Error(
//         error.response.data.error
//       );

//     }

//     throw new Error(
//       "Error creando comanda"
//     );

//   }

// }

// /* =========================
//     OBTENER TODAS
// ========================= */

// export async function getComandas() {

//   try {

//     const { data } =
//       await api(
//         "/comanda"
//       );

//     const response =
//       ComandaArraySchema.safeParse(
//         data
//       );

//     if (!response.success) {

//       console.log(
//         response.error.format()
//       );

//       throw new Error(
//         "Error validando comandas"
//       );

//     }

//     return response.data;

//   } catch (error) {

//     if (
//       isAxiosError(error) &&
//       error.response
//     ) {

//       throw new Error(
//         error.response.data.error
//       );

//     }

//     throw new Error(
//       "Error obteniendo comandas"
//     );

//   }

// }

// /* =========================
//     OBTENER POR ID
// ========================= */

// export async function getComandaById(
//   id: ComandaType["_id"]
// ) {

//   try {

//     const { data } =
//       await api(
//         `/comanda/${id}`
//       );

//     const response =
//       ComandaSchema.safeParse(
//         data
//       );

//     if (!response.success) {

//       console.log(
//         response.error.format()
//       );

//       throw new Error(
//         "Error validando comanda"
//       );

//     }

//     return response.data;

//   } catch (error) {

//     if (
//       isAxiosError(error) &&
//       error.response
//     ) {

//       throw new Error(
//         error.response.data.error
//       );

//     }

//     throw new Error(
//       "Error obteniendo comanda"
//     );

//   }

// }

// /* =========================
//     ACTUALIZAR COMANDA
// ========================= */

// export async function updateComanda({

//   comandaId,

//   formData,

// }: UpdateComandaType) {

//   try {

//     const { data } =
//       await api.put(

//         `/comanda/${comandaId}`,

//         formData

//       );

//     return data;

//   } catch (error) {

//     if (
//       isAxiosError(error) &&
//       error.response
//     ) {

//       throw new Error(
//         error.response.data.error
//       );

//     }

//     throw new Error(
//       "Error actualizando comanda"
//     );

//   }

// }

// /* =========================
//     ELIMINAR / ANULAR COMANDA
// ========================= */

// export async function deleteComandaById({

//   id,

//   eliminadoPor,

// }: DeleteComandaType) {

//   try {

//     const { data } =
//       await api.delete(

//         `/comanda/${id}`,

//         {
//           data: {
//             eliminadoPor,
//           },
//         }

//       );

//     return data;

//   } catch (error) {

//     if (
//       isAxiosError(error) &&
//       error.response
//     ) {

//       throw new Error(
//         error.response.data.error
//       );

//     }

//     throw new Error(
//       "Error anulando comanda"
//     );

//   }

// }

// src/api/ComandaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  ComandaArraySchema,

  ComandaSchema,

  ComandasConDetallesPorPerfilSchema,

  type ComandaForm,

  type ComandaType,

  type UpdateComandaType,

  type DeleteComandaType,

} from "@/types/ComandaType";

/* =========================
    CREAR COMANDA
========================= */

export async function createComanda(
  formData: ComandaForm
) {

  try {

    const { data } =
      await api.post(

        "/comanda",

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
      "Error creando comanda"
    );

  }

}

/* =========================
    OBTENER TODAS
========================= */

export async function getComandas() {

  try {

    const { data } =
      await api(
        "/comanda"
      );

    const response =
      ComandaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando comandas"
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
      "Error obteniendo comandas"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getComandaById(
  id: ComandaType["_id"]
) {

  try {

    const { data } =
      await api(
        `/comanda/${id}`
      );

    const response =
      ComandaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando comanda"
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
      "Error obteniendo comanda"
    );

  }

}

/* =========================
    ACTUALIZAR COMANDA
========================= */

export async function updateComanda({

  comandaId,

  formData,

}: UpdateComandaType) {

  try {

    const { data } =
      await api.put(

        `/comanda/${comandaId}`,

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
      "Error actualizando comanda"
    );

  }

}

/* =========================
    ELIMINAR / ANULAR COMANDA
========================= */

export async function deleteComandaById({

  id,

  eliminadoPor,

}: DeleteComandaType) {

  try {

    const { data } =
      await api.delete(

        `/comanda/${id}`,

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
      "Error anulando comanda"
    );

  }

}

/* =========================
    OBTENER COMANDAS CON DETALLES POR PERFIL
========================= */

export async function getComandasConDetallesPorPerfil(
  idPerfil: string
) {

  try {

    const { data } =
      await api(
        `/comanda/perfil/${idPerfil}/detalles`
      );

    const response =
      ComandasConDetallesPorPerfilSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando comandas con detalles"
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
      "Error obteniendo comandas con detalles"
    );

  }

}
