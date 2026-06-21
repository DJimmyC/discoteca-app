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
  Archive,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  CirclePlus,
  DoorOpen,
  LayoutGrid,
  LoaderCircle,
  LockKeyhole,
  Pencil,
  RefreshCcw,
  Search,
  Trash2,
  WalletCards,
  XCircle,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { toast } from "react-toastify";

import MenuList from "@/components/MenuList";

// import {
//   deleteCajaById,
//   getCajasBySucursal,
// } from "@/api/CajaApi";

import {
  deleteCajaById,
  getCajasBySucursal,
} from "@/api/CajaApi";

import type {
  CajaListType,
  DeleteCajaType,
} from "@/types/CajaType";

/* =====================================================
   TIPOS
===================================================== */

type FiltroEstado =
  | "todos"
  | "activas"
  | "inactivas";

type TooltipEstadoProps = {
  active?: boolean;

  payload?: Array<{
    name?: string;
    value?: number;
  }>;
};

/* =====================================================
   HELPERS
===================================================== */

const obtenerDescripcion = (
  descripcion: CajaListType["descripcion"]
): string => {
  if (
    typeof descripcion !== "string" ||
    descripcion.trim() === ""
  ) {
    return "Sin descripción registrada";
  }

  return descripcion;
};

const obtenerEstadoCaja = (
  estado: CajaListType["estado"]
): boolean => {
  return estado !== false;
};

/* =====================================================
   TOOLTIP DE LA GRÁFICA
===================================================== */

function TooltipEstado({
  active,
  payload,
}: TooltipEstadoProps) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const dato = payload[0];

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {dato.name}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Cantidad:{" "}
        <span className="font-bold text-gray-900">
          {dato.value ?? 0}
        </span>
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON DE CARGA
===================================================== */

