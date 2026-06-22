// // // src/components/cierrecaja/CierreCajaDetailModal.tsx

// // import {
// //   Fragment,
// // } from "react";

// // import {
// //   Dialog,
// //   Transition,
// // } from "@headlessui/react";

// // import {
// //   useLocation,
// //   useNavigate,
// // } from "react-router-dom";

// // import {
// //   useQuery,
// // } from "@tanstack/react-query";

// // import {
// //   toast,
// // } from "react-toastify";

// // import {

// //   Banknote,
// //   CalendarDays,
// //   Clock3,
// //   FileText,
// //   ShieldCheck,
// //   Store,
// //   User2,
// //   Wallet,
// //   X,

// // } from "lucide-react";

// // import {
// //   getCierreCajaById,
// // } from "@/api/CierreCajaApi";


// // export default function CierreCajaDetailModal() {

// //   const navigate =
// //     useNavigate();

// //   const location =
// //     useLocation();

// //   const queryParams =
// //     new URLSearchParams(
// //       location.search
// //     );

// //   const cierreCajaId =
// //     queryParams.get(
// //       "detail"
// //     )!;

// //   const show =
// //     !!cierreCajaId;

// //   const currentPath =
// //     location.pathname;

// //   /* =========================
// //       QUERY
// //   ========================= */

// //   const {

// //     data,

// //     isError,

// //     error,

// //   } = useQuery({

// //     queryKey: [

// //       "cierreCaja",

// //       cierreCajaId,

// //     ],

// //     queryFn: () =>
// //       getCierreCajaById(
// //         cierreCajaId
// //       ),

// //     enabled:
// //       !!cierreCajaId,

// //     retry: false,

// //   });

// //   /* =========================
// //       ERROR
// //   ========================= */

// //   if (isError) {

// //     toast.error(

// //       (error as Error)
// //         .message,

// //       {

// //         toastId:
// //           "error",

// //       }

// //     );

// //     navigate(
// //       currentPath
// //     );

// //   }

// //   /* =========================
// //       CLOSE
// //   ========================= */

// //   const closeModal = () => {

// //     const params =
// //       new URLSearchParams(
// //         location.search
// //       );

// //     params.delete(
// //       "detail"
// //     );

// //     navigate(

// //       `${location.pathname}?${params.toString()}`,

// //       {

// //         replace: true,

// //       }

// //     );

// //   };

// //   if (data)

// //     return (

// //       <Transition
// //         appear
// //         show={show}
// //         as={Fragment}
// //       >

// //         <Dialog
// //           as="div"
// //           className="relative z-50"
// //           onClose={closeModal}
// //         >

// //           {/* BACKDROP */}
// //           <Transition.Child
// //             as={Fragment}
// //             enter="ease-out duration-300"
// //             enterFrom="opacity-0"
// //             enterTo="opacity-100"
// //             leave="ease-in duration-200"
// //             leaveFrom="opacity-100"
// //             leaveTo="opacity-0"
// //           >

// //             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

// //           </Transition.Child>

// //           {/* MODAL */}
// //           <div className="fixed inset-0 overflow-y-auto">

// //             <div className="flex min-h-full items-center justify-center p-4 text-center">

// //               <Transition.Child
// //                 as={Fragment}
// //                 enter="ease-out duration-300"
// //                 enterFrom="opacity-0 scale-95"
// //                 enterTo="opacity-100 scale-100"
// //                 leave="ease-in duration-200"
// //                 leaveFrom="opacity-100 scale-100"
// //                 leaveTo="opacity-0 scale-95"
// //               >

// //                 <Dialog.Panel
// //                   className="
// //                     w-full
// //                     max-w-5xl
// //                     transform
// //                     overflow-hidden
// //                     rounded-3xl
// //                     bg-white
// //                     p-8
// //                     text-left
// //                     align-middle
// //                     shadow-2xl
// //                     transition-all
// //                   "
// //                 >

// //                   {/* HEADER */}
// //                   <div className="mb-8 flex items-start justify-between">

// //                     <div className="flex items-center gap-4">

// //                       <div
// //                         className="
// //                           flex
// //                           h-16
// //                           w-16
// //                           items-center
// //                           justify-center
// //                           rounded-2xl
// //                           bg-fuchsia-100
// //                           text-fuchsia-600
// //                         "
// //                       >

// //                         <Wallet className="h-8 w-8" />

// //                       </div>

// //                       <div>

// //                         <Dialog.Title
// //                           as="h3"
// //                           className="
// //                             text-3xl
// //                             font-black
// //                             text-slate-800
// //                           "
// //                         >

// //                           Detalle Cierre Caja

// //                         </Dialog.Title>

// //                         <p className="mt-1 text-slate-500">

// //                           Información completa del cierre

// //                         </p>

// //                       </div>

// //                     </div>

// //                     {/* CLOSE */}
// //                     <button
// //                       type="button"
// //                       onClick={closeModal}
// //                       className="
// //                         flex
// //                         h-11
// //                         w-11
// //                         items-center
// //                         justify-center
// //                         rounded-2xl
// //                         bg-slate-100
// //                         text-slate-500
// //                         transition
// //                         hover:bg-red-100
// //                         hover:text-red-600
// //                       "
// //                     >

// //                       <X className="h-5 w-5" />

// //                     </button>

// //                   </div>

// //                   {/* GRID */}
// //                   <div className="grid gap-6 md:grid-cols-2">

// //                     {/* PERFIL */}
// //                     <div
// //                       className="
// //                         rounded-2xl
// //                         border
// //                         border-slate-200
// //                         bg-slate-50
// //                         p-6
// //                       "
// //                     >

// //                       <p
// //                         className="
// //                           mb-2
// //                           text-sm
// //                           font-bold
// //                           uppercase
// //                           text-slate-500
// //                         "
// //                       >
// //                         Perfil
// //                       </p>

// //                       <div className="flex items-center gap-2">

// //                         <User2 className="h-4 w-4 text-fuchsia-600" />

// //                         <p className="font-semibold text-slate-800">

// //                           {

// //                             typeof data.idPerfil === "string"

// //                               ? data.idPerfil

// //                               : `${data.idPerfil?.nombres || ""} ${data.idPerfil?.apellidos || ""}`

// //                           }

// //                         </p>

// //                       </div>

// //                     </div>

// //                     {/* SUCURSAL */}
// //                     <div
// //                       className="
// //                         rounded-2xl
// //                         border
// //                         border-slate-200
// //                         bg-slate-50
// //                         p-6
// //                       "
// //                     >

// //                       <p
// //                         className="
// //                           mb-2
// //                           text-sm
// //                           font-bold
// //                           uppercase
// //                           text-slate-500
// //                         "
// //                       >
// //                         Sucursal
// //                       </p>

// //                       <div className="flex items-center gap-2">

// //                         <Store className="h-4 w-4 text-fuchsia-600" />

// //                         <p className="font-semibold text-slate-800">

// //                           {

// //                             typeof data.idSucursal === "string"

// //                               ? data.idSucursal

// //                               : data.idSucursal?.nombre

// //                           }

// //                         </p>

// //                       </div>

// //                     </div>

// //                     {/* CAJA */}
// //                     <div
// //                       className="
// //                         rounded-2xl
// //                         border
// //                         border-slate-200
// //                         bg-slate-50
// //                         p-6
// //                       "
// //                     >

// //                       <p
// //                         className="
// //                           mb-2
// //                           text-sm
// //                           font-bold
// //                           uppercase
// //                           text-slate-500
// //                         "
// //                       >
// //                         Caja
// //                       </p>

// //                       <p className="font-semibold text-slate-800">

// //                         {

// //                           typeof data.idCaja === "string"

// //                             ? data.idCaja

// //                             : data.idCaja?.nombre

// //                         }

// //                       </p>

// //                     </div>

// //                     {/* ESTADO */}
// //                     <div
// //                       className="
// //                         rounded-2xl
// //                         border
// //                         border-slate-200
// //                         bg-slate-50
// //                         p-6
// //                       "
// //                     >

// //                       <p
// //                         className="
// //                           mb-2
// //                           text-sm
// //                           font-bold
// //                           uppercase
// //                           text-slate-500
// //                         "
// //                       >
// //                         Estado
// //                       </p>

// //                       <span
// //                         className={`
// //                           rounded-full
// //                           px-3
// //                           py-1
// //                           text-xs
// //                           font-bold

// //                           ${

// //                             data.estado === "cuadrado"

