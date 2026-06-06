// src/routes/cierreCajaRoutes.ts

import {
  Router,
} from "express";

import {
  CierreCajaController,
} from "../controllers/CierreCajaController";

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
 *     EstadoCierreCaja:
 *       type: string
 *       enum:
 *         - cuadrado
 *         - sobrante
 *         - faltante
 *         - anulado
 *       example: "cuadrado"
 *
 *     CierreCaja:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *
 *         idAperturaCaja:
 *           oneOf:
 *             - type: string
 *             - type: object
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
 *         fechaCierre:
 *           type: string
 *           format: date-time
 *           example: "2026-06-24T04:00:00-04:00"
 *
 *         montoInicial:
 *           type: number
 *           example: 100
 *
 *         totalVentas:
 *           type: number
 *           example: 1500
 *
 *         totalVentasEfectivo:
 *           type: number
 *           example: 800
 *
 *         totalVentasQr:
 *           type: number
 *           example: 400
 *
 *         totalVentasTransferencia:
 *           type: number
 *           example: 200
 *
 *         totalVentasMixto:
 *           type: number
 *           example: 100
 *
 *         totalCortesias:
 *           type: number
 *           example: 50
 *
 *         totalVentasAnuladas:
 *           type: number
 *           example: 80
 *
 *         totalEgresos:
 *           type: number
 *           example: 150
 *
 *         totalEgresosEfectivo:
 *           type: number
 *           example: 150
 *
 *         totalEsperadoEfectivo:
 *           type: number
 *           example: 750
 *
 *         montoReal:
 *           type: number
 *           example: 740
 *
 *         diferencia:
 *           type: number
 *           example: -10
 *
 *         cantidadVentas:
 *           type: number
 *           example: 35
 *
 *         cantidadProductosVendidos:
 *           type: number
 *           example: 80
 *
 *         cantidadEgresos:
 *           type: number
 *           example: 3
 *
 *         estado:
 *           $ref: '#/components/schemas/EstadoCierreCaja'
 *
 *         observacion:
 *           type: string
 *           nullable: true
 *
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *
 *         creadoPor:
 *           type: string
 *
 *     CierreCajaInput:
 *       type: object
 *       required:
 *         - idPerfil
 *         - idCaja
 *         - montoReal
 *       properties:
 *         idPerfil:
 *           type: string
 *           example: "69f6927bd7691b4b764a116d"
 *
 *         idCaja:
 *           type: string
 *           example: "6a1ba6e27ba11e9abf893800"
 *
 *         fechaCierre:
 *           type: string
 *           format: date-time
 *           example: "2026-06-24T04:00:00-04:00"
 *           description: Fecha y hora completa del cierre.
 *
 *         fecha:
 *           type: string
 *           format: date
 *           example: "2026-06-23"
 *           description: Compatibilidad con el frontend anterior.
 *
 *         horaCierre:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "04:00"
 *           description: |
 *             Si la fecha enviada corresponde al día de apertura
 *             y la hora es menor que la hora de apertura, se considera
 *             automáticamente que el cierre ocurrió al día siguiente.
 *
 *         montoReal:
 *           type: number
 *           minimum: 0
 *           example: 740
 *           description: Dinero físico contado al cerrar la caja.
 *
 *         observacion:
 *           type: string
 *           example: "Cierre de jornada nocturna"
 *
 *         creadoPor:
 *           type: string
 *           example: "José"
 *
 *     ProductoVendidoCierre:
 *       type: object
 *       properties:
 *         idProducto:
 *           type: string
 *
 *         nombre:
 *           type: string
 *           example: "Cerveza Paceña"
 *
 *         marca:
 *           type: string
 *           example: "Paceña"
 *
 *         cantidadVendida:
 *           type: number
 *           example: 30
 *
 *         precioPromedio:
 *           type: number
 *           example: 15
 *
 *         totalVendido:
 *           type: number
 *           example: 450
 *
 *     JornadaCaja:
 *       type: object
 *       properties:
 *         fechaApertura:
 *           type: string
 *           format: date-time
 *
 *         fechaCierre:
 *           type: string
 *           format: date-time
 *
 *         duracionMinutos:
 *           type: number
 *           example: 540
 *           description: Duración total de la jornada en minutos.
 *
 *     ResumenCierreCaja:
 *       type: object
 *       properties:
 *         cantidadVentas:
 *           type: number
 *
 *         cantidadProductosVendidos:
 *           type: number
 *
 *         cantidadEgresos:
 *           type: number
 *
 *         totalVentas:
 *           type: number
 *
 *         totalVentasEfectivo:
 *           type: number
 *
 *         totalVentasQr:
 *           type: number
 *
 *         totalVentasTransferencia:
 *           type: number
 *
 *         totalVentasMixto:
 *           type: number
 *
 *         totalCortesias:
 *           type: number
 *
 *         totalVentasAnuladas:
 *           type: number
 *
 *         totalEgresos:
 *           type: number
 *
 *         totalEgresosEfectivo:
 *           type: number
 *
 *         montoInicial:
 *           type: number
 *
 *         totalEsperadoEfectivo:
 *           type: number
 *
 *         montoReal:
 *           type: number
 *
 *         diferencia:
 *           type: number
 *
 *         estado:
 *           $ref: '#/components/schemas/EstadoCierreCaja'
 *
 *     ReporteCierreCaja:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Caja cerrada correctamente"
 *
 *         cierre:
 *           $ref: '#/components/schemas/CierreCaja'
 *
 *         jornada:
 *           $ref: '#/components/schemas/JornadaCaja'
 *
 *         resumen:
 *           $ref: '#/components/schemas/ResumenCierreCaja'
 *
 *         productosVendidos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductoVendidoCierre'
 *
 *         ventas:
 *           type: array
 *           items:
 *             type: object
 *
 *         egresos:
 *           type: array
 *           items:
 *             type: object
 */

