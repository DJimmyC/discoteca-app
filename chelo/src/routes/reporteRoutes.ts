// src/routes/reporteRoutes.ts

import {
  Router,
} from "express";

import {
  ReporteController,
} from "../controllers/ReporteController";

const router =
  Router();

/* =====================================================
    TAG GENERAL
===================================================== */

/**
 * @openapi
 * tags:
 *   - name: Reportes
 *     description: Reportes administrativos, comerciales, financieros, de inventario, caja y solicitudes
 */

/* =====================================================
    COMPONENTES REUTILIZABLES
===================================================== */

/**
 * @openapi
 * components:
 *
 *   parameters:
 *
 *     FechaDesdeReporte:
 *       in: query
 *       name: fechaDesde
 *       required: false
 *       description: Fecha inicial del reporte
 *       schema:
 *         type: string
 *         format: date
 *       example: "2026-06-01"
 *
 *     FechaHastaReporte:
 *       in: query
 *       name: fechaHasta
 *       required: false
 *       description: Fecha final del reporte
 *       schema:
 *         type: string
 *         format: date
 *       example: "2026-06-30"
 *
 *     SucursalReporte:
 *       in: query
 *       name: idSucursal
 *       required: false
 *       description: ID de la sucursal
 *       schema:
 *         type: string
 *       example: "6a1ba90b7ba11e9abf89383a"
 *
 *     CajaReporte:
 *       in: query
 *       name: idCaja
 *       required: false
 *       description: ID de la caja
 *       schema:
 *         type: string
 *       example: "6a1ba6e27ba11e9abf893800"
 *
 *     PerfilReporte:
 *       in: query
 *       name: idPerfil
 *       required: false
 *       description: ID del perfil, vendedor o mesero
 *       schema:
 *         type: string
 *       example: "69f6927bd7691b4b764a116d"
 *
 *     AlmacenReporte:
 *       in: query
 *       name: idAlmacen
 *       required: false
 *       description: ID del almacén
 *       schema:
 *         type: string
 *       example: "6a1baa6b7ba11e9abf89388a"
 *
 *     ProductoReporte:
 *       in: query
 *       name: idProducto
 *       required: false
 *       description: ID del producto
 *       schema:
 *         type: string
 *       example: "6a1ba8887ba11e9abf893823"
 *
 *     EstadoVentaReporte:
 *       in: query
 *       name: estado
 *       required: false
 *       description: Estado de la venta
 *       schema:
 *         type: string
 *         enum:
 *           - pagado
 *           - anulado
 *           - cortesia
 *
 *     EstadoSolicitudReporte:
 *       in: query
 *       name: estado
 *       required: false
 *       description: Estado de la solicitud
 *       schema:
 *         type: string
 *         enum:
 *           - pendiente
 *           - aprobada
 *           - parcialmente_atendida
 *           - atendida
 *           - rechazada
 *           - anulada
 *
 *     MetodoPagoReporte:
 *       in: query
 *       name: metodoPago
 *       required: false
 *       description: Método de pago
 *       schema:
 *         type: string
 *         enum:
 *           - efectivo
 *           - qr
 *           - transferencia
 *           - mixto
 *
 *     LimiteReporte:
 *       in: query
 *       name: limite
 *       required: false
 *       description: Cantidad máxima de registros
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 10
 *       example: 10
 *
 *   schemas:
 *
 *     ReporteError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Error generando reporte"
 *
 *     FiltrosReporte:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         fechaDesde:
 *           type: string
 *           format: date
 *           nullable: true
 *         fechaHasta:
 *           type: string
 *           format: date
 *           nullable: true
 *         idSucursal:
 *           type: string
 *           nullable: true
 *         idCaja:
 *           type: string
 *           nullable: true
 *         idPerfil:
 *           type: string
 *           nullable: true
 *         idAlmacen:
 *           type: string
 *           nullable: true
 *         idProducto:
 *           type: string
 *           nullable: true
 *         estado:
 *           type: string
 *           nullable: true
 *         metodoPago:
 *           type: string
 *           nullable: true
 *
 *     DashboardResumen:
 *       type: object
 *       properties:
 *         totalVentas:
 *           type: number
 *           example: 2500
 *         cantidadVentas:
 *           type: integer
 *           example: 125
 *         ticketPromedio:
 *           type: number
 *           example: 20
 *         totalEgresos:
 *           type: number
 *           example: 500
 *         cantidadEgresos:
 *           type: integer
 *           example: 10
 *         gananciaEstimada:
 *           type: number
 *           example: 2000
 *         cajasAbiertas:
 *           type: integer
 *           example: 2
 *         solicitudesPendientes:
 *           type: integer
 *           example: 4
 *         productosStockBajo:
 *           type: integer
 *           example: 6
 *
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         resumen:
 *           $ref: '#/components/schemas/DashboardResumen'
 *         productoMasVendido:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *         vendedorMayorVenta:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *
 *     EstadoVentaResumen:
 *       type: object
 *       properties:
 *         cantidad:
 *           type: integer
 *           example: 10
 *         subtotal:
 *           type: number
 *           example: 1000
 *         descuento:
 *           type: number
 *           example: 50
 *         total:
 *           type: number
 *           example: 950
 *         promedio:
 *           type: number
 *           example: 95
 *
 *     VentasResumenResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         resumen:
 *           type: object
 *           properties:
 *             pagado:
 *               $ref: '#/components/schemas/EstadoVentaResumen'
 *             anulado:
 *               $ref: '#/components/schemas/EstadoVentaResumen'
 *             cortesia:
 *               $ref: '#/components/schemas/EstadoVentaResumen'
 *         ingresosReales:
 *           type: number
 *           example: 950
 *
 *     VentaPorSucursal:
 *       type: object
 *       properties:
 *         idSucursal:
 *           type: string
 *         nombreSucursal:
 *           type: string
 *           example: "Kabanas"
 *         cantidadVentas:
 *           type: integer
 *           example: 35
 *         subtotal:
 *           type: number
 *           example: 1200
 *         descuento:
 *           type: number
 *           example: 50
 *         totalVendido:
 *           type: number
 *           example: 1150
 *         ticketPromedio:
 *           type: number
 *           example: 32.86
 *
 *     VentaPorCaja:
 *       type: object
 *       properties:
 *         idCaja:
 *           type: string
 *         nombreCaja:
 *           type: string
 *           example: "Caja principal"
 *         idSucursal:
 *           type: string
 *         nombreSucursal:
 *           type: string
 *           example: "Kabanas"
 *         cantidadVentas:
 *           type: integer
 *           example: 20
 *         totalVendido:
 *           type: number
 *           example: 650
 *         ticketPromedio:
 *           type: number
 *           example: 32.5
 *
 *     VentaPorVendedor:
 *       type: object
 *       properties:
 *         idPerfil:
 *           type: string
 *         nombres:
 *           type: string
 *           example: "José"
 *         apellidos:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           example: "jose@gmail.com"
 *         cantidadVentas:
 *           type: integer
 *           example: 25
 *         subtotal:
 *           type: number
 *           example: 850
 *         descuento:
 *           type: number
 *           example: 30
 *         totalVendido:
 *           type: number
 *           example: 820
 *         ticketPromedio:
 *           type: number
 *           example: 32.8
 *
 *     VentaMetodoPago:
 *       type: object
 *       properties:
 *         metodoPago:
 *           type: string
 *           example: "efectivo"
 *         cantidadVentas:
 *           type: integer
 *           example: 20
 *         totalVendido:
 *           type: number
 *           example: 700
 *         promedio:
 *           type: number
 *           example: 35
 *
 *     ProductoMasVendido:
 *       type: object
 *       properties:
 *         idProducto:
 *           type: string
 *           example: "6a1ba8887ba11e9abf893823"
 *         nombre:
 *           type: string
 *           example: "Cerveza Paceña"
 *         marca:
 *           type: string
 *           example: "Paceña"
 *         idCategoria:
 *           type: string
 *           nullable: true
 *         cantidadVendida:
 *           type: number
 *           example: 48
 *         totalVendido:
 *           type: number
 *           example: 720
 *         costoTotal:
 *           type: number
 *           example: 480
 *         utilidad:
 *           type: number
 *           example: 240
 *         precioPromedio:
 *           type: number
 *           example: 15
 *
 *     ProductosMasVendidosResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         limite:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductoMasVendido'
 *
 *     InventarioGeneralItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         idAlmacen:
 *           type: string
 *         nombreAlmacen:
 *           type: string
 *           example: "Almacén principal"
 *         tipoAlmacen:
 *           type: string
 *           example: "principal"
 *         idSucursal:
 *           type: string
 *         idProducto:
 *           type: string
 *         nombreProducto:
 *           type: string
 *           example: "Cerveza Paceña"
 *         marca:
 *           type: string
 *           example: "Paceña"
 *         cantidad:
 *           type: number
 *           example: 50
 *         costoUnitario:
 *           type: number
 *           example: 10
 *         ultimoCostoEntrada:
 *           type: number
 *           example: 12
 *         precioVenta:
 *           type: number
 *           example: 15
 *         stockMinimo:
 *           type: number
 *           example: 10
 *         valorInventario:
 *           type: number
 *           example: 500
 *         gananciaUnitaria:
 *           type: number
 *           example: 5
 *         stockBajo:
 *           type: boolean
 *           example: false
 *
 *     InventarioGeneralResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         totalRegistros:
 *           type: integer
 *           example: 25
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InventarioGeneralItem'
 *
 *     StockBajoItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         idAlmacen:
 *           type: string
 *         nombreAlmacen:
 *           type: string
 *         tipoAlmacen:
 *           type: string
 *         idSucursal:
 *           type: string
 *         idProducto:
 *           type: string
 *         nombreProducto:
 *           type: string
 *         marca:
 *           type: string
 *         cantidad:
 *           type: number
 *         stockMinimo:
 *           type: number
 *         agotado:
 *           type: boolean
 *         faltanteParaMinimo:
 *           type: number
 *
 *     StockBajoResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         totalStockBajo:
 *           type: integer
 *         totalAgotados:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StockBajoItem'
 *
 *     ValorInventarioAlmacen:
 *       type: object
 *       properties:
 *         idAlmacen:
 *           type: string
 *         idSucursal:
 *           type: string
 *         nombreAlmacen:
 *           type: string
 *         tipoAlmacen:
 *           type: string
 *         cantidadProductos:
 *           type: integer
 *         unidadesTotales:
 *           type: number
 *         valorCosto:
 *           type: number
 *         valorVenta:
 *           type: number
 *         gananciaPotencial:
 *           type: number
 *
 *     ValorInventarioResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         totales:
 *           type: object
 *           properties:
 *             cantidadProductos:
 *               type: integer
 *             unidadesTotales:
 *               type: number
 *             valorCosto:
 *               type: number
 *             valorVenta:
 *               type: number
 *             gananciaPotencial:
 *               type: number
 *         almacenes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValorInventarioAlmacen'
 *
 *     KardexResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         idProducto:
 *           type: string
 *         resumen:
 *           type: object
 *           properties:
 *             entradas:
 *               type: number
 *             salidas:
 *               type: number
 *             saldoMovimientos:
 *               type: number
 *         movimientos:
 *           type: array
 *           items:
 *             type: object
 *             additionalProperties: true
 *
 *     EstadoResultadosResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         estadoResultados:
 *           type: object
 *           properties:
 *             ventasBrutas:
 *               type: number
 *             descuentos:
 *               type: number
 *             ventasNetas:
 *               type: number
 *             costoVentas:
 *               type: number
 *             utilidadBruta:
 *               type: number
 *             egresosOperativos:
 *               type: number
 *             utilidadNeta:
 *               type: number
 *             margenNetoPorcentaje:
 *               type: number
 *             cantidadVentas:
 *               type: integer
 *             cantidadEgresos:
 *               type: integer
 *
 *     FlujoEfectivoItem:
 *       type: object
 *       properties:
 *         metodoPago:
 *           type: string
 *         cantidad:
 *           type: integer
 *         monto:
 *           type: number
 *
 *     FlujoEfectivoResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         entradas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FlujoEfectivoItem'
 *         salidas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FlujoEfectivoItem'
 *         resumen:
 *           type: object
 *           properties:
 *             totalEntradas:
 *               type: number
 *             totalSalidas:
 *               type: number
 *             flujoNeto:
 *               type: number
 *
 *     CierresCajaResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         resumen:
 *           type: object
 *           additionalProperties: true
 *         cierres:
 *           type: array
 *           items:
 *             type: object
 *             additionalProperties: true
 *
 *     SolicitudResumenEstado:
 *       type: object
 *       properties:
 *         estado:
 *           type: string
 *           enum:
 *             - pendiente
 *             - aprobada
 *             - parcialmente_atendida
 *             - atendida
 *             - rechazada
 *             - anulada
 *         cantidad:
 *           type: integer
 *           example: 5
 *         tiempoPromedioHoras:
 *           type: number
 *           example: 3.5
 *
 *     SolicitudesResumenResponse:
 *       type: object
 *       properties:
 *         filtros:
 *           $ref: '#/components/schemas/FiltrosReporte'
 *         totalSolicitudes:
 *           type: integer
 *           example: 15
 *         porEstado:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SolicitudResumenEstado'
 */

