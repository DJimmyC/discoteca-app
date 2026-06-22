// // src/components/venta/VentaModal.tsx

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";

// import {
//   Banknote,
//   CreditCard,
//   LoaderCircle,
//   Printer,
//   ReceiptText,
//   Smartphone,
//   X,
// } from "lucide-react";

// import Swal from "sweetalert2";

// import {
//   createVenta,
// } from "@/api/VentaApi";

// import {
//   createDetalleVenta,
// } from "@/api/DetalleVentaApi";

// import {
//   createMovimiento,
// } from "@/api/MovimientoApi";

// import {
//   updateComanda,
// } from "@/api/ComandaApi";

// import type {
//   ComandaConDetalleType,
//   DetalleDentroComandaType,
// } from "@/types/ComandaType";

// import type {
//   DetalleVentaForm,
// } from "@/types/DetalleVentaType";

// import type {
//   MetodoPagoVenta,
// } from "@/types/VentaType";

// import type {
//   MovimientoForm,
// } from "@/types/MovimientoType";

// /* =========================
//     TIPO CAJA
// ========================= */

// type CajaOption = {
//   _id: string;

//   nombre?: string | null;

//   descripcion?: string | null;

//   estado?: boolean;
// };

// /* =========================
//     PROPS
// ========================= */

// type VentaModalProps = {
//   open: boolean;

//   onClose: () => void;

//   comanda:
//     ComandaConDetalleType | null;

//   cajas:
//     CajaOption[];

//   idPerfil:
//     string;

//   idSucursal:
//     string;

//   creadoPor:
//     string;

//   onSuccess?:
//     () => void;
// };

// /* =========================
//     DETALLE PREPARADO
// ========================= */

// type DetallePreparado = {
//   idProducto:
//     string;

//   idInventario:
//     string;

//   idAlmacen:
//     string;

//   nombreProducto:
//     string;

//   cantidad:
//     number;

//   precioUnitario:
//     number;

//   costoUnitario:
//     number;

//   subtotal:
//     number;
// };

// /* =========================
//     OBTENER ID DE RELACIÓN
// ========================= */

// function obtenerIdRelacion(
//   relacion:
//     | string
//     | Record<string, unknown>
//     | null
//     | undefined
// ): string {

//   if (
//     typeof relacion ===
//     "string"
//   ) {
//     return relacion;
//   }

//   if (
//     relacion &&
//     typeof relacion ===
//       "object" &&
//     "_id" in relacion
//   ) {

//     const id =
//       relacion._id;

//     return typeof id ===
//       "string"
//       ? id
//       : "";

//   }

//   return "";
// }

// /* =========================
//     OBTENER PRODUCTO
// ========================= */

// function obtenerProducto(
//   detalle:
//     DetalleDentroComandaType
// ) {

//   if (
//     detalle.producto &&
//     typeof detalle.producto ===
//       "object"
//   ) {
//     return detalle.producto;
//   }

//   if (
//     detalle.idProducto &&
//     typeof detalle.idProducto ===
//       "object"
//   ) {
//     return detalle.idProducto;
//   }

//   return null;
// }

// /* =========================
//     OBTENER INVENTARIO
// ========================= */

// function obtenerInventario(
//   detalle:
//     DetalleDentroComandaType
// ) {

//   if (
//     detalle.idInventario &&
//     typeof detalle.idInventario ===
//       "object"
//   ) {
//     return detalle.idInventario;
//   }

//   return null;
// }

// /* =========================
//     COMPONENTE
// ========================= */

// export default function VentaModal({

//   open,

//   onClose,

//   comanda,

//   cajas,

//   idPerfil,

//   idSucursal,

//   creadoPor,

//   onSuccess,

// }: VentaModalProps) {

//   const queryClient =
//     useQueryClient();

//   /* =========================
//       ESTADOS
//   ========================= */

//   const [
//     idCaja,
//     setIdCaja,
//   ] = useState("");

//   const [
//     metodoPago,
//     setMetodoPago,
//   ] =
//     useState<MetodoPagoVenta>(
//       "efectivo"
//     );

//   const [
//     descuento,
//     setDescuento,
//   ] = useState<number>(0);

//   const [
//     observacion,
//     setObservacion,
//   ] = useState("");

//   /* =========================
//       INICIALIZAR MODAL
//   ========================= */

//   useEffect(() => {

//     if (!open) {
//       return;
//     }

//     const primeraCajaActiva =
//       cajas.find(
//         (caja) =>
//           caja.estado !== false
//       );

//     setIdCaja(
//       primeraCajaActiva?._id ||
//       ""
//     );

//     setMetodoPago(
//       "efectivo"
//     );

//     setDescuento(
//       0
//     );

//     setObservacion(
//       comanda?.observacion ||
//       ""
//     );

//   }, [
//     open,
//     cajas,
//     comanda,
//   ]);

//   /* =========================
//       SUBTOTAL
//   ========================= */

//   const subtotal =
//     useMemo(() => {

//       if (!comanda) {
//         return 0;
//       }

//       return comanda.detalles.reduce(
//         (
//           acumulado,
//           detalle
//         ) => {

//           const cantidad =
//             Number(
//               detalle.cantidad ||
//               0
//             );

//           const precioUnitario =
//             Number(
//               detalle.precioUnitario ||
//               0
//             );

//           const subtotalGuardado =
//             Number(
//               detalle.subtotal
//             );

//           const subtotalDetalle =
//             Number.isFinite(
//               subtotalGuardado
//             )
//               ? subtotalGuardado
//               : cantidad *
//                 precioUnitario;

//           return (
//             acumulado +
//             subtotalDetalle
//           );

//         },
//         0
//       );

//     }, [
//       comanda,
//     ]);

//   /* =========================
//       DESCUENTO SEGURO
//   ========================= */

//   const descuentoSeguro =
//     Math.min(
//       Math.max(
//         Number(
//           descuento ||
//           0
//         ),
//         0
//       ),
//       subtotal
//     );

//   /* =========================
//       TOTAL
//   ========================= */

//   const total =
//     Math.max(
//       subtotal -
//       descuentoSeguro,
//       0
//     );

//   /* =========================
//       TOTAL DE UNIDADES
//   ========================= */

//   const totalUnidades =
//     useMemo(() => {

//       if (!comanda) {
//         return 0;
//       }

//       return comanda.detalles.reduce(
//         (
//           acumulado,
//           detalle
//         ) =>
//           acumulado +
//           Number(
//             detalle.cantidad ||
//             0
//           ),
//         0
//       );

