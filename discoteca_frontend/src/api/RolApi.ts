import api from "@/lib/axios";
import { isAxiosError } from "axios";

import {
  RolArraySchema,
  RolSchema,
  type RolFormData,
  type RolType
} from "@/types/RolType";

/* =========================
    CREAR ROL
========================= */
export async function createRol(
  formData: RolFormData
) {

  try {

    const { data } = await api.post(
      "/rol",
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
export async function getRoles() {

  try {

    const { data } = await api(
      "/rol"
    );

    const response =
      RolArraySchema.safeParse(data);

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
export async function getRolById(
  id: RolType["_id"]
) {

  try {

    const { data } = await api(
      `/rol/${id}`
    );

    const response =
      RolSchema.safeParse(data);

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
type RolApiType = {
  formData: RolFormData;
  rolId: RolType["_id"];
};

export async function updateRol({
  formData,
  rolId
}: RolApiType) {

  try {

    const { data } =
      await api.put<string>(
        `/rol/${rolId}`,
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
type DeleteRolType = {
  id: RolType["_id"];
  eliminadoPor: string;
};

export async function deleteRolById({
  id,
  eliminadoPor,
}: DeleteRolType) {

  try {

    const { data } =
      await api.delete<string>(
        `/rol/${id}`,
        {
          data: {
            eliminadoPor
          }
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