/* =====================================================
    PRUEBA DEL MÓDULO
===================================================== */

/**
 * @openapi
 * /api/reportes/test:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Verificar funcionamiento del módulo
 *     responses:
 *       200:
 *         description: Módulo disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               ok: true
 *               message: "Módulo de reportes funcionando"
 */
router.get(
  "/test",
  (
    _req,
    res
  ) => {

    return res.status(200).json({
      ok: true,
      message:
        "Módulo de reportes funcionando",
    });
  }
);

/* =====================================================
    DASHBOARD
===================================================== */

/**
 * @openapi
 * /api/reportes/dashboard:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener dashboard general
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/PerfilReporte'
 *     responses:
 *       200:
 *         description: Dashboard generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       500:
 *         description: Error generando dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 */
router.get(
  "/dashboard",
  ReporteController.getDashboard
);

/* =====================================================
    RESUMEN DE VENTAS
===================================================== */

/**
 * @openapi
 * /api/reportes/ventas/resumen:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener resumen de ventas
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/PerfilReporte'
 *       - $ref: '#/components/parameters/MetodoPagoReporte'
 *     responses:
 *       200:
 *         description: Resumen de ventas generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VentasResumenResponse'
 *       500:
 *         description: Error generando resumen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 */
router.get(
  "/ventas/resumen",
  ReporteController.getVentasResumen
);

