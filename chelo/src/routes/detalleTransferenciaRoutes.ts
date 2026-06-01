import { Router } from "express"
import { DetalleTransferenciaController } from "../controllers/DetalleTransferenciaController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     DetalleTransferencia:
 *       type: object
 *       description: Detalle de productos dentro de una transferencia de inventario
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idProducto:
 *           type: string
 *           example: "64faaa111222"
 *         idTransferencia:
 *           type: string
 *           example: "64fbbb333444"
 *         cantidadEnviada:
 *           type: number
 *           example: 100
 *         cantidadRecibida:
 *           type: number
 *           example: 95
 *         observacion:
 *           type: string
 *           example: "5 unidades dañadas en traslado"
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
 *     DetalleTransferenciaInput:
 *       type: object
 *       required:
 *         - idProducto
 *         - idTransferencia
 *         - cantidadEnviada
 *       properties:
 *         idProducto:
 *           type: string
 *         idTransferencia:
 *           type: string
 *         cantidadEnviada:
 *           type: number
 *         cantidadRecibida:
 *           type: number
 *         observacion:
 *           type: string
 *         creadoPor:
 *           type: string
 *         actualizadoPor:
 *           type: string
 *         eliminadoPor:
 *           type: string
 */

/**
 * @openapi
 * /api/detalletransferencia:
 *   post:
 *     tags:
 *       - DetalleTransferencia
 *     summary: Crear detalle de transferencia
 *     description: Agrega productos a una transferencia de inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleTransferenciaInput'
 *     responses:
 *       200:
 *         description: Detalle creado correctamente
 *       500:
 *         description: Error al crear detalle
 */
router.post('/', DetalleTransferenciaController.createDetalle)

/**
 * @openapi
 * /api/detalletransferencia:
 *   get:
 *     tags:
 *       - DetalleTransferencia
 *     summary: Obtener todos los detalles de transferencia
 *     responses:
 *       200:
 *         description: Lista de detalles
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', DetalleTransferenciaController.getAllDetalles)

/**
 * @openapi
 * /api/detalletransferencia/{id}:
 *   get:
 *     tags:
 *       - DetalleTransferencia
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
router.get('/:id', DetalleTransferenciaController.getDetalleById)

/**
 * @openapi
 * /api/detalletransferencia/{id}:
 *   put:
 *     tags:
 *       - DetalleTransferencia
 *     summary: Actualizar detalle de transferencia
 *     description: Permite modificar cantidades u observaciones
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
 *             $ref: '#/components/schemas/DetalleTransferenciaInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', DetalleTransferenciaController.updateDetalle)

/**
 * @openapi
 * /api/detalletransferencia/{id}:
 *   delete:
 *     tags:
 *       - DetalleTransferencia
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
router.delete('/:id', DetalleTransferenciaController.deleteDetalle)

export default router