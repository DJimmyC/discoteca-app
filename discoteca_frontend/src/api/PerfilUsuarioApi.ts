
import api from "@/lib/axios";

import { isAxiosError } from "axios";

import {

  PerfilUsuarioArraySchema,

  PerfilUsuarioSchema,

  UsuarioSchema,

  LoginResponseSchema,

  type PerfilUsuarioForm,

  type PerfilUsuarioType,

  type UsuarioLoginForm,

  type LoginForm,

} from "@/types/PerfilUsuarioType";

/* =========================
    CREAR PERFIL USUARIO
========================= */
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

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error creando perfil usuario"
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */
export async function getPerfilUsuarios() {

  try {

    const { data } =
      await api(
        "/perfilusuario"
      );

      console.log(data)
      const response =
      PerfilUsuarioArraySchema.safeParse(
        data
      );
      
      
    /* =========================
        VALIDACION
    ========================= */
    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando perfiles usuario"
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
      "Error obteniendo perfiles usuario"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */
export async function getPerfilUsuarioById(
  id: PerfilUsuarioType["_id"]
) {

  try {

    const { data } =
      await api(
        `/perfilusuario/${id}`
      );
      
      const response =
      PerfilUsuarioSchema.safeParse(
        data
      );
      

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando perfil usuario"
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
      "Error obteniendo perfil usuario"
    );

  }

}

/* =========================
    ACTUALIZAR
========================= */
type PerfilUsuarioApiType = {

  formData:
    PerfilUsuarioForm;

  perfilUsuarioId:
    PerfilUsuarioType["_id"];

};

export async function updatePerfilUsuario({

  formData,

  perfilUsuarioId,

}: PerfilUsuarioApiType) {

  try {

    const { data } =
      await api.put<string>(

        `/perfilusuario/${perfilUsuarioId}`,

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
      "Error actualizando perfil usuario"
    );

  }

}

/* =========================
    ELIMINAR LOGICO
========================= */
type DeletePerfilUsuarioType = {

  id:
    PerfilUsuarioType["_id"];

  eliminadoPor:
    string;

};

export async function deletePerfilUsuarioById({

  id,

  eliminadoPor,

}: DeletePerfilUsuarioType) {

  try {

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

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error eliminando perfil usuario"
    );

  }

}

/* =========================
    LOGIN
========================= */
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

    /* =========================
        VALIDACION
    ========================= */
    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando login"
      );

    }

    /* =========================
        GUARDAR TOKEN
    ========================= */
    localStorage.setItem(

      "AUTH_TOKEN",

      response.data.tokenjwt

    );

    /* =========================
        GUARDAR USER
    ========================= */
    localStorage.setItem(

      "USER",

      JSON.stringify(
        response.data.usuario
      )

    );

    return response.data.usuario;

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
      "Error iniciando sesión"
    );

  }

}

/* =========================
    ACTUALIZAR PASSWORD
========================= */
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

    if (
      isAxiosError(error) &&
      error.response
    ) {

      throw new Error(
        error.response.data.error
      );

    }

    throw new Error(
      "Error actualizando password"
    );

  }

}

/* =========================
    AUTH USUARIO
========================= */
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

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando autenticación"
      );

    }

    /* =========================
        TOKEN
    ========================= */
    localStorage.setItem(

      "AUTH_TOKEN",

      response.data.tokenjwt

    );

    /* =========================
        USER
    ========================= */
    localStorage.setItem(

      "USER",

      JSON.stringify(
        response.data.usuario
      )

    );

    return response.data.usuario;

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
      "Error autenticando usuario"
    );

  }

}

/* =========================
    OBTENER USER
========================= */
export async function getUser() {

  try {

    const { data } =
      await api(
        "/perfilusuario/usuario"
      );

    const response =
      UsuarioSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando usuario"
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
      "Error obteniendo usuario"
    );

  }

  

}
/* =========================
    ACTUALIZAR PERFIL PERSONAL
========================= */

export type PerfilPersonalForm = {

  nombres:
    string;

  apellidos?:
    string | null;

  edad?:
    number | null;

  sexo?:
    string | null;

  ci?:
    string | null;

  telefono?:
    string | null;

  email?:
    string | null;

  actualizadoPor?:
    string | null;

};

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

    const { data } =
      await api.put(

        `/perfilusuario/${perfilUsuarioId}`,

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
      "Error actualizando perfil personal"
    );

  }

}