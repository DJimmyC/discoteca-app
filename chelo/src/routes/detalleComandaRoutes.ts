import { Router } from "express"
import { DetalleComandaController } from "../controllers/DetalleComandaControler"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     DetalleComanda:
 *       type: object
 *       description: Detalle de productos dentro de una comanda
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idComanda:
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
 *         estado:
 *           type: string
 *           enum: [activo, eliminado]
 *           example: "activo"
 *         observacion:
 *           type: string
 *           example: "Sin hielo"
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *         creadoPor:
 *           type: string
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
 *     DetalleComandaInput:
 *       type: object
 *       required:
 *         - idComanda
 *         - idProducto
 *         - cantidad
 *         - precioUnitario
 *       properties:
 *         idComanda:
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
 *         estado:
 *           type: string
 *           enum: [activo, eliminado]
 *           example: "activo"
 *         observacion:
 *           type: string
 *           example: "Sin hielo"
 *         creadoPor:
 *           type: string
 * 
 */

/**
 * @openapi
 * /api/detallecomanda:
 *   post:
 *     tags:
 *       - DetalleComanda
 *     summary: Crear detalle de comanda
 *     description: Agrega un producto a una comanda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleComandaInput'
 *     responses:
 *       200:
 *         description: Detalle creado correctamente
 *       500:
 *         description: Error al crear detalle
 */
router.post('/', DetalleComandaController.createDetalle)

/**
 * @openapi
 * /api/detallecomanda:
 *   get:
 *     tags:
 *       - DetalleComanda
 *     summary: Obtener todos los detalles
 *     description: Lista todos los productos de todas las comandas
 *     responses:
 *       200:
 *         description: Lista de detalles
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', DetalleComandaController.getAllDetalles)

/**
 * @openapi
 * /api/detallecomanda/{id}:
 *   get:
 *     tags:
 *       - DetalleComanda
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
router.get('/:id', DetalleComandaController.getDetalleById)

/**
 * @openapi
 * /api/detallecomanda/{id}:
 *   put:
 *     tags:
 *       - DetalleComanda
 *     summary: Actualizar detalle
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
 *             $ref: '#/components/schemas/DetalleComandaInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', DetalleComandaController.updateDetalle)

/**
 * @openapi
 * /api/detallecomanda/{id}:
 *   delete:
 *     tags:
 *       - DetalleComanda
 *     summary: Eliminar detalle (lógico)
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
router.delete('/:id', DetalleComandaController.deleteDetalle)

export default router