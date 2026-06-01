// src/views/perfil/EditPerfilView.tsx

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
  useQueryClient,
} from "@tanstack/react-query";

import {
  ArrowLeft,
  ClipboardList,
  LogOut,
  Search,
  Wallet,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import PerfilForm, {
  type PerfilFormData,
} from "@/components/perfilUsuario/PerfilForm";

import {
  updatePerfilPersonal,
} from "@/api/PerfilUsuarioApi";

export default function EditPerfilView() {

  const navigate = useNavigate();

  const params = useParams();

  const queryClient = useQueryClient();

  const {
    data: perfil,
    isLoading,
    isError,
  } = useAuth();

  const perfilId = params.perfilId

  const [
    formData,
    setFormData,
  ] = useState<PerfilFormData>({

    nombres:
      "",

    apellidos:
      "",

    edad:
      "",

    sexo:
      "",

    ci:
      "",

    telefono:
      "",

    email:
      "",

  });

  /* =========================
      CARGAR DATOS DEL PERFIL
  ========================= */

  useEffect(() => {

    if (!perfil) {
      return;
    }

    setFormData({

      nombres:
        perfil.nombres || "",

      apellidos:
        perfil.apellidos || "",

      edad:
        perfil.edad || "",

      sexo:
        perfil.sexo || "",

      ci:
        perfil.ci || "",

      telefono:
        perfil.telefono || "",

      email:
        perfil.email || "",

    });

  }, [perfil]);

  /* =========================
      ACTUALIZAR PERFIL
  ========================= */

  const {
    mutate: guardarCambios,
    isPending,
  } = useMutation({

    mutationFn: async () => {

      if (!perfilId) {
        throw new Error(
          "No se encontró el ID del perfil"
        );
      }

      if (!formData.nombres.trim()) {
        throw new Error(
          "El nombre es obligatorio"
        );
      }

      await updatePerfilPersonal({

        perfilUsuarioId:
          perfilId,

        formData: {

          nombres:
            formData.nombres,

          apellidos:
            formData.apellidos || null,

          edad:
            formData.edad === ""
              ? null
              : Number(formData.edad),

          sexo:
            formData.sexo || null,

          ci:
            formData.ci || null,

          telefono:
            formData.telefono || null,

          email:
            formData.email || null,

          actualizadoPor:
            perfil?.nombres || "sistema",

        },

      });

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Los datos del perfil fueron actualizados correctamente",
      });

      /*
        Cambia "usuario" si tu useAuth usa otro queryKey.
        Ejemplo: ["authUser"], ["perfil"], etc.
      */
      queryClient.invalidateQueries({
        queryKey: [
          "usuario",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "perfil",
        ],
      });

      navigate("/perfil");

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al actualizar perfil",
      });

    },

  });

  /* =========================
      CERRAR SESIÓN
  ========================= */

  const cerrarSesion = () => {

    localStorage.removeItem(
      "AUTH_TOKEN"
    );

    navigate("/auth/login");

  };

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold">
          Cargando perfil...
        </p>
      </div>
    );

  }

  /* =========================
      ERROR
  ========================= */

  if (
    isError ||
    !perfil
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">

        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-2xl font-black text-red-500">
            Perfil no encontrado
          </h2>

          <p className="mt-2 text-slate-500">
            No se pudo cargar la información del perfil.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/perfil")
            }
            className="mt-6 rounded-2xl bg-purple-600 px-6 py-3 font-black text-white hover:bg-purple-700"
          >
            Volver
          </button>

        </div>

      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* TOP BAR */}
      <header className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-[#4b4f58] px-6 text-white shadow-md">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
            <Wallet className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-black">
            Discoteca Manager
          </h1>

        </div>

        <div className="hidden w-[520px] items-center rounded-xl bg-slate-800 px-4 py-3 md:flex">

          <Search className="mr-3 h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
          />

        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 font-black text-white">
            {perfil.nombres?.charAt(0).toUpperCase() || "U"}
          </div>

          <span className="hidden text-sm font-bold md:block">
            {perfil.nombres || "Usuario"}
          </span>

          <button
            type="button"
            onClick={cerrarSesion}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="rounded-xl bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
          </button>

        </div>

      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 border-r border-slate-200 bg-white">
        <MenuList />
      </aside>

      {/* MAIN */}
      <main className="ml-72 pt-20">

        <div className="p-8">

          {/* HEADER */}
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">

                  <ClipboardList className="h-4 w-4" />

                  <span>
                    Perfil
                  </span>

                  <span>/</span>

                  <span className="font-bold text-purple-600">
                    Editar
                  </span>

                </div>

                <h1 className="text-4xl font-black text-slate-900">
                  Editar Perfil
                </h1>

                <p className="mt-2 text-slate-500">
                  Modifica los datos personales del perfil.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/perfil")
                }
                title="Volver"
                aria-label="Volver"
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>

            </div>

          </section>

          {/* FORMULARIO */}
          <PerfilForm
            formData={formData}
            setFormData={setFormData}
            isPending={isPending}
            buttonText="Actualizar perfil"
            onSubmit={() =>
              guardarCambios()
            }
          />

        </div>

      </main>

    </div>

  );

}