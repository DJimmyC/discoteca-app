// /* =====================================================
//    FILTROS GENERALES
// ===================================================== */

// export type ReporteFiltros = {
//   fechaDesde?: string;
//   fechaHasta?: string;
//   idSucursal?: string;
//   idCaja?: string;
//   idPerfil?: string;
//   idAlmacen?: string;
//   idProducto?: string;
//   estado?: string;
//   metodoPago?: string;
//   limite?: string | number;
// };

// /* =====================================================
//    RESPUESTA DE ERROR
// ===================================================== */

// export type ReporteErrorResponse = {
//   error: string;
// };

// /* =====================================================
//    DATOS POPULADOS GENERALES
// ===================================================== */

// export type ReporteProductoPopulado = {
//   _id: string;
//   nombre: string;
//   marca?: string;
//   descripcion?: string;
// };

// export type ReporteAlmacenPopulado = {
//   _id: string;
//   nombre: string;
//   tipo?: string;
// };

// export type ReportePerfilPopulado = {
//   _id: string;
//   nombres: string;
//   apellidos: string;
//   email?: string;
// };

// export type ReporteSucursalPopulada = {
//   _id: string;
//   nombreSucursal?: string;
//   nombre?: string;
//   ubicacionSucursal?: string;
// };

// export type ReporteCajaPopulada = {
//   _id: string;
//   nombre: string;
//   descripcion?: string;
// };

// /* =====================================================
//    1. DASHBOARD GENERAL
// ===================================================== */

// export type DashboardResumen = {
//   totalVentas: number;
//   cantidadVentas: number;
//   ticketPromedio: number;
//   totalEgresos: number;
//   cantidadEgresos: number;
//   gananciaEstimada: number;
//   cajasAbiertas: number;
//   solicitudesPendientes: number;
//   productosStockBajo: number;
// };

// export type DashboardProductoMasVendido = {
//   idProducto: string;
//   nombre: string;
//   marca: string;
//   cantidadVendida: number;
//   totalVendido: number;
// };

// export type DashboardVendedorMayorVenta = {
//   idPerfil: string;
//   nombres: string;
//   apellidos: string;
//   totalVendido: number;
//   cantidadVentas: number;
// };

// export type DashboardReporteResponse = {
//   filtros: ReporteFiltros;
//   resumen: DashboardResumen;
//   productoMasVendido: DashboardProductoMasVendido | null;
//   vendedorMayorVenta: DashboardVendedorMayorVenta | null;
// };

// /* =====================================================
//    2. RESUMEN DE VENTAS
// ===================================================== */

// export type EstadoVentaReporte =
//   | "pagado"
//   | "anulado"
//   | "cortesia";

// export type ResumenEstadoVenta = {
//   cantidad: number;
//   subtotal: number;
//   descuento: number;
//   total: number;
//   promedio: number;
// };

// export type VentasResumen = {
//   pagado: ResumenEstadoVenta;
//   anulado: ResumenEstadoVenta;
//   cortesia: ResumenEstadoVenta;
// };

// export type VentasResumenResponse = {
//   filtros: ReporteFiltros;
//   resumen: VentasResumen;
//   ingresosReales: number;
// };

// /* =====================================================
//    3. VENTAS POR SUCURSAL
// ===================================================== */

// export type VentaPorSucursal = {
//   idSucursal: string;
//   nombreSucursal: string;
//   cantidadVentas: number;
//   subtotal: number;
//   descuento: number;
//   totalVendido: number;
//   ticketPromedio: number;
// };

// export type VentasPorSucursalResponse = {
//   filtros: ReporteFiltros;
//   data: VentaPorSucursal[];
// };

// /* =====================================================
//    4. VENTAS POR CAJA
// ===================================================== */

// export type VentaPorCaja = {
//   idCaja: string;
//   nombreCaja: string;
//   idSucursal: string;
//   nombreSucursal: string;
//   cantidadVentas: number;
//   totalVendido: number;
//   ticketPromedio: number;
// };

