import type { Request, Response } from "express"
import PerfilUsuario from "../models/PerfilUsuario"
import bcrypt from "bcrypt"
import { generateJWT } from "../utils/jst"

export class PerfilUsuarioController {


    static createPerfilUsuario = async (req: Request, res: Response) => {
        try {

            // hashear password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            const perfil = new PerfilUsuario({
                ...req.body,
                password: hashedPassword
            })

            await perfil.save()

            res.json({
                message: "Perfil usuario creado correctamente"
            })

        } catch (error: any) {
            console.log(error)

            // error duplicado índice
            if (error.code === 11000) {
                return res.status(400).json({
                    error: "El usuario ya tiene este rol en esa sucursal"
                })
            }

            res.status(500).json({ error: "Error al crear perfil usuario" })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            const perfil = await PerfilUsuario.findOne({
                email,
                estado: true
            })

            if (!perfil) {
                return res.status(404).json({
                    error: "Usuario no encontrado"
                })
            }

            const isMatch = await bcrypt.compare(
                password,
                perfil.password
            )

            if (!isMatch) {
                return res.status(400).json({
                    error: "Contraseña incorrecta"
                })
            }

            //  GENERAR TOKEN
            const tokenjwt = generateJWT({
                id: perfil._id.toString(),
                name: perfil.nombres
            })

            //  RESPUESTA ÚNICA
            return res.status(200).json({
                message: "Login correcto",
                tokenjwt,
                usuario: perfil
            })

        } catch (error) {

            console.log(error)

            return res.status(500).json({
                error: "Error en login",
                detalle: error instanceof Error ? error.message : error
            })
        }
    }


    // 🔐 Actualizar password
    static updatePassword = async (req: Request, res: Response) => {
        const { id } = req.params
        const { passwordActual, passwordNueva } = req.body

        try {
            const perfil = await PerfilUsuario.findById(id)

            if (!perfil) {
                return res.status(404).json({
                    error: "Usuario no encontrado"
                })
            }

            // validar password actual
            const isMatch = await bcrypt.compare(passwordActual, perfil.password)

            if (!isMatch) {
                return res.status(400).json({
                    error: "Contraseña actual incorrecta"
                })
            }

            // nueva contraseña hash
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(passwordNueva, salt)

            perfil.password = newPassword
            perfil.actualizadoPor = req.body.actualizadoPor
            perfil.fechaActualizacion = new Date()

            await perfil.save()

            res.json({
                message: "Contraseña actualizada correctamente"
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al actualizar contraseña" })
        }
    }


    //  Obtener todos
    static getAllPerfilUsuarios = async (req: Request, res: Response) => {
        try {
            const perfiles = await PerfilUsuario.find({})

                .populate('idRol')
                .populate('idSucursal')
                .populate('idAlmacen')

            res.json(perfiles)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener perfiles' })
        }
    }

    //  Obtener por ID
    static getPerfilUsuarioById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const perfil = await PerfilUsuario.findById(id)

                .populate('idRol')
                .populate('idSucursal')
                .populate('idAlmacen')

            if (!perfil) {
                const error = new Error('Perfil usuario no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(perfil)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener perfil usuario' })
        }
    }

    //  Actualizar perfil usuario
    static updatePerfilUsuario = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const perfil = await PerfilUsuario.findById(id)

            if (!perfil) {
                const error = new Error('Perfil usuario no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            //  actualización manual (igual a tu estilo)

            perfil.idRol = req.body.idRol || perfil.idRol
            perfil.idSucursal = req.body.idSucursal || perfil.idSucursal
            perfil.idAlmacen = req.body.idAlmacen || perfil.idAlmacen
            perfil.nombres = req.body.nombres || perfil.nombres
            perfil.apellidos = req.body.apellidos || perfil.apellidos
            perfil.edad = req.body.edad ?? perfil.edad
            perfil.sexo = req.body.sexo || perfil.sexo
            perfil.ci = req.body.ci || perfil.ci
            perfil.telefono = req.body.telefono || perfil.telefono
            perfil.email = req.body.email || perfil.email

            perfil.estado = req.body.estado ?? perfil.estado
            perfil.actualizadoPor = req.body.actualizadoPor
            perfil.fechaActualizacion = new Date()

            await perfil.save()

            res.send('Perfil usuario actualizado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar perfil usuario' })
        }
    }

    //  Eliminar (lógico)
    static deletePerfilUsuario = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const perfil = await PerfilUsuario.findById(id)

            if (!perfil) {
                const error = new Error('Perfil usuario no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            //  eliminación lógica
            perfil.estado = false
            perfil.eliminadoPor = req.body.eliminadoPor || 'admin'
            perfil.fechaEliminado = new Date()

            await perfil.save()

            res.send('Perfil usuario eliminado (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar perfil usuario' })
        }
    }
    static usuario = async (req: Request, res: Response) => {
        res.send(req.usuario)
        return
    }


    /* =========================
    OBTENER PERFILES POR SUCURSAL
========================= */

    static getPerfilUsuariosBySucursal = async (
        req: Request,
        res: Response
    ) => {

        const { idSucursal } = req.params;

        try {

            const perfiles = await PerfilUsuario.find({
                idSucursal,
            })

                .populate({
                    path: "idRol",
                    select: "_id nombre nombreRol descripcion estado",
                })
                .populate({
                    path: "idSucursal",
                    select: "_id nombreSucursal nombre ubicacionSucursal estado",
                })
                .populate({
                    path: "idAlmacen",
                    select: "_id nombre nombre ubicacionSucursal estado",
                })
                .sort({
                    fechaCreacion: -1,
                })
                .lean();

            if (perfiles.length === 0) {
                return res.json({
                    sucursal: null,
                    perfiles: [],
                });
            }

            const primerPerfil: any = perfiles[0];

            const sucursal = primerPerfil.idSucursal
                ? {
                    _id: primerPerfil.idSucursal._id,
                    nombreSucursal:
                        primerPerfil.idSucursal.nombreSucursal ||
                        primerPerfil.idSucursal.nombre ||
                        "Sucursal",
                    ubicacionSucursal:
                        primerPerfil.idSucursal.ubicacionSucursal || "",
                    estado:
                        primerPerfil.idSucursal.estado,
                }
                : null;

            const perfilesLimpios = perfiles.map(
                (perfil: any) => ({

                    _id:
                        perfil._id,


                    rol:
                        perfil.idRol
                            ? {
                                _id: perfil.idRol._id,
                                nombre:
                                    perfil.idRol.nombre ||
                                    perfil.idRol.nombreRol ||
                                    "Rol",
                                descripcion:
                                    perfil.idRol.descripcion,
                                estado:
                                    perfil.idRol.estado,
                            }
                            : null,
                    almacen:
                        perfil.idAlmacen
                            ?{
                                _id: perfil.idAlmacen._id,
                                nombre:
                                    perfil.idAlmacen.nombre||"almacen",
                                tipo: perfil.idAlmacen.tipo|| "categoria almacen"

                            }
                            :null,

                    nombres:
                        perfil.nombres,

                    apellidos:
                        perfil.apellidos,

                    edad:
                        perfil.edad,

                    sexo:
                        perfil.sexo,

                    ci:
                        perfil.ci,

                    telefono:
                        perfil.telefono,

                    email:
                        perfil.email,

                    estado:
                        perfil.estado,

                    creadoPor:
                        perfil.creadoPor,

                    actualizadoPor:
                        perfil.actualizadoPor,

                    eliminadoPor:
                        perfil.eliminadoPor,

                    fechaCreacion:
                        perfil.fechaCreacion,

                    fechaActualizacion:
                        perfil.fechaActualizacion,

                    fechaEliminado:
                        perfil.fechaEliminado,

                })
            );

            return res.json({
                sucursal,
                perfiles: perfilesLimpios,
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                error: "Error al obtener perfiles por sucursal",
            });

        }

    };
}