/* =====================================================
    VENTAS POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/reportes/ventas/por-sucursal:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener ventas agrupadas por sucursal
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/EstadoVentaReporte'
 *       - $ref: '#/components/parameters/MetodoPagoReporte'
 *     responses:
 *       200:
 *         description: Ventas por sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filtros:
 *                   $ref: '#/components/schemas/FiltrosReporte'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VentaPorSucursal'
 *       500:
 *         description: Error generando reporte
 */
router.get(
  "/ventas/por-sucursal",
  ReporteController.getVentasPorSucursal
);

/* =====================================================
    VENTAS POR CAJA
===================================================== */

/**
 * @openapi
 * /api/reportes/ventas/por-caja:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener ventas agrupadas por caja
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/EstadoVentaReporte'
 *       - $ref: '#/components/parameters/MetodoPagoReporte'
 *     responses:
 *       200:
 *         description: Ventas por caja
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filtros:
 *                   $ref: '#/components/schemas/FiltrosReporte'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VentaPorCaja'
 *       500:
 *         description: Error generando reporte
 */
router.get(
  "/ventas/por-caja",
  ReporteController.getVentasPorCaja
);

/* =====================================================
    VENTAS POR VENDEDOR
===================================================== */

/**
 * @openapi
 * /api/reportes/ventas/por-vendedor:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener ventas agrupadas por vendedor o mesero
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/PerfilReporte'
 *       - $ref: '#/components/parameters/EstadoVentaReporte'
 *     responses:
 *       200:
 *         description: Ventas por vendedor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filtros:
 *                   $ref: '#/components/schemas/FiltrosReporte'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VentaPorVendedor'
 *       500:
 *         description: Error generando reporte
 */
