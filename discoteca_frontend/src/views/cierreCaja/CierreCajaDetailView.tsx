// import {
//   Link,
//   useParams,
// } from "react-router-dom";

// import {
//   useMutation,
//   useQuery,
//   useQueryClient
// } from "@tanstack/react-query";

// import {
//   motion,
// } from "framer-motion";

// import MenuList from "@/components/MenuList";

// import {

//   getAllCierreCaja,
//   deleteCierreCajaById,
//   getCierreCajaByCajaId

// } from "@/api/CierreCajaApi";

// import CierreCajaDetailModal from "@/components/cierrecaja/CierreCajaDetailModal";

// import type {
//   CierreCajaType
// } from "@/types/CierreCajaType";

// import {

//   Banknote,
//   Eye,
//   Pencil,
//   Plus,
//   Trash2,

// } from "lucide-react";

// import Swal from "sweetalert2";

// import { useAuth } from "@/hooks/useAuth";

// export default function
//   CierreCajaDetailView() {

//   const params =
//     useParams();

//   const sucursalId =
//     params.sucursalId;

//     const cajaId = params.cajaId

//   const queryClient =
//     useQueryClient();

//   /* =========================
//       QUERY
//   ========================= */

//   const {

//     data: cierres,

//     isLoading,

//   } = useQuery({

//     queryKey: [

//     ],

//     queryFn:()=>
//       getCierreCajaByCajaId(cajaId!),

//     retry: false,

//   });
// console.log(cierres,"aaa")
//   /* =========================
//       DELETE
//   ========================= */

//   const { mutate } =
//     useMutation({

//       mutationFn:
//         deleteCierreCajaById,

//       onSuccess: async (
//         data
//       ) => {

//         await Swal.fire({

//           icon: "success",

//           title:
//             data,

//           timer: 2000,

//           showConfirmButton: false,

//         });

//         queryClient.invalidateQueries({

//           queryKey: [
//             "cierresCaja"
//           ],

//         });

//       },

//       onError: async (
//         error: any
//       ) => {

//         await Swal.fire({

//           icon: "error",

//           title:
//             error.message,

//         });

//       },

//     });

//   const { data: perfil } =
//     useAuth();

//   /* =========================
//       FILTER
//   ========================= */


//   /* =========================
//       LOADING
//   ========================= */

//   if (isLoading) {

//     return (

//       <div className="flex h-screen items-center justify-center bg-slate-50">

//         <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>

//       </div>

//     );

//   }

//   return (

//     <div className="flex min-h-screen bg-slate-50">

//       {/* SIDEBAR */}
//       <MenuList />

//       {/* CONTENT */}
//       <main className="flex-1 p-8">

//         {/* HEADER */}

//         <div className="mb-8 flex items-center justify-between">

//           <div>

//             <h1 className="text-3xl font-black text-slate-800">

//               Cierres de Caja

//             </h1>

//             <p className="mt-2 text-slate-500">

//               Historial de cierres

//             </p>

//           </div>

//           <Link

//             to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre/create`}

//             className="
//               flex
//               items-center
//               gap-2
//               rounded-xl
//               bg-fuchsia-600
//               px-5
//               py-3
//               font-semibold
//               text-white
//               shadow-lg
//               transition
//               hover:scale-105
//             "
//           >

//             <Plus className="h-5 w-5" />

//             Nuevo Cierre

//           </Link>

//         </div>

//         {/* TABLE */}

//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//           <table className="w-full">

//             <thead className="bg-slate-100">

//               <tr>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Caja

//                 </th>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Usuario

//                 </th>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Fecha Apertura

//                 </th>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Fecha Cierre

//                 </th>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Esperado

//                 </th>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Real

//                 </th>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Diferencia

//                 </th>

//                 <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">

//                   Estado

//                 </th>

//                 <th className="px-6 py-4 text-center text-sm font-bold text-slate-600">

//                   Acciones

//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {cierres?.map(

//                 (
//                   cierre:
//                     CierreCajaType
//                 ) => (

//                   <motion.tr

//                     key={cierre._id}

