
// import {
//   useMemo,
//   useState,
// } from "react";

// import {
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";

// import {
//   Ban,
//   Banknote,
//   Box,
//   CalendarDays,
//   CheckCircle2,
//   CircleDollarSign,
//   Gift,
//   Package,
//   ReceiptText,
//   RefreshCcw,
//   Search,
//   Store,
//   UserRound,
//   XCircle,
// } from "lucide-react";

// import Swal from "sweetalert2";

// import {
//   useAuth,
// } from "@/hooks/useAuth";

// import {
//   cortesiaVentaById,
//   deleteVentaById,
//   getVentasConDetallesPorPerfil,
// } from "@/api/VentaApi";

// import {
//   createMovimiento,
// } from "@/api/MovimientoApi";

// import type {
//   MovimientoForm,
// } from "@/types/MovimientoType";

// import type {
//   VentaConDetallesType,
// } from "@/types/VentaType";

// /* =========================
//     OBTENER ID DE RELACIÓN
// ========================= */
// type ResumenVentas = {
//   pagadas: number;
//   cortesias: number;
//   anuladas: number;

//   totalPagado: number;
//   totalCortesia: number;
//   totalAnulado: number;
// };

// function obtenerTexto(
//   valor: unknown,
//   valorDefecto = ""
// ): string {

//   if (
//     typeof valor === "string" ||
//     typeof valor === "number"
//   ) {
//     return String(valor);
//   }

//   return valorDefecto;
// }

// function obtenerNumero(
//   valor: unknown
// ): number {

//   const numero =
//     Number(valor);

//   return Number.isFinite(numero)
//     ? numero
//     : 0;
// }
// function obtenerIdRelacion(
//   relacion:
//     | string
//     | {
//         _id?: string;
//       }
//     | null
//     | undefined
// ): string {

//   if (
//     typeof relacion ===
//     "string"
//   ) {
//     return relacion;
//   }

//   return relacion?._id || "";

// }

// /* =========================
//     FORMATEAR FECHA
// ========================= */

// function formatearFecha(
//   fecha?:
//     string | null
// ): string {

//   if (!fecha) {
//     return "Sin fecha";
//   }

//   const fechaConvertida =
//     new Date(fecha);

//   if (
//     Number.isNaN(
//       fechaConvertida.getTime()
//     )
//   ) {
//     return "Fecha inválida";
//   }

//   return fechaConvertida
//     .toLocaleString(
//       "es-BO",
//       {
//         dateStyle:
//           "medium",

//         timeStyle:
//           "short",
//       }
//     );

// }

// /* =========================
//     FORMATEAR DINERO
// ========================= */

// function formatearDinero(
//   monto:
//     number | undefined
// ): string {

//   return `Bs. ${Number(
//     monto || 0
//   ).toFixed(2)}`;

// }

// /* =========================
//     COMPONENTE
// ========================= */

// export default function VentaDetailView() {

//   const queryClient =
//     useQueryClient();

//   const {
//     data: perfil,
//     isLoading:
//       loadingPerfil,
//   } = useAuth();

//   const [
//     search,
//     setSearch,
//   ] = useState("");

//   /* =========================
//       IDS NORMALIZADOS
//   ========================= */

//   const idPerfil =
//     obtenerIdRelacion(
//       perfil?._id
//     );

//   const idSucursalPerfil =
//     obtenerIdRelacion(
//       perfil?.idSucursal
//     );

//   const nombreUsuario =
//     perfil?.nombres ||
//     "sistema";

//   /* =========================
//       CONSULTAR VENTAS
//   ========================= */

//   const {
//     data,
//     isLoading:
//       loadingVentas,
//     isError,
//     error,
//   } = useQuery({

//     queryKey: [
//       "ventas-con-detalles",
//       idPerfil,
//     ],

//     queryFn: () =>
//       getVentasConDetallesPorPerfil(
//         idPerfil
//       ),

//     enabled:
//       Boolean(idPerfil),

//   });

//   /* =========================
//       VENTAS FILTRADAS
//   ========================= */

//   const ventasFiltradas =
//     useMemo(() => {

//       const ventas =
//         data?.ventas || [];

//       const busqueda =
//         search
//           .trim()
//           .toLowerCase();

//       if (!busqueda) {
//         return ventas;
//       }

//       return ventas.filter(
//         (venta) => {

//           const productos =
//             venta.detalles
//               .map(
//                 (detalle) =>
//                   [
//                     detalle
//                       .producto
//                       ?.nombre,
//                     detalle
//                       .producto
//                       ?.marca,
//                     detalle
//                       .producto
//                       ?.descripcion,
//                   ]
//                     .filter(
//                       Boolean
//                     )
//                     .join(" ")
//               )
//               .join(" ");

//           const texto = [
//             venta.numeroVenta,
//             venta.estado,
//             venta.metodoPago,
//             venta.observacion,
//             venta
//               .comanda
//               ?.numeroComanda,
//             venta
//               .caja
//               ?.nombre,
//             productos,
//           ]
//             .filter(
//               Boolean
//             )
//             .join(" ")
//             .toLowerCase();

//           return texto.includes(
//             busqueda
//           );

//         }
//       );

//     }, [
//       data,
//       search,
//     ]);

//   /* =========================
//       RESUMEN
//   ========================= */

//  /* =========================
//     RESUMEN DE VENTAS
// ========================= */

// const resumen =
//   useMemo<ResumenVentas>(() => {

//     const ventas =
//       data?.ventas ?? [];

//     return ventas.reduce<ResumenVentas>(
//       (
//         acumulado,
//         venta
//       ) => {

//         const totalVenta =
//           obtenerNumero(
//             venta.total
//           );

//         if (
//           venta.estado ===
//           "pagado"
//         ) {

//           acumulado.pagadas =
//             acumulado.pagadas + 1;

//           acumulado.totalPagado =
//             acumulado.totalPagado +
//             totalVenta;

//         }

//         if (
//           venta.estado ===
//           "cortesia"
//         ) {

//           acumulado.cortesias =
//             acumulado.cortesias + 1;

//           acumulado.totalCortesia =
//             acumulado.totalCortesia +
//             totalVenta;

//         }

//         if (
//           venta.estado ===
//           "anulado"
//         ) {

//           acumulado.anuladas =
//             acumulado.anuladas + 1;

//           acumulado.totalAnulado =
//             acumulado.totalAnulado +
//             totalVenta;

//         }

//         return acumulado;

//       },
//       {
//         pagadas: 0,
//         cortesias: 0,
//         anuladas: 0,

//         totalPagado: 0,
//         totalCortesia: 0,
//         totalAnulado: 0,
//       }
//     );

//   }, [
//     data?.ventas,
//   ]);

//   /* =========================
//       ANULAR VENTA
//   ========================= */

//   type AnularVentaPayload = {

//     venta:
//       VentaConDetallesType;

//     eliminadoPor:
//       string;

//   };

//   const {
//     mutate:
//       anularVenta,

//     isPending:
//       anulandoVenta,
//   } = useMutation({

//     mutationFn:
//       async ({
//         venta,
//         eliminadoPor,
//       }: AnularVentaPayload) => {

//         if (!venta._id) {

//           throw new Error(
//             "No se encontró el ID de la venta"
//           );

//         }

//         const idVenta =
//           String(
//             venta._id
//           );

//         const idCaja =
//           obtenerIdRelacion(
//             venta.caja
//           );

//         const idComanda =
//           obtenerIdRelacion(
//             venta.comanda
//           );

//         const idSucursal =
//           data?.sucursal?._id ||
//           idSucursalPerfil ||
//           "";

//         /*
//           1. Anular venta.

//           El backend:
//           - cambia venta a anulado
//           - marca detalles eliminados
//           - restaura el inventario
//         */

//         const respuesta =
//           await deleteVentaById({

//             id:
//               idVenta,

//             eliminadoPor,

//           });

//         /*
//           2. Movimiento de reversión financiera
//         */

//         const movimientoAnulacion:
//           MovimientoForm = {

//           fecha:
//             new Date()
//               .toISOString(),

//           tipoMovimiento:
//             "venta_anulada",

//           origenMovimiento:
//             "venta",

//           modulo:
//             "venta",

//           idVenta,

//           idComanda:
//             idComanda ||
//             undefined,

//           idSucursal:
//             idSucursal ||
//             undefined,

//           idCaja:
//             idCaja ||
//             undefined,

