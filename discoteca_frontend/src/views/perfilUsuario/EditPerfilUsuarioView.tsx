import {  useEffect,  useState,} from "react";
import {  useNavigate,  useParams,} from "react-router-dom";
import {  useMutation,  useQuery,} from "@tanstack/react-query";
import Swal from "sweetalert2";

import {
  ArrowLeft,
  X,
} from "lucide-react";

import MenuListDashboard from "@/components/MenuListDashboard";

import PerfilUsuarioForm from "@/components/perfilUsuario/PerfilUsuarioForm";

import {

  getPerfilUsuarioById,

  updatePerfilUsuario,

} from "@/api/PerfilUsuarioApi";


import {
  getRoles,
} from "@/api/RolApi";

import {
  getSucursal,
} from "@/api/SucursalApi";

import type {
  PerfilUsuarioForm as PerfilUsuarioFormType,
} from "@/types/PerfilUsuarioType";

export default function EditPerfilUsuarioView() {

  const navigate =
    useNavigate();

  const params =
    useParams();

  const perfilUsuarioId =
    params.perfilUsuarioId!;

  /* =========================
      FORM DATA
  ========================= */

  const [formData, setFormData] =
    useState<PerfilUsuarioFormType>({

   

      idRol: "",

      idSucursal: "",

      nombres: "",

      apellidos: "",

      edad: 0,

      sexo: "",

      ci: "",

      telefono: "",

      email: "",

      password: "",

      estado: true,

      creadoPor: "",

    });

  /* =========================
      GET PERFIL
  ========================= */

  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [
      "perfilusuario",
      perfilUsuarioId,
    ],

    queryFn: () =>
      getPerfilUsuarioById(
        perfilUsuarioId
      ),

    enabled:
      !!perfilUsuarioId,

  });

  /* =========================
      GET RELACIONES
  ========================= */



  const {
    data: roles = [],
  } = useQuery({

    queryKey: ["roles"],

    queryFn:
      getRoles,

  });

  const {
    data: sucursales = [],
  } = useQuery({

    queryKey: ["sucursales"],

    queryFn:
      getSucursal,

  });

  /* =========================
      CARGAR DATA
  ========================= */

  useEffect(() => {

    if (data) {

      console.log(data, "PERFIL");

      setFormData({

       
        idRol:
          typeof data.idRol === "string"
            ? data.idRol
            : data.idRol?._id || "",

        idSucursal:
          typeof data.idSucursal === "string"
            ? data.idSucursal
            : data.idSucursal?._id || "",

        nombres:
          data.nombres || "",

        apellidos:
          data.apellidos || "",

        edad:
          data.edad || 0,

        sexo:
          data.sexo || "",

        ci:
          data.ci || "",

        telefono:
          data.telefono || "",

        email:
          data.email || "",

        // 🔥 IMPORTANTE
        // no cargar password real
        password: "",

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

    mutationFn:
      updatePerfilUsuario,

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
        "/perfilusuario"
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

    mutate({

      formData,

      perfilUsuarioId,

    });

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
      <MenuListDashboard />

      {/* CONTENIDO */}
      <main className="flex-1 p-8">

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-800">
                Editar Perfil Usuario
              </h1>

              <p className="mt-2 text-slate-500">
                Modifica la información del perfil usuario
              </p>

            </div>

            {/* BOTON VOLVER */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/perfilusuario"
                )
              }
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-300
                px-5
                py-3
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

          {/* FORM */}
          <PerfilUsuarioForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            

            roles={roles}

            sucursales={sucursales}

            loading={isPending}

            submitText="Actualizar Perfil"

          />

          {/* FOOTER */}
          <div className="mt-8 flex justify-end gap-4">

            {/* CANCELAR */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/perfilusuario"
                )
              }
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-300
                px-6
                py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >

              <X className="h-5 w-5" />

              Cancelar

            </button>

          </div>

        </div>

      </main>

    </div>

  );

}