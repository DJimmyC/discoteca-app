import React, {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import Swal from "sweetalert2";

import MenuListDashboard from "@/components/MenuListDashboard";
import ProductoDetailModal from "@/components/producto/ProductoDetailModal";

import {
  deleteProductoById,
  getProductos,
} from "@/api/ProductoApi";

import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Package,
  Tag,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProductoDetailView() {

  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

    const{data:perfil} = useAuth()
  /* =========================
      GET PRODUCTOS
  ========================= */
  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: ["productos"],

    queryFn: getProductos,

  });

  /* =========================
      FILTRAR
  ========================= */
  const filteredProductos =
    useMemo(() => {

      if (!data) return [];

      return data.filter(
        (producto) =>

          producto.nombre
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

      );

    }, [data, search]);

  /* =========================
      DELETE
  ========================= */
  const { mutate } =
    useMutation({

      mutationFn:
        deleteProductoById,

      onSuccess: async (
        data: any
      ) => {

        await Swal.fire({

          icon: "success",

          title: data,

          timer: 2000,

          showConfirmButton: false,

        });

        queryClient.invalidateQueries({
          queryKey: ["productos"],
        });

      },

      onError: async (
        error: any
      ) => {

        await Swal.fire({

          icon: "error",

          title:
            error.message,

          timer: 2000,

          showConfirmButton: false,

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
      <MenuListDashboard />

      {/* CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">

        {/* HEADER */}
        <motion.div

          initial={{
            opacity: 0,
            y: -25,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.4,
          }}

          className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-800">
                Productos
              </h1>

              <p className="mt-2 text-slate-500">
                Administra los productos del sistema
              </p>

            </div>

            {/* NUEVO */}
            <Link
              to="/producto/create"
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-fuchsia-600
                to-purple-600
                px-5
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

              Nuevo Producto

            </Link>

          </div>

        </motion.div>

        {/* RESUMEN */}
        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* STATS */}
            <div className="flex flex-wrap gap-8">

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Total Productos
                </p>

                <p className="text-3xl font-black text-slate-800">
                  {data?.length || 0}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Activos
                </p>

                <p className="text-3xl font-black text-emerald-600">

                  {
                    data?.filter(
                      (p) => p.estado
                    ).length
                  }

                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Inactivos
                </p>

                <p className="text-3xl font-black text-red-500">

                  {
                    data?.filter(
                      (p) => !p.estado
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

        </motion.div>

        {/* TABLA */}
        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.4,
          }}

          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >

          <div className="overflow-x-auto">

            <table className="min-w-full">

              {/* HEADER */}
              <thead className="bg-slate-100">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Producto
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                    Categoría
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
                    Marca
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

                {filteredProductos.map((producto: any) => (

                  <tr
                    key={producto._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* PRODUCTO */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">

                          <Package className="h-6 w-6" />

                        </div>

                        <div>

                          <p className="font-bold text-slate-800">
                            {producto.nombre}
                          </p>

                          <p className="text-sm text-slate-500">
                            {producto.descripcion || "Sin descripción"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORIA */}
                    <td className="px-6 py-5 text-center">

                      <div className="flex items-center justify-center gap-2 text-slate-700">

                        <Tag className="h-4 w-4" />

                        <span className="font-medium">

                          {producto.idCategoria?.nombre || "Sin categoría"}

                        </span>

                      </div>

                    </td>

                    {/* MARCA */}
                    <td className="px-6 py-5 text-center">

                      <span className="text-slate-700">
                        {producto.marca || "Sin marca"}
                      </span>

                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-5 text-center">

                      {producto.estado ? (

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

                    {/* ACCIONES */}
                    <td className="px-6 py-5">

                      <div className="flex items-center justify-center gap-3">

                        {/* VER */}
                        <Link
                          to={`?detail=${producto._id}`}
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

                        {/* EDITAR */}
                        <Link
                          to={`/producto/${producto._id}/edit`}
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

                        {/* ELIMINAR */}
                        <button
                          type="button"
                          onClick={async () => {

                            const result =
                              await Swal.fire({

                                title:
                                  "¿Eliminar Producto?",

                                text:
                                  "El producto será desactivado",

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
                                  producto._id!,

                                eliminadoPor:perfil._id,

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

                ))}

              </tbody>

            </table>

          </div>

        </motion.div>

<ProductoDetailModal />
      </main>

    </div>

  );

}

