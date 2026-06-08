import { BrowserRouter, Routes, Route } from 'react-router-dom'
//admin
import AppLayout from './layouts/AppLayout'
import DashboardView from './views/DashboardView'
import CreateSucursalView from './views/sucursal/CreateSucursalView'
import EditSucursalView from '../src/views/sucursal/EditSucursalView'
import SucursalDetailsView from './views/sucursal/SucursalDetailsView'

import AlmacenDetailView from './views/almacen/AlmacenDetailView'
import CreateAlmacenView from './views/almacen/CreateAlmacenView'
import EditAlmacenView from './views/almacen/EditAlmacenView'

import CajaDetailView from './views/caja/CajaDetailView'
import CreateCajaView from './views/caja/CreateCajaView'
import EditCajaView from './views/caja/EditCajaView'

import AperturaCajaDetailView from './views/aperturaCaja/AperturaCajaDetailView'
import CreateAperturaCajaView from './views/aperturaCaja/CreateAperturaCajaView'
import EditAperturaCajaView from './views/aperturaCaja/EditAperturaCajaView'

import CierreCajaDetailView from './views/cierreCaja/CierreCajaDetailView'
import CreateCierreCajaView from './views/cierreCaja/CreateCierreCajaView'
import EditCierreCajaView from './views/cierreCaja/EditCierreCajaView'

import InventarioDetailView from './views/inventario/InventarioDetailView'
import CreateInventarioView from './views/inventario/CreateInventarioView'
import EditInventarioView from './views/inventario/EditInventarioView'

import CategoriaProductoDetailView from './views/categoriaProducto/CategoriaProductoDetailView'
import CreateCategoriaProductoView from './views/categoriaProducto/CreateCategoriaProductoView'
import EditCategoriaProductoView from './views/categoriaProducto/EditCategoriaProductoView'

import EgresoDetailView from './views/egreso/EgresoDetailView'
import CreateEgresoView from './views/egreso/CreateEgresoView'
import EditEgresoView from './views/egreso/EditEgresoView'


import RolDetailView from './views/rol/RolDetailView'
import CreateRolView from './views/rol/CreateRolView'
import EditRolView from './views/rol/EditRolView'



import PerfilUsuarioDetailView from './views/perfilUsuario/PerfilUsuarioDetailView'
import PersonalSucursalView from './views/perfilUsuario/PersonalSucursalView'
import CreatePerfilUsuarioView from './views/perfilUsuario/CreatePerfilUsuarioView'
import EditPerfilUsuarioView from './views/perfilUsuario/EditPerfilUsuarioView'


import PerfilView from './views/perfilUsuario/PerfilView'
import EditPerfilView from './views/perfilUsuario/EditPerfilView'

import ProductoDetailView from './views/producto/ProductoDetailView'
import CreateProductoView from './views/producto/CreateProductoView'
import EditProductoView from './views/producto/EditProductoView'
 

import SolicitudDetailView from './views/solicitud/SolicitudDetailView'
import CreateSolicitudView from './views/solicitud/CreateSolicitudView'
import EditSolicitudView from './views/solicitud/EditSolicitudView'

import MovimientoDetailView from './views/reporte/MovimientoDetailView'

//login
import AuthLayout from './layouts/AuthLayout'
import LoginView from './views/auth/LoginView'


//mesero
import MeseroLayout from './layouts/MeseroLayout'

import ComandaDetailView from './views/comanda/ComandaDetailView'


import DetalleComandaView from './views/detalleComandas/DetalleComandaView'
import EditDetalleComandaView from './views/detalleComandas/EditDetalleComandaView'

import PerfilMeseroView from './views/perfilUsuario/PerfilMeseroView'
import EditPerfilMeseroView from './views/perfilUsuario/EditPerfilMeseroView'


import VentaDetailView from './views/venta/VentaDetailView'
import { AuthProvider } from "../src/Context/AuthContext"



// reportes
import ReporteDashboardView from './views/reporte/ReporteDashboardView'
import ReporteEstadoResultadosView from './views/reporte/ReporteEstadoResultadosView'
import ReporteVentasView from './views/reporte/ReporteVentasView'
import ReporteProductosView from './views/reporte/ReporteProductosView'
import ReporteVendedoresView from './views/reporte/ReporteVendedoresView'
import ReporteMetodosPagoView from './views/reporte/ReporteMetodosPagoView'
import ReporteInventarioView from './views/reporte/ReporteInventarioView'
import ReporteStockBajoView from './views/reporte/ReporteStockBajoView'
import ReporteValorInventarioView from './views/reporte/ReporteValorInventarioView'
import ReporteKardexView from './views/reporte/ReporteKardexView'
import ReporteFlujoEfectivoView from './views/reporte/ReporteFlujoEfectivoView'
import ReporteCierresCajaView from './views/reporte/ReporteCierresCajaView'
import ReporteSolicitudesResumenView from './views/reporte/ReporteSolicitudesResumenView'

