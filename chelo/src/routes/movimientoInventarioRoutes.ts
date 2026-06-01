import { Router } from "express";
import { MovimientoInventarioController } from "../controllers/MovimientoInventarioController";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     MovimientoInventario:
 *       type: object
 *       description: Registro histórico de entradas y salidas del inventario.
 *       properties:
 *         _id:
 *           type: string
 *           example: "6a20b7f8c01a4b2d56a8d123"
 *         codigoMovimiento:
 *           type: string
 *           example: "MOV-1716827282828"
 *         idSucursal:
 *           type: string
 *           example: "68d5d65430dcdf69852d1e3e"
 *         idProducto:
 *           type: string
 *           example: "69f6ad42e156a88e941e7ce9"
 *         idAlmacen:
 *           type: string
 *           example: "6a0195c0ce66a0fe45ce693d"
 *         idCaja:
 *           type: string
 *           nullable: true
 *           example: "69f722df21b3a4408d81a9c2"
 *         idPerfil:
 *           type: string
 *           nullable: true
 *           example: "69f6927bd7691b4b764a116d"
 *         idVenta:
 *           type: string
 *           nullable: true
 *           example: "6a16c987c04b4c2c32f437e1"
 *         idDetalleVenta:
 *           type: string
 *           nullable: true
 *           example: "69f7d007fc469b41124f128e"
 *         idEgreso:
 *           type: string
 *           nullable: true
 *           example: "69f7d681bebfe41cf7411c98"
 *         idDetalleEgreso:
 *           type: string
 *           nullable: true
 *           example: "69f7df8b117bd91b12285c1f"
 *         idSolicitud:
 *           type: string
 *           nullable: true
 *           example: "69f8b9c117bd91b12285c555"
 *         idDetalleSolicitud:
 *           type: string
 *           nullable: true
 *           example: "69f8b9c117bd91b12285c777"
 *         idTransferencia:
 *           type: string
 *           nullable: true
 *           example: "69f8b9c117bd91b12285c999"
 *         tipoMovimiento:
 *           type: string
 *           enum:
 *             - entrada_compra
 *             - salida_venta
 *             - salida_transferencia
 *             - entrada_transferencia
 *             - ajuste_entrada
 *             - ajuste_salida
 *             - merma
 *             - devolucion
 *             - anulacion_venta
 *           example: "salida_venta"
 *         origenMovimiento:
 *           type: string
 *           enum:
 *             - venta
 *             - egreso
 *             - solicitud
 *             - transferencia
 *             - ajuste_manual
 *             - merma
 *             - devolucion
 *             - sistema
 *           example: "venta"
 *         cantidad:
 *           type: number
 *           example: 2
 *         costoUnitario:
 *           type: number
 *           example: 5
 *         precioVenta:
 *           type: number
 *           example: 10
 *         totalCosto:
 *           type: number
 *           example: 10
 *         totalVenta:
 *           type: number
 *           example: 20
 *         stockAnterior:
 *           type: number
 *           example: 15
 *         stockNuevo:
 *           type: number
 *           example: 13
 *         fechaMovimiento:
 *           type: string
 *           format: date-time
 *           example: "2026-05-27T10:37:59.766Z"
 *         observacion:
 *           type: string
 *           example: "Salida de inventario por venta"
 *         creadoPor:
 *           type: string
 *           example: "jimmy"
 *         actualizadoPor:
 *           type: string
 *           example: "admin"
 *         eliminadoPor:
 *           type: string
 *           example: "admin"
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *
 *     MovimientoInventarioInput:
 *       type: object
 *       required:
 *         - idSucursal
 *         - idProducto
 *         - idAlmacen
 *         - tipoMovimiento
 *         - origenMovimiento
 *         - cantidad
 *         - creadoPor
 *       properties:
 *         idSucursal:
 *           type: string
 *           example: "68d5d65430dcdf69852d1e3e"
 *         idProducto:
 *           type: string
 *           example: "69f6ad42e156a88e941e7ce9"
 *         idAlmacen:
 *           type: string
 *           example: "6a0195c0ce66a0fe45ce693d"
 *         idCaja:
 *           type: string
 *           nullable: true
 *           example: "69f722df21b3a4408d81a9c2"
 *         idPerfil:
 *           type: string
 *           nullable: true
 *           example: "69f6927bd7691b4b764a116d"
 *         idVenta:
 *           type: string
 *           nullable: true
 *           example: "6a16c987c04b4c2c32f437e1"
 *         idDetalleVenta:
 *           type: string
 *           nullable: true
 *           example: "69f7d007fc469b41124f128e"
 *         idEgreso:
 *           type: string
 *           nullable: true
 *           example: null
 *         idDetalleEgreso:
 *           type: string
 *           nullable: true
 *           example: null
 *         idSolicitud:
 *           type: string
 *           nullable: true
 *           example: null
 *         idDetalleSolicitud:
 *           type: string
 *           nullable: true
 *           example: null
 *         idTransferencia:
 *           type: string
 *           nullable: true
 *           example: null
 *         tipoMovimiento:
 *           type: string
 *           enum:
 *             - entrada_compra
 *             - salida_venta
 *             - salida_transferencia
 *             - entrada_transferencia
 *             - ajuste_entrada
 *             - ajuste_salida
 *             - merma
 *             - devolucion
 *             - anulacion_venta
 *           example: "salida_venta"
 *         origenMovimiento:
 *           type: string
 *           enum:
 *             - venta
 *             - egreso
 *             - solicitud
 *             - transferencia
 *             - ajuste_manual
 *             - merma
 *             - devolucion
 *             - sistema
 *           example: "venta"
 *         cantidad:
 *           type: number
 *           example: 2
 *         costoUnitario:
 *           type: number
 *           example: 5
 *         precioVenta:
 *           type: number
 *           example: 10
 *         stockAnterior:
 *           type: number
 *           example: 15
 *         stockNuevo:
 *           type: number
 *           example: 13
 *         observacion:
 *           type: string
 *           example: "Salida de inventario por venta"
 *         creadoPor:
 *           type: string
 *           example: "jimmy"
 *
 *     MovimientoInventarioUpdateInput:
 *       type: object
 *       properties:
 *         idSucursal:
 *           type: string
 *           example: "68d5d65430dcdf69852d1e3e"
 *         idProducto:
 *           type: string
 *           example: "69f6ad42e156a88e941e7ce9"
 *         idAlmacen:
 *           type: string
 *           example: "6a0195c0ce66a0fe45ce693d"
 *         idCaja:
 *           type: string
 *           nullable: true
 *         idPerfil:
 *           type: string
 *           nullable: true
 *         tipoMovimiento:
 *           type: string
 *           example: "ajuste_entrada"
 *         origenMovimiento:
 *           type: string
 *           example: "ajuste_manual"
 *         cantidad:
 *           type: number
 *           example: 5
 *         costoUnitario:
 *           type: number
 *           example: 5
 *         precioVenta:
 *           type: number
 *           example: 10
 *         stockAnterior:
 *           type: number
 *           example: 10
 *         stockNuevo:
 *           type: number
 *           example: 15
 *         observacion:
 *           type: string
 *           example: "Ajuste manual de inventario"
 *         actualizadoPor:
 *           type: string
 *           example: "admin"
 */

