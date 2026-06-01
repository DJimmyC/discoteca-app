import { Router } from "express"
import { TransferenciaInventarioController } from "../controllers/TransferenciaInventarioController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     TransferenciaInventario:
 *       type: object
 *       description: Movimiento real de inventario entre almacenes
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idSolicitud:
 *           type: string
 *           example: "64faaa111222"
 *         idPerfil:
 *           type: string
 *           example: "64fbbb333444"
 *         idSucursal:
 *           type: string
 *           example: "64fccc555666"
 *         idAlmacenOrigen:
 *           type: string
 *           example: "64fddd777888"
 *         idAlmacenDestino:
 *           type: string
 *           example: "64feee999000"
 *         fechaTransferencia:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           enum: [pendiente, aprobada, enviada, recibida, anulada]
 *           example: "pendiente"
 *         observacion:
 *           type: string
 *           example: "Traslado de bebidas"
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
 *     TransferenciaInventarioInput:
 *       type: object
 *       required:
 *         - idPerfil
 *         - idSucursal
 *         - idAlmacenOrigen
 *         - idAlmacenDestino
 *       properties:
 *         idSolicitud:
 *           type: string
 *         idPerfil:
 *           type: string
 *         idSucursal:
 *           type: string
 *         idAlmacenOrigen:
 *           type: string
 *         idAlmacenDestino:
 *           type: string
 *         fechaTransferencia:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           enum: [pendiente, aprobada, enviada, recibida, anulada]
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
 * /api/transferenciainventario:
 *   post:
 *     tags:
 *       - TransferenciaInventario
 *     summary: Crear transferencia de inventario
 *     description: Registra un movimiento de inventario entre almacenes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferenciaInventarioInput'
 *     responses:
 *       200:
 *         description: Transferencia creada correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error al crear transferencia
 */
router.post('/', TransferenciaInventarioController.createTransferencia)

/**
 * @openapi
 * /api/transferenciainventario:
 *   get:
 *     tags:
 *       - TransferenciaInventario
 *     summary: Obtener todas las transferencias
 *     responses:
 *       200:
 *         description: Lista de transferencias
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', TransferenciaInventarioController.getAllTransferencias)

/**
 * @openapi
 * /api/transferenciainventario/{id}:
 *   get:
 *     tags:
 *       - TransferenciaInventario
 *     summary: Obtener transferencia por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transferencia encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', TransferenciaInventarioController.getTransferenciaById)

/**
 * @openapi
 * /api/transferenciainventario/{id}:
 *   put:
 *     tags:
 *       - TransferenciaInventario
 *     summary: Actualizar transferencia
 *     description: Permite modificar estado o datos de la transferencia
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
 *             $ref: '#/components/schemas/TransferenciaInventarioInput'
 *     responses:
 *       200:
 *         description: Actualizada correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', TransferenciaInventarioController.updateTransferencia)

/**
 * @openapi
 * /api/transferenciainventario/{id}:
 *   delete:
 *     tags:
 *       - TransferenciaInventario
 *     summary: Eliminar transferencia (lógico)
 *     description: Cambia el estado a "anulada"
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
 *         description: Transferencia anulada correctamente
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', TransferenciaInventarioController.deleteTransferencia)

export default router