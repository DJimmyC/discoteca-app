import { Router } from "express"
import { AlmacenController } from "../controllers/AlmacenController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Almacen:
 *       type: object
 *       description: Almacenes donde se guardan productos
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idSucursal:
 *           type: string
 *           example: "64faaa111222"
 *         nombre:
 *           type: string
 *           example: "Almacén Principal"
 *         descripcion:
 *           type: string
 *           example: "Almacén general de productos"
 *         tipo:
 *           type: string
 *           enum: [principal, barra, deposito, auxiliar]
 *           example: "principal"
 *         estado:
 *           type: boolean
 *           example: true
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
 *     AlmacenInput:
 *       type: object
 *       required:
 *         - idSucursal
 *         - nombre
 *         - tipo
 *       properties:
 *         idSucursal:
 *           type: string
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [principal, barra, deposito, auxiliar]
 *         estado:
 *           type: boolean
 *         creadoPor:
 *           type: string
 *        
 */

/**
 * @openapi
 * /api/almacen:
 *   post:
 *     tags:
 *       - Almacen
 *     summary: Crear almacén
 *     description: Registra un nuevo almacén dentro de una sucursal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlmacenInput'
 *     responses:
 *       200:
 *         description: Almacén creado correctamente
 *       500:
 *         description: Error al crear almacén
 */
router.post('/', AlmacenController.createAlmacen)

/**
 * @openapi
 * /api/almacen:
 *   get:
 *     tags:
 *       - Almacen
 *     summary: Obtener todos los almacenes
 *     responses:
 *       200:
 *         description: Lista de almacenes
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', AlmacenController.getAllAlmacenes)

/**
 * @openapi
 * /api/almacen/sucursal/{idSucursal}:
 *   get:
 *     tags:
 *       - Almacen
 *     summary: Obtener almacenes por sucursal
 *     description: Retorna todos los almacenes activos asociados a una sucursal específica.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal a la que pertenecen los almacenes.
 *         schema:
 *           type: string
 *         example: "68d5d939f751fc10266aa31c"
 *     responses:
 *       200:
 *         description: Lista de almacenes activos de la sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Almacen'
 *       500:
 *         description: Error al obtener almacenes por sucursal
 */
router.get(
    "/sucursal/:idSucursal",
    AlmacenController.getAlmacenesBySucursal
);

/**
 * @openapi
 * /api/almacen/{id}:
 *   get:
 *     tags:
 *       - Almacen
 *     summary: Obtener almacén por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Almacén encontrado
 *       404:
 *         description: No encontrado
 */

router.get('/:id', AlmacenController.getAlmacenById)

/**
 * @openapi
 * /api/almacen/{id}:
 *   put:
 *     tags:
 *       - Almacen
 *     summary: Actualizar almacén
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
 *             $ref: '#/components/schemas/AlmacenInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', AlmacenController.updateAlmacen)

/**
 * @openapi
 * /api/almacen/{id}:
 *   delete:
 *     tags:
 *       - Almacen
 *     summary: Eliminar almacén (lógico)
 *     description: Cambia el estado a false
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
router.delete('/:id', AlmacenController.deleteAlmacen)

export default router