// //                               ? "bg-emerald-100 text-emerald-700"

// //                               : "bg-red-100 text-red-700"

// //                           }
// //                         `}
// //                       >

// //                         {data.estado}

// //                       </span>

// //                     </div>

// //                   </div>

// //                   {/* FECHAS */}
// //                   <div className="mt-6 grid gap-6 md:grid-cols-2">

// //                     {/* FECHA APERTURA */}
// //                     <div
// //                       className="
// //                         rounded-2xl
// //                         border
// //                         border-slate-200
// //                         bg-slate-50
// //                         p-6
// //                       "
// //                     >

// //                       <p
// //                         className="
// //                           mb-3
// //                           text-sm
// //                           font-bold
// //                           uppercase
// //                           text-slate-500
// //                         "
// //                       >
// //                         Fecha Apertura
// //                       </p>

// //                       <div className="flex items-center gap-2">

// //                         <CalendarDays className="h-4 w-4 text-fuchsia-600" />

// //                         <p className="font-semibold text-slate-800">

// //                           {

// //                             new Date(
// //                               data.fechaApertura
// //                             ).toLocaleDateString()

// //                           }

// //                         </p>

// //                       </div>

// //                     </div>

// //                     {/* FECHA CIERRE */}
// //                     <div
// //                       className="
// //                         rounded-2xl
// //                         border
// //                         border-slate-200
// //                         bg-slate-50
// //                         p-6
// //                       "
// //                     >

// //                       <p
// //                         className="
// //                           mb-3
// //                           text-sm
// //                           font-bold
// //                           uppercase
// //                           text-slate-500
// //                         "
// //                       >
// //                         Fecha Cierre
// //                       </p>

// //                       <div className="flex items-center gap-2">

// //                         <Clock3 className="h-4 w-4 text-fuchsia-600" />

// //                         <p className="font-semibold text-slate-800">

// //                           {

// //                             new Date(
// //                               data.fechaCierre
// //                             ).toLocaleDateString()

// //                           }

// //                         </p>

// //                       </div>

// //                     </div>

// //                   </div>

// //                   {/* MONTOS */}
// //                   <div className="mt-6 grid gap-6 md:grid-cols-3">

// //                     {/* INICIAL */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Monto Inicial
// //                       </p>

// //                       <div className="flex items-center gap-2">

// //                         <Banknote className="h-4 w-4 text-fuchsia-600" />

// //                         <p className="font-bold text-slate-800">
// //                           Bs. {data.montoInicial}
// //                         </p>

// //                       </div>

// //                     </div>

// //                     {/* VENTAS */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Total Ventas
// //                       </p>

// //                       <p className="font-bold text-emerald-600">
// //                         Bs. {data.totalVentas}
// //                       </p>

// //                     </div>

// //                     {/* EGRESOS */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Total Egresos
// //                       </p>

// //                       <p className="font-bold text-red-600">
// //                         Bs. {data.totalEgresos}
// //                       </p>

// //                     </div>

// //                     {/* ESPERADO */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Total Esperado
// //                       </p>

// //                       <p className="font-bold text-sky-600">
// //                         Bs. {data.totalEsperado}
// //                       </p>

// //                     </div>

// //                     {/* REAL */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Monto Real
// //                       </p>

// //                       <p className="font-bold text-fuchsia-600">
// //                         Bs. {data.montoReal}
// //                       </p>

// //                     </div>

// //                     {/* DIFERENCIA */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Diferencia
// //                       </p>

// //                       <p
// //                         className={`
// //                           font-bold

// //                           ${

// //                             data.diferencia === 0

// //                               ? "text-emerald-600"

// //                               : "text-red-600"

// //                           }
// //                         `}
// //                       >

// //                         Bs. {data.diferencia}

// //                       </p>

// //                     </div>

// //                   </div>

// //                   {/* OBSERVACION */}
// //                   <div
// //                     className="
// //                       mt-6
// //                       rounded-2xl
// //                       border
// //                       border-slate-200
// //                       bg-slate-50
// //                       p-6
// //                     "
// //                   >

// //                     <p
// //                       className="
// //                         mb-3
// //                         text-sm
// //                         font-bold
// //                         uppercase
// //                         text-slate-500
// //                       "
// //                     >
// //                       Observación
// //                     </p>

// //                     <div className="flex items-start gap-3">

// //                       <FileText className="mt-1 h-5 w-5 text-fuchsia-600" />

// //                       <p className="text-slate-700">

// //                         {data.observacion ||
// //                           "Sin observaciones"}

// //                       </p>

// //                     </div>

// //                   </div>

// //                   {/* AUDITORIA */}
// //                   <div className="mt-6 grid gap-6 md:grid-cols-2">

// //                     {/* CREADO */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Creado Por
// //                       </p>

// //                       <div className="flex items-center gap-2">

// //                         <ShieldCheck className="h-4 w-4 text-fuchsia-600" />

// //                         <p className="font-semibold text-slate-800">

// //                           {data.creadoPor ||
// //                             "Sin registro"}

// //                         </p>

// //                       </div>

// //                     </div>

// //                     {/* FECHA CREACION */}
// //                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

// //                       <p className="mb-2 text-sm font-bold uppercase text-slate-500">
// //                         Fecha Creación
// //                       </p>

// //                       <div className="flex items-center gap-2">

// //                         <CalendarDays className="h-4 w-4 text-fuchsia-600" />

// //                         <p className="font-semibold text-slate-800">

// //                           {

// //                             data.fechaCreacion

// //                               ? new Date(
// //                                   data.fechaCreacion
// //                                 ).toLocaleString()

// //                               : "Sin registro"

// //                           }

// //                         </p>

// //                       </div>

// //                     </div>

// //                   </div>

// //                 </Dialog.Panel>

// //               </Transition.Child>

// //             </div>

// //           </div>

// //         </Dialog>

// //       </Transition>

// //     );

// // }
// // src/components/cierrecaja/CierreCajaDetailModal.tsx

// import {
//   Fragment,
// } from "react";