router.get(
  "/ventas/por-vendedor",
  ReporteController.getVentasPorVendedor
);

/* =====================================================
    MÉTODOS DE PAGO
===================================================== */

/**
 * @openapi
 * /api/reportes/ventas/metodos-pago:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener ventas agrupadas por método de pago
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/PerfilReporte'
 *       - $ref: '#/components/parameters/MetodoPagoReporte'
 *     responses:
 *       200:
 *         description: Ventas agrupadas por método de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filtros:
 *                   $ref: '#/components/schemas/FiltrosReporte'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VentaMetodoPago'
 *       500:
 *         description: Error generando reporte
 */
router.get(
  "/ventas/metodos-pago",
  ReporteController.getVentasPorMetodoPago
);

/* =====================================================
    PRODUCTOS MÁS VENDIDOS
===================================================== */

/**
 * @openapi
 * /api/reportes/ventas/productos-mas-vendidos:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener productos más vendidos
 *     description: Retorna cantidad vendida, importe, costo y utilidad.
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/PerfilReporte'
 *       - $ref: '#/components/parameters/ProductoReporte'
 *       - $ref: '#/components/parameters/EstadoVentaReporte'
 *       - $ref: '#/components/parameters/LimiteReporte'
 *     responses:
 *       200:
 *         description: Productos más vendidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductosMasVendidosResponse'
 *       400:
 *         description: Filtros no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 *       500:
 *         description: Error generando productos más vendidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 */
