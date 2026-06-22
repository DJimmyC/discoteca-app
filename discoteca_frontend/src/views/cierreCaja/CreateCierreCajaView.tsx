// // // // src/views/cierreCaja/CreateCierreCajaView.tsx

// // // import {
// // //   useEffect,
// // //   useState,
// // // } from "react";

// // // import {
// // //   Link,
// // //   useNavigate,
// // //   useParams,
// // // } from "react-router-dom";

// // // import {
// // //   useMutation,
// // //   useQuery,
// // //   useQueryClient,
// // // } from "@tanstack/react-query";

// // // import {
// // //   motion,
// // // } from "framer-motion";

// // // import {
// // //   ArrowLeft,
// // //   Wallet,
// // // } from "lucide-react";

// // // import Swal from "sweetalert2";

// // // import MenuList from "@/components/MenuList";
// // // import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

// // // import {
// // //   createCierreCaja,
// // // } from "@/api/CierreCajaApi";

// // // import {
// // //   getAperturaActivaByCaja,
// // // } from "@/api/AperturaCajaApi";

// // // import type {
// // //   CierreCajaForm as CierreCajaFormType,
// // // } from "@/types/CierreCajaType";

// // // import { useAuth } from "@/hooks/useAuth";

// // // function obtenerFechaLocal(): string {

// // //   const ahora =
// // //     new Date();

// // //   const compensacion =
// // //     ahora.getTimezoneOffset() *
// // //     60000;

// // //   return new Date(
// // //     ahora.getTime() -
// // //     compensacion
// // //   )
// // //     .toISOString()
// // //     .slice(0, 10);
// // // }

// // // function obtenerHoraLocal(): string {

// // //   return new Date()
// // //     .toTimeString()
// // //     .slice(0, 5);
// // // }

// // // function fechaLocalDesdeIso(
// // //   fechaIso: string
// // // ): string {

// // //   const fecha =
// // //     new Date(fechaIso);

// // //   const compensacion =
// // //     fecha.getTimezoneOffset() *
// // //     60000;

// // //   return new Date(
// // //     fecha.getTime() -
// // //     compensacion
// // //   )
// // //     .toISOString()
// // //     .slice(0, 10);
// // // }

// // // export default function CreateCierreCajaView() {

// // //   const navigate =
// // //     useNavigate();

// // //   const queryClient =
// // //     useQueryClient();

// // //   const {
// // //     sucursalId,
// // //     cajaId,
// // //   } = useParams();

// // //   const {
// // //     data: perfil,
// // //   } = useAuth();

// // //   const {
// // //     data: aperturaActiva,
// // //     isLoading:
// // //       cargandoApertura,
// // //   } = useQuery({

// // //     queryKey: [
// // //       "apertura-activa",
// // //       cajaId,
// // //     ],

// // //     queryFn: () =>
// // //       getAperturaActivaByCaja(
// // //         cajaId!
// // //       ),

// // //     enabled:
// // //       Boolean(cajaId),

// // //     retry:
// // //       false,
// // //   });

// // //   const [
// // //     formData,
// // //     setFormData,
// // //   ] = useState<CierreCajaFormType>({
// // //     idPerfil: "",
// // //     idCaja:
// // //       cajaId || "",
// // //     fecha:
// // //       obtenerFechaLocal(),
// // //     horaCierre:
// // //       obtenerHoraLocal(),
// // //     montoReal: 0,
// // //     observacion: "",
// // //     creadoPor: perfil._id!,
// // //   });

// // //   useEffect(() => {

// // //     if (!perfil?._id) {
// // //       return;
// // //     }

// // //     setFormData(
// // //       (actual) => ({
// // //         ...actual,
// // //         idPerfil:
// // //           String(perfil._id),
// // //         creadoPor:
// // //           perfil._id ||
// // //           "sistema",
// // //       })
// // //     );

// // //   }, [
// // //     perfil,
// // //   ]);

// // //   useEffect(() => {

// // //     if (
// // //       !aperturaActiva
// // //         ?.fechaApertura
// // //     ) {
// // //       return;
// // //     }

// // //     /*
// // //       Usamos como fecha de referencia
// // //       el día en que comenzó la apertura.
// // //       Si la hora de cierre es menor,
// // //       el backend pasa al día siguiente.
// // //     */
// // //     setFormData(
// // //       (actual) => ({
// // //         ...actual,
// // //         fecha:
// // //           fechaLocalDesdeIso(
// // //             aperturaActiva
// // //               .fechaApertura
// // //           ),
// // //       })
// // //     );

// // //   }, [
// // //     aperturaActiva,
// // //   ]);

// // //   const {
// // //     mutate,
// // //     isPending,
// // //   } = useMutation({

// // //     mutationFn:
// // //       createCierreCaja,

// // //     onSuccess:
// // //       async (
// // //         reporte
// // //       ) => {

// // //         await Promise.all([

// // //           queryClient.invalidateQueries({
// // //             queryKey: [
// // //               "cierresCaja",
// // //               cajaId,
// // //             ],
// // //           }),

// // //           queryClient.invalidateQueries({
// // //             queryKey: [
// // //               "aperturasCaja",
// // //               cajaId,
// // //             ],
// // //           }),

// // //           queryClient.invalidateQueries({
// // //             queryKey: [
// // //               "apertura-activa",
// // //               cajaId,
// // //             ],
// // //           }),

// // //           queryClient.invalidateQueries({
// // //             queryKey: [
// // //               "cajas-sucursal",
// // //               sucursalId,
// // //             ],
// // //           }),

// // //           queryClient.invalidateQueries({
// // //             queryKey: [
// // //               "movimientos",
// // //             ],
// // //           }),

// // //         ]);

// // //         await Swal.fire({
// // //           icon:
// // //             reporte.resumen.estado ===
// // //             "cuadrado"
// // //               ? "success"
// // //               : "warning",

// // //           title:
// // //             reporte.message,

// // //           html: `
// // //             <div style="text-align:left">
// // //               <p><b>Ventas:</b> Bs. ${reporte.resumen.totalVentas.toFixed(2)}</p>
// // //               <p><b>Egresos:</b> Bs. ${reporte.resumen.totalEgresos.toFixed(2)}</p>
// // //               <p><b>Efectivo esperado:</b> Bs. ${reporte.resumen.totalEsperadoEfectivo.toFixed(2)}</p>
// // //               <p><b>Efectivo contado:</b> Bs. ${reporte.resumen.montoReal.toFixed(2)}</p>
// // //               <p><b>Diferencia:</b> Bs. ${reporte.resumen.diferencia.toFixed(2)}</p>
// // //               <p><b>Estado:</b> ${reporte.resumen.estado}</p>
// // //               <p><b>Duración:</b> ${reporte.jornada.duracionMinutos} minutos</p>
// // //             </div>
// // //           `,

// // //           confirmButtonText:
// // //             "Ver historial",
// // //         });

// // //         navigate(
// // //           `/sucursal/${sucursalId}/caja/${cajaId}/cierre`
// // //         );
// // //       },

// // //     onError:
// // //       async (
// // //         error: Error
// // //       ) => {

// // //         await Swal.fire({
// // //           icon:
// // //             "error",
// // //           title:
// // //             "No se pudo cerrar la caja",
// // //           text:
// // //             error.message,
// // //         });
// // //       },
// // //   });

// // //   const handleSubmit = (
// // //     event:
// // //       React.FormEvent<HTMLFormElement>
// // //   ) => {

// // //     event.preventDefault();

// // //     if (!aperturaActiva) {
// // //       Swal.fire({
// // //         icon:
// // //           "error",
// // //         title:
// // //           "Caja sin apertura",
// // //         text:
// // //           "La caja no tiene una apertura activa.",
// // //       });

// // //       return;
// // //     }

// // //     mutate(formData);
// // //   };

// // //   if (cargandoApertura) {

// // //     return (
// // //       <div className="flex min-h-screen items-center justify-center bg-slate-50">
// // //         <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600" />
// // //       </div>
// // //     );
// // //   }

// // //   return (

// // //     <div className="flex min-h-screen bg-slate-50">

// // //       <MenuList />

// // //       <main className="flex-1 p-4 md:p-8">

// // //         <div className="mb-8">

// // //           <Link
// // //             to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre`}
// // //             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-fuchsia-600"
// // //           >
// // //             <ArrowLeft className="h-4 w-4" />
// // //             Volver
// // //           </Link>

// // //         </div>

// // //         <motion.div
// // //           initial={{
// // //             opacity: 0,
// // //             y: 20,
// // //           }}
// // //           animate={{
// // //             opacity: 1,
// // //             y: 0,
// // //           }}
// // //           className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8"
// // //         >

// // //           <div className="mb-8">

// // //             <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">
// // //               <Wallet className="h-8 w-8 text-fuchsia-600" />
// // //               Cerrar caja
// // //             </h1>

// // //             <p className="mt-2 text-slate-500">
// // //               El sistema calculará automáticamente el reporte de la jornada.
// // //             </p>

// // //           </div>

// // //           {aperturaActiva ? (

// // //             <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">

// // //               <p>
// // //                 <b>Apertura:</b>{" "}
// // //                 {new Date(
// // //                   aperturaActiva.fechaApertura
// // //                 ).toLocaleString()}
// // //               </p>

// // //               <p>
// // //                 <b>Monto inicial:</b>{" "}
// // //                 Bs.{" "}
// // //                 {Number(
// // //                   aperturaActiva.montoInicial
// // //                 ).toFixed(2)}
// // //               </p>

// // //             </div>

// // //           ) : (

// // //             <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
// // //               La caja no tiene una apertura activa.
// // //             </div>

// // //           )}

// // //           <CierreCajaForm
// // //             formData={formData}
// // //             setFormData={setFormData}
// // //             onSubmit={handleSubmit}
// // //             loading={
// // //               isPending ||
// // //               !aperturaActiva
// // //             }
// // //             submitText="Cerrar caja y generar reporte"
// // //           />

// // //         </motion.div>

// // //       </main>

// // //     </div>
// // //   );
// // // }

// // // src/views/cierreCaja/CreateCierreCajaView.tsx

// // import {
// //   useEffect,
// //   useState,
// // } from "react";

// // import {
// //   Link,
// //   useNavigate,
// //   useParams,
// // } from "react-router-dom";

// // import {
// //   useMutation,
// //   useQuery,
// //   useQueryClient,
// // } from "@tanstack/react-query";

// // import {
// //   motion,
// // } from "framer-motion";

// // import {
// //   AlertTriangle,
// //   ArrowLeft,
// //   Banknote,
// //   CheckCircle2,
// //   Gift,
// //   LoaderCircle,
// //   ReceiptText,
// //   ShoppingCart,
// //   Wallet,
// //   X,
// // } from "lucide-react";

