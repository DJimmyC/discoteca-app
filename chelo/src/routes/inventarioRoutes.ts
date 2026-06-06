// src/routes/inventarioRoutes.ts

import {
  Router,
} from "express";

import {
  InventarioController,
} from "../controllers/InventarioController";

const router =
  Router();

/* =====================================================
    ESQUEMAS SWAGGER
===================================================== */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     ProductoInventario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64fbbb222333444555666777"
 *         nombre:
 *           type: string
 *           example: "Cerveza"
 *         descripcion:
 *           type: string
 *           example: "Cerveza botella 330 ml"
 *         marca:
 *           type: string
 *           example: "Paceña"
 *         estado:
 *           type: boolean
 *           example: true
 *
 *     AlmacenInventario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64faaa111222333444555666"
 *         idSucursal:
 *           type: string
 *           example: "64f111222333444555666777"
 *         nombre:
 *           type: string
 *           example: "Almacén Principal"
 *         descripcion:
 *           type: string
 *           example: "Almacén central de la sucursal"
 *         tipo:
 *           type: string
 *           example: "principal"
 *         ubicacion:
 *           type: string
 *           example: "Primer piso"
 *         estado:
 *           type: boolean
 *           example: true
 *
 *     Inventario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456789123456789"
 *
 *         idAlmacen:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/AlmacenInventario'
 *
 *         idProducto:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/ProductoInventario'
 *
 *         cantidad:
 *           type: number
 *           example: 25
 *
 *         costoUnitario:
 *           type: number
 *           description: Costo promedio ponderado actual
 *           example: 18
 *
 *         ultimoCostoEntrada:
 *           type: number
 *           description: Costo unitario de la entrada más reciente
 *           example: 20
 *
 *         precioVenta:
 *           type: number
 *           example: 25
 *
 *         stockMinimo:
 *           type: number
 *           example: 10
 *
 *         valorInventario:
 *           type: number
 *           description: Cantidad actual multiplicada por el costo promedio
 *           example: 450
 *
 *         estado:
 *           type: boolean
 *           example: true
 *
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *         creadoPor:
 *           type: string
 *           example: "Administrador"
 *
 *         actualizadoPor:
 *           type: string
 *           nullable: true
 *
 *         eliminadoPor:
 *           type: string
 *           nullable: true
 *
 *     InventarioInput:
 *       type: object
 *       required:
 *         - idAlmacen
 *         - idProducto
 *         - cantidad
 *         - costoUnitario
 *         - creadoPor
 *       properties:
 *         idAlmacen:
 *           type: string
 *           example: "64faaa111222333444555666"
 *
 *         idProducto:
 *           type: string
 *           example: "64fbbb222333444555666777"
 *
 *         cantidad:
 *           type: number
 *           minimum: 1
 *           example: 20
 *           description: Cantidad que está ingresando al almacén
 *
 *         costoUnitario:
 *           type: number
 *           minimum: 0
 *           example: 20
 *           description: Costo unitario de la nueva entrada
 *
 *         precioVenta:
 *           type: number
 *           minimum: 0
 *           example: 25
 *
 *         stockMinimo:
 *           type: number
 *           minimum: 0
 *           example: 10
 *
 *         estado:
 *           type: boolean
 *           example: true
 *
 *         creadoPor:
 *           type: string
 *           example: "Administrador"
 *
 *     InventarioUpdateInput:
 *       type: object
 *       properties:
 *         precioVenta:
 *           type: number
 *           minimum: 0
 *           example: 25
 *
 *         stockMinimo:
 *           type: number
 *           minimum: 0
 *           example: 10
 *
 *         estado:
 *           type: boolean
 *           example: true
 *
 *         actualizadoPor:
 *           type: string
 *           example: "Administrador"
 *
 *     CalculoCostoInventario:
 *       type: object
 *       properties:
 *         cantidadAnterior:
 *           type: number
 *           example: 5
 *
 *         cantidadEntrada:
 *           type: number
 *           example: 20
 *
 *         cantidadNueva:
 *           type: number
 *           example: 25
 *
 *         costoAnterior:
 *           type: number
 *           example: 10
 *
 *         costoEntrada:
 *           type: number
 *           example: 20
 *
 *         costoPromedio:
 *           type: number
 *           example: 18
 *
 *         valorAnterior:
 *           type: number
 *           example: 50
 *
 *         valorEntrada:
 *           type: number
 *           example: 400
 *
 *         valorNuevo:
 *           type: number
 *           example: 450
 *
 *     InventarioPrincipalResponse:
 *       type: object
 *       properties:
 *         almacen:
 *           $ref: '#/components/schemas/AlmacenInventario'
 *
 *         inventarios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Inventario'
 *
 *     TransferenciaSolicitudResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Solicitud aprobada, inventarios actualizados y movimientos registrados"
 *
 *         cantidadTotal:
 *           type: number
 *           example: 20
 *
 *         almacenOrigen:
 *           $ref: '#/components/schemas/AlmacenInventario'
 *
 *         almacenDestino:
 *           $ref: '#/components/schemas/AlmacenInventario'
 *
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               idProducto:
 *                 type: string
 *               cantidadTransferida:
 *                 type: number
 */

