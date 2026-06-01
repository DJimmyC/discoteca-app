import { Router } from "express"
import { ConversionProductoController } from "../controllers/ConversionProductoController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     ConversionProducto:
 *       type: object
 *       description: Modelo de conversión de unidades de un producto
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idProducto:
 *           type: string
 *           description: ID del producto (ObjectId)
 *           example: "64f123abc456"
 *         unidadOrigen:
 *           type: string
 *           maxLength: 20
 *           example: "botella"
 *         cantidadOrigen:
 *           type: number
 *           example: 1
 *         unidadDestino:
 *           type: string
 *           maxLength: 20
 *           example: "onza"
 *         cantidadDestino:
 *           type: number
 *           example: 25
 *         estado:
 *           type: boolean
 *           example: true
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           example: "2026-05-02T22:00:00.000Z"
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *           example: "2026-05-02T23:00:00.000Z"
 *         actualizadoPor:
 *           type: string
 *           example: "admin"
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T00:00:00.000Z"
 *         eliminadoPor:
 *           type: string
 *           example: "admin"
 *
 *     ConversionProductoInput:
 *       type: object
 *       description: Datos para crear o actualizar una conversión de producto
 *       required:
 *         - idProducto
 *         - unidadOrigen
 *         - cantidadOrigen
 *         - unidadDestino
 *         - cantidadDestino
 *       properties:
 *         idProducto:
 *           type: string
 *           example: "64f123abc456"
 *         unidadOrigen:
 *           type: string
 *           example: "botella"
 *         cantidadOrigen:
 *           type: number
 *           example: 1
 *         unidadDestino:
 *           type: string
 *           example: "onza"
 *         cantidadDestino:
 *           type: number
 *           example: 25
 *         estado:
 *           type: boolean
 *           example: true
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *      
 */

/**
 * @openapi
 * /api/conversionproducto:
 *   post:
 *     tags:
 *       - ConversionProducto
 *     summary: Crear una conversión de producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConversionProductoInput'
 *     responses:
 *       200:
 *         description: Conversión creada correctamente
 *      
 */
router.post('/', ConversionProductoController.createConversion)

/**
 * @openapi
 * /api/conversionproducto:
 *   get:
 *     tags:
 *       - ConversionProducto
 *     summary: Obtener todas las conversiones
 *     description: Retorna todas las conversiones con datos del producto (populate)
 *     responses:
 *       200:
 *         description: Lista de conversiones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConversionProducto'
 *       500:
 *         description: Error al obtener conversiones
 */
router.get('/', ConversionProductoController.getAllConversiones)

/**
 * @openapi
 * /api/conversionproducto/{id}:
 *   get:
 *     tags:
 *       - ConversionProducto
 *     summary: Obtener conversión por ID
 *     description: Devuelve una conversión específica junto con el producto relacionado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la conversión
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversión encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversionProducto'
 *       404:
 *         description: Conversión no encontrada
 *       500:
 *         description: Error interno
 */
router.get('/:id', ConversionProductoController.getConversionById)

/**
 * @openapi
 * /api/conversionproducto/{id}:
 *   put:
 *     tags:
 *       - ConversionProducto
 *     summary: Actualizar conversión
 *     description: Permite modificar los datos de una conversión existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la conversión
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConversionProductoInput'
 *     responses:
 *       200:
 *         description: Conversión actualizada correctamente
 *       404:
 *         description: Conversión no encontrada
 *       500:
 *         description: Error al actualizar conversión
 */
router.put('/:id', ConversionProductoController.updateConversion)

/**
 * @openapi
 * /api/conversionproducto/{id}:
 *   delete:
 *     tags:
 *       - ConversionProducto
 *     summary: Eliminar conversión (lógico)
 *     description: Realiza eliminación lógica de la conversión (estado = false)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la conversión
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
 *         description: Conversión eliminada correctamente
 *       404:
 *         description: Conversión no encontrada
 *       500:
 *         description: Error al eliminar conversión
 */
router.delete('/:id', ConversionProductoController.deleteConversion)

export default router