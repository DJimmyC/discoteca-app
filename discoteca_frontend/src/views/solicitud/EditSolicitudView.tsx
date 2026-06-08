// src/views/solicitud/EditSolicitudView.tsx

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
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  LoaderCircle,
  MapPin,
  RefreshCcw,
  Save,
  Warehouse,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import SolicitudForm, {
  type DetalleSolicitudItem,
} from "@/components/solicitud/SolicitudForm";

import {
  getAlmacenesBySucursal,
} from "@/api/AlmacenApi";

import {
  getProductos,
} from "@/api/ProductoApi";

import {
  getSolicitudesBySucursal,
  updateSolicitud,
} from "@/api/SolicitudApi";

import {
  createManyDetalleSolicitud,
  deleteDetalleSolicitudById,
  updateDetalleSolicitud,
} from "@/api/DetalleSolicitudApi";

import type {
  DetalleSolicitudForm,
} from "@/types/DetalleSolicitudType";

/* =====================================================
   TIPOS
===================================================== */

type TipoSolicitud =
  | "reposicion_interna"
  | "compra_externa";

type EstadoSolicitud =
  | "pendiente"
  | "aprobada"
  | "rechazada"
  | "atendida"
  | "anulada";


type EstadoDetalleSolicitud =
  | "pendiente"
  | "aprobado"
  | "parcial"
  | "atendido"
  | "rechazado"
  | "anulado";

function normalizarEstadoDetalle(
  estado: unknown
): EstadoDetalleSolicitud {
  const valor = String(
    estado ?? "pendiente"
  ).toLowerCase();

  const mapa: Record<
    string,
    EstadoDetalleSolicitud
  > = {
    pendiente: "pendiente",

    aprobada: "aprobado",
    aprobado: "aprobado",

    parcial: "parcial",

    atendida: "atendido",
    atendido: "atendido",

    rechazada: "rechazado",
    rechazado: "rechazado",

    anulada: "anulado",
    anulado: "anulado",
  };

  return mapa[valor] ?? "pendiente";
}

/* =====================================================
   UTILIDADES
===================================================== */

function obtenerIdRelacion(
  relacion:
    | string
    | {
        _id?: string;
      }
    | null
    | undefined
): string {
  if (typeof relacion === "string") {
    return relacion;
  }

  return relacion?._id ?? "";
}

