// // // src/views/almacen/AlmacenDetailView.tsx

// // import {
// //   useMemo,
// //   useState,
// // } from "react";

// // import {
// //   Link,
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

// // import Swal from "sweetalert2";

// // import MenuList from "@/components/MenuList";

// // import {

// //   deleteAlmacenById,

// //   getAlmacenes,

// // } from "@/api/AlmacenApi";

// // import {

// //   Eye,

// //   Pencil,

// //   Plus,

// //   Search,

// //   Trash2,

// //   Warehouse,

// //   Building2,

// //   MapPin,

// // } from "lucide-react";

// // import AlmacenDetailModal from "@/components/almacen/AlmacenDetailModal";
// // import { getSucursalById } from "@/api/SucursalApi";
// // import type { SucursalType } from "@/types/SucursalType";

// // export default function AlmacenDetailView() {

// //   const queryClient =
// //     useQueryClient();

// //   const params =
// //     useParams();

// //   /* =========================
// //       SUCURSAL ID
// //   ========================= */

// //   const sucursalId =
// //     params.sucursalId!;

// //       const  datasucursal = useQuery<SucursalType>({
// //         queryKey: ['sucursal', sucursalId],
// //         queryFn: () => getSucursalById(sucursalId),
// //         retry: false
// //       })
// //   /* =========================
// //       STATES
// //   ========================= */

// //   const [search, setSearch] =
// //     useState("");

// //   /* =========================
// //       GET ALMACENES
// //   ========================= */

// //   const {
// //     data,
// //     isLoading,
// //   } = useQuery({

// //     queryKey: [
// //       "almacenes"
// //     ],

// //     queryFn:
// //       getAlmacenes,

// //   });

// //   /* =========================
// //       FILTRAR POR SUCURSAL
// //   ========================= */

// //   const almacenesSucursal =
// //     useMemo(() => {

// //       if (!data)
// //         return [];

// //       return data.filter(
// //         (almacen) => {

// //           const id =

// //             typeof almacen.idSucursal ===
// //             "string"

// //               ? almacen.idSucursal

// //               : almacen.idSucursal?._id;

// //           return id === sucursalId;

// //         }
// //       );

// //     }, [data, sucursalId]);

// //   /* =========================
// //       BUSCADOR
// //   ========================= */

// //   const filteredAlmacenes =
// //     useMemo(() => {

// //       return almacenesSucursal.filter(
// //         (almacen) =>

// //           almacen.nombre
// //             .toLowerCase()
// //             .includes(
// //               search.toLowerCase()
// //             )

// //       );

// //     }, [

// //       almacenesSucursal,

// //       search,

// //     ]);

// //   /* =========================
// //       DELETE
// //   ========================= */

// //   const { mutate } =
// //     useMutation({

// //       mutationFn:
// //         deleteAlmacenById,

// //       onSuccess: async (
// //         data
// //       ) => {

// //         await Swal.fire({

// //           icon: "success",

// //           title: data,

// //           timer: 2000,

// //           showConfirmButton: false,

// //         });

// //         queryClient.invalidateQueries({

// //           queryKey: [
// //             "almacenes"
// //           ],

// //         });

// //       },

// //       onError: async (
// //         error: any
// //       ) => {

// //         await Swal.fire({

// //           icon: "error",

// //           title:
// //             error.message,

// //         });

// //       },

// //     });

// //   /* =========================
// //       LOADING
// //   ========================= */

// //   if (isLoading) {

// //     return (

// //       <div className="flex h-screen items-center justify-center bg-slate-50">

// //         <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>

// //       </div>

// //     );

// //   }

// //   return (

// //     <div className="flex h-screen overflow-hidden bg-slate-50">

// //       {/* SIDEBAR */}
// //       <MenuList />

// //       {/* CONTENIDO */}
// //       <main className="flex-1 overflow-y-auto p-6 md:p-8">

// //         {/* HEADER */}
// //         <motion.div

// //           initial={{
// //             opacity: 0,
// //             y: -25,
// //           }}

// //           animate={{
// //             opacity: 1,
// //             y: 0,
// //           }}

// //           transition={{
// //             duration: 0.4,
// //           }}

// //           className="
// //             mb-6
// //             rounded-3xl
// //             border
// //             border-slate-200
// //             bg-white
// //             p-6
// //             shadow-sm
// //           "
// //         >

// //           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

// //             <div>

// //               <h1 className="text-3xl font-black text-slate-800">
// //                 Almacenes.    {datasucursal.data?.nombreSucursal}
// //               </h1>

// //               <p className="mt-2 text-slate-500">
// //                 Gestión de almacenes por sucursal
// //               </p>

// //             </div>

// //             {/* NUEVO */}
// //             <Link
// //               to={`/sucursal/${sucursalId}/almacen/create`}
// //               className="
// //                 flex
// //                 items-center
// //                 gap-2
// //                 rounded-2xl
// //                 bg-gradient-to-r
// //                 from-fuchsia-600
// //                 to-purple-600
// //                 px-5
// //                 py-3
// //                 text-sm
// //                 font-semibold
// //                 text-white
// //                 shadow-lg
// //                 transition
// //                 hover:scale-105
// //               "
// //             >

// //               <Plus className="h-5 w-5" />

// //               Nuevo Almacén

// //             </Link>

// //           </div>

// //         </motion.div>