//                     initial={{
//                       opacity: 0,
//                       y: 10,
//                     }}

//                     animate={{
//                       opacity: 1,
//                       y: 0,
//                     }}

//                     transition={{
//                       duration: 0.2,
//                     }}

//                     className="
//                       border-t
//                       border-slate-100
//                       transition
//                       hover:bg-slate-50
//                     "
//                   >

//                     {/* CAJA */}

//                     <td className="px-6 py-5">

//                       <div className="font-semibold text-slate-700">

//                         {

//                           typeof cierre.idCaja ===
//                             "string"

//                             ? cierre.idCaja

//                             : cierre.idCaja
//                               ?.nombre

//                         }

//                       </div>

//                     </td>

//                     {/* USUARIO */}

//                     <td className="px-6 py-5">

//                       {

//                         typeof cierre.idPerfil ===
//                           "string"

//                           ? cierre.idPerfil

//                           : `${cierre.idPerfil?.nombres || ""} ${cierre.idPerfil?.apellidos || ""}`

//                       }

//                     </td>

//                     {/* FECHA APERTURA */}

//                     <td className="px-6 py-5 text-slate-600">

//                       {

//                         new Date(
//                           cierre.fechaApertura
//                         ).toLocaleDateString()

//                       }

//                     </td>

//                     {/* FECHA CIERRE */}

//                     <td className="px-6 py-5 text-slate-600">

//                       {

//                         new Date(
//                           cierre.fechaCierre
//                         ).toLocaleDateString()

//                       }

//                     </td>

//                     {/* ESPERADO */}

//                     <td className="px-6 py-5">

//                       <div className="flex items-center gap-2 font-bold text-emerald-600">

//                         <Banknote className="h-4 w-4" />

//                         Bs.
//                         {
//                           cierre.totalEsperado
//                         }

//                       </div>

//                     </td>

//                     {/* REAL */}

//                     <td className="px-6 py-5 font-bold text-sky-600">

//                       Bs.
//                       {
//                         cierre.montoReal
//                       }

//                     </td>

//                     {/* DIFERENCIA */}

//                     <td
//                       className={`
//                         px-6 py-5 font-bold

//                         ${

//                           cierre.diferencia === 0

//                             ? "text-emerald-600"

//                             : "text-red-600"

//                         }
//                       `}
//                     >

//                       Bs.
//                       {
//                         cierre.diferencia
//                       }

//                     </td>

//                     {/* ESTADO */}

//                     <td className="px-6 py-5">

//                       <span
//                         className={`
//                           rounded-full
//                           px-3
//                           py-1
//                           text-xs
//                           font-bold

//                           ${

//                             cierre.estado === "cuadrado"

//                               ? "bg-emerald-100 text-emerald-700"

//                               : "bg-red-100 text-red-700"

//                           }
//                         `}
//                       >

//                         {
//                           cierre.estado
//                         }

//                       </span>

//                     </td>

//                     {/* ACCIONES */}

//                     <td className="px-6 py-5">

//                       <div className="flex items-center justify-center gap-3">

//                         {/* VER */}
//                         <Link

//                           to={`?detail=${cierre._id}`}

//                           className="
//                             flex
//                             h-10
//                             w-10
//                             items-center
//                             justify-center
//                             rounded-xl
//                             bg-blue-100
//                             text-blue-600
//                             transition
//                             hover:scale-110
//                           "
//                         >

//                           <Eye className="h-5 w-5" />

//                         </Link>

//                         {/* EDITAR */}
//                         <Link

//                           to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre/${cierre._id}/edit`}

//                           className="
//                             flex
//                             h-10
//                             w-10
//                             items-center
//                             justify-center
//                             rounded-xl
//                             bg-amber-100
//                             text-amber-600
//                             transition
//                             hover:scale-110
//                           "
//                         >

//                           <Pencil className="h-5 w-5" />

//                         </Link>

//                         {/* ELIMINAR */}

//                         <button

//                           type="button"

//                           onClick={() => {

//                             Swal.fire({

//                               title:
//                                 "¿Eliminar cierre?",

