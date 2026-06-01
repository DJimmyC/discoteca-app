// src/views/caja/CreateCajaView.tsx

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

import MenuListDashboard from "@/components/MenuListDashboard";

import CajaForm from "@/components/caja/CajaForm";

import {
  createCaja,
} from "@/api/CajaApi";

import type {
  CajaForm as CajaFormType,
} from "@/types/CajaType";

export default function CreateCajaView() {

  const navigate =
    useNavigate();

  const { sucursalId } =
    useParams();

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

      creadoPor: "admin",

    });

  /* =========================
      MUTATION
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createCaja,

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

    mutate(formData);

  };

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

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-4xl font-black text-slate-800">

              Nueva Caja

            </h1>

            <p className="mt-2 text-slate-500">

              Registra una nueva caja para esta sucursal

            </p>

          </div>

          {/* FORM */}
          <CajaForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            loading={isPending}

            submitText="Guardar Caja"

          />

        </motion.div>

      </main>

    </div>

  );

}