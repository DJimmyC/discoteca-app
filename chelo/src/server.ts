import  express  from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import sucursalRoutes from './routes/sucursalRoutes'
import rolRoutes from './routes/rolRoutes'
import perfilusuarioRoutes from './routes/perfilUsuarioRoutes'
import categoriaProductoRoutes from './routes/categoriaProductoRoutes'
import ConversionProductoRoutes from './routes/conversionProductoRoutes'
import detallComandaRoutes from './routes/detalleComandaRoutes'
import comandaRoutes from './routes/comandaRoutes'

import cajaRoutes from './routes/cajaRoutes'
import aperturaCajaRoutes from './routes/aperturaCajaRoutes'
import cierreCajaRoutes from './routes/cierreCajaRoutes'
import ventaroutes from './routes/ventaRoutes'
import detalleventaRoutes from './routes/detalleVentaRoutes'
import productoRoutes from './routes/productoRoutes'
import egresoRoutes from './routes/egresoRoutes'
import almacenRoutes from './routes/almacenRoutes'
import detalleegresoRoutes from './routes/detalleEgresoRoutes'
import solicitudRoutes from './routes/solicitudRoutes'
import detallesolicitudRoutes from './routes/detallSolicitudRoutes'
import detalleTransferenciaRoutes from './routes/detalleTransferenciaRoutes'
import trasnferenciaInventarioRoutes from './routes/transferenciaInventarioRoutes'
import inventarioRoutes from './routes/inventarioRoutes'
import movimientoInventarioRoutes from './routes/movimientoInventarioRoutes'
import reporteRoutes from './routes/reporteRoutes'
import swaggerUi, { serve } from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
dotenv.config()


connectDB()
const app = express()
app.use(cors(corsConfig))
//logging 
app.use(morgan('dev'))
// leer datos de formularios
app.use(express.json())

//routes


app.use('/api/sucursal',sucursalRoutes)
app.use('/api/rol', rolRoutes)
app.use('/api/perfilusuario', perfilusuarioRoutes)
app.use('/api/perfilusuario/login', perfilusuarioRoutes)

app.use('/api/perfilusuario/password', perfilusuarioRoutes)

app.use('/api/categoriaproducto',categoriaProductoRoutes)
app.use('/api/producto', productoRoutes)
app.use('/api/conversionproducto',ConversionProductoRoutes)

app.use('/api/detallecomanda',detallComandaRoutes)

app.use('/api/caja',cajaRoutes)
app.use('/api/aperturacaja', aperturaCajaRoutes)
app.use('/api/cierrecaja',cierreCajaRoutes)
app.use('/api/venta',ventaroutes)
app.use('/api/detalleventa',detalleventaRoutes)
app.use('/api/egreso',egresoRoutes)
app.use('/api/detalleegreso',detalleegresoRoutes)
app.use('/api/solicitud',solicitudRoutes)
app.use('/api/detallesolicitud',detallesolicitudRoutes)
app.use('/api/comanda',comandaRoutes)
app.use('/api/transferenciainventario',trasnferenciaInventarioRoutes)
app.use('/api/detalletransferencia',detalleTransferenciaRoutes)
app.use('/api/inventario',inventarioRoutes)
app.use('/api/almacen',almacenRoutes)
app.use('/api/movimientoinventario', movimientoInventarioRoutes)
app.use('/api/reportes', reporteRoutes)



// documentacion
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app 