//                               text:
//                                 "Esta acción no se puede deshacer",

//                               icon:
//                                 "warning",

//                               showCancelButton: true,

//                               confirmButtonColor:
//                                 "#d33",

//                               cancelButtonColor:
//                                 "#64748b",

//                               confirmButtonText:
//                                 "Sí, eliminar",

//                               cancelButtonText:
//                                 "Cancelar",

//                             }).then((result) => {

//                               if (
//                                 result.isConfirmed &&
//                                 cierre._id
//                               ) {

//                                 mutate({

//                                   id:
//                                     cierre._id,

//                                   eliminadoPor:
//                                     perfil?.nombres!

//                                 });

//                               }

//                             });

//                           }}

//                           className="
//                             rounded-xl
//                             bg-red-100
//                             p-2
//                             text-red-600
//                             transition
//                             hover:scale-110
//                           "

//                         >

//                           <Trash2 className="h-5 w-5" />

//                         </button>

//                       </div>

//                     </td>

//                   </motion.tr>

//                 )

//               )}

//             </tbody>

//           </table>

//         </div>

//       </main>

//       <CierreCajaDetailModal />

//     </div>

//   );

// }
// src/views/cierreCaja/CierreCajaDetailView.tsx

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

import {
  Banknote,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import Swal from "sweetalert2";

import MenuList from "@/components/MenuList";
import CierreCajaDetailModal from "@/components/cierrecaja/CierreCajaDetailModal";

import {
  deleteCierreCajaById,
  getCierreCajaByCajaId,
} from "@/api/CierreCajaApi";

import type {
  CierreCajaType,
} from "@/types/CierreCajaType";

import {
  useAuth,
} from "@/hooks/useAuth";

function formatoBs(
  valor?: number
) {
  return `Bs. ${Number(
    valor || 0
  ).toFixed(2)}`;
}

function formatoFecha(
  fecha?: string
) {
  if (!fecha) {
    return "Sin fecha";
  }

  const valor =
    new Date(fecha);

  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return "Fecha inválida";
  }

  return valor.toLocaleString(
    "es-BO"
  );
}

function obtenerNombreCaja(
  cierre: CierreCajaType
) {
  if (
    typeof cierre.idCaja ===
    "string"
  ) {
    return cierre.idCaja;
  }

  return cierre.idCaja?.nombre ||
    "Sin caja";
}

