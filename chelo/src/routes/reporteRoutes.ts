// src/routes/reporteRouter.ts

import { Router } from "express";
import { ReporteController } from "../controllers/ReporteController";

const router = Router();

/**
 * @openapi
 * components:
 *   parameters:
 *     IdSucursalParam:
 *       in: path
 *       name: idSucursal
 *       required: true
 *       schema:
 *         type: string
 *       description: ID de la sucursal.
 *       example: "68d5d65430dcdf69852d1e3e"
 *
 *     IdPerfilParam:
 *       in: path
 *       name: idPerfil
 *       required: true
 *       schema:
 *         type: string
 *       description: ID del perfil de usuario, mesero o vendedor.
 *       example: "69f6927bd7691b4b764a116d"
 *
 *     IdCajaParam:
 *       in: path
 *       name: idCaja
 *       required: true
 *       schema:
 *         type: string
 *       description: ID de la caja.
 *       example: "69f722df21b3a4408d81a9c2"
 *
 *     IdAlmacenParam:
 *       in: path
 *       name: idAlmacen
 *       required: true
 *       schema:
 *         type: string
 *       description: ID del almacén.
 *       example: "6a0195c0ce66a0fe45ce693d"
 *
 *     IdProductoParam:
 *       in: path
 *       name: idProducto
 *       required: true
 *       schema:
 *         type: string
 *       description: ID del producto.
 *       example: "69f6ad42e156a88e941e7ce9"
 *
 *     FechaDesdeQuery:
 *       in: query
 *       name: desde
 *       required: false
 *       schema:
 *         type: string
 *         format: date
 *       description: Fecha inicial del reporte.
 *       example: "2026-05-01"
 *
 *     FechaHastaQuery:
 *       in: query
 *       name: hasta
 *       required: false
 *       schema:
 *         type: string
 *         format: date
 *       description: Fecha final del reporte.
 *       example: "2026-05-31"
 */

/* =====================================================
    1. REPORTE GENERAL DE SUCURSALES
    Saber qué sucursal vende más
===================================================== */

/**
 * @openapi
 * /api/reportes/sucursales/ventas:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Reporte general de ventas por sucursal
 *     description: Permite saber qué sucursal vende más. No requiere ID porque compara todas las sucursales.
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 *       500:
 *         description: Error al generar reporte.
 */
router.get(
  "/sucursales/ventas",
  ReporteController.getReporteVentasPorSucursal
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/ventas:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Reporte de ventas de una sucursal específica
 *     description: Muestra las ventas resumidas de una sucursal específica.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/ventas",
  ReporteController.getReporteVentasPorSucursal
);

/* =====================================================
    2. REPORTE POR VENDEDOR / MESERO
===================================================== */

/**
 * @openapi
 * /api/reportes/vendedores/ventas:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Reporte general de ventas por vendedor
 *     description: Muestra cuánto vendió cada vendedor o mesero en todas las sucursales.
 *     parameters:
 *       - in: query
 *         name: idSucursal
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar vendedores por sucursal.
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/vendedores/ventas",
  ReporteController.getReporteVentasPorVendedor
);

/**
 * @openapi
 * /api/reportes/vendedor/{idPerfil}/ventas:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Reporte de ventas de un vendedor o mesero
 *     description: Muestra cuánto vendió un mesero específico en su jornada o rango de fechas.
 *     parameters:
 *       - $ref: '#/components/parameters/IdPerfilParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/vendedor/:idPerfil/ventas",
  ReporteController.getReporteVentasPorVendedor
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/vendedores:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Reporte de ventas de meseros por sucursal
 *     description: Muestra las ventas de todos los meseros de una sucursal.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/vendedores",
  ReporteController.getReporteSucursalVendedores
);

/* =====================================================
    3. FLUJO DE EFECTIVO POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/reportes/sucursales/flujo-efectivo:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Flujo de efectivo general por sucursales
 *     description: Muestra entradas, salidas y flujo neto de todas las sucursales.
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursales/flujo-efectivo",
  ReporteController.getReporteFlujoEfectivoSucursal
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/flujo-efectivo:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Flujo de efectivo de una sucursal
 *     description: Muestra entradas por ventas, salidas por egresos y flujo neto de una sucursal.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/flujo-efectivo",
  ReporteController.getReporteFlujoEfectivoSucursal
);

/* =====================================================
    4. ESTADO DE RESULTADOS POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/reportes/sucursales/estado-resultados:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Estado de resultados general por sucursales
 *     description: Compara ingresos, costo de ventas, egresos y utilidad operativa de cada sucursal.
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursales/estado-resultados",
  ReporteController.getReporteEstadoResultadosSucursal
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/estado-resultados:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Estado de resultados de una sucursal
 *     description: Muestra ingresos, costo de ventas, utilidad bruta, egresos y utilidad operativa de una sucursal.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/estado-resultados",
  ReporteController.getReporteEstadoResultadosSucursal
);

/* =====================================================
    5. MÉTODOS DE PAGO POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/reportes/sucursales/metodos-pago:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Métodos de pago por sucursales
 *     description: Muestra con qué pagan más en cada sucursal.
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursales/metodos-pago",
  ReporteController.getReporteMetodoPagoSucursal
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/metodos-pago:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Métodos de pago de una sucursal
 *     description: Muestra cuánto se pagó en efectivo, QR, tarjeta o mixto en una sucursal.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/metodos-pago",
  ReporteController.getReporteMetodoPagoSucursal
);

/* =====================================================
    6. PRODUCTOS MÁS VENDIDOS
===================================================== */

