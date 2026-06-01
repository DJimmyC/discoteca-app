import mongoose, { Schema, Document } from "mongoose";

export interface SucursalType extends Document  {
    nombreSucursal: string
    ubicacionSucursal: string
    us_creado: string
    us_modificado?: string
    us_eliminado?: string
    fecha_creado: Date
    fecha_modificado?: Date
    fecha_eliminado?: Date
}

const SucursalSchema: Schema = new Schema({
    nombreSucursal: {
        type: String,
        required: true,
        trim: true
    },
    ubicacionSucursal: {
        type: String,
        required: true,
        trim: true
    }, us_creado: {
        type: String,
        required: true,
        trim: true
    }, us_modificado: {
        type: String,
        required: false,
        trim: true
    }, us_eliminado: {
        type: String,
        required: false,
        trim: true
    },
    fecha_creado: {
        type: Date,
        required: true,
        default:Date.now
    },
    fecha_modificado: {
        type: Date,
        required: false,
    },
    fecha_eliminado: {
        type: Date,
        required: false,
    },


})

const Sucursal = mongoose.model<SucursalType>('Sucursal',SucursalSchema)
export default Sucursal