//           idPerfil:
//             idPerfil ||
//             undefined,

//           metodoPago:
//             venta.metodoPago,

//           montoSalida:
//             Number(
//               venta.total || 0
//             ),

//           subtotal:
//             Number(
//               venta.subtotal || 0
//             ),

//           descuento:
//             Number(
//               venta.descuento || 0
//             ),

//           total:
//             Number(
//               venta.total || 0
//             ),

//           estado:
//             "anulado",

//           referenciaId:
//             idVenta,

//           referenciaModelo:
//             "Venta",

//           observacion:
//             `Anulación de la venta ${
//               venta.numeroVenta ||
//               idVenta
//             }`,

//           creadoPor:
//             eliminadoPor,

//         };

//         await createMovimiento(
//           movimientoAnulacion
//         );

//         /*
//           3. Registrar cada devolución
//           de producto al inventario.

//           Aquí no se modifica nuevamente
//           el stock. Solo se registra el
//           historial del movimiento.
//         */

//         for (
//           const detalle
//           of venta.detalles
//         ) {

//           const idProducto =
//             obtenerIdRelacion(
//               detalle.idProducto
//             ) ||
//             detalle.producto
//               ?._id ||
//             "";

//           const idInventario =
//             obtenerIdRelacion(
//               detalle.idInventario
//             );

//           const idAlmacen =
//             obtenerIdRelacion(
//               detalle.idAlmacen
//             );

//           if (
//             !idProducto ||
//             !idInventario ||
//             !idAlmacen
//           ) {

//             console.warn(
//               "No se registró movimiento de devolución porque faltan relaciones:",
//               detalle
//             );

//             continue;

//           }

//           const cantidad =
//             Number(
//               detalle.cantidad || 0
//             );

//           const movimientoInventario:
//             MovimientoForm = {

//             fecha:
//               new Date()
//                 .toISOString(),

//             tipoMovimiento:
//               "entrada_inventario",

//             origenMovimiento:
//               "venta",

//             modulo:
//               "inventario",

//             idVenta,

//             idComanda:
//               idComanda ||
//               undefined,

//             idSucursal:
//               idSucursal ||
//               undefined,

//             idCaja:
//               idCaja ||
//               undefined,

//             idPerfil:
//               idPerfil ||
//               undefined,

//             idProducto,

//             idInventario,

//             idAlmacen,

//             cantidad,

//             cantidadEntrada:
//               cantidad,

//             precioUnitario:
//               Number(
//                 detalle
//                   .precioUnitario ||
//                 0
//               ),

//             costoUnitario:
//               Number(
//                 detalle
//                   .costoUnitario ||
//                 0
//               ),

//             subtotal:
//               Number(
//                 detalle.subtotal ||
//                 0
//               ),

//             total:
//               Number(
//                 detalle.subtotal ||
//                 0
//               ),

//             estado:
//               "activo",

//             referenciaId:
//               idVenta,

//             referenciaModelo:
//               "Venta",

//             observacion:
//               `Devolución por anulación: ${
//                 detalle
//                   .producto
//                   ?.nombre ||
//                 "Producto"
//               }`,

//             creadoPor:
//               eliminadoPor,

//           };

//           await createMovimiento(
//             movimientoInventario
//           );

//         }

//         return respuesta;

//       },

//     onSuccess:
//       async () => {

//         await Swal.fire({

//           icon:
//             "success",

//           title:
//             "Venta anulada",

//           text:
//             "Se anuló la venta y se registraron los movimientos de reversión.",

//           timer:
//             2500,

//           showConfirmButton:
//             false,

//         });

//         await queryClient
//           .invalidateQueries({

//             queryKey: [
//               "ventas-con-detalles",
//               idPerfil,
//             ],

//           });

//         await queryClient
//           .invalidateQueries({

//             queryKey: [
//               "movimientos",
//             ],

//           });

//         await queryClient
//           .invalidateQueries({

//             queryKey: [
//               "inventario-barra",
//               idSucursalPerfil,
//             ],

//           });

//       },

//     onError:
//       async (
//         error
//       ) => {

//         await Swal.fire({

//           icon:
//             "error",

//           title:
//             "Error al anular",

//           text:
//             error instanceof Error
//               ? error.message
//               : "No se pudo anular la venta",

//         });

//       },

//   });

//   /* =========================
//       CORTESÍA
//   ========================= */

//   type CortesiaVentaPayload = {

//     venta:
//       VentaConDetallesType;

//     actualizadoPor:
//       string;

//     observacion:
//       string;

//   };

//   const {
//     mutate:
//       marcarCortesia,

//     isPending:
//       marcandoCortesia,
//   } = useMutation({

//     mutationFn:
//       async ({
//         venta,
//         actualizadoPor,
//         observacion,
//       }: CortesiaVentaPayload) => {

//         if (!venta._id) {

//           throw new Error(
//             "No se encontró el ID de la venta"
//           );

//         }

//         const idVenta =
//           String(
//             venta._id
//           );

//         const idCaja =
//           obtenerIdRelacion(
//             venta.caja
//           );

//         const idComanda =
//           obtenerIdRelacion(
//             venta.comanda
//           );

//         const idSucursal =
//           data?.sucursal?._id ||
//           idSucursalPerfil ||
//           "";

//         /*
//           1. Convertir la venta
//           en cortesía.

//           No se devuelve inventario.
//         */

//         const respuesta =
//           await cortesiaVentaById({

//             id:
//               idVenta,

//             actualizadoPor,

//             observacion,

//           });

//         /*
//           2. Registrar reversión
//           del ingreso como cortesía.
//         */

//         const movimientoCortesia:
//           MovimientoForm = {

//           fecha:
//             new Date()
//               .toISOString(),

//           tipoMovimiento:
//             "cortesia",

//           origenMovimiento:
//             "cortesia",

//           modulo:
//             "venta",

//           idVenta,

//           idComanda:
//             idComanda ||
//             undefined,

//           idSucursal:
//             idSucursal ||
//             undefined,

//           idCaja:
//             idCaja ||
//             undefined,

//           idPerfil:
//             idPerfil ||
//             undefined,

//           metodoPago:
//             venta.metodoPago,

//           montoSalida:
//             Number(
//               venta.total || 0
//             ),

//           subtotal:
//             Number(
//               venta.subtotal || 0
//             ),

//           descuento:
//             Number(
//               venta.descuento || 0
//             ),

//           total:
//             Number(
//               venta.total || 0
//             ),

//           estado:
//             "cortesia",

//           referenciaId:
//             idVenta,

//           referenciaModelo:
//             "Venta",

//           observacion,

//           creadoPor:
//             actualizadoPor,

//         };

//         await createMovimiento(
//           movimientoCortesia
//         );

//         return respuesta;

//       },

//     onSuccess:
//       async () => {

//         await Swal.fire({

//           icon:
//             "success",

//           title:
//             "Cortesía registrada",

//           text:
//             "La venta fue convertida en cortesía y se registró el movimiento.",

//           timer:
//             2500,

//           showConfirmButton:
//             false,

//         });

//         await queryClient
//           .invalidateQueries({

//             queryKey: [
//               "ventas-con-detalles",
//               idPerfil,
//             ],

//           });

//         await queryClient
//           .invalidateQueries({

//             queryKey: [
//               "movimientos",
//             ],

//           });

//       },

//     onError:
//       async (
//         error
//       ) => {

//         await Swal.fire({

//           icon:
//             "error",

//           title:
//             "Error con la cortesía",

//           text:
//             error instanceof Error
//               ? error.message
//               : "No se pudo registrar la cortesía",

//         });

//       },

//   });

//   /* =========================
//       HANDLE ANULAR
//   ========================= */

//   const handleAnularVenta =
//     async (
//       venta:
//         VentaConDetallesType
//     ) => {

//       if (!venta._id) {

//         await Swal.fire({

//           icon:
//             "error",

//           title:
//             "Venta inválida",

//           text:
//             "No se encontró el ID de la venta.",

//         });

//         return;

//       }

//       const resultado =
//         await Swal.fire({

//           icon:
//             "warning",

//           title:
//             "¿Anular esta venta?",

//           html: `
//             <p>La venta será anulada.</p>
//             <p>Los productos volverán al inventario.</p>
//             <p>También se registrarán los movimientos de reversión.</p>
//           `,

//           showCancelButton:
//             true,

//           confirmButtonText:
//             "Sí, anular",

