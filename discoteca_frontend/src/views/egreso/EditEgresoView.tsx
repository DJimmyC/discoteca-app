// src/views/egreso/EditEgresoView.tsx

import {
  useEffect,
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
  ArrowLeft,
  ClipboardList,
  LogOut,
  Search,
  Wallet,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

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
  getEgresosConDetallesPorSucursal,
  updateEgreso,
} from "@/api/EgresoApi";

import {
  createManyDetalleEgreso,
  deleteDetalleEgresoById,
  updateDetalleEgreso,
} from "@/api/DetalleEgresoApi";

export default function EditEgresoView() {

  const navigate = useNavigate();

  const params = useParams();

  const queryClient = useQueryClient();

  const egresoId = params.egresoId ;

  const {
    data: perfil,
    isLoading: loadingAuth,
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
  ] = useState<DetalleEgresoItem[]>([]);

  const [
    detallesEliminados,
    setDetallesEliminados,
  ] = useState<string[]>([]);

  const [
    inicializado,
    setInicializado,
  ] = useState(false);

  /* =========================
      IDS DESDE AUTH
  ========================= */

  
  const idPerfil =
    perfil?._id;

  const idSucursal = params.sucursalId!

  const nombreSucursal =
    typeof perfil?.idSucursal === "object"
      ? perfil.idSucursal?.nombreSucursal
      : "Sucursal";

  /* =========================
      EGRESOS CON DETALLES
  ========================= */

  const {
    data: dataEgresos,
    isLoading: loadingEgresos,
    isError: errorEgresos,
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

  console.log(dataEgresos,"asd")
  const egresoSeleccionado =
    dataEgresos?.egresos.find(
      (egreso) =>
        egreso._id === egresoId
    );

  /* =========================
      CAJAS POR SUCURSAL
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
      ALMACENES POR SUCURSAL
  ========================= */

  const {
    data: dataAlmacenes,
    isLoading: loadingAlmacenes,
    isError: errorAlmacenes,
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
      !!idSucursal,

  });

  const almacenes =
    dataAlmacenes?.almacenes || [];

  /* =========================
      PRODUCTOS
  ========================= */

  const {
    data: productos = [],
    isLoading: loadingProductos,
    isError: errorProductos,
  } = useQuery({

    queryKey: [
      "productos",
    ],

    queryFn:
      getProductos,

  });

  const productosValidos =
    productos || [];

  /* =========================
      INICIALIZAR FORMULARIO
  ========================= */

  useEffect(() => {

    if (
      !egresoSeleccionado ||
      inicializado
    ) {
      return;
    }

    setIdCaja(
      egresoSeleccionado.caja?._id || ""
    );

    setTipoEgreso(
      egresoSeleccionado.tipoEgreso || "compra"
    );

    setMetodoPago(
      egresoSeleccionado.metodoPago || "efectivo"
    );

    setObservacion(
      egresoSeleccionado.observacion || ""
    );

    const detallesIniciales =
      egresoSeleccionado.detalles.map(
        (detalle) => ({

          idDetalle:
            detalle._id,

          idProducto:
            detalle.producto?._id || null,

          idAlmacen:
            detalle.almacen?._id || "",

          descripcion:
            detalle.descripcion ||
            detalle.producto?.nombre ||
            "",

          cantidad:
            detalle.cantidad,

          costoUnitario:
            detalle.costoUnitario,

          tipoItem:
            detalle.tipoItem || "otro",

          esNuevo:
            false,

        })
      );

    setDetalles(
      detallesIniciales
    );

    setInicializado(
      true
    );

  }, [
    egresoSeleccionado,
    inicializado,
  ]);

 

  useEffect(() => {

    if (
      !egresoSeleccionado ||
      !inicializado
    ) {
      return;
    }

    const idsOriginales =
      egresoSeleccionado.detalles
        .map((detalle) => detalle._id)
        .filter(Boolean) as string[];

    const idsActuales =
      detalles
        .map((detalle) => detalle.idDetalle)
        .filter(Boolean) as string[];

    const eliminados =
      idsOriginales.filter(
        (idOriginal) =>
          !idsActuales.includes(
            idOriginal
          )
      );

    setDetallesEliminados(
      eliminados
    );

  }, [
    detalles,
    egresoSeleccionado,
    inicializado,
  ]);

  /* =========================
      TOTAL
  ========================= */

  const total = useMemo(() => {

    return detalles.reduce(
      (acc, detalle) =>
        acc +
        Number(detalle.cantidad || 0) *
        Number(detalle.costoUnitario || 0),
      0
    );

  }, [detalles]);

  /* =========================
      ACTUALIZAR EGRESO
  ========================= */

  const {
    mutate: guardarCambios,
    isPending,
  } = useMutation({

    mutationFn: async () => {

      if (!egresoId) {
        throw new Error(
          "No se encontró el ID del egreso"
        );
      }

      if (!idSucursal) {
        throw new Error(
          "No se encontró la sucursal del usuario"
        );
      }

      if (!idPerfil) {
        throw new Error(
          "No se encontró el perfil del usuario"
        );
      }

      if (!idCaja) {
        throw new Error(
          "Debe seleccionar una caja"
        );
      }

      const detallesValidos =
        detalles.filter(
          (detalle) =>
            detalle.idAlmacen &&
            detalle.descripcion.trim() !== "" &&
            Number(detalle.cantidad) > 0 &&
            Number(detalle.costoUnitario) >= 0
        );

      if (detallesValidos.length === 0) {
        throw new Error(
          "Debe agregar al menos un detalle válido con almacén seleccionado"
        );
      }

      /*
        1. Actualizar cabecera del egreso
      */
      await updateEgreso({

        egresoId,

        formData: {

          idCaja,

          idPerfil,

          idSucursal,

          tipoEgreso,

          metodoPago,

          total,

          observacion:
            observacion || "Sin observación",

          actualizadoPor:
            perfil?.nombres || "sistema",

        },

      });

      /*
        2. Eliminar lógicamente detalles quitados
      */
      await Promise.all(
        detallesEliminados.map(
          (idDetalle) =>
            deleteDetalleEgresoById({

              id:
                idDetalle,

              eliminadoPor:
                perfil?.nombres || "sistema",

            })
        )
      );

      /*
        3. Actualizar detalles existentes
      */
      const detallesExistentes =
        detallesValidos.filter(
          (detalle) =>
            detalle.idDetalle
        );

      await Promise.all(
        detallesExistentes.map(
          (detalle) =>
            updateDetalleEgreso({

              detalleEgresoId:
                detalle.idDetalle!,

              formData: {

                idEgreso:
                  egresoId,

                idProducto:
                  detalle.idProducto || null,

                idAlmacen:
                  detalle.idAlmacen,

                descripcion:
                  detalle.descripcion,

                cantidad:
                  Number(detalle.cantidad),

                costoUnitario:
                  Number(detalle.costoUnitario),

                subtotal:
                  Number(detalle.cantidad) *
                  Number(detalle.costoUnitario),

                tipoItem:
                  detalle.tipoItem,

                actualizadoPor:
                  perfil?.nombres || "sistema",

              },

            })
        )
      );

      /*
        4. Crear detalles nuevos
      */
      const detallesNuevos =
        detallesValidos.filter(
          (detalle) =>
            !detalle.idDetalle
        );

      const detallesPayload =
        detallesNuevos.map(
          (detalle) => ({

            idEgreso:
              egresoId,

            idProducto:
              detalle.idProducto || null,

            idAlmacen:
              detalle.idAlmacen,

            descripcion:
              detalle.descripcion,

            cantidad:
              Number(detalle.cantidad),

            costoUnitario:
              Number(detalle.costoUnitario),

            subtotal:
              Number(detalle.cantidad) *
              Number(detalle.costoUnitario),

            tipoItem:
              detalle.tipoItem,

            creadoPor:
              perfil?.nombres || "sistema",

          })
        );

      if (detallesPayload.length > 0) {
        await createManyDetalleEgreso(
          detallesPayload
        );
      }

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Egreso actualizado",
        text: "El egreso y sus detalles fueron actualizados correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "egresos-con-detalles",
          idSucursal,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "almacenes-sucursal",
          idSucursal,
        ],
      });

      navigate(-1);

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al actualizar el egreso",
      });

    },

  });

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
    loadingEgresos ||
    loadingCajas ||
    loadingAlmacenes ||
    loadingProductos
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold">
          Cargando edición de egreso...
        </p>
      </div>
    );

  }

  /* =========================
      ERROR
  ========================= */

  if (
    errorEgresos ||
    errorCajas ||
    errorAlmacenes ||
    errorProductos
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold text-red-500">
          Error al cargar datos del egreso
        </p>
      </div>
    );

  }

  if (!egresoSeleccionado) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">

        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-2xl font-black text-red-500">
            Egreso no encontrado
          </h2>

          <p className="mt-2 text-slate-500">
            No se encontró el egreso solicitado.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mt-6 rounded-2xl bg-red-500 px-6 py-3 font-black text-white hover:bg-red-600"
          >
            Volver
          </button>

        </div>

      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* TOP BAR */}
      <header className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-[#4b4f58] px-6 text-white shadow-md">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
            <Wallet className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-black">
            Discoteca Manager
          </h1>

        </div>

        <div className="hidden w-[520px] items-center rounded-xl bg-slate-800 px-4 py-3 md:flex">

          <Search className="mr-3 h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
          />

        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3">

          <div className="h-10 w-10 rounded-full bg-red-500" />

          <span className="hidden text-sm font-bold md:block">
            {perfil?.nombres || "Usuario"}
          </span>

          <button
            type="button"
            onClick={cerrarSesion}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="rounded-xl bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
          </button>

        </div>

      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 border-r border-slate-200 bg-white">
        <MenuList />
      </aside>

      {/* MAIN */}
      <main className="ml-72 pt-20">

        <div className="p-8">

          {/* HEADER CARD */}
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">

                  <ClipboardList className="h-4 w-4" />

                  <span>
                    {nombreSucursal || "Sucursal"}
                  </span>

                  <span>/</span>

                  <span className="font-bold text-red-500">
                    Editar Egreso
                  </span>

                </div>

                <h1 className="text-4xl font-black text-slate-900">
                  Editar Egreso
                </h1>

                <p className="mt-2 text-slate-500">
                  Modifica los datos principales y detalles del egreso.
                </p>

                <p className="mt-2 text-sm font-bold text-slate-400">
                  N° {egresoSeleccionado.numeroEgreso || "Sin número"}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                title="Volver"
                aria-label="Volver"
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>

            </div>

          </section>

          <EgresoForm
            cajas={cajas}
            almacenes={almacenes}
            productos={productosValidos}
            idCaja={idCaja}
            setIdCaja={setIdCaja}
            tipoEgreso={tipoEgreso}
            setTipoEgreso={setTipoEgreso}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            observacion={observacion}
            setObservacion={setObservacion}
            detalles={detalles}
            setDetalles={setDetalles}
            total={total}
            isPending={isPending}
            buttonText="Actualizar egreso"
            onSubmit={() =>
              guardarCambios()
            }
          />

        </div>

      </main>

    </div>

  );

}