import { Router } from "express"
import { VentaController } from "../controllers/VentaController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Venta:
 *       type: object
 *       description: Registro de una venta
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idComanda:
 *           type: string
 *           example: "64faaa111222"
 *         idCaja:
 *           type: string
 *           example: "64fbbb333444"
 *         idPerfil:
 *           type: string
 *           example: "64fccc555666"
 *         idSucursal:
 *           type: string
 *           example: "64fddd777888"
 *         numeroVenta:
 *           type: string
 *           example: "V-001"
 *         fechaVenta:
 *           type: string
 *           format: date-time
 *         subtotal:
 *           type: number
 *           example: 100
 *       
 *         total:
 *           type: number
 *           example: 90
 *         metodoPago:
 *           type: string
 *           enum: [efectivo, qr, transferencia]
 *           example: "efectivo"
 *         estado:
 *           type: string
 *           enum: [pagado, anulado]
 *           example: "pagado"
 *         observacion:
 *           type: string
 *           example: "Venta rápida"
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *         creadoPor:
 *           type: string
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
 *     VentaInput:
 *       type: object
 *       required:
 *         - idCaja
 *         - idPerfil
 *         - idSucursal
 *         - subtotal
 *         - metodoPago
 *       properties:
 *         idComanda:
 *           type: string
 *         idCaja:
 *           type: string
 *         idPerfil:
 *           type: string
 *         idSucursal:
 *           type: string
 *         numeroVenta:
 *           type: string
 *         fechaVenta:
 *           type: string
 *           format: date-time
 *         subtotal:
 *           type: number
 *         metodoPago:
 *           type: string
 *           enum: [efectivo, qr, transferencia]
 *         estado:
 *           type: string
 *           enum: [pagado, anulado]
 *         observacion:
 *           type: string
 *         creadoPor:
 *           type: string
 *        
 */

/**
 * @openapi
 * /api/venta:
 *   post:
 *     tags:
 *       - Venta
 *     summary: Crear venta
 *     description: Registra una nueva venta (el total se calcula automáticamente)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VentaInput'
 *     responses:
 *       200:
 *         description: Venta creada correctamente
 *       500:
 *         description: Error al crear venta
 */
router.post('/', VentaController.createVenta)

/**
 * @openapi
 * /api/venta:
 *   get:
 *     tags:
 *       - Venta
 *     summary: Obtener todas las ventas
 *     responses:
 *       200:
 *         description: Lista de ventas
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', VentaController.getAllVentas)

/**
 * @openapi
 * /api/venta/perfil/{idPerfil}/detalles:
 *   get:
 *     tags:
 *       - Venta
 *     summary: Obtener ventas por perfil con sus detalles
 *     description: Retorna todas las ventas de un perfil junto con su comanda, caja, sucursal, productos vendidos, subtotales y total.
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         description: ID del perfil de usuario.
 *         schema:
 *           type: string
 *         example: "69f6927bd7691b4b764a116d"
 *     responses:
 *       200:
 *         description: Ventas del perfil con sus detalles
 *       500:
 *         description: Error al obtener ventas con detalles por perfil
 */
router.get(
    "/perfil/:idPerfil/detalles",
    VentaController.getVentasConDetallesPorPerfil
);

/**
 * @openapi
 * /api/venta/{id}:
 *   get:
 *     tags:
 *       - Venta
 *     summary: Obtener venta por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venta encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', VentaController.getVentaById)

/**
 * @openapi
 * /api/venta/{id}:
 *   put:
 *     tags:
 *       - Venta
 *     summary: Actualizar venta
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
 *             $ref: '#/components/schemas/VentaInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', VentaController.updateVenta)

/**
 * @openapi
 * /api/venta/{id}:
 *   delete:
 *     tags:
 *       - Venta
 *     summary: Eliminar venta (lógico)
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
 *         description: Venta anulada correctamente
 *       500:
 *         description: Error al eliminar
 */
router.delete('/:id', VentaController.deleteVenta)

/**
 * @openapi
 * /api/venta/{id}/cortesia:
 *   patch:
 *     tags:
 *       - Venta
 *     summary: Marcar venta como cortesía
 *     description: Cambia el estado de una venta a "cortesia".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *         example: "64f123abc456"
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
 *         description: Venta marcada como cortesía correctamente
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error con la cortesía
 */
router.patch(
    "/:id/cortesia",
    VentaController.cortesiaVenta
);

export default router