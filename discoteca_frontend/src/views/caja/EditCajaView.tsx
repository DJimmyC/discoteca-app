// src/views/caja/EditCajaView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import Swal from "sweetalert2";

import {
  ArrowLeft,
} from "lucide-react";

import MenuListDashboard from "@/components/MenuListDashboard";

import CajaForm from "@/components/caja/CajaForm";

import {

  getCajaById,

  updateCaja,

} from "@/api/CajaApi";

import type {

  CajaForm as CajaFormType,

} from "@/types/CajaType";

export default function EditCajaView() {

  const navigate =
    useNavigate();

  const {
    cajaId,
    sucursalId,
  } = useParams();

  /* =========================
      FORM DATA
  ========================= */

  const [formData, setFormData] =
    useState<CajaFormType>({

      idSucursal:
        sucursalId || "",

      nombre: "",

      descripcion: "",

      estado: true,

      creadoPor: "",

    });

  /* =========================
      GET CAJA
  ========================= */

  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [

      "caja",

      cajaId,

    ],

    queryFn: () =>
      getCajaById(
        cajaId!
      ),

    enabled:
      !!cajaId,

    retry: false,

  });

  /* =========================
      LOAD DATA
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
      updateCaja,

    onSuccess: async (
      data
    ) => {

      await Swal.fire({

        icon: "success",

        title:
          data,

        timer: 2000,

        showConfirmButton: false,

      });

      navigate(

        `/sucursal/${sucursalId}/caja`

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

    mutate({

      cajaId:
        cajaId!,

      formData: {

        ...formData,

        creadoPor:
          undefined,

      },

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

      {/* CONTENT */}
      <main className="flex-1 p-8">

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >

          {/* TOP */}
          <div className="mb-8 flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-black text-slate-800">

                Editar Caja

              </h1>

              <p className="mt-2 text-slate-500">

                Modifica la información de la caja

              </p>

            </div>

            <Link

              to={`/sucursal/${sucursalId}/caja`}

              className="
                inline-flex
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

              <ArrowLeft className="h-4 w-4" />

              Volver

            </Link>

          </div>

          {/* FORM */}
          <CajaForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            loading={isPending}

            submitText="Actualizar Caja"

          />

        </motion.div>

      </main>

    </div>

  );

}