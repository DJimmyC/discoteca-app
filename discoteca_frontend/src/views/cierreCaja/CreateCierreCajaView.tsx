// src/views/cierrecaja/CreateCierreCajaView.tsx

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  Wallet,
} from "lucide-react";

import {
  useState,
} from "react";

import Swal from "sweetalert2";

import MenuList from "@/components/MenuList";

import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

import {
  createCierreCaja,
} from "@/api/CierreCajaApi";

import type {
  CierreCajaForm as CierreCajaFormType,
} from "@/types/CierreCajaType";

import { useAuth } from "@/hooks/useAuth";

export default function
  CreateCierreCajaView() {

  const navigate =
    useNavigate();

  const params =
    useParams();

  const {data: perfil} =
    useAuth();

  const sucursalId =    params.sucursalId!;
    const cajaId = params.cajaId!

  const [formData, setFormData] =
    useState<CierreCajaFormType>({

      idPerfil:
        perfil?._id,

      idSucursal:
        sucursalId,

      idCaja: cajaId,

      fechaApertura: "",

      fechaCierre: "",

      montoInicial: 0,

      totalVentas: 0,

      totalEgresos: 0,

      montoReal: 0,

      observacion: "",

      creadoPor:
        perfil?.nombres || "",

      actualizadoPor: "",

    });

  /* =========================
      MUTATION
  ========================= */

  const {

    mutate,

    isPending,

  } = useMutation({

    mutationFn:
      createCierreCaja,

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

    mutate(
      formData
    );

  };

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

              <Wallet className="h-8 w-8 text-fuchsia-600" />

              Nuevo Cierre Caja

            </h1>

            <p className="mt-2 text-slate-500">

              Registro de cierre de caja

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

            submitText="Registrar Cierre"

          />

        </motion.div>

      </main>

    </div>

  );

}