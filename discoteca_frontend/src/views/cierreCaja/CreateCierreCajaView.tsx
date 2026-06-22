// // src/views/cierreCaja/CreateCierreCajaView.tsx

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   Link,
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import {
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";

// import {
//   motion,
// } from "framer-motion";

// import {
//   ArrowLeft,
//   Wallet,
// } from "lucide-react";

// import Swal from "sweetalert2";

// import MenuList from "@/components/MenuList";
// import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

// import {
//   createCierreCaja,
// } from "@/api/CierreCajaApi";

// import {
//   getAperturaActivaByCaja,
// } from "@/api/AperturaCajaApi";

// import type {
//   CierreCajaForm as CierreCajaFormType,
// } from "@/types/CierreCajaType";

// import { useAuth } from "@/hooks/useAuth";

// function obtenerFechaLocal(): string {

//   const ahora =
//     new Date();

//   const compensacion =
//     ahora.getTimezoneOffset() *
//     60000;

//   return new Date(
//     ahora.getTime() -
//     compensacion
//   )
//     .toISOString()
//     .slice(0, 10);
// }

// function obtenerHoraLocal(): string {

//   return new Date()
//     .toTimeString()
//     .slice(0, 5);
// }

// function fechaLocalDesdeIso(
//   fechaIso: string
// ): string {

//   const fecha =
//     new Date(fechaIso);

//   const compensacion =
//     fecha.getTimezoneOffset() *
//     60000;

//   return new Date(
//     fecha.getTime() -
//     compensacion
//   )
//     .toISOString()
//     .slice(0, 10);
// }

// export default function CreateCierreCajaView() {

//   const navigate =
//     useNavigate();

//   const queryClient =
//     useQueryClient();

//   const {
//     sucursalId,
//     cajaId,
//   } = useParams();

//   const {
//     data: perfil,
//   } = useAuth();

//   const {
//     data: aperturaActiva,
//     isLoading:
//       cargandoApertura,
//   } = useQuery({

//     queryKey: [
//       "apertura-activa",
//       cajaId,
//     ],

//     queryFn: () =>
//       getAperturaActivaByCaja(
//         cajaId!
//       ),

//     enabled:
//       Boolean(cajaId),

//     retry:
//       false,
//   });

//   const [
//     formData,
//     setFormData,
//   ] = useState<CierreCajaFormType>({
//     idPerfil: "",
//     idCaja:
//       cajaId || "",
//     fecha:
//       obtenerFechaLocal(),
//     horaCierre:
//       obtenerHoraLocal(),
//     montoReal: 0,
//     observacion: "",
//     creadoPor: perfil._id!,
//   });

//   useEffect(() => {

//     if (!perfil?._id) {
//       return;
//     }

//     setFormData(
//       (actual) => ({
//         ...actual,
//         idPerfil:
//           String(perfil._id),
//         creadoPor:
//           perfil._id ||
//           "sistema",
//       })
//     );

//   }, [
//     perfil,
//   ]);

//   useEffect(() => {

//     if (
//       !aperturaActiva
//         ?.fechaApertura
//     ) {
//       return;
//     }

//     /*
//       Usamos como fecha de referencia
//       el día en que comenzó la apertura.
//       Si la hora de cierre es menor,
//       el backend pasa al día siguiente.
//     */
//     setFormData(
//       (actual) => ({
//         ...actual,
//         fecha:
//           fechaLocalDesdeIso(
//             aperturaActiva
//               .fechaApertura
//           ),
//       })
//     );

//   }, [
//     aperturaActiva,
//   ]);

//   const {
//     mutate,
//     isPending,
//   } = useMutation({

//     mutationFn:
//       createCierreCaja,

//     onSuccess:
//       async (
//         reporte
//       ) => {

//         await Promise.all([

//           queryClient.invalidateQueries({
//             queryKey: [
//               "cierresCaja",
//               cajaId,
//             ],
//           }),

//           queryClient.invalidateQueries({
//             queryKey: [
//               "aperturasCaja",
//               cajaId,
//             ],
//           }),

//           queryClient.invalidateQueries({
//             queryKey: [
//               "apertura-activa",
//               cajaId,
//             ],
//           }),

//           queryClient.invalidateQueries({
//             queryKey: [
//               "cajas-sucursal",
//               sucursalId,
//             ],
//           }),

//           queryClient.invalidateQueries({
//             queryKey: [
//               "movimientos",
//             ],
//           }),

//         ]);

//         await Swal.fire({
//           icon:
//             reporte.resumen.estado ===
//             "cuadrado"
//               ? "success"
//               : "warning",

//           title:
//             reporte.message,

//           html: `
//             <div style="text-align:left">
//               <p><b>Ventas:</b> Bs. ${reporte.resumen.totalVentas.toFixed(2)}</p>
//               <p><b>Egresos:</b> Bs. ${reporte.resumen.totalEgresos.toFixed(2)}</p>
//               <p><b>Efectivo esperado:</b> Bs. ${reporte.resumen.totalEsperadoEfectivo.toFixed(2)}</p>
//               <p><b>Efectivo contado:</b> Bs. ${reporte.resumen.montoReal.toFixed(2)}</p>
//               <p><b>Diferencia:</b> Bs. ${reporte.resumen.diferencia.toFixed(2)}</p>
//               <p><b>Estado:</b> ${reporte.resumen.estado}</p>
//               <p><b>Duración:</b> ${reporte.jornada.duracionMinutos} minutos</p>
//             </div>
//           `,

//           confirmButtonText:
//             "Ver historial",
//         });

//         navigate(
//           `/sucursal/${sucursalId}/caja/${cajaId}/cierre`
//         );
//       },

//     onError:
//       async (
//         error: Error
//       ) => {

//         await Swal.fire({
//           icon:
//             "error",
//           title:
//             "No se pudo cerrar la caja",
//           text:
//             error.message,
//         });
//       },
//   });

//   const handleSubmit = (
//     event:
//       React.FormEvent<HTMLFormElement>
//   ) => {

//     event.preventDefault();

//     if (!aperturaActiva) {
//       Swal.fire({
//         icon:
//           "error",
//         title:
//           "Caja sin apertura",
//         text:
//           "La caja no tiene una apertura activa.",
//       });

//       return;
//     }

//     mutate(formData);
//   };

//   if (cargandoApertura) {

//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50">
//         <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600" />
//       </div>
//     );
//   }

//   return (

//     <div className="flex min-h-screen bg-slate-50">

//       <MenuList />

//       <main className="flex-1 p-4 md:p-8">

//         <div className="mb-8">

//           <Link
//             to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre`}
//             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-fuchsia-600"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Link>

//         </div>

//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 20,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8"
//         >

//           <div className="mb-8">

//             <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">
//               <Wallet className="h-8 w-8 text-fuchsia-600" />
//               Cerrar caja
//             </h1>

//             <p className="mt-2 text-slate-500">
//               El sistema calculará automáticamente el reporte de la jornada.
//             </p>

//           </div>

//           {aperturaActiva ? (

//             <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">

//               <p>
//                 <b>Apertura:</b>{" "}
//                 {new Date(
//                   aperturaActiva.fechaApertura
//                 ).toLocaleString()}
//               </p>

//               <p>
//                 <b>Monto inicial:</b>{" "}
//                 Bs.{" "}
//                 {Number(
//                   aperturaActiva.montoInicial
//                 ).toFixed(2)}
//               </p>

//             </div>

//           ) : (

//             <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
//               La caja no tiene una apertura activa.
//             </div>

//           )}

//           <CierreCajaForm
//             formData={formData}
//             setFormData={setFormData}
//             onSubmit={handleSubmit}
//             loading={
//               isPending ||
//               !aperturaActiva
//             }
//             submitText="Cerrar caja y generar reporte"
//           />

//         </motion.div>

//       </main>

//     </div>
//   );
// }

// src/views/cierreCaja/CreateCierreCajaView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
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
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Gift,
  LoaderCircle,
  ReceiptText,
  ShoppingCart,
  Wallet,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

import MenuList from "@/components/MenuList";
import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

import {
  createCierreCaja,
  previewCierreCaja,
} from "@/api/CierreCajaApi";

import {
  getAperturaActivaByCaja,
} from "@/api/AperturaCajaApi";

import type {
  CierreCajaForm as CierreCajaFormType,
  ReporteCierreCajaType,
} from "@/types/CierreCajaType";

import { useAuth } from "@/hooks/useAuth";

/* =====================================================
    FECHAS
===================================================== */

function obtenerFechaLocal(): string {
  const ahora =
    new Date();

  const compensacion =
    ahora.getTimezoneOffset() *
    60000;

  return new Date(
    ahora.getTime() -
      compensacion
  )
    .toISOString()
    .slice(0, 10);
}

function obtenerHoraLocal(): string {
  return new Date()
    .toTimeString()
    .slice(0, 5);
}

function fechaLocalDesdeIso(
  fechaIso: string
): string {
  const fecha =
    new Date(fechaIso);

  const compensacion =
    fecha.getTimezoneOffset() *
    60000;

  return new Date(
    fecha.getTime() -
      compensacion
  )
    .toISOString()
    .slice(0, 10);
}

function formatoFechaHora(
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

function formatoBs(
  valor?: number
) {
  return `Bs. ${Number(
    valor || 0
  ).toFixed(2)}`;
}

function getEstadoClass(
  estado?: string
) {
  if (estado === "cuadrado") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (estado === "sobrante") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (estado === "faltante") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

/* =====================================================
    MODAL REPORTE
===================================================== */

function ReporteCierreModal({
  reporte,
  onClose,
  onConfirmar,
  confirmando,
}: {
  reporte: ReporteCierreCajaType | null;
  onClose: () => void;
  onConfirmar: () => void;
  confirmando: boolean;
}) {
  if (!reporte) {
    return null;
  }

  const resumen =
    reporte.resumen;

  const general =
    reporte.general;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-3 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              Reporte preliminar
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Cierre de caja
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {general.sucursal} · {general.caja}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={confirmando}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="mb-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Responsable
              </p>
              <p className="mt-1 font-black text-slate-800">
                {general.responsableCierre}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Apertura
              </p>
              <p className="mt-1 font-black text-slate-800">
                {formatoFechaHora(
                  general.fechaApertura
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Cierre
              </p>
              <p className="mt-1 font-black text-slate-800">
                {formatoFechaHora(
                  general.fechaCierre
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Duración
              </p>
              <p className="mt-1 font-black text-slate-800">
                {general.duracionMinutos} min
              </p>
            </div>
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500">
                <Wallet className="h-5 w-5" />
                <p className="text-xs font-black uppercase">
                  Monto inicial
                </p>
              </div>

              <p className="text-2xl font-black text-slate-900">
                {formatoBs(
                  resumen.montoInicial
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <ShoppingCart className="h-5 w-5" />
                <p className="text-xs font-black uppercase">
                  Ventas
                </p>
              </div>

              <p className="text-2xl font-black text-emerald-700">
                {formatoBs(
                  resumen.totalVentas
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-red-700">
                <Banknote className="h-5 w-5" />
                <p className="text-xs font-black uppercase">
                  Egresos
                </p>
              </div>

              <p className="text-2xl font-black text-red-700">
                {formatoBs(
                  resumen.totalEgresos
                )}
              </p>
            </div>

            <div className={`rounded-2xl border p-4 ${getEstadoClass(resumen.estado)}`}>
              <div className="mb-2 flex items-center gap-2">
                {resumen.estado === "cuadrado" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}

                <p className="text-xs font-black uppercase">
                  Estado
                </p>
              </div>

              <p className="text-2xl font-black capitalize">
                {resumen.estado}
              </p>
            </div>
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">
                Total esperado
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                {formatoBs(
                  resumen.totalEsperadoGeneral ??
                    resumen.totalEsperadoEfectivo
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">
                Monto real verificado
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                {formatoBs(
                  resumen.montoReal
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">
                Diferencia
              </p>

              <p className={`mt-1 text-2xl font-black ${
                resumen.diferencia === 0
                  ? "text-emerald-600"
                  : resumen.diferencia > 0
                    ? "text-blue-600"
                    : "text-red-600"
              }`}>
                {formatoBs(
                  resumen.diferencia
                )}
              </p>
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
              <ReceiptText className="h-5 w-5 text-fuchsia-600" />
              Ingresos por mesero
            </h3>

            {reporte.ingresosPorMesero.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No hay ventas registradas para este cierre.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase text-slate-400">
                      <th className="py-3 pr-4">Mesero</th>
                      <th className="py-3 pr-4 text-right">Efectivo</th>
                      <th className="py-3 pr-4 text-right">QR</th>
                      <th className="py-3 pr-4 text-right">Transferencia</th>
                      <th className="py-3 pr-4 text-right">Mixto</th>
                      <th className="py-3 pr-4 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reporte.ingresosPorMesero.map(
                      (mesero) => (
                        <tr
                          key={mesero.idPerfil}
                          className="border-b border-slate-100"
                        >
                          <td className="py-3 pr-4 font-bold text-slate-800">
                            {mesero.nombreMesero}
                          </td>

                          <td className="py-3 pr-4 text-right">
                            {formatoBs(mesero.efectivo)}
                          </td>

                          <td className="py-3 pr-4 text-right">
                            {formatoBs(mesero.qr)}
                          </td>

                          <td className="py-3 pr-4 text-right">
                            {formatoBs(mesero.transferencia)}
                          </td>

                          <td className="py-3 pr-4 text-right">
                            {formatoBs(mesero.mixto)}
                          </td>

                          <td className="py-3 pr-4 text-right font-black text-fuchsia-700">
                            {formatoBs(mesero.totalVentas)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-black text-slate-800">
                Egresos
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Registrados: {resumen.cantidadEgresos}
              </p>

              <p className="mt-2 text-xl font-black text-red-600">
                {formatoBs(
                  resumen.totalEgresos
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="flex items-center gap-2 font-black text-slate-800">
                <Gift className="h-5 w-5 text-violet-600" />
                Cortesías
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Cantidad: {resumen.cantidadCortesias ?? 0}
              </p>

              <p className="mt-2 text-xl font-black text-violet-600">
                {formatoBs(
                  resumen.totalCortesias
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-black text-slate-800">
                Anulaciones
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Ventas anuladas: {resumen.cantidadVentasAnuladas ?? 0}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Comandas anuladas: {resumen.cantidadComandasAnuladas ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Revisa bien el reporte antes de cerrar. Después de confirmar, la apertura quedará cerrada.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={confirmando}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirmar}
              disabled={confirmando}
              className="inline-flex items-center gap-2 rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-black text-white transition hover:bg-fuchsia-700 disabled:opacity-50"
            >
              {confirmando && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}

              Confirmar cierre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
    VIEW PRINCIPAL
===================================================== */

export default function CreateCierreCajaView() {
  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    sucursalId,
    cajaId,
  } = useParams();

  const {
    data: perfil,
  } = useAuth();

  const [
    reportePreview,
    setReportePreview,
  ] =
    useState<ReporteCierreCajaType | null>(
      null
    );

  const {
    data: aperturaActiva,
    isLoading:
      cargandoApertura,
  } = useQuery({
    queryKey: [
      "apertura-activa",
      cajaId,
    ],

    queryFn: () =>
      getAperturaActivaByCaja(
        cajaId!
      ),

    enabled:
      Boolean(cajaId),

    retry:
      false,
  });

  const [
    formData,
    setFormData,
  ] = useState<CierreCajaFormType>({
    idPerfil: "",
    idCaja:
      cajaId || "",
    idSucursal:
      sucursalId || "",
    fecha:
      obtenerFechaLocal(),
    horaCierre:
      obtenerHoraLocal(),
    montoReal: 0,
    observacion: "",
    creadoPor: "",
  });

  useEffect(() => {
    setFormData(
      (actual) => ({
        ...actual,
        idCaja:
          cajaId || "",
        idSucursal:
          sucursalId || "",
      })
    );
  }, [
    cajaId,
    sucursalId,
  ]);

  useEffect(() => {
    if (!perfil?._id) {
      return;
    }

    setFormData(
      (actual) => ({
        ...actual,
        idPerfil:
          String(perfil._id),
        creadoPor:
          String(perfil._id),
      })
    );
  }, [
    perfil,
  ]);

  useEffect(() => {
    if (
      !aperturaActiva
        ?.fechaApertura
    ) {
      return;
    }

    setFormData(
      (actual) => ({
        ...actual,
        fecha:
          fechaLocalDesdeIso(
            aperturaActiva
              .fechaApertura
          ),
      })
    );
  }, [
    aperturaActiva,
  ]);

  const invalidarConsultas =
    async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "cierresCaja",
            cajaId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "aperturasCaja",
            cajaId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "apertura-activa",
            cajaId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "cajas-sucursal",
            sucursalId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "movimientos",
          ],
        }),
      ]);
    };

  const {
    mutate: generarPreview,
    isPending: generandoPreview,
  } = useMutation({
    mutationFn: () =>
      previewCierreCaja({
        cajaId:
          cajaId || "",
        idSucursal:
          sucursalId || "",
        idPerfil:
          String(perfil?._id || ""),
        montoReal:
          Number(
            formData.montoReal || 0
          ),
      }),

    onSuccess:
      (reporte) => {
        setReportePreview(
          reporte
        );
      },

    onError:
      async (
        error: Error
      ) => {
        await Swal.fire({
          icon:
            "error",
          title:
            "No se pudo generar el preview",
          text:
            error.message,
        });
      },
  });

  const {
    mutate: cerrarCaja,
    isPending: cerrandoCaja,
  } = useMutation({
    mutationFn: () =>
      createCierreCaja(
        formData
      ),

    onSuccess:
      async (
        reporte
      ) => {
        await invalidarConsultas();

        setReportePreview(
          null
        );

        await Swal.fire({
          icon:
            reporte.resumen.estado ===
            "cuadrado"
              ? "success"
              : "warning",

          title:
            reporte.message,

          html: `
            <div style="text-align:left">
              <p><b>Ventas:</b> Bs. ${Number(reporte.resumen.totalVentas || 0).toFixed(2)}</p>
              <p><b>Egresos:</b> Bs. ${Number(reporte.resumen.totalEgresos || 0).toFixed(2)}</p>
              <p><b>Total esperado:</b> Bs. ${Number(
                reporte.resumen.totalEsperadoGeneral ??
                reporte.resumen.totalEsperadoEfectivo ??
                0
              ).toFixed(2)}</p>
              <p><b>Monto real:</b> Bs. ${Number(reporte.resumen.montoReal || 0).toFixed(2)}</p>
              <p><b>Diferencia:</b> Bs. ${Number(reporte.resumen.diferencia || 0).toFixed(2)}</p>
              <p><b>Estado:</b> ${reporte.resumen.estado}</p>
              <p><b>Duración:</b> ${reporte.general.duracionMinutos} minutos</p>
            </div>
          `,

          confirmButtonText:
            "Ver historial",
        });

        navigate(
          `/sucursal/${sucursalId}/caja/${cajaId}/cierre`
        );
      },

    onError:
      async (
        error: Error
      ) => {
        await Swal.fire({
          icon:
            "error",
          title:
            "No se pudo cerrar la caja",
          text:
            error.message,
        });
      },
  });

  const validarFormulario =
    () => {
      if (!aperturaActiva) {
        Swal.fire({
          icon:
            "error",
          title:
            "Caja sin apertura",
          text:
            "La caja no tiene una apertura activa.",
        });

        return false;
      }

      if (!perfil?._id) {
        Swal.fire({
          icon:
            "error",
          title:
            "Perfil no cargado",
          text:
            "No se pudo identificar al usuario que cerrará la caja.",
        });

        return false;
      }

      if (!cajaId) {
        Swal.fire({
          icon:
            "error",
          title:
            "Caja no válida",
          text:
            "No se encontró el ID de la caja.",
        });

        return false;
      }

      if (!sucursalId) {
        Swal.fire({
          icon:
            "error",
          title:
            "Sucursal no válida",
          text:
            "No se encontró el ID de la sucursal.",
        });

        return false;
      }

      return true;
    };

  const handlePreview =
    () => {
      if (!validarFormulario()) {
        return;
      }

      generarPreview();
    };

  const handleSubmit = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    /*
      En vez de cerrar directamente,
      primero abrimos el preview.
    */
    generarPreview();
  };

  const handleConfirmarCierre =
    async () => {
      if (!validarFormulario()) {
        return;
      }

      const resultado =
        await Swal.fire({
          icon:
            "warning",
          title:
            "¿Confirmar cierre de caja?",
          text:
            "Después de cerrar, la apertura quedará cerrada y ya no se podrán registrar movimientos en esta caja.",
          showCancelButton:
            true,
          confirmButtonText:
            "Sí, cerrar caja",
          cancelButtonText:
            "Cancelar",
          confirmButtonColor:
            "#c026d3",
        });

      if (!resultado.isConfirmed) {
        return;
      }

      cerrarCaja();
    };

  if (cargandoApertura) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MenuList />

      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <Link
            to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-fuchsia-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8"
        >
          <div className="mb-8">
            <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">
              <Wallet className="h-8 w-8 text-fuchsia-600" />
              Cerrar caja
            </h1>

            <p className="mt-2 text-slate-500">
              El sistema centralizará ventas por mesero, egresos, cortesías, comandas anuladas e inventario afectado.
            </p>
          </div>

          {aperturaActiva ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p>
                <b>Apertura:</b>{" "}
                {new Date(
                  aperturaActiva.fechaApertura
                ).toLocaleString()}
              </p>

              <p>
                <b>Monto inicial:</b>{" "}
                {formatoBs(
                  Number(
                    aperturaActiva.montoInicial
                  )
                )}
              </p>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              La caja no tiene una apertura activa.
            </div>
          )}

          <CierreCajaForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onPreview={handlePreview}
            loading={
              cerrandoCaja ||
              !aperturaActiva
            }
            previewLoading={
              generandoPreview
            }
            submitText="Revisar y cerrar caja"
          />
        </motion.div>
      </main>

      <ReporteCierreModal
        reporte={reportePreview}
        onClose={() =>
          setReportePreview(null)
        }
        onConfirmar={
          handleConfirmarCierre
        }
        confirmando={
          cerrandoCaja
        }
      />
    </div>
  );
}