router.get(
  "/ventas/productos-mas-vendidos",
  ReporteController.getProductosMasVendidos
);

/* =====================================================
    INVENTARIO GENERAL
===================================================== */

/**
 * @openapi
 * /api/reportes/inventario/general:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener inventario general
 *     parameters:
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/AlmacenReporte'
 *       - $ref: '#/components/parameters/ProductoReporte'
 *     responses:
 *       200:
 *         description: Inventario general
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioGeneralResponse'
 *       500:
 *         description: Error generando inventario
 */
router.get(
  "/inventario/general",
  ReporteController.getInventarioGeneral
);

/* =====================================================
    STOCK BAJO
===================================================== */

/**
 * @openapi
 * /api/reportes/inventario/stock-bajo:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener productos con stock bajo o agotado
 *     parameters:
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/AlmacenReporte'
 *       - $ref: '#/components/parameters/ProductoReporte'
 *     responses:
 *       200:
 *         description: Productos con stock bajo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockBajoResponse'
 *       500:
 *         description: Error generando reporte
 */
router.get(
  "/inventario/stock-bajo",
  ReporteController.getInventarioStockBajo
);

/* =====================================================
    VALOR DEL INVENTARIO
===================================================== */

/**
 * @openapi
 * /api/reportes/inventario/valor:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener valor del inventario agrupado por almacén
 *     parameters:
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/AlmacenReporte'
 *     responses:
 *       200:
 *         description: Valor del inventario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValorInventarioResponse'
 *       500:
 *         description: Error generando reporte
 */
router.get(
  "/inventario/valor",
  ReporteController.getValorInventario
);

/* =====================================================
    KARDEX
===================================================== */