//           cancelButtonText:
//             "Cancelar",

//           confirmButtonColor:
//             "#dc2626",

//         });

//       if (
//         !resultado.isConfirmed
//       ) {
//         return;
//       }

//       anularVenta({

//         venta,

//         eliminadoPor:
//           nombreUsuario,

//       });

//     };

//   /* =========================
//       HANDLE CORTESÍA
//   ========================= */

//   const handleCortesiaVenta =
//     async (
//       venta:
//         VentaConDetallesType
//     ) => {

//       if (!venta._id) {

//         await Swal.fire({

//           icon:
//             "error",

//           title:
//             "Venta inválida",

//           text:
//             "No se encontró el ID de la venta.",

//         });

//         return;

//       }

//       const resultado =
//         await Swal.fire({

//           icon:
//             "question",

//           title:
//             "¿Convertir en cortesía?",

//           text:
//             "La venta dejará de considerarse ingreso, pero los productos permanecerán descontados del inventario.",

//           input:
//             "textarea",

//           inputLabel:
//             "Motivo de la cortesía",

//           inputPlaceholder:
//             "Ejemplo: cortesía autorizada por gerencia",

//           inputValue:
//             "Cortesía autorizada",

//           showCancelButton:
//             true,

//           confirmButtonText:
//             "Confirmar cortesía",

//           cancelButtonText:
//             "Cancelar",

//           confirmButtonColor:
//             "#d97706",

//           inputValidator:
//             (
//               value
//             ) => {

//               if (
//                 !value?.trim()
//               ) {

//                 return "Debe indicar el motivo de la cortesía.";

//               }

//               return undefined;

//             },

//         });

//       if (
//         !resultado.isConfirmed
//       ) {
//         return;
//       }

//       marcarCortesia({

//         venta,

//         actualizadoPor:
//           nombreUsuario,

//         observacion:
//           String(
//             resultado.value ||
//             "Cortesía autorizada"
//           ).trim(),

//       });

//     };

//   /* =========================
//       ESTADO VISUAL
//   ========================= */

//   function obtenerEstadoVisual(
//     estado:
//       string
//   ) {

//     if (
//       estado ===
//       "pagado"
//     ) {

//       return {
//         texto:
//           "Pagado",

//         clases:
//           "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",

//         icono:
//           CheckCircle2,
//       };

//     }

//     if (
//       estado ===
//       "cortesia"
//     ) {

//       return {
//         texto:
//           "Cortesía",

//         clases:
//           "border-amber-500/30 bg-amber-500/10 text-amber-400",

//         icono:
//           Gift,
//       };

//     }

//     if (
//       estado ===
//       "anulado"
//     ) {

//       return {
//         texto:
//           "Anulado",

//         clases:
//           "border-red-500/30 bg-red-500/10 text-red-400",

//         icono:
//           XCircle,
//       };

//     }

//     return {
//       texto:
//         estado,

//       clases:
//         "border-slate-500/30 bg-slate-500/10 text-slate-400",

//       icono:
//         ReceiptText,
//     };

//   }

//   /* =========================
//       LOADING
//   ========================= */

//   if (
//     loadingPerfil ||
//     loadingVentas
//   ) {

//     return (

//       <div className="flex min-h-[60vh] items-center justify-center">

//         <div className="text-center">

//           <RefreshCcw className="mx-auto h-12 w-12 animate-spin text-fuchsia-400" />

//           <p className="mt-4 font-bold text-slate-300">

//             Cargando ventas...

//           </p>

//         </div>

//       </div>

//     );

//   }

//   /* =========================
//       ERROR
//   ========================= */

//   if (isError) {

//     return (

//       <div className="flex min-h-[60vh] items-center justify-center p-5">

//         <div className="max-w-lg rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">

//           <XCircle className="mx-auto h-12 w-12 text-red-400" />

//           <h2 className="mt-4 text-2xl font-black text-red-400">

//             Error al cargar ventas

//           </h2>

//           <p className="mt-3 text-slate-300">

//             {error instanceof Error
//               ? error.message
//               : "No se pudieron cargar las ventas"}

//           </p>

//         </div>

//       </div>

//     );

//   }

//   return (

//     <div className="min-h-screen bg-[#070B14] p-3 text-white sm:p-5 lg:p-7">

//       {/* =========================
//           HEADER
//       ========================= */}

//       <div className="mb-7">

//         <div className="flex items-center gap-3">

//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10">

//             <ReceiptText className="h-7 w-7 text-fuchsia-400" />

//           </div>

//           <div>

//             <h1 className="text-3xl font-black text-white">

//               Mis ventas

//             </h1>

//             <p className="mt-1 text-sm text-slate-400">

//               Consulta, anula o convierte tus ventas en cortesía

//             </p>

//           </div>

//         </div>

//       </div>

//       {/* =========================
//           RESUMEN
//       ========================= */}

//       <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

//         <div className="rounded-3xl border border-emerald-500/20 bg-[#0B1120] p-5">

//           <div className="flex items-center justify-between">

//             <div>

//               <p className="text-sm text-slate-400">

//                 Ventas pagadas

//               </p>

//               <p className="mt-2 text-3xl font-black text-emerald-400">

//                 {resumen.pagadas}

//               </p>

//             </div>

//             <CircleDollarSign className="h-9 w-9 text-emerald-400" />

//           </div>

//           <p className="mt-4 font-bold text-white">

//             {formatearDinero(
//               resumen.totalPagado
//             )}

//           </p>

//         </div>

//         <div className="rounded-3xl border border-amber-500/20 bg-[#0B1120] p-5">

//           <div className="flex items-center justify-between">

//             <div>

//               <p className="text-sm text-slate-400">

//                 Cortesías

//               </p>

//               <p className="mt-2 text-3xl font-black text-amber-400">

//                 {resumen.cortesias}

//               </p>

//             </div>

//             <Gift className="h-9 w-9 text-amber-400" />

//           </div>

//           <p className="mt-4 font-bold text-white">

//             {formatearDinero(
//               resumen.totalCortesia
//             )}

//           </p>

//         </div>

//         <div className="rounded-3xl border border-red-500/20 bg-[#0B1120] p-5">

//           <div className="flex items-center justify-between">

//             <div>

//               <p className="text-sm text-slate-400">

//                 Ventas anuladas

//               </p>

//               <p className="mt-2 text-3xl font-black text-red-400">

//                 {resumen.anuladas}

//               </p>

//             </div>

//             <Ban className="h-9 w-9 text-red-400" />

//           </div>

//           <p className="mt-4 font-bold text-white">

//             {formatearDinero(
//               resumen.totalAnulado
//             )}

//           </p>

//         </div>

//         <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1120] p-5">

//           <div className="flex items-center justify-between">

//             <div>

//               <p className="text-sm text-slate-400">

//                 Sucursal

//               </p>

//               <p className="mt-2 text-lg font-black text-cyan-400">

//                 {data?.sucursal
//                   ?.nombreSucursal ||
//                   "Sin sucursal"}

//               </p>

//             </div>

//             <Store className="h-9 w-9 text-cyan-400" />

//           </div>

//           <p className="mt-4 text-sm text-slate-400">

//             {data?.perfil
//               ?.nombres ||
//               perfil?.nombres ||
//               "Usuario"}

//           </p>

//         </div>

//       </div>

//       {/* =========================
//           BUSCADOR
//       ========================= */}

//       <div className="mb-6 rounded-3xl border border-slate-800 bg-[#0B1120] p-4">

//         <div className="relative">

//           <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

//           <input
//             type="text"
//             value={search}
//             onChange={(
//               event
//             ) =>
//               setSearch(
//                 event.target.value
//               )
//             }
//             placeholder="Buscar venta, producto, comanda o método de pago..."
//             className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-fuchsia-500"
//           />

//         </div>

//       </div>

//       {/* =========================
//           LISTA
//       ========================= */}

//       {ventasFiltradas.length ===
//       0 ? (

//         <div className="rounded-3xl border border-dashed border-slate-700 bg-[#0B1120] p-12 text-center">

//           <ReceiptText className="mx-auto h-14 w-14 text-slate-600" />

//           <h2 className="mt-4 text-xl font-black text-white">

//             No existen ventas

//           </h2>

//           <p className="mt-2 text-slate-400">

//             No se encontraron ventas para mostrar.

//           </p>

//         </div>

//       ) : (

//         <div className="space-y-6">

//           {ventasFiltradas.map(
//             (
//               venta
//             ) => {