function obtenerNombreUsuario(
  cierre: CierreCajaType
) {
  if (
    typeof cierre.idPerfil ===
    "string"
  ) {
    return cierre.idPerfil;
  }

  const nombre =
    [
      cierre.idPerfil?.nombres,
      cierre.idPerfil?.apellidos,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

  return nombre || "Sin usuario";
}

function obtenerColorEstado(
  estado: string
) {
  if (estado === "cuadrado") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (estado === "sobrante") {
    return "bg-blue-100 text-blue-700";
  }

  if (estado === "faltante") {
    return "bg-red-100 text-red-700";
  }

  if (estado === "anulado") {
    return "bg-slate-200 text-slate-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function CierreCajaDetailView() {
  const {
    sucursalId,
    cajaId,
  } = useParams();

  const queryClient =
    useQueryClient();

  const {
    data: perfil,
  } = useAuth();

  const {
    data: cierres = [],
    isLoading,
  } = useQuery({
    queryKey: [
      "cierresCaja",
      cajaId,
    ],

    queryFn: () =>
      getCierreCajaByCajaId(
        cajaId!
      ),

    enabled:
      Boolean(cajaId),

    retry:
      false,
  });

  const {
    mutate: anularCierre,
    isPending: anulando,
  } = useMutation({
    mutationFn:
      deleteCierreCajaById,

    onSuccess:
      async (
        data: {
          message?: string;
        }
      ) => {
        await Swal.fire({
          icon:
            "success",
          title:
            data?.message ||
            "Cierre anulado correctamente",
          timer:
            2000,
          showConfirmButton:
            false,
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "cierresCaja",
            cajaId,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "apertura-activa",
            cajaId,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "cajas-sucursal",
            sucursalId,
          ],
        });
      },

    onError:
      async (
        error: Error
      ) => {
        await Swal.fire({
          icon:
            "error",
          title:
            "No se pudo anular el cierre",
          text:
            error.message,
        });
      },
  });

  const handleAnularCierre =
    async (
      cierre: CierreCajaType
    ) => {
      if (!cierre._id) {
        await Swal.fire({
          icon:
            "error",
          title:
            "Cierre inválido",
          text:
            "No se encontró el ID del cierre.",
        });

        return;
      }

      const resultado =
        await Swal.fire({
          title:
            "¿Anular cierre?",
          text:
            "Esta acción cambiará el estado del cierre a anulado.",
          icon:
            "warning",
          input:
            "textarea",
          inputLabel:
            "Motivo de anulación",
          inputPlaceholder:
            "Ejemplo: error en el arqueo, cierre duplicado, etc.",
          inputAttributes: {
            maxlength:
              "300",
          },
          showCancelButton:
            true,
          confirmButtonColor:
            "#d33",
          cancelButtonColor:
            "#64748b",
          confirmButtonText:
            "Sí, anular",
          cancelButtonText:
            "Cancelar",
          inputValidator:
            (value) => {
              if (
                !value ||
                !value.trim()
              ) {
                return "Debes escribir un motivo.";
              }

              return null;
            },
        });

      if (
        !resultado.isConfirmed
      ) {
        return;
      }

      anularCierre({
        id:
          cierre._id,
        motivo:
          String(
            resultado.value ||
            "Cierre anulado"
          ),
        eliminadoPor:
          String(
            perfil?._id ||
            "sistema"
          ),
      });
    };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MenuList />

      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Cierres de Caja
            </h1>

            <p className="mt-2 text-slate-500">
              Historial de cierres de la caja seleccionada
            </p>
          </div>

          <Link
            to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre/create`}
            className="flex items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Nuevo Cierre
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                    Caja
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                    Usuario
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                    Fecha Apertura
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                    Fecha Cierre
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                    Esperado
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                    Real
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                    Diferencia
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
                {cierres.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No hay cierres registrados para esta caja.
                    </td>
                  </tr>
                ) : (
                  cierres.map(
                    (
                      cierre: CierreCajaType
                    ) => (
                      <motion.tr
                        key={cierre._id}
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
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold text-slate-700">
                            {obtenerNombreCaja(
                              cierre
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-700">
                          {obtenerNombreUsuario(
                            cierre
                          )}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {formatoFecha(
                            cierre.fechaApertura
                          )}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {formatoFecha(
                            cierre.fechaCierre
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 font-bold text-emerald-600">
                            <Banknote className="h-4 w-4" />

                            {formatoBs(
                              cierre.totalEsperadoEfectivo
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 font-bold text-sky-600">
                          {formatoBs(
                            cierre.montoReal
                          )}
                        </td>

                        <td
                          className={`
                            px-6 py-5 font-bold
                            ${
                              cierre.diferencia === 0
                                ? "text-emerald-600"
                                : cierre.diferencia > 0
                                  ? "text-blue-600"
                                  : "text-red-600"
                            }
                          `}
                        >
                          {formatoBs(
                            cierre.diferencia
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-bold
                              capitalize
                              ${obtenerColorEstado(
                                cierre.estado
                              )}
                            `}
                          >
                            {cierre.estado}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              to={`?detail=${cierre._id}`}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition hover:scale-110"
                              title="Ver detalle"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>

                            {cierre.estado !== "anulado" && (
                              <Link
                                to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre/${cierre._id}/edit`}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition hover:scale-110"
                                title="Editar observación"
                              >
                                <Pencil className="h-5 w-5" />
                              </Link>
                            )}

                            {cierre.estado !== "anulado" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAnularCierre(
                                    cierre
                                  )
                                }
                                disabled={anulando}
                                className="rounded-xl bg-red-100 p-2 text-red-600 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Anular cierre"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CierreCajaDetailModal />
    </div>
  );
}