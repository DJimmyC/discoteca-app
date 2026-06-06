// src/routes/aperturaCajaRoutes.ts

import {
  Router,
} from "express";

import {
  AperturaCajaController,
} from "../controllers/AperturaCajaController";

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
 *     AperturaCaja:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6a251234abcd5678ef901234"
 *
 *         idPerfil:
 *           oneOf:
 *             - type: string
 *             - type: object
 *
 *         idSucursal:
 *           oneOf:
 *             - type: string
 *             - type: object
 *
 *         idCaja:
 *           oneOf:
 *             - type: string
 *             - type: object
 *
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *           example: "2026-06-23T19:00:00-04:00"
 *
 *         montoInicial:
 *           type: number
 *           minimum: 0
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
 *         observacion:
 *           type: string
 *           nullable: true
 *           example: "Inicio de jornada nocturna"
 *
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *
 *         creadoPor:
 *           type: string
 *           example: "José"
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
 *     AperturaCajaInput:
 *       type: object
 *       required:
 *         - idPerfil
 *         - idCaja
 *         - montoInicial
 *       properties:
 *         idPerfil:
 *           type: string
 *           example: "69f6927bd7691b4b764a116d"
 *
 *         idCaja:
 *           type: string
 *           example: "6a1ba6e27ba11e9abf893800"
 *
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *           example: "2026-06-23T19:00:00-04:00"
 *           description: |
 *             Fecha y hora completa de la apertura.
 *             La zona horaria de Bolivia es UTC-4.
 *
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2026-06-23"
 *           description: Campo compatible con el frontend anterior.
 *
 *         horaApertura:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "19:00"
 *           description: Campo compatible con el frontend anterior.
 *
 *         montoInicial:
 *           type: number
 *           minimum: 0
 *           example: 100
 *
 *         observacion:
 *           type: string
 *           example: "Inicio de jornada"
 *
 *         creadoPor:
 *           type: string
 *           example: "José"
 *
 *     AperturaCajaUpdateInput:
 *       type: object
 *       properties:
 *         montoInicial:
 *           type: number
 *           minimum: 0
 *           example: 150
 *
 *         observacion:
 *           type: string
 *           example: "Monto inicial corregido"
 *
 *         actualizadoPor:
 *           type: string
 *           example: "Administrador"
 */

/* =====================================================
    CREAR APERTURA
===================================================== */

/**
 * @openapi
 * /api/aperturacaja:
 *   post:
 *     tags:
 *       - AperturaCaja
 *     summary: Abrir una caja
 *     description: |
 *       Registra la apertura de una jornada de caja.
 *
 *       La sucursal se obtiene automáticamente desde la caja.
 *
 *       Reglas:
 *
 *       - La caja debe existir y estar activa.
 *       - El perfil debe ser válido.
 *       - El monto inicial no puede ser negativo.
 *       - Una caja solamente puede tener una apertura activa.
 *       - Se registra automáticamente un movimiento de apertura.
 *
 *       Ejemplo de jornada nocturna:
 *
 *       - Apertura: 23/06/2026 a horas 19:00.
 *       - Cierre: 24/06/2026 a horas 04:00.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AperturaCajaInput'
 *           examples:
 *
 *             fechaCompleta:
 *               summary: Apertura usando fecha completa
 *               value:
 *                 idPerfil: "69f6927bd7691b4b764a116d"
 *                 idCaja: "6a1ba6e27ba11e9abf893800"
 *                 fechaApertura: "2026-06-23T19:00:00-04:00"
 *                 montoInicial: 100
 *                 observacion: "Apertura de jornada nocturna"
 *                 creadoPor: "José"
 *
 *             formatoAnterior:
 *               summary: Apertura usando fecha y hora separadas
 *               value:
 *                 idPerfil: "69f6927bd7691b4b764a116d"
 *                 idCaja: "6a1ba6e27ba11e9abf893800"
 *                 fecha: "2026-06-23"
 *                 horaApertura: "19:00"
 *                 montoInicial: 100
 *                 observacion: "Apertura de jornada nocturna"
 *                 creadoPor: "José"
 *
 *     responses:
 *       201:
 *         description: Caja abierta correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Caja abierta correctamente"
 *                 apertura:
 *                   $ref: '#/components/schemas/AperturaCaja'
 *
 *       400:
 *         description: Datos no válidos o la caja ya está abierta
 *
 *       404:
 *         description: Caja no encontrada o inactiva
 *
 *       409:
 *         description: Conflicto porque existe una apertura activa
 *
 *       500:
 *         description: Error interno al abrir la caja
 */
