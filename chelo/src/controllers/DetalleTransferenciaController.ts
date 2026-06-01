import { Request, Response } from "express"
import DetalleTransferencia from "../models/DetalleTransferencia"

export class DetalleTransferenciaController {

  //  Crear detalle de transferencia
  static async createDetalle(req: Request, res: Response) {
    try {
      const detalle = new DetalleTransferencia(req.body)
      await detalle.save()

      res.json({
        message: "Detalle de transferencia creado correctamente",
        data: detalle
      })

    } catch (error) {
      res.status(500).json({
        error: "Error al crear detalle de transferencia"
      })
    }
  }

  //  Obtener todos
  static async getAllDetalles(req: Request, res: Response) {
    try {
      const detalles = await DetalleTransferencia.find()
        .populate("idProducto")
        .populate("idTransferencia")

      res.json(detalles)

    } catch (error) {
      res.status(500).json({
        error: "Error al obtener detalles"
      })
    }
  }

  //  Obtener por ID
  static async getDetalleById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const detalle = await DetalleTransferencia.findById(id)
        .populate("idProducto")
        .populate("idTransferencia")

      if (!detalle) {
        return res.status(404).json({
          error: "Detalle no encontrado"
        })
      }

      res.json(detalle)

    } catch (error) {
      res.status(500).json({
        error: "Error al obtener detalle"
      })
    }
  }

  //  Actualizar
  static async updateDetalle(req: Request, res: Response) {
    try {
      const { id } = req.params

      const detalle = await DetalleTransferencia.findByIdAndUpdate(
        id,
        {
          ...req.body,
          fechaActualizacion: new Date()
        },
        { new: true }
      )

      if (!detalle) {
        return res.status(404).json({
          error: "Detalle no encontrado"
        })
      }

      res.json({
        message: "Detalle actualizado correctamente",
        data: detalle
      })

    } catch (error) {
      res.status(500).json({
        error: "Error al actualizar detalle"
      })
    }
  }

  //  Eliminación lógica
  static async deleteDetalle(req: Request, res: Response) {
    try {
      const { id } = req.params

      const detalle = await DetalleTransferencia.findByIdAndUpdate(
        id,
        {
          fechaEliminado: new Date(),
          eliminadoPor: req.body.eliminadoPor || "system"
        },
        { new: true }
      )

      if (!detalle) {
        return res.status(404).json({
          error: "Detalle no encontrado"
        })
      }

      res.json({
        message: "Detalle eliminado correctamente",
        data: detalle
      })

    } catch (error) {
      res.status(500).json({
        error: "Error al eliminar detalle"
      })
    }
  }

}