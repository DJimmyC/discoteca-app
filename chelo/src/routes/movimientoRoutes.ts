import { Router } from "express";
import { MovimientoController } from "../controllers/MovimientoController";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Movimiento:
 *       type: object
 *       description: Registro centralizado de movimientos de caja, ventas, egresos e inventario.
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "2026-06-04T14:30:00.000Z"
 *         tipoMovimiento:
 *           type: string
 *           enum:
 *             - apertura_caja
 *             - cierre_caja
 *             - venta
 *             - venta_anulada
 *             - cortesia
 *             - egreso
 *             - entrada_inventario
 *             - salida_inventario
 *             - transferencia_inventario
 *             - ajuste_inventario
 *             - conteo_fisico
 *             - diferencia_caja
 *             - diferencia_inventario
 *           example: "venta"
 *         origenMovimiento:
 *           type: string
 *           enum:
 *             - venta
 *             - cortesia
 *             - egreso
 *             - ajuste
 *             - transferencia
 *             - conteo
 *             - manual
 *           example: "venta"
 *         modulo:
 *           type: string
 *           enum:
 *             - caja
 *             - venta
 *             - egreso
 *             - inventario
 *             - transferencia
 *             - cierre
 *           example: "venta"
 *         idSucursal:
 *           type: string
 *           example: "64faaa111222"
 *         idCaja:
 *           type: string
 *           example: "64fbbb333444"
 *         idPerfil:
 *           type: string
 *           example: "64fccc555666"
 *         idAlmacen:
 *           type: string
 *           example: "64fddd777888"
 *         idProducto:
 *           type: string
 *           example: "64feee999000"
 *         idInventario:
 *           type: string
 *           example: "64fabc123456"
 *         referenciaId:
 *           type: string
 *           example: "64f999888777"
 *         referenciaModelo:
 *           type: string
 *           example: "Venta"
 *         metodoPago:
 *           type: string
 *           enum:
 *             - efectivo
 *             - qr
 *             - transferencia
 *             - otro
 *           example: "efectivo"
 *         cantidadEntrada:
 *           type: number
 *           example: 20
 *         cantidadSalida:
 *           type: number
 *           example: 10
 *         cantidadInicial:
 *           type: number
 *           example: 50
 *         cantidadEsperada:
 *           type: number
 *           example: 60
 *         cantidadFisica:
 *           type: number
 *           example: 59
 *         diferenciaCantidad:
 *           type: number
 *           example: -1
 *         montoEntrada:
 *           type: number
 *           example: 100
 *         montoSalida:
 *           type: number
 *           example: 50
 *         montoInicial:
 *           type: number
 *           example: 500
 *         montoEsperado:
 *           type: number
 *           example: 2600
 *         montoFisico:
 *           type: number
 *           example: 2580
 *         diferenciaMonto:
 *           type: number
 *           example: -20
 *         costoUnitario:
 *           type: number
 *           example: 5
 *         precioUnitario:
 *           type: number
 *           example: 10
 *         subtotal:
 *           type: number
 *           example: 100
 *         total:
 *           type: number
 *           example: 100
 *         estado:
 *           type: string
 *           example: "activo"
 *         observacion:
 *           type: string
 *           example: "Venta registrada desde comanda"
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *
 *     MovimientoInput:
 *       type: object
 *       required:
 *         - tipoMovimiento
 *         - modulo
 *       properties:
 *         fecha:
 *           type: string
 *           format: date-time
 *         tipoMovimiento:
 *           type: string
 *           enum:
 *             - apertura_caja
 *             - cierre_caja
 *             - venta
 *             - venta_anulada
 *             - cortesia
 *             - egreso
 *             - entrada_inventario
 *             - salida_inventario
 *             - transferencia_inventario
 *             - ajuste_inventario
 *             - conteo_fisico
 *             - diferencia_caja
 *             - diferencia_inventario
 *         origenMovimiento:
 *           type: string
 *           enum:
 *             - venta
 *             - cortesia
 *             - egreso
 *             - ajuste
 *             - transferencia
 *             - conteo
 *             - manual
 *         modulo:
 *           type: string
 *           enum:
 *             - caja
 *             - venta
 *             - egreso
 *             - inventario
 *             - transferencia
 *             - cierre
 *         idSucursal:
 *           type: string
 *         idCaja:
 *           type: string
 *         idPerfil:
 *           type: string
 *         idAlmacen:
 *           type: string
 *         idProducto:
 *           type: string
 *         idInventario:
 *           type: string
 *         referenciaId:
 *           type: string
 *         referenciaModelo:
 *           type: string
 *         metodoPago:
 *           type: string
 *           enum:
 *             - efectivo
 *             - qr
 *             - transferencia
 *             - otro
 *         cantidadEntrada:
 *           type: number
 *         cantidadSalida:
 *           type: number
 *         cantidadInicial:
 *           type: number
 *         cantidadEsperada:
 *           type: number
 *         cantidadFisica:
 *           type: number
 *         diferenciaCantidad:
 *           type: number
 *         montoEntrada:
 *           type: number
 *         montoSalida:
 *           type: number
 *         montoInicial:
 *           type: number
 *         montoEsperado:
 *           type: number
 *         montoFisico:
 *           type: number
 *         diferenciaMonto:
 *           type: number
 *         costoUnitario:
 *           type: number
 *         precioUnitario:
 *           type: number
 *         subtotal:
 *           type: number
 *         total:
 *           type: number
 *         estado:
 *           type: string
 *         observacion:
 *           type: string
 *         creadoPor:
 *           type: string
 */

