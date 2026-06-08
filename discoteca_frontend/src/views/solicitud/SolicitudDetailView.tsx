// src/views/solicitud/SolicitudDetailView.tsx

import {
  Fragment,
  useMemo,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Eye,
  Filter,
  LoaderCircle,
  MapPin,
  PackageSearch,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Warehouse,
  X,
  XCircle,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import MenuList from "@/components/MenuList";

import {
  deleteSolicitudById,
  getSolicitudesBySucursal,
} from "@/api/SolicitudApi";

import {
  aprobarYTransferirSolicitud,
} from "@/api/InventarioApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import type {
  SolicitudPorSucursalType,
} from "@/types/SolicitudType";

import type {
  SucursalType,
} from "@/types/SucursalType";

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

type FiltroEstado =
  | "todos"
  | "pendiente"
  | "en_revision"
  | "aprobada"
  | "rechazada"
  | "en_proceso"
  | "en_transito"
  | "atendida"
  | "anulada";

type FiltroTipo =
  | "todos"
  | "transferencia"
  | "solicitud";

type FiltroPrioridad =
  | "todos"
  | "alta"
  | "media"
  | "baja";

/* =====================================================
   UTILIDADES
===================================================== */

function esModoOscuro(): boolean {
  return document.documentElement.classList.contains("dark");
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Ocurrió un error inesperado.";
}

function normalizarTexto(valor: unknown): string {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

function formatearFecha(fecha?: string | null): string {
  if (!fecha) return "Sin fecha";

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return "Fecha inválida";
  }

  return valor.toLocaleString("es-BO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getEstadoTexto(estado?: string | null): string {
  const estados: Record<string, string> = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
    en_proceso: "En proceso",
    en_transito: "En tránsito",
    atendida: "Atendida",
    anulada: "Anulada",
  };

  return estados[estado ?? ""] ?? estado ?? "Pendiente";
}

function getEstadoClass(estado?: string | null): string {
  if (estado === "pendiente") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  }

  if (
    estado === "en_revision" ||
    estado === "en_proceso" ||
    estado === "en_transito"
  ) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400";
  }

  if (
    estado === "aprobada" ||
    estado === "atendida"
  ) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
  }

  if (
    estado === "rechazada" ||
    estado === "anulada"
  ) {
    return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function getTipoSolicitud(
  solicitud: SolicitudPorSucursalType
): "Transferencia" | "Solicitud" {
  return solicitud.almacenOrigen &&
    solicitud.almacenDestino
    ? "Transferencia"
    : "Solicitud";
}

function getTipoClass(tipo: string): string {
  return tipo === "Transferencia"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
    : "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400";
}

function getPrioridad(
  solicitud: SolicitudPorSucursalType
): "Alta" | "Media" | "Baja" {
  if (
    solicitud.estado === "rechazada" ||
    solicitud.estado === "anulada"
  ) {
    return "Alta";
  }

  if (solicitud.estado === "pendiente") {
    return "Media";
  }

  return "Baja";
}

function getPrioridadClass(prioridad: string): string {
  if (prioridad === "Alta") {
    return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";
  }

  if (prioridad === "Media") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  }

  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
}

function generarCodigo(index: number): string {
  return `SOL-${String(index + 1).padStart(4, "0")}`;
}