function VistaSkeleton() {
  return (
    <section className="animate-pulse space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-56 rounded-lg bg-gray-200" />

          <div className="mt-3 h-4 w-72 max-w-full rounded bg-gray-200" />
        </div>

        <div className="flex gap-3">
          <div className="h-11 w-32 rounded-xl bg-gray-200" />

          <div className="h-11 w-36 rounded-xl bg-gray-200" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-gray-200"
            />
          )
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-72 rounded-2xl bg-gray-200" />

        <div className="h-72 rounded-2xl bg-gray-200" />
      </div>

      <div className="h-96 rounded-2xl bg-gray-200" />
    </section>
  );
}

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function CajaDetailView() {
  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const queryClient =
    useQueryClient();

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] =
    useState<FiltroEstado>(
      "todos"
    );

  const [
    cajaEliminando,
    setCajaEliminando,
  ] =
    useState<string | null>(
      null
    );

  /* =====================================================
     CONSULTAR CAJAS
  ===================================================== */

  const {
    data: cajas = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "cajas",
      sucursalId,
    ],

    queryFn: () =>
      getCajasBySucursal(
        sucursalId!
      ),

    enabled:
      Boolean(sucursalId),

    staleTime:
      1000 * 60 * 2,

    retry: 1,
  });

  /* =====================================================
     ELIMINAR CAJA
  ===================================================== */

  const eliminarCajaMutation =
    useMutation({
      mutationFn: (
        datos: DeleteCajaType
      ) => deleteCajaById(datos),

      onMutate: (
        variables
      ) => {
        setCajaEliminando(
          variables.id
        );
      },

      onSuccess:
        async () => {
          toast.success(
            "Caja eliminada correctamente"
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "cajas",
              sucursalId,
            ],
          });
        },

      onError: (
        mutationError: Error
      ) => {
        toast.error(
          mutationError.message ||
            "No se pudo eliminar la caja"
        );
      },

      onSettled: () => {
        setCajaEliminando(
          null
        );
      },
    });

  /* =====================================================
     ESTADÍSTICAS
  ===================================================== */

  const totalCajas =
    cajas.length;

  const cajasActivas =
    useMemo(() => {
      return cajas.filter(
        (caja) =>
          obtenerEstadoCaja(
            caja.estado
          )
      ).length;
    }, [cajas]);

  const cajasInactivas =
    totalCajas -
    cajasActivas;

  const porcentajeActivas =
    totalCajas > 0
      ? Math.round(
          (cajasActivas /
            totalCajas) *
            100
        )
      : 0;

  const datosGrafica =
    useMemo(
      () => [
        {
          name: "Activas",
          value:
            cajasActivas,
        },
        {
          name: "Inactivas",
          value:
            cajasInactivas,
        },
      ],
      [
        cajasActivas,
        cajasInactivas,
      ]
    );

  const coloresGrafica = [
    "#10b981",
    "#ef4444",
  ];

  /* =====================================================
     FILTRADO
  ===================================================== */

  const cajasFiltradas =
    useMemo(() => {
      const termino =
        busqueda
          .trim()
          .toLowerCase();

      return cajas.filter(
        (caja) => {
          const activa =
            obtenerEstadoCaja(
              caja.estado
            );

          const nombre =
            caja.nombre
              .toLowerCase();

          const descripcion =
            obtenerDescripcion(
              caja.descripcion
            ).toLowerCase();

          const coincideBusqueda =
            nombre.includes(
              termino
            ) ||
            descripcion.includes(
              termino
            );

          const coincideEstado =
            filtroEstado ===
              "todos" ||
            (filtroEstado ===
              "activas" &&
              activa) ||
            (filtroEstado ===
              "inactivas" &&
              !activa);

          return (
            coincideBusqueda &&
            coincideEstado
          );
        }
      );
    }, [
      cajas,
      busqueda,
      filtroEstado,
    ]);

  /* =====================================================
     LIMPIAR FILTROS
  ===================================================== */

  const limpiarFiltros =
    () => {
      setBusqueda("");
      setFiltroEstado(
        "todos"
      );
    };

  /* =====================================================
     CONFIRMAR ELIMINACIÓN
  ===================================================== */

  const handleEliminar =
    (
      caja: CajaListType
    ) => {
      const confirmar =
        window.confirm(
          `¿Está seguro de eliminar la caja "${caja.nombre}"?`
        );

      if (!confirmar) {
        return;
      }

      /*
       * Sustituye este localStorage por el usuario
       * autenticado de tu AuthContext.
       *
       * Ejemplo:
       * const eliminadoPor = usuario._id;
       */

      const usuarioId =
        localStorage.getItem(
          "usuarioId"
        );

      if (!usuarioId) {
        toast.error(
          "No se encontró el usuario autenticado"
        );

        return;
      }

      eliminarCajaMutation.mutate({
        id: caja._id,
        eliminadoPor:
          usuarioId,
      });
    };

  /* =====================================================
     VALIDAR ID DE SUCURSAL
  ===================================================== */

  if (!sucursalId) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  /* =====================================================
     VISTA DE CARGA
  ===================================================== */

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="p-4 pt-20 sm:p-6 md:pt-6">
            <VistaSkeleton />
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     VISTA DE ERROR
  ===================================================== */

  if (isError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="p-4 pt-20 sm:p-6 md:pt-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <div className="flex gap-3">
                <XCircle className="mt-0.5 shrink-0 text-red-600" />

                <div>
                  <h1 className="font-bold text-red-800">
                    No se pudieron cargar las cajas
                  </h1>

                  <p className="mt-1 text-sm text-red-700">
                    {error instanceof
                    Error
                      ? error.message
                      : "Ocurrió un error inesperado."}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      refetch()
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
                  >
                    <RefreshCcw size={17} />

                    Volver a intentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* =====================================================
          MENÚ DEL SISTEMA
      ===================================================== */}

      <MenuList />

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <section className="space-y-6 p-4 pt-20 sm:p-6 md:pt-6">
          {/* =====================================================
              CABECERA
          ===================================================== */}

          <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-sm">
                <WalletCards size={24} />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Administración
                </p>

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Gestión de cajas
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Administra las cajas de la sucursal y accede a sus
                  operaciones de apertura y cierre.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  refetch()
                }
                disabled={
                  isFetching
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCcw
                  size={17}
                  className={
                    isFetching
                      ? "animate-spin"
                      : ""
                  }
                />

                Actualizar
              </button>

              <Link
                to={`/sucursal/${sucursalId}/caja/create`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-800"
              >
                <CirclePlus size={18} />

                Nueva caja
              </Link>
            </div>
          </header>

          {/* =====================================================
              TARJETAS ESTADÍSTICAS
          ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* TOTAL */}

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total de cajas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {totalCajas}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Registradas en la sucursal
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <WalletCards size={23} />
                </div>
              </div>
            </article>

            {/* ACTIVAS */}

            <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cajas activas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-700">
                    {cajasActivas}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Disponibles para operar
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={23} />
                </div>
              </div>
            </article>

            {/* INACTIVAS */}

            <article className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cajas inactivas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-700">
                    {cajasInactivas}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Fuera de operación
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <XCircle size={23} />
                </div>
              </div>
            </article>

            {/* DISPONIBILIDAD */}

            <article className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Disponibilidad
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-700">
                    {porcentajeActivas}%
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Porcentaje de cajas activas
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <BarChart3 size={23} />
                </div>
              </div>
            </article>
          </div>

          {/* =====================================================
              FILTROS Y GRÁFICA
          ===================================================== */}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* FILTROS */}

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <Search size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Buscar y filtrar
                  </h2>

                  <p className="text-sm text-gray-500">
                    Encuentra una caja por su nombre, descripción o estado.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                {/* BUSCADOR */}

                <div>
                  <label
                    htmlFor="busqueda-caja"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Buscar caja
                  </label>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="busqueda-caja"
                      type="search"
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
                      placeholder="Nombre o descripción..."
                      className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-100"
                    />
                  </div>
                </div>

                {/* FILTRO DE ESTADO */}

                <div>
                  <label
                    htmlFor="filtro-estado"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Estado
                  </label>

                  <select
                    id="filtro-estado"
                    value={
                      filtroEstado
                    }
                    onChange={(
                      event
                    ) =>
                      setFiltroEstado(
                        event.target
                          .value as FiltroEstado
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-100"
                  >
                    <option value="todos">
                      Todas las cajas
                    </option>

                    <option value="activas">
                      Solo activas
                    </option>

                    <option value="inactivas">
                      Solo inactivas
                    </option>
                  </select>
                </div>

                {/* LIMPIAR */}

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={
                      limpiarFiltros
                    }
                    disabled={
                      !busqueda &&
                      filtroEstado ===
                        "todos"
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
                  >
                    <RefreshCcw size={17} />

                    Limpiar
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando{" "}
                  <span className="font-bold text-gray-900">
                    {cajasFiltradas.length}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-gray-900">
                    {totalCajas}
                  </span>{" "}
                  cajas.
                </p>

                {(busqueda ||
                  filtroEstado !==
                    "todos") && (
                  <span className="text-xs font-semibold text-blue-600">
                    Filtros aplicados
                  </span>
                )}
              </div>
            </article>

            {/* GRÁFICA */}

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Estado de cajas
                  </h2>

                  <p className="text-sm text-gray-500">
                    Distribución actual
                  </p>
                </div>
              </div>

              {totalCajas > 0 ? (
                <div className="mt-3 h-[280px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          datosGrafica
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {datosGrafica.map(
                          (
                            item,
                            index
                          ) => (
                            <Cell
                              key={
                                item.name
                              }
                              fill={
                                coloresGrafica[
                                  index %
                                    coloresGrafica.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipEstado />
                        }
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={36}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <Archive
                    size={38}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin datos para mostrar
                  </p>
                </div>
              )}
            </article>
          </div>

          {/* =====================================================
              VISTA MÓVIL Y TABLET
          ===================================================== */}

          <section className="space-y-4 lg:hidden">
            <div className="flex items-center gap-2">
              <LayoutGrid
                size={20}
                className="text-gray-700"
              />

              <h2 className="text-lg font-bold text-gray-900">
                Cajas registradas
              </h2>
            </div>

            {cajasFiltradas.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {cajasFiltradas.map(
                  (caja) => {
                    const activa =
                      obtenerEstadoCaja(
                        caja.estado
                      );

                    const eliminando =
                      cajaEliminando ===
                      caja._id;

                    return (
                      <article
                        key={caja._id}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div
                          className={`h-1.5 w-full ${
                            activa
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                  activa
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                <WalletCards size={21} />
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate font-bold text-gray-900">
                                  {caja.nombre}
                                </h3>

                                <span
                                  className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    activa
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      activa
                                        ? "bg-emerald-500"
                                        : "bg-red-500"
                                    }`}
                                  />

                                  {activa
                                    ? "Activa"
                                    : "Inactiva"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-5 text-gray-500">
                            {obtenerDescripcion(
                              caja.descripcion
                            )}
                          </p>

                          {/* OPERACIONES */}

                          <div className="mt-5 border-t border-gray-100 pt-4">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                              Operaciones de caja
                            </p>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <Link
                                to={`/sucursal/${sucursalId}/caja/${caja._id}/apertura`}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                              >
                                <DoorOpen
                                  size={17}
                                  className="transition group-hover:scale-110"
                                />

                                Apertura de caja
                              </Link>

                              <Link
                                to={`/sucursal/${sucursalId}/caja/${caja._id}/cierre`}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-100"
                              >
                                <LockKeyhole
                                  size={17}
                                  className="transition group-hover:scale-110"
                                />

                                Cierre de caja
                              </Link>
                            </div>
                          </div>

                          {/* ACCIONES */}

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link
                              to={`/sucursal/${sucursalId}/caja/${caja._id}/edit`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Pencil size={16} />

                              Editar
                            </Link>

                            <button
                              type="button"
                              disabled={
                                eliminando
                              }
                              onClick={() =>
                                handleEliminar(
                                  caja
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {eliminando ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={16} />
                              )}

                              Eliminar
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Archive
                    size={32}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="mt-4 font-bold text-gray-800">
                  No se encontraron cajas
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Modifica los filtros o registra una nueva caja.
                </p>

                <Link
                  to={`/sucursal/${sucursalId}/caja/create`}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  <CirclePlus size={17} />

                  Registrar caja
                </Link>
              </div>
            )}
          </section>

          {/* =====================================================
              TABLA DE ESCRITORIO
          ===================================================== */}

          <article className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <CircleDollarSign size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Cajas registradas
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Administra las cajas, sus aperturas y cierres.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600">
                  {cajasFiltradas.length} resultados
                </span>

                <Link
                  to={`/sucursal/${sucursalId}/caja/create`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
                >
                  <CirclePlus size={16} />

                  Nueva caja
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Caja
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Descripción
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Estado
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                      Operaciones de caja
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {cajasFiltradas.map(
                    (caja) => {
                      const activa =
                        obtenerEstadoCaja(
                          caja.estado
                        );

                      const eliminando =
                        cajaEliminando ===
                        caja._id;

                      return (
                        <tr
                          key={
                            caja._id
                          }
                          className="group transition hover:bg-gray-50"
                        >
                          {/* CAJA */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                  activa
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                <WalletCards size={20} />
                              </div>

                              <div className="min-w-0">
                                <p className="font-bold text-gray-900">
                                  {caja.nombre}
                                </p>

                                <p className="mt-1 max-w-[170px] truncate text-xs text-gray-400">
                                  Código: {caja._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* DESCRIPCIÓN */}

                          <td className="max-w-sm px-5 py-4">
                            <p className="line-clamp-2 text-sm leading-5 text-gray-600">
                              {obtenerDescripcion(
                                caja.descripcion
                              )}
                            </p>
                          </td>

                          {/* ESTADO */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                                activa
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  activa
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />

                              {activa
                                ? "Activa"
                                : "Inactiva"}
                            </span>
                          </td>

                          {/* APERTURA Y CIERRE */}

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/sucursal/${sucursalId}/caja/${caja._id}/apertura`}
                                title={`Ver aperturas de ${caja.nombre}`}
                                className="group/button inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow"
                              >
                                <DoorOpen
                                  size={16}
                                  className="transition group-hover/button:scale-110"
                                />

                                Apertura de caja
                              </Link>

                              <Link
                                to={`/sucursal/${sucursalId}/caja/${caja._id}/cierre`}
                                title={`Ver cierres de ${caja.nombre}`}
                                className="group/button inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2.5 text-xs font-bold text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-100 hover:shadow"
                              >
                                <LockKeyhole
                                  size={16}
                                  className="transition group-hover/button:scale-110"
                                />

                                Cierre de caja
                              </Link>
                            </div>
                          </td>

                          {/* EDITAR Y ELIMINAR */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/sucursal/${sucursalId}/caja/${caja._id}/edit`}
                                title={`Editar ${caja.nombre}`}
                                aria-label={`Editar caja ${caja.nombre}`}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow"
                              >
                                <Pencil size={16} />
                              </Link>

                              <button
                                type="button"
                                title={`Eliminar ${caja.nombre}`}
                                aria-label={`Eliminar caja ${caja.nombre}`}
                                disabled={
                                  eliminando
                                }
                                onClick={() =>
                                  handleEliminar(
                                    caja
                                  )
                                }
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {eliminando ? (
                                  <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}

                  {cajasFiltradas.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center"
                      >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                          <Archive
                            size={32}
                            className="text-gray-400"
                          />
                        </div>

                        <p className="mt-4 font-bold text-gray-800">
                          No se encontraron cajas
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Modifica los filtros o registra una nueva caja.
                        </p>

                        <Link
                          to={`/sucursal/${sucursalId}/caja/create`}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                        >
                          <CirclePlus size={17} />

                          Registrar caja
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {/* =====================================================
              INDICADOR DE ACTUALIZACIÓN
          ===================================================== */}

          {isFetching && (
            <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Actualizando cajas...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}