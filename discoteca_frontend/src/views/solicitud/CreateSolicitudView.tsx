// src/views/solicitud/CreateSolicitudView.tsx

import {
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
  ArrowLeft,
  ClipboardList,
  LogOut,
  Search,
  Wallet,
} from "lucide-react";

import Swal from "sweetalert2";

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
  createSolicitud,
} from "@/api/SolicitudApi";

import {
  createManyDetalleSolicitud,
} from "@/api/DetalleSolicitudApi";

export default function CreateSolicitudView() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: perfil,
    isLoading: loadingAuth,
  } = useAuth();

  const [
    tipoSolicitud,
    setTipoSolicitud,
  ] = useState("reposicion_interna");

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
  ] = useState("pendiente");

  const [
    observacion,
    setObservacion,
  ] = useState("");

  const [
    detalles,
    setDetalles,
  ] = useState<DetalleSolicitudItem[]>([
    {
      idProducto: "",
      cantidadSolicitada: 1,
      cantidadAprobada: null,
      cantidadAtendida: null,
      unidad: "unidades",
      observacion: "",
      estado: "pendiente",
      esNuevo: true,
    },
  ]);

  /* =========================
      DATOS DEL PERFIL
  ========================= */

  const idPerfil =
    perfil?._id;

  const idSucursal =
    typeof perfil?.idSucursal === "object"
      ? perfil.idSucursal?._id
      : perfil?.idSucursal;

  const nombreSucursal =
    typeof perfil?.idSucursal === "object"
      ? perfil.idSucursal?.nombreSucursal
      : "Sucursal";

  /* =========================
      ALMACENES
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
      CREAR SOLICITUD
  ========================= */

  const {
    mutate: guardarSolicitud,
    isPending,
  } = useMutation({

    mutationFn: async () => {

      if (!idPerfil) {
        throw new Error(
          "No se encontró el perfil del usuario"
        );
      }

      if (!idSucursal) {
        throw new Error(
          "No se encontró la sucursal del usuario"
        );
      }

      if (!idAlmacenDestino) {
        throw new Error(
          "Debe seleccionar el almacén destino"
        );
      }

      if (
        tipoSolicitud === "reposicion_interna" &&
        !idAlmacenOrigen
      ) {
        throw new Error(
          "Debe seleccionar el almacén origen"
        );
      }

      if (
        tipoSolicitud === "reposicion_interna" &&
        idAlmacenOrigen === idAlmacenDestino
      ) {
        throw new Error(
          "El almacén origen y destino no pueden ser iguales"
        );
      }

      const detallesValidos =
        detalles.filter(
          (detalle) =>
            detalle.idProducto &&
            Number(detalle.cantidadSolicitada) > 0
        );

      if (detallesValidos.length === 0) {
        throw new Error(
          "Debe agregar al menos un producto válido"
        );
      }

      /*
        1. Crear solicitud
      */
      const responseSolicitud =
        await createSolicitud({

          idPerfil,

          idSucursal,

          idAlmacenOrigen:
            tipoSolicitud === "compra_externa"
              ? null
              : idAlmacenOrigen,

          idAlmacenDestino,

          fechaSolicitud:
            new Date().toISOString(),

          estado,

          observacion:
            observacion ||
            "Sin observación",

          creadoPor:
            perfil?.nombres ||
            "sistema",

        });

      const idSolicitudCreada =
        responseSolicitud?.solicitud?._id;

      if (!idSolicitudCreada) {
        throw new Error(
          "No se recibió el ID de la solicitud creada. Revisa que el backend devuelva la solicitud."
        );
      }

      /*
        2. Crear detalles
      */
      const detallesPayload =
        detallesValidos.map((detalle) => ({

          idSolicitud:
            idSolicitudCreada,

          idProducto:
            detalle.idProducto,

          cantidadSolicitada:
            Number(
              detalle.cantidadSolicitada
            ),

          cantidadAprobada:
            detalle.cantidadAprobada ??
            null,

          cantidadAtendida:
            detalle.cantidadAtendida ??
            null,

          unidad:
            detalle.unidad ||
            "unidades",

          observacion:
            detalle.observacion ||
            "",

          estado:
            detalle.estado ||
            "pendiente",

          creadoPor:
            perfil?.nombres ||
            "sistema",

        }));

      await createManyDetalleSolicitud(
        detallesPayload
      );

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Solicitud creada",
        text: "La solicitud y sus detalles fueron registrados correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "solicitudes-sucursal",
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
            : "Error al crear la solicitud",
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
    loadingAlmacenes ||
    loadingProductos
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold">
          Cargando formulario...
        </p>
      </div>
    );

  }

  /* =========================
      ERROR
  ========================= */

  if (
    errorAlmacenes ||
    errorProductos
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold text-red-500">
          Error al cargar almacenes o productos
        </p>
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

          <div className="h-10 w-10 rounded-full bg-purple-500" />

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

                  <span className="font-bold text-purple-600">
                    Nueva Solicitud
                  </span>

                </div>

                <h1 className="text-4xl font-black text-slate-900">
                  Crear Solicitud
                </h1>

                <p className="mt-2 text-slate-500">
                  Registra una solicitud de productos para reposición o compra.
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

          <SolicitudForm
            almacenes={almacenes}
            productos={productosValidos}
            tipoSolicitud={tipoSolicitud}
            setTipoSolicitud={setTipoSolicitud}
            idAlmacenOrigen={idAlmacenOrigen}
            setIdAlmacenOrigen={setIdAlmacenOrigen}
            idAlmacenDestino={idAlmacenDestino}
            setIdAlmacenDestino={setIdAlmacenDestino}
            estado={estado}
            setEstado={setEstado}
            observacion={observacion}
            setObservacion={setObservacion}
            detalles={detalles}
            setDetalles={setDetalles}
            isPending={isPending}
            buttonText="Registrar solicitud"
            onSubmit={() =>
              guardarSolicitud()
            }
          />

        </div>

      </main>

    </div>

  );

}