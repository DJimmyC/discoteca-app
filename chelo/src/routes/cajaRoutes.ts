// src/routes/cajaRoutes.ts

import {
  Router,
} from "express";

import {
  CajaController,
} from "../controllers/CajaController";

const router =
  Router();

/* =====================================================
    COMPONENTES SWAGGER
===================================================== */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     SucursalResumenCaja:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6a1ba90b7ba11e9abf89383a"
 *         nombreSucursal:
 *           type: string
 *           example: "Kabanas"
 *         ubicacionSucursal:
 *           type: string
 *           example: "La Paz"
 *
 *     Caja:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6a1ba6e27ba11e9abf893800"
 *
 *         idSucursal:
 *           oneOf:
 *             - type: string
 *               example: "6a1ba90b7ba11e9abf89383a"
 *             - $ref: '#/components/schemas/SucursalResumenCaja'
 *
 *         nombre:
 *           type: string
 *           example: "Caja principal"
 *
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: "Caja principal de la sucursal"
 *
 *         estado:
 *           type: boolean
 *           example: true
 *
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *
 *         creadoPor:
 *           type: string
 *           example: "Administrador"
 *
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *         actualizadoPor:
 *           type: string
 *           nullable: true
 *
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *         eliminadoPor:
 *           type: string
 *           nullable: true
 *
 *     CajaInput:
 *       type: object
 *       required:
 *         - idSucursal
 *         - nombre
 *       properties:
 *         idSucursal:
 *           type: string
 *           example: "6a1ba90b7ba11e9abf89383a"
 *
 *         nombre:
 *           type: string
 *           example: "Caja principal"
 *
 *         descripcion:
 *           type: string
 *           example: "Caja principal de la sucursal"
 *
 *         estado:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *         creadoPor:
 *           type: string
 *           example: "Administrador"
 *
 *     CajaUpdateInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Caja barra primer piso"
 *
 *         descripcion:
 *           type: string
 *           example: "Caja asignada a la barra principal"
 *
 *         estado:
 *           type: boolean
 *           example: true
 *
 *         actualizadoPor:
 *           type: string
 *           example: "Administrador"
 *
 *     AperturaActivaResumen:
 *       type: object
 *       nullable: true
 *       properties:
 *         _id:
 *           type: string
 *
 *         idPerfil:
 *           type: string
 *
 *         idCaja:
 *           type: string
 *
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *
 *         montoInicial:
 *           type: number
 *           example: 100
 *
 *         estado:
 *           type: string
 *           enum:
 *             - abierta
 *             - cerrada
 *             - anulada
 *           example: "abierta"
 *
 *     CajaConApertura:
 *       type: object
 *       properties:
 *         caja:
 *           $ref: '#/components/schemas/Caja'
 *
 *         aperturaActiva:
 *           $ref: '#/components/schemas/AperturaActivaResumen'
 *
 *     CajaPorSucursal:
 *       allOf:
 *         - $ref: '#/components/schemas/Caja'
 *         - type: object
 *           properties:
 *             aperturaActiva:
 *               $ref: '#/components/schemas/AperturaActivaResumen'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Ocurrió un error"
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/* =====================================================
    CREAR CAJA
===================================================== */

/**
 * @openapi
 * /api/caja:
 *   post:
 *     tags:
 *       - Caja
 *     summary: Crear una caja
 *     description: |
 *       Crea una nueva caja dentro de una sucursal.
 *
 *       No permite registrar dos cajas con el mismo nombre
 *       dentro de la misma sucursal.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CajaInput'
 *           example:
 *             idSucursal: "6a1ba90b7ba11e9abf89383a"
 *             nombre: "Caja principal"
 *             descripcion: "Caja principal de la sucursal"
 *             estado: true
 *             creadoPor: "Administrador"
 *
 *     responses:
 *       201:
 *         description: Caja creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Caja creada correctamente"
 *                 caja:
 *                   $ref: '#/components/schemas/Caja'
 *
 *       400:
 *         description: Datos obligatorios no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       409:
 *         description: Ya existe una caja con el mismo nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Error interno al crear la caja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  CajaController.createCaja
);

/* =====================================================
    OBTENER TODAS
===================================================== */

/**
 * @openapi
 * /api/caja:
 *   get:
 *     tags:
 *       - Caja
 *     summary: Obtener todas las cajas
 *     description: Retorna todas las cajas registradas con su sucursal.
 *
 *     responses:
 *       200:
 *         description: Lista de cajas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caja'
 *
 *       500:
 *         description: Error al obtener las cajas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  CajaController.getAllCajas
);

/* =====================================================
    CAJAS POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/caja/sucursal/{idSucursal}:
 *   get:
 *     tags:
 *       - Caja
 *     summary: Obtener cajas activas de una sucursal
 *     description: |
 *       Retorna todas las cajas activas de una sucursal.
 *
 *       Cada caja incluye su apertura activa, cuando exista.
 *       Esto permite saber si la caja está abierta o disponible
 *       para realizar una nueva apertura.
 *
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: string
 *         example: "6a1ba90b7ba11e9abf89383a"
 *
 *     responses:
 *       200:
 *         description: Lista de cajas activas de la sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CajaPorSucursal'
 *
 *       500:
 *         description: Error al obtener las cajas de la sucursal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/sucursal/:idSucursal",
  CajaController.getCajasBySucursal
);

/* =====================================================
    OBTENER CAJA POR ID
===================================================== */

/**
 * @openapi
 * /api/caja/{id}:
 *   get:
 *     tags:
 *       - Caja
 *     summary: Obtener una caja por ID
 *     description: |
 *       Retorna la información de una caja y su apertura
 *       activa, cuando exista.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la caja
 *         schema:
 *           type: string
 *         example: "6a1ba6e27ba11e9abf893800"
 *
 *     responses:
 *       200:
 *         description: Caja encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CajaConApertura'
 *
 *       404:
 *         description: Caja no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Error al obtener la caja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id",
  CajaController.getCajaById
);

/* =====================================================
    ACTUALIZAR CAJA
===================================================== */

/**
 * @openapi
 * /api/caja/{id}:
 *   put:
 *     tags:
 *       - Caja
 *     summary: Actualizar una caja
 *     description: Permite modificar el nombre, descripción y estado de una caja.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la caja
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CajaUpdateInput'
 *
 *     responses:
 *       200:
 *         description: Caja actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Caja actualizada correctamente"
 *                 caja:
 *                   $ref: '#/components/schemas/Caja'
 *
 *       404:
 *         description: Caja no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Error al actualizar la caja
 */
router.put(
  "/:id",
  CajaController.updateCaja
);

/* =====================================================
    ELIMINAR CAJA
===================================================== */

/**
 * @openapi
 * /api/caja/{id}:
 *   delete:
 *     tags:
 *       - Caja
 *     summary: Desactivar una caja
 *     description: |
 *       Realiza una eliminación lógica de la caja.
 *
 *       No permite desactivar una caja cuando tiene una
 *       apertura activa.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la caja
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eliminadoPor:
 *                 type: string
 *                 example: "Administrador"
 *
 *     responses:
 *       200:
 *         description: Caja desactivada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Caja desactivada correctamente"
 *                 caja:
 *                   $ref: '#/components/schemas/Caja'
 *
 *       400:
 *         description: La caja tiene una apertura activa
 *
 *       404:
 *         description: Caja no encontrada
 *
 *       500:
 *         description: Error al desactivar la caja
 */
router.delete(
  "/:id",
  CajaController.deleteCaja
);

export default router;