// src/views/inventario/CreateInventarioView.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import {
  ArrowLeft,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import InventarioForm from "@/components/inventario/InventarioForm";

import {
  createInventario,
} from "@/api/InventarioApi";

import {
  getAlmacenes,
} from "@/api/AlmacenApi";

import {
  getProductos,
} from "@/api/ProductoApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import {
  useAuth,
} from "@/hooks/useAuth";

import type {
  InventarioFormData,
} from "@/types/InventarioType";

/* =========================
    TIPOS PARA EL FORMULARIO
========================= */

type AlmacenOption = {
  _id: string;
  nombre?: string | null;
  tipo?: string | null;
  estado?: boolean;
};

type ProductoOption = {
  _id: string;
  nombre?: string | null;
  descripcion?: string | null;
  marca?: string | null;
  estado?: boolean;
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

export default function CreateInventarioView() {

  const {
    sucursalId,
  } = useParams();

  const queryClient =
    useQueryClient();

  const {
    data: perfil,
  } = useAuth();

  const nombreUsuario =
    perfil?.nombres ||
    "admin";

  /* =========================
      FORMULARIO
  ========================= */

  const [
    formData,
    setFormData,
  ] = useState<InventarioFormData>({

    idAlmacen:
      "",

    idProducto:
      "",

    cantidad:
      0,

    costoUnitario:
      0,

    precioVenta:
      0,

    stockMinimo:
      0,

    estado:
      true,

    creadoPor:
      "admin",

  });

  /*
    Actualizar creadoPor cuando
    termine de cargar el perfil.
  */
  useEffect(() => {

    setFormData(
      (
        current
      ) => ({

        ...current,

        creadoPor:
          nombreUsuario,

      })
    );

  }, [
    nombreUsuario,
  ]);

  /* =========================
      SUCURSAL
  ========================= */

  const {
    data: sucursal,
    isLoading:
      loadingSucursal,
  } = useQuery({

    queryKey: [
      "sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getSucursalById(
        sucursalId!
      ),

    enabled:
      Boolean(
        sucursalId
      ),

  });

  /* =========================
      ALMACENES
  ========================= */

  const {
    data:
      almacenesData = [],

    isLoading:
      loadingAlmacenes,

    isError:
      errorAlmacenes,
  } = useQuery({

    queryKey: [
      "almacenes",
    ],

    queryFn:
      getAlmacenes,

  });

  /*
    Aquí resolvemos el error:

    Property '_id' is optional
    pero InventarioForm requiere _id string.
  */
  const almacenesSucursal =
    useMemo<AlmacenOption[]>(() => {

      return almacenesData
        .filter(
          (
            almacen
          ) => {

            if (
              !almacen._id
            ) {
              return false;
            }

            const idSucursalAlmacen =
              obtenerIdRelacion(
                almacen.idSucursal
              );

            return (
              idSucursalAlmacen ===
              sucursalId
            );

          }
        )
        .map(
          (
            almacen
          ) => ({

            _id:
              String(
                almacen._id
              ),

            nombre:
              almacen.nombre ||
              "Almacén",

            tipo:
              almacen.tipo ||
              "sin_tipo",

            estado:
              almacen.estado ??
              true,

          })
        );

    }, [
      almacenesData,
      sucursalId,
    ]);

  /* =========================
      PRODUCTOS
  ========================= */

  const {
    data:
      productosData = [],

    isLoading:
      loadingProductos,

    isError:
      errorProductos,
  } = useQuery({

    queryKey: [
      "productos",
    ],

    queryFn:
      getProductos,

  });

  /*
    También resolvemos el error
    de ProductoOption[].
  */
  const productos =
    useMemo<ProductoOption[]>(() => {

      return productosData
        .filter(
          (
            producto
          ) =>
            Boolean(
              producto._id
            )
        )
        .map(
          (
            producto
          ) => ({

            _id:
              String(
                producto._id
              ),

            nombre:
              producto.nombre ||
              "Producto",

            descripcion:
              producto.descripcion ||
              "",

            marca:
              producto.marca ||
              "Sin marca",

            estado:
              producto.estado ??
              true,

          })
        );

    }, [
      productosData,
    ]);

  /* =========================
      REGISTRAR ENTRADA
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createInventario,

    onSuccess:
      async (
        data
      ) => {

        const calculo =
          data.calculoCosto;

        await Swal.fire({

          icon:
            "success",

          title:
            data.message,

          html: `
            <div style="text-align:left; line-height:1.8">

              <p>
                <strong>Cantidad anterior:</strong>
                ${calculo.cantidadAnterior}
              </p>

              <p>
                <strong>Cantidad ingresada:</strong>
                ${calculo.cantidadEntrada}
              </p>

              <p>
                <strong>Stock actual:</strong>
                ${calculo.cantidadNueva}
              </p>

              <hr style="margin:12px 0" />

              <p>
                <strong>Costo anterior:</strong>
                Bs. ${Number(
                  calculo.costoAnterior
                ).toFixed(2)}
              </p>

              <p>
                <strong>Costo de entrada:</strong>
                Bs. ${Number(
                  calculo.costoEntrada
                ).toFixed(2)}
              </p>

              <p>
                <strong>Costo promedio:</strong>
                Bs. ${Number(
                  calculo.costoPromedio
                ).toFixed(2)}
              </p>

              <p>
                <strong>Valor del inventario:</strong>
                Bs. ${Number(
                  calculo.valorNuevo
                ).toFixed(2)}
              </p>

            </div>
          `,

          confirmButtonText:
            "Aceptar",

        });

        await Promise.all([

          queryClient.invalidateQueries({

            queryKey: [
              "inventarios",
            ],

          }),

          queryClient.invalidateQueries({

            queryKey: [
              "inventarios-sucursal",
              sucursalId,
            ],

          }),

          queryClient.invalidateQueries({

            queryKey: [
              "inventario-principal",
              sucursalId,
            ],

          }),

          queryClient.invalidateQueries({

            queryKey: [
              "inventario-barra",
              sucursalId,
            ],

          }),

        ]);

        setFormData({

          idAlmacen:
            "",

          idProducto:
            "",

          cantidad:
            0,

          costoUnitario:
            0,

          precioVenta:
            0,

          stockMinimo:
            0,

          estado:
            true,

          creadoPor:
            nombreUsuario,

        });

      },

    onError:
      async (
        error
      ) => {

        await Swal.fire({

          icon:
            "error",

          title:
            "No se pudo registrar la entrada",

          text:
            error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado",

        });

      },

  });

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit =
    (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();

      if (
        !formData.idAlmacen
      ) {

        void Swal.fire({

          icon:
            "warning",

          title:
            "Seleccione un almacén",

        });

        return;

      }

      if (
        !formData.idProducto
      ) {

        void Swal.fire({

          icon:
            "warning",

          title:
            "Seleccione un producto",

        });

        return;

      }

      if (
        Number(
          formData.cantidad
        ) <= 0
      ) {

        void Swal.fire({

          icon:
            "warning",

          title:
            "Cantidad no válida",

          text:
            "La cantidad debe ser mayor a cero.",

        });

        return;

      }

      if (
        Number(
          formData.costoUnitario
        ) < 0
      ) {

        void Swal.fire({

          icon:
            "warning",

          title:
            "Costo no válido",

        });

        return;

      }

      mutate({

        ...formData,

        idAlmacen:
          String(
            formData.idAlmacen
          ),

        idProducto:
          String(
            formData.idProducto
          ),

        cantidad:
          Number(
            formData.cantidad
          ),

        costoUnitario:
          Number(
            formData.costoUnitario
          ),

        precioVenta:
          Number(
            formData.precioVenta
          ),

        stockMinimo:
          Number(
            formData.stockMinimo
          ),

        creadoPor:
          nombreUsuario,

      });

    };

  /* =========================
      LOADING
  ========================= */

  if (
    loadingSucursal ||
    loadingAlmacenes ||
    loadingProductos
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-fuchsia-600" />

          <p className="mt-4 font-bold text-slate-600">

            Cargando formulario...

          </p>

        </div>

      </div>

    );

  }

  if (
    errorAlmacenes ||
    errorProductos
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-black text-red-600">

            Error al cargar datos

          </h2>

          <p className="mt-2 text-slate-500">

            No se pudieron obtener los almacenes o productos.

          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      <MenuList />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">

        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-5 shadow-sm sm:p-8">

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">

                <span>

                  {sucursal
                    ?.nombreSucursal ||
                    "Sucursal"}

                </span>

                <span>/</span>

                <span className="font-semibold text-fuchsia-600">

                  Nueva entrada

                </span>

              </div>

              <h1 className="text-3xl font-black text-slate-800 sm:text-4xl">

                Registrar entrada de inventario

              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">

                Si el producto ya existe en el almacén, se sumará la cantidad y se calculará el costo promedio ponderado.

              </p>

            </div>

            <Link
              to={`/sucursal/${sucursalId}/inventario`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >

              <ArrowLeft className="h-5 w-5" />

              Volver

            </Link>

          </div>

          <InventarioForm

            formData={
              formData
            }

            setFormData={
              setFormData
            }

            onSubmit={
              handleSubmit
            }

            almacenes={
              almacenesSucursal
            }

            productos={
              productos
            }

            loading={
              isPending
            }

            submitText="Registrar entrada"

          />

        </div>

      </main>

    </div>

  );

}