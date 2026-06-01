/**
 * @openapi
 * components:
 *   schemas:
 *     Sucursal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f123abc456"
 *         nombreSucursal:
 *           type: string
 *           example: "Sucursal Central"
 *         ubicacionSucursal:
 *           type: string
 *           example: "La Paz"
 *         us_creado:
 *            type: string
 *            example: "usuario"
 *     SucursalInput:
 *       type: object
 *       required:
 *         - nombreSucursal
 *         - ubicacionSucursal
 *         - us_creado
 *       properties:
 *         nombreSucursal:
 *           type: string
 *         ubicacionSucursal:
 *           type: string
 *         us_creado:
 *           type:
 */
import { Router } from "express";
import { body, param } from "express-validator";

import { SucursalController } from "../controllers/SucursalController";

import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";


const router = Router()
// router.use(authenticate)
// sucursal
/**
 * @openapi
 * /api/sucursal:
 *   post:
 *     summary: Crear una sucursal
 *     tags:
 *       - Sucursal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SucursalInput'
 *     responses:
 *       201:
 *         description: Sucursal creada correctamente
 *       400:
 *         description: Error de validación
 */
router.post('/',
    
    body('nombreSucursal').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('ubicacionSucursal').notEmpty().withMessage('La ubicacion no puede ir vacio'),
    handleInputErrors
    , SucursalController.createSucursal)

/**
 * @openapi
 * /api/sucursal:
 *   get:
 *     summary: Obtener todas las sucursales
 *     tags:
 *       - Sucursal
 *     responses:
 *       200:
 *         description: Lista de sucursales
 */
router.get('/', SucursalController.getAllSucursal)

/**
 * @openapi
 * /api/sucursal/{id}:
 *   get:
 *     summary: Obtener una sucursal por ID
 *     tags:
 *       - Sucursal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB
 *     responses:
 *       200:
 *         description: Sucursal encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors
    , SucursalController.getSucursalById)

 /**
 * @openapi
 * /api/sucursal/{id}:
 *   put:
 *     summary: Actualizar una sucursal
 *     tags:
 *       - Sucursal
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
 *             $ref: '#/components/schemas/SucursalInput'
 *     responses:
 *       200:
 *         description: Sucursal actualizada
 */
router.put('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    body('nombreSucursal').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('ubicacionSucursal').notEmpty().withMessage('La ubicacion no puede ir vacio'),
    handleInputErrors,
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors
    , SucursalController.updateSucursal)
/**
 * @openapi
 * /api/sucursal/{id}:
 *   delete:
 *     summary: Eliminar una sucursal
 *     tags:
 *       - Sucursal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 */
router.delete('/:id', SucursalController.deleteSucursal)


export default router