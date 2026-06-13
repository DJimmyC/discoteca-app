import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CheckCircle,
  Clock,
  Pencil,
  Printer,
  ReceiptText,
  Search,
  XCircle,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  deleteComandaById,
  getComandasConDetallesPorPerfil,
} from "@/api/ComandaApi";

import {
  getCajasBySucursal,
} from "@/api/CajaApi";

import VentaModal from "@/components/venta/VentaModal";

import type {
  ComandaConDetalleType,
  DetalleDentroComandaType,
} from "@/types/ComandaType";

/* =========================
    TIPO DE CAJA PARA MODAL
========================= */

type CajaOption = {

  _id:
    string;

  nombre:
    string;

  descripcion?:
    string;

  estado?:
    boolean;

};

/* =========================
    OBTENER ID DE RELACIÓN
========================= */

function obtenerIdRelacion(
  relacion:
    | string
    | { _id?: string }
    | null
    | undefined
): string {

  if (
    typeof relacion === "string"
  ) {
    return relacion;
  }

  return relacion?._id || "";

}

/* =========================
    OBTENER PRODUCTO
========================= */

function obtenerProductoDetalle(
  detalle:
    DetalleDentroComandaType
) {

  if (
    detalle.producto &&
    typeof detalle.producto ===
      "object"
  ) {
    return detalle.producto;
  }

  if (
    detalle.idProducto &&
    typeof detalle.idProducto ===
      "object"
  ) {
    return detalle.idProducto;
  }

  return null;

}

/* =========================
    OBTENER INVENTARIO
========================= */

function obtenerInventarioDetalle(
  detalle:
    DetalleDentroComandaType
) {

  if (
    detalle.idInventario &&
    typeof detalle.idInventario ===
      "object"
  ) {
    return detalle.idInventario;
  }

  return null;

}

/* =========================
    OBTENER ALMACÉN
========================= */

function obtenerAlmacenDetalle(
  detalle:
    DetalleDentroComandaType
) {

  if (
    detalle.idAlmacen &&
    typeof detalle.idAlmacen ===
      "object"
  ) {
    return detalle.idAlmacen;
  }

  return null;

}

export default function
DetalleComandaView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    data: perfilAuth,
    isLoading: loadingAuth,
  } = useAuth();
console.log(perfilAuth)
  /* =========================
      ESTADOS
  ========================= */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    modalVentaOpen,
    setModalVentaOpen,
  ] = useState(false);

  const [
    comandaSeleccionada,
    setComandaSeleccionada,
  ] =
    useState<ComandaConDetalleType | null>(
      null
    );

  /* =========================
      IDS DEL PERFIL
  ========================= */
/* =========================
    IDS NORMALIZADOS
========================= */

const idPerfil: string =
  obtenerIdRelacion(
    perfilAuth?._id
  );

const idSucursal: string =
  obtenerIdRelacion(
    perfilAuth?.idSucursal
  );