export default function Router() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route index element={<DashboardView />} />
                        <Route path='/sucursal/create' element={<CreateSucursalView />} />
                        <Route path='/sucursal/:sucursalId' element={<SucursalDetailsView />} />
                        <Route path='/sucursal/:sucursalId/edit' element={<EditSucursalView />} />

                        {/* <Route path="/sucursal/:sucursalId/almacen" /> */}
                        <Route path='/sucursal/:sucursalId/personal' element={<PersonalSucursalView />} />


                        <Route path='/sucursal/:sucursalId/almacen' element={<AlmacenDetailView />} />
                        <Route path='/sucursal/:sucursalId/almacen/create' element={<CreateAlmacenView />} />
                        <Route path='/sucursal/:sucursalId/almacen/:almacenId/edit' element={<EditAlmacenView />} />

                        <Route path='/sucursal/:sucursalId/caja' element={<CajaDetailView />} />
                        <Route path='/sucursal/:sucursalId/caja/create' element={<CreateCajaView />} />
                        <Route path='/sucursal/:sucursalId/caja/:cajaId/edit' element={<EditCajaView />} />
                        

                        <Route path='/sucursal/:sucursalId/caja/:cajaId/apertura' element={<AperturaCajaDetailView />} />
                        <Route path='/sucursal/:sucursalId/caja/:cajaId/apertura/create' element={<CreateAperturaCajaView />} />
                        <Route path='/sucursal/:sucursalId/caja/:cajaId/apertura/:aperturaId/edit' element={<EditAperturaCajaView />} />
                        
                        
                        <Route path='/sucursal/:sucursalId/caja/:cajaId/cierre' element={<CierreCajaDetailView />} />
                        <Route path='/sucursal/:sucursalId/caja/:cajaId/cierre/create' element={<CreateCierreCajaView />} />
                        <Route path='/sucursal/:sucursalId/caja/:cajaId/cierre/:cierreId/edit' element={<EditCierreCajaView />} />


                        <Route path='/sucursal/:sucursalId/inventario' element={<InventarioDetailView />} />
                        <Route path='/sucursal/:sucursalId/inventario/create' element={<CreateInventarioView />} />
                        <Route path='/sucursal/:sucursalId/inventario/:inventarioId/edit' element={<EditInventarioView />} />

                        <Route path='/sucursal/:sucursalId/egreso' element={<EgresoDetailView />} />
                        <Route path='/sucursal/:sucursalId/egreso/create' element={<CreateEgresoView />} />
                        <Route path='/sucursal/:sucursalId/egreso/:egresoId/edit' element={<EditEgresoView />} />

                        <Route path='/sucursal/:sucursalId/solicitud' element={<SolicitudDetailView />} />
                        <Route path='/sucursal/:sucursalId/solicitud/create' element={<CreateSolicitudView />} />
                        <Route path='/sucursal/:sucursalId/solicitud/:solicitudId/edit' element={<EditSolicitudView />} />

                        <Route path='/sucursal/:sucursalId/reportes' element={<ReporteDashboardView />} />
                        <Route path='/sucursal/:sucursalId/reportes/estado-resultados' element={<ReporteEstadoResultadosView />} />
                        <Route path='/sucursal/:sucursalId/reportes/ventas' element={<ReporteVentasView />} />
                        <Route path='/sucursal/:sucursalId/reportes/productos' element={<ReporteProductosView />} />
                        <Route path='/sucursal/:sucursalId/reportes/vendedores' element={<ReporteVendedoresView />} />
                        <Route path='/sucursal/:sucursalId/reportes/metodos-pago' element={<ReporteMetodosPagoView   />} />
                        <Route path='/sucursal/:sucursalId/reportes/inventario' element={<ReporteInventarioView   />} />
                        <Route path='/sucursal/:sucursalId/reportes/stock-bajo' element={<ReporteStockBajoView   />} />
                        <Route path='/sucursal/:sucursalId/reportes/valor-inventario' element={<ReporteValorInventarioView   />} />
                        <Route path='/sucursal/:sucursalId/reportes/kardex' element={<ReporteKardexView   />} />
                        <Route path='/sucursal/:sucursalId/reportes/flujo-efectivo' element={<ReporteFlujoEfectivoView   />} />
                        <Route path='/sucursal/:sucursalId/reportes/cierres-caja' element={<ReporteCierresCajaView   />} />
                        <Route path='/sucursal/:sucursalId/reportes/solicitudes' element={<ReporteSolicitudesResumenView   />} />


                        <Route path='/categoriaProducto/' element={<CategoriaProductoDetailView />} />
                        <Route path='/categoriaProducto/create' element={<CreateCategoriaProductoView />} />
                        <Route path='/categoriaProducto/:categoriaProductoId/edit' element={<EditCategoriaProductoView />} />

                        <Route path='/producto/' element={<ProductoDetailView />} />
                        <Route path='/producto/create' element={<CreateProductoView />} />
                        <Route path='/producto/:productoId/edit' element={<EditProductoView />} />


                        <Route path='/rol/' element={<RolDetailView />} />
                        <Route path='/rol/create' element={<CreateRolView />} />
                        <Route path='/rol/:rolId/edit' element={<EditRolView />} />

                 

                        <Route path='/perfilusuario/' element={<PerfilUsuarioDetailView />} />
                        <Route path='/perfilusuario/create' element={<CreatePerfilUsuarioView />} />
                        <Route path='/perfilusuario/:perfilUsuarioId/edit' element={<EditPerfilUsuarioView />} />


                        <Route path='/perfil/' element={<PerfilView />} />
                        <Route path='/perfil/:perfilId/edit' element={<EditPerfilView />} />
                        




                        

                        
                    </Route>

                    <Route element={<AuthLayout />}>
                        <Route path='/auth/login' element={<LoginView />} />
            
                    </Route>

                    
                    <Route element={<MeseroLayout />}>
                        <Route path='/mesero' element={<ComandaDetailView />} />
                        <Route path='/mesero/comandas' element={<DetalleComandaView />} />
                        <Route path='/comanda/:comandaId/edit' element={<EditDetalleComandaView />} />

                        <Route path='/mesero/ventas' element={<VentaDetailView />} />

                        <Route path='/mesero/perfil' element={<PerfilMeseroView />} />
                        <Route path='/mesero/perfil/:perfilId/edit' element={<EditPerfilMeseroView />} />

            
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )

}