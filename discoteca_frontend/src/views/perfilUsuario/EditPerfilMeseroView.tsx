// src/views/perfil/EditPerfilMeseroView.tsx

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
  LogOut,
  Save,
  User,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import {
  updatePerfilPersonal,
} from "@/api/PerfilUsuarioApi";

type PerfilMeseroFormData = {
  nombres: string;
  apellidos: string;
  edad: number | "";
  sexo: string;
  ci: string;
  telefono: string;
  email: string;
};

export default function EditPerfilMeseroView() {

  const navigate = useNavigate();

  const params = useParams();

  const queryClient = useQueryClient();

  const {
    data: perfil,
    isLoading,
    isError,
  } = useAuth();

  const perfilId = params.perfilId!

  const [
    formData,
    setFormData,
  ] = useState<PerfilMeseroFormData>({

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
      CARGAR DATOS
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
      CAMBIAR INPUTS
  ========================= */

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        name === "edad"
          ? value === ""
            ? ""
            : Number(value)
          : value,

    }));

  };

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

          /*
            Uso "sistema" para evitar el error de maxlength
            en actualizadoPor si tu modelo todavía tiene max: 10.
          */
          actualizadoPor:
            "sistema",

        },

      });

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos fueron actualizados correctamente",
        background: "#020617",
        color: "#ffffff",
        confirmButtonColor: "#c026d3",
      });

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

      navigate("/mesero/perfil");

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al actualizar perfil",
        background: "#020617",
        color: "#ffffff",
        confirmButtonColor: "#dc2626",
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

        <div className="rounded-3xl border border-red-500/20 bg-slate-900 p-8 text-center">

          <h2 className="text-2xl font-black text-red-400">
            Perfil no encontrado
          </h2>

          <p className="mt-2 text-slate-400">
            No se pudo cargar la información del perfil.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/mesero/perfil")
            }
            className="mt-6 rounded-2xl bg-fuchsia-600 px-6 py-3 font-black text-white hover:bg-fuchsia-700"
          >
            Volver
          </button>

        </div>

      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-fuchsia-500/20 bg-slate-950/95 backdrop-blur">

        <div className="flex h-20 items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate("/mesero/perfil")
              }
              title="Volver"
              aria-label="Volver"
              className="rounded-xl border border-fuchsia-500/30 p-3 text-fuchsia-400 hover:bg-fuchsia-500/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20 shadow-[0_0_25px_#d946ef]">

                <User className="h-7 w-7 text-fuchsia-400" />

              </div>

              <div>

                <h1 className="text-2xl font-black text-fuchsia-400">
                  Editar Perfil
                </h1>

                <p className="text-xs tracking-[3px] text-slate-400">
                  MESERO
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-5 py-3 font-bold text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
            Salir
          </button>

        </div>

      </header>

      {/* CONTENIDO */}
      <main className="p-6">

        <section className="mx-auto max-w-5xl rounded-[2rem] border border-fuchsia-500/20 bg-slate-900/80 p-8 shadow-[0_0_40px_rgba(217,70,239,0.10)]">

          {/* TITULO */}
          <div className="mb-8">

            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-fuchsia-600/20 text-3xl font-black text-fuchsia-400 shadow-[0_0_30px_rgba(217,70,239,0.35)]">
              {perfil.nombres?.charAt(0).toUpperCase() || "U"}
            </div>

            <h2 className="text-4xl font-black text-white">
              Datos personales
            </h2>

            <p className="mt-2 text-slate-400">
              Modifica tu información personal del perfil.
            </p>

          </div>

          {/* FORMULARIO */}
          <div className="grid gap-6 md:grid-cols-2">

            <CampoInput
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
            />

            <CampoInput
              label="Apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
            />

            <CampoInput
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleChange}
            />

            <div>

              <label className="mb-2 block text-sm font-black text-slate-300">
                Sexo
              </label>

              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full rounded-2xl border border-fuchsia-500/20 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/10"
              >
                <option value="">
                  Seleccione
                </option>

                <option value="Masculino">
                  Masculino
                </option>

                <option value="Femenino">
                  Femenino
                </option>

                <option value="Otro">
                  Otro
                </option>
              </select>

            </div>

            <CampoInput
              label="C.I."
              name="ci"
              value={formData.ci}
              onChange={handleChange}
            />

            <CampoInput
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />

            <div className="md:col-span-2">

              <CampoInput
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* BOTONES */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/mesero/perfil")
              }
              className="rounded-2xl border border-slate-700 px-8 py-4 font-black text-slate-300 transition hover:bg-slate-800"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() =>
                guardarCambios()
              }
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 px-8 py-4 font-black text-white shadow-[0_0_30px_rgba(217,70,239,0.35)] transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Save className="h-5 w-5" />

              {isPending
                ? "Guardando..."
                : "Actualizar perfil"}
            </button>

          </div>

        </section>

      </main>

    </div>

  );

}

/* =========================
    INPUT REUTILIZABLE
========================= */

type CampoInputProps = {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  onChange:
    | React.ChangeEventHandler<HTMLInputElement>
    | React.ChangeEventHandler<HTMLSelectElement>;
};

function CampoInput({
  label,
  name,
  value,
  type = "text",
  onChange,
}: CampoInputProps) {

  return (

    <div>

      <label className="mb-2 block text-sm font-black text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        className="w-full rounded-2xl border border-fuchsia-500/20 bg-slate-950 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/10"
      />

    </div>

  );

}