/**
 * @openapi
 * /api/movimiento-inventario:
 *   post:
 *     tags:
 *       - MovimientoInventario
 *     summary: Crear movimiento de inventario
 *     description: Registra un movimiento de inventario. Puede venir de una venta, egreso, solicitud, transferencia, ajuste manual, merma o devolución. Los IDs opcionales pueden enviarse como null si no corresponden.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovimientoInventarioInput'
 *           examples:
 *             salidaVenta:
 *               summary: Salida por venta
 *               value:
 *                 idSucursal: "68d5d65430dcdf69852d1e3e"
 *                 idProducto: "69f6ad42e156a88e941e7ce9"
 *                 idAlmacen: "6a0195c0ce66a0fe45ce693d"
 *                 idCaja: "69f722df21b3a4408d81a9c2"
 *                 idPerfil: "69f6927bd7691b4b764a116d"
 *                 idVenta: "6a16c987c04b4c2c32f437e1"
 *                 idDetalleVenta: "69f7d007fc469b41124f128e"
 *                 idEgreso: null
 *                 idDetalleEgreso: null
 *                 idSolicitud: null
 *                 idDetalleSolicitud: null
 *                 idTransferencia: null
 *                 tipoMovimiento: "salida_venta"
 *                 origenMovimiento: "venta"
 *                 cantidad: 2
 *                 costoUnitario: 5
 *                 precioVenta: 10
 *                 stockAnterior: 15
 *                 stockNuevo: 13
 *                 observacion: "Salida de inventario por venta"
 *                 creadoPor: "jimmy"
 *             entradaCompra:
 *               summary: Entrada por compra o egreso
 *               value:
 *                 idSucursal: "68d5d65430dcdf69852d1e3e"
 *                 idProducto: "69f6ad42e156a88e941e7ce9"
 *                 idAlmacen: "6a0195c0ce66a0fe45ce693d"
 *                 idCaja: "69f722df21b3a4408d81a9c2"
 *                 idPerfil: "69f6927bd7691b4b764a116d"
 *                 idVenta: null
 *                 idDetalleVenta: null
 *                 idEgreso: "69f7d681bebfe41cf7411c98"
 *                 idDetalleEgreso: "69f7df8b117bd91b12285c1f"
 *                 idSolicitud: null
 *                 idDetalleSolicitud: null
 *                 idTransferencia: null
 *                 tipoMovimiento: "entrada_compra"
 *                 origenMovimiento: "egreso"
 *                 cantidad: 10
 *                 costoUnitario: 4
 *                 precioVenta: 0
 *                 stockAnterior: 13
 *                 stockNuevo: 23
 *                 observacion: "Entrada de inventario por compra"
 *                 creadoPor: "admin"
 *             ajusteManual:
 *               summary: Ajuste manual positivo
 *               value:
 *                 idSucursal: "68d5d65430dcdf69852d1e3e"
 *                 idProducto: "69f6ad42e156a88e941e7ce9"
 *                 idAlmacen: "6a0195c0ce66a0fe45ce693d"
 *                 idCaja: null
 *                 idPerfil: "69f6927bd7691b4b764a116d"
 *                 idVenta: null
 *                 idDetalleVenta: null
 *                 idEgreso: null
 *                 idDetalleEgreso: null
 *                 idSolicitud: null
 *                 idDetalleSolicitud: null
 *                 idTransferencia: null
 *                 tipoMovimiento: "ajuste_entrada"
 *                 origenMovimiento: "ajuste_manual"
 *                 cantidad: 5
 *                 costoUnitario: 0
 *                 precioVenta: 0
 *                 stockAnterior: 23
 *                 stockNuevo: 28
 *                 observacion: "Ajuste manual por conteo físico"
 *                 creadoPor: "admin"
 *     responses:
 *       201:
 *         description: Movimiento creado correctamente
 *       500:
 *         description: Error al crear movimiento
 */
