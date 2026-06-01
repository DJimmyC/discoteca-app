// import {
//   Plus,
//   Save,
//   Trash2,
//   Search,
// } from "lucide-react";

// import type {
//   Dispatch,
//   SetStateAction,
// } from "react";

// export type DetalleEgresoItem = {
//   idProducto?: string | null;
//   idAlmacen: string;
//   descripcion: string;
//   cantidad: number;
//   costoUnitario: number;
//   tipoItem: string;
// };

// type CajaOption = {
//   _id: string;
//   nombre?: string | null;
//   descripcion?: string | null;
// };

// type AlmacenOption = {
//   _id?: string;
//   nombre?: string | null;
//   tipo?: string | null;
//   descripcion?: string | null;
//   ubicacion?: string | null;
// };

// type ProductoOption = {
//   _id?: string;
//   nombre?: string;
//   descripcion?: string | null;
//   marca?: string | null;
//   estado?: boolean;
// };

// type EgresoFormProps = {
//   cajas: CajaOption[];
//   almacenes: AlmacenOption[];
//   productos: ProductoOption[];

//   idCaja: string;
//   setIdCaja: (value: string) => void;

//   tipoEgreso: string;
//   setTipoEgreso: (value: string) => void;

//   metodoPago: string;
//   setMetodoPago: (value: string) => void;

//   observacion: string;
//   setObservacion: (value: string) => void;

//   detalles: DetalleEgresoItem[];
//   setDetalles: Dispatch<
//     SetStateAction<DetalleEgresoItem[]>
//   >;

//   total: number;
//   isPending?: boolean;
//   buttonText?: string;
//   onSubmit: () => void;
// };
// export type DetalleEgresoItem = {
//   idDetalle?: string;
//   idProducto?: string | null;
//   idAlmacen: string;
//   descripcion: string;
//   cantidad: number;
//   costoUnitario: number;
//   tipoItem: string;
//   esNuevo?: boolean;
// };

// export default function EgresoForm({
//   cajas,
//   almacenes,
//   productos,
//   idCaja,
//   setIdCaja,
//   tipoEgreso,
//   setTipoEgreso,
//   metodoPago,
//   setMetodoPago,
//   observacion,
//   setObservacion,
//   detalles,
//   setDetalles,
//   total,
//   isPending = false,
//   buttonText = "Guardar egreso",
//   onSubmit,
// }: EgresoFormProps) {

//   const agregarDetalle = () => {

//     setDetalles((prev) => [
//       ...prev,
//       {
//         idProducto: null,
//         idAlmacen: "",
//         descripcion: "",
//         cantidad: 1,
//         costoUnitario: 0,
//         tipoItem: "otro",
//       },
//     ]);

//   };

  

//   const eliminarDetalle = (
//     index: number
//   ) => {

//     setDetalles((prev) =>
//       prev.filter(
//         (_, itemIndex) =>
//           itemIndex !== index
//       )
//     );

//   };

//   const actualizarDetalle = (
//     index: number,
//     field: keyof DetalleEgresoItem,
//     value: string | number | null
//   ) => {

//     setDetalles((prev) =>
//       prev.map((detalle, itemIndex) =>
//         itemIndex === index
//           ? {
//               ...detalle,
//               [field]: value,
//             }
//           : detalle
//       )
//     );

//   };

//   const filtrarProductos = (
//     search: string
//   ) => {

//     const value =
//       search.trim().toLowerCase();

//     if (!value) {
//       return productos;
//     }

//     return productos.filter((producto) => {

//       const texto = `
//         ${producto.nombre || ""}
//         ${producto.descripcion || ""}
//         ${producto.marca || ""}
//       `.toLowerCase();

//       return texto.includes(value);

//     });

//   };

//   return (

//     <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

//       <div className="mb-8">

//         <h2 className="text-4xl font-black text-slate-900">
//           Datos del Egreso
//         </h2>

