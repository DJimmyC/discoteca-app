import { Router } from "express"
import { CierreCajaController } from "../controllers/CierreCajaController"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     CierreCaja:
 *       type: object
 *       description: Registro de cierre de caja
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
 *         idCaja:
 *           type: string
 *           example: "64fccc555666"
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T08:00:00.000Z"
 *         fechaCierre:
 *           type: string
 *           format: date-time
 *           example: "2026-05-03T18:00:00.000Z"
 *         montoInicial:
 *           type: number
 *           example: 500
 *         totalVentas:
 *           type: number
 *           example: 1500
 *         totalEgresos:
 *           type: number
 *           example: 200
 *         totalEsperado:
 *           type: number
 *           example: 1800
 *         montoReal:
 *           type: number
 *           example: 1800
 *         diferencia:
 *           type: number
 *           example: 0
 *         estado:
 *           type: string
 *           enum: [cerrado, cuadrado, descuadre]
 *           example: "cuadrado"
 *         observacion:
 *           type: string
 *           example: "Cierre sin novedades"
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
 *     CierreCajaInput:
 *       type: object
 *       required:
 *         - idPerfil
 *         - idSucursal
 *         - idCaja
 *         - fechaApertura
 *         - fechaCierre
 *         - montoInicial
 *         - montoReal
 *       properties:
 *         idPerfil:
 *           type: string
 *         idSucursal:
 *           type: string
 *         idCaja:
 *           type: string
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *         fechaCierre:
 *           type: string
 *           format: date-time
 *         montoInicial:
 *           type: number
 *         totalVentas:
 *           type: number
 *         totalEgresos:
 *           type: number
 *         montoReal:
 *           type: number
 *         observacion:
 *           type: string
 *         creadoPor:
 *           type: string
 *        
 */

/**
 * @openapi
 * /api/cierrecaja:
 *   post:
 *     tags:
 *       - CierreCaja
 *     summary: Registrar cierre de caja
 *     description: Calcula automáticamente totalEsperado, diferencia y estado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CierreCajaInput'
 *     responses:
 *       200:
 *         description: Cierre registrado correctamente
 *       500:
 *         description: Error al registrar cierre
 */
router.post('/', CierreCajaController.createCierre)

/**
 * @openapi
 * /api/cierrecaja:
 *   get:
 *     tags:
 *       - CierreCaja
 *     summary: Obtener todos los cierres
 *     responses:
 *       200:
 *         description: Lista de cierres
 *       500:
 *         description: Error al obtener datos
 */
router.get('/', CierreCajaController.getAllCierres)

/**
 * @openapi
 * /api/cierrecaja/{id}:
 *   get:
 *     tags:
 *       - CierreCaja
 *     summary: Obtener cierre por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cierre encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', CierreCajaController.getCierreById)

/**
 * @openapi
 * /api/cierrecaja/{id}:
 *   put:
 *     tags:
 *       - CierreCaja
 *     summary: Actualizar cierre
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
 *             $ref: '#/components/schemas/CierreCajaInput'
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 *       500:
 *         description: Error al actualizar
 */
router.put('/:id', CierreCajaController.updateCierre)

/**
 * @openapi
 * /api/cierrecaja/{id}:
 *   delete:
 *     tags:
 *       - CierreCaja
 *     summary: Eliminar cierre (lógico)
 *     description: Marca el cierre como eliminado
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
router.delete('/:id', CierreCajaController.deleteCierre)


/**
 * @openapi
 * /api/cierrecaja/caja/{cajaId}:
 *   get:
 *     tags:
 *       - CierreCaja
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
router.get(  '/caja/:cajaId',  CierreCajaController.getCierresByCajaId

)


export default router