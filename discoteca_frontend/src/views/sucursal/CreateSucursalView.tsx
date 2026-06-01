import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useEffect } from "react"

import SucursalForm from "@/components/sucursal/SucursalForm"
import { createSucursal } from "@/api/SucursalApi"
import { useAuth } from "@/hooks/useAuth"
import { ArrowLeft } from "lucide-react";

import type { SucursalFormData } from "@/types/SucursalType"

export default function CreateSucursalView() {

  const navigate = useNavigate()
  const { data: usuario } = useAuth()


  const initialValues: SucursalFormData = {
    nombreSucursal: "",
    ubicacionSucursal: "",
    us_creado: usuario?._id!
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SucursalFormData>({
    defaultValues: initialValues
  })

  /* =========================
     🚀 MUTATION
  ========================= */
  const { mutate } = useMutation({
    mutationFn: createSucursal,

    onError: async (error: any) => {
      await Swal.fire({
        icon: 'error',
        title: error.message,
        timer: 2000,
        showConfirmButton: false,
      })
    },

    onSuccess: async (data) => {
      await Swal.fire({
        icon: 'success',
        title: data,
        timer: 2000,
        showConfirmButton: false,
      })

      toast.success(data)
      navigate('/')
    }
  })


  const handleForm = (formData: SucursalFormData) => {
    mutate({
      ...formData,
      fecha_creado: new Date().toISOString().split("T")[0]
    })
  }

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-5xl font-black">
        Crear Discoteca
      </h1>

      <p className="text-2xl font-light text-gray-500 mt-5">
        Llena el siguiente formulario para registrar la discoteca
      </p>

      <nav className="my-5">
        <Link
          to="/"
          title="Volver a sucursales"
          aria-label="Volver a sucursales"
          className="
      inline-flex
      h-12
      w-12
      items-center
      justify-center
      rounded-2xl
      bg-fuchsia-700
      text-white
      shadow-lg
      shadow-fuchsia-700/30
      transition-all
      duration-300
      hover:-translate-x-1
      hover:bg-fuchsia-800
      hover:shadow-fuchsia-800/40
      active:scale-95
    "
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </nav>

      <form
        className="mt-10 bg-white shadow-lg p-10 rounded-lg"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <SucursalForm
          register={register}
          errors={errors}
        />

        <input
          type="submit"
          value='Crear Sucursal'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
        />
      </form>
    </div>
  )
}