/**
 * @openapi
 * /api/movimiento:
 *   post:
 *     tags:
 *       - Movimiento
 *     summary: Crear movimiento
 *     description: Registra un movimiento centralizado para caja, venta, egreso o inventario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovimientoInput'
 *           example:
 *             tipoMovimiento: "venta"
 *             modulo: "venta"
 *             idSucursal: "64faaa111222"
 *             idCaja: "64fbbb333444"
 *             idPerfil: "64fccc555666"
 *             metodoPago: "efectivo"
 *             montoEntrada: 100
 *             total: 100
 *             referenciaModelo: "Venta"
 *             referenciaId: "64f999888777"
 *             creadoPor: "admin"
 *     responses:
 *       200:
 *         description: Movimiento registrado correctamente
 *       500:
 *         description: Error al registrar movimiento
 */
router.post(
    "/",
    MovimientoController.createMovimiento
);

/**
 * @openapi
 * /api/movimiento:
 *   get:
 *     tags:
 *       - Movimiento
 *     summary: Obtener todos los movimientos
 *     description: Retorna todos los movimientos registrados, con datos relacionados de sucursal, caja, perfil, almacén, producto e inventario.
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *       500:
 *         description: Error al obtener movimientos
 */
router.get(
    "/",
    MovimientoController.getAllMovimientos
);

/**
 * @openapi
 * /api/movimiento/filtrar:
 *   get:
 *     tags:
 *       - Movimiento
 *     summary: Filtrar movimientos
 *     description: Permite filtrar movimientos por fechas, sucursal, caja, perfil, almacén, producto, tipo, módulo, método de pago u origen.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-04"
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *       - in: query
 *         name: idCaja
 *         schema:
 *           type: string
 *       - in: query
 *         name: idPerfil
 *         schema:
 *           type: string
 *       - in: query
 *         name: idAlmacen
 *         schema:
 *           type: string
 *       - in: query
 *         name: idProducto
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipoMovimiento
 *         schema:
 *           type: string
 *           enum:
 *             - apertura_caja
 *             - cierre_caja
 *             - venta
 *             - venta_anulada
 *             - cortesia
 *             - egreso
 *             - entrada_inventario
 *             - salida_inventario
 *             - transferencia_inventario
 *             - ajuste_inventario
 *             - conteo_fisico
 *             - diferencia_caja
 *             - diferencia_inventario
 *       - in: query
 *         name: modulo
 *         schema:
 *           type: string
 *           enum:
 *             - caja
 *             - venta
 *             - egreso
 *             - inventario
 *             - transferencia
 *             - cierre
 *       - in: query
 *         name: metodoPago
 *         schema:
 *           type: string
 *           enum:
 *             - efectivo
 *             - qr
 *             - transferencia
 *             - otro
 *       - in: query
 *         name: origenMovimiento
 *         schema:
 *           type: string
 *           enum:
 *             - venta
 *             - cortesia
 *             - egreso
 *             - ajuste
 *             - transferencia
 *             - conteo
 *             - manual
 *     responses:
 *       200:
 *         description: Lista de movimientos filtrados
 *       500:
 *         description: Error al filtrar movimientos
 */
router.get(
    "/filtrar",
    MovimientoController.getMovimientosFiltrados
);

/**
 * @openapi
 * /api/movimiento/productos-mas-vendidos:
 *   get:
 *     tags:
 *       - Movimiento
 *     summary: Reporte de productos más vendidos
 *     description: Agrupa las salidas de inventario generadas por ventas y muestra los productos más vendidos por cantidad, total vendido, costo y utilidad.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-04"
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *       - in: query
 *         name: idAlmacen
 *         schema:
 *           type: string
 *       - in: query
 *         name: idPerfil
 *         schema:
 *           type: string
 *       - in: query
 *         name: limite
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: Reporte de productos más vendidos
 *       500:
 *         description: Error al obtener productos más vendidos
 */
router.get(
    "/productos-mas-vendidos",
    MovimientoController.getProductosMasVendidos
);

/**
 * @openapi
 * /api/movimiento/reporte-caja-diaria:
 *   get:
 *     tags:
 *       - Movimiento
 *     summary: Reporte diario de caja
 *     description: Calcula monto inicial, ventas por método de pago, egresos, cortesías, anulaciones y monto esperado en caja física.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-04"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-04"
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *       - in: query
 *         name: idCaja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte de caja diaria
 *       500:
 *         description: Error al obtener reporte de caja diaria
 */
router.get(
    "/reporte-caja-diaria",
    MovimientoController.getReporteCajaDiaria
);

/**
 * @openapi
 * /api/movimiento/estado-resultados:
 *   get:
 *     tags:
 *       - Movimiento
 *     summary: Estado de resultados
 *     description: Calcula ingresos por ventas, costo de ventas, egresos, utilidad bruta y utilidad neta en un periodo determinado.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-30"
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de resultados generado correctamente
 *       500:
 *         description: Error al obtener estado de resultados
 */
router.get(
    "/estado-resultados",
    MovimientoController.getEstadoResultados
);

/**
 * @openapi
 * /api/movimiento/flujo-efectivo:
 *   get:
 *     tags:
 *       - Movimiento
 *     summary: Flujo de efectivo
 *     description: Calcula saldo inicial, entradas, salidas, flujo neto y saldo final esperado.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-30"
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *       - in: query
 *         name: idCaja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flujo de efectivo generado correctamente
 *       500:
 *         description: Error al obtener flujo de efectivo
 */
router.get(
    "/flujo-efectivo",
    MovimientoController.getFlujoEfectivo
);

/**
 * @openapi
 * /api/movimiento/{id}:
 *   get:
 *     tags:
 *       - Movimiento
 *     summary: Obtener movimiento por ID
 *     description: Retorna un movimiento específico por su identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error al obtener movimiento
 */
router.get(
    "/:id",
    MovimientoController.getMovimientoById
);

export default router;