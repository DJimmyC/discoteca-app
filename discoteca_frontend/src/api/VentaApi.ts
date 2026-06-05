import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  VentaArraySchema,

  VentaSchema,

  VentasConDetallesPorPerfilSchema,

  type VentaForm,

  type VentaType,

  type UpdateVentaType,

  type DeleteVentaType,

} from "@/types/VentaType";

/* =========================
    CREAR VENTA
========================= */

export async function createVenta(
  formData: VentaForm
) {

  try {

    const { data } =
      await api.post(

        "/venta",

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
      "Error creando venta"
    );

  }

}

/* =========================
    OBTENER TODAS
========================= */

export async function getVentas() {

  try {

    const { data } =
      await api(
        "/venta"
      );

    const response =
      VentaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando ventas"
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
      "Error obteniendo ventas"
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getVentaById(
  id: VentaType["_id"]
) {

  try {

    const { data } =
      await api(
        `/venta/${id}`
      );

    const response =
      VentaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando venta"
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
      "Error obteniendo venta"
    );

  }

}

/* =========================
    OBTENER VENTAS CON DETALLES POR PERFIL
========================= */

export async function getVentasConDetallesPorPerfil(
  idPerfil: string
) {

  try {

    const { data } =
      await api(
        `/venta/perfil/${idPerfil}/detalles`
      );

    const response =
      VentasConDetallesPorPerfilSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando ventas con detalles"
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
      "Error obteniendo ventas con detalles"
    );

  }

}

/* =========================
    ACTUALIZAR VENTA
========================= */

export async function updateVenta({

  ventaId,

  formData,

}: UpdateVentaType) {

  try {

    const { data } =
      await api.put(

        `/venta/${ventaId}`,

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
      "Error actualizando venta"
    );

  }

}

/* =========================
    ELIMINAR / ANULAR VENTA
========================= */

export async function deleteVentaById({

  id,

  eliminadoPor,

}: DeleteVentaType) {

  try {

    const { data } =
      await api.delete(

        `/venta/${id}`,

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
      "Error anulando venta"
    );

  }

}
/* =========================
    MARCAR VENTA COMO CORTESIA
========================= */

type CortesiaVentaType = {

  id:
    VentaType["_id"];

  eliminadoPor?:
    string;

};

export async function cortesiaVentaById({

  id,

  eliminadoPor,

}: CortesiaVentaType) {

  try {

    const { data } =
      await api.patch(

        `/venta/${id}/cortesia`,

        {
          eliminadoPor,
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
      "Error marcando venta como cortesía"
    );

  }

}