router.post(
    "/",
    MovimientoInventarioController.createMovimiento
);

/**
 * @openapi
 * /api/movimiento-inventario:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Obtener movimientos de inventario
 *     description: Lista movimientos con filtros opcionales por sucursal, almacén, producto, perfil, caja, tipo, origen y rango de fechas.
 *     parameters:
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *         required: false
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - in: query
 *         name: idAlmacen
 *         schema:
 *           type: string
 *         required: false
 *         example: "6a0195c0ce66a0fe45ce693d"
 *       - in: query
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: false
 *         example: "69f6ad42e156a88e941e7ce9"
 *       - in: query
 *         name: idPerfil
 *         schema:
 *           type: string
 *         required: false
 *         example: "69f6927bd7691b4b764a116d"
 *       - in: query
 *         name: idCaja
 *         schema:
 *           type: string
 *         required: false
 *         example: "69f722df21b3a4408d81a9c2"
 *       - in: query
 *         name: tipoMovimiento
 *         schema:
 *           type: string
 *         required: false
 *         example: "salida_venta"
 *       - in: query
 *         name: origenMovimiento
 *         schema:
 *           type: string
 *         required: false
 *         example: "venta"
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         example: "2026-05-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         example: "2026-05-31"
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *       500:
 *         description: Error al obtener movimientos
 */
router.get(
    "/",
    MovimientoInventarioController.getAllMovimientos
);

/**
 * @openapi
 * /api/movimiento-inventario/resumen:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Resumen de movimientos
 *     description: Devuelve resumen general de entradas, salidas, saldo, resumen por tipo de movimiento y por origen.
 *     parameters:
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - in: query
 *         name: idAlmacen
 *         schema:
 *           type: string
 *         example: "6a0195c0ce66a0fe45ce693d"
 *       - in: query
 *         name: idProducto
 *         schema:
 *           type: string
 *         example: "69f6ad42e156a88e941e7ce9"
 *       - in: query
 *         name: idPerfil
 *         schema:
 *           type: string
 *         example: "69f6927bd7691b4b764a116d"
 *       - in: query
 *         name: idCaja
 *         schema:
 *           type: string
 *         example: "69f722df21b3a4408d81a9c2"
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-31"
 *     responses:
 *       200:
 *         description: Resumen generado correctamente
 */
