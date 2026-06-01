import { Router } from "express"
import { AperturaCajaController } from "../controllers/AperturaCajaController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     AperturaCaja:
 *       type: object
 *       description: Registro de apertura de caja
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idPerfil:
 *           type: string
 *           description: ID del usuario que abre la caja
 *           example: "64faaa111222"
 *         idCaja:
 *           type: string
 *           description: ID de la caja
 *           example: "64fbbb333444"
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T00:00:00.000Z"
 *         horaApertura:
 *           type: string
 *           example: "08:00"
 *         montoInicial:
 *           type: number
 *           example: 500
 *         observacion:
 *           type: string
 *           example: "Inicio de turno"
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
 *     AperturaCajaInput:
 *       type: object
 *       required:
 *         - idPerfil
 *         - idCaja
 *         - horaApertura
 *         - montoInicial
 *       properties:
 *         idPerfil:
 *           type: string
 *           example: "64faaa111222"
 *         idCaja:
 *           type: string
 *           example: "64fbbb333444"
 *         fecha:
 *           type: string
 *           format: date-time
 *         horaApertura:
 *           type: string
 *           example: "08:00"
 *         montoInicial:
 *           type: number
 *           example: 500
 *         observacion:
 *           type: string
 *           example: "Inicio de turno"
 *         estado:
 *           type: boolean
 *         creadoPor:
 *           type: string
 *         
 */

/**
 * @openapi
 * /api/aperturacaja:
 *   post:
 *     tags:
 *       - AperturaCaja
 *     summary: Abrir caja
 *     description: Registra la apertura de una caja con monto inicial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AperturaCajaInput'
 *     responses:
 *       200:
 *         description: Caja abierta correctamente
 *       400:
 *         description: La caja ya fue abierta
 *       500:
 *         description: Error interno
 */
router.post('/', AperturaCajaController.createApertura)

/**
 * @openapi
 * /api/aperturacaja:
 *   get:
 *     tags:
 *       - AperturaCaja
 *     summary: Obtener todas las aperturas
 *     description: Lista todas las aperturas de caja
 *     responses:
 *       200:
 *         description: Lista de aperturas
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', AperturaCajaController.getAllAperturas)

/**
 * @openapi
 * /api/aperturacaja/{id}:
 *   get:
 *     tags:
 *       - AperturaCaja
 *     summary: Obtener apertura por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Apertura encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', AperturaCajaController.getAperturaById)

/**
 * @openapi
 * /api/aperturacaja/{id}:
 *   put:
 *     tags:
 *       - AperturaCaja
 *     summary: Actualizar apertura
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
 *             $ref: '#/components/schemas/AperturaCajaInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', AperturaCajaController.updateApertura)

/**
 * @openapi
 * /api/aperturacaja/{id}:
 *   delete:
 *     tags:
 *       - AperturaCaja
 *     summary: Eliminar apertura (lógico)
 *     description: Marca la apertura como inactiva
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
router.delete('/:id', AperturaCajaController.deleteApertura)

/**
 * @openapi
 * /api/aperturacaja/caja/{cajaId}:
 *   get:
 *     tags:
 *       - AperturaCaja
 *     summary: Obtener aperturas por caja
 *     description: Lista todas las aperturas de una caja específica
 *     parameters:
 *       - in: path
 *         name: cajaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de aperturas
 *       500:
 *         description: Error interno
 */
router.get(  '/caja/:cajaId',  AperturaCajaController.getAperturasByCajaId

)

export default router