// export type VentasPorCajaResponse = {
//   filtros: ReporteFiltros;
//   data: VentaPorCaja[];
// };

// /* =====================================================
//    5. VENTAS POR VENDEDOR
// ===================================================== */

// export type VentaPorVendedor = {
//   idPerfil: string;
//   nombres: string;
//   apellidos: string;
//   email: string;
//   cantidadVentas: number;
//   subtotal: number;
//   descuento: number;
//   totalVendido: number;
//   ticketPromedio: number;
// };

// export type VentasPorVendedorResponse = {
//   filtros: ReporteFiltros;
//   data: VentaPorVendedor[];
// };

// /* =====================================================
//    6. VENTAS POR MÉTODO DE PAGO
// ===================================================== */

// export type VentaPorMetodoPago = {
//   metodoPago: string;
//   cantidadVentas: number;
//   totalVendido: number;
//   promedio: number;
// };

// export type VentasPorMetodoPagoResponse = {
//   filtros: ReporteFiltros;
//   data: VentaPorMetodoPago[];
// };

// /* =====================================================
//    7. PRODUCTOS MÁS VENDIDOS
// ===================================================== */

// export type ProductoMasVendido = {
//   idProducto: string;
//   nombre: string;
//   marca: string;
//   idCategoria?: string;
//   cantidadVendida: number;
//   totalVendido: number;
//   costoTotal: number;
//   utilidad: number;
//   precioPromedio: number;
// };

// export type ProductosMasVendidosResponse = {
//   filtros: ReporteFiltros;
//   limite: number;
//   data: ProductoMasVendido[];
// };

// /* =====================================================
//    8. INVENTARIO GENERAL
// ===================================================== */

// export type InventarioGeneralItem = {
//   _id: string;
//   idAlmacen: string;
//   nombreAlmacen: string;
//   tipoAlmacen?: string;
//   idSucursal?: string;
//   idProducto: string;
//   nombreProducto: string;
//   marca?: string;
//   idCategoria?: string;
//   cantidad: number;
//   costoUnitario: number;
//   ultimoCostoEntrada?: number;
//   precioVenta: number;
//   stockMinimo: number;
//   valorInventario: number;
//   gananciaUnitaria: number;
//   stockBajo: boolean;
//   estado: boolean;
// };

// export type InventarioGeneralResponse = {
//   filtros: ReporteFiltros;
//   totalRegistros: number;
//   data: InventarioGeneralItem[];
// };

// /* =====================================================
//    9. STOCK BAJO Y AGOTADOS
// ===================================================== */

// export type InventarioStockBajoItem = {
//   _id: string;
//   idAlmacen: string;
//   nombreAlmacen: string;
//   tipoAlmacen?: string;
//   idSucursal?: string;
//   idProducto: string;
//   nombreProducto: string;
//   marca?: string;
//   cantidad: number;
//   stockMinimo: number;
//   agotado: boolean;
//   faltanteParaMinimo: number;
// };

// export type InventarioStockBajoResponse = {
//   filtros: ReporteFiltros;
//   totalStockBajo: number;
//   totalAgotados: number;
//   data: InventarioStockBajoItem[];
// };

// /* =====================================================
//    10. VALOR DE INVENTARIO
// ===================================================== */

// export type ValorInventarioTotales = {
//   cantidadProductos: number;
//   unidadesTotales: number;
//   valorCosto: number;
//   valorVenta: number;
//   gananciaPotencial: number;
// };

// export type ValorInventarioAlmacen = {
//   idAlmacen: string;
//   idSucursal?: string;
//   nombreAlmacen: string;
//   tipoAlmacen?: string;
//   cantidadProductos: number;
//   unidadesTotales: number;
//   valorCosto: number;
//   valorVenta: number;
//   gananciaPotencial: number;
// };

// export type ValorInventarioItem = {
//   idAlmacen: string;
//   nombreAlmacen: string;
//   tipoAlmacen?: string;

//   cantidadProductos: number;
//   unidadesDisponibles: number;

