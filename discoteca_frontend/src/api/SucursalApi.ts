// import api from "@/lib/axios";
// import { SucursalArraySchema, type SucursalFormData, type SucursalSchemaType } from "@/types/SucursalType";
// import { isAxiosError } from "axios";

// export async function createSucursal(formData: SucursalFormData) {
//   try {
//     const { data } = await api.post("/sucursal", formData);
//     return data
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {

//       throw new Error(error.response.data.error)
//     }
//   }
// }
// export async function getSucursal() {
//   try {
    
    
//     const { data } = await api("/sucursal");
//     const response = dashboardSucursalSchema.safeParse(data)
//     if (response.success) {

//       return response.data
//     }
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {

//       throw new Error(error.response.data.error)
//     }
//   }
// }

// export async function getSucursalById(id: SucursalSchemaType['_id']) {
//   try {
//     const { data } = await api(`/sucursal/${id}`);
//     return data
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {

//       throw new Error(error.response.data.error)
//     }
//   }
// }

// type SucursalApiType ={
//   formData: SucursalFormData
//   sucursalId: SucursalSchemaType['_id']
// }
// export async function updatetSucursal({formData, sucursalId}: SucursalApiType) {
//   try {
//     const { data } = await api.put<string>(`/sucursal/${sucursalId}`,formData);
//     return data
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {

//       throw new Error(error.response.data.error)
//     }
//   }
// }


// export async function deletSucursalById(id: SucursalSchemaType['_id']) {
//   try {
//     const { data } = await api.delete<string>(`/sucursal/${id}`);
//     console.log('el')
//     return data
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {
//       console.error("❌ Error de API:", error.response.data);
//       throw new Error(error.response.data.error);
//     } else {
//       console.error("❌ Error desconocido:", error);
//       throw new Error("Error inesperado");
//     }
//   }
// }

import api from "@/lib/axios";
import {
  SucursalArraySchema,
  SucursalSchema,
  type SucursalFormData,
  type SucursalType
} from "@/types/SucursalType"; // ajusta la ruta si es necesario
import { isAxiosError } from "axios";

/* =========================
   📌 CREAR
========================= */
export async function createSucursal(formData: SucursalFormData) {
  try {
    const { data } = await api.post("/sucursal", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

/* =========================
   📌 OBTENER TODOS
========================= */
export async function getSucursal() {
  try {
    const { data } = await api("/sucursal");

    const response = SucursalArraySchema.safeParse(data);

    if (response.success) {
      return response.data;
    } else {
      console.error("❌ Error de validación Zod:", response.error);
    }

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

/* =========================
   📌 OBTENER POR ID
========================= */
// export async function getSucursalById(id: SucursalType["_id"]) {
//   try {
//     if (!id) throw new Error("ID requerido");

//     const { data } = await api(`/sucursal/${id}`);

//     const response = SucursalSchema.safeParse(data);

//     if (response.success) {
//       return response.data;
//     } else {
//       console.error("❌ Error de validación Zod:", response.error);
//     }

//   } catch (error) {
//     if (isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.error);
//     }
//   }
// }
export async function getSucursalById(
  id: SucursalType["_id"]
): Promise<SucursalType> {

  try {
    if (!id) throw new Error("ID requerido");

    const { data } = await api(`/sucursal/${id}`);

    const response = SucursalSchema.safeParse(data);

    if (response.success) {
      return response.data;
    }

    // ❌ si falla Zod → lanzar error
    console.error("❌ Error de validación Zod:", response.error);
    throw new Error("Error al validar la sucursal");

  } catch (error) {

    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }

    // 🔥 importante: manejar cualquier otro error
    throw new Error("Error al obtener la sucursal");
  }
}

/* =========================
   📌 ACTUALIZAR
========================= */
type SucursalApiType = {
  formData: SucursalFormData;
  sucursalId: SucursalType["_id"];
};

export async function updateSucursal({
  formData,
  sucursalId,
}: SucursalApiType) {
  try {
    if (!sucursalId) throw new Error("ID requerido");

    const { data } = await api.put<string>(
      `/sucursal/${sucursalId}`,
      formData
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

/* =========================
   📌 ELIMINAR
========================= */
export async function deleteSucursalById(
  id: SucursalType["_id"]
) {
  try {
    if (!id) throw new Error("ID requerido");

    const { data } = await api.delete<string>(
      `/sucursal/${id}`
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("❌ Error de API:", error.response.data);
      throw new Error(error.response.data.error);
    } else {
      console.error("❌ Error desconocido:", error);
      throw new Error("Error inesperado");
    }
  }
}