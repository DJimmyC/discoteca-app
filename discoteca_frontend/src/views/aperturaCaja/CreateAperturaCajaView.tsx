
// src/views/aperturacaja/CreateAperturaCajaView.tsx

import {
  useState,
} from "react";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  motion,
} from "framer-motion";

import MenuList from "@/components/MenuList";

import AperturaCajaForm from "@/components/aperturacaja/AperturaCajaForm";

import {
  createAperturaCaja,
} from "@/api/AperturaCajaApi";

import type {
  AperturaCajaForm as AperturaCajaFormType,
} from "@/types/AperturaCajaType";
import { useAuth } from "@/hooks/useAuth";

export default function
CreateAperturaCajaView() {

  const navigate =
    useNavigate();
 
  const {
    sucursalId,
    cajaId,
  } = useParams();

  /* =========================
      FECHA Y HORA
  ========================= */

  const now =
    new Date();

  const fecha =
    now.toISOString();

  const horaApertura =
    now
      .toTimeString()
      .slice(0, 5);
const {data: perfil} = useAuth();

  /* =========================
      FORM DATA
  ========================= */

  const [
    formData,

    setFormData

  ] = useState<AperturaCajaFormType>({

    idPerfil:perfil?._id  ||    "",

    idCaja:
      cajaId || "",

    fecha,

    horaApertura,

    montoInicial:
      0,

    observacion:
      "",

    estado:
      true,

    creadoPor:
      "admin",

  });

  /* =========================
      MUTATION
  ========================= */

  const {

    mutate,

    isPending,

  } = useMutation({

    mutationFn:
      createAperturaCaja,

    onSuccess:
      async (
        data
      ) => {

        await Swal.fire({

          icon:
            "success",

          title:
            data,

          timer:
            2000,

          showConfirmButton:
            false,

        });

        navigate(

          `/sucursal/${sucursalId}/caja`

        );

      },

    onError:
      async (
        error: any
      ) => {

        await Swal.fire({

          icon:
            "error",

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
      <MenuList />

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

          {/* HEADER */}

          <div className="mb-8">

            <h1 className="text-4xl font-black text-slate-800">

              Nueva Apertura

            </h1>

            <p className="mt-2 text-slate-500">

              Registrar apertura de caja

            </p>

          </div>

          {/* FORM */}

          <AperturaCajaForm

            formData={
              formData
            }

            setFormData={
              setFormData
            }

            onSubmit={
              handleSubmit
            }

            loading={
              isPending
            }

            submitText="
              Guardar Apertura
            "

          />

        </motion.div>

      </main>

    </div>

  );

}
