// src/views/perfilUsuario/PersonalSucursalView.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import Swal from "sweetalert2";

import {
  AlertTriangle,
  Building2,
  Eye,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  Warehouse,
  X,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import {
  deletePerfilUsuarioById,
  getPerfilUsuarios,
} from "@/api/PerfilUsuarioApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import {
  useAuth,
} from "@/hooks/useAuth";

import type {
  PerfilUsuarioType,
} from "@/types/PerfilUsuarioType";

import type {
  SucursalType,
} from "@/types/SucursalType";

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

type FiltroEstado =
  | "todos"
  | "activos"
  | "inactivos";

type ReferenciaBasica = {
  _id?: string;
  nombre?: string;
  nombreRol?: string;
  nombreSucursal?: string;
};

/* =====================================================
   UTILIDADES
===================================================== */

function obtenerIdReferencia(
  referencia:
    | string
    | ReferenciaBasica
    | null
    | undefined
): string {
  if (!referencia) {
    return "";
  }

  if (
    typeof referencia ===
    "string"
  ) {
    return referencia;
  }

  return referencia._id ?? "";
}

function obtenerNombreCompleto(
  perfil: PerfilUsuarioType
): string {
  const nombres =
    String(
      perfil.nombres ?? ""
    ).trim();

  const apellidos =
    String(
      perfil.apellidos ?? ""
    ).trim();

  const nombreCompleto = [
    nombres,
    apellidos,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    nombreCompleto ||
    "Usuario sin nombre"
  );
}

