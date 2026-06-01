// // src/api/CajaApi.ts

// import api from "@/lib/axios";

// import {
//   isAxiosError,
// } from "axios";

// import {

//   CajaArraySchema,

//   CajaSchema,

//   type CajaForm,

//   type CajaType,

// } from "@/types/CajaType";

// /* =========================
//     CREAR
// ========================= */

// export async function createCaja(
//   formData: CajaForm
// ) {

//   try {

//     const { data } =
//       await api.post(
//         "/caja",
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

//   }

// }

// /* =========================
//     OBTENER TODAS
// ========================= */

// export async function getCajas() {

//   try {

//     const { data } =
//       await api("/caja");

//     const response =
//       CajaArraySchema.safeParse(
//         data
//       );

//     if (!response.success) {

//       console.log(
//         response.error.format()
//       );

//       throw new Error(
//         "Error validando cajas"
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
//       "Error obteniendo cajas"
//     );

//   }

// }

// /* =========================
//     OBTENER POR ID
// ========================= */

// export async function getCajaById(
//   id: CajaType["_id"]
// ) {

//   try {

//     const { data } =
//       await api(
//         `/caja/${id}`
//       );

//     const response =
//       CajaSchema.safeParse(
//         data
//       );

//     if (!response.success) {

//       console.log(
//         response.error.format()
//       );

//       throw new Error(
//         "Error validando caja"
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
//       "Error obteniendo caja"
//     );

//   }

// }

// /* =========================
//     ACTUALIZAR
// ========================= */

// type UpdateCajaType = {

//   formData:
//     CajaForm;

//   cajaId:
//     CajaType["_id"];

// };

// export async function updateCaja({

//   formData,

//   cajaId,

// }: UpdateCajaType) {

//   try {

//     const { data } =
//       await api.put(

//         `/caja/${cajaId}`,

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

//   }

// }

// /* =========================
//     ELIMINAR
// ========================= */

// // export async function deleteCajaById(
// //   id: CajaType["_id"]
// // ) {

// //   try {

// //     const { data } =
// //       await api.delete(
// //         `/caja/${id}`
// //       );

// //     return data;

// //   } catch (error) {

// //     if (
// //       isAxiosError(error) &&
// //       error.response
// //     ) {

// //       throw new Error(
// //         error.response.data.error
// //       );

// //     }

// //     throw new Error(
// //       "Error eliminando caja"
// //     );

// //   }

// // }
// type DeleteCajaType = {

//   id: string;

//   eliminadoPor: string;

// };

// export async function deleteCajaById({

//   id,

//   eliminadoPor,

// }: DeleteCajaType) {

//   try {

//     const { data } =
//       await api.delete(

//         `/caja/${id}`,

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
//       "Error eliminando caja"
//     );

//   }

// }


// src/api/CajaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  CajaArraySchema,

  CajaSchema,

  type CajaForm,

  type CajaType,

  type UpdateCajaType,

  type DeleteCajaType,

} from "@/types/CajaType";

/* =========================
    CREAR
========================= */

export async function createCaja(
  formData: CajaForm
) {

  try {

    const { data } =
      await api.post(
        "/caja",
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
      "Error creando caja"
    );

  }

}

/* =========================
    OBTENER TODAS
========================= */

export async function getCajas() {

  try {

    const { data } =
      await api(
        "/caja"
      );

    const response =
      CajaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando cajas"
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
      "Error obteniendo cajas"
    );

  }

}

/* =========================
    OBTENER CAJAS POR SUCURSAL
========================= */

export async function getCajasBySucursal(
  idSucursal: string
) {

  try {

    const { data } =
      await api(
        `/caja/sucursal/${idSucursal}`
      );

    const response =
      CajaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando cajas por sucursal"
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
      "Error obteniendo cajas por sucursal"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getCajaById(
  id: CajaType["_id"]
) {

  try {

    const { data } =
      await api(
        `/caja/${id}`
      );

    const response =
      CajaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando caja"
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
      "Error obteniendo caja"
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */

export async function updateCaja({

  formData,

  cajaId,

}: UpdateCajaType) {

  try {

    const { data } =
      await api.put(

        `/caja/${cajaId}`,

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
      "Error actualizando caja"
    );

  }

}

/* =========================
    ELIMINAR
========================= */

export async function deleteCajaById({

  id,

  eliminadoPor,

}: DeleteCajaType) {

  try {

    const { data } =
      await api.delete(

        `/caja/${id}`,

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
      "Error eliminando caja"
    );

  }

}