// src/api/DetalleVentaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {
  CreateDetalleVentaResponseSchema,
  DetalleVentaArraySchema,
  DetalleVentaSchema,

  type DetalleVentaForm,
  type DetalleVentaType,
  type UpdateDetalleVentaType,
  type DeleteDetalleVentaType,
} from "@/types/DetalleVentaType";

/* =========================
    OBTENER MENSAJE DE ERROR
========================= */

function obtenerMensajeError(
  error: unknown,
  mensajePredeterminado: string
): string {

  if (
    isAxiosError(error) &&
    error.response
  ) {

    const mensajeBackend =
      error.response.data?.error;

    if (
      typeof mensajeBackend ===
      "string"
    ) {
      return mensajeBackend;
    }

  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return mensajePredeterminado;

}

/* =========================
    VALIDAR DETALLE
========================= */

function validarDetalleVenta(
  formData: DetalleVentaForm
): void {

  if (!formData.idVenta) {

    throw new Error(
      "El ID de la venta es obligatorio"
    );

  }

  if (!formData.idProducto) {

    throw new Error(
      "El ID del producto es obligatorio"
    );

  }

  if (!formData.idInventario) {

    throw new Error(
      "El ID del inventario es obligatorio"
    );

  }

  if (!formData.idAlmacen) {

    throw new Error(
      "El ID del almacén es obligatorio"
    );

  }

  const cantidad =
    Number(
      formData.cantidad
    );

  const precioUnitario =
    Number(
      formData.precioUnitario
    );

  if (
    !Number.isFinite(cantidad) ||
    cantidad <= 0
  ) {

    throw new Error(
      "La cantidad debe ser mayor a cero"
    );

  }

  if (
    !Number.isFinite(
      precioUnitario
    ) ||
    precioUnitario < 0
  ) {

    throw new Error(
      "El precio unitario no es válido"
    );

  }

}

/* =========================
    CREAR DETALLE VENTA
========================= */

export async function createDetalleVenta(
  formData: DetalleVentaForm
) {

  try {

    validarDetalleVenta(
      formData
    );

    const {
      data,
    } = await api.post(

      "/detalleventa",

      formData

    );

    const response =
      CreateDetalleVentaResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA DETALLE VENTA:",
        data
      );

      console.log(
        "ERROR ZOD:",
        response.error.format()
      );

      throw new Error(
        "La respuesta del detalle de venta no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error creando detalle de venta"
      )
    );

  }

}

/* =========================
    CREAR MUCHOS DETALLES
========================= */

export async function createManyDetalleVenta(
  detalles: DetalleVentaForm[]
) {

  try {

    if (
      !detalles ||
      detalles.length === 0
    ) {

      throw new Error(
        "No existen detalles para registrar"
      );

    }

    const respuestas = [];

    /*
      Se registran uno por uno para evitar
      el error de Promise.all y controlar
      mejor cuál detalle falla.
    */

    for (
      const detalle
      of detalles
    ) {

      const respuesta =
        await createDetalleVenta(
          detalle
        );

      respuestas.push(
        respuesta
      );

    }

    return respuestas;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error creando detalles de venta"
      )
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getDetallesVenta() {

  try {

    const {
      data,
    } = await api.get(
      "/detalleventa"
    );

    const response =
      DetalleVentaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA DETALLES:",
        data
      );

      console.log(
        "ERROR ZOD:",
        response.error.format()
      );

      throw new Error(
        "Error validando detalles de venta"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo detalles de venta"
      )
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getDetalleVentaById(
  id: DetalleVentaType["_id"]
) {

  try {

    if (!id) {

      throw new Error(
        "El ID del detalle de venta es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(
      `/detalleventa/${id}`
    );

    const response =
      DetalleVentaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA DETALLE:",
        data
      );

      console.log(
        "ERROR ZOD:",
        response.error.format()
      );

      throw new Error(
        "Error validando detalle de venta"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo detalle de venta"
      )
    );

  }

}

/* =========================
    ACTUALIZAR DETALLE
========================= */

export async function updateDetalleVenta({

  detalleVentaId,

  formData,

}: UpdateDetalleVentaType) {

  try {

    if (!detalleVentaId) {

      throw new Error(
        "El ID del detalle de venta es obligatorio"
      );

    }

    const {
      data,
    } = await api.put(

      `/detalleventa/${detalleVentaId}`,

      formData

    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error actualizando detalle de venta"
      )
    );

  }

}

/* =========================
    ELIMINAR DETALLE
========================= */

export async function deleteDetalleVentaById({

  id,

  eliminadoPor,

}: DeleteDetalleVentaType) {

  try {

    if (!id) {

      throw new Error(
        "El ID del detalle de venta es obligatorio"
      );

    }

    const {
      data,
    } = await api.delete(

      `/detalleventa/${id}`,

      {
        data: {

          eliminadoPor:
            eliminadoPor ||
            "admin",

        },
      }

    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error eliminando detalle de venta"
      )
    );

  }

}