// import {
//   Dialog,
//   Transition,
// } from "@headlessui/react";

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import {
//   useQuery,
// } from "@tanstack/react-query";

// import {
//   toast,
// } from "react-toastify";

// import {
//   AlertTriangle,
//   Banknote,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   FileText,
//   Gift,
//   Package,
//   Printer,
//   ReceiptText,
//   ShieldCheck,
//   ShoppingCart,
//   Store,
//   User2,
//   Wallet,
//   X,
// } from "lucide-react";

// import {
//   getReporteCierreCajaById,
// } from "@/api/CierreCajaApi";

// import type {
//   ReporteCierreCajaType,
// } from "@/types/CierreCajaType";

// function formatoBs(
//   valor?: number
// ) {
//   return `Bs. ${Number(
//     valor || 0
//   ).toFixed(2)}`;
// }

// function formatoFecha(
//   fecha?: string
// ) {
//   if (!fecha) {
//     return "Sin fecha";
//   }

//   const valor =
//     new Date(fecha);

//   if (
//     Number.isNaN(
//       valor.getTime()
//     )
//   ) {
//     return "Fecha inválida";
//   }

//   return valor.toLocaleString(
//     "es-BO"
//   );
// }

// function estadoClass(
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

// function imprimirInforme() {
//   window.print();
// }

// function valorTexto(
//   valor: unknown
// ) {
//   if (
//     valor === null ||
//     valor === undefined
//   ) {
//     return "";
//   }

//   if (
//     typeof valor === "string" ||
//     typeof valor === "number" ||
//     typeof valor === "boolean"
//   ) {
//     return String(valor);
//   }

//   return "";
// }

// export default function CierreCajaDetailModal() {
//   const navigate =
//     useNavigate();

//   const location =
//     useLocation();

//   const queryParams =
//     new URLSearchParams(
//       location.search
//     );

//   const cierreCajaId =
//     queryParams.get(
//       "detail"
//     );

//   const show =
//     Boolean(cierreCajaId);

//   const currentPath =
//     location.pathname;

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: [
//       "reporte-cierre-caja",
//       cierreCajaId,
//     ],

//     queryFn: () =>
//       getReporteCierreCajaById(
//         cierreCajaId!
//       ),

//     enabled:
//       Boolean(cierreCajaId),

//     retry:
//       false,
//   });

//   if (isError) {
//     toast.error(
//       (error as Error).message,
//       {
//         toastId:
//           "error-reporte-cierre",
//       }
//     );

//     navigate(
//       currentPath,
//       {
//         replace: true,
//       }
//     );
//   }

//   const closeModal = () => {
//     const params =
//       new URLSearchParams(
//         location.search
//       );

//     params.delete(
//       "detail"
//     );

//     const query =
//       params.toString();

//     navigate(
//       query
//         ? `${location.pathname}?${query}`
//         : location.pathname,
//       {
//         replace: true,
//       }
//     );
//   };

//   const reporte =
//     data as ReporteCierreCajaType | undefined;

//   return (
//     <Transition
//       appear
//       show={show}
//       as={Fragment}
//     >
//       <Dialog
//         as="div"
//         className="relative z-50"
//         onClose={closeModal}
//       >
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm print:hidden" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto print:static print:overflow-visible">
//           <div className="flex min-h-full items-center justify-center p-4 text-center print:block print:p-0">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all print:max-w-none print:rounded-none print:shadow-none">
//                 {isLoading || !reporte ? (
//                   <div className="flex min-h-[400px] items-center justify-center">
//                     <div className="h-14 w-14 animate-spin rounded-full border-b-4 border-fuchsia-600" />
//                   </div>
//                 ) : (
//                   <div id="informe-cierre-caja">
//                     {/* HEADER */}
//                     <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-6 print:bg-white">
//                       <div className="flex items-center gap-4">
//                         <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600 print:hidden">
//                           <Wallet className="h-8 w-8" />
//                         </div>

//                         <div>
//                           <Dialog.Title
//                             as="h3"
//                             className="text-3xl font-black text-slate-800"
//                           >
//                             Informe contable de cierre de caja
//                           </Dialog.Title>

//                           <p className="mt-1 text-sm text-slate-500">
//                             Reporte centralizado de ventas, egresos, cortesías, anulaciones e inventario afectado.
//                           </p>

//                           <p className="mt-2 hidden text-xs text-slate-500 print:block">
//                             Documento generado desde el sistema de control de caja.
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex gap-3 print:hidden">
//                         <button
//                           type="button"
//                           onClick={imprimirInforme}
//                           className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
//                         >
//                           <Printer className="h-5 w-5" />
//                           Imprimir informe
//                         </button>

//                         <button
//                           type="button"
//                           onClick={closeModal}
//                           className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-500 transition hover:bg-slate-200"
//                         >
//                           <X className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="space-y-6 p-6">
//                       {/* DATOS GENERALES */}
//                       <section className="grid gap-4 md:grid-cols-4">
//                         <div className="rounded-2xl border border-slate-200 p-4">
//                           <div className="mb-2 flex items-center gap-2 text-slate-500">
//                             <Store className="h-5 w-5" />
//                             <p className="text-xs font-black uppercase">
//                               Sucursal
//                             </p>
//                           </div>

//                           <p className="text-lg font-black text-slate-800">
//                             {reporte.general.sucursal}
//                           </p>

//                           <p className="text-sm text-slate-500">
//                             {reporte.general.caja}
//                           </p>
//                         </div>

//                         <div className="rounded-2xl border border-slate-200 p-4">
//                           <div className="mb-2 flex items-center gap-2 text-slate-500">
//                             <User2 className="h-5 w-5" />
//                             <p className="text-xs font-black uppercase">
//                               Responsable
//                             </p>
//                           </div>

//                           <p className="text-lg font-black text-slate-800">
//                             {reporte.general.responsableCierre}
//                           </p>
//                         </div>

//                         <div className="rounded-2xl border border-slate-200 p-4">
//                           <div className="mb-2 flex items-center gap-2 text-slate-500">
//                             <CalendarDays className="h-5 w-5" />
//                             <p className="text-xs font-black uppercase">
//                               Apertura
//                             </p>
//                           </div>

//                           <p className="text-base font-black text-slate-800">
//                             {formatoFecha(
//                               reporte.general.fechaApertura
//                             )}
//                           </p>
//                         </div>

//                         <div className="rounded-2xl border border-slate-200 p-4">
//                           <div className="mb-2 flex items-center gap-2 text-slate-500">
//                             <Clock3 className="h-5 w-5" />
//                             <p className="text-xs font-black uppercase">
//                               Cierre
//                             </p>
//                           </div>

//                           <p className="text-base font-black text-slate-800">
//                             {formatoFecha(
//                               reporte.general.fechaCierre
//                             )}
//                           </p>

//                           <p className="text-sm text-slate-500">
//                             Duración: {reporte.general.duracionMinutos} min
//                           </p>
//                         </div>
//                       </section>

//                       {/* RESUMEN CONTABLE */}
//                       <section>
//                         <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
//                           <ShieldCheck className="h-6 w-6 text-fuchsia-600" />
//                           Resumen contable
//                         </h4>

//                         <div className="grid gap-4 md:grid-cols-4">
//                           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                             <p className="text-xs font-black uppercase text-slate-500">
//                               Monto inicial
//                             </p>

//                             <p className="mt-2 text-2xl font-black text-slate-900">
//                               {formatoBs(
//                                 reporte.resumen.montoInicial
//                               )}
//                             </p>
//                           </div>

//                           <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
//                             <p className="text-xs font-black uppercase text-emerald-700">
//                               Total ventas
//                             </p>

//                             <p className="mt-2 text-2xl font-black text-emerald-700">
//                               {formatoBs(
//                                 reporte.resumen.totalVentas
//                               )}
//                             </p>
//                           </div>

//                           <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
//                             <p className="text-xs font-black uppercase text-red-700">
//                               Total egresos
//                             </p>

//                             <p className="mt-2 text-2xl font-black text-red-700">
//                               {formatoBs(
//                                 reporte.resumen.totalEgresos
//                               )}
//                             </p>
//                           </div>

//                           <div className={`rounded-2xl border p-4 ${estadoClass(reporte.resumen.estado)}`}>
//                             <p className="text-xs font-black uppercase">
//                               Estado
//                             </p>

//                             <p className="mt-2 text-2xl font-black capitalize">
//                               {reporte.resumen.estado}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-4 grid gap-4 md:grid-cols-3">
//                           <div className="rounded-2xl border border-slate-200 p-4">
//                             <p className="text-sm text-slate-500">
//                               Total esperado
//                             </p>

//                             <p className="mt-2 text-2xl font-black text-slate-900">
//                               {formatoBs(
//                                 reporte.resumen.totalEsperadoGeneral ??
//                                   reporte.resumen.totalEsperadoEfectivo
//                               )}
//                             </p>
//                           </div>

//                           <div className="rounded-2xl border border-slate-200 p-4">
//                             <p className="text-sm text-slate-500">
//                               Monto real verificado
//                             </p>

//                             <p className="mt-2 text-2xl font-black text-slate-900">
//                               {formatoBs(
//                                 reporte.resumen.montoReal
//                               )}
//                             </p>
//                           </div>

//                           <div className="rounded-2xl border border-slate-200 p-4">
//                             <p className="text-sm text-slate-500">
//                               Diferencia
//                             </p>

//                             <p className={`mt-2 text-2xl font-black ${
//                               reporte.resumen.diferencia === 0
//                                 ? "text-emerald-600"
//                                 : reporte.resumen.diferencia > 0
//                                   ? "text-blue-600"
//                                   : "text-red-600"
//                             }`}>
//                               {formatoBs(
//                                 reporte.resumen.diferencia
//                               )}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
//                           <b>Fórmula aplicada:</b>{" "}
//                           Monto inicial + ventas pagadas - egresos registrados = total esperado.
//                         </div>
//                       </section>

//                       {/* INGRESOS POR MESERO */}
//                       <section className="break-inside-avoid">
//                         <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
//                           <ReceiptText className="h-6 w-6 text-fuchsia-600" />
//                           Ingresos por mesero / vendedor
//                         </h4>

//                         {reporte.ingresosPorMesero.length === 0 ? (
//                           <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
//                             No hay ventas registradas por mesero en este cierre.
//                           </div>
//                         ) : (
//                           <div className="overflow-x-auto rounded-2xl border border-slate-200">
//                             <table className="w-full min-w-[900px] text-sm">
//                               <thead className="bg-slate-100">
//                                 <tr className="text-left text-xs font-black uppercase text-slate-500">
//                                   <th className="px-4 py-3">Mesero</th>
//                                   <th className="px-4 py-3 text-right">Ventas</th>
//                                   <th className="px-4 py-3 text-right">Efectivo</th>
//                                   <th className="px-4 py-3 text-right">QR</th>
//                                   <th className="px-4 py-3 text-right">Transferencia</th>
//                                   <th className="px-4 py-3 text-right">Mixto</th>
//                                   <th className="px-4 py-3 text-right">Total a entregar / justificar</th>
//                                 </tr>
//                               </thead>

//                               <tbody>
//                                 {reporte.ingresosPorMesero.map(
//                                   (mesero) => (
//                                     <tr
//                                       key={mesero.idPerfil}
//                                       className="border-t border-slate-100"
//                                     >
//                                       <td className="px-4 py-3 font-black text-slate-800">
//                                         {mesero.nombreMesero}
//                                       </td>

//                                       <td className="px-4 py-3 text-right">
//                                         {mesero.cantidadVentas}
//                                       </td>

//                                       <td className="px-4 py-3 text-right">
//                                         {formatoBs(mesero.efectivo)}
//                                       </td>

//                                       <td className="px-4 py-3 text-right">
//                                         {formatoBs(mesero.qr)}
//                                       </td>

//                                       <td className="px-4 py-3 text-right">
//                                         {formatoBs(mesero.transferencia)}
//                                       </td>

//                                       <td className="px-4 py-3 text-right">
//                                         {formatoBs(mesero.mixto)}
//                                       </td>

//                                       <td className="px-4 py-3 text-right text-lg font-black text-fuchsia-700">
//                                         {formatoBs(mesero.totalVentas)}
//                                       </td>
//                                     </tr>
//                                   )
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>
//                         )}
//                       </section>

//                       {/* DETALLE DE VENTAS POR MESERO */}
//                       <section className="break-inside-avoid">
//                         <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
//                           <ShoppingCart className="h-6 w-6 text-emerald-600" />
//                           Detalle de ventas por mesero
//                         </h4>

//                         <div className="space-y-4">
//                           {reporte.ingresosPorMesero.map(
//                             (mesero) => (
//                               <div
//                                 key={`${mesero.idPerfil}-ventas`}
//                                 className="rounded-2xl border border-slate-200 p-4"
//                               >
//                                 <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//                                   <h5 className="font-black text-slate-800">
//                                     {mesero.nombreMesero}
//                                   </h5>

//                                   <p className="font-black text-fuchsia-700">
//                                     Total: {formatoBs(mesero.totalVentas)}
//                                   </p>
//                                 </div>

//                                 {mesero.ventas && mesero.ventas.length > 0 ? (
//                                   <div className="overflow-x-auto">
//                                     <table className="w-full min-w-[700px] text-sm">
//                                       <thead>
//                                         <tr className="border-b text-left text-xs uppercase text-slate-400">
//                                           <th className="py-2 pr-4">Venta</th>
//                                           <th className="py-2 pr-4">Comanda</th>
//                                           <th className="py-2 pr-4">Fecha</th>
//                                           <th className="py-2 pr-4">Método</th>
//                                           <th className="py-2 pr-4 text-right">Subtotal</th>
//                                           <th className="py-2 pr-4 text-right">Descuento</th>
//                                           <th className="py-2 text-right">Total</th>
//                                         </tr>
//                                       </thead>

//                                       <tbody>
//                                         {mesero.ventas.map(
//                                           (venta, index) => (
//                                             <tr
//                                               key={`${mesero.idPerfil}-${index}`}
//                                               className="border-b border-slate-100"
//                                             >
//                                               <td className="py-2 pr-4">
//                                                 {valorTexto(venta.numeroVenta) || "-"}
//                                               </td>

//                                               <td className="py-2 pr-4">
//                                                 {valorTexto(venta.numeroComanda) || "-"}
//                                               </td>

//                                               <td className="py-2 pr-4">
//                                                 {formatoFecha(
//                                                   valorTexto(venta.fechaVenta)
//                                                 )}
//                                               </td>

//                                               <td className="py-2 pr-4 capitalize">
//                                                 {valorTexto(venta.metodoPago)}
//                                               </td>

//                                               <td className="py-2 pr-4 text-right">
//                                                 {formatoBs(
//                                                   Number(venta.subtotal || 0)
//                                                 )}
//                                               </td>

//                                               <td className="py-2 pr-4 text-right">
//                                                 {formatoBs(
//                                                   Number(venta.descuento || 0)
//                                                 )}
//                                               </td>

//                                               <td className="py-2 text-right font-black">
//                                                 {formatoBs(
//                                                   Number(venta.total || 0)
//                                                 )}
//                                               </td>
//                                             </tr>
//                                           )
//                                         )}
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 ) : (
//                                   <p className="text-sm text-slate-500">
//                                     Sin detalle de ventas.
//                                   </p>
//                                 )}
//                               </div>
//                             )
//                           )}
//                         </div>
//                       </section>

//                       {/* EGRESOS */}
//                       <section className="break-inside-avoid">
//                         <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
//                           <Banknote className="h-6 w-6 text-red-600" />
//                           Egresos detallados
//                         </h4>

//                         {reporte.egresos.length === 0 ? (
//                           <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
//                             No hay egresos registrados en este cierre.
//                           </div>
//                         ) : (
//                           <div className="space-y-4">
//                             {reporte.egresos.map(
//                               (egreso, index) => (
//                                 <div
//                                   key={`egreso-${index}`}
//                                   className="rounded-2xl border border-red-100 bg-red-50/40 p-4"
//                                 >
//                                   <div className="grid gap-3 md:grid-cols-5">
//                                     <div>
//                                       <p className="text-xs font-black uppercase text-slate-400">
//                                         Nro.
//                                       </p>
//                                       <p className="font-bold">
//                                         {valorTexto(egreso.numeroEgreso) || "-"}
//                                       </p>
//                                     </div>

//                                     <div>
//                                       <p className="text-xs font-black uppercase text-slate-400">
//                                         Responsable
//                                       </p>
//                                       <p className="font-bold">
//                                         {valorTexto(egreso.responsable)}
//                                       </p>
//                                     </div>

//                                     <div>
//                                       <p className="text-xs font-black uppercase text-slate-400">
//                                         Tipo
//                                       </p>
//                                       <p className="font-bold capitalize">
//                                         {valorTexto(egreso.tipoEgreso)}
//                                       </p>
//                                     </div>

//                                     <div>
//                                       <p className="text-xs font-black uppercase text-slate-400">
//                                         Método
//                                       </p>
//                                       <p className="font-bold capitalize">
//                                         {valorTexto(egreso.metodoPago)}
//                                       </p>
//                                     </div>

//                                     <div className="md:text-right">
//                                       <p className="text-xs font-black uppercase text-slate-400">
//                                         Total
//                                       </p>
//                                       <p className="text-lg font-black text-red-600">
//                                         {formatoBs(Number(egreso.total || 0))}
//                                       </p>
//                                     </div>
//                                   </div>

//                                   <p className="mt-3 text-sm text-slate-600">
//                                     <b>Observación:</b>{" "}
//                                     {valorTexto(egreso.observacion) || "Sin observación"}
//                                   </p>

//                                   {Array.isArray(egreso.items) && egreso.items.length > 0 && (
//                                     <div className="mt-4 overflow-x-auto rounded-xl border border-red-100 bg-white">
//                                       <table className="w-full min-w-[750px] text-sm">
//                                         <thead className="bg-slate-50">
//                                           <tr className="text-left text-xs uppercase text-slate-400">
//                                             <th className="px-3 py-2">Descripción</th>
//                                             <th className="px-3 py-2">Tipo</th>
//                                             <th className="px-3 py-2">Almacén</th>
//                                             <th className="px-3 py-2 text-right">Cantidad</th>
//                                             <th className="px-3 py-2 text-right">Costo unit.</th>
//                                             <th className="px-3 py-2 text-right">Subtotal</th>
//                                           </tr>
//                                         </thead>

//                                         <tbody>
//                                           {egreso.items.map(
//                                             (item: any, itemIndex: number) => (
//                                               <tr
//                                                 key={`egreso-item-${index}-${itemIndex}`}
//                                                 className="border-t border-slate-100"
//                                               >
//                                                 <td className="px-3 py-2">
//                                                   {valorTexto(item.descripcion) ||
//                                                     valorTexto(item.producto)}
//                                                 </td>

//                                                 <td className="px-3 py-2 capitalize">
//                                                   {valorTexto(item.tipoItem)}
//                                                 </td>

//                                                 <td className="px-3 py-2">
//                                                   {valorTexto(item.almacen)}
//                                                 </td>

//                                                 <td className="px-3 py-2 text-right">
//                                                   {Number(item.cantidad || 0)}
//                                                 </td>

//                                                 <td className="px-3 py-2 text-right">
//                                                   {formatoBs(Number(item.costoUnitario || 0))}
//                                                 </td>

//                                                 <td className="px-3 py-2 text-right font-black">
//                                                   {formatoBs(Number(item.subtotal || 0))}
//                                                 </td>
//                                               </tr>
//                                             )
//                                           )}
//                                         </tbody>
//                                       </table>
//                                     </div>
//                                   )}
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         )}
//                       </section>