// // import Swal from "sweetalert2";

// // import MenuList from "@/components/MenuList";
// // import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

// // import {
// //   createCierreCaja,
// //   previewCierreCaja,
// // } from "@/api/CierreCajaApi";

// // import {
// //   getAperturaActivaByCaja,
// // } from "@/api/AperturaCajaApi";

// // import type {
// //   CierreCajaForm as CierreCajaFormType,
// //   ReporteCierreCajaType,
// // } from "@/types/CierreCajaType";

// // import { useAuth } from "@/hooks/useAuth";

// // /* =====================================================
// //     FECHAS
// // ===================================================== */

// // function obtenerFechaLocal(): string {
// //   const ahora =
// //     new Date();

// //   const compensacion =
// //     ahora.getTimezoneOffset() *
// //     60000;

// //   return new Date(
// //     ahora.getTime() -
// //       compensacion
// //   )
// //     .toISOString()
// //     .slice(0, 10);
// // }

// // function obtenerHoraLocal(): string {
// //   return new Date()
// //     .toTimeString()
// //     .slice(0, 5);
// // }

// // function fechaLocalDesdeIso(
// //   fechaIso: string
// // ): string {
// //   const fecha =
// //     new Date(fechaIso);

// //   const compensacion =
// //     fecha.getTimezoneOffset() *
// //     60000;

// //   return new Date(
// //     fecha.getTime() -
// //       compensacion
// //   )
// //     .toISOString()
// //     .slice(0, 10);
// // }

// // function formatoFechaHora(
// //   fecha?: string
// // ) {
// //   if (!fecha) {
// //     return "Sin fecha";
// //   }

// //   const valor =
// //     new Date(fecha);

// //   if (
// //     Number.isNaN(
// //       valor.getTime()
// //     )
// //   ) {
// //     return "Fecha inválida";
// //   }

// //   return valor.toLocaleString(
// //     "es-BO"
// //   );
// // }

// // function formatoBs(
// //   valor?: number
// // ) {
// //   return `Bs. ${Number(
// //     valor || 0
// //   ).toFixed(2)}`;
// // }

// // function getEstadoClass(
// //   estado?: string
// // ) {
// //   if (estado === "cuadrado") {
// //     return "border-emerald-200 bg-emerald-50 text-emerald-700";
// //   }

// //   if (estado === "sobrante") {
// //     return "border-blue-200 bg-blue-50 text-blue-700";
// //   }

// //   if (estado === "faltante") {
// //     return "border-red-200 bg-red-50 text-red-700";
// //   }

// //   return "border-slate-200 bg-slate-50 text-slate-700";
// // }

// // /* =====================================================
// //     MODAL REPORTE
// // ===================================================== */

// // function ReporteCierreModal({
// //   reporte,
// //   onClose,
// //   onConfirmar,
// //   confirmando,
// // }: {
// //   reporte: ReporteCierreCajaType | null;
// //   onClose: () => void;
// //   onConfirmar: () => void;
// //   confirmando: boolean;
// // }) {
// //   if (!reporte) {
// //     return null;
// //   }

// //   const resumen =
// //     reporte.resumen;

// //   const general =
// //     reporte.general;

// //   return (
// //     <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-3 py-6 backdrop-blur-sm">
// //       <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
// //         <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-5">
// //           <div>
// //             <p className="text-xs font-black uppercase tracking-wide text-slate-400">
// //               Reporte preliminar
// //             </p>

// //             <h2 className="mt-1 text-2xl font-black text-slate-900">
// //               Cierre de caja
// //             </h2>

// //             <p className="mt-1 text-sm text-slate-500">
// //               {general.sucursal} · {general.caja}
// //             </p>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={onClose}
// //             disabled={confirmando}
// //             className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
// //           >
// //             <X className="h-5 w-5" />
// //           </button>
// //         </div>

// //         <div className="overflow-y-auto p-5">
// //           <div className="mb-5 grid gap-4 md:grid-cols-4">
// //             <div className="rounded-2xl border border-slate-200 bg-white p-4">
// //               <p className="text-xs font-bold uppercase text-slate-400">
// //                 Responsable
// //               </p>
// //               <p className="mt-1 font-black text-slate-800">
// //                 {general.responsableCierre}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-slate-200 bg-white p-4">
// //               <p className="text-xs font-bold uppercase text-slate-400">
// //                 Apertura
// //               </p>
// //               <p className="mt-1 font-black text-slate-800">
// //                 {formatoFechaHora(
// //                   general.fechaApertura
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-slate-200 bg-white p-4">
// //               <p className="text-xs font-bold uppercase text-slate-400">
// //                 Cierre
// //               </p>
// //               <p className="mt-1 font-black text-slate-800">
// //                 {formatoFechaHora(
// //                   general.fechaCierre
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-slate-200 bg-white p-4">
// //               <p className="text-xs font-bold uppercase text-slate-400">
// //                 Duración
// //               </p>
// //               <p className="mt-1 font-black text-slate-800">
// //                 {general.duracionMinutos} min
// //               </p>
// //             </div>
// //           </div>

// //           <div className="mb-5 grid gap-4 md:grid-cols-4">
// //             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
// //               <div className="mb-2 flex items-center gap-2 text-slate-500">
// //                 <Wallet className="h-5 w-5" />
// //                 <p className="text-xs font-black uppercase">
// //                   Monto inicial
// //                 </p>
// //               </div>

// //               <p className="text-2xl font-black text-slate-900">
// //                 {formatoBs(
// //                   resumen.montoInicial
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
// //               <div className="mb-2 flex items-center gap-2 text-emerald-700">
// //                 <ShoppingCart className="h-5 w-5" />
// //                 <p className="text-xs font-black uppercase">
// //                   Ventas
// //                 </p>
// //               </div>

// //               <p className="text-2xl font-black text-emerald-700">
// //                 {formatoBs(
// //                   resumen.totalVentas
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
// //               <div className="mb-2 flex items-center gap-2 text-red-700">
// //                 <Banknote className="h-5 w-5" />
// //                 <p className="text-xs font-black uppercase">
// //                   Egresos
// //                 </p>
// //               </div>

// //               <p className="text-2xl font-black text-red-700">
// //                 {formatoBs(
// //                   resumen.totalEgresos
// //                 )}
// //               </p>
// //             </div>

// //             <div className={`rounded-2xl border p-4 ${getEstadoClass(resumen.estado)}`}>
// //               <div className="mb-2 flex items-center gap-2">
// //                 {resumen.estado === "cuadrado" ? (
// //                   <CheckCircle2 className="h-5 w-5" />
// //                 ) : (
// //                   <AlertTriangle className="h-5 w-5" />
// //                 )}

// //                 <p className="text-xs font-black uppercase">
// //                   Estado
// //                 </p>
// //               </div>

// //               <p className="text-2xl font-black capitalize">
// //                 {resumen.estado}
// //               </p>
// //             </div>
// //           </div>

// //           <div className="mb-5 grid gap-4 md:grid-cols-3">
// //             <div className="rounded-2xl border border-slate-200 p-4">
// //               <p className="text-sm text-slate-500">
// //                 Total esperado
// //               </p>

// //               <p className="mt-1 text-2xl font-black text-slate-900">
// //                 {formatoBs(
// //                   resumen.totalEsperadoGeneral ??
// //                     resumen.totalEsperadoEfectivo
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-slate-200 p-4">
// //               <p className="text-sm text-slate-500">
// //                 Monto real verificado
// //               </p>

// //               <p className="mt-1 text-2xl font-black text-slate-900">
// //                 {formatoBs(
// //                   resumen.montoReal
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-slate-200 p-4">
// //               <p className="text-sm text-slate-500">
// //                 Diferencia
// //               </p>

// //               <p className={`mt-1 text-2xl font-black ${
// //                 resumen.diferencia === 0
// //                   ? "text-emerald-600"
// //                   : resumen.diferencia > 0
// //                     ? "text-blue-600"
// //                     : "text-red-600"
// //               }`}>
// //                 {formatoBs(
// //                   resumen.diferencia
// //                 )}
// //               </p>
// //             </div>
// //           </div>

// //           <div className="mb-5 rounded-2xl border border-slate-200 p-4">
// //             <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
// //               <ReceiptText className="h-5 w-5 text-fuchsia-600" />
// //               Ingresos por mesero
// //             </h3>

// //             {reporte.ingresosPorMesero.length === 0 ? (
// //               <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
// //                 No hay ventas registradas para este cierre.
// //               </p>
// //             ) : (
// //               <div className="overflow-x-auto">
// //                 <table className="w-full min-w-[750px] text-sm">
// //                   <thead>
// //                     <tr className="border-b text-left text-xs uppercase text-slate-400">
// //                       <th className="py-3 pr-4">Mesero</th>
// //                       <th className="py-3 pr-4 text-right">Efectivo</th>
// //                       <th className="py-3 pr-4 text-right">QR</th>
// //                       <th className="py-3 pr-4 text-right">Transferencia</th>
// //                       <th className="py-3 pr-4 text-right">Mixto</th>
// //                       <th className="py-3 pr-4 text-right">Total</th>
// //                     </tr>
// //                   </thead>

// //                   <tbody>
// //                     {reporte.ingresosPorMesero.map(
// //                       (mesero) => (
// //                         <tr
// //                           key={mesero.idPerfil}
// //                           className="border-b border-slate-100"
// //                         >
// //                           <td className="py-3 pr-4 font-bold text-slate-800">
// //                             {mesero.nombreMesero}
// //                           </td>

// //                           <td className="py-3 pr-4 text-right">
// //                             {formatoBs(mesero.efectivo)}
// //                           </td>

// //                           <td className="py-3 pr-4 text-right">
// //                             {formatoBs(mesero.qr)}
// //                           </td>

// //                           <td className="py-3 pr-4 text-right">
// //                             {formatoBs(mesero.transferencia)}
// //                           </td>

// //                           <td className="py-3 pr-4 text-right">
// //                             {formatoBs(mesero.mixto)}
// //                           </td>

// //                           <td className="py-3 pr-4 text-right font-black text-fuchsia-700">
// //                             {formatoBs(mesero.totalVentas)}
// //                           </td>
// //                         </tr>
// //                       )
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>

// //           <div className="grid gap-4 md:grid-cols-3">
// //             <div className="rounded-2xl border border-slate-200 p-4">
// //               <h3 className="font-black text-slate-800">
// //                 Egresos
// //               </h3>

// //               <p className="mt-1 text-sm text-slate-500">
// //                 Registrados: {resumen.cantidadEgresos}
// //               </p>

