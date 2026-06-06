// src/routes/movimientoRoutes.ts

import {
  Router,
} from "express";

import {
  MovimientoController,
} from "../controllers/MovimientoController";

const router =
  Router();

/* =====================================================
    COMPONENTES SWAGGER
===================================================== */

/**
 * @openapi
 * tags:
 *   - name: Movimiento
 *     description: Movimientos de caja, ventas, egresos, solicitudes e inventario
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     MovimientoFechaInicio:
 *       in: query
 *       name: fechaInicio
 *       required: false
 *       schema:
 *         type: string
 *         format: date
 *       example: "2026-06-04"
 *
 *     MovimientoFechaFin:
 *       in: query
 *       name: fechaFin
 *       required: false
 *       schema:
 *         type: string
 *         format: date
 *       example: "2026-06-05"
 *
 *     MovimientoSucursal:
 *       in: query
 *       name: idSucursal
 *       required: false
 *       schema:
 *         type: string
 *       example: "6a1ba90b7ba11e9abf89383a"
 *
 *     MovimientoCaja:
 *       in: query
 *       name: idCaja
 *       required: false
 *       schema:
 *         type: string
 *       example: "6a1bace07ba11e9abf893943"
 *
 *     MovimientoPerfil:
 *       in: query
 *       name: idPerfil
 *       required: false
 *       schema:
 *         type: string
 *
 *     MovimientoAlmacen:
 *       in: query
 *       name: idAlmacen
 *       required: false
 *       schema:
 *         type: string
 *
 *     MovimientoProducto:
 *       in: query
 *       name: idProducto
 *       required: false
 *       schema:
 *         type: string
 *
 *     MovimientoTipo:
 *       in: query
 *       name: tipoMovimiento
 *       required: false
 *       schema:
 *         type: string
 *         enum:
 *           - apertura_caja
 *           - cierre_caja
 *           - venta
 *           - venta_anulada
 *           - cortesia
 *           - egreso
 *           - solicitud
 *           - solicitud_aprobada
 *           - solicitud_rechazada
 *           - solicitud_anulada
 *           - entrada_inventario
 *           - salida_inventario
 *           - transferencia_inventario
 *           - ajuste_inventario
 *           - conteo_fisico
 *           - diferencia_caja
 *           - diferencia_inventario
 *
 *     MovimientoModulo:
 *       in: query
 *       name: modulo
 *       required: false
 *       schema:
 *         type: string
 *         enum:
 *           - caja
 *           - venta
 *           - ventas
 *           - egreso
 *           - inventario
 *           - solicitud
 *           - transferencia
 *           - cierre
 *           - sistema
 *
 *     MovimientoMetodoPago:
 *       in: query
 *       name: metodoPago
 *       required: false
 *       schema:
 *         type: string
 *         enum:
 *           - efectivo
 *           - qr
 *           - transferencia
 *           - mixto
 *           - otro
 *
 *     MovimientoOrigen:
 *       in: query
 *       name: origenMovimiento
 *       required: false
 *       schema:
 *         type: string
 *         enum:
 *           - venta
 *           - cortesia
 *           - egreso
 *           - apertura_caja
 *           - cierre_caja
 *           - inventario
 *           - solicitud
 *           - transferencia
 *           - ajuste
 *           - conteo_fisico
 *           - sistema
 *
 *     MovimientoEstado:
 *       in: query
 *       name: estado
 *       required: false
 *       schema:
 *         type: string
 *
 *   schemas:
 *     MovimientoError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *
 *     MovimientoResponse:
 *       type: object
 *       additionalProperties: true
 *
 *     MovimientoArrayResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/MovimientoResponse'
 */

/* =====================================================
    TEST
===================================================== */

/**
 * @openapi
 * /api/movimiento/test:
 *   get:
 *     tags: [Movimiento]
 *     summary: Verificar módulo de movimientos
 *     responses:
 *       200:
 *         description: Módulo disponible
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: "Módulo de movimientos funcionando"
 */
router.get(
  "/test",
  (
    _req,
    res
  ) => {

    return res
      .status(200)
      .json({
        ok:
          true,
        message:
          "Módulo de movimientos funcionando",
      });
  }
);

/* =====================================================
    CREAR
===================================================== */

/**
 * @openapi
 * /api/movimiento:
 *   post:
 *     tags: [Movimiento]
 *     summary: Crear movimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Movimiento registrado
 *       500:
 *         description: Error al registrar
 */
router.post(
  "/",
  MovimientoController
    .createMovimiento
);

/* =====================================================
    TODOS
===================================================== */

/**
 * @openapi
 * /api/movimiento:
 *   get:
 *     tags: [Movimiento]
 *     summary: Obtener todos los movimientos
 *     responses:
 *       200:
 *         description: Lista completa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimientoArrayResponse'
 *       500:
 *         description: Error al obtener
 */
router.get(
  "/",
  MovimientoController
    .getAllMovimientos
);

/* =====================================================
    FILTRAR
===================================================== */

