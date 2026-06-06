// src/routes/VentaRoutes.ts

import {
  Router,
} from "express";

import {
  VentaController,
} from "../controllers/VentaController";

const router =
  Router();

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     Venta:
 *       type: object
 *       description: Cabecera de una venta registrada desde una comanda.
 *       properties:
 *
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *
 *         idComanda:
 *           oneOf:
 *             - type: string
 *             - type: object
 *             - type: "null"
 *           example: "64faaa111222"
 *
 *         idCaja:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           example: "64fbbb333444"
 *
 *         idPerfil:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           example: "64fccc555666"
 *
 *         idSucursal:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           example: "64fddd777888"
 *
 *         numeroVenta:
 *           type: string
 *           example: "V-001"
 *
 *         fechaVenta:
 *           type: string
 *           format: date-time
 *           example: "2026-06-05T20:30:00.000Z"
 *
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 100
 *
 *         descuento:
 *           type: number
 *           minimum: 0
 *           example: 10
 *
 *         total:
 *           type: number
 *           minimum: 0
 *           description: Se calcula automáticamente como subtotal menos descuento.
 *           example: 90
 *
 *         metodoPago:
 *           type: string
 *           enum:
 *             - efectivo
 *             - qr
 *             - transferencia
 *             - mixto
 *           example: "efectivo"
 *
 *         estado:
 *           type: string
 *           enum:
 *             - pagado
 *             - anulado
 *             - cortesia
 *           example: "pagado"
 *
 *         observacion:
 *           type: string
 *           example: "Venta registrada desde comanda"
 *
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *
 *         actualizadoPor:
 *           type: string
 *           example: "admin"
 *
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *
 *         eliminadoPor:
 *           type: string
 *           example: "admin"
 *
 *     VentaInput:
 *       type: object
 *       required:
 *         - idCaja
 *         - idPerfil
 *         - idSucursal
 *         - subtotal
 *         - metodoPago
 *       properties:
 *
 *         idComanda:
 *           type: string
 *           description: ID de la comanda que originó la venta.
 *           example: "64faaa111222"
 *
 *         idCaja:
 *           type: string
 *           example: "64fbbb333444"
 *
 *         idPerfil:
 *           type: string
 *           example: "64fccc555666"
 *
 *         idSucursal:
 *           type: string
 *           example: "64fddd777888"
 *
 *         numeroVenta:
 *           type: string
 *           example: "V-001"
 *
 *         fechaVenta:
 *           type: string
 *           format: date-time
 *
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           example: 100
 *
 *         descuento:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 10
 *
 *         metodoPago:
 *           type: string
 *           enum:
 *             - efectivo
 *             - qr
 *             - transferencia
 *             - mixto
 *           example: "efectivo"
 *
 *         estado:
 *           type: string
 *           enum:
 *             - pagado
 *             - anulado
 *             - cortesia
 *           default: "pagado"
 *
 *         observacion:
 *           type: string
 *           example: "Venta registrada desde comanda"
 *
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *
 *     VentaUpdateInput:
 *       type: object
 *       properties:
 *
 *         idCaja:
 *           type: string
 *
 *         idPerfil:
 *           type: string
 *
 *         idSucursal:
 *           type: string
 *
 *         numeroVenta:
 *           type: string
 *
 *         fechaVenta:
 *           type: string
 *           format: date-time
 *
 *         subtotal:
 *           type: number
 *           minimum: 0
 *
 *         descuento:
 *           type: number
 *           minimum: 0
 *
 *         metodoPago:
 *           type: string
 *           enum:
 *             - efectivo
 *             - qr
 *             - transferencia
 *             - mixto
 *
 *         estado:
 *           type: string
 *           enum:
 *             - pagado
 *             - cortesia
 *
 *         observacion:
 *           type: string
 *
 *         actualizadoPor:
 *           type: string
 *
 *     VentaResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Venta registrada"
 *         venta:
 *           $ref: '#/components/schemas/Venta'
 */

/**
 * @openapi
 * /api/venta:
 *   post:
 *     tags:
 *       - Venta
 *     summary: Crear venta
 *     description: >
 *       Registra la cabecera de una venta. El total se calcula automáticamente
 *       como subtotal menos descuento. Una comanda no puede convertirse en
 *       venta más de una vez.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VentaInput'
 *           example:
 *             idComanda: "64faaa111222"
 *             idCaja: "64fbbb333444"
 *             idPerfil: "64fccc555666"
 *             idSucursal: "64fddd777888"
 *             subtotal: 100
 *             descuento: 10
 *             metodoPago: "efectivo"
 *             estado: "pagado"
 *             observacion: "Venta registrada desde comanda"
 *             creadoPor: "admin"
 *     responses:
 *       201:
 *         description: Venta registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VentaResponse'
 *
 *       400:
 *         description: Datos inválidos o la comanda ya fue convertida en venta
 *         content:
 *           application/json:
 *             example:
 *               error: "Esta comanda ya fue convertida en venta"
 *
 *       500:
 *         description: Error interno al crear la venta
 */
