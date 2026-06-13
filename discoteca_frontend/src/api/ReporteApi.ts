import api from "@/lib/axios";

import type {
  ReporteFiltros,
  DashboardReporteResponse,
  VentasResumenResponse,
  VentasPorSucursalResponse,
  VentasPorCajaResponse,
  VentasPorVendedorResponse,
  VentasPorMetodoPagoResponse,
    
  ProductosMasVendidosResponse, 
  InventarioGeneralResponse,
  InventarioStockBajoResponse,
  ValorInventarioResponse,
  KardexProductoResponse,
  EstadoResultadosResponse,
  FlujoEfectivoResponse,
  CierresCajaResponse,
  SolicitudesResumenResponse,
  ReporteKardexFiltros,
  ReporteKardexResponse,
} from "@/types/ReporteType";

/* =====================================================
   RESPUESTA DE PRUEBA
===================================================== */

export type ReporteTestResponse = {
  ok: boolean;
  message: string;
};


/* =====================================================
   ENDPOINTS DEL BACKEND
===================================================== */

const REPORTE_ENDPOINTS = {
  test: "/reportes/test",

  dashboard: "/reportes/dashboard",

  ventasResumen:
    "/reportes/ventas/resumen",

  ventasPorSucursal:
    "/reportes/ventas/por-sucursal",

  ventasPorCaja:
    "/reportes/ventas/por-caja",

  ventasPorVendedor:
    "/reportes/ventas/por-vendedor",

  ventasPorMetodoPago:
    "/reportes/ventas/metodos-pago",

  productosMasVendidos:
    "/reportes/ventas/productos-mas-vendidos",

  inventarioGeneral:
    "/reportes/inventario/general",

  inventarioStockBajo:
    "/reportes/inventario/stock-bajo",

  valorInventario:
    "/reportes/inventario/valor",

  /*
   * Kardex general por sucursal.
   *
   * GET:
   * /api/reportes/inventario/kardex?idSucursal=...
   */
  kardexGeneral:
    "/reportes/inventario/kardex",

  /*
   * Kardex específico por producto.
   *
   * GET:
   * /api/reportes/inventario/kardex/:idProducto
   */
  kardexProducto: (
    idProducto: string
  ) =>
    `/reportes/inventario/kardex/${idProducto}`,

  estadoResultados:
    "/reportes/finanzas/estado-resultados",

  flujoEfectivo:
    "/reportes/finanzas/flujo-efectivo",

  cierresCaja:
    "/reportes/caja/cierres",

  solicitudesResumen:
    "/reportes/solicitudes/resumen",
} as const;

/* =====================================================
   LIMPIEZA DE PARÁMETROS
===================================================== */

/**
 * Elimina valores vacíos, undefined y null.
 *
 * Así se evita enviar consultas como:
 *
 * ?fechaDesde=&fechaHasta=&idSucursal=
 */
// function limpiarParametros<
//   T extends Record<string, unknown>
// >(
//   parametros: T
// ): Record<
//   string,
//   string | number | boolean
// > {
//   return Object.entries(
//     parametros
//   ).reduce<
//     Record<
//       string,
//       string | number | boolean
//     >
//   >(
//     (
//       resultado,
//       [clave, valor]
//     ) => {
//       const esValido =
//         valor !== undefined &&
//         valor !== null &&
//         valor !== "";

//       if (esValido) {
//         resultado[clave] =
//           valor as
//             | string
//             | number
//             | boolean;
//       }

//       return resultado;
//     },
//     {}
//   );
// }

function limpiarParametros<
  T extends object
>(
  parametros: T
): Record<
  string,
  string | number | boolean
> {
  const resultado:
    Record<
      string,
      string | number | boolean
    > = {};

  Object.entries(
    parametros
  ).forEach(
    ([clave, valor]) => {
      if (
        valor === undefined ||
        valor === null ||
        valor === ""
      ) {
        return;
      }

      if (
        typeof valor === "string" ||
        typeof valor === "number" ||
        typeof valor === "boolean"
      ) {
        resultado[clave] =
          valor;
      }
    }
  );

  return resultado;
}

/* =====================================================
   VALIDACIONES
===================================================== */

