// src/routes/DetalleVentaRoutes.ts

import {
  Router,
} from "express";

import {
  DetalleVentaController,
} from "../controllers/DetalleVentaController";

const router =
  Router();

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     DetalleVenta:
 *       type: object
 *       description: Producto registrado dentro de una venta y relacionado con su inventario y almacén de origen.
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *
 *         idVenta:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           description: Venta a la que pertenece el detalle.
 *           example: "64faaa111222"
 *
 *         idProducto:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           description: Producto vendido.
 *           example: "64fbbb333444"
 *
 *         idInventario:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           description: Registro exacto de inventario desde el que salió el producto.
 *           example: "64fccc555666"
 *
 *         idAlmacen:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           description: Almacén exacto desde el cual salió el producto.
 *           example: "64fddd777888"
 *
 *         cantidad:
 *           type: number
 *           minimum: 1
 *           example: 2
 *
 *         precioUnitario:
 *           type: number
 *           minimum: 0
 *           example: 10
 *
 *         costoUnitario:
 *           type: number
 *           minimum: 0
 *           description: Costo del producto registrado al momento de la venta.
 *           example: 6
 *
 *         subtotal:
 *           type: number
 *           minimum: 0
 *           description: Se calcula automáticamente como cantidad por precio unitario.
 *           example: 20
 *
 *         estado:
 *           type: string
 *           enum:
 *             - activo
 *             - eliminado
 *           example: "activo"
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
 *     DetalleVentaInput:
 *       type: object
 *       required:
 *         - idVenta
 *         - idProducto
 *         - idInventario
 *         - idAlmacen
 *         - cantidad
 *         - precioUnitario
 *       properties:
 *
 *         idVenta:
 *           type: string
 *           description: ID de la venta creada.
 *           example: "64faaa111222"
 *
 *         idProducto:
 *           type: string
 *           description: ID del producto vendido.
 *           example: "64fbbb333444"
 *
 *         idInventario:
 *           type: string
 *           description: ID del inventario exacto que se descontará.
 *           example: "64fccc555666"
 *
 *         idAlmacen:
 *           type: string
 *           description: ID del almacén exacto del producto.
 *           example: "64fddd777888"
 *
 *         cantidad:
 *           type: number
 *           minimum: 1
 *           example: 2
 *
 *         precioUnitario:
 *           type: number
 *           minimum: 0
 *           example: 10
 *
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *
 *     DetalleVentaUpdateInput:
 *       type: object
 *       description: Datos permitidos para actualizar un detalle. Si cambia la cantidad, el stock se ajustará por la diferencia.
 *       properties:
 *
 *         cantidad:
 *           type: number
 *           minimum: 1
 *           example: 3
 *
 *         precioUnitario:
 *           type: number
 *           minimum: 0
 *           example: 10
 *
 *         actualizadoPor:
 *           type: string
 *           example: "admin"
 *
 *     DetalleVentaResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Detalle de venta creado y stock actualizado"
 *         detalle:
 *           $ref: '#/components/schemas/DetalleVenta'
 */

/**
 * @openapi
 * /api/detalleventa:
 *   post:
 *     tags:
 *       - DetalleVenta
 *     summary: Crear detalle de venta
 *     description: >
 *       Registra un producto dentro de una venta, valida el inventario exacto,
 *       comprueba el stock disponible, descuenta la cantidad y calcula
 *       automáticamente el subtotal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVentaInput'
 *           example:
 *             idVenta: "64faaa111222"
 *             idProducto: "64fbbb333444"
 *             idInventario: "64fccc555666"
 *             idAlmacen: "64fddd777888"
 *             cantidad: 2
 *             precioUnitario: 10
 *             creadoPor: "admin"
 *     responses:
 *       201:
 *         description: Detalle creado y stock descontado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleVentaResponse'
 *
 *       400:
 *         description: Datos incorrectos, stock insuficiente o detalle duplicado
 *         content:
 *           application/json:
 *             example:
 *               error: "Stock insuficiente. Disponible: 1, solicitado: 2"
 *
 *       404:
 *         description: Venta, producto, inventario o almacén no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "El inventario no corresponde al producto y almacén seleccionados"
 *
 *       500:
 *         description: Error interno al crear el detalle
 */
router.post(
  "/",
  DetalleVentaController.createDetalle
);

/**
 * @openapi
 * /api/detalleventa:
 *   get:
 *     tags:
 *       - DetalleVenta
 *     summary: Obtener todos los detalles de venta
 *     description: >
 *       Retorna los detalles de venta con las relaciones pobladas de venta,
 *       producto, inventario y almacén.
 *     responses:
 *       200:
 *         description: Lista de detalles de venta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleVenta'
 *
 *       500:
 *         description: Error al obtener los detalles
 */
router.get(
  "/",
  DetalleVentaController.getAllDetalles
);

/**
 * @openapi
 * /api/detalleventa/{id}:
 *   get:
 *     tags:
 *       - DetalleVenta
 *     summary: Obtener detalle de venta por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del detalle de venta.
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     responses:
 *       200:
 *         description: Detalle de venta encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleVenta'
 *
 *       404:
 *         description: Detalle no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Detalle de venta no encontrado"
 *
 *       500:
 *         description: Error al obtener el detalle
 */
router.get(
  "/:id",
  DetalleVentaController.getDetalleById
);

/**
 * @openapi
 * /api/detalleventa/{id}:
 *   put:
 *     tags:
 *       - DetalleVenta
 *     summary: Actualizar detalle de venta
 *     description: >
 *       Modifica la cantidad o precio unitario. Si la cantidad aumenta,
 *       descuenta la diferencia del inventario. Si disminuye, devuelve
 *       la diferencia al inventario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del detalle de venta.
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVentaUpdateInput'
 *           example:
 *             cantidad: 3
 *             precioUnitario: 10
 *             actualizadoPor: "admin"
 *     responses:
 *       200:
 *         description: Detalle actualizado y stock ajustado
 *         content:
 *           application/json:
 *             example:
 *               message: "Detalle actualizado y stock ajustado"
 *
 *       400:
 *         description: Cantidad inválida, detalle eliminado o stock insuficiente
 *
 *       404:
 *         description: Detalle o inventario relacionado no encontrado
 *
 *       500:
 *         description: Error al actualizar el detalle
 */
router.put(
  "/:id",
  DetalleVentaController.updateDetalle
);

/**
 * @openapi
 * /api/detalleventa/{id}:
 *   delete:
 *     tags:
 *       - DetalleVenta
 *     summary: Eliminar detalle y restaurar stock
 *     description: >
 *       Realiza una eliminación lógica del detalle, cambia su estado a
 *       eliminado y devuelve al inventario la cantidad vendida.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del detalle de venta.
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
 *         description: Detalle eliminado y stock restaurado
 *         content:
 *           application/json:
 *             example:
 *               message: "Detalle eliminado y stock restaurado"
 *
 *       400:
 *         description: El detalle ya está eliminado
 *
 *       404:
 *         description: Detalle no encontrado
 *
 *       500:
 *         description: Error al eliminar el detalle
 */
router.delete(
  "/:id",
  DetalleVentaController.deleteDetalle
);

export default router;