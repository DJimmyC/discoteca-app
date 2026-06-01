import { Request, Response } from "express";
import Inventario from "../models/Inventario";
import Almacen from "../models/Almacen";

export class InventarioController {
  //  Crear inventario
  static crearInventario = async (req: Request, res: Response) => {
    const inventario = new Inventario(req.body);
    try {
      await inventario.save();

      res.send('Inventario creada')
    } catch (error: any) {

      console.error(error);

      res.status(500).json({

        error:
          error.message,

      });

    }
  };

  //  Obtener todos
  static obtenerInventarios = async (_req: Request, res: Response) => {
    try {
      const inventarios = await Inventario.find()

        .populate({
          path: "idAlmacen",
          populate: {
            path: "idSucursal",
          },
        })

        .populate("idProducto");

      res.json(inventarios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener inventarios" });
    }
  };

  //  Obtener por ID
  static obtenerInventarioPorId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const inventario = await Inventario.findById(id)
        .populate("idProducto")
        .populate("idAlmacen");



      res.json(inventario);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener inventario" });
    }
  };

  //  Actualizar inventario
  static actualizarInventario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const inventario = await Inventario.findByIdAndUpdate(
        id,
        {
          ...req.body,
          fechaActualizacion: new Date(),
        },
        { new: true }
      );

      if (!inventario) {
        return res.status(404).json({ error: "Inventario no encontrado" });
      }

      res.json(inventario);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar inventario" });
    }
  };

  //  Eliminación lógica
  static eliminarInventario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const inventario = await Inventario.findByIdAndUpdate(
        id,
        {
          estado: false,
          fechaEliminado: new Date(),
          eliminadoPor: req.body.eliminadoPor,
        },
        { new: true }
      );

      if (!inventario) {
        return res.status(404).json({ error: "Inventario no encontrado" });
      }

      res.json({ message: "Inventario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar inventario" });
    }
  };

  // Obtener inventarios de almacenes tipo barra por sucursal
  static obtenerInventarioBarraPorSucursal = async (
    req: Request,
    res: Response
  ) => {

    try {

      const { idSucursal } = req.params;

      /*
        1. Buscar almacenes de la sucursal
        que sean de tipo barra
      */
      const almacenesBarra = await Almacen.find({
        idSucursal,
        tipo: "barra",
        estado: true,
      });

      /*
        2. Validar si la sucursal tiene almacenes tipo barra
      */
      if (almacenesBarra.length === 0) {
        return res.status(404).json({
          error: "No existen almacenes tipo barra para esta sucursal",
        });
      }

      /*
        3. Obtener solo los IDs de esos almacenes
      */
      const idsAlmacenesBarra = almacenesBarra.map(
        (almacen) => almacen._id
      );

      /*
        4. Buscar inventarios que pertenezcan
        a esos almacenes tipo barra
      */
      const inventarios = await Inventario.find({
        idAlmacen: {
          $in: idsAlmacenesBarra,
        },
        estado: true,
      })
        .populate({
          path: "idAlmacen",
          populate: {
            path: "idSucursal",
          },
        })
        .populate("idProducto");

      /*
        5. Responder inventarios encontrados
      */
      res.json(inventarios);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "Error al obtener inventarios de almacenes tipo barra",
      });

    }

  };
}
