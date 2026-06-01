import { getUser } from "@/api/PerfilUsuarioApi"
import { useQuery } from "@tanstack/react-query"



export const useAuth = () =>{

    const{data, isError, isLoading} = useQuery({
        queryKey:['usuario'],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false
    })

    return {data,isError,isLoading}
}