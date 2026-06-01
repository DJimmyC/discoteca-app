import {
  useEffect,
  useState,
} from "react";

import {
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

import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";

import CategoriaProductoForm from "@/components/categoriaProducto/CategoriaProductoForm";

import {

  getCategoriaProductoById,

  updateCategoriaProducto,

} from "@/api/CategoriaProductoApi";

import {
  ArrowLeft,
} from "lucide-react";

import type {
  CategoriaProductoFormData,
} from "@/types/CategoriaProductoType";

export default function EditCategoriaProductoView() {

  const navigate =
    useNavigate();

    const params = useParams()
    const id = params.categoriaProductoId!
 

  const queryClient =
    useQueryClient();

  const [formData, setFormData] =
    useState<CategoriaProductoFormData>({

      nombre: "",

      descripcion: "",

      estado: true,

      creadoPor: "",

    });

  /* =========================
      GET
  ========================= */
  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [
      "categoriaProducto",
      id,
    ],

    queryFn: () =>
      getCategoriaProductoById(
        id!
      ),

    enabled: !!id,

  });

  /* =========================
      LOAD DATA
  ========================= */
  useEffect(() => {

    if (data) {

      setFormData({

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

    mutationFn: (
      dataUpdate:
        CategoriaProductoFormData
    ) =>
      updateCategoriaProducto({

        formData:
          dataUpdate,

        categoriaProductoId:
          id!,

      }),

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
          "categoriaProductos"
        ],
      });

      navigate(
        "/categoriaProducto"
      );

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

  if (isLoading) {

    return (

      <div className="flex h-screen items-center justify-center bg-slate-50">

        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>

      </div>

    );

  }

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
                Editar Categoría
              </h1>

              <p className="mt-2 text-slate-500">
                Modifica la categoría
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/categoriaProducto"
                )
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
        <CategoriaProductoForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isPending={isPending}
          submitText="Actualizar Categoría"
          cancelAction={() =>
            navigate(
              "/categoriaProducto"
            )
          }
        />

      </main>

    </div>

  );

}