//     }, [
//       comanda,
//     ]);

//   /* =========================
//       PREPARAR DETALLES
//   ========================= */

//   const prepararDetalles =
//     (): DetallePreparado[] => {

//       if (!comanda) {
//         return [];
//       }

//       return comanda.detalles.map(
//         (
//           detalle,
//           index
//         ) => {

//           const producto =
//             obtenerProducto(
//               detalle
//             );

//           const inventario =
//             obtenerInventario(
//               detalle
//             );

//           const idProducto =
//             obtenerIdRelacion(
//               detalle.idProducto
//             ) ||
//             producto?._id ||
//             "";

//           const idInventario =
//             obtenerIdRelacion(
//               detalle.idInventario
//             );

//           const idAlmacen =
//             obtenerIdRelacion(
//               detalle.idAlmacen
//             ) ||
//             obtenerIdRelacion(
//               inventario
//                 ?.idAlmacen
//             );

//           const cantidad =
//             Number(
//               detalle.cantidad
//             );

//           const precioUnitario =
//             Number(
//               detalle.precioUnitario
//             );

//           const costoUnitario =
//             Number(
//               inventario
//                 ?.costoUnitario ||
//               0
//             );

//           const nombreProducto =
//             producto?.nombre ||
//             `Producto ${
//               index + 1
//             }`;

//           if (!idProducto) {

//             throw new Error(
//               `${nombreProducto} no tiene un ID de producto válido`
//             );

//           }

//           if (!idInventario) {

//             throw new Error(
//               `${nombreProducto} no tiene inventario asociado`
//             );

//           }

//           if (!idAlmacen) {

//             throw new Error(
//               `${nombreProducto} no tiene almacén asociado`
//             );

//           }

//           if (
//             !Number.isFinite(
//               cantidad
//             ) ||
//             cantidad <= 0
//           ) {

//             throw new Error(
//               `La cantidad de ${nombreProducto} no es válida`
//             );

//           }

//           if (
//             !Number.isFinite(
//               precioUnitario
//             ) ||
//             precioUnitario < 0
//           ) {

//             throw new Error(
//               `El precio de ${nombreProducto} no es válido`
//             );

//           }

//           return {
//             idProducto,

//             idInventario,

//             idAlmacen,

//             nombreProducto,

//             cantidad,

//             precioUnitario,

//             costoUnitario,

//             subtotal:
//               cantidad *
//               precioUnitario,
//           };

//         }
//       );

//     };

//   /* =========================
//       MUTACIÓN PRINCIPAL
//   ========================= */

//   const {
//     mutate:
//       confirmarVenta,

//     isPending,
//   } = useMutation({

//     mutationFn:
//       async () => {

//         /* =========================
//             VALIDACIONES
//         ========================= */

//         if (!comanda?._id) {

//           throw new Error(
//             "No se encontró el ID de la comanda"
//           );

//         }

//         if (!idCaja) {

//           throw new Error(
//             "Debe seleccionar una caja"
//           );

//         }

//         if (!idPerfil) {

//           throw new Error(
//             "No se encontró el perfil del usuario"
//           );

//         }

//         if (!idSucursal) {

//           throw new Error(
//             "No se encontró la sucursal"
//           );

//         }

//         if (
//           !comanda.detalles ||
//           comanda.detalles
//             .length === 0
//         ) {

//           throw new Error(
//             "La comanda no tiene productos"
//           );

//         }

//         if (
//           descuentoSeguro >
//           subtotal
//         ) {

//           throw new Error(
//             "El descuento no puede ser mayor al subtotal"
//           );

//         }

//         const detallesPreparados =
//           prepararDetalles();

//         /* =========================
//             1. CREAR VENTA
//         ========================= */

//         const respuestaVenta =
//           await createVenta({

//             idComanda:
//               comanda._id,

//             idCaja,

//             idPerfil,

//             idSucursal,

//             subtotal,

//             descuento:
//               descuentoSeguro,

//             metodoPago,

//             estado:
//               "pagado",

//             observacion:
//               observacion
//                 .trim() ||
//               comanda.observacion ||
//               "Venta registrada desde comanda",

//             creadoPor:
//               creadoPor ||
//               "sistema",

//           });

//         const idVentaCreada =
//           respuestaVenta
//             ?.venta
//             ?._id;

//         if (!idVentaCreada) {

//           throw new Error(
//             "El backend no devolvió el ID de la venta creada"
//           );

//         }

//         /* =========================
//             2. PREPARAR DETALLES
//             DE VENTA
//         ========================= */

//         const detallesVenta:
//           DetalleVentaForm[] =
//           detallesPreparados.map(
//             (
//               detalle
//             ) => ({

//               idVenta:
//                 String(
//                   idVentaCreada
//                 ),

//               idProducto:
//                 detalle.idProducto,

//               idInventario:
//                 detalle.idInventario,

//               idAlmacen:
//                 detalle.idAlmacen,

//               cantidad:
//                 detalle.cantidad,

//               precioUnitario:
//                 detalle.precioUnitario,

//               costoUnitario:
//                 detalle.costoUnitario,

//               subtotal:
//                 detalle.subtotal,

//               estado:
//                 "activo",

//               creadoPor:
//                 creadoPor ||
//                 "sistema",

//             })
//           );

//         /* =========================
//             3. CREAR DETALLES
//             UNO POR UNO
//         ========================= */

//         const detallesCreados:
//           unknown[] = [];

//         for (
//           const detalleVenta
//           of detallesVenta
//         ) {

//           const respuestaDetalle =
//             await createDetalleVenta(
//               detalleVenta
//             );

//           detallesCreados.push(
//             respuestaDetalle
//           );

//         }

//         /* =========================
//             4. MOVIMIENTO GENERAL
//             DE INGRESO POR VENTA
//         ========================= */

//         const movimientoVenta:
//           MovimientoForm = {

//           fecha:
//             new Date()
//               .toISOString(),

//           tipoMovimiento:
//             "venta",

//           origenMovimiento:
//             "venta",

//           modulo:
//             "venta",

//           idVenta:
//             String(
//               idVentaCreada
//             ),

//           idComanda:
//             comanda._id,

//           idSucursal,

//           idCaja,

//           idPerfil,

//           cantidad:
//             totalUnidades,

//           metodoPago,

//           montoEntrada:
//             total,

//           subtotal,

//           descuento:
//             descuentoSeguro,

