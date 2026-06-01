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
  ClipboardList,
  LogOut,
  Menu,
  Printer,
  ReceiptText,
  Search,
  XCircle,
  Clock,
  CheckCircle,
  Pencil,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

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
} from "@/types/ComandaType";

export default function DetalleComandaView() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: perfilAuth,
    isLoading: loadingAuth,
  } = useAuth();

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
  ] = useState<ComandaConDetalleType | null>(null);

  /* =========================
      IDS DESDE USEAUTH
  ========================= */

  const idPerfil =
    perfilAuth?._id;

  const idSucursal =
    typeof perfilAuth?.idSucursal === "object"
      ? perfilAuth.idSucursal?._id
      : perfilAuth?.idSucursal;

  /* =========================
      GET COMANDAS CON DETALLES
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "comandas-con-detalles",
      idPerfil,
    ],

    queryFn: () =>
      getComandasConDetallesPorPerfil(
        idPerfil!
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

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Comanda anulada",
        text: "La comanda fue anulada correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "comandas-con-detalles",
          idPerfil,
        ],
      });

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al anular la comanda",
      });

    },

  });

  /* =========================
      ABRIR MODAL PARA VENTA
  ========================= */

  const handleImprimirComanda = (
    comanda: ComandaConDetalleType
  ) => {

    if (!comanda._id) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el ID de la comanda",
      });

      return;

    }

    if (!idPerfil) {

      Swal.fire({
        icon: "error",
        title: "Perfil no encontrado",
        text: "No se encontró el perfil del usuario.",
      });

      return;

    }

    if (!idSucursal) {

      Swal.fire({
        icon: "error",
        title: "Sucursal no encontrada",
        text: "No se encontró la sucursal del usuario.",
      });

      return;

    }

    if (
      !comanda.detalles ||
      comanda.detalles.length === 0
    ) {

      Swal.fire({
        icon: "warning",
        title: "Comanda sin productos",
        text: "No se puede registrar una venta sin productos.",
      });

      return;

    }

    if (cajas.length === 0) {

      Swal.fire({
        icon: "warning",
        title: "No hay cajas disponibles",
        text: "No existen cajas activas para esta sucursal.",
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
      HANDLE ANULAR
  ========================= */

  const handleAnularComanda = async (
    comandaId?: string
  ) => {

    if (!comandaId) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el ID de la comanda",
      });

      return;

    }

    const result =
      await Swal.fire({
        icon: "warning",
        title: "¿Anular comanda?",
        text: "Esta acción cambiará el estado de la comanda a anulado.",
        showCancelButton: true,
        confirmButtonText: "Sí, anular",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc2626",
      });

    if (!result.isConfirmed) {
      return;
    }

    anularComanda({

      id:
        comandaId,

      eliminadoPor:
        perfilAuth?.nombres || "sistema",

    });

  };

  /* =========================
      HELPERS
  ========================= */

  const formatearFecha = (
    fecha?: string | null
  ) => {

    if (!fecha) {
      return "Sin fecha";
    }

    return new Date(fecha).toLocaleString(
      "es-BO",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );

  };

  const getEstadoStyle = (
    estado: string
  ) => {

    if (estado === "en_proceso") {
      return {
        texto: "En proceso",
        className:
          "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        icon: Clock,
      };
    }

    if (estado === "impreso") {
      return {
        texto: "Impreso",
        className:
          "bg-blue-500/10 text-blue-400 border-blue-500/30",
        icon: Printer,
      };
    }

    if (estado === "cerrado") {
      return {
        texto: "Cerrado",
        className:
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: CheckCircle,
      };
    }

    if (estado === "anulado") {
      return {
        texto: "Anulado",
        className:
          "bg-red-500/10 text-red-400 border-red-500/30",
        icon: XCircle,
      };
    }

    return {
      texto: estado,
      className:
        "bg-slate-500/10 text-slate-400 border-slate-500/30",
      icon: ReceiptText,
    };

  };

  /* =========================
      BUSCADOR
  ========================= */

  const comandasFiltradas = useMemo(() => {

    const comandas =
      data?.comandas || [];

    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return comandas;
    }

    return comandas.filter((comanda) => {

      const productosTexto =
        comanda.detalles
          .map((detalle) =>
            `
              ${detalle.producto?.nombre || ""}
              ${detalle.producto?.marca || ""}
              ${detalle.producto?.descripcion || ""}
            `
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

    });

  }, [data, search]);

  /* =========================
      CERRAR SESION
  ========================= */

  const cerrarSesion = () => {

    localStorage.removeItem(
      "AUTH_TOKEN"
    );

    navigate("/auth/login");

  };

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
        <p className="text-lg font-bold">
          Cargando comandas...
        </p>
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

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-bold text-red-400">
          Error al cargar comandas o cajas
        </p>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-fuchsia-500/20 bg-slate-950/95 backdrop-blur">

        <div className="flex h-20 items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <button
              type="button"
              className="rounded-xl border border-fuchsia-500/30 p-3 text-fuchsia-400 hover:bg-fuchsia-500/10"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20 shadow-[0_0_25px_#d946ef]">

                <ClipboardList className="h-7 w-7 text-fuchsia-400" />

              </div>

              <div>

                <h1 className="text-2xl font-black text-fuchsia-400">
                  {perfilAuth?.nombres}
                </h1>

                <p className="text-xs tracking-[3px] text-slate-400">
                  LISTA DE COMANDAS
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-5 py-3 font-bold text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
            Salir
          </button>

        </div>

      </header>

      {/* CONTENIDO */}
      <main className="p-6">

        <section className="rounded-3xl border border-fuchsia-500/20 bg-slate-900 p-6 shadow-2xl">

          {/* CABECERA */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-3xl font-black text-white">
                Comandas Registradas
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
                Sucursal ID:{" "}
                <span className="font-bold text-slate-300">
                  {idSucursal || "Sin sucursal"}
                </span>
              </p>

            </div>

            <div className="relative w-full md:w-80">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Buscar comanda..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-fuchsia-500"
              />

            </div>

          </div>

          {comandasFiltradas.length === 0 ? (

            <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 text-slate-400">
              No hay comandas registradas
            </div>

          ) : (

            <div className="space-y-6">

              {comandasFiltradas.map((comanda) => {

                const estadoInfo =
                  getEstadoStyle(
                    comanda.estado
                  );

                const EstadoIcon =
                  estadoInfo.icon;

                return (

                  <article
                    key={comanda._id}
                    className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950"
                  >

                    {/* CABECERA COMANDA */}
                    <div className="flex flex-col gap-4 border-b border-slate-700 p-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20">

                          <ReceiptText className="h-7 w-7 text-fuchsia-400" />

                        </div>

                        <div>

                          <h3 className="text-xl font-black text-white">
                            {comanda.numeroComanda ||
                              "Sin número"}
                          </h3>

                          <p className="text-sm text-slate-400">
                            Creado por:{" "}
                            {comanda.creadoPor ||
                              perfilAuth?.nombres ||
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

                        {/* ESTADO */}
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

                        {/* BOTONES SOLO EN PROCESO */}
                        {comanda.estado === "en_proceso" && (

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

                        {/* IMPRESO */}
                        {comanda.estado === "impreso" && (

                          <span className="rounded-2xl bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-400">
                            Comanda impresa
                          </span>

                        )}

                        {/* ANULADO */}
                        {comanda.estado === "anulado" && (

                          <span className="rounded-2xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">
                            Comanda anulada
                          </span>

                        )}

                        {/* CERRADO */}
                        {comanda.estado === "cerrado" && (

                          <span className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                            Comanda cerrada
                          </span>

                        )}

                      </div>

                    </div>

                    {/* OBSERVACION */}
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

                      {comanda.detalles.length === 0 ? (

                        <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-center text-slate-400">
                          Esta comanda no tiene detalles registrados
                        </div>

                      ) : (

                        <div className="overflow-x-auto">

                          <table className="w-full border-collapse">

                            <thead>

                              <tr className="border-b border-slate-700 text-left text-sm text-slate-400">

                                <th className="pb-3">
                                  Producto
                                </th>

                                <th className="pb-3">
                                  Cantidad
                                </th>

                                <th className="pb-3">
                                  Precio
                                </th>

                                <th className="pb-3 text-right">
                                  Subtotal
                                </th>

                              </tr>

                            </thead>

                            <tbody>

                              {comanda.detalles.map((detalle) => (

                                <tr
                                  key={detalle._id}
                                  className="border-b border-slate-800 text-sm"
                                >

                                  <td className="py-4">

                                    <p className="font-black text-white">
                                      {detalle.producto?.nombre ||
                                        "Producto sin nombre"}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                      {detalle.producto?.marca ||
                                        "Sin marca"}
                                    </p>

                                  </td>

                                  <td className="py-4 font-bold text-slate-300">
                                    {detalle.cantidad}
                                  </td>

                                  <td className="py-4 font-bold text-slate-300">
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

                              ))}

                            </tbody>

                          </table>

                        </div>

                      )}

                    </div>

                    {/* TOTAL */}
                    <div className="flex items-center justify-between border-t border-slate-700 bg-slate-900 px-5 py-4">

                      <span className="text-lg font-bold text-slate-300">
                        Total Comanda
                      </span>

                      <span className="text-3xl font-black text-fuchsia-400">
                        Bs. {comanda.total.toFixed(2)}
                      </span>

                    </div>

                  </article>

                );

              })}

            </div>

          )}

        </section>

      </main>

      {/* MODAL VENTA */}
      <VentaModal
        open={modalVentaOpen}
        onClose={() =>
          setModalVentaOpen(false)
        }
        comanda={comandaSeleccionada}
        cajas={cajas}
        idPerfil={idPerfil || ""}
        idSucursal={idSucursal || ""}
        creadoPor={perfilAuth?.nombres || "sistema"}
        onSuccess={() => {

          setComandaSeleccionada(null);

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