//                       {/* CORTESÍAS */}
//                       <section className="break-inside-avoid">
//                         <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
//                           <Gift className="h-6 w-6 text-violet-600" />
//                           Cortesías
//                         </h4>

//                         {reporte.cortesias.length === 0 ? (
//                           <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
//                             No hay cortesías registradas en este cierre.
//                           </div>
//                         ) : (
//                           <div className="space-y-4">
//                             {reporte.cortesias.map(
//                               (cortesia, index) => (
//                                 <div
//                                   key={`cortesia-${index}`}
//                                   className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4"
//                                 >
//                                   <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//                                     <div>
//                                       <p className="font-black text-slate-800">
//                                         {valorTexto(cortesia.mesero)}
//                                       </p>

//                                       <p className="text-sm text-slate-500">
//                                         Comanda: {valorTexto(cortesia.numeroComanda) || "-"}
//                                       </p>
//                                     </div>

//                                     <p className="font-black text-violet-700">
//                                       Valor referencial: {formatoBs(Number(cortesia.valorReferencial || 0))}
//                                     </p>
//                                   </div>

//                                   <p className="mt-2 text-sm text-slate-600">
//                                     No suma dinero al arqueo, pero sí afecta inventario.
//                                   </p>

//                                   {Array.isArray(cortesia.productos) && cortesia.productos.length > 0 && (
//                                     <div className="mt-4 overflow-x-auto rounded-xl border border-violet-100 bg-white">
//                                       <table className="w-full min-w-[650px] text-sm">
//                                         <thead className="bg-slate-50">
//                                           <tr className="text-left text-xs uppercase text-slate-400">
//                                             <th className="px-3 py-2">Producto</th>
//                                             <th className="px-3 py-2">Almacén</th>
//                                             <th className="px-3 py-2 text-right">Cantidad</th>
//                                             <th className="px-3 py-2 text-right">Precio ref.</th>
//                                             <th className="px-3 py-2 text-right">Subtotal ref.</th>
//                                           </tr>
//                                         </thead>

