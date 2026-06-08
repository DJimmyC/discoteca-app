// src/views/egreso/EgresoDetailView.tsx

import {
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
  Banknote,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Eye,
  LoaderCircle,
  MapPin,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCcw,
  Search,
  Trash2,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useAuth,
} from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import {
  deleteEgresoById,
  getEgresosConDetallesPorSucursal,
} from "@/api/EgresoApi";

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

function normalizarTexto(
  valor: unknown
): string {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

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
      dateStyle: "short",
      timeStyle: "short",
    }
  );
}

function formatearMetodoPago(
  metodo?: string | null
): string {
  const metodos: Record<
    string,
    string
  > = {
    efectivo: "Efectivo",
    qr: "QR",
    tarjeta: "Tarjeta",
    transferencia:
      "Transferencia",
    mixto: "Mixto",
  };

  if (!metodo) {
    return "Sin método";
  }

  return (
    metodos[metodo] ??
    metodo
  );
}

function formatearTipoEgreso(
  tipo?: string | null
): string {
  const tipos: Record<
    string,
    string
  > = {
    compra: "Compra",
    servicio: "Servicio",
    mantenimiento:
      "Mantenimiento",
    otro: "Otro",
  };

  if (!tipo) {
    return "Sin tipo";
  }

  return (
    tipos[tipo] ??
    tipo
  );
}

function formatearMoneda(
  valor: unknown
): string {
  const numero =
    Number(valor ?? 0);

  return new Intl.NumberFormat(
    "es-BO",
    {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
    }
  ).format(
    Number.isFinite(numero)
      ? numero
      : 0
  );
}

function getEstadoStyle(
  estado?: string | null
) {
  if (
    estado === "anulado" ||
    estado === "eliminado"
  ) {
    return {
      texto: "Anulado",
      className:
        "border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400",
      icon:
        XCircle,
    };
  }

  if (
    estado === "activo" ||
    estado === "registrado" ||
    estado === "cerrado"
  ) {
    return {
      texto:
        estado === "cerrado"
          ? "Cerrado"
          : "Registrado",
      className:
        "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400",
      icon:
        CheckCircle2,
    };
  }

  return {
    texto:
      estado ||
      "Registrado",
    className:
      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-400",
    icon:
      ReceiptText,
  };
}

/* =====================================================
   SKELETON
===================================================== */