function obtenerIniciales(
  perfil: PerfilUsuarioType
): string {
  return obtenerNombreCompleto(
    perfil
  )
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (palabra) =>
        palabra.charAt(0)
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function obtenerNombreRol(
  perfil: PerfilUsuarioType
): string {
  const rol =
    perfil.idRol;

  if (
    rol &&
    typeof rol ===
      "object"
  ) {
    return (
      rol.nombre ||
      rol.nombreRol ||
      "Sin rol"
    );
  }

  return "Sin rol";
}

function obtenerNombreAlmacen(
  perfil: PerfilUsuarioType
): string {
  const almacen =
    perfil.idAlmacen;

  if (
    almacen &&
    typeof almacen ===
      "object"
  ) {
    return (
      almacen.nombre ||
      "Sin almacén"
    );
  }

  return "Sin almacén";
}

function normalizarTexto(
  valor: unknown
): string {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

function esModoOscuro(): boolean {
  return document.documentElement.classList.contains(
    "dark"
  );
}

function obtenerMensajeError(
  error: unknown
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

/* =====================================================
   SKELETON
===================================================== */

function PersonalSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-36 rounded-2xl bg-slate-200 sm:h-40 sm:rounded-3xl dark:bg-slate-800" />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {Array.from({
          length: 3,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-24 rounded-xl bg-slate-200 sm:h-28 sm:rounded-2xl dark:bg-slate-800"
            />
          )
        )}
      </div>

      <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          )
        )}
      </div>
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function PersonalSucursalView() {
  const queryClient =
    useQueryClient();

  const {
    data: usuarioAutenticado,
  } = useAuth();

  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState<FiltroEstado>(
    "todos"
  );

  /* =====================================================
     CONSULTAR SUCURSAL
  ===================================================== */

  const {
    data: sucursal,
    isLoading:
      cargandoSucursal,
    isError:
      errorSucursal,
  } = useQuery<
    SucursalType,
    Error
  >({
    queryKey: [
      "sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getSucursalById(
        sucursalId!
      ),

    enabled:
      Boolean(sucursalId),

    retry:
      false,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     CONSULTAR PERSONAL
  ===================================================== */

  const {
    data: perfiles = [],
    isLoading:
      cargandoPerfiles,
    isError:
      errorPerfiles,
    error:
      perfilesError,
    refetch:
      recargarPerfiles,
    isFetching:
      actualizandoPerfiles,
  } = useQuery<
    PerfilUsuarioType[],
    Error
  >({
    queryKey: [
      "perfilusuarios",
      sucursalId,
    ],

    queryFn:
      getPerfilUsuarios,

    enabled:
      Boolean(sucursalId),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     PERSONAL DE LA SUCURSAL
  ===================================================== */

  const personalSucursal =
    useMemo(() => {
      if (!sucursalId) {
        return [];
      }

      return perfiles.filter(
        (perfil) => {
          const idSucursalPerfil =
            obtenerIdReferencia(
              perfil.idSucursal
            );

          return (
            idSucursalPerfil ===
            sucursalId
          );
        }
      );
    }, [
      perfiles,
      sucursalId,
    ]);

  /* =====================================================
     FILTROS
  ===================================================== */

  const personalFiltrado =
    useMemo(() => {
      const texto =
        normalizarTexto(
          busqueda
        );

      return personalSucursal.filter(
        (perfil) => {
          const estaActivo =
            Boolean(
              perfil.estado
            );

          const coincideEstado =
            filtroEstado ===
              "todos" ||
            (
              filtroEstado ===
                "activos" &&
              estaActivo
            ) ||
            (
              filtroEstado ===
                "inactivos" &&
              !estaActivo
            );

          if (!coincideEstado) {
            return false;
          }

          if (!texto) {
            return true;
          }

          const contenido = [
            obtenerNombreCompleto(
              perfil
            ),

            perfil.ci,
            perfil.email,
            perfil.telefono,

            obtenerNombreRol(
              perfil
            ),

            obtenerNombreAlmacen(
              perfil
            ),
          ]
            .map(
              normalizarTexto
            )
            .join(" ");

          return contenido.includes(
            texto
          );
        }
      );
    }, [
      personalSucursal,
      busqueda,
      filtroEstado,
    ]);

  /* =====================================================
     ESTADÍSTICAS
  ===================================================== */

  const totalPersonal =
    personalSucursal.length;

  const personalActivo =
    personalSucursal.filter(
      (perfil) =>
        Boolean(
          perfil.estado
        )
    ).length;

  const personalInactivo =
    totalPersonal -
    personalActivo;

  /* =====================================================
     ELIMINAR PERSONAL
  ===================================================== */

  const {
    mutate:
      eliminarPerfil,

    isPending:
      eliminando,
  } = useMutation({
    mutationFn:
      deletePerfilUsuarioById,

    onSuccess: async (
      respuesta
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "perfilusuarios",
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: [
          "perfilusuarios",
          sucursalId,
        ],
      });

      await Swal.fire({
        icon:
          "success",

        title:
          "Personal eliminado",

        text:
          typeof respuesta ===
          "string"
            ? respuesta
            : "El perfil fue eliminado correctamente.",

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
    },

    onError: async (
      error: unknown
    ) => {
      await Swal.fire({
        icon:
          "error",

        title:
          "No se pudo eliminar",

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

  const confirmarEliminacion =
    async (
      perfil: PerfilUsuarioType
    ) => {
      const resultado =
        await Swal.fire({
          icon:
            "warning",

          title:
            "¿Eliminar personal?",

          text:
            `Se eliminará el perfil de ${obtenerNombreCompleto(
              perfil
            )}.`,

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, eliminar",

          cancelButtonText:
            "Cancelar",

          reverseButtons:
            true,

          confirmButtonColor:
            "#dc2626",

          cancelButtonColor:
            "#475569",

          background:
            esModoOscuro()
              ? "#0f172a"
              : "#ffffff",

          color:
            esModoOscuro()
              ? "#f8fafc"
              : "#0f172a",
        });

      if (
        !resultado.isConfirmed
      ) {
        return;
      }

      eliminarPerfil({
        id:
          perfil._id,

        eliminadoPor:
          usuarioAutenticado?._id ??
          "",
      });
    };

  /* =====================================================
     ESTADOS GENERALES
  ===================================================== */

  if (!sucursalId) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  if (
    cargandoSucursal ||
    cargandoPerfiles
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <PersonalSkeleton />
        </main>
      </div>
    );
  }

  if (
    errorSucursal ||
    !sucursal
  ) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  return (
    <div
      className="
        flex min-h-screen w-full
        overflow-x-hidden bg-slate-50
        text-slate-900

        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      {/* MENÚ LATERAL */}

      <MenuList />

      {/* CONTENIDO */}

      <main
        className="
          min-w-0 flex-1
          overflow-x-hidden
          px-3 pb-6 pt-20

          sm:px-5 sm:pt-20
          lg:p-8 lg:pt-8
        "
      >
        <div className="mx-auto w-full min-w-0 max-w-7xl space-y-5 sm:space-y-6">
          {/* =================================================
              HEADER
          ================================================= */}

          <motion.header
            initial={{
              opacity: 0,
              y: -12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              relative w-full min-w-0
              overflow-hidden rounded-2xl
              bg-slate-900 p-4
              text-white shadow-lg

              sm:rounded-3xl
              sm:p-6

              dark:border
              dark:border-slate-800
            "
          >
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative z-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Users size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                    Gestión de personal
                  </p>

                  <h1
                    title={`Personal de ${sucursal.nombreSucursal}`}
                    className="mt-1 truncate text-xl font-bold sm:text-3xl"
                  >
                    Personal de{" "}
                    {
                      sucursal.nombreSucursal
                    }
                  </h1>

                  <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-300">
                    <MapPin
                      size={15}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {sucursal.ubicacionSucursal ||
                        "Ubicación no registrada"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    recargarPerfiles()
                  }
                  disabled={
                    actualizandoPerfiles
                  }
                  className="
                    inline-flex min-w-0
                    items-center justify-center
                    gap-2 rounded-xl
                    border border-white/15
                    bg-white/10 px-3
                    py-2.5 text-sm
                    font-semibold text-white
                    transition hover:bg-white/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <RefreshCcw
                    size={16}
                    className={
                      actualizandoPerfiles
                        ? "animate-spin"
                        : ""
                    }
                  />

                  <span className="truncate">
                    Actualizar
                  </span>
                </button>

                <Link
                  to={`/perfilusuario/create?sucursalId=${sucursalId}`}
                  className="
                    inline-flex min-w-0
                    items-center justify-center
                    gap-2 rounded-xl
                    bg-white px-3 py-2.5
                    text-sm font-bold
                    text-slate-950 transition
                    hover:bg-slate-100
                  "
                >
                  <Plus size={17} />

                  <span className="truncate">
                    Nuevo
                  </span>
                </Link>
              </div>
            </div>
          </motion.header>

          {/* =================================================
              RESUMEN
          ================================================= */}

          <section className="grid grid-cols-3 gap-2 sm:gap-4">
            <article
              className="
                min-w-0 rounded-xl
                border border-slate-200
                bg-white p-3 shadow-sm

                sm:rounded-2xl
                sm:p-5

                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                Total
              </p>

              <p className="mt-1 truncate text-xl font-bold text-slate-900 sm:mt-2 sm:text-3xl dark:text-white">
                {totalPersonal}
              </p>

              <p className="mt-1 hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">
                Personas asignadas
              </p>
            </article>

            <article
              className="
                min-w-0 rounded-xl
                border border-emerald-200
                bg-white p-3 shadow-sm

                sm:rounded-2xl
                sm:p-5

                dark:border-emerald-900/50
                dark:bg-slate-900
              "
            >
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-emerald-600 sm:text-xs dark:text-emerald-400">
                Activos
              </p>

              <p className="mt-1 truncate text-xl font-bold text-emerald-700 sm:mt-2 sm:text-3xl dark:text-emerald-400">
                {personalActivo}
              </p>

              <p className="mt-1 hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">
                Personal habilitado
              </p>
            </article>

            <article
              className="
                min-w-0 rounded-xl
                border border-red-200
                bg-white p-3 shadow-sm

                sm:rounded-2xl
                sm:p-5

                dark:border-red-900/50
                dark:bg-slate-900
              "
            >
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-red-600 sm:text-xs dark:text-red-400">
                Inactivos
              </p>

              <p className="mt-1 truncate text-xl font-bold text-red-700 sm:mt-2 sm:text-3xl dark:text-red-400">
                {personalInactivo}
              </p>

              <p className="mt-1 hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">
                Personal deshabilitado
              </p>
            </article>
          </section>

          {/* =================================================
              FILTROS
          ================================================= */}

          <section
            className="
              w-full min-w-0
              rounded-2xl border
              border-slate-200
              bg-white p-3 shadow-sm

              sm:p-4

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="relative min-w-0">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={
                    busqueda
                  }
                  onChange={(
                    event
                  ) =>
                    setBusqueda(
                      event.target.value
                    )
                  }
                  placeholder="Buscar personal..."
                  className="
                    w-full min-w-0
                    rounded-xl border
                    border-slate-300
                    bg-slate-50 py-3
                    pl-11 pr-11
                    text-sm text-slate-900
                    outline-none transition

                    placeholder:text-slate-400

                    focus:border-slate-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-slate-200/60

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                    dark:focus:border-slate-500
                    dark:focus:ring-slate-700/40
                  "
                />

                {busqueda && (
                  <button
                    type="button"
                    onClick={() =>
                      setBusqueda("")
                    }
                    aria-label="Limpiar búsqueda"
                    className="
                      absolute right-3 top-1/2
                      flex h-7 w-7
                      -translate-y-1/2
                      items-center justify-center
                      rounded-lg text-slate-400
                      transition hover:bg-slate-200
                      hover:text-slate-700

                      dark:hover:bg-slate-800
                      dark:hover:text-white
                    "
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <select
                value={
                  filtroEstado
                }
                onChange={(
                  event
                ) =>
                  setFiltroEstado(
                    event.target.value as FiltroEstado
                  )
                }
                className="
                  w-full rounded-xl
                  border border-slate-300
                  bg-white px-4 py-3
                  text-sm font-medium
                  text-slate-700
                  outline-none transition

                  focus:border-slate-500
                  focus:ring-4
                  focus:ring-slate-200/60

                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                  dark:focus:ring-slate-700/40
                "
              >
                <option value="todos">
                  Todos
                </option>

                <option value="activos">
                  Activos
                </option>

                <option value="inactivos">
                  Inactivos
                </option>
              </select>
            </div>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Mostrando{" "}
              <strong className="text-slate-900 dark:text-white">
                {
                  personalFiltrado.length
                }
              </strong>{" "}
              personas
            </p>
          </section>

          {/* =================================================
              ERROR
          ================================================= */}

          {errorPerfiles && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={22}
                  className="mt-0.5 shrink-0 text-red-700 dark:text-red-400"
                />

                <div className="min-w-0">
                  <h2 className="font-bold text-red-800 dark:text-red-300">
                    No se pudo cargar el personal
                  </h2>

                  <p className="mt-1 break-words text-sm text-red-700 dark:text-red-400">
                    {obtenerMensajeError(
                      perfilesError
                    )}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              TARJETAS PARA CELULAR
          ================================================= */}

          {!errorPerfiles &&
            personalFiltrado.length >
              0 && (
              <section className="grid w-full min-w-0 grid-cols-1 gap-4 md:hidden">
                {personalFiltrado.map(
                  (perfil) => (
                    <motion.article
                      key={
                        perfil._id
                      }
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="
                        w-full min-w-0
                        max-w-full overflow-hidden
                        rounded-2xl border
                        border-slate-200
                        bg-white shadow-sm

                        dark:border-slate-800
                        dark:bg-slate-900
                      "
                    >
                      {/* CABECERA */}

                      <div className="min-w-0 p-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className="
                              flex h-12 w-12
                              shrink-0 items-center
                              justify-center
                              rounded-full
                              bg-slate-950
                              text-sm font-bold
                              text-white

                              dark:bg-white
                              dark:text-slate-950
                            "
                          >
                            {obtenerIniciales(
                              perfil
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h2
                              title={obtenerNombreCompleto(
                                perfil
                              )}
                              className="max-w-full truncate text-base font-bold text-slate-950 dark:text-white"
                            >
                              {obtenerNombreCompleto(
                                perfil
                              )}
                            </h2>

                            <p
                              title={
                                perfil.email ||
                                ""
                              }
                              className="mt-1 max-w-full truncate text-sm text-slate-500 dark:text-slate-400"
                            >
                              {perfil.email ||
                                "Sin correo registrado"}
                            </p>
                          </div>

                          <span
                            className={`
                              shrink-0 rounded-full
                              px-2 py-1
                              text-[10px] font-semibold

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
                            {perfil.estado
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </div>
                      </div>

                      {/* INFORMACIÓN */}

                      <div
                        className="
                          mx-4 mb-4 grid
                          min-w-0 gap-3
                          rounded-xl bg-slate-50
                          p-4

                          dark:bg-slate-950/60
                        "
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <ShieldCheck
                            size={18}
                            className="shrink-0 text-blue-600 dark:text-blue-400"
                          />

                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-slate-400">
                              Rol
                            </p>

                            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                              {obtenerNombreRol(
                                perfil
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                          <Warehouse
                            size={18}
                            className="shrink-0 text-amber-600 dark:text-amber-400"
                          />

                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-slate-400">
                              Almacén
                            </p>

                            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                              {obtenerNombreAlmacen(
                                perfil
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                          <Phone
                            size={18}
                            className="shrink-0 text-emerald-600 dark:text-emerald-400"
                          />

                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-slate-400">
                              Teléfono
                            </p>

                            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                              {perfil.telefono ||
                                "Sin teléfono registrado"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ACCIONES */}

                      <div
                        className="
                          grid grid-cols-2 gap-2
                          border-t border-slate-100
                          bg-slate-50/70 p-3

                          dark:border-slate-800
                          dark:bg-slate-950/30
                        "
                      >
                        <Link
                          to={`/sucursal/${sucursalId}/usuarioDetalle/${perfil._id}`}
                          className="
                            inline-flex min-w-0
                            items-center justify-center
                            gap-2 rounded-xl
                            bg-blue-50 px-3 py-2.5
                            text-sm font-semibold
                            text-blue-700 transition
                            hover:bg-blue-100

                            dark:bg-blue-950/40
                            dark:text-blue-400
                            dark:hover:bg-blue-950/70
                          "
                        >
                          <Eye
                            size={17}
                            className="shrink-0"
                          />

                          <span className="truncate">
                            Ver
                          </span>
                        </Link>

                        <Link
                          to={`/perfilusuario/${perfil._id}/edit`}
                          className="
                            inline-flex min-w-0
                            items-center justify-center
                            gap-2 rounded-xl
                            bg-amber-50 px-3 py-2.5
                            text-sm font-semibold
                            text-amber-700 transition
                            hover:bg-amber-100

                            dark:bg-amber-950/40
                            dark:text-amber-400
                            dark:hover:bg-amber-950/70
                          "
                        >
                          <Pencil
                            size={17}
                            className="shrink-0"
                          />

                          <span className="truncate">
                            Editar
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            confirmarEliminacion(
                              perfil
                            )
                          }
                          className="
                            col-span-2 inline-flex
                            min-w-0 items-center
                            justify-center gap-2
                            rounded-xl bg-red-50
                            px-3 py-2.5
                            text-sm font-semibold
                            text-red-700 transition
                            hover:bg-red-100

                            dark:bg-red-950/40
                            dark:text-red-400
                            dark:hover:bg-red-950/70
                          "
                        >
                          <Trash2
                            size={17}
                            className="shrink-0"
                          />

                          Eliminar personal
                        </button>
                      </div>
                    </motion.article>
                  )
                )}
              </section>
            )}

          {/* =================================================
              TABLA PARA TABLET Y ESCRITORIO
          ================================================= */}

          {!errorPerfiles &&
            personalFiltrado.length >
              0 && (
              <motion.section
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  hidden overflow-hidden
                  rounded-2xl border
                  border-slate-200
                  bg-white shadow-sm

                  md:block

                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px]">
                    <thead className="bg-slate-100 dark:bg-slate-950/70">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Personal
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Contacto
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                          Rol
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                          Almacén
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                          Estado
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {personalFiltrado.map(
                        (perfil) => (
                          <tr
                            key={
                              perfil._id
                            }
                            className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          >
                            <td className="px-5 py-4">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                                  {obtenerIniciales(
                                    perfil
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-56 truncate font-bold text-slate-900 dark:text-white">
                                    {obtenerNombreCompleto(
                                      perfil
                                    )}
                                  </p>

                                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    CI:{" "}
                                    {perfil.ci ||
                                      "No registrado"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="flex max-w-60 items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <Mail
                                  size={15}
                                  className="shrink-0"
                                />

                                <span className="truncate">
                                  {perfil.email ||
                                    "Sin correo"}
                                </span>
                              </p>

                              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Phone
                                  size={15}
                                  className="shrink-0"
                                />

                                {perfil.telefono ||
                                  "Sin teléfono"}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex max-w-48 items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                                <ShieldCheck
                                  size={14}
                                  className="shrink-0"
                                />

                                <span className="truncate">
                                  {obtenerNombreRol(
                                    perfil
                                  )}
                                </span>
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex max-w-48 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Warehouse
                                  size={16}
                                  className="shrink-0"
                                />

                                <span className="truncate">
                                  {obtenerNombreAlmacen(
                                    perfil
                                  )}
                                </span>
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span
                                className={`
                                  inline-flex rounded-full
                                  px-3 py-1
                                  text-xs font-semibold

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
                                {perfil.estado
                                  ? "Activo"
                                  : "Inactivo"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  to={`/sucursal/${sucursalId}/usuarioDetalle/${perfil._id}`}
                                  aria-label={`Ver ${obtenerNombreCompleto(
                                    perfil
                                  )}`}
                                  title="Ver personal"
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition hover:scale-105 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                                >
                                  <Eye size={18} />
                                </Link>

                                <Link
                                  to={`/perfilusuario/${perfil._id}/edit`}
                                  aria-label={`Editar ${obtenerNombreCompleto(
                                    perfil
                                  )}`}
                                  title="Editar personal"
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition hover:scale-105 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                                >
                                  <Pencil size={18} />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    confirmarEliminacion(
                                      perfil
                                    )
                                  }
                                  aria-label={`Eliminar ${obtenerNombreCompleto(
                                    perfil
                                  )}`}
                                  title="Eliminar personal"
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700 transition hover:scale-105 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            )}

          {/* =================================================
              ESTADO VACÍO
          ================================================= */}

          {!errorPerfiles &&
            personalFiltrado.length ===
              0 && (
              <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <UserRound size={30} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {busqueda
                    ? "No se encontró personal"
                    : "No existe personal asignado"}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {busqueda
                    ? "Prueba con otro nombre, CI, correo, rol, teléfono o almacén."
                    : "Registra personal y asígnalo a esta sucursal para que aparezca en esta vista."}
                </p>

                {busqueda ? (
                  <button
                    type="button"
                    onClick={() =>
                      setBusqueda("")
                    }
                    className="mt-5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Limpiar búsqueda
                  </button>
                ) : (
                  <Link
                    to={`/perfilusuario/create?sucursalId=${sucursalId}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    <Plus size={18} />

                    Registrar personal
                  </Link>
                )}
              </section>
            )}
        </div>
      </main>

      {/* =================================================
          INDICADOR DE ELIMINACIÓN
      ================================================= */}

      {eliminando && (
        <div className="fixed bottom-4 left-4 right-4 z-[90] flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-5 sm:w-auto">
          <RefreshCcw
            size={17}
            className="animate-spin"
          />

          Eliminando personal...
        </div>
      )}
    </div>
  );
}