// //         {/* RESUMEN */}
// //         <motion.div

// //           initial={{
// //             opacity: 0,
// //           }}

// //           animate={{
// //             opacity: 1,
// //           }}

// //           className="
// //             mb-6
// //             rounded-3xl
// //             border
// //             border-slate-200
// //             bg-white
// //             p-5
// //             shadow-sm
// //           "
// //         >

// //           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

// //             {/* STATS */}
// //             <div className="flex flex-wrap gap-8">

// //               <div>

// //                 <p className="text-xs uppercase text-slate-500">
// //                   Total
// //                 </p>

// //                 <p className="text-3xl font-black text-slate-800">

// //                   {almacenesSucursal.length}

// //                 </p>

// //               </div>

// //               <div>

// //                 <p className="text-xs uppercase text-slate-500">
// //                   Activos
// //                 </p>

// //                 <p className="text-3xl font-black text-emerald-600">

// //                   {
// //                     almacenesSucursal.filter(
// //                       (a) => a.estado
// //                     ).length
// //                   }

// //                 </p>

// //               </div>

// //               <div>

// //                 <p className="text-xs uppercase text-slate-500">
// //                   Inactivos
// //                 </p>

// //                 <p className="text-3xl font-black text-red-500">

// //                   {
// //                     almacenesSucursal.filter(
// //                       (a) => !a.estado
// //                     ).length
// //                   }

// //                 </p>

// //               </div>

// //             </div>

// //             {/* SEARCH */}
// //             <div className="relative w-full max-w-md">

// //               <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

// //               <input
// //                 type="text"
// //                 placeholder="Buscar almacén..."
// //                 value={search}
// //                 onChange={(e) =>
// //                   setSearch(
// //                     e.target.value
// //                   )
// //                 }
// //                 className="
// //                   w-full
// //                   rounded-2xl
// //                   border
// //                   border-slate-300
// //                   bg-white
// //                   py-3
// //                   pl-10
// //                   pr-4
// //                   text-sm
// //                   focus:border-fuchsia-500
// //                   focus:outline-none
// //                 "
// //               />

// //             </div>

// //           </div>

// //         </motion.div>

// //         {/* TABLA */}
// //         <motion.div

// //           initial={{
// //             opacity: 0,
// //             y: 20,
// //           }}

// //           animate={{
// //             opacity: 1,
// //             y: 0,
// //           }}

// //           transition={{
// //             duration: 0.4,
// //           }}

// //           className="
// //             overflow-hidden
// //             rounded-3xl
// //             border
// //             border-slate-200
// //             bg-white
// //             shadow-sm
// //           "
// //         >

// //           <div className="overflow-x-auto">

// //             <table className="min-w-full">

// //               {/* HEADER */}
// //               <thead className="bg-slate-100">

// //                 <tr>

// //                   <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
// //                     Almacén
// //                   </th>

// //                   <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
// //                     Tipo
// //                   </th>

                 

// //                   <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
// //                     Estado
// //                   </th>

// //                   <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
// //                     Acciones
// //                   </th>

// //                 </tr>

// //               </thead>

// //               {/* BODY */}
// //               <tbody className="divide-y divide-slate-100">

// //                 {filteredAlmacenes.map((almacen) => (

// //                   <tr
// //                     key={almacen._id}
// //                     className="transition hover:bg-slate-50"
// //                   >

// //                     {/* ALMACEN */}
// //                     <td className="px-6 py-5">

// //                       <div className="flex items-center gap-3">

// //                         <div
// //                           className="
// //                             flex
// //                             h-12
// //                             w-12
// //                             items-center
// //                             justify-center
// //                             rounded-2xl
// //                             bg-fuchsia-100
// //                             text-fuchsia-600
// //                           "
// //                         >

// //                           <Warehouse className="h-6 w-6" />

// //                         </div>

// //                         <div>

// //                           <p className="font-bold text-slate-800">

// //                             {almacen.nombre}

// //                           </p>

// //                           <p className="text-sm text-slate-500">

// //                             {almacen.descripcion ||
// //                               "Sin descripción"}

// //                           </p>

// //                         </div>

// //                       </div>

// //                     </td>

// //                     {/* TIPO */}
// //                     <td className="px-6 py-5 text-center">

// //                       <span
// //                         className="
// //                           rounded-full
// //                           bg-blue-100
// //                           px-3
// //                           py-1
// //                           text-xs
// //                           font-semibold
// //                           text-blue-700
// //                         "
// //                       >

// //                         {almacen.tipo}

// //                       </span>

// //                     </td>

                  

// //                     {/* ESTADO */}
// //                     <td className="px-6 py-5 text-center">

// //                       {almacen.estado ? (

// //                         <span
// //                           className="
// //                             rounded-full
// //                             bg-emerald-100
// //                             px-3
// //                             py-1
// //                             text-xs
// //                             font-semibold
// //                             text-emerald-700
// //                           "
// //                         >
// //                           Activo
// //                         </span>

// //                       ) : (

// //                         <span
// //                           className="
// //                             rounded-full
// //                             bg-red-100
// //                             px-3
// //                             py-1
// //                             text-xs
// //                             font-semibold
// //                             text-red-700
// //                           "
// //                         >
// //                           Inactivo
// //                         </span>

// //                       )}

// //                     </td>

// //                     {/* ACCIONES */}
// //                     <td className="px-6 py-5">