function EgresosSkeleton() {
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

      <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4">
        {Array.from({
          length: 3,
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

export default function EgresoDetailView() {
  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    data: perfil,
    isLoading:
      loadingAuth,
    isError:
      errorAuth,
  } = useAuth();

  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const [
    search,
    setSearch,
  ] = useState("");

  /* =====================================================
     CONSULTAR EGRESOS
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
      "egresos-con-detalles",
      sucursalId,
    ],

    queryFn: () =>
      getEgresosConDetallesPorSucursal(
        sucursalId!
      ),

    enabled:
      Boolean(
        sucursalId
      ),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     ANULAR EGRESO
  ===================================================== */

  const {
    mutate:
      anularEgreso,

    isPending:
      anulandoEgreso,
  } = useMutation({
    mutationFn:
      deleteEgresoById,

    onSuccess:
      async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            "egresos-con-detalles",
            sucursalId,
          ],
        });

        await Swal.fire({
          icon:
            "success",

          title:
            "Egreso anulado",

          text:
            "El egreso fue anulado correctamente.",

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

    onError:
      async (
        mutationError
      ) => {
        await Swal.fire({
          icon:
            "error",

          title:
            "No se pudo anular",

          text:
            obtenerMensajeError(
              mutationError
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

  const handleAnularEgreso =
    async (
      egresoId?: string
    ) => {
      if (!egresoId) {
        await Swal.fire({
          icon:
            "error",

          title:
            "Egreso no encontrado",

          text:
            "No se encontró el identificador del egreso.",
        });

        return;
      }

      const result =
        await Swal.fire({
          icon:
            "warning",

          title:
            "¿Anular egreso?",

          text:
            "Esta acción cambiará el estado del egreso a anulado.",

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, anular",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#dc2626",

          cancelButtonColor:
            "#475569",

          reverseButtons:
            true,

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
        !result.isConfirmed
      ) {
        return;
      }

      anularEgreso({
        id:
          egresoId,

        eliminadoPor:
          perfil?._id ||
          perfil?.nombres ||
          "sistema",
      });
    };

  /* =====================================================
     FILTRADO
  ===================================================== */

  const egresos =
    data?.egresos ??
    [];

  const egresosFiltrados =
    useMemo(() => {
      const textoBusqueda =
        normalizarTexto(
          search
        );

      if (
        !textoBusqueda
      ) {
        return egresos;
      }

      return egresos.filter(
        (egreso) => {
          const detallesTexto =
            (
              egreso.detalles ??
              []
            )
              .map(
                (detalle) =>
                  [
                    detalle.producto
                      ?.nombre,
                    detalle.producto
                      ?.marca,
                    detalle.producto
                      ?.descripcion,
                    detalle.almacen
                      ?.nombre,
                    detalle.almacen
                      ?.tipo,
                    detalle.descripcion,
                    detalle.tipoItem,
                  ]
                    .filter(Boolean)
                    .join(" ")
              )
              .join(" ");

          const contenido = [
            egreso.numeroEgreso,
            egreso.tipoEgreso,
            egreso.metodoPago,
            egreso.estado,
            egreso.observacion,
            egreso.total,
            egreso.caja?.nombre,
            egreso.caja
              ?.descripcion,
            egreso.perfil?.nombres,
            egreso.perfil
              ?.apellidos,
            detallesTexto,
          ]
            .map(
              normalizarTexto
            )
            .join(" ");

          return contenido.includes(
            textoBusqueda
          );
        }
      );
    }, [
      egresos,
      search,
    ]);

  /* =====================================================
     RESUMEN
  ===================================================== */

  const resumen =
    useMemo(() => {
      const egresosValidos =
        egresos.filter(
          (egreso) =>
            egreso.estado !==
              "anulado" &&
            egreso.estado !==
              "eliminado"
        );

      return {
        cantidad:
          egresos.length,

        cantidadValidos:
          egresosValidos.length,

        totalEgresos:
          egresosValidos.reduce(
            (
              acumulado,
              egreso
            ) =>
              acumulado +
              Number(
                egreso.total ??
                  egreso.totalDetalles ??
                  0
              ),
            0
          ),
      };
    }, [
      egresos,
    ]);

  /* =====================================================
     ESTADOS GENERALES
  ===================================================== */

  if (
    errorAuth ||
    (
      !loadingAuth &&
      !perfil
    )
  ) {
    return (
      <Navigate
        to="/auth/login"
        replace
      />
    );
  }

  if (
    !sucursalId
  ) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  if (
    loadingAuth ||
    isLoading
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <EgresosSkeleton />
        </main>
      </div>
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

              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-red-800 dark:text-red-300">
                  No se pudieron cargar los egresos
                </h1>

                <p className="mt-2 break-words text-sm text-red-700 dark:text-red-400">
                  {obtenerMensajeError(
                    error
                  )}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
                >
                  <RefreshCcw
                    size={17}
                  />

                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     CONTENIDO
  ===================================================== */

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MenuList />

      <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
        <div className="mx-auto w-full min-w-0 max-w-7xl space-y-5 sm:space-y-6">
          {/* ENCABEZADO */}

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
            className="relative min-w-0 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:rounded-3xl sm:p-6 dark:border dark:border-slate-800"
          >
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative z-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Banknote
                    size={22}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                    Gestión financiera
                  </p>

                  <h1 className="mt-1 truncate text-xl font-bold sm:text-3xl">
                    Egresos registrados
                  </h1>

                  <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-300">
                    <MapPin
                      size={15}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {data?.sucursal
                        ?.nombreSucursal ||
                        "Sucursal"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  disabled={
                    isFetching
                  }
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
                      `/sucursal/${sucursalId}/egreso/create`
                    )
                  }
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  <Plus size={17} />
                  <span className="truncate">
                    Nuevo
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
                {resumen.cantidad}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Registrados
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-emerald-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-emerald-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-emerald-600 sm:text-xs dark:text-emerald-400">
                Válidos
              </p>

              <p className="mt-1 truncate text-xl font-bold text-emerald-700 sm:mt-2 sm:text-3xl dark:text-emerald-400">
                {resumen.cantidadValidos}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Activos
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-red-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-red-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-red-600 sm:text-xs dark:text-red-400">
                Monto
              </p>

              <p className="mt-1 truncate text-lg font-bold text-red-700 sm:mt-2 sm:text-2xl dark:text-red-400">
                {formatearMoneda(
                  resumen.totalEgresos
                )}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Total egresado
              </p>
            </article>
          </section>

          {/* BUSCADOR */}

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative min-w-0 flex-1 sm:max-w-xl">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Buscar por número, caja, tipo, producto o usuario..."
                  className="w-full min-w-0 rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-200/60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-700/40"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Mostrando{" "}
                <strong className="text-slate-900 dark:text-white">
                  {
                    egresosFiltrados.length
                  }
                </strong>{" "}
                egresos
              </p>
            </div>
          </section>

          {/* LISTA */}

          {egresosFiltrados.length ===
          0 ? (
            <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <ReceiptText
                  size={30}
                />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                No se encontraron egresos
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                {search
                  ? "Prueba con otro número, producto, caja, método de pago o usuario."
                  : "Registra el primer egreso para comenzar el control financiero de la sucursal."}
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
                  >
                    <Search size={17} />
                    Limpiar búsqueda
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/sucursal/${sucursalId}/egreso/create`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                >
                  <Plus size={17} />
                  Nuevo egreso
                </button>
              </div>
            </section>
          ) : (
            <section className="space-y-4">
              {egresosFiltrados.map(
                (egreso) => {
                  const estadoInfo =
                    getEstadoStyle(
                      egreso.estado
                    );

                  const EstadoIcon =
                    estadoInfo.icon;

                  const detalles =
                    egreso.detalles ??
                    [];

                  const totalEgreso =
                    Number(
                      egreso.total ??
                        egreso.totalDetalles ??
                        0
                    );

                  return (
                    <motion.article
                      key={
                        egreso._id
                      }
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      {/* CABECERA DEL EGRESO */}

                      <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                              <Banknote
                                size={22}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Egreso
                              </p>

                              <h2 className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                                {egreso.numeroEgreso ||
                                  "Sin número"}
                              </h2>

                              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>
                                  {formatearTipoEgreso(
                                    egreso.tipoEgreso
                                  )}
                                </span>

                                <span className="text-slate-300 dark:text-slate-700">
                                  •
                                </span>

                                <span>
                                  {formatearFecha(
                                    egreso.fechaCreacion ||
                                      egreso.fechaEgreso
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <span
                              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${estadoInfo.className}`}
                            >
                              <EstadoIcon
                                size={15}
                              />

                              {estadoInfo.texto}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/sucursal/${sucursalId}/egresos/${egreso._id}`
                                  )
                                }
                                title="Ver egreso"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                              >
                                <Eye size={18} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/sucursal/${sucursalId}/egreso/${egreso._id}/edit`
                                  )
                                }
                                title="Editar egreso"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                              >
                                <Pencil
                                  size={18}
                                />
                              </button>

                              {egreso.estado !==
                                "anulado" &&
                                egreso.estado !==
                                  "eliminado" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAnularEgreso(
                                        egreso._id
                                      )
                                    }
                                    disabled={
                                      anulandoEgreso
                                    }
                                    title="Anular egreso"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400"
                                  >
                                    <Trash2
                                      size={18}
                                    />
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* INFORMACIÓN GENERAL */}

                      <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4 dark:border-slate-800">
                        <div className="min-w-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Caja
                          </p>

                          <p className="mt-1 truncate font-semibold text-slate-900 dark:text-white">
                            {egreso.caja?.nombre ||
                              egreso.caja?.descripcion ||
                              "Sin caja"}
                          </p>
                        </div>

                        <div className="min-w-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Método de pago
                          </p>

                          <p className="mt-1 truncate font-semibold text-slate-900 dark:text-white">
                            {formatearMetodoPago(
                              egreso.metodoPago
                            )}
                          </p>
                        </div>

                        <div className="min-w-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Registrado por
                          </p>

                          <p className="mt-1 truncate font-semibold text-slate-900 dark:text-white">
                            {[
                              egreso.perfil
                                ?.nombres,
                              egreso.perfil
                                ?.apellidos,
                            ]
                              .filter(Boolean)
                              .join(" ") ||
                              egreso.creadoPor ||
                              "Sin usuario"}
                          </p>
                        </div>

                        <div className="min-w-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Observación
                          </p>

                          <p className="mt-1 line-clamp-2 font-semibold text-slate-900 dark:text-white">
                            {egreso.observacion ||
                              "Sin observación"}
                          </p>
                        </div>
                      </div>

                      {/* DETALLES MÓVILES */}

                      {detalles.length > 0 && (
                        <div className="grid gap-3 p-4 md:hidden">
                          {detalles.map(
                            (detalle) => (
                              <div
                                key={
                                  detalle._id
                                }
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
                              >
                                <div className="flex min-w-0 items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                                    <Package
                                      size={18}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-bold text-slate-900 dark:text-white">
                                      {detalle.producto?.nombre ||
                                        detalle.descripcion ||
                                        "Ítem sin nombre"}
                                    </h3>

                                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                                      {detalle.producto?.marca ||
                                        detalle.tipoItem ||
                                        "Sin tipo"}
                                    </p>
                                  </div>
                                </div>

                                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <dt className="text-xs font-semibold text-slate-400">
                                      Almacén
                                    </dt>

                                    <dd className="mt-1 truncate font-semibold">
                                      {detalle.almacen?.nombre ||
                                        "Sin almacén"}
                                    </dd>
                                  </div>

                                  <div>
                                    <dt className="text-xs font-semibold text-slate-400">
                                      Cantidad
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                      {detalle.cantidad}
                                    </dd>
                                  </div>

                                  <div>
                                    <dt className="text-xs font-semibold text-slate-400">
                                      Costo
                                    </dt>

                                    <dd className="mt-1 font-semibold">
                                      {formatearMoneda(
                                        detalle.costoUnitario
                                      )}
                                    </dd>
                                  </div>

                                  <div>
                                    <dt className="text-xs font-semibold text-slate-400">
                                      Subtotal
                                    </dt>

                                    <dd className="mt-1 font-bold text-red-700 dark:text-red-400">
                                      {formatearMoneda(
                                        detalle.subtotal
                                      )}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* TABLA ESCRITORIO */}

                      {detalles.length > 0 && (
                        <div className="hidden p-5 md:block">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px]">
                              <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800">
                                  <th className="pb-4">
                                    Ítem
                                  </th>

                                  <th className="pb-4">
                                    Almacén
                                  </th>

                                  <th className="pb-4 text-center">
                                    Cantidad
                                  </th>

                                  <th className="pb-4 text-right">
                                    Costo
                                  </th>

                                  <th className="pb-4 text-right">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {detalles.map(
                                  (detalle) => (
                                    <tr
                                      key={
                                        detalle._id
                                      }
                                    >
                                      <td className="py-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                                            <Package
                                              size={18}
                                            />
                                          </div>

                                          <div className="min-w-0">
                                            <p className="max-w-64 truncate font-bold text-slate-900 dark:text-white">
                                              {detalle.producto?.nombre ||
                                                detalle.descripcion ||
                                                "Ítem sin nombre"}
                                            </p>

                                            <p className="mt-1 max-w-64 truncate text-xs text-slate-500 dark:text-slate-400">
                                              {detalle.producto?.marca ||
                                                detalle.tipoItem ||
                                                "Sin tipo"}
                                            </p>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="py-4">
                                        <span className="block max-w-48 truncate font-medium">
                                          {detalle.almacen?.nombre ||
                                            "Sin almacén"}
                                        </span>
                                      </td>

                                      <td className="py-4 text-center font-semibold">
                                        {detalle.cantidad}
                                      </td>

                                      <td className="py-4 text-right font-semibold">
                                        {formatearMoneda(
                                          detalle.costoUnitario
                                        )}
                                      </td>

                                      <td className="py-4 text-right font-bold text-red-700 dark:text-red-400">
                                        {formatearMoneda(
                                          detalle.subtotal
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {detalles.length === 0 && (
                        <div className="p-4 sm:p-5">
                          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Este egreso no tiene detalles registrados.
                          </div>
                        </div>
                      )}

                      {/* TOTAL */}

                      <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
                        <div className="rounded-xl bg-white p-4 dark:bg-slate-900">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Total detalles
                          </p>

                          <p className="mt-1 text-xl font-bold">
                            {formatearMoneda(
                              egreso.totalDetalles ??
                                0
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-red-50 p-4 sm:text-right dark:bg-red-950/30">
                          <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                            Total egreso
                          </p>

                          <p className="mt-1 text-2xl font-bold text-red-700 dark:text-red-400">
                            {formatearMoneda(
                              totalEgreso
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </section>
          )}
        </div>
      </main>

      {anulandoEgreso && (
        <div className="fixed bottom-4 left-4 right-4 z-[90] flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-5 sm:w-auto dark:border dark:border-slate-700">
          <LoaderCircle
            size={17}
            className="animate-spin"
          />

          Anulando egreso...
        </div>
      )}
    </div>
  );
}