router.post(
  "/",
  AperturaCajaController.createApertura
);

/* =====================================================
    OBTENER TODAS
===================================================== */

/**
 * @openapi
 * /api/aperturacaja:
 *   get:
 *     tags:
 *       - AperturaCaja
 *     summary: Obtener todas las aperturas
 *     description: Retorna el historial de aperturas ordenado desde la más reciente.
 *
 *     responses:
 *       200:
 *         description: Lista de aperturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AperturaCaja'
 *
 *       500:
 *         description: Error al obtener aperturas
 */
router.get(
  "/",
  AperturaCajaController.getAllAperturas
);

/* =====================================================
    APERTURA ACTIVA POR CAJA
===================================================== */

/**
 * @openapi
 * /api/aperturacaja/caja/{cajaId}/activa:
 *   get:
 *     tags:
 *       - AperturaCaja
 *     summary: Obtener apertura activa de una caja
 *     description: |
 *       Retorna la apertura cuyo estado sea `abierta`.
 *
 *       Si la caja no tiene una apertura activa, devuelve `null`.
 *
 *     parameters:
 *       - in: path
 *         name: cajaId
 *         required: true
 *         description: ID de la caja
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Apertura activa o valor nulo
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/AperturaCaja'
 *                 - type: object
 *                   nullable: true
 *
 *       500:
 *         description: Error al obtener la apertura activa
 */
router.get(
  "/caja/:cajaId/activa",
  AperturaCajaController
    .getAperturaActivaByCaja
);

/* =====================================================
    HISTORIAL POR CAJA
===================================================== */

/**
 * @openapi
 * /api/aperturacaja/caja/{cajaId}:
 *   get:
 *     tags:
 *       - AperturaCaja
 *     summary: Obtener aperturas por caja
 *     description: Retorna todo el historial de aperturas de una caja.
 *
 *     parameters:
 *       - in: path
 *         name: cajaId
 *         required: true
 *         description: ID de la caja
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Historial de aperturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AperturaCaja'
 *
 *       500:
 *         description: Error al obtener aperturas
 */
router.get(
  "/caja/:cajaId",
  AperturaCajaController
    .getAperturasByCajaId
);

/* =====================================================
    APERTURA POR ID
===================================================== */

/**
 * @openapi
 * /api/aperturacaja/{id}:
 *   get:
 *     tags:
 *       - AperturaCaja
 *     summary: Obtener una apertura por ID
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la apertura
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Apertura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AperturaCaja'
 *
 *       404:
 *         description: Apertura no encontrada
 *
 *       500:
 *         description: Error al obtener apertura
 */
router.get(
  "/:id",
  AperturaCajaController.getAperturaById
);

/* =====================================================
    ACTUALIZAR APERTURA
===================================================== */

/**
 * @openapi
 * /api/aperturacaja/{id}:
 *   put:
 *     tags:
 *       - AperturaCaja
 *     summary: Actualizar una apertura activa
 *     description: |
 *       Permite modificar únicamente el monto inicial
 *       y la observación mientras la apertura esté abierta.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la apertura
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AperturaCajaUpdateInput'
 *
 *     responses:
 *       200:
 *         description: Apertura actualizada correctamente
 *
 *       400:
 *         description: La apertura ya está cerrada o el monto no es válido
 *
 *       404:
 *         description: Apertura no encontrada
 *
 *       500:
 *         description: Error al actualizar apertura
 */
router.put(
  "/:id",
  AperturaCajaController.updateApertura
);

/* =====================================================
    ANULAR APERTURA
===================================================== */

/**
 * @openapi
 * /api/aperturacaja/{id}:
 *   delete:
 *     tags:
 *       - AperturaCaja
 *     summary: Anular una apertura
 *     description: |
 *       Realiza una eliminación lógica cambiando el estado
 *       de la apertura a `anulada`.
 *
 *       No permite anular una apertura que ya fue cerrada.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la apertura
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
 *         description: Apertura anulada correctamente
 *
 *       400:
 *         description: La apertura ya fue cerrada
 *
 *       404:
 *         description: Apertura no encontrada
 *
 *       500:
 *         description: Error al anular apertura
 */
router.delete(
  "/:id",
  AperturaCajaController.deleteApertura
);

export default router;