//   valorCosto: number;
//   valorVenta: number;
//   gananciaPotencial: number;
//   margenPotencial: number;
// };

// export type ValorInventarioResponse = {
//   filtros: ReporteFiltros;

//   totalAlmacenes?: number;
//   totalProductos?: number;
//   totalUnidades?: number;

//   valorCostoTotal?: number;
//   valorVentaTotal?: number;
//   gananciaPotencialTotal?: number;
//   margenPotencialTotal?: number;

//   data: ValorInventarioItem[];
// };

// /* =====================================================
//    11. ESTADO DE RESULTADOS
// ===================================================== */

// export type EstadoResultados = {
//   ventasBrutas: number;
//   descuentos: number;
//   ventasNetas: number;
//   costoVentas: number;
//   utilidadBruta: number;
//   egresosOperativos: number;
//   utilidadNeta: number;
//   margenNetoPorcentaje: number;
//   cantidadVentas: number;
//   cantidadEgresos: number;
// };

// export type EstadoResultadosResponse = {
//   filtros: ReporteFiltros;
//   estadoResultados: EstadoResultados;
// };

// /* =====================================================
//    12. FLUJO DE EFECTIVO
// ===================================================== */

// export type FlujoMetodoPago = {
//   metodoPago: string;
//   cantidad: number;
//   monto: number;
// };

// export type FlujoEfectivoResumen = {
//   totalEntradas: number;
//   totalSalidas: number;
//   flujoNeto: number;
// };

// export type FlujoEfectivoResponse = {
//   filtros: ReporteFiltros;
//   entradas: FlujoMetodoPago[];
//   salidas: FlujoMetodoPago[];
//   resumen: FlujoEfectivoResumen;
// };

// /* =====================================================
//    13. CIERRES Y DIFERENCIAS DE CAJA
// ===================================================== */

// export type EstadoCierreCaja =
//   | "cerrado"
//   | "cuadrado"
//   | "sobrante"
//   | "faltante";

// export type CierreCajaReporte = {
//   _id: string;

//   idCaja: ReporteCajaPopulada | string | null;
//   idSucursal: ReporteSucursalPopulada | string | null;
//   idPerfil: ReportePerfilPopulado | string | null;

//   fechaApertura?: string;
//   fechaCierre: string;

//   montoInicial: number;
//   totalVentas: number;
//   totalEgresos: number;
//   totalEsperado: number;
//   montoReal: number;
//   diferencia: number;

//   estado: EstadoCierreCaja;
//   observacion?: string | null;

//   createdAt?: string;
//   updatedAt?: string;
// };

// export type CierresCajaResumen = {
//   cantidadCierres: number;
//   totalVentas: number;
//   totalEgresos: number;
//   diferencia: number;
//   cuadrados: number;
//   sobrantes: number;
//   faltantes: number;
// };

// export type CierresCajaResponse = {
//   filtros: ReporteFiltros;
//   resumen: CierresCajaResumen;
//   cierres: CierreCajaReporte[];
// };

// /* =====================================================
//    14. RESUMEN DE SOLICITUDES
// ===================================================== */

// export type SolicitudPorEstado = {
//   estado: string;
//   cantidad: number;
//   tiempoPromedioHoras: number;
// };

// export type SolicitudesResumenResponse = {
//   filtros: ReporteFiltros;
//   totalSolicitudes: number;
//   porEstado: SolicitudPorEstado[];
// };

// /* =====================================================
//    15. KARDEX DE PRODUCTO
// ===================================================== */

// export type TipoMovimientoInventario =
//   | "entrada_inventario"
//   | "salida_inventario"
//   | "transferencia_inventario"
//   | "ajuste_inventario"
//   | "conteo_fisico"
//   | "diferencia_inventario";

// export type MovimientoKardex = {
//   _id: string;

//   tipoMovimiento: TipoMovimientoInventario;

//   idProducto:
//     | ReporteProductoPopulado
//     | string
//     | null;

//   idAlmacen:
//     | ReporteAlmacenPopulado
//     | string
//     | null;

