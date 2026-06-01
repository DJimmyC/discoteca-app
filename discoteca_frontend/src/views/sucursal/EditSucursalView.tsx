
import { Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSucursalById } from '@/api/SucursalApi'
import EditSucursalForm from '@/components/sucursal/EditSucursalForm'

export default function EditSucursalView() {
    const params = useParams()
    const sucursalId = params.sucursalId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editSucursal', sucursalId],
        queryFn: () => getSucursalById(sucursalId),
        retry: false
    })

    if (isLoading) return ('Cargando...')
   if (isError) return <Navigate to='/404' />
   if (data) return <EditSucursalForm data={data }  sucursalId={sucursalId}/>


}