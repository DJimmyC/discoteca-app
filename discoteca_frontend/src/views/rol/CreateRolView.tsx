import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";
import RolForm from "@/components/rol/RolForm";

import { createRol } from "@/api/RolApi";

import {
  ArrowLeft,
} from "lucide-react";

export default function RolCreateView() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: true,

    ventas: false,
    egresos: false,
    inventario: false,
    reportes: false,
    usuarios: false,
    configuracion: false,

    creadoPor: "admin",
  });

  /* =========================
      MUTATION
  ========================= */
  const { mutate, isPending } = useMutation({

    mutationFn: createRol,

    onError: async (error: any) => {

      await Swal.fire({
        icon: "error",
        title: error.message,
        timer: 2000,
        showConfirmButton: false,
      });

    },

    onSuccess: async (data: any) => {

      await Swal.fire({
        icon: "success",
        title: data,
        timer: 2000,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      navigate("/rol");

    },

  });

  /* =========================
      SUBMIT
  ========================= */
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    mutate(formData);

  };

  return (

    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-800">
                Crear Rol
              </h1>

              <p className="mt-2 text-slate-500">
                Configura un nuevo rol y sus permisos
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/rol")}
              className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </button>

          </div>

        </motion.div>

        {/* FORM REUTILIZABLE */}
        <RolForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isPending={isPending}
          submitText="Guardar Rol"
          cancelAction={() => navigate("/rol")}
        />

      </main>

    </div>

  );

}