//   idAlmacenOrigen?:
//     | ReporteAlmacenPopulado
//     | string
//     | null;

//   idAlmacenDestino?:
//     | ReporteAlmacenPopulado
//     | string
//     | null;

//   idPerfil:
//     | ReportePerfilPopulado
//     | string
//     | null;

//   fecha: string;

//   cantidadEntrada?: number;
//   cantidadSalida?: number;

//   stockAnterior?: number;
//   stockNuevo?: number;

//   costoUnitario?: number;
//   precioVenta?: number;

//   motivo?: string;
//   observacion?: string | null;
//   referencia?: string;

//   estado?: boolean | string;

//   createdAt?: string;
//   updatedAt?: string;
// };

// export type KardexResumen = {
//   entradas: number;
//   salidas: number;
//   saldoMovimientos: number;
// };

// export type KardexProductoResponse = {
//   filtros: ReporteFiltros;
//   idProducto: string;
//   resumen: KardexResumen;
//   movimientos: MovimientoKardex[];
// };


/* =====================================================
   FILTROS GENERALES
===================================================== */

export type ReporteFiltros = {
  fechaDesde?: string;
  fechaHasta?: string;
  idSucursal?: string;
  idCaja?: string;
  idPerfil?: string;
  idAlmacen?: string;
  idProducto?: string;
  estado?: string;
  metodoPago?: string;
  limite?: string | number;
};

/* =====================================================
   RESPUESTA DE ERROR
===================================================== */

export type ReporteErrorResponse = {
  error: string;
};

/* =====================================================
   DATOS POPULADOS GENERALES
===================================================== */

export type ReporteProductoPopulado = {
  _id: string;
  nombre: string;
  marca?: string;
  descripcion?: string;
};

export type ReporteAlmacenPopulado = {
  _id: string;
  nombre: string;
  tipo?: string;
};

export type ReportePerfilPopulado = {
  _id: string;
  nombres: string;
  apellidos: string;
  email?: string;
};

export type ReporteSucursalPopulada = {
  _id: string;
  nombreSucursal?: string;
  nombre?: string;
  ubicacionSucursal?: string;
};

export type ReporteCajaPopulada = {
  _id: string;
  nombre: string;
  descripcion?: string;
};

/* =====================================================
   1. DASHBOARD GENERAL
===================================================== */

export type DashboardResumen = {
  totalVentas: number;
  cantidadVentas: number;
  ticketPromedio: number;
  totalEgresos: number;
  cantidadEgresos: number;
  gananciaEstimada: number;
  cajasAbiertas: number;
  solicitudesPendientes: number;
  productosStockBajo: number;
};

export type DashboardProductoMasVendido = {
  idProducto: string;
  nombre: string;
  marca: string;
  cantidadVendida: number;
  totalVendido: number;
};

export type DashboardVendedorMayorVenta = {
  idPerfil: string;
  nombres: string;
  apellidos: string;
  totalVendido: number;
  cantidadVentas: number;
};

export type DashboardReporteResponse = {
  filtros: ReporteFiltros;
  resumen: DashboardResumen;
  productoMasVendido: DashboardProductoMasVendido | null;
  vendedorMayorVenta: DashboardVendedorMayorVenta | null;
};

/* =====================================================
   2. RESUMEN DE VENTAS
===================================================== */

export type EstadoVentaReporte =
  | "pagado"
  | "anulado"
  | "cortesia";

export type ResumenEstadoVenta = {
  cantidad: number;
  subtotal: number;
  descuento: number;
  total: number;
  promedio: number;
};

export type VentasResumen = {
  pagado: ResumenEstadoVenta;
  anulado: ResumenEstadoVenta;
  cortesia: ResumenEstadoVenta;
};

export type VentasResumenResponse = {
  filtros: ReporteFiltros;
  resumen: VentasResumen;
  ingresosReales: number;
};

/* =====================================================
   3. VENTAS POR SUCURSAL
===================================================== */