// //               <p className="mt-2 text-xl font-black text-red-600">
// //                 {formatoBs(
// //                   resumen.totalEgresos
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-slate-200 p-4">
// //               <h3 className="flex items-center gap-2 font-black text-slate-800">
// //                 <Gift className="h-5 w-5 text-violet-600" />
// //                 Cortesías
// //               </h3>

// //               <p className="mt-1 text-sm text-slate-500">
// //                 Cantidad: {resumen.cantidadCortesias ?? 0}
// //               </p>

// //               <p className="mt-2 text-xl font-black text-violet-600">
// //                 {formatoBs(
// //                   resumen.totalCortesias
// //                 )}
// //               </p>
// //             </div>

// //             <div className="rounded-2xl border border-slate-200 p-4">
// //               <h3 className="font-black text-slate-800">
// //                 Anulaciones
// //               </h3>

// //               <p className="mt-1 text-sm text-slate-500">
// //                 Ventas anuladas: {resumen.cantidadVentasAnuladas ?? 0}
// //               </p>

// //               <p className="mt-1 text-sm text-slate-500">
// //                 Comandas anuladas: {resumen.cantidadComandasAnuladas ?? 0}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
// //           <p className="text-sm text-slate-500">
// //             Revisa bien el reporte antes de cerrar. Después de confirmar, la apertura quedará cerrada.
// //           </p>

// //           <div className="flex gap-3">
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               disabled={confirmando}
// //               className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
// //             >
// //               Cancelar
// //             </button>

// //             <button
// //               type="button"
// //               onClick={onConfirmar}
// //               disabled={confirmando}
// //               className="inline-flex items-center gap-2 rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-black text-white transition hover:bg-fuchsia-700 disabled:opacity-50"
// //             >
// //               {confirmando && (
// //                 <LoaderCircle className="h-4 w-4 animate-spin" />
// //               )}

// //               Confirmar cierre
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* =====================================================
// //     VIEW PRINCIPAL
// // ===================================================== */

// // export default function CreateCierreCajaView() {
// //   const navigate =
// //     useNavigate();

// //   const queryClient =
// //     useQueryClient();

// //   const {
// //     sucursalId,
// //     cajaId,
// //   } = useParams();

// //   const {
// //     data: perfil,
// //   } = useAuth();

// //   const [
// //     reportePreview,
// //     setReportePreview,
// //   ] =
// //     useState<ReporteCierreCajaType | null>(
// //       null
// //     );

// //   const {
// //     data: aperturaActiva,
// //     isLoading:
// //       cargandoApertura,
// //   } = useQuery({
// //     queryKey: [
// //       "apertura-activa",
// //       cajaId,
// //     ],

// //     queryFn: () =>
// //       getAperturaActivaByCaja(
// //         cajaId!
// //       ),

// //     enabled:
// //       Boolean(cajaId),

// //     retry:
// //       false,
// //   });

// //   const [
// //     formData,
// //     setFormData,
// //   ] = useState<CierreCajaFormType>({
// //     idPerfil: "",
// //     idCaja:
// //       cajaId || "",
// //     idSucursal:
// //       sucursalId || "",
// //     fecha:
// //       obtenerFechaLocal(),
// //     horaCierre:
// //       obtenerHoraLocal(),
// //     montoReal: 0,
// //     observacion: "",
// //     creadoPor: "",
// //   });

// //   useEffect(() => {
// //     setFormData(
// //       (actual) => ({
// //         ...actual,
// //         idCaja:
// //           cajaId || "",
// //         idSucursal:
// //           sucursalId || "",
// //       })
// //     );
// //   }, [
// //     cajaId,
// //     sucursalId,
// //   ]);

// //   useEffect(() => {
// //     if (!perfil?._id) {
// //       return;
// //     }

// //     setFormData(
// //       (actual) => ({
// //         ...actual,
// //         idPerfil:
// //           String(perfil._id),
// //         creadoPor:
// //           String(perfil._id),
// //       })
// //     );
// //   }, [
// //     perfil,
// //   ]);

// //   useEffect(() => {
// //     if (
// //       !aperturaActiva
// //         ?.fechaApertura
// //     ) {
// //       return;
// //     }

// //     setFormData(
// //       (actual) => ({
// //         ...actual,
// //         fecha:
// //           fechaLocalDesdeIso(
// //             aperturaActiva
// //               .fechaApertura
// //           ),
// //       })
// //     );
// //   }, [
// //     aperturaActiva,
// //   ]);

// //   const invalidarConsultas =
// //     async () => {
// //       await Promise.all([
// //         queryClient.invalidateQueries({
// //           queryKey: [
// //             "cierresCaja",
// //             cajaId,
// //           ],
// //         }),

// //         queryClient.invalidateQueries({
// //           queryKey: [
// //             "aperturasCaja",
// //             cajaId,
// //           ],
// //         }),

// //         queryClient.invalidateQueries({
// //           queryKey: [
// //             "apertura-activa",
// //             cajaId,
// //           ],
// //         }),

// //         queryClient.invalidateQueries({
// //           queryKey: [
// //             "cajas-sucursal",
// //             sucursalId,
// //           ],
// //         }),

// //         queryClient.invalidateQueries({
// //           queryKey: [
// //             "movimientos",
// //           ],
// //         }),
// //       ]);
// //     };

// //   const {
// //     mutate: generarPreview,
// //     isPending: generandoPreview,
// //   } = useMutation({
// //     mutationFn: () =>
// //       previewCierreCaja({
// //         cajaId:
// //           cajaId || "",
// //         idSucursal:
// //           sucursalId || "",
// //         idPerfil:
// //           String(perfil?._id || ""),
// //         montoReal:
// //           Number(
// //             formData.montoReal || 0
// //           ),
// //       }),

// //     onSuccess:
// //       (reporte) => {
// //         setReportePreview(
// //           reporte
// //         );
// //       },

// //     onError:
// //       async (
// //         error: Error
// //       ) => {
// //         await Swal.fire({
// //           icon:
// //             "error",
// //           title:
// //             "No se pudo generar el preview",
// //           text:
// //             error.message,
// //         });
// //       },
// //   });

// //   const {
// //     mutate: cerrarCaja,
// //     isPending: cerrandoCaja,
// //   } = useMutation({
// //     mutationFn: () =>
// //       createCierreCaja(
// //         formData
// //       ),

// //     onSuccess:
// //       async (
// //         reporte
// //       ) => {
// //         await invalidarConsultas();

// //         setReportePreview(
// //           null
// //         );

// //         await Swal.fire({
// //           icon:
// //             reporte.resumen.estado ===
// //             "cuadrado"
// //               ? "success"
// //               : "warning",

// //           title:
// //             reporte.message,

// //           html: `
// //             <div style="text-align:left">
// //               <p><b>Ventas:</b> Bs. ${Number(reporte.resumen.totalVentas || 0).toFixed(2)}</p>
// //               <p><b>Egresos:</b> Bs. ${Number(reporte.resumen.totalEgresos || 0).toFixed(2)}</p>
// //               <p><b>Total esperado:</b> Bs. ${Number(
// //                 reporte.resumen.totalEsperadoGeneral ??
// //                 reporte.resumen.totalEsperadoEfectivo ??
// //                 0
// //               ).toFixed(2)}</p>
// //               <p><b>Monto real:</b> Bs. ${Number(reporte.resumen.montoReal || 0).toFixed(2)}</p>
// //               <p><b>Diferencia:</b> Bs. ${Number(reporte.resumen.diferencia || 0).toFixed(2)}</p>
// //               <p><b>Estado:</b> ${reporte.resumen.estado}</p>
// //               <p><b>Duración:</b> ${reporte.general.duracionMinutos} minutos</p>
// //             </div>
// //           `,

// //           confirmButtonText:
// //             "Ver historial",
// //         });

// //         navigate(
// //           `/sucursal/${sucursalId}/caja/${cajaId}/cierre`
// //         );
// //       },

// //     onError:
// //       async (
// //         error: Error
// //       ) => {
// //         await Swal.fire({
// //           icon:
// //             "error",
// //           title:
// //             "No se pudo cerrar la caja",
// //           text:
// //             error.message,
// //         });
// //       },
// //   });

// //   const validarFormulario =
// //     () => {
// //       if (!aperturaActiva) {
// //         Swal.fire({
// //           icon:
// //             "error",
// //           title:
// //             "Caja sin apertura",
// //           text:
// //             "La caja no tiene una apertura activa.",
// //         });

// //         return false;
// //       }

// //       if (!perfil?._id) {
// //         Swal.fire({
// //           icon:
// //             "error",
// //           title:
// //             "Perfil no cargado",
// //           text:
// //             "No se pudo identificar al usuario que cerrará la caja.",
// //         });

// //         return false;
// //       }

// //       if (!cajaId) {
// //         Swal.fire({
// //           icon:
// //             "error",
// //           title:
// //             "Caja no válida",
// //           text:
// //             "No se encontró el ID de la caja.",
// //         });

// //         return false;
// //       }

// //       if (!sucursalId) {
// //         Swal.fire({
// //           icon:
// //             "error",
// //           title:
// //             "Sucursal no válida",
// //           text:
// //             "No se encontró el ID de la sucursal.",
// //         });

// //         return false;
// //       }

// //       return true;
// //     };

// //   const handlePreview =
// //     () => {
// //       if (!validarFormulario()) {
// //         return;
// //       }

// //       generarPreview();
// //     };

// //   const handleSubmit = (
// //     event:
// //       React.FormEvent<HTMLFormElement>
// //   ) => {
// //     event.preventDefault();

// //     if (!validarFormulario()) {
// //       return;
// //     }

// //     /*
// //       En vez de cerrar directamente,
// //       primero abrimos el preview.
// //     */
// //     generarPreview();
// //   };

// //   const handleConfirmarCierre =
// //     async () => {
// //       if (!validarFormulario()) {
// //         return;
// //       }

// //       const resultado =
// //         await Swal.fire({
// //           icon:
// //             "warning",
// //           title:
// //             "¿Confirmar cierre de caja?",
// //           text:
// //             "Después de cerrar, la apertura quedará cerrada y ya no se podrán registrar movimientos en esta caja.",
// //           showCancelButton:
// //             true,
// //           confirmButtonText:
// //             "Sí, cerrar caja",
// //           cancelButtonText:
// //             "Cancelar",
// //           confirmButtonColor:
// //             "#c026d3",
// //         });

// //       if (!resultado.isConfirmed) {
// //         return;
// //       }

// //       cerrarCaja();
// //     };