/* =====================================================
    CREAR CIERRE
===================================================== */

/**
 * @openapi
 * /api/cierrecaja:
 *   post:
 *     tags:
 *       - CierreCaja
 *     summary: Cerrar una caja y generar el reporte de jornada
 *     description: |
 *       Busca la apertura activa de la caja y genera automáticamente
 *       el informe completo de cierre.
 *
 *       El backend consulta:
 *
 *       - Ventas realizadas entre la apertura y el cierre.
 *       - Detalles de productos vendidos.
 *       - Ventas en efectivo, QR, transferencia y mixtas.
 *       - Ventas anuladas.
 *       - Cortesías.
 *       - Egresos de la jornada.
 *       - Dinero esperado en efectivo.
 *       - Diferencia contra el monto físico contado.
 *
 *       La consulta utiliza el rango exacto entre `fechaApertura`
 *       y `fechaCierre`, por lo que una jornada puede atravesar
 *       la medianoche.
 *
 *       Ejemplo:
 *
 *       - Apertura: 23/06/2026 19:00.
 *       - Cierre: 24/06/2026 04:00.
 *       - Duración: 540 minutos.
 *
 *       Si se manda `fecha: 2026-06-23` y `horaCierre: 04:00`,
 *       el backend detecta que 04:00 es menor que 19:00 y coloca
 *       automáticamente el cierre el 24/06/2026.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CierreCajaInput'
 *           examples:
 *
 *             cierreNocturno:
 *               summary: Cierre usando la hora del día siguiente
 *               value:
 *                 idPerfil: "69f6927bd7691b4b764a116d"
 *                 idCaja: "6a1ba6e27ba11e9abf893800"
 *                 fecha: "2026-06-23"
 *                 horaCierre: "04:00"
 *                 montoReal: 740
 *                 observacion: "Cierre de jornada nocturna"
 *                 creadoPor: "José"
 *
 *             fechaCompleta:
 *               summary: Cierre usando una fecha completa
 *               value:
 *                 idPerfil: "69f6927bd7691b4b764a116d"
 *                 idCaja: "6a1ba6e27ba11e9abf893800"
 *                 fechaCierre: "2026-06-24T04:00:00-04:00"
 *                 montoReal: 740
 *                 observacion: "Cierre de jornada nocturna"
 *                 creadoPor: "José"
 *
 *     responses:
 *       201:
 *         description: Caja cerrada y reporte generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteCierreCaja'
 *
 *       400:
 *         description: |
 *           Datos no válidos, monto incorrecto o fecha de cierre
 *           anterior a la apertura.
 *
 *       404:
 *         description: Caja no encontrada o sin apertura activa
 *
 *       409:
 *         description: La apertura ya cuenta con un cierre
 *
 *       500:
 *         description: Error interno al cerrar la caja
 */