//           total,

//           estado:
//             "pagado",

//           referenciaId:
//             String(
//               idVentaCreada
//             ),

//           referenciaModelo:
//             "Venta",

//           observacion:
//             observacion
//               .trim() ||
//             `Venta registrada desde la comanda ${
//               comanda
//                 .numeroComanda ||
//               comanda._id
//             }`,

//           creadoPor:
//             creadoPor ||
//             "sistema",

//         };

//         await createMovimiento(
//           movimientoVenta
//         );

//         /* =========================
//             5. MOVIMIENTO POR
//             CADA PRODUCTO
//         ========================= */

//         for (
//           const detalle
//           of detallesPreparados
//         ) {

//           const movimientoProducto:
//             MovimientoForm = {

//             fecha:
//               new Date()
//                 .toISOString(),

//             tipoMovimiento:
//               "salida_inventario",

//             origenMovimiento:
//               "venta",

//             modulo:
//               "inventario",

//             idVenta:
//               String(
//                 idVentaCreada
//               ),

//             idComanda:
//               comanda._id,

//             idSucursal,

//             idCaja,

//             idPerfil,

//             idAlmacen:
//               detalle.idAlmacen,

//             idInventario:
//               detalle.idInventario,

//             idProducto:
//               detalle.idProducto,

//             cantidad:
//               detalle.cantidad,

//             cantidadSalida:
//               detalle.cantidad,

//             precioUnitario:
//               detalle.precioUnitario,

//             costoUnitario:
//               detalle.costoUnitario,

//             subtotal:
//               detalle.subtotal,

//             total:
//               detalle.subtotal,

//             estado:
//               "activo",

//             referenciaId:
//               String(
//                 idVentaCreada
//               ),

//             referenciaModelo:
//               "Venta",

//             observacion:
//               `Salida por venta: ${detalle.nombreProducto}`,

//             creadoPor:
//               creadoPor ||
//               "sistema",

//           };

//           await createMovimiento(
//             movimientoProducto
//           );

//         }

//         /* =========================
//             6. ACTUALIZAR COMANDA
//         ========================= */

//         await updateComanda({

//           comandaId:
//             comanda._id,

//           formData: {

//             estado:
//               "impreso",

//             actualizadoPor:
//               creadoPor ||
//               "sistema",

//           },

//         });

//         return {
//           venta:
//             respuestaVenta.venta,

//           cantidadDetalles:
//             detallesCreados.length,

//           total,
//         };

//       },

//     /* =========================
//         ÉXITO
//     ========================= */

//     onSuccess:
//       async (
//         resultado
//       ) => {

//         await Swal.fire({

//           icon:
//             "success",

//           title:
//             "Venta confirmada",

//           html: `
//             <p>La venta fue registrada correctamente.</p>

//             <p style="margin-top: 10px;">
//               <strong>Detalles registrados:</strong>
//               ${resultado.cantidadDetalles}
//             </p>

//             <p>
//               <strong>Total:</strong>
//               Bs. ${Number(
//                 resultado.total
//               ).toFixed(2)}
//             </p>
//           `,

//           timer:
//             2500,

//           showConfirmButton:
//             false,

//         });

//         await queryClient
//           .invalidateQueries({

//             queryKey: [
//               "comandas-con-detalles",
//               idPerfil,
//             ],

//           });

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
//               "inventario-barra",
//               idSucursal,
//             ],

//           });

//         await queryClient
//           .invalidateQueries({

//             queryKey: [
//               "movimientos",
//             ],

//           });

//         setIdCaja("");

//         setMetodoPago(
//           "efectivo"
//         );

//         setDescuento(
//           0
//         );

//         setObservacion("");

//         onSuccess?.();

//         onClose();

//       },

//     /* =========================
//         ERROR
//     ========================= */

//     onError:
//       async (
//         error
//       ) => {

//         await Swal.fire({

//           icon:
//             "error",

//           title:
//             "No se pudo confirmar la venta",

//           text:
//             error instanceof Error
//               ? error.message
//               : "Ocurrió un error inesperado",

//         });

//       },

//   });

//   /* =========================
//       CERRAR MODAL
//   ========================= */

//   const cerrarModal = () => {

//     if (isPending) {
//       return;
//     }

//     onClose();

//   };

//   /* =========================
//       NO MOSTRAR
//   ========================= */

//   if (
//     !open ||
//     !comanda
//   ) {
//     return null;
//   }

//   return (

//     <div
//       className="
//         fixed
//         inset-0
//         z-[100]
//         flex
//         items-center
//         justify-center
//         bg-black/75
//         p-3
//         backdrop-blur-sm
//         sm:p-6
//       "
//     >

//       <div
//         className="
//           max-h-[95vh]
//           w-full
//           max-w-3xl
//           overflow-y-auto
//           rounded-3xl
//           border
//           border-fuchsia-500/30
//           bg-[#0B1120]
//           shadow-2xl
//           shadow-fuchsia-900/30
//         "
//       >

//         {/* =========================
//             HEADER
//         ========================= */}

//         <div
//           className="
//             sticky
//             top-0
//             z-10
//             flex
//             items-center
//             justify-between
//             border-b
//             border-fuchsia-500/20
//             bg-[#0B1120]/95
//             px-5
//             py-4
//             backdrop-blur-md
//             sm:px-7
//           "
//         >

//           <div className="flex items-center gap-3">

//             <div
//               className="
//                 flex
//                 h-12
//                 w-12
//                 items-center
//                 justify-center
//                 rounded-2xl
//                 bg-fuchsia-500/10
//               "
//             >

//               <ReceiptText className="h-6 w-6 text-fuchsia-400" />

//             </div>

//             <div>

//               <h2 className="text-xl font-black text-white sm:text-2xl">

//                 Confirmar venta

//               </h2>

//               <p className="text-sm text-slate-400">

//                 {comanda.numeroComanda ||
//                   "Comanda"}

//               </p>

//             </div>

//           </div>

//           <button
//             type="button"
//             onClick={cerrarModal}
//             disabled={isPending}
//             className="
//               rounded-xl
//               border
//               border-slate-700
//               bg-slate-900
//               p-2
//               text-slate-400
//               transition
//               hover:border-red-500
//               hover:text-red-400
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >

//             <X className="h-5 w-5" />

//           </button>

//         </div>

//         {/* =========================
//             CONTENIDO
//         ========================= */}

//         <div className="space-y-6 p-5 sm:p-7">

//           {/* RESUMEN */}