//                                         <tbody>
//                                           {cortesia.productos.map(
//                                             (producto: any, productoIndex: number) => (
//                                               <tr
//                                                 key={`cortesia-producto-${index}-${productoIndex}`}
//                                                 className="border-t border-slate-100"
//                                               >
//                                                 <td className="px-3 py-2">
//                                                   {valorTexto(producto.producto)}
//                                                 </td>

//                                                 <td className="px-3 py-2">
//                                                   {valorTexto(producto.almacen)}
//                                                 </td>

//                                                 <td className="px-3 py-2 text-right">
//                                                   {Number(producto.cantidad || 0)}
//                                                 </td>

//                                                 <td className="px-3 py-2 text-right">
//                                                   {formatoBs(Number(producto.precioUnitario || 0))}
//                                                 </td>

//                                                 <td className="px-3 py-2 text-right font-black">
//                                                   {formatoBs(Number(producto.subtotal || 0))}
//                                                 </td>
//                                               </tr>
//                                             )
//                                           )}
//                                         </tbody>
//                                       </table>
//                                     </div>
//                                   )}
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         )}
//                       </section>

//                       {/* ANULACIONES */}
//                       <section className="break-inside-avoid">
//                         <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
//                           <AlertTriangle className="h-6 w-6 text-amber-600" />
//                           Anulaciones
//                         </h4>

//                         <div className="grid gap-4 md:grid-cols-2">
//                           <div className="rounded-2xl border border-slate-200 p-4">
//                             <h5 className="mb-3 font-black text-slate-800">
//                               Ventas anuladas
//                             </h5>

//                             {reporte.ventasAnuladas.length === 0 ? (
//                               <p className="text-sm text-slate-500">
//                                 No hay ventas anuladas.
//                               </p>
//                             ) : (
//                               <div className="space-y-3">
//                                 {reporte.ventasAnuladas.map(
//                                   (venta, index) => (
//                                     <div
//                                       key={`venta-anulada-${index}`}
//                                       className="rounded-xl bg-amber-50 p-3 text-sm"
//                                     >
//                                       <p className="font-black">
//                                         {valorTexto(venta.numeroVenta) || "Venta sin número"}
//                                       </p>

//                                       <p>
//                                         Mesero: {valorTexto(venta.mesero)}
//                                       </p>

//                                       <p>
//                                         Total: {formatoBs(Number(venta.total || 0))}
//                                       </p>

//                                       <p>
//                                         Motivo: {valorTexto(venta.motivo) || "Sin motivo"}
//                                       </p>
//                                     </div>
//                                   )
//                                 )}
//                               </div>
//                             )}
//                           </div>

//                           <div className="rounded-2xl border border-slate-200 p-4">
//                             <h5 className="mb-3 font-black text-slate-800">
//                               Comandas anuladas
//                             </h5>

//                             {reporte.comandasAnuladas.length === 0 ? (
//                               <p className="text-sm text-slate-500">
//                                 No hay comandas anuladas.
//                               </p>
//                             ) : (
//                               <div className="space-y-3">
//                                 {reporte.comandasAnuladas.map(
//                                   (comanda, index) => (
//                                     <div
//                                       key={`comanda-anulada-${index}`}
//                                       className="rounded-xl bg-amber-50 p-3 text-sm"
//                                     >
//                                       <p className="font-black">
//                                         {valorTexto(comanda.numeroComanda) || "Comanda sin número"}
//                                       </p>

//                                       <p>
//                                         Mesero: {valorTexto(comanda.mesero)}
//                                       </p>

//                                       <p>
//                                         Motivo: {valorTexto(comanda.observacion) || "Sin motivo"}
//                                       </p>

//                                       <p>
//                                         Total referencial: {formatoBs(Number(comanda.totalReferencial || 0))}
//                                       </p>
//                                     </div>
//                                   )
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </section>

//                       {/* INVENTARIO */}
//                       <section className="break-inside-avoid">
//                         <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
//                           <Package className="h-6 w-6 text-cyan-600" />
//                           Inventario afectado
//                         </h4>

//                         {reporte.inventarioAfectado.length === 0 ? (
//                           <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
//                             No hay inventario afectado.
//                           </div>
//                         ) : (
//                           <div className="overflow-x-auto rounded-2xl border border-slate-200">
//                             <table className="w-full min-w-[800px] text-sm">
//                               <thead className="bg-slate-100">
//                                 <tr className="text-left text-xs font-black uppercase text-slate-500">
//                                   <th className="px-4 py-3">Producto</th>
//                                   <th className="px-4 py-3">Almacén</th>
//                                   <th className="px-4 py-3 text-right">Vendido</th>
//                                   <th className="px-4 py-3 text-right">Cortesía</th>
//                                   <th className="px-4 py-3 text-right">Total descontado</th>
//                                 </tr>
//                               </thead>

//                               <tbody>
//                                 {reporte.inventarioAfectado.map(
//                                   (item, index) => (
//                                     <tr
//                                       key={`inventario-${index}`}
//                                       className="border-t border-slate-100"
//                                     >
//                                       <td className="px-4 py-3 font-bold">
//                                         {valorTexto(item.producto)}
//                                       </td>

//                                       <td className="px-4 py-3">
//                                         {valorTexto(item.almacen)}
//                                       </td>

//                                       <td className="px-4 py-3 text-right">
//                                         {Number(item.cantidadVendida || 0)}
//                                       </td>

//                                       <td className="px-4 py-3 text-right">
//                                         {Number(item.cantidadCortesia || 0)}
//                                       </td>

//                                       <td className="px-4 py-3 text-right font-black text-cyan-700">
//                                         {Number(item.cantidadTotal || 0)}
//                                       </td>
//                                     </tr>
//                                   )
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>
//                         )}
//                       </section>