const idAlmacen: string =
  obtenerIdRelacion(
    perfilAuth?.idAlmacen
  );

  /* =========================
      GET COMANDAS
  ========================= */

  const {
    data,
    isLoading,
    isError,
    error: errorComandas,
  } = useQuery({

    queryKey: [
      "comandas-con-detalles",
      idPerfil,
    ],

    queryFn: () =>
      getComandasConDetallesPorPerfil(
        idPerfil
      ),

    enabled:
      !!idPerfil,

  });

  /* =========================
      GET CAJAS POR SUCURSAL
  ========================= */

  const {
    data: cajas = [],
    isLoading: loadingCajas,
    isError: errorCajas,
    error: errorConsultaCajas,
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
      !!idSucursal,

  });

  /* =========================
      MUTATION ANULAR COMANDA
  ========================= */

  const {
    mutate: anularComanda,
    isPending: anulandoComanda,
  } = useMutation({

    mutationFn:
      deleteComandaById,

    onSuccess: async () => {

      await Swal.fire({

        icon:
          "success",

        title:
          "Comanda anulada",

        text:
          "La comanda fue anulada correctamente",

        timer:
          1800,

        showConfirmButton:
          false,

      });

      queryClient.invalidateQueries({

        queryKey: [
          "comandas-con-detalles",
          idPerfil,
        ],

      });

    },

    onError: async (
      error
    ) => {

      await Swal.fire({

        icon:
          "error",

        title:
          "Error",

        text:
          error instanceof Error
            ? error.message
            : "Error al anular la comanda",

      });

    },

  });

  /* =========================
      ABRIR MODAL DE VENTA
  ========================= */

  const handleImprimirComanda = (
    comanda:
      ComandaConDetalleType
  ) => {

    if (!comanda._id) {

      Swal.fire({

        icon:
          "error",

        title:
          "Error",

        text:
          "No se encontró el ID de la comanda",

      });

      return;

    }

    if (!idPerfil) {

      Swal.fire({

        icon:
          "error",

        title:
          "Perfil no encontrado",

        text:
          "No se encontró el perfil del usuario",

      });

      return;

    }

    if (!idSucursal) {

      Swal.fire({

        icon:
          "error",

        title:
          "Sucursal no encontrada",

        text:
          "No se encontró la sucursal del usuario",

      });

      return;

    }

    if (
      !comanda.detalles ||
      comanda.detalles.length === 0
    ) {

      Swal.fire({

        icon:
          "warning",

        title:
          "Comanda sin productos",

        text:
          "No se puede registrar una venta sin productos",

      });

      return;

    }

    /*
      Verificar que cada detalle conserve
      producto, inventario y almacén.
    */

    const detalleIncompleto =
      comanda.detalles.find(
        (detalle) => {

          const producto =
            obtenerProductoDetalle(
              detalle
            );

          const idProducto =
            obtenerIdRelacion(
              detalle.idProducto
            ) ||
            producto?._id ||
            "";

          const idInventario =
            obtenerIdRelacion(
              detalle.idInventario
            );

          const idAlmacen =perfilAuth.idAlmacen!

          return (
            !idProducto ||
            !idInventario ||
            !idAlmacen
          );

        }
      );

    if (detalleIncompleto) {

      Swal.fire({

        icon:
          "warning",

        title:
          "Detalle incompleto",

        text:
          "Uno de los productos no tiene inventario o almacén asociado",

      });

      return;

    }

    if (
      cajasParaModal.length === 0
    ) {

      Swal.fire({

        icon:
          "warning",

        title:
          "No hay cajas disponibles",

        text:
          "No existen cajas activas para esta sucursal",

      });

      return;

    }

    setComandaSeleccionada(
      comanda
    );

    setModalVentaOpen(
      true
    );

  };

  /* =========================
      ANULAR COMANDA
  ========================= */

  const handleAnularComanda =
    async (
      comandaId?:
        string
    ) => {

      if (!comandaId) {

        Swal.fire({

          icon:
            "error",

          title:
            "Error",

          text:
            "No se encontró el ID de la comanda",

        });

        return;

      }

      const result =
        await Swal.fire({

          icon:
            "warning",

          title:
            "¿Anular comanda?",

          text:
            "Esta acción cambiará el estado de la comanda a anulado",

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, anular",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#dc2626",

        });

      if (!result.isConfirmed) {
        return;
      }

      anularComanda({

        id:
          comandaId,

        eliminadoPor:
          perfilAuth?._id ||
          "sistema",

      });

    };

  /* =========================
      FORMATEAR FECHA
  ========================= */

  const formatearFecha = (
    fecha?:
      string | null
  ) => {

    if (!fecha) {
      return "Sin fecha";
    }

    const fechaConvertida =
      new Date(fecha);

    if (
      Number.isNaN(
        fechaConvertida.getTime()
      )
    ) {
      return "Fecha inválida";
    }

    return fechaConvertida
      .toLocaleString(
        "es-BO",
        {
          dateStyle:
            "short",

          timeStyle:
            "short",
        }
      );

  };

  /* =========================
      ESTILO ESTADO
  ========================= */

  const getEstadoStyle = (
    estado:
      string
  ) => {

    if (
      estado ===
      "en_proceso"
    ) {
      return {

        texto:
          "En proceso",

        className:
          "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",

        icon:
          Clock,

      };
    }

    if (
      estado ===
      "impreso"
    ) {
      return {

        texto:
          "Impreso",

        className:
          "bg-blue-500/10 text-blue-400 border-blue-500/30",

        icon:
          Printer,

      };
    }

    if (
      estado ===
      "cerrado"
    ) {
      return {

        texto:
          "Cerrado",

        className:
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",

        icon:
          CheckCircle,

      };
    }

    if (
      estado ===
      "anulado"
    ) {
      return {

        texto:
          "Anulado",

        className:
          "bg-red-500/10 text-red-400 border-red-500/30",

        icon:
          XCircle,

      };
    }

    return {

      texto:
        estado ||
        "Sin estado",

      className:
        "bg-slate-500/10 text-slate-400 border-slate-500/30",

      icon:
        ReceiptText,

    };

  };

  /* =========================
      FILTRAR COMANDAS
  ========================= */

  const comandasFiltradas =
    useMemo(() => {

      const comandas =
        data?.comandas || [];

      const searchValue =
        search
          .trim()
          .toLowerCase();

      if (!searchValue) {
        return comandas;
      }

      return comandas.filter(
        (comanda) => {

          const productosTexto =
            comanda.detalles
              .map(
                (detalle) => {

                  const producto =
                    obtenerProductoDetalle(
                      detalle
                    );

                  const almacen =
                    obtenerAlmacenDetalle(
                      detalle
                    );

                  return `
                    ${producto?.nombre || ""}
                    ${producto?.marca || ""}
                    ${producto?.descripcion || ""}
                    ${almacen?.nombre || ""}
                    ${almacen?.tipo || ""}
                  `;

                }
              )
              .join(" ");

          const texto = `
            ${comanda.numeroComanda || ""}
            ${comanda.estado || ""}
            ${comanda.observacion || ""}
            ${comanda.creadoPor || ""}
            ${comanda.total || ""}
            ${productosTexto}
          `.toLowerCase();

          return texto.includes(
            searchValue
          );

        }
      );

    }, [
      data,
      search,
    ]);

  /* =========================
      NORMALIZAR CAJAS
  ========================= */

  const cajasParaModal:
    CajaOption[] =
    useMemo(() => {

      return cajas
        .filter(
          (caja) =>
            typeof caja._id ===
              "string" &&
            caja._id.length > 0
        )
        .map(
          (caja) => ({

            _id:
              caja._id as string,

            nombre:
              caja.nombre ||
              "Caja",

            descripcion:
              caja.descripcion ||
              "",

            estado:
              caja.estado ??
              true,

          })
        );

    }, [
      cajas,
    ]);

  /* =========================
      LOADING
  ========================= */

  if (
    loadingAuth ||
    isLoading ||
    loadingCajas
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-b-fuchsia-500" />

          <p className="mt-4 text-lg font-bold">

            Cargando comandas...

          </p>

        </div>

      </div>

    );

  }

  /* =========================
      ERROR
  ========================= */

  if (
    isError ||
    errorCajas
  ) {

    console.log(
      "Error comandas:",
      errorComandas
    );

    console.log(
      "Error cajas:",
      errorConsultaCajas
    );

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">

        <div className="max-w-lg rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">

          <XCircle className="mx-auto h-12 w-12 text-red-400" />

          <h2 className="mt-4 text-2xl font-black text-red-400">

            Error al cargar información

          </h2>

          <p className="mt-3 text-slate-300">

            {errorComandas instanceof Error
              ? errorComandas.message
              : errorConsultaCajas instanceof Error
                ? errorConsultaCajas.message
                : "No se pudieron cargar las comandas o las cajas"}

          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700"
          >
            Reintentar
          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <main className="p-3 sm:p-4 md:p-6">

        <section className="rounded-3xl border border-fuchsia-500/20 bg-slate-900 p-4 shadow-2xl sm:p-6">

          {/* CABECERA */}

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-2xl font-black text-white sm:text-3xl">

                Comandas registradas

              </h2>

              <p className="mt-1 text-sm text-slate-400">

                Perfil:{" "}

                <span className="font-bold text-fuchsia-400">

                  {perfilAuth?.nombres ||
                    data?.perfil?.nombres ||
                    "Sin perfil"}

                </span>

              </p>

              <p className="mt-1 text-sm text-slate-500">

                Sucursal:{" "}

                <span className="font-bold text-slate-300">

                  {data?.sucursal
                    ?.nombreSucursal ||
                    idSucursal ||
                    "Sin sucursal"}

                </span>

              </p>

            </div>

            <div className="relative w-full md:w-80">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Buscar comanda..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-fuchsia-500"
              />

            </div>

          </div>

          {comandasFiltradas.length ===
          0 ? (

            <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 px-5 text-center text-slate-400">

              No hay comandas registradas

            </div>

          ) : (

            <div className="space-y-6">

              {comandasFiltradas.map(
                (comanda) => {

                  const estadoInfo =
                    getEstadoStyle(
                      comanda.estado
                    );

                  const EstadoIcon =
                    estadoInfo.icon;

                  return (

                    <article
                      key={
                        comanda._id ||
                        comanda.numeroComanda
                      }
                      className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950"
                    >

                      {/* CABECERA COMANDA */}

                      <div className="flex flex-col gap-4 border-b border-slate-700 p-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-start gap-4">

                          <div className="flex h-14 w-14 min-w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20">

                            <ReceiptText className="h-7 w-7 text-fuchsia-400" />

                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-xl font-black text-white">

                              {comanda.numeroComanda ||
                                "Sin número"}

                            </h3>

                            <p className="text-sm text-slate-400">

                              Creado por:{" "}

                              {comanda.creadoPor ||
                                perfilAuth?._id ||
                                "Sin usuario"}

                            </p>

                            <p className="text-sm text-slate-500">

                              {formatearFecha(
                                comanda.fechaCreacion
                              )}

                            </p>

                          </div>

                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              rounded-2xl
                              border
                              px-4
                              py-2
                              text-sm
                              font-black
                              ${estadoInfo.className}
                            `}
                          >

                            <EstadoIcon className="h-4 w-4" />

                            {estadoInfo.texto}

                          </span>

                          {comanda.estado ===
                            "en_proceso" && (

                            <>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/comanda/${comanda._id}/edit`
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-2xl bg-fuchsia-600 px-4 py-2 text-sm font-black text-white transition hover:bg-fuchsia-700"
                              >

                                <Pencil className="h-4 w-4" />

                                Editar

                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleImprimirComanda(
                                    comanda
                                  )
                                }
                                disabled={
                                  anulandoComanda
                                }
                                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700"
                              >

                                <Printer className="h-4 w-4" />

                                Imprimir

                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAnularComanda(
                                    comanda._id
                                  )
                                }
                                disabled={
                                  anulandoComanda
                                }
                                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-700"
                              >

                                <XCircle className="h-4 w-4" />

                                Anular

                              </button>

                            </>

                          )}

                          {comanda.estado ===
                            "impreso" && (

                            <span className="rounded-2xl bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-400">

                              Comanda impresa

                            </span>

                          )}

                          {comanda.estado ===
                            "anulado" && (

                            <span className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">

                              Comanda anulada

                            </span>

                          )}

                          {comanda.estado ===
                            "cerrado" && (

                            <span className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">

                              Comanda cerrada

                            </span>

                          )}

                        </div>

                      </div>

                      {/* OBSERVACIÓN */}

                      <div className="border-b border-slate-800 px-5 py-4">

                        <p className="text-sm text-slate-400">

                          Observación:

                        </p>

                        <p className="font-bold text-white">

                          {comanda.observacion ||
                            "Sin observación"}

                        </p>

                      </div>

                      {/* DETALLES */}

                      <div className="p-5">

                        {comanda.detalles
                          .length === 0 ? (

                          <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-center text-slate-400">

                            Esta comanda no tiene detalles registrados

                          </div>

                        ) : (

                          <div className="overflow-x-auto">

                            <table className="min-w-[950px] w-full border-collapse">

                              <thead>

                                <tr className="border-b border-slate-700 text-left text-sm text-slate-400">

                                  <th className="pb-3 pr-4">
                                    Producto
                                  </th>

                                  <th className="pb-3 pr-4">
                                    Almacén
                                  </th>

                                  <th className="pb-3 pr-4">
                                    Inventario
                                  </th>

                                  <th className="pb-3 pr-4 text-center">
                                    Cantidad
                                  </th>

                                  <th className="pb-3 pr-4 text-right">
                                    Precio
                                  </th>

                                  <th className="pb-3 text-right">
                                    Subtotal
                                  </th>

                                </tr>

                              </thead>

                              <tbody>

                                {comanda.detalles.map(
                                  (
                                    detalle,
                                    index
                                  ) => {

                                    const producto =
                                      obtenerProductoDetalle(
                                        detalle
                                      );

                                    const inventario =
                                      obtenerInventarioDetalle(
                                        detalle
                                      );

                                    const almacen =
                                      obtenerAlmacenDetalle(
                                        detalle
                                      );

                                    const idProducto =
                                      obtenerIdRelacion(
                                        detalle.idProducto
                                      ) ||
                                      producto?._id ||
                                      "";

                                    const idInventario =
                                      obtenerIdRelacion(
                                        detalle.idInventario
                                      );

                                    const idAlmacen =
                                      obtenerIdRelacion(
                                        detalle.idAlmacen
                                      );

                                    return (

                                      <tr
                                        key={
                                          detalle._id ||
                                          `${idInventario}-${idProducto}-${index}`
                                        }
                                        className="border-b border-slate-800 text-sm transition hover:bg-slate-900/70"
                                      >

                                        <td className="py-4 pr-4">

                                          <p className="font-black text-white">

                                            {producto?.nombre ||
                                              "Producto sin nombre"}

                                          </p>

                                          <p className="text-xs text-slate-500">

                                            {producto?.marca ||
                                              "Sin marca"}

                                          </p>

                                          {producto?.descripcion && (

                                            <p className="mt-1 max-w-64 truncate text-xs text-slate-600">

                                              {producto.descripcion}

                                            </p>

                                          )}

                                        </td>

                                        <td className="py-4 pr-4">

                                          <p className="font-bold text-cyan-400">

                                            {almacen?.nombre ||
                                              "Almacén relacionado"}

                                          </p>

                                          <p className="text-xs capitalize text-slate-500">

                                            {almacen?.tipo ||
                                              "Sin tipo"}

                                          </p>

                                          {idAlmacen && (

                                            <p className="mt-1 max-w-40 truncate text-[10px] text-slate-700">

                                              {idAlmacen}

                                            </p>

                                          )}

                                        </td>

                                        <td className="py-4 pr-4">

                                          {inventario ? (

                                            <>

                                              <p className="font-bold text-emerald-400">

                                                Stock:{" "}

                                                {Number(
                                                  inventario.cantidad ||
                                                  0
                                                )}

                                              </p>

                                              <p className="text-xs text-slate-500">

                                                Precio: Bs.{" "}

                                                {Number(
                                                  inventario.precioVenta ||
                                                  0
                                                ).toFixed(2)}

                                              </p>

                                            </>

                                          ) : (

                                            <p className="text-xs text-slate-500">

                                              Inventario relacionado

                                            </p>

                                          )}

                                          {idInventario && (

                                            <p className="mt-1 max-w-40 truncate text-[10px] text-slate-700">

                                              {idInventario}

                                            </p>

                                          )}

                                        </td>

                                        <td className="py-4 pr-4 text-center">

                                          <span className="inline-flex min-w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 px-3 py-2 font-black text-fuchsia-400">

                                            {Number(
                                              detalle.cantidad
                                            )}

                                          </span>

                                        </td>

                                        <td className="py-4 pr-4 text-right font-bold text-slate-300">

                                          Bs.{" "}

                                          {Number(
                                            detalle.precioUnitario
                                          ).toFixed(2)}

                                        </td>

                                        <td className="py-4 text-right font-black text-fuchsia-400">

                                          Bs.{" "}

                                          {Number(
                                            detalle.subtotal
                                          ).toFixed(2)}

                                        </td>

                                      </tr>

                                    );

                                  }
                                )}

                              </tbody>

                            </table>

                          </div>

                        )}

                      </div>

                      {/* TOTAL */}

                      <div className="flex items-center justify-between border-t border-slate-700 bg-slate-900 px-5 py-4">

                        <span className="text-lg font-bold text-slate-300">

                          Total comanda

                        </span>

                        <span className="text-3xl font-black text-fuchsia-400">

                          Bs.{" "}

                          {Number(
                            comanda.total ||
                            0
                          ).toFixed(2)}

                        </span>

                      </div>

                    </article>

                  );

                }
              )}

            </div>

          )}

        </section>

      </main>

      {/* MODAL DE VENTA */}

      <VentaModal

        open={
          modalVentaOpen
        }

        onClose={() => {

          setModalVentaOpen(
            false
          );

          setComandaSeleccionada(
            null
          );

        }}

        comanda={
          comandaSeleccionada
        }

        cajas={
          cajasParaModal
        }

        idPerfil={
          idPerfil
        }

        idSucursal={
          idSucursal || ""
        }

        creadoPor={
          perfilAuth?._id ||
          "sistema"
        }

        onSuccess={() => {

          setModalVentaOpen(
            false
          );

          setComandaSeleccionada(
            null
          );

          queryClient.invalidateQueries({

            queryKey: [
              "comandas-con-detalles",
              idPerfil,
            ],

          });

          queryClient.invalidateQueries({

            queryKey: [
              "cajas-sucursal",
              idSucursal,
            ],

          });

        }}

      />

    </div>

  );

}