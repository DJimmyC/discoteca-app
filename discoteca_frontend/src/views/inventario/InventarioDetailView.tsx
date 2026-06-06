// src/views/inventario/InventarioDetailView.tsx

import {
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
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
  Warehouse,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import {
  deleteInventarioById,
  getInventariosPorSucursal,
} from "@/api/InventarioApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import {
  useAuth,
} from "@/hooks/useAuth";

import type {
  InventarioType,
} from "@/types/InventarioType";

/* =========================
    HELPERS
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

function obtenerTexto(
  valor: unknown,
  defecto = ""
): string {

  if (
    typeof valor ===
      "string" ||
    typeof valor ===
      "number"
  ) {
    return String(valor);
  }

  return defecto;

}

function obtenerNumero(
  valor: unknown
): number {

  const numero =
    Number(valor);

  return Number.isFinite(
    numero
  )
    ? numero
    : 0;

}

function dinero(
  valor: unknown
): string {

  return `Bs. ${obtenerNumero(
    valor
  ).toFixed(2)}`;

}

/* =========================
    COMPONENTE
========================= */

export default function InventarioDetailView() {

  const {
    sucursalId,
  } = useParams();

  const queryClient =
    useQueryClient();

  const {
    data: perfil,
  } = useAuth();

  const [
    search,
    setSearch,
  ] = useState("");

  const nombreUsuario =
    perfil?.nombres ||
    "admin";

  /* =========================
      SUCURSAL
  ========================= */

  const {
    data: sucursal,
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
      INVENTARIOS DE LA SUCURSAL
  ========================= */

  const {
    data:
      inventariosSucursal = [],

    isLoading,

    isError,

    error,
  } = useQuery({

    queryKey: [
      "inventarios-sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getInventariosPorSucursal(
        sucursalId!
      ),

    enabled:
      Boolean(
        sucursalId
      ),

  });

  /* =========================
      BUSCADOR
  ========================= */

  const inventariosFiltrados =
    useMemo(() => {

      const busqueda =
        search
          .trim()
          .toLowerCase();

      if (!busqueda) {
        return inventariosSucursal;
      }

      return inventariosSucursal.filter(
        (
          inventario
        ) => {

          const almacen =
            typeof inventario.idAlmacen ===
              "object" &&
            inventario.idAlmacen !==
              null
              ? inventario.idAlmacen
              : null;

          const producto =
            typeof inventario.idProducto ===
              "object" &&
            inventario.idProducto !==
              null
              ? inventario.idProducto
              : null;

          const texto = [

            almacen?.nombre,

            almacen?.tipo,

            producto?.nombre,

            producto?.marca,

            producto?.descripcion,

          ]
            .filter(
              Boolean
            )
            .join(" ")
            .toLowerCase();

          return texto.includes(
            busqueda
          );

        }
      );

    }, [
      inventariosSucursal,
      search,
    ]);

  /* =========================
      RESUMEN
  ========================= */

/* =========================
    TIPO DEL RESUMEN
========================= */

type InventarioResumen = {
  productos: number;
  unidades: number;
  valor: number;
  stockBajo: number;
};

/* =========================
    RESUMEN
========================= */

const resumen =
  useMemo<InventarioResumen>(() => {

    return inventariosSucursal.reduce<InventarioResumen>(
      (
        acumulado,
        inventario
      ) => {

        const cantidad =
          obtenerNumero(
            inventario.cantidad
          );

        const costoUnitario =
          obtenerNumero(
            inventario.costoUnitario
          );

        const stockMinimo =
          obtenerNumero(
            inventario.stockMinimo
          );

        acumulado.productos =
          acumulado.productos + 1;

        acumulado.unidades =
          acumulado.unidades +
          cantidad;

        acumulado.valor =
          acumulado.valor +
          (
            cantidad *
            costoUnitario
          );

        if (
          cantidad <=
          stockMinimo
        ) {

          acumulado.stockBajo =
            acumulado.stockBajo + 1;

        }

        return acumulado;

      },
      {
        productos: 0,
        unidades: 0,
        valor: 0,
        stockBajo: 0,
      }
    );

  }, [
    inventariosSucursal,
  ]);

  /* =========================
      ELIMINAR
  ========================= */

  const {
    mutate:
      eliminarInventario,

    isPending:
      eliminando,
  } = useMutation({

    mutationFn:
      deleteInventarioById,

    onSuccess:
      async (
        data
      ) => {

        await Swal.fire({

          icon:
            "success",

          title:
            data?.message ||
            "Inventario eliminado",

          timer:
            1800,

          showConfirmButton:
            false,

        });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "inventarios",
            ],

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
            "Error",

          text:
            error instanceof Error
              ? error.message
              : "No se pudo eliminar el inventario",

        });

      },

  });

  const handleEliminar =
    async (
      inventario:
        InventarioType
    ) => {

      if (
        !inventario._id
      ) {
        return;
      }

      const resultado =
        await Swal.fire({

          icon:
            "warning",

          title:
            "¿Desactivar inventario?",

          text:
            "El inventario quedará inactivo, pero conservará su historial.",

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, desactivar",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#dc2626",

        });

      if (
        !resultado.isConfirmed
      ) {
        return;
      }

      eliminarInventario({

        id:
          inventario._id,

        eliminadoPor:
          nombreUsuario,

      });

    };

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-fuchsia-600" />

          <p className="mt-4 font-bold text-slate-600">

            Cargando inventario...

          </p>

        </div>

      </div>

    );

  }

  if (isError) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />

          <h2 className="mt-4 text-xl font-black text-red-600">

            Error al cargar inventario

          </h2>

          <p className="mt-2 text-slate-500">

            {error instanceof Error
              ? error.message
              : "No se pudo obtener el inventario"}

          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      <MenuList />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* HEADER */}

        <section className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-fuchsia-600">

                {sucursal
                  ?.nombreSucursal ||
                  "Sucursal"}

              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-800 sm:text-4xl">

                Inventario

              </h1>

              <p className="mt-2 text-slate-500">

                Stock, costos promedio y valoración por almacén.

              </p>

            </div>

            <Link
              to={`/sucursal/${sucursalId}/inventario/create`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 px-5 py-3 font-black text-white transition hover:bg-fuchsia-700"
            >

              <Plus className="h-5 w-5" />

              Registrar entrada

            </Link>

          </div>

        </section>

        {/* RESUMEN */}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <ResumenCard
            titulo="Registros"
            valor={resumen.productos}
            icono={
              <Package className="h-7 w-7" />
            }
          />

          <ResumenCard
            titulo="Unidades"
            valor={resumen.unidades}
            icono={
              <Boxes className="h-7 w-7" />
            }
          />

          <ResumenCard
            titulo="Valor inventario"
            valor={dinero(
              resumen.valor
            )}
            icono={
              <CircleDollarSign className="h-7 w-7" />
            }
          />

          <ResumenCard
            titulo="Stock bajo"
            valor={resumen.stockBajo}
            icono={
              <AlertTriangle className="h-7 w-7" />
            }
          />

        </section>

        {/* BUSCADOR */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="relative">

            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Buscar producto, almacén, marca o tipo..."
              className="w-full rounded-2xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-fuchsia-500"
            />

          </div>

        </section>

        {/* TABLA */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {inventariosFiltrados.length ===
          0 ? (

            <div className="p-12 text-center">

              <Warehouse className="mx-auto h-14 w-14 text-slate-300" />

              <h2 className="mt-4 text-xl font-black text-slate-700">

                No existen inventarios

              </h2>

              <p className="mt-2 text-slate-500">

                No se encontraron productos en los almacenes de esta sucursal.

              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-[1200px] w-full">

                <thead className="bg-slate-100">

                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                    <th className="px-5 py-4">
                      Producto
                    </th>

                    <th className="px-5 py-4">
                      Almacén
                    </th>

                    <th className="px-5 py-4 text-right">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-right">
                      Stock mínimo
                    </th>

                    <th className="px-5 py-4 text-right">
                      Costo promedio
                    </th>

                    <th className="px-5 py-4 text-right">
                      Último costo
                    </th>

                    <th className="px-5 py-4 text-right">
                      Precio venta
                    </th>

                    <th className="px-5 py-4 text-right">
                      Valor
                    </th>

                    <th className="px-5 py-4 text-center">
                      Estado
                    </th>

                    <th className="px-5 py-4 text-center">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {inventariosFiltrados.map(
                    (
                      inventario
                    ) => {

                      const almacen =
                        typeof inventario.idAlmacen ===
                          "object" &&
                        inventario.idAlmacen !==
                          null
                          ? inventario.idAlmacen
                          : null;

                      const producto =
                        typeof inventario.idProducto ===
                          "object" &&
                        inventario.idProducto !==
                          null
                          ? inventario.idProducto
                          : null;

                      const cantidad =
                        obtenerNumero(
                          inventario.cantidad
                        );

                      const stockMinimo =
                        obtenerNumero(
                          inventario.stockMinimo
                        );

                      const stockBajo =
                        cantidad <=
                        stockMinimo;

                      const valor =
                        inventario.valorInventario ??
                        (
                          cantidad *
                          obtenerNumero(
                            inventario.costoUnitario
                          )
                        );

                      return (

                        <tr
                          key={
                            inventario._id
                          }
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >

                          <td className="px-5 py-4">

                            <p className="font-black text-slate-800">

                              {obtenerTexto(
                                producto?.nombre!,
                                "Producto"
                              )}

                            </p>

                            <p className="text-xs text-slate-500">

                              {obtenerTexto(
                                producto?.marca,
                                "Sin marca"
                              )}

                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <p className="font-bold text-slate-700">

                              {obtenerTexto(
                                almacen?.nombre,
                                "Almacén"
                              )}

                            </p>

                            <span className="inline-flex rounded-full bg-cyan-50 px-2 py-1 text-xs font-bold text-cyan-700">

                              {obtenerTexto(
                                almacen?.tipo,
                                "Sin tipo"
                              )}

                            </span>

                          </td>

                          <td className="px-5 py-4 text-right">

                            <span
                              className={`
                                rounded-full
                                px-3
                                py-1
                                text-sm
                                font-black
                                ${
                                  stockBajo
                                    ? "bg-red-100 text-red-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }
                              `}
                            >

                              {cantidad}

                            </span>

                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-slate-600">

                            {stockMinimo}

                          </td>

                          <td className="px-5 py-4 text-right font-bold text-slate-700">

                            {dinero(
                              inventario.costoUnitario
                            )}

                          </td>

                          <td className="px-5 py-4 text-right text-slate-600">

                            {dinero(
                              inventario.ultimoCostoEntrada
                            )}

                          </td>

                          <td className="px-5 py-4 text-right font-bold text-fuchsia-600">

                            {dinero(
                              inventario.precioVenta
                            )}

                          </td>

                          <td className="px-5 py-4 text-right font-black text-cyan-700">

                            {dinero(
                              valor
                            )}

                          </td>

                          <td className="px-5 py-4 text-center">

                            <span
                              className={`
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-black
                                ${
                                  inventario.estado
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-200 text-slate-600"
                                }
                              `}
                            >

                              {inventario.estado
                                ? "Activo"
                                : "Inactivo"}

                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex justify-center gap-2">

                              {inventario._id && (

                                <Link
                                  to={`/sucursal/${sucursalId}/inventario/${inventario._id}/edit`}
                                  title="Editar inventario"
                                  className="rounded-xl bg-cyan-100 p-2 text-cyan-700 transition hover:bg-cyan-200"
                                >

                                  <Edit3 className="h-5 w-5" />

                                </Link>

                              )}

                              <button
                                type="button"
                                title="Desactivar inventario"
                                disabled={
                                  eliminando ||
                                  !inventario.estado
                                }
                                onClick={() =>
                                  handleEliminar(
                                    inventario
                                  )
                                }
                                className="rounded-xl bg-red-100 p-2 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                              >

                                <Trash2 className="h-5 w-5" />

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>

  );

}

/* =========================
    TARJETA RESUMEN
========================= */

type ResumenCardProps = {

  titulo:
    string;

  valor:
    string | number;

  icono:
    React.ReactNode;

};

function ResumenCard({

  titulo,

  valor,

  icono,

}: ResumenCardProps) {

  const valorSeguro:
    string | number =
    typeof valor === "number" ||
    typeof valor === "string"
      ? valor
      : "";

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold text-slate-500">

            {titulo}

          </p>

          <p className="mt-2 text-2xl font-black text-slate-800">

            {valorSeguro}

          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">

          {icono}

        </div>

      </div>

    </div>

  );



}