//                       {/* PIE CONTABLE */}
//                       <section className="hidden border-t border-slate-300 pt-6 print:block">
//                         <div className="grid grid-cols-3 gap-8 text-center text-sm">
//                           <div>
//                             <div className="mb-2 h-12 border-b border-slate-400" />
//                             <p>Responsable de caja</p>
//                           </div>

//                           <div>
//                             <div className="mb-2 h-12 border-b border-slate-400" />
//                             <p>Administrador</p>
//                           </div>

//                           <div>
//                             <div className="mb-2 h-12 border-b border-slate-400" />
//                             <p>Contabilidad</p>
//                           </div>
//                         </div>
//                       </section>
//                     </div>
//                   </div>
//                 )}
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>

//         <style>
//           {`
//             @media print {
//               body * {
//                 visibility: hidden;
//               }

//               #informe-cierre-caja,
//               #informe-cierre-caja * {
//                 visibility: visible;
//               }

//               #informe-cierre-caja {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//               }

//               @page {
//                 size: A4;
//                 margin: 12mm;
//               }

//               table {
//                 page-break-inside: auto;
//               }

//               tr {
//                 page-break-inside: avoid;
//                 page-break-after: auto;
//               }

//               section {
//                 page-break-inside: avoid;
//               }
//             }
//           `}
//         </style>
//       </Dialog>
//     </Transition>
//   );
// }
// src/components/cierrecaja/CierreCajaDetailModal.tsx

import {
  Fragment,
  useEffect,
} from "react";

import {
  Dialog,
  Transition,
} from "@headlessui/react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  toast,
} from "react-toastify";

import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  Package,
  Printer,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Store,
  User2,
  Wallet,
  X,
} from "lucide-react";

import {
  getReporteCierreCajaById,
} from "@/api/CierreCajaApi";

import type {
  ReporteCierreCajaType,
} from "@/types/CierreCajaType";

/* =====================================================
    HELPERS
===================================================== */

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