//           <div
//             className="
//               grid
//               gap-4
//               rounded-2xl
//               border
//               border-slate-700
//               bg-slate-950
//               p-5
//               sm:grid-cols-3
//             "
//           >

//             <div>

//               <p className="text-xs uppercase tracking-wider text-slate-500">

//                 Unidades

//               </p>

//               <p className="mt-1 text-2xl font-black text-white">

//                 {totalUnidades}

//               </p>

//             </div>

//             <div>

//               <p className="text-xs uppercase tracking-wider text-slate-500">

//                 Subtotal

//               </p>

//               <p className="mt-1 text-2xl font-black text-cyan-400">

//                 Bs.{" "}

//                 {subtotal.toFixed(
//                   2
//                 )}

//               </p>

//             </div>

//             <div>

//               <p className="text-xs uppercase tracking-wider text-slate-500">

//                 Total

//               </p>

//               <p className="mt-1 text-2xl font-black text-fuchsia-400">

//                 Bs.{" "}

//                 {total.toFixed(2)}

//               </p>

//             </div>

//           </div>

//           {/* =========================
//               CAJA
//           ========================= */}

//           <div>

//             <label
//               htmlFor="venta-idCaja"
//               className="mb-2 block text-sm font-bold text-slate-300"
//             >

//               Caja

//             </label>

//             <select
//               id="venta-idCaja"
//               value={idCaja}
//               onChange={(
//                 event
//               ) =>
//                 setIdCaja(
//                   event.target.value
//                 )
//               }
//               disabled={isPending}
//               className="
//                 w-full
//                 rounded-2xl
//                 border
//                 border-slate-700
//                 bg-slate-950
//                 px-4
//                 py-3
//                 text-white
//                 outline-none
//                 transition
//                 focus:border-fuchsia-500
//                 disabled:cursor-not-allowed
//                 disabled:opacity-60
//               "
//             >

//               <option value="">

//                 Seleccione una caja

//               </option>

//               {cajas
//                 .filter(
//                   (caja) =>
//                     caja.estado !==
//                     false
//                 )
//                 .map(
//                   (caja) => (

//                     <option
//                       key={
//                         caja._id
//                       }
//                       value={
//                         caja._id
//                       }
//                     >

//                       {caja.nombre ||
//                         "Caja"}

//                     </option>

//                   )
//                 )}

//             </select>

//           </div>

//           {/* =========================
//               MÉTODO DE PAGO
//           ========================= */}

//           <div>

//             <label className="mb-3 block text-sm font-bold text-slate-300">

//               Método de pago

//             </label>

//             <div className="grid gap-3 sm:grid-cols-2">

//               <button
//                 type="button"
//                 onClick={() =>
//                   setMetodoPago(
//                     "efectivo"
//                   )
//                 }
//                 disabled={isPending}
//                 className={`
//                   flex
//                   items-center
//                   justify-center
//                   gap-3
//                   rounded-2xl
//                   border
//                   px-4
//                   py-4
//                   font-black
//                   transition
//                   ${
//                     metodoPago ===
//                     "efectivo"
//                       ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
//                       : "border-slate-700 bg-slate-950 text-slate-400 hover:border-emerald-500/50"
//                   }
//                 `}
//               >

//                 <Banknote className="h-5 w-5" />

//                 Efectivo

//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setMetodoPago(
//                     "qr"
//                   )
//                 }
//                 disabled={isPending}
//                 className={`
//                   flex
//                   items-center
//                   justify-center
//                   gap-3
//                   rounded-2xl
//                   border
//                   px-4
//                   py-4
//                   font-black
//                   transition
//                   ${
//                     metodoPago ===
//                     "qr"
//                       ? "border-cyan-500 bg-cyan-500/15 text-cyan-400"
//                       : "border-slate-700 bg-slate-950 text-slate-400 hover:border-cyan-500/50"
//                   }
//                 `}
//               >

//                 <Smartphone className="h-5 w-5" />

//                 QR

//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setMetodoPago(
//                     "transferencia"
//                   )
//                 }
//                 disabled={isPending}
//                 className={`
//                   flex
//                   items-center
//                   justify-center
//                   gap-3
//                   rounded-2xl
//                   border
//                   px-4
//                   py-4
//                   font-black
//                   transition
//                   ${
//                     metodoPago ===
//                     "transferencia"
//                       ? "border-blue-500 bg-blue-500/15 text-blue-400"
//                       : "border-slate-700 bg-slate-950 text-slate-400 hover:border-blue-500/50"
//                   }
//                 `}
//               >

//                 <CreditCard className="h-5 w-5" />

//                 Transferencia

//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setMetodoPago(
//                     "mixto"
//                   )
//                 }
//                 disabled={isPending}
//                 className={`
//                   flex
//                   items-center
//                   justify-center
//                   gap-3
//                   rounded-2xl
//                   border
//                   px-4
//                   py-4
//                   font-black
//                   transition
//                   ${
//                     metodoPago ===
//                     "mixto"
//                       ? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-400"
//                       : "border-slate-700 bg-slate-950 text-slate-400 hover:border-fuchsia-500/50"
//                   }
//                 `}
//               >

//                 <CreditCard className="h-5 w-5" />

//                 Mixto

//               </button>

//             </div>

//           </div>

//           {/* =========================
//               DESCUENTO
//           ========================= */}

//           <div>

//             <label
//               htmlFor="venta-descuento"
//               className="mb-2 block text-sm font-bold text-slate-300"
//             >

//               Descuento (Bs.)

//             </label>

//             <input
//               id="venta-descuento"
//               type="number"
//               min={0}
//               max={subtotal}
//               step="0.01"
//               value={descuento}
//               onChange={(
//                 event
//               ) => {

//                 const valor =
//                   Number(
//                     event.target
//                       .value
//                   );

//                 setDescuento(
//                   Number.isFinite(
//                     valor
//                   )
//                     ? valor
//                     : 0
//                 );

//               }}
//               disabled={isPending}
//               className="
//                 w-full
//                 rounded-2xl
//                 border
//                 border-slate-700
//                 bg-slate-950
//                 px-4
//                 py-3
//                 text-white
//                 outline-none
//                 transition
//                 focus:border-fuchsia-500
//                 disabled:opacity-60
//               "
//             />

//           </div>

//           {/* =========================
//               OBSERVACIÓN
//           ========================= */}

//           <div>

//             <label
//               htmlFor="venta-observacion"
//               className="mb-2 block text-sm font-bold text-slate-300"
//             >

