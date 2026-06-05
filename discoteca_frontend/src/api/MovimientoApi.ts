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

/* =========================
    ARMAR QUERY STRING
========================= */

function buildQueryParams(
  filtros?: MovimientoFiltros
) {

  const params =
    new URLSearchParams();

  if (!filtros) {
    return params.toString();
  }

  Object.entries(filtros).forEach(
    ([key, value]) => {

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

/* =========================
    CREAR MOVIMIENTO
========================= */

export async function createMovimiento(
  formData: MovimientoForm
) {

  try {

    const { data } =
      await api.post(

        "/movimiento",

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
      "Error registrando movimiento"
    );

  }

}

/* =========================
    OBTENER TODOS LOS MOVIMIENTOS
========================= */

export async function getMovimientos() {

  try {

    const { data } =
      await api(
        "/movimiento"
      );

    const response =
      MovimientoArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando movimientos"
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
      "Error obteniendo movimientos"
    );

  }

}

/* =========================
    OBTENER MOVIMIENTO POR ID
========================= */

export async function getMovimientoById(
  id: MovimientoType["_id"]
) {

  try {

    const { data } =
      await api(
        `/movimiento/${id}`
      );

    const response =
      MovimientoSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando movimiento"
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
      "Error obteniendo movimiento"
    );

  }

}

/* =========================
    FILTRAR MOVIMIENTOS
========================= */

export async function getMovimientosFiltrados(
  filtros: MovimientoFiltros
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const { data } =
      await api(
        `/movimiento/filtrar?${query}`
      );

    const response =
      MovimientoArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando movimientos filtrados"
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
      "Error obteniendo movimientos filtrados"
    );

  }

}

/* =========================
    PRODUCTOS MAS VENDIDOS
========================= */

export async function getProductosMasVendidos(
  filtros: MovimientoFiltros
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const { data } =
      await api(
        `/movimiento/productos-mas-vendidos?${query}`
      );

    const response =
      ProductosMasVendidosArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando productos más vendidos"
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
      "Error obteniendo productos más vendidos"
    );

  }

}

/* =========================
    REPORTE CAJA DIARIA
========================= */

export async function getReporteCajaDiaria(
  filtros: MovimientoFiltros
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const { data } =
      await api(
        `/movimiento/reporte-caja-diaria?${query}`
      );

    const response =
      ReporteCajaDiariaSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando reporte de caja diaria"
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
      "Error obteniendo reporte de caja diaria"
    );

  }

}

/* =========================
    ESTADO DE RESULTADOS
========================= */

export async function getEstadoResultados(
  filtros: MovimientoFiltros
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const { data } =
      await api(
        `/movimiento/estado-resultados?${query}`
      );

    const response =
      EstadoResultadosSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando estado de resultados"
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
      "Error obteniendo estado de resultados"
    );

  }

}

/* =========================
    FLUJO DE EFECTIVO
========================= */

export async function getFlujoEfectivo(
  filtros: MovimientoFiltros
) {

  try {

    const query =
      buildQueryParams(
        filtros
      );

    const { data } =
      await api(
        `/movimiento/flujo-efectivo?${query}`
      );

    const response =
      FlujoEfectivoSchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando flujo de efectivo"
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
      "Error obteniendo flujo de efectivo"
    );

  }

}