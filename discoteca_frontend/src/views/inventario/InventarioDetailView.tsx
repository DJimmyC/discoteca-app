import { useMemo, useState, } from "react";
import { Link, useParams, } from "react-router-dom";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { motion, } from "framer-motion";
import Swal from "sweetalert2";

import {

  Boxes,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Warehouse,
  Package,

} from "lucide-react";

import MenuList from "@/components/MenuList";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import {

  deleteInventarioById,

  getInventarios,

} from "@/api/InventarioApi";

import InventarioDetailModal from "@/components/inventario/InventarioDetailModal";

export default function InventarioDetailView() {

  const queryClient =
    useQueryClient();

  const {
    sucursalId,
  } = useParams();

  const [search, setSearch] =
    useState("");

  /* =========================
      GET SUCURSAL
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
      !!sucursalId,

  });

  /* =========================
      GET INVENTARIOS
  ========================= */

  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [
      "inventarios"
    ],

    queryFn:
      getInventarios,

  });


  /* =========================
      FILTRAR INVENTARIOS
  ========================= */
  /* =========================
      FILTRAR INVENTARIOS
  ========================= */

  /* =========================
      FILTER
  ========================= */

  // const filteredInventarios =
  //   useMemo(() => {

  //     if (!data)
  //       return [];

  //     return data.filter(
  //       (inventario: any) => {

  //         /* =========================
  //             FILTRO SUCURSAL
  //         ========================= */

  //         let perteneceSucursal =
  //           false;

  //         if (
  //           inventario.idAlmacen &&
  //           typeof inventario.idAlmacen ===
  //           "object"
  //         ) {

  //           // 🔥 idSucursal string
  //           if (
  //             typeof inventario.idAlmacen
  //               .idSucursal === "string"
  //           ) {

  //             perteneceSucursal =

  //               inventario.idAlmacen
  //                 .idSucursal ===
  //               sucursalId;

  //           }

  //           // 🔥 idSucursal populate
  //           else if (
  //             typeof inventario.idAlmacen
  //               .idSucursal === "object"
  //           ) {

  //             perteneceSucursal =

  //               inventario.idAlmacen
  //                 .idSucursal?._id ===
  //               sucursalId;

  //           }

  //         }

  //         if (!perteneceSucursal)
  //           return false;

  //         /* =========================
  //             SEARCH PRODUCTO
  //         ========================= */

  //         const productoNombre =

  //           typeof inventario.idProducto ===
  //             "object"

  //             ? inventario.idProducto
  //               ?.nombre || ""

  //             : "";

  //         return productoNombre
  //           .toLowerCase()
  //           .includes(
  //             search.toLowerCase()
  //           );

  //       }
  //     );

  //   }, [

  //     data,
  //     search,
  //     sucursalId,

  //   ]);
  const filteredInventarios =
  data?.filter((inventario) => {

    const productoNombre =
      typeof inventario.idProducto === "object"
        ? inventario.idProducto?.nombre || ""
        : inventario.idProducto || "";

    const productoMarca =
      typeof inventario.idProducto === "object"
        ? inventario.idProducto?.marca || ""
        : "";

    const almacenNombre =
      typeof inventario.idAlmacen === "object"
        ? inventario.idAlmacen?.nombre || ""
        : inventario.idAlmacen || "";

    const almacenTipo =
      typeof inventario.idAlmacen === "object"
        ? inventario.idAlmacen?.tipo || ""
        : "";

    const cantidad =
      inventario.cantidad?.toString() || "";

    const precioVenta =
      inventario.precioVenta?.toString() || "";

    const estado =
      inventario.estado ? "activo" : "inactivo";

    const textoBusqueda = `
      ${productoNombre}
      ${productoMarca}
      ${almacenNombre}
      ${almacenTipo}
      ${cantidad}
      ${precioVenta}
      ${estado}
    `.toLowerCase();

    return textoBusqueda.includes(
      search.toLowerCase()
    );

  }) || [];
  /* =========================
      STATS
  ========================= */

  const totalInventarios =
    filteredInventarios.length;

  const activos =
    filteredInventarios.filter(
      (inventario) =>
        inventario.estado
    ).length;

  const inactivos =
    filteredInventarios.filter(
      (inventario) =>
        !inventario.estado
    ).length;

  /* =========================
      DELETE
  ========================= */

  const {
    mutate,
  } = useMutation({

    mutationFn:
      deleteInventarioById,

    onSuccess: async (
      data
    ) => {

      await Swal.fire({

        icon: "success",

        title:
          data,

        timer: 2000,

        showConfirmButton: false,

      });

      queryClient.invalidateQueries({

        queryKey: [
          "inventarios"
        ],

      });

    },

    onError: async (
      error: any
    ) => {

      await Swal.fire({

        icon: "error",

        title:
          error.message,

      });

    },

  });

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (

      <div className="flex h-screen items-center justify-center bg-slate-50">

        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>

      </div>

    );

  }

  return (

    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* SIDEBAR */}
      <MenuList />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">

        {/* HEADER */}
        <motion.div

          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            mb-6
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">

                <Warehouse className="h-4 w-4" />

                <span>

                  {

                    sucursal?.nombreSucursal ||
                    "Sucursal"

                  }

                </span>

                <span>/</span>

                <span className="font-semibold text-fuchsia-600">

                  Inventario

                </span>

              </div>

              <h1 className="text-4xl font-black text-slate-800">

                Inventarios

              </h1>

              <p className="mt-2 text-slate-500">

                Gestión de inventarios y stock

              </p>

            </div>

            {/* CREATE */}
            <Link

              to={`/sucursal/${sucursalId}/inventario/create`}

              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-fuchsia-600
                to-purple-600
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition
                hover:scale-105
              "
            >

              <Plus className="h-5 w-5" />

              Nuevo Inventario

            </Link>

          </div>

        </motion.div>

        {/* SEARCH */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap gap-8">

            {/* TOTAL */}
            <div>

              <p className="text-xs uppercase text-slate-500">

                Total Inventarios

              </p>

              <p className="text-3xl font-black text-slate-800">

                {filteredInventarios.length}

              </p>

            </div>

            {/* ACTIVOS */}
            <div>

              <p className="text-xs uppercase text-slate-500">

                Activos

              </p>

              <p className="text-3xl font-black text-emerald-600">

                {

                  filteredInventarios.filter(
                    (i) => i.estado
                  ).length

                }

              </p>

            </div>

            {/* INACTIVOS */}
            <div>

              <p className="text-xs uppercase text-slate-500">

                Inactivos

              </p>

              <p className="text-3xl font-black text-red-500">

                {

                  filteredInventarios.filter(
                    (i) => !i.estado
                  ).length

                }

              </p>

            </div>

          </div>
          {/* SEARCH */}
          <div className="relative w-full max-w-md">

            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

            <input

              type="text"

              placeholder="Buscar producto..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="
                w-full
                rounded-2xl
                border
                border-slate-300
                bg-white
                py-3
                pl-10
                pr-4
                text-sm
                focus:border-fuchsia-500
                focus:outline-none
              "
            />

          </div>

        </div>

        {/* TABLE */}
        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          <div className="overflow-x-auto">

            <table className="min-w-full">

              {/* HEAD */}
              <thead className="bg-slate-100">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">

                    Producto

                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">

                    Almacén

                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">

                    Tipo

                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">

                    Cantidad

                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">

                    Precio Venta

                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">

                    Estado

                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">

                    Acciones

                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-slate-100">

                {filteredInventarios.map(
                  (inventario) => (

                    <tr
                      key={
                        inventario._id
                      }
                      className="transition hover:bg-slate-50"
                    >

                      {/* PRODUCTO */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-12
                              w-12
                              items-center
                              justify-center
                              rounded-2xl
                              bg-fuchsia-100
                              text-fuchsia-600
                            "
                          >

                            <Package className="h-6 w-6" />

                          </div>

                          <div>

                            <p className="font-bold text-slate-800">

                              {

                                typeof inventario.idProducto === "string"

                                  ? inventario.idProducto

                                  : inventario.idProducto?.nombre

                              }

                            </p>

                            <p className="text-sm text-slate-500">

                              {

                                typeof inventario.idProducto === "string"

                                  ? ""

                                  : inventario.idProducto?.marca

                              }

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ALMACEN */}
                      <td className="px-6 py-5 text-center">

                        {

                          typeof inventario.idAlmacen === "string"

                            ? inventario.idAlmacen

                            : inventario.idAlmacen?.nombre

                        }

                      </td>
                      {/* tipo */}
                      <td className="px-6 py-5 text-center">

                        {

                          typeof inventario.idAlmacen === "string"

                            ? inventario.idAlmacen

                            : inventario.idAlmacen?.tipo

                        }

                      </td>

                      {/* CANTIDAD */}
                      <td className="px-6 py-5 text-center">

                        <span className="font-bold text-slate-800">

                          {inventario.cantidad}

                        </span>

                      </td>

                      {/* PRECIO */}
                      <td className="px-6 py-5 text-center">

                        <span className="font-bold text-emerald-600">

                          Bs. {inventario.precioVenta}

                        </span>

                      </td>

                      {/* ESTADO */}
                      <td className="px-6 py-5 text-center">

                        {inventario.estado ? (

                          <span
                            className="
                              rounded-full
                              bg-emerald-100
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-emerald-700
                            "
                          >
                            Activo
                          </span>

                        ) : (

                          <span
                            className="
                              rounded-full
                              bg-red-100
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-red-700
                            "
                          >
                            Inactivo
                          </span>

                        )}

                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">

                        <div className="flex items-center justify-center gap-3">

                          {/* DETAIL */}
                          <Link

                            to={`?detail=${inventario._id}`}

                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-100
                              text-blue-600
                              transition
                              hover:scale-110
                            "
                          >

                            <Eye className="h-5 w-5" />

                          </Link>

                          {/* EDIT */}
                          <Link

                            to={`/sucursal/${sucursalId}/inventario/${inventario._id}/edit`}

                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-amber-100
                              text-amber-600
                              transition
                              hover:scale-110
                            "
                          >

                            <Pencil className="h-5 w-5" />

                          </Link>

                          {/* DELETE */}
                          <button

                            type="button"

                            onClick={async () => {

                              const result =
                                await Swal.fire({

                                  title:
                                    "¿Eliminar Inventario?",

                                  text:
                                    "El inventario será desactivado",

                                  icon:
                                    "warning",

                                  showCancelButton: true,

                                  confirmButtonColor:
                                    "#d33",

                                  cancelButtonColor:
                                    "#64748b",

                                  confirmButtonText:
                                    "Sí, eliminar",

                                  cancelButtonText:
                                    "Cancelar",

                                });

                              if (
                                result.isConfirmed
                              ) {

                                mutate({

                                  id:
                                    inventario._id!,

                                  eliminadoPor:
                                    "admin",

                                });

                              }

                            }}

                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-red-100
                              text-red-600
                              transition
                              hover:scale-110
                            "
                          >

                            <Trash2 className="h-5 w-5" />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </motion.div>

        {/* MODAL */}
        <InventarioDetailModal />

      </main>

    </div>

  );

}