//               Observación

//             </label>

//             <textarea
//               id="venta-observacion"
//               value={observacion}
//               onChange={(
//                 event
//               ) =>
//                 setObservacion(
//                   event.target.value
//                 )
//               }
//               disabled={isPending}
//               rows={3}
//               maxLength={200}
//               placeholder="Observación de la venta..."
//               className="
//                 w-full
//                 resize-none
//                 rounded-2xl
//                 border
//                 border-slate-700
//                 bg-slate-950
//                 px-4
//                 py-3
//                 text-white
//                 outline-none
//                 transition
//                 focus:border-fuchsia-500
//                 disabled:opacity-60
//               "
//             />

//           </div>

//           {/* =========================
//               TOTAL FINAL
//           ========================= */}

//           <div
//             className="
//               flex
//               items-center
//               justify-between
//               rounded-2xl
//               border
//               border-fuchsia-500/30
//               bg-fuchsia-500/10
//               p-5
//             "
//           >

//             <div>

//               <p className="text-sm font-bold text-slate-400">

//                 Total a pagar

//               </p>

//               {descuentoSeguro >
//                 0 && (

//                 <p className="text-xs text-emerald-400">

//                   Descuento: Bs.{" "}

//                   {descuentoSeguro
//                     .toFixed(2)}

//                 </p>

//               )}

//             </div>

//             <p className="text-3xl font-black text-fuchsia-400">

//               Bs.{" "}

//               {total.toFixed(2)}

//             </p>

//           </div>

//         </div>

//         {/* =========================
//             FOOTER
//         ========================= */}

//         <div
//           className="
//             sticky
//             bottom-0
//             flex
//             flex-col-reverse
//             gap-3
//             border-t
//             border-fuchsia-500/20
//             bg-[#0B1120]/95
//             p-5
//             backdrop-blur-md
//             sm:flex-row
//             sm:justify-end
//             sm:px-7
//           "
//         >

//           <button
//             type="button"
//             onClick={cerrarModal}
//             disabled={isPending}
//             className="
//               rounded-2xl
//               border
//               border-slate-700
//               px-6
//               py-3
//               font-black
//               text-slate-300
//               transition
//               hover:bg-slate-800
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >

//             Cancelar

//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               confirmarVenta()
//             }
//             disabled={
//               isPending ||
//               !idCaja ||
//               comanda.detalles
//                 .length === 0
//             }
//             className="
//               inline-flex
//               items-center
//               justify-center
//               gap-2
//               rounded-2xl
//               bg-fuchsia-600
//               px-7
//               py-3
//               font-black
//               text-white
//               transition
//               hover:bg-fuchsia-700
//               disabled:cursor-not-allowed
//               disabled:bg-slate-700
//               disabled:text-slate-400
//             "
//           >

//             {isPending ? (

//               <>

//                 <LoaderCircle className="h-5 w-5 animate-spin" />

//                 Confirmando...

//               </>

//             ) : (

//               <>

//                 <Printer className="h-5 w-5" />

//                 Confirmar e imprimir

//               </>

//             )}

//           </button>

//         </div>

//       </div>

//     </div>

//   );

// }


// src/components/venta/VentaModal.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Banknote,
  CreditCard,
  LoaderCircle,
  Printer,
  ReceiptText,
  Smartphone,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  createVenta,
} from "@/api/VentaApi";

import {
  createDetalleVenta,
} from "@/api/DetalleVentaApi";

import {
  createMovimiento,
} from "@/api/MovimientoApi";

import {
  updateComanda,
} from "@/api/ComandaApi";

import {
  getAperturasActivasBySucursal,
} from "@/api/AperturaCajaApi";

import type {
  ComandaConDetalleType,
  DetalleDentroComandaType,
} from "@/types/ComandaType";

import type {
  DetalleVentaForm,
} from "@/types/DetalleVentaType";

import type {
  MetodoPagoVenta,
} from "@/types/VentaType";

import type {
  MovimientoForm,
} from "@/types/MovimientoType";

import type {
  AperturaCajaActivaType,
} from "@/types/AperturaCajaType";

/* =========================
    TIPO CAJA
========================= */

type CajaOption = {
  _id: string;
  nombre?: string | null;
  descripcion?: string | null;
  estado?: boolean;
};

type CajaConAperturaOption = {
  _id: string;
  nombre: string;
  descripcion?: string;
  idAperturaCaja: string;
  fechaApertura: string;
};

/* =========================
    PROPS
========================= */

type VentaModalProps = {
  open: boolean;
  onClose: () => void;
  comanda: ComandaConDetalleType | null;
  cajas: CajaOption[];
  idPerfil: string;
  idSucursal: string;
  creadoPor: string;
  onSuccess?: () => void;
};

/* =========================
    DETALLE PREPARADO
========================= */

type DetallePreparado = {
  idProducto: string;
  idInventario: string;
  idAlmacen: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  costoUnitario: number;
  subtotal: number;
};

/* =========================
    OBTENER ID DE RELACIÓN
========================= */

function obtenerIdRelacion(
  relacion:
    | string
    | Record<string, unknown>
    | null
    | undefined
): string {
  if (typeof relacion === "string") {
    return relacion;
  }

  if (
    relacion &&
    typeof relacion === "object" &&
    "_id" in relacion
  ) {
    const id = relacion._id;

    return typeof id === "string"
      ? id
      : "";
  }

  return "";
}

/* =========================
    OBTENER PRODUCTO
========================= */

function obtenerProducto(
  detalle: DetalleDentroComandaType
) {
  if (
    detalle.producto &&
    typeof detalle.producto === "object"
  ) {
    return detalle.producto;
  }

  if (
    detalle.idProducto &&
    typeof detalle.idProducto === "object"
  ) {
    return detalle.idProducto;
  }

  return null;
}

/* =========================
    OBTENER INVENTARIO
========================= */

function obtenerInventario(
  detalle: DetalleDentroComandaType
) {
  if (
    detalle.idInventario &&
    typeof detalle.idInventario === "object"
  ) {
    return detalle.idInventario;
  }

  return null;
}

/* =========================
    COMPONENTE
========================= */

