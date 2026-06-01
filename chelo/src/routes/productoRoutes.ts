import { Router } from "express"
import { ProductoController } from "../controllers/ProductoController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       description: Modelo de producto con relación a categoría y auditoría completa
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idCategoria:
 *           type: string
 *           description: ID de la categoría (ObjectId)
 *           example: "64f123abc456"
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: "Coca Cola"
 *         descripcion:
 *           type: string
 *           maxLength: 200
 *           example: "Bebida gaseosa de 500ml"
 *         marca:
 *           type: string
 *           maxLength: 100
 *           example: "Coca Cola Company"
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
 *     ProductoInput:
 *       type: object
 *       description: Datos necesarios para crear o actualizar un producto
 *       required:
 *         - idCategoria
 *         - nombre
 *       properties:
 *         idCategoria:
 *           type: string
 *           example: "64f123abc456"
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: "Coca Cola"
 *         descripcion:
 *           type: string
 *           maxLength: 200
 *           example: "Bebida gaseosa"
 *         marca:
 *           type: string
 *           maxLength: 100
 *           example: "Coca Cola Company"
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
 * /api/producto:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Crear un nuevo producto
 *     description: Registra un producto nuevo asociado a una categoría existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       200:
 *         description: Producto creado correctamente
 *       500:
 *         description: Error al crear producto
 */
router.post('/', ProductoController.createProducto)

/**
 * @openapi
 * /api/producto:
 *   get:
 *     tags:
 *       - Producto
 *     summary: Obtener todos los productos
 *     description: Retorna la lista completa de productos con su categoría (populate)
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error al obtener productos
 */
router.get('/', ProductoController.getAllProductos)

/**
 * @openapi
 * /api/producto/{id}:
 *   get:
 *     tags:
 *       - Producto
 *     summary: Obtener producto por ID
 *     description: Devuelve un producto específico con su categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno
 */
router.get('/:id', ProductoController.getProductoById)

/**
 * @openapi
 * /api/producto/{id}:
 *   put:
 *     tags:
 *       - Producto
 *     summary: Actualizar producto
 *     description: Permite modificar los datos de un producto existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar producto
 */
router.put('/:id', ProductoController.updateProducto)

/**
 * @openapi
 * /api/producto/{id}:
 *   delete:
 *     tags:
 *       - Producto
 *     summary: Eliminar producto (lógico)
 *     description: Realiza eliminación lógica del producto (estado = false) sin borrarlo físicamente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
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
 * 
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar producto
 */
router.delete('/:id', ProductoController.deleteProducto)

export default router