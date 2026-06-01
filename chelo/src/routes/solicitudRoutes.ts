import { Router } from "express"
import { SolicitudController } from "../controllers/SolicitudController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Solicitud:
 *       type: object
 *       description: Solicitud de traslado o pedido entre almacenes
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idPerfil:
 *           type: string
 *           example: "64faaa111222"
 *         idSucursal:
 *           type: string
 *           example: "64fbbb333444"
 *         idAlmacenOrigen:
 *           type: string
 *           example: "64fccc555666"
 *         idAlmacenDestino:
 *           type: string
 *           example: "64fddd777888"
 *         fechaSolicitud:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           enum: [pendiente, aprobada, rechazada, atendida, anulada]
 *           example: "pendiente"
 *         observacion:
 *           type: string
 *           example: "Reposición de productos"
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
 *     SolicitudInput:
 *       type: object
 *       required:
 *         - idPerfil
 *         - idSucursal
 *         - idAlmacenOrigen
 *         - idAlmacenDestino
 *       properties:
 *         idPerfil:
 *           type: string
 *         idSucursal:
 *           type: string
 *         idAlmacenOrigen:
 *           type: string
 *         idAlmacenDestino:
 *           type: string
 *         fechaSolicitud:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           enum: [pendiente, aprobada, rechazada, atendida, anulada]
 *         observacion:
 *           type: string
 *         creadoPor:
 *           type: string
 *       
 */

/**
 * @openapi
 * /api/solicitud:
 *   post:
 *     tags:
 *       - Solicitud
 *     summary: Crear solicitud
 *     description: Registra una solicitud de traslado entre almacenes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudInput'
 *     responses:
 *       200:
 *         description: Solicitud creada correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error al crear solicitud
 */
router.post('/', SolicitudController.createSolicitud)

/**
 * @openapi
 * /api/solicitud:
 *   get:
 *     tags:
 *       - Solicitud
 *     summary: Obtener todas las solicitudes
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', SolicitudController.getAllSolicitudes)

/**
 * @openapi
 * /api/solicitud/sucursal/{idSucursal}:
 *   get:
 *     tags:
 *       - Solicitud
 *     summary: Obtener solicitudes por sucursal
 *     description: Retorna la sucursal una sola vez y todas sus solicitudes, incluyendo perfil, almacén origen y almacén destino sin repetir datos innecesarios.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal.
 *         schema:
 *           type: string
 *         example: ""
 *     responses:
 *       200:
 *         description: Sucursal con lista de solicitudes
 *       500:
 *         description: Error al obtener solicitudes por sucursal
 */
router.get(
    "/sucursal/:idSucursal",
    SolicitudController.getSolicitudesBySucursal
);

/**
 * @openapi
 * /api/solicitud/{id}:
 *   get:
 *     tags:
 *       - Solicitud
 *     summary: Obtener solicitud por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', SolicitudController.getSolicitudById)

/**
 * @openapi
 * /api/solicitud/{id}:
 *   put:
 *     tags:
 *       - Solicitud
 *     summary: Actualizar solicitud
 *     description: Permite modificar datos o estado de la solicitud
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
 *             $ref: '#/components/schemas/SolicitudInput'
 *     responses:
 *       200:
 *         description: Actualizada correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', SolicitudController.updateSolicitud)

/**
 * @openapi
 * /api/solicitud/{id}:
 *   delete:
 *     tags:
 *       - Solicitud
 *     summary: Eliminar solicitud (lógico)
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
 *         description: Solicitud anulada correctamente
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', SolicitudController.deleteSolicitud)

export default router