// //                       <div className="flex items-center justify-center gap-3">

// //                         {/* VER */}
// //                         <Link
// //                           to={`?detail=${almacen._id}`}
// //                           className="
// //                             flex
// //                             h-10
// //                             w-10
// //                             items-center
// //                             justify-center
// //                             rounded-xl
// //                             bg-blue-100
// //                             text-blue-600
// //                             transition
// //                             hover:scale-110
// //                           "
// //                         >

// //                           <Eye className="h-5 w-5" />

// //                         </Link>

// //                         {/* EDITAR */}
// //                         <Link
// //                           to={`/sucursal/${sucursalId}/almacen/${almacen._id}/edit`}
// //                           className="
// //                             flex
// //                             h-10
// //                             w-10
// //                             items-center
// //                             justify-center
// //                             rounded-xl
// //                             bg-amber-100
// //                             text-amber-600
// //                             transition
// //                             hover:scale-110
// //                           "
// //                         >

// //                           <Pencil className="h-5 w-5" />

// //                         </Link>

// //                         {/* ELIMINAR */}
// //                         <button
// //                           type="button"
// //                           onClick={async () => {

// //                             const result =
// //                               await Swal.fire({

// //                                 title:
// //                                   "¿Eliminar almacén?",

// //                                 text:
// //                                   "El almacén será desactivado",

// //                                 icon:
// //                                   "warning",

// //                                 showCancelButton: true,

// //                                 confirmButtonColor:
// //                                   "#d33",

// //                                 cancelButtonColor:
// //                                   "#64748b",

// //                                 confirmButtonText:
// //                                   "Sí, eliminar",

// //                                 cancelButtonText:
// //                                   "Cancelar",

// //                               });

// //                             if (
// //                               result.isConfirmed
// //                             ) {

// //                               mutate({

// //                                 id:
// //                                   almacen._id!,

// //                                 eliminadoPor:
// //                                   "admin",

// //                               });

// //                             }

// //                           }}
// //                           className="
// //                             flex
// //                             h-10
// //                             w-10
// //                             items-center
// //                             justify-center
// //                             rounded-xl
// //                             bg-red-100
// //                             text-red-600
// //                             transition
// //                             hover:scale-110
// //                           "
// //                         >

// //                           <Trash2 className="h-5 w-5" />

// //                         </button>

// //                       </div>

// //                     </td>

// //                   </tr>

// //                 ))}

// //               </tbody>

// //             </table>

// //           </div>

// //         </motion.div>

// //         {/* MODAL */}
// //         <AlmacenDetailModal />

// //       </main>

// //     </div>

// //   );

// // }

// // src/views/almacen/AlmacenDetailView.tsx

// import {
//   useMemo,
//   useState,
// } from "react";

// import {
//   Link,
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

// import Swal from "sweetalert2";

// import MenuList from "@/components/MenuList";

// import {

//   deleteAlmacenById,

//   getAlmacenes,

// } from "@/api/AlmacenApi";

// import {

//   Eye,

//   Pencil,

//   Plus,

//   Search,

//   Trash2,

//   Warehouse,

//   Building2,

//   MapPin,

// } from "lucide-react";

// import AlmacenDetailModal from "@/components/almacen/AlmacenDetailModal";
// import { getSucursalById } from "@/api/SucursalApi";
// import type { SucursalType } from "@/types/SucursalType";

// export default function AlmacenDetailView() {

//   const queryClient =
//     useQueryClient();

//   const params =
//     useParams();

//   /* =========================
//       SUCURSAL ID
//   ========================= */

//   const sucursalId =
//     params.sucursalId!;

//       const  datasucursal = useQuery<SucursalType>({
//         queryKey: ['sucursal', sucursalId],
//         queryFn: () => getSucursalById(sucursalId),
//         retry: false
//       })
//   /* =========================
//       STATES
//   ========================= */

//   const [search, setSearch] =
//     useState("");

//   /* =========================
//       GET ALMACENES
//   ========================= */

//   const {
//     data,
//     isLoading,
//   } = useQuery({

//     queryKey: [
//       "almacenes"
//     ],

//     queryFn:
//       getAlmacenes,

//   });

//   /* =========================
//       FILTRAR POR SUCURSAL
//   ========================= */

//   const almacenesSucursal =
//     useMemo(() => {

//       if (!data)
//         return [];

//       return data.filter(
//         (almacen) => {

//           const id =

//             typeof almacen.idSucursal ===
//             "string"

//               ? almacen.idSucursal

//               : almacen.idSucursal?._id;

//           return id === sucursalId;

//         }
//       );

//     }, [data, sucursalId]);

//   /* =========================
//       BUSCADOR
//   ========================= */

//   const filteredAlmacenes =
//     useMemo(() => {

//       return almacenesSucursal.filter(
//         (almacen) =>

//           almacen.nombre
//             .toLowerCase()
//             .includes(
//               search.toLowerCase()
//             )

//       );

//     }, [

//       almacenesSucursal,

//       search,

//     ]);

//   /* =========================
//       DELETE
//   ========================= */

//   const { mutate } =
//     useMutation({

//       mutationFn:
//         deleteAlmacenById,

//       onSuccess: async (
//         data
//       ) => {

//         await Swal.fire({

//           icon: "success",

//           title: data,

//           timer: 2000,