router.get(
    "/resumen",
    MovimientoInventarioController.getResumenMovimientos
);

/**
 * @openapi
 * /api/movimiento-inventario/top-productos:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Productos con más movimiento
 *     description: Devuelve ranking de productos con más entradas/salidas o movimientos.
 *     parameters:
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - in: query
 *         name: idAlmacen
 *         schema:
 *           type: string
 *         example: "6a0195c0ce66a0fe45ce693d"
 *       - in: query
 *         name: tipoMovimiento
 *         schema:
 *           type: string
 *         example: "salida_venta"
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-31"
 *     responses:
 *       200:
 *         description: Ranking de productos
 */
router.get(
    "/top-productos",
    MovimientoInventarioController.getTopProductosMovimiento
);

/**
 * @openapi
 * /api/movimiento-inventario/sucursal/{idSucursal}:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Movimientos por sucursal
 *     description: Devuelve movimientos de una sucursal específica y permite filtrar por fechas, tipo de movimiento y origen.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         schema:
 *           type: string
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-31"
 *       - in: query
 *         name: tipoMovimiento
 *         schema:
 *           type: string
 *         example: "salida_venta"
 *       - in: query
 *         name: origenMovimiento
 *         schema:
 *           type: string
 *         example: "venta"
 *     responses:
 *       200:
 *         description: Movimientos por sucursal
 */
router.get(
    "/sucursal/:idSucursal",
    MovimientoInventarioController.getMovimientosBySucursal
);

/**
 * @openapi
 * /api/movimiento-inventario/almacen/{idAlmacen}:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Movimientos por almacén
 *     parameters:
 *       - in: path
 *         name: idAlmacen
 *         required: true
 *         schema:
 *           type: string
 *         example: "6a0195c0ce66a0fe45ce693d"
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-31"
 *     responses:
 *       200:
 *         description: Movimientos por almacén
 */
router.get(
    "/almacen/:idAlmacen",
    MovimientoInventarioController.getMovimientosByAlmacen
);

/**
 * @openapi
 * /api/movimiento-inventario/producto/{idProducto}:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Movimientos por producto
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: string
 *         example: "69f6ad42e156a88e941e7ce9"
 *     responses:
 *       200:
 *         description: Movimientos por producto
 */
router.get(
    "/producto/:idProducto",
    MovimientoInventarioController.getMovimientosByProducto
);

/**
 * @openapi
 * /api/movimiento-inventario/kardex/{idProducto}:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Kardex por producto
 *     description: Devuelve el historial ordenado del producto con entradas, salidas, stock anterior y stock nuevo.
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: string
 *         example: "69f6ad42e156a88e941e7ce9"
 *       - in: query
 *         name: idSucursal
 *         schema:
 *           type: string
 *         example: "68d5d65430dcdf69852d1e3e"
 *       - in: query
 *         name: idAlmacen
 *         schema:
 *           type: string
 *         example: "6a0195c0ce66a0fe45ce693d"
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-01"
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-05-31"
 *     responses:
 *       200:
 *         description: Kardex generado correctamente
 */
router.get(
    "/kardex/:idProducto",
    MovimientoInventarioController.getKardexProducto
);

/**
 * @openapi
 * /api/movimiento-inventario/{id}:
 *   get:
 *     tags:
 *       - MovimientoInventario
 *     summary: Obtener movimiento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6a20b7f8c01a4b2d56a8d123"
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *       404:
 *         description: Movimiento no encontrado
 */
router.get(
    "/:id",
    MovimientoInventarioController.getMovimientoById
);

/**
 * @openapi
 * /api/movimiento-inventario/{id}:
 *   put:
 *     tags:
 *       - MovimientoInventario
 *     summary: Actualizar movimiento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6a20b7f8c01a4b2d56a8d123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovimientoInventarioUpdateInput'
 *     responses:
 *       200:
 *         description: Movimiento actualizado correctamente
 *       404:
 *         description: Movimiento no encontrado
 */
router.put(
    "/:id",
    MovimientoInventarioController.updateMovimiento
);

/**
 * @openapi
 * /api/movimiento-inventario/{id}:
 *   delete:
 *     tags:
 *       - MovimientoInventario
 *     summary: Eliminación lógica de movimiento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6a20b7f8c01a4b2d56a8d123"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eliminadoPor:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Movimiento eliminado correctamente
 *       404:
 *         description: Movimiento no encontrado
 */
router.delete(
    "/:id",
    MovimientoInventarioController.deleteMovimiento
);

export default router;