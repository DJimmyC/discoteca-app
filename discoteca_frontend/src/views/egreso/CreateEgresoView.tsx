// src/views/egreso/CreateEgresoView.tsx

import {
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
  Banknote,
  ClipboardList,
  LoaderCircle,
  MapPin,
  Plus,
  ReceiptText,
  RefreshCcw,
  Warehouse,
} from "lucide-react";

import {
  useAuth,
} from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import EgresoForm, {
  type DetalleEgresoItem,
} from "@/components/egreso/EgresoForm";

import {
  getCajasBySucursal,
} from "@/api/CajaApi";

import {
  getAlmacenesBySucursal,
} from "@/api/AlmacenApi";

import {
  getProductos,
} from "@/api/ProductoApi";

import {
  createEgreso,
} from "@/api/EgresoApi";

import {
  createManyDetalleEgreso,
} from "@/api/DetalleEgresoApi";

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

function crearDetalleInicial(): DetalleEgresoItem {
  return {
    idProducto: null,
    idAlmacen: "",
    descripcion: "",
    cantidad: 1,
    costoUnitario: 0,
    tipoItem: "otro",
  };
}


type CajaOption = {
  _id: string;
  nombre: string;
  descripcion?: string;
  estado?: boolean;
};

/* =====================================================
   SKELETON
===================================================== */