/**
 * @openapi
 * /api/reportes/inventario/kardex/{idProducto}:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener Kardex de un producto
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *         example: "6a1ba8887ba11e9abf893823"
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/AlmacenReporte'
 *     responses:
 *       200:
 *         description: Kardex generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KardexResponse'
 *       400:
 *         description: ID del producto no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 *       500:
 *         description: Error generando Kardex
 */
router.get(
  "/inventario/kardex/:idProducto",
  ReporteController.getKardexProducto
);
/* =====================================================
   KARDEX GENERAL POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/reportes/inventario/kardex:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener Kardex general de una sucursal
 *     parameters:
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/ProductoReporte'
 *       - $ref: '#/components/parameters/AlmacenReporte'
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - in: query
 *         name: tipoMovimiento
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kardex generado correctamente
 *       400:
 *         description: Parámetros no válidos
 *       500:
 *         description: Error generando Kardex
 */
router.get(
  "/inventario/kardex",
  ReporteController.getKardexInventario
);

/* =====================================================
   KARDEX DE UN PRODUCTO
===================================================== */

router.get(
  "/inventario/kardex/:idProducto",
  ReporteController.getKardexProducto
);

/* =====================================================
    ESTADO DE RESULTADOS
===================================================== */

/**
 * @openapi
 * /api/reportes/finanzas/estado-resultados:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener estado de resultados estimado
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *     responses:
 *       200:
 *         description: Estado de resultados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoResultadosResponse'
 *       500:
 *         description: Error generando estado de resultados
 */
router.get(
  "/finanzas/estado-resultados",
  ReporteController.getEstadoResultados
);

/* =====================================================
    FLUJO DE EFECTIVO
===================================================== */

/**
 * @openapi
 * /api/reportes/finanzas/flujo-efectivo:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener flujo de efectivo
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/MetodoPagoReporte'
 *     responses:
 *       200:
 *         description: Flujo de efectivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlujoEfectivoResponse'
 *       500:
 *         description: Error generando flujo de efectivo
 */
router.get(
  "/finanzas/flujo-efectivo",
  ReporteController.getFlujoEfectivo
);

/* =====================================================
    CIERRES DE CAJA
===================================================== */

/**
 * @openapi
 * /api/reportes/caja/cierres:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener cierres y diferencias de caja
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/CajaReporte'
 *       - $ref: '#/components/parameters/PerfilReporte'
 *     responses:
 *       200:
 *         description: Historial de cierres
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CierresCajaResponse'
 *       500:
 *         description: Error generando reporte de cierres
 */
router.get(
  "/caja/cierres",
  ReporteController.getCierresCaja
);

/* =====================================================
    SOLICITUDES
===================================================== */

/**
 * @openapi
 * /api/reportes/solicitudes/resumen:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Obtener solicitudes agrupadas por estado
 *     description: Retorna cantidad de solicitudes y tiempo promedio de atención.
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeReporte'
 *       - $ref: '#/components/parameters/FechaHastaReporte'
 *       - $ref: '#/components/parameters/SucursalReporte'
 *       - $ref: '#/components/parameters/PerfilReporte'
 *       - $ref: '#/components/parameters/EstadoSolicitudReporte'
 *     responses:
 *       200:
 *         description: Solicitudes agrupadas por estado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SolicitudesResumenResponse'
 *             example:
 *               filtros:
 *                 fechaDesde: "2026-06-01"
 *                 fechaHasta: "2026-06-30"
 *                 idSucursal: "6a1ba90b7ba11e9abf89383a"
 *               totalSolicitudes: 15
 *               porEstado:
 *                 - estado: "pendiente"
 *                   cantidad: 5
 *                   tiempoPromedioHoras: 0
 *                 - estado: "aprobada"
 *                   cantidad: 4
 *                   tiempoPromedioHoras: 2.75
 *                 - estado: "atendida"
 *                   cantidad: 6
 *                   tiempoPromedioHoras: 5.2
 *       500:
 *         description: Error generando resumen de solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteError'
 */
router.get(
  "/solicitudes/resumen",
  ReporteController.getSolicitudesResumen
);

export default router;