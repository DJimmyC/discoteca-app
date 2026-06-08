// src/views/solicitud/CreateSolicitudView.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
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
  PackageSearch,
  RefreshCcw,
  Send,
  Warehouse,
} from "lucide-react";

import {
  useAuth,
} from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import SolicitudForm, {
  type DetalleSolicitudItem,
} from "@/components/solicitud/SolicitudForm";

import {
  getAlmacenesBySucursal,
} from "@/api/AlmacenApi";

import {
  getInventarioPrincipalPorSucursal,
} from "@/api/InventarioApi";

import {
  createSolicitud,
} from "@/api/SolicitudApi";

import {
  createManyDetalleSolicitud,
} from "@/api/DetalleSolicitudApi";

import {
  createMovimiento,
} from "@/api/MovimientoApi";

import type {
  DetalleSolicitudForm,
} from "@/types/DetalleSolicitudType";

import type {
  MovimientoForm,
} from "@/types/MovimientoType";

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
  if (
    typeof relacion ===
    "string"
  ) {
    return relacion;
  }

  return relacion?._id ?? "";
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

function esModoOscuro(): boolean {
  return document.documentElement.classList.contains(
    "dark"
  );
}

/* =====================================================
   DETALLE INICIAL
===================================================== */

function crearDetalleInicial(): DetalleSolicitudItem {
  return {
    idProducto: "",
    cantidadSolicitada: 1,
    cantidadAprobada: null,
    cantidadAtendida: null,
    unidad: "unidades",
    observacion: "",
    estado: "pendiente",
    esNuevo: true,
  };
}

/* =====================================================
   SKELETON
===================================================== */

function CreateSolicitudSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-36 rounded-2xl bg-slate-200 sm:h-40 sm:rounded-3xl dark:bg-slate-800" />

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({
          length: 3,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800"
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

export default function CreateSolicitudView() {
  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

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
  >([
    crearDetalleInicial(),
  ]);

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
     CONSULTAR ALMACENES
  ===================================================== */

  const {
    data: dataAlmacenes,
    isLoading: loadingAlmacenes,
    isError: errorAlmacenes,
    error: almacenesError,
    refetch: recargarAlmacenes,
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
     CONSULTAR INVENTARIO PRINCIPAL
  ===================================================== */

  const {
    data:
      inventarioPrincipal,

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
      "inventario-principal",
      idSucursal,
    ],

    queryFn: () =>
      getInventarioPrincipalPorSucursal(
        idSucursal
      ),

    enabled:
      Boolean(idSucursal),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  const productos =
    useMemo(() => {
      return (
        inventarioPrincipal
          ?.inventarios ?? []
      )
        .filter(
          (inventario) =>
            inventario.estado !==
              false &&
            Number(
              inventario.cantidad
            ) > 0 &&
            typeof inventario.idProducto ===
              "object" &&
            inventario.idProducto !==
              null &&
            Boolean(
              inventario.idProducto
                ._id
            )
        )
        .map(
          (inventario) => {
            const producto =
              typeof inventario.idProducto ===
                "object" &&
              inventario.idProducto !==
                null
                ? inventario.idProducto
                : null;

            return {
              _id:
                producto?._id ??
                "",

              nombre:
                producto?.nombre ??
                "Producto",

              descripcion:
                producto?.descripcion ??
                "",

              marca:
                producto?.marca ??
                "",

              estado:
                producto?.estado ??
                true,

              stockDisponible:
                Number(
                  inventario.cantidad ??
                    0
                ),
            };
          }
        );
    }, [
      inventarioPrincipal,
    ]);

  /* =====================================================
     DEFINIR ALMACÉN ORIGEN
  ===================================================== */

  useEffect(() => {
    if (
      tipoSolicitud ===
      "compra_externa"
    ) {
      setIdAlmacenOrigen("");
      return;
    }

    const idPrincipal =
      inventarioPrincipal
        ?.almacen?._id ??
      "";

    setIdAlmacenOrigen(
      idPrincipal
    );
  }, [
    inventarioPrincipal,
    tipoSolicitud,
  ]);

  /* =====================================================
     LIMPIAR DESTINO INVÁLIDO
  ===================================================== */

  useEffect(() => {
    if (!idAlmacenDestino) {
      return;
    }

    const destinoExiste =
      almacenes.some(
        (almacen) =>
          almacen._id ===
          idAlmacenDestino
      );

    if (!destinoExiste) {
      setIdAlmacenDestino("");
    }
  }, [
    almacenes,
    idAlmacenDestino,
  ]);

  /* =====================================================
     CREAR SOLICITUD
  ===================================================== */

  const {
    mutate:
      guardarSolicitud,

    isPending,
  } = useMutation({
    mutationFn:
      async () => {
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
            "No se encontró el almacén principal de origen."
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

        const productosDuplicados =
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
          productosDuplicados
        ) {
          throw new Error(
            "No puede repetir el mismo producto dentro de la solicitud."
          );
        }

        if (
          tipoSolicitud ===
          "reposicion_interna"
        ) {
          for (
            const detalle
            of detallesValidos
          ) {
            const producto =
              productos.find(
                (item) =>
                  item._id ===
                  detalle.idProducto
              );

            const stockDisponible =
              Number(
                producto
                  ?.stockDisponible ??
                  0
              );

            if (
              Number(
                detalle
                  .cantidadSolicitada
              ) >
              stockDisponible
            ) {
              throw new Error(
                `La cantidad solicitada de ${
                  producto?.nombre ??
                  "un producto"
                } supera el stock disponible (${stockDisponible}).`
              );
            }
          }
        }

        /* 1. CREAR SOLICITUD */

        const respuestaSolicitud =
          await createSolicitud({
            idPerfil,
            idSucursal,

            idAlmacenOrigen:
              tipoSolicitud ===
              "compra_externa"
                ? null
                : idAlmacenOrigen,

            idAlmacenDestino,

            fechaSolicitud:
              new Date()
                .toISOString(),

            estado:
              "pendiente",

            observacion:
              observacion.trim() ||
              "Sin observación",

            creadoPor:
              nombreUsuario,
          });

        const idSolicitudCreada =
          respuestaSolicitud
            .solicitud?._id;

        if (
          !idSolicitudCreada
        ) {
          throw new Error(
            "El backend no devolvió el ID de la solicitud creada."
          );
        }

        /* 2. PREPARAR DETALLES */

        const detallesPayload:
          DetalleSolicitudForm[] =
          detallesValidos.map(
            (detalle) => ({
              idSolicitud:
                idSolicitudCreada,

              idProducto:
                detalle.idProducto,

              cantidadSolicitada:
                Number(
                  detalle
                    .cantidadSolicitada
                ),

              cantidadAprobada:
                0,

              cantidadAtendida:
                0,

              unidad:
                detalle.unidad ||
                "unidades",

              observacion:
                detalle
                  .observacion ??
                "",

              estado:
                "pendiente",

              creadoPor:
                nombreUsuario,
            })
          );

        /* 3. CREAR DETALLES */

        const detallesCreados =
          await createManyDetalleSolicitud(
            detallesPayload
          );

        /* 4. MOVIMIENTO GENERAL */

        const totalSolicitado =
          detallesPayload.reduce(
            (
              total,
              detalle
            ) =>
              total +
              Number(
                detalle
                  .cantidadSolicitada
              ),
            0
          );

        const movimientoSolicitud:
          MovimientoForm = {
          fecha:
            new Date()
              .toISOString(),

          tipoMovimiento:
            "solicitud",

          origenMovimiento:
            "solicitud",

          modulo:
            "solicitud",

          idSolicitud:
            idSolicitudCreada,

          idSucursal,
          idPerfil,

          idAlmacenOrigen:
            tipoSolicitud ===
            "compra_externa"
              ? undefined
              : idAlmacenOrigen,

          idAlmacenDestino,

          cantidad:
            totalSolicitado,

          estado:
            "pendiente",

          referenciaId:
            idSolicitudCreada,

          referenciaModelo:
            "Solicitud",

          observacion:
            observacion.trim() ||
            (
              tipoSolicitud ===
              "compra_externa"
                ? "Solicitud de compra externa"
                : "Solicitud de reposición interna"
            ),

          creadoPor:
            nombreUsuario,
        };

        await createMovimiento(
          movimientoSolicitud
        );

        /* 5. MOVIMIENTOS POR PRODUCTO */

        await Promise.all(
          detallesPayload.map(
            async (
              detalle
            ) => {
              const producto =
                productos.find(
                  (item) =>
                    item._id ===
                    detalle.idProducto
                );

              const movimientoDetalle:
                MovimientoForm = {
                fecha:
                  new Date()
                    .toISOString(),

                tipoMovimiento:
                  "solicitud",

                origenMovimiento:
                  "solicitud",

                modulo:
                  "solicitud",

                idSolicitud:
                  idSolicitudCreada,

                idSucursal,
                idPerfil,

                idAlmacenOrigen:
                  tipoSolicitud ===
                  "compra_externa"
                    ? undefined
                    : idAlmacenOrigen,

                idAlmacenDestino,

                idProducto:
                  detalle.idProducto,

                cantidad:
                  detalle
                    .cantidadSolicitada,

                estado:
                  "pendiente",

                referenciaId:
                  idSolicitudCreada,

                referenciaModelo:
                  "DetalleSolicitud",

                observacion:
                  `Producto solicitado: ${
                    producto?.nombre ??
                    "Producto"
                  }`,

                creadoPor:
                  nombreUsuario,
              };

              await createMovimiento(
                movimientoDetalle
              );
            }
          )
        );

        return {
          solicitud:
            respuestaSolicitud
              .solicitud,

          cantidadDetalles:
            Array.isArray(
              detallesCreados
            )
              ? detallesCreados.length
              : detallesPayload.length,

          totalSolicitado,
        };
      },

    onSuccess:
      async (
        resultado
      ) => {
        await Swal.fire({
          icon:
            "success",

          title:
            "Solicitud creada",

          html: `
            <p>La solicitud, sus detalles y movimientos fueron registrados correctamente.</p>
            <p style="margin-top:8px;">
              <strong>Productos:</strong>
              ${resultado.cantidadDetalles}
            </p>
            <p>
              <strong>Total solicitado:</strong>
              ${resultado.totalSolicitado} unidades
            </p>
          `,

          timer:
            2500,

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

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "solicitudes-sucursal",
              idSucursal,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "movimientos",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "inventario-principal",
              idSucursal,
            ],
          }),
        ]);

        navigate(-1);
      },

    onError:
      async (
        error
      ) => {
        await Swal.fire({
          icon:
            "error",

          title:
            "Error al crear solicitud",

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

  /* =====================================================
     ACTUALIZAR DATOS
  ===================================================== */

  const actualizarDatos =
    async () => {
      await Promise.all([
        recargarAlmacenes(),
        recargarProductos(),
      ]);
    };

  const actualizandoDatos =
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

  if (
    loadingAuth ||
    loadingAlmacenes ||
    loadingProductos
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <CreateSolicitudSkeleton />
        </main>
      </div>
    );
  }

  if (
    errorAlmacenes ||
    errorProductos
  ) {
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
                  No se pudo cargar el formulario
                </h1>

                <p className="mt-2 break-words text-sm text-red-700 dark:text-red-400">
                  {errorAlmacenes
                    ? obtenerMensajeError(
                        almacenesError
                      )
                    : obtenerMensajeError(
                        productosError
                      )}
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
                    Crear solicitud
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
                {productos.length}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Con stock
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
                  <Send size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Datos de la solicitud
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Selecciona el tipo, almacén destino y los productos que formarán parte de la solicitud.
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
                  productos
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

                buttonText="Registrar solicitud"

                onSubmit={() =>
                  guardarSolicitud()
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

          Registrando solicitud...
        </div>
      )}
    </div>
  );
}