//               const estadoVisual =
//                 obtenerEstadoVisual(
//                   venta.estado
//                 );

//               const EstadoIcon =
//                 estadoVisual.icono;

//               return (

//                 <article
//                   key={
//                     venta._id ||
//                     venta.numeroVenta
//                   }
//                   className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1120] shadow-xl"
//                 >

//                   {/* CABECERA */}

//                   <div className="flex flex-col gap-5 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">

//                     <div className="flex items-start gap-4">

//                       <div className="flex h-14 w-14 min-w-14 items-center justify-center rounded-2xl bg-fuchsia-500/10">

//                         <ReceiptText className="h-7 w-7 text-fuchsia-400" />

//                       </div>

//                       <div>

//                         <h2 className="text-xl font-black text-white">

//                           {venta.numeroVenta ||
//                             "Venta sin número"}

//                         </h2>

//                         <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">

//                           <span className="inline-flex items-center gap-2">

//                             <CalendarDays className="h-4 w-4" />

//                             {formatearFecha(
//                               venta.fechaVenta ||
//                               venta.fechaCreacion
//                             )}

//                           </span>

//                           <span className="inline-flex items-center gap-2">

//                             <UserRound className="h-4 w-4" />

//                             {venta.creadoPor ||
//                               nombreUsuario}

//                           </span>

//                           <span className="inline-flex items-center gap-2">

//                             <Banknote className="h-4 w-4" />

//                             {venta.metodoPago}

//                           </span>

//                         </div>

//                       </div>

//                     </div>

//                     <div className="flex flex-wrap items-center gap-3">

//                       <span
//                         className={`
//                           inline-flex
//                           items-center
//                           gap-2
//                           rounded-2xl
//                           border
//                           px-4
//                           py-2
//                           text-sm
//                           font-black
//                           ${estadoVisual.clases}
//                         `}
//                       >

//                         <EstadoIcon className="h-4 w-4" />

//                         {estadoVisual.texto}

//                       </span>

//                       {venta.estado ===
//                         "pagado" && (

//                         <>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleCortesiaVenta(
//                                 venta
//                               )
//                             }
//                             disabled={
//                               marcandoCortesia ||
//                               anulandoVenta
//                             }
//                             className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
//                           >

//                             <Gift className="h-4 w-4" />

//                             Cortesía

//                           </button>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleAnularVenta(
//                                 venta
//                               )
//                             }
//                             disabled={
//                               anulandoVenta ||
//                               marcandoCortesia
//                             }
//                             className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
//                           >

//                             <Ban className="h-4 w-4" />

//                             Anular

//                           </button>

//                         </>

//                       )}

//                     </div>

//                   </div>

//                   {/* DATOS */}

//                   <div className="grid gap-4 border-b border-slate-800 p-5 sm:grid-cols-2 lg:grid-cols-4">

//                     <div className="rounded-2xl bg-slate-950 p-4">

//                       <p className="text-xs uppercase tracking-wider text-slate-500">

//                         Comanda

//                       </p>

//                       <p className="mt-1 font-black text-white">

//                         {venta.comanda
//                           ?.numeroComanda ||
//                           "Sin comanda"}

//                       </p>

//                     </div>

//                     <div className="rounded-2xl bg-slate-950 p-4">

//                       <p className="text-xs uppercase tracking-wider text-slate-500">

//                         Caja

//                       </p>

//                       <p className="mt-1 font-black text-white">

//                         {venta.caja
//                           ?.nombre ||
//                           "Sin caja"}

//                       </p>

//                     </div>

//                     <div className="rounded-2xl bg-slate-950 p-4">

//                       <p className="text-xs uppercase tracking-wider text-slate-500">

//                         Subtotal

//                       </p>

//                       <p className="mt-1 font-black text-cyan-400">

//                         {formatearDinero(
//                           venta.subtotal
//                         )}

//                       </p>

//                     </div>

//                     <div className="rounded-2xl bg-slate-950 p-4">

//                       <p className="text-xs uppercase tracking-wider text-slate-500">

//                         Total

//                       </p>

//                       <p className="mt-1 text-xl font-black text-fuchsia-400">

//                         {formatearDinero(
//                           venta.total
//                         )}

//                       </p>

//                     </div>

//                   </div>

//                   {/* OBSERVACIÓN */}

//                   <div className="border-b border-slate-800 px-5 py-4">

//                     <p className="text-xs uppercase tracking-wider text-slate-500">

//                       Observación

//                     </p>

//                     <p className="mt-1 text-sm font-semibold text-slate-300">

//                       {venta.observacion ||
//                         "Sin observación"}

//                     </p>

//                   </div>

//                   {/* PRODUCTOS */}

//                   <div className="p-5">

//                     <div className="mb-4 flex items-center gap-2">

//                       <Package className="h-5 w-5 text-fuchsia-400" />

//                       <h3 className="font-black text-white">

//                         Productos vendidos

//                       </h3>

//                     </div>

//                     {venta.detalles.length ===
//                     0 ? (

//                       <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-center text-slate-400">

//                         La venta no tiene detalles registrados.

//                       </div>

//                     ) : (

//                       <div className="overflow-x-auto">

//                         <table className="min-w-[800px] w-full">

//                           <thead>

//                             <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-500">

//                               <th className="pb-3 pr-4">
//                                 Producto
//                               </th>

//                               <th className="pb-3 pr-4 text-center">
//                                 Cantidad
//                               </th>

//                               <th className="pb-3 pr-4 text-right">
//                                 Precio
//                               </th>

//                               <th className="pb-3 pr-4 text-right">
//                                 Costo
//                               </th>

//                               <th className="pb-3 text-right">
//                                 Subtotal
//                               </th>

//                             </tr>

//                           </thead>

//                           <tbody>

//                             {venta.detalles.map(
//                               (
//                                 detalle,
//                                 index
//                               ) => (

//                                 <tr
//                                   key={
//                                     detalle._id ||
//                                     `${venta._id}-${index}`
//                                   }
//                                   className="border-b border-slate-800"
//                                 >

//                                   <td className="py-4 pr-4">

//                                     <div className="flex items-center gap-3">

//                                       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">

//                                         <Box className="h-5 w-5 text-cyan-400" />

//                                       </div>

//                                       <div>

//                                         <p className="font-black text-white">

//                                           {detalle
//                                             .producto
//                                             ?.nombre ||
//                                             "Producto"}

//                                         </p>

//                                         <p className="text-xs text-slate-500">

//                                           {detalle
//                                             .producto
//                                             ?.marca ||
//                                             "Sin marca"}

//                                         </p>

//                                       </div>

//                                     </div>

//                                   </td>

//                                   <td className="py-4 pr-4 text-center font-black text-white">

//                                     {Number(
//                                       detalle.cantidad ||
//                                       0
//                                     )}

//                                   </td>

//                                   <td className="py-4 pr-4 text-right text-slate-300">

//                                     {formatearDinero(
//                                       detalle
//                                         .precioUnitario
//                                     )}

//                                   </td>

//                                   <td className="py-4 pr-4 text-right text-slate-400">

//                                     {formatearDinero(
//                                       detalle
//                                         .costoUnitario
//                                     )}

//                                   </td>

//                                   <td className="py-4 text-right font-black text-fuchsia-400">

//                                     {formatearDinero(
//                                       detalle.subtotal
//                                     )}

//                                   </td>

//                                 </tr>

//                               )
//                             )}

//                           </tbody>

//                         </table>

//                       </div>

//                     )}

//                   </div>

//                 </article>

//               );

//             }
//           )}

//         </div>

//       )}

//     </div>

//   );

// }


import {
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Ban,
  Banknote,
  Box,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Gift,
  Package,
  Printer,
  ReceiptText,
  RefreshCcw,
  Search,
  Store,
  UserRound,
  XCircle,
} from "lucide-react";

import Swal from "sweetalert2";
import axios from "axios";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  cortesiaVentaById,
  deleteVentaById,
  getVentasConDetallesPorPerfil,
} from "@/api/VentaApi";

import {
  createMovimiento,
} from "@/api/MovimientoApi";

import type {
  MovimientoForm,
} from "@/types/MovimientoType";

import type {
  VentaConDetallesType,
} from "@/types/VentaType";

/* =========================
    OBTENER ID DE RELACIÓN
========================= */
type ResumenVentas = {
  pagadas: number;
  cortesias: number;
  anuladas: number;

  totalPagado: number;
  totalCortesia: number;
  totalAnulado: number;
};

