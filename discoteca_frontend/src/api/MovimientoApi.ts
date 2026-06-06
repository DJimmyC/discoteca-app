// src/api/MovimientoApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {
  MovimientoArraySchema,
  MovimientoSchema,
  ProductosMasVendidosArraySchema,
  ReporteCajaDiariaSchema,
  EstadoResultadosSchema,
  FlujoEfectivoSchema,

  type MovimientoForm,
  type MovimientoType,
  type MovimientoFiltros,
} from "@/types/MovimientoType";

/* =====================================================
    OBTENER MENSAJE DE ERROR
===================================================== */

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

/* =====================================================
    ARMAR QUERY STRING
===================================================== */

function buildQueryParams(
  filtros?: MovimientoFiltros
): string {

  const params =
    new URLSearchParams();

  if (!filtros) {
    return "";
  }

  Object.entries(
    filtros
  ).forEach(
    ([
      key,
      value,
    ]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {

        params.append(
          key,
          String(value)
        );
      }
    }
  );

  return params.toString();
}

/* =====================================================
    CREAR MOVIMIENTO

    IMPORTANTE:
    Esta función se conserva temporalmente.

    Cuando todos los módulos registren sus movimientos
    desde el backend, debes dejar de llamarla desde las
    vistas y modales.
===================================================== */

export async function createMovimiento(
  formData: MovimientoForm
) {

  try {

    const {
      data,
    } = await api.post(
      "/movimiento",
      formData
    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error registrando movimiento"
      )
    );
  }
}

/* =====================================================
    OBTENER TODOS LOS MOVIMIENTOS
===================================================== */

export async function getMovimientos() {

  try {

    const {
      data,
    } = await api.get(
      "/movimiento"
    );

    const response =
      MovimientoArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DE MOVIMIENTOS:",
        data
      );

      console.log(
        "ERROR ZOD DE MOVIMIENTOS:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta de movimientos no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo movimientos"
      )
    );
  }
}

/* =====================================================
    OBTENER MOVIMIENTO POR ID
===================================================== */

export async function getMovimientoById(
  id: MovimientoType["_id"]
) {

  try {

    if (!id) {

      throw new Error(
        "El ID del movimiento es obligatorio"
      );
    }

    const {
      data,
    } = await api.get(
      `/movimiento/${id}`
    );

    const response =
      MovimientoSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DEL MOVIMIENTO:",
        data
      );

      console.log(
        "ERROR ZOD DEL MOVIMIENTO:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta del movimiento no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo movimiento"
      )
    );
  }
}

/* =====================================================
    FILTRAR MOVIMIENTOS
===================================================== */

export async function getMovimientosFiltrados(
  filtros: MovimientoFiltros
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const ruta =
      query
        ? `/movimiento/filtrar?${query}`
        : "/movimiento/filtrar";

    const {
      data,
    } = await api.get(
      ruta
    );

    const response =
      MovimientoArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DE MOVIMIENTOS FILTRADOS:",
        data
      );

      console.log(
        "ERROR ZOD DE MOVIMIENTOS FILTRADOS:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta de movimientos filtrados no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo movimientos filtrados"
      )
    );
  }
}

/* =====================================================
    PRODUCTOS MÁS VENDIDOS
===================================================== */

export async function getProductosMasVendidos(
  filtros: MovimientoFiltros = {}
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const ruta =
      query
        ? `/movimiento/productos-mas-vendidos?${query}`
        : "/movimiento/productos-mas-vendidos";

    const {
      data,
    } = await api.get(
      ruta
    );

    const response =
      ProductosMasVendidosArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DE PRODUCTOS MÁS VENDIDOS:",
        data
      );

      console.log(
        "ERROR ZOD DE PRODUCTOS MÁS VENDIDOS:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta de productos más vendidos no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo productos más vendidos"
      )
    );
  }
}

/* =====================================================
    REPORTE DE CAJA DIARIA
===================================================== */

export async function getReporteCajaDiaria(
  filtros: MovimientoFiltros = {}
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const ruta =
      query
        ? `/movimiento/reporte-caja-diaria?${query}`
        : "/movimiento/reporte-caja-diaria";

    const {
      data,
    } = await api.get(
      ruta
    );

    const response =
      ReporteCajaDiariaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DEL REPORTE DE CAJA:",
        data
      );

      console.log(
        "ERROR ZOD DEL REPORTE DE CAJA:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta del reporte de caja no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo reporte de caja diaria"
      )
    );
  }
}

/* =====================================================
    ESTADO DE RESULTADOS
===================================================== */

export async function getEstadoResultados(
  filtros: MovimientoFiltros = {}
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const ruta =
      query
        ? `/movimiento/estado-resultados?${query}`
        : "/movimiento/estado-resultados";

    const {
      data,
    } = await api.get(
      ruta
    );

    const response =
      EstadoResultadosSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DEL ESTADO DE RESULTADOS:",
        data
      );

      console.log(
        "ERROR ZOD DEL ESTADO DE RESULTADOS:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta del estado de resultados no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo estado de resultados"
      )
    );
  }
}

/* =====================================================
    FLUJO DE EFECTIVO
===================================================== */

export async function getFlujoEfectivo(
  filtros: MovimientoFiltros = {}
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const ruta =
      query
        ? `/movimiento/flujo-efectivo?${query}`
        : "/movimiento/flujo-efectivo";

    const {
      data,
    } = await api.get(
      ruta
    );

    const response =
      FlujoEfectivoSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA REAL DEL FLUJO DE EFECTIVO:",
        data
      );

      console.log(
        "ERROR ZOD DEL FLUJO DE EFECTIVO:",
        response.error.format()
      );

      console.log(
        "ISSUES ZOD:",
        response.error.issues
      );

      throw new Error(
        "La respuesta del flujo de efectivo no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo flujo de efectivo"
      )
    );
  }
}