function validarId(
  id: string,
  nombreCampo: string
): void {
  if (
    !id ||
    !id.trim()
  ) {
    throw new Error(
      `El campo ${nombreCampo} es obligatorio.`
    );
  }
}

/* =====================================================
   1. PRUEBA DEL MÓDULO
===================================================== */

export async function getReporteTest(): Promise<ReporteTestResponse> {
  const { data } =
    await api.get<ReporteTestResponse>(
      REPORTE_ENDPOINTS.test
    );

  return data;
}

/* =====================================================
   2. DASHBOARD GENERAL
===================================================== */

export async function getReporteDashboard(
  filtros: ReporteFiltros = {}
): Promise<DashboardReporteResponse> {
  const { data } =
    await api.get<DashboardReporteResponse>(
      REPORTE_ENDPOINTS.dashboard,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   3. RESUMEN DE VENTAS
===================================================== */

export async function getReporteVentasResumen(
  filtros: ReporteFiltros = {}
): Promise<VentasResumenResponse> {
  const { data } =
    await api.get<VentasResumenResponse>(
      REPORTE_ENDPOINTS.ventasResumen,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   4. VENTAS POR SUCURSAL
===================================================== */

export async function getReporteVentasPorSucursal(
  filtros: ReporteFiltros = {}
): Promise<VentasPorSucursalResponse> {
  const { data } =
    await api.get<VentasPorSucursalResponse>(
      REPORTE_ENDPOINTS.ventasPorSucursal,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   5. VENTAS POR CAJA
===================================================== */

export async function getReporteVentasPorCaja(
  filtros: ReporteFiltros = {}
): Promise<VentasPorCajaResponse> {
  const { data } =
    await api.get<VentasPorCajaResponse>(
      REPORTE_ENDPOINTS.ventasPorCaja,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   6. VENTAS POR VENDEDOR O MESERO
===================================================== */

export async function getReporteVentasPorVendedor(
  filtros: ReporteFiltros = {}
): Promise<VentasPorVendedorResponse> {
  const { data } =
    await api.get<VentasPorVendedorResponse>(
      REPORTE_ENDPOINTS.ventasPorVendedor,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   7. VENTAS POR MÉTODO DE PAGO
===================================================== */

export async function getReporteVentasPorMetodoPago(
  filtros: ReporteFiltros = {}
): Promise<VentasPorMetodoPagoResponse> {
  const { data } =
    await api.get<VentasPorMetodoPagoResponse>(
      REPORTE_ENDPOINTS.ventasPorMetodoPago,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   8. PRODUCTOS MÁS VENDIDOS
===================================================== */

export async function getReporteProductosMasVendidos(
  filtros: ReporteFiltros = {}
): Promise<ProductosMasVendidosResponse> {
  const { data } =
    await api.get<ProductosMasVendidosResponse>(
      REPORTE_ENDPOINTS.productosMasVendidos,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   9. INVENTARIO GENERAL
===================================================== */

export async function getReporteInventarioGeneral(
  filtros: ReporteFiltros = {}
): Promise<InventarioGeneralResponse> {
  const { data } =
    await api.get<InventarioGeneralResponse>(
      REPORTE_ENDPOINTS.inventarioGeneral,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   10. INVENTARIO CON STOCK BAJO
===================================================== */

export async function getReporteInventarioStockBajo(
  filtros: ReporteFiltros = {}
): Promise<InventarioStockBajoResponse> {
  const { data } =
    await api.get<InventarioStockBajoResponse>(
      REPORTE_ENDPOINTS.inventarioStockBajo,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   11. VALOR DEL INVENTARIO
===================================================== */

export async function getReporteValorInventario(
  filtros: ReporteFiltros = {}
): Promise<ValorInventarioResponse> {
  const { data } =
    await api.get<ValorInventarioResponse>(
      REPORTE_ENDPOINTS.valorInventario,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   12. KARDEX GENERAL POR SUCURSAL
===================================================== */

/**
 * Consulta el Kardex completo de una sucursal.
 *
 * Ruta:
 *
 * GET /api/reportes/inventario/kardex
 *
 * Parámetros:
 *
 * idSucursal
 * idProducto
 * idAlmacen
 * tipoMovimiento
 * fechaDesde
 * fechaHasta
 */
export async function getReporteKardex(
  filtros: ReporteKardexFiltros
): Promise<ReporteKardexResponse> {
  validarId(
    filtros.idSucursal,
    "idSucursal"
  );

  const { data } =
    await api.get<ReporteKardexResponse>(
      REPORTE_ENDPOINTS.kardexGeneral,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   13. KARDEX POR PRODUCTO
===================================================== */

/**
 * Consulta el Kardex de un producto específico.
 *
 * Ruta:
 *
 * GET /api/reportes/inventario/kardex/:idProducto
 */
export async function getReporteKardexProducto(
  idProducto: string,
  filtros: ReporteFiltros = {}
): Promise<KardexProductoResponse> {
  validarId(
    idProducto,
    "idProducto"
  );

  const { data } =
    await api.get<KardexProductoResponse>(
      REPORTE_ENDPOINTS.kardexProducto(
        idProducto.trim()
      ),
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   14. ESTADO DE RESULTADOS
===================================================== */

export async function getReporteEstadoResultados(
  filtros: ReporteFiltros = {}
): Promise<EstadoResultadosResponse> {
  const { data } =
    await api.get<EstadoResultadosResponse>(
      REPORTE_ENDPOINTS.estadoResultados,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   15. FLUJO DE EFECTIVO
===================================================== */

export async function getReporteFlujoEfectivo(
  filtros: ReporteFiltros = {}
): Promise<FlujoEfectivoResponse> {
  const { data } =
    await api.get<FlujoEfectivoResponse>(
      REPORTE_ENDPOINTS.flujoEfectivo,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   16. CIERRES DE CAJA
===================================================== */

export async function getReporteCierresCaja(
  filtros: ReporteFiltros = {}
): Promise<CierresCajaResponse> {
  const { data } =
    await api.get<CierresCajaResponse>(
      REPORTE_ENDPOINTS.cierresCaja,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   17. RESUMEN DE SOLICITUDES
===================================================== */

export async function getReporteSolicitudesResumen(
  filtros: ReporteFiltros = {}
): Promise<SolicitudesResumenResponse> {
  const { data } =
    await api.get<SolicitudesResumenResponse>(
      REPORTE_ENDPOINTS.solicitudesResumen,
      {
        params:
          limpiarParametros(
            filtros
          ),
      }
    );

  return data;
}

/* =====================================================
   EXPORTACIÓN AGRUPADA
===================================================== */

export const ReporteAPI = {
  getTest:
    getReporteTest,

  getDashboard:
    getReporteDashboard,

  getVentasResumen:
    getReporteVentasResumen,

  getVentasPorSucursal:
    getReporteVentasPorSucursal,

  getVentasPorCaja:
    getReporteVentasPorCaja,

  getVentasPorVendedor:
    getReporteVentasPorVendedor,

  getVentasPorMetodoPago:
    getReporteVentasPorMetodoPago,

  getProductosMasVendidos:
    getReporteProductosMasVendidos,

  getInventarioGeneral:
    getReporteInventarioGeneral,

  getInventarioStockBajo:
    getReporteInventarioStockBajo,

  getValorInventario:
    getReporteValorInventario,

  /*
   * Kardex general de la sucursal.
   */
  getKardex:
    getReporteKardex,

  /*
   * Kardex específico de un producto.
   */
  getKardexProducto:
    getReporteKardexProducto,

  getEstadoResultados:
    getReporteEstadoResultados,

  getFlujoEfectivo:
    getReporteFlujoEfectivo,

  getCierresCaja:
    getReporteCierresCaja,

  getSolicitudesResumen:
    getReporteSolicitudesResumen,
};






/* =====================================================
   ENDPOINT
===================================================== */

const PRODUCTOS_MAS_VENDIDOS_ENDPOINT =
  "/reportes/ventas/productos-mas-vendidos";

/* =====================================================
   LIMPIAR PARÁMETROS
===================================================== */

export async function getProductosMasVendidos(
  filtros: ReporteFiltros = {}
): Promise<ProductosMasVendidosResponse> {
  const { data } =
    await api.get<ProductosMasVendidosResponse>(
      "/reportes/ventas/productos-mas-vendidos",
      {
        params:
          limpiarParametros(filtros),
      }
    );

  return data;
}

export default ReporteAPI;