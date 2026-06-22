import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  PerfilUsuarioArraySchema,

  PerfilUsuarioSchema,

  UsuarioSchema,

  LoginResponseSchema,

  PersonalPorSucursalResponseSchema,

  type PerfilUsuarioForm,

  type PerfilUsuarioType,

  type UsuarioLoginForm,

  type LoginForm,

  type PerfilPersonalForm,

  type PersonalPorSucursalResponse,

} from "@/types/PerfilUsuarioType";

/* =========================================
    OBTENER MENSAJE DE ERROR
========================================= */

function getErrorMessage(
  error: unknown,
  defaultMessage: string
): string {

  if (
    isAxiosError(error) &&
    error.response
  ) {

    const apiError =
      error.response.data?.error;

    const apiMessage =
      error.response.data?.message;

    if (
      typeof apiError === "string"
    ) {
      return apiError;
    }

    if (
      typeof apiMessage === "string"
    ) {
      return apiMessage;
    }

  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return defaultMessage;

}

/* =========================================
    CREAR PERFIL USUARIO
========================================= */

export async function createPerfilUsuario(
  formData: PerfilUsuarioForm
) {

  try {

    const { data } =
      await api.post(

        "/perfilusuario",

        formData

      );

    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error creando perfil usuario"
      )
    );

  }

}

/* =========================================
    OBTENER TODOS LOS PERFILES
========================================= */

export async function getPerfilUsuarios() {

  try {

    const { data } =
      await api.get(
        "/perfilusuario"
      );

    const response =
      PerfilUsuarioArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.error(
        "Error Zod al validar perfiles:",
        response.error.format()
      );

      console.error(
        "Datos recibidos:",
        data
      );

      throw new Error(
        "La respuesta de perfiles no tiene el formato esperado"
      );

    }

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error obteniendo perfiles usuario"
      )
    );

  }

}

/* =========================================
    OBTENER PERFIL POR ID
========================================= */

export async function getPerfilUsuarioById(
  id: string
) {

  try {

    if (!id) {
      throw new Error(
        "El ID del perfil es obligatorio"
      );
    }

    const { data } =
      await api.get(
        `/perfilusuario/${id}`
      );

    const response =
      PerfilUsuarioSchema.safeParse(
        data
      );

    if (!response.success) {

      console.error(
        "Error Zod al validar perfil:",
        response.error.format()
      );

      console.error(
        "Datos recibidos:",
        data
      );

      throw new Error(
        "La respuesta del perfil no tiene el formato esperado"
      );

    }

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error obteniendo perfil usuario"
      )
    );

  }

}

/* =========================================
    ACTUALIZAR PERFIL USUARIO
========================================= */

type UpdatePerfilUsuarioType = {

  formData:
    PerfilUsuarioForm;

  perfilUsuarioId:
    string;

};

export async function updatePerfilUsuario({

  formData,

  perfilUsuarioId,

}: UpdatePerfilUsuarioType) {

  try {

    if (!perfilUsuarioId) {
      throw new Error(
        "El ID del perfil es obligatorio"
      );
    }

    const { data } =
      await api.put<string>(

        `/perfilusuario/${perfilUsuarioId}`,

        formData

      );

    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error actualizando perfil usuario"
      )
    );

  }

}

/* =========================================
    ELIMINAR PERFIL LÓGICAMENTE
========================================= */

type DeletePerfilUsuarioType = {

  id:
    string;

  eliminadoPor:
    string;

};

export async function deletePerfilUsuarioById({

  id,

  eliminadoPor,

}: DeletePerfilUsuarioType) {

  try {

    if (!id) {
      throw new Error(
        "El ID del perfil es obligatorio"
      );
    }

    const { data } =
      await api.delete<string>(

        `/perfilusuario/${id}`,

        {

          data: {
            eliminadoPor,
          },

        }

      );

    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error eliminando perfil usuario"
      )
    );

  }

}

/* =========================================
    LOGIN
========================================= */