// //   if (cargandoApertura) {
// //     return (
// //       <div className="flex min-h-screen items-center justify-center bg-slate-50">
// //         <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex min-h-screen bg-slate-50">
// //       <MenuList />

// //       <main className="flex-1 p-4 md:p-8">
// //         <div className="mb-8">
// //           <Link
// //             to={`/sucursal/${sucursalId}/caja/${cajaId}/cierre`}
// //             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-fuchsia-600"
// //           >
// //             <ArrowLeft className="h-4 w-4" />
// //             Volver
// //           </Link>
// //         </div>

// //         <motion.div
// //           initial={{
// //             opacity: 0,
// //             y: 20,
// //           }}
// //           animate={{
// //             opacity: 1,
// //             y: 0,
// //           }}
// //           className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8"
// //         >
// //           <div className="mb-8">
// //             <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">
// //               <Wallet className="h-8 w-8 text-fuchsia-600" />
// //               Cerrar caja
// //             </h1>

// //             <p className="mt-2 text-slate-500">
// //               El sistema centralizará ventas por mesero, egresos, cortesías, comandas anuladas e inventario afectado.
// //             </p>
// //           </div>

// //           {aperturaActiva ? (
// //             <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
// //               <p>
// //                 <b>Apertura:</b>{" "}
// //                 {new Date(
// //                   aperturaActiva.fechaApertura
// //                 ).toLocaleString()}
// //               </p>

// //               <p>
// //                 <b>Monto inicial:</b>{" "}
// //                 {formatoBs(
// //                   Number(
// //                     aperturaActiva.montoInicial
// //                   )
// //                 )}
// //               </p>
// //             </div>
// //           ) : (
// //             <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
// //               La caja no tiene una apertura activa.
// //             </div>
// //           )}

// //           <CierreCajaForm
// //             formData={formData}
// //             setFormData={setFormData}
// //             onSubmit={handleSubmit}
// //             onPreview={handlePreview}
// //             loading={
// //               cerrandoCaja ||
// //               !aperturaActiva
// //             }
// //             previewLoading={
// //               generandoPreview
// //             }
// //             submitText="Revisar y cerrar caja"
// //           />
// //         </motion.div>
// //       </main>

// //       <ReporteCierreModal
// //         reporte={reportePreview}
// //         onClose={() =>
// //           setReportePreview(null)
// //         }
// //         onConfirmar={
// //           handleConfirmarCierre
// //         }
// //         confirmando={
// //           cerrandoCaja
// //         }
// //       />
// //     </div>
// //   );
// // }
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
//   AlertTriangle,
//   ArrowLeft,
//   Banknote,
//   CheckCircle2,
//   Gift,
//   LoaderCircle,
//   Printer,
//   ReceiptText,
//   ShoppingCart,
//   Wallet,
//   X,
// } from "lucide-react";

// import Swal from "sweetalert2";

// import MenuList from "@/components/MenuList";
// import CierreCajaForm from "@/components/cierrecaja/CierreCajaForm";

// import {
//   createCierreCaja,
//   previewCierreCaja,
// } from "@/api/CierreCajaApi";

// import {
//   getAperturaActivaByCaja,
// } from "@/api/AperturaCajaApi";

// import type {
//   CierreCajaForm as CierreCajaFormType,
//   ReporteCierreCajaType,
// } from "@/types/CierreCajaType";

// import { useAuth } from "@/hooks/useAuth";

// /* =====================================================
//     FECHAS
// ===================================================== */

// function obtenerFechaLocal(): string {
//   const ahora = new Date();

//   const compensacion =
//     ahora.getTimezoneOffset() * 60000;

//   return new Date(
//     ahora.getTime() - compensacion
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
//   const fecha = new Date(fechaIso);

//   const compensacion =
//     fecha.getTimezoneOffset() * 60000;

//   return new Date(
//     fecha.getTime() - compensacion
//   )
//     .toISOString()
//     .slice(0, 10);
// }

// function construirFechaCierrePreview(
//   fechaReferencia?: string,
//   horaCierre?: string,
//   fechaApertura?: string
// ): string {
//   if (
//     !fechaReferencia ||
//     !horaCierre
//   ) {
//     return new Date().toISOString();
//   }

//   let cierre =
//     new Date(
//       `${fechaReferencia}T${horaCierre}:00-04:00`
//     );

//   if (fechaApertura) {
//     const apertura =
//       new Date(fechaApertura);

//     const horaApertura =
//       apertura.toLocaleTimeString(
//         "es-BO",
//         {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//         }
//       );

//     if (horaCierre < horaApertura) {
//       cierre =
//         new Date(
//           cierre.getTime() +
//             24 * 60 * 60 * 1000
//         );
//     }
//   }

//   return cierre.toISOString();
// }

// function formatoFechaHora(
//   fecha?: string
// ) {
//   if (!fecha) {
//     return "Sin fecha";
//   }

//   const valor = new Date(fecha);

//   if (
//     Number.isNaN(valor.getTime())
//   ) {
//     return "Fecha inválida";
//   }

//   return valor.toLocaleString(
//     "es-BO"
//   );
// }

// function formatoBs(
//   valor?: number
// ) {
//   return `Bs. ${Number(
//     valor || 0
//   ).toFixed(2)}`;
// }

// function getEstadoClass(
//   estado?: string
// ) {
//   if (estado === "cuadrado") {
//     return "border-emerald-200 bg-emerald-50 text-emerald-700";
//   }

//   if (estado === "sobrante") {
//     return "border-blue-200 bg-blue-50 text-blue-700";
//   }

//   if (estado === "faltante") {
//     return "border-red-200 bg-red-50 text-red-700";
//   }

//   return "border-slate-200 bg-slate-50 text-slate-700";
// }

// function imprimirReporteCierre() {
//   window.print();
// }

// /* =====================================================
//     MODAL REPORTE
// ===================================================== */

// function ReporteCierreModal({
//   reporte,
//   onClose,
//   onConfirmar,
//   confirmando,
// }: {
//   reporte: ReporteCierreCajaType | null;
//   onClose: () => void;
//   onConfirmar: () => void;
//   confirmando: boolean;
// }) {
//   if (!reporte) {
//     return null;
//   }

//   const resumen = reporte.resumen;
//   const general = reporte.general;

//   return (
//     <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-3 py-6 backdrop-blur-sm print:static print:bg-white print:p-0">
//       <div
//         id="reporte-preview-cierre"
//         className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl print:max-h-none print:max-w-none print:overflow-visible print:rounded-none print:border-none print:shadow-none"
//       >
//         <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-5 print:bg-white">
//           <div>
//             <p className="text-xs font-black uppercase tracking-wide text-slate-400">
//               Reporte preliminar
//             </p>

//             <h2 className="mt-1 text-2xl font-black text-slate-900">
//               Cierre de caja
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               {general.sucursal} · {general.caja}
//             </p>

//             <p className="mt-1 hidden text-xs text-slate-500 print:block">
//               Informe preliminar generado antes de confirmar el cierre definitivo.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={confirmando}
//             className="print-hidden flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="overflow-y-auto p-5 print:overflow-visible">
//           <div className="mb-5 grid gap-4 md:grid-cols-4">
//             <div className="rounded-2xl border border-slate-200 p-4">
//               <p className="text-xs font-bold uppercase text-slate-400">
//                 Responsable
//               </p>

//               <p className="mt-1 font-black text-slate-800">
//                 {general.responsableCierre}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-4">
//               <p className="text-xs font-bold uppercase text-slate-400">
//                 Apertura
//               </p>

//               <p className="mt-1 font-black text-slate-800">
//                 {formatoFechaHora(
//                   general.fechaApertura
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-4">
//               <p className="text-xs font-bold uppercase text-slate-400">
//                 Cierre
//               </p>

//               <p className="mt-1 font-black text-slate-800">
//                 {formatoFechaHora(
//                   general.fechaCierre
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-4">
//               <p className="text-xs font-bold uppercase text-slate-400">
//                 Duración
//               </p>

//               <p className="mt-1 font-black text-slate-800">
//                 {general.duracionMinutos} min
//               </p>
//             </div>
//           </div>

//           <div className="mb-5 grid gap-4 md:grid-cols-4">
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="mb-2 flex items-center gap-2 text-slate-500">
//                 <Wallet className="h-5 w-5" />

//                 <p className="text-xs font-black uppercase">
//                   Monto inicial
//                 </p>
//               </div>

//               <p className="text-2xl font-black text-slate-900">
//                 {formatoBs(
//                   resumen.montoInicial
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
//               <div className="mb-2 flex items-center gap-2 text-emerald-700">
//                 <ShoppingCart className="h-5 w-5" />

//                 <p className="text-xs font-black uppercase">
//                   Ventas
//                 </p>
//               </div>

//               <p className="text-2xl font-black text-emerald-700">
//                 {formatoBs(
//                   resumen.totalVentas
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
//               <div className="mb-2 flex items-center gap-2 text-red-700">
//                 <Banknote className="h-5 w-5" />

//                 <p className="text-xs font-black uppercase">
//                   Egresos
//                 </p>
//               </div>

//               <p className="text-2xl font-black text-red-700">
//                 {formatoBs(
//                   resumen.totalEgresos
//                 )}
//               </p>
//             </div>

//             <div className={`rounded-2xl border p-4 ${getEstadoClass(resumen.estado)}`}>
//               <div className="mb-2 flex items-center gap-2">
//                 {resumen.estado === "cuadrado" ? (
//                   <CheckCircle2 className="h-5 w-5" />
//                 ) : (
//                   <AlertTriangle className="h-5 w-5" />
//                 )}

//                 <p className="text-xs font-black uppercase">
//                   Estado
//                 </p>
//               </div>

//               <p className="text-2xl font-black capitalize">
//                 {resumen.estado}
//               </p>
//             </div>
//           </div>

//           <div className="mb-5 grid gap-4 md:grid-cols-3">
//             <div className="rounded-2xl border border-slate-200 p-4">
//               <p className="text-sm text-slate-500">
//                 Total esperado
//               </p>

//               <p className="mt-1 text-2xl font-black text-slate-900">
//                 {formatoBs(
//                   resumen.totalEsperadoGeneral ??
//                     resumen.totalEsperadoEfectivo
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-4">
//               <p className="text-sm text-slate-500">
//                 Monto real verificado
//               </p>

//               <p className="mt-1 text-2xl font-black text-slate-900">
//                 {formatoBs(
//                   resumen.montoReal
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-4">
//               <p className="text-sm text-slate-500">
//                 Diferencia
//               </p>