/**
 * @openapi
 * /api/movimiento/filtrar:
 *   get:
 *     tags: [Movimiento]
 *     summary: Filtrar movimientos
 *     description: La fecha final incluye todo el día en zona horaria de Bolivia.
 *     parameters:
 *       - $ref: '#/components/parameters/MovimientoFechaInicio'
 *       - $ref: '#/components/parameters/MovimientoFechaFin'
 *       - $ref: '#/components/parameters/MovimientoSucursal'
 *       - $ref: '#/components/parameters/MovimientoCaja'
 *       - $ref: '#/components/parameters/MovimientoPerfil'
 *       - $ref: '#/components/parameters/MovimientoAlmacen'
 *       - $ref: '#/components/parameters/MovimientoProducto'
 *       - $ref: '#/components/parameters/MovimientoTipo'
 *       - $ref: '#/components/parameters/MovimientoModulo'
 *       - $ref: '#/components/parameters/MovimientoMetodoPago'
 *       - $ref: '#/components/parameters/MovimientoOrigen'
 *       - $ref: '#/components/parameters/MovimientoEstado'
 *     responses:
 *       200:
 *         description: Movimientos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimientoArrayResponse'
 *       400:
 *         description: Filtro inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovimientoError'
 */
router.get(
  "/filtrar",
  MovimientoController
    .getMovimientosFiltrados
);

/* =====================================================
    PRODUCTOS MÁS VENDIDOS
===================================================== */

/**
 * @openapi
 * /api/movimiento/productos-mas-vendidos:
 *   get:
 *     tags: [Movimiento]
 *     summary: Productos más vendidos
 *     parameters:
 *       - $ref: '#/components/parameters/MovimientoFechaInicio'
 *       - $ref: '#/components/parameters/MovimientoFechaFin'
 *       - $ref: '#/components/parameters/MovimientoSucursal'
 *       - $ref: '#/components/parameters/MovimientoCaja'
 *       - $ref: '#/components/parameters/MovimientoPerfil'
 *       - $ref: '#/components/parameters/MovimientoAlmacen'
 *       - $ref: '#/components/parameters/MovimientoProducto'
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Ranking de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 *       400:
 *         description: Filtro inválido
 */
router.get(
  "/productos-mas-vendidos",
  MovimientoController
    .getProductosMasVendidos
);

/* =====================================================
    REPORTE DE CAJA
===================================================== */

/**
 * @openapi
 * /api/movimiento/reporte-caja-diaria:
 *   get:
 *     tags: [Movimiento]
 *     summary: Reporte diario de caja
 *     parameters:
 *       - $ref: '#/components/parameters/MovimientoFechaInicio'
 *       - $ref: '#/components/parameters/MovimientoFechaFin'
 *       - $ref: '#/components/parameters/MovimientoSucursal'
 *       - $ref: '#/components/parameters/MovimientoCaja'
 *       - $ref: '#/components/parameters/MovimientoPerfil'
 *     responses:
 *       200:
 *         description: Reporte generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Filtro inválido
 */
router.get(
  "/reporte-caja-diaria",
  MovimientoController
    .getReporteCajaDiaria
);

/* =====================================================
    ESTADO DE RESULTADOS
===================================================== */

/**
 * @openapi
 * /api/movimiento/estado-resultados:
 *   get:
 *     tags: [Movimiento]
 *     summary: Estado de resultados
 *     parameters:
 *       - $ref: '#/components/parameters/MovimientoFechaInicio'
 *       - $ref: '#/components/parameters/MovimientoFechaFin'
 *       - $ref: '#/components/parameters/MovimientoSucursal'
 *       - $ref: '#/components/parameters/MovimientoCaja'
 *       - $ref: '#/components/parameters/MovimientoPerfil'
 *     responses:
 *       200:
 *         description: Estado de resultados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Filtro inválido
 */
router.get(
  "/estado-resultados",
  MovimientoController
    .getEstadoResultados
);

/* =====================================================
    FLUJO DE EFECTIVO
===================================================== */

/**
 * @openapi
 * /api/movimiento/flujo-efectivo:
 *   get:
 *     tags: [Movimiento]
 *     summary: Flujo de efectivo
 *     parameters:
 *       - $ref: '#/components/parameters/MovimientoFechaInicio'
 *       - $ref: '#/components/parameters/MovimientoFechaFin'
 *       - $ref: '#/components/parameters/MovimientoSucursal'
 *       - $ref: '#/components/parameters/MovimientoCaja'
 *       - $ref: '#/components/parameters/MovimientoPerfil'
 *       - $ref: '#/components/parameters/MovimientoMetodoPago'
 *     responses:
 *       200:
 *         description: Flujo de efectivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Filtro inválido
 */
router.get(
  "/flujo-efectivo",
  MovimientoController
    .getFlujoEfectivo
);

/* =====================================================
    POR ID - SIEMPRE AL FINAL
===================================================== */

/**
 * @openapi
 * /api/movimiento/{id}:
 *   get:
 *     tags: [Movimiento]
 *     summary: Obtener movimiento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Movimiento no encontrado
 */
router.get(
  "/:id",
  MovimientoController
    .getMovimientoById
);

export default router;
