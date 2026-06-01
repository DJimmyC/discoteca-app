// src/views/almacen/EditAlmacenView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
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

  getAlmacenById,

  updateAlmacen,

} from "@/api/AlmacenApi";

import {
  getSucursal,
} from "@/api/SucursalApi";

import type {

  AlmacenFormData,

} from "@/types/AlmacenType";

import {
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function EditAlmacenView() {

  const navigate =
    useNavigate();

  const params = useParams();

  const sucursalId =    params.sucursalId!;
  const almacenId =    params.almacenId!;
  const {data:perfil} = useAuth()
  /* =========================
      FORM DATA
  ========================= */

  const [formData, setFormData] =
    useState<AlmacenFormData>({

      idSucursal: "",

      nombre: "",

      descripcion: "",

      tipo: "principal",

     

      estado: true,

      actualizadoPor: perfil?._id!,

    });

  /* =========================
      GET ALMACEN
  ========================= */

  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [

      "almacen",

      almacenId,

    ],

    queryFn: () =>
      getAlmacenById(
        almacenId
      ),

    enabled:
      !!almacenId,

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
      CARGAR DATA
  ========================= */

  useEffect(() => {

    if (data) {

      setFormData({

        idSucursal:

          typeof data.idSucursal ===
          "string"

            ? data.idSucursal

            : data.idSucursal?._id || "",

        nombre:
          data.nombre || "",

        descripcion:
          data.descripcion || "",

        tipo:
          data.tipo || "principal",

        ubicacion:
          data.ubicacion || "",

        estado:
          data.estado ?? true,

        creadoPor:
          data.creadoPor || "",

      });

    }

  }, [data]);

  /* =========================
      UPDATE
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      updateAlmacen,

    onSuccess: async (
      data
    ) => {

      await Swal.fire({

        icon: "success",

        title: data,

        timer: 2000,

        showConfirmButton: false,

      });

      navigate(-1);

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

    mutate({

      formData,

      almacenId,

    });

  };

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (

      <div className="flex h-screen items-center justify-center bg-slate-50">

        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>

      </div>

    );

  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENIDO */}
      <main className="flex-1 p-8">

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-800">
                Editar Almacén
              </h1>

              <p className="mt-2 text-slate-500">
                Modifica la información del almacén
              </p>

            </div>

            {/* VOLVER */}
            <Link
              to={-1 as any}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-300
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >

              <ArrowLeft className="h-5 w-5" />

              Volver

            </Link>

          </div>

          {/* FORM */}
          <AlmacenForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            sucursales={sucursales}

            loading={isPending}

            submitText="Actualizar Almacén"

          />

        </div>

      </main>

    </div>

  );

}