router.post(
  "/",
  VentaController.createVenta
);

/**
 * @openapi
 * /api/venta:
 *   get:
 *     tags:
 *       - Venta
 *     summary: Obtener todas las ventas
 *     description: Retorna todas las ventas con comanda, caja, perfil y sucursal poblados.
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 *
 *       500:
 *         description: Error al obtener las ventas
 */
router.get(
  "/",
  VentaController.getAllVentas
);

/**
 * @openapi
 * /api/venta/perfil/{idPerfil}/detalles:
 *   get:
 *     tags:
 *       - Venta
 *     summary: Obtener ventas con detalles por perfil
 *     description: >
 *       Retorna las ventas realizadas por un perfil junto con los datos
 *       de la comanda, caja, sucursal, productos, inventarios, almacenes,
 *       cantidades, costos, precios y subtotales.
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         description: ID del perfil o mesero.
 *         schema:
 *           type: string
 *         example: "69f6927bd7691b4b764a116d"
 *     responses:
 *       200:
 *         description: Ventas del perfil con todos sus detalles
 *         content:
 *           application/json:
 *             example:
 *               perfil:
 *                 _id: "69f6927bd7691b4b764a116d"
 *                 nombres: "Juan"
 *                 apellidos: "Pérez"
 *               sucursal:
 *                 _id: "64fddd777888"
 *                 nombreSucursal: "Sucursal Centro"
 *               ventas: []
 *
 *       500:
 *         description: Error al obtener ventas con detalles por perfil
 */
router.get(
  "/perfil/:idPerfil/detalles",
  VentaController.getVentasConDetallesPorPerfil
);

/**
 * @openapi
 * /api/venta/{id}/cortesia:
 *   patch:
 *     tags:
 *       - Venta
 *     summary: Marcar venta como cortesía
 *     description: >
 *       Cambia el estado de la venta a cortesia. El inventario no se restaura
 *       porque el producto sí fue entregado, pero la venta no debe considerarse
 *       como ingreso en los reportes financieros.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualizadoPor:
 *                 type: string
 *                 example: "admin"
 *               observacion:
 *                 type: string
 *                 example: "Cortesía autorizada por gerencia"
 *     responses:
 *       200:
 *         description: Venta marcada como cortesía
 *         content:
 *           application/json:
 *             example:
 *               message: "Venta marcada como cortesía"
 *
 *       400:
 *         description: La venta está anulada o ya es cortesía
 *
 *       404:
 *         description: Venta no encontrada
 *
 *       500:
 *         description: Error al marcar la venta como cortesía
 */
router.patch(
  "/:id/cortesia",
  VentaController.cortesiaVenta
);

/**
 * @openapi
 * /api/venta/{id}:
 *   get:
 *     tags:
 *       - Venta
 *     summary: Obtener venta por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *
 *       404:
 *         description: Venta no encontrada
 *
 *       500:
 *         description: Error al obtener la venta
 */
router.get(
  "/:id",
  VentaController.getVentaById
);

/**
 * @openapi
 * /api/venta/{id}:
 *   put:
 *     tags:
 *       - Venta
 *     summary: Actualizar venta
 *     description: >
 *       Actualiza los datos de la cabecera de la venta. El total se vuelve
 *       a calcular automáticamente según el subtotal y descuento.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VentaUpdateInput'
 *           example:
 *             descuento: 10
 *             metodoPago: "qr"
 *             observacion: "Pago mediante QR"
 *             actualizadoPor: "admin"
 *     responses:
 *       200:
 *         description: Venta actualizada correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Venta actualizada"
 *
 *       400:
 *         description: La venta está anulada o los datos son inválidos
 *
 *       404:
 *         description: Venta no encontrada
 *
 *       500:
 *         description: Error al actualizar la venta
 */
router.put(
  "/:id",
  VentaController.updateVenta
);

/**
 * @openapi
 * /api/venta/{id}:
 *   delete:
 *     tags:
 *       - Venta
 *     summary: Anular venta y restaurar inventario
 *     description: >
 *       Cambia el estado de la venta a anulado, marca sus detalles como
 *       eliminados y devuelve al inventario las cantidades correspondientes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *         example: "64f123abc456"
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
 *         description: Venta anulada y stock restaurado
 *         content:
 *           application/json:
 *             example:
 *               message: "Venta anulada y stock restaurado"
 *
 *       400:
 *         description: La venta ya está anulada
 *
 *       404:
 *         description: Venta no encontrada
 *
 *       500:
 *         description: Error al anular la venta
 */
router.delete(
  "/:id",
  VentaController.deleteVenta
);

export default router;