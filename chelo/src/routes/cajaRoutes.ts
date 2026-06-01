import { Router } from "express"
import { CajaController } from "../controllers/CajaController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Caja:
 *       type: object
 *       description: Caja asociada a una sucursal
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idSucursal:
 *           type: string
 *           description: ID de la sucursal (ObjectId)
 *           example: "64faaa111222"
 *         nombre:
 *           type: string
 *           maxLength: 100
 *           example: "Caja Principal"
 *         descripcion:
 *           type: string
 *           maxLength: 150
 *           example: "Caja de atención principal"
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
 *           example: "admin"
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *         eliminadoPor:
 *           type: string
 *           example: "admin"
 *
 *     CajaInput:
 *       type: object
 *       required:
 *         - idSucursal
 *         - nombre
 *       properties:
 *         idSucursal:
 *           type: string
 *           example: "64faaa111222"
 *         nombre:
 *           type: string
 *           example: "Caja Principal"
 *         descripcion:
 *           type: string
 *           example: "Caja de atención"
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
 * /api/caja:
 *   post:
 *     tags:
 *       - Caja
 *     summary: Crear caja
 *     description: Registra una nueva caja en una sucursal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CajaInput'
 *     responses:
 *       200:
 *         description: Caja creada correctamente
 *       500:
 *         description: Error al crear caja
 */
router.post('/', CajaController.createCaja)

/**
 * @openapi
 * /api/caja:
 *   get:
 *     tags:
 *       - Caja
 *     summary: Obtener todas las cajas
 *     description: Lista todas las cajas con su sucursal (populate)
 *     responses:
 *       200:
 *         description: Lista de cajas
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', CajaController.getAllCajas)



/**
 * @openapi
 * /api/caja/sucursal/{idSucursal}:
 *   get:
 *     tags:
 *       - Caja
 *     summary: Obtener cajas por sucursal
 *     description: Retorna todas las cajas activas asociadas a una sucursal específica. Se utiliza para seleccionar la caja que recibirá el pago al momento de registrar una venta.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal a la que pertenecen las cajas.
 *         schema:
 *           type: string
 *         example: "68d5d65430dcdf69852d1e3e"
 *     responses:
 *       200:
 *         description: Lista de cajas activas de la sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caja'
 *       500:
 *         description: Error al obtener cajas por sucursal
 */
router.get(
  "/sucursal/:idSucursal",
  CajaController.getCajasBySucursal
);

/**
 * @openapi
 * /api/caja/{id}:
 *   get:
 *     tags:
 *       - Caja
 *     summary: Obtener caja por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Caja encontrada
 *       404:
 *         description: Caja no encontrada
 */
router.get('/:id', CajaController.getCajaById)

/**
 * @openapi
 * /api/caja/{id}:
 *   put:
 *     tags:
 *       - Caja
 *     summary: Actualizar caja
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
 *             $ref: '#/components/schemas/CajaInput'
 *     responses:
 *       200:
 *         description: Caja actualizada correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', CajaController.updateCaja)

/**
 * @openapi
 * /api/caja/{id}:
 *   delete:
 *     tags:
 *       - Caja
 *     summary: Eliminar caja (lógico)
 *     description: Cambia el estado de la caja a inactivo
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
 *         description: Caja eliminada correctamente
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', CajaController.deleteCaja)

export default router