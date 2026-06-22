// src/api/VentaApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {
  CreateVentaResponseSchema,
  VentaArraySchema,
  VentaSchema,
  VentasConDetallesPorPerfilSchema,
  ReporteVentasMeseroPorCajasSchema,

  type VentaForm,
  type VentaType,
  type UpdateVentaType,
  type DeleteVentaType,
  type CortesiaVentaType,
  type GetReporteVentasMeseroPorCajasParams,
} from "@/types/VentaType";

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

    const errorBackend =
      error.response.data?.error;

    const mensajeBackend =
      error.response.data?.message;

    if (
      typeof errorBackend ===
      "string"
    ) {
      return errorBackend;
    }

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
    VALIDAR DATOS DE VENTA
========================= */

function validarVenta(
  formData: VentaForm
): void {

  if (!formData.idCaja) {

    throw new Error(
      "El ID de la caja es obligatorio"
    );

  }

  if (!formData.idPerfil) {

    throw new Error(
      "El ID del perfil es obligatorio"
    );

  }

  if (!formData.idSucursal) {

    throw new Error(
      "El ID de la sucursal es obligatorio"
    );

  }

  const subtotal =
    Number(
      formData.subtotal
    );

  const descuento =
    Number(
      formData.descuento || 0
    );

  if (
    !Number.isFinite(subtotal) ||
    subtotal < 0
  ) {

    throw new Error(
      "El subtotal de la venta no es válido"
    );

  }

  if (
    !Number.isFinite(descuento) ||
    descuento < 0
  ) {

    throw new Error(
      "El descuento de la venta no es válido"
    );

  }

  if (
    descuento >
    subtotal
  ) {

    throw new Error(
      "El descuento no puede ser mayor al subtotal"
    );

  }

  const metodosValidos = [
    "efectivo",
    "qr",
    "transferencia",
    "mixto",
  ];

  if (
    !metodosValidos.includes(
      formData.metodoPago
    )
  ) {

    throw new Error(
      "El método de pago no es válido"
    );

  }

}

/* =========================
    CREAR VENTA
========================= */

export async function createVenta(
  formData: VentaForm
) {

  try {

    validarVenta(
      formData
    );

    const {
      data,
    } = await api.post(

      "/venta",

      formData

    );

    const response =
      CreateVentaResponseSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL AL CREAR VENTA:",
        data
      );

      console.log(
        "ERROR ZOD AL CREAR VENTA:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta de la venta no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error creando venta"
      )
    );

  }

}

/* =========================
    OBTENER TODAS
========================= */

export async function getVentas() {

  try {

    const {
      data,
    } = await api.get(
      "/venta"
    );

    const response =
      VentaArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DE VENTAS:",
        data
      );

      console.log(
        "ERROR ZOD DE VENTAS:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La estructura de las ventas no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo ventas"
      )
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

    if (!id) {

      throw new Error(
        "El ID de la venta es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(
      `/venta/${id}`
    );

    const response =
      VentaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DE LA VENTA:",
        data
      );

      console.log(
        "ERROR ZOD DE LA VENTA:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La estructura de la venta no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo venta"
      )
    );

  }

}

/* =========================
    OBTENER VENTAS CON
    DETALLES POR PERFIL
========================= */

export async function
getVentasConDetallesPorPerfil(
  idPerfil: string
) {

  try {

    if (!idPerfil) {

      throw new Error(
        "El ID del perfil es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(

      `/venta/perfil/${idPerfil}/detalles`

    );

    const response =
      VentasConDetallesPorPerfilSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DE VENTAS CON DETALLES:",
        data
      );

      console.log(
        "ERROR ZOD DE VENTAS CON DETALLES:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La estructura de las ventas con detalles no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo ventas con detalles"
      )
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

    if (!ventaId) {

      throw new Error(
        "El ID de la venta es obligatorio"
      );

    }

    if (
      formData.subtotal !==
      undefined
    ) {

      const subtotal =
        Number(
          formData.subtotal
        );

      if (
        !Number.isFinite(subtotal) ||
        subtotal < 0
      ) {

        throw new Error(
          "El subtotal no es válido"
        );

      }

    }

    if (
      formData.descuento !==
      undefined
    ) {

      const descuento =
        Number(
          formData.descuento
        );

      if (
        !Number.isFinite(descuento) ||
        descuento < 0
      ) {

        throw new Error(
          "El descuento no es válido"
        );

      }

      if (
        formData.subtotal !==
          undefined &&
        descuento >
          Number(formData.subtotal)
      ) {

        throw new Error(
          "El descuento no puede ser mayor al subtotal"
        );

      }

    }

    const {
      data,
    } = await api.put(

      `/venta/${ventaId}`,

      formData

    );

    /*
      El controller devuelve:

      {
        message: "Venta actualizada",
        venta: {...}
      }
    */

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error actualizando venta"
      )
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

    if (!id) {

      throw new Error(
        "El ID de la venta es obligatorio"
      );

    }

    const {
      data,
    } = await api.delete(

      `/venta/${id}`,

      {
        data: {

          eliminadoPor:
            eliminadoPor ||
            "admin",

        },
      }

    );

    /*
      El backend debe:
      - marcar la venta como anulada
      - eliminar lógicamente sus detalles
      - devolver el stock
    */

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error anulando venta"
      )
    );

  }

}
/* =========================
    REPORTE DEL MESERO
    AGRUPADO POR CAJAS
========================= */

export async function getReporteVentasMeseroPorCajas({
  idPerfil,
  idSucursal,
  idAperturaCaja,
}: GetReporteVentasMeseroPorCajasParams) {
  try {
    if (!idPerfil) {
      throw new Error(
        "El ID del mesero es obligatorio"
      );
    }

    if (!idSucursal) {
      throw new Error(
        "El ID de la sucursal es obligatorio"
      );
    }

    const params =
      new URLSearchParams();

    params.append(
      "idSucursal",
      idSucursal
    );

    if (idAperturaCaja) {
      params.append(
        "idAperturaCaja",
        idAperturaCaja
      );
    }

    const {
      data,
    } = await api.get(
      `/venta/mesero/${idPerfil}/reporte-cajas?${params.toString()}`
    );

    const response =
      ReporteVentasMeseroPorCajasSchema
        .safeParse(data);

    if (!response.success) {
      console.log(
        "RESPUESTA REAL DEL REPORTE MESERO POR CAJAS:",
        data
      );

      console.log(
        "ERROR ZOD DEL REPORTE MESERO POR CAJAS:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La estructura del reporte del mesero por cajas no coincide con el type"
      );
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo reporte del mesero por cajas"
      )
    );
  }
}

/* =========================
    MARCAR VENTA COMO CORTESÍA
========================= */

export async function cortesiaVentaById({

  id,

  actualizadoPor,

  observacion,

}: CortesiaVentaType) {

  try {

    if (!id) {

      throw new Error(
        "El ID de la venta es obligatorio"
      );

    }

    const {
      data,
    } = await api.patch(

      `/venta/${id}/cortesia`,

      {

        actualizadoPor:
          actualizadoPor ||
          "admin",

        observacion:
          observacion ||
          "Venta marcada como cortesía",

      }

    );

    /*
      Una cortesía:
      - conserva la salida del inventario
      - no devuelve el stock
      - no debe sumar como ingreso
    */

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error marcando venta como cortesía"
      )
    );

  }

}