function obtenerTexto(
  valor: unknown,
  valorDefecto = ""
): string {

  if (
    typeof valor === "string" ||
    typeof valor === "number"
  ) {
    return String(valor);
  }

  return valorDefecto;
}

function obtenerNumero(
  valor: unknown
): number {

  const numero =
    Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}
function obtenerIdRelacion(
  relacion:
    | string
    | {
        _id?: string;
      }
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
    FORMATEAR FECHA
========================= */

function formatearFecha(
  fecha?:
    string | null
): string {

  if (!fecha) {
    return "Sin fecha";
  }

  const fechaConvertida =
    new Date(fecha);

  if (
    Number.isNaN(
      fechaConvertida.getTime()
    )
  ) {
    return "Fecha inválida";
  }

  return fechaConvertida
    .toLocaleString(
      "es-BO",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short",
      }
    );

}

/* =========================
    FORMATEAR DINERO
========================= */

function formatearDinero(
  monto:
    number | undefined
): string {

  return `Bs. ${Number(
    monto || 0
  ).toFixed(2)}`;

}

/* =========================
    CONFIG IMPRESORA TÉRMICA
========================= */

const IMPRESORA_TERMICA_URL =
  "http://localhost:4002/imprimir";

/*
  32 columnas = papel térmico 58mm.
  Si tu Epson es 80mm, cambia a 42.
*/
const COLUMNAS_TICKET = 32;

/* =========================
    HELPERS TICKET
========================= */

function limpiarTextoTicket(
  valor: unknown,
  max = 99
): string {

  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7EñÑ]/g, "")
    .toUpperCase()
    .slice(0, max);

}

function formatearNumeroTicket(
  valor: unknown
): string {

  const numero =
    Number(valor || 0);

  if (
    Number.isNaN(numero)
  ) {
    return "0";
  }

  if (
    Number.isInteger(numero)
  ) {
    return String(numero);
  }

  return numero.toFixed(1);

}

function formatearFechaTicket(
  fecha?: string | Date | null
): string {

  const fechaConvertida =
    fecha
      ? new Date(fecha)
      : new Date();

  if (
    Number.isNaN(
      fechaConvertida.getTime()
    )
  ) {
    return new Date()
      .toLocaleString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  }

  return fechaConvertida
    .toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");

}

function formatearHoraTicket(
  fecha?: string | Date | null
): string {

  const fechaConvertida =
    fecha
      ? new Date(fecha)
      : new Date();

  if (
    Number.isNaN(
      fechaConvertida.getTime()
    )
  ) {
    return new Date()
      .toLocaleTimeString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
  }

  return fechaConvertida
    .toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

}

function escaparHtml(
  texto: string
): string {

  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}

function dividirTextoEnLineas(
  texto: string,
  anchoMaximo: number
): string[] {

  const palabras =
    texto.split(" ");

  const lineas:
    string[] = [];

  let lineaActual = "";

  palabras.forEach(
    (palabra) => {

      if (
        (
          lineaActual +
          " " +
          palabra
        )
          .trim()
          .length <=
        anchoMaximo
      ) {

        lineaActual =
          (
            lineaActual +
            " " +
            palabra
          ).trim();

      } else {

        if (lineaActual) {
          lineas.push(
            lineaActual
          );
        }

        if (
          palabra.length >
          anchoMaximo
        ) {

          for (
            let i = 0;
            i < palabra.length;
            i += anchoMaximo
          ) {
            lineas.push(
              palabra.slice(
                i,
                i + anchoMaximo
              )
            );
          }

          lineaActual = "";

        } else {

          lineaActual =
            palabra;

        }

      }

    }
  );

  if (lineaActual) {
    lineas.push(
      lineaActual
    );
  }

  return lineas;

}

/* =========================
    GENERAR TEXTO DE VENTA
========================= */

function generarTextoVentaTermica(
  venta: VentaConDetallesType,
  nombreVendedor: string
): string {

  const linea =
    "-".repeat(
      COLUMNAS_TICKET
    );

  const numeroVenta =
    venta.numeroVenta ||
    venta._id?.slice(-6) ||
    "S/N";

  const numeroComanda =
    venta.comanda?.numeroComanda ||
    "Sin comanda";

  const fechaVenta =
    venta.fechaVenta ||
    venta.fechaCreacion ||
    new Date();

  const metodoPago =
    limpiarTextoTicket(
      venta.metodoPago || "SIN METODO",
      20
    );

  const caja =
    limpiarTextoTicket(
      venta.caja?.nombre || "SIN CAJA",
      20
    );

  const estado =
    limpiarTextoTicket(
      venta.estado || "SIN ESTADO",
      20
    );

  let totalGeneral = 0;

  let texto = "";

  texto += `Venta    NRO: ${numeroVenta}\n`;
  texto += `Comanda  NRO: ${numeroComanda}\n`;
  texto += `Vendedor: ${limpiarTextoTicket(
    nombreVendedor || "SIN NOMBRE",
    18
  )}\n`;
  texto += `Caja: ${caja}\n`;
  texto += `Metodo: ${metodoPago}\n`;
  texto += `Fec: ${formatearFechaTicket(
    fechaVenta
  )}\n\n`;

  texto += "PRODUCTO\n";
  texto +=
    "".padEnd(10) +
    "CANT".padStart(5) +
    "PREC".padStart(7) +
    "Total".padStart(8) +
    "\n";

  texto += `${linea}\n`;

  venta.detalles.forEach(
    (detalle) => {

      const nombreProductoCompleto =
        limpiarTextoTicket(
          detalle.producto?.nombre ||
            "PRODUCTO",
          COLUMNAS_TICKET
        );

      const cantidad =
        Number(
          detalle.cantidad || 0
        );

      const precioUnitario =
        Number(
          detalle.precioUnitario ||
          0
        );

      const subtotal =
        Number(
          detalle.subtotal ||
          cantidad * precioUnitario
        );

      totalGeneral =
        totalGeneral +
        subtotal;

      const lineasProducto =
        dividirTextoEnLineas(
          nombreProductoCompleto,
          COLUMNAS_TICKET
        );

      lineasProducto.forEach(
        (lineaProducto) => {
          texto += `${lineaProducto}\n`;
        }
      );

      texto +=
        "".padEnd(10) +
        formatearNumeroTicket(
          cantidad
        ).padStart(5) +
        formatearNumeroTicket(
          precioUnitario
        ).padStart(7) +
        formatearNumeroTicket(
          subtotal
        ).padStart(8) +
        "\n";

    }
  );

  texto += `${linea}\n`;

  const subtotalVenta =
    Number(
      venta.subtotal ??
      totalGeneral
    );

  const descuentoVenta =
    Number(
      venta.descuento || 0
    );

  const totalVenta =
    Number(
      venta.total ??
      totalGeneral
    );

  texto +=
    "SUBTOTAL".padEnd(22) +
    formatearNumeroTicket(
      subtotalVenta
    ).padStart(8) +
    "\n";

  if (
    descuentoVenta > 0
  ) {
    texto +=
      "DESCUENTO".padEnd(22) +
      formatearNumeroTicket(
        descuentoVenta
      ).padStart(8) +
      "\n";
  }

  texto +=
    "TOTAL".padEnd(22) +
    formatearNumeroTicket(
      totalVenta
    ).padStart(8) +
    "\n";

  texto += `ESTADO: ${estado}\n\n`;
  texto += `${formatearHoraTicket(
    fechaVenta
  )}\n\n\n`;

  return texto;

}

/* =========================
    COMPONENTE
========================= */