export default function VentaModal({
  open,
  onClose,
  comanda,
  cajas,
  idPerfil,
  idSucursal,
  creadoPor,
  onSuccess,
}: VentaModalProps) {
  const queryClient = useQueryClient();

  /* =========================
      ESTADOS
  ========================= */

  const [
    idCaja,
    setIdCaja,
  ] = useState("");

  const [
    metodoPago,
    setMetodoPago,
  ] = useState<MetodoPagoVenta>(
    "efectivo"
  );

  const [
    descuento,
    setDescuento,
  ] = useState<number>(0);

  const [
    observacion,
    setObservacion,
  ] = useState("");

  /* =========================
      CAJAS CON APERTURA ACTIVA
  ========================= */

  const {
    data: aperturasActivas = [],
    isLoading: cargandoAperturasActivas,
    isFetching: actualizandoAperturasActivas,
  } = useQuery({
    queryKey: [
      "aperturas-activas-sucursal",
      idSucursal,
    ],
    queryFn: () =>
      getAperturasActivasBySucursal(
        idSucursal
      ),
    enabled:
      Boolean(open) &&
      Boolean(idSucursal),
  });

  const cajasConApertura =
    useMemo(() => {
      return aperturasActivas
        .map(
          (
            apertura: AperturaCajaActivaType
          ) => {
            const caja =
              apertura.idCaja;

            if (!caja) {
              return null;
            }

            if (
              typeof caja === "string"
            ) {
              return {
                _id: caja,
                nombre: "Caja abierta",
                descripcion: "",
                idAperturaCaja: String(
                  apertura._id || ""
                ),
                fechaApertura:
                  apertura.fechaApertura,
              };
            }

            return {
              _id: String(caja._id),
              nombre:
                caja.nombre ||
                caja.descripcion ||
                "Caja sin nombre",
              descripcion:
                caja.descripcion || "",
              idAperturaCaja: String(
                apertura._id || ""
              ),
              fechaApertura:
                apertura.fechaApertura,
            };
          }
        )
        .filter(Boolean) as CajaConAperturaOption[];
    }, [
      aperturasActivas,
    ]);

  const cargandoCajas =
    cargandoAperturasActivas ||
    actualizandoAperturasActivas;

  /* =========================
      INICIALIZAR MODAL
  ========================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const primeraCajaConApertura =
      cajasConApertura[0];

    setIdCaja(
      primeraCajaConApertura?._id ||
      ""
    );

    setMetodoPago(
      "efectivo"
    );

    setDescuento(
      0
    );

    setObservacion(
      comanda?.observacion ||
      ""
    );
  }, [
    open,
    cajasConApertura,
    comanda,
  ]);

  /* =========================
      SUBTOTAL
  ========================= */

  const subtotal =
    useMemo(() => {
      if (!comanda) {
        return 0;
      }

      return comanda.detalles.reduce(
        (
          acumulado,
          detalle
        ) => {
          const cantidad =
            Number(
              detalle.cantidad ||
              0
            );

          const precioUnitario =
            Number(
              detalle.precioUnitario ||
              0
            );

          const subtotalGuardado =
            Number(
              detalle.subtotal
            );

          const subtotalDetalle =
            Number.isFinite(
              subtotalGuardado
            )
              ? subtotalGuardado
              : cantidad *
                precioUnitario;

          return (
            acumulado +
            subtotalDetalle
          );
        },
        0
      );
    }, [
      comanda,
    ]);

  /* =========================
      DESCUENTO SEGURO
  ========================= */

  const descuentoSeguro =
    Math.min(
      Math.max(
        Number(
          descuento ||
          0
        ),
        0
      ),
      subtotal
    );

  /* =========================
      TOTAL
  ========================= */

  const total =
    Math.max(
      subtotal -
      descuentoSeguro,
      0
    );

  /* =========================
      TOTAL DE UNIDADES
  ========================= */

  const totalUnidades =
    useMemo(() => {
      if (!comanda) {
        return 0;
      }

      return comanda.detalles.reduce(
        (
          acumulado,
          detalle
        ) =>
          acumulado +
          Number(
            detalle.cantidad ||
            0
          ),
        0
      );
    }, [
      comanda,
    ]);

  /* =========================
      PREPARAR DETALLES
  ========================= */

  const prepararDetalles =
    (): DetallePreparado[] => {
      if (!comanda) {
        return [];
      }

      return comanda.detalles.map(
        (
          detalle,
          index
        ) => {
          const producto =
            obtenerProducto(
              detalle
            );

          const inventario =
            obtenerInventario(
              detalle
            );

          const idProducto =
            obtenerIdRelacion(
              detalle.idProducto
            ) ||
            producto?._id ||
            "";

          const idInventario =
            obtenerIdRelacion(
              detalle.idInventario
            );

          const idAlmacen =
            obtenerIdRelacion(
              detalle.idAlmacen
            ) ||
            obtenerIdRelacion(
              inventario?.idAlmacen
            );

          const cantidad =
            Number(
              detalle.cantidad
            );

          const precioUnitario =
            Number(
              detalle.precioUnitario
            );

          const costoUnitario =
            Number(
              inventario?.costoUnitario ||
              0
            );

          const nombreProducto =
            producto?.nombre ||
            `Producto ${index + 1}`;

          if (!idProducto) {
            throw new Error(
              `${nombreProducto} no tiene un ID de producto válido`
            );
          }

          if (!idInventario) {
            throw new Error(
              `${nombreProducto} no tiene inventario asociado`
            );
          }

          if (!idAlmacen) {
            throw new Error(
              `${nombreProducto} no tiene almacén asociado`
            );
          }

          if (
            !Number.isFinite(cantidad) ||
            cantidad <= 0
          ) {
            throw new Error(
              `La cantidad de ${nombreProducto} no es válida`
            );
          }

          if (
            !Number.isFinite(precioUnitario) ||
            precioUnitario < 0
          ) {
            throw new Error(
              `El precio de ${nombreProducto} no es válido`
            );
          }

          return {
            idProducto,
            idInventario,
            idAlmacen,
            nombreProducto,
            cantidad,
            precioUnitario,
            costoUnitario,
            subtotal:
              cantidad *
              precioUnitario,
          };
        }
      );
    };

  /* =========================
      MUTACIÓN PRINCIPAL
  ========================= */

  const {
    mutate: confirmarVenta,
    isPending,
  } = useMutation({
    mutationFn:
      async () => {
        if (!comanda?._id) {
          throw new Error(
            "No se encontró el ID de la comanda"
          );
        }

        if (!idCaja) {
          throw new Error(
            "Debe seleccionar una caja con apertura activa"
          );
        }

        if (
          cajasConApertura.length === 0
        ) {
          throw new Error(
            "No existen cajas abiertas para esta sucursal"
          );
        }

        if (!idPerfil) {
          throw new Error(
            "No se encontró el perfil del usuario"
          );
        }

        if (!idSucursal) {
          throw new Error(
            "No se encontró la sucursal"
          );
        }

        if (
          !comanda.detalles ||
          comanda.detalles.length === 0
        ) {
          throw new Error(
            "La comanda no tiene productos"
          );
        }

        if (
          descuentoSeguro >
          subtotal
        ) {
          throw new Error(
            "El descuento no puede ser mayor al subtotal"
          );
        }

        const detallesPreparados =
          prepararDetalles();

        const respuestaVenta =
          await createVenta({
            idComanda:
              comanda._id,
            idCaja,
            idPerfil,
            idSucursal,
            subtotal,
            descuento:
              descuentoSeguro,
            metodoPago,
            estado:
              "pagado",
            observacion:
              observacion.trim() ||
              comanda.observacion ||
              "Venta registrada desde comanda",
            creadoPor:
              creadoPor ||
              "sistema",
          });

        const idVentaCreada =
          respuestaVenta?.venta?._id;

        if (!idVentaCreada) {
          throw new Error(
            "El backend no devolvió el ID de la venta creada"
          );
        }

        const detallesVenta:
          DetalleVentaForm[] =
          detallesPreparados.map(
            (
              detalle
            ) => ({
              idVenta:
                String(idVentaCreada),
              idProducto:
                detalle.idProducto,
              idInventario:
                detalle.idInventario,
              idAlmacen:
                detalle.idAlmacen,
              cantidad:
                detalle.cantidad,
              precioUnitario:
                detalle.precioUnitario,
              costoUnitario:
                detalle.costoUnitario,
              subtotal:
                detalle.subtotal,
              estado:
                "activo",
              creadoPor:
                creadoPor ||
                "sistema",
            })
          );

        const detallesCreados:
          unknown[] = [];

        for (
          const detalleVenta
          of detallesVenta
        ) {
          const respuestaDetalle =
            await createDetalleVenta(
              detalleVenta
            );

          detallesCreados.push(
            respuestaDetalle
          );
        }

        const movimientoVenta:
          MovimientoForm = {
          fecha:
            new Date().toISOString(),
          tipoMovimiento:
            "venta",
          origenMovimiento:
            "venta",
          modulo:
            "venta",
          idVenta:
            String(idVentaCreada),
          idComanda:
            comanda._id,
          idSucursal,
          idCaja,
          idPerfil,
          cantidad:
            totalUnidades,
          metodoPago,
          montoEntrada:
            total,
          subtotal,
          descuento:
            descuentoSeguro,
          total,
          estado:
            "pagado",
          referenciaId:
            String(idVentaCreada),
          referenciaModelo:
            "Venta",
          observacion:
            observacion.trim() ||
            `Venta registrada desde la comanda ${
              comanda.numeroComanda ||
              comanda._id
            }`,
          creadoPor:
            creadoPor ||
            "sistema",
        };

        await createMovimiento(
          movimientoVenta
        );

        for (
          const detalle
          of detallesPreparados
        ) {
          const movimientoProducto:
            MovimientoForm = {
            fecha:
              new Date().toISOString(),
            tipoMovimiento:
              "salida_inventario",
            origenMovimiento:
              "venta",
            modulo:
              "inventario",
            idVenta:
              String(idVentaCreada),
            idComanda:
              comanda._id,
            idSucursal,
            idCaja,
            idPerfil,
            idAlmacen:
              detalle.idAlmacen,
            idInventario:
              detalle.idInventario,
            idProducto:
              detalle.idProducto,
            cantidad:
              detalle.cantidad,
            cantidadSalida:
              detalle.cantidad,
            precioUnitario:
              detalle.precioUnitario,
            costoUnitario:
              detalle.costoUnitario,
            subtotal:
              detalle.subtotal,
            total:
              detalle.subtotal,
            estado:
              "activo",
            referenciaId:
              String(idVentaCreada),
            referenciaModelo:
              "Venta",
            observacion:
              `Salida por venta: ${detalle.nombreProducto}`,
            creadoPor:
              creadoPor ||
              "sistema",
          };

          await createMovimiento(
            movimientoProducto
          );
        }

        await updateComanda({
          comandaId:
            comanda._id,
          formData: {
            estado:
              "impreso",
            actualizadoPor:
              creadoPor ||
              "sistema",
          },
        });

        return {
          venta:
            respuestaVenta.venta,
          cantidadDetalles:
            detallesCreados.length,
          total,
        };
      },

    onSuccess:
      async (
        resultado
      ) => {
        await Swal.fire({
          icon:
            "success",
          title:
            "Venta confirmada",
          html: `
            <p>La venta fue registrada correctamente.</p>

            <p style="margin-top: 10px;">
              <strong>Detalles registrados:</strong>
              ${resultado.cantidadDetalles}
            </p>

            <p>
              <strong>Total:</strong>
              Bs. ${Number(
                resultado.total
              ).toFixed(2)}
            </p>
          `,
          timer:
            2500,
          showConfirmButton:
            false,
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "comandas-con-detalles",
            idPerfil,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "ventas-con-detalles",
            idPerfil,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "inventario-barra",
            idSucursal,
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "movimientos",
          ],
        });

        await queryClient.invalidateQueries({
          queryKey: [
            "aperturas-activas-sucursal",
            idSucursal,
          ],
        });

        setIdCaja("");
        setMetodoPago("efectivo");
        setDescuento(0);
        setObservacion("");

        onSuccess?.();
        onClose();
      },

    onError:
      async (
        error
      ) => {
        await Swal.fire({
          icon:
            "error",
          title:
            "No se pudo confirmar la venta",
          text:
            error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado",
        });
      },
  });

  const cerrarModal = () => {
    if (isPending) {
      return;
    }

    onClose();
  };

  if (
    !open ||
    !comanda
  ) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/75
        p-3
        backdrop-blur-sm
        sm:p-6
      "
    >
      <div
        className="
          max-h-[95vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-3xl
          border
          border-fuchsia-500/30
          bg-[#0B1120]
          shadow-2xl
          shadow-fuchsia-900/30
        "
      >
        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-fuchsia-500/20
            bg-[#0B1120]/95
            px-5
            py-4
            backdrop-blur-md
            sm:px-7
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-fuchsia-500/10
              "
            >
              <ReceiptText className="h-6 w-6 text-fuchsia-400" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white sm:text-2xl">
                Confirmar venta
              </h2>

              <p className="text-sm text-slate-400">
                {comanda.numeroComanda ||
                  "Comanda"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={cerrarModal}
            disabled={isPending}
            className="
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              p-2
              text-slate-400
              transition
              hover:border-red-500
              hover:text-red-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div
            className="
              grid
              gap-4
              rounded-2xl
              border
              border-slate-700
              bg-slate-950
              p-5
              sm:grid-cols-3
            "
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Unidades
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {totalUnidades}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Subtotal
              </p>

              <p className="mt-1 text-2xl font-black text-cyan-400">
                Bs. {subtotal.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Total
              </p>

              <p className="mt-1 text-2xl font-black text-fuchsia-400">
                Bs. {total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* =========================
              CAJA
          ========================= */}

          <div>
            <label
              htmlFor="venta-idCaja"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Caja
            </label>

            {cargandoCajas ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400">
                Cargando cajas abiertas...
              </div>
            ) : cajasConApertura.length === 0 ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                No hay cajas abiertas para esta sucursal.
              </div>
            ) : (
              <select
                id="venta-idCaja"
                value={idCaja}
                onChange={(event) =>
                  setIdCaja(
                    event.target.value
                  )
                }
                disabled={isPending}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  text-white
                  outline-none
                  transition
                  focus:border-fuchsia-500
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <option value="">
                  Seleccione una caja abierta
                </option>

                {cajasConApertura.map(
                  (caja) => (
                    <option
                      key={caja.idAperturaCaja}
                      value={caja._id}
                    >
                      {caja.nombre} — Apertura:{" "}
                      {new Date(
                        caja.fechaApertura
                      ).toLocaleString("es-BO")}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* =========================
              MÉTODO DE PAGO
          ========================= */}

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-300">
              Método de pago
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setMetodoPago("efectivo")
                }
                disabled={isPending}
                className={`
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  px-4
                  py-4
                  font-black
                  transition
                  ${
                    metodoPago === "efectivo"
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                      : "border-slate-700 bg-slate-950 text-slate-400 hover:border-emerald-500/50"
                  }
                `}
              >
                <Banknote className="h-5 w-5" />
                Efectivo
              </button>

              <button
                type="button"
                onClick={() =>
                  setMetodoPago("qr")
                }
                disabled={isPending}
                className={`
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  px-4
                  py-4
                  font-black
                  transition
                  ${
                    metodoPago === "qr"
                      ? "border-cyan-500 bg-cyan-500/15 text-cyan-400"
                      : "border-slate-700 bg-slate-950 text-slate-400 hover:border-cyan-500/50"
                  }
                `}
              >
                <Smartphone className="h-5 w-5" />
                QR
              </button>

              <button
                type="button"
                onClick={() =>
                  setMetodoPago("transferencia")
                }
                disabled={isPending}
                className={`
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  px-4
                  py-4
                  font-black
                  transition
                  ${
                    metodoPago === "transferencia"
                      ? "border-blue-500 bg-blue-500/15 text-blue-400"
                      : "border-slate-700 bg-slate-950 text-slate-400 hover:border-blue-500/50"
                  }
                `}
              >
                <CreditCard className="h-5 w-5" />
                Transferencia
              </button>

              <button
                type="button"
                onClick={() =>
                  setMetodoPago("mixto")
                }
                disabled={isPending}
                className={`
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  px-4
                  py-4
                  font-black
                  transition
                  ${
                    metodoPago === "mixto"
                      ? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-400"
                      : "border-slate-700 bg-slate-950 text-slate-400 hover:border-fuchsia-500/50"
                  }
                `}
              >
                <CreditCard className="h-5 w-5" />
                Mixto
              </button>
            </div>
          </div>

          {/* =========================
              DESCUENTO
          ========================= */}

          <div>
            <label
              htmlFor="venta-descuento"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Descuento (Bs.)
            </label>

            <input
              id="venta-descuento"
              type="number"
              min={0}
              max={subtotal}
              step="0.01"
              value={descuento}
              onChange={(event) => {
                const valor =
                  Number(
                    event.target.value
                  );

                setDescuento(
                  Number.isFinite(valor)
                    ? valor
                    : 0
                );
              }}
              disabled={isPending}
              className="
                w-full
                rounded-2xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-fuchsia-500
                disabled:opacity-60
              "
            />
          </div>

          {/* =========================
              OBSERVACIÓN
          ========================= */}

          <div>
            <label
              htmlFor="venta-observacion"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Observación
            </label>

            <textarea
              id="venta-observacion"
              value={observacion}
              onChange={(event) =>
                setObservacion(
                  event.target.value
                )
              }
              disabled={isPending}
              rows={3}
              maxLength={200}
              placeholder="Observación de la venta..."
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-fuchsia-500
                disabled:opacity-60
              "
            />
          </div>

          {/* =========================
              TOTAL FINAL
          ========================= */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-fuchsia-500/30
              bg-fuchsia-500/10
              p-5
            "
          >
            <div>
              <p className="text-sm font-bold text-slate-400">
                Total a pagar
              </p>

              {descuentoSeguro > 0 && (
                <p className="text-xs text-emerald-400">
                  Descuento: Bs. {descuentoSeguro.toFixed(2)}
                </p>
              )}
            </div>

            <p className="text-3xl font-black text-fuchsia-400">
              Bs. {total.toFixed(2)}
            </p>
          </div>
        </div>

        <div
          className="
            sticky
            bottom-0
            flex
            flex-col-reverse
            gap-3
            border-t
            border-fuchsia-500/20
            bg-[#0B1120]/95
            p-5
            backdrop-blur-md
            sm:flex-row
            sm:justify-end
            sm:px-7
          "
        >
          <button
            type="button"
            onClick={cerrarModal}
            disabled={isPending}
            className="
              rounded-2xl
              border
              border-slate-700
              px-6
              py-3
              font-black
              text-slate-300
              transition
              hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() =>
              confirmarVenta()
            }
            disabled={
              isPending ||
              cargandoCajas ||
              !idCaja ||
              cajasConApertura.length === 0 ||
              comanda.detalles.length === 0
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-fuchsia-600
              px-7
              py-3
              font-black
              text-white
              transition
              hover:bg-fuchsia-700
              disabled:cursor-not-allowed
              disabled:bg-slate-700
              disabled:text-slate-400
            "
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <Printer className="h-5 w-5" />
                Confirmar e imprimir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}