import { Router } from "express"
import { EgresoController } from "../controllers/EgresoController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Egreso:
 *       type: object
 *       description: Registro de egresos (salidas de dinero)
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idCaja:
 *           type: string
 *           example: "64faaa111222"
 *         idPerfil:
 *           type: string
 *           example: "64fbbb333444"
 *         idSucursal:
 *           type: string
 *           example: "64fccc555666"
 *         numeroEgreso:
 *           type: string
 *           example: "EGR-001"
 *         fechaEgreso:
 *           type: string
 *           format: date-time
 *         tipoEgreso:
 *           type: string
 *           enum: [compra, servicio, transporte, mantenimiento]
 *           example: "compra"
 *         metodoPago:
 *           type: string
 *           enum: [efectivo, qr, transferencia]
 *           example: "efectivo"
 *         total:
 *           type: number
 *           example: 200
 *         estado:
 *           type: string
 *           enum: [registrado, anulado]
 *           example: "registrado"
 *         observacion:
 *           type: string
 *           example: "Compra de insumos"
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
 *     EgresoInput:
 *       type: object
 *       required:
 *         - idPerfil
 *         - idSucursal
 *         - tipoEgreso
 *         - metodoPago
 *         - total
 *       properties:
 *         idCaja:
 *           type: string
 *         idPerfil:
 *           type: string
 *         idSucursal:
 *           type: string
 *         numeroEgreso:
 *           type: string
 *         fechaEgreso:
 *           type: string
 *           format: date-time
 *         tipoEgreso:
 *           type: string
 *           enum: [compra, servicio, transporte, mantenimiento]
 *         metodoPago:
 *           type: string
 *           enum: [efectivo, qr, transferencia]
 *         total:
 *           type: number
 *         estado:
 *           type: string
 *           enum: [registrado, anulado]
 *         observacion:
 *           type: string
 *         creadoPor:
 *           type: string
 *        
 */

/**
 * @openapi
 * /api/egreso:
 *   post:
 *     tags:
 *       - Egreso
 *     summary: Crear egreso
 *     description: Registra una salida de dinero
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EgresoInput'
 *     responses:
 *       200:
 *         description: Egreso creado correctamente
 *       500:
 *         description: Error al crear egreso
 */
router.post('/', EgresoController.createEgreso)

/**
 * @openapi
 * /api/egreso:
 *   get:
 *     tags:
 *       - Egreso
 *     summary: Obtener todos los egresos
 *     responses:
 *       200:
 *         description: Lista de egresos
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', EgresoController.getAllEgresos)

/**
 * @openapi
 * /api/egreso/sucursal/{idSucursal}/detalles:
 *   get:
 *     tags:
 *       - Egreso
 *     summary: Obtener egresos por sucursal con sus detalles
 *     description: Retorna todos los egresos de una sucursal junto con sus detalles, caja, perfil, productos, almacenes y totales.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal.
 *         schema:
 *           type: string
 *         example: "68d5d939f751fc10266aa31c"
 *     responses:
 *       200:
 *         description: Lista de egresos con sus detalles
 *       500:
 *         description: Error al obtener egresos con detalles por sucursal
 */
router.get(
    "/sucursal/:idSucursal/detalles",
    EgresoController.getEgresosConDetallesPorSucursal
);

/**
 * @openapi
 * /api/egreso/{id}:
 *   get:
 *     tags:
 *       - Egreso
 *     summary: Obtener egreso por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Egreso encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', EgresoController.getEgresoById)

/**
 * @openapi
 * /api/egreso/{id}:
 *   put:
 *     tags:
 *       - Egreso
 *     summary: Actualizar egreso
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
 *             $ref: '#/components/schemas/EgresoInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', EgresoController.updateEgreso)

/**
 * @openapi
 * /api/egreso/{id}:
 *   delete:
 *     tags:
 *       - Egreso
 *     summary: Eliminar egreso (lógico)
 *     description: Cambia el estado a "anulado"
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
 *         description: Egreso anulado correctamente
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', EgresoController.deleteEgreso)

export default router