/* =====================================================
    CREAR INVENTARIO O REGISTRAR ENTRADA
===================================================== */

/**
 * @openapi
 * /api/inventario:
 *   post:
 *     tags:
 *       - Inventario
 *     summary: Crear inventario o registrar una entrada
 *     description: |
 *       Si el producto no existe en el almacén, crea su inventario.
 *       Si ya existe, suma la nueva cantidad y recalcula el costo
 *       promedio ponderado. También registra automáticamente un
 *       movimiento de entrada de inventario.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioInput'
 *
 *     responses:
 *       200:
 *         description: Entrada agregada y costo promedio actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 inventario:
 *                   $ref: '#/components/schemas/Inventario'
 *                 calculoCosto:
 *                   $ref: '#/components/schemas/CalculoCostoInventario'
 *
 *       201:
 *         description: Inventario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 inventario:
 *                   $ref: '#/components/schemas/Inventario'
 *                 calculoCosto:
 *                   $ref: '#/components/schemas/CalculoCostoInventario'
 *
 *       400:
 *         description: Datos obligatorios o numéricos no válidos
 *
 *       404:
 *         description: Almacén no encontrado
 *
 *       409:
 *         description: Conflicto por inventario duplicado
 *
 *       500:
 *         description: Error al registrar inventario
 */
router.post(
  "/",
  InventarioController.crearInventario
);

/* =====================================================
    OBTENER TODOS LOS INVENTARIOS
===================================================== */

/**
 * @openapi
 * /api/inventario:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener todos los inventarios
 *     description: Retorna todos los inventarios con almacén, sucursal y producto.
 *
 *     responses:
 *       200:
 *         description: Lista de inventarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventario'
 *
 *       500:
 *         description: Error al obtener inventarios
 */
router.get(
  "/",
  InventarioController.obtenerInventarios
);

/* =====================================================
    INVENTARIO DE BARRAS POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/inventario/sucursal/{idSucursal}/barra:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener inventarios de almacenes tipo barra
 *     description: Retorna los productos existentes en todos los almacenes tipo barra activos de una sucursal.
 *
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: string
 *         example: "64f111222333444555666777"
 *
 *     responses:
 *       200:
 *         description: Inventarios de los almacenes tipo barra
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventario'
 *
 *       404:
 *         description: No existen almacenes tipo barra activos
 *
 *       500:
 *         description: Error al obtener inventario de barra
 */
router.get(
  "/sucursal/:idSucursal/barra",
  InventarioController
    .obtenerInventarioBarraPorSucursal
);

/* =====================================================
    INVENTARIO PRINCIPAL POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/inventario/sucursal/{idSucursal}/principal:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener inventario del almacén principal
 *     description: Retorna el almacén principal activo y sus productos, cantidades, costos promedio y disponibilidad.
 *
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: string
 *         example: "64f111222333444555666777"
 *
 *     responses:
 *       200:
 *         description: Almacén principal e inventarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioPrincipalResponse'
 *
 *       404:
 *         description: No existe un almacén principal activo
 *
 *       500:
 *         description: Error al obtener el inventario principal
 */
router.get(
  "/sucursal/:idSucursal/principal",
  InventarioController
    .obtenerInventarioPrincipalPorSucursal
);

/* =====================================================
    TODOS LOS INVENTARIOS POR SUCURSAL
===================================================== */

