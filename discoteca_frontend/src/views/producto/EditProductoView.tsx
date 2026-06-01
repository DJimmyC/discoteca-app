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

import ProductoForm from "@/components/producto/ProductoForm";

import {

  getProductoById,

  updateProducto,

} from "@/api/ProductoApi";

import {
  ArrowLeft,
} from "lucide-react";

import type {
  ProductoFormData,
} from "@/types/ProductoType";

export default function EditProductoView() {

  const navigate =
    useNavigate();

    const params = useParams()
    const id = params.productoId
 

  const queryClient =
    useQueryClient();

  const [formData, setFormData] =
    useState<ProductoFormData>({

      idCategoria: "",

      nombre: "",

      descripcion: "",

      marca: "",

      estado: true,

      creadoPor: "",

    });

  /* =========================
      GET PRODUCTO
  ========================= */
  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [
      "producto",
      id,
    ],

    queryFn: () =>
      getProductoById(id!),

    enabled: !!id,

  });

  /* =========================
      LOAD DATA
  ========================= */
  useEffect(() => {

    if (data) {

      setFormData({

        idCategoria:

          typeof data.idCategoria ===
          "string"

            ? data.idCategoria

            : data.idCategoria?._id || "",

        nombre:
          data.nombre || "",

        descripcion:
          data.descripcion || "",

        marca:
          data.marca || "",

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
        ProductoFormData
    ) =>
      updateProducto({

        formData:
          dataUpdate,

        productoId:
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
          "productos"
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "producto",
          id,
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

  /* =========================
      SUBMIT
  ========================= */
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    mutate(formData);

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

    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENIDO */}
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
                Editar Producto
              </h1>

              <p className="mt-2 text-slate-500">
                Modifica la información del producto
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
          submitText="Actualizar Producto"
          cancelAction={() =>
            navigate("/producto")
          }
        />

      </main>

    </div>

  );

}