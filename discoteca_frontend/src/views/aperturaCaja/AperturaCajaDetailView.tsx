import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  motion,
} from "framer-motion";

import MenuList from "@/components/MenuList";

import {
  getAperturasCajaByCajaId,
  deleteAperturaCajaById
} from "@/api/AperturaCajaApi";
import AperturaCajaDetailModal from "@/components/aperturacaja/AperturaCajaDetailModal";
import type {
  AperturaCajaType
} from "@/types/AperturaCajaType";

import {

  Banknote,

  Eye,

  Pencil,

  Plus,

  Trash2,

} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/useAuth"

export default function
  CajaDetailView() {

    
  const params =
    useParams();

  const sucursalId =
    params.sucursalId;

  const cajaId =
    params.cajaId;
  const queryClient = useQueryClient();
  /* =========================
      QUERY
  ========================= */

  const {

    data: aperturas,

    isLoading,

  } = useQuery({

    queryKey: [

      "aperturasCaja",

      cajaId,

    ],

    queryFn: () =>

      getAperturasCajaByCajaId(
        cajaId!
      ),

    enabled:
      !!cajaId,

    retry: false,

  });

  const { mutate } =
    useMutation({

      mutationFn:
        deleteAperturaCajaById,

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
            "aperturasCaja"
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

const   {data:perfil }= useAuth();
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

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-black text-slate-800">

              Aperturas de Caja

            </h1>

            <p className="mt-2 text-slate-500">

              Historial de aperturas

            </p>

          </div>

          <Link

            to={`/sucursal/${sucursalId}/caja/${cajaId}/apertura/create`}

            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-fuchsia-600
              px-5
              py-3
              font-semibold
              text-white
              shadow-lg
              transition
              hover:scale-105
            "
          >

            <Plus className="h-5 w-5" />

            Nueva Apertura

          </Link>

        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

                  Caja

                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

                  Usuario

                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

                  Fecha

                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

                  Hora

                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

                  Monto

                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

                  Estado

                </th>

                <th className="px-6 py-4 text-center text-sm font-bold text-slate-600">

                  Acciones

                </th>

              </tr>

            </thead>

            <tbody>

              {aperturas?.map(

                (
                  apertura:
                    AperturaCajaType
                ) => (

                  <motion.tr

                    key={apertura._id}

                    initial={{
                      opacity: 0,
                      y: 10,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      duration: 0.2,
                    }}

                    className="
                      border-t
                      border-slate-100
                      transition
                      hover:bg-slate-50
                    "
                  >

                    {/* CAJA */}

                    <td className="px-6 py-5">

                      <div className="font-semibold text-slate-700">

                        {

                          typeof apertura.idCaja ===
                            "string"

                            ? apertura.idCaja

                            : apertura.idCaja
                              ?.nombre

                        }

                      </div>

                    </td>

                    {/* USUARIO */}

                    <td className="px-6 py-5">

                      {

                        typeof apertura.idPerfil ===
                          "string"

                          ? apertura.idPerfil

                          : `${apertura.idPerfil?.nombres || ""} ${apertura.idPerfil?.apellidos || ""}`

                      }

                    </td>

                    {/* FECHA */}

                    <td className="px-6 py-5 text-slate-600">

                      {

                        new Date(
                          apertura.fecha
                        ).toLocaleDateString()

                      }

                    </td>

                    {/* HORA */}

                    <td className="px-6 py-5 text-slate-600">

                      {
                        apertura.horaApertura
                      }

                    </td>

                    {/* MONTO */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 font-bold text-emerald-600">

                        <Banknote className="h-4 w-4" />

                        Bs.
                        {
                          apertura.montoInicial
                        }

                      </div>

                    </td>

                    {/* ESTADO */}

                    <td className="px-6 py-5">

                      {

                        apertura.estado ? (

                          <span className="
                            rounded-full
                            bg-emerald-100
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-emerald-700
                          ">

                            Activo

                          </span>

                        ) : (

                          <span className="
                            rounded-full
                            bg-rose-100
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-rose-700
                          ">

                            Inactivo

                          </span>

                        )

                      }

                    </td>

                    {/* ACCIONES */}

                    <td className="px-6 py-5">

                      <div className="flex items-center justify-center gap-3">

                          {/* VER */}
                        <Link

                          to={`?detail=${apertura._id}`}

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

                          to={`/sucursal/${sucursalId}/caja/${cajaId}/apertura/${apertura._id}/edit`}

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

                          onClick={() => {

                            Swal.fire({

                              title:
                                "¿Eliminar apertura?",

                              text:
                                "Esta acción no se puede deshacer",

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

                            }).then((result) => {

                              if (
                                result.isConfirmed &&
                                apertura._id
                              ) {

                                mutate({

                                  id:
                                    apertura._id,

                                  eliminadoPor: perfil?.nombres!

                                });

                              }

                            });

                          }}

                          className="rounded-xl bg-red-100 p-2 text-red-600 transition hover:scale-110"

                        >

                          <Trash2 className="h-5 w-5" />

                        </button>

                      </div>

                    </td>

                  </motion.tr>

                )

              )}

            </tbody>

          </table>

        </div>

      </main>
      <AperturaCajaDetailModal />

    </div>

  );

}
