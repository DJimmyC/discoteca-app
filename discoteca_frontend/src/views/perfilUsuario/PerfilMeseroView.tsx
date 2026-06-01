// src/views/perfil/PerfilMeseroView.tsx

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Calendar,
  Edit,
  IdCard,
  LogOut,
  Mail,
  Menu,
  Phone,
  Shield,
  User,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function PerfilMeseroView() {

  const navigate = useNavigate();

  const {
    data: perfil,
    isLoading,
    isError,
  } = useAuth();

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
      HELPERS
  ========================= */

  const getNombreSucursal = () => {

    if (
      typeof perfil?.idSucursal === "object" &&
      perfil.idSucursal !== null
    ) {

      return (
        perfil.idSucursal.nombreSucursal ||
        perfil.idSucursal.nombre ||
        "Sucursal"
      );

    }

    if (
      typeof perfil?.idSucursal === "string"
    ) {
      return perfil.idSucursal;
    }

    return "Sucursal no disponible";

  };

  const getNombreRol = () => {

    if (
      typeof perfil?.idRol === "object" &&
      perfil.idRol !== null
    ) {

      return (
        perfil.idRol.nombre ||
        perfil.idRol.nombreRol ||
        "Rol"
      );

    }

    if (
      typeof perfil?.idRol === "string"
    ) {
      return perfil.idRol;
    }

    return "Rol no disponible";

  };

  const formatearFecha = (
    fecha?: string | null
  ) => {

    if (!fecha) {
      return "Sin fecha";
    }

    return new Date(fecha).toLocaleString(
      "es-BO",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };

  const inicial =
    perfil?.nombres
      ? perfil.nombres.charAt(0).toUpperCase()
      : "U";

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
        <p className="text-lg font-bold text-red-400">
          No se pudo cargar la información del perfil
        </p>
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
                navigate(-1)
              }
              className="rounded-xl border border-fuchsia-500/30 p-3 text-fuchsia-400 hover:bg-fuchsia-500/10"
              title="Volver"
              aria-label="Volver"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="rounded-xl border border-fuchsia-500/30 p-3 text-fuchsia-400 hover:bg-fuchsia-500/10"
              title="Menú"
              aria-label="Menú"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20 shadow-[0_0_25px_#d946ef]">

                <User className="h-7 w-7 text-fuchsia-400" />

              </div>

              <div>

                <h1 className="text-2xl font-black text-fuchsia-400">
                  Mi Perfil
                </h1>

                <p className="text-xs tracking-[3px] text-slate-400">
                  MESERO
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/mesero/perfil/${perfil._id}/edit`
                )
              }
              title="Editar perfil"
              aria-label="Editar perfil"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            >
              <Edit className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={cerrarSesion}
              className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-5 py-3 font-bold text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" />
              Salir
            </button>

          </div>

        </div>

      </header>

      {/* CONTENIDO */}
      <main className="p-6">

        {/* CARD PRINCIPAL */}
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-fuchsia-500/20 bg-slate-900/80 shadow-[0_0_40px_rgba(217,70,239,0.10)]">

          <div className="relative p-8">

            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-fuchsia-600/20 text-4xl font-black text-fuchsia-400 shadow-[0_0_30px_rgba(217,70,239,0.35)]">
                  {inicial}
                </div>

                <div>

                  <h2 className="text-4xl font-black text-white">
                    {perfil.nombres}{" "}
                    {perfil.apellidos || ""}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Información personal del usuario logueado.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1 text-sm font-black text-fuchsia-300">
                      {getNombreRol()}
                    </span>

                    <span
                      className={`
                        rounded-full
                        border
                        px-4
                        py-1
                        text-sm
                        font-black
                        ${
                          perfil.estado
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-red-500/30 bg-red-500/10 text-red-300"
                        }
                      `}
                    >
                      {perfil.estado
                        ? "Activo"
                        : "Inactivo"}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* GRID DATOS */}
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

          {/* DATOS PERSONALES */}
          <div className="rounded-[2rem] border border-fuchsia-500/20 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(217,70,239,0.08)]">

            <h3 className="mb-6 text-2xl font-black text-fuchsia-400">
              Datos personales
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <InfoCardMesero
                icon={<User className="h-5 w-5" />}
                label="Nombres"
                value={perfil.nombres || "Sin nombre"}
              />

              <InfoCardMesero
                icon={<User className="h-5 w-5" />}
                label="Apellidos"
                value={perfil.apellidos || "Sin apellidos"}
              />

              <InfoCardMesero
                icon={<IdCard className="h-5 w-5" />}
                label="C.I."
                value={perfil.ci || "Sin C.I."}
              />

              <InfoCardMesero
                icon={<BadgeCheck className="h-5 w-5" />}
                label="Edad"
                value={
                  perfil.edad
                    ? `${perfil.edad} años`
                    : "Sin edad"
                }
              />

              <InfoCardMesero
                icon={<BadgeCheck className="h-5 w-5" />}
                label="Sexo"
                value={perfil.sexo || "Sin sexo"}
              />

              <InfoCardMesero
                icon={<Phone className="h-5 w-5" />}
                label="Teléfono"
                value={perfil.telefono || "Sin teléfono"}
              />

              <div className="md:col-span-2">
                <InfoCardMesero
                  icon={<Mail className="h-5 w-5" />}
                  label="Correo electrónico"
                  value={perfil.email || "Sin correo"}
                />
              </div>

            </div>

          </div>

          {/* DATOS SISTEMA */}
          <div className="space-y-6">

            <div className="rounded-[2rem] border border-fuchsia-500/20 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(217,70,239,0.08)]">

              <h3 className="mb-6 text-2xl font-black text-fuchsia-400">
                Datos del sistema
              </h3>

              <div className="space-y-4">

                <InfoCardMesero
                  icon={<Building2 className="h-5 w-5" />}
                  label="Sucursal"
                  value={getNombreSucursal()}
                />

                <InfoCardMesero
                  icon={<Shield className="h-5 w-5" />}
                  label="Rol"
                  value={getNombreRol()}
                />

                <InfoCardMesero
                  icon={<Calendar className="h-5 w-5" />}
                  label="Fecha creación"
                  value={formatearFecha(
                    perfil.fechaCreacion
                  )}
                />

              </div>

            </div>

            <div className="rounded-[2rem] border border-fuchsia-500/20 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(217,70,239,0.08)]">

              <h3 className="mb-4 text-2xl font-black text-fuchsia-400">
                Auditoría
              </h3>

              <div className="space-y-3 text-sm">

                <p className="text-slate-300">
                  <span className="font-black text-slate-100">
                    Creado por:
                  </span>{" "}
                  {perfil.creadoPor || "Sin dato"}
                </p>

                <p className="text-slate-300">
                  <span className="font-black text-slate-100">
                    Actualizado por:
                  </span>{" "}
                  {perfil.actualizadoPor || "Sin dato"}
                </p>

                <p className="text-slate-300">
                  <span className="font-black text-slate-100">
                    Última actualización:
                  </span>{" "}
                  {formatearFecha(
                    perfil.fechaActualizacion
                  )}
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>

  );

}

/* =========================
    CARD INFO MESERO
========================= */

type InfoCardMeseroProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoCardMesero({
  icon,
  label,
  value,
}: InfoCardMeseroProps) {

  return (

    <div className="rounded-2xl border border-fuchsia-500/10 bg-slate-950/60 p-5 transition hover:border-fuchsia-500/30 hover:bg-slate-950">

      <div className="mb-3 flex items-center gap-2 text-fuchsia-400">

        {icon}

        <span className="text-xs font-black uppercase tracking-wide">
          {label}
        </span>

      </div>

      <p className="break-words font-black text-white">
        {value}
      </p>

    </div>

  );

}