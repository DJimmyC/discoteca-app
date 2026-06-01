// src/views/almacen/CreateAlmacenView.tsx

import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";

import AlmacenForm from "@/components/almacen/AlmacenForm";

import {
  createAlmacen,
} from "@/api/AlmacenApi";

import {
  getSucursal,
} from "@/api/SucursalApi";

import type {

  AlmacenFormData,

} from "@/types/AlmacenType";
import { useAuth } from "@/hooks/useAuth";

export default function CreateAlmacenView() {

  const navigate =
    useNavigate();

    const {data:perfil }= useAuth()
  const params =
    useParams();

  const sucursalId =
    params.sucursalId || "";

  /* =========================
      FORM DATA
  ========================= */

  const [formData, setFormData] =
    useState<AlmacenFormData>({

      idSucursal:
        sucursalId,

      nombre: "",

      descripcion: "",

      tipo:
        "principal",

     

      estado: true,

      creadoPor: perfil?._id!
        

    });

  /* =========================
      GET SUCURSALES
  ========================= */

  const {
    data: sucursales = [],
  } = useQuery({

    queryKey: [
      "sucursales"
    ],

    queryFn:
      getSucursal,

  });

  /* =========================
      CREATE
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createAlmacen,

    onSuccess: async (
      data
    ) => {

      await Swal.fire({

        icon: "success",

        title: data,

        timer: 2000,

        showConfirmButton: false,

      });

      navigate(
        `/sucursal/${sucursalId}/almacen`
      );

    },

    onError: async (
      error: any
    ) => {

      await Swal.fire({

        icon: "error",

        title:
          error.message,

      });

    },

  });

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    mutate(formData);

  };

  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENIDO */}
      <main className="flex-1 p-8">

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <div className="mb-8">

            <h1 className="text-3xl font-black text-slate-800">
              Nuevo Almacén
            </h1>

            <p className="mt-2 text-slate-500">
              Registra un nuevo almacén
            </p>

          </div>

          {/* FORM */}
          <AlmacenForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            sucursales={sucursales}

            loading={isPending}

            submitText="Crear Almacén"

          />

        </div>

      </main>

    </div>

  );

}