import { Router } from "express"
import { CategoriaProductoController } from "../controllers/CategoriaProductoController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoriaProducto:
 *       type: object
 *       description: Modelo de categoría de producto con auditoría completa
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: "Bebidas"
 *         descripcion:
 *           type: string
 *           maxLength: 150
 *           example: "Categoría de bebidas gaseosas y jugos"
 *         estado:
 *           type: boolean
 *           example: true
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           example: "2026-05-02T22:00:00.000Z"
 *         creadoPor:
 *           type: number
 *           example: "admin"
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *           example: "2026-05-02T23:00:00.000Z"
 *         actualizadoPor:
 *           type: number
 *           example: "admin"
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T00:00:00.000Z"
 *         eliminadoPor:
 *           type: number
 *           example: "admin"
 *
 *     CategoriaProductoInput:
 *       type: object
 *       description: Datos de entrada para crear o actualizar categoría
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: "Bebidas"
 *         descripcion:
 *           type: string
 *           maxLength: 150
 *           example: "Categoría de bebidas"
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
 * /api/categoriaproducto:
 *   post:
 *     tags:
 *       - CategoriaProducto
 *     summary: Crear una nueva categoría de producto
 *     description: Registra una nueva categoría en el sistema con datos básicos y auditoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaProductoInput'
 *     responses:
 *       200:
 *         description: Categoría creada correctamente
 *       500:
 *         description: Error al crear categoría
 */
router.post('/', CategoriaProductoController.createCategoria)

/**
 * @openapi
 * /api/categoriaproducto:
 *   get:
 *     tags:
 *       - CategoriaProducto
 *     summary: Obtener todas las categorías
 *     description: Retorna una lista completa de categorías registradas
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoriaProducto'
 * 
 *       500:
 *         description: Error al obtener categorías
 */
router.get('/', CategoriaProductoController.getAllCategorias)

/**
 * @openapi
 * /api/categoriaproducto/{id}:
 *   get:
 *     tags:
 *       - CategoriaProducto
 *     summary: Obtener categoría por ID
 *     description: Devuelve una categoría específica según su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaProducto'
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno
 */
router.get('/:id', CategoriaProductoController.getCategoriaById)

/**
 * @openapi
 * /api/categoriaproducto/{id}:
 *   put:
 *     tags:
 *       - CategoriaProducto
 *     summary: Actualizar categoría
 *     description: Permite actualizar los datos de una categoría existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaProductoInput'
 *             
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', CategoriaProductoController.updateCategoria)

/**
 * @openapi
 * /api/categoriaproducto/{id}:
 *   delete:
 *     tags:
 *       - CategoriaProducto
 *     summary: Eliminar categoría (lógico)
 *     description: Realiza eliminación lógica de una categoría (estado=false)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría
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
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', CategoriaProductoController.deleteCategoria)

export default router