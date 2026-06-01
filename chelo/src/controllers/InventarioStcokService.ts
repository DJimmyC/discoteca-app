// src/services/InventarioStockService.ts

import mongoose from "mongoose";
import Inventario from "../models/Inventario";

type AjustarStockParams = {
    idAlmacen: string | mongoose.Types.ObjectId;
    idProducto: string | mongoose.Types.ObjectId;
    cantidad: number;
    tipo: "SUMAR" | "RESTAR";
    usuario?: string;
};

export async function ajustarStockInventario({
    idAlmacen,
    idProducto,
    cantidad,
    tipo,
    usuario = "sistema",
}: AjustarStockParams) {

    if (cantidad <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
    }

    /*
        RESTAR STOCK
        Se usa filtro cantidad >= cantidad para evitar stock negativo.
    */
    if (tipo === "RESTAR") {

        const inventarioActualizado =
            await Inventario.findOneAndUpdate(
                {
                    idAlmacen,
                    idProducto,
                    estado: true,
                    cantidad: {
                        $gte: cantidad,
                    },
                },
                {
                    $inc: {
                        cantidad: -cantidad,
                    },
                    $set: {
                        actualizadoPor: usuario,
                        fechaActualizacion: new Date(),
                    },
                },
                {
                    new: true,
                }
            );

        if (!inventarioActualizado) {
            throw new Error(
                "Stock insuficiente o inventario no encontrado para realizar la salida"
            );
        }

        return inventarioActualizado;

    }

    /*
        SUMAR STOCK
        Si ya existe inventario, aumenta.
        Si no existe, lo crea.
    */
    const inventarioActualizado =
        await Inventario.findOneAndUpdate(
            {
                idAlmacen,
                idProducto,
            },
            {
                $inc: {
                    cantidad,
                },
                $set: {
                    estado: true,
                    actualizadoPor: usuario,
                    fechaActualizacion: new Date(),
                },
                $setOnInsert: {
                    costoUnitario: 0,
                    precioVenta: 0,
                    stockMinimo: 0,
                    creadoPor: usuario,
                    fechaCreacion: new Date(),
                },
            },
            {
                new: true,
                upsert: true,
            }
        );

    return inventarioActualizado;

}