function CreateEgresoSkeleton() {
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

export default function CreateEgresoView() {
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
    idCaja,
    setIdCaja,
  ] = useState("");

  const [
    tipoEgreso,
    setTipoEgreso,
  ] = useState("compra");

  const [
    metodoPago,
    setMetodoPago,
  ] = useState("efectivo");

  const [
    observacion,
    setObservacion,
  ] = useState("");

  const [
    detalles,
    setDetalles,
  ] = useState<
    DetalleEgresoItem[]
  >([
    crearDetalleInicial(),
  ]);

  /* =====================================================
     DATOS DEL PERFIL
  ===================================================== */

  const idPerfil =
    perfil?._id;

  const idSucursal =
    typeof perfil?.idSucursal ===
      "object"
      ? perfil.idSucursal?._id
      : perfil?.idSucursal;

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
     CAJAS
  ===================================================== */

  const {
    data: cajas = [],
    isLoading:
      loadingCajas,
    isError:
      errorCajas,
    error:
      cajasError,
    refetch:
      recargarCajas,
    isFetching:
      actualizandoCajas,
  } = useQuery({
    queryKey: [
      "cajas-sucursal",
      idSucursal,
    ],

    queryFn: () =>
      getCajasBySucursal(
        idSucursal!
      ),

    enabled:
      Boolean(
        idSucursal
      ),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });


  const cajasValidas =
    useMemo<CajaOption[]>(
      () =>
        cajas
          .filter(
            (
              caja
            ): caja is typeof caja & {
              _id: string;
            } =>
              typeof caja._id ===
                "string" &&
              caja._id.trim() !==
                ""
          )
          .map(
            (caja) => ({
              _id:
                caja._id,

              nombre:
                caja.nombre?.trim() ||
                caja.descripcion?.trim() ||
                "Caja sin nombre",

              descripcion:
                caja.descripcion ??
                "",

              estado:
                caja.estado ??
                true,
            })
          ),
      [
        cajas,
      ]
    );

  /* =====================================================
     ALMACENES
  ===================================================== */

  const {
    data:
      dataAlmacenes,

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
        idSucursal!
      ),

    enabled:
      Boolean(
        idSucursal
      ),

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
     TOTAL
  ===================================================== */

  const total =
    useMemo(() => {
      return detalles.reduce(
        (
          acumulado,
          detalle
        ) =>
          acumulado +
          Number(
            detalle.cantidad ||
              0
          ) *
            Number(
              detalle.costoUnitario ||
                0
            ),
        0
      );
    }, [
      detalles,
    ]);

  /* =====================================================
     CREAR EGRESO
  ===================================================== */

  const {
    mutate:
      guardarEgreso,

    isPending,
  } = useMutation({
    mutationFn:
      async () => {
        if (
          !idSucursal
        ) {
          throw new Error(
            "No se encontró la sucursal del usuario."
          );
        }

        if (
          !idPerfil
        ) {
          throw new Error(
            "No se encontró el perfil del usuario."
          );
        }

        if (
          !idCaja
        ) {
          throw new Error(
            "Debe seleccionar una caja."
          );
        }

        const detallesValidos =
          detalles.filter(
            (detalle) =>
              Boolean(
                detalle.idAlmacen
              ) &&
              detalle.descripcion
                .trim() !== "" &&
              Number(
                detalle.cantidad
              ) > 0 &&
              Number(
                detalle.costoUnitario
              ) >= 0
          );

        if (
          detallesValidos.length ===
          0
        ) {
          throw new Error(
            "Debe agregar al menos un detalle válido con almacén seleccionado."
          );
        }

        if (
          total < 0
        ) {
          throw new Error(
            "El total no puede ser negativo."
          );
        }

        const responseEgreso =
          await createEgreso({
            idCaja,
            idPerfil,
            idSucursal,
            tipoEgreso,
            metodoPago,
            total,

            estado:
              "registrado",

            observacion:
              observacion.trim() ||
              "Sin observación",

            creadoPor:
              nombreUsuario,
          });

        const idEgresoCreado =
          responseEgreso
            ?.egreso?._id;

        if (
          !idEgresoCreado
        ) {
          throw new Error(
            "No se recibió el ID del egreso creado."
          );
        }

        const detallesPayload =
          detallesValidos.map(
            (detalle) => ({
              idEgreso:
                idEgresoCreado,

              idProducto:
                detalle.idProducto ||
                null,

              idAlmacen:
                detalle.idAlmacen,

              descripcion:
                detalle.descripcion
                  .trim(),

              cantidad:
                Number(
                  detalle.cantidad
                ),

              costoUnitario:
                Number(
                  detalle.costoUnitario
                ),

              subtotal:
                Number(
                  detalle.cantidad
                ) *
                Number(
                  detalle.costoUnitario
                ),

              tipoItem:
                detalle.tipoItem,

              creadoPor:
                nombreUsuario,
            })
          );

        await createManyDetalleEgreso(
          detallesPayload
        );

        return {
          cantidadDetalles:
            detallesPayload.length,

          total,
        };
      },

    onSuccess:
      async (
        resultado
      ) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "egresos-con-detalles",
              idSucursal,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "almacenes-sucursal",
              idSucursal,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "movimientos",
            ],
          }),
        ]);

        await Swal.fire({
          icon:
            "success",

          title:
            "Egreso registrado",

          html: `
            <p>El egreso y sus detalles fueron registrados correctamente.</p>
            <p style="margin-top:8px">
              <strong>Detalles:</strong>
              ${resultado.cantidadDetalles}
            </p>
            <p>
              <strong>Total:</strong>
              Bs ${resultado.total.toFixed(2)}
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
        error
      ) => {
        await Swal.fire({
          icon:
            "error",

          title:
            "Error al registrar",

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
        recargarCajas(),
        recargarAlmacenes(),
        recargarProductos(),
      ]);
    };

  const actualizandoDatos =
    actualizandoCajas ||
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
    loadingCajas ||
    loadingAlmacenes ||
    loadingProductos
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <CreateEgresoSkeleton />
        </main>
      </div>
    );
  }

  if (
    errorCajas ||
    errorAlmacenes ||
    errorProductos
  ) {
    const mensaje =
      errorCajas
        ? obtenerMensajeError(
            cajasError
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
                  No se pudo cargar el formulario
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
                    <RefreshCcw
                      size={17}
                    />

                    Intentar nuevamente
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(-1)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 dark:border-red-800 dark:text-red-300"
                  >
                    <ArrowLeft
                      size={17}
                    />

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
                  <Banknote
                    size={22}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                    Gestión financiera
                  </p>

                  <h1 className="mt-1 truncate text-xl font-bold sm:text-3xl">
                    Crear egreso
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
                  <ArrowLeft
                    size={17}
                  />

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
                Cajas
              </p>

              <p className="mt-1 text-xl font-bold sm:mt-2 sm:text-3xl">
                {cajasValidas.length}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Disponibles
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-blue-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-blue-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs dark:text-blue-400">
                Almacenes
              </p>

              <p className="mt-1 text-xl font-bold text-blue-700 sm:mt-2 sm:text-3xl dark:text-blue-400">
                {almacenes.length}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Registrados
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-red-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-red-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-red-600 sm:text-xs dark:text-red-400">
                Total
              </p>

              <p className="mt-1 truncate text-lg font-bold text-red-700 sm:mt-2 sm:text-2xl dark:text-red-400">
                Bs {total.toFixed(2)}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Egreso actual
              </p>
            </article>
          </section>

          {/* FORMULARIO */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                  <ReceiptText
                    size={19}
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Datos del egreso
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Selecciona la caja, el tipo de egreso, el método de pago y agrega los detalles correspondientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 p-3 sm:p-5 lg:p-6">
              <EgresoForm
                cajas={
                  cajasValidas
                }

                almacenes={
                  almacenes
                }

                productos={
                  productosValidos
                }

                idCaja={
                  idCaja
                }

                setIdCaja={
                  setIdCaja
                }

                tipoEgreso={
                  tipoEgreso
                }

                setTipoEgreso={
                  setTipoEgreso
                }

                metodoPago={
                  metodoPago
                }

                setMetodoPago={
                  setMetodoPago
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

                total={
                  total
                }

                isPending={
                  isPending
                }

                buttonText="Registrar egreso"

                onSubmit={() =>
                  guardarEgreso()
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

          Registrando egreso...
        </div>
      )}
    </div>
  );
}
