import type { Request, Response } from "express"
import Almacen from "../models/Almacen"

export class AlmacenController {

    //  Crear almacén
    static createAlmacen = async (req: Request, res: Response) => {
        const almacen = new Almacen(req.body)

        try {
            await almacen.save()
            res.send('Almacén creado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear almacén' })
        }
    }

    //  Obtener todos
    static getAllAlmacenes = async (req: Request, res: Response) => {
        try {
            const almacenes = await Almacen.find({})
                .populate('idSucursal')

            res.json(almacenes)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener almacenes' })
        }
    }

    //  Obtener por ID
    static getAlmacenById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const almacen = await Almacen.findById(id)
                .populate('idSucursal')

            if (!almacen) {
                return res.status(404).json({
                    error: 'Almacén no encontrado'
                })
            }

            res.json(almacen)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener almacén' })
        }
    }

    //  Actualizar almacén
    static updateAlmacen = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const almacen = await Almacen.findById(id)

            if (!almacen) {
                return res.status(404).json({
                    error: 'Almacén no encontrado'
                })
            }

            //  actualización manual
            almacen.idSucursal = req.body.idSucursal || almacen.idSucursal

            almacen.nombre = req.body.nombre || almacen.nombre
            almacen.descripcion = req.body.descripcion || almacen.descripcion
            almacen.tipo = req.body.tipo || almacen.tipo
    

            almacen.estado = req.body.estado ?? almacen.estado

            almacen.actualizadoPor = req.body.actualizadoPor
            almacen.fechaActualizacion = new Date()

            await almacen.save()

            res.send('Almacén actualizado')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar almacén' })
        }
    }

    //  Eliminar (lógico)
    static deleteAlmacen = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const almacen = await Almacen.findById(id)

            if (!almacen) {
                return res.status(404).json({
                    error: 'Almacén no encontrado'
                })
            }

            //  eliminación lógica
            almacen.estado = false
            almacen.eliminadoPor = req.body.eliminadoPor || "admin"
            almacen.fechaEliminado = new Date()

            await almacen.save()

            res.send('Almacén eliminado (lógico)')

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar almacén' })
        }
    }


    // Obtener almacenes por sucursal

    // Obtener almacenes por sucursal sin redundancia
    static getAlmacenesBySucursal = async (
        req: Request,
        res: Response
    ) => {

        const { idSucursal } = req.params;

        try {

            /*
                1. Buscar almacenes activos de la sucursal
            */
            const almacenes = await Almacen.find({
                idSucursal,
                estado: true,
            })
                .populate({
                    path: "idSucursal",
                    select: "_id nombreSucursal ubicacionSucursal",
                })
                .sort({
                    fechaCreacion: -1,
                })
                .lean();

            /*
                2. Si no existen almacenes
            */
            if (almacenes.length === 0) {
                return res.json({
                    sucursal: null,
                    almacenes: [],
                });
            }

            /*
                3. Sacar la sucursal una sola vez
            */
            const primerAlmacen: any = almacenes[0];

            const sucursal = primerAlmacen.idSucursal
                ? {
                    _id: primerAlmacen.idSucursal._id,
                    nombreSucursal: primerAlmacen.idSucursal.nombreSucursal,
                    ubicacionSucursal: primerAlmacen.idSucursal.ubicacionSucursal,
                }
                : null;

            /*
                4. Armar almacenes limpios sin repetir sucursal
            */
            const almacenesLimpios = almacenes.map(
                (almacen: any) => ({

                    _id:
                        almacen._id,

                    nombre:
                        almacen.nombre,

                    descripcion:
                        almacen.descripcion,

                    tipo:
                        almacen.tipo,

                 

                    estado:
                        almacen.estado,

                    creadoPor:
                        almacen.creadoPor,

                    actualizadoPor:
                        almacen.actualizadoPor,

                    eliminadoPor:
                        almacen.eliminadoPor,

                    fechaCreacion:
                        almacen.fechaCreacion,

                    fechaActualizacion:
                        almacen.fechaActualizacion,

                    fechaEliminado:
                        almacen.fechaEliminado,

                })
            );

            /*
                5. Respuesta final
            */
            return res.json({
                sucursal,
                almacenes: almacenesLimpios,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error: "Error al obtener almacenes por sucursal",
            });

        }

    };

    
}