function obtenerSolicitante(
  solicitud: SolicitudPorSucursalType
): string {
  const nombre = [
    solicitud.perfil?.nombres,
    solicitud.perfil?.apellidos,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return nombre ||
    solicitud.creadoPor ||
    "Sin usuario";
}

/* =====================================================
   SKELETON
===================================================== */

function SolicitudesSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-36 rounded-2xl bg-slate-200 sm:h-40 sm:rounded-3xl dark:bg-slate-800" />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-xl bg-slate-200 sm:h-28 sm:rounded-2xl dark:bg-slate-800"
          />
        ))}
      </div>

      <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>

      <div className="hidden h-[430px] rounded-2xl bg-slate-200 md:block dark:bg-slate-800" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function SolicitudDetailView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: perfil,
    isLoading: loadingAuth,
  } = useAuth();

  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] =
    useState<FiltroEstado>("todos");
  const [tipoFiltro, setTipoFiltro] =
    useState<FiltroTipo>("todos");
  const [prioridadFiltro, setPrioridadFiltro] =
    useState<FiltroPrioridad>("todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [
    solicitudExpandida,
    setSolicitudExpandida,
  ] = useState<string | null>(null);

  /* =====================================================
     CONSULTAR SUCURSAL
  ===================================================== */

  const {
    data: sucursal,
    isLoading: cargandoSucursal,
    isError: errorSucursal,
  } = useQuery<SucursalType, Error>({
    queryKey: ["sucursal", sucursalId],
    queryFn: () => getSucursalById(sucursalId!),
    enabled: Boolean(sucursalId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  /* =====================================================
     CONSULTAR SOLICITUDES
  ===================================================== */

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "solicitudes-sucursal",
      sucursalId,
    ],
    queryFn: () =>
      getSolicitudesBySucursal(
        sucursalId!
      ),
    enabled: Boolean(sucursalId),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  /* =====================================================
     APROBAR Y TRANSFERIR
  ===================================================== */

  const {
    mutate: aprobarSolicitud,
    isPending: aprobandoSolicitud,
  } = useMutation({
    mutationFn:
      aprobarYTransferirSolicitud,

    onSuccess: async (respuesta) => {
      await Swal.fire({
        icon: "success",
        title: "Solicitud procesada",
        html: `
          <p>${respuesta.message}</p>
          <p style="margin-top:8px">
            <strong>Origen:</strong>
            ${respuesta.almacenOrigen.nombre || "Almacén principal"}
          </p>
          <p>
            <strong>Destino:</strong>
            ${respuesta.almacenDestino.nombre || "Almacén destino"}
          </p>
          <p>
            <strong>Total transferido:</strong>
            ${respuesta.cantidadTotal} unidades
          </p>
        `,
        background: esModoOscuro()
          ? "#0f172a"
          : "#ffffff",
        color: esModoOscuro()
          ? "#f8fafc"
          : "#0f172a",
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "solicitudes-sucursal",
            sucursalId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "inventarios-sucursal",
            sucursalId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "inventario-principal",
            sucursalId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: ["movimientos"],
        }),
      ]);
    },

    onError: async (mutationError) => {
      await Swal.fire({
        icon: "error",
        title:
          "No se pudo aprobar y transferir",
        text:
          obtenerMensajeError(
            mutationError
          ),
        background: esModoOscuro()
          ? "#0f172a"
          : "#ffffff",
        color: esModoOscuro()
          ? "#f8fafc"
          : "#0f172a",
      });
    },
  });

  /* =====================================================
     ANULAR SOLICITUD
  ===================================================== */

  const {
    mutate: anularSolicitud,
    isPending: anulandoSolicitud,
  } = useMutation({
    mutationFn:
      deleteSolicitudById,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "solicitudes-sucursal",
          sucursalId,
        ],
      });

      await Swal.fire({
        icon: "success",
        title: "Solicitud anulada",
        timer: 1600,
        showConfirmButton: false,
        background: esModoOscuro()
          ? "#0f172a"
          : "#ffffff",
        color: esModoOscuro()
          ? "#f8fafc"
          : "#0f172a",
      });
    },

    onError: async (mutationError) => {
      await Swal.fire({
        icon: "error",
        title: "Error al anular",
        text:
          obtenerMensajeError(
            mutationError
          ),
        background: esModoOscuro()
          ? "#0f172a"
          : "#ffffff",
        color: esModoOscuro()
          ? "#f8fafc"
          : "#0f172a",
      });
    },
  });

  /* =====================================================
     ACCIONES
  ===================================================== */

  const toggleExpandir = (
    id?: string
  ) => {
    if (!id) return;

    setSolicitudExpandida(
      (actual) =>
        actual === id
          ? null
          : id
    );
  };

  const handleAprobarSolicitud =
    async (
      solicitud:
        SolicitudPorSucursalType
    ) => {
      if (!solicitud._id) return;

      const confirmacion =
        await Swal.fire({
          icon: "warning",
          title:
            "¿Aprobar y transferir?",
          html: `
            <p>Se descontará stock del almacén principal.</p>
            <p>Se sumará al almacén destino y se registrarán los movimientos.</p>
          `,
          showCancelButton: true,
          confirmButtonText:
            "Sí, aprobar",
          cancelButtonText:
            "Cancelar",
          confirmButtonColor:
            "#16a34a",
          background: esModoOscuro()
            ? "#0f172a"
            : "#ffffff",
          color: esModoOscuro()
            ? "#f8fafc"
            : "#0f172a",
        });

      if (!confirmacion.isConfirmed) {
        return;
      }

      aprobarSolicitud({
        idSolicitud:
          solicitud._id,
        actualizadoPor:
          perfil?._id ||
          perfil?.nombres ||
          "sistema",
      });
    };

  const handleAnularSolicitud =
    async (
      solicitud:
        SolicitudPorSucursalType
    ) => {
      if (!solicitud._id) return;

      const confirmacion =
        await Swal.fire({
          icon: "warning",
          title:
            "¿Anular solicitud?",
          text:
            "La solicitud quedará registrada como anulada.",
          showCancelButton: true,
          confirmButtonText:
            "Sí, anular",
          cancelButtonText:
            "Cancelar",
          confirmButtonColor:
            "#dc2626",
          background: esModoOscuro()
            ? "#0f172a"
            : "#ffffff",
          color: esModoOscuro()
            ? "#f8fafc"
            : "#0f172a",
        });

      if (!confirmacion.isConfirmed) {
        return;
      }

      anularSolicitud({
        id: solicitud._id,
        eliminadoPor:
          perfil?._id ||
          perfil?.nombres ||
          "sistema",
      });
    };

  const limpiarFiltros = () => {
    setSearch("");
    setEstadoFiltro("todos");
    setTipoFiltro("todos");
    setPrioridadFiltro("todos");
    setFechaDesde("");
    setFechaHasta("");
  };

  /* =====================================================
     FILTRADO
  ===================================================== */

  const solicitudes =
    data?.solicitudes ?? [];

  const solicitudesFiltradas =
    useMemo(() => {
      return solicitudes.filter(
        (solicitud) => {
          const tipo =
            getTipoSolicitud(
              solicitud
            );

          const prioridad =
            getPrioridad(
              solicitud
            );

          const detallesTexto =
            solicitud.detalles
              ?.map((detalle) =>
                [
                  detalle.producto?.nombre,
                  detalle.producto?.marca,
                  detalle.producto?.descripcion,
                  detalle.observacion,
                  detalle.unidad,
                ]
                  .filter(Boolean)
                  .join(" ")
              )
              .join(" ") ?? "";

          const texto = [
            solicitud._id,
            tipo,
            solicitud.almacenOrigen?.nombre,
            solicitud.almacenDestino?.nombre,
            solicitud.perfil?.nombres,
            solicitud.perfil?.apellidos,
            solicitud.estado,
            solicitud.observacion,
            detallesTexto,
          ]
            .map(normalizarTexto)
            .join(" ");

          const coincideBusqueda =
            texto.includes(
              normalizarTexto(search)
            );

          const coincideEstado =
            estadoFiltro === "todos" ||
            solicitud.estado ===
              estadoFiltro;

          const coincideTipo =
            tipoFiltro === "todos" ||
            tipo.toLowerCase() ===
              tipoFiltro;

          const coincidePrioridad =
            prioridadFiltro ===
              "todos" ||
            prioridad.toLowerCase() ===
              prioridadFiltro;

          const fechaSolicitud =
            solicitud.fechaCreacion ||
            solicitud.fechaSolicitud;

          let coincideFecha = true;

          if (
            fechaDesde &&
            fechaSolicitud
          ) {
            coincideFecha =
              new Date(fechaSolicitud) >=
              new Date(
                `${fechaDesde}T00:00:00`
              );
          }

          if (
            fechaHasta &&
            fechaSolicitud
          ) {
            coincideFecha =
              coincideFecha &&
              new Date(fechaSolicitud) <=
                new Date(
                  `${fechaHasta}T23:59:59`
                );
          }

          return (
            coincideBusqueda &&
            coincideEstado &&
            coincideTipo &&
            coincidePrioridad &&
            coincideFecha
          );
        }
      );
    }, [
      solicitudes,
      search,
      estadoFiltro,
      tipoFiltro,
      prioridadFiltro,
      fechaDesde,
      fechaHasta,
    ]);

  /* =====================================================
     RESUMEN
  ===================================================== */

  const totalSolicitudes =
    solicitudes.length;

  const totalPendientes =
    solicitudes.filter(
      (solicitud) =>
        solicitud.estado ===
        "pendiente"
    ).length;

  const totalAtendidas =
    solicitudes.filter(
      (solicitud) =>
        solicitud.estado ===
          "atendida" ||
        solicitud.estado ===
          "aprobada"
    ).length;

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
    loadingAuth ||
    isLoading ||
    cargandoSucursal
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <SolicitudesSkeleton />
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

  if (isError) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={22}
                className="mt-0.5 shrink-0 text-red-700 dark:text-red-400"
              />

              <div className="min-w-0">
                <h1 className="font-bold text-red-800 dark:text-red-300">
                  No se pudieron cargar las solicitudes
                </h1>

                <p className="mt-2 break-words text-sm text-red-700 dark:text-red-400">
                  {obtenerMensajeError(error)}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
                >
                  <RefreshCcw size={17} />
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MenuList />

      <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
        <div className="mx-auto w-full min-w-0 max-w-7xl space-y-5 sm:space-y-6">
          {/* HEADER */}

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
            className="relative w-full min-w-0 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:rounded-3xl sm:p-6 dark:border dark:border-slate-800"
          >
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative z-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ClipboardList size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                    Gestión de solicitudes
                  </p>

                  <h1
                    title={`Solicitudes de ${sucursal.nombreSucursal}`}
                    className="mt-1 truncate text-xl font-bold sm:text-3xl"
                  >
                    Solicitudes de{" "}
                    {sucursal.nombreSucursal}
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
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
                >
                  <RefreshCcw
                    size={16}
                    className={
                      isFetching
                        ? "animate-spin"
                        : ""
                    }
                  />

                  <span className="truncate">
                    Actualizar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/sucursal/${sucursalId}/solicitud/create`
                    )
                  }
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  <Plus size={17} />
                  <span className="truncate">
                    Nueva
                  </span>
                </button>
              </div>
            </div>
          </motion.header>

          {/* RESUMEN */}

          <section className="grid grid-cols-3 gap-2 sm:gap-4">
            <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                Total
              </p>
              <p className="mt-1 truncate text-xl font-bold sm:mt-2 sm:text-3xl">
                {totalSolicitudes}
              </p>
              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Registradas
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-amber-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-amber-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-amber-600 sm:text-xs dark:text-amber-400">
                Pendientes
              </p>
              <p className="mt-1 truncate text-xl font-bold text-amber-700 sm:mt-2 sm:text-3xl dark:text-amber-400">
                {totalPendientes}
              </p>
              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Por atender
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-emerald-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-emerald-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-emerald-600 sm:text-xs dark:text-emerald-400">
                Atendidas
              </p>
              <p className="mt-1 truncate text-xl font-bold text-emerald-700 sm:mt-2 sm:text-3xl dark:text-emerald-400">
                {totalAtendidas}
              </p>
              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Procesadas
              </p>
            </article>
          </section>

          {/* FILTROS */}

          <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <div className="relative min-w-0 sm:col-span-2 xl:col-span-2">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Buscar solicitud..."
                  className="w-full min-w-0 rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-200/60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-700/40"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <select
                value={estadoFiltro}
                onChange={(event) =>
                  setEstadoFiltro(
                    event.target.value as FiltroEstado
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="todos">
                  Todos los estados
                </option>
                <option value="pendiente">
                  Pendiente
                </option>
                <option value="en_revision">
                  En revisión
                </option>
                <option value="aprobada">
                  Aprobada
                </option>
                <option value="rechazada">
                  Rechazada
                </option>
                <option value="en_proceso">
                  En proceso
                </option>
                <option value="en_transito">
                  En tránsito
                </option>
                <option value="atendida">
                  Atendida
                </option>
                <option value="anulada">
                  Anulada
                </option>
              </select>

              <select
                value={tipoFiltro}
                onChange={(event) =>
                  setTipoFiltro(
                    event.target.value as FiltroTipo
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="todos">
                  Todos los tipos
                </option>
                <option value="transferencia">
                  Transferencia
                </option>
                <option value="solicitud">
                  Solicitud
                </option>
              </select>

              <select
                value={prioridadFiltro}
                onChange={(event) =>
                  setPrioridadFiltro(
                    event.target.value as FiltroPrioridad
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="todos">
                  Todas las prioridades
                </option>
                <option value="alta">
                  Alta
                </option>
                <option value="media">
                  Media
                </option>
                <option value="baja">
                  Baja
                </option>
              </select>

              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Filter size={17} />
                Limpiar
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="relative">
                <Calendar
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={fechaDesde}
                  max={fechaHasta || undefined}
                  onChange={(event) =>
                    setFechaDesde(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <label className="relative">
                <Calendar
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={fechaHasta}
                  min={fechaDesde || undefined}
                  onChange={(event) =>
                    setFechaHasta(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
            </div>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Mostrando{" "}
              <strong className="text-slate-900 dark:text-white">
                {solicitudesFiltradas.length}
              </strong>{" "}
              solicitudes
            </p>
          </section>

          {/* TARJETAS MÓVILES */}

          {solicitudesFiltradas.length > 0 && (
            <section className="grid w-full min-w-0 grid-cols-1 gap-4 md:hidden">
              {solicitudesFiltradas.map(
                (solicitud, index) => {
                  const tipo =
                    getTipoSolicitud(
                      solicitud
                    );
                  const prioridad =
                    getPrioridad(
                      solicitud
                    );
                  const codigo =
                    generarCodigo(index);
                  const isExpanded =
                    solicitudExpandida ===
                    solicitud._id;
                  const detalles =
                    solicitud.detalles ?? [];

                  const puedeEditar =
                    solicitud.estado !== "anulada" &&
                    solicitud.estado !== "atendida";

                  const puedeAprobar =
                    solicitud.estado !== "aprobada" &&
                    solicitud.estado !== "anulada" &&
                    solicitud.estado !== "atendida" &&
                    solicitud.estado !== "rechazada";

                  const puedeAnular =
                    solicitud.estado !== "anulada" &&
                    solicitud.estado !== "atendida";

                  return (
                    <motion.article
                      key={
                        solicitud._id ??
                        index
                      }
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="p-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                            <ClipboardList size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              {codigo}
                            </p>

                            <h2 className="mt-1 truncate font-bold text-slate-900 dark:text-white">
                              {solicitud.almacenDestino?.nombre ||
                                "Sin destino"}
                            </h2>

                            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                              {obtenerSolicitante(
                                solicitud
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              toggleExpandir(
                                solicitud._id
                              )
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {isExpanded ? (
                              <ChevronDown size={18} />
                            ) : (
                              <ChevronRight size={18} />
                            )}
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getTipoClass(tipo)}`}>
                            {tipo}
                          </span>

                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoClass(solicitud.estado)}`}>
                            {getEstadoTexto(
                              solicitud.estado
                            )}
                          </span>

                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPrioridadClass(prioridad)}`}>
                            {prioridad}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-950/60">
                          <div className="flex min-w-0 items-center gap-3">
                            <Warehouse
                              size={17}
                              className="shrink-0 text-blue-600 dark:text-blue-400"
                            />
                            <span className="truncate">
                              {solicitud.almacenOrigen?.nombre ||
                                "Compra externa"}{" "}
                              →{" "}
                              {solicitud.almacenDestino?.nombre ||
                                "Sin destino"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar
                              size={17}
                              className="shrink-0 text-amber-600 dark:text-amber-400"
                            />
                            <span>
                              {formatearFecha(
                                solicitud.fechaCreacion ||
                                solicitud.fechaSolicitud
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <PackageSearch
                              size={17}
                              className="shrink-0 text-violet-600 dark:text-violet-400"
                            />
                            <span>
                              {solicitud.totalProductos ??
                                detalles.length}{" "}
                              productos
                            </span>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                          <div className="space-y-3">
                            {detalles.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                Sin detalles registrados.
                              </p>
                            ) : (
                              detalles.map((detalle) => (
                                <div
                                  key={
                                    detalle._id
                                  }
                                  className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                                >
                                  <p className="font-semibold text-slate-900 dark:text-white">
                                    {detalle.producto?.nombre ||
                                      "Producto sin nombre"}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Solicitado:{" "}
                                    {detalle.cantidadSolicitada}{" "}
                                    {detalle.unidad ||
                                      "unidades"}
                                  </p>
                                  <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                                    Aprobado:{" "}
                                    {detalle.cantidadAprobada ??
                                      detalle.cantidadSolicitada}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/sucursal/${sucursalId}/solicitudes/${solicitud._id}`
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        >
                          <Eye size={17} />
                          Ver
                        </button>

                        {puedeEditar && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/sucursal/${sucursalId}/solicitud/${solicitud._id}/edit`
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          >
                            <Pencil size={17} />
                            Editar
                          </button>
                        )}

                        {puedeAprobar && (
                          <button
                            type="button"
                            onClick={() =>
                              handleAprobarSolicitud(
                                solicitud
                              )
                            }
                            disabled={
                              aprobandoSolicitud
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 disabled:opacity-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                          >
                            <CheckCircle2 size={17} />
                            Aprobar
                          </button>
                        )}

                        {puedeAnular && (
                          <button
                            type="button"
                            onClick={() =>
                              handleAnularSolicitud(
                                solicitud
                              )
                            }
                            disabled={
                              anulandoSolicitud
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400"
                          >
                            <XCircle size={17} />
                            Anular
                          </button>
                        )}
                      </div>
                    </motion.article>
                  );
                }
              )}
            </section>
          )}

          {/* TABLA ESCRITORIO */}

          {solicitudesFiltradas.length > 0 && (
            <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px]">
                  <thead className="bg-slate-100 dark:bg-slate-950/70">
                    <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      <th className="w-14 px-5 py-4" />
                      <th className="px-5 py-4">Código</th>
                      <th className="px-5 py-4">Tipo</th>
                      <th className="px-5 py-4">Origen</th>
                      <th className="px-5 py-4">Destino</th>
                      <th className="px-5 py-4">Solicitado por</th>
                      <th className="px-5 py-4">Estado</th>
                      <th className="px-5 py-4">Fecha</th>
                      <th className="px-5 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {solicitudesFiltradas.map(
                      (solicitud, index) => {
                        const tipo =
                          getTipoSolicitud(
                            solicitud
                          );
                        const prioridad =
                          getPrioridad(
                            solicitud
                          );
                        const codigo =
                          generarCodigo(index);
                        const isExpanded =
                          solicitudExpandida ===
                          solicitud._id;
                        const detalles =
                          solicitud.detalles ?? [];

                        const puedeEditar =
                          solicitud.estado !== "anulada" &&
                          solicitud.estado !== "atendida";

                        const puedeAprobar =
                          solicitud.estado !== "aprobada" &&
                          solicitud.estado !== "anulada" &&
                          solicitud.estado !== "atendida" &&
                          solicitud.estado !== "rechazada";

                        const puedeAnular =
                          solicitud.estado !== "anulada" &&
                          solicitud.estado !== "atendida";

                        return (
                          <Fragment
                            key={
                              solicitud._id ??
                              index
                            }
                          >
                            <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                              <td className="px-5 py-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleExpandir(
                                      solicitud._id
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-950/40 dark:hover:text-violet-400"
                                >
                                  {isExpanded ? (
                                    <ChevronDown size={18} />
                                  ) : (
                                    <ChevronRight size={18} />
                                  )}
                                </button>
                              </td>

                              <td className="px-5 py-4 font-bold">
                                {codigo}
                              </td>

                              <td className="px-5 py-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getTipoClass(tipo)}`}>
                                  {tipo}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="block max-w-48 truncate">
                                  {solicitud.almacenOrigen?.nombre ||
                                    "Compra externa"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="block max-w-48 truncate">
                                  {solicitud.almacenDestino?.nombre ||
                                    "Sin destino"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="block max-w-48 truncate">
                                  {obtenerSolicitante(
                                    solicitud
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoClass(solicitud.estado)}`}>
                                  {getEstadoTexto(
                                    solicitud.estado
                                  )}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-5 py-4">
                                {formatearFecha(
                                  solicitud.fechaCreacion ||
                                  solicitud.fechaSolicitud
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate(
                                        `/sucursal/${sucursalId}/solicitudes/${solicitud._id}`
                                      )
                                    }
                                    title="Ver"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                                  >
                                    <Eye size={18} />
                                  </button>

                                  {puedeAprobar && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAprobarSolicitud(
                                          solicitud
                                        )
                                      }
                                      disabled={
                                        aprobandoSolicitud
                                      }
                                      title="Aprobar"
                                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    >
                                      <CheckCircle2 size={18} />
                                    </button>
                                  )}

                                  {puedeEditar && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigate(
                                          `/sucursal/${sucursalId}/solicitud/${solicitud._id}/edit`
                                        )
                                      }
                                      title="Editar"
                                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                                    >
                                      <Pencil size={18} />
                                    </button>
                                  )}

                                  {puedeAnular && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAnularSolicitud(
                                          solicitud
                                        )
                                      }
                                      disabled={
                                        anulandoSolicitud
                                      }
                                      title="Anular"
                                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400"
                                    >
                                      <XCircle size={18} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="bg-violet-50/40 dark:bg-violet-950/10">
                                <td
                                  colSpan={9}
                                  className="px-5 py-5"
                                >
                                  <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                                        Detalle de productos
                                      </h3>

                                      {detalles.length === 0 ? (
                                        <p className="py-8 text-center text-slate-500">
                                          Sin detalles registrados.
                                        </p>
                                      ) : (
                                        <div className="mt-4 overflow-x-auto">
                                          <table className="w-full min-w-[600px]">
                                            <thead>
                                              <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase text-slate-500 dark:border-slate-800">
                                                <th className="py-3">Producto</th>
                                                <th className="py-3">Solicitada</th>
                                                <th className="py-3">Aprobada</th>
                                                <th className="py-3">Unidad</th>
                                              </tr>
                                            </thead>

                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                              {detalles.map((detalle) => (
                                                <tr key={detalle._id}>
                                                  <td className="py-3 font-semibold">
                                                    {detalle.producto?.nombre ||
                                                      "Producto sin nombre"}
                                                  </td>
                                                  <td className="py-3">
                                                    {detalle.cantidadSolicitada}
                                                  </td>
                                                  <td className="py-3 text-emerald-600 dark:text-emerald-400">
                                                    {detalle.cantidadAprobada ??
                                                      detalle.cantidadSolicitada}
                                                  </td>
                                                  <td className="py-3">
                                                    {detalle.unidad ||
                                                      "unidades"}
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                                        Información adicional
                                      </h3>

                                      <dl className="mt-4 space-y-4 text-sm">
                                        <div>
                                          <dt className="font-semibold text-slate-500">
                                            Prioridad
                                          </dt>
                                          <dd className="mt-1">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPrioridadClass(prioridad)}`}>
                                              {prioridad}
                                            </span>
                                          </dd>
                                        </div>

                                        <div>
                                          <dt className="font-semibold text-slate-500">
                                            Fecha solicitada
                                          </dt>
                                          <dd className="mt-1">
                                            {formatearFecha(
                                              solicitud.fechaSolicitud ||
                                              solicitud.fechaCreacion
                                            )}
                                          </dd>
                                        </div>

                                        <div>
                                          <dt className="font-semibold text-slate-500">
                                            Observaciones
                                          </dt>
                                          <dd className="mt-1 break-words">
                                            {solicitud.observacion ||
                                              "Sin observaciones"}
                                          </dd>
                                        </div>
                                      </dl>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* VACÍO */}

          {solicitudesFiltradas.length === 0 && (
            <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <ClipboardList size={30} />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                No se encontraron solicitudes
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Ajusta los filtros o registra una nueva solicitud para esta sucursal.
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
                >
                  <Filter size={17} />
                  Limpiar filtros
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/sucursal/${sucursalId}/solicitud/create`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                >
                  <Plus size={17} />
                  Nueva solicitud
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {(aprobandoSolicitud ||
        anulandoSolicitud) && (
        <div className="fixed bottom-4 left-4 right-4 z-[90] flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-5 sm:w-auto">
          <LoaderCircle
            size={17}
            className="animate-spin"
          />

          {aprobandoSolicitud
            ? "Procesando solicitud..."
            : "Anulando solicitud..."}
        </div>
      )}
    </div>
  );
}
