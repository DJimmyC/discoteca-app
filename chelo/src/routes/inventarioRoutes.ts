// import { Router } from "express";
// import {InventarioController} from "../controllers/InventarioController";

// const router = Router();

// /**
//  * @openapi
//  * components:
//  *   schemas:
//  *     Inventario:
//  *       type: object
//  *       properties:
//  *         _id:
//  *           type: string
//  *           example: "64f123abc456"
//  *         idAlmacen:
//  *           type: string
//  *           example: "64faaa111"
//  *         idProducto:
//  *           type: string
//  *           example: "64fbbb222"
//  *         cantidad:
//  *           type: number
//  *           example: 100
//  *         costoUnitario:
//  *           type: number
//  *           example: 10.5
//  *         precioVenta:
//  *           type: number
//  *           example: 15
//  *         stockMinimo:
//  *           type: number
//  *           example: 10
//  *         estado:
//  *           type: boolean
//  *           example: true
//  *         fechaCreacion:
//  *           type: string
//  *           format: date-time
//  *         fechaActualizacion:
//  *           type: string
//  *           format: date-time
//  *         fechaEliminado:
//  *           type: string
//  *           format: date-time
//  *         creadoPor:
//  *           type: string
//  *           example: "admin"
//  *         actualizadoPor:
//  *           type: string
//  *         eliminadoPor:
//  *           type: string
//  *
//  *     InventarioInput:
//  *       type: object
//  *       required:
//  *         - idAlmacen
//  *         - idProducto
//  *         - cantidad
//  *         - costoUnitario
//  *         - precioVenta
//  *         - creadoPor
//  *       properties:
//  *        
//  *         idAlmacen:
//  *           type: string
//  *         idProducto:
//  *           type: string
//  *         cantidad:
//  *           type: number
//  *         costoUnitario:
//  *           type: number
//  *         precioVenta:
//  *           type: number
//  *         stockMinimo:
//  *           type: number
//  *         creadoPor:
//  *           type: string
//  *         actualizadoPor:
//  *           type: string
//  *         eliminadoPor:
//  *           type: string
//  */

// /**
//  * @openapi
//  * /api/inventario:
//  *   post:
//  *     tags:
//  *       - Inventario
//  *     summary: Crear inventario
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/InventarioInput'
//  *     responses:
//  *       201:
//  *         description: Inventario creado
//  *       500:
//  *         description: Error al crear inventario
//  */
// router.post("/", InventarioController.crearInventario);

// /**
//  * @openapi
//  * /api/inventario:
//  *   get:
//  *     tags:
//  *       - Inventario
//  *     summary: Obtener todos los inventarios
//  *     responses:
//  *       200:
//  *         description: Lista de inventarios
//  */
// router.get("/", InventarioController.obtenerInventarios);

// /**
//  * @openapi
//  * /api/inventario/{id}:
//  *   get:
//  *     tags:
//  *       - Inventario
//  *     summary: Obtener inventario por ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Inventario encontrado
//  *       404:
//  *         description: No encontrado
//  */
// router.get("/:id", InventarioController.obtenerInventarioPorId);

// /**
//  * @openapi
//  * /api/inventario/{id}:
//  *   put:
//  *     tags:
//  *       - Inventario
//  *     summary: Actualizar inventario
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/InventarioInput'
//  *     responses:
//  *       200:
//  *         description: Inventario actualizado
//  *       404:
//  *         description: No encontrado
//  */
// router.put("/:id", InventarioController.actualizarInventario);

// /**
//  * @openapi
//  * /api/inventario/{id}:
//  *   delete:
//  *     tags:
//  *       - Inventario
//  *     summary: Eliminar inventario (lógico)
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: false
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               eliminadoPor:
//  *                 type: string
//  *                 example: "admin"
//  *     responses:
//  *       200:
//  *         description: Inventario eliminado
//  */
// router.delete("/:id", InventarioController.eliminarInventario);

// export default router;

import { Router } from "express";
import { InventarioController } from "../controllers/InventarioController";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Inventario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         idAlmacen:
 *           type: string
 *           example: "64faaa111"
 *         idProducto:
 *           type: string
 *           example: "64fbbb222"
 *         cantidad:
 *           type: number
 *           example: 100
 *         costoUnitario:
 *           type: number
 *           example: 10.5
 *         precioVenta:
 *           type: number
 *           example: 15
 *         stockMinimo:
 *           type: number
 *           example: 10
 *         estado:
 *           type: boolean
 *           example: true
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *         fechaActualizacion:
 *           type: string
 *           format: date-time
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *         actualizadoPor:
 *           type: string
 *         eliminadoPor:
 *           type: string
 *
 *     InventarioInput:
 *       type: object
 *       required:
 *         - idAlmacen
 *         - idProducto
 *         - cantidad
 *         - costoUnitario
 *         - precioVenta
 *         - creadoPor
 *       properties:
 *         idAlmacen:
 *           type: string
 *         idProducto:
 *           type: string
 *         cantidad:
 *           type: number
 *         costoUnitario:
 *           type: number
 *         precioVenta:
 *           type: number
 *         stockMinimo:
 *           type: number
 *         creadoPor:
 *           type: string
 *         actualizadoPor:
 *           type: string
 *         eliminadoPor:
 *           type: string
 */

/**
 * @openapi
 * /api/inventario:
 *   post:
 *     tags:
 *       - Inventario
 *     summary: Crear inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioInput'
 *     responses:
 *       201:
 *         description: Inventario creado
 *       409:
 *         description: El producto ya existe en este almacén
 *       500:
 *         description: Error al crear inventario
 */
router.post("/", InventarioController.crearInventario);

/**
 * @openapi
 * /api/inventario:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener todos los inventarios
 *     responses:
 *       200:
 *         description: Lista de inventarios
 */
router.get("/", InventarioController.obtenerInventarios);

/**
 * @openapi
 * /api/inventario/sucursal/{idSucursal}/barra:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener inventarios de almacenes tipo barra por sucursal
 *     description: Lista los inventarios activos que pertenecen a almacenes de tipo barra de una sucursal específica.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal
 *         example: ""
 *     responses:
 *       200:
 *         description: Lista de inventarios de almacenes tipo barra
 *       404:
 *         description: No existen almacenes tipo barra para esta sucursal
 *       500:
 *         description: Error al obtener inventarios de almacenes tipo barra
 */
router.get(
  "/sucursal/:idSucursal/barra",
  InventarioController.obtenerInventarioBarraPorSucursal
);

/**
 * @openapi
 * /api/inventario/{id}:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener inventario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *       404:
 *         description: No encontrado
 */
router.get("/:id", InventarioController.obtenerInventarioPorId);

/**
 * @openapi
 * /api/inventario/{id}:
 *   put:
 *     tags:
 *       - Inventario
 *     summary: Actualizar inventario
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
 *             $ref: '#/components/schemas/InventarioInput'
 *     responses:
 *       200:
 *         description: Inventario actualizado
 *       404:
 *         description: No encontrado
 */
router.put("/:id", InventarioController.actualizarInventario);

/**
 * @openapi
 * /api/inventario/{id}:
 *   delete:
 *     tags:
 *       - Inventario
 *     summary: Eliminar inventario lógico
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
 *         description: Inventario eliminado
 */
router.delete("/:id", InventarioController.eliminarInventario);

export default router;