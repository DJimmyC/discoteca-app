import {
  Fragment,
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
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Filter,
  LogOut,
  Pencil,
  Search,
  Trash2,
  Wallet,
  XCircle,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import {
  deleteSolicitudById,
  getSolicitudesBySucursal,
} from "@/api/SolicitudApi";

import {
  aprobarYTransferirSolicitud,
} from "@/api/InventarioApi";

import type {
  SolicitudPorSucursalType,
} from "@/types/SolicitudType";
import type { SucursalType } from "@/types/SucursalType";
import { getSucursalById } from "@/api/SucursalApi";

export default function SolicitudDetailView() {

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

  const [
    estadoFiltro,
    setEstadoFiltro,
  ] = useState("todos");

  const [
    tipoFiltro,
    setTipoFiltro,
  ] = useState("todos");

  const [
    prioridadFiltro,
    setPrioridadFiltro,
  ] = useState("todos");

  const [
    fechaDesde,
    setFechaDesde,
  ] = useState("");

  const [
    fechaHasta,
    setFechaHasta,
  ] = useState("");

  const [
    solicitudExpandida,
    setSolicitudExpandida,
  ] = useState<string | null>(null);

  /* =========================
      DATOS DEL PERFIL
  ========================= */

  const params = useParams()
  const idSucursal = params.sucursalId!

    const  datasucursal = useQuery<SucursalType>({
          queryKey: ['sucursal', idSucursal],
          queryFn: () => getSucursalById(idSucursal),
          retry: false
        })

  /* =========================
      CONSULTAR SOLICITUDES
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "solicitudes-sucursal",
      idSucursal,
    ],

    queryFn: () =>
      getSolicitudesBySucursal(
        idSucursal!
      ),

    enabled:
      !!idSucursal,

  });

  /* =========================
      APROBAR Y TRANSFERIR
  ========================= */

  const {
    mutate: aprobarSolicitud,
    isPending: aprobandoSolicitud,
  } = useMutation({

    mutationFn:
      aprobarYTransferirSolicitud,

    onSuccess:
      async (
        data
      ) => {

        await Swal.fire({

          icon:
            "success",

          title:
            "Solicitud procesada",

          html: `
            <p>${data.message}</p>
            <p style="margin-top:8px">
              <strong>Origen:</strong>
              ${data.almacenOrigen.nombre || "Almacén principal"}
            </p>
            <p>
              <strong>Destino:</strong>
              ${data.almacenDestino.nombre || "Almacén destino"}
            </p>
            <p>
              <strong>Total transferido:</strong>
              ${data.cantidadTotal} unidades
            </p>
          `,

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
              "inventarios-sucursal",
              idSucursal,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "inventario-principal",
              idSucursal,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "movimientos",
            ],
          }),

        ]);

      },

    onError:
      async (
        error
      ) => {

        await Swal.fire({

          icon:
            "error",

          title:
            "No se pudo aprobar y transferir",

          text:
            error instanceof Error
              ? error.message
              : "Error al aprobar la solicitud",

        });

      },

  });

  /* =========================
      ANULAR SOLICITUD
  ========================= */

  const {
    mutate: anularSolicitud,
    isPending: anulandoSolicitud,
  } = useMutation({

    mutationFn:
      deleteSolicitudById,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "solicitudes-sucursal",
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
            : "Error al anular la solicitud",
      });

    },

  });

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

  const getEstadoTexto = (
    estado?: string | null
  ) => {

    if (!estado) return "Pendiente";

    if (estado === "pendiente") return "Pendiente";
    if (estado === "en_revision") return "En revisión";
    if (estado === "aprobada") return "Aprobada";
    if (estado === "rechazada") return "Rechazada";
    if (estado === "en_proceso") return "En proceso";
    if (estado === "en_transito") return "En tránsito";
    if (estado === "atendida") return "Atendida";
    if (estado === "anulada") return "Anulada";

    return estado;

  };

  const getEstadoClass = (
    estado?: string | null
  ) => {

    if (estado === "pendiente") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      estado === "en_revision" ||
      estado === "en_proceso" ||
      estado === "en_transito"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      estado === "aprobada" ||
      estado === "atendida"
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (
      estado === "rechazada" ||
      estado === "anulada"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";

  };

  const getTipoSolicitud = (
    solicitud: SolicitudPorSucursalType
  ) => {

    if (
      solicitud.almacenOrigen &&
      solicitud.almacenDestino
    ) {
      return "Transferencia";
    }

    return "Solicitud";

  };

  const getTipoClass = (
    tipo: string
  ) => {

    if (tipo === "Transferencia") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-purple-100 text-purple-700";

  };

  const getPrioridad = (
    solicitud: SolicitudPorSucursalType
  ) => {

    const estado =
      solicitud.estado;

    if (
      estado === "pendiente"
    ) {
      return "Media";
    }

    if (
      estado === "rechazada" ||
      estado === "anulada"
    ) {
      return "Alta";
    }

    return "Baja";

  };

  const getPrioridadClass = (
    prioridad: string
  ) => {

    if (prioridad === "Alta") {
      return "bg-red-100 text-red-700";
    }

    if (prioridad === "Media") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-emerald-100 text-emerald-700";

  };

  const generarCodigo = (
    index: number
  ) => {

    return `SOL-${String(
      index + 1
    ).padStart(4, "0")}`;

  };

  const toggleExpandir = (
    id?: string
  ) => {

    if (!id) return;

    setSolicitudExpandida(
      solicitudExpandida === id
        ? null
        : id
    );

  };

  const handleAprobarSolicitud =
    async (
      solicitud:
        SolicitudPorSucursalType
    ) => {

      if (!solicitud._id) {
        return;
      }

      const confirmacion =
        await Swal.fire({

          icon:
            "warning",

          title:
            "¿Aprobar y transferir?",

          html: `
            <p>Se descontará stock del almacén principal.</p>
            <p>Se sumará al almacén destino y se registrarán los movimientos.</p>
          `,

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, aprobar y transferir",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#16a34a",

        });

      if (
        !confirmacion.isConfirmed
      ) {
        return;
      }

      aprobarSolicitud({

        idSolicitud:
          solicitud._id,

        actualizadoPor:
          perfil?.nombres ||
          "sistema",

      });

    };

  const handleAnularSolicitud = (
    id?: string
  ) => {

    if (!id) {
      return;
    }

    anularSolicitud({

      id,

      eliminadoPor:
        perfil?.nombres || "sistema",

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

  /* =========================
      FILTROS
  ========================= */

  const solicitudesFiltradas = useMemo(() => {

    const solicitudes =
      data?.solicitudes || [];

    return solicitudes.filter((solicitud) => {

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
            `
              ${detalle.producto?.nombre || ""}
              ${detalle.producto?.marca || ""}
              ${detalle.producto?.descripcion || ""}
              ${detalle.observacion || ""}
              ${detalle.unidad || ""}
            `
          )
          .join(" ") || "";

      const texto = `
        ${solicitud._id || ""}
        ${tipo}
        ${solicitud.almacenOrigen?.nombre || ""}
        ${solicitud.almacenDestino?.nombre || ""}
        ${solicitud.perfil?.nombres || ""}
        ${solicitud.perfil?.apellidos || ""}
        ${solicitud.estado || ""}
        ${solicitud.observacion || ""}
        ${detallesTexto}
      `.toLowerCase();

      const coincideBusqueda =
        texto.includes(
          search.trim().toLowerCase()
        );

      const coincideEstado =
        estadoFiltro === "todos" ||
        solicitud.estado === estadoFiltro;

      const coincideTipo =
        tipoFiltro === "todos" ||
        tipo.toLowerCase() ===
          tipoFiltro.toLowerCase();

      const coincidePrioridad =
        prioridadFiltro === "todos" ||
        prioridad.toLowerCase() ===
          prioridadFiltro.toLowerCase();

      let coincideFecha = true;

      if (
        fechaDesde &&
        solicitud.fechaCreacion
      ) {
        coincideFecha =
          new Date(solicitud.fechaCreacion) >=
          new Date(fechaDesde);
      }

      if (
        fechaHasta &&
        solicitud.fechaCreacion
      ) {
        coincideFecha =
          coincideFecha &&
          new Date(solicitud.fechaCreacion) <=
            new Date(fechaHasta);
      }

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideTipo &&
        coincidePrioridad &&
        coincideFecha
      );

    });

  }, [
    data,
    search,
    estadoFiltro,
    tipoFiltro,
    prioridadFiltro,
    fechaDesde,
    fechaHasta,
  ]);

  /* =========================
      CERRAR SESIÓN
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
          Cargando solicitudes...
        </p>
      </div>
    );

  }

  if (isError) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold text-red-500">
          Error al cargar solicitudes
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

          {/* HEADER */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <h1 className="text-4xl font-black text-slate-900">
                  Solicitudes.{" "}
                  {datasucursal.data?.nombreSucursal!}
                </h1>

                <p className="mt-2 text-slate-500">
                  Gestión y control de solicitudes de productos
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/sucursal/${idSucursal}/solicitud/create`
                  )
                }
                title="Nueva solicitud"
                aria-label="Nueva solicitud"
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-3xl font-black text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-700"
              >
                +
              </button>

            </div>

          </section>

          {/* FILTROS */}
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Estado
                </label>

                <select
                  value={estadoFiltro}
                  onChange={(e) =>
                    setEstadoFiltro(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-purple-400"
                >
                  <option value="todos">
                    Todos
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
                  <option value="atendida">
                    Atendida
                  </option>
                  <option value="anulada">
                    Anulada
                  </option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Tipo
                </label>

                <select
                  value={tipoFiltro}
                  onChange={(e) =>
                    setTipoFiltro(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-purple-400"
                >
                  <option value="todos">
                    Todos
                  </option>
                  <option value="transferencia">
                    Transferencia
                  </option>
                  <option value="solicitud">
                    Solicitud
                  </option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Prioridad
                </label>

                <select
                  value={prioridadFiltro}
                  onChange={(e) =>
                    setPrioridadFiltro(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-purple-400"
                >
                  <option value="todos">
                    Todos
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

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Fecha desde
                </label>

                <div className="relative">

                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) =>
                      setFechaDesde(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-12 text-slate-700 outline-none focus:border-purple-400"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Fecha hasta
                </label>

                <div className="relative">

                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) =>
                      setFechaHasta(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-12 text-slate-700 outline-none focus:border-purple-400"
                  />

                </div>

              </div>

              <div className="flex items-end">

                <button
                  type="button"
                  onClick={limpiarFiltros}
                  title="Limpiar filtros"
                  aria-label="Limpiar filtros"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
                >
                  <Filter className="h-5 w-5" />
                </button>

              </div>

            </div>

          </section>

          {/* TABLA */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <div className="relative max-w-md">

                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Buscar solicitud..."
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                />

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead className="bg-slate-50">

                  <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-500">

                    <th className="w-14 px-6 py-5" />
                    <th className="px-6 py-5">Código</th>
                    <th className="px-6 py-5">Tipo</th>
                    <th className="px-6 py-5">Origen</th>
                    <th className="px-6 py-5">Destino</th>
                    <th className="px-6 py-5">Solicitado por</th>
                    <th className="px-6 py-5">Estado</th>
                    <th className="px-6 py-5">Fecha</th>
                    <th className="px-6 py-5 text-center">Acciones</th>

                  </tr>

                </thead>

                <tbody>

                  {solicitudesFiltradas.length === 0 ? (

                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-16 text-center text-slate-500"
                      >
                        No hay solicitudes registradas
                      </td>
                    </tr>

                  ) : (

                    solicitudesFiltradas.map((solicitud, index) => {

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
                        solicitud.detalles || [];

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

                        <Fragment key={solicitud._id || index}>

                          <tr className="border-b border-slate-100 text-sm">

                            <td className="px-6 py-5">

                              <button
                                type="button"
                                onClick={() =>
                                  toggleExpandir(
                                    solicitud._id
                                  )
                                }
                                title="Expandir"
                                aria-label="Expandir"
                                className="rounded-xl p-2 text-slate-500 transition hover:bg-purple-100 hover:text-purple-600"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5" />
                                ) : (
                                  <ChevronRight className="h-5 w-5" />
                                )}
                              </button>

                            </td>

                            <td className="px-6 py-5 font-bold text-slate-700">
                              {codigo}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`
                                  rounded-full
                                  px-3
                                  py-1
                                  text-xs
                                  font-black
                                  ${getTipoClass(tipo)}
                                `}
                              >
                                {tipo}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-slate-700">
                              {solicitud.almacenOrigen?.nombre ||
                                "Compra externa"}
                            </td>

                            <td className="px-6 py-5 text-slate-700">
                              {solicitud.almacenDestino?.nombre ||
                                "Sin destino"}
                            </td>

                            <td className="px-6 py-5 text-slate-700">
                              {solicitud.perfil?.nombres ||
                                solicitud.creadoPor ||
                                "Sin usuario"}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`
                                  rounded-full
                                  px-3
                                  py-1
                                  text-xs
                                  font-black
                                  ${getEstadoClass(
                                    solicitud.estado
                                  )}
                                `}
                              >
                                {getEstadoTexto(
                                  solicitud.estado
                                )}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-slate-700">
                              {formatearFecha(
                                solicitud.fechaCreacion ||
                                solicitud.fechaSolicitud
                              )}
                            </td>

                            <td className="px-6 py-5">

                              <div className="flex items-center justify-center gap-2">

                                {/* VER */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/sucursal/${idSucursal}/solicitudes/${solicitud._id}`
                                    )
                                  }
                                  title="Ver"
                                  aria-label="Ver"
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200"
                                >
                                  <Eye className="h-5 w-5" />
                                </button>

                                {/* APROBAR */}
                                {puedeAprobar && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAprobarSolicitud(
                                        solicitud
                                      )
                                    }
                                    disabled={aprobandoSolicitud}
                                    title="Aprobar"
                                    aria-label="Aprobar"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                  >
                                    <CheckCircle className="h-5 w-5" />
                                  </button>

                                )}

                                {/* EDITAR */}
                                {puedeEditar && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate(
                                        `/sucursal/${idSucursal}/solicitud/${solicitud._id}/edit`
                                      )
                                    }
                                    title="Editar"
                                    aria-label="Editar"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                  >
                                    <Pencil className="h-5 w-5" />
                                  </button>

                                )}

                                {/* ANULAR */}
                                {puedeAnular && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAnularSolicitud(
                                        solicitud._id
                                      )
                                    }
                                    disabled={anulandoSolicitud}
                                    title="Anular"
                                    aria-label="Anular"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                  >
                                    <XCircle className="h-5 w-5" />
                                  </button>

                                )}

                              </div>

                            </td>

                          </tr>

                          {isExpanded && (

                            <tr className="border-b border-slate-100 bg-purple-50/40">

                              <td
                                colSpan={9}
                                className="px-8 py-6"
                              >

                                <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

                                  {/* DETALLE PRODUCTOS */}
                                  <div className="rounded-3xl border border-slate-200 bg-white p-5">

                                    <h3 className="mb-4 text-sm font-black uppercase text-slate-500">
                                      Detalle de productos
                                    </h3>

                                    {detalles.length === 0 ? (

                                      <p className="py-8 text-center text-slate-500">
                                        Esta solicitud no tiene detalles registrados
                                      </p>

                                    ) : (

                                      <div className="overflow-x-auto">

                                        <table className="w-full border-collapse">

                                          <thead>

                                            <tr className="border-b border-slate-200 text-left text-xs font-black uppercase text-slate-500">
                                              <th className="py-3">Producto</th>
                                              <th className="py-3">Cantidad solicitada</th>
                                              <th className="py-3">Cantidad aprobada</th>
                                              <th className="py-3">Unidad</th>
                                            </tr>

                                          </thead>

                                          <tbody>

                                            {detalles.map((detalle) => (

                                              <tr
                                                key={detalle._id}
                                                className="border-b border-slate-100 text-sm"
                                              >

                                                <td className="py-3 font-bold text-slate-700">
                                                  {detalle.producto?.nombre ||
                                                    "Producto sin nombre"}
                                                </td>

                                                <td className="py-3 text-slate-700">
                                                  {detalle.cantidadSolicitada}
                                                </td>

                                                <td className="py-3 text-slate-700">
                                                  {detalle.cantidadAprobada ??
                                                    detalle.cantidadSolicitada}
                                                </td>

                                                <td className="py-3 text-slate-700">
                                                  {detalle.unidad ||
                                                    "unidades"}
                                                </td>

                                              </tr>

                                            ))}

                                          </tbody>

                                        </table>

                                      </div>

                                    )}

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm font-bold text-slate-600">

                                      <span>
                                        Total de productos:{" "}
                                        {solicitud.totalProductos ??
                                          detalles.length}
                                      </span>

                                      <span>
                                        Total solicitado:{" "}
                                        {solicitud.totalSolicitado ??
                                          detalles.reduce(
                                            (acc, detalle) =>
                                              acc +
                                              Number(
                                                detalle.cantidadSolicitada || 0
                                              ),
                                            0
                                          )}
                                      </span>

                                      <span>
                                        Total aprobado:{" "}
                                        <span className="text-emerald-600">
                                          {solicitud.totalAprobado ??
                                            detalles.reduce(
                                              (acc, detalle) =>
                                                acc +
                                                Number(
                                                  detalle.cantidadAprobada ??
                                                    detalle.cantidadSolicitada ??
                                                    0
                                                ),
                                              0
                                            )}
                                        </span>
                                      </span>

                                    </div>

                                  </div>

                                  {/* INFO ADICIONAL */}
                                  <div className="rounded-3xl border border-slate-200 bg-white p-5">

                                    <h3 className="mb-4 text-sm font-black uppercase text-slate-500">
                                      Información adicional
                                    </h3>

                                    <div className="space-y-4 text-sm">

                                      <div className="grid grid-cols-[140px_1fr] gap-3">
                                        <span className="font-bold text-slate-500">
                                          Prioridad:
                                        </span>
                                        <span
                                          className={`
                                            w-fit
                                            rounded-full
                                            px-3
                                            py-1
                                            text-xs
                                            font-black
                                            ${getPrioridadClass(
                                              prioridad
                                            )}
                                          `}
                                        >
                                          {prioridad}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-[140px_1fr] gap-3">
                                        <span className="font-bold text-slate-500">
                                          Fecha solicitada:
                                        </span>
                                        <span className="text-slate-700">
                                          {formatearFecha(
                                            solicitud.fechaSolicitud ||
                                              solicitud.fechaCreacion
                                          )}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-[140px_1fr] gap-3">
                                        <span className="font-bold text-slate-500">
                                          Origen:
                                        </span>
                                        <span className="text-slate-700">
                                          {solicitud.almacenOrigen?.nombre ||
                                            "Compra externa"}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-[140px_1fr] gap-3">
                                        <span className="font-bold text-slate-500">
                                          Destino:
                                        </span>
                                        <span className="text-slate-700">
                                          {solicitud.almacenDestino?.nombre ||
                                            "Sin destino"}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-[140px_1fr] gap-3">
                                        <span className="font-bold text-slate-500">
                                          Notas:
                                        </span>
                                        <span className="text-slate-700">
                                          {solicitud.observacion ||
                                            "Sin observaciones"}
                                        </span>
                                      </div>

                                    </div>

                                  </div>

                                </div>

                              </td>

                            </tr>

                          )}

                        </Fragment>

                      );

                    })

                  )}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

              <p className="text-sm text-slate-500">
                Mostrando 1 a{" "}
                {solicitudesFiltradas.length} de{" "}
                {solicitudesFiltradas.length} solicitudes
              </p>

              <div className="flex items-center gap-2">

                <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-500 hover:bg-slate-50">
                  ‹
                </button>

                <button className="rounded-xl bg-purple-600 px-4 py-2 font-black text-white">
                  1
                </button>

                <button className="rounded-xl border border-slate-200 px-4 py-2 text-slate-500 hover:bg-slate-50">
                  ›
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>

  );

}