//           showConfirmButton: false,

//         });

//         queryClient.invalidateQueries({

//           queryKey: [
//             "almacenes"
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

//     <div className="flex h-screen overflow-hidden bg-slate-50">

//       {/* SIDEBAR */}
//       <MenuList />

//       {/* CONTENIDO */}
//       <main className="flex-1 overflow-y-auto p-6 md:p-8">

//         {/* HEADER */}
//         <motion.div

//           initial={{
//             opacity: 0,
//             y: -25,
//           }}

//           animate={{
//             opacity: 1,
//             y: 0,
//           }}

//           transition={{
//             duration: 0.4,
//           }}

//           className="
//             mb-6
//             rounded-3xl
//             border
//             border-slate-200
//             bg-white
//             p-6
//             shadow-sm
//           "
//         >

//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

//             <div>

//               <h1 className="text-3xl font-black text-slate-800">
//                 Almacenes.    {datasucursal.data?.nombreSucursal}
//               </h1>

//               <p className="mt-2 text-slate-500">
//                 Gestión de almacenes por sucursal
//               </p>

//             </div>

//             {/* NUEVO */}
//             <Link
//               to={`/sucursal/${sucursalId}/almacen/create`}
//               className="
//                 flex
//                 items-center
//                 gap-2
//                 rounded-2xl
//                 bg-gradient-to-r
//                 from-fuchsia-600
//                 to-purple-600
//                 px-5
//                 py-3
//                 text-sm
//                 font-semibold
//                 text-white
//                 shadow-lg
//                 transition
//                 hover:scale-105
//               "
//             >

//               <Plus className="h-5 w-5" />

//               Nuevo Almacén

//             </Link>

//           </div>

//         </motion.div>

//         {/* RESUMEN */}
//         <motion.div

//           initial={{
//             opacity: 0,
//           }}

//           animate={{
//             opacity: 1,
//           }}

//           className="
//             mb-6
//             rounded-3xl
//             border
//             border-slate-200
//             bg-white
//             p-5
//             shadow-sm
//           "
//         >

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

//             {/* STATS */}
//             <div className="flex flex-wrap gap-8">

//               <div>

//                 <p className="text-xs uppercase text-slate-500">
//                   Total
//                 </p>

//                 <p className="text-3xl font-black text-slate-800">

//                   {almacenesSucursal.length}

//                 </p>

//               </div>

//               <div>

//                 <p className="text-xs uppercase text-slate-500">
//                   Activos
//                 </p>

//                 <p className="text-3xl font-black text-emerald-600">

//                   {
//                     almacenesSucursal.filter(
//                       (a) => a.estado
//                     ).length
//                   }

//                 </p>

//               </div>

//               <div>

//                 <p className="text-xs uppercase text-slate-500">
//                   Inactivos
//                 </p>

//                 <p className="text-3xl font-black text-red-500">

//                   {
//                     almacenesSucursal.filter(
//                       (a) => !a.estado
//                     ).length
//                   }

//                 </p>

//               </div>

//             </div>

//             {/* SEARCH */}
//             <div className="relative w-full max-w-md">

//               <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

//               <input
//                 type="text"
//                 placeholder="Buscar almacén..."
//                 value={search}
//                 onChange={(e) =>
//                   setSearch(
//                     e.target.value
//                   )
//                 }
//                 className="
//                   w-full
//                   rounded-2xl
//                   border
//                   border-slate-300
//                   bg-white
//                   py-3
//                   pl-10
//                   pr-4
//                   text-sm
//                   focus:border-fuchsia-500
//                   focus:outline-none
//                 "
//               />

//             </div>

//           </div>

//         </motion.div>

//         {/* TABLA */}
//         <motion.div

//           initial={{
//             opacity: 0,
//             y: 20,
//           }}

//           animate={{
//             opacity: 1,
//             y: 0,
//           }}

//           transition={{
//             duration: 0.4,
//           }}

//           className="
//             overflow-hidden
//             rounded-3xl
//             border
//             border-slate-200
//             bg-white
//             shadow-sm
//           "
//         >

//           <div className="overflow-x-auto">

//             <table className="min-w-full">

//               {/* HEADER */}
//               <thead className="bg-slate-100">

//                 <tr>

//                   <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
//                     Almacén
//                   </th>

//                   <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
//                     Tipo
//                   </th>

                 

//                   <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
//                     Estado
//                   </th>

//                   <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">
//                     Acciones
//                   </th>

//                 </tr>

//               </thead>

//               {/* BODY */}
//               <tbody className="divide-y divide-slate-100">

//                 {filteredAlmacenes.map((almacen) => (

//                   <tr
//                     key={almacen._id}
//                     className="transition hover:bg-slate-50"
//                   >

//                     {/* ALMACEN */}
//                     <td className="px-6 py-5">

//                       <div className="flex items-center gap-3">

//                         <div
//                           className="
//                             flex
//                             h-12
//                             w-12
//                             items-center
//                             justify-center
//                             rounded-2xl
//                             bg-fuchsia-100
//                             text-fuchsia-600
//                           "
//                         >

//                           <Warehouse className="h-6 w-6" />

//                         </div>

//                         <div>

//                           <p className="font-bold text-slate-800">

//                             {almacen.nombre}

//                           </p>

//                           <p className="text-sm text-slate-500">

//                             {almacen.descripcion ||
//                               "Sin descripción"}