export async function loginPerfilUsuario(
  formData: LoginForm
) {

  try {

    const { data } =
      await api.post(

        "/perfilusuario/login",

        formData

      );

    const response =
      LoginResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.error(
        "Error Zod al validar login:",
        response.error.format()
      );

      console.error(
        "Datos recibidos:",
        data
      );

      throw new Error(
        "La respuesta del login no tiene el formato esperado"
      );

    }

    localStorage.setItem(

      "AUTH_TOKEN",

      response.data.tokenjwt

    );

    localStorage.setItem(

      "USER",

      JSON.stringify(
        response.data.usuario
      )

    );

    return response.data.usuario;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error iniciando sesión"
      )
    );

  }

}

/* =========================================
    AUTENTICACIÓN USUARIO
========================================= */

export async function autenticacionUsuario(
  formData: UsuarioLoginForm
) {

  try {

    const { data } =
      await api.post(

        "/perfilusuario/login",

        formData

      );

    const response =
      LoginResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.error(
        "Error Zod al validar autenticación:",
        response.error.format()
      );

      console.error(
        "Datos recibidos:",
        data
      );

      throw new Error(
        "La respuesta de autenticación no tiene el formato esperado"
      );

    }

    localStorage.setItem(

      "AUTH_TOKEN",

      response.data.tokenjwt

    );

    localStorage.setItem(

      "USER",

      JSON.stringify(
        response.data.usuario
      )

    );

    return response.data.usuario;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error autenticando usuario"
      )
    );

  }

}

/* =========================================
    ACTUALIZAR CONTRASEÑA
========================================= */

type UpdatePasswordType = {

  id:
    string;

  passwordActual:
    string;

  passwordNueva:
    string;

  actualizadoPor?:
    string;

};

export async function updatePasswordPerfilUsuario({

  id,

  passwordActual,

  passwordNueva,

  actualizadoPor,

}: UpdatePasswordType) {

  try {

    if (!id) {
      throw new Error(
        "El ID del usuario es obligatorio"
      );
    }

    const { data } =
      await api.put(

        `/perfilusuario/password/${id}`,

        {

          passwordActual,

          passwordNueva,

          actualizadoPor,

        }

      );

    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error actualizando contraseña"
      )
    );

  }

}

/* =========================================
    OBTENER USUARIO AUTENTICADO
========================================= */

export async function getUser() {

  try {

    const { data } =
      await api.get(
        "/perfilusuario/usuario"
      );

    const response =
      UsuarioSchema.safeParse(
        data
      );

    if (!response.success) {

      console.error(
        "Error Zod al validar usuario:",
        response.error.format()
      );

      console.error(
        "Datos recibidos:",
        data
      );

      throw new Error(
        "La respuesta del usuario no tiene el formato esperado"
      );

    }

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error obteniendo usuario"
      )
    );

  }

}

/* =========================================
    ACTUALIZAR PERFIL PERSONAL
========================================= */

type UpdatePerfilPersonalType = {

  perfilUsuarioId:
    string;

  formData:
    PerfilPersonalForm;

};

export async function updatePerfilPersonal({

  perfilUsuarioId,

  formData,

}: UpdatePerfilPersonalType) {

  try {

    if (!perfilUsuarioId) {
      throw new Error(
        "El ID del perfil es obligatorio"
      );
    }

    const { data } =
      await api.put(

        `/perfilusuario/${perfilUsuarioId}`,

        formData

      );

    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error actualizando perfil personal"
      )
    );

  }

}

/* =========================================
    OBTENER PERSONAL DE UNA SUCURSAL
========================================= */

export async function getPersonalBySucursal(
  idSucursal: string
): Promise<PersonalPorSucursalResponse> {

  try {

    if (!idSucursal) {
      throw new Error(
        "El ID de la sucursal es obligatorio"
      );
    }

    const { data } =
      await api.get(

        `/perfilusuario/sucursal/${idSucursal}/personal`

      );

    const response =
      PersonalPorSucursalResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.error(
        "Error Zod al validar personal por sucursal:",
        response.error.format()
      );

      console.error(
        "Datos recibidos:",
        data
      );

      throw new Error(
        "La respuesta del personal no tiene el formato esperado"
      );

    }

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Error obteniendo el personal de la sucursal"
      )
    );

  }

}