export default function VentaDetailView() {

  const queryClient =
    useQueryClient();

  const {
    data: perfil,
    isLoading:
      loadingPerfil,
  } = useAuth();

  const [
    search,
    setSearch,
  ] = useState("");

  /* =========================
      IDS NORMALIZADOS
  ========================= */

  const idPerfil =
    obtenerIdRelacion(
      perfil?._id
    );

  const idSucursalPerfil =
    obtenerIdRelacion(
      perfil?.idSucursal
    );

  const nombreUsuario =
    perfil?.nombres ||
    "sistema";

  /* =========================
      CONSULTAR VENTAS
  ========================= */

  const {
    data,
    isLoading:
      loadingVentas,
    isError,
    error,
  } = useQuery({

    queryKey: [
      "ventas-con-detalles",
      idPerfil,
    ],

    queryFn: () =>
      getVentasConDetallesPorPerfil(
        idPerfil
      ),

    enabled:
      Boolean(idPerfil),

  });

  /* =========================
      VENTAS FILTRADAS
  ========================= */

  const ventasFiltradas =
    useMemo(() => {

      const ventas =
        data?.ventas || [];

      const busqueda =
        search
          .trim()
          .toLowerCase();

      if (!busqueda) {
        return ventas;
      }

      return ventas.filter(
        (venta) => {

          const productos =
            venta.detalles
              .map(
                (detalle) =>
                  [
                    detalle
                      .producto
                      ?.nombre,
                    detalle
                      .producto
                      ?.marca,
                    detalle
                      .producto
                      ?.descripcion,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(" ")
              )
              .join(" ");

          const texto = [
            venta.numeroVenta,
            venta.estado,
            venta.metodoPago,
            venta.observacion,
            venta
              .comanda
              ?.numeroComanda,
            venta
              .caja
              ?.nombre,
            productos,
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
      data,
      search,
    ]);

  /* =========================
      RESUMEN
  ========================= */

 /* =========================
    RESUMEN DE VENTAS
========================= */

const resumen =
  useMemo<ResumenVentas>(() => {

    const ventas =
      data?.ventas ?? [];

    return ventas.reduce<ResumenVentas>(
      (
        acumulado,
        venta
      ) => {

        const totalVenta =
          obtenerNumero(
            venta.total
          );

        if (
          venta.estado ===
          "pagado"
        ) {

          acumulado.pagadas =
            acumulado.pagadas + 1;

          acumulado.totalPagado =
            acumulado.totalPagado +
            totalVenta;

        }

        if (
          venta.estado ===
          "cortesia"
        ) {

          acumulado.cortesias =
            acumulado.cortesias + 1;

          acumulado.totalCortesia =
            acumulado.totalCortesia +
            totalVenta;

        }

        if (
          venta.estado ===
          "anulado"
        ) {

          acumulado.anuladas =
            acumulado.anuladas + 1;

          acumulado.totalAnulado =
            acumulado.totalAnulado +
            totalVenta;

        }

        return acumulado;

      },
      {
        pagadas: 0,
        cortesias: 0,
        anuladas: 0,

        totalPagado: 0,
        totalCortesia: 0,
        totalAnulado: 0,
      }
    );

  }, [
    data?.ventas,
  ]);

  /* =========================
      ANULAR VENTA
  ========================= */

  type AnularVentaPayload = {

    venta:
      VentaConDetallesType;

    eliminadoPor:
      string;

  };

  const {
    mutate:
      anularVenta,

    isPending:
      anulandoVenta,
  } = useMutation({

    mutationFn:
      async ({
        venta,
        eliminadoPor,
      }: AnularVentaPayload) => {

        if (!venta._id) {

          throw new Error(
            "No se encontró el ID de la venta"
          );

        }

        const idVenta =
          String(
            venta._id
          );

        const idCaja =
          obtenerIdRelacion(
            venta.caja
          );

        const idComanda =
          obtenerIdRelacion(
            venta.comanda
          );

        const idSucursal =
          data?.sucursal?._id ||
          idSucursalPerfil ||
          "";

        /*
          1. Anular venta.

          El backend:
          - cambia venta a anulado
          - marca detalles eliminados
          - restaura el inventario
        */

        const respuesta =
          await deleteVentaById({

            id:
              idVenta,

            eliminadoPor,

          });

        /*
          2. Movimiento de reversión financiera
        */

        const movimientoAnulacion:
          MovimientoForm = {

          fecha:
            new Date()
              .toISOString(),

          tipoMovimiento:
            "venta_anulada",

          origenMovimiento:
            "venta",

          modulo:
            "venta",

          idVenta,

          idComanda:
            idComanda ||
            undefined,

          idSucursal:
            idSucursal ||
            undefined,

          idCaja:
            idCaja ||
            undefined,

          idPerfil:
            idPerfil ||
            undefined,

          metodoPago:
            venta.metodoPago,

          montoSalida:
            Number(
              venta.total || 0
            ),

          subtotal:
            Number(
              venta.subtotal || 0
            ),

          descuento:
            Number(
              venta.descuento || 0
            ),

          total:
            Number(
              venta.total || 0
            ),

          estado:
            "anulado",

          referenciaId:
            idVenta,

          referenciaModelo:
            "Venta",

          observacion:
            `Anulación de la venta ${
              venta.numeroVenta ||
              idVenta
            }`,

          creadoPor:
            eliminadoPor,

        };

        await createMovimiento(
          movimientoAnulacion
        );

        /*
          3. Registrar cada devolución
          de producto al inventario.

          Aquí no se modifica nuevamente
          el stock. Solo se registra el
          historial del movimiento.
        */

        for (
          const detalle
          of venta.detalles
        ) {

          const idProducto =
            obtenerIdRelacion(
              detalle.idProducto
            ) ||
            detalle.producto
              ?._id ||
            "";

          const idInventario =
            obtenerIdRelacion(
              detalle.idInventario
            );

          const idAlmacen =
            obtenerIdRelacion(
              detalle.idAlmacen
            );

          if (
            !idProducto ||
            !idInventario ||
            !idAlmacen
          ) {

            console.warn(
              "No se registró movimiento de devolución porque faltan relaciones:",
              detalle
            );

            continue;

          }

          const cantidad =
            Number(
              detalle.cantidad || 0
            );

          const movimientoInventario:
            MovimientoForm = {

            fecha:
              new Date()
                .toISOString(),

            tipoMovimiento:
              "entrada_inventario",

            origenMovimiento:
              "venta",

            modulo:
              "inventario",

            idVenta,

            idComanda:
              idComanda ||
              undefined,

            idSucursal:
              idSucursal ||
              undefined,

            idCaja:
              idCaja ||
              undefined,

            idPerfil:
              idPerfil ||
              undefined,

            idProducto,

            idInventario,

            idAlmacen,

            cantidad,

            cantidadEntrada:
              cantidad,

            precioUnitario:
              Number(
                detalle
                  .precioUnitario ||
                0
              ),

            costoUnitario:
              Number(
                detalle
                  .costoUnitario ||
                0
              ),

            subtotal:
              Number(
                detalle.subtotal ||
                0
              ),

            total:
              Number(
                detalle.subtotal ||
                0
              ),

            estado:
              "activo",

            referenciaId:
              idVenta,

            referenciaModelo:
              "Venta",

            observacion:
              `Devolución por anulación: ${
                detalle
                  .producto
                  ?.nombre ||
                "Producto"
              }`,

            creadoPor:
              eliminadoPor,

          };

          await createMovimiento(
            movimientoInventario
          );

        }

        return respuesta;

      },

    onSuccess:
      async () => {

        await Swal.fire({

          icon:
            "success",

          title:
            "Venta anulada",

          text:
            "Se anuló la venta y se registraron los movimientos de reversión.",

          timer:
            2500,

          showConfirmButton:
            false,

        });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "ventas-con-detalles",
              idPerfil,
            ],

          });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "movimientos",
            ],

          });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "inventario-barra",
              idSucursalPerfil,
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
            "Error al anular",

          text:
            error instanceof Error
              ? error.message
              : "No se pudo anular la venta",

        });

      },

  });

  /* =========================
      CORTESÍA
  ========================= */

  type CortesiaVentaPayload = {

    venta:
      VentaConDetallesType;

    actualizadoPor:
      string;

    observacion:
      string;

  };

  const {
    mutate:
      marcarCortesia,

    isPending:
      marcandoCortesia,
  } = useMutation({

    mutationFn:
      async ({
        venta,
        actualizadoPor,
        observacion,
      }: CortesiaVentaPayload) => {

        if (!venta._id) {

          throw new Error(
            "No se encontró el ID de la venta"
          );

        }

        const idVenta =
          String(
            venta._id
          );

        const idCaja =
          obtenerIdRelacion(
            venta.caja
          );

        const idComanda =
          obtenerIdRelacion(
            venta.comanda
          );

        const idSucursal =
          data?.sucursal?._id ||
          idSucursalPerfil ||
          "";

        /*
          1. Convertir la venta
          en cortesía.

          No se devuelve inventario.
        */

        const respuesta =
          await cortesiaVentaById({

            id:
              idVenta,

            actualizadoPor,

            observacion,

          });

        /*
          2. Registrar reversión
          del ingreso como cortesía.
        */

        const movimientoCortesia:
          MovimientoForm = {

          fecha:
            new Date()
              .toISOString(),

          tipoMovimiento:
            "cortesia",

          origenMovimiento:
            "cortesia",

          modulo:
            "venta",

          idVenta,

          idComanda:
            idComanda ||
            undefined,

          idSucursal:
            idSucursal ||
            undefined,

          idCaja:
            idCaja ||
            undefined,

          idPerfil:
            idPerfil ||
            undefined,

          metodoPago:
            venta.metodoPago,

          montoSalida:
            Number(
              venta.total || 0
            ),

          subtotal:
            Number(
              venta.subtotal || 0
            ),

          descuento:
            Number(
              venta.descuento || 0
            ),

          total:
            Number(
              venta.total || 0
            ),

          estado:
            "cortesia",

          referenciaId:
            idVenta,

          referenciaModelo:
            "Venta",

          observacion,

          creadoPor:
            actualizadoPor,

        };

        await createMovimiento(
          movimientoCortesia
        );

        return respuesta;

      },

    onSuccess:
      async () => {

        await Swal.fire({

          icon:
            "success",

          title:
            "Cortesía registrada",

          text:
            "La venta fue convertida en cortesía y se registró el movimiento.",

          timer:
            2500,

          showConfirmButton:
            false,

        });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "ventas-con-detalles",
              idPerfil,
            ],

          });

        await queryClient
          .invalidateQueries({

            queryKey: [
              "movimientos",
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
            "Error con la cortesía",

          text:
            error instanceof Error
              ? error.message
              : "No se pudo registrar la cortesía",

        });

      },

  });

  /* =========================
      HANDLE ANULAR
  ========================= */

  const handleAnularVenta =
    async (
      venta:
        VentaConDetallesType
    ) => {

      if (!venta._id) {

        await Swal.fire({

          icon:
            "error",

          title:
            "Venta inválida",

          text:
            "No se encontró el ID de la venta.",

        });

        return;

      }

      const resultado =
        await Swal.fire({

          icon:
            "warning",

          title:
            "¿Anular esta venta?",

          html: `
            <p>La venta será anulada.</p>
            <p>Los productos volverán al inventario.</p>
            <p>También se registrarán los movimientos de reversión.</p>
          `,

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, anular",

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

      anularVenta({

        venta,

        eliminadoPor:
          nombreUsuario,

      });

    };

  /* =========================
      HANDLE CORTESÍA
  ========================= */

  const handleCortesiaVenta =
    async (
      venta:
        VentaConDetallesType
    ) => {

      if (!venta._id) {

        await Swal.fire({

          icon:
            "error",

          title:
            "Venta inválida",

          text:
            "No se encontró el ID de la venta.",

        });

        return;

      }

      const resultado =
        await Swal.fire({

          icon:
            "question",

          title:
            "¿Convertir en cortesía?",

          text:
            "La venta dejará de considerarse ingreso, pero los productos permanecerán descontados del inventario.",

          input:
            "textarea",

          inputLabel:
            "Motivo de la cortesía",

          inputPlaceholder:
            "Ejemplo: cortesía autorizada por gerencia",

          inputValue:
            "Cortesía autorizada",

          showCancelButton:
            true,

          confirmButtonText:
            "Confirmar cortesía",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#d97706",

          inputValidator:
            (
              value
            ) => {

              if (
                !value?.trim()
              ) {

                return "Debe indicar el motivo de la cortesía.";

              }

              return undefined;

            },

        });

      if (
        !resultado.isConfirmed
      ) {
        return;
      }

      marcarCortesia({

        venta,

        actualizadoPor:
          nombreUsuario,

        observacion:
          String(
            resultado.value ||
            "Cortesía autorizada"
          ).trim(),

      });

    };

  /* =========================
      IMPRIMIR VENTA
  ========================= */

  const handleImprimirVenta =
    async (
      venta:
        VentaConDetallesType
    ) => {

      if (!venta._id) {

        await Swal.fire({

          icon:
            "error",

          title:
            "Venta inválida",

          text:
            "No se encontró el ID de la venta.",

        });

        return;

      }

      if (
        !venta.detalles ||
        venta.detalles.length === 0
      ) {

        await Swal.fire({

          icon:
            "warning",

          title:
            "Venta sin productos",

          text:
            "No se puede imprimir una venta sin productos.",

        });

        return;

      }

      const nombreVendedor =
        data?.perfil?.nombres ||
        perfil?.nombres ||
        nombreUsuario ||
        "SIN NOMBRE";

      const texto =
        generarTextoVentaTermica(
          venta,
          nombreVendedor
        );

      const resultado =
        await Swal.fire({

          icon:
            "info",

          title:
            "Vista previa de venta",

          html: `
            <pre style="
              text-align: left;
              background: #020617;
              color: white;
              padding: 14px;
              border-radius: 12px;
              font-size: 13px;
              line-height: 1.3;
              overflow-x: auto;
              font-family: monospace;
            ">${escaparHtml(texto)}</pre>
          `,

          showCancelButton:
            true,

          confirmButtonText:
            "Imprimir",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#2563eb",

        });

      if (
        !resultado.isConfirmed
      ) {
        return;
      }

      try {

        await axios.post(
          IMPRESORA_TERMICA_URL,
          {
            texto,
          }
        );

        await Swal.fire({

          icon:
            "success",

          title:
            "Venta enviada",

          text:
            "La venta fue enviada a la impresora térmica.",

          timer:
            1800,

          showConfirmButton:
            false,

        });

      } catch (error) {

        console.error(
          "Error al imprimir venta:",
          error
        );

        await Swal.fire({

          icon:
            "error",

          title:
            "Error de impresión",

          text:
            "No se pudo conectar con el servidor de impresión.",

        });

      }

    };

  /* =========================
      ESTADO VISUAL
  ========================= */

  function obtenerEstadoVisual(
    estado:
      string
  ) {

    if (
      estado ===
      "pagado"
    ) {

      return {
        texto:
          "Pagado",

        clases:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",

        icono:
          CheckCircle2,
      };

    }

    if (
      estado ===
      "cortesia"
    ) {

      return {
        texto:
          "Cortesía",

        clases:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",

        icono:
          Gift,
      };

    }

    if (
      estado ===
      "anulado"
    ) {

      return {
        texto:
          "Anulado",

        clases:
          "border-red-500/30 bg-red-500/10 text-red-400",

        icono:
          XCircle,
      };

    }

    return {
      texto:
        estado,

      clases:
        "border-slate-500/30 bg-slate-500/10 text-slate-400",

      icono:
        ReceiptText,
    };

  }

  /* =========================
      LOADING
  ========================= */

  if (
    loadingPerfil ||
    loadingVentas
  ) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <RefreshCcw className="mx-auto h-12 w-12 animate-spin text-fuchsia-400" />

          <p className="mt-4 font-bold text-slate-300">

            Cargando ventas...

          </p>

        </div>

      </div>

    );

  }

  /* =========================
      ERROR
  ========================= */

  if (isError) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center p-5">

        <div className="max-w-lg rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">

          <XCircle className="mx-auto h-12 w-12 text-red-400" />

          <h2 className="mt-4 text-2xl font-black text-red-400">

            Error al cargar ventas

          </h2>

          <p className="mt-3 text-slate-300">

            {error instanceof Error
              ? error.message
              : "No se pudieron cargar las ventas"}

          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#070B14] p-3 text-white sm:p-5 lg:p-7">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-7">

        <div className="flex items-center gap-3">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10">

            <ReceiptText className="h-7 w-7 text-fuchsia-400" />

          </div>

          <div>

            <h1 className="text-3xl font-black text-white">

              Mis ventas

            </h1>

            <p className="mt-1 text-sm text-slate-400">

              Consulta, anula o convierte tus ventas en cortesía

            </p>

          </div>

        </div>

      </div>

      {/* =========================
          RESUMEN
      ========================= */}

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl border border-emerald-500/20 bg-[#0B1120] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">

                Ventas pagadas

              </p>

              <p className="mt-2 text-3xl font-black text-emerald-400">

                {resumen.pagadas}

              </p>

            </div>

            <CircleDollarSign className="h-9 w-9 text-emerald-400" />

          </div>

          <p className="mt-4 font-bold text-white">

            {formatearDinero(
              resumen.totalPagado
            )}

          </p>

        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-[#0B1120] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">

                Cortesías

              </p>

              <p className="mt-2 text-3xl font-black text-amber-400">

                {resumen.cortesias}

              </p>

            </div>

            <Gift className="h-9 w-9 text-amber-400" />

          </div>

          <p className="mt-4 font-bold text-white">

            {formatearDinero(
              resumen.totalCortesia
            )}

          </p>

        </div>

        <div className="rounded-3xl border border-red-500/20 bg-[#0B1120] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">

                Ventas anuladas

              </p>

              <p className="mt-2 text-3xl font-black text-red-400">

                {resumen.anuladas}

              </p>

            </div>

            <Ban className="h-9 w-9 text-red-400" />

          </div>

          <p className="mt-4 font-bold text-white">

            {formatearDinero(
              resumen.totalAnulado
            )}

          </p>

        </div>

        <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1120] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">

                Sucursal

              </p>

              <p className="mt-2 text-lg font-black text-cyan-400">

                {data?.sucursal
                  ?.nombreSucursal ||
                  "Sin sucursal"}

              </p>

            </div>

            <Store className="h-9 w-9 text-cyan-400" />

          </div>

          <p className="mt-4 text-sm text-slate-400">

            {data?.perfil
              ?.nombres ||
              perfil?.nombres ||
              "Usuario"}

          </p>

        </div>

      </div>

      {/* =========================
          BUSCADOR
      ========================= */}

      <div className="mb-6 rounded-3xl border border-slate-800 bg-[#0B1120] p-4">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

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
            placeholder="Buscar venta, producto, comanda o método de pago..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-fuchsia-500"
          />

        </div>

      </div>

      {/* =========================
          LISTA
      ========================= */}

      {ventasFiltradas.length ===
      0 ? (

        <div className="rounded-3xl border border-dashed border-slate-700 bg-[#0B1120] p-12 text-center">

          <ReceiptText className="mx-auto h-14 w-14 text-slate-600" />

          <h2 className="mt-4 text-xl font-black text-white">

            No existen ventas

          </h2>

          <p className="mt-2 text-slate-400">

            No se encontraron ventas para mostrar.

          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {ventasFiltradas.map(
            (
              venta
            ) => {

              const estadoVisual =
                obtenerEstadoVisual(
                  venta.estado
                );

              const EstadoIcon =
                estadoVisual.icono;

              return (

                <article
                  key={
                    venta._id ||
                    venta.numeroVenta
                  }
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1120] shadow-xl"
                >

                  {/* CABECERA */}

                  <div className="flex flex-col gap-5 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-start gap-4">

                      <div className="flex h-14 w-14 min-w-14 items-center justify-center rounded-2xl bg-fuchsia-500/10">

                        <ReceiptText className="h-7 w-7 text-fuchsia-400" />

                      </div>

                      <div>

                        <h2 className="text-xl font-black text-white">

                          {venta.numeroVenta ||
                            "Venta sin número"}

                        </h2>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">

                          <span className="inline-flex items-center gap-2">

                            <CalendarDays className="h-4 w-4" />

                            {formatearFecha(
                              venta.fechaVenta ||
                              venta.fechaCreacion
                            )}

                          </span>

                          <span className="inline-flex items-center gap-2">

                            <UserRound className="h-4 w-4" />

                            {venta.creadoPor ||
                              nombreUsuario}

                          </span>

                          <span className="inline-flex items-center gap-2">

                            <Banknote className="h-4 w-4" />

                            {venta.metodoPago}

                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-2xl
                          border
                          px-4
                          py-2
                          text-sm
                          font-black
                          ${estadoVisual.clases}
                        `}
                      >

                        <EstadoIcon className="h-4 w-4" />

                        {estadoVisual.texto}

                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleImprimirVenta(
                            venta
                          )
                        }
                        disabled={
                          marcandoCortesia ||
                          anulandoVenta
                        }
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <Printer className="h-4 w-4" />

                      

                      </button>

                      {venta.estado ===
                        "pagado" && (

                        <>

                          <button
                            type="button"
                            onClick={() =>
                              handleCortesiaVenta(
                                venta
                              )
                            }
                            disabled={
                              marcandoCortesia ||
                              anulandoVenta
                            }
                            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <Gift className="h-4 w-4" />

                            Cortesía

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAnularVenta(
                                venta
                              )
                            }
                            disabled={
                              anulandoVenta ||
                              marcandoCortesia
                            }
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <Ban className="h-4 w-4" />

                          

                          </button>

                        </>

                      )}

                    </div>

                  </div>

                  {/* DATOS */}

                  <div className="grid gap-4 border-b border-slate-800 p-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl bg-slate-950 p-4">

                      <p className="text-xs uppercase tracking-wider text-slate-500">

                        Comanda

                      </p>

                      <p className="mt-1 font-black text-white">

                        {venta.comanda
                          ?.numeroComanda ||
                          "Sin comanda"}

                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-950 p-4">

                      <p className="text-xs uppercase tracking-wider text-slate-500">

                        Caja

                      </p>

                      <p className="mt-1 font-black text-white">

                        {venta.caja
                          ?.nombre ||
                          "Sin caja"}

                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-950 p-4">

                      <p className="text-xs uppercase tracking-wider text-slate-500">

                        Subtotal

                      </p>

                      <p className="mt-1 font-black text-cyan-400">

                        {formatearDinero(
                          venta.subtotal
                        )}

                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-950 p-4">

                      <p className="text-xs uppercase tracking-wider text-slate-500">

                        Total

                      </p>

                      <p className="mt-1 text-xl font-black text-fuchsia-400">

                        {formatearDinero(
                          venta.total
                        )}

                      </p>

                    </div>

                  </div>

                  {/* OBSERVACIÓN */}

                  <div className="border-b border-slate-800 px-5 py-4">

                    <p className="text-xs uppercase tracking-wider text-slate-500">

                      Observación

                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-300">

                      {venta.observacion ||
                        "Sin observación"}

                    </p>

                  </div>

                  {/* PRODUCTOS */}

                  <div className="p-5">

                    <div className="mb-4 flex items-center gap-2">

                      <Package className="h-5 w-5 text-fuchsia-400" />

                      <h3 className="font-black text-white">

                        Productos vendidos

                      </h3>

                    </div>

                    {venta.detalles.length ===
                    0 ? (

                      <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-center text-slate-400">

                        La venta no tiene detalles registrados.

                      </div>

                    ) : (

                      <div className="overflow-x-auto">

                        <table className="min-w-[800px] w-full">

                          <thead>

                            <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-500">

                              <th className="pb-3 pr-4">
                                Producto
                              </th>

                              <th className="pb-3 pr-4 text-center">
                                Cantidad
                              </th>

                              <th className="pb-3 pr-4 text-right">
                                Precio
                              </th>

                              <th className="pb-3 pr-4 text-right">
                                Costo
                              </th>

                              <th className="pb-3 text-right">
                                Subtotal
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {venta.detalles.map(
                              (
                                detalle,
                                index
                              ) => (

                                <tr
                                  key={
                                    detalle._id ||
                                    `${venta._id}-${index}`
                                  }
                                  className="border-b border-slate-800"
                                >

                                  <td className="py-4 pr-4">

                                    <div className="flex items-center gap-3">

                                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">

                                        <Box className="h-5 w-5 text-cyan-400" />

                                      </div>

                                      <div>

                                        <p className="font-black text-white">

                                          {detalle
                                            .producto
                                            ?.nombre ||
                                            "Producto"}

                                        </p>

                                        <p className="text-xs text-slate-500">

                                          {detalle
                                            .producto
                                            ?.marca ||
                                            "Sin marca"}

                                        </p>

                                      </div>

                                    </div>

                                  </td>

                                  <td className="py-4 pr-4 text-center font-black text-white">

                                    {Number(
                                      detalle.cantidad ||
                                      0
                                    )}

                                  </td>

                                  <td className="py-4 pr-4 text-right text-slate-300">

                                    {formatearDinero(
                                      detalle
                                        .precioUnitario
                                    )}

                                  </td>

                                  <td className="py-4 pr-4 text-right text-slate-400">

                                    {formatearDinero(
                                      detalle
                                        .costoUnitario
                                    )}

                                  </td>

                                  <td className="py-4 text-right font-black text-fuchsia-400">

                                    {formatearDinero(
                                      detalle.subtotal
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

                </article>

              );

            }
          )}

        </div>

      )}

    </div>

  );

}