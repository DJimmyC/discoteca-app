import { Router } from "express"
import { PerfilUsuarioController } from "../controllers/PerfilUsuarioController"
import { authenticate } from "../middleware/auth"

const router = Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     PerfilUsuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: ""
 *        
 *         idRol:
 *           type: string
 *           example: ""
 *         idSucursal:
 *           type: string
 *           example: ""
 *         idAlmacen:
 *           type: string
 *           example: ""
 *         nombres:
 *           type: string
 *           example: "Juan"
 *         apellidos:
 *           type: string
 *           example: "Perez"
 *         edad:
 *           type: number
 *           example: 25
 *         sexo:
 *           type: string
 *           example: "Masculino"
 *         ci:
 *           type: string
 *           example: "12345678"
 *         telefono:
 *           type: string
 *           example: "78945612"
 *         email:
 *           type: string
 *           example: "juan@gmail.com"
 *         password:
 *           type: string
 *           example "12345678"
 *         estado:
 *           type: boolean
 *           example: true
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
 *           example: "admin"
 *         fechaEliminado:
 *           type: string
 *           format: date-time
 *         eliminadoPor:
 *           type: string
 *           example: "admin"
 *
 *     PerfilUsuarioInput:
 *       type: object
 *       required:
 *         - idRol
 *         - idSucursal
 *         - idAlmacen
 *         - nombres
 *         - apellidos
 *         - password
 *       properties:
 *         idRol:
 *           type: string
 *         idSucursal:
 *           type: string
 *         idAlmacen:
 *           type: string
 *         nombres:
 *           type: string
 *         apellidos:
 *           type: string
 *         edad:
 *           type: number
 *         sexo:
 *           type: string
 *         ci:
 *           type: string
 *         telefono:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         estado:
 *           type: boolean
 *         creadoPor:
 *           type: string
 *         actualizadoPor:
 *           type: string
 *         eliminadoPor:
 *           type: string
 */

/**
 * @openapi
 * /api/perfilusuario:
 *   post:
 *     tags:
 *       - PerfilUsuario
 *     summary: Crear perfil usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerfilUsuarioInput'
 *     responses:
 *       200:
 *         description: Perfil creado correctamente
 */
router.post('/', PerfilUsuarioController.createPerfilUsuario)

/**
 * @openapi
 * /api/perfilusuario:
 *   get:
 *     tags:
 *       - PerfilUsuario
 *     summary: Obtener todos los perfiles
 *     responses:
 *       200:
 *         description: Lista de perfiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PerfilUsuario'
 */
router.get('/', PerfilUsuarioController.getAllPerfilUsuarios)
router.get('/usuario', authenticate, PerfilUsuarioController.usuario)
/**
 * @openapi
 * /api/perfilusuario/sucursal/{idSucursal}/personal:
 *   get:
 *     tags:
 *       - PerfilUsuario
 *     summary: Obtener todo el personal de una sucursal
 *     description: >
 *       Obtiene la información de todos los perfiles de usuario registrados
 *       en una sucursal determinada. La respuesta incluye los datos personales,
 *       el rol, el almacén, el estado del usuario y un resumen con la cantidad
 *       total de personal activo e inactivo.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal de la cual se obtendrá el personal
 *         schema:
 *           type: string
 *           example: "683f51a534b85c91b926a123"
 *     responses:
 *       200:
 *         description: Personal de la sucursal obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Personal de la sucursal obtenido correctamente"
 *                 sucursal:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "683f51a534b85c91b926a123"
 *                     nombre:
 *                       type: string
 *                       example: "Sucursal La Paz"
 *                     ubicacion:
 *                       type: string
 *                       example: "Zona Central"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                 cantidadPersonal:
 *                   type: integer
 *                   example: 5
 *                 cantidadActivos:
 *                   type: integer
 *                   example: 4
 *                 cantidadInactivos:
 *                   type: integer
 *                   example: 1
 *                 personal:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "683f51ec34b85c91b926a456"
 *                       nombres:
 *                         type: string
 *                         example: "Juan"
 *                       apellidos:
 *                         type: string
 *                         example: "Pérez"
 *                       nombreCompleto:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       edad:
 *                         type: integer
 *                         nullable: true
 *                         example: 25
 *                       sexo:
 *                         type: string
 *                         example: "Masculino"
 *                       ci:
 *                         type: string
 *                         example: "12345678"
 *                       telefono:
 *                         type: string
 *                         example: "78945612"
 *                       email:
 *                         type: string
 *                         example: "juan@gmail.com"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       rol:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                             example: "Administrador"
 *                           descripcion:
 *                             type: string
 *                             example: "Administrador de la sucursal"
 *                           estado:
 *                             type: boolean
 *                             example: true
 *                       almacen:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                             example: "Almacén principal"
 *                           tipo:
 *                             type: string
 *                             example: "Principal"
 *                           descripcion:
 *                             type: string
 *                           estado:
 *                             type: boolean
 *                             example: true
 *                       fechaCreacion:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       fechaActualizacion:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *       400:
 *         description: El ID de la sucursal no es válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El ID de la sucursal no es válido"
 *       500:
 *         description: Error interno al obtener el personal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener el personal de la sucursal"
 */
router.get(
    "/sucursal/:idSucursal/personal",
    PerfilUsuarioController.getPersonalBySucursal
)
/**
 * @openapi
 * /api/perfilusuario/{id}:
 *   get:
 *     tags:
 *       - PerfilUsuario
 *     summary: Obtener perfil por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', PerfilUsuarioController.getPerfilUsuarioById)

/**
 * @openapi
 * /api/perfilusuario/{id}:
 *   put:
 *     tags:
 *       - PerfilUsuario
 *     summary: Actualizar perfil usuario
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
 *             $ref: '#/components/schemas/PerfilUsuarioInput'
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.put('/:id', PerfilUsuarioController.updatePerfilUsuario)

/**
 * @openapi
 * /api/perfilusuario/{id}:
 *   delete:
 *     tags:
 *       - PerfilUsuario
 *     summary: Eliminar perfil (lógico)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         descripcion: ID del perfil uysuario
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
 *         description: Perfil eliminado
 */
router.delete('/:id', PerfilUsuarioController.deletePerfilUsuario)

/**
 * @openapi
 * /api/perfilusuario/login:
 *   post:
 *     tags:
 *       - PerfilUsuario
 *     summary: Login de usuario
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       404:
 *         description: No encontrado
 * 
 */
router.post("/login", PerfilUsuarioController.login)



/**
 * @openapi
 * /api/perfilusuario/password/{id}:
 *   put:
 *     tags:
 *       - PerfilUsuario
 *     summary: Actualizar contraseña
 *     responses:
 *       200:
 *         description: Contrasena actualizada
 *       404:
 *         description: No encontrado
 */
router.put("/password/:id", PerfilUsuarioController.updatePassword)

export default router
