// src/views/perfil/PerfilView.tsx

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Calendar,
  ClipboardList,
  Edit3,
  IdCard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useAuth,
} from "@/hooks/useAuth";

/* =====================================================
   UTILIDADES
===================================================== */

function formatearFecha(
  fecha?: string | null
): string {
  if (!fecha) {
    return "Sin fecha";
  }

  const valor =
    new Date(fecha);

  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return "Fecha inválida";
  }

  return valor.toLocaleString(
    "es-BO",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function obtenerNombreRelacion(
  relacion:
    | string
    | {
        nombre?: string;
        nombreRol?: string;
        nombreSucursal?: string;
      }
    | null
    | undefined,
  tipo:
    | "rol"
    | "sucursal"
): string {
  if (!relacion) {
    return tipo === "rol"
      ? "Rol no disponible"
      : "Sucursal no disponible";
  }

  if (
    typeof relacion ===
    "string"
  ) {
    return relacion;
  }

  if (
    tipo === "rol"
  ) {
    return (
      relacion.nombre ||
      relacion.nombreRol ||
      "Rol no disponible"
    );
  }

  return (
    relacion.nombreSucursal ||
    relacion.nombre ||
    "Sucursal no disponible"
  );
}

function obtenerIniciales(
  nombres?: string,
  apellidos?: string
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
   SKELETON
===================================================== */

function PerfilSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse space-y-5">
      <div className="h-52 rounded-2xl bg-slate-200 sm:rounded-3xl dark:bg-slate-800" />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[520px] rounded-2xl bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-5">
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function PerfilView() {
  const navigate =
    useNavigate();

  const {
    data: perfil,
    isLoading,
    isError,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <PerfilSkeleton />
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

  const nombreRol =
    obtenerNombreRelacion(
      perfil.idRol,
      "rol"
    );

  const nombreSucursal =
    obtenerNombreRelacion(
      perfil.idSucursal,
      "sucursal"
    );

  const iniciales =
    obtenerIniciales(
      perfil.nombres,
      perfil.apellidos
    );

  return (
    <div className="w-full overflow-x-hidden px-3 py-4 text-slate-900 sm:px-5 sm:py-6 lg:px-8 dark:text-slate-100">
      <div className="mx-auto w-full min-w-0 max-w-6xl space-y-5 sm:space-y-6">
        {/* =================================================
            ENCABEZADO
        ================================================= */}

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
                  Perfil de usuario
                </p>

                <h1
                  title={
                    nombreCompleto
                  }
                  className="mt-1 break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
                >
                  {nombreCompleto}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Consulta tu información personal, asignaciones y datos de auditoría.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                    <ShieldCheck
                      size={14}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {nombreRol}
                    </span>
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
                    <BadgeCheck
                      size={14}
                    />

                    {perfil.estado
                      ? "Activo"
                      : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
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
                  navigate(
                    `/perfil/${perfil._id}/edit`
                  )
                }
                className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                <Edit3
                  size={17}
                />

                <span className="truncate">
                  Editar perfil
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTENIDO
        ================================================= */}

        <section className="grid min-w-0 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* DATOS PERSONALES */}

          <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                  <UserRound
                    size={19}
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900 sm:text-lg dark:text-white">
                    Datos personales
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Información básica y datos de contacto.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-5">
              <InfoCard
                icon={
                  <UserRound
                    size={18}
                  />
                }
                label="Nombres"
                value={
                  perfil.nombres ||
                  "Sin nombre"
                }
              />

              <InfoCard
                icon={
                  <UserRound
                    size={18}
                  />
                }
                label="Apellidos"
                value={
                  perfil.apellidos ||
                  "Sin apellidos"
                }
              />

              <InfoCard
                icon={
                  <IdCard
                    size={18}
                  />
                }
                label="C.I."
                value={
                  perfil.ci ||
                  "Sin C.I."
                }
              />

              <InfoCard
                icon={
                  <BadgeCheck
                    size={18}
                  />
                }
                label="Edad"
                value={
                  perfil.edad
                    ? `${perfil.edad} años`
                    : "Sin edad"
                }
              />

              <InfoCard
                icon={
                  <BadgeCheck
                    size={18}
                  />
                }
                label="Sexo"
                value={
                  perfil.sexo ||
                  "Sin sexo"
                }
              />

              <InfoCard
                icon={
                  <Phone
                    size={18}
                  />
                }
                label="Teléfono"
                value={
                  perfil.telefono ||
                  "Sin teléfono"
                }
              />

              <div className="min-w-0 sm:col-span-2">
                <InfoCard
                  icon={
                    <Mail
                      size={18}
                    />
                  }
                  label="Correo electrónico"
                  value={
                    perfil.email ||
                    "Sin correo"
                  }
                />
              </div>
            </div>
          </article>

          {/* COLUMNA DERECHA */}

          <div className="min-w-0 space-y-5">
            {/* DATOS DEL SISTEMA */}

            <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                    <Building2
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 sm:text-lg dark:text-white">
                      Datos del sistema
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Rol, sucursal y fecha de registro.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-3 sm:p-5">
                <InfoCard
                  icon={
                    <Building2
                      size={18}
                    />
                  }
                  label="Sucursal"
                  value={
                    nombreSucursal
                  }
                />

                <InfoCard
                  icon={
                    <ShieldCheck
                      size={18}
                    />
                  }
                  label="Rol"
                  value={
                    nombreRol
                  }
                />

                <InfoCard
                  icon={
                    <Calendar
                      size={18}
                    />
                  }
                  label="Fecha de creación"
                  value={formatearFecha(
                    perfil.fechaCreacion
                  )}
                />
              </div>
            </article>

            {/* AUDITORÍA */}

            <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                    <ClipboardList
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 sm:text-lg dark:text-white">
                      Auditoría
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Registro de creación y actualización.
                    </p>
                  </div>
                </div>
              </div>

              <dl className="grid gap-3 p-3 sm:p-5">
                <AuditRow
                  label="Creado por"
                  value={
                    perfil.creadoPor ||
                    "Sin dato"
                  }
                />

                <AuditRow
                  label="Actualizado por"
                  value={
                    perfil.actualizadoPor ||
                    "Sin dato"
                  }
                />

                <AuditRow
                  label="Última actualización"
                  value={formatearFecha(
                    perfil.fechaActualizacion
                  )}
                />
              </dl>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =====================================================
   TARJETA DE INFORMACIÓN
===================================================== */

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoCard({
  icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white sm:rounded-2xl dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700 dark:hover:bg-slate-900">
      <div className="flex min-w-0 items-center gap-2 text-violet-600 dark:text-violet-400">
        <span className="shrink-0">
          {icon}
        </span>

        <span className="truncate text-[11px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p
        title={value}
        className="mt-3 break-words text-sm font-bold text-slate-900 sm:text-base dark:text-white"
      >
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   FILA DE AUDITORÍA
===================================================== */

type AuditRowProps = {
  label: string;
  value: string;
};

function AuditRow({
  label,
  value,
}: AuditRowProps) {
  return (
    <div className="grid gap-1 rounded-xl bg-slate-50 p-4 sm:grid-cols-[150px_1fr] sm:items-center dark:bg-slate-950/60">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </dt>

      <dd className="min-w-0 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </dd>
    </div>
  );
}