export type VentaPorSucursal = {
  idSucursal: string;
  nombreSucursal: string;
  cantidadVentas: number;
  subtotal: number;
  descuento: number;
  totalVendido: number;
  ticketPromedio: number;
};

export type VentasPorSucursalResponse = {
  filtros: ReporteFiltros;
  data: VentaPorSucursal[];
};

/* =====================================================
   4. VENTAS POR CAJA
===================================================== */

export type VentaPorCaja = {
  idCaja: string;
  nombreCaja: string;
  idSucursal: string;
  nombreSucursal: string;
  cantidadVentas: number;
  totalVendido: number;
  ticketPromedio: number;
};

export type VentasPorCajaResponse = {
  filtros: ReporteFiltros;
  data: VentaPorCaja[];
};

/* =====================================================
   5. VENTAS POR VENDEDOR
===================================================== */

export type VentaPorVendedor = {
  idPerfil: string;
  nombres: string;
  apellidos: string;
  email: string;
  cantidadVentas: number;
  subtotal: number;
  descuento: number;
  totalVendido: number;
  ticketPromedio: number;
};

export type VentasPorVendedorResponse = {
  filtros: ReporteFiltros;
  data: VentaPorVendedor[];
};

/* =====================================================
   6. VENTAS POR MÉTODO DE PAGO
===================================================== */

export type VentaPorMetodoPago = {
  metodoPago: string;
  cantidadVentas: number;
  totalVendido: number;
  promedio: number;
};

export type VentasPorMetodoPagoResponse = {
  filtros: ReporteFiltros;
  data: VentaPorMetodoPago[];
};

/* =====================================================
   7. PRODUCTOS MÁS VENDIDOS
===================================================== */

export type ProductoMasVendido = {
  idProducto: string;
  nombre: string;
  marca: string;
  idCategoria?: string;
  cantidadVendida: number;
  totalVendido: number;
  costoTotal: number;
  utilidad: number;
  precioPromedio: number;
};



/* =====================================================
   8. INVENTARIO GENERAL
===================================================== */

export type InventarioGeneralItem = {
  _id: string;
  idAlmacen: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;
  idSucursal?: string;
  idProducto: string;
  nombreProducto: string;
  marca?: string;
  idCategoria?: string;
  cantidad: number;
  costoUnitario: number;
  ultimoCostoEntrada?: number;
  precioVenta: number;
  stockMinimo: number;
  valorInventario: number;
  gananciaUnitaria: number;
  stockBajo: boolean;
  estado: boolean;
};

export type InventarioGeneralResponse = {
  filtros: ReporteFiltros;
  totalRegistros: number;
  data: InventarioGeneralItem[];
};

/* =====================================================
   9. STOCK BAJO Y AGOTADOS
===================================================== */

export type InventarioStockBajoItem = {
  _id: string;
  idAlmacen: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;
  idSucursal?: string;
  idProducto: string;
  nombreProducto: string;
  marca?: string;
  cantidad: number;
  stockMinimo: number;
  agotado: boolean;
  faltanteParaMinimo: number;
};

export type InventarioStockBajoResponse = {
  filtros: ReporteFiltros;
  totalStockBajo: number;
  totalAgotados: number;
  data: InventarioStockBajoItem[];
};

/* =====================================================
   10. VALOR DE INVENTARIO
===================================================== */

export type ValorInventarioTotales = {
  cantidadProductos: number;
  unidadesTotales: number;
  valorCosto: number;
  valorVenta: number;
  gananciaPotencial: number;
};

export type ValorInventarioAlmacen = {
  idAlmacen: string;
  idSucursal?: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;
  cantidadProductos: number;
  unidadesTotales: number;
  valorCosto: number;
  valorVenta: number;
  gananciaPotencial: number;
};

export type ValorInventarioItem = {
  idAlmacen: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;

  cantidadProductos: number;
  unidadesDisponibles: number;

  valorCosto: number;
  valorVenta: number;
  gananciaPotencial: number;
  margenPotencial: number;
};

