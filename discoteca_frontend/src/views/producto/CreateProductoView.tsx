import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";

import ProductoForm from "@/components/producto/ProductoForm";

import {
  createProducto,
} from "@/api/ProductoApi";

import {
  ArrowLeft,
} from "lucide-react";

import type {
  ProductoFormData,
} from "@/types/ProductoType";
import { useAuth } from "@/hooks/useAuth";

export default function CreateProductoView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

    const {data:perfil} = useAuth()
  const [formData, setFormData] =
    useState<ProductoFormData>({

      idCategoria: "",

      nombre: "",

      descripcion: "",

      marca: "",

      estado: true,

      creadoPor: perfil._id,

    });

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createProducto,

    onSuccess: async (
      data: any
    ) => {

      await Swal.fire({

        icon: "success",

        title: data,

        timer: 2000,

        showConfirmButton: false,

      });

      queryClient.invalidateQueries({
        queryKey: [
          "productos"
        ],
      });

      navigate("/producto");

    },

    onError: async (
      error: any
    ) => {

      await Swal.fire({

        icon: "error",

        title:
          error.message,

        timer: 2000,

        showConfirmButton: false,

      });

    },

  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    mutate(formData);

  };

  return (

    <div className="flex h-screen overflow-hidden bg-slate-50">

      <MenuListDashboard />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">

        {/* HEADER */}
        <motion.div

          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-800">
                Crear Producto
              </h1>

              <p className="mt-2 text-slate-500">
                Registra un nuevo producto
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/producto")
              }
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

            </button>

          </div>

        </motion.div>

        {/* FORM */}
        <ProductoForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isPending={isPending}
          submitText="Guardar Producto"
          cancelAction={() =>
            navigate("/producto")
          }
        />

      </main>

    </div>

  );

}