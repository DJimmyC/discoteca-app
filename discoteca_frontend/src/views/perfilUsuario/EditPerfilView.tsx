// src/views/perfil/EditPerfilView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import {
  AlertTriangle,
  ArrowLeft,
  Edit3,
  IdCard,
  LoaderCircle,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useAuth,
} from "@/hooks/useAuth";

import PerfilForm, {
  type PerfilFormData,
} from "@/components/perfilUsuario/PerfilForm";

import {
  updatePerfilPersonal,
} from "@/api/PerfilUsuarioApi";

/* =====================================================
   UTILIDADES
===================================================== */

function esModoOscuro(): boolean {
  return document.documentElement.classList.contains(
    "dark"
  );
}

function obtenerMensajeError(
  error: unknown
): string {
  return error instanceof Error
    ? error.message
    : "Ocurrió un error inesperado.";
}

function obtenerIniciales(
  nombres?: string,
  apellidos?: string | null
): string {
  return [
    nombres,
    apellidos,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (palabra) =>
        palabra.charAt(0)
    )
    .slice(0, 2)
    .join("")
    .toUpperCase() || "US";
}

/* =====================================================
   ESTADO INICIAL
===================================================== */

const FORM_DATA_INICIAL: PerfilFormData = {
  nombres: "",
  apellidos: "",
  edad: "",
  sexo: "",
  ci: "",
  telefono: "",
  email: "",
};

/* =====================================================
   SKELETON
===================================================== */

function EditPerfilSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse space-y-5">
      <div className="h-48 rounded-2xl bg-slate-200 sm:rounded-3xl dark:bg-slate-800" />
      <div className="h-[560px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function EditPerfilView() {
  const navigate =
    useNavigate();

  const {
    perfilId,
  } = useParams<{
    perfilId: string;
  }>();

  const queryClient =
    useQueryClient();

  const {
    data: perfil,
    isLoading,
    isError,
  } = useAuth();

  const [
    formData,
    setFormData,
  ] = useState<PerfilFormData>(
    FORM_DATA_INICIAL
  );

  /* =====================================================
     CARGAR DATOS
  ===================================================== */

  useEffect(() => {
    if (!perfil) {
      return;
    }

    setFormData({
      nombres:
        perfil.nombres ?? "",

      apellidos:
        perfil.apellidos ?? "",

      edad:
        perfil.edad === null ||
        perfil.edad === undefined
          ? ""
          : Number(
              perfil.edad
            ),

      sexo:
        perfil.sexo ?? "",

      ci:
        perfil.ci ?? "",

      telefono:
        perfil.telefono ?? "",

      email:
        perfil.email ?? "",
    });
  }, [
    perfil,
  ]);

  /* =====================================================
     ACTUALIZAR PERFIL
  ===================================================== */

  const {
    mutate:
      guardarCambios,

    isPending,
  } = useMutation({
    mutationFn:
      async () => {
        const idPerfil =
          perfilId ||
          perfil?._id;

        if (!idPerfil) {
          throw new Error(
            "No se encontró el ID del perfil."
          );
        }

        const nombres =
          formData.nombres.trim();

        if (!nombres) {
          throw new Error(
            "El nombre es obligatorio."
          );
        }

        const edadTexto =
          String(
            formData.edad ?? ""
          ).trim();

        const edad =
          edadTexto === ""
            ? null
            : Number(
                edadTexto
              );

        if (
          edad !== null &&
          (
            !Number.isFinite(
              edad
            ) ||
            edad < 0 ||
            edad > 120
          )
        ) {
          throw new Error(
            "La edad debe estar entre 0 y 120 años."
          );
        }

        const email =
          formData.email.trim();

        if (
          email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
          )
        ) {
          throw new Error(
            "Ingrese un correo electrónico válido."
          );
        }

        return updatePerfilPersonal({
          perfilUsuarioId:
            idPerfil,

          formData: {
            nombres,

            apellidos:
              formData.apellidos
                .trim() ||
              null,

            edad,

            sexo:
              formData.sexo ||
              null,

            ci:
              formData.ci
                .trim() ||
              null,

            telefono:
              formData.telefono
                .trim() ||
              null,

            email:
              email ||
              null,

            actualizadoPor:
              perfil?.nombres ||
              "sistema",
          },
        });
      },

    onSuccess:
      async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "usuario",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "perfil",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "perfilusuario",
            ],
          }),
        ]);

        await Swal.fire({
          icon:
            "success",

          title:
            "Perfil actualizado",

          text:
            "Los datos del perfil fueron actualizados correctamente.",

          timer:
            1800,

          showConfirmButton:
            false,

          background:
            esModoOscuro()
              ? "#0f172a"
              : "#ffffff",

          color:
            esModoOscuro()
              ? "#f8fafc"
              : "#0f172a",
        });

        navigate(
          "/perfil"
        );
      },

    onError:
      async (
        error
      ) => {
        await Swal.fire({
          icon:
            "error",

          title:
            "No se pudo actualizar",

          text:
            obtenerMensajeError(
              error
            ),

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "#dc2626",

          background:
            esModoOscuro()
              ? "#0f172a"
              : "#ffffff",

          color:
            esModoOscuro()
              ? "#f8fafc"
              : "#0f172a",
        });
      },
  });

  /* =====================================================
     ESTADOS GENERALES
  ===================================================== */

  if (isLoading) {
    return (
      <div className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <EditPerfilSkeleton />
      </div>
    );
  }

  if (
    isError ||
    !perfil
  ) {
    return (
      <Navigate
        to="/auth/login"
        replace
      />
    );
  }

  const nombreCompleto =
    [
      perfil.nombres,
      perfil.apellidos,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Usuario sin nombre";

  const iniciales =
    obtenerIniciales(
      perfil.nombres,
      perfil.apellidos
    );

  /* =====================================================
     CONTENIDO
  ===================================================== */

  return (
    <div className="w-full overflow-x-hidden px-3 py-4 text-slate-900 sm:px-5 sm:py-6 lg:px-8 dark:text-slate-100">
      <div className="mx-auto w-full min-w-0 max-w-5xl space-y-5 sm:space-y-6">
        {/* ENCABEZADO */}

        <section className="relative min-w-0 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 lg:p-8 dark:border dark:border-slate-800">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-violet-500/10" />

          <div className="relative z-10 flex min-w-0 flex-col gap-5">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-slate-950 shadow-lg sm:h-24 sm:w-24 sm:text-3xl">
                {iniciales}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                  Edición de perfil
                </p>

                <h1 className="mt-1 break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  Editar perfil
                </h1>

                <p
                  title={
                    nombreCompleto
                  }
                  className="mt-2 break-words text-sm leading-6 text-slate-300"
                >
                  Actualiza la información personal de{" "}
                  <span className="font-semibold text-white">
                    {nombreCompleto}
                  </span>
                  .
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                    <ShieldCheck
                      size={14}
                    />

                    Información personal
                  </span>

                  <span
                    className={`
                      inline-flex items-center gap-2
                      rounded-full px-3 py-1.5
                      text-xs font-bold

                      ${
                        perfil.estado
                          ? `
                            bg-emerald-100
                            text-emerald-700

                            dark:bg-emerald-950/50
                            dark:text-emerald-400
                          `
                          : `
                            bg-red-100
                            text-red-700

                            dark:bg-red-950/50
                            dark:text-red-400
                          `
                      }
                    `}
                  >
                    <UserRound
                      size={14}
                    />

                    {perfil.estado
                      ? "Perfil activo"
                      : "Perfil inactivo"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/perfil"
                  )
                }
                disabled={
                  isPending
                }
                className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft
                  size={17}
                />

                <span className="truncate">
                  Volver
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  guardarCambios()
                }
                disabled={
                  isPending
                }
                className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save
                    size={17}
                  />
                )}

                <span className="truncate">
                  {isPending
                    ? "Guardando..."
                    : "Guardar"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* AVISO */}

        {!perfilId && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400"
              />

              <div className="min-w-0">
                <h2 className="font-bold text-amber-800 dark:text-amber-300">
                  Identificador tomado de la sesión
                </h2>

                <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
                  La ruta no contiene `perfilId`, por lo que se utilizará el identificador del usuario autenticado.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FORMULARIO */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                <Edit3
                  size={19}
                />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900 sm:text-lg dark:text-white">
                  Datos personales
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Revisa los campos antes de guardar los cambios.
                </p>
              </div>
            </div>
          </div>

          {/* INDICADORES */}

          <div className="grid grid-cols-3 gap-2 border-b border-slate-200 p-3 sm:gap-3 sm:p-5 dark:border-slate-800">
            <SummaryCard
              icon={
                <UserRound
                  size={17}
                />
              }
              label="Nombre"
              value={
                formData.nombres.trim() ||
                "Pendiente"
              }
            />

            <SummaryCard
              icon={
                <IdCard
                  size={17}
                />
              }
              label="C.I."
              value={
                formData.ci.trim() ||
                "Sin dato"
              }
            />

            <SummaryCard
              icon={
                <Mail
                  size={17}
                />
              }
              label="Correo"
              value={
                formData.email.trim() ||
                "Sin dato"
              }
            />
          </div>

          <div className="min-w-0 p-3 sm:p-5 lg:p-6">
            <PerfilForm
              formData={
                formData
              }

              setFormData={
                setFormData
              }

              isPending={
                isPending
              }

              buttonText="Actualizar perfil"

              onSubmit={() =>
                guardarCambios()
              }
            />
          </div>
        </section>
      </div>

      {isPending && (
        <div className="fixed bottom-4 left-4 right-4 z-[90] flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-5 sm:w-auto dark:border dark:border-slate-700">
          <LoaderCircle
            size={17}
            className="animate-spin"
          />

          Actualizando perfil...
        </div>
      )}
    </div>
  );
}

/* =====================================================
   TARJETA RESUMEN
===================================================== */

type SummaryCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function SummaryCard({
  icon,
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-950/60">
      <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
        <span className="shrink-0">
          {icon}
        </span>

        <span className="truncate text-[10px] font-bold uppercase tracking-wide sm:text-xs">
          {label}
        </span>
      </div>

      <p
        title={value}
        className="mt-2 truncate text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
      >
        {value}
      </p>
    </div>
  );
}