export type ValorInventarioResponse = {
  filtros: ReporteFiltros;

  totalAlmacenes?: number;
  totalProductos?: number;
  totalUnidades?: number;

  valorCostoTotal?: number;
  valorVentaTotal?: number;
  gananciaPotencialTotal?: number;
  margenPotencialTotal?: number;

  data: ValorInventarioItem[];
};

/* =====================================================
   11. ESTADO DE RESULTADOS
===================================================== */

export type EstadoResultados = {
  ventasBrutas: number;
  descuentos: number;
  ventasNetas: number;
  costoVentas: number;
  utilidadBruta: number;
  egresosOperativos: number;
  utilidadNeta: number;
  margenNetoPorcentaje: number;
  cantidadVentas: number;
  cantidadEgresos: number;
};

export type EstadoResultadosResponse = {
  filtros: ReporteFiltros;
  estadoResultados: EstadoResultados;
};

/* =====================================================
   12. FLUJO DE EFECTIVO
===================================================== */

export type FlujoMetodoPago = {
  metodoPago: string;
  cantidad: number;
  monto: number;
};

export type FlujoEfectivoResumen = {
  totalEntradas: number;
  totalSalidas: number;
  flujoNeto: number;
};

export type FlujoEfectivoResponse = {
  filtros: ReporteFiltros;
  entradas: FlujoMetodoPago[];
  salidas: FlujoMetodoPago[];
  resumen: FlujoEfectivoResumen;
};

/* =====================================================
   13. CIERRES Y DIFERENCIAS DE CAJA
===================================================== */

export type EstadoCierreCaja =
  | "cerrado"
  | "cuadrado"
  | "sobrante"
  | "faltante";

