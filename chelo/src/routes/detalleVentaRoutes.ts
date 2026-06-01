import { Router } from "express"
import { DetalleVentaController } from "../controllers/DetalleVentaController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     DetalleVenta:
 *       type: object
 *       description: Detalle de productos dentro de una venta
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idVenta:
 *           type: string
 *           example: "64faaa111222"
 *         idProducto:
 *           type: string
 *           example: "64fbbb333444"
 *         cantidad:
 *           type: number
 *           example: 2
 *         precioUnitario:
 *           type: number
 *           example: 10
 *         subtotal:
 *           type: number
 *           example: 20
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *         actualizadoPor:
 *           type: string
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *         eliminadoPor:
 *           type: string
 *
 *     DetalleVentaInput:
 *       type: object
 *       required:
 *         - idVenta
 *         - idProducto
 *         - cantidad
 *         - precioUnitario
 *       properties:
 *         idVenta:
 *           type: string
 *           example: "64faaa111222"
 *         idProducto:
 *           type: string
 *           example: "64fbbb333444"
 *         cantidad:
 *           type: number
 *           example: 2
 *         precioUnitario:
 *           type: number
 *           example: 10
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *  
 */

/**
 * @openapi
 * /api/detalleventa:
 *   post:
 *     tags:
 *       - DetalleVenta
 *     summary: Crear detalle de venta
 *     description: Agrega un producto a una venta (calcula subtotal automáticamente)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVentaInput'
 *     responses:
 *       200:
 *         description: Detalle creado correctamente
 *       500:
 *         description: Error al crear detalle
 */
router.post('/', DetalleVentaController.createDetalle)

/**
 * @openapi
 * /api/detalleventa:
 *   get:
 *     tags:
 *       - DetalleVenta
 *     summary: Obtener todos los detalles de venta
 *     responses:
 *       200:
 *         description: Lista de detalles
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', DetalleVentaController.getAllDetalles)

/**
 * @openapi
 * /api/detalleventa/{id}:
 *   get:
 *     tags:
 *       - DetalleVenta
 *     summary: Obtener detalle por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', DetalleVentaController.getDetalleById)

/**
 * @openapi
 * /api/detalleventa/{id}:
 *   put:
 *     tags:
 *       - DetalleVenta
 *     summary: Actualizar detalle de venta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVentaInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', DetalleVentaController.updateDetalle)

/**
 * @openapi
 * /api/detalleventa/{id}:
 *   delete:
 *     tags:
 *       - DetalleVenta
 *     summary: Eliminar detalle (lógico)
 *     description: Marca el detalle como eliminado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Eliminado correctamente
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', DetalleVentaController.deleteDetalle)

export default router