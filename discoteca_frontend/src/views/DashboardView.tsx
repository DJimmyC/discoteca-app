
import {
  Fragment,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  Transition,
} from "@headlessui/react";

import {
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ArrowRight,
  Building2,
  Edit3,
  MapPin,
  Plus,
  RefreshCcw,
  Store,
  Trash2,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";

import {
  deleteSucursalById,
  getSucursal,
} from "@/api/SucursalApi";

import type {
  SucursalType,
} from "@/types/SucursalType";

/* =====================================================
   FORMATEADORES
===================================================== */

function mostrarCreador(
  creador: unknown
): string {
  if (!creador) {
    return "No registrado";
  }

  if (typeof creador === "string") {
    return creador;
  }

  if (typeof creador === "object") {
    const usuario =
      creador as {
        nombres?: string;
        apellidos?: string;
        email?: string;
      };

    const nombreCompleto = [
      usuario.nombres,
      usuario.apellidos,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      nombreCompleto ||
      usuario.email ||
      "Usuario registrado"
    );
  }

  return "No registrado";
}

/* =====================================================
   SKELETON
===================================================== */

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 rounded-3xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   TARJETA DE SUCURSAL
===================================================== */

type SucursalCardProps = {
  sucursal: SucursalType;
  onDelete: (id: string) => void;
};

function SucursalCard({
  sucursal,
  onDelete,
}: SucursalCardProps) {
  const idSucursal =
    sucursal._id;

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group relative flex min-h-[260px]
        flex-col overflow-visible rounded-2xl
        border border-slate-200
        bg-white p-5 shadow-sm
        transition duration-200
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-lg

        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-slate-700
        dark:hover:shadow-black/30
      "
    >
      {/* MENÚ DE OPCIONES */}

      <Menu
        as="div"
        className="absolute right-3 top-3 z-20"
      >
        <Menu.Button
          aria-label="Opciones de sucursal"
          className="
            flex h-9 w-9 items-center
            justify-center rounded-xl
            text-slate-400 transition
            hover:bg-slate-100
            hover:text-slate-900

            dark:hover:bg-slate-800
            dark:hover:text-white
          "
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="transform opacity-0 scale-95 -translate-y-1"
          enterTo="transform opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100 translate-y-0"
          leaveTo="transform opacity-0 scale-95 -translate-y-1"
        >
          <Menu.Items
            className="
              absolute right-0 mt-2 w-48
              origin-top-right overflow-hidden
              rounded-xl border border-slate-200
              bg-white p-1.5 shadow-xl
              shadow-black/10 focus:outline-none

              dark:border-slate-700
              dark:bg-slate-900
              dark:shadow-black/40
            "
          >
            <Menu.Item>
              {({ active }) => (
                <Link
                  to={`/sucursal/${idSucursal}`}
                  className={`
                    flex items-center gap-3
                    rounded-lg px-3 py-2.5
                    text-sm font-medium transition

                    ${
                      active
                        ? `
                          bg-slate-100
                          text-slate-950
                          dark:bg-slate-800
                          dark:text-white
                        `
                        : `
                          text-slate-700
                          dark:text-slate-200
                        `
                    }
                  `}
                >
                  <Store size={17} />

                  Ver sucursal
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  to={`/sucursal/${idSucursal}/edit`}
                  className={`
                    flex items-center gap-3
                    rounded-lg px-3 py-2.5
                    text-sm font-medium transition

                    ${
                      active
                        ? `
                          bg-slate-100
                          text-slate-950
                          dark:bg-slate-800
                          dark:text-white
                        `
                        : `
                          text-slate-700
                          dark:text-slate-200
                        `
                    }
                  `}
                >
                  <Edit3 size={17} />

                  Editar
                </Link>
              )}
            </Menu.Item>

            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() =>
                    onDelete(idSucursal)
                  }
                  className={`
                    flex w-full items-center
                    gap-3 rounded-lg
                    px-3 py-2.5 text-left
                    text-sm font-semibold
                    text-red-600 transition

                    ${
                      active
                        ? `
                          bg-red-50
                          dark:bg-red-950/40
                        `
                        : ""
                    }

                    dark:text-red-400
                  `}
                >
                  <Trash2 size={17} />

                  Eliminar
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* ICONO */}

      <div
        className="
          flex h-12 w-12 items-center
          justify-center rounded-2xl
          bg-slate-900 text-white
          shadow-sm transition
          group-hover:scale-105

          dark:bg-white
          dark:text-slate-950
        "
      >
        <Building2 size={23} />
      </div>

      {/* INFORMACIÓN */}

      <div className="mt-5 min-w-0 flex-1">
        <h2
          className="
            truncate pr-8 text-xl font-bold
            text-slate-900

            dark:text-white
          "
          title={sucursal.nombreSucursal}
        >
          {sucursal.nombreSucursal}
        </h2>

        <div
          className="
            mt-3 flex items-start gap-2
            text-sm text-slate-500

            dark:text-slate-400
          "
        >
          <MapPin
            size={17}
            className="mt-0.5 shrink-0 text-slate-700 dark:text-slate-300"
          />

          <span className="line-clamp-2">
            {sucursal.ubicacionSucursal ||
              "Ubicación no registrada"}
          </span>
        </div>

        <div
          className="
            mt-5 rounded-xl
            bg-slate-50 px-3 py-3

            dark:bg-slate-950/60
          "
        >
          

          
        </div>
      </div>

      {/* ACCIONES */}

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
        <Link
          to={`/sucursal/${idSucursal}`}
          className="
            inline-flex items-center
            justify-center gap-2
            rounded-xl bg-slate-900
            px-4 py-2.5 text-sm
            font-semibold text-white
            transition hover:bg-slate-800

            dark:bg-white
            dark:text-slate-950
            dark:hover:bg-slate-200
          "
        >
          Ingresar

          <ArrowRight size={16} />
        </Link>

        <Link
          to={`/sucursal/${idSucursal}/edit`}
          aria-label={`Editar ${sucursal.nombreSucursal}`}
          title="Editar sucursal"
          className="
            inline-flex h-10 w-10
            items-center justify-center
            rounded-xl border
            border-slate-200
            text-slate-600 transition
            hover:bg-slate-100
            hover:text-slate-950

            dark:border-slate-700
            dark:text-slate-300
            dark:hover:bg-slate-800
            dark:hover:text-white
          "
        >
          <Edit3 size={17} />
        </Link>
      </div>
    </motion.article>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function DashboardView() {
  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    data: sucursales = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<
    SucursalType[],
    Error
  >({
    queryKey: [
      "sucursal",
    ],

    queryFn:
      getSucursal,

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  const {
    mutate:
      eliminarSucursal,

    isPending:
      eliminando,
  } = useMutation({
    mutationFn:
      deleteSucursalById,

    onSuccess: async (
      respuesta
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "sucursal",
        ],
      });

      await Swal.fire({
        icon:
          "success",

        title:
          "Sucursal eliminada",

        text:
          typeof respuesta ===
          "string"
            ? respuesta
            : "La sucursal fue eliminada correctamente.",

        timer:
          1800,

        showConfirmButton:
          false,

        background:
          document.documentElement.classList.contains(
            "dark"
          )
            ? "#0f172a"
            : "#ffffff",

        color:
          document.documentElement.classList.contains(
            "dark"
          )
            ? "#f8fafc"
            : "#0f172a",
      });
    },

    onError: async (
      mutationError: unknown
    ) => {
      const mensaje =
        mutationError instanceof
        Error
          ? mutationError.message
          : "No se pudo eliminar la sucursal.";

      await Swal.fire({
        icon:
          "error",

        title:
          "Error al eliminar",

        text:
          mensaje,

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#dc2626",

        background:
          document.documentElement.classList.contains(
            "dark"
          )
            ? "#0f172a"
            : "#ffffff",

        color:
          document.documentElement.classList.contains(
            "dark"
          )
            ? "#f8fafc"
            : "#0f172a",
      });
    },
  });

  const confirmarEliminacion =
    async (
      idSucursal: string
    ) => {
      const resultado =
        await Swal.fire({
          icon:
            "warning",

          title:
            "¿Eliminar sucursal?",

          text:
            "Esta acción puede afectar los datos relacionados con la sucursal.",

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, eliminar",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#dc2626",

          cancelButtonColor:
            "#475569",

          reverseButtons:
            true,

          background:
            document.documentElement.classList.contains(
              "dark"
            )
              ? "#0f172a"
              : "#ffffff",

          color:
            document.documentElement.classList.contains(
              "dark"
            )
              ? "#f8fafc"
              : "#0f172a",
        });

      if (
        resultado.isConfirmed
      ) {
        eliminarSucursal(
          idSucursal
        );
      }
    };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-950">
        <MenuListDashboard />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div
      className="
        flex min-h-[calc(100vh-8rem)]
        bg-slate-50 text-slate-900

        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      {/* MENÚ LATERAL */}

      <MenuListDashboard />

      {/* CONTENIDO */}

      <main
        className="
          min-w-0 flex-1
          overflow-x-hidden
          p-4 pt-20
          sm:p-6 sm:pt-20
          lg:p-8 lg:pt-8
        "
      >
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {/* ENCABEZADO */}

          <motion.header
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              relative overflow-hidden
              rounded-3xl bg-slate-900
              px-5 py-6 text-white
              shadow-xl shadow-slate-900/10

              sm:px-7 sm:py-7

              dark:border
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex h-12 w-12 shrink-0
                    items-center justify-center
                    rounded-2xl bg-white/10
                  "
                >
                  <Building2 size={25} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Administración general
                  </p>

                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                    Gestión de sucursales
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Administra las sucursales disponibles y accede a sus operaciones.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  disabled={
                    isFetching
                  }
                  aria-label="Actualizar sucursales"
                  title="Actualizar"
                  className="
                    inline-flex h-11 w-11
                    items-center justify-center
                    rounded-xl border
                    border-white/15 bg-white/10
                    text-white transition
                    hover:bg-white/20
                    disabled:opacity-50
                  "
                >
                  <RefreshCcw
                    size={18}
                    className={
                      isFetching
                        ? "animate-spin"
                        : ""
                    }
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/sucursal/create"
                    )
                  }
                  className="
                    inline-flex items-center
                    justify-center gap-2
                    rounded-xl bg-white
                    px-4 py-2.5
                    text-sm font-bold
                    text-slate-950
                    transition hover:bg-slate-100

                    sm:px-5
                  "
                >
                  <Plus size={18} />

                  <span className="hidden xs:inline">
                    Nueva sucursal
                  </span>

                  <span className="xs:hidden">
                    Nueva
                  </span>
                </button>
              </div>
            </div>
          </motion.header>

          {/* RESUMEN */}

          <section
            className="
              flex flex-col gap-3
              rounded-2xl border
              border-slate-200 bg-white
              px-5 py-4 shadow-sm

              sm:flex-row
              sm:items-center
              sm:justify-between

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl bg-slate-100
                  text-slate-700

                  dark:bg-slate-800
                  dark:text-slate-200
                "
              >
                <Store size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Sucursales registradas
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sucursales disponibles en el sistema.
                </p>
              </div>
            </div>

            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {sucursales.length}
            </p>
          </section>

          {/* ERROR */}

          {isError && (
            <section
              className="
                rounded-2xl border
                border-red-200 bg-red-50
                p-5

                dark:border-red-900/60
                dark:bg-red-950/30
              "
            >
              <p className="font-semibold text-red-700 dark:text-red-400">
                No se pudieron cargar las sucursales.
              </p>

              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                {error?.message ||
                  "Ocurrió un error inesperado."}
              </p>

              <button
                type="button"
                onClick={() =>
                  refetch()
                }
                className="
                  mt-3 rounded-lg
                  bg-red-700 px-4 py-2
                  text-sm font-semibold
                  text-white
                  hover:bg-red-800
                "
              >
                Intentar nuevamente
              </button>
            </section>
          )}

          {/* GRID */}

          {!isError &&
          sucursales.length > 0 ? (
            <motion.section
              layout
              className="
                grid gap-4
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >
              {sucursales.map(
                (sucursal) => (
                  <SucursalCard
                    key={
                      sucursal._id
                    }
                    sucursal={
                      sucursal
                    }
                    onDelete={
                      confirmarEliminacion
                    }
                  />
                )
              )}
            </motion.section>
          ) : (
            !isError && (
              <motion.section
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="
                  flex min-h-80
                  flex-col items-center
                  justify-center
                  rounded-2xl border
                  border-dashed
                  border-slate-300
                  bg-white p-8
                  text-center

                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <div
                  className="
                    flex h-16 w-16
                    items-center justify-center
                    rounded-2xl
                    bg-slate-100
                    text-slate-400

                    dark:bg-slate-800
                    dark:text-slate-500
                  "
                >
                  <Building2 size={30} />
                </div>

                <h2
                  className="
                    mt-5 text-lg font-bold
                    text-slate-900

                    dark:text-white
                  "
                >
                  No existen sucursales
                </h2>

                <p
                  className="
                    mt-2 max-w-md
                    text-sm leading-6
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Registra la primera sucursal para comenzar a administrar ventas, inventario y personal.
                </p>

                <Link
                  to="/sucursal/create"
                  className="
                    mt-5 inline-flex
                    items-center gap-2
                    rounded-xl
                    bg-slate-900
                    px-5 py-2.5
                    text-sm font-bold
                    text-white transition
                    hover:bg-slate-800

                    dark:bg-white
                    dark:text-slate-950
                    dark:hover:bg-slate-200
                  "
                >
                  <Plus size={18} />

                  Crear sucursal
                </Link>
              </motion.section>
            )
          )}
        </div>
      </main>

      {/* INDICADOR DE ELIMINACIÓN */}

      {eliminando && (
        <div
          className="
            fixed bottom-5 right-5
            z-[80] flex items-center
            gap-3 rounded-xl
            bg-slate-900 px-4 py-3
            text-sm font-semibold
            text-white shadow-xl

            dark:border
            dark:border-slate-700
          "
        >
          <RefreshCcw
            size={17}
            className="animate-spin"
          />

          Eliminando sucursal...
        </div>
      )}
    </div>
  );
}