router.post(
  "/",
  CierreCajaController.createCierre
);

/* =====================================================
    OBTENER TODOS
===================================================== */

/**
 * @openapi
 * /api/cierrecaja:
 *   get:
 *     tags:
 *       - CierreCaja
 *     summary: Obtener todos los cierres
 *     description: Retorna el historial de cierres ordenado desde el más reciente.
 *
 *     responses:
 *       200:
 *         description: Lista de cierres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CierreCaja'
 *
 *       500:
 *         description: Error al obtener cierres
 */
router.get(
  "/",
  CierreCajaController.getAllCierres
);

/* =====================================================
    CIERRES POR CAJA
===================================================== */

/**
 * @openapi
 * /api/cierrecaja/caja/{cajaId}:
 *   get:
 *     tags:
 *       - CierreCaja
 *     summary: Obtener cierres por caja
 *     description: Retorna el historial completo de cierres de una caja.
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
 *         description: Lista de cierres de la caja
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CierreCaja'
 *
 *       500:
 *         description: Error al obtener cierres
 */
router.get(
  "/caja/:cajaId",
  CierreCajaController
    .getCierresByCajaId
);

/* =====================================================
    CIERRE POR ID
===================================================== */

/**
 * @openapi
 * /api/cierrecaja/{id}:
 *   get:
 *     tags:
 *       - CierreCaja
 *     summary: Obtener un cierre por ID
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cierre
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Cierre encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CierreCaja'
 *
 *       404:
 *         description: Cierre no encontrado
 *
 *       500:
 *         description: Error al obtener cierre
 */
router.get(
  "/:id",
  CierreCajaController.getCierreById
);

/* =====================================================
    ACTUALIZAR OBSERVACIÓN
===================================================== */

/**
 * @openapi
 * /api/cierrecaja/{id}:
 *   put:
 *     tags:
 *       - CierreCaja
 *     summary: Actualizar la observación de un cierre
 *     description: |
 *       No permite modificar manualmente los totales financieros.
 *       Únicamente actualiza la observación y los datos de auditoría.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cierre
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observacion:
 *                 type: string
 *                 example: "Cierre revisado por administración"
 *
 *               actualizadoPor:
 *                 type: string
 *                 example: "Administrador"
 *
 *     responses:
 *       200:
 *         description: Observación actualizada correctamente
 *
 *       404:
 *         description: Cierre no encontrado
 *
 *       500:
 *         description: Error al actualizar cierre
 */
router.put(
  "/:id",
  CierreCajaController.updateCierre
);

/* =====================================================
    ANULAR CIERRE
===================================================== */

/**
 * @openapi
 * /api/cierrecaja/{id}:
 *   delete:
 *     tags:
 *       - CierreCaja
 *     summary: Anular un cierre de caja
 *     description: |
 *       Cambia el estado del cierre a `anulado`.
 *
 *       El motivo de anulación es obligatorio para mantener
 *       la trazabilidad y auditoría financiera.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cierre
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *                 example: "Cierre registrado con el monto físico equivocado"
 *
 *               eliminadoPor:
 *                 type: string
 *                 example: "Administrador"
 *
 *     responses:
 *       200:
 *         description: Cierre anulado correctamente
 *
 *       400:
 *         description: El motivo de anulación es obligatorio
 *
 *       404:
 *         description: Cierre no encontrado
 *
 *       500:
 *         description: Error al anular cierre
 */
router.delete(
  "/:id",
  CierreCajaController.deleteCierre
);

export default router;