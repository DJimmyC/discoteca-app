import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import {
  CheckCircle2,
  CircleUserRound,
  Eye,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserRoundX,
  Users,
  Warehouse,
  XCircle,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import {
  getPersonalBySucursal,
} from "@/api/PerfilUsuarioApi";

type FiltroEstado =
  | "todos"
  | "activos"
  | "inactivos";

export default function PersonalSucursalView() {

  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState<FiltroEstado>(
    "todos"
  );

  /* =========================
      GET PERSONAL
  ========================= */

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({

    queryKey: [
      "personal-sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getPersonalBySucursal(
        sucursalId!
      ),

    enabled:
      Boolean(sucursalId),

  });

  /* =========================
      FILTRAR PERSONAL
  ========================= */

  const personalFiltrado =
    useMemo(() => {

      const personal =
        data?.personal ?? [];

      const texto =
        search
          .trim()
          .toLowerCase();

      return personal.filter(
        (persona) => {

          const valores = [

            persona.nombreCompleto,

            persona.nombres,

            persona.apellidos,

            persona.email,

            persona.ci,

            persona.telefono,

            persona.rol?.nombre,

            persona.almacen?.nombre,

          ];

          const coincideBusqueda =
            !texto ||
            valores.some(
              (valor) =>
                valor
                  ?.toString()
                  .toLowerCase()
                  .includes(texto)
            );

          const coincideEstado =
            filtroEstado === "todos"
              ? true
              : filtroEstado === "activos"
                ? persona.estado
                : !persona.estado;

          return (
            coincideBusqueda &&
            coincideEstado
          );

        }
      );

    }, [
      data?.personal,
      search,
      filtroEstado,
    ]);

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (

      <div className="flex min-h-screen bg-slate-50">

        <MenuList />

        <main className="flex flex-1 items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600" />

            <p className="mt-4 font-semibold text-slate-600">

              Cargando personal...

            </p>

          </div>

        </main>

      </div>

    );

  }

  /* =========================
      ERROR
  ========================= */

  if (isError) {

    return (

      <div className="flex min-h-screen bg-slate-50">

        <MenuList />

        <main className="flex flex-1 items-center justify-center p-8">

          <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <XCircle className="mx-auto h-16 w-16 text-red-500" />

            <h1 className="mt-4 text-2xl font-black text-slate-800">

              No se pudo cargar el personal

            </h1>

            <p className="mt-2 text-sm text-slate-500">

              {error instanceof Error
                ? error.message
                : "Ocurrió un error inesperado"}

            </p>

          </div>

        </main>

      </div>

    );

  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <MenuList />

      {/* CONTENT */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* =========================
            HEADER
        ========================= */}

        <motion.div

          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <h1 className="break-words text-3xl font-black text-slate-800 sm:text-4xl">

                Personal.{" "}

                <span className="uppercase">

                  {data?.sucursal?.nombre ||
                    "Sucursal"}

                </span>

              </h1>

              <p className="mt-2 text-slate-500">

                Gestión de personal por sucursal

              </p>

              {data?.sucursal?.ubicacion && (

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                  <MapPin className="h-4 w-4 text-fuchsia-600" />

                  {data.sucursal.ubicacion}

                </div>

              )}

            </div>

            <Link

              to={`/sucursal/${sucursalId}/personal/create`}

              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-fuchsia-600
                to-purple-600
                px-6
                py-4
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition
                hover:scale-105
                sm:w-auto
              "
            >

              <Plus className="h-5 w-5" />

              Nuevo Personal

            </Link>

          </div>

        </motion.div>

        {/* =========================
            RESUMEN
        ========================= */}

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            {/* ESTADÍSTICAS */}

            <div className="flex flex-wrap gap-8 sm:gap-10">

              <div>

                <p className="text-xs uppercase text-slate-500">

                  Total

                </p>

                <p className="text-4xl font-black text-slate-800">

                  {data?.cantidadPersonal ?? 0}

                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">

                  Activos

                </p>

                <p className="text-4xl font-black text-emerald-600">

                  {data?.cantidadActivos ?? 0}

                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">

                  Inactivos

                </p>

                <p className="text-4xl font-black text-red-500">

                  {data?.cantidadInactivos ?? 0}

                </p>

              </div>

            </div>

            {/* BUSCADOR */}

            <div className="relative w-full max-w-md">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar personal..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  bg-white
                  py-4
                  pl-12
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-fuchsia-500
                  focus:ring-4
                  focus:ring-fuchsia-100
                "
              />

            </div>

          </div>

          {/* FILTROS */}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">

              Mostrando{" "}

              <span className="font-bold text-slate-800">

                {personalFiltrado.length}

              </span>{" "}

              de{" "}

              <span className="font-bold text-slate-800">

                {data?.cantidadPersonal ?? 0}

              </span>{" "}

              personas

            </p>

            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">

              <FiltroButton
                activo={
                  filtroEstado === "todos"
                }
                onClick={() =>
                  setFiltroEstado(
                    "todos"
                  )
                }
              >

                Todos

              </FiltroButton>

              <FiltroButton
                activo={
                  filtroEstado === "activos"
                }
                onClick={() =>
                  setFiltroEstado(
                    "activos"
                  )
                }
              >

                Activos

              </FiltroButton>

              <FiltroButton
                activo={
                  filtroEstado === "inactivos"
                }
                onClick={() =>
                  setFiltroEstado(
                    "inactivos"
                  )
                }
              >

                Inactivos

              </FiltroButton>

            </div>

          </div>

        </div>

        {/* =========================
            TABLA
        ========================= */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">

                    Personal

                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">

                    Contacto

                  </th>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">

                    Rol y almacén

                  </th>

                  <th className="px-6 py-5 text-center text-xs font-black uppercase text-slate-500">

                    Estado

                  </th>

                  <th className="px-6 py-5 text-center text-xs font-black uppercase text-slate-500">

                    Acciones

                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {personalFiltrado.map(
                  (persona) => (

                    <tr
                      key={persona._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* PERSONAL */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-100 font-black text-fuchsia-700">

                            {obtenerIniciales(
                              persona.nombres,
                              persona.apellidos
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-lg font-bold text-slate-800">

                              {persona.nombreCompleto}

                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                              <CircleUserRound className="h-4 w-4" />

                              CI:{" "}

                              {persona.ci ||
                                "No registrado"}

                            </p>

                            <p className="mt-1 text-sm text-slate-500">

                              {persona.edad
                                ? `${persona.edad} años`
                                : "Edad no registrada"}

                              {" · "}

                              {persona.sexo ||
                                "Sexo no registrado"}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CONTACTO */}

                      <td className="px-6 py-5">

                        <div className="space-y-2">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <Mail className="h-4 w-4 text-slate-400" />

                            <span className="max-w-[220px] truncate">

                              {persona.email ||
                                "No registrado"}

                            </span>

                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <Phone className="h-4 w-4 text-slate-400" />

                            {persona.telefono ||
                              "No registrado"}

                          </div>

                        </div>

                      </td>

                      {/* ROL Y ALMACÉN */}

                      <td className="px-6 py-5">

                        <div className="space-y-2">

                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">

                            <ShieldCheck className="h-4 w-4 text-fuchsia-600" />

                            {persona.rol?.nombre ||
                              "Sin rol"}

                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">

                            <Warehouse className="h-4 w-4" />

                            {persona.almacen?.nombre ||
                              "Sin almacén"}

                          </div>

                        </div>

                      </td>

                      {/* ESTADO */}

                      <td className="px-6 py-5 text-center">

                        <EstadoBadge
                          estado={
                            persona.estado
                          }
                        />

                      </td>

                      {/* ACCIONES */}

                      <td className="px-6 py-5">

                        <div className="flex items-center justify-center gap-3">

                          <Link
                            to={`/sucursal/${sucursalId}/personal/${persona._id}`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition hover:scale-110 hover:bg-blue-200"
                            title="Ver personal"
                          >

                            <Eye className="h-5 w-5" />

                          </Link>

                          <Link
                            to={`/sucursal/${sucursalId}/personal/${persona._id}/edit`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition hover:scale-110 hover:bg-amber-200"
                            title="Editar personal"
                          >

                            <Pencil className="h-5 w-5" />

                          </Link>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          {/* SIN REGISTROS */}

          {personalFiltrado.length === 0 && (

            <div className="p-12 text-center">

              <UserRoundX className="mx-auto h-16 w-16 text-slate-300" />

              <h2 className="mt-4 text-xl font-black text-slate-800">

                No se encontró personal

              </h2>

              <p className="mt-2 text-sm text-slate-500">

                No existen registros que coincidan con la búsqueda o el filtro seleccionado.

              </p>

            </div>

          )}

        </div>

      </main>

    </div>

  );

}

/* =========================
    FILTRO
========================= */

function FiltroButton({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-xs font-bold transition sm:text-sm ${
        activo
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:text-slate-950"
      }`}
    >

      {children}

    </button>

  );

}

/* =========================
    ESTADO
========================= */

function EstadoBadge({
  estado,
}: {
  estado: boolean;
}) {

  return estado ? (

    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

      <CheckCircle2 className="h-3.5 w-3.5" />

      Activo

    </span>

  ) : (

    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

      <XCircle className="h-3.5 w-3.5" />

      Inactivo

    </span>

  );

}

/* =========================
    INICIALES
========================= */

function obtenerIniciales(
  nombres: string,
  apellidos: string
) {

  const inicialNombre =
    nombres
      ?.trim()
      .charAt(0)
      .toUpperCase() || "";

  const inicialApellido =
    apellidos
      ?.trim()
      .charAt(0)
      .toUpperCase() || "";

  return (
    `${inicialNombre}${inicialApellido}` ||
    "US"
  );

}