/**
 * @openapi
 * /api/inventario/sucursal/{idSucursal}:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener todos los inventarios de una sucursal
 *     description: |
 *       Retorna los inventarios de todos los almacenes pertenecientes
 *       a la sucursal. Permite mostrar los productos agrupados por
 *       almacén en el frontend.
 *
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: string
 *         example: "64f111222333444555666777"
 *
 *     responses:
 *       200:
 *         description: Inventarios de la sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventario'
 *
 *       400:
 *         description: ID de sucursal no válido
 *
 *       500:
 *         description: Error al obtener inventarios de la sucursal
 */
router.get(
  "/sucursal/:idSucursal",
  InventarioController
    .obtenerInventariosPorSucursal
);

/* =====================================================
    APROBAR SOLICITUD Y TRANSFERIR INVENTARIO
===================================================== */

/**
 * @openapi
 * /api/inventario/solicitud/{idSolicitud}/aprobar-transferir:
 *   patch:
 *     tags:
 *       - Inventario
 *       - Solicitud
 *     summary: Aprobar solicitud y transferir inventario
 *     description: |
 *       Ejecuta el proceso completo:
 *
 *       1. Busca el almacén principal de la sucursal.
 *       2. Valida el stock de todos los productos.
 *       3. Marca la solicitud como aprobada.
 *       4. Resta las cantidades del almacén principal.
 *       5. Crea o actualiza el inventario del almacén destino.
 *       6. Calcula el costo promedio ponderado del destino.
 *       7. Registra movimientos de salida y entrada.
 *       8. Actualiza los detalles de la solicitud.
 *       9. Marca la solicitud como atendida.
 *
 *     parameters:
 *       - in: path
 *         name: idSolicitud
 *         required: true
 *         description: ID de la solicitud
 *         schema:
 *           type: string
 *         example: "64f999888777666555444333"
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualizadoPor:
 *                 type: string
 *                 example: "Administrador"
 *
 *     responses:
 *       200:
 *         description: Solicitud transferida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransferenciaSolicitudResponse'
 *
 *       400:
 *         description: Solicitud inválida, ya atendida o stock insuficiente
 *
 *       404:
 *         description: Solicitud o almacén no encontrado
 *
 *       500:
 *         description: Error al aprobar y transferir la solicitud
 */
router.patch(
  "/solicitud/:idSolicitud/aprobar-transferir",
  InventarioController
    .aprobarYTransferirSolicitud
);

/* =====================================================
    OBTENER INVENTARIO POR ID

    Esta ruta debe estar después de todas las rutas
    específicas como /sucursal y /solicitud.
===================================================== */

/**
 * @openapi
 * /api/inventario/{id}:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener un inventario por ID
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventario'
 *
 *       400:
 *         description: ID de inventario no válido
 *
 *       404:
 *         description: Inventario no encontrado
 *
 *       500:
 *         description: Error al obtener inventario
 */
router.get(
  "/:id",
  InventarioController
    .obtenerInventarioPorId
);

/* =====================================================
    ACTUALIZAR CONFIGURACIÓN DEL INVENTARIO
===================================================== */

/**
 * @openapi
 * /api/inventario/{id}:
 *   put:
 *     tags:
 *       - Inventario
 *     summary: Actualizar configuración del inventario
 *     description: |
 *       Permite modificar solamente el precio de venta, stock mínimo
 *       y estado. La cantidad y el costo promedio no se modifican
 *       directamente mediante este endpoint.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioUpdateInput'
 *
 *     responses:
 *       200:
 *         description: Inventario actualizado
 *
 *       400:
 *         description: Precio o stock mínimo no válido
 *
 *       404:
 *         description: Inventario no encontrado
 *
 *       500:
 *         description: Error al actualizar inventario
 */
router.put(
  "/:id",
  InventarioController
    .actualizarInventario
);

/* =====================================================
    ELIMINACIÓN LÓGICA
===================================================== */

/**
 * @openapi
 * /api/inventario/{id}:
 *   delete:
 *     tags:
 *       - Inventario
 *     summary: Desactivar un inventario
 *     description: Realiza una eliminación lógica cambiando el estado del inventario a falso.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario
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
 *         description: Inventario desactivado correctamente
 *
 *       404:
 *         description: Inventario no encontrado
 *
 *       500:
 *         description: Error al eliminar inventario
 */
router.delete(
  "/:id",
  InventarioController
    .eliminarInventario
);

export default router;