import { Router } from "express"
import { ComandaController } from "../controllers/ComandaController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Comanda:
 *       type: object
 *       description: Modelo de comanda (orden) asociada a un usuario y sucursal
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idPerfil:
 *           type: string
 *           description: ID del perfil de usuario (ObjectId)
 *           example: "64f123abc456"
 *         idSucursal:
 *           type: string
 *           description: ID de la sucursal (ObjectId)
 *           example: "64f999xyz123"
 *         numeroComanda:
 *           type: string
 *           maxLength: 20
 *           example: "CMD-001"
 *         estado:
 *           type: string
 *           enum: [en_proceso, impreso, anulado, cerrado]
 *           example: "en_proceso"
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T10:00:00.000Z"
 *         fechaCierre:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T11:00:00.000Z"
 *         observacion:
 *           type: string
 *           maxLength: 200
 *           example: "Mesa 5"
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
 *     ComandaInput:
 *       type: object
 *       description: Datos para crear o actualizar una comanda
 *       required:
 *         - idPerfil
 *         - idSucursal
 *       properties:
 *         idPerfil:
 *           type: string
 *           example: "64f123abc456"
 *         idSucursal:
 *           type: string
 *           example: "64f999xyz123"
 *         numeroComanda:
 *           type: string
 *           example: "CMD-001"
 *         estado:
 *           type: string
 *           enum: [en_proceso, impreso, anulado, cerrado]
 *           example: "en_proceso"
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *         fechaCierre:
 *           type: string
 *           format: date-time
 *         observacion:
 *           type: string
 *           example: "Mesa 5"
 *         creadoPor:
 *           type: string
 *         actualizadoPor:
 *           type: string
 *         eliminadoPor:
 *           type: string
 */

/**
 * @openapi
 * /api/comanda:
 *   post:
 *     tags:
 *       - Comanda
 *     summary: Crear una nueva comanda
 *     description: Registra una nueva comanda en estado inicial "en_proceso"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComandaInput'
 *     responses:
 *       200:
 *         description: Comanda creada correctamente
 *       500:
 *         description: Error al crear comanda
 */
router.post('/', ComandaController.createComanda)

/**
 * @openapi
 * /api/comanda:
 *   get:
 *     tags:
 *       - Comanda
 *     summary: Obtener todas las comandas
 *     description: Retorna la lista de comandas con datos de perfil y sucursal (populate)
 *     responses:
 *       200:
 *         description: Lista de comandas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comanda'
 *       500:
 *         description: Error al obtener comandas
 */
router.get('/', ComandaController.getAllComandas)

/**
 * @openapi
 * /api/comanda/perfil/{idPerfil}/detalles:
 *   get:
 *     tags:
 *       - Comanda
 *     summary: Obtener comandas por perfil con sus detalles
 *     description: Retorna todas las comandas de un perfil junto con sus productos, subtotales y total de comanda.
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del perfil de usuario
 *     responses:
 *       200:
 *         description: Lista de comandas con detalles
 *       500:
 *         description: Error al obtener comandas con detalles
 */
router.get(
    "/perfil/:idPerfil/detalles",
    ComandaController.getComandasConDetallesPorPerfil
);

/**
 * @openapi
 * /api/comanda/{id}:
 *   get:
 *     tags:
 *       - Comanda
 *     summary: Obtener comanda por ID
 *     description: Devuelve una comanda específica con sus relaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la comanda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comanda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 *       404:
 *         description: Comanda no encontrada
 *       500:
 *         description: Error interno
 */
router.get('/:id', ComandaController.getComandaById)

/**
 * @openapi
 * /api/comanda/{id}:
 *   put:
 *     tags:
 *       - Comanda
 *     summary: Actualizar comanda
 *     description: Permite modificar datos de una comanda existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la comanda
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComandaInput'
 *     responses:
 *       200:
 *         description: Comanda actualizada correctamente
 *       404:
 *         description: Comanda no encontrada
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', ComandaController.updateComanda)

/**
 * @openapi
 * /api/comanda/{id}:
 *   delete:
 *     tags:
 *       - Comanda
 *     summary: Anular comanda (eliminación lógica)
 *     description: Cambia el estado de la comanda a "anulado"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la comanda
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
 *         description: Comanda anulada correctamente
 *       404:
 *         description: Comanda no encontrada
 *       500:
 *         description: Error al anular comanda
 */
router.delete('/:id', ComandaController.deleteComanda)

export default router