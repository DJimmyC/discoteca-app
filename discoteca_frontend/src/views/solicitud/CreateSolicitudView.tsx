// src/views/solicitud/CreateSolicitudView.tsx

import {
  useEffect,
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
  ArrowLeft,
  ClipboardList,
  LogOut,
  Search,
  Wallet,
} from "lucide-react";

import Swal from "sweetalert2";

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

/* =========================
    OBTENER ID
========================= */

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

  return relacion?._id || "";

}

/* =========================
    COMPONENTE
========================= */

export default function CreateSolicitudView() {

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    data:
      perfil,

    isLoading:
      loadingAuth,
  } = useAuth();

  const [
    tipoSolicitud,
    setTipoSolicitud,
  ] = useState(
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
  ] = useState(
    "pendiente"
  );

  const [
    observacion,
    setObservacion,
  ] = useState("");

  const [
    detalles,
    setDetalles,
  ] =
    useState<
      DetalleSolicitudItem[]
    >([

      {
        idProducto:
          "",

        cantidadSolicitada:
          1,

        cantidadAprobada:
          null,

        cantidadAtendida:
          null,

        unidad:
          "unidades",

        observacion:
          "",

        estado:
          "pendiente",

        esNuevo:
          true,
      },

    ]);

  /* =========================
      DATOS PERFIL
  ========================= */

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

  const nombreUsuario =
    perfil?.nombres ||
    "sistema";

  /* =========================
      ALMACENES
  ========================= */

  const {
    data:
      dataAlmacenes,

    isLoading:
      loadingAlmacenes,

    isError:
      errorAlmacenes,
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
      Boolean(
        idSucursal
      ),

  });

  const almacenes =
    dataAlmacenes
      ?.almacenes ||
    [];

  /* =========================
      INVENTARIO PRINCIPAL
  ========================= */

  const {
    data:
      inventarioPrincipal,

    isLoading:
      loadingProductos,

    isError:
      errorProductos,
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
      Boolean(
        idSucursal
      ),

  });

  const productos =
    useMemo(() => {

      return (
        inventarioPrincipal
          ?.inventarios || []
      )
        .filter(
          (inventario) =>
            inventario.estado !== false &&
            inventario.cantidad > 0 &&
            typeof inventario.idProducto === "object" &&
            inventario.idProducto !== null &&
            Boolean(
              inventario.idProducto._id
            )
        )
        .map(
          (inventario) => {

            const producto =
              typeof inventario.idProducto === "object" &&
              inventario.idProducto !== null
                ? inventario.idProducto
                : null;

            return {
              _id:
                producto?._id || "",

              nombre:
                producto?.nombre ||
                "Producto",

              descripcion:
                producto?.descripcion ||
                "",

              marca:
                producto?.marca ||
                "",

              estado:
                producto?.estado ??
                true,

              stockDisponible:
                Number(
                  inventario.cantidad || 0
                ),
            };
          }
        );

    }, [
      inventarioPrincipal,
    ]);

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
        ?.almacen
        ?._id ||
      "";

    setIdAlmacenOrigen(
      idPrincipal
    );

  }, [
    inventarioPrincipal,
    tipoSolicitud,
  ]);

  /* =========================
      MUTATION
  ========================= */

  const {
    mutate:
      guardarSolicitud,

    isPending,
  } = useMutation({

    mutationFn:
      async () => {

        /* =========================
            VALIDACIONES
        ========================= */

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

        if (
          !idAlmacenDestino
        ) {

          throw new Error(
            "Debe seleccionar el almacén destino"
          );

        }

        if (
          tipoSolicitud ===
            "reposicion_interna" &&
          !idAlmacenOrigen
        ) {

          throw new Error(
            "Debe seleccionar el almacén origen"
          );

        }

        if (
          tipoSolicitud ===
            "reposicion_interna" &&
          idAlmacenOrigen ===
            idAlmacenDestino
        ) {

          throw new Error(
            "El almacén origen y destino no pueden ser iguales"
          );

        }

        const detallesValidos =
          detalles.filter(
            (
              detalle
            ) =>
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
            "Debe agregar al menos un producto válido"
          );

        }

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
                ?.stockDisponible ||
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
                producto?.nombre ||
                "un producto"
              } supera el stock disponible (${stockDisponible})`
            );
          }
        }

        const productosDuplicados =
          detallesValidos.some(
            (
              detalle,
              index,
              array
            ) =>
              array.findIndex(
                (
                  item
                ) =>
                  item.idProducto ===
                  detalle.idProducto
              ) !== index
          );

        if (
          productosDuplicados
        ) {

          throw new Error(
            "No puede repetir el mismo producto dentro de la solicitud"
          );

        }

        /* =========================
            1. CREAR SOLICITUD
        ========================= */

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

            /*
              Toda solicitud nueva
              comienza pendiente.
            */
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
            .solicitud
            ._id;

        if (
          !idSolicitudCreada
        ) {

          throw new Error(
            "El backend no devolvió el ID de la solicitud creada"
          );

        }

        /* =========================
            2. PREPARAR DETALLES
        ========================= */

        const detallesPayload:
          DetalleSolicitudForm[] =
          detallesValidos.map(
            (
              detalle
            ) => ({

              idSolicitud:
                idSolicitudCreada,

              idProducto:
                detalle.idProducto,

              cantidadSolicitada:
                Number(
                  detalle
                    .cantidadSolicitada
                ),

              /*
                Una solicitud nueva todavía
                no está aprobada ni atendida.
              */
              cantidadAprobada:
                0,

              cantidadAtendida:
                0,

              unidad:
                detalle.unidad ||
                "unidades",

              observacion:
                detalle
                  .observacion ||
                "",

              estado:
                "pendiente",

              creadoPor:
                nombreUsuario,

            })
          );

        /* =========================
            3. CREAR DETALLES
        ========================= */

        const detallesCreados =
          await createManyDetalleSolicitud(
            detallesPayload
          );

        /* =========================
            4. MOVIMIENTO GENERAL
        ========================= */

        const totalSolicitado =
          detallesPayload.reduce<number>(
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

        /* =========================
            5. MOVIMIENTO POR PRODUCTO
        ========================= */

        for (
          const detalle
          of detallesPayload
        ) {

          const producto =
            productos.find(
              (
                item
              ) =>
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
                producto?.nombre ||
                "Producto"
              }`,

            creadoPor:
              nombreUsuario,

          };

          await createMovimiento(
            movimientoDetalle
          );

        }

        return {

          solicitud:
            respuestaSolicitud
              .solicitud,

          cantidadDetalles:
            detallesCreados.length,

          totalSolicitado,

        };

      },

    /* =========================
        SUCCESS
    ========================= */

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
            <p>La solicitud, sus detalles y movimientos fueron registrados.</p>

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

        });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "solicitudes-sucursal",
              idSucursal,
            ],

          });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "movimientos",
            ],

          });

        navigate(-1);

      },

    /* =========================
        ERROR
    ========================= */

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
            error instanceof Error
              ? error.message
              : "Error desconocido al crear la solicitud",

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

    navigate(
      "/auth/login"
    );

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


      {/* SIDEBAR */}

      <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 border-r border-slate-200 bg-white">

        <MenuList />

      </aside>

      {/* MAIN */}

      <main className="ml-72 pt-20">

        <div className="p-8">

          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">

                  <ClipboardList className="h-4 w-4" />

                  <span>

                    {nombreSucursal}

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

            almacenes={
              almacenes
            }

            productos={
              productos
            }

            tipoSolicitud={
              tipoSolicitud
            }

            setTipoSolicitud={
              setTipoSolicitud
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

            setEstado={
              setEstado
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

      </main>

    </div>

  );

}