export type CierreCajaReporte = {
  _id: string;

  idCaja: ReporteCajaPopulada | string | null;
  idSucursal: ReporteSucursalPopulada | string | null;
  idPerfil: ReportePerfilPopulado | string | null;

  fechaApertura?: string;
  fechaCierre: string;

  montoInicial: number;
  totalVentas: number;
  totalEgresos: number;
  totalEsperado: number;
  montoReal: number;
  diferencia: number;

  estado: EstadoCierreCaja;
  observacion?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type CierresCajaResumen = {
  cantidadCierres: number;
  totalVentas: number;
  totalEgresos: number;
  diferencia: number;
  cuadrados: number;
  sobrantes: number;
  faltantes: number;
};

export type CierresCajaResponse = {
  filtros: ReporteFiltros;
  resumen: CierresCajaResumen;
  cierres: CierreCajaReporte[];
};

/* =====================================================
   14. RESUMEN DE SOLICITUDES
===================================================== */

export type SolicitudPorEstado = {
  estado: string;
  cantidad: number;
  tiempoPromedioHoras: number;
};

export type SolicitudesResumenResponse = {
  filtros: ReporteFiltros;
  totalSolicitudes: number;
  porEstado: SolicitudPorEstado[];
};

/* =====================================================
   15. KARDEX DE PRODUCTO
===================================================== */

export type TipoMovimientoInventario =
  | "entrada_inventario"
  | "salida_inventario"
  | "transferencia_inventario"
  | "ajuste_inventario"
  | "conteo_fisico"
  | "diferencia_inventario";

export type MovimientoKardex = {
  _id: string;

  tipoMovimiento: TipoMovimientoInventario;

  idProducto:
    | ReporteProductoPopulado
    | string
    | null;

  idAlmacen:
    | ReporteAlmacenPopulado
    | string
    | null;

  idAlmacenOrigen?:
    | ReporteAlmacenPopulado
    | string
    | null;

  idAlmacenDestino?:
    | ReporteAlmacenPopulado
    | string
    | null;

  idPerfil:
    | ReportePerfilPopulado
    | string
    | null;

  fecha: string;

  cantidadEntrada?: number;
  cantidadSalida?: number;

  stockAnterior?: number;
  stockNuevo?: number;

  costoUnitario?: number;
  precioVenta?: number;

  motivo?: string;
  observacion?: string | null;
  referencia?: string;

  estado?: boolean | string;

  createdAt?: string;
  updatedAt?: string;
};

export type KardexResumen = {
  entradas: number;
  salidas: number;
  saldoMovimientos: number;
};

export type KardexProductoResponse = {
  filtros: ReporteFiltros;
  idProducto: string;
  resumen: KardexResumen;
  movimientos: MovimientoKardex[];
};
/* =====================================================
   KARDEX DE INVENTARIO
===================================================== */


export type KardexProducto = {
  _id: string;
  nombre: string;
  marca?: string;
  descripcion?: string;
};

export type KardexAlmacen = {
  _id: string;
  nombre: string;
  tipo?: string;
};

export type KardexPerfil = {
  _id: string;
  nombres: string;
  apellidos: string;
  email?: string;
};
export type ReporteKardexResponse = {
  filtros: ReporteKardexFiltros;

  idProducto?: string;

  resumen: {
    entradas: number;
    salidas: number;
    saldoMovimientos: number;
  };

  movimientos: KardexMovimiento[];
};
export type ReporteKardexFiltros = {
  idSucursal: string;
  fechaDesde?: string;
  fechaHasta?: string;
  idProducto?: string;
  idAlmacen?: string;
  tipoMovimiento?: string;
};

export type KardexMovimiento = {
  _id: string;
  fecha: string;
  tipoMovimiento: string;

  idProducto:
    | string
    | {
        _id: string;
        nombre: string;
        marca?: string;
        descripcion?: string;
      };

  idAlmacen?:
    | string
    | {
        _id: string;
        nombre: string;
        tipo?: string;
      };

  idAlmacenOrigen?:
    | string
    | {
        _id: string;
        nombre: string;
        tipo?: string;
      };

  idAlmacenDestino?:
    | string
    | {
        _id: string;
        nombre: string;
        tipo?: string;
      };

  idPerfil?:
    | string
    | {
        _id: string;
        nombres: string;
        apellidos: string;
        email?: string;
      };

  cantidad?: number;
  cantidadEntrada?: number;
  cantidadSalida?: number;

  saldoAnterior?: number;
  saldoActual?: number;

  costoUnitario?: number;
  costoTotal?: number;

  motivo?: string;
  referencia?: string;
  observacion?: string;

  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
};


export type SolicitudResumenEstado = {
  estado: string;
  cantidad: number;
  tiempoPromedioHoras: number;
};

/* =====================================================
   PRODUCTO VENDIDO
===================================================== */

export type ProductoMasVendidoItem = {
  idProducto: string;

  nombre: string;

  marca: string;

  descripcion?: string;

  idCategoria?:
    | string
    | null;

  cantidadVendida:
    number;

  cantidadVentas:
    number;

  cantidadDetalles?:
    number;

  cantidadSucursales?:
    number;

  totalVendido:
    number;

  costoTotal:
    number;

  utilidad:
    number;

  precioPromedio:
    number;
};

/* =====================================================
   PRODUCTOS VENDIDOS POR SUCURSAL
===================================================== */

export type ProductosMasVendidosSucursal = {
  idSucursal:
    string;

  nombreSucursal:
    string;

  ubicacionSucursal?:
    string;

  totalProductosDiferentes:
    number;

  productoMasVendido:
    ProductoMasVendidoItem | null;

  productosMasVendidos:
    ProductoMasVendidoItem[];
};

/* =====================================================
   RESUMEN
===================================================== */

export type ProductosMasVendidosResumen = {
  cantidadProductosRankingGeneral:
    number;

  cantidadSucursales:
    number;
};

/* =====================================================
   RESPUESTA COMPLETA
===================================================== */

export type ProductosMasVendidosResponse = {
  filtros:
    ReporteFiltros;

  limite:
    number;

  resumen:
    ProductosMasVendidosResumen;

  productoMasVendidoGeneral:
    ProductoMasVendidoItem | null;

  productosMasVendidosGeneral:
    ProductoMasVendidoItem[];

  sucursales:
    ProductosMasVendidosSucursal[];
};