function obtenerMensajeError(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

function esModoOscuro(): boolean {
  return document.documentElement.classList.contains(
    "dark"
  );
}

/* =====================================================
   SKELETON
===================================================== */

function EditSolicitudSkeleton() {
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

      <div className="h-[560px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function EditSolicitudView() {
  const navigate =
    useNavigate();

  const params =
    useParams();

  const queryClient =
    useQueryClient();

  const solicitudId =
    params.solicitudId ||
    params.id ||
    "";

  const {
    data: perfil,
    isLoading: loadingAuth,
    isError: errorAuth,
  } = useAuth();

  const [
    tipoSolicitud,
    setTipoSolicitud,
  ] = useState<TipoSolicitud>(
    "reposicion_interna"
  );

  const [
    idAlmacenOrigen,
    setIdAlmacenOrigen,
  ] = useState("");

  const [
    idAlmacenDestino,
    setIdAlmacenDestino,
  ] = useState("");

  const [
    estado,
    setEstado,
  ] = useState<EstadoSolicitud>(
    "pendiente"
  );

  const [
    observacion,
    setObservacion,
  ] = useState("");

  const [
    detalles,
    setDetalles,
  ] = useState<
    DetalleSolicitudItem[]
  >([]);

  const [
    detallesEliminados,
    setDetallesEliminados,
  ] = useState<string[]>([]);

  const [
    inicializado,
    setInicializado,
  ] = useState(false);

  /* =====================================================
     DATOS DEL PERFIL
  ===================================================== */

  const idPerfil =
    obtenerIdRelacion(
      perfil?._id
    );

  const idSucursal =
    obtenerIdRelacion(
      perfil?.idSucursal
    );

  const nombreSucursal =
    typeof perfil?.idSucursal ===
      "object"
      ? perfil.idSucursal
          ?.nombreSucursal ||
        "Sucursal"
      : "Sucursal";

  const ubicacionSucursal =
    typeof perfil?.idSucursal ===
      "object"
      ? perfil.idSucursal
          ?.ubicacionSucursal ||
        ""
      : "";

  const nombreUsuario =
    [
      perfil?.nombres,
      perfil?.apellidos,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "sistema";

  /* =====================================================
     SOLICITUDES DE LA SUCURSAL
  ===================================================== */

  const {
    data: dataSolicitudes,
    isLoading:
      loadingSolicitudes,
    isError:
      errorSolicitudes,
    error:
      solicitudesError,
    refetch:
      recargarSolicitudes,
    isFetching:
      actualizandoSolicitudes,
  } = useQuery({
    queryKey: [
      "solicitudes-sucursal",
      idSucursal,
    ],

    queryFn: () =>
      getSolicitudesBySucursal(
        idSucursal
      ),

    enabled:
      Boolean(idSucursal),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  const solicitudSeleccionada =
    dataSolicitudes
      ?.solicitudes
      ?.find(
        (solicitud) =>
          solicitud._id ===
          solicitudId
      );

  /* =====================================================
     ALMACENES
  ===================================================== */

  const {
    data: dataAlmacenes,
    isLoading:
      loadingAlmacenes,
    isError:
      errorAlmacenes,
    error:
      almacenesError,
    refetch:
      recargarAlmacenes,
    isFetching:
      actualizandoAlmacenes,
  } = useQuery({
    queryKey: [
      "almacenes-sucursal",
      idSucursal,
    ],

    queryFn: () =>
      getAlmacenesBySucursal(
        idSucursal
      ),

    enabled:
      Boolean(idSucursal),

    staleTime:
      1000 * 60 * 3,

    refetchOnWindowFocus:
      false,
  });

  const almacenes =
    dataAlmacenes?.almacenes ??
    [];

  /* =====================================================
     PRODUCTOS
  ===================================================== */

  const {
    data: productos = [],
    isLoading:
      loadingProductos,
    isError:
      errorProductos,
    error:
      productosError,
    refetch:
      recargarProductos,
    isFetching:
      actualizandoProductos,
  } = useQuery({
    queryKey: [
      "productos",
    ],

    queryFn:
      getProductos,

    staleTime:
      1000 * 60 * 3,

    refetchOnWindowFocus:
      false,
  });

  const productosValidos =
    productos ?? [];

  /* =====================================================
     INICIALIZAR FORMULARIO
  ===================================================== */

  useEffect(() => {
    if (
      !solicitudSeleccionada ||
      inicializado
    ) {
      return;
    }

    const origenId =
      solicitudSeleccionada
        .almacenOrigen?._id ??
      "";

    const destinoId =
      solicitudSeleccionada
        .almacenDestino?._id ??
      "";

    setIdAlmacenOrigen(
      origenId
    );

    setIdAlmacenDestino(
      destinoId
    );

    setTipoSolicitud(
      origenId
        ? "reposicion_interna"
        : "compra_externa"
    );

    setEstado(
      (
        solicitudSeleccionada
          .estado ??
        "pendiente"
      ) as EstadoSolicitud
    );

    setObservacion(
      solicitudSeleccionada
        .observacion ??
      ""
    );

    const detallesIniciales =
      solicitudSeleccionada
        .detalles
        ?.map(
          (detalle) => ({
            idDetalle:
              detalle._id,

            idProducto:
              detalle.producto?._id ??
              "",

            cantidadSolicitada:
              Number(
                detalle
                  .cantidadSolicitada ??
                  0
              ),

            cantidadAprobada:
              detalle
                .cantidadAprobada ??
              null,

            cantidadAtendida:
              detalle
                .cantidadAtendida ??
              null,

            unidad:
              detalle.unidad ??
              "unidades",

            observacion:
              detalle.observacion ??
              "",

            estado:
              normalizarEstadoDetalle(
                detalle.estado
              ),

            esNuevo:
              false,
          })
        ) ?? [];

    setDetalles(
      detallesIniciales
    );

    setInicializado(
      true
    );
  }, [
    solicitudSeleccionada,
    inicializado,
  ]);

  /* =====================================================
     DETECTAR DETALLES ELIMINADOS
  ===================================================== */

  useEffect(() => {
    if (
      !solicitudSeleccionada ||
      !inicializado
    ) {
      return;
    }

    const idsOriginales =
      (
        solicitudSeleccionada
          .detalles ??
        []
      )
        .map(
          (detalle) =>
            detalle._id
        )
        .filter(
          (
            id
          ): id is string =>
            Boolean(id)
        );

    const idsActuales =
      detalles
        .map(
          (detalle) =>
            detalle.idDetalle
        )
        .filter(
          (
            id
          ): id is string =>
            Boolean(id)
        );

    setDetallesEliminados(
      idsOriginales.filter(
        (idOriginal) =>
          !idsActuales.includes(
            idOriginal
          )
      )
    );
  }, [
    detalles,
    solicitudSeleccionada,
    inicializado,
  ]);

  /* =====================================================
     ACTUALIZAR SOLICITUD
  ===================================================== */

  const {
    mutate:
      guardarCambios,

    isPending,
  } = useMutation({
    mutationFn:
      async () => {
        if (!solicitudId) {
          throw new Error(
            "No se encontró el ID de la solicitud."
          );
        }

        if (!idPerfil) {
          throw new Error(
            "No se encontró el perfil del usuario."
          );
        }

        if (!idSucursal) {
          throw new Error(
            "No se encontró la sucursal del usuario."
          );
        }

        if (
          !idAlmacenDestino
        ) {
          throw new Error(
            "Debe seleccionar el almacén destino."
          );
        }

        if (
          tipoSolicitud ===
            "reposicion_interna" &&
          !idAlmacenOrigen
        ) {
          throw new Error(
            "Debe seleccionar el almacén origen."
          );
        }

        if (
          tipoSolicitud ===
            "reposicion_interna" &&
          idAlmacenOrigen ===
            idAlmacenDestino
        ) {
          throw new Error(
            "El almacén origen y destino no pueden ser iguales."
          );
        }

        const detallesValidos =
          detalles.filter(
            (detalle) =>
              Boolean(
                detalle.idProducto
              ) &&
              Number(
                detalle
                  .cantidadSolicitada
              ) > 0
          );

        if (
          detallesValidos.length ===
          0
        ) {
          throw new Error(
            "Debe agregar al menos un producto válido."
          );
        }

        const hayDuplicados =
          detallesValidos.some(
            (
              detalle,
              index,
              array
            ) =>
              array.findIndex(
                (item) =>
                  item.idProducto ===
                  detalle.idProducto
              ) !== index
          );

        if (
          hayDuplicados
        ) {
          throw new Error(
            "No puede repetir el mismo producto dentro de la solicitud."
          );
        }

        /* 1. ACTUALIZAR CABECERA */

        await updateSolicitud({
          solicitudId,

          formData: {
            idPerfil,
            idSucursal,

            idAlmacenOrigen:
              tipoSolicitud ===
              "compra_externa"
                ? null
                : idAlmacenOrigen,

            idAlmacenDestino,

            estado,

            observacion:
              observacion.trim() ||
              "Sin observación",

            actualizadoPor:
              nombreUsuario,
          },
        });

        /* 2. ELIMINAR DETALLES QUITADOS */

        await Promise.all(
          detallesEliminados.map(
            (idDetalle) =>
              deleteDetalleSolicitudById({
                id:
                  idDetalle,

                eliminadoPor:
                  nombreUsuario,
              })
          )
        );

        /* 3. ACTUALIZAR DETALLES EXISTENTES */

        const detallesExistentes =
          detallesValidos.filter(
            (detalle) =>
              Boolean(
                detalle.idDetalle
              )
          );

        await Promise.all(
          detallesExistentes.map(
            (detalle) =>
              updateDetalleSolicitud({
                detalleSolicitudId:
                  detalle.idDetalle!,

                formData: {
                  idSolicitud:
                    solicitudId,

                  idProducto:
                    detalle.idProducto,

                  cantidadSolicitada:
                    Number(
                      detalle
                        .cantidadSolicitada
                    ),

                  cantidadAprobada:
                    Number(
                      detalle
                        .cantidadAprobada ??
                      0
                    ),

                  cantidadAtendida:
                    Number(
                      detalle
                        .cantidadAtendida ??
                      0
                    ),

                  unidad:
                    detalle.unidad ||
                    "unidades",

                  observacion:
                    detalle
                      .observacion ||
                    "",

                  estado:
                    normalizarEstadoDetalle(
                      detalle.estado
                    ),

                  actualizadoPor:
                    nombreUsuario,
                },
              })
          )
        );

        /* 4. CREAR DETALLES NUEVOS */

        const detallesNuevos =
          detallesValidos.filter(
            (detalle) =>
              !detalle.idDetalle
          );

        if (
          detallesNuevos.length >
          0
        ) {
          const nuevosDetallesPayload:
            DetalleSolicitudForm[] =
            detallesNuevos.map(
              (
                detalle
              ): DetalleSolicitudForm => ({
                idSolicitud:
                  solicitudId,

                idProducto:
                  detalle.idProducto,

                cantidadSolicitada:
                  Number(
                    detalle
                      .cantidadSolicitada
                  ),

                cantidadAprobada:
                  Number(
                    detalle
                      .cantidadAprobada ??
                    0
                  ),

                cantidadAtendida:
                  Number(
                    detalle
                      .cantidadAtendida ??
                    0
                  ),

                unidad:
                  detalle.unidad ||
                  "unidades",

                observacion:
                  detalle
                    .observacion ||
                  "",

                estado:
                  normalizarEstadoDetalle(
                    detalle.estado
                  ),

                creadoPor:
                  nombreUsuario,
              })
            );

          await createManyDetalleSolicitud(
            nuevosDetallesPayload
          );
        }

        return {
          detallesActualizados:
            detallesExistentes.length,

          detallesNuevos:
            detallesNuevos.length,

          detallesEliminados:
            detallesEliminados.length,
        };
      },

    onSuccess:
      async (
        resultado
      ) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "solicitudes-sucursal",
              idSucursal,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "solicitud",
              solicitudId,
            ],
          }),
        ]);

        await Swal.fire({
          icon:
            "success",

          title:
            "Solicitud actualizada",

          html: `
            <p>La solicitud fue actualizada correctamente.</p>
            <p style="margin-top:8px">
              <strong>Actualizados:</strong>
              ${resultado.detallesActualizados}
            </p>
            <p>
              <strong>Nuevos:</strong>
              ${resultado.detallesNuevos}
            </p>
            <p>
              <strong>Eliminados:</strong>
              ${resultado.detallesEliminados}
            </p>
          `,

          timer:
            2200,

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

        navigate(-1);
      },

    onError:
      async (
        mutationError
      ) => {
        await Swal.fire({
          icon:
            "error",

          title:
            "No se pudo actualizar",

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

  /* =====================================================
     ACTUALIZAR DATOS
  ===================================================== */

  const actualizarDatos =
    async () => {
      await Promise.all([
        recargarSolicitudes(),
        recargarAlmacenes(),
        recargarProductos(),
      ]);
    };

  const actualizandoDatos =
    actualizandoSolicitudes ||
    actualizandoAlmacenes ||
    actualizandoProductos;

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

  if (!solicitudId) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  if (
    loadingAuth ||
    loadingSolicitudes ||
    loadingAlmacenes ||
    loadingProductos
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <EditSolicitudSkeleton />
        </main>
      </div>
    );
  }

  if (
    errorSolicitudes ||
    errorAlmacenes ||
    errorProductos
  ) {
    const mensaje =
      errorSolicitudes
        ? obtenerMensajeError(
            solicitudesError
          )
        : errorAlmacenes
          ? obtenerMensajeError(
              almacenesError
            )
          : obtenerMensajeError(
              productosError
            );

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
                  No se pudo cargar la solicitud
                </h1>

                <p className="mt-2 break-words text-sm text-red-700 dark:text-red-400">
                  {mensaje}
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={
                      actualizarDatos
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
                  >
                    <RefreshCcw size={17} />
                    Intentar nuevamente
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(-1)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 dark:border-red-800 dark:text-red-300"
                  >
                    <ArrowLeft size={17} />
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (
    !solicitudSeleccionada
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400">
              <ClipboardList
                size={30}
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Solicitud no encontrada
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              No se encontró la solicitud solicitada dentro de esta sucursal.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
            >
              <ArrowLeft size={17} />
              Volver
            </button>
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

          <header className="relative min-w-0 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:rounded-3xl sm:p-6 dark:border dark:border-slate-800">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative z-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ClipboardList
                    size={22}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                    Gestión de solicitudes
                  </p>

                  <h1 className="mt-1 truncate text-xl font-bold sm:text-3xl">
                    Editar solicitud
                  </h1>

                  <div className="mt-2 flex min-w-0 flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:items-center sm:gap-4">
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <Warehouse
                        size={15}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {nombreSucursal}
                      </span>
                    </span>

                    {ubicacionSucursal && (
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <MapPin
                          size={15}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {ubicacionSucursal}
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="mt-2 max-w-full truncate text-xs font-medium text-slate-400">
                    ID: {solicitudSeleccionada._id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                <button
                  type="button"
                  onClick={
                    actualizarDatos
                  }
                  disabled={
                    actualizandoDatos
                  }
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
                >
                  <RefreshCcw
                    size={16}
                    className={
                      actualizandoDatos
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
                    navigate(-1)
                  }
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  <ArrowLeft size={17} />
                  <span className="truncate">
                    Volver
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* RESUMEN */}

          <section className="grid grid-cols-3 gap-2 sm:gap-4">
            <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                Almacenes
              </p>

              <p className="mt-1 text-xl font-bold sm:mt-2 sm:text-3xl">
                {almacenes.length}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Disponibles
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-blue-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-blue-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs dark:text-blue-400">
                Productos
              </p>

              <p className="mt-1 text-xl font-bold text-blue-700 sm:mt-2 sm:text-3xl dark:text-blue-400">
                {productosValidos.length}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Disponibles
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-violet-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-violet-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-violet-600 sm:text-xs dark:text-violet-400">
                Detalles
              </p>

              <p className="mt-1 text-xl font-bold text-violet-700 sm:mt-2 sm:text-3xl dark:text-violet-400">
                {detalles.length}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                En la solicitud
              </p>
            </article>
          </section>

          {/* FORMULARIO */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                  <Save size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Información de la solicitud
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Modifica los almacenes, estado, observaciones y productos solicitados.
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 p-3 sm:p-5 lg:p-6">
              <SolicitudForm
                almacenes={
                  almacenes
                }

                productos={
                  productosValidos
                }

                tipoSolicitud={
                  tipoSolicitud
                }

                setTipoSolicitud={(value) =>
                  setTipoSolicitud(
                    value as TipoSolicitud
                  )
                }

                idAlmacenOrigen={
                  idAlmacenOrigen
                }

                setIdAlmacenOrigen={
                  setIdAlmacenOrigen
                }

                idAlmacenDestino={
                  idAlmacenDestino
                }

                setIdAlmacenDestino={
                  setIdAlmacenDestino
                }

                estado={
                  estado
                }

                setEstado={(value) =>
                  setEstado(
                    value as EstadoSolicitud
                  )
                }

                observacion={
                  observacion
                }

                setObservacion={
                  setObservacion
                }

                detalles={
                  detalles
                }

                setDetalles={
                  setDetalles
                }

                isPending={
                  isPending
                }

                buttonText="Actualizar solicitud"

                onSubmit={() =>
                  guardarCambios()
                }
              />
            </div>
          </section>
        </div>
      </main>

      {isPending && (
        <div className="fixed bottom-4 left-4 right-4 z-[90] flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-5 sm:w-auto dark:border dark:border-slate-700">
          <LoaderCircle
            size={17}
            className="animate-spin"
          />

          Actualizando solicitud...
        </div>
      )}
    </div>
  );
}
