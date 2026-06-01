// src/views/egreso/EgresoDetailView.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Banknote,
  CheckCircle,
  ClipboardList,
  DollarSign,
  Eye,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  Wallet,
  XCircle,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import {
  deleteEgresoById,
  getEgresosConDetallesPorSucursal,
} from "@/api/EgresoApi";

export default function EgresoDetailView() {

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
      ID SUCURSAL DESDE AUTH
  ========================= */

  const params = useParams()
  const idSucursal = params.sucursalId!
  

  /* =========================
      GET EGRESOS CON DETALLES
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "egresos-con-detalles",
      idSucursal,
    ],

    queryFn: () =>
      getEgresosConDetallesPorSucursal(
        idSucursal!
      ),

    enabled:
      !!idSucursal,

  });

  /* =========================
      ANULAR EGRESO
  ========================= */

  const {
    mutate: anularEgreso,
    isPending: anulandoEgreso,
  } = useMutation({

    mutationFn:
      deleteEgresoById,

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Egreso anulado",
        text: "El egreso fue anulado correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "egresos-con-detalles",
          idSucursal,
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
            : "Error al anular el egreso",
      });

    },

  });

  /* =========================
      HANDLE ANULAR
  ========================= */

  const handleAnularEgreso = async (
    egresoId?: string
  ) => {

    if (!egresoId) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el ID del egreso",
      });

      return;

    }

    const result =
      await Swal.fire({
        icon: "warning",
        title: "¿Anular egreso?",
        text: "Esta acción cambiará el estado del egreso a anulado.",
        showCancelButton: true,
        confirmButtonText: "Sí, anular",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc2626",
      });

    if (!result.isConfirmed) {
      return;
    }

    anularEgreso({

      id:
        egresoId,

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
    metodo?: string | null
  ) => {

    if (!metodo) {
      return "Sin método";
    }

    if (metodo === "efectivo") return "Efectivo";
    if (metodo === "qr") return "QR";
    if (metodo === "tarjeta") return "Tarjeta";
    if (metodo === "transferencia") return "Transferencia";
    if (metodo === "mixto") return "Mixto";

    return metodo;

  };

  const formatearTipoEgreso = (
    tipo?: string | null
  ) => {

    if (!tipo) {
      return "Sin tipo";
    }

    if (tipo === "compra") return "Compra";
    if (tipo === "servicio") return "Servicio";
    if (tipo === "mantenimiento") return "Mantenimiento";
    if (tipo === "otro") return "Otro";

    return tipo;

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
          "bg-red-100 text-red-600 border-red-200",
        icon: XCircle,
      };
    }

    if (
      estado === "activo" ||
      estado === "registrado" ||
      estado === "cerrado"
    ) {
      return {
        texto: estado,
        className:
          "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      };
    }

    return {
      texto: estado || "Registrado",
      className:
        "bg-blue-100 text-blue-700 border-blue-200",
      icon: ReceiptText,
    };

  };

  /* =========================
      BUSCADOR
  ========================= */

  const egresosFiltrados = useMemo(() => {

    const egresos =
      data?.egresos || [];

    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return egresos;
    }

    return egresos.filter((egreso) => {

      const detallesTexto =
        egreso.detalles
          .map((detalle) =>
            `
              ${detalle.producto?.nombre || ""}
              ${detalle.producto?.marca || ""}
              ${detalle.producto?.descripcion || ""}
              ${detalle.almacen?.nombre || ""}
              ${detalle.almacen?.tipo || ""}
              ${detalle.descripcion || ""}
              ${detalle.tipoItem || ""}
            `
          )
          .join(" ");

      const texto = `
        ${egreso.numeroEgreso || ""}
        ${egreso.tipoEgreso || ""}
        ${egreso.metodoPago || ""}
        ${egreso.estado || ""}
        ${egreso.observacion || ""}
        ${egreso.total || ""}
        ${egreso.caja?.nombre || ""}
        ${egreso.caja?.descripcion || ""}
        ${egreso.perfil?.nombres || ""}
        ${detallesTexto}
      `.toLowerCase();

      return texto.includes(
        searchValue
      );

    });

  }, [data, search]);

  /* =========================
      RESUMEN
  ========================= */

  const resumen = useMemo(() => {

    const egresos =
      data?.egresos || [];

    const egresosValidos =
      egresos.filter(
        (egreso) =>
          egreso.estado !== "anulado" &&
          egreso.estado !== "eliminado"
      );

    const totalEgresos =
      egresosValidos.reduce(
        (acc, egreso) =>
          acc + Number(egreso.total || 0),
        0
      );

    const totalDetalles =
      egresosValidos.reduce(
        (acc, egreso) =>
          acc + Number(egreso.totalDetalles || 0),
        0
      );

    return {
      cantidad:
        egresos.length,

      cantidadValidos:
        egresosValidos.length,

      totalEgresos,

      totalDetalles,
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold">
          Cargando egresos...
        </p>
      </div>
    );

  }

  /* =========================
      ERROR
  ========================= */

  if (isError) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold text-red-500">
          Error al cargar egresos
        </p>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900">


      {/* SIDEBAR */}
      <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 border-r border-slate-200 bg-white">
        <MenuList />
      </aside>

      {/* MAIN */}
      <main className="ml-72 pt-20">

        <div className="p-8">

          {/* CARD PRINCIPAL */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* CABECERA */}
            <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">

                  <ClipboardList className="h-4 w-4" />

                  <span>
                    {data?.sucursal?.nombreSucursal ||
                      "Sucursal"}
                  </span>

                  <span>/</span>

                  <span className="font-bold text-red-500">
                    Egresos
                  </span>

                </div>

                <h2 className="text-4xl font-black text-slate-900">
                  Egresos Registrados
                </h2>

                <p className="mt-2 text-slate-500">
                  Gestión de salidas de dinero y gastos de la sucursal
                </p>

              </div>

              <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">

                {/* BOTÓN CREAR */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/sucursal/${idSucursal}/egreso/create`
                    )
                  }
                  title="Crear egreso"
                  aria-label="Crear egreso"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
                >
                  <Plus className="h-6 w-6" />
                </button>

                {/* BUSCADOR */}
                <div className="relative w-full md:w-96">

                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Buscar egreso..."
                    className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
                  />

                </div>

              </div>

            </div>

            {/* RESUMEN */}
            <div className="mb-8 grid gap-5 md:grid-cols-3">

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold uppercase text-slate-500">
                      Egresos
                    </p>

                    <p className="mt-2 text-4xl font-black text-slate-900">
                      {resumen.cantidad}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-red-100 p-4 text-red-500">

                    <ReceiptText className="h-8 w-8" />

                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold uppercase text-slate-500">
                      Egresos válidos
                    </p>

                    <p className="mt-2 text-4xl font-black text-emerald-600">
                      {resumen.cantidadValidos}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-emerald-100 p-4 text-emerald-600">

                    <CheckCircle className="h-8 w-8" />

                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold uppercase text-slate-500">
                      Total egresos
                    </p>

                    <p className="mt-2 text-4xl font-black text-red-500">
                      Bs. {resumen.totalEgresos.toFixed(2)}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-red-100 p-4 text-red-500">

                    <DollarSign className="h-8 w-8" />

                  </div>

                </div>

              </div>

            </div>

            {/* LISTA */}
            {egresosFiltrados.length === 0 ? (

              <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-slate-500">
                No hay egresos registrados
              </div>

            ) : (

              <div className="space-y-6">

                {egresosFiltrados.map((egreso) => {

                  const estadoInfo =
                    getEstadoStyle(
                      egreso.estado
                    );

                  const EstadoIcon =
                    estadoInfo.icon;

                  return (

                    <article
                      key={egreso._id}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >

                      {/* CABECERA EGRESO */}
                      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-6 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-start gap-4">

                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500">

                            <Banknote className="h-8 w-8" />

                          </div>

                          <div>

                            <h3 className="text-2xl font-black text-slate-900">
                              Egreso{" "}
                              {egreso.numeroEgreso ||
                                "Sin número"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Tipo:{" "}
                              <span className="font-bold text-slate-700">
                                {formatearTipoEgreso(
                                  egreso.tipoEgreso
                                )}
                              </span>
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              {formatearFecha(
                                egreso.fechaCreacion ||
                                egreso.fechaEgreso
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

                          {/* ACCIONES */}
                          <div className="flex items-center gap-2">

                            {/* VER */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/sucursal/${idSucursal}/egresos/${egreso._id}`
                                )
                              }
                              title="Ver egreso"
                              aria-label="Ver egreso"
                              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition hover:bg-blue-200"
                            >
                              <Eye className="h-5 w-5" />
                            </button>

                          
                               <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/sucursal/${idSucursal}/egreso/${egreso._id}/edit`
                                    )
                                  }
                                  title="Editar egreso"
                                  aria-label="Editar egreso"
                                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 transition hover:bg-yellow-200"
                                >
                                  <Pencil className="h-5 w-5" />
                                </button>

                            {/* ELIMINAR / ANULAR */}
                            {egreso.estado !== "anulado" &&
                              egreso.estado !== "eliminado" && (

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
                                  aria-label="Anular egreso"
                                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>

                              )}

                          </div>

                        </div>

                      </div>

                      {/* INFO */}
                      <div className="grid gap-4 border-b border-slate-200 p-6 md:grid-cols-4">

                        <div className="rounded-2xl bg-slate-50 p-4">

                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Caja
                          </p>

                          <p className="mt-1 font-black text-slate-900">
                            {egreso.caja?.nombre ||
                              egreso.caja?.descripcion ||
                              "Sin caja"}
                          </p>

                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">

                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Método de pago
                          </p>

                          <p className="mt-1 font-black text-slate-900">
                            {formatearMetodoPago(
                              egreso.metodoPago
                            )}
                          </p>

                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">

                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Registrado por
                          </p>

                          <p className="mt-1 font-black text-slate-900">
                            {egreso.perfil?.nombres ||
                              egreso.creadoPor ||
                              "Sin usuario"}
                          </p>

                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">

                          <p className="text-xs font-semibold uppercase text-slate-400">
                            Observación
                          </p>

                          <p className="mt-1 font-black text-slate-900">
                            {egreso.observacion ||
                              "Sin observación"}
                          </p>

                        </div>

                      </div>

                      {/* DETALLES */}
                      <div className="p-6">

                        {egreso.detalles.length === 0 ? (

                          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-slate-500">
                            Este egreso no tiene detalles registrados
                          </div>

                        ) : (

                          <div className="overflow-x-auto">

                            <table className="w-full border-collapse">

                              <thead>

                                <tr className="border-b border-slate-200 text-left text-sm uppercase text-slate-500">

                                  <th className="pb-4">
                                    Ítem
                                  </th>

                                  <th className="pb-4">
                                    Almacén
                                  </th>

                                  <th className="pb-4">
                                    Cantidad
                                  </th>

                                  <th className="pb-4">
                                    Costo
                                  </th>

                                  <th className="pb-4 text-right">
                                    Subtotal
                                  </th>

                                </tr>

                              </thead>

                              <tbody>

                                {egreso.detalles.map((detalle) => (

                                  <tr
                                    key={detalle._id}
                                    className="border-b border-slate-100 text-sm"
                                  >

                                    <td className="py-5">

                                      <div className="flex items-start gap-3">

                                        <div className="rounded-xl bg-red-100 p-3 text-red-500">

                                          <Package className="h-5 w-5" />

                                        </div>

                                        <div>

                                          <p className="font-black text-slate-900">
                                            {detalle.producto?.nombre ||
                                              detalle.descripcion ||
                                              "Ítem sin nombre"}
                                          </p>

                                          <p className="text-xs text-slate-500">
                                            {detalle.producto?.marca ||
                                              detalle.tipoItem ||
                                              "Sin tipo"}
                                          </p>

                                        </div>

                                      </div>

                                    </td>

                                    <td className="py-5 font-bold text-slate-700">
                                      {detalle.almacen?.nombre ||
                                        "Sin almacén"}
                                    </td>

                                    <td className="py-5 font-bold text-slate-700">
                                      {detalle.cantidad}
                                    </td>

                                    <td className="py-5 font-bold text-slate-700">
                                      Bs.{" "}
                                      {Number(
                                        detalle.costoUnitario
                                      ).toFixed(2)}
                                    </td>

                                    <td className="py-5 text-right font-black text-red-500">
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
                      <div className="grid gap-4 border-t border-slate-200 bg-slate-50 px-6 py-5 md:grid-cols-2">

                        <div>

                          <p className="text-sm text-slate-500">
                            Total Detalles
                          </p>

                          <p className="text-2xl font-black text-slate-900">
                            Bs.{" "}
                            {Number(
                              egreso.totalDetalles || 0
                            ).toFixed(2)}
                          </p>

                        </div>

                        <div className="text-left md:text-right">

                          <p className="text-sm text-slate-500">
                            Total Egreso
                          </p>

                          <p className="text-4xl font-black text-red-500">
                            Bs. {Number(egreso.totalDetalles).toFixed(2)}
                          </p>

                        </div>__

                      </div>

                    </article>

                  );

                })}

              </div>

            )}

          </section>

        </div>

      </main>

    </div>

  );

}