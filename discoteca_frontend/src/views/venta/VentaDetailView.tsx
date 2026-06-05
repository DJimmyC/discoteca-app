// src/views/venta/VentaDetailView.tsx

import { useMemo, useState, } from "react";
import { useNavigate, } from "react-router-dom";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { CheckCircle, ClipboardList, CreditCard, DollarSign, LogOut, Menu, ReceiptText, Search, Trash2, XCircle, } from "lucide-react";
import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import {
  deleteVentaById,
  getVentasConDetallesPorPerfil,
  cortesiaVentaById,
} from "@/api/VentaApi";

export default function VentaDetailView() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: perfil,
    isLoading: loadingAuth,
  } = useAuth();

  const [
    search,
    setSearch,
  ] = useState("");

  /* =========================
      ID PERFIL DESDE AUTH
  ========================= */

  const idPerfil =
    perfil?._id;

  /* =========================
      GET VENTAS CON DETALLES
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "ventas-con-detalles",
      idPerfil,
    ],

    queryFn: () =>
      getVentasConDetallesPorPerfil(
        idPerfil!
      ),

    enabled:
      !!idPerfil,

  });

  /* =========================
      ANULAR VENTA
  ========================= */

  const {
    mutate: anularVenta,
    isPending: anulandoVenta,
  } = useMutation({

    mutationFn:
      deleteVentaById,

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Venta anulada",
        text: "La venta fue anulada correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "ventas-con-detalles",
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
            : "Error al anular la venta",
      });

    },

  });

  /* =========================
      HANDLE ANULAR
  ========================= */

  const handleAnularVenta = async (
    ventaId?: string
  ) => {

    if (!ventaId) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el ID de la venta",
      });

      return;

    }

    const result =
      await Swal.fire({
        icon: "warning",
        title: "¿Anular venta?",
        text: "Esta acción cambiará el estado de la venta a anulado.",
        showCancelButton: true,
        confirmButtonText: "Sí, anular",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc2626",
      });

    if (!result.isConfirmed) {
      return;
    }

    anularVenta({

      id:
        ventaId,

      eliminadoPor:
        perfil?.nombres || "sistema",

    });

  };

  /* =========================
    MARCAR VENTA COMO CORTESIA
========================= */

  const {
    mutate: marcarCortesia,
    isPending: marcandoCortesia,
  } = useMutation({

    mutationFn:
      cortesiaVentaById,

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Venta en cortesía",
        text: "La venta fue marcada como cortesía correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "ventas-con-detalles",
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
            : "Error al marcar la venta como cortesía",
      });

    },

  });
  /* =========================
      HANDLE CORTESIA
  ========================= */

  const handleCortesiaVenta = async (
    ventaId?: string
  ) => {

    if (!ventaId) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el ID de la venta",
      });

      return;

    }

    const result =
      await Swal.fire({
        icon: "question",
        title: "¿Marcar como cortesía?",
        text: "Esta acción cambiará el estado de la venta a cortesía.",
        showCancelButton: true,
        confirmButtonText: "Sí, cortesía",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#eab308",
      });

    if (!result.isConfirmed) {
      return;
    }

    marcarCortesia({

      id:
        ventaId,

      eliminadoPor:
        perfil?.nombres || "sistema",

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

  const formatearMetodoPago = (
    metodo: string
  ) => {

    if (metodo === "efectivo") {
      return "Efectivo";
    }

    if (metodo === "qr") {
      return "QR";
    }

    if (metodo === "tarjeta") {
      return "Tarjeta";
    }

    if (metodo === "transferencia") {
      return "Transferencia";
    }

    if (metodo === "mixto") {
      return "Mixto";
    }

    return metodo;

  };

  const getEstadoStyle = (
    estado: string
  ) => {

    if (
      estado === "anulado" ||
      estado === "eliminado"
    ) {
      return {
        texto: "Anulado",
        className:
          "bg-red-500/10 text-red-400 border-red-500/30",
        icon: XCircle,
      };
    }

    if (estado === "cortesia") {
      return {
        texto: "Cortesía",
        className:
          "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        icon: CheckCircle,
      };
    }

    if (
      estado === "pagado" ||
      estado === "registrado" ||
      estado === "completado"
    ) {
      return {
        texto: estado,
        className:
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: CheckCircle,
      };
    }

    return {
      texto: estado || "Registrado",
      className:
        "bg-blue-500/10 text-blue-400 border-blue-500/30",
      icon: ReceiptText,
    };

  };

  /* =========================
      BUSCADOR
  ========================= */

  const ventasFiltradas = useMemo(() => {

    const ventas =
      data?.ventas || [];

    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return ventas;
    }

    return ventas.filter((venta) => {

      const productosTexto =
        venta.detalles
          .map((detalle) =>
            `
              ${detalle.producto?.nombre || ""}
              ${detalle.producto?.marca || ""}
              ${detalle.producto?.descripcion || ""}
            `
          )
          .join(" ");

      const texto = `
        ${venta.numeroVenta || ""}
        ${venta.estado || ""}
        ${venta.metodoPago || ""}
        ${venta.observacion || ""}
        ${venta.total || ""}
        ${venta.subtotal || ""}
        
        ${venta.creadoPor || ""}
        ${venta.comanda?.numeroComanda || ""}
        ${venta.caja?.nombre || ""}
        ${venta.caja?.descripcion || ""}
        ${productosTexto}
      `.toLowerCase();

      return texto.includes(
        searchValue
      );

    });

  }, [data, search]);

  /* =========================
      TOTALES GENERALES
  ========================= */

  const resumen = useMemo(() => {

    const ventas =
      data?.ventas || [];

    const ventasValidas =
      ventas.filter(
        (venta) =>
          venta.estado !== "anulado" &&
          venta.estado !== "eliminado"
      );

    const totalVentas =
      ventasValidas.reduce(
        (acc, venta) =>
          acc + Number(venta.total || 0),
        0
      );



    return {
      cantidad:
        ventas.length,

      cantidadValidas:
        ventasValidas.length,

      totalVentas,


    };

  }, [data]);

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
    isLoading
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-bold">
          Cargando ventas...
        </p>
      </div>
    );

  }

  /* =========================
      ERROR
  ========================= */

  if (isError) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-bold text-red-400">
          Error al cargar ventas
        </p>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-emerald-500/20 bg-slate-950/95 backdrop-blur">

        <div className="flex h-20 items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <button
              type="button"
              className="rounded-xl border border-emerald-500/30 p-3 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/20 shadow-[0_0_25px_#10b981]">

                <DollarSign className="h-7 w-7 text-emerald-400" />

              </div>

              <div>

                <h1 className="text-2xl font-black text-emerald-400">
                  {perfil?.nombres}
                </h1>

                <p className="text-xs tracking-[3px] text-slate-400">
                  LISTA DE VENTAS
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

        <section className="rounded-3xl border border-emerald-500/20 bg-slate-900 p-6 shadow-2xl">

          {/* CABECERA */}
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="text-3xl font-black text-white">
                Ventas Registradas
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Perfil:{" "}
                <span className="font-bold text-emerald-400">
                  {perfil?.nombres ||
                    data?.perfil?.nombres ||
                    "Sin perfil"}
                </span>
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sucursal:{" "}
                <span className="font-bold text-slate-300">
                  {data?.sucursal?.nombreSucursal ||
                    "Sin sucursal"}
                </span>
              </p>

            </div>

            <div className="relative w-full md:w-96">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Buscar venta..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-emerald-500"
              />

            </div>

          </div>

          {/* RESUMEN */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-400">
                    Ventas
                  </p>

                  <p className="mt-1 text-3xl font-black text-white">
                    {resumen.cantidad}
                  </p>

                </div>

                <ReceiptText className="h-8 w-8 text-emerald-400" />

              </div>

            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-400">
                    Ventas válidas
                  </p>

                  <p className="mt-1 text-3xl font-black text-emerald-400">
                    {resumen.cantidadValidas}
                  </p>

                </div>

                <CheckCircle className="h-8 w-8 text-emerald-400" />

              </div>

            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-400">
                    Total vendido
                  </p>

                  <p className="mt-1 text-3xl font-black text-emerald-400">
                    Bs. {resumen.totalVentas.toFixed(2)}
                  </p>

                </div>

                <DollarSign className="h-8 w-8 text-emerald-400" />

              </div>

            </div>

          </div>

          {/* LISTA */}
          {ventasFiltradas.length === 0 ? (

            <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 text-slate-400">
              No hay ventas registradas
            </div>

          ) : (

            <div className="space-y-6">

              {ventasFiltradas.map((venta) => {

                const estadoInfo =
                  getEstadoStyle(
                    venta.estado
                  );

                const EstadoIcon =
                  estadoInfo.icon;

                return (

                  <article
                    key={venta._id}
                    className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950"
                  >

                    {/* CABECERA VENTA */}
                    <div className="flex flex-col gap-4 border-b border-slate-700 p-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/20">

                          <CreditCard className="h-7 w-7 text-emerald-400" />

                        </div>

                        <div>

                          <h3 className="text-xl font-black text-white">
                            Venta{" "}
                            {venta.numeroVenta ||
                              "Sin número"}
                          </h3>

                          <p className="text-sm text-slate-400">
                            Comanda:{" "}
                            <span className="font-bold text-slate-300">
                              {venta.comanda?.numeroComanda ||
                                "Sin comanda"}
                            </span>
                          </p>

                          <p className="text-sm text-slate-500">
                            {formatearFecha(
                              venta.fechaCreacion ||
                              venta.fechaVenta
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

                        {venta.estado !== "anulado" &&
                          venta.estado !== "eliminado" &&
                          venta.estado !== "cortesia" && (

                            <>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCortesiaVenta(
                                    venta._id
                                  )
                                }
                                disabled={
                                  marcandoCortesia
                                }
                                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-500 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-white"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Cortesía
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleAnularVenta(
                                    venta._id
                                  )
                                }
                                disabled={
                                  anulandoVenta
                                }
                                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                Anular
                              </button>

                            </>

                          )}

                      </div>

                    </div>

                    {/* INFO */}
                    <div className="grid gap-4 border-b border-slate-800 p-5 md:grid-cols-3">

                      <div className="rounded-2xl bg-slate-900 p-4">

                        <p className="text-xs text-slate-500">
                          Caja
                        </p>

                        <p className="mt-1 font-black text-white">
                          {venta.caja?.nombre ||
                            venta.caja?.descripcion ||
                            "Sin caja"}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-slate-900 p-4">

                        <p className="text-xs text-slate-500">
                          Método de pago
                        </p>

                        <p className="mt-1 font-black text-white">
                          {formatearMetodoPago(
                            venta.metodoPago
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-slate-900 p-4">

                        <p className="text-xs text-slate-500">
                          Observación
                        </p>

                        <p className="mt-1 font-black text-white">
                          {venta.observacion ||
                            "Sin observación"}
                        </p>

                      </div>

                    </div>

                    {/* DETALLES */}
                    <div className="p-5">

                      {venta.detalles.length === 0 ? (

                        <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-center text-slate-400">
                          Esta venta no tiene detalles registrados
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

                              {venta.detalles.map((detalle) => (

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

                                  <td className="py-4 text-right font-black text-emerald-400">
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
                    <div className="grid gap-4 border-t border-slate-700 bg-slate-900 px-5 py-4 md:grid-cols-3">

                      <div>

                        <p className="text-sm text-slate-400">
                          Subtotal
                        </p>

                        <p className="text-xl font-black text-white">
                          Bs. {Number(venta.subtotal).toFixed(2)}
                        </p>

                      </div>



                      <div className="text-left md:text-right">

                        <p className="text-sm text-slate-400">
                          Total Venta
                        </p>

                        <p className="text-3xl font-black text-emerald-400">
                          Bs. {Number(venta.total).toFixed(2)}
                        </p>

                      </div>

                    </div>

                  </article>

                );

              })}

            </div>

          )}

        </section>

      </main>

    </div>

  );

}