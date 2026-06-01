// src/views/perfil/PerfilView.tsx

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
  Phone,
  Search,
  Shield,
  User,
  Wallet,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

export default function PerfilView() {

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
        <p className="text-lg font-bold text-red-500">
          No se pudo cargar la información del perfil
        </p>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900">

   

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 border-r border-slate-200 bg-white">
        <MenuList />
      </aside>

      {/* MAIN */}
      <main className="ml-72 pt-20">

        <div className="p-8">

          {/* HEADER PERFIL */}
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-100 text-4xl font-black text-purple-600">
                  {inicial}
                </div>

                <div>

                  <h1 className="text-4xl font-black text-slate-900">
                    {perfil.nombres}{" "}
                    {perfil.apellidos || ""}
                  </h1>

                  <p className="mt-2 text-slate-500">
                    Información general del perfil del usuario
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-black text-purple-700">
                      {getNombreRol()}
                    </span>

                    <span
                      className={`
                        rounded-full
                        px-4
                        py-1
                        text-sm
                        font-black
                        ${
                          perfil.estado
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
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

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate(-1)
                  }
                  title="Volver"
                  aria-label="Volver"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/perfil/${perfil._id}/edit`
                    )
                  }
                  title="Editar perfil"
                  aria-label="Editar perfil"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 transition hover:bg-yellow-200"
                >
                  <Edit className="h-6 w-6" />
                </button>

              </div>

            </div>

          </section>

          {/* DATOS */}
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

            {/* DATOS PERSONALES */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-black text-slate-900">
                Datos personales
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <InfoCard
                  icon={<User className="h-5 w-5" />}
                  label="Nombres"
                  value={perfil.nombres || "Sin nombre"}
                />

                <InfoCard
                  icon={<User className="h-5 w-5" />}
                  label="Apellidos"
                  value={perfil.apellidos || "Sin apellidos"}
                />

                <InfoCard
                  icon={<IdCard className="h-5 w-5" />}
                  label="C.I."
                  value={perfil.ci || "Sin C.I."}
                />

                <InfoCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Edad"
                  value={
                    perfil.edad
                      ? `${perfil.edad} años`
                      : "Sin edad"
                  }
                />

                <InfoCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Sexo"
                  value={perfil.sexo || "Sin sexo"}
                />

                <InfoCard
                  icon={<Phone className="h-5 w-5" />}
                  label="Teléfono"
                  value={perfil.telefono || "Sin teléfono"}
                />

                <div className="md:col-span-2">
                  <InfoCard
                    icon={<Mail className="h-5 w-5" />}
                    label="Correo electrónico"
                    value={perfil.email || "Sin correo"}
                  />
                </div>

              </div>

            </div>

            {/* DATOS DEL SISTEMA */}
            <div className="space-y-6">

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

                <h2 className="mb-6 text-2xl font-black text-slate-900">
                  Datos del sistema
                </h2>

                <div className="space-y-5">

                  <InfoCard
                    icon={<Building2 className="h-5 w-5" />}
                    label="Sucursal"
                    value={getNombreSucursal()}
                  />

                  <InfoCard
                    icon={<Shield className="h-5 w-5" />}
                    label="Rol"
                    value={getNombreRol()}
                  />

                  <InfoCard
                    icon={<Calendar className="h-5 w-5" />}
                    label="Fecha de creación"
                    value={formatearFecha(
                      perfil.fechaCreacion
                    )}
                  />

                </div>

              </div>

              {/* AUDITORÍA */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

                <h2 className="mb-4 text-2xl font-black text-slate-900">
                  Auditoría
                </h2>

                <div className="space-y-3 text-sm">

                  <p className="text-slate-600">
                    <span className="font-black text-slate-900">
                      Creado por:
                    </span>{" "}
                    {perfil.creadoPor || "Sin dato"}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-black text-slate-900">
                      Actualizado por:
                    </span>{" "}
                    {perfil.actualizadoPor || "Sin dato"}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-black text-slate-900">
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

        </div>

      </main>

    </div>

  );

}

/* =========================
    CARD INFO
========================= */

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

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <div className="mb-3 flex items-center gap-2 text-purple-600">

        {icon}

        <span className="text-xs font-black uppercase tracking-wide">
          {label}
        </span>

      </div>

      <p className="break-words font-black text-slate-900">
        {value}
      </p>

    </div>

  );

}