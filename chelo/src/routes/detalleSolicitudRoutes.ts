import { Router } from "express"
import { DetalleSolicitudController } from "../controllers/DetalleSolicitudController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     DetalleSolicitud:
 *       type: object
 *       description: Detalle de productos dentro de una solicitud
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idSolicitud:
 *           type: string
 *           example: "64faaa111222"
 *         idProducto:
 *           type: string
 *           example: "64fbbb333444"
 *         cantidadSolicitada:
 *           type: number
 *           example: 50
 *         cantidadAtendida:
 *           type: number
 *           example: 30
 *         observacion:
 *           type: string
 *           example: "Entrega parcial"
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
 *     DetalleSolicitudInput:
 *       type: object
 *       required:
 *         - idSolicitud
 *         - idProducto
 *         - cantidadSolicitada
 *       properties:
 *         idSolicitud:
 *           type: string
 *         idProducto:
 *           type: string
 *         cantidadSolicitada:
 *           type: number
 *         cantidadAtendida:
 *           type: number
 *         observacion:
 *           type: string
 *         creadoPor:
 *           type: string
 *        
 */

/**
 * @openapi
 * /api/detallesolicitud:
 *   post:
 *     tags:
 *       - DetalleSolicitud
 *     summary: Crear detalle de solicitud
 *     description: Agrega un producto a una solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleSolicitudInput'
 *     responses:
 *       200:
 *         description: Detalle creado correctamente
 *       500:
 *         description: Error al crear detalle
 */
router.post('/', DetalleSolicitudController.createDetalle)

/**
 * @openapi
 * /api/detallesolicitud:
 *   get:
 *     tags:
 *       - DetalleSolicitud
 *     summary: Obtener todos los detalles de solicitud
 *     responses:
 *       200:
 *         description: Lista de detalles
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', DetalleSolicitudController.getAllDetalles)
/**
 * @openapi
 * /api/detallesolicitud/solicitud/{idSolicitud}:
 *   get:
 *     tags:
 *       - DetalleSolicitud
 *     summary: Obtener detalles por solicitud
 *     parameters:
 *       - in: path
 *         name: idSolicitud
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la solicitud
 *       500:
 *         description: Error al obtener los detalles
 */
router.get(
  "/solicitud/:idSolicitud",
  DetalleSolicitudController
    .getDetallesBySolicitud
);
/**
 * @openapi
 * /api/detallesolicitud/{id}:
 *   get:
 *     tags:
 *       - DetalleSolicitud
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
router.get('/:id', DetalleSolicitudController.getDetalleById)

/**
 * @openapi
 * /api/detallesolicitud/{id}:
 *   put:
 *     tags:
 *       - DetalleSolicitud
 *     summary: Actualizar detalle de solicitud
 *     description: Permite actualizar cantidades y observación
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
 *             $ref: '#/components/schemas/DetalleSolicitudInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', DetalleSolicitudController.updateDetalle)

/**
 * @openapi
 * /api/detallesolicitud/{id}:
 *   delete:
 *     tags:
 *       - DetalleSolicitud
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
router.delete('/:id', DetalleSolicitudController.deleteDetalle)

export default router