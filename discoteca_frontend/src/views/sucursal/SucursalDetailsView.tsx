import { Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSucursalById } from '@/api/SucursalApi'
import MenuList from '@/components/MenuList'
import type { SucursalType } from '@/types/SucursalType'
import Card from "@/components/card"

export default function SucursalDetailsView() {

  const params = useParams()
  const sucursalId = params.sucursalId

  if (!sucursalId) return <Navigate to="/404" />

  const { data, isLoading, isError } = useQuery<SucursalType>({
    queryKey: ['sucursal', sucursalId],
    queryFn: () => getSucursalById(sucursalId),
    retry: false
  })

  if (isLoading) return <p className="p-5">Cargando...</p>
  if (isError || !data) return <Navigate to="/404" />

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
  
  {/* SIDEBAR */}
  {/* <MenuList sucursalId={sucursalId} /> */}
  <MenuList  />

  {/* CONTENIDO */}
  <main className="
    flex-1 
    flex 
    flex-col 
    overflow-y-auto
  ">

    <div className="p-6 md:p-8 w-full max-w-none">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {data.nombreSucursal}
        </h1>

        <p className="text-gray-500 mt-1">
           {data.ubicacionSucursal}
        </p>
      </div>

      {/* GRID */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4
        gap-6
        w-full
      ">
        <Card title="Inventario" desc="Controla productos y stock" />
        <Card title="Ventas" desc="Gestiona ventas y comandas" />
        <Card title="Caja" desc="Control financiero diario" />
        <Card title="Usuarios" desc="Administración de personal" />
      </div>

    </div>

  </main>

</div>
  )
}