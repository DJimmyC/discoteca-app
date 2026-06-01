// import {
//   useMemo,
//   useState,
// } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import {
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";

// import {
//   ArrowLeft,
//   ClipboardList,
//   LogOut,
//   Search,
//   Wallet,
// } from "lucide-react";

// import Swal from "sweetalert2";

// import { useAuth } from "@/hooks/useAuth";

// import MenuList from "@/components/MenuList";

// import EgresoForm, {
//   type DetalleEgresoItem,
// } from "@/components/egreso/EgresoForm";

// import {
//   getCajasBySucursal,
// } from "@/api/CajaApi";

// import {
//   createEgreso,
// } from "@/api/EgresoApi";

// import {
//   createManyDetalleEgreso,
// } from "@/api/DetalleEgresoApi";

// export default function CreateEgresoView() {

//   const navigate = useNavigate();

//   const queryClient = useQueryClient();

//   const {
//     data: perfil,
//     isLoading: loadingAuth,
//   } = useAuth();

//   const [
//     idCaja,
//     setIdCaja,
//   ] = useState("");

//   const [
//     tipoEgreso,
//     setTipoEgreso,
//   ] = useState("compra");

//   const [
//     metodoPago,
//     setMetodoPago,
//   ] = useState("efectivo");

//   const [
//     observacion,
//     setObservacion,
//   ] = useState("");

//   const [
//     detalles,
//     setDetalles,
//   ] = useState<DetalleEgresoItem[]>([
//     {
//       descripcion: "",
//       cantidad: 1,
//       costoUnitario: 0,
//       tipoItem: "otro",
//     },
//   ]);

//   /* =========================
//       IDS DESDE AUTH
//   ========================= */

//   const idPerfil =
//     perfil?._id;
//  const params = useParams();
//   const idSucursal = params.sucursalId!

//   /* =========================
//       CAJAS POR SUCURSAL
//   ========================= */

//   const {
//     data: cajas = [],
//     isLoading: loadingCajas,
//     isError: errorCajas,
//   } = useQuery({

//     queryKey: [
//       "cajas-sucursal",
//       idSucursal,
//     ],

//     queryFn: () =>
//       getCajasBySucursal(
//         idSucursal!
//       ),

//     enabled:
//       !!idSucursal,

//   });

//   /* =========================
//       TOTAL
//   ========================= */

//   const total = useMemo(() => {

//     return detalles.reduce(
//       (acc, detalle) =>
//         acc +
//         Number(detalle.cantidad || 0) *
//           Number(detalle.costoUnitario || 0),
//       0
//     );

//   }, [detalles]);

//   /* =========================
//       CREAR EGRESO
//   ========================= */

//   const {
//     mutate: guardarEgreso,
//     isPending,
//   } = useMutation({

//     mutationFn: async () => {

//       if (!idSucursal) {
//         throw new Error(
//           "No se encontró la sucursal del usuario"
//         );
//       }

//       if (!idPerfil) {
//         throw new Error(
//           "No se encontró el perfil del usuario"
//         );
//       }

//       if (!idCaja) {
//         throw new Error(
//           "Debe seleccionar una caja"
//         );
//       }

//       const detallesValidos =
//         detalles.filter(
//           (detalle) =>
//             detalle.descripcion.trim() !== "" &&
//             Number(detalle.cantidad) > 0 &&
//             Number(detalle.costoUnitario) >= 0
//         );

//       if (detallesValidos.length === 0) {
//         throw new Error(
//           "Debe agregar al menos un detalle válido"
//         );
//       }

//       /*
//         1. Crear egreso
//       */
//       const responseEgreso =
//         await createEgreso({

//           idCaja,

//           idPerfil,

//           idSucursal,

//           tipoEgreso,

//           metodoPago,

//           total,

//           estado:
//             "registrado",

//           observacion:
//             observacion || "Sin observación",

//           creadoPor:
//             perfil?.nombres || "sistema",

//         });

//       /*
//         El backend debe devolver:
//         {
//           message: "Egreso registrado",
//           egreso: { _id: "..." }
//         }
//       */
//       const idEgresoCreado =
//         responseEgreso?.egreso?._id;

//       if (!idEgresoCreado) {
//         throw new Error(
//           "No se recibió el ID del egreso creado"
//         );
//       }

//       /*
//         2. Crear detalles del egreso
//       */
//       const detallesPayload =
//         detallesValidos.map((detalle) => ({

//           idEgreso:
//             idEgresoCreado,

//           idProducto:
//             null,

//           idAlmacen:
//             null,

//           descripcion:
//             detalle.descripcion,

//           cantidad:
//             Number(detalle.cantidad),

//           costoUnitario:
//             Number(detalle.costoUnitario),

//           subtotal:
//             Number(detalle.cantidad) *
//             Number(detalle.costoUnitario),

//           tipoItem:
//             detalle.tipoItem,

//           creadoPor:
//             perfil?.nombres || "sistema",

//         }));

//       await createManyDetalleEgreso(
//         detallesPayload
//       );

//     },

//     onSuccess: () => {

//       Swal.fire({
//         icon: "success",
//         title: "Egreso registrado",
//         text: "El egreso y sus detalles fueron registrados correctamente",
//       });

//       queryClient.invalidateQueries({
//         queryKey: [
//           "egresos-con-detalles",
//           idSucursal,
//         ],
//       });

//       navigate(-1);

//     },

//     onError: (error) => {

//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text:
//           error instanceof Error
//             ? error.message
//             : "Error al registrar el egreso",
//       });

//     },

//   });

//   /* =========================
//       CERRAR SESIÓN
//   ========================= */

//   const cerrarSesion = () => {

//     localStorage.removeItem(
//       "AUTH_TOKEN"
//     );

//     navigate("/auth/login");

//   };

//   /* =========================
//       LOADING
//   ========================= */

//   if (
//     loadingAuth ||
//     loadingCajas
//   ) {

//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
//         <p className="text-lg font-bold">
//           Cargando formulario...
//         </p>
//       </div>
//     );

//   }

//   /* =========================
//       ERROR
//   ========================= */

//   if (errorCajas) {

//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
//         <p className="text-lg font-bold text-red-500">
//           Error al cargar cajas
//         </p>
//       </div>
//     );

//   }

//   return (

//     <div className="min-h-screen bg-slate-100 text-slate-900">

//       {/* TOP BAR */}
//       <header className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-[#4b4f58] px-6 text-white shadow-md">

//         <div className="flex items-center gap-3">

//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
//             <Wallet className="h-5 w-5" />
//           </div>

//           <h1 className="text-xl font-black">
//             Discoteca Manager
//           </h1>

//         </div>

//         <div className="hidden w-[520px] items-center rounded-xl bg-slate-800 px-4 py-3 md:flex">

//           <Search className="mr-3 h-5 w-5 text-slate-400" />

//           <input
//             type="text"
//             placeholder="Buscar..."
//             className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
//           />

//         </div>

//         <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3">

//           <div className="h-10 w-10 rounded-full bg-red-500" />

//           <span className="hidden text-sm font-bold md:block">
//             {perfil?.nombres || "Usuario"}
//           </span>

//           <button
//             type="button"
//             onClick={cerrarSesion}
//             title="Cerrar sesión"
//             aria-label="Cerrar sesión"
//             className="rounded-xl bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
//           >
//             <LogOut className="h-5 w-5" />
//           </button>

//         </div>

//       </header>

//       {/* SIDEBAR */}
//       <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 border-r border-slate-200 bg-white">
//         <MenuList />
//       </aside>

//       {/* MAIN */}
//       <main className="ml-72 pt-20">

//         <div className="p-8">

//           {/* HEADER CARD */}
//           <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

//             <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

//               <div>

//                 <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">

//                   <ClipboardList className="h-4 w-4" />

//                   <span>
//                     {typeof perfil?.idSucursal === "object"
//                       ? perfil.idSucursal?.nombreSucursal
//                       : "Sucursal"}
//                   </span>

//                   <span>/</span>

//                   <span className="font-bold text-red-500">
//                     Nuevo Egreso
//                   </span>

//                 </div>

//                 <h1 className="text-4xl font-black text-slate-900">
//                   Crear Egreso
//                 </h1>

//                 <p className="mt-2 text-slate-500">
//                   Registra una nueva salida de dinero para la sucursal actual.
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   navigate(-1)
//                 }
//                 title="Volver"
//                 aria-label="Volver"
//                 className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
//               >
//                 <ArrowLeft className="h-6 w-6" />
//               </button>

//             </div>

//           </section>

//           <EgresoForm
//             cajas={cajas}
//             idCaja={idCaja}
//             setIdCaja={setIdCaja}
//             tipoEgreso={tipoEgreso}
//             setTipoEgreso={setTipoEgreso}
//             metodoPago={metodoPago}
//             setMetodoPago={setMetodoPago}
//             observacion={observacion}
//             setObservacion={setObservacion}
//             detalles={detalles}
//             setDetalles={setDetalles}
//             total={total}
//             isPending={isPending}
//             buttonText="Registrar egreso"
//             onSubmit={() =>
//               guardarEgreso()
//             }
//           />

//         </div>

//       </main>

//     </div>

//   );

// }


// src/views/egreso/CreateEgresoView.tsx

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  ArrowLeft,
  ClipboardList,
  LogOut,
  Search,
  Wallet,
} from "lucide-react";

import Swal from "sweetalert2";

import { useAuth } from "@/hooks/useAuth";

import MenuList from "@/components/MenuList";

import EgresoForm, {
  type DetalleEgresoItem,
} from "@/components/egreso/EgresoForm";

import {
  getCajasBySucursal,
} from "@/api/CajaApi";

import {
  getAlmacenesBySucursal,
} from "@/api/AlmacenApi";

import {
  getProductos,
} from "@/api/ProductoApi";

import {
  createEgreso,
} from "@/api/EgresoApi";

import {
  createManyDetalleEgreso,
} from "@/api/DetalleEgresoApi";

export default function CreateEgresoView() {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: perfil,
    isLoading: loadingAuth,
  } = useAuth();

  const [
    idCaja,
    setIdCaja,
  ] = useState("");

  const [
    tipoEgreso,
    setTipoEgreso,
  ] = useState("compra");

  const [
    metodoPago,
    setMetodoPago,
  ] = useState("efectivo");

  const [
    observacion,
    setObservacion,
  ] = useState("");

  const [
    detalles,
    setDetalles,
  ] = useState<DetalleEgresoItem[]>([
    {
      idProducto: null,
      idAlmacen: "",
      descripcion: "",
      cantidad: 1,
      costoUnitario: 0,
      tipoItem: "otro",
    },
  ]);

  /* =========================
      IDS DESDE AUTH
  ========================= */

  const idPerfil =
    perfil?._id;

  const idSucursal =
    typeof perfil?.idSucursal === "object"
      ? perfil.idSucursal?._id
      : perfil?.idSucursal;

  const nombreSucursal =
    typeof perfil?.idSucursal === "object"
      ? perfil.idSucursal?.nombreSucursal
      : "Sucursal";

  /* =========================
      CAJAS POR SUCURSAL
  ========================= */

  const {
    data: cajas = [],
    isLoading: loadingCajas,
    isError: errorCajas,
  } = useQuery({

    queryKey: [
      "cajas-sucursal",
      idSucursal,
    ],

    queryFn: () =>
      getCajasBySucursal(
        idSucursal!
      ),

    enabled:
      !!idSucursal,

  });

  /* =========================
      ALMACENES POR SUCURSAL
  ========================= */

  const {
    data: dataAlmacenes,
    isLoading: loadingAlmacenes,
    isError: errorAlmacenes,
  } = useQuery({

    queryKey: [
      "almacenes-sucursal",
      idSucursal,
    ],

    queryFn: () =>
      getAlmacenesBySucursal(
        idSucursal!
      ),

    enabled:
      !!idSucursal,

  });

  const almacenes =
    dataAlmacenes?.almacenes || [];

  /* =========================
      PRODUCTOS
  ========================= */

  const {
    data: productos = [],
    isLoading: loadingProductos,
    isError: errorProductos,
  } = useQuery({

    queryKey: [
      "productos",
    ],

    queryFn:
      getProductos,

  });

  const productosValidos =
    productos || [];

  /* =========================
      TOTAL
  ========================= */

  const total = useMemo(() => {

    return detalles.reduce(
      (acc, detalle) =>
        acc +
        Number(detalle.cantidad || 0) *
        Number(detalle.costoUnitario || 0),
      0
    );

  }, [detalles]);

  /* =========================
      CREAR EGRESO
  ========================= */

  const {
    mutate: guardarEgreso,
    isPending,
  } = useMutation({

    mutationFn: async () => {

      if (!idSucursal) {
        throw new Error(
          "No se encontró la sucursal del usuario"
        );
      }

      if (!idPerfil) {
        throw new Error(
          "No se encontró el perfil del usuario"
        );
      }

      if (!idCaja) {
        throw new Error(
          "Debe seleccionar una caja"
        );
      }

      const detallesValidos =
        detalles.filter(
          (detalle) =>
            detalle.idAlmacen &&
            detalle.descripcion.trim() !== "" &&
            Number(detalle.cantidad) > 0 &&
            Number(detalle.costoUnitario) >= 0
        );

      if (detallesValidos.length === 0) {
        throw new Error(
          "Debe agregar al menos un detalle válido con almacén seleccionado"
        );
      }

      if (total < 0) {
        throw new Error(
          "El total no puede ser negativo"
        );
      }

      /*
        1. Crear egreso
      */
      const responseEgreso =
        await createEgreso({

          idCaja,

          idPerfil,

          idSucursal,

          tipoEgreso,

          metodoPago,

          total,

          estado:
            "registrado",

          observacion:
            observacion || "Sin observación",

          creadoPor:
            perfil?.nombres || "sistema",

        });

      /*
        El backend debe devolver:
        {
          message: "Egreso registrado",
          egreso: { _id: "..." }
        }
      */
      const idEgresoCreado =
        responseEgreso?.egreso?._id;

      if (!idEgresoCreado) {
        throw new Error(
          "No se recibió el ID del egreso creado. Revisa que el backend devuelva el egreso creado."
        );
      }

      /*
        2. Crear detalles del egreso
      */
      const detallesPayload =
        detallesValidos.map((detalle) => ({

          idEgreso:
            idEgresoCreado,

          idProducto:
            detalle.idProducto || null,

          idAlmacen:
            detalle.idAlmacen,

          descripcion:
            detalle.descripcion,

          cantidad:
            Number(detalle.cantidad),

          costoUnitario:
            Number(detalle.costoUnitario),

          subtotal:
            Number(detalle.cantidad) *
            Number(detalle.costoUnitario),

          tipoItem:
            detalle.tipoItem,

          creadoPor:
            perfil?.nombres || "sistema",

        }));

      await createManyDetalleEgreso(
        detallesPayload
      );

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Egreso registrado",
        text: "El egreso y sus detalles fueron registrados correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "egresos-con-detalles",
          idSucursal,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "almacenes-sucursal",
          idSucursal,
        ],
      });

      navigate(-1);

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al registrar el egreso",
      });

    },

  });

  /* =========================
      CERRAR SESIÓN
  ========================= */

  const cerrarSesion = () => {

    localStorage.removeItem(
      "AUTH_TOKEN"
    );

    navigate("/auth/login");

  };

  /* =========================
      LOADING
  ========================= */

  if (
    loadingAuth ||
    loadingCajas ||
    loadingAlmacenes ||
    loadingProductos
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold">
          Cargando formulario...
        </p>
      </div>
    );

  }

  /* =========================
      ERROR
  ========================= */

  if (
    errorCajas ||
    errorAlmacenes ||
    errorProductos
  ) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
        <p className="text-lg font-bold text-red-500">
          Error al cargar cajas, almacenes o productos
        </p>
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* TOP BAR */}
      <header className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between bg-[#4b4f58] px-6 text-white shadow-md">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
            <Wallet className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-black">
            Discoteca Manager
          </h1>

        </div>

        <div className="hidden w-[520px] items-center rounded-xl bg-slate-800 px-4 py-3 md:flex">

          <Search className="mr-3 h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
          />

        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3">

          <div className="h-10 w-10 rounded-full bg-red-500" />

          <span className="hidden text-sm font-bold md:block">
            {perfil?.nombres || "Usuario"}
          </span>

          <button
            type="button"
            onClick={cerrarSesion}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="rounded-xl bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
          </button>

        </div>

      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 border-r border-slate-200 bg-white">
        <MenuList />
      </aside>

      {/* MAIN */}
      <main className="ml-72 pt-20">

        <div className="p-8">

          {/* HEADER CARD */}
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">

                  <ClipboardList className="h-4 w-4" />

                  <span>
                    {nombreSucursal || "Sucursal"}
                  </span>

                  <span>/</span>

                  <span className="font-bold text-red-500">
                    Nuevo Egreso
                  </span>

                </div>

                <h1 className="text-4xl font-black text-slate-900">
                  Crear Egreso
                </h1>

                <p className="mt-2 text-slate-500">
                  Registra una nueva salida de dinero para la sucursal actual.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                title="Volver"
                aria-label="Volver"
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>

            </div>

          </section>

          <EgresoForm
            cajas={cajas}
            almacenes={almacenes}
            productos={productosValidos}
            idCaja={idCaja}
            setIdCaja={setIdCaja}
            tipoEgreso={tipoEgreso}
            setTipoEgreso={setTipoEgreso}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            observacion={observacion}
            setObservacion={setObservacion}
            detalles={detalles}
            setDetalles={setDetalles}
            total={total}
            isPending={isPending}
            buttonText="Registrar egreso"
            onSubmit={() =>
              guardarEgreso()
            }
          />

        </div>

      </main>

    </div>

  );

}