//                           </p>

//                         </div>

//                       </div>

//                     </td>

//                     {/* TIPO */}
//                     <td className="px-6 py-5 text-center">

//                       <span
//                         className="
//                           rounded-full
//                           bg-blue-100
//                           px-3
//                           py-1
//                           text-xs
//                           font-semibold
//                           text-blue-700
//                         "
//                       >

//                         {almacen.tipo}

//                       </span>

//                     </td>

                  

//                     {/* ESTADO */}
//                     <td className="px-6 py-5 text-center">

//                       {almacen.estado ? (

//                         <span
//                           className="
//                             rounded-full
//                             bg-emerald-100
//                             px-3
//                             py-1
//                             text-xs
//                             font-semibold
//                             text-emerald-700
//                           "
//                         >
//                           Activo
//                         </span>

//                       ) : (

//                         <span
//                           className="
//                             rounded-full
//                             bg-red-100
//                             px-3
//                             py-1
//                             text-xs
//                             font-semibold
//                             text-red-700
//                           "
//                         >
//                           Inactivo
//                         </span>

//                       )}

//                     </td>

//                     {/* ACCIONES */}
//                     <td className="px-6 py-5">

//                       <div className="flex items-center justify-center gap-3">

//                         {/* VER */}
//                         <Link
//                           to={`?detail=${almacen._id}`}
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
//                           to={`/sucursal/${sucursalId}/almacen/${almacen._id}/edit`}
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
//                           onClick={async () => {

//                             const result =
//                               await Swal.fire({

//                                 title:
//                                   "¿Eliminar almacén?",

//                                 text:
//                                   "El almacén será desactivado",

//                                 icon:
//                                   "warning",

//                                 showCancelButton: true,

//                                 confirmButtonColor:
//                                   "#d33",

//                                 cancelButtonColor:
//                                   "#64748b",

//                                 confirmButtonText:
//                                   "Sí, eliminar",

//                                 cancelButtonText:
//                                   "Cancelar",

//                               });

//                             if (
//                               result.isConfirmed
//                             ) {

//                               mutate({

//                                 id:
//                                   almacen._id!,

//                                 eliminadoPor:
//                                   "admin",

//                               });

//                             }

//                           }}
//                           className="
//                             flex
//                             h-10
//                             w-10
//                             items-center
//                             justify-center
//                             rounded-xl
//                             bg-red-100
//                             text-red-600
//                             transition
//                             hover:scale-110
//                           "
//                         >

//                           <Trash2 className="h-5 w-5" />

//                         </button>

//                       </div>

//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </motion.div>

//         {/* MODAL */}
//         <AlmacenDetailModal />

//       </main>

//     </div>

//   );

// }
// src/views/almacen/AlmacenDetailView.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  Navigate,
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

import {
  AlertTriangle,
  Building2,
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Warehouse,
  X,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import AlmacenDetailModal from "@/components/almacen/AlmacenDetailModal";

import {
  deleteAlmacenById,
  getAlmacenes,
} from "@/api/AlmacenApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import type {
  SucursalType,
} from "@/types/SucursalType";

/* =====================================================
   UTILIDADES
===================================================== */

function normalizarTexto(
  valor: unknown
): string {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

function formatearTipo(
  tipo?: string
): string {
  if (!tipo) {
    return "Sin tipo";
  }

  return tipo
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letra) =>
        letra.toUpperCase()
    );
}

function obtenerIdSucursal(
  referencia:
    | string
    | {
        _id?: string;
      }
    | null
    | undefined
): string {
  if (!referencia) {
    return "";
  }

  if (
    typeof referencia ===
    "string"
  ) {
    return referencia;
  }

  return referencia._id ?? "";
}

