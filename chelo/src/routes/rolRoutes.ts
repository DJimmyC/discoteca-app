/**
 * @openapi
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         nombre:
 *           type: string
 *           example: "Administrador"
 *         descripcion:
 *           type: string
 *           example: "Rol con acceso completo al sistema"
 *         estado:
 *           type: boolean
 *           example: true
 *         ventas:
 *           type: boolean
 *           example: true
 *         egresos:
 *           type: boolean
 *           example: true
 *         inventario:
 *           type: boolean
 *           example: true
 *         reportes:
 *           type: boolean
 *           example: true
 *         usuarios:
 *           type: boolean
 *           example: true
 *         configuracion:
 *           type: boolean
 *           example: true
 *         fechaCreacion:
 *           type: string
 *           format: date
 *           example: "2026-05-02"
 *         creadoPor:
 *           type: string
 *           example: "admin"
 *         fechaActualizacion:
 *           type: string
 *           format: date
 *           example: "2026-05-02"
 *         actualizadoPor:
 *           type: string
 *           example: "admin"
 *         fechaEliminado:
 *           type: string
 *           format: date
 *           example: "2026-05-02"
 *         eliminadoPor:
 *           type: string
 *           example: "admin"
 *
 *     RolInput:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Administrador"
 *         descripcion:
 *           type: string
 *           example: "Rol con acceso completo al sistema"
 *         estado:
 *           type: boolean
 *           example: true
 *         ventas:
 *           type: boolean
 *           example: true
 *         egresos:
 *           type: boolean
 *           example: true
 *         inventario:
 *           type: boolean
 *           example: true
 *         reportes:
 *           type: boolean
 *           example: true
 *         usuarios:
 *           type: boolean
 *           example: true
 *         configuracion:
 *           type: boolean
 *           example: true
 *         creadoPor:
 *           type: string
 *           example: "admin"
 */

import { Router } from "express"
import { body, param } from "express-validator"
import { RolController } from "../controllers/RolController"
import { handleInputErrors } from "../middleware/validation"

const router = Router()

/**
 * @openapi
 * /api/rol:
 *   post:
 *     tags:
 *       - Rol
 *     summary: Crear un nuevo rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolInput'
 *     responses:
 *       200:
 *         description: Rol creado
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear rol
 */
router.post(
    "/",
    body("nombre")
        .notEmpty().withMessage("El nombre del rol es obligatorio"),

    body("descripcion")
        .optional()
        .isLength({ max: 150 }).withMessage("La descripción no puede tener más de 150 caracteres"),

    body("estado")
        .optional()
        .isBoolean().withMessage("El estado debe ser true o false"),

    body("ventas")
        .optional()
        .isBoolean().withMessage("El permiso ventas debe ser true o false"),

    body("egresos")
        .optional()
        .isBoolean().withMessage("El permiso egresos debe ser true o false"),

    body("inventario")
        .optional()
        .isBoolean().withMessage("El permiso inventario debe ser true o false"),

    body("reportes")
        .optional()
        .isBoolean().withMessage("El permiso reportes debe ser true o false"),

    body("usuarios")
        .optional()
        .isBoolean().withMessage("El permiso usuarios debe ser true o false"),

    body("configuracion")
        .optional()
        .isBoolean().withMessage("El permiso configuración debe ser true o false"),

    handleInputErrors,
    RolController.createRol
)

/**
 * @openapi
 * /api/rol:
 *   get:
 *     tags:
 *       - Rol
 *     summary: Obtener todos los roles
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error al obtener roles
 */
router.get("/", RolController.getAllRoles)

/**
 * @openapi
 * /api/rol/{id}:
 *   get:
 *     tags:
 *       - Rol
 *     summary: Obtener un rol por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al obtener rol
 */
router.get(
    "/:id",
    param("id").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    RolController.getRolById
)

/**
 * @openapi
 * /api/rol/{id}:
 *   put:
 *     tags:
 *       - Rol
 *     summary: Actualizar un rol por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolInput'
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al actualizar rol
 */
router.put(
    "/:id",
    param("id").isMongoId().withMessage("ID no válido"),

    body("nombre")
        .optional()
        .notEmpty().withMessage("El nombre del rol no puede estar vacío"),

    body("descripcion")
        .optional()
        .isLength({ max: 150 }).withMessage("La descripción no puede tener más de 150 caracteres"),

    body("estado")
        .optional()
        .isBoolean().withMessage("El estado debe ser true o false"),

    body("ventas")
        .optional()
        .isBoolean().withMessage("El permiso ventas debe ser true o false"),

    body("egresos")
        .optional()
        .isBoolean().withMessage("El permiso egresos debe ser true o false"),

    body("inventario")
        .optional()
        .isBoolean().withMessage("El permiso inventario debe ser true o false"),

    body("reportes")
        .optional()
        .isBoolean().withMessage("El permiso reportes debe ser true o false"),

    body("usuarios")
        .optional()
        .isBoolean().withMessage("El permiso usuarios debe ser true o false"),

    body("configuracion")
        .optional()
        .isBoolean().withMessage("El permiso configuración debe ser true o false"),

    handleInputErrors,
    RolController.updateRol
)

/**
 * @openapi
 * /api/rol/{id}:
 *   delete:
 *     tags:
 *       - Rol
 *     summary: Eliminación lógica de un rol
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del rol
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
 *         description: Rol eliminado lógicamente
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error al eliminar rol
 */
router.delete(
    "/:id",
    param("id").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    RolController.deleteRol
)

export default router