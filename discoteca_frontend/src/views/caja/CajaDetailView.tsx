
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

import {
  motion,
} from "framer-motion";

import Swal from "sweetalert2";

import MenuList from "@/components/MenuList";

import {

  deleteCajaById,

  getCajas,

} from "@/api/CajaApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import {

  Banknote,

  Eye,

  Pencil,

  Plus,

  Search,

  Trash2,

} from "lucide-react";

import CajaDetailModal from "@/components/caja/CajaDetailModal";

export default function CajaDetailView() {

  const queryClient =
    useQueryClient();

  const { sucursalId } =
    useParams();

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
      GET CAJAS
  ========================= */

  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: [
      "cajas"
    ],

    queryFn:
      getCajas,

  });

  /* =========================
      FILTRAR
  ========================= */

  const filteredCajas =
    useMemo(() => {

      if (!data)
        return [];

      return data

        .filter((caja) => {

          const cajaSucursalId =

            typeof caja.idSucursal ===
              "string"

              ? caja.idSucursal

              : caja.idSucursal?._id;

          return (
            cajaSucursalId ===
            sucursalId
          );

        })

        .filter((caja) =>

          caja.nombre
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

        );

    }, [

      data,

      search,

      sucursalId,

    ]);

  /* =========================
      DELETE
  ========================= */

  const { mutate } =
    useMutation({

      mutationFn:
        deleteCajaById,

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
            "cajas"
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

    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <MenuList />

      {/* CONTENT */}
      <main className="flex-1 p-8">

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

          className="mb-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-black text-slate-800">

                Cajas.
                {" "}

                {sucursal?.nombreSucursal}

              </h1>

              <p className="mt-2 text-slate-500">

                Gestión de cajas por sucursal

              </p>

            </div>

            {/* NUEVO */}
            <Link

              to={`/sucursal/${sucursalId}/caja/create`}

              className="
                flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-fuchsia-600
                to-purple-600
                px-6
                py-4
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition
                hover:scale-105
              "
            >

              <Plus className="h-5 w-5" />

              Nueva Caja

            </Link>

          </div>

        </motion.div>

        {/* RESUMEN */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* STATS */}
            <div className="flex gap-10">

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Total
                </p>

                <p className="text-4xl font-black text-slate-800">

                  {filteredCajas.length}

                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Activos
                </p>

                <p className="text-4xl font-black text-emerald-600">

                  {

                    filteredCajas.filter(
                      (c) => c.estado
                    ).length

                  }

                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Inactivos
                </p>

                <p className="text-4xl font-black text-red-500">

                  {

                    filteredCajas.filter(
                      (c) => !c.estado
                    ).length

                  }

                </p>

              </div>

            </div>

            {/* SEARCH */}
            <div className="relative w-full max-w-md">

              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar caja..."
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
                  py-4
                  pl-12
                  pr-4
                  text-sm
                  focus:border-fuchsia-500
                  focus:outline-none
                "
              />

            </div>

          </div>

        </div>

        {/* TABLA */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              {/* HEADER */}
              <thead className="bg-slate-100">

                <tr>

                  <th className="px-6 py-5 text-left text-xs font-black uppercase text-slate-500">
                    Caja
                  </th>

                  <th className="px-6 py-5 text-center text-xs font-black uppercase text-slate-500">
                    Estado
                  </th>



                  <th className="px-6 py-5 text-center text-xs font-black uppercase text-slate-500">
                    Acciones
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-slate-100">

                {filteredCajas.map((caja) => (

                  <tr
                    key={caja._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* CAJA */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div
                          className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-fuchsia-100
                            text-fuchsia-600
                          "
                        >

                          <Banknote className="h-7 w-7" />

                        </div>

                        <div>

                          <p className="text-lg font-bold text-slate-800">

                            {caja.nombre}

                          </p>

                          <p className="text-sm text-slate-500">

                            {

                              caja.descripcion ||
                              "Sin descripción"

                            }

                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-5 text-center">

                      {caja.estado ? (

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

                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        {/* APERTURA */}
                        <Link

                          to={`/sucursal/${sucursalId}/caja/${caja._id}/apertura`}

                          className="
        rounded-xl
        bg-emerald-100
        px-4
        py-2
        text-sm
        font-semibold
        text-emerald-700
        transition
        hover:bg-emerald-200
      "
                        >

                          Apertura

                        </Link>

                        {/* CIERRE */}
                        <Link

                          to={`/sucursal/${sucursalId}/caja/${caja._id}/cierre`}

                          className="
        rounded-xl
        bg-rose-100
        px-4
        py-2
        text-sm
        font-semibold
        text-rose-700
        transition
        hover:bg-rose-200
      "
                        >

                          Cierre

                        </Link>

                        {/* VER */}
                        <Link

                          to={`?detail=${caja._id}`}

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

                          to={`/sucursal/${sucursalId}/caja/${caja._id}/edit`}

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
                                  "¿Eliminar Caja?",

                                text:
                                  "La caja será desactivada",

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

                                id: caja._id!,

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

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* MODAL */}
      <CajaDetailModal />

    </div>

  );

}