function obtenerMensajeError(
  error: unknown
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

function esModoOscuro(): boolean {
  return document.documentElement.classList.contains(
    "dark"
  );
}

/* =====================================================
   SKELETON
===================================================== */

function AlmacenSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-40 rounded-2xl bg-slate-200 sm:rounded-3xl dark:bg-slate-800" />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {Array.from({
          length: 3,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-24 rounded-xl bg-slate-200 sm:h-28 sm:rounded-2xl dark:bg-slate-800"
            />
          )
        )}
      </div>

      <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          )
        )}
      </div>
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function AlmacenDetailView() {
  const queryClient =
    useQueryClient();

  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const [
    busqueda,
    setBusqueda,
  ] = useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState<
    "todos" | "activos" | "inactivos"
  >("todos");

  /* =====================================================
     CONSULTAR SUCURSAL
  ===================================================== */

  const {
    data: sucursal,
    isLoading:
      cargandoSucursal,
    isError:
      errorSucursal,
  } = useQuery<
    SucursalType,
    Error
  >({
    queryKey: [
      "sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getSucursalById(
        sucursalId!
      ),

    enabled:
      Boolean(sucursalId),

    retry:
      false,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     CONSULTAR ALMACENES
  ===================================================== */

  const {
    data: almacenes = [],
    isLoading:
      cargandoAlmacenes,
    isError:
      errorAlmacenes,
    error:
      almacenesError,
    refetch:
      recargarAlmacenes,
    isFetching:
      actualizandoAlmacenes,
  } = useQuery({
    queryKey: [
      "almacenes",
      sucursalId,
    ],

    queryFn:
      getAlmacenes,

    enabled:
      Boolean(sucursalId),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     ALMACENES DE LA SUCURSAL
  ===================================================== */

  const almacenesSucursal =
    useMemo(() => {
      if (!sucursalId) {
        return [];
      }

      return almacenes.filter(
        (almacen) =>
          obtenerIdSucursal(
            almacen.idSucursal
          ) === sucursalId
      );
    }, [
      almacenes,
      sucursalId,
    ]);

  /* =====================================================
     FILTROS
  ===================================================== */

  const almacenesFiltrados =
    useMemo(() => {
      const texto =
        normalizarTexto(
          busqueda
        );

      return almacenesSucursal.filter(
        (almacen) => {
          const activo =
            Boolean(
              almacen.estado
            );

          const coincideEstado =
            filtroEstado ===
              "todos" ||
            (
              filtroEstado ===
                "activos" &&
              activo
            ) ||
            (
              filtroEstado ===
                "inactivos" &&
              !activo
            );

          if (!coincideEstado) {
            return false;
          }

          if (!texto) {
            return true;
          }

          const contenido = [
            almacen.nombre,
            almacen.descripcion,
            almacen.tipo,
          ]
            .map(
              normalizarTexto
            )
            .join(" ");

          return contenido.includes(
            texto
          );
        }
      );
    }, [
      almacenesSucursal,
      busqueda,
      filtroEstado,
    ]);

  /* =====================================================
     RESUMEN
  ===================================================== */

  const totalAlmacenes =
    almacenesSucursal.length;

  const almacenesActivos =
    almacenesSucursal.filter(
      (almacen) =>
        Boolean(
          almacen.estado
        )
    ).length;

  const almacenesInactivos =
    totalAlmacenes -
    almacenesActivos;

  /* =====================================================
     ELIMINAR
  ===================================================== */

  const {
    mutate:
      eliminarAlmacen,

    isPending:
      eliminando,
  } = useMutation({
    mutationFn:
      deleteAlmacenById,

    onSuccess: async (
      respuesta
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "almacenes",
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: [
          "almacenes",
          sucursalId,
        ],
      });

      await Swal.fire({
        icon:
          "success",

        title:
          "Almacén eliminado",

        text:
          typeof respuesta ===
          "string"
            ? respuesta
            : "El almacén fue eliminado correctamente.",

        timer:
          1800,

        showConfirmButton:
          false,

        background:
          esModoOscuro()
            ? "#0f172a"
            : "#ffffff",

        color:
          esModoOscuro()
            ? "#f8fafc"
            : "#0f172a",
      });
    },

    onError: async (
      error: unknown
    ) => {
      await Swal.fire({
        icon:
          "error",

        title:
          "No se pudo eliminar",

        text:
          obtenerMensajeError(
            error
          ),

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#dc2626",

        background:
          esModoOscuro()
            ? "#0f172a"
            : "#ffffff",

        color:
          esModoOscuro()
            ? "#f8fafc"
            : "#0f172a",
      });
    },
  });

  const confirmarEliminacion =
    async (
      idAlmacen: string,
      nombreAlmacen: string
    ) => {
      const resultado =
        await Swal.fire({
          icon:
            "warning",

          title:
            "¿Eliminar almacén?",

          text:
            `El almacén "${nombreAlmacen}" será desactivado.`,

          showCancelButton:
            true,

          confirmButtonText:
            "Sí, eliminar",

          cancelButtonText:
            "Cancelar",

          reverseButtons:
            true,

          confirmButtonColor:
            "#dc2626",

          cancelButtonColor:
            "#475569",

          background:
            esModoOscuro()
              ? "#0f172a"
              : "#ffffff",

          color:
            esModoOscuro()
              ? "#f8fafc"
              : "#0f172a",
        });

      if (
        !resultado.isConfirmed
      ) {
        return;
      }

      eliminarAlmacen({
        id:
          idAlmacen,

        eliminadoPor:
          "admin",
      });
    };

  /* =====================================================
     VALIDACIONES
  ===================================================== */

  if (!sucursalId) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  if (
    cargandoSucursal ||
    cargandoAlmacenes
  ) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">
        <MenuList />

        <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-6 pt-20 sm:px-5 sm:pt-20 lg:p-8 lg:pt-8">
          <AlmacenSkeleton />
        </main>
      </div>
    );
  }

  if (
    errorSucursal ||
    !sucursal
  ) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  /* =====================================================
     CONTENIDO
  ===================================================== */

  return (
    <div
      className="
        flex min-h-screen w-full
        overflow-x-hidden bg-slate-50
        text-slate-900

        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      {/* MENÚ LATERAL */}

      <MenuList />

      {/* CONTENIDO */}

      <main
        className="
          min-w-0 flex-1
          overflow-x-hidden
          px-3 pb-6 pt-20

          sm:px-5 sm:pt-20
          lg:p-8 lg:pt-8
        "
      >
        <div className="mx-auto w-full min-w-0 max-w-7xl space-y-5 sm:space-y-6">
          {/* =================================================
              ENCABEZADO
          ================================================= */}

          <motion.header
            initial={{
              opacity: 0,
              y: -12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              relative w-full min-w-0
              overflow-hidden rounded-2xl
              bg-slate-900 p-4
              text-white shadow-lg

              sm:rounded-3xl
              sm:p-6

              dark:border
              dark:border-slate-800
            "
          >
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />

            <div className="relative z-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Warehouse
                    size={22}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                    Gestión de inventario
                  </p>

                  <h1 className="mt-1 truncate text-xl font-bold sm:text-3xl">
                    Almacenes
                  </h1>

                  <div className="mt-2 flex min-w-0 flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:items-center sm:gap-4">
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <Building2
                        size={15}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {sucursal.nombreSucursal}
                      </span>
                    </span>

                    <span className="inline-flex min-w-0 items-center gap-2">
                      <MapPin
                        size={15}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {sucursal.ubicacionSucursal ||
                          "Ubicación no registrada"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    recargarAlmacenes()
                  }
                  disabled={
                    actualizandoAlmacenes
                  }
                  className="
                    inline-flex min-w-0
                    items-center justify-center
                    gap-2 rounded-xl
                    border border-white/15
                    bg-white/10 px-3
                    py-2.5 text-sm
                    font-semibold text-white
                    transition hover:bg-white/20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <RefreshCcw
                    size={16}
                    className={
                      actualizandoAlmacenes
                        ? "animate-spin"
                        : ""
                    }
                  />

                  <span className="truncate">
                    Actualizar
                  </span>
                </button>

                <Link
                  to={`/sucursal/${sucursalId}/almacen/create`}
                  className="
                    inline-flex min-w-0
                    items-center justify-center
                    gap-2 rounded-xl
                    bg-white px-3 py-2.5
                    text-sm font-bold
                    text-slate-950 transition
                    hover:bg-slate-100
                  "
                >
                  <Plus size={17} />

                  <span className="truncate">
                    Nuevo
                  </span>
                </Link>
              </div>
            </div>
          </motion.header>

          {/* =================================================
              RESUMEN
          ================================================= */}

          <section className="grid grid-cols-3 gap-2 sm:gap-4">
            <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                Total
              </p>

              <p className="mt-1 truncate text-xl font-bold text-slate-900 sm:mt-2 sm:text-3xl dark:text-white">
                {totalAlmacenes}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Registrados
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-emerald-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-emerald-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-emerald-600 sm:text-xs dark:text-emerald-400">
                Activos
              </p>

              <p className="mt-1 truncate text-xl font-bold text-emerald-700 sm:mt-2 sm:text-3xl dark:text-emerald-400">
                {almacenesActivos}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Disponibles
              </p>
            </article>

            <article className="min-w-0 rounded-xl border border-red-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5 dark:border-red-900/50 dark:bg-slate-900">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-red-600 sm:text-xs dark:text-red-400">
                Inactivos
              </p>

              <p className="mt-1 truncate text-xl font-bold text-red-700 sm:mt-2 sm:text-3xl dark:text-red-400">
                {almacenesInactivos}
              </p>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Deshabilitados
              </p>
            </article>
          </section>

          {/* =================================================
              FILTROS
          ================================================= */}

          <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="relative min-w-0">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={
                    busqueda
                  }
                  onChange={(
                    event
                  ) =>
                    setBusqueda(
                      event.target.value
                    )
                  }
                  placeholder="Buscar por nombre, tipo o descripción..."
                  className="
                    w-full min-w-0
                    rounded-xl border
                    border-slate-300
                    bg-slate-50 py-3
                    pl-11 pr-11
                    text-sm text-slate-900
                    outline-none transition

                    placeholder:text-slate-400

                    focus:border-slate-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-slate-200/60

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                    dark:focus:border-slate-500
                    dark:focus:ring-slate-700/40
                  "
                />

                {busqueda && (
                  <button
                    type="button"
                    onClick={() =>
                      setBusqueda("")
                    }
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <select
                value={
                  filtroEstado
                }
                onChange={(
                  event
                ) =>
                  setFiltroEstado(
                    event.target.value as
                      | "todos"
                      | "activos"
                      | "inactivos"
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200/60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-700/40"
              >
                <option value="todos">
                  Todos
                </option>

                <option value="activos">
                  Activos
                </option>

                <option value="inactivos">
                  Inactivos
                </option>
              </select>
            </div>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Mostrando{" "}
              <strong className="text-slate-900 dark:text-white">
                {
                  almacenesFiltrados.length
                }
              </strong>{" "}
              almacenes
            </p>
          </section>

          {/* =================================================
              ERROR
          ================================================= */}

          {errorAlmacenes && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={22}
                  className="mt-0.5 shrink-0 text-red-700 dark:text-red-400"
                />

                <div className="min-w-0">
                  <h2 className="font-bold text-red-800 dark:text-red-300">
                    No se pudieron cargar los almacenes
                  </h2>

                  <p className="mt-1 break-words text-sm text-red-700 dark:text-red-400">
                    {obtenerMensajeError(
                      almacenesError
                    )}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              TARJETAS PARA CELULAR
          ================================================= */}

          {!errorAlmacenes &&
            almacenesFiltrados.length >
              0 && (
              <section className="grid w-full min-w-0 grid-cols-1 gap-4 md:hidden">
                {almacenesFiltrados.map(
                  (almacen) => (
                    <motion.article
                      key={
                        almacen._id
                      }
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="min-w-0 p-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                            <Warehouse
                              size={21}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h2
                              title={
                                almacen.nombre
                              }
                              className="truncate text-base font-bold text-slate-950 dark:text-white"
                            >
                              {almacen.nombre}
                            </h2>

                            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                              {almacen.descripcion ||
                                "Sin descripción"}
                            </p>
                          </div>

                          <span
                            className={`
                              shrink-0 rounded-full
                              px-2 py-1
                              text-[10px] font-semibold

                              ${
                                almacen.estado
                                  ? `
                                    bg-emerald-100
                                    text-emerald-700
                                    dark:bg-emerald-950/50
                                    dark:text-emerald-400
                                  `
                                  : `
                                    bg-red-100
                                    text-red-700
                                    dark:bg-red-950/50
                                    dark:text-red-400
                                  `
                              }
                            `}
                          >
                            {almacen.estado
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                          <p className="text-[11px] font-medium text-slate-400">
                            Tipo de almacén
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {formatearTipo(
                              almacen.tipo
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/30">
                        <Link
                          to={`?detail=${almacen._id}`}
                          className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                        >
                          <Eye
                            size={17}
                            className="shrink-0"
                          />

                          Ver
                        </Link>

                        <Link
                          to={`/sucursal/${sucursalId}/almacen/${almacen._id}/edit`}
                          className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                        >
                          <Pencil
                            size={17}
                            className="shrink-0"
                          />

                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            confirmarEliminacion(
                              almacen._id!,
                              almacen.nombre
                            )
                          }
                          className="col-span-2 inline-flex min-w-0 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                        >
                          <Trash2
                            size={17}
                            className="shrink-0"
                          />

                          Eliminar almacén
                        </button>
                      </div>
                    </motion.article>
                  )
                )}
              </section>
            )}

          {/* =================================================
              TABLA PARA TABLET Y ESCRITORIO
          ================================================= */}

          {!errorAlmacenes &&
            almacenesFiltrados.length >
              0 && (
              <motion.section
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead className="bg-slate-100 dark:bg-slate-950/70">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Almacén
                        </th>

                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                          Tipo
                        </th>

                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                          Estado
                        </th>

                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {almacenesFiltrados.map(
                        (almacen) => (
                          <tr
                            key={
                              almacen._id
                            }
                            className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          >
                            <td className="px-6 py-5">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                                  <Warehouse
                                    size={20}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-72 truncate font-bold text-slate-900 dark:text-white">
                                    {almacen.nombre}
                                  </p>

                                  <p className="mt-1 max-w-md truncate text-sm text-slate-500 dark:text-slate-400">
                                    {almacen.descripcion ||
                                      "Sin descripción"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <span className="inline-flex max-w-48 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                                <span className="truncate">
                                  {formatearTipo(
                                    almacen.tipo
                                  )}
                                </span>
                              </span>
                            </td>

                            <td className="px-6 py-5 text-center">
                              <span
                                className={`
                                  inline-flex rounded-full
                                  px-3 py-1
                                  text-xs font-semibold

                                  ${
                                    almacen.estado
                                      ? `
                                        bg-emerald-100
                                        text-emerald-700
                                        dark:bg-emerald-950/50
                                        dark:text-emerald-400
                                      `
                                      : `
                                        bg-red-100
                                        text-red-700
                                        dark:bg-red-950/50
                                        dark:text-red-400
                                      `
                                  }
                                `}
                              >
                                {almacen.estado
                                  ? "Activo"
                                  : "Inactivo"}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  to={`?detail=${almacen._id}`}
                                  title="Ver almacén"
                                  aria-label={`Ver ${almacen.nombre}`}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition hover:scale-105 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                                >
                                  <Eye size={18} />
                                </Link>

                                <Link
                                  to={`/sucursal/${sucursalId}/almacen/${almacen._id}/edit`}
                                  title="Editar almacén"
                                  aria-label={`Editar ${almacen.nombre}`}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition hover:scale-105 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                                >
                                  <Pencil size={18} />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    confirmarEliminacion(
                                      almacen._id!,
                                      almacen.nombre
                                    )
                                  }
                                  title="Eliminar almacén"
                                  aria-label={`Eliminar ${almacen.nombre}`}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700 transition hover:scale-105 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            )}

          {/* =================================================
              ESTADO VACÍO
          ================================================= */}

          {!errorAlmacenes &&
            almacenesFiltrados.length ===
              0 && (
              <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <Warehouse size={30} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {busqueda
                    ? "No se encontraron almacenes"
                    : "No existen almacenes registrados"}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {busqueda
                    ? "Prueba con otro nombre, descripción o tipo de almacén."
                    : "Registra el primer almacén de esta sucursal para comenzar a gestionar el inventario."}
                </p>

                {busqueda ? (
                  <button
                    type="button"
                    onClick={() =>
                      setBusqueda("")
                    }
                    className="mt-5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Limpiar búsqueda
                  </button>
                ) : (
                  <Link
                    to={`/sucursal/${sucursalId}/almacen/create`}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    <Plus size={18} />

                    Crear almacén
                  </Link>
                )}
              </section>
            )}
        </div>

        <AlmacenDetailModal />
      </main>

      {/* =================================================
          INDICADOR DE ELIMINACIÓN
      ================================================= */}

      {eliminando && (
        <div className="fixed bottom-4 left-4 right-4 z-[90] flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-5 sm:w-auto">
          <RefreshCcw
            size={17}
            className="animate-spin"
          />

          Eliminando almacén...
        </div>
      )}
    </div>
  );
}