/**
 * @openapi
 * /api/reportes/productos/mas-vendidos:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Productos más vendidos general
 *     description: Muestra qué productos se vendieron más en general.
 *     parameters:
 *       - in: query
 *         name: idSucursal
 *         required: false
 *         schema:
 *           type: string
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - in: query
 *         name: idPerfil
 *         required: false
 *         schema:
 *           type: string
 *         example: "69f6927bd7691b4b764a116d"
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/productos/mas-vendidos",
  ReporteController.getReporteProductosMasVendidos
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/productos-mas-vendidos:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Productos más vendidos por sucursal
 *     description: Muestra qué productos se vendieron más en una sucursal.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/productos-mas-vendidos",
  ReporteController.getReporteProductosMasVendidos
);

/**
 * @openapi
 * /api/reportes/producto/{idProducto}/ventas:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Reporte de ventas de un producto específico
 *     description: Muestra cuánto se vendió de un producto específico.
 *     parameters:
 *       - $ref: '#/components/parameters/IdProductoParam'
 *       - in: query
 *         name: idSucursal
 *         required: false
 *         schema:
 *           type: string
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/producto/:idProducto/ventas",
  ReporteController.getReporteProductosMasVendidos
);

/* =====================================================
    7. EGRESOS POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/reportes/sucursales/egresos:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Egresos generales por sucursales
 *     description: Muestra los egresos agrupados por sucursal y tipo de egreso.
 *     parameters:
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursales/egresos",
  ReporteController.getReporteEgresosPorSucursal
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/egresos:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Egresos de una sucursal
 *     description: Muestra los egresos de una sucursal agrupados por tipo de egreso.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - $ref: '#/components/parameters/FechaDesdeQuery'
 *       - $ref: '#/components/parameters/FechaHastaQuery'
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/egresos",
  ReporteController.getReporteEgresosPorSucursal
);

/* =====================================================
    8. INVENTARIO POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/reportes/sucursales/inventario:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Inventario general por sucursales
 *     description: Muestra inventario actual de todas las sucursales.
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursales/inventario",
  ReporteController.getReporteInventarioPorSucursal
);

/**
 * @openapi
 * /api/reportes/sucursal/{idSucursal}/inventario:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Inventario de una sucursal
 *     description: Muestra inventario actual de una sucursal, agrupado por almacén y producto.
 *     parameters:
 *       - $ref: '#/components/parameters/IdSucursalParam'
 *       - in: query
 *         name: idAlmacen
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por almacén dentro de la sucursal.
 *         example: "6a0195c0ce66a0fe45ce693d"
 *       - in: query
 *         name: idProducto
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por producto.
 *         example: "69f6ad42e156a88e941e7ce9"
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/sucursal/:idSucursal/inventario",
  ReporteController.getReporteInventarioPorSucursal
);

/**
 * @openapi
 * /api/reportes/almacen/{idAlmacen}/inventario:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Inventario de un almacén
 *     description: Muestra inventario actual de un almacén específico.
 *     parameters:
 *       - $ref: '#/components/parameters/IdAlmacenParam'
 *       - in: query
 *         name: idProducto
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por producto.
 *         example: "69f6ad42e156a88e941e7ce9"
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/almacen/:idAlmacen/inventario",
  ReporteController.getReporteInventarioPorSucursal
);

/**
 * @openapi
 * /api/reportes/producto/{idProducto}/inventario:
 *   get:
 *     tags:
 *       - Reportes
 *     summary: Inventario de un producto
 *     description: Muestra en qué sucursales y almacenes existe un producto.
 *     parameters:
 *       - $ref: '#/components/parameters/IdProductoParam'
 *       - in: query
 *         name: idSucursal
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por sucursal.
 *         example: "68d5d65430dcdf69852d1e3e"
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get(
  "/producto/:idProducto/inventario",
  ReporteController.getReporteInventarioPorSucursal
);

export default router;