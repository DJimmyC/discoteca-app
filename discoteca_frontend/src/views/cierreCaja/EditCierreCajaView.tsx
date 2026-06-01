// src/views/cierrecaja/EditCierreCajaView.tsx

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  Pencil,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import MenuList from "@/components/MenuList";

import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

import {

  getCierreCajaById,
  updateCierreCaja,

} from "@/api/CierreCajaApi";

import type {

  CierreCajaForm as CierreCajaFormType,

} from "@/types/CierreCajaType";

import { useAuth } from "@/hooks/useAuth";

export default function
  EditCierreCajaView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const params =
    useParams();

  const {data:perfil} =
    useAuth();

  const sucursalId =
    params.sucursalId!;

  const cajaId =
    params.cajaId!;

  const cierreCajaId =
    params.cierreId!;

  /* =========================
      FORM
  ========================= */

  const [formData, setFormData] =
    useState<CierreCajaFormType>({

      idPerfil: "",

      idSucursal:
        sucursalId,

      idCaja:
        cajaId,

      fechaApertura: "",

      fechaCierre: "",

      montoInicial: 0,

      totalVentas: 0,

      totalEgresos: 0,

      montoReal: 0,

      observacion: "",

      creadoPor: "",

      actualizadoPor:
        perfil?.nombres || "",

    });

  /* =========================
      QUERY
  ========================= */

  const {

    data,

    isLoading,

  } = useQuery({

    queryKey: [

      "editCierreCaja",

      cierreCajaId,

    ],

    queryFn: () =>

      getCierreCajaById(
        cierreCajaId
      ),

    retry: false,

  });

  /* =========================
      LOAD DATA
  ========================= */

  useEffect(() => {

    if (data) {

      setFormData({

        idPerfil:

          typeof data.idPerfil === "string"

            ? data.idPerfil

            : data.idPerfil?._id || "",

        idSucursal:

          typeof data.idSucursal === "string"

            ? data.idSucursal

            : data.idSucursal?._id || "",

        idCaja:

          typeof data.idCaja === "string"

            ? data.idCaja

            : data.idCaja?._id || "",

        fechaApertura:
          data.fechaApertura
            ?.slice(0, 16),

        fechaCierre:
          data.fechaCierre
            ?.slice(0, 16),

        montoInicial:
          data.montoInicial,

        totalVentas:
          data.totalVentas,

        totalEgresos:
          data.totalEgresos,

        montoReal:
          data.montoReal,

        observacion:
          data.observacion || "",

        creadoPor:
          data.creadoPor || "",

        actualizadoPor:
          perfil?.nombres || "",

      });

    }

  }, [
    data,
    perfil,
  ]);

  /* =========================
      MUTATION
  ========================= */

  const {

    mutate,

    isPending,

  } = useMutation({

    mutationFn: () =>

      updateCierreCaja({

        cierreCajaId,

        formData,

      }),

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

      queryClient.invalidateQueries({

        queryKey: [

          "cierresCaja",

          cajaId,

        ],

      });

      navigate(

        `/sucursal/${sucursalId}/caja/${cajaId}/cierre`

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

    mutate();

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
      <MenuList />

      {/* CONTENT */}
      <main className="flex-1 p-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <div className="mb-4">

              <Link

                to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre`}

                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:text-fuchsia-600
                "
              >

                <ArrowLeft className="h-4 w-4" />

                Volver

              </Link>

            </div>

            <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">

              <Pencil className="h-8 w-8 text-fuchsia-600" />

              Editar Cierre Caja

            </h1>

            <p className="mt-2 text-slate-500">

              Modifique los datos del cierre

            </p>

          </div>

        </div>

        {/* CARD */}

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
            mx-auto
            max-w-5xl
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-xl
          "
        >

          <CierreCajaForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            loading={isPending}

            submitText="Actualizar Cierre"

          />

        </motion.div>

      </main>

    </div>

  );

}