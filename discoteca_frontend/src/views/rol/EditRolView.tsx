import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { motion } from "framer-motion";

import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";
import RolForm from "@/components/rol/RolForm";

import {
  getRolById,
  updateRol,
} from "@/api/RolApi";

import type {
  RolFormData,
} from "@/types/RolType";

import {
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function EditRolView() {

  const navigate = useNavigate();

  const params = useParams();
  const id = params.rolId!
  
const {data:perfil} = useAuth()
  const queryClient = useQueryClient();

  /* =========================
      FORM DATA
  ========================= */
  const [formData, setFormData] =
    useState<RolFormData>({

      nombre: "",
      descripcion: "",
      estado: true,

      ventas: false,
      egresos: false,
      inventario: false,
      reportes: false,
      usuarios: false,
      configuracion: false,

      actualizadoPor:perfil._id,

    });

  /* =========================
      GET ROL BY ID
  ========================= */
  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: ["rol", id],

    queryFn: () => getRolById(id!),

    enabled: !!id,

    
  });
  console.log(data, "desde edit")

  /* =========================
      LOAD DATA IN FORM
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

        ventas:
          data.ventas ?? false,

        egresos:
          data.egresos ?? false,

        inventario:
          data.inventario ?? false,

        reportes:
          data.reportes ?? false,

        usuarios:
          data.usuarios ?? false,

        configuracion:
          data.configuracion ?? false,

        creadoPor:
          data.creadoPor || "",

      });

    }

  }, [data]);

  /* =========================
      UPDATE MUTATION
  ========================= */
  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn: (
      dataUpdate: RolFormData
    ) =>
      updateRol({

        rolId: id!,

        formData: dataUpdate,

      }),

    onError: async (
      error: any
    ) => {

      await Swal.fire({

        icon: "error",

        title:
          error.message ||
          "Error al actualizar el rol",

        timer: 2000,

        showConfirmButton: false,

      });

    },

    onSuccess: async (
      data: any
    ) => {

      await Swal.fire({

        icon: "success",

        title:
          data ||
          "Rol actualizado correctamente",

        timer: 2000,

        showConfirmButton: false,

      });

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      queryClient.invalidateQueries({
        queryKey: ["rol", id],
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

  /* =========================
      LOADING
  ========================= */
  if (isLoading) {

    return (

      <div className="flex h-screen items-center justify-center bg-slate-50">

        <p className="text-lg font-semibold text-slate-600">
          Cargando Rol...
        </p>

      </div>

    );

  }

  return (

    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENT */}
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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-800">
                Editar Rol
              </h1>

              <p className="mt-2 text-slate-500">
                Modifica la información y permisos del rol
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

        {/* FORM */}
        <RolForm

          formData={formData}

          setFormData={setFormData}

          handleSubmit={handleSubmit}

          isPending={isPending}

          submitText="Actualizar Rol"

          cancelAction={() =>
            navigate("/rol")
          }

        />

      </main>

    </div>

  );

}
