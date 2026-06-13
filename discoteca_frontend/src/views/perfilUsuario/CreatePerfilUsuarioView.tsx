import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";

import PerfilUsuarioForm from "@/components/perfilUsuario/PerfilUsuarioForm";

import {
  createPerfilUsuario,
} from "@/api/PerfilUsuarioApi";

import {
  getRoles,
} from "@/api/RolApi";

import {
  getSucursal,
} from "@/api/SucursalApi";

import {
  getAlmacenesBySucursal,
} from "@/api/AlmacenApi";

import type {
  PerfilUsuarioForm as PerfilUsuarioFormType,
} from "@/types/PerfilUsuarioType";
import { useAuth } from "@/hooks/useAuth";

export default function CreatePerfilUsuarioView() {

  const navigate =
    useNavigate();
    const {data:perfil} = useAuth()

  const [formData, setFormData] =
    useState<PerfilUsuarioFormType>({

      idRol: "",

      idSucursal: "",

      idAlmacen: "",

      nombres: "",

      apellidos: "",

      edad: 0,

      sexo: "",

      ci: "",

      telefono: "",

      email: "",

      password: "",

      estado: true,

      creadoPor: perfil._id,

    });

  /* =========================
      QUERIES
  ========================= */

  const {
    data: roles = [],
  } = useQuery({

    queryKey: ["roles"],

    queryFn: getRoles,

  });

  const {
    data: sucursales = [],
  } = useQuery({

    queryKey: ["sucursales"],

    queryFn: getSucursal,

  });

  /* =========================
      ALMACENES POR SUCURSAL
  ========================= */

  const {
    data: almacenesResponse,
    isLoading: loadingAlmacenes,
  } = useQuery({

    queryKey: [
      "almacenes-sucursal",
      formData.idSucursal,
    ],

    queryFn: () =>
      getAlmacenesBySucursal(
        formData.idSucursal
      ),

    enabled:
      !!formData.idSucursal,

  });

  const almacenes =
    Array.isArray(almacenesResponse)
      ? almacenesResponse
      : almacenesResponse?.almacenes || [];

  /* =========================
      MUTATION
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createPerfilUsuario,

    onSuccess: async (
      data
    ) => {

      await Swal.fire({

        icon: "success",

        title:
          data.message ||
          "Perfil usuario creado correctamente",

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

    if (!formData.idRol) {

      Swal.fire({
        icon: "warning",
        title: "Seleccione un rol",
      });

      return;

    }

    if (!formData.idSucursal) {

      Swal.fire({
        icon: "warning",
        title: "Seleccione una sucursal",
      });

      return;

    }

    if (!formData.idAlmacen) {

      Swal.fire({
        icon: "warning",
        title: "Seleccione un almacén",
      });

      return;

    }

    mutate(formData);

  };

  return (

    <div className="flex min-h-screen bg-slate-50">

      <MenuListDashboard />

      <main className="flex-1 p-8">

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <h1 className="mb-6 text-3xl font-black text-slate-800">
            Crear Perfil Usuario
          </h1>

          <PerfilUsuarioForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            roles={roles}

            sucursales={sucursales}

            almacenes={almacenes}

            loadingAlmacenes={loadingAlmacenes}

            loading={isPending}

            submitText="Crear Perfil"

          />

        </div>

      </main>

    </div>

  );

}