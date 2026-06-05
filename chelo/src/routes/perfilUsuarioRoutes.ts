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
 * /api/perfilusuario/sucursal/{idSucursal}:
 *   get:
 *     tags:
 *       - PerfilUsuario
 *     summary: Obtener perfiles de usuario por sucursal
 *     description: Retorna la sucursal una sola vez y todos los perfiles de usuario asociados a esa sucursal, incluyendo usuario y rol sin repetir datos innecesarios.
 *     parameters:
 *       - in: path
 *         name: idSucursal
 *         required: true
 *         description: ID de la sucursal.
 *         schema:
 *           type: string
 *         example: ""
 *     responses:
 *       200:
 *         description: Lista de perfiles por sucursal
 *       500:
 *         description: Error al obtener perfiles por sucursal
 */
router.get(
    "/sucursal/:idSucursal",
    PerfilUsuarioController.getPerfilUsuariosBySucursal
);
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
