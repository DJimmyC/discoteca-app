// src/views/aperturaCaja/CreateAperturaCajaView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Swal from "sweetalert2";
import { motion } from "framer-motion";

import MenuList from "@/components/MenuList";
import AperturaCajaForm from "@/components/aperturacaja/AperturaCajaForm";

import {
  createAperturaCaja,
} from "@/api/AperturaCajaApi";

import type {
  AperturaCajaForm as AperturaCajaFormType,
} from "@/types/AperturaCajaType";

import { useAuth } from "@/hooks/useAuth";

function obtenerFechaHoraLocal(): string {

  const ahora =
    new Date();

  const compensacion =
    ahora.getTimezoneOffset() *
    60000;

  return new Date(
    ahora.getTime() -
    compensacion
  )
    .toISOString()
    .slice(0, 16);
}

export default function CreateAperturaCajaView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    sucursalId,
    cajaId,
  } = useParams();

  const {
    data: perfil,
  } = useAuth();

  const [
    formData,
    setFormData,
  ] = useState<AperturaCajaFormType>({
    idPerfil: "",
    idCaja:
      cajaId || "",
    fechaApertura:
      obtenerFechaHoraLocal(),
    montoInicial: 0,
    observacion: "",
    creadoPor: perfil._id!,
  });

  useEffect(() => {

    if (!perfil?._id) {
      return;
    }

    setFormData(
      (actual) => ({
        ...actual,
        idPerfil:
          String(perfil._id),
        creadoPor:
          perfil.nombres ||
          "sistema",
      })
    );

  }, [
    perfil,
  ]);

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createAperturaCaja,

    onSuccess:
      async (
        respuesta
      ) => {

        await Promise.all([

          queryClient.invalidateQueries({
            queryKey: [
              "aperturasCaja",
              cajaId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "apertura-activa",
              cajaId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "cajas-sucursal",
              sucursalId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "movimientos",
            ],
          }),

        ]);

        await Swal.fire({
          icon:
            "success",
          title:
            respuesta.message,
          text:
            "La caja quedó abierta y el movimiento fue registrado por el backend.",
        });

        navigate(
          `/sucursal/${sucursalId}/caja/${cajaId}/apertura`
        );
      },

    onError:
      async (
        error: Error
      ) => {

        await Swal.fire({
          icon:
            "error",
          title:
            "No se pudo abrir la caja",
          text:
            error.message,
        });
      },
  });

  const handleSubmit = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    if (
      !formData.idPerfil ||
      !formData.idCaja
    ) {
      Swal.fire({
        icon:
          "error",
        title:
          "Datos incompletos",
        text:
          "No se pudo identificar el perfil o la caja.",
      });

      return;
    }

    mutate(formData);
  };

  return (

    <div className="flex min-h-screen bg-slate-50">

      <MenuList />

      <main className="flex-1 p-4 md:p-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >

          <div className="mb-8">

            <h1 className="text-3xl font-black text-slate-800 md:text-4xl">
              Nueva apertura
            </h1>

            <p className="mt-2 text-slate-500">
              Registra el monto inicial y el inicio de la jornada.
            </p>

          </div>

          <AperturaCajaForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={isPending}
            submitText="Abrir caja"
          />

        </motion.div>

      </main>

    </div>
  );
}