function estadoClass(
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

function diferenciaClass(
  diferencia?: number
) {
  const valor =
    Number(diferencia || 0);

  if (valor === 0) {
    return "text-emerald-600";
  }

  if (valor > 0) {
    return "text-blue-600";
  }

  return "text-red-600";
}

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

  if (
    Array.isArray(valor)
  ) {
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

/* =====================================================
    HTML CONTABLE PARA IMPRESIÓN
===================================================== */

function generarHtmlImpresion(
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
                    <td>${escapeHtml(formatoFecha(getTexto(venta, "fechaVenta")))}</td>
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
                <p><b>Fecha:</b> ${escapeHtml(formatoFecha(getTexto(egreso, "fechaEgreso")))}</p>
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
        <title>Informe contable de cierre de caja</title>

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

          .linea {
            border-top: 1px solid #111827;
            margin: 8px 0;
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
                CIERRE DE CAJA No. ${escapeHtml(reporte.cierre?._id || general.idAperturaCaja || "SIN-CODIGO")}
              </div>
            </div>

            <div class="meta">
              <p><b>Usuario:</b> ${escapeHtml(general.responsableCierre)}</p>
              <p><b>Impreso desde:</b> Sistema Web</p>
              <p><b>Fecha de impresión:</b> ${escapeHtml(fechaImpresion)}</p>
              <p><b>Página:</b> 1 de 1</p>
            </div>
          </div>

          <section class="page-avoid">
            <div class="datos-cierre">
              <div>
                <p><b>Caja:</b> ${escapeHtml(general.caja)}</p>
                <p><b>Usuario:</b> ${escapeHtml(general.responsableCierre)}</p>
                <p><b>Comentario:</b> Reporte contable generado desde cierre de caja.</p>
                <p><b>Valor Inicial:</b> ${formatoBs(resumen.montoInicial)}</p>
              </div>

              <div>
                <p><b>Fecha Apertura:</b> ${escapeHtml(formatoFecha(general.fechaApertura))}</p>
                <p><b>Fecha Cierre:</b> ${escapeHtml(formatoFecha(general.fechaCierre))}</p>
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
    IMPRESIÓN REAL POR IFRAME
===================================================== */

function imprimirInformeContable(
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
    toast.error(
      "No se pudo preparar el informe para imprimir."
    );

    document.body.removeChild(
      iframe
    );

    return;
  }

  documento.open();

  documento.write(
    generarHtmlImpresion(reporte)
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
    COMPONENTE
===================================================== */

export default function CierreCajaDetailModal() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const cierreCajaId =
    queryParams.get(
      "detail"
    );

  const show =
    Boolean(cierreCajaId);

  const currentPath =
    location.pathname;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "reporte-cierre-caja",
      cierreCajaId,
    ],

    queryFn: () =>
      getReporteCierreCajaById(
        cierreCajaId!
      ),

    enabled:
      Boolean(cierreCajaId),

    retry:
      false,
  });

  useEffect(() => {
    if (!isError) {
      return;
    }

    toast.error(
      (error as Error).message,
      {
        toastId:
          "error-reporte-cierre",
      }
    );

    navigate(
      currentPath,
      {
        replace: true,
      }
    );
  }, [
    isError,
    error,
    navigate,
    currentPath,
  ]);

  const closeModal = () => {
    const params =
      new URLSearchParams(
        location.search
      );

    params.delete(
      "detail"
    );

    const query =
      params.toString();

    navigate(
      query
        ? `${location.pathname}?${query}`
        : location.pathname,
      {
        replace: true,
      }
    );
  };

  const reporte =
    data as ReporteCierreCajaType | undefined;

  const totalEsperado =
    reporte
      ? reporte.resumen.totalEsperadoGeneral ??
        reporte.resumen.totalEsperadoEfectivo
      : 0;

  return (
    <Transition
      appear
      show={show}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all">
                {isLoading || !reporte ? (
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="h-14 w-14 animate-spin rounded-full border-b-4 border-fuchsia-600" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
                          <Wallet className="h-8 w-8" />
                        </div>

                        <div>
                          <Dialog.Title
                            as="h3"
                            className="text-3xl font-black text-slate-800"
                          >
                            Informe contable de cierre de caja
                          </Dialog.Title>

                          <p className="mt-1 text-sm text-slate-500">
                            Reporte centralizado de ventas, egresos, cortesías, anulaciones e inventario afectado.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            imprimirInformeContable(
                              reporte
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                          <Printer className="h-5 w-5" />
                          Imprimir informe
                        </button>

                        <button
                          type="button"
                          onClick={closeModal}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-500 transition hover:bg-slate-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[78vh] space-y-6 overflow-y-auto p-6">
                      {/* DATOS GENERALES */}
                      <section className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-2 flex items-center gap-2 text-slate-500">
                            <Store className="h-5 w-5" />
                            <p className="text-xs font-black uppercase">
                              Sucursal
                            </p>
                          </div>

                          <p className="text-lg font-black text-slate-800">
                            {reporte.general.sucursal}
                          </p>

                          <p className="text-sm text-slate-500">
                            {reporte.general.caja}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-2 flex items-center gap-2 text-slate-500">
                            <User2 className="h-5 w-5" />
                            <p className="text-xs font-black uppercase">
                              Responsable
                            </p>
                          </div>

                          <p className="text-lg font-black text-slate-800">
                            {reporte.general.responsableCierre}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-2 flex items-center gap-2 text-slate-500">
                            <CalendarDays className="h-5 w-5" />
                            <p className="text-xs font-black uppercase">
                              Apertura
                            </p>
                          </div>

                          <p className="text-base font-black text-slate-800">
                            {formatoFecha(
                              reporte.general.fechaApertura
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-2 flex items-center gap-2 text-slate-500">
                            <Clock3 className="h-5 w-5" />
                            <p className="text-xs font-black uppercase">
                              Cierre
                            </p>
                          </div>

                          <p className="text-base font-black text-slate-800">
                            {formatoFecha(
                              reporte.general.fechaCierre
                            )}
                          </p>

                          <p className="text-sm text-slate-500">
                            Duración: {reporte.general.duracionMinutos} min
                          </p>
                        </div>
                      </section>

                      {/* RESUMEN */}
                      <section>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
                          <ShieldCheck className="h-6 w-6 text-fuchsia-600" />
                          Resumen contable
                        </h4>

                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-black uppercase text-slate-500">
                              Monto inicial
                            </p>
                            <p className="mt-2 text-2xl font-black text-slate-900">
                              {formatoBs(reporte.resumen.montoInicial)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-xs font-black uppercase text-emerald-700">
                              Total ventas
                            </p>
                            <p className="mt-2 text-2xl font-black text-emerald-700">
                              {formatoBs(reporte.resumen.totalVentas)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                            <p className="text-xs font-black uppercase text-red-700">
                              Total egresos
                            </p>
                            <p className="mt-2 text-2xl font-black text-red-700">
                              {formatoBs(reporte.resumen.totalEgresos)}
                            </p>
                          </div>

                          <div className={`rounded-2xl border p-4 ${estadoClass(reporte.resumen.estado)}`}>
                            {reporte.resumen.estado === "cuadrado" ? (
                              <CheckCircle2 className="mb-2 h-5 w-5" />
                            ) : (
                              <AlertTriangle className="mb-2 h-5 w-5" />
                            )}

                            <p className="text-xs font-black uppercase">
                              Estado
                            </p>

                            <p className="mt-2 text-2xl font-black capitalize">
                              {reporte.resumen.estado}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="text-sm text-slate-500">
                              Total esperado
                            </p>

                            <p className="mt-2 text-2xl font-black text-slate-900">
                              {formatoBs(totalEsperado)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="text-sm text-slate-500">
                              Monto real verificado
                            </p>

                            <p className="mt-2 text-2xl font-black text-slate-900">
                              {formatoBs(reporte.resumen.montoReal)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="text-sm text-slate-500">
                              Diferencia
                            </p>

                            <p className={`mt-2 text-2xl font-black ${diferenciaClass(reporte.resumen.diferencia)}`}>
                              {formatoBs(reporte.resumen.diferencia)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                          <b>Fórmula aplicada:</b>{" "}
                          Monto inicial + ventas pagadas - egresos registrados = total esperado.
                        </div>
                      </section>

                      {/* INGRESOS POR MESERO */}
                      <section>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
                          <ReceiptText className="h-6 w-6 text-fuchsia-600" />
                          Ingresos por mesero / vendedor
                        </h4>

                        {reporte.ingresosPorMesero.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                            No hay ventas registradas por mesero en este cierre.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-2xl border border-slate-200">
                            <table className="w-full min-w-[900px] text-sm">
                              <thead className="bg-slate-100">
                                <tr className="text-left text-xs font-black uppercase text-slate-500">
                                  <th className="px-4 py-3">Mesero</th>
                                  <th className="px-4 py-3 text-right">Ventas</th>
                                  <th className="px-4 py-3 text-right">Efectivo</th>
                                  <th className="px-4 py-3 text-right">QR</th>
                                  <th className="px-4 py-3 text-right">Transferencia</th>
                                  <th className="px-4 py-3 text-right">Mixto</th>
                                  <th className="px-4 py-3 text-right">Total a entregar / justificar</th>
                                </tr>
                              </thead>

                              <tbody>
                                {reporte.ingresosPorMesero.map((mesero) => (
                                  <tr
                                    key={mesero.idPerfil}
                                    className="border-t border-slate-100"
                                  >
                                    <td className="px-4 py-3 font-black text-slate-800">
                                      {mesero.nombreMesero}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {mesero.cantidadVentas}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {formatoBs(mesero.efectivo)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {formatoBs(mesero.qr)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {formatoBs(mesero.transferencia)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {formatoBs(mesero.mixto)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-lg font-black text-fuchsia-700">
                                      {formatoBs(mesero.totalVentas)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>

                      {/* DETALLE DE VENTAS */}
                      <section>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
                          <ShoppingCart className="h-6 w-6 text-emerald-600" />
                          Detalle de ventas por mesero
                        </h4>

                        <div className="space-y-4">
                          {reporte.ingresosPorMesero.map((mesero) => {
                            const ventas =
                              Array.isArray(mesero.ventas)
                                ? mesero.ventas as Record<string, unknown>[]
                                : [];

                            return (
                              <div
                                key={`${mesero.idPerfil}-ventas`}
                                className="rounded-2xl border border-slate-200 p-4"
                              >
                                <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                  <h5 className="font-black text-slate-800">
                                    {mesero.nombreMesero}
                                  </h5>

                                  <p className="font-black text-fuchsia-700">
                                    Total: {formatoBs(mesero.totalVentas)}
                                  </p>
                                </div>

                                {ventas.length === 0 ? (
                                  <p className="text-sm text-slate-500">
                                    Sin detalle de ventas.
                                  </p>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full min-w-[800px] text-sm">
                                      <thead className="bg-slate-50">
                                        <tr className="text-left text-xs uppercase text-slate-400">
                                          <th className="px-3 py-2">Venta</th>
                                          <th className="px-3 py-2">Comanda</th>
                                          <th className="px-3 py-2">Fecha</th>
                                          <th className="px-3 py-2">Método</th>
                                          <th className="px-3 py-2 text-right">Subtotal</th>
                                          <th className="px-3 py-2 text-right">Desc.</th>
                                          <th className="px-3 py-2 text-right">Total</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {ventas.map((venta, index) => (
                                          <tr
                                            key={`${mesero.idPerfil}-${index}`}
                                            className="border-t border-slate-100"
                                          >
                                            <td className="px-3 py-2">
                                              {getTexto(venta, "numeroVenta") || "-"}
                                            </td>
                                            <td className="px-3 py-2">
                                              {getTexto(venta, "numeroComanda") || "-"}
                                            </td>
                                            <td className="px-3 py-2">
                                              {formatoFecha(getTexto(venta, "fechaVenta"))}
                                            </td>
                                            <td className="px-3 py-2 capitalize">
                                              {getTexto(venta, "metodoPago") || "-"}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                              {formatoBs(getNumero(venta, "subtotal"))}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                              {formatoBs(getNumero(venta, "descuento"))}
                                            </td>
                                            <td className="px-3 py-2 text-right font-black">
                                              {formatoBs(getNumero(venta, "total"))}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* EGRESOS */}
                      <section>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
                          <Banknote className="h-6 w-6 text-red-600" />
                          Egresos detallados
                        </h4>

                        {reporte.egresos.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                            No hay egresos registrados en este cierre.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {reporte.egresos.map((egresoRaw, index) => {
                              const egreso =
                                egresoRaw as Record<string, unknown>;

                              const items =
                                getArray(egreso, "items");

                              return (
                                <div
                                  key={`egreso-${index}`}
                                  className="rounded-2xl border border-red-100 bg-red-50/40 p-4"
                                >
                                  <div className="grid gap-3 md:grid-cols-5">
                                    <div>
                                      <p className="text-xs font-black uppercase text-slate-400">
                                        Nro.
                                      </p>
                                      <p className="font-bold">
                                        {getTexto(egreso, "numeroEgreso") || "-"}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-black uppercase text-slate-400">
                                        Responsable
                                      </p>
                                      <p className="font-bold">
                                        {getTexto(egreso, "responsable")}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-black uppercase text-slate-400">
                                        Tipo
                                      </p>
                                      <p className="font-bold capitalize">
                                        {getTexto(egreso, "tipoEgreso")}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs font-black uppercase text-slate-400">
                                        Método
                                      </p>
                                      <p className="font-bold capitalize">
                                        {getTexto(egreso, "metodoPago")}
                                      </p>
                                    </div>

                                    <div className="md:text-right">
                                      <p className="text-xs font-black uppercase text-slate-400">
                                        Total
                                      </p>
                                      <p className="text-lg font-black text-red-600">
                                        {formatoBs(getNumero(egreso, "total"))}
                                      </p>
                                    </div>
                                  </div>

                                  <p className="mt-3 text-sm text-slate-600">
                                    <b>Observación:</b>{" "}
                                    {getTexto(egreso, "observacion") || "Sin observación"}
                                  </p>

                                  {items.length > 0 && (
                                    <div className="mt-4 overflow-x-auto rounded-xl border border-red-100 bg-white">
                                      <table className="w-full min-w-[750px] text-sm">
                                        <thead className="bg-slate-50">
                                          <tr className="text-left text-xs uppercase text-slate-400">
                                            <th className="px-3 py-2">Descripción</th>
                                            <th className="px-3 py-2">Tipo</th>
                                            <th className="px-3 py-2">Almacén</th>
                                            <th className="px-3 py-2 text-right">Cantidad</th>
                                            <th className="px-3 py-2 text-right">Costo unit.</th>
                                            <th className="px-3 py-2 text-right">Subtotal</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {items.map((item, itemIndex) => (
                                            <tr
                                              key={`egreso-item-${index}-${itemIndex}`}
                                              className="border-t border-slate-100"
                                            >
                                              <td className="px-3 py-2">
                                                {getTexto(item, "descripcion") ||
                                                  getTexto(item, "producto")}
                                              </td>
                                              <td className="px-3 py-2 capitalize">
                                                {getTexto(item, "tipoItem")}
                                              </td>
                                              <td className="px-3 py-2">
                                                {getTexto(item, "almacen")}
                                              </td>
                                              <td className="px-3 py-2 text-right">
                                                {getNumero(item, "cantidad")}
                                              </td>
                                              <td className="px-3 py-2 text-right">
                                                {formatoBs(getNumero(item, "costoUnitario"))}
                                              </td>
                                              <td className="px-3 py-2 text-right font-black">
                                                {formatoBs(getNumero(item, "subtotal"))}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>

                      {/* CORTESÍAS */}
                      <section>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
                          <Gift className="h-6 w-6 text-violet-600" />
                          Cortesías
                        </h4>

                        {reporte.cortesias.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                            No hay cortesías registradas en este cierre.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {reporte.cortesias.map((cortesiaRaw, index) => {
                              const cortesia =
                                cortesiaRaw as Record<string, unknown>;

                              const productos =
                                getArray(cortesia, "productos");

                              return (
                                <div
                                  key={`cortesia-${index}`}
                                  className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4"
                                >
                                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                      <p className="font-black text-slate-800">
                                        {getTexto(cortesia, "mesero")}
                                      </p>

                                      <p className="text-sm text-slate-500">
                                        Comanda: {getTexto(cortesia, "numeroComanda") || "-"}
                                      </p>
                                    </div>

                                    <p className="font-black text-violet-700">
                                      Valor referencial: {formatoBs(getNumero(cortesia, "valorReferencial"))}
                                    </p>
                                  </div>

                                  <p className="mt-2 text-sm text-slate-600">
                                    No suma dinero al arqueo, pero sí afecta inventario.
                                  </p>

                                  {productos.length > 0 && (
                                    <div className="mt-4 overflow-x-auto rounded-xl border border-violet-100 bg-white">
                                      <table className="w-full min-w-[650px] text-sm">
                                        <thead className="bg-slate-50">
                                          <tr className="text-left text-xs uppercase text-slate-400">
                                            <th className="px-3 py-2">Producto</th>
                                            <th className="px-3 py-2">Almacén</th>
                                            <th className="px-3 py-2 text-right">Cantidad</th>
                                            <th className="px-3 py-2 text-right">Precio ref.</th>
                                            <th className="px-3 py-2 text-right">Subtotal ref.</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {productos.map((producto, productoIndex) => (
                                            <tr
                                              key={`cortesia-producto-${index}-${productoIndex}`}
                                              className="border-t border-slate-100"
                                            >
                                              <td className="px-3 py-2">
                                                {getTexto(producto, "producto")}
                                              </td>
                                              <td className="px-3 py-2">
                                                {getTexto(producto, "almacen")}
                                              </td>
                                              <td className="px-3 py-2 text-right">
                                                {getNumero(producto, "cantidad")}
                                              </td>
                                              <td className="px-3 py-2 text-right">
                                                {formatoBs(getNumero(producto, "precioUnitario"))}
                                              </td>
                                              <td className="px-3 py-2 text-right font-black">
                                                {formatoBs(getNumero(producto, "subtotal"))}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>

                      {/* ANULACIONES */}
                      <section>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
                          <AlertTriangle className="h-6 w-6 text-amber-600" />
                          Anulaciones
                        </h4>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 p-4">
                            <h5 className="mb-3 font-black text-slate-800">
                              Ventas anuladas
                            </h5>

                            {reporte.ventasAnuladas.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                No hay ventas anuladas.
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-sm">
                                  <thead className="bg-slate-50">
                                    <tr className="text-left text-xs uppercase text-slate-400">
                                      <th className="px-3 py-2">Venta</th>
                                      <th className="px-3 py-2">Comanda</th>
                                      <th className="px-3 py-2">Mesero</th>
                                      <th className="px-3 py-2 text-right">Total</th>
                                      <th className="px-3 py-2">Motivo</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {reporte.ventasAnuladas.map((ventaRaw, index) => {
                                      const venta =
                                        ventaRaw as Record<string, unknown>;

                                      return (
                                        <tr
                                          key={`venta-anulada-${index}`}
                                          className="border-t border-slate-100"
                                        >
                                          <td className="px-3 py-2">
                                            {getTexto(venta, "numeroVenta") || "-"}
                                          </td>
                                          <td className="px-3 py-2">
                                            {getTexto(venta, "numeroComanda") || "-"}
                                          </td>
                                          <td className="px-3 py-2">
                                            {getTexto(venta, "mesero")}
                                          </td>
                                          <td className="px-3 py-2 text-right">
                                            {formatoBs(getNumero(venta, "total"))}
                                          </td>
                                          <td className="px-3 py-2">
                                            {getTexto(venta, "motivo") || "Sin motivo"}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          <div className="rounded-2xl border border-slate-200 p-4">
                            <h5 className="mb-3 font-black text-slate-800">
                              Comandas anuladas
                            </h5>

                            {reporte.comandasAnuladas.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                No hay comandas anuladas.
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-sm">
                                  <thead className="bg-slate-50">
                                    <tr className="text-left text-xs uppercase text-slate-400">
                                      <th className="px-3 py-2">Comanda</th>
                                      <th className="px-3 py-2">Mesero</th>
                                      <th className="px-3 py-2 text-right">Total ref.</th>
                                      <th className="px-3 py-2">Motivo</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {reporte.comandasAnuladas.map((comandaRaw, index) => {
                                      const comanda =
                                        comandaRaw as Record<string, unknown>;

                                      return (
                                        <tr
                                          key={`comanda-anulada-${index}`}
                                          className="border-t border-slate-100"
                                        >
                                          <td className="px-3 py-2">
                                            {getTexto(comanda, "numeroComanda") || "-"}
                                          </td>
                                          <td className="px-3 py-2">
                                            {getTexto(comanda, "mesero")}
                                          </td>
                                          <td className="px-3 py-2 text-right">
                                            {formatoBs(getNumero(comanda, "totalReferencial"))}
                                          </td>
                                          <td className="px-3 py-2">
                                            {getTexto(comanda, "observacion") || "Sin motivo"}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </section>

                      {/* INVENTARIO */}
                      <section>
                        <h4 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-800">
                          <Package className="h-6 w-6 text-cyan-600" />
                          Inventario afectado
                        </h4>

                        {reporte.inventarioAfectado.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                            No hay inventario afectado.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-2xl border border-slate-200">
                            <table className="w-full min-w-[800px] text-sm">
                              <thead className="bg-slate-100">
                                <tr className="text-left text-xs font-black uppercase text-slate-500">
                                  <th className="px-4 py-3">Producto</th>
                                  <th className="px-4 py-3">Almacén</th>
                                  <th className="px-4 py-3 text-right">Vendido</th>
                                  <th className="px-4 py-3 text-right">Cortesía</th>
                                  <th className="px-4 py-3 text-right">Total descontado</th>
                                </tr>
                              </thead>

                              <tbody>
                                {reporte.inventarioAfectado.map((itemRaw, index) => {
                                  const item =
                                    itemRaw as Record<string, unknown>;

                                  return (
                                    <tr
                                      key={`inventario-${index}`}
                                      className="border-t border-slate-100"
                                    >
                                      <td className="px-4 py-3 font-bold">
                                        {getTexto(item, "producto")}
                                      </td>
                                      <td className="px-4 py-3">
                                        {getTexto(item, "almacen")}
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        {getNumero(item, "cantidadVendida")}
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        {getNumero(item, "cantidadCortesia")}
                                      </td>
                                      <td className="px-4 py-3 text-right font-black text-cyan-700">
                                        {getNumero(item, "cantidadTotal")}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>

                      {/* FIRMAS */}
                      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h4 className="mb-4 font-black text-slate-800">
                          Firmas para respaldo contable
                        </h4>

                        <div className="grid gap-6 text-center text-sm md:grid-cols-3">
                          <div>
                            <div className="mb-2 h-12 border-b border-slate-400" />
                            <p>Responsable de caja</p>
                          </div>

                          <div>
                            <div className="mb-2 h-12 border-b border-slate-400" />
                            <p>Administrador</p>
                          </div>

                          <div>
                            <div className="mb-2 h-12 border-b border-slate-400" />
                            <p>Contabilidad</p>
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}