//               <p
//                 className={`mt-1 text-2xl font-black ${
//                   resumen.diferencia === 0
//                     ? "text-emerald-600"
//                     : resumen.diferencia > 0
//                       ? "text-blue-600"
//                       : "text-red-600"
//                 }`}
//               >
//                 {formatoBs(
//                   resumen.diferencia
//                 )}
//               </p>
//             </div>
//           </div>

//           <div className="mb-5 rounded-2xl border border-slate-200 p-4">
//             <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
//               <ReceiptText className="h-5 w-5 text-fuchsia-600" />
//               Ingresos por mesero
//             </h3>

//             {reporte.ingresosPorMesero.length === 0 ? (
//               <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
//                 No hay ventas registradas para este cierre.
//               </p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[750px] text-sm">
//                   <thead>
//                     <tr className="border-b text-left text-xs uppercase text-slate-400">
//                       <th className="py-3 pr-4">
//                         Mesero
//                       </th>

//                       <th className="py-3 pr-4 text-right">
//                         Efectivo
//                       </th>

//                       <th className="py-3 pr-4 text-right">
//                         QR
//                       </th>

//                       <th className="py-3 pr-4 text-right">
//                         Transferencia
//                       </th>

//                       <th className="py-3 pr-4 text-right">
//                         Mixto
//                       </th>

//                       <th className="py-3 pr-4 text-right">
//                         Total a entregar / justificar
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {reporte.ingresosPorMesero.map(
//                       (mesero) => (
//                         <tr
//                           key={mesero.idPerfil}
//                           className="border-b border-slate-100"
//                         >
//                           <td className="py-3 pr-4 font-bold text-slate-800">
//                             {mesero.nombreMesero}
//                           </td>

//                           <td className="py-3 pr-4 text-right">
//                             {formatoBs(
//                               mesero.efectivo
//                             )}
//                           </td>

//                           <td className="py-3 pr-4 text-right">
//                             {formatoBs(
//                               mesero.qr
//                             )}
//                           </td>

//                           <td className="py-3 pr-4 text-right">
//                             {formatoBs(
//                               mesero.transferencia
//                             )}
//                           </td>

//                           <td className="py-3 pr-4 text-right">
//                             {formatoBs(
//                               mesero.mixto
//                             )}
//                           </td>

//                           <td className="py-3 pr-4 text-right font-black text-fuchsia-700">
//                             {formatoBs(
//                               mesero.totalVentas
//                             )}
//                           </td>
//                         </tr>
//                       )
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           <div className="mb-5 grid gap-4 md:grid-cols-3">
//             <div className="rounded-2xl border border-slate-200 p-4">
//               <h3 className="font-black text-slate-800">
//                 Egresos
//               </h3>

//               <p className="mt-1 text-sm text-slate-500">
//                 Registrados: {resumen.cantidadEgresos}
//               </p>

//               <p className="mt-2 text-xl font-black text-red-600">
//                 {formatoBs(
//                   resumen.totalEgresos
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-4">
//               <h3 className="flex items-center gap-2 font-black text-slate-800">
//                 <Gift className="h-5 w-5 text-violet-600" />
//                 Cortesías
//               </h3>

//               <p className="mt-1 text-sm text-slate-500">
//                 Cantidad: {resumen.cantidadCortesias ?? 0}
//               </p>

//               <p className="mt-2 text-xl font-black text-violet-600">
//                 {formatoBs(
//                   resumen.totalCortesias
//                 )}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 p-4">
//               <h3 className="font-black text-slate-800">
//                 Anulaciones
//               </h3>

//               <p className="mt-1 text-sm text-slate-500">
//                 Ventas anuladas: {resumen.cantidadVentasAnuladas ?? 0}
//               </p>

//               <p className="mt-1 text-sm text-slate-500">
//                 Comandas anuladas: {resumen.cantidadComandasAnuladas ?? 0}
//               </p>
//             </div>
//           </div>

//           <div className="hidden border-t border-slate-300 pt-8 print:block">
//             <div className="grid grid-cols-3 gap-10 text-center text-sm">
//               <div>
//                 <div className="mb-2 h-12 border-b border-slate-400" />
//                 <p>Responsable de caja</p>
//               </div>

//               <div>
//                 <div className="mb-2 h-12 border-b border-slate-400" />
//                 <p>Administrador</p>
//               </div>

//               <div>
//                 <div className="mb-2 h-12 border-b border-slate-400" />
//                 <p>Contabilidad</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="print-hidden flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
//           <p className="text-sm text-slate-500">
//             Revisa bien el reporte antes de cerrar. Después de confirmar, la apertura quedará cerrada.
//           </p>

//           <div className="flex flex-wrap gap-3">
//             <button
//               type="button"
//               onClick={imprimirReporteCierre}
//               disabled={confirmando}
//               className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
//             >
//               <Printer className="h-4 w-4" />
//               Imprimir
//             </button>

//             <button
//               type="button"
//               onClick={onClose}
//               disabled={confirmando}
//               className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
//             >
//               Cancelar
//             </button>

//             <button
//               type="button"
//               onClick={onConfirmar}
//               disabled={confirmando}
//               className="inline-flex items-center gap-2 rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-black text-white transition hover:bg-fuchsia-700 disabled:opacity-50"
//             >
//               {confirmando && (
//                 <LoaderCircle className="h-4 w-4 animate-spin" />
//               )}

//               Confirmar cierre
//             </button>
//           </div>
//         </div>
//       </div>

//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden;
//             }

//             #reporte-preview-cierre,
//             #reporte-preview-cierre * {
//               visibility: visible;
//             }

//             #reporte-preview-cierre {
//               position: absolute;
//               left: 0;
//               top: 0;
//               width: 100%;
//               background: white;
//             }

//             .print-hidden {
//               display: none !important;
//             }

//             @page {
//               size: A4;
//               margin: 12mm;
//             }

//             table {
//               page-break-inside: auto;
//             }

//             tr {
//               page-break-inside: avoid;
//               page-break-after: auto;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// /* =====================================================
//     VIEW PRINCIPAL
// ===================================================== */

// export default function CreateCierreCajaView() {
//   const navigate = useNavigate();

//   const queryClient =
//     useQueryClient();

//   const {
//     sucursalId,
//     cajaId,
//   } = useParams();

//   const {
//     data: perfil,
//   } = useAuth();

//   const [
//     reportePreview,
//     setReportePreview,
//   ] =
//     useState<ReporteCierreCajaType | null>(
//       null
//     );

//   const {
//     data: aperturaActiva,
//     isLoading: cargandoApertura,
//   } = useQuery({
//     queryKey: [
//       "apertura-activa",
//       cajaId,
//     ],

//     queryFn: () =>
//       getAperturaActivaByCaja(
//         cajaId!
//       ),

//     enabled: Boolean(cajaId),

//     retry: false,
//   });

//   const [
//     formData,
//     setFormData,
//   ] = useState<CierreCajaFormType>({
//     idPerfil: "",
//     idCaja: cajaId || "",
//     idSucursal: sucursalId || "",
//     fecha: obtenerFechaLocal(),
//     horaCierre: obtenerHoraLocal(),
//     montoReal: 0,
//     observacion: "",
//     creadoPor: "",
//   });

//   useEffect(() => {
//     setFormData(
//       (actual) => ({
//         ...actual,
//         idCaja: cajaId || "",
//         idSucursal: sucursalId || "",
//       })
//     );
//   }, [
//     cajaId,
//     sucursalId,
//   ]);

//   useEffect(() => {
//     if (!perfil?._id) {
//       return;
//     }

//     setFormData(
//       (actual) => ({
//         ...actual,
//         idPerfil: String(perfil._id),
//         creadoPor: String(perfil._id),
//       })
//     );
//   }, [
//     perfil,
//   ]);

//   useEffect(() => {
//     if (
//       !aperturaActiva?.fechaApertura
//     ) {
//       return;
//     }

//     setFormData(
//       (actual) => ({
//         ...actual,
//         fecha: fechaLocalDesdeIso(
//           aperturaActiva.fechaApertura
//         ),
//       })
//     );
//   }, [
//     aperturaActiva,
//   ]);

//   const invalidarConsultas =
//     async () => {
//       await Promise.all([
//         queryClient.invalidateQueries({
//           queryKey: [
//             "cierresCaja",
//             cajaId,
//           ],
//         }),

//         queryClient.invalidateQueries({
//           queryKey: [
//             "aperturasCaja",
//             cajaId,
//           ],
//         }),

//         queryClient.invalidateQueries({
//           queryKey: [
//             "apertura-activa",
//             cajaId,
//           ],
//         }),

//         queryClient.invalidateQueries({
//           queryKey: [
//             "cajas-sucursal",
//             sucursalId,
//           ],
//         }),

//         queryClient.invalidateQueries({
//           queryKey: [
//             "movimientos",
//           ],
//         }),
//       ]);
//     };

//   const {
//     mutate: generarPreview,
//     isPending: generandoPreview,
//   } = useMutation({
//     mutationFn: () =>
//       previewCierreCaja({
//         cajaId: cajaId || "",
//         idSucursal: sucursalId || "",
//         idPerfil: String(perfil?._id || ""),
//         montoReal: Number(
//           formData.montoReal || 0
//         ),
//         fechaCierre:
//           construirFechaCierrePreview(
//             formData.fecha,
//             formData.horaCierre,
//             aperturaActiva?.fechaApertura
//           ),
//       }),

//     onSuccess: (reporte) => {
//       setReportePreview(reporte);
//     },

//     onError: async (
//       error: Error
//     ) => {
//       await Swal.fire({
//         icon: "error",
//         title: "No se pudo generar el preview",
//         text: error.message,
//       });
//     },
//   });

//   const {
//     mutate: cerrarCaja,
//     isPending: cerrandoCaja,
//   } = useMutation({
//     mutationFn: () =>
//       createCierreCaja(formData),

//     onSuccess: async (
//       reporte
//     ) => {
//       await invalidarConsultas();

//       setReportePreview(null);

//       await Swal.fire({
//         icon:
//           reporte.resumen.estado ===
//           "cuadrado"
//             ? "success"
//             : "warning",

//         title: reporte.message,

//         html: `
//           <div style="text-align:left">
//             <p><b>Ventas:</b> Bs. ${Number(reporte.resumen.totalVentas || 0).toFixed(2)}</p>
//             <p><b>Egresos:</b> Bs. ${Number(reporte.resumen.totalEgresos || 0).toFixed(2)}</p>
//             <p><b>Total esperado:</b> Bs. ${Number(
//               reporte.resumen.totalEsperadoGeneral ??
//               reporte.resumen.totalEsperadoEfectivo ??
//               0
//             ).toFixed(2)}</p>
//             <p><b>Monto real:</b> Bs. ${Number(reporte.resumen.montoReal || 0).toFixed(2)}</p>
//             <p><b>Diferencia:</b> Bs. ${Number(reporte.resumen.diferencia || 0).toFixed(2)}</p>
//             <p><b>Estado:</b> ${reporte.resumen.estado}</p>
//             <p><b>Duración:</b> ${reporte.general.duracionMinutos} minutos</p>
//           </div>
//         `,

//         confirmButtonText:
//           "Ver historial",
//       });

//       navigate(
//         `/sucursal/${sucursalId}/caja/${cajaId}/cierre`
//       );
//     },

//     onError: async (
//       error: Error
//     ) => {
//       await Swal.fire({
//         icon: "error",
//         title: "No se pudo cerrar la caja",
//         text: error.message,
//       });
//     },
//   });

//   const validarFormulario =
//     () => {
//       if (!aperturaActiva) {
//         Swal.fire({
//           icon: "error",
//           title: "Caja sin apertura",
//           text: "La caja no tiene una apertura activa.",
//         });

//         return false;
//       }

//       if (!perfil?._id) {
//         Swal.fire({
//           icon: "error",
//           title: "Perfil no cargado",
//           text: "No se pudo identificar al usuario que cerrará la caja.",
//         });

//         return false;
//       }

//       if (!cajaId) {
//         Swal.fire({
//           icon: "error",
//           title: "Caja no válida",
//           text: "No se encontró el ID de la caja.",
//         });

//         return false;
//       }

//       if (!sucursalId) {
//         Swal.fire({
//           icon: "error",
//           title: "Sucursal no válida",
//           text: "No se encontró el ID de la sucursal.",
//         });

//         return false;
//       }

//       return true;
//     };

//   const handlePreview = () => {
//     if (!validarFormulario()) {
//       return;
//     }

//     generarPreview();
//   };

//   const handleSubmit = (
//     event: React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     if (!validarFormulario()) {
//       return;
//     }

//     generarPreview();
//   };

//   const handleConfirmarCierre =
//     async () => {
//       if (!validarFormulario()) {
//         return;
//       }

//       const resultado =
//         await Swal.fire({
//           icon: "warning",
//           title: "¿Confirmar cierre de caja?",
//           text: "Después de cerrar, la apertura quedará cerrada y ya no se podrán registrar movimientos en esta caja.",
//           showCancelButton: true,
//           confirmButtonText: "Sí, cerrar caja",
//           cancelButtonText: "Cancelar",
//           confirmButtonColor: "#c026d3",
//         });

//       if (!resultado.isConfirmed) {
//         return;
//       }

//       cerrarCaja();
//     };

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
//           className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8"
//         >
//           <div className="mb-8">
//             <h1 className="flex items-center gap-3 text-3xl font-black text-slate-800">
//               <Wallet className="h-8 w-8 text-fuchsia-600" />
//               Cerrar caja
//             </h1>

//             <p className="mt-2 text-slate-500">
//               El sistema centralizará ventas por mesero, egresos, cortesías, comandas anuladas e inventario afectado.
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
//                 {formatoBs(
//                   Number(
//                     aperturaActiva.montoInicial
//                   )
//                 )}
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
//             onPreview={handlePreview}
//             loading={
//               cerrandoCaja ||
//               !aperturaActiva
//             }
//             previewLoading={
//               generandoPreview
//             }
//             submitText="Revisar y cerrar caja"
//           />
//         </motion.div>
//       </main>

//       <ReporteCierreModal
//         reporte={reportePreview}
//         onClose={() =>
//           setReportePreview(null)
//         }
//         onConfirmar={
//           handleConfirmarCierre
//         }
//         confirmando={
//           cerrandoCaja
//         }
//       />
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
  Printer,
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
  const ahora = new Date();

  const compensacion =
    ahora.getTimezoneOffset() * 60000;

  return new Date(
    ahora.getTime() - compensacion
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
  const fecha = new Date(fechaIso);

  const compensacion =
    fecha.getTimezoneOffset() * 60000;

  return new Date(
    fecha.getTime() - compensacion
  )
    .toISOString()
    .slice(0, 10);
}

function construirFechaCierrePreview(
  fechaReferencia?: string,
  horaCierre?: string,
  fechaApertura?: string
): string {
  if (
    !fechaReferencia ||
    !horaCierre
  ) {
    return new Date().toISOString();
  }

  let cierre =
    new Date(
      `${fechaReferencia}T${horaCierre}:00-04:00`
    );

  if (fechaApertura) {
    const apertura =
      new Date(fechaApertura);

    const horaApertura =
      apertura.toLocaleTimeString(
        "es-BO",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      );

    if (horaCierre < horaApertura) {
      cierre =
        new Date(
          cierre.getTime() +
            24 * 60 * 60 * 1000
        );
    }
  }

  return cierre.toISOString();
}

function formatoFechaHora(
  fecha?: string
) {
  if (!fecha) {
    return "Sin fecha";
  }

  const valor = new Date(fecha);

  if (
    Number.isNaN(valor.getTime())
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

/* =====================================================
    HELPERS REPORTE IMPRESO
===================================================== */

function valorTexto(
  valor: unknown
) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }

  if (
    typeof valor === "string" ||
    typeof valor === "number" ||
    typeof valor === "boolean"
  ) {
    return String(valor);
  }

  return "";
}

function valorNumero(
  valor: unknown
) {
  const numero =
    Number(valor || 0);

  if (
    Number.isNaN(numero)
  ) {
    return 0;
  }

  return numero;
}

function getTexto(
  item: Record<string, unknown>,
  campo: string
) {
  return valorTexto(
    item[campo]
  );
}

function getNumero(
  item: Record<string, unknown>,
  campo: string
) {
  return valorNumero(
    item[campo]
  );
}

function getArray(
  item: Record<string, unknown>,
  campo: string
): Record<string, unknown>[] {
  const valor =
    item[campo];

  if (Array.isArray(valor)) {
    return valor as Record<string, unknown>[];
  }

  return [];
}

function escapeHtml(
  valor: unknown
) {
  return valorTexto(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function estadoColor(
  estado?: string
) {
  if (estado === "cuadrado") {
    return "#047857";
  }

  if (estado === "sobrante") {
    return "#1d4ed8";
  }

  if (estado === "faltante") {
    return "#b91c1c";
  }

  return "#334155";
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
    HTML IMPRESIÓN ESTILO CONTABLE
===================================================== */

function generarHtmlImpresionPreliminar(
  reporte: ReporteCierreCajaType
) {
  const {
    general,
    resumen,
  } = reporte;

  const totalEsperado =
    resumen.totalEsperadoGeneral ??
    resumen.totalEsperadoEfectivo;

  const colorEstado =
    estadoColor(
      resumen.estado
    );

  const fechaImpresion =
    new Date().toLocaleString(
      "es-BO"
    );

  const totalEfectivo =
    resumen.totalVentasEfectivo || 0;

  const totalQr =
    resumen.totalVentasQr || 0;

  const totalTransferencia =
    resumen.totalVentasTransferencia || 0;

  const totalMixto =
    resumen.totalVentasMixto || 0;

  const filasMeseros =
    reporte.ingresosPorMesero
      .map(
        (mesero, index) => `
          <tr>
            <td class="center">${index + 1}</td>
            <td>${escapeHtml(mesero.nombreMesero)}</td>
            <td class="right">${mesero.cantidadVentas}</td>
            <td class="right">${formatoBs(mesero.efectivo)}</td>
            <td class="right">${formatoBs(mesero.qr)}</td>
            <td class="right">${formatoBs(mesero.transferencia)}</td>
            <td class="right">${formatoBs(mesero.mixto)}</td>
            <td class="right strong">${formatoBs(mesero.totalVentas)}</td>
          </tr>
        `
      )
      .join("");

  const detalleVentas =
    reporte.ingresosPorMesero
      .map(
        (mesero) => {
          const ventas =
            Array.isArray(mesero.ventas)
              ? mesero.ventas as Record<string, unknown>[]
              : [];

          const filas =
            ventas
              .map(
                (venta, index) => `
                  <tr>
                    <td class="center">${index + 1}</td>
                    <td>${escapeHtml(getTexto(venta, "numeroVenta") || "-")}</td>
                    <td>${escapeHtml(getTexto(venta, "numeroComanda") || "-")}</td>
                    <td>${escapeHtml(formatoFechaHora(getTexto(venta, "fechaVenta")))}</td>
                    <td>${escapeHtml(getTexto(venta, "metodoPago") || "-")}</td>
                    <td class="right">${formatoBs(getNumero(venta, "subtotal"))}</td>
                    <td class="right">${formatoBs(getNumero(venta, "descuento"))}</td>
                    <td class="right strong">${formatoBs(getNumero(venta, "total"))}</td>
                  </tr>
                `
              )
              .join("");

          return `
            <section class="bloque page-avoid">
              <div class="subtitulo-linea">
                <span>Detalle de ventas - ${escapeHtml(mesero.nombreMesero)}</span>
                <span>${formatoBs(mesero.totalVentas)}</span>
              </div>

              ${
                ventas.length === 0
                  ? `<p class="muted">Sin detalle de ventas.</p>`
                  : `
                    <table>
                      <thead>
                        <tr>
                          <th class="center">No.</th>
                          <th>Venta</th>
                          <th>Comanda</th>
                          <th>Fecha</th>
                          <th>Método</th>
                          <th class="right">Subtotal</th>
                          <th class="right">Desc.</th>
                          <th class="right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${filas}
                      </tbody>
                    </table>
                  `
              }
            </section>
          `;
        }
      )
      .join("");

  const egresosDetalle =
    reporte.egresos
      .map(
        (egresoRaw, index) => {
          const egreso =
            egresoRaw as Record<string, unknown>;

          const items =
            getArray(
              egreso,
              "items"
            );

          const filasItems =
            items
              .map(
                (item, itemIndex) => `
                  <tr>
                    <td class="center">${itemIndex + 1}</td>
                    <td>${escapeHtml(getTexto(item, "descripcion") || getTexto(item, "producto"))}</td>
                    <td>${escapeHtml(getTexto(item, "tipoItem"))}</td>
                    <td>${escapeHtml(getTexto(item, "almacen"))}</td>
                    <td class="right">${getNumero(item, "cantidad")}</td>
                    <td class="right">${formatoBs(getNumero(item, "costoUnitario"))}</td>
                    <td class="right strong">${formatoBs(getNumero(item, "subtotal"))}</td>
                  </tr>
                `
              )
              .join("");

          return `
            <section class="bloque page-avoid">
              <div class="subtitulo-linea">
                <span>Egreso No. ${index + 1} - ${escapeHtml(getTexto(egreso, "numeroEgreso") || "Sin número")}</span>
                <span class="danger">${formatoBs(getNumero(egreso, "total"))}</span>
              </div>

              <div class="info-grid">
                <p><b>Responsable:</b> ${escapeHtml(getTexto(egreso, "responsable"))}</p>
                <p><b>Tipo:</b> ${escapeHtml(getTexto(egreso, "tipoEgreso"))}</p>
                <p><b>Método:</b> ${escapeHtml(getTexto(egreso, "metodoPago"))}</p>
                <p><b>Fecha:</b> ${escapeHtml(formatoFechaHora(getTexto(egreso, "fechaEgreso")))}</p>
              </div>

              <p><b>Observación:</b> ${escapeHtml(getTexto(egreso, "observacion") || "Sin observación")}</p>

              ${
                items.length === 0
                  ? `<p class="muted">Sin detalle de ítems.</p>`
                  : `
                    <table>
                      <thead>
                        <tr>
                          <th class="center">No.</th>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Almacén</th>
                          <th class="right">Cant.</th>
                          <th class="right">Costo Unit.</th>
                          <th class="right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${filasItems}
                      </tbody>
                    </table>
                  `
              }
            </section>
          `;
        }
      )
      .join("");

  const cortesiasDetalle =
    reporte.cortesias
      .map(
        (cortesiaRaw, index) => {
          const cortesia =
            cortesiaRaw as Record<string, unknown>;

          const productos =
            getArray(
              cortesia,
              "productos"
            );

          const filasProductos =
            productos
              .map(
                (producto, productoIndex) => `
                  <tr>
                    <td class="center">${productoIndex + 1}</td>
                    <td>${escapeHtml(getTexto(producto, "producto"))}</td>
                    <td>${escapeHtml(getTexto(producto, "almacen"))}</td>
                    <td class="right">${getNumero(producto, "cantidad")}</td>
                    <td class="right">${formatoBs(getNumero(producto, "precioUnitario"))}</td>
                    <td class="right">${formatoBs(getNumero(producto, "subtotal"))}</td>
                  </tr>
                `
              )
              .join("");

          return `
            <section class="bloque page-avoid">
              <div class="subtitulo-linea">
                <span>Cortesía No. ${index + 1}</span>
                <span>${formatoBs(getNumero(cortesia, "valorReferencial"))}</span>
              </div>

              <p><b>Mesero:</b> ${escapeHtml(getTexto(cortesia, "mesero"))}</p>
              <p><b>Comanda:</b> ${escapeHtml(getTexto(cortesia, "numeroComanda") || "-")}</p>
              <p><b>Nota:</b> La cortesía no suma dinero al arqueo, pero sí afecta inventario.</p>

              ${
                productos.length === 0
                  ? `<p class="muted">Sin productos registrados.</p>`
                  : `
                    <table>
                      <thead>
                        <tr>
                          <th class="center">No.</th>
                          <th>Producto</th>
                          <th>Almacén</th>
                          <th class="right">Cant.</th>
                          <th class="right">Precio Ref.</th>
                          <th class="right">Subtotal Ref.</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${filasProductos}
                      </tbody>
                    </table>
                  `
              }
            </section>
          `;
        }
      )
      .join("");

  const filasVentasAnuladas =
    reporte.ventasAnuladas
      .map(
        (ventaRaw, index) => {
          const venta =
            ventaRaw as Record<string, unknown>;

          return `
            <tr>
              <td class="center">${index + 1}</td>
              <td>${escapeHtml(getTexto(venta, "numeroVenta") || "-")}</td>
              <td>${escapeHtml(getTexto(venta, "numeroComanda") || "-")}</td>
              <td>${escapeHtml(getTexto(venta, "mesero"))}</td>
              <td class="right">${formatoBs(getNumero(venta, "total"))}</td>
              <td>${escapeHtml(getTexto(venta, "motivo") || "Sin motivo")}</td>
            </tr>
          `;
        }
      )
      .join("");

  const filasComandasAnuladas =
    reporte.comandasAnuladas
      .map(
        (comandaRaw, index) => {
          const comanda =
            comandaRaw as Record<string, unknown>;

          return `
            <tr>
              <td class="center">${index + 1}</td>
              <td>${escapeHtml(getTexto(comanda, "numeroComanda") || "-")}</td>
              <td>${escapeHtml(getTexto(comanda, "mesero"))}</td>
              <td class="right">${formatoBs(getNumero(comanda, "totalReferencial"))}</td>
              <td>${escapeHtml(getTexto(comanda, "observacion") || "Sin motivo")}</td>
            </tr>
          `;
        }
      )
      .join("");

  const filasInventario =
    reporte.inventarioAfectado
      .map(
        (itemRaw, index) => {
          const item =
            itemRaw as Record<string, unknown>;

          return `
            <tr>
              <td class="center">${index + 1}</td>
              <td>${escapeHtml(getTexto(item, "producto"))}</td>
              <td>${escapeHtml(getTexto(item, "almacen"))}</td>
              <td class="right">${getNumero(item, "cantidadVendida")}</td>
              <td class="right">${getNumero(item, "cantidadCortesia")}</td>
              <td class="right strong">${getNumero(item, "cantidadTotal")}</td>
            </tr>
          `;
        }
      )
      .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Reporte preliminar de cierre de caja</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            color: #111827;
            font-family: "Courier New", Courier, monospace;
            font-size: 12px;
            line-height: 1.25;
          }

          .documento {
            width: 100%;
            padding: 18px 22px;
          }

          .encabezado {
            display: grid;
            grid-template-columns: 1fr 310px;
            gap: 20px;
            border-bottom: 2px solid #111827;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }

          .empresa {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .subempresa {
            font-size: 13px;
            margin-top: 2px;
          }

          .titulo {
            margin-top: 14px;
            font-size: 18px;
            font-weight: 900;
            text-transform: uppercase;
          }

          .meta {
            font-size: 11px;
          }

          .meta p {
            margin: 2px 0;
          }

          .datos-cierre {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 8px;
            margin-bottom: 8px;
          }

          .datos-cierre p {
            margin: 2px 0;
          }

          .tabla-resumen {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 8px;
          }

          .tabla-resumen th {
            text-align: right;
            font-weight: 900;
            padding: 3px 8px;
            border: none;
            background: white;
          }

          .tabla-resumen td {
            text-align: right;
            padding: 3px 8px;
            border: none;
          }

          .tabla-resumen td:first-child,
          .tabla-resumen th:first-child {
            text-align: left;
          }

          h2 {
            text-align: center;
            font-size: 14px;
            text-transform: uppercase;
            margin: 12px 0 6px;
            padding-top: 4px;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
          }

          h3 {
            font-size: 13px;
            margin: 8px 0 4px;
            text-transform: uppercase;
          }

          .bloque {
            margin-bottom: 10px;
          }

          .subtitulo-linea {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 1px dashed #475569;
            padding-bottom: 3px;
            margin-bottom: 5px;
            font-weight: 900;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin: 4px 0;
          }

          p {
            margin: 3px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0 10px;
          }

          th {
            font-weight: 900;
            text-transform: uppercase;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
            padding: 4px 5px;
            text-align: left;
            background: #f8fafc;
          }

          td {
            border-bottom: 1px dotted #cbd5e1;
            padding: 4px 5px;
            vertical-align: top;
          }

          .right {
            text-align: right;
          }

          .center {
            text-align: center;
          }

          .strong {
            font-weight: 900;
          }

          .danger {
            color: #b91c1c;
            font-weight: 900;
          }

          .success {
            color: #047857;
            font-weight: 900;
          }

          .estado {
            color: ${colorEstado};
            font-weight: 900;
            text-transform: uppercase;
          }

          .muted {
            color: #64748b;
          }

          .formula {
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
            margin: 10px 0;
            padding: 6px 0;
            font-weight: 900;
          }

          .firmas {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 36px;
            margin-top: 42px;
            text-align: center;
          }

          .firma-linea {
            height: 38px;
            border-bottom: 1px solid #111827;
            margin-bottom: 6px;
          }

          .page-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            tr {
              page-break-inside: avoid;
            }

            .page-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        <div class="documento">

          <div class="encabezado">
            <div>
              <div class="empresa">${escapeHtml(general.sucursal || "EMPRESA")}</div>
              <div class="subempresa">Sistema de Control de Caja</div>

              <div class="titulo">
                REPORTE PRELIMINAR DE CIERRE DE CAJA
              </div>
            </div>

            <div class="meta">
              <p><b>Usuario:</b> ${escapeHtml(general.responsableCierre)}</p>
              <p><b>Impreso desde:</b> Sistema Web</p>
              <p><b>Fecha de impresión:</b> ${escapeHtml(fechaImpresion)}</p>
              <p><b>Estado:</b> <span class="estado">${escapeHtml(resumen.estado)}</span></p>
            </div>
          </div>

          <section class="page-avoid">
            <div class="datos-cierre">
              <div>
                <p><b>Caja:</b> ${escapeHtml(general.caja)}</p>
                <p><b>Usuario:</b> ${escapeHtml(general.responsableCierre)}</p>
                <p><b>Comentario:</b> Reporte generado antes de confirmar el cierre definitivo.</p>
                <p><b>Valor Inicial:</b> ${formatoBs(resumen.montoInicial)}</p>
              </div>

              <div>
                <p><b>Fecha Apertura:</b> ${escapeHtml(formatoFechaHora(general.fechaApertura))}</p>
                <p><b>Fecha Cierre:</b> ${escapeHtml(formatoFechaHora(general.fechaCierre))}</p>
                <p><b>Duración:</b> ${general.duracionMinutos} minutos</p>
                <p><b>Estado:</b> <span class="estado">${escapeHtml(resumen.estado)}</span></p>
              </div>
            </div>

            <table class="tabla-resumen">
              <thead>
                <tr>
                  <th></th>
                  <th>Efectivo</th>
                  <th>QR</th>
                  <th>Transferencia</th>
                  <th>Mixto</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><b>Ingresos:</b></td>
                  <td>${formatoBs(totalEfectivo)}</td>
                  <td>${formatoBs(totalQr)}</td>
                  <td>${formatoBs(totalTransferencia)}</td>
                  <td>${formatoBs(totalMixto)}</td>
                  <td><b>${formatoBs(resumen.totalVentas)}</b></td>
                </tr>

                <tr>
                  <td><b>Egresos:</b></td>
                  <td>${formatoBs(resumen.totalEgresosEfectivo || resumen.totalEgresos)}</td>
                  <td>Bs. 0.00</td>
                  <td>Bs. 0.00</td>
                  <td>Bs. 0.00</td>
                  <td><b>${formatoBs(resumen.totalEgresos)}</b></td>
                </tr>

                <tr>
                  <td><b>Total Esperado:</b></td>
                  <td colspan="4"></td>
                  <td><b>${formatoBs(totalEsperado)}</b></td>
                </tr>

                <tr>
                  <td><b>Monto Real:</b></td>
                  <td colspan="4"></td>
                  <td><b>${formatoBs(resumen.montoReal)}</b></td>
                </tr>

                <tr>
                  <td><b>Diferencia:</b></td>
                  <td colspan="4"></td>
                  <td><b class="estado">${formatoBs(resumen.diferencia)}</b></td>
                </tr>
              </tbody>
            </table>

            <div class="formula">
              Fórmula: Valor Inicial + Ingresos - Egresos = Total Esperado
              <br />
              ${formatoBs(resumen.montoInicial)} + ${formatoBs(resumen.totalVentas)} - ${formatoBs(resumen.totalEgresos)} = ${formatoBs(totalEsperado)}
            </div>
          </section>

          <section class="page-avoid">
            <h2>CUADRE GENERAL POR MESERO / VENDEDOR</h2>

            ${
              reporte.ingresosPorMesero.length === 0
                ? `<p class="muted">No hay ingresos registrados por mesero.</p>`
                : `
                  <table>
                    <thead>
                      <tr>
                        <th class="center">No.</th>
                        <th>Mesero</th>
                        <th class="right">Ventas</th>
                        <th class="right">Efectivo</th>
                        <th class="right">QR</th>
                        <th class="right">Transferencia</th>
                        <th class="right">Mixto</th>
                        <th class="right">Total a Entregar / Justificar</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filasMeseros}
                    </tbody>
                  </table>
                `
            }
          </section>

          <section>
            <h2>DETALLE DE VENTAS POR MESERO</h2>
            ${detalleVentas || `<p class="muted">No hay detalle de ventas.</p>`}
          </section>

          <section>
            <h2>DETALLE DE EGRESOS</h2>
            ${egresosDetalle || `<p class="muted">No hay egresos registrados.</p>`}
          </section>

          <section>
            <h2>CORTESÍAS</h2>
            ${cortesiasDetalle || `<p class="muted">No hay cortesías registradas.</p>`}
          </section>

          <section class="page-avoid">
            <h2>ANULACIONES</h2>

            <h3>Ventas anuladas</h3>

            ${
              reporte.ventasAnuladas.length === 0
                ? `<p class="muted">No hay ventas anuladas.</p>`
                : `
                  <table>
                    <thead>
                      <tr>
                        <th class="center">No.</th>
                        <th>Venta</th>
                        <th>Comanda</th>
                        <th>Mesero</th>
                        <th class="right">Total</th>
                        <th>Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filasVentasAnuladas}
                    </tbody>
                  </table>
                `
            }

            <h3>Comandas anuladas</h3>

            ${
              reporte.comandasAnuladas.length === 0
                ? `<p class="muted">No hay comandas anuladas.</p>`
                : `
                  <table>
                    <thead>
                      <tr>
                        <th class="center">No.</th>
                        <th>Comanda</th>
                        <th>Mesero</th>
                        <th class="right">Total Ref.</th>
                        <th>Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filasComandasAnuladas}
                    </tbody>
                  </table>
                `
            }
          </section>

          <section class="page-avoid">
            <h2>INVENTARIO AFECTADO</h2>

            ${
              reporte.inventarioAfectado.length === 0
                ? `<p class="muted">No hay inventario afectado.</p>`
                : `
                  <table>
                    <thead>
                      <tr>
                        <th class="center">No.</th>
                        <th>Producto</th>
                        <th>Almacén</th>
                        <th class="right">Vendido</th>
                        <th class="right">Cortesía</th>
                        <th class="right">Total Descontado</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filasInventario}
                    </tbody>
                  </table>
                `
            }
          </section>

          <section class="firmas page-avoid">
            <div>
              <div class="firma-linea"></div>
              <p>Responsable de caja</p>
            </div>

            <div>
              <div class="firma-linea"></div>
              <p>Administrador</p>
            </div>

            <div>
              <div class="firma-linea"></div>
              <p>Contabilidad</p>
            </div>
          </section>

        </div>
      </body>
    </html>
  `;
}

/* =====================================================
    IMPRESIÓN POR IFRAME
===================================================== */

function imprimirReportePreliminar(
  reporte: ReporteCierreCajaType
) {
  const iframe =
    document.createElement("iframe");

  iframe.style.position =
    "fixed";

  iframe.style.right =
    "0";

  iframe.style.bottom =
    "0";

  iframe.style.width =
    "0";

  iframe.style.height =
    "0";

  iframe.style.border =
    "0";

  document.body.appendChild(
    iframe
  );

  const documento =
    iframe.contentWindow?.document;

  if (!documento) {
    Swal.fire({
      icon: "error",
      title: "No se pudo imprimir",
      text: "No se pudo preparar el reporte para imprimir.",
    });

    document.body.removeChild(
      iframe
    );

    return;
  }

  documento.open();

  documento.write(
    generarHtmlImpresionPreliminar(
      reporte
    )
  );

  documento.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => {
      if (
        document.body.contains(
          iframe
        )
      ) {
        document.body.removeChild(
          iframe
        );
      }
    }, 1000);
  }, 700);
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

              <p
                className={`mt-1 text-2xl font-black ${
                  resumen.diferencia === 0
                    ? "text-emerald-600"
                    : resumen.diferencia > 0
                      ? "text-blue-600"
                      : "text-red-600"
                }`}
              >
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
                      <th className="py-3 pr-4">
                        Mesero
                      </th>

                      <th className="py-3 pr-4 text-right">
                        Efectivo
                      </th>

                      <th className="py-3 pr-4 text-right">
                        QR
                      </th>

                      <th className="py-3 pr-4 text-right">
                        Transferencia
                      </th>

                      <th className="py-3 pr-4 text-right">
                        Mixto
                      </th>

                      <th className="py-3 pr-4 text-right">
                        Total a entregar / justificar
                      </th>
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
                            {formatoBs(
                              mesero.efectivo
                            )}
                          </td>

                          <td className="py-3 pr-4 text-right">
                            {formatoBs(
                              mesero.qr
                            )}
                          </td>

                          <td className="py-3 pr-4 text-right">
                            {formatoBs(
                              mesero.transferencia
                            )}
                          </td>

                          <td className="py-3 pr-4 text-right">
                            {formatoBs(
                              mesero.mixto
                            )}
                          </td>

                          <td className="py-3 pr-4 text-right font-black text-fuchsia-700">
                            {formatoBs(
                              mesero.totalVentas
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-3">
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                imprimirReportePreliminar(
                  reporte
                )
              }
              disabled={confirmando}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>

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
  const navigate = useNavigate();

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
    isLoading: cargandoApertura,
  } = useQuery({
    queryKey: [
      "apertura-activa",
      cajaId,
    ],

    queryFn: () =>
      getAperturaActivaByCaja(
        cajaId!
      ),

    enabled: Boolean(cajaId),

    retry: false,
  });

  const [
    formData,
    setFormData,
  ] = useState<CierreCajaFormType>({
    idPerfil: "",
    idCaja: cajaId || "",
    idSucursal: sucursalId || "",
    fecha: obtenerFechaLocal(),
    horaCierre: obtenerHoraLocal(),
    montoReal: 0,
    observacion: "",
    creadoPor: "",
  });

  useEffect(() => {
    setFormData(
      (actual) => ({
        ...actual,
        idCaja: cajaId || "",
        idSucursal: sucursalId || "",
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
        idPerfil: String(perfil._id),
        creadoPor: String(perfil._id),
      })
    );
  }, [
    perfil,
  ]);

  useEffect(() => {
    if (
      !aperturaActiva?.fechaApertura
    ) {
      return;
    }

    setFormData(
      (actual) => ({
        ...actual,
        fecha: fechaLocalDesdeIso(
          aperturaActiva.fechaApertura
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
        cajaId: cajaId || "",
        idSucursal: sucursalId || "",
        idPerfil: String(perfil?._id || ""),
        montoReal: Number(
          formData.montoReal || 0
        ),
        fechaCierre:
          construirFechaCierrePreview(
            formData.fecha,
            formData.horaCierre,
            aperturaActiva?.fechaApertura
          ),
      }),

    onSuccess: (reporte) => {
      setReportePreview(reporte);
    },

    onError: async (
      error: Error
    ) => {
      await Swal.fire({
        icon: "error",
        title: "No se pudo generar el preview",
        text: error.message,
      });
    },
  });

  const {
    mutate: cerrarCaja,
    isPending: cerrandoCaja,
  } = useMutation({
    mutationFn: () =>
      createCierreCaja(formData),

    onSuccess: async (
      reporte
    ) => {
      await invalidarConsultas();

      setReportePreview(null);

      await Swal.fire({
        icon:
          reporte.resumen.estado ===
          "cuadrado"
            ? "success"
            : "warning",

        title: reporte.message,

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

    onError: async (
      error: Error
    ) => {
      await Swal.fire({
        icon: "error",
        title: "No se pudo cerrar la caja",
        text: error.message,
      });
    },
  });

  const validarFormulario =
    () => {
      if (!aperturaActiva) {
        Swal.fire({
          icon: "error",
          title: "Caja sin apertura",
          text: "La caja no tiene una apertura activa.",
        });

        return false;
      }

      if (!perfil?._id) {
        Swal.fire({
          icon: "error",
          title: "Perfil no cargado",
          text: "No se pudo identificar al usuario que cerrará la caja.",
        });

        return false;
      }

      if (!cajaId) {
        Swal.fire({
          icon: "error",
          title: "Caja no válida",
          text: "No se encontró el ID de la caja.",
        });

        return false;
      }

      if (!sucursalId) {
        Swal.fire({
          icon: "error",
          title: "Sucursal no válida",
          text: "No se encontró el ID de la sucursal.",
        });

        return false;
      }

      return true;
    };

  const handlePreview = () => {
    if (!validarFormulario()) {
      return;
    }

    generarPreview();
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    generarPreview();
  };

  const handleConfirmarCierre =
    async () => {
      if (!validarFormulario()) {
        return;
      }

      const resultado =
        await Swal.fire({
          icon: "warning",
          title: "¿Confirmar cierre de caja?",
          text: "Después de cerrar, la apertura quedará cerrada y ya no se podrán registrar movimientos en esta caja.",
          showCancelButton: true,
          confirmButtonText: "Sí, cerrar caja",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#c026d3",
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