//         <p className="mt-2 text-slate-500">
//           Registra la salida de dinero, selecciona la caja, el almacén y opcionalmente un producto.
//         </p>

//       </div>

//       {/* DATOS PRINCIPALES */}
//       <div className="grid gap-6 md:grid-cols-2">

//         <div>

//           <label className="mb-2 block text-sm font-bold text-slate-600">
//             Caja
//           </label>

//           <select
//             value={idCaja}
//             onChange={(e) =>
//               setIdCaja(e.target.value)
//             }
//             className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
//           >
//             <option value="">
//               Seleccione una caja
//             </option>

//             {cajas.map((caja) => (
//               <option
//                 key={caja._id}
//                 value={caja._id}
//               >
//                 {caja.nombre ||
//                   caja.descripcion ||
//                   "Caja sin nombre"}
//               </option>
//             ))}
//           </select>

//         </div>

//         <div>

//           <label className="mb-2 block text-sm font-bold text-slate-600">
//             Tipo de egreso
//           </label>

//           <select
//             value={tipoEgreso}
//             onChange={(e) =>
//               setTipoEgreso(e.target.value)
//             }
//             className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
//           >
//             <option value="compra">
//               Compra
//             </option>

//             <option value="servicio">
//               Servicio
//             </option>

//             <option value="mantenimiento">
//               Mantenimiento
//             </option>

//             <option value="otro">
//               Otro
//             </option>
//           </select>

//         </div>

//         <div>

//           <label className="mb-2 block text-sm font-bold text-slate-600">
//             Método de pago
//           </label>

//           <select
//             value={metodoPago}
//             onChange={(e) =>
//               setMetodoPago(e.target.value)
//             }
//             className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
//           >
//             <option value="efectivo">
//               Efectivo
//             </option>

//             <option value="qr">
//               QR
//             </option>

//             <option value="tarjeta">
//               Tarjeta
//             </option>

//             <option value="transferencia">
//               Transferencia
//             </option>

//             <option value="mixto">
//               Mixto
//             </option>
//           </select>

//         </div>

//         <div>

//           <label className="mb-2 block text-sm font-bold text-slate-600">
//             Total calculado
//           </label>

//           <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-2xl font-black text-red-500">
//             Bs. {total.toFixed(2)}
//           </div>

//         </div>

//       </div>

//       <div className="mt-6">

//         <label className="mb-2 block text-sm font-bold text-slate-600">
//           Observación
//         </label>

//         <textarea
//           value={observacion}
//           onChange={(e) =>
//             setObservacion(e.target.value)
//           }
//           rows={3}
//           placeholder="Ej: compra de insumos, pago de servicio, mantenimiento..."
//           className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
//         />

//       </div>

//       {/* DETALLES */}
//       <div className="mt-10">

//         <div className="mb-5 flex items-center justify-between">

//           <div>

//             <h3 className="text-2xl font-black text-slate-900">
//               Detalles del Egreso
//             </h3>

//             <p className="text-sm text-slate-500">
//               Selecciona el almacén y opcionalmente un producto para cada detalle.
//             </p>

//           </div>

//           <button
//             type="button"
//             onClick={agregarDetalle}
//             title="Agregar detalle"
//             aria-label="Agregar detalle"
//             className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
//           >
//             <Plus className="h-6 w-6" />
//           </button>

//         </div>

//         {detalles.length === 0 ? (

//           <div className="flex h-40 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-slate-500">
//             No hay detalles agregados
//           </div>

//         ) : (

//           <div className="space-y-5">

//             {detalles.map((detalle, index) => {

//               const subtotal =
//                 Number(detalle.cantidad || 0) *
//                 Number(detalle.costoUnitario || 0);

//               const productoSeleccionado =
//                 productos.find(
//                   (producto) =>
//                     producto._id === detalle.idProducto
//                 );

//               const searchProducto =
//                 productoSeleccionado
//                   ? productoSeleccionado.nombre || ""
//                   : "";

//               return (

//                 <div
//                   key={index}
//                   className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
//                 >

//                   <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_130px_140px_150px_50px]">

//                     {/* ALMACEN */}
//                     <div>

//                       <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
//                         Almacén
//                       </label>

//                       <select
//                         value={detalle.idAlmacen}
//                         onChange={(e) =>
//                           actualizarDetalle(
//                             index,
//                             "idAlmacen",
//                             e.target.value
//                           )
//                         }
//                         className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
//                       >
//                         <option value="">
//                           Seleccione almacén
//                         </option>

//                         {almacenes
//                           .filter((almacen) => almacen._id)
//                           .map((almacen) => (
//                             <option
//                               key={almacen._id}
//                               value={almacen._id}
//                             >
//                               {almacen.nombre} - {almacen.tipo}
//                             </option>
//                           ))}
//                       </select>

//                     </div>

//                     {/* PRODUCTO OPCIONAL */}
//                     <div>

//                       <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
//                         Producto opcional
//                       </label>

//                       <div className="relative">

//                         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                         <input
//                           type="text"
//                           placeholder="Buscar producto..."
//                           defaultValue={searchProducto}
//                           onChange={(e) => {

//                             const value =
//                               e.target.value;

//                             if (!value) {
//                               actualizarDetalle(
//                                 index,
//                                 "idProducto",
//                                 null
//                               );
//                             }

//                           }}
//                           className="mb-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pl-10 text-slate-700 outline-none transition focus:border-red-400"
//                         />

//                       </div>

//                       <select
//                         value={detalle.idProducto || ""}
//                         onChange={(e) =>
//                           actualizarDetalle(
//                             index,
//                             "idProducto",
//                             e.target.value || null
//                           )
//                         }
//                         className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
//                       >
//                         <option value="">
//                           Sin producto
//                         </option>

//                         {filtrarProductos(searchProducto)
//                           .filter((producto) => producto._id)
//                           .map((producto) => (
//                             <option
//                               key={producto._id}
//                               value={producto._id}
//                             >
//                               {producto.nombre}
//                               {producto.marca
//                                 ? ` - ${producto.marca}`
//                                 : ""}
//                             </option>
//                           ))}
//                       </select>

//                     </div>

//                     {/* DESCRIPCION */}
//                     <div>

//                       <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
//                         Descripción
//                       </label>

//                       <input
//                         type="text"
//                         value={detalle.descripcion}
//                         onChange={(e) =>
//                           actualizarDetalle(
//                             index,
//                             "descripcion",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Ej: compra de hielo"
//                         className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
//                       />

//                     </div>

//                     {/* TIPO */}
//                     <div>

//                       <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
//                         Tipo
//                       </label>

//                       <select
//                         value={detalle.tipoItem}
//                         onChange={(e) =>
//                           actualizarDetalle(
//                             index,
//                             "tipoItem",
//                             e.target.value
//                           )
//                         }
//                         className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
//                       >
//                         <option value="producto">
//                           Producto
//                         </option>

//                         <option value="servicio">
//                           Servicio
//                         </option>

//                         <option value="otro">
//                           Otro
//                         </option>
//                       </select>

//                     </div>

//                     {/* CANTIDAD */}
//                     <div>

//                       <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
//                         Cantidad
//                       </label>

//                       <input
//                         type="number"
//                         min={0}
//                         value={detalle.cantidad}
//                         onChange={(e) =>
//                           actualizarDetalle(
//                             index,
//                             "cantidad",
//                             Number(e.target.value)
//                           )
//                         }
//                         className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
//                       />

//                     </div>

//                     {/* COSTO */}
//                     <div>

//                       <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
//                         Costo Unit.
//                       </label>

//                       <input
//                         type="number"
//                         min={0}
//                         value={detalle.costoUnitario}
//                         onChange={(e) =>
//                           actualizarDetalle(
//                             index,
//                             "costoUnitario",
//                             Number(e.target.value)
//                           )
//                         }
//                         className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
//                       />

//                       <p className="mt-2 text-sm font-black text-red-500">
//                         Bs. {subtotal.toFixed(2)}
//                       </p>

//                     </div>

//                     {/* ELIMINAR */}
//                     <div className="flex items-end">

//                       <button
//                         type="button"
//                         onClick={() =>
//                           eliminarDetalle(index)
//                         }
//                         title="Eliminar detalle"
//                         aria-label="Eliminar detalle"
//                         className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 transition hover:bg-red-200"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>

//                     </div>

//                   </div>

//                 </div>

//               );

//             })}

//           </div>

//         )}

//       </div>

//       {/* GUARDAR */}
//       <div className="mt-10 flex justify-end">

//         <button
//           type="button"
//           onClick={onSubmit}
//           disabled={isPending}
//           className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-8 py-4 font-black text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
//         >
//           <Save className="h-5 w-5" />

//           {isPending
//             ? "Guardando..."
//             : buttonText}
//         </button>

//       </div>

//     </section>

//   );

// }

// src/components/egreso/EgresoForm.tsx

import {
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

/* =========================
    TYPE DETALLE EGRESO
========================= */

export type DetalleEgresoItem = {
  idDetalle?: string;
  idProducto?: string | null;
  idAlmacen: string;
  descripcion: string;
  cantidad: number;
  costoUnitario: number;
  tipoItem: string;
  esNuevo?: boolean;
};

/* =========================
    OPTIONS
========================= */

type CajaOption = {
  _id: string;
  nombre?: string | null;
  descripcion?: string | null;
};

type AlmacenOption = {
  _id?: string;
  nombre?: string | null;
  tipo?: string | null;
  descripcion?: string | null;
  ubicacion?: string | null;
};

type ProductoOption = {
  _id?: string;
  nombre?: string;
  descripcion?: string | null;
  marca?: string | null;
  estado?: boolean;
};

/* =========================
    PROPS
========================= */

type EgresoFormProps = {
  cajas: CajaOption[];
  almacenes: AlmacenOption[];
  productos: ProductoOption[];

  idCaja: string;
  setIdCaja: (value: string) => void;

  tipoEgreso: string;
  setTipoEgreso: (value: string) => void;

  metodoPago: string;
  setMetodoPago: (value: string) => void;

  observacion: string;
  setObservacion: (value: string) => void;

  detalles: DetalleEgresoItem[];
  setDetalles: Dispatch<
    SetStateAction<DetalleEgresoItem[]>
  >;

  total: number;
  isPending?: boolean;
  buttonText?: string;
  onSubmit: () => void;
};

/* =========================
    COMPONENT
========================= */

export default function EgresoForm({

  cajas,

  almacenes,

  productos,

  idCaja,

  setIdCaja,

  tipoEgreso,

  setTipoEgreso,

  metodoPago,

  setMetodoPago,

  observacion,

  setObservacion,

  detalles,

  setDetalles,

  total,

  isPending = false,

  buttonText = "Guardar egreso",

  onSubmit,

}: EgresoFormProps) {

  /* =========================
      AGREGAR DETALLE
  ========================= */

  const agregarDetalle = () => {

    setDetalles((prev) => [
      ...prev,
      {
        idProducto:
          null,

        idAlmacen:
          "",

        descripcion:
          "",

        cantidad:
          1,

        costoUnitario:
          0,

        tipoItem:
          "otro",

        esNuevo:
          true,
      },
    ]);

  };

  /* =========================
      ELIMINAR DETALLE
  ========================= */

  const eliminarDetalle = (
    index: number
  ) => {

    setDetalles((prev) =>
      prev.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );

  };

  /* =========================
      ACTUALIZAR DETALLE
  ========================= */

  const actualizarDetalle = (
    index: number,
    field: keyof DetalleEgresoItem,
    value: string | number | null
  ) => {

    setDetalles((prev) =>
      prev.map((detalle, itemIndex) =>
        itemIndex === index
          ? {
              ...detalle,
              [field]: value,
            }
          : detalle
      )
    );

  };

  /* =========================
      FILTRAR PRODUCTOS
  ========================= */

  const filtrarProductos = (
    search: string
  ) => {

    const value =
      search.trim().toLowerCase();

    if (!value) {
      return productos;
    }

    return productos.filter((producto) => {

      const texto = `
        ${producto.nombre || ""}
        ${producto.descripcion || ""}
        ${producto.marca || ""}
      `.toLowerCase();

      return texto.includes(
        value
      );

    });

  };

  return (

    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* TITULO */}
      <div className="mb-8">

        <h2 className="text-4xl font-black text-slate-900">
          Datos del Egreso
        </h2>

        <p className="mt-2 text-slate-500">
          Registra la salida de dinero, selecciona la caja, el almacén y opcionalmente un producto.
        </p>

      </div>

      {/* DATOS PRINCIPALES */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* CAJA */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Caja
          </label>

          <select
            value={idCaja}
            onChange={(e) =>
              setIdCaja(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
          >
            <option value="">
              Seleccione una caja
            </option>

            {cajas.map((caja) => (

              <option
                key={caja._id}
                value={caja._id}
              >
                {caja.nombre ||
                  caja.descripcion ||
                  "Caja sin nombre"}
              </option>

            ))}

          </select>

        </div>

        {/* TIPO EGRESO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Tipo de egreso
          </label>

          <select
            value={tipoEgreso}
            onChange={(e) =>
              setTipoEgreso(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
          >
            <option value="compra">
              Compra
            </option>

            <option value="servicio">
              Servicio
            </option>

            <option value="mantenimiento">
              Mantenimiento
            </option>

            <option value="otro">
              Otro
            </option>

          </select>

        </div>

        {/* METODO PAGO */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Método de pago
          </label>

          <select
            value={metodoPago}
            onChange={(e) =>
              setMetodoPago(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
          >
            <option value="efectivo">
              Efectivo
            </option>

            <option value="qr">
              QR
            </option>

            <option value="tarjeta">
              Tarjeta
            </option>

            <option value="transferencia">
              Transferencia
            </option>

            <option value="mixto">
              Mixto
            </option>

          </select>

        </div>

        {/* TOTAL */}
        <div>

          <label className="mb-2 block text-sm font-bold text-slate-600">
            Total calculado
          </label>

          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-2xl font-black text-red-500">
            Bs. {total.toFixed(2)}
          </div>

        </div>

      </div>

      {/* OBSERVACION */}
      <div className="mt-6">

        <label className="mb-2 block text-sm font-bold text-slate-600">
          Observación
        </label>

        <textarea
          value={observacion}
          onChange={(e) =>
            setObservacion(
              e.target.value
            )
          }
          rows={3}
          placeholder="Ej: compra de insumos, pago de servicio, mantenimiento..."
          className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
        />

      </div>

      {/* DETALLES */}
      <div className="mt-10">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-black text-slate-900">
              Detalles del Egreso
            </h3>

            <p className="text-sm text-slate-500">
              Selecciona el almacén y opcionalmente un producto para cada detalle.
            </p>

          </div>

          <button
            type="button"
            onClick={agregarDetalle}
            title="Agregar detalle"
            aria-label="Agregar detalle"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
          >
            <Plus className="h-6 w-6" />
          </button>

        </div>

        {detalles.length === 0 ? (

          <div className="flex h-40 items-center justify-center rounded-3xl border border-dashed border-slate-300 text-slate-500">
            No hay detalles agregados
          </div>

        ) : (

          <div className="space-y-5">

            {detalles.map((detalle, index) => {

              const subtotal =
                Number(detalle.cantidad || 0) *
                Number(detalle.costoUnitario || 0);

              const productoSeleccionado =
                productos.find(
                  (producto) =>
                    producto._id ===
                    detalle.idProducto
                );

              const searchProducto =
                productoSeleccionado
                  ? productoSeleccionado.nombre || ""
                  : "";

              return (

                <div
                  key={
                    detalle.idDetalle ||
                    `detalle-${index}`
                  }
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >

                  <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_130px_140px_150px_50px]">

                    {/* ALMACEN */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Almacén
                      </label>

                      <select
                        value={detalle.idAlmacen}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "idAlmacen",
                            e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
                      >
                        <option value="">
                          Seleccione almacén
                        </option>

                        {almacenes
                          .filter(
                            (almacen) =>
                              almacen._id
                          )
                          .map((almacen) => (

                            <option
                              key={almacen._id}
                              value={almacen._id}
                            >
                              {almacen.nombre ||
                                "Sin nombre"}{" "}
                              -{" "}
                              {almacen.tipo ||
                                "Sin tipo"}
                            </option>

                          ))}

                      </select>

                    </div>

                    {/* PRODUCTO OPCIONAL */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Producto opcional
                      </label>

                      <div className="relative">

                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          placeholder="Buscar producto..."
                          defaultValue={
                            searchProducto
                          }
                          onChange={(e) => {

                            const value =
                              e.target.value;

                            if (!value) {

                              actualizarDetalle(
                                index,
                                "idProducto",
                                null
                              );

                            }

                          }}
                          className="mb-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pl-10 text-slate-700 outline-none transition focus:border-red-400"
                        />

                      </div>

                      <select
                        value={
                          detalle.idProducto ||
                          ""
                        }
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "idProducto",
                            e.target.value ||
                              null
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
                      >
                        <option value="">
                          Sin producto
                        </option>

                        {filtrarProductos(
                          searchProducto
                        )
                          .filter(
                            (producto) =>
                              producto._id
                          )
                          .map((producto) => (

                            <option
                              key={producto._id}
                              value={producto._id}
                            >
                              {producto.nombre}
                              {producto.marca
                                ? ` - ${producto.marca}`
                                : ""}
                            </option>

                          ))}

                      </select>

                    </div>

                    {/* DESCRIPCION */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Descripción
                      </label>

                      <input
                        type="text"
                        value={
                          detalle.descripcion
                        }
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "descripcion",
                            e.target.value
                          )
                        }
                        placeholder="Ej: compra de hielo"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
                      />

                    </div>

                    {/* TIPO ITEM */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Tipo
                      </label>

                      <select
                        value={detalle.tipoItem}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "tipoItem",
                            e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
                      >
                        <option value="producto">
                          Producto
                        </option>

                        <option value="servicio">
                          Servicio
                        </option>

                        <option value="otro">
                          Otro
                        </option>

                      </select>

                    </div>

                    {/* CANTIDAD */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Cantidad
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={detalle.cantidad}
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "cantidad",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
                      />

                    </div>

                    {/* COSTO UNITARIO */}
                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                        Costo Unit.
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={
                          detalle.costoUnitario
                        }
                        onChange={(e) =>
                          actualizarDetalle(
                            index,
                            "costoUnitario",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-red-400"
                      />

                      <p className="mt-2 text-sm font-black text-red-500">
                        Bs. {subtotal.toFixed(2)}
                      </p>

                    </div>

                    {/* ELIMINAR */}
                    <div className="flex items-end">

                      <button
                        type="button"
                        onClick={() =>
                          eliminarDetalle(index)
                        }
                        title="Eliminar detalle"
                        aria-label="Eliminar detalle"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 transition hover:bg-red-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

      {/* GUARDAR */}
      <div className="mt-10 flex justify-end">

        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-8 py-4 font-black text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Save className="h-5 w-5" />

          {isPending
            ? "Guardando..."
            : buttonText}
        </button>

      </div>

    </section>

  );

}