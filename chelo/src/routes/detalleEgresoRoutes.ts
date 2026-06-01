import { Router } from "express"
import { DetalleEgresoController } from "../controllers/DetalleEgresoController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     DetalleEgreso:
 *       type: object
 *       description: Detalle de un egreso (productos o gastos)
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idEgreso:
 *           type: string
 *           example: "64faaa111222"
 *         idProducto:
 *           type: string
 *           example: "64fbbb333444"
 *         idAlmacen:
 *           type: string
 *           example: "64fccc555666"
 *         descripcion:
 *           type: string
 *           example: "Compra de bebidas"
 *         cantidad:
 *           type: number
 *           example: 10
 *         costoUnitario:
 *           type: number
 *           example: 5
 *         subtotal:
 *           type: number
 *           example: 50
 *         tipoItem:
 *           type: string
 *           enum: [producto, gasto]
 *           example: "producto"
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
 *     DetalleEgresoInput:
 *       type: object
 *       required:
 *         - idEgreso
 *         - descripcion
 *         - cantidad
 *         - costoUnitario
 *         - tipoItem
 *       properties:
 *         idEgreso:
 *           type: string
 *         idProducto:
 *           type: string
 *         idAlmacen:
 *           type: string
 *         descripcion:
 *           type: string
 *         cantidad:
 *           type: number
 *         costoUnitario:
 *           type: number
 *         tipoItem:
 *           type: string
 *           enum: [producto, gasto]
 *         creadoPor:
 *           type: string
 *       
 */

/**
 * @openapi
 * /api/detalleegreso:
 *   post:
 *     tags:
 *       - DetalleEgreso
 *     summary: Crear detalle de egreso
 *     description: Agrega un item (producto o gasto) a un egreso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleEgresoInput'
 *     responses:
 *       200:
 *         description: Detalle creado correctamente
 *       500:
 *         description: Error al crear detalle
 */
router.post('/', DetalleEgresoController.createDetalle)

/**
 * @openapi
 * /api/detalleegreso:
 *   get:
 *     tags:
 *       - DetalleEgreso
 *     summary: Obtener todos los detalles de egreso
 *     responses:
 *       200:
 *         description: Lista de detalles
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', DetalleEgresoController.getAllDetalles)

/**
 * @openapi
 * /api/detalleegreso/{id}:
 *   get:
 *     tags:
 *       - DetalleEgreso
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
router.get('/:id', DetalleEgresoController.getDetalleById)

/**
 * @openapi
 * /api/detalleegreso/{id}:
 *   put:
 *     tags:
 *       - DetalleEgreso
 *     summary: Actualizar detalle de egreso
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
 *             $ref: '#/components/schemas/DetalleEgresoInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', DetalleEgresoController.updateDetalle)

/**
 * @openapi
 * /api/detalleegreso/{id}:
 *   delete:
 *     tags:
 *       - DetalleEgreso
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